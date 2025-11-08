// src/routes/resources/whitepapers/+page.js

import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

// This replaces the slow import.meta.glob
import allPapers from '$lib/data/papers-index.json';

export const prerender = false;

export async function load({ depends, url }) {
  depends('app:locale');
  
  // Get current locale - handle prerendering safely
  let currentLocale = 'en';
  
  if (url && url.searchParams) {
    try {
      if (url.searchParams.has('lang')) {
        currentLocale = url.searchParams.get('lang');
      } else if (browser) {
        currentLocale = get(locale) || 'en';
      }
    } catch (e) {
      if (browser) {
        currentLocale = get(locale) || 'en';
      }
    }
  } else if (browser) {
    currentLocale = get(locale) || 'en';
  }

  console.log('Whitepapers page loading with locale:', currentLocale);

  const papers = allPapers
    .filter(paper => {
      // Filter out papers without valid metadata or date
      if (!paper.meta || !paper.meta.date) {
        console.warn(`Paper ${paper.slug} (${paper.lang}) missing metadata or date, skipping`);
        return false;
      }
      
      const matches = paper.lang === currentLocale;
      return matches;
    })
    .sort((a, b) => {
      // Additional safety check for sorting
      const dateA = a.meta?.date ? new Date(a.meta.date) : new Date(0);
      const dateB = b.meta?.date ? new Date(b.meta.date) : new Date(0);
      
      return dateB - dateA; // Sort newest first
    });

  console.log('Filtered papers:', papers.length);

  return {
    papers: papers,
    currentLocale: currentLocale
  };
}
