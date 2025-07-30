<!-- src/routes/overview/+page.svelte -->
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
  $: overview = translationsReady ? ($t('overview') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let mainContentOpen = false;

  // Define the sections for each accordion group (removing gemini-outline)
  const foundationSections = ['executive-summary-for-the-skeptic', 'at-a-glance'];
  const mainContentSections = ['introduction', 'ggf-vision', 'foundational-architecture', 'implementation-roadmap', 'thematic-clusters', 'living-system', 'invitation'];

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? [...foundationSections, ...mainContentSections] : [activeSection];

  // A computed list of all sections that are part of the main "core" content for the progress bar
  $: coreOverviewSections = [...mainContentSections];
  $: isCoreSection = coreOverviewSections.includes(activeSection);
  $: isFoundationSection = foundationSections.includes(activeSection);

  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';

  function updateAccordionStates(newSection) {
    if (foundationSections.includes(newSection)) {
      foundationOpen = true;
      mainContentOpen = false;
    } else if (mainContentSections.includes(newSection)) {
      mainContentOpen = true;
      foundationOpen = false;
    }
  }

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    updateAccordionStates(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/overview') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/overview${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/overview');
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
          setActiveSection(hash);
          
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
    updateAccordionStates(section);
    
    if (browser) {
      const newUrl = `/overview${window.location.search}#${section}`;
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
    return translationsReady ? (overview.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (overview.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (overview.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the overview PDF
  function downloadOverview(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/ggf-overview${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `ggf-overview${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { 
    foundationOpen = !foundationOpen; 
    // If opening foundation, close main content to avoid confusion
    if (foundationOpen) {
      mainContentOpen = false;
    }
  }
  
  function toggleMainContent() { 
    mainContentOpen = !mainContentOpen; 
    // If opening main content, close foundation to avoid confusion
    if (mainContentOpen) {
      foundationOpen = false;
    }
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('overview.meta.title', 'Global Governance Frameworks - Complete Overview')}</title>
  <meta name="description" content="{getTextWithFallback('overview.meta.description', 'A comprehensive blueprint for transforming global governance from crisis generation to regenerative coordination')}" />
</svelte:head>

{#if mounted}
  <div class="overview-container">
    
    <!-- Header -->
    <div class="overview-header">
      <h1 class="overview-title">{getTextWithFallback('overview.title', 'Global Governance Frameworks Overview')}</h1>
      <p class="overview-subtitle">{getTextWithFallback('overview.subtitle', 'A comprehensive blueprint for transforming global governance from crisis generation to regenerative coordination')}</p>
    </div>

    <!-- Quick Access Card for Overview -->
    {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
      <div class="overview-guide-card">
        <div class="card-content">
          <div class="card-icon">
            <img src="{base}/logo.svg" alt="Global Governance Frameworks" class="logo-icon" />
          </div>
          <div class="card-text">
            <h3>{overview.guideCard?.title || 'New to the Global Governance Frameworks?'}</h3>
            <p>{overview.guideCard?.description || 'Get oriented with our 1-minute overview, or read the pragmatic case for decision-makers.'}</p>
          </div>
          <div class="card-actions">
            <button class="secondary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
              {overview.guideCard?.buttonTextSecondary || 'Read Summary for Skeptics'}
            </button>
            <button class="primary-btn" on:click={() => setActiveSection('at-a-glance')}>
              {overview.guideCard?.buttonTextPrimary || 'View At a Glance'} <span class="arrow-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- Section Navigation -->
    {#if !isPrintMode} 
      <div class="section-nav">
        <!-- Overview Home -->
        <div class="nav-section">
          <button 
            class="nav-item overview-item" 
            class:active={activeSection === 'index'}
            on:click={() => setActiveSection('index')}
            aria-current={activeSection === 'index' ? 'page' : undefined}
          >
            <span class="nav-icon">🏠</span>
            <span class="nav-title">{getSectionCategoryTitle('overview')}</span>
          </button>
        </div>

        <!-- Foundation & Quick Start Accordion -->
        <div class="nav-accordion">
          <button 
            class="accordion-header" 
            class:open={foundationOpen}
            class:has-active={isFoundationSection}
            on:click={toggleFoundation}
            aria-expanded={foundationOpen}
            aria-controls="foundation-content"
          >
            <span class="accordion-icon">⚡</span>
            <span class="accordion-title">{getSectionCategoryTitle('quickStart') || 'Quick Start'}</span>
            <span class="section-count">({foundationSections.length})</span>
            <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
          </button>
          {#if foundationOpen}
            <div 
              class="accordion-content" 
              transition:slide={{ duration: 200 }}
              id="foundation-content"
            >
              {#each foundationSections as section}
                {#if data?.sections?.[section]}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                    aria-current={activeSection === section ? 'page' : undefined}
                  >
                    <span class="nav-icon">{section === 'executive-summary-for-the-skeptic' ? '🤔' : '⚡'}</span>
                    <span class="nav-title">{getSectionTitle(section)}</span>
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>

        <!-- Main Content Accordion -->
        {#if mainContentSections.length > 0}
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={mainContentOpen}
              class:has-active={isCoreSection}
              on:click={toggleMainContent}
              aria-expanded={mainContentOpen}
              aria-controls="main-content"
            >
              <span class="accordion-icon">🌍</span>
              <span class="accordion-title">{getSectionCategoryTitle('complete') || 'Complete Overview'}</span>
              <span class="section-count">({mainContentSections.length})</span>
              <span class="toggle-arrow" class:rotated={mainContentOpen}>▼</span>
            </button>
            {#if mainContentOpen}
              <div 
                class="accordion-content" 
                transition:slide={{ duration: 200 }}
                id="main-content"
              >
                {#each mainContentSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                      aria-current={activeSection === section ? 'page' : undefined}
                    >
                      <span class="nav-icon">
                        {#if section === 'introduction'}🌟
                        {:else if section === 'ggf-vision'}🎯
                        {:else if section === 'foundational-architecture'}🏗️
                        {:else if section === 'implementation-roadmap'}🗺️
                        {:else if section === 'thematic-clusters'}🕸️
                        {:else if section === 'living-system'}💫
                        {:else if section === 'invitation'}🤝
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/if}

      </div>
    {/if}

    <!-- Progress indicator for core sections -->
    {#if !isPrintMode && isCoreSection && coreOverviewSections.length > 0 && translationsReady}
      <div class="progress-indicator">
        <div class="progress-bar">
          <div class="progress-fill" style="width: {((coreOverviewSections.indexOf(activeSection) + 1) / coreOverviewSections.length * 100)}%"></div>
        </div>
        <span class="progress-text">{overview.progress?.text?.replace('{current}', coreOverviewSections.indexOf(activeSection) + 1).replace('{total}', coreOverviewSections.length) || `Section ${coreOverviewSections.indexOf(activeSection) + 1} of ${coreOverviewSections.length}`}</span>
      </div>
    {/if}

    <!-- Content Area -->
    <div class="content-area">
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'index' && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{overview.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{overview.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadOverview('executive-summary')}>
                  {overview.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                  {overview.navigation?.continueToOverview || 'Continue to Full Overview'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && coreOverviewSections.length > 0 && translationsReady}
              <div class="section-navigation">
                {#if coreOverviewSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreOverviewSections.indexOf(activeSection);
                    const prevSection = coreOverviewSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {overview.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreOverviewSections.indexOf(activeSection) < coreOverviewSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreOverviewSections.indexOf(activeSection);
                    const nextSection = coreOverviewSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {overview.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('overview.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('overview.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
     </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('overview.loading.text', 'Loading comprehensive framework overview...')}</p>
  </div>
{/if}

<style>
  /* Color scheme based on home page */
  :root {
    --ggf-primary: #2B4B8C;
    --ggf-secondary: #6B5CA5;
    --ggf-accent: #DAA520;
    --ggf-success: #2D5F2D;
    --ggf-light: #f8fafc;
    --ggf-dark: #1e293b;
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
    border-top: 4px solid var(--ggf-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Layout */
  .overview-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Header */
  .overview-header {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .overview-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--ggf-primary);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--ggf-primary) 0%, var(--ggf-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .overview-subtitle {
    font-size: 1.25rem;
    color: #475569;
    line-height: 1.7;
    margin: 0;
  }

  /* Overview guide card */
  .overview-guide-card {
    background: linear-gradient(135deg, rgba(107, 92, 165, 0.1) 0%, rgba(43, 75, 140, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    border: 1px solid rgba(43, 75, 140, 0.2);
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .card-content {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem;
    align-items: center;
    gap: 1.5rem;
  }
  
  .card-icon {
    flex-shrink: 0;
  }

  .logo-icon {
    height: 60px;
    width: 60px;
    opacity: 0.9;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--ggf-primary);
    font-size: 1.25rem;
  }
  
  .card-text p {
    margin: 0;
    color: #4b5563;
    font-size: 1rem;
  }
  
  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    position: relative;
    overflow: visible;
  }

  /* Section Navigation */
  .section-nav {
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .nav-accordion {
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(43, 75, 140, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--ggf-primary);
    outline-offset: 2px;
    background-color: rgba(43, 75, 140, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(43, 75, 140, 0.1);
    color: var(--ggf-primary);
    font-weight: 700;
  }

  .accordion-header.open {
    background-color: rgba(43, 75, 140, 0.05);
    border-bottom: 1px solid #e5e7eb;
  }

  .accordion-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .accordion-title {
    flex-grow: 1;
    font-weight: 600;
  }

  .section-count {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.875rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    background-color: #fafafa;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    color: #4b5563;
    text-align: left;
  }

  .nav-item:hover {
    background-color: rgba(43, 75, 140, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--ggf-primary);
    outline-offset: 2px;
    background-color: rgba(43, 75, 140, 0.1);
  }

  .nav-item.active {
    background-color: var(--ggf-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--ggf-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1), rgba(107, 92, 165, 0.1));
    border: 1px solid rgba(43, 75, 140, 0.2);
    border-radius: 0.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--ggf-primary);
    color: white;
  }

  .subsection-item {
    padding-left: 2rem;
  }

  .nav-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(43, 75, 140, 0.1), rgba(107, 92, 165, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--ggf-primary);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
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
    background: linear-gradient(90deg, var(--ggf-primary), var(--ggf-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--ggf-primary);
    font-weight: 500;
  }

  /* Content Area */
  .content-area {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .section-content {
    padding: 2rem 0;
    scroll-margin-top: 2rem;
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

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(218, 165, 32, 0.1);
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--ggf-accent);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--ggf-accent);
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

  /* Buttons */
  .primary-btn {
    background-color: var(--ggf-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--ggf-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--ggf-accent);
    outline-offset: 2px;
    background-color: var(--ggf-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--ggf-primary);
    border: 1px solid var(--ggf-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(107, 92, 165, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--ggf-accent);
    outline-offset: 2px;
    background-color: rgba(107, 92, 165, 0.1);
    transform: translateY(-1px);
  }
  
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--ggf-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--ggf-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--ggf-accent);
    outline-offset: 2px;
    background-color: var(--ggf-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  .download-icon,
  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Content styling */
  .content-area :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--ggf-primary);
  }
  
  .content-area :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--ggf-secondary);
  }
  
  .content-area :global(h3),
  .content-area :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--ggf-primary);
  }

  .content-area :global(h4) {
    font-size: 1.125rem;
  }
  
  .content-area :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Blockquotes */
  .content-area :global(blockquote) {
    background-color: rgba(43, 75, 140, 0.05);
    border-left: 4px solid var(--ggf-primary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  /* Lists */
  .content-area :global(ul), .content-area :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .content-area :global(ul) {
    list-style-type: none;
  }

  .content-area :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .content-area :global(ul li::before) {
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2rem;
    color: var(--ggf-accent);
  }

  /* Ordered lists */
  .content-area :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .content-area :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .content-area :global(ol li::marker) {
    color: var(--ggf-primary);
    font-weight: 600;
  }

  /* Links */
  .content-area :global(a) {
    color: var(--ggf-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content-area :global(a:hover) {
    color: var(--ggf-secondary);
  }

  /* Code blocks */
  .content-area :global(code) {
    background-color: #f1f5f9;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    color: var(--ggf-primary);
  }

  .content-area :global(pre) {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .content-area :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }

  /* Tables */
  .content-area :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .content-area :global(th),
  .content-area :global(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .content-area :global(th) {
    background-color: var(--ggf-light);
    font-weight: 600;
    color: var(--ggf-primary);
  }

  .content-area :global(tr:hover) {
    background-color: rgba(43, 75, 140, 0.02);
  }

  /* Overview-themed styling for special elements */
  .content-area :global(.overview-highlight) {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1), rgba(107, 92, 165, 0.1));
    border: 1px solid var(--ggf-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .content-area :global(.three-pillars-callout) {
    background-color: rgba(107, 92, 165, 0.1);
    border-left: 4px solid var(--ggf-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content-area :global(.implementation-note) {
    background-color: rgba(45, 95, 45, 0.1);
    border: 1px solid var(--ggf-success);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-style: italic;
  }

  .content-area :global(.coordination-box) {
    background-color: rgba(218, 165, 32, 0.1);
    border: 1px solid var(--ggf-accent);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    position: relative;
  }

  .content-area :global(.coordination-box::before) {
    content: "🌍";
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    background: white;
    padding: 0 0.5rem;
    color: var(--ggf-accent);
    font-size: 1.2rem;
  }

  /* Overview specific styling */
  .content-area :global(.pillar-highlight) {
    background: linear-gradient(135deg, rgba(45, 95, 45, 0.1), rgba(43, 75, 140, 0.1));
    border-left: 4px solid var(--ggf-success);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content-area :global(.framework-summary-box) {
    background-color: rgba(43, 75, 140, 0.05);
    border: 2px solid var(--ggf-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .overview-container {
      padding: 1rem 0.5rem;
    }

    .overview-header {
      margin-bottom: 2rem;
    }

    .overview-title {
      font-size: 2rem;
    }

    .overview-subtitle {
      font-size: 1.125rem;
    }

    .section-nav {
      margin-bottom: 1.5rem;
    }

    .accordion-header {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
    }

    .nav-item {
      padding: 0.625rem 1rem;
      font-size: 0.9rem;
    }

    .subsection-item {
      padding-left: 1.5rem;
    }

    .section-content {
      padding: 1.5rem 0;
    }

    .card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
   
    .card-actions {
      width: 100%;
      justify-content: center;
    }
   
    .guide-navigation {
      flex-direction: column;
      gap: 1rem;
    }
   
    .guide-navigation button {
      width: 100%;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }

    .logo-icon {
      height: 50px;
      width: 50px;
    }

    .content-area :global(h1) {
      font-size: 1.75rem;
    }

    .content-area :global(h2) {
      font-size: 1.375rem;
    }

    .content-area :global(h3) {
      font-size: 1.125rem;
    }

    .content-area :global(table) {
      font-size: 0.875rem;
    }

    .content-area :global(th),
    .content-area :global(td) {
      padding: 0.5rem 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .overview-title {
      font-size: 1.75rem;
    }

    .overview-subtitle {
      font-size: 1rem;
    }

    .accordion-header {
      padding: 0.625rem 0.75rem;
    }

    .nav-item {
      padding: 0.5rem 0.75rem;
    }

    .language-fallback-notice {
      padding: 0.75rem 1rem;
    }
  }

  /* Print styles */
  @media print {
    .overview-container {
      max-width: none;
      margin: 0;
      padding: 0;
    }

    .section-nav,
    .progress-indicator,
    .guide-navigation,
    .section-navigation,
    .language-fallback-notice,
    .overview-guide-card {
      display: none;
    }

    .content-area :global(h1),
    .content-area :global(h2),
    .content-area :global(h3) {
      break-after: avoid;
    }

    .section-content {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
