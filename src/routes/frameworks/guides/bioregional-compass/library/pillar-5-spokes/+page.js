// src/routes/frameworks/guides/bioregional-compass/library/pillar-5-spokes/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Pillar 5 Spokes +page.js load function ===');
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
      id: 'ggf-integration-handbook',
      title: 'GGF Integration Handbook',
      icon: '🌐',
      priority: 1,
      category: 'integration',
      description: 'Comprehensive guide for integrating BAZ communities with Global Governance Framework protocols, including delegate selection and Earth Council connections',
      estimatedTime: '4-6 weeks',
      difficulty: 'intermediate',
      sections: [
        'overview',
        'delegate-selection-and-community-representation',
        'earth-council-connection-protocols',
        'treaty-of-our-only-home-adoption'
      ]
    },
    {
      id: 'digital-commons-setup-guide',
      title: 'Digital Commons Setup Guide',
      icon: '💻',
      priority: 2,
      category: 'technical',
      description: 'Technical guidance for establishing community media nodes, implementing data sovereignty protocols, and building digital infrastructure',
      estimatedTime: '3-5 weeks',
      difficulty: 'advanced',
      sections: [
        'overview',
        'community-media-node-setup',
        'data-sovereignty-protocols'
      ]
    },
    {
      id: 'epistemic-infrastructure-toolkit-for-baz-communities',
      title: 'Epistemic Infrastructure Toolkit',
      icon: '🧠',
      priority: 3,
      category: 'knowledge',
      description: 'Tools and frameworks for knowledge preservation, truth-seeking protocols, and community learning systems within BAZ contexts',
      estimatedTime: '2-3 weeks',
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
          const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-5-spokes/${resource.id}/${section}.md`);
          loadedContent[resource.id][section] = await modulePromise;
          if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id}/${section} in ${currentLocale}`);
        } catch (primaryError) {
          if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}/${section}:`, primaryError.message);
          
          // Fall back to English
          try {
            const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-5-spokes/${resource.id}/${section}.md`);
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
        const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-5-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await modulePromise;
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
      } catch (primaryError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
        
        // Fall back to English
        try {
          const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-5-spokes/${resource.id}.md`);
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
    categories: ['integration', 'technical', 'knowledge'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/pillar-5-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
