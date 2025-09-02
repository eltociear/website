// src/routes/frameworks/guides/bioregional-compass/library/the-learning-journey/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== The Learning Journey +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load translations
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/library');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the resources in logical order (all single files)
  const resources = [
    {
      id: 'pilot-project-sequences',
      title: 'Pilot Project Sequences',
      icon: '🚀',
      priority: 1,
      category: 'implementation',
      description: 'Strategic approaches for testing BAZ concepts through manageable pilot projects and iterative development',
      estimatedTime: '2-6 months per sequence',
      difficulty: 'beginner',
      sections: [] // Single file
    },
    {
      id: 'building-your-support-network',
      title: 'Building Your Support Network',
      icon: '🤝',
      priority: 2,
      category: 'community',
      description: 'Strategies for connecting with mentors, allies, and peer communities throughout your BAZ formation journey',
      estimatedTime: 'Ongoing process',
      difficulty: 'beginner',
      sections: [] // Single file
    },
    {
      id: 'youth-and-intergenerational-continuity',
      title: 'Youth & Intergenerational Continuity',
      icon: '👥',
      priority: 3,
      category: 'development',
      description: 'Programs and protocols for engaging youth, fostering leadership development, and ensuring long-term community continuity',
      estimatedTime: '6-12 months setup',
      difficulty: 'intermediate',
      sections: [] // Single file
    },
    {
      id: 'legacy-planning-toolkit',
      title: 'Legacy Planning Toolkit',
      icon: '📜',
      priority: 4,
      category: 'preservation',
      description: 'Tools for documenting wisdom, preserving institutional knowledge, and planning for generational transition',
      estimatedTime: '3-6 months',
      difficulty: 'intermediate',
      sections: [] // Single file
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each resource (all single files)
  const loadedContent = {};
  
  for (const resource of resources) {
    console.log(`Loading content for resource: ${resource.id}`);
    
    try {
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/library/the-learning-journey/${resource.id}.md`);
      loadedContent[resource.id] = await modulePromise;
      console.log(`Successfully loaded ${resource.id} in ${currentLocale}`);
    } catch (primaryError) {
      console.warn(`Primary load failed for ${resource.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/library/the-learning-journey/${resource.id}.md`);
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
  
  console.log('Loaded content for resources:', Object.keys(loadedContent));
  
  return {
    resources,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalResources: resources.length,
    categories: ['implementation', 'community', 'development', 'preservation'],
    
    // Debug info
    debug: {
      currentLocale,
      availableResources: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/library/the-learning-journey'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
