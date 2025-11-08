// svelte.config.js - Fixed without vite configuration
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// When using a custom domain, we don't need a base path
const dev = process.env.NODE_ENV === 'development';
const base = '';

const blogIndex = require('./src/lib/data/blog-index.json');
const papersIndex = require('./src/lib/data/papers-index.json');
const frameworkIndex = require('./src/lib/data/framework-index.json');

const blogEntries = blogIndex.map(
  post => `/blog/${post.slug}?lang=${post.lang}`
);
const paperEntries = papersIndex.map(
  paper => `/resources/whitepapers/${paper.slug}?lang=${paper.lang}`
);

const frameworkEntries = frameworkIndex.flatMap(slug => [
  `/frameworks/${slug}?lang=en`,
  `/frameworks/${slug}?lang=sv`
]);

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
        // --- Main Static Pages ---
        '/',
        '/?lang=en',
        '/?lang=sv',
        '/about?lang=en',
        '/about?lang=sv',
        '/blog',
        '/blog?lang=en',
        '/blog?lang=sv',
        '/contact?lang=en',
        '/contact?lang=sv',
        '/downloads?lang=en',
        '/downloads?lang=sv',
        '/find-your-place?lang=en',
        '/find-your-place?lang=sv',
        '/my-path?lang=en',
        '/my-path?lang=sv',
        '/overview?lang=en',
        '/overview?lang=sv',
        '/privacy?lang=en',
        '/privacy?lang=sv',
        '/quiz?lang=en',
        '/quiz?lang=sv',
        '/start-treaty?lang=en',
        '/start-treaty?lang=sv',
        '/terms?lang=en',
        '/terms?lang=sv',
        '/youth?lang=en',
        '/youth?lang=sv',

        // --- Framework Index Pages ---
        '/frameworks?lang=en',
        '/frameworks?lang=sv',
        '/frameworks/ai-futures?lang=en',
        '/frameworks/ai-futures?lang=sv',
        '/frameworks/hubs?lang=en',
        '/frameworks/hubs?lang=sv',
        '/frameworks/implementation-and-adaptation?lang=en',
        '/frameworks/implementation-and-adaptation?lang=sv',
        '/frameworks/implementation-methods-and-tools?lang=en',
        '/frameworks/implementation-methods-and-tools?lang=sv',

        // --- Framework Docs ---
        '/frameworks/docs?lang=en',
        '/frameworks/docs?lang=sv',
        '/frameworks/docs/case-studies?lang=en',
        '/frameworks/docs/case-studies?lang=sv',
        '/frameworks/docs/glossary?lang=en',
        '/frameworks/docs/glossary?lang=sv',
        '/frameworks/docs/implementation?lang=en',
        '/frameworks/docs/implementation?lang=sv',
        '/frameworks/docs/principles?lang=en',
        '/frameworks/docs/principles?lang=sv',
        '/frameworks/docs/resources?lang=en',
        '/frameworks/docs/resources?lang=sv',

        // --- Framework Guides ---
        '/frameworks/guides?lang=en',
        '/frameworks/guides?lang=sv',
        '/frameworks/guides/great-transition?lang=en',
        '/frameworks/guides/great-transition?lang=sv',
        '/frameworks/guides/regenerative-resources?lang=en',
        '/frameworks/guides/regenerative-resources?lang=sv',
        // Bioregional Compass (has many sub-pages)
        '/frameworks/guides/bioregional-compass/the-guide?lang=en',
        '/frameworks/guides/bioregional-compass/the-guide?lang=sv',
        '/frameworks/guides/bioregional-compass/library?lang=en',
        '/frameworks/guides/bioregional-compass/library?lang=sv',
        '/frameworks/guides/bioregional-compass/playbooks?lang=en',
        '/frameworks/guides/bioregional-compass/playbooks?lang=sv',
        // (You may need to add more sub-pages from guides if they exist)

        // --- Framework Tools & Visuals (Category Indexes) ---
        '/frameworks/tools?lang=en',
        '/frameworks/tools?lang=sv',
        '/frameworks/visuals?lang=en',
        '/frameworks/visuals?lang=sv',
        // (Add sub-pages for each tool/visual category index)
        '/frameworks/tools/aging-population-support-governance?lang=en',
        '/frameworks/tools/aging-population-support-governance?lang=sv',
        // ... (etc. for all tool categories) ...
        '/frameworks/visuals/digital-commons?lang=en',
        '/frameworks/visuals/digital-commons?lang=sv',
        // ... (etc. for all visual categories) ...

        // --- Get Involved Pages ---
        '/get-involved?lang=en',
        '/get-involved?lang=sv',
        '/get-involved/founding?lang=en',
        '/get-involved/founding?lang=sv',
        '/get-involved/frameworks?lang=en',
        '/get-involved/frameworks?lang=sv',
        '/get-involved/onboarding?lang=en',
        '/get-involved/onboarding?lang=sv',
        '/get-involved/outreach?lang=en',
        '/get-involved/outreach?lang=sv',
        '/get-involved/translations?lang=en',
        '/get-involved/translations?lang=sv',
        '/get-involved/website?lang=en',
        '/get-involved/website?lang=sv',

        // --- Resource Index Pages ---
        '/resources?lang=en',
        '/resources?lang=sv',
        '/resources/books?lang=en',
        '/resources/books?lang=sv',
        '/resources/cultural-translation-protocol?lang=en',
        '/resources/cultural-translation-protocol?lang=sv',
        '/resources/paradox-canvas?lang=en',
        '/resources/paradox-canvas?lang=sv',
        '/resources/protocols?lang=en',
        '/resources/protocols?lang=sv',
        '/resources/tools?lang=en',
        '/resources/tools?lang=sv',

        '/rss.xml',
        ...blogEntries,
        ...paperEntries,
        ...frameworkEntries
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
