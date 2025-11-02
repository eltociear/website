// src/routes/frameworks/guides/bioregional-compass/playbooks/balancing-innovation-and-tradition/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Balancing Innovation & Tradition +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
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
      description: 'Comprehensive approach to balancing technological innovation with traditional wisdom and cultural preservation',
      priority: 1
    },
    {
      id: 'indigenous-knowledge-integration-and-fpic-2.0',
      title: 'Indigenous Knowledge Integration & FPIC 2.0',
      description: 'Frameworks for respectfully integrating Indigenous knowledge systems and implementing enhanced consent protocols',
      priority: 2
    },
    {
      id: 'cultural-evolution-and-adaptive-practices',
      title: 'Cultural Evolution & Adaptive Practices',
      description: 'Managing cultural change and adaptation while maintaining core values and community identity',
      priority: 3
    },
    {
      id: 'technology-intergation-and-digital-sovereignty',
      title: 'Technology Integration & Digital Sovereignty',
      description: 'Strategic approaches to technology adoption while maintaining community autonomy and digital self-determination',
      priority: 4
    }
  ];

  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each section
  const loadedContent = {};
  
  for (const section of sections) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`Loading content for section: ${section.id}`);
    
    try {
      // Try to load in current locale
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/playbooks/balancing-innovation-and-tradition/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${section.id} in ${currentLocale}`);
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${section.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/playbooks/balancing-innovation-and-tradition/${section.id}.md`);
        loadedContent[section.id] = await fallbackPromise;
        
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section.id);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${section.id} from English fallback`);
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load ${section.id} in any language:`, fallbackError.message);
        
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded content for sections:', Object.keys(loadedContent));
  
  return {
    sections,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    
    // Metadata
    totalSections: sections.length,
    playbookId: 'balancing-innovation-and-tradition',
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks/balancing-innovation-and-tradition'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
