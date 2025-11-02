// src/routes/frameworks/mental-health-governance/+page.js
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
  
  // Define sections to load - mental health framework sections
  const sections = [
    'index',
    'vision-principles',
    'governance-structures',
    'legal-policy',
    'financing-resources',
    'service-delivery',
    'monitoring-accountability',
    'crisis-response',
    'innovation-research',
    'cross-cutting-themes',
    'implementation-strategy',
    'political-strategy',
    'risk-management',
    'technology-implementation',
    'change-management',
    'conclusion',
    'mental-health-framework-essentials'
  ];
  
  // Load modular content
  const content = {};
  
  // Load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/mental-health-governance/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/mental-health-governance/${section}.md`);
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
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback)
  };
}
