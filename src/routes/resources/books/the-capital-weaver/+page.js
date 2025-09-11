// src/routes/resources/books/the-capital-weaver/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export const csr = true;

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  console.log('=== Capital Weaver Book +page.js load function ===');
  console.log('URL pathname:', url.pathname);
  console.log('Current locale:', currentLocale);
  
  // Load book translations for navigation and page-specific translations
  try {
    let cleanPath = url.pathname;
    
    console.log('Original pathname:', cleanPath);
    
    // Check if the pathname looks corrupted (contains chapter/section names instead of the base path)
    if (cleanPath.includes('/resources/books/') && 
        (cleanPath.includes('preface') || 
         cleanPath.includes('table-of-contents') ||
         cleanPath.includes('introduction') ||
         cleanPath.includes('chapter-') ||
         cleanPath.includes('appendix-') ||
         cleanPath.includes('glossary') ||
         cleanPath.includes('further-reading') ||
         cleanPath.includes('about'))) {
      
      console.log('⚠️ Detected corrupted pathname, correcting to base book path');
      cleanPath = '/resources/books/the-capital-weaver';
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
    'book-cover',
    'quick-reference',
    'how-to-use-this-book',
    'table-of-contents',
    'preface',
    'introduction',
    
    // Part I: A New Logic - The Five Principles
    'chapter-1',  // Community Sovereignty
    'chapter-2',  // Stewardship Over Ownership
    'chapter-3',  // Polycentric Resilience
    'chapter-4',  // Return on Regeneration
    'chapter-5',  // The Primacy of Right Relationship
    
    // Part II: The Practice - A Toolkit for Capital Weavers
    'chapter-6',  // The Regenerative Capital Scorecard
    'chapter-7',  // Capital Stacks for Regeneration
    'chapter-8',  // The Four Roles of a Capital Weaver
    'chapter-9',  // Assurance & Right-Relations Governance
    'chapter-10', // Portfolio Design & Risk
    'chapter-11', // The Regenerative Investment Thesis
    
    // Part III: Go Further - The GGF as Operating System
    'chapter-12', // The Inevitable Upgrade
    'chapter-13', // The GGF - An Economy Built for Regeneration
    'chapter-14', // Your First Steps on the Regenerative Path
    
    // Back matter
    'glossary',
    'further-reading',
    'appendix-a',
    'appendix-b',
    'appendix-c',
    'appendix-d',
    'appendix-e',
    'appendix-f',
    'appendix-g',
    'appendix-h',
    'appendix-i',
    'appendix-j',
    'appendix-k',
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
      const modulePromise = import(`$lib/content/books/${currentLocale}/the-capital-weaver/${section}.md`);
      content[section] = await modulePromise;
      loadedSections++;
      console.log('Successfully loaded section:', section, 'in', currentLocale);
      
    } catch (primaryError) {
      console.warn(`Primary load failed for section ${section}:`, primaryError.message);
      
      // Fall back to English if translation isn't available
      try {
        const fallbackPromise = import(`$lib/content/books/en/the-capital-weaver/${section}.md`);
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
    bookType: 'the-capital-weaver',
    totalSections: sections.length,
    frontMatterSections: 6, // quick-reference, how-to-use, table-of-contents, preface, introduction
    chapterSections: 14, // chapter-1 through chapter-14
    backMatterSections: 13, // glossary, further-reading, appendices, about
    hasTableOfContents: true,
    
    // Book-specific metadata
    bookVersion: '1.0',
    isbn: null, // Add when available
    publicationYear: 2025,
    totalChapters: 14,
    hasAppendices: true,
    appendixCount: 11,
    
    // Content organization
    parts: {
      'Part I: A New Logic - The Five Principles': ['chapter-1', 'chapter-2', 'chapter-3', 'chapter-4', 'chapter-5'],
      'Part II: The Practice - A Toolkit for Capital Weavers': ['chapter-6', 'chapter-7', 'chapter-8', 'chapter-9', 'chapter-10', 'chapter-11'],
      'Part III: Go Further - The GGF as Operating System': ['chapter-12', 'chapter-13', 'chapter-14']
    },
    
    // Reading metadata
    estimatedReadingTime: '6-8 hours',
    complexity: 'intermediate-advanced',
    audience: 'investors, philanthropists, impact investors, community funds, family offices',
    
    // Debug information
    debug: {
      currentLocale,
      availableSections: Object.keys(content),
      fallbackSections: Array.from(sectionsUsingEnglishFallback),
      loadSuccess: loadedSections === sections.length,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/resources/books/the-capital-weaver'
      },
      // Only log search params on client side
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
