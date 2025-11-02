// src/routes/frameworks/guides/bioregional-compass/playbooks/scale-specific-governance-pathways/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Scale-Specific Governance Pathways +page.js load function ===');
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
      description: 'Understanding how governance structures must evolve as communities grow from homestead to bioregional scale',
      priority: 1
    },
    {
      id: 'homestead-to-village-transition-guide',
      title: 'Homestead to Village Transition Guide',
      description: 'Managing the critical transition from informal homestead governance to formal village-scale democratic structures',
      priority: 2
    },
    {
      id: 'village-to-bioregional-transition-guide',
      title: 'Village to Bioregional Transition Guide',
      description: 'Scaling up from village governance to complex bioregional coordination and inter-community governance',
      priority: 3
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
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/playbooks/scale-specific-governance-pathways/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      console.log(`Successfully loaded ${section.id} in ${currentLocale}`);
    } catch (primaryError) {
      console.warn(`Primary load failed for ${section.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/playbooks/scale-specific-governance-pathways/${section.id}.md`);
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
    playbookId: 'scale-specific-governance-pathways',
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks/scale-specific-governance-pathways'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
