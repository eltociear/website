// src/routes/overview/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Overview +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load overview translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/overview/') && 
        (cleanPath.includes('introduction') ||
         cleanPath.includes('ggf-vision') ||
         cleanPath.includes('foundational-architecture') ||
         cleanPath.includes('implementation-roadmap') ||
         cleanPath.includes('thematic-clusters') ||
         cleanPath.includes('living-system') ||
         cleanPath.includes('invitation') ||
         cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary-for-the-skeptic'))) {
      
      console.log('⚠️  Detected corrupted pathname, correcting to base overview path');
      cleanPath = '/overview';
    }
    
    console.log('Clean path for translations:', cleanPath);
    
    // Load translations for this specific page path
    console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
  } catch (e) {
    console.error('Failed to load translations:', e);
    console.error('Error details:', e.stack);
  }
  
  // Safe check for print mode that works during prerendering
  // Only access url.search on the client side
  let isPrintMode = false;
  if (browser) {
    try {
      isPrintMode = url.search ? url.searchParams.get('print') === 'true' : false;
      console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // Define sections to load - overview sections in logical order
  const sections = [
    // Main overview content
    'index',
    'introduction',
    'ggf-vision',
    'foundational-architecture',
    'implementation-roadmap',
    'thematic-clusters',
    'living-system',
    'invitation',
    
    // Additional summaries and references
    'at-a-glance',
    'executive-summary-for-the-skeptic'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading overview sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/overview/${currentLocale}/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/overview/en/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
        // Create a safe placeholder for missing sections
        content[section] = {
          default: function MissingSection() {
            return {
              render: () => ({
                html: `<div class="missing-section-content">
                  <h2>Section "${section}" not found</h2>
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
  
  console.log('Total sections loaded:', loadedSections, 'out of', sections.length);
  console.log('Loaded sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load index section');
    throw error(500, {
      message: 'Failed to load overview content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    // Always use modular approach
    isModular: true,
    isPrintMode, // This will be false during prerendering, true/false on client
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Additional metadata for overview
    contentType: 'overview',
    totalSections: sections.length,
    mainSections: 8, // index through invitation
    summarySection: 2, // at-a-glance and executive-summary
    hasExecutiveSummary: true,
    hasAtAGlance: true,
    hasSkepticSummary: true,
    
    // Overview-specific metadata
    overviewVersion: '1.0',
    releaseDate: '2025-07-30',
    frameworkCount: 50, // approximate total frameworks in GGF
    tierCount: 5, // Tier 0-4
    pillarCount: 3, // Hardware, Heart, Nervous System
    estimatedReadingTime: 22, // minutes for full overview
    isComprehensiveOverview: true,
    isEntryPoint: true,
    
    // Three pillars metadata
    threePillars: [
      {
        name: 'Hardware',
        framework: 'Treaty for Our Only Home',
        description: 'Legal and institutional foundation'
      },
      {
        name: 'Heart', 
        framework: 'Indigenous & Traditional Knowledge Governance',
        description: 'Ethical compass and wisdom foundation'
      },
      {
        name: 'Nervous System',
        framework: 'Integrated Meta-Governance Framework', 
        description: 'Coordination architecture'
      }
    ],
    
    // Implementation tiers metadata
    implementationTiers: [
      { tier: 0, name: 'Constitutional Layer', description: 'The absolute prerequisite' },
      { tier: 1, name: 'Core Operating Systems', description: 'Essential functions' },
      { tier: 2, name: 'Foundational Application Layer', description: 'Essential life support' },
      { tier: 3, name: 'Equity & Cultural Flourishing Layer', description: 'Justice and heritage' },
      { tier: 4, name: 'Visionary & Meta-Systems Layer', description: 'Future stewardship' }
    ],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/overview'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
