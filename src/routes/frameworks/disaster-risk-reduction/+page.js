// src/routes/frameworks/disaster-risk-reduction/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== DRR Framework +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load framework translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains section names instead of the base path)
    if (cleanPath.includes('/frameworks/') && 
        (cleanPath.includes('at-a-glance') ||
         cleanPath.includes('executive-summary') ||
         cleanPath.includes('introduction-context') ||
         cleanPath.includes('guiding-principles') ||
         cleanPath.includes('integration-architecture') ||
         cleanPath.includes('framework-components') ||
         cleanPath.includes('three-pillars') ||
         cleanPath.includes('global-resilience-pool') ||
         cleanPath.includes('community-resilience-score') ||
         cleanPath.includes('tek-integration') ||
         cleanPath.includes('crisis-recovery-cycle') ||
         cleanPath.includes('success-metrics') ||
         cleanPath.includes('implementation-phases') ||
         cleanPath.includes('taking-action') ||
         cleanPath.includes('appendices'))) {
      
      if (DEBUG_FRAMEWORK_LOADING) console.log('⚠️  Detected corrupted pathname, correcting to base framework path');
      cleanPath = '/frameworks/disaster-risk-reduction';
    }
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Clean path for translations:', cleanPath);
    
    // Load translations for this specific page path
    if (DEBUG_FRAMEWORK_LOADING) console.log('About to call loadTranslations with:', currentLocale, cleanPath);
    const loadedTranslations = await loadTranslations(currentLocale, cleanPath);
    if (DEBUG_FRAMEWORK_LOADING) console.log('loadTranslations returned:', Object.keys(loadedTranslations || {}));
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded translations for path:', cleanPath, 'with locale:', currentLocale);
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
      if (DEBUG_FRAMEWORK_LOADING) console.log('Print mode detected:', isPrintMode);
    } catch (e) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not access URL search params:', e);
      isPrintMode = false;
    }
  }

  // Define sections to load - DRR framework sections in logical order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction-context',
    'guiding-principles',
    'integration-architecture',
    'framework-components',
    'three-pillars',
    'global-resilience-pool',
    'community-resilience-score',
    'tek-integration',
    'crisis-recovery-cycle',
    'success-metrics',
    'implementation-phases',
    'taking-action',
    
    // Supplementary materials
    'appendices'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading DRR framework sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/disaster-risk-reduction/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/disaster-risk-reduction/${section}.md`);
        content[section] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded section:', section, 'in English as fallback');
        
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section} in any language:`, fallbackError.message);
        
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total sections loaded:', loadedSections, 'out of', sections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded sections:', Object.keys(content));
  
  // Validate that we have at least the index section
  if (!content.index) {
    console.error('Critical: Could not load index section');
    throw error(500, {
      message: 'Failed to load DRR framework content',
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
    
    // Additional metadata for DRR framework
    frameworkType: 'disaster-risk-reduction',
    totalSections: sections.length,
    coreFrameworkSections: 11, // introduction-context through taking-action
    foundationSections: 2, // at-a-glance and executive-summary
    resourceSections: 1, // appendices
    hasExecutiveSummary: true,
    
    // DRR-specific metadata
    frameworkVersion: '4.2',
    tier: 2,
    primaryDomain: 'Ecological',
    isResilienceFramework: true,
    implementationPhases: 3,
    keyComponents: 5, // Risk Understanding, Prevention, Preparedness, Recovery, Communication
    threePillars: ['Global Resilience Pool', 'Community Resilience Networks', 'Accountability & Learning Systems'],
    
    // Framework integrations
    integrationsWith: [
      'framework_planetary_health',
      'framework_aubi',
      'framework_work_liberation',
      'framework_justice_systems',
      'framework_peace_conflict',
      'framework_indigenous',
      'framework_meta_governance',
      'framework_ecological_intelligence',
      'framework_financial_systems',
      'framework_pis',
      'framework_animal_welfare',
      'framework_urban_community',
      'framework_mental_health'
    ],
    
    // Key innovations
    keyInnovations: [
      'Community Resilience Score (CRS)',
      'Forecast-Based Financing',
      'Resilience Bonds',
      'Community Weavers as Resilience Officers',
      'Global Resilience Pool',
      'Planetary Duty of Care',
      'Indigenous-led early warning systems',
      'Ecosystem-based disaster solutions'
    ],
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/disaster-risk-reduction'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
