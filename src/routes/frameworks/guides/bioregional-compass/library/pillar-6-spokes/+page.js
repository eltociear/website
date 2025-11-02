// src/routes/frameworks/guides/bioregional-compass/library/pillar-6-spokes/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Pillar 6 Spokes +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load translations
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/library');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the resources in logical order
  const resources = [
    {
      id: 'aubi-implementation-guide',
      title: 'AUBI Implementation Guide',
      icon: '🌱',
      priority: 1,
      category: 'economic',
      description: 'Complete guide for implementing Abundant Universal Basic Income (AUBI) in BAZ communities, including treasury setup and community work team organization',
      estimatedTime: '4-8 weeks',
      difficulty: 'intermediate',
      sections: [] // Single file
    },
    {
      id: 'hearts-and-leaves-currency-manual',
      title: 'Hearts & Leaves Currency Manual',
      icon: '💕',
      priority: 2,
      category: 'currency',
      description: 'Comprehensive manual for implementing regenerative currency systems that reward care work (Hearts) and ecological stewardship (Leaves)',
      estimatedTime: '3-6 weeks',
      difficulty: 'advanced',
      sections: [] // Single file
    },
    {
      id: 'bridge-economy-navigator',
      title: 'Bridge Economy Navigator',
      icon: '🌉',
      priority: 3,
      category: 'transition',
      description: 'Strategic guidance for transitioning from fiat-dependent economies to regenerative systems while maintaining stability during the transition period',
      estimatedTime: '6-12 weeks',
      difficulty: 'advanced',
      sections: [] // Single file
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each resource
  const loadedContent = {};
  
  for (const resource of resources) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`Loading content for resource: ${resource.id}`);
    
    // All resources in Pillar 6 are single files
    try {
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-6-spokes/${resource.id}.md`);
      loadedContent[resource.id] = await modulePromise;
      if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-6-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await fallbackPromise;
        
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(resource.id);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${resource.id} from English fallback`);
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load ${resource.id} in any language:`, fallbackError.message);
        
        // Create placeholder
        loadedContent[resource.id] = {
          default: function MissingResource() {
            return {
              render: () => ({
                html: `<div class="missing-content">
                  <h2>Resource "${resource.id}" not found</h2>
                  <p>This content is still being developed.</p>
                </div>`,
                css: { code: '', map: null }
              })
            };
          }
        };
      }
    }
  }
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded content for resources:', Object.keys(loadedContent));
  
  return {
    resources,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalResources: resources.length,
    categories: ['economic', 'currency', 'transition'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/pillar-6-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
