// src/routes/resources/books/ai-as-catalyst-for-cognitive-evolution/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Book +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load book translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains chapter/section names instead of the base path)
    if (cleanPath.includes('/resources/books/') && 
        (cleanPath.includes('dedication') || 
         cleanPath.includes('table-of-contents') ||
         cleanPath.includes('introduction') ||
         cleanPath.includes('chapter-') ||
         cleanPath.includes('conclusion') ||
         cleanPath.includes('appendix-') ||
         cleanPath.includes('notes-and-references') ||
         cleanPath.includes('acknowledgments') ||
         cleanPath.includes('about'))) {
      
      console.log('⚠️ Detected corrupted pathname, correcting to base book path');
      cleanPath = '/resources/books/ai-as-catalyst-for-cognitive-evolution';
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

  // Define book sections to load in correct reading order
  const sections = [
    // Front matter
    'dedication',
    'table-of-contents',
    'introduction',
    
    // Main chapters
    'chapter-1',
    'chapter-2',
    'chapter-3',
    'chapter-4',
    'chapter-5',
    'chapter-6',
    'chapter-7',
    'chapter-8',
    'chapter-9',
    'chapter-10',
    'chapter-11',
    'chapter-12',
    'chapter-13',
    'chapter-14',
    'chapter-15',
    'chapter-16',
    'chapter-17',
    'chapter-18',
    
    // Back matter
    'conclusion',
    'appendix-a',
    'appendix-b',
    'appendix-c',
    'notes-and-references',
    'acknowledgments',
    'about'
  ];
  
  // Track which sections fell back to English
  const sectionsUsingEnglishFallback = new Set();
  
  // Try to load modular content
  const content = {};
  let loadedSections = 0;
  
  console.log('Loading book sections for locale:', currentLocale);
  
  // Try to load each section with proper error handling
  for (const section of sections) {
    try {
      // Try to load the current locale version first
      const modulePromise = import(`$lib/content/books/${currentLocale}/ai-catalyst/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/books/en/ai-catalyst/${section}.md`);
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
  
  // Validate that we have at least the introduction section
  if (!content.introduction) {
    console.error('Critical: Could not load introduction section');
    throw error(500, {
      message: 'Failed to load book content',
      details: 'The main introduction section could not be loaded'
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
    
    // Book-specific metadata
    bookType: 'ai-as-catalyst-for-cognitive-evolution',
    totalSections: sections.length,
    frontMatterSections: 3, // dedication, table-of-contents, introduction
    chapterSections: 18, // chapter-1 through chapter-18
    backMatterSections: 6, // conclusion, appendices, notes, acknowledgments, about
    hasTableOfContents: true,
    
    // Book-specific metadata
    bookVersion: '1.0',
    isbn: null, // Add when available
    publicationYear: 2025,
    totalChapters: 18,
    hasAppendices: true,
    appendixCount: 3,
    
    // Content organization
    parts: {
      'Part I: The Cognitive Gap': ['chapter-1', 'chapter-2', 'chapter-3'],
      'Part II: AI as Scaffolding for Development': ['chapter-4', 'chapter-5', 'chapter-6', 'chapter-7'],
      'Part III: The Risks of Unconscious Development': ['chapter-8', 'chapter-9', 'chapter-10', 'chapter-11'],
      'Part IV: The Governance Imperative': ['chapter-12', 'chapter-13', 'chapter-14', 'chapter-15'],
      'Part V: Scenarios for the Future': ['chapter-16', 'chapter-17', 'chapter-18']
    },
    
    // Reading metadata
    estimatedReadingTime: '8-12 hours',
    complexity: 'advanced',
    audience: 'policymakers, technologists, consciousness researchers',
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/resources/books/ai-as-catalyst-for-cognitive-evolution'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
