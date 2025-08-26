<!-- src/routes/resources/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  // Animation states
  let isVisible = false;
  let hoveredBook = null;
  let hoveredWhitePaper = null;
  
  onMount(() => {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  });

  // Book data with cover images and file paths
  $: books = [
    {
      id: 'ai',
      title: $t('resources.books.ai.title'),
      description: $t('resources.books.ai.description'),
      cover: `${base}/resources/book-cover-ai.svg`,
      pdfPath: {
        en: `${base}/resources/AI_as_Catalyst_for_Cognitive_Evolution_-_From_Fragmentation_to_Integration_in_the_Age_of_AI.pdf`,
        sv: null // Not yet translated
      },
      category: 'consciousness',
      year: '2025',
      pages: '236'
    },
    {
      id: 'global-governance',
      title: $t('resources.books.globalGovernance.title'),
      description: $t('resources.books.globalGovernance.description'),
      cover: `${base}/resources/book-cover-global-governance.svg`,
      pdfPath: {
        en: `${base}/resources/Global_Governance_-_Natural_Steps_Toward_a_Thriving_World.pdf`,
        sv: null // Not yet translated
      },
      category: 'governance',
      year: '2025',
      pages: '173'
    },
    {
      id: 'aubi',
      title: $t('resources.books.aubi.title'),
      description: $t('resources.books.aubi.description'),
      cover: `${base}/resources/book-cover-aubi.svg`,
      pdfPath: {
        en: `${base}/resources/Adaptive_Universal_Basic_Income_-_A_New_Social_Contract_for_the_21st_Century.pdf`,
        sv: `${base}/resources/Adaptiv_Universell_Basinkomst_-_Ett_nytt_socialt_kontrakt_för_2000-talet.pdf`
      },
      category: 'economics',
      year: '2025',
      pages: '136'
    },
    {
      id: 'optimizing-reality',
      title: $t('resources.books.optimizingReality.title'),
      description: $t('resources.books.optimizingReality.description'),
      cover: `${base}/resources/book-cover-optimizing-reality.svg`,
      pdfPath: {
        en: `${base}/resources/Optimizing_Reality.pdf`,
        sv: null // Not yet translated
      },
      category: 'systems',
      year: '2025',
      pages: '95'
    },
    {
      id: 'reality-sovereignty',
      title: $t('resources.books.realitySovereignty.title'),
      description: $t('resources.books.realitySovereignty.description'),
      cover: `${base}/resources/book-cover-reality-sovereignty-and-consciousness.svg`,
      pdfPath: {
        en: `${base}/resources/Reality,_Sovereignty,_and_Consciousness.pdf`,
        sv: null // Not yet translated
      },
      category: 'consciousness',
      year: '2025',
      pages: '164'
    },
    {
      id: 'regenerative-reciprocity',
      title: $t('resources.books.regenerativeReciprocity.title'),
      description: $t('resources.books.regenerativeReciprocity.description'),
      cover: `${base}/resources/book-cover-regenerative-reciprocity.svg`,
      pdfPath: {
        en: `${base}/resources/Regenerative_Reciprocity_-_Systems,_Spirituality,_and_the_Ethics_of_Sustenance_in_a_Diverse_World.pdf`,
        sv: null // Not yet translated
      },
      category: 'sustainability',
      year: '2025',
      pages: '214'
    },
    {
      id: 'lmci',
      title: $t('resources.books.lmci.title'),
      description: $t('resources.books.lmci.description'),
      cover: `${base}/resources/book-cover-lmci.svg`,
      pdfPath: {
        en: `${base}/resources/Love,_Meaning,_Connection_-_A_New_Index_for_Measuring_What_Matters.pdf`,
        sv: null // Not yet translated
      },
      category: 'metrics',
      year: '2025',
      pages: '222'
    },
    {
      id: 'being',
      title: $t('resources.books.being.title'),
      description: $t('resources.books.being.description'),
      cover: `${base}/resources/book-cover-being.svg`,
      pdfPath: {
        en: `${base}/resources/Being_-_A_Tapestry_of_Existence.pdf`,
        sv: null // Not yet translated
      },
      category: 'philosophy',
      year: '2025',
      pages: '174'
    }
  ];

  // White papers data
  $: whitePapers = [
    {
      id: 'cognitive-scaffolding',
      title: $t('resources.whitePapers.cognitiveScaffolding.title'),
      description: $t('resources.whitePapers.cognitiveScaffolding.description'),
      pdfPath: `${base}/resources/whitepapers/Cognitive_Scaffolding_-_A_Multi-Model_AI_Synthesis_Method.pdf`,
      onlineReadPath: `${base}/resources/whitepapers/cognitive-scaffolding`,
      category: 'methodology',
      year: '2025',
      pages: '19',
      status: 'published'
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
    methodology: '#1E40AF'
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
      methodology: '🔬'
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

  // Handle white paper hover
  function handleWhitePaperHover(paperId) {
    hoveredWhitePaper = paperId;
  }

  function handleWhitePaperLeave() {
    hoveredWhitePaper = null;
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
        label: $t('resources.actions.downloadPdf'),
        isTranslated: true
      };
    } else if (fallbackPdf && currentLang !== 'en') {
      // PDF only available in English, show language indicator
      return {
        path: fallbackPdf,
        label: `${$t('resources.actions.downloadPdf')} (${$t('common.languages.english')})`,
        isTranslated: false
      };
    } else if (fallbackPdf) {
      // Current language is English, just show normal label
      return {
        path: fallbackPdf,
        label: $t('resources.actions.downloadPdf'),
        isTranslated: true
      };
    }
    
    // No PDF available
    return {
      path: null,
      label: $t('resources.actions.notAvailable'),
      isTranslated: false
    };
  }
