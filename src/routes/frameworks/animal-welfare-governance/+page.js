// src/routes/frameworks/animal-welfare-governance/+page.js
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
  
  // Define sections to load - animal welfare framework sections (without numbering)
  const sections = [
    // Entry point and overview
    'index',
    
    // Core framework sections
    'introduction',
    'core-principles',
    'structural-components',
    'implementation-approaches',
    'metrics-evaluation',
    'cultural-justice',
    'environmental-integration',
    'appendices',
    
    // Essential guide and executive summary
    'global-guardian-framework-essentials',
    'executive-summary'
  ];
  
  // Load modular content
  const content = {};
  
  // Load each section
  for (const section of sections) {
    try {
      // Try to load the current locale version
      content[section] = await import(`$lib/content/frameworks/${currentLocale}/implementation/animal-welfare-governance/${section}.md`);
    } catch (e) {
      // Fall back to English if translation isn't available
      try {
        content[section] = await import(`$lib/content/frameworks/en/implementation/animal-welfare-governance/${section}.md`);
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
