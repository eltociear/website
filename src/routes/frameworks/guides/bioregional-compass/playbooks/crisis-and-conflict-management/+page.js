// src/routes/frameworks/guides/bioregional-compass/playbooks/crisis-and-conflict-management/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Crisis & Conflict Management +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load translations for playbooks
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/playbooks');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the sections in logical order
  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      description: 'Comprehensive approach to managing crises and conflicts while maintaining community resilience and cohesion',
      priority: 1
    },
    {
      id: 'internal-conflict-resolution-and-transformation',
      title: 'Internal Conflict Resolution & Transformation',
      description: 'Strategies for resolving internal community conflicts and transforming them into opportunities for growth',
      priority: 2
    },
    {
      id: 'external-pressure-management-and-diplomatic-relations',
      title: 'External Pressure Management & Diplomatic Relations',
      description: 'Managing external pressures and maintaining diplomatic relationships during times of conflict or crisis',
      priority: 3
    },
    {
      id: 'system-resilience-and-crisis-response',
      title: 'System Resilience & Crisis Response',
      description: 'Building systemic resilience and coordinating effective responses to various types of crises',
      priority: 4
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each section
  const loadedContent = {};
  
  for (const section of sections) {
    console.log(`Loading content for section: ${section.id}`);
    
    try {
      // Try to load in current locale
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/playbooks/crisis-and-conflict-management/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      console.log(`Successfully loaded ${section.id} in ${currentLocale}`);
    } catch (primaryError) {
      console.warn(`Primary load failed for ${section.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/playbooks/crisis-and-conflict-management/${section.id}.md`);
        loadedContent[section.id] = await fallbackPromise;
        
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section.id);
        }
        console.log(`Loaded ${section.id} from English fallback`);
      } catch (fallbackError) {
        console.warn(`Could not load ${section.id} in any language:`, fallbackError.message);
        
        // Create placeholder content
        loadedContent[section.id] = {
          default: function MissingSection() {
            return {
              render: () => ({
                html: `<div class="missing-content">
                  <h3>Section "${section.id}" not found</h3>
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
  
  console.log('Loaded content for sections:', Object.keys(loadedContent));
  
  return {
    sections,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalSections: sections.length,
    playbookId: 'crisis-and-conflict-management',
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks/crisis-and-conflict-management'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
