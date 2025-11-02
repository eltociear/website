// src/routes/frameworks/guides/bioregional-compass/library/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Bioregional Compass Library +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load translations for library page
  try {
    const cleanPath = '/frameworks/guides/bioregional-compass/library';
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loading translations for path:', cleanPath);
    
    // Load both main guide and library-specific translations
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass');
    
    // Load library-specific translations
    try {
      const libraryModule = await import(`$lib/i18n/${currentLocale}/guidesBioregionalCompassLibrary.json`);
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded library translations for:', currentLocale);
    } catch (libraryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not load library translations for locale:', currentLocale, 'Error:', libraryError.message);
      // Try English fallback
      try {
        const fallbackModule = await import(`$lib/i18n/en/guidesBioregionalCompassLibrary.json`);
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded library translations from English fallback');
      } catch (fallbackError) {
        console.error('Could not load library translations in any language:', fallbackError);
      }
    }
    
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the library sections in logical order
  const librarySections = [
    // Start with assessment and planning
    {
      id: 'assessment-and-support-spokes',
      category: 'foundation',
      priority: 1,
      icon: '📋',
      subsectionCount: 3
    },
    
    // Six pillars in order
    {
      id: 'pillar-0-spokes',
      category: 'pillars',
      priority: 2,
      icon: '🧘',
      subsectionCount: 3
    },
    {
      id: 'pillar-1-spokes',
      category: 'pillars',
      priority: 3,
      icon: '✨',
      subsectionCount: 3
    },
    {
      id: 'pillar-2-spokes',
      category: 'pillars',
      priority: 4,
      icon: '🗺️',
      subsectionCount: 2
    },
    {
      id: 'pillar-3-spokes',
      category: 'pillars',
      priority: 5,
      icon: '⚖️',
      subsectionCount: 3
    },
    {
      id: 'pillar-4-spokes',
      category: 'pillars',
      priority: 6,
      icon: '🤝',
      subsectionCount: 3
    },
    {
      id: 'pillar-5-spokes',
      category: 'pillars',
      priority: 7,
      icon: '🌐',
      subsectionCount: 3
    },
    {
      id: 'pillar-6-spokes',
      category: 'pillars',
      priority: 8,
      icon: '💰',
      subsectionCount: 3
    },
    
    // Advanced and specialized resources
    {
      id: 'cross-cutting-spokes',
      category: 'advanced',
      priority: 9,
      icon: '🔗',
      subsectionCount: 4
    },
    
    // Learning and development
    {
      id: 'the-learning-journey',
      category: 'development',
      priority: 10,
      icon: '🎓',
      subsectionCount: 4
    },
    
    // Planning and operations
    {
      id: 'resource-planning',
      category: 'operations',
      priority: 11,
      icon: '📊',
      subsectionCount: 4
    },
    
    // Quality and improvement
    {
      id: 'quality-assurance',
      category: 'operations',
      priority: 12,
      icon: '🎯',
      subsectionCount: 4
    }
  ];
  
  return {
    librarySections,
    
    // Categories for organization
    categories: {
      foundation: {
        title: 'Foundation & Assessment',
        description: 'Essential planning and readiness evaluation tools',
        color: 'brown'
      },
      pillars: {
        title: 'Six Pillars Implementation',
        description: 'Detailed toolkits for each stage of BAZ formation',
        color: 'green'
      },
      advanced: {
        title: 'Advanced Applications',
        description: 'Cross-cutting challenges and specialized scenarios',
        color: 'blue'
      },
      development: {
        title: 'Learning & Growth',
        description: 'Educational resources and skill development',
        color: 'purple'
      },
      operations: {
        title: 'Operations & Quality',
        description: 'Management, planning, and continuous improvement',
        color: 'orange'
      }
    },
    
    // Metadata
    totalSections: librarySections.length,
    totalSubsections: librarySections.reduce((sum, section) => sum + section.subsectionCount, 0),
    
    // Debug info
    debug: {
      currentLocale,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
