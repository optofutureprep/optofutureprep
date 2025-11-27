  const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;
const REMOTE_EXAM_BUTTON_ENDPOINT = 'https://supras.com/api/exam-button-config';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.jsx': 'text/babel',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function proxyRemoteExamButtonConfig(res) {
  try {
    const targetUrl = new URL(REMOTE_EXAM_BUTTON_ENDPOINT);
    const options = {
      hostname: targetUrl.hostname,
      path: `${targetUrl.pathname}${targetUrl.search}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';

      proxyRes.on('data', (chunk) => {
        data += chunk;
      });

      proxyRes.on('end', () => {
        if (proxyRes.statusCode && proxyRes.statusCode >= 200 && proxyRes.statusCode < 300) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          });
          res.end(data);
        } else {
          console.error(`Failed to fetch SUPRAS config: ${proxyRes.statusCode}`);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to fetch SUPRAS config' }));
        }
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Error fetching SUPRAS config:', err);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to reach SUPRAS' }));
    });

    proxyReq.end();
  } catch (error) {
    console.error('Unexpected proxy error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error' }));
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split('?')[0] : '/';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // Handle logging endpoint
  if (urlPath === '/__log__') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (body) {
        const params = new URLSearchParams(body);
        const message = params.get('msg');
        if (message) {
          const timestamp = new Date().toISOString();
          const logPath = path.join(__dirname, '..', 'client.log');
          fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
        }
      }
      res.writeHead(204);
      res.end();
    });
    return;
  }

  if (urlPath === '/api/exam-button-config' || urlPath.startsWith('/api/exam-button-config/')) {
    console.log('Proxying SUPRAS button config request:', req.url);
    proxyRemoteExamButtonConfig(res);
    return;
  }

  // Handle root path and hash fragments
  let filePath = urlPath === '/' || urlPath === '/#' ? 'index.html' : urlPath.split('#')[0];
  filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  
  // Decode URL
  try {
    filePath = decodeURIComponent(filePath);
  } catch (err) {
    console.error('Failed to decode URL path:', req.url, err);
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h1>400 Bad Request</h1><p>Invalid URL encoding.</p>');
    return;
  }
  
  // Handle empty path
  if (!filePath) {
    filePath = 'index.html';
  }

  // Security: Prevent path traversal attacks
  if (filePath.includes('..') || path.isAbsolute(filePath)) {
    console.error(`403: Path traversal attempt blocked: ${filePath}`);
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1><p>Path traversal not allowed.</p>');
    return;
  }

  // Resolve full path
  const rootDir = path.join(__dirname, '..');
  const fullPath = path.join(rootDir, filePath);
  
  // Security: Ensure the resolved path is within the root directory
  const resolvedPath = path.resolve(fullPath);
  const resolvedRoot = path.resolve(rootDir);
  if (!resolvedPath.startsWith(resolvedRoot)) {
    console.error(`403: Path outside root directory: ${filePath}`);
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1><p>Access denied.</p>');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error(`404: File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>File: ${filePath}</p>`);
      } else {
        console.error(`500: Error reading file ${filePath}:`, err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 Internal Server Error</h1><p>Error: ${err.message}</p>`);
      }
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Add CORS headers for local development
    const headers = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Server also accessible at http://127.0.0.1:${PORT}/`);
  console.log(`Open http://localhost:${PORT}/# in your browser`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other server or use a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

