// src/routes/frameworks/guides/bioregional-compass/library/pillar-2-spokes/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Pillar 2 Spokes +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load translations
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/library');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the resources in logical order
  const resources = [
    {
      id: 'bioregional-mapping-for-beginners',
      title: 'Bioregional Mapping for Beginners',
      icon: '🗺️',
      priority: 1,
      category: 'mapping',
      description: 'Comprehensive introduction to bioregional mapping using GIS tools, citizen science, and Indigenous knowledge integration',
      estimatedTime: '4-6 weeks',
      difficulty: 'intermediate',
      sections: [
        'overview',
        'gis-and-digital-mapping-tutorials',
        'citizen-science-protocols',
        'indigenous-knowledge-integration-and-fpic-2.0'
      ]
    },
    {
      id: 'ecological-assessment-toolkit',
      title: 'Ecological Assessment Toolkit',
      icon: '🔬',
      priority: 2,
      category: 'assessment',
      description: 'Field-based methods for assessing biodiversity, soil health, watershed conditions, and ecosystem integrity',
      estimatedTime: '6-8 weeks',
      difficulty: 'advanced',
      sections: [
        'overview',
        'biodiversity-survey-protocols',
        'soil-health-testing-and-analysis',
        'watershed-analysis-methods'
      ]
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each resource
  const loadedContent = {};
  
  for (const resource of resources) {
    console.log(`Loading content for resource: ${resource.id}`);
    
    if (resource.sections && resource.sections.length > 0) {
      // Multi-section resource
      loadedContent[resource.id] = {};
      
      for (const section of resource.sections) {
        try {
          const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-2-spokes/${resource.id}/${section}.md`);
          loadedContent[resource.id][section] = await modulePromise;
          console.log(`Successfully loaded ${resource.id}/${section} in ${currentLocale}`);
        } catch (primaryError) {
          console.warn(`Primary load failed for ${resource.id}/${section}:`, primaryError.message);
          
          // Fall back to English
          try {
            const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-2-spokes/${resource.id}/${section}.md`);
            loadedContent[resource.id][section] = await fallbackPromise;
            
            if (currentLocale !== 'en') {
              sectionsUsingEnglishFallback.add(`${resource.id}/${section}`);
            }
            console.log(`Loaded ${resource.id}/${section} from English fallback`);
          } catch (fallbackError) {
            console.warn(`Could not load ${resource.id}/${section} in any language:`, fallbackError.message);
            
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
      // Single file resource (not used in Pillar 2, but keeping for consistency)
      try {
        const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-2-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await modulePromise;
        console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
      } catch (primaryError) {
        console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
        
        // Fall back to English
        try {
          const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-2-spokes/${resource.id}.md`);
          loadedContent[resource.id] = await fallbackPromise;
          
          if (currentLocale !== 'en') {
            sectionsUsingEnglishFallback.add(resource.id);
          }
          console.log(`Loaded ${resource.id} from English fallback`);
        } catch (fallbackError) {
          console.warn(`Could not load ${resource.id} in any language:`, fallbackError.message);
          
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
  
  console.log('Loaded content for resources:', Object.keys(loadedContent));
  
  return {
    resources,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalResources: resources.length,
    categories: ['mapping', 'assessment', 'technical'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/pillar-2-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
