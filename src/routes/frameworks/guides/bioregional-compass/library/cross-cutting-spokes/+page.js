// src/routes/frameworks/guides/bioregional-compass/library/cross-cutting-spokes/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Cross-Cutting Spokes +page.js load function ===');
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
      id: 'crisis-management-compendium',
      title: 'Crisis Management Compendium',
      icon: '🚨',
      priority: 1,
      category: 'emergency',
      description: 'Comprehensive crisis response protocols for economic, environmental, governance, and safety emergencies',
      estimatedTime: 'Reference as needed',
      difficulty: 'advanced',
      sections: [
        'overview',
        'economic-crisis-management-guide',
        'environmental-and-climate-crisis-response-guide',
        'internal-conflicts-and-governance-crises-response-guide',
        'external-hostility-and-attack-response-guide',
        'legal-and-regulatory-response-guide',
        'mental-health-crisis-response-guide',
        'violence-and-safety-crisis-response-guide',
        'system-failure-recovery-guide'
      ]
    },
    {
      id: 'scale-transition-guides',
      title: 'Scale Transition Guides',
      icon: '📈',
      priority: 2,
      category: 'growth',
      description: 'Strategic guidance for managing growth from homestead to village to bioregional scale',
      estimatedTime: '2-4 weeks per transition',
      difficulty: 'intermediate',
      sections: [
        'overview',
        'homestead-to-village-transition-guide',
        'village-to-bioregional-transition-guide',
        'network-integration-and-federation-guide'
      ]
    },
    {
      id: 'legal-challenge-response-kit',
      title: 'Legal Challenge Response Kit',
      icon: '⚖️',
      priority: 3,
      category: 'legal',
      description: 'Emergency protocols and survival strategies for hostile legal environments and regulatory challenges',
      estimatedTime: 'Emergency reference',
      difficulty: 'advanced',
      sections: [
        'overview',
        'emergency-legal-response-protocol',
        'hostile-jurisdiction-survival-guide'
      ]
    },
    {
      id: 'network-coordination-manual',
      title: 'Network Coordination Manual',
      icon: '🌐',
      priority: 4,
      category: 'coordination',
      description: 'Protocols for inter-BAZ cooperation, resource sharing, and federation management',
      estimatedTime: '1-2 weeks setup',
      difficulty: 'intermediate',
      sections: [] // Single file
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each resource
  const loadedContent = {};
  
  for (const resource of resources) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`Loading content for resource: ${resource.id}`);
    
    if (resource.sections && resource.sections.length > 0) {
      // Multi-section resource
      loadedContent[resource.id] = {};
      
      for (const section of resource.sections) {
        try {
          const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/cross-cutting-spokes/${resource.id}/${section}.md`);
          loadedContent[resource.id][section] = await modulePromise;
          if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id}/${section} in ${currentLocale}`);
        } catch (primaryError) {
          if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}/${section}:`, primaryError.message);
          
          // Fall back to English
          try {
            const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/cross-cutting-spokes/${resource.id}/${section}.md`);
            loadedContent[resource.id][section] = await fallbackPromise;
            
            if (currentLocale !== 'en') {
              sectionsUsingEnglishFallback.add(`${resource.id}/${section}`);
            }
            if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${resource.id}/${section} from English fallback`);
          } catch (fallbackError) {
            if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load ${resource.id}/${section} in any language:`, fallbackError.message);
            
            // Create placeholder
            loadedContent[resource.id][section] = {
              default: function MissingSection() {
                return {
                  render: () => ({
                    html: `<div class="missing-content">
                      <h3>Section "${section}" not found</h3>
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
    } else {
      // Single file resource
      try {
        const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/cross-cutting-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await modulePromise;
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
      } catch (primaryError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
        
        // Fall back to English
        try {
          const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/cross-cutting-spokes/${resource.id}.md`);
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
  }
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded content for resources:', Object.keys(loadedContent));
  
  return {
    resources,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalResources: resources.length,
    categories: ['emergency', 'growth', 'legal', 'coordination'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/cross-cutting-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
