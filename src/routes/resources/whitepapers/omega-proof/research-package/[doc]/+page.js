// src/routes/resources/whitepapers/omega-proof/research-package/[[doc]]/+page.js

import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const prerender = false;

// Phase organization
const phases = [
  {
    number: 1,
    title: 'Initial Concept Development',
    description: 'From idealistic vision to pragmatic realpolitik framework',
    docs: [
      { number: 0, title: 'Initial Memorandum', author: 'Gemini', filename: '00-gemini-initial-memorandum' },
      { number: 1, title: 'Realpolitik Rewrite', author: 'Grok', filename: '01-grok-rewritten-confidential-working-paper' },
      { number: 2, title: 'Strategic Critique', author: 'DeepSeek', filename: '02-deepseek-propositions' },
      { number: 3, title: 'Revised Framework', author: 'Grok', filename: '03-grok-confidential-working-paper' }
    ]
  },
  {
    number: 2,
    title: 'First Red Team Challenge',
    description: 'Steel-manning the opposition—designing the attack',
    docs: [
      { number: 4, title: 'Red Team Prompt Design', author: 'Gemini', filename: '04-gemini-steel-man-prompt' },
      { number: 5, title: 'First Kill Memos', author: 'Grok', filename: '05-grok-steel-manning' },
      { number: 6, title: 'Architectural Response', author: 'Gemini', filename: '06-gemini-response-to-steel-manning' }
    ]
  },
  {
    number: 3,
    title: 'Protocol Omega Development',
    description: 'Building the mechanically perfect peace machine',
    docs: [
      { number: 7, title: 'Protocol Omega Draft', author: 'Grok', filename: '07-grok-reworked-document' },
      { number: 8, title: 'Vulnerability Analysis', author: 'DeepSeek', filename: '08-deepseek-propositions' },
      { number: 9, title: 'Turnkey Version', author: 'Grok', filename: '09-grok-turnkey-document' },
      { number: 10, title: 'Final Bulletproofing', author: 'DeepSeek', filename: '10-deepseek-final-suggestions' }
    ]
  },
  {
    number: 4,
    title: 'Final Protocol and Red Team',
    description: 'Bulletproof edition and unanimous rejection',
    docs: [
      { number: 11, title: 'Bulletproof Edition', author: 'Grok', filename: '11-grok-bulletproof-edition' },
      { number: 12, title: 'Final Red Team Prompt', author: 'Gemini', filename: '12-gemini-steel-man-prompt' },
      { number: 13, title: 'Unanimous Rejections', author: 'Grok', filename: '13-grok-steel-manning' }
    ]
  }
];

// Flatten all docs for easy lookup
const allDocs = phases.flatMap(phase => 
  phase.docs.map(doc => ({
    ...doc,
    date: 'December 4, 2025',
    phase: phase.number
  }))
);

async function loadDocument(filename, currentLocale) {
  try {
    // Research package is English-only for now
    const module = await import(`$lib/content/papers/en/omega-proof/research-package/${filename}.md`);
    return {
      component: module.default, // CHANGED: 'content' -> 'component'
      meta: module.metadata
    };
  } catch (e) {
    console.error(`Failed to load research document ${filename}:`, e);
    throw new Error(`Document ${filename} not found`);
  }
}

export async function load({ params, depends, url }) {
  depends('app:locale');
  
  // Get current locale
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

  // If no doc parameter, return overview page data
  if (!params.doc) {
    return {
      phases,
      allDocs,
      currentDoc: null,
      currentLocale
    };
  }

  // Load specific document
  try {
    const docNumber = parseInt(params.doc);
    const docInfo = allDocs.find(d => d.number === docNumber);
    
    if (!docInfo) {
      throw error(404, {
        message: `Document ${params.doc} not found`,
        details: {
          requestedDoc: params.doc
        }
      });
    }

    const docData = await loadDocument(docInfo.filename, currentLocale);
    
    return {
      phases,
      allDocs,
      currentDoc: {
        ...docInfo,
        ...docData,
        description: docData.meta?.description || null
      },
      currentLocale
    };
  } catch (e) {
    console.error('Error loading research document:', e);
    
    throw error(404, {
      message: `Research document not available`,
      details: {
        doc: params.doc,
        originalError: e.message
      }
    });
  }
}
