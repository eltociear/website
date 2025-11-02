// src/routes/frameworks/migration-and-human-mobility/+page.js
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
  
  // Define sections to load - Migration & Human Mobility framework sections in correct order
  const sections = [
    // Sacred opening and overview
    'preamble',
    'index',
    'at-a-glance',
    'executive-summary-for-the-skeptic',
    
    // Core framework sections
    'introduction',
    'theory-of-change',
    'core-principles',
    'radical-innovations',
    'planetary-migration-council',
    'implementation-pathways',
    'framework-integration',
    'cultural-adaptability',
    'monitoring-accountability',
    'radical-faqs',
    'advocacy-action',
    
    // Essential resources
    'glossary',
    'appendices',
    'conclusion'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading Migration & Human Mobility sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/frameworks/${currentLocale}/implementation/migration-and-human-mobility/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section, 'in', currentLocale);
    } catch (primaryError) {
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/frameworks/en/implementation/migration-and-human-mobility/${section}.md`);
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
  
  // Validate that we have at least the preamble and index sections
  if (!content.preamble || !content.index) {
    console.error('Critical: Could not load preamble or index section');
    throw error(500, {
      message: 'Failed to load Migration & Human Mobility content',
      details: 'The preamble or main index section could not be loaded'
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
    
    // Additional metadata for Migration & Human Mobility framework
    frameworkType: 'migration-and-human-mobility',
    totalSections: sections.length,
    coreFrameworkSections: 11,
    hasSupplementaryMaterials: true,
    hasExecutiveSummary: true,
    hasPreamble: true,
    
    // Migration & Human Mobility-specific metadata
    frameworkVersion: '1.0',
    isMigrationCoordinationFramework: true,
    tier: 1, // Urgent Global Stability & Justice
    implementationPhases: 4, // Phase 0-3 as described in implementation pathways
    radicalInnovations: 5,
    corePrinciples: 8,
    governanceBodies: 1, // Planetary Migration Council
    
    // Migration governance metadata
    sacredCirculation: true,
    climateMigrationProtection: true,
    indigenousSovereignty: true,
    youthAuthorityBinding: true,
    heartsCurrencyIntegration: true,
    
    // Golden Triangle integration metadata
    treatyIntegration: 'treaty-for-our-only-home',
    metaGovernanceCoordination: 'planetary-migration-council',
    indigenousFrameworkAlignment: 'bioregional-autonomous-zones',
    financialSystemsIntegration: 'hearts-currency',
    crossFrameworkSynergies: 4,
    
    // Implementation metadata
    bioregionalAutonomousZones: true,
    globalMobilityPassport: true,
    climateResilienceVisas: true,
    migrationJusticeTribunals: true,
    coalitionSequencing: true,
    
    // Policy innovation metadata
    fluidSovereignty: true,
    ecologicalAlignment: true,
    indigenousLedStewardship: true,
    antiFragilityDesign: true,
    intergenerationalJustice: true,
    regenerativeCirculation: true,
    
    // Cultural adaptation metadata
    culturalProtocolCompliance: true,
    epistemologicalDiversity: true,
    traditionalKnowledgeIntegration: true,
    interfaithGovernance: true,
    ceremonyGovernanceEvolution: true,
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      frameworkTier: 'urgent-global-stability',
      comprehensiveApplicationLayer: true,
      goldenTriangleIntegration: true,
      primaryDemonstration: 'meta-governance-coordination'
    }
  };
}
