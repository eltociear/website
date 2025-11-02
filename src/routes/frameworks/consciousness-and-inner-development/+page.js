// src/routes/frameworks/consciousness-and-inner-development/+page.js
import { locale } from '$lib/i18n';
import { get } from 'svelte/store';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = import.meta.env.SSR ? false : url.searchParams.get('print') === 'true';
  
  // Track which sections fell back to English
  let sectionsUsingEnglishFallback = new Set();

  // Define sections to load - consciousness framework sections organized in depth
  const sections = [
    // Entry point and accessibility
    'index',
    'consciousness-accord-lite',
    
    // Foundation sections (establishing the framework)
    'manifesto',
    'governance-structure',
    'spiral-dynamics',
    
    // Individual transformation sections (personal development)
    'personal-transformation',
    'collective-consciousness',
    'cross-cultural-translation',
    
    // Systemic integration sections (organizational & societal level)
    'systemic-integration',
    'economic-realignment',
    'community-engagement',
    'digital-platforms',
    'ethical-ai-governance',
    
    // Application sections (practical implementation)
    'crisis-response',
    'metrics-accountability',
    'implementation-roadmap',
    'visual-architecture-map',
    
    // Culmination and resources
    'conclusion',
    'executive-core-overview',
    'youth-governance-comic'
  ];
  
  // Load modular content
  const content = {};
  const failedSections = [];
  
  // Load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/consciousness-and-inner-development/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/consciousness-and-inner-development/${section}.md`);
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log(`Loaded ${loadedSections.length}/${sections.length} sections for consciousness-and-inner-development framework`);
  if (fallbackSections.length > 0) {
    if (DEBUG_FRAMEWORK_LOADING) console.log(`${fallbackSections.length} sections using English fallback:`, fallbackSections);
  }
  if (failedSections.length > 0) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn(`${failedSections.length} sections failed to load:`, failedSections);
  }
  
  // Define section groupings for better organization
  const foundationSections = ['manifesto', 'governance-structure', 'spiral-dynamics'];
  const transformationSections = ['personal-transformation', 'collective-consciousness', 'cross-cultural-translation'];
  const integrationSections = ['systemic-integration', 'economic-realignment', 'community-engagement', 'digital-platforms', 'ethical-ai-governance'];
  const applicationSections = ['crisis-response', 'metrics-accountability', 'implementation-roadmap', 'visual-architecture-map'];
  const resourceSections = ['consciousness-accord-lite', 'executive-core-overview', 'youth-governance-comic'];
  
  return {
    sections: content,
    isPrintMode,
    sectionsUsingEnglishFallback: fallbackSections,
    failedSections,
    // Framework metadata
    frameworkType: 'consciousness-and-inner-development',
    totalSections: sections.length,
    loadedSections: loadedSections.length,
    // Section groupings for navigation
    foundationSections,
    transformationSections,
    integrationSections,
    applicationSections,
    resourceSections,
    // Additional metadata
    coreFrameworkSections: foundationSections.length + transformationSections.length + integrationSections.length + applicationSections.length,
    hasSupplementaryMaterials: true,
    hasLiteVersion: true,
    hasVisualMaterials: true,
    hasYouthContent: true,
    // Content status
    isFullyLoaded: failedSections.length === 0,
    hasPartialContent: loadedSections.length > 0 && failedSections.length > 0,
    isEmpty: loadedSections.length === 0
  };
}
