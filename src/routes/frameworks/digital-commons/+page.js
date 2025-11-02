// src/routes/frameworks/digital-commons/+page.js
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
  
  // Define sections to load - digital commons framework sections organized logically
  const sections = [
    // Overview
    'index',
    
    // Foundation sections
    'preamble',
    'core-principles',
    'governance-structure',
    'key-components',
    
    // Implementation sections
    'implementation-roadmap',
    'monitoring-evaluation',
    'tools-resources',
    
    // Analysis & Future sections
    'case-studies',
    'future-potential',
    'call-to-action',
    
    // Specialized guides
    'technical-guide',
    'community-guide',
    'youth-guide',
    'digital-ethics-guide',
    'indigenous-guide',
    
    // Epilogue
    'epilogue',
    
    // Appendices (A-K in order)
    'appendix-a-pilot-onboarding',
    'appendix-b-visual-companion-toolkit',
    'appendix-c-corporate-participation-playbook',
    'appendix-d-digital-ethics-charter',
    'appendix-e-commons-glossary',
    'appendix-f-minimal-viable-node-quickstart',
    'appendix-g-field-test-logbook-template',
    'appendix-h-faq-for-tech-skeptical-leaders',
    'appendix-i-diplomatic-mini-deck',
    'appendix-j-historical-commons-context',
    'appendix-k-impact-assessment-framework'
  ];
  
  // Load modular content
  const content = {};
  
  // Try to load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/digital-commons/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/digital-commons/${section}.md`);
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
