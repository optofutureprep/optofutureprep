const https = require('https');
const { URL } = require('url');

const REMOTE_EXAM_BUTTON_ENDPOINT = 'https://supras.com/api/exam-button-config';

// Static SUPRAS config captured from a working environment so every
// button uses the exact artwork provided by SUPRAS.
const BUTTON_IMAGES = {
  previous: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Prevoius.png',
  next: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Next.png',
  mark: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Mark.png',
  review: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review.png',
  exhibit: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Exhibit.png',
  end: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/End.png',
  highlight: 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Highlight%20button%20.png',
  'review-marked': 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20marked.png',
  'review-all': 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20all.png',
  'review-incomplete': 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Review%20incomplete.png',
  'mark-active': 'https://yiapmshrkfqyypmdukrf.supabase.co/storage/v1/object/public/exam-button-assets/Marked%20active%20.png'
};

const createButtonTheme = (key) => {
  const image = BUTTON_IMAGES[key] || null;
  return {
    image,
    useCustom: Boolean(image),
    useImage: true,
    hidden: false,
  };
};

const STATIC_BUTTON_CONFIG = {
  // Test footer buttons
  previous: createButtonTheme('previous'),
  next: createButtonTheme('next'),
  mark: createButtonTheme('mark'),
  review: createButtonTheme('review'),
  exhibit: createButtonTheme('exhibit'),
  // Review footer buttons
  end: createButtonTheme('end'),
  highlight: createButtonTheme('highlight'),
  'review-marked': createButtonTheme('review-marked'),
  'review-all': createButtonTheme('review-all'),
  'review-incomplete': createButtonTheme('review-incomplete'),
  'mark-active': {
    image: BUTTON_IMAGES['mark-active'],
    useCustom: Boolean(BUTTON_IMAGES['mark-active']),
    useImage: true,
    hidden: false,
  },
};

exports.handler = async function handler(event, context) {
  // Always return the static SUPRAS-style config. This makes the
  // frontend independent of the remote SUPRAS API and guarantees
  // that all buttons (test + review + highlight) use the same
  // SUPRAS skin consistently in production.
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(STATIC_BUTTON_CONFIG),
  };
};
