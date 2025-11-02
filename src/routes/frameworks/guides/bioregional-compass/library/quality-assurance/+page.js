// src/routes/frameworks/guides/bioregional-compass/library/quality-assurance/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Quality Assurance +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load translations
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/library');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the resources in logical order (all single files)
  const resources = [
    {
      id: 'overview',
      title: 'Quality Assurance Overview',
      icon: '🎯',
      priority: 1,
      category: 'overview',
      description: 'Comprehensive framework for quality management, measurement systems, and continuous improvement in BAZ development',
      estimatedTime: '1-2 hours',
      difficulty: 'beginner',
      sections: [] // Single file
    },
    {
      id: 'success-metrics-and-holistic-assessment-systems',
      title: 'Success Metrics & Holistic Assessment',
      icon: '📈',
      priority: 2,
      category: 'measurement',
      description: 'Comprehensive metrics frameworks including BHI, LMCI, CVI and other indicators for measuring BAZ health and progress',
      estimatedTime: '2-3 weeks setup',
      difficulty: 'intermediate',
      sections: [] // Single file
    },
    {
      id: 'risk-assessment-framework-and-early-warning-systems',
      title: 'Risk Assessment & Early Warning Systems',
      icon: '⚠️',
      priority: 3,
      category: 'monitoring',
      description: 'Proactive risk identification, early warning protocols, and prevention strategies for potential BAZ challenges',
      estimatedTime: '1-2 weeks setup',
      difficulty: 'intermediate',
      sections: [] // Single file
    },
    {
      id: 'iteration-cycles-and-continuous-improvement-protocols',
      title: 'Iteration Cycles & Continuous Improvement',
      icon: '🔄',
      priority: 4,
      category: 'improvement',
      description: 'Structured feedback loops, adaptation protocols, and systematic improvement processes for evolving BAZ systems',
      estimatedTime: 'Ongoing process',
      difficulty: 'advanced',
      sections: [] // Single file
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each resource (all single files)
  const loadedContent = {};
  
  for (const resource of resources) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`Loading content for resource: ${resource.id}`);
    
    try {
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/quality-assurance/${resource.id}.md`);
      loadedContent[resource.id] = await modulePromise;
      if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/quality-assurance/${resource.id}.md`);
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
    categories: ['overview', 'measurement', 'monitoring', 'improvement'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/quality-assurance'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
