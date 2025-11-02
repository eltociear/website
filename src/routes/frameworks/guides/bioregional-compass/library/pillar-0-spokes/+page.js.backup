// src/routes/frameworks/guides/bioregional-compass/library/pillar-0-spokes/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Pillar 0 Spokes +page.js load function ===');
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
      id: 'inner-work-toolkit',
      title: 'Inner Work Toolkit',
      icon: '🧘',
      priority: 1,
      category: 'personal',
      description: 'Comprehensive practices for personal resilience, mindfulness, communication, and burnout prevention',
      estimatedTime: '2-4 weeks foundation',
      difficulty: 'beginner',
      sections: [
        'overview',
        'mindfulness-and-contemplative-practices',
        'non-violent-communication-guide',
        'burnout-prevention-and-recovery-protocols'
      ]
    },
    {
      id: 'steward-development-program',
      title: 'Steward Development Program',
      icon: '🌱',
      priority: 2,
      category: 'leadership',
      description: 'Leadership development framework including assessment, mentorship structures, and succession planning',
      estimatedTime: '3-6 months',
      difficulty: 'intermediate',
      sections: [
        'overview',
        'leadership-qualities-assessment-framework',
        'mentorship-structures-and-relationships',
        'leadership-transition-and-succession-planning'
      ]
    },
    {
      id: 'community-trauma-healing-guide',
      title: 'Community Trauma Healing Guide',
      icon: '💚',
      priority: 3,
      category: 'healing',
      description: 'Approaches for addressing collective wounds and healing trauma that could impact BAZ formation',
      estimatedTime: '4-8 weeks',
      difficulty: 'advanced',
      sections: [] // Single file
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
          const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-0-spokes/${resource.id}/${section}.md`);
          loadedContent[resource.id][section] = await modulePromise;
          console.log(`Successfully loaded ${resource.id}/${section} in ${currentLocale}`);
        } catch (primaryError) {
          console.warn(`Primary load failed for ${resource.id}/${section}:`, primaryError.message);
          
          // Fall back to English
          try {
            const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-0-spokes/${resource.id}/${section}.md`);
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
      // Single file resource
      try {
        const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/pillar-0-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await modulePromise;
        console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
      } catch (primaryError) {
        console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
        
        // Fall back to English
        try {
          const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/pillar-0-spokes/${resource.id}.md`);
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
    categories: ['personal', 'leadership', 'healing'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/pillar-0-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
