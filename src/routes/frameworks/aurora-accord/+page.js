// src/routes/frameworks/aurora-accord/+page.js
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
  
  // Load framework translations for navigation
  try {
    await loadTranslations(currentLocale, url.pathname);
  } catch (e) {
    if (DEBUG_FRAMEWORK_LOADING) console.warn('Failed to load translations:', e);
  }
  
  // Safe check for print mode that works during prerendering
  const isPrintMode = browser ? url.searchParams.get('print') === 'true' : false;
  
  // Define sections to load - Aurora Accord framework sections in correct order
  const sections = [
    // Entry point and overview
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction',
    'theory-of-change',
    'core-principles',
    'aurora-accord',
    'key-mechanisms',
    'ethical-tensions',
    'implementation-pathways',
    'framework-integration',
    'technical-specifications',
    'advocacy-action',
    
    // Essential appendices
    'appendices',
    
    // Supplementary materials
    'faq-and-challenges',
    'glossary',

    // Communication resources
    'social-media-templates',
    'policy-briefs'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Aurora Accord sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/aurora-accord/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/aurora-accord/${section}.md`);
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
      message: 'Failed to load Aurora Accord content',
      details: 'The main index section could not be loaded'
    });
  }
  
  return {
    sections: content,
    // Always use modular approach
    isModular: true,
    isPrintMode,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    loadedSectionsCount: loadedSections,
    totalSectionsCount: sections.length,
    
    // Additional metadata for Aurora Accord framework
    frameworkType: 'aurora-accord',
    totalSections: sections.length,
    coreFrameworkSections: 10,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    
    // Aurora Accord-specific metadata
    frameworkVersion: '1.0',
    isDataGovernanceFramework: true,
    tier: 1, // Urgent Global Stability & Justice
    implementationPhases: 3,
    keyMechanisms: 14,
    corePrinciples: 10,
    governanceBodies: 5,
    
    // Data sovereignty metadata
    indigenousDataSovereignty: true,
    youthLeadershipAuthority: true,
    digitalJusticeTribunal: true,
    dataFiduciaryStandard: true,
    globalDataTaxation: true,
    
    // Integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    metaGovernanceCoordination: true,
    indigenousFrameworkAlignment: true,
    crossFrameworkSynergies: 6,
    
    // Implementation metadata
    digitalSanctuaryNations: true,
    coalitionSequencing: true,
    regenerativeShiftGuide: '90-day',
    crisisSimulations: 'annual',
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'urgent-global-stability',
      parisAgreementForDigitalAge: true
    }
  };
}
