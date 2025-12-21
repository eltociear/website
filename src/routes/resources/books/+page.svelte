<!-- src/routes/resources/books/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  // Animation states
  let isVisible = false;
  let hoveredBook = null;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Book data with cover images and file paths
  $: books = [
    {
      id: 'jordens-forvaltare',
      title: $t('books.jordensForvaltare.title'),
      description: $t('books.jordensForvaltare.description'),
      cover: `${base}/resources/book-cover-jordens-forvaltare.svg`,
      pdfPath: {
        en: `${base}/resources/Jordens_förvaltare.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: '/resources/books/jordens-forvaltare',
      hasOnlineVersion: false,
      category: 'governance',
      year: '2026',
      pages: '68'
    },
    {
      id: 'ai',
      title: $t('books.ai.title'),
      description: $t('books.ai.description'),
      cover: `${base}/resources/book-cover-ai.svg`,
      pdfPath: {
        en: `${base}/resources/AI_as_Catalyst_for_Cognitive_Evolution_-_From_Fragmentation_to_Integration_in_the_Age_of_AI.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: '/resources/books/ai-as-catalyst-for-cognitive-evolution',
      hasOnlineVersion: true,
      category: 'consciousness',
      year: '2025',
      pages: '236'
    },
    {
      id: 'radical-competence',
      title: $t('books.radicalCompetence.title'),
      description: $t('books.radicalCompetence.description'),
      cover: `${base}/resources/book-cover-radical-competence.svg`,
      pdfPath: {
        en: null, // Coming soon
        sv: null
      },
      readOnlinePath: '/resources/books/radical-competence',
      hasOnlineVersion: true,
      category: 'activism',
      year: '2025',
      pages: 'In progress'
    },
    {
      id: 'integration-crisis',
      title: $t('books.integrationCrisis.title'),
      description: $t('books.integrationCrisis.description'),
      cover: `${base}/resources/book-cover-integration-crisis.svg`,
      pdfPath: {
        en: 'https://www.bjornkennethholmstrom.org/books/The_Integration_Crisis.pdf',
        sv: null
      },
      readOnlinePath: 'https://www.bjornkennethholmstrom.org/books/integration-crisis',
      hasOnlineVersion: true,
      isExternal: true, // Indicates external link
      category: 'systems',
      year: '2025',
      pages: '500'
    },
    {
      id: 'global-governance',
      title: $t('books.globalGovernance.title'),
      description: $t('books.globalGovernance.description'),
      cover: `${base}/resources/book-cover-global-governance.svg`,
      pdfPath: {
        en: `${base}/resources/Global_Governance_-_Natural_Steps_Toward_a_Thriving_World.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'governance',
      year: '2025',
      pages: '173'
    },
    {
      id: 'aubi',
      title: $t('books.aubi.title'),
      description: $t('books.aubi.description'),
      cover: `${base}/resources/book-cover-aubi.svg`,
      pdfPath: {
        en: `${base}/resources/Adaptive_Universal_Basic_Income_-_A_New_Social_Contract_for_the_21st_Century.pdf`,
        sv: `${base}/resources/Adaptiv_Universell_Basinkomst_-_Ett_nytt_socialt_kontrakt_för_2000-talet.pdf`
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'economics',
      year: '2025',
      pages: '136'
    },
    {
      id: 'capital-weaver',
      title: $t('books.capitalWeaver.title'),
      description: $t('books.capitalWeaver.description'),
      cover: `${base}/resources/book-cover-the-capital-weaver.svg`,
      pdfPath: {
        en: `${base}/resources/The_Capital_Weaver_-_A_Practical_Guide_to_Regenerative_Investing.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: '/resources/books/the-capital-weaver',
      hasOnlineVersion: true,
      category: 'methodology',
      year: '2025',
      pages: '362'
    },
    {
      id: 'optimizing-reality',
      title: $t('books.optimizingReality.title'),
      description: $t('books.optimizingReality.description'),
      cover: `${base}/resources/book-cover-optimizing-reality.svg`,
      pdfPath: {
        en: `${base}/resources/Optimizing_Reality.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'systems',
      year: '2025',
      pages: '95'
    },
    {
      id: 'reality-sovereignty',
      title: $t('books.realitySovereignty.title'),
      description: $t('books.realitySovereignty.description'),
      cover: `${base}/resources/book-cover-reality-sovereignty-and-consciousness.svg`,
      pdfPath: {
        en: `${base}/resources/Reality,_Sovereignty,_and_Consciousness.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'consciousness',
      year: '2025',
      pages: '164'
    },
    {
      id: 'regenerative-reciprocity',
      title: $t('books.regenerativeReciprocity.title'),
      description: $t('books.regenerativeReciprocity.description'),
      cover: `${base}/resources/book-cover-regenerative-reciprocity.svg`,
      pdfPath: {
        en: `${base}/resources/Regenerative_Reciprocity_-_Systems,_Spirituality,_and_the_Ethics_of_Sustenance_in_a_Diverse_World.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'sustainability',
      year: '2025',
      pages: '214'
    },
    {
      id: 'lmci',
      title: $t('books.lmci.title'),
      description: $t('books.lmci.description'),
      cover: `${base}/resources/book-cover-lmci.svg`,
      pdfPath: {
        en: `${base}/resources/Love,_Meaning,_Connection_-_A_New_Index_for_Measuring_What_Matters.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'metrics',
      year: '2025',
      pages: '222'
    },
    {
      id: 'being',
      title: $t('books.being.title'),
      description: $t('books.being.description'),
      cover: `${base}/resources/book-cover-being.svg`,
      pdfPath: {
        en: `${base}/resources/Being_-_A_Tapestry_of_Existence.pdf`,
        sv: null // Not yet translated
      },
      readOnlinePath: null, // Not available for online reading yet
      category: 'philosophy',
      year: '2025',
      pages: '174'
    }
  ];

  // Category colors for visual organization
  const categoryColors = {
    governance: '#2B4B8C',
    economics: '#2D5F2D',
    systems: '#B8860B',
    consciousness: '#6B5CA5',
    sustainability: '#059669',
    metrics: '#DC2626',
    philosophy: '#7C2D12',
    methodology: '#1E40AF',
    activism: '#7c3aed' // Purple for activism
  };

  // Get category icon
  function getCategoryIcon(category) {
    const icons = {
      governance: '🏛️',
      economics: '💰',
      systems: '⚙️',
      consciousness: '🧠',
      sustainability: '🌱',
      metrics: '📊',
      philosophy: '🤔',
      methodology: '🔬',
      activism: '✊'
    };
    return icons[category] || '📚';
  }

  // Handle book hover
  function handleBookHover(bookId) {
    hoveredBook = bookId;
  }

  function handleBookLeave() {
    hoveredBook = null;
  }

  // Get current language from locale store
  $: currentLanguage = $locale || 'en';

  // Helper function to get the appropriate PDF path and download label
  function getPdfInfo(book, currentLang) {
    const availablePdf = book.pdfPath[currentLang];
    const fallbackPdf = book.pdfPath.en;
    
    if (availablePdf) {
      // PDF available in current language
      return {
        path: availablePdf,
        label: $t('books.actions.downloadPdf'),
        isTranslated: true
      };
    } else if (fallbackPdf && currentLang !== 'en') {
      // PDF only available in English, show language indicator
      return {
        path: fallbackPdf,
        label: `${$t('books.actions.downloadPdf')} (${$t('common.languages.english')})`,
        isTranslated: false
      };
    } else if (fallbackPdf) {
      // Current language is English, just show normal label
      return {
        path: fallbackPdf,
        label: $t('books.actions.downloadPdf'),
        isTranslated: true
      };
    }
    
    // No PDF available
    return {
      path: null,
      label: $t('books.actions.notAvailable'),
      isTranslated: false
    };
  }

  function trackDownload(type, title) {
    // Analytics tracking would go here
    console.log(`Downloaded ${type}: ${title}`);
  }
</script>

<svelte:head>
  <title>{$t('books.meta.title')}</title>
  <meta name="description" content="{$t('books.meta.description')}" />
  <meta property="og:title" content="{$t('books.meta.title')}" />
  <meta property="og:description" content="{$t('books.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Books Page -->
<div class="books-page" class:visible={isVisible}>
  
  <!-- Breadcrumb Navigation -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a href="/resources" class="breadcrumb-link">
            <span class="breadcrumb-icon">📚</span>
            {$t('books.breadcrumb.resources')}
          </a>
        </li>
        <li class="breadcrumb-separator" aria-hidden="true">›</li>
        <li class="breadcrumb-item breadcrumb-current" aria-current="page">
          <span class="breadcrumb-current-text">
            {$t('books.breadcrumb.books')}
          </span>
        </li>
      </ol>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="books-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{$t('books.hero.title')}</h1>
        <p class="hero-subtitle">{$t('books.hero.subtitle')}</p>
        <p class="hero-description">{$t('books.hero.description')}</p>
      </div>
    </div>
  </section>

  <!-- Books Section -->
  <section class="books-section">
    <div class="container">
      <div class="books-grid">
        {#each books as book (book.id)}
          <div 
            class="book-card"
            class:hovered={hoveredBook === book.id}
            on:mouseenter={() => handleBookHover(book.id)}
            on:mouseleave={handleBookLeave}
            role="article"
            tabindex="0"
          >
            <div class="book-cover-container">
              <img 
                src={book.cover} 
                alt="{book.title} {$t('common.ui.bookCover')}"
                class="book-cover"
                loading="lazy"
              />
              <div 
                class="category-badge"
                style="background-color: {categoryColors[book.category]};"
              >
                <span class="category-icon">{getCategoryIcon(book.category)}</span>
                <span class="category-text">{$t(`books.categories.${book.category}`)}</span>
              </div>
            </div>
            
            <div class="book-content">
              <h3 class="book-title">{book.title}</h3>
              <p class="book-description">{book.description}</p>
              
              <div class="book-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span class="meta-text">{book.year}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📄</span>
                  <span class="meta-text">{book.pages} {$t('common.ui.pages')}</span>
                </div>
              </div>

              <div class="book-actions">
                {#if book.hasOnlineVersion && book.readOnlinePath}
                  <a 
                    href={book.readOnlinePath}
                    class="read-online-button primary"
                    target={book.isExternal ? '_blank' : '_self'}
                    rel={book.isExternal ? 'noopener noreferrer' : ''}
                  >
                    <span class="button-icon">📖</span>
                    {book.isExternal ? $t('books.actions.readExternal') : $t('books.actions.readOnline')}
                    {#if book.isExternal}
                      <span class="external-icon">↗</span>
                    {/if}
                  </a>
                {/if}

                {#if getPdfInfo(book, currentLanguage).path}
                  {@const pdfInfo = getPdfInfo(book, currentLanguage)}
                  <a 
                    href={pdfInfo.path}
                    class="download-button"
                    class:secondary={book.hasOnlineVersion}
                    class:primary={!book.hasOnlineVersion}
                    class:untranslated={!pdfInfo.isTranslated}
                    download
                    on:click={() => trackDownload('Book', book.title)}
                  >
                    <span class="button-icon">📥</span>
                    {pdfInfo.label}
                  </a>
                {:else}
                  <button class="download-button disabled" disabled>
                    <span class="button-icon">📥</span>
                    {$t('books.actions.comingSoon')}
                  </button>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

</div>

<style>
  /* Base Styles */
  .books-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .books-page.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .hero-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  /* Breadcrumb Navigation */
  .breadcrumb {
    padding: 1rem 0;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .breadcrumb-list {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0.875rem;
  }

  .breadcrumb-item {
    display: flex;
    align-items: center;
  }

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #2563eb;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
    font-weight: 500;
  }

  .breadcrumb-link:hover {
    color: #1d4ed8;
    background-color: rgba(37, 99, 235, 0.05);
    text-decoration: underline;
  }

  .breadcrumb-link:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.1);
  }

  .breadcrumb-icon {
    font-size: 0.9rem;
  }

  .breadcrumb-separator {
    margin: 0 0.5rem;
    color: #9ca3af;
    font-weight: 300;
    user-select: none;
  }

  .breadcrumb-current {
    color: #374151;
  }

  .breadcrumb-current-text {
    font-weight: 600;
    color: #1f2937;
  }

  /* Hero Section */
  .books-hero {
    padding: 3rem 0 2rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
    text-align: center;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    color: #cbd5e1;
    margin-bottom: 1.5rem;
    font-weight: 300;
  }

  .hero-description {
    font-size: 1.1rem;
    color: #e2e8f0;
    line-height: 1.6;
    margin: 0;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Books Section */
  .books-section {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .books-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .book-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }

  .book-card:hover,
  .book-card.hovered {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }

  .book-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .book-cover-container {
    position: relative;
    height: 240px;
    overflow: hidden;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  }

  .book-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .book-card:hover .book-cover {
    transform: scale(1.05);
  }

  .category-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .category-icon {
    font-size: 0.9rem;
  }

  .category-text {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .book-content {
    padding: 1.5rem;
  }

  .book-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  .book-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .book-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .meta-icon {
    font-size: 0.9rem;
  }

  .meta-text {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }

  .book-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* Button Styles */
  .download-button,
  .read-online-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    min-width: 140px;
    justify-content: center;
  }

  .read-online-button.primary,
  .download-button.primary {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  }

  .read-online-button.primary:hover,
  .download-button.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  .download-button.secondary {
    background: white;
    color: #475569;
    border: 1px solid #d1d5db;
  }

  .download-button.secondary:hover {
    background: #f8fafc;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  .download-button.disabled {
    background: #f1f5f9;
    color: #9ca3af;
    cursor: not-allowed;
    border: 1px solid #e5e7eb;
  }

  .button-icon {
    font-size: 1rem;
  }

  .external-icon {
    font-size: 0.8rem;
    margin-left: 0.25rem;
    opacity: 0.8;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .books-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.125rem;
    }

    .books-grid {
      grid-template-columns: 1fr;
    }

    .book-cover-container {
      height: 200px;
    }

    .book-content {
      padding: 1.25rem;
    }

    .book-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .book-actions {
      flex-direction: column;
    }

    .download-button,
    .read-online-button {
      justify-content: center;
    }

    .breadcrumb-list {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .breadcrumb-separator {
      margin: 0 0.375rem;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .book-title {
      font-size: 1.1rem;
    }

    .book-description {
      font-size: 0.9rem;
    }

    .category-badge {
      font-size: 0.75rem;
      padding: 0.375rem 0.625rem;
    }
  }
</style>
