// src/routes/resources/whitepapers/[slug]/+page.js

import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const prerender = false;

export async function load({ params, depends, url }) {
  depends('app:locale');
  
  // Get current locale with better fallback handling
  let currentLocale = 'en';
  
  try {
    // Handle search params more safely
    if (url?.searchParams?.has('lang')) {
      currentLocale = url.searchParams.get('lang');
    } else if (browser) {
      currentLocale = get(locale) || 'en';
    }
  } catch (e) {
    console.warn('Error accessing URL searchParams:', e);
    // Fallback to default or store value
    if (browser) {
      currentLocale = get(locale) || 'en';
    }
  }
  
  // Validate locale
  const validLocales = ['en', 'sv'];
  if (!validLocales.includes(currentLocale)) {
    currentLocale = 'en';
  }

  console.log('Loading whitepaper with locale:', currentLocale, 'slug:', params.slug);

  try {
    // Dynamic import with better error context
    const paperModule = await import(`../../../../lib/content/papers/${currentLocale}/${params.slug}.md`);
    
    if (!paperModule?.metadata) {
      throw new Error('Paper metadata is missing');
    }

    // Create the current URL more safely
    let currentUrl;
    try {
      currentUrl = browser ? window.location.href : `${url.origin}${url.pathname}${url.search}`;
    } catch (urlError) {
      console.warn('Error constructing current URL:', urlError);
      currentUrl = `https://www.globalgovernanceframeworks.org/resources/whitepapers/${params.slug}`;
    }

    return {
      paper: {
        meta: paperModule.metadata,
        slug: params.slug,
        locale: currentLocale
      },
      currentUrl: currentUrl,
      currentLocale: currentLocale
    };
  } catch (e) {
    console.error('Error loading whitepaper:', e);
    console.error('Attempted path:', `../../../../lib/content/papers/${currentLocale}/${params.slug}.md`);
    
    // Better error message for debugging
    const errorMessage = `White paper "${params.slug}" not found or not available in ${currentLocale}`;
    throw error(404, {
      message: errorMessage,
      details: {
        slug: params.slug,
        locale: currentLocale,
        originalError: e.message
      }
    });
  }
}
