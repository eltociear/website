// src/routes/resources/whitepapers/omega-proof/+page.js

import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const prerender = false;

// Metadata for the paper
const metadata = {
  title: 'The Omega Proof',
  subtitle: 'An Empirical Demonstration of the Nation-State System\'s Terminal Incompatibility with Planetary Peace',
  description: 'A rigorous test of whether planetary-scale peace is achievable within current system constraints. Result: Peace is architecturally impossible under Westphalian rules.',
  date: 'December 2025',
  authors: 'Björn Kenneth Holmström (with AI collaboration: Gemini, DeepSeek, Grok, Claude)',
  readingTime: '~60 minutes (full paper)',
  slug: 'omega-proof'
};

// Try to load markdown file with fallback to English
async function loadMarkdownWithFallback(sectionId, currentLocale) {
  try {
    // Try requested locale first
    const module = await import(`$lib/content/papers/${currentLocale}/omega-proof/${sectionId}.md`);
    return {
      content: module.default,
      meta: module.metadata,
      locale: currentLocale,
      fellbackToEnglish: false
    };
  } catch (e) {
    // If not Swedish or already tried English, throw
    if (currentLocale !== 'sv') {
      throw e;
    }
    
    // Fallback to English for Swedish requests
    try {
      console.log(`Swedish version of ${sectionId} not found, falling back to English`);
      const englishModule = await import(`$lib/content/papers/en/omega-proof/${sectionId}.md`);
      return {
        content: englishModule.default,
        meta: englishModule.metadata,
        locale: 'en',
        fellbackToEnglish: true
      };
    } catch (englishError) {
      throw new Error(`Section ${sectionId} not found in either ${currentLocale} or English`);
    }
  }
}

export async function load({ params, depends, url }) {
  depends('app:locale');
  
  // Get current locale with better fallback handling
  let currentLocale = 'en';
  
  try {
    if (url?.searchParams?.has('lang')) {
      currentLocale = url.searchParams.get('lang');
    } else if (browser) {
      currentLocale = get(locale) || 'en';
    }
  } catch (e) {
    console.warn('Error accessing URL searchParams:', e);
    if (browser) {
      currentLocale = get(locale) || 'en';
    }
  }
  
  // Validate locale
  const validLocales = ['en', 'sv'];
  if (!validLocales.includes(currentLocale)) {
    currentLocale = 'en';
  }

  console.log('Loading Omega Proof with locale:', currentLocale);

  try {
    // Create the current URL
    let currentUrl;
    try {
      currentUrl = browser ? window.location.href : `${url.origin}${url.pathname}${url.search}`;
    } catch (urlError) {
      console.warn('Error constructing current URL:', urlError);
      currentUrl = `https://www.globalgovernanceframeworks.org/resources/whitepapers/omega-proof`;
    }

    // Load executive summary separately (it's not a numbered section)
    const executiveSummary = await loadMarkdownWithFallback('00-executive-summary', currentLocale);
    
    // Check if any sections fell back to English
    const usedFallback = executiveSummary.fellbackToEnglish;

    return {
      paper: {
        meta: metadata,
        slug: 'omega-proof',
        locale: currentLocale,
        executiveSummary,
        usedFallback // Flag to show language notice if needed
      },
      currentUrl: currentUrl,
      currentLocale: currentLocale
    };
  } catch (e) {
    console.error('Error loading Omega Proof:', e);
    
    throw error(404, {
      message: `Omega Proof content not available`,
      details: {
        locale: currentLocale,
        originalError: e.message
      }
    });
  }
}
