// src/routes/frameworks/guides/bioregional-compass/playbooks/external-relationship-management/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== External Relationship Management +page.js load function ===');
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
      description: 'Comprehensive approach to managing relationships with external stakeholders, institutions, and communities',
      priority: 1
    },
    {
      id: 'municipal-government-and-public-agency-relations',
      title: 'Municipal Government & Public Agency Relations',
      description: 'Building productive relationships with local government entities and public agencies',
      priority: 2
    },
    {
      id: 'utility-providers-and-infrastructure-partnerships',
      title: 'Utility Providers & Infrastructure Partnerships',
      description: 'Developing partnerships for essential infrastructure and utility service provision',
      priority: 3
    },
    {
      id: 'regional-economic-integration-and-business-networks',
      title: 'Regional Economic Integration & Business Networks',
      description: 'Building economic partnerships and integrating with regional business ecosystems',
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
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/playbooks/external-relationship-management/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      console.log(`Successfully loaded ${section.id} in ${currentLocale}`);
    } catch (primaryError) {
      console.warn(`Primary load failed for ${section.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/playbooks/external-relationship-management/${section.id}.md`);
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
    playbookId: 'external-relationship-management',
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks/external-relationship-management'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
