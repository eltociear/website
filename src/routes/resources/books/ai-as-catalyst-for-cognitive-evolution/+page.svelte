<!-- src/routes/resources/books/ai-as-catalyst-for-cognitive-evolution/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: bf = translationsReady ? ($t('booksAiCatalyst') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'dedication';
  let mounted = false;
  let isPrintMode = false;
  let frontMatterOpen = true;
  let part1Open = false;
  let part2Open = false;
  let part3Open = false;
  let part4Open = false;
  let part5Open = false;
  let backMatterOpen = false;

  // Book structure from data.parts
  $: bookParts = data?.parts || {};
  $: frontMatterSections = ['dedication', 'table-of-contents', 'introduction'];
  $: backMatterSections = ['conclusion', 'appendix-a', 'appendix-b', 'appendix-c', 'notes-and-references', 'acknowledgments', 'about'];
  $: chapterSections = Object.keys(data?.sections || {}).filter(section => section.startsWith('chapter-'));

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: isChapter = activeSection.startsWith('chapter-');
  $: isFrontMatter = frontMatterSections.includes(activeSection);
  $: isBackMatter = backMatterSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    frontMatterOpen = frontMatterSections.includes(activeSection);
    backMatterOpen = backMatterSections.includes(activeSection);
    
    // Check which part contains the active chapter
    Object.entries(bookParts).forEach(([partName, chapters]) => {
      if (chapters.includes(activeSection)) {
        if (partName.includes('Part I')) part1Open = true;
        else if (partName.includes('Part II')) part2Open = true;
        else if (partName.includes('Part III')) part3Open = true;
        else if (partName.includes('Part IV')) part4Open = true;
        else if (partName.includes('Part V')) part5Open = true;
      }
    });
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/resources/books/ai-as-catalyst-for-cognitive-evolution') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/resources/books/ai-as-catalyst-for-cognitive-evolution${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/resources/books/ai-as-catalyst-for-cognitive-evolution');
        } catch (e) {
          console.error('Failed to reload translations:', e);
        }
      }
      
      // Set initial section from URL
      const urlParams = new URLSearchParams(window.location.search);
      isPrintMode = urlParams.get('print') === 'true';
      
      const sectionParam = urlParams.get('section');
      const hashSection = (extractedHash || window.location.hash).substring(1);
      
      if (sectionParam && data?.sections?.[sectionParam]) {
        activeSection = sectionParam;
      } else if (hashSection && data?.sections?.[hashSection]) {
        activeSection = hashSection;
      }
      
      initializeAccordionStates();
      
      // Global function for PDF generation
      window.showAllSectionsForPrint = () => { isPrintMode = true; };
      
      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          initializeAccordionStates();
          
          // Scroll to content
          setTimeout(() => {
            const contentElement = document.querySelector('.section-content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
  });

  // Function to set active section
  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    initializeAccordionStates();
    
    if (browser) {
      const newUrl = `/resources/books/ai-as-catalyst-for-cognitive-evolution${window.location.search}#${section}`;
      history.replaceState(null, '', newUrl);

      setTimeout(() => {
        const contentElement = document.querySelector('.section-content');
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 100);
    }
  }

  // Translation helper functions with fallbacks
  function getSectionTitle(section) {
    return translationsReady ? (bf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getPartTitle(partKey) {
    return translationsReady ? (bf.parts?.[partKey] || partKey) : partKey;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (bf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the book PDF
  function downloadBook(version = '') {
    // For now, only English PDF is available
    const pdfUrl = `/static/resources/AI_as_Catalyst_for_Cognitive_Evolution_-_From_Fragmentation_to_Integration_in_the_Age_of_AI.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `AI_as_Catalyst_for_Cognitive_Evolution.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Check if current locale has full translation support
  $: hasFullTranslation = currentLocale === 'en';
  $: hasPdfTranslation = currentLocale === 'en';

  // Accordion toggle functions
  function toggleFrontMatter() { frontMatterOpen = !frontMatterOpen; }
  function togglePart1() { part1Open = !part1Open; }
  function togglePart2() { part2Open = !part2Open; }
  function togglePart3() { part3Open = !part3Open; }
  function togglePart4() { part4Open = !part4Open; }
  function togglePart5() { part5Open = !part5Open; }
  function toggleBackMatter() { backMatterOpen = !backMatterOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }

  // Helper function to get current chapter number
  function getCurrentChapter() {
    if (!isChapter) return null;
    return parseInt(activeSection.replace('chapter-', ''));
  }

  // Helper function to get next/previous sections
  function getNextSection() {
    const allSections = Object.keys(data?.sections || {});
    const currentIndex = allSections.indexOf(activeSection);
    return currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;
  }

  function getPreviousSection() {
    const allSections = Object.keys(data?.sections || {});
    const currentIndex = allSections.indexOf(activeSection);
    return currentIndex > 0 ? allSections[currentIndex - 1] : null;
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('booksAiCatalyst.meta.title', 'AI as Catalyst for Cognitive Evolution - Complete Book')}</title>
  <meta name="description" content="{getTextWithFallback('booksAiCatalyst.meta.description', 'A comprehensive exploration of how artificial intelligence can catalyze human cognitive evolution from fragmentation to integration.')}" />
</svelte:head>

{#if mounted}
  <div class="book-container">
    <!-- Book Navigation Sidebar -->
    {#if !isPrintMode}
      <div class="book-nav">
        <div class="book-header">
          <div class="book-icon">📚</div>
          <div class="book-info">
            <h2 class="book-title">{bf.bookTitle || 'AI as Catalyst for Cognitive Evolution'}</h2>
            <p class="book-subtitle">{bf.bookSubtitle || 'From Fragmentation to Integration'}</p>
          </div>
        </div>

        <div class="nav-sections">
          <!-- PDF Download Button -->
          <div class="pdf-download-section">
            <button class="pdf-download-btn" on:click={() => downloadBook()}>
              <span class="pdf-icon">📄</span>
              <div class="pdf-text">
                <span class="pdf-title">{bf.pdfDownload?.title || 'Download Complete Book'}</span>
                <span class="pdf-subtitle">{bf.pdfDownload?.subtitle || 'PDF Format'}</span>
              </div>
              <span class="download-arrow">↓</span>
            </button>
            
            <!-- PDF Language Notice -->
            {#if !hasPdfTranslation && translationsReady}
              <div class="pdf-language-notice">
                <span class="notice-icon">🌐</span>
                <span class="notice-text">{bf.pdfDownload?.englishOnly || 'PDF available in English only'}</span>
              </div>
            {/if}
          </div>
          <!-- Front Matter -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={frontMatterOpen}
              class:has-active={isFrontMatter}
              on:click={toggleFrontMatter}
            >
              <span class="accordion-icon">📖</span>
              <span class="accordion-title">{bf.categories?.frontMatter || 'Front Matter'}</span>
              <span class="section-count">({frontMatterSections.length})</span>
              <span class="toggle-arrow" class:rotated={frontMatterOpen}>▼</span>
            </button>
            {#if frontMatterOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each frontMatterSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'dedication'}💝
                        {:else if section === 'table-of-contents'}📋
                        {:else if section === 'introduction'}🎯
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Book Parts -->
          {#each Object.entries(bookParts) as [partName, chapters], partIndex}
            {@const partOpen = [part1Open, part2Open, part3Open, part4Open, part5Open][partIndex]}
            {@const togglePart = [togglePart1, togglePart2, togglePart3, togglePart4, togglePart5][partIndex]}
            {@const hasActiveChapter = chapters.some(chapter => chapter === activeSection)}
            
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={partOpen}
                class:has-active={hasActiveChapter}
                on:click={togglePart}
              >
                <span class="accordion-icon">📚</span>
                <span class="accordion-title">{getPartTitle(partName)}</span>
                <span class="section-count">({chapters.length})</span>
                <span class="toggle-arrow" class:rotated={partOpen}>▼</span>
              </button>
              {#if partOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each chapters as chapter}
                    {#if data?.sections?.[chapter]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === chapter}
                        on:click={() => setActiveSection(chapter)}
                      >
                        <span class="nav-icon">📖</span>
                        <span class="nav-title">{getShortSectionTitle(chapter)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/each}

          <!-- Back Matter -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={backMatterOpen}
              class:has-active={isBackMatter}
              on:click={toggleBackMatter}
            >
              <span class="accordion-icon">📎</span>
              <span class="accordion-title">{bf.categories?.backMatter || 'Back Matter'}</span>
              <span class="section-count">({backMatterSections.length})</span>
              <span class="toggle-arrow" class:rotated={backMatterOpen}>▼</span>
            </button>
            {#if backMatterOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each backMatterSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'conclusion'}🎯
                        {:else if section.startsWith('appendix')}📋
                        {:else if section === 'notes-and-references'}📚
                        {:else if section === 'acknowledgments'}🙏
                        {:else if section === 'about'}👤
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="content">
      <!-- Content Language Availability Notice -->
      {#if !hasFullTranslation && !isPrintMode && translationsReady}
        <div class="content-language-notice">
          <div class="notice-header">
            <span class="notice-icon">🌐</span>
            <strong>{bf.languageAvailability?.title || 'Content Availability Notice'}</strong>
          </div>
          <div class="notice-body">
            <p>{bf.languageAvailability?.description || 'This book is currently available in English only. Some sections may display in English while we work on translations.'}</p>
            <div class="notice-stats">
              <span class="stat-item">
                <span class="stat-icon">📖</span>
                {bf.languageAvailability?.contentStatus?.replace('{language}', currentLocale) || `Content: English only`}
              </span>
              <span class="stat-item">
                <span class="stat-icon">📄</span>
                {bf.languageAvailability?.pdfStatus || 'PDF: English only'}
              </span>
            </div>
          </div>
        </div>
      {/if}
      <!-- Reading progress indicator for chapters -->
      {#if !isPrintMode && isChapter && chapterSections.length > 0 && translationsReady}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((chapterSections.indexOf(activeSection) + 1) / chapterSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{bf.progress?.text?.replace('{current}', chapterSections.indexOf(activeSection) + 1).replace('{total}', chapterSections.length) || `Chapter ${chapterSections.indexOf(activeSection) + 1} of ${chapterSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{bf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{bf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of sections -->
            {#if !isPrintMode && translationsReady}
              <div class="section-navigation">
                {#if getPreviousSection()}
                  <button class="nav-btn prev-btn" on:click={() => setActiveSection(getPreviousSection())}>
                    ← {bf.navigation?.previousSection || 'Previous'}
                  </button>
                {/if}
                
                <div class="nav-center">
                  <button class="secondary-btn" on:click={() => downloadBook()}>
                    {bf.navigation?.downloadPdf || 'Download PDF'} <span class="download-icon">↓</span>
                  </button>
                </div>
                
                {#if getNextSection()}
                  <button class="nav-btn next-btn" on:click={() => setActiveSection(getNextSection())}>
                    {bf.navigation?.nextSection || 'Next'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('booksAiCatalyst.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('booksAiCatalyst.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('booksAiCatalyst.loading.text', 'Loading book content...')}</p>
  </div>
{/if}

<style>
  /* AI Catalyst Book color scheme */
  :root {
    --book-primary: #1A365D;
    --book-secondary: #2B6CB0;
    --book-accent: #00B4D8;
    --book-success: #38A169;
    --book-warning: #D69E2E;
    --book-danger: #E53E3E;
    --book-light: #EDF2F7;
    --book-dark: #2D3748;
    --book-wisdom: #553C9A;
  }

  /* Loading state */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid var(--book-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Layout */
  .book-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
    min-height: 100vh;
  }
  
  .content {
    min-width: 0;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  /* Book Navigation Sidebar */
  .book-nav {
    position: sticky;
    top: 2rem;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .book-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(135deg, rgba(26, 54, 93, 0.1), rgba(0, 180, 216, 0.1));
  }

  .book-icon {
    font-size: 2rem;
    color: var(--book-primary);
    flex-shrink: 0;
  }

  .book-info {
    flex: 1;
    min-width: 0;
  }

  .book-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--book-primary);
    margin: 0 0 0.25rem 0;
    line-height: 1.3;
  }

  .book-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
    line-height: 1.4;
  }

  .nav-sections {
    padding: 1rem;
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  /* PDF Download Section */
  .pdf-download-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .pdf-download-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, var(--book-primary), var(--book-secondary));
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(26, 54, 93, 0.2);
  }

  .pdf-download-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(26, 54, 93, 0.3);
  }

  .pdf-download-btn:focus-visible {
    outline: 2px solid var(--book-accent);
    outline-offset: 2px;
    transform: translateY(-1px);
  }

  .pdf-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .pdf-text {
    flex: 1;
    text-align: left;
  }

  .pdf-title {
    display: block;
    font-weight: 600;
    font-size: 0.95rem;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .pdf-subtitle {
    display: block;
    font-size: 0.8rem;
    opacity: 0.9;
  }

  .download-arrow {
    font-size: 1.2rem;
    flex-shrink: 0;
    opacity: 0.8;
  }

  .pdf-language-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.5rem 0.75rem;
    background-color: rgba(245, 166, 35, 0.1);
    border: 1px solid rgba(245, 166, 35, 0.3);
    border-radius: 0.375rem;
    font-size: 0.8rem;
    color: #92400e;
  }

  .pdf-language-notice .notice-icon {
    font-size: 0.9rem;
  }

  .pdf-language-notice .notice-text {
    flex: 1;
    line-height: 1.3;
  }

  /* Navigation accordion */
  .nav-accordion {
    margin-bottom: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(0, 180, 216, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--book-accent);
    outline-offset: 2px;
    background-color: rgba(0, 180, 216, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--book-primary);
  }

  .accordion-header.open {
    background-color: rgba(0, 180, 216, 0.1);
    border-bottom: 1px solid #e2e8f0;
  }

  .accordion-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .accordion-title {
    flex-grow: 1;
    font-weight: 600;
  }

  .section-count {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    border-top: 1px solid #e2e8f0;
    background-color: #f8fafc;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    color: #4b5563;
    text-align: left;
  }

  .nav-item:hover {
    background-color: rgba(0, 180, 216, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--book-accent);
    outline-offset: 2px;
    background-color: rgba(0, 180, 216, 0.1);
  }

  .nav-item.active {
    background-color: var(--book-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--book-secondary);
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  .nav-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
    line-height: 1.3;
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(26, 54, 93, 0.1), rgba(0, 180, 216, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--book-primary);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--book-primary), var(--book-accent));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--book-primary);
    font-weight: 500;
  }

  /* Section navigation */
  .section-navigation {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    align-items: center;
  }

  .nav-center {
    display: flex;
    justify-content: center;
  }

  .nav-btn {
    background-color: var(--book-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--book-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--book-accent);
    outline-offset: 2px;
    background-color: var(--book-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    justify-self: start;
  }

  .next-btn {
    justify-self: end;
  }

  .secondary-btn {
    background-color: white;
    color: var(--book-primary);
    border: 1px solid var(--book-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    background-color: rgba(0, 180, 216, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--book-accent);
    outline-offset: 2px;
    background-color: rgba(0, 180, 216, 0.1);
    transform: translateY(-1px);
  }

  .download-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(0, 180, 216, 0.1);
    border: 1px solid rgba(0, 180, 216, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--book-accent);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--book-accent);
    font-size: 0.95rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .notice-content p {
    color: #4b5563;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }

  /* Content Language Availability Notice */
  .content-language-notice {
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.1), rgba(251, 191, 36, 0.1));
    border: 1px solid rgba(245, 166, 35, 0.3);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(245, 166, 35, 0.1);
  }

  .notice-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .notice-header .notice-icon {
    font-size: 1.25rem;
    color: #d97706;
  }

  .notice-header strong {
    color: #92400e;
    font-size: 1.05rem;
  }

  .notice-body p {
    color: #78350f;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .notice-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #92400e;
    background-color: rgba(245, 166, 35, 0.15);
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid rgba(245, 166, 35, 0.2);
  }

  .stat-icon {
    font-size: 1rem;
  }

  .missing-section {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .missing-section h2 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  /* Content styling */
  .content :global(h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--book-primary);
    line-height: 1.2;
  }
  
  .content :global(h2) {
    font-size: 1.75rem;
    font-weight: 600;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    color: var(--book-secondary);
    line-height: 1.3;
  }
  
  .content :global(h3) {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--book-accent);
    line-height: 1.4;
  }

  .content :global(h4) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--book-wisdom);
    line-height: 1.4;
  }

  .content :global(h5), .content :global(h6) {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--book-dark);
    line-height: 1.4;
  }
  
  .content :global(p) {
    margin-bottom: 1.25rem;
    line-height: 1.7;
    color: #374151;
    font-size: 1.05rem;
  }

  .content :global(p:first-of-type) {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #1f2937;
  }

  /* Blockquotes */
  .content :global(blockquote) {
    background-color: rgba(0, 180, 216, 0.1);
    border-left: 4px solid var(--book-accent);
    padding: 1.25rem 1.75rem;
    margin: 2rem 0;
    border-radius: 0.5rem;
    font-style: italic;
    color: #374151;
  }

  .content :global(blockquote p) {
    margin-bottom: 0.75rem;
  }

  .content :global(blockquote p:last-child) {
    margin-bottom: 0;
  }

  /* Lists */
  .content :global(ul), .content :global(ol) {
    margin-bottom: 1.75rem;
    padding-left: 1.25rem;
    color: #374151;
  }

  .content :global(ul) {
    list-style-type: none;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.875rem;
    padding-left: 1.75rem;
    line-height: 1.6;
  }

  .content :global(ul li:not(.nav-sections li))::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.3rem;
    color: var(--book-accent);
    font-weight: bold;
  }

  /* Ordered lists */
  .content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .content :global(ol li) {
    position: relative;
    margin-bottom: 0.875rem;
    padding-left: 0.5rem;
    color: #374151;
    line-height: 1.6;
  }

  .content :global(ol li::marker) {
    color: var(--book-accent);
    font-weight: 700;
  }

  /* Links */
  .content :global(a) {
    color: var(--book-accent);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--book-primary);
    text-decoration-thickness: 2px;
  }

  /* Code and preformatted text */
  .content :global(code) {
    background-color: rgba(0, 180, 216, 0.1);
    color: var(--book-wisdom);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
  }

  .content :global(pre) {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.25rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .content :global(pre code) {
    background: none;
    padding: 0;
    color: #374151;
  }

  /* Tables */
  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .content :global(th) {
    background-color: var(--book-primary);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }

  .content :global(td) {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
  }

  .content :global(tr:nth-child(even)) {
    background-color: #f8fafc;
  }

  .content :global(tr:hover) {
    background-color: rgba(0, 180, 216, 0.05);
  }

  /* Images */
  .content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 1.5rem 0;
  }

  /* Horizontal rules */
  .content :global(hr) {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, var(--book-primary), var(--book-accent), var(--book-primary));
    margin: 3rem 0;
    border-radius: 1px;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .book-container {
      grid-template-columns: 260px 1fr;
      gap: 1.5rem;
    }

    .book-nav {
      width: 260px;
    }
  }

  @media (max-width: 768px) {
    .book-container {
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .book-nav {
      position: static;
      max-height: none;
      margin-bottom: 1.5rem;
    }

    .book-header {
      padding: 1rem;
    }

    .book-title {
      font-size: 1rem;
    }

    .book-subtitle {
      font-size: 0.8rem;
    }

    .nav-sections {
      padding: 0.75rem;
      max-height: none;
    }

    .pdf-download-section {
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
    }

    .pdf-download-btn {
      padding: 0.875rem;
      gap: 0.75rem;
    }

    .pdf-title {
      font-size: 0.9rem;
    }

    .pdf-subtitle {
      font-size: 0.75rem;
    }

    .content-language-notice {
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .notice-header {
      gap: 0.5rem;
    }

    .notice-header strong {
      font-size: 1rem;
    }

    .notice-stats {
      flex-direction: column;
      gap: 0.75rem;
    }

    .stat-item {
      justify-content: center;
    }

    .accordion-header {
      padding: 0.75rem;
      font-size: 0.85rem;
    }

    .nav-item {
      padding: 0.625rem 0.75rem;
      font-size: 0.8rem;
    }

    .subsection-item {
      padding-left: 1.25rem;
    }

    .section-navigation {
      grid-template-columns: 1fr;
      gap: 1rem;
      text-align: center;
    }

    .nav-center {
      order: 3;
    }

    .prev-btn, .next-btn {
      justify-self: stretch;
      width: 100%;
    }

    .content :global(h1) {
      font-size: 1.875rem;
    }

    .content :global(h2) {
      font-size: 1.5rem;
    }

    .content :global(h3) {
      font-size: 1.25rem;
    }

    .content :global(p) {
      font-size: 1rem;
    }

    .progress-indicator {
      padding: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    .book-container {
      padding: 0.75rem;
    }

    .book-header {
      flex-direction: column;
      text-align: center;
      gap: 0.75rem;
    }

    .book-icon {
      font-size: 1.5rem;
    }

    .content :global(h1) {
      font-size: 1.625rem;
    }

    .content :global(h2) {
      font-size: 1.375rem;
    }

    .content :global(table) {
      font-size: 0.875rem;
    }

    .content :global(th), .content :global(td) {
      padding: 0.625rem 0.75rem;
    }
  }

  /* Print styles */
  @media print {
    .book-nav {
      display: none;
    }

    .book-container {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .section-navigation {
      display: none;
    }

    .progress-indicator {
      display: none;
    }

    .language-fallback-notice {
      display: none;
    }

    .content :global(*) {
      color: #000 !important;
    }
  }
</style>
