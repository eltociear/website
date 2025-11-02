// src/routes/frameworks/global-citizenship-practice/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);

  // Track which sections fell back to English
  let sectionsUsingEnglishFallback = new Set();
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = import.meta.env.SSR ? false : url.searchParams.get('print') === 'true';
  
  // Define sections to load - global citizenship framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'global-citizenship-2-page-overview',
    
    // Core framework sections
    'foundational-values',
    'meaning-practice',
    'development-path',
    'tangible-benefits',
    'overcoming-barriers',
    'intergenerational-perspectives',
    'technology-ethics',
    'measuring-impact',
    'inclusive-pathways',
    'professional-integration',
    'crisis-response',
    'ai-digital-technologies',
    'self-assessment-tools',
    'economic-foundations',
    'future-proofing',
    'advanced-implementation',
    'expanding-boundaries',
    'beyond-human-centered'
  ];
  
  // Load modular content
  const content = {};
  const failedSections = [];
  
  // Load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/global-citizenship-practice/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/global-citizenship-practice/${section}.md`);
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
      } catch (e2) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section} in any language:`, e2);
        failedSections.push(section);
        // Set content to null so the component can handle missing sections gracefully
        content[section] = null;
      }
    }
  }
  
  // Log information about content loading
  const loadedSections = sections.filter(section => content[section] !== null);
  const fallbackSections = Array.from(sectionsUsingEnglishFallback);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${loadedSections.length}/${sections.length} sections for global citizenship framework`);
  if (fallbackSections.length > 0) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`${fallbackSections.length} sections using English fallback:`, fallbackSections);
  }
  if (failedSections.length > 0) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn(`${failedSections.length} sections failed to load:`, failedSections);
  }
  
  return {
    sections: content,
    isPrintMode,
    sectionsUsingEnglishFallback: fallbackSections,
    failedSections,
    // Framework metadata
    frameworkType: 'global-citizenship-practice',
    totalSections: sections.length,
    loadedSections: loadedSections.length,
    coreFrameworkSections: 18, // 01-18
    hasSupplementaryMaterials: true,
    hasOverview: true,
    // Content status
    isFullyLoaded: failedSections.length === 0,
    hasPartialContent: loadedSections.length > 0 && failedSections.length > 0,
    isEmpty: loadedSections.length === 0
  };
}
