// src/hooks.server.js - Add proper cache headers

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Resolve the request
  const response = await resolve(event);
  
  // Add cache control headers for HTML pages to prevent caching issues
  if (response.headers.get('content-type')?.includes('text/html')) {
    // Prevent caching of HTML pages to avoid infinite loops from stale cached content
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  // For static assets, allow caching but with proper headers
  if (event.url.pathname.startsWith('/static/') || 
      event.url.pathname.includes('.js') || 
      event.url.pathname.includes('.css')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}
