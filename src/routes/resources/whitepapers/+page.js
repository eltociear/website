// src/routes/resources/whitepapers/+page.js

import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const prerender = false;

export async function load({ depends, url }) {
  depends('app:locale');
  
  // Get current locale - handle prerendering safely
  let currentLocale = 'en';
  
  // Only access searchParams if not prerendering
  if (url && url.searchParams) {
    try {
      if (url.searchParams.has('lang')) {
        currentLocale = url.searchParams.get('lang');
      } else if (browser) {
        currentLocale = get(locale) || 'en';
      }
    } catch (e) {
      // During prerendering, searchParams might not be available
      // Fall back to default locale or store value
      if (browser) {
        currentLocale = get(locale) || 'en';
      }
    }
  } else if (browser) {
    currentLocale = get(locale) || 'en';
  }

  console.log('Whitepapers page loading with locale:', currentLocale);

  // Dynamic import of all papers (this runs on both server and client)
  const rawPapers = import.meta.glob('/src/lib/content/papers/**/*.md', { eager: true });
  
  console.log('Total raw papers found:', Object.keys(rawPapers).length);
  console.log('Raw paper paths:', Object.keys(rawPapers));

  const papers = Object.entries(rawPapers)
    .map(([path, paper]) => {
      const parts = path.split('/');
      const filename = parts.pop();
      const langDir = parts.pop();

      const slug = filename.replace('.md', '');

      console.log(`Processing paper: ${path}`);
      console.log(`  - Filename: ${filename}`);
      console.log(`  - Language: ${langDir}`);
      console.log(`  - Slug: ${slug}`);
      console.log(`  - Has metadata:`, !!paper.metadata);
      if (paper.metadata) {
        console.log(`  - Title: ${paper.metadata.title}`);
        console.log(`  - Date: ${paper.metadata.date}`);
        console.log(`  - Status: ${paper.metadata.status}`);
      } else {
        console.log(`  - Metadata is undefined or null`);
      }

      return {
        meta: paper.metadata || {},
        slug: slug,
        lang: langDir,
        path: path
      };
    })
    .filter(paper => {
      // Filter out papers without valid metadata or date
      if (!paper.meta || !paper.meta.date) {
        console.warn(`Paper ${paper.slug} (${paper.lang}) missing metadata or date, skipping`);
        return false;
      }
      
      const matches = paper.lang === currentLocale;
      console.log(`Paper ${paper.slug} (${paper.lang}) matches locale ${currentLocale}:`, matches);
      return matches;
    })
    .sort((a, b) => {
      // Additional safety check for sorting
      const dateA = a.meta?.date ? new Date(a.meta.date) : new Date(0);
      const dateB = b.meta?.date ? new Date(b.meta.date) : new Date(0);
      
      return dateB - dateA; // Sort newest first
    });

  console.log('Filtered papers:', papers);

  return {
    papers: papers,
    currentLocale: currentLocale
  };
}
