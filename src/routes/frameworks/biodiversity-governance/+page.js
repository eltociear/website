// src/routes/frameworks/biodiversity-governance/+page.js
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
  
  // Define sections to load - biodiversity governance framework sections
  const sections = [
    // Overview
    'index',
    
    // Foundation sections
    'philosophical-preamble',
    'introduction-vision',
    'guiding-principles',
    'core-pillars',
    
    // Governance & Policy sections
    'governance-structure',
    'policy-mechanisms',
    'stakeholder-engagement',
    'financing-mechanisms',
    
    // Implementation sections
    'implementation-roadmap',
    'metrics-success',
    'visualizations',
    'challenges-solutions',
    'implementation-tools',
    'reparations-protocol',
    
    // Specialized guides
    'technical-guide-policymakers',
    'community-implementation-guide',
    'youth-engagement-leadership-guide',
    'corporate-transition-redemption-guide',
    'indigenous-data-sovereignty-guide',
    
    // Conclusion
    'conclusion-call-to-action',
    
    // Appendices (A-J in order)
    'appendix-a-synergy-esfmlg',
    'appendix-b-glossary',
    'appendix-c-tool-library',
    'appendix-d-moral-edge-cases',
    'appendix-e-political-economy',
    'appendix-f-feasibility-studies',
    'appendix-g-pilot-blueprints',
    'appendix-h-scenario-planning',
    'appendix-i-cooperation-protocols',
    'appendix-j-creative-outputs'
  ];
  
  // Load modular content
  const content = {};
  
  // Try to load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/biodiversity-governance/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/biodiversity-governance/${section}.md`);
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
      } catch (e2) {
        if (DEBUG_FRAMEWORK_LOADING) console.log(`Could not load section ${section} in any language`);
      }
    }
  }
  
  return {
    sections: content,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback)
  };
}
