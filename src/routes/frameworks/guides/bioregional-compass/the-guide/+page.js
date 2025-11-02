// src/routes/frameworks/guides/bioregional-compass/the-guide/+page.js
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Bioregional Compass The Guide +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load translations for the guide page
  try {
    const cleanPath = '/frameworks/guides/bioregional-compass/the-guide';
    
    if (DEBUG_FRAMEWORK_LOADING) console.log('Loading translations for path:', cleanPath);
    
    // Load main guide translations first
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass');
    
    // Load the-guide specific translations
    try {
      const guideModule = await import(`$lib/i18n/${currentLocale}/guidesBioregionalCompassTheGuide.json`);
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded the-guide translations for:', currentLocale);
    } catch (guideError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn('Could not load the-guide translations for locale:', currentLocale, 'Error:', guideError.message);
      // Try English fallback
      try {
        const fallbackModule = await import(`$lib/i18n/en/guidesBioregionalCompassTheGuide.json`);
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded the-guide translations from English fallback');
      } catch (fallbackError) {
        console.error('Could not load the-guide translations in any language:', fallbackError);
      }
    }
    
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the guide sections in logical order
  const guideSections = [
    {
      id: 'introduction',
      title: 'Introduction',
      priority: 1,
      icon: '🌱',
      estimatedTime: '5 min read'
    },
    {
      id: 'how-to-use-this-guide',
      title: 'How to Use This Guide',
      priority: 2,
      icon: '📖',
      estimatedTime: '10 min read'
    },
    {
      id: 'defining-your-minimum-viable-baz',
      title: 'Defining Your Minimum Viable BAZ',
      priority: 3,
      icon: '🎯',
      estimatedTime: '15 min read'
    },
    {
      id: 'pillar-0-the-inner-ground',
      title: 'Pillar 0: The Inner Ground',
      subtitle: 'Cultivating the Consciousness for a New World',
      priority: 4,
      icon: '🧘',
      estimatedTime: '20 min read',
      pillarNumber: 0
    },
    {
      id: 'pillar-1-the-spark',
      title: 'Pillar 1: The Spark',
      subtitle: 'Vision & Consensus Building',
      priority: 5,
      icon: '✨',
      estimatedTime: '25 min read',
      pillarNumber: 1
    },
    {
      id: 'pillar-2-finding-our-place',
      title: 'Pillar 2: Finding Our Place',
      subtitle: 'Defining the Bioregion',
      priority: 6,
      icon: '🗺️',
      estimatedTime: '20 min read',
      pillarNumber: 2
    },
    {
      id: 'pillar-3-building-the-vessel',
      title: 'Pillar 3: Building the Vessel',
      subtitle: 'Legal & Institutional Scaffolding',
      priority: 7,
      icon: '⚖️',
      estimatedTime: '30 min read',
      pillarNumber: 3
    },
    {
      id: 'pillar-4-weaving-the-council',
      title: 'Pillar 4: Weaving the Council',
      subtitle: 'Governance Formation',
      priority: 8,
      icon: '🤝',
      estimatedTime: '25 min read',
      pillarNumber: 4
    },
    {
      id: 'pillar-5-installing-the-os',
      title: 'Pillar 5: Installing the OS',
      subtitle: 'Core GGF Framework Integration',
      priority: 9,
      icon: '🌐',
      estimatedTime: '20 min read',
      pillarNumber: 5
    },
    {
      id: 'pillar-6-igniting-the-engine',
      title: 'Pillar 6: Igniting the Engine',
      subtitle: 'Economic Sovereignty',
      priority: 10,
      icon: '💰',
      estimatedTime: '30 min read',
      pillarNumber: 6
    },
    {
      id: 'becoming-a-baz-graduation-and-network-integration',
      title: 'Becoming a BAZ: Graduation and Network Integration',
      priority: 11,
      icon: '🎓',
      estimatedTime: '15 min read'
    }
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Load markdown content for each section
  const loadedContent = {};
  let loadedSections = 0;
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loading bioregional compass the-guide sections for locale:', currentLocale);
  
  for (const section of guideSections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/guides/${currentLocale}/bioregional-compass/the-guide/${section.id}.md`);
      loadedContent[section.id] = await modulePromise;
      loadedSections++;
      if (DEBUG_FRAMEWORK_LOADING) console.log('Successfully loaded section:', section.id, 'in', currentLocale);
      
    } catch (primaryError) {
      if (DEBUG_FRAMEWORK_LOADING) console.warn(`Primary load failed for section ${section.id}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/guides/en/bioregional-compass/the-guide/${section.id}.md`);
        loadedContent[section.id] = await fallbackPromise;
        loadedSections++;
        
        // Track that this section is using English fallback
        if (currentLocale !== 'en') {
          sectionsUsingEnglishFallback.add(section.id);
        }
        if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded section:', section.id, 'in English as fallback');
        
      } catch (fallbackError) {
        if (DEBUG_FRAMEWORK_LOADING) console.warn(`Could not load section ${section.id} in any language:`, fallbackError.message);
        
        // Create a safe placeholder for missing sections
        loadedContent[section.id] = {
          default: function MissingSection() {
            return {
              render: () => ({
                html: `<div class="missing-section-content">
                  <h2>Section "${section.id}" not found</h2>
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
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('Total guide sections loaded:', loadedSections, 'out of', guideSections.length);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Loaded sections:', Object.keys(loadedContent));
  
  // Validate that we have at least the introduction
  if (!loadedContent['introduction']) {
    console.error('Critical: Could not load introduction section');
    throw error(500, {
      message: 'Failed to load bioregional compass guide content',
      details: 'The introduction section could not be loaded'
    });
  }
  
  // Organize sections by type
  const sectionsByType = {
    introduction: guideSections.filter(s => ['introduction', 'how-to-use-this-guide', 'defining-your-minimum-viable-baz'].includes(s.id)),
    pillars: guideSections.filter(s => s.pillarNumber !== undefined),
    graduation: guideSections.filter(s => s.id === 'becoming-a-baz-graduation-and-network-integration')
  };
  
  return {
    guideSections,
    loadedContent,
    sectionsUsingEnglishFallback: Array.from(sectionsUsingEnglishFallback),
    sectionsByType,
    
    // Metadata
    totalSections: guideSections.length,
    totalPillars: sectionsByType.pillars.length,
    totalEstimatedReadTime: guideSections.reduce((total, section) => {
      const timeMatch = section.estimatedTime.match(/(\d+)/);
      return total + (timeMatch ? parseInt(timeMatch[1]) : 0);
    }, 0),
    
    // Guide-specific metadata
    guideType: 'bioregional-compass-the-guide',
    isNarrativeGuide: true,
    hasSequentialFlow: true,
    targetAudience: ['community-leaders', 'bioregional-stewards', 'cooperative-organizers'],
    
    // Debug info
    debug: {
      currentLocale,
      availableSections: Object.keys(loadedContent),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === guideSections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/the-guide'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
