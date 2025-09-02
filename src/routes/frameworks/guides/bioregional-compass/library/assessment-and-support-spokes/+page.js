// src/routes/frameworks/guides/bioregional-compass/library/assessment-and-support-spokes/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Assessment & Support Spokes +page.js load function ===');
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
      id: 'pre-formation-assessment-suite',
      title: 'Pre-Formation Assessment Suite',
      icon: '🔍',
      priority: 1,
      category: 'planning',
      description: 'Comprehensive tools to evaluate community readiness, skills, and viability before beginning BAZ formation',
      estimatedTime: '2-4 weeks',
      difficulty: 'beginner',
      sections: [
        'baz-viability-calculator-module',
        'community-skills-mapping-module', 
        'legal-landscape-survey-module',
        'resource-and-infrastructure-planning-module',
        'overview'
      ]
    },
    {
      id: 'mentorship-network-directory',
      title: 'Mentorship Network Directory',
      icon: '🤝',
      priority: 2,
      category: 'support',
      description: 'Connect with experienced communities, professional services, and regional networks for guidance and support',
      estimatedTime: 'Ongoing',
      difficulty: 'beginner',
      sections: [
        'overview',
        'established-community-network-module',
        'individual-expert-mentors-module',
        'professional-service-networks-module',
        'regional-and-cultural-networks-module'
      ]
    },
    {
      id: 'baz-dashboard-manual',
      title: 'BAZ Dashboard Manual',
      icon: '📊',
      priority: 3,
      category: 'monitoring',
      description: 'Implementation guide for metrics tracking, data collection, and community health monitoring systems',
      estimatedTime: '1-2 weeks setup',
      difficulty: 'intermediate',
      sections: [
        // This will be a single markdown file, so no subsections defined
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
          const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/assessment-and-support-spokes/${resource.id}/${section}.md`);
          loadedContent[resource.id][section] = await modulePromise;
          console.log(`Successfully loaded ${resource.id}/${section} in ${currentLocale}`);
        } catch (primaryError) {
          console.warn(`Primary load failed for ${resource.id}/${section}:`, primaryError.message);
          
          // Fall back to English
          try {
            const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/assessment-and-support-spokes/${resource.id}/${section}.md`);
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
        const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/assessment-and-support-spokes/${resource.id}.md`);
        loadedContent[resource.id] = await modulePromise;
        console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
      } catch (primaryError) {
        console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
        
        // Fall back to English
        try {
          const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/assessment-and-support-spokes/${resource.id}.md`);
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
    categories: ['planning', 'support', 'monitoring'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/assessment-and-support-spokes'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
