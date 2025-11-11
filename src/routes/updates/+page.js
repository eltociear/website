// src/routes/updates/+page.js
import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

import allPosts from '$lib/data/blog-index.json';

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

  console.log('Updates page loading with locale:', currentLocale);

  const updates = allPosts
    .filter(post => {
      if (!post.meta || !post.meta.date) {
        console.warn(`Post ${post.slug} (${post.lang}) missing metadata or date, skipping`);
        return false;
      }
      // Filter for updates category and current language
      return post.lang === currentLocale && post.meta.category === 'update';
    })
    .sort((a, b) => {
      const dateA = new Date(a.meta.date || 0);
      const dateB = new Date(b.meta.date || 0);
      return dateB - dateA; // Sort newest first
    });

  console.log('Filtered updates:', updates);

  return {
    posts: updates,
    currentLocale: currentLocale
  };
}
