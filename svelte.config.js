// svelte.config.js - Fixed without vite configuration
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// When using a custom domain, we don't need a base path
const dev = process.env.NODE_ENV === 'development';
const base = '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
    })
  ],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false
    }),
    paths: {
      base: base
    },
    prerender: {
      entries: [
        '*', 
        '/blog',
        // Prerender blog posts for both languages
        '/blog?lang=en',
        '/blog?lang=sv',
        '/rss.xml' 
      ],
      handleMissingId: 'ignore',
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore missing assets during prerendering
        if (path.includes('.png') || 
            path.includes('.svg') || 
            path.includes('manifest.json') || 
            path.includes('/icons/')) {
          console.warn(`Warning: Missing asset during prerendering: ${path}`);
          return;
        }

        // Handle module loading errors during prerendering
        if (message && (message.includes('Not found: /src/lib/data/') || 
                       message.includes('compassData.js') ||
                       message.includes('precomputedFrameworkDatabase.js'))) {
          console.warn(`Warning: Data module not found during prerendering: ${path} - ${message}`);
          return;
        }

        if (path.includes('/frameworks/meta-governance/') && 
            path !== '/frameworks/meta-governance' &&
            !path.includes('?')) {
          console.warn(`Skipping prerender of hash-based URL: ${path}`);
          return;
        }
        
        // Ignore RSS feed and sitemap requests during prerendering
        if (path.includes('rss.xml') || 
            path.includes('sitemap.xml') || 
            path.includes('robots.txt') ||
            path.includes('feed.xml')) {
          console.warn(`Warning: RSS/Sitemap file not found during prerendering: ${path}`);
          return;
        }
        
        // For other errors, just warn instead of throwing
        if (message && message.includes('navigator is not defined')) {
          console.warn(`Warning: Navigator not defined error for path: ${path}`);
          return;
        }
        
        // Handle URL searchParams errors during prerendering
        if (message && message.includes('Cannot access url.searchParams')) {
          console.warn(`Warning: URL searchParams error during prerendering for path: ${path}`);
          return;
        }

        // Handle specific blog page searchParams error
        if (message && message.includes('Cannot access url.searchParams on a page with prerendering enabled')) {
          console.warn(`Warning: searchParams access blocked during prerendering for path: ${path}`);
          return;
        }

        // Handle 404 errors for missing routes during prerendering
        if (message && message.includes('Not found:') && message.includes('404')) {
          console.warn(`Warning: 404 error during prerendering for path: ${path} - ${message}`);
          return;
        }

        // Handle top-level await errors
        if (message && message.includes('Top-level await')) {
          console.warn(`Warning: Top-level await error during prerendering for path: ${path} - ${message}`);
          return;
        }
        
        throw new Error(message);
      }
    }
  }
};

export default config;
