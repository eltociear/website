// src/routes/frameworks/religious-and-spiritual-dialogue-governance/+page.js
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
  
  // Define sections to load - include all spiritual framework sections
  const sections = [
    'index',
    'introduction',
    'core-principles',
    'objectives',
    'governance-structure',
    'implementation-mechanisms',
    'key-activities',
    'funding-and-resources',
    'challenges-and-mitigation-strategies',
    'timeline',
    'conclusion',
    'appendix-a',
    'appendix-b',
    'appendix-c',
    'appendix-d',
    'appendix-e',
    'appendix-f',
    'appendix-g',
    'appendix-h',
    'executive-brief',
    'policy-guide',
    'youth-and-broad-audiences-guide',
    'adaptive-facilitation-tools',
    'digital-feedback-dashboard'
  ];
  
  // Load modular content
  const content = {};
  const failedSections = [];
  
  // Load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/religious-and-spiritual-dialogue-governance/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/religious-and-spiritual-dialogue-governance/${section}.md`);
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${loadedSections.length}/${sections.length} sections for religious-and-spiritual-dialogue-governance framework`);
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
    frameworkType: 'religious-and-spiritual-dialogue-governance',
    totalSections: sections.length,
    loadedSections: loadedSections.length,
    coreFrameworkSections: 11, // introduction through conclusion
    hasAppendices: true,
    hasSupplementaryMaterials: true,
    // Content status
    isFullyLoaded: failedSections.length === 0,
    hasPartialContent: loadedSections.length > 0 && failedSections.length > 0,
    isEmpty: loadedSections.length === 0
  };
}
