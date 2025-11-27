$listener = New-Object System.Net.HttpListener
$prefix = 'http://localhost:8001/'
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
    Write-Output "HTTP listener started on $prefix"
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $path = $req.Url.AbsolutePath.TrimStart('/')
    if ($path -eq '__log__') {
        $query = $req.Url.Query
        $message = ''
        if ($query) {
            $trimmed = $query.TrimStart('?')
            foreach ($pair in $trimmed.Split('&')) {
                if ([string]::IsNullOrWhiteSpace($pair)) { continue }
                $kv = $pair.Split('=', 2)
                if ($kv.Length -eq 0) { continue }
                if ($kv[0] -eq 'msg') {
                    if ($kv.Length -gt 1) {
                        $message = [System.Uri]::UnescapeDataString($kv[1])
                    }
                    break
                }
            }
        }
        if (![string]::IsNullOrWhiteSpace($message)) {
            $timestamp = [DateTime]::UtcNow.ToString('o')
            $entry = "[$timestamp] $message`n"
            $logPath = Join-Path (Get-Location) 'client.log'
            [System.IO.File]::AppendAllText($logPath, $entry)
        }
        $resp = $context.Response
        $resp.StatusCode = 204
        $resp.OutputStream.Close()
        continue
    }
        if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }
        $file = Join-Path (Get-Location) $path
        if (Test-Path $file) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $resp = $context.Response
                $resp.StatusCode = 200
                $resp.ContentType = switch ([System.IO.Path]::GetExtension($file).ToLower()) {
                    '.html' { 'text/html' }
                    '.htm'  { 'text/html' }
                    '.js'   { 'application/javascript' }
                    '.jsx'  { 'text/babel' }
                    '.css'  { 'text/css' }
                    '.json' { 'application/json' }
                    '.png'  { 'image/png' }
                    '.jpg'  { 'image/jpeg' }
                    '.jpeg' { 'image/jpeg' }
                    '.svg'  { 'image/svg+xml' }
                    default { 'application/octet-stream' }
                }
                $resp.ContentLength64 = $bytes.Length
                $resp.OutputStream.Write($bytes, 0, $bytes.Length)
                $resp.OutputStream.Close()
            } catch {
                $context.Response.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes('500 Internal Server Error')
                $context.Response.ContentLength64 = $msg.Length
                $context.Response.OutputStream.Write($msg,0,$msg.Length)
                $context.Response.OutputStream.Close()
            }
        } else {
            $context.Response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $context.Response.ContentLength64 = $msg.Length
            $context.Response.OutputStream.Write($msg,0,$msg.Length)
            $context.Response.OutputStream.Close()
        }
    }
} catch {
    Write-Output "Server stopped: $_"
} finally {
    if ($listener -and $listener.IsListening) { $listener.Stop(); $listener.Close() }
}