</script>

<svelte:head>
  <title>{$t('resources.meta.title')}</title>
  <meta name="description" content="{$t('resources.meta.description')}" />
  <meta property="og:title" content="{$t('resources.meta.title')}" />
  <meta property="og:description" content="{$t('resources.meta.description')}" />
  <meta property="og:type" content="website" />
</svelte:head>

<!-- Resources Page -->
<div class="resources-page" class:visible={isVisible}>
  
  <!-- Hero Section -->
  <section class="resources-hero">
    <div class="hero-container">
      <div class="hero-content">
        <h1 class="hero-title">{$t('resources.hero.title')}</h1>
        <p class="hero-subtitle">{$t('resources.hero.subtitle')}</p>
        <p class="hero-description">{$t('resources.hero.description')}</p>
      </div>
    </div>
  </section>

  <!-- Books Section -->
  <section class="books-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">📚</span>
          {$t('resources.books.title')}
        </h2>
        <p class="section-description">{$t('resources.books.description')}</p>
      </div>

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
                <span class="category-text">{$t(`resources.categories.${book.category}`)}</span>
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
                {#if getPdfInfo(book, currentLanguage).path}
                  {@const pdfInfo = getPdfInfo(book, currentLanguage)}
                  <a 
                    href={pdfInfo.path}
                    class="download-button primary"
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
                    {$t('resources.actions.comingSoon')}
                  </button>
                {/if}
                
                <!-- Preview button (future feature) -->
                <!-- 
                <button class="preview-button secondary" disabled>
                  <span class="button-icon">👁️</span>
                  {$t('resources.actions.preview')}
                </button>
                -->
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- White Papers Section -->
  <section class="whitepapers-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">📋</span>
          {$t('resources.whitePapers.title')}
        </h2>
        <p class="section-description">{$t('resources.whitePapers.description')}</p>
      </div>

      <div class="whitepapers-grid">
        {#each whitePapers as paper (paper.id)}
          <div 
            class="whitepaper-card"
            class:hovered={hoveredWhitePaper === paper.id}
            on:mouseenter={() => handleWhitePaperHover(paper.id)}
            on:mouseleave={handleWhitePaperLeave}
            role="article"
            tabindex="0"
          >
            <div class="paper-header">
              <div 
                class="paper-category"
                style="background-color: {categoryColors[paper.category]};"
              >
                <span class="category-icon">{getCategoryIcon(paper.category)}</span>
                <span class="category-text">{$t(`resources.categories.${paper.category}`)}</span>
              </div>
              
              {#if paper.status === 'published'}
                <div class="status-badge published">
                  <span class="status-icon">✅</span>
                  <span class="status-text">{$t('resources.status.published')}</span>
                </div>
              {:else if paper.status === 'draft'}
                <div class="status-badge draft">
                  <span class="status-icon">✏️</span>
                  <span class="status-text">{$t('resources.status.draft')}</span>
                </div>
              {/if}
            </div>
            
            <div class="paper-content">
              <h3 class="paper-title">{paper.title}</h3>
              <p class="paper-description">{paper.description}</p>
              
              <div class="paper-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span class="meta-text">{paper.year}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📄</span>
                  <span class="meta-text">{paper.pages} {$t('common.ui.pages')}</span>
                </div>
              </div>

              <div class="paper-actions">
                <a 
                  href={paper.onlineReadPath}
                  class="read-online-button primary"
                >
                  <span class="button-icon">👁️</span>
                  {$t('resources.actions.readOnline')}
                </a>
                
                <a 
                  href={paper.pdfPath}
                  class="download-button secondary"
                  download
                  on:click={() => trackDownload('White Paper', paper.title)}
                >
                  <span class="button-icon">📥</span>
                  {$t('resources.actions.downloadPdf')}
                </a>
                
                <!-- Citation button (future feature) -->
                <!--
                <button class="citation-button tertiary">
                  <span class="button-icon">📝</span>
                  {$t('resources.actions.getCitation')}
                </button>
                -->
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Coming Soon Placeholder -->
      <div class="coming-soon-card">
        <div class="coming-soon-content">
          <div class="coming-soon-icon">🚀</div>
          <h3 class="coming-soon-title">{$t('resources.comingSoon.title')}</h3>
          <p class="coming-soon-description">{$t('resources.comingSoon.description')}</p>
          <div class="coming-soon-topics">
            {#each $t('resources.comingSoon.topics') as topic}
              <span class="topic-tag">{topic}</span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Future Possibilities Section -->
  <section class="future-possibilities">
    <div class="container">
      <div class="future-content">
        <h2 class="future-title">{$t('resources.future.title')}</h2>
        <p class="future-description">{$t('resources.future.description')}</p>
        
        <div class="possibility-types">
          <div class="possibility-type">
            <div class="type-icon">🎥</div>
            <h3 class="type-title">{$t('resources.future.types.videos.title')}</h3>
            <p class="type-description">{$t('resources.future.types.videos.description')}</p>
          </div>
          
          <div class="possibility-type">
            <div class="type-icon">🎧</div>
            <h3 class="type-title">{$t('resources.future.types.podcasts.title')}</h3>
            <p class="type-description">{$t('resources.future.types.podcasts.description')}</p>
          </div>
          
          <div class="possibility-type">
            <div class="type-icon">📰</div>
            <h3 class="type-title">{$t('resources.future.types.articles.title')}</h3>
            <p class="type-description">{$t('resources.future.types.articles.description')}</p>
          </div>
        </div>

        <div class="get-involved-cta">
          <h3 class="cta-title">{$t('resources.getInvolved.title')}</h3>
          <p class="cta-description">{$t('resources.getInvolved.description')}</p>
          <div class="cta-buttons">
            <a href="{base}/get-involved" class="cta-button primary">
              {$t('resources.getInvolved.button')}
            </a>
            <a href="{base}/about" class="cta-button secondary">
              {$t('resources.getInvolved.learnMore')}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>

<style>
  /* Base Styles */
  .resources-page {
    min-height: 100vh;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .resources-page.visible {
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

  /* Hero Section */
  .resources-hero {
    padding: 4rem 0 2rem 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%);
    color: white;
    text-align: center;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.5rem;
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

  /* Section Headers */
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .section-icon {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1.2rem;
    color: #475569;
    line-height: 1.6;
    margin: 0;
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

  /* White Papers Section */
  .whitepapers-section {
    padding: 4rem 0;
    background: white;
  }

  .whitepapers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .whitepaper-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }

  .whitepaper-card:hover,
  .whitepaper-card.hovered {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  .whitepaper-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .paper-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .paper-category {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .status-badge.published {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .status-badge.draft {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  .status-icon {
    font-size: 0.8rem;
  }

  .status-text {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .paper-content {
    flex: 1;
  }

  .paper-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  .paper-description {
    color: #475569;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .paper-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .paper-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* Coming Soon Card */
  .coming-soon-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 2px dashed #3b82f6;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    margin-top: 1rem;
  }

  .coming-soon-content {
    max-width: 500px;
    margin: 0 auto;
  }

  .coming-soon-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .coming-soon-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 0.75rem;
  }

  .coming-soon-description {
    color: #1e40af;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .coming-soon-topics {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .topic-tag {
    background: white;
    color: #1e40af;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid #3b82f6;
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

  .read-online-button.primary {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  }

  .read-online-button.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  .download-button.primary {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
  }

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

  .download-button.tertiary {
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }

  .download-button.tertiary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }

  .button-icon {
    font-size: 1rem;
  }

  /* Additional Resources Section */
  .additional-resources {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
  }

  .additional-content {
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  .additional-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .additional-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .resource-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .resource-type {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
  }

/* Complete the cut-off styles from where it left off */
  .type-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .type-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .type-description {
    color: #64748b;
    line-height: 1.5;
    font-size: 0.95rem;
  }

  /* Future Possibilities Section */
  .future-possibilities {
    padding: 4rem 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-top: 1px solid #e2e8f0;
  }

  .future-content {
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  .future-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 1rem;
  }

  .future-description {
    font-size: 1.1rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 3rem;
  }

  .possibility-types {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .possibility-type {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    position: relative;
  }

  .possibility-type::before {
    content: '🔮';
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 1.5rem;
    background: white;
    border-radius: 50%;
    padding: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* Get Involved CTA */
  .get-involved-cta {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
  }

  .cta-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .cta-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s ease;
    min-width: 160px;
    justify-content: center;
  }

  .cta-button.primary {
    background: #fbbf24;
    color: #1e40af;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  }

  .cta-button.primary:hover {
    background: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(251, 191, 36, 0.4);
  }

  .cta-button.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .books-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .whitepapers-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .section-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-icon {
      font-size: 1.5rem;
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

    .book-meta,
    .paper-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .book-actions,
    .paper-actions {
      flex-direction: column;
    }

    .download-button {
      justify-content: center;
    }

    .paper-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .whitepaper-card {
      padding: 1.5rem;
    }

    .resource-types {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .future-possibilities {
      padding: 3rem 0;
    }

    .possibility-types {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .get-involved-cta {
      padding: 2rem;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-button {
      width: 100%;
      max-width: 250px;
    }

    .coming-soon-topics {
      justify-content: flex-start;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-description {
      font-size: 1rem;
    }

    .section-title {
      font-size: 1.75rem;
    }

    .book-title,
    .paper-title {
      font-size: 1.1rem;
    }

    .book-description,
    .paper-description {
      font-size: 0.9rem;
    }

    .category-badge,
    .paper-category {
      font-size: 0.75rem;
      padding: 0.375rem 0.625rem;
    }

    .coming-soon-icon {
      font-size: 2.5rem;
    }

    .coming-soon-title {
      font-size: 1.25rem;
    }

    .additional-title {
      font-size: 1.75rem;
    }

    .future-title {
      font-size: 1.75rem;
    }

    .cta-title {
      font-size: 1.25rem;
    }

    .cta-description {
      font-size: 1rem;
    }
  }

  /* Focus and accessibility improvements */
  .book-card:focus-visible,
  .whitepaper-card:focus-visible {
    outline: 3px solid #3b82f6;
    outline-offset: 2px;
  }

  .download-button:focus-visible,
  .cta-button:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
  }

  /* Loading states for future enhancements */
  .book-cover[loading] {
    background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  /* Print styles */
  @media print {
    .resources-page {
      background: white !important;
    }
    
    .resources-hero,
    .books-section,
    .whitepapers-section,
    .future-possibilities {
      background: white !important;
      color: black !important;
    }
    
    .book-card,
    .whitepaper-card {
      break-inside: avoid;
      box-shadow: none !important;
      border: 1px solid #ccc !important;
    }
    
    .download-button,
    .cta-button {
      display: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .book-card,
    .whitepaper-card {
      border-width: 2px;
    }
    
    .category-badge,
    .paper-category,
    .status-badge {
      border: 1px solid currentColor;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .resources-page,
    .book-card,
    .whitepaper-card,
    .book-cover,
    .download-button,
    .cta-button {
      transition: none;
    }
    
    .book-card:hover .book-cover {
      transform: none;
    }
    
    @keyframes shimmer {
      0%, 100% {
        background-position: 0 0;
      }
    }
  }
</style>
