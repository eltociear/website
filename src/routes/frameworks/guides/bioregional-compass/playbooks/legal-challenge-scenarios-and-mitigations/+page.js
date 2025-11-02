// src/routes/frameworks/guides/bioregional-compass/playbooks/legal-challenge-scenarios-and-mitigations/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Legal Challenge Scenarios +page.js load function ===');
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
      description: 'Strategic framework for identifying, preparing for, and responding to legal challenges facing BAZ communities',
      priority: 1
    },
    {
      id: 'regulatory-and-compliance-challenges',
      title: 'Regulatory & Compliance Challenges',
      description: 'Common regulatory hurdles and compliance strategies for alternative governance structures',
      priority: 2
    },
    {
      id: 'financial-and-tax-compliance-issues',
      title: 'Financial & Tax Compliance Issues',
      description: 'Navigating tax obligations, alternative currencies, and financial reporting requirements',
      priority: 3
    },
    {
      id: 'emergency-services-and-crisis-response',
      title: 'Emergency Services & Crisis Response',
      description: 'Legal frameworks for emergency response, liability management, and service provision',
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
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/playbooks/legal-challenge-scenarios-and-mitigations/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      if (DEBUG_FRAMEWORK_LOADING) console.log(`Successfully loaded ${section.id} in ${currentLocale}`);
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for ${section.id}:`, primaryError.message);
      
      // Fall back to English
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/playbooks/legal-challenge-scenarios-and-mitigations/${section.id}.md`);
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
    playbookId: 'legal-challenge-scenarios-and-mitigations',
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks/legal-challenge-scenarios-and-mitigations'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
