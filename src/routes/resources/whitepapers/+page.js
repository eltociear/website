// src/routes/resources/whitepapers/+page.js

import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

// This replaces the slow import.meta.glob
import allPapers from '$lib/data/papers-index.json';

// Special case for Omega Proof flagship paper
const omegaProofEn = {
  slug: 'omega-proof',
  lang: 'en',
  meta: {
    title: 'The Omega Proof',
    subtitle: "An Empirical Demonstration of the Nation-State System's Terminal Incompatibility with Planetary Peace",
    description: 'A rigorous test of whether planetary-scale peace is achievable within current system constraints. Result: Peace is architecturally impossible under Westphalian rules.',
    date: '2026-01-04',
    authors: 'Björn Kenneth Holmström (with AI collaboration: Gemini, DeepSeek, Grok, Claude)',
    readingTime: '~60 minutes (full paper)',
    featured: true
  }
};

const omegaProofSv = {
  slug: 'omega-proof',
  lang: 'sv',
  meta: {
    title: 'Omegabeviset',
    subtitle: "En empirisk demonstration av nationalstatssystemets fundamentala inkompatibilitet med planetär fred",
    description: 'Ett rigoröst test av huruvida planetär fred är möjlig inom nuvarande systemets begränsningar. Resultat: Fred är arkitektoniskt omöjlig under westfaliska regler.',
    date: '2026-01-04',
    authors: 'Björn Kenneth Holmström (med AI-samarbete: Gemini, DeepSeek, Grok, Claude)',
    readingTime: '~60 minuter (fullständig artikel)',
    featured: true
  }
};

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

  // Get regular papers from index
  let papers = allPapers
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

  // Add Omega Proof at the top based on current locale
  if (currentLocale === 'en') {
    papers = [omegaProofEn, ...papers];
  } else if (currentLocale === 'sv') {
    papers = [omegaProofSv, ...papers];
  }

  console.log('Filtered papers (including omega-proof):', papers.length);

  return {
    papers: papers,
    currentLocale: currentLocale
  };
}
