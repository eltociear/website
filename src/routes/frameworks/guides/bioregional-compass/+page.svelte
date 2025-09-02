<!-- src/routes/frameworks/guides/bioregional-compass/+page.svelte -->
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
  $: bc = translationsReady ? ($t('guidesBioregionalCompass') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeTopSection = data.selectedSection || 'baz-starter-pack';
  let mounted = false;

  // Computed values - add safety checks
  $: topSections = ['baz-starter-pack', 'pre-formation-assessment', 'quick-start-guide'];

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve search params
      if (window.location.pathname !== '/frameworks/guides/bioregional-compass') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname if it matches a top section
        if (topSections.includes(lastPart)) {
          activeTopSection = lastPart;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/guides/bioregional-compass?section=${activeTopSection}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/guides/bioregional-compass');
        } catch (e) {
          console.error('Failed to reload translations:', e);
        }
      }
      
      // Set initial section from URL
      const urlParams = new URLSearchParams(window.location.search);
      const sectionParam = urlParams.get('section');
      
      if (sectionParam && topSections.includes(sectionParam)) {
        activeTopSection = sectionParam;
      }
    }
  });

  // Function to set active top section
  function setActiveTopSection(section) {
    if (!topSections.includes(section)) return;
    
    activeTopSection = section;
    
    if (browser) {
      const newUrl = `/frameworks/guides/bioregional-compass?section=${section}`;
      history.replaceState(null, '', newUrl);

      setTimeout(() => {
        const contentElement = document.querySelector('.top-section-content');
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
    return translationsReady ? (bc.topSections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  function downloadGuideWithFallback(guideId = 'bioregional-compass', version = 'v1.0') {
    const currentLocale = $locale || 'en';
    
    // Try current locale first
    const localizedUrl = `${base}/downloads/${currentLocale}/ggf-guide-${guideId}-${version}.pdf`;
    
    // Check if localized version exists, fallback to English if not
    checkFileExists(localizedUrl)
      .then(exists => {
        if (exists) {
          downloadFile(localizedUrl, `ggf-guide-${guideId}-${version}-${currentLocale}.pdf`);
        } else {
          console.warn(`Localized PDF not found for ${currentLocale}, falling back to English`);
          const fallbackUrl = `${base}/downloads/en/ggf-guide-${guideId}-${version}.pdf`;
          downloadFile(fallbackUrl, `ggf-guide-${guideId}-${version}-en.pdf`);
        }
      })
      .catch(() => {
        // If check fails, try fallback directly
        const fallbackUrl = `${base}/downloads/en/ggf-guide-${guideId}-${version}.pdf`;
        downloadFile(fallbackUrl, `ggf-guide-${guideId}-${version}-en.pdf`);
      });
  }

  // Helper function to check if file exists
  async function checkFileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Helper function to download file
  function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('guidesBioregionalCompass.meta.title', 'The Bioregional Compass - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompass.meta.description', 'A comprehensive guide for forming Bioregional Autonomous Zones (BAZs) and building regenerative communities rooted in reciprocity with land and people')}" />
</svelte:head>

{#if mounted}
  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb-nav">
    <nav class="breadcrumb-container">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">🌐</span>
        <span class="breadcrumb-text">{bc.navigation?.resources || 'Resources'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides" class="breadcrumb-link">
        <span class="breadcrumb-icon">📖</span>
        <span class="breadcrumb-text">{bc.navigation?.guides || 'Implementation Guides'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">{bc.navigation?.currentGuide || 'Bioregional Compass'}</span>
    </nav>
  </div>

  <div class="guide-container">
    <!-- Guide Header -->
    <header class="guide-header">
      <div class="header-content">
        <div class="header-main">
          <h1 class="guide-title">
            <span class="title-icon">🧭</span>
            {bc.title || 'The Bioregional Compass'}
          </h1>
          <p class="guide-subtitle">
            {bc.subtitle || 'A comprehensive guide for forming Bioregional Autonomous Zones (BAZs) and building regenerative communities'}
          </p>
        </div>
        
        <!-- Quick Actions -->
        <div class="header-actions">
          <button class="download-btn" on:click={() => downloadGuideWithFallback('bioregional-compass', 'v1.0')}>
            <span class="download-icon">📥</span>
            <span class="download-text">{bc.actions?.downloadPdf || 'Download Complete Guide'}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Guide Sections Navigation Cards -->
    <section class="main-sections">
      <h2 class="sections-title">{bc.sections?.main?.title || 'Complete Guide Sections'}</h2>
      <p class="sections-description">
        {bc.sections?.main?.description || 'Explore the comprehensive resources and guidance for BAZ formation'}
      </p>
      
      <div class="section-cards">
        <!-- Library Card -->
        <a href="/frameworks/guides/bioregional-compass/library" class="section-card library-card">
          <div class="card-header">
            <span class="card-icon">📚</span>
            <h3 class="card-title">{bc.sections?.library?.title || data.mainSections.library.title}</h3>
          </div>
          <p class="card-description">
            {bc.sections?.library?.description || data.mainSections.library.description}
          </p>
          <div class="card-subsections">
            {#each (bc.sections?.library?.subsections || data.mainSections.library.subsections) as subsection}
              <span class="subsection-tag">{subsection}</span>
            {/each}
          </div>
          <div class="card-footer">
            <span class="card-cta">{bc.actions?.explore || 'Explore Resources'} →</span>
          </div>
        </a>

        <!-- Playbooks Card -->
        <a href="/frameworks/guides/bioregional-compass/playbooks" class="section-card playbooks-card">
          <div class="card-header">
            <span class="card-icon">🎯</span>
            <h3 class="card-title">{bc.sections?.playbooks?.title || data.mainSections.playbooks.title}</h3>
          </div>
          <p class="card-description">
            {bc.sections?.playbooks?.description || data.mainSections.playbooks.description}
          </p>
          <div class="card-subsections">
            {#each (bc.sections?.playbooks?.subsections || data.mainSections.playbooks.subsections) as subsection}
              <span class="subsection-tag">{subsection}</span>
            {/each}
          </div>
          <div class="card-footer">
            <span class="card-cta">{bc.actions?.viewPlaybooks || 'View Playbooks'} →</span>
          </div>
        </a>

        <!-- Main Guide Card -->
        <a href="/frameworks/guides/bioregional-compass/the-guide" class="section-card guide-card">
          <div class="card-header">
            <span class="card-icon">🧭</span>
            <h3 class="card-title">{bc.sections?.guide?.title || data.mainSections.guide.title}</h3>
          </div>
          <p class="card-description">
            {bc.sections?.guide?.description || data.mainSections.guide.description}
          </p>
          <div class="card-subsections">
            {#each (bc.sections?.guide?.subsections || data.mainSections.guide.subsections) as subsection}
              <span class="subsection-tag">{subsection}</span>
            {/each}
          </div>
          <div class="card-footer">
            <span class="card-cta">{bc.actions?.startGuide || 'Start Formation Guide'} →</span>
          </div>
        </a>
      </div>
    </section>

    <!-- Top Section Selector -->
    <section class="top-sections">
      <div class="section-selector">
        <h2 class="selector-title">{bc.sections?.quickStart?.title || 'Quick Start Resources'}</h2>
        <p class="selector-description">
          {bc.sections?.quickStart?.description || 'Choose from these essential resources to begin your BAZ formation journey'}
        </p>
        
        <div class="section-tabs">
          {#each topSections as section}
            <button 
              class="tab-button" 
              class:active={activeTopSection === section}
              on:click={() => setActiveTopSection(section)}
            >
              <span class="tab-icon">
                {#if section === 'baz-starter-pack'}🎯
                {:else if section === 'pre-formation-assessment'}📋
                {:else if section === 'quick-start-guide'}⚡
                {:else}📄{/if}
              </span>
              <span class="tab-title">{getSectionTitle(section)}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Active Top Section Content -->
      <div class="top-section-content">
        {#if data.topSections?.[activeTopSection]}
          <!-- Language fallback notice -->
          {#if data.sectionsUsingEnglishFallback?.includes(activeTopSection) && translationsReady}
            <div class="language-fallback-notice">
              <div class="notice-icon">🌍</div>
              <div class="notice-content">
                <strong>{bc.languageFallback?.title || 'Content in your language coming soon'}</strong>
                <p>{bc.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
              </div>
            </div>
          {/if}
          
          <!-- Render active section from markdown files -->
          <svelte:component this={data.topSections[activeTopSection].default} t={$t} />
        {:else}
          <div class="missing-section">
            <h3>{getTextWithFallback('guidesBioregionalCompass.errors.sectionNotFound', `Section "${activeTopSection}" not found`).replace('{section}', activeTopSection)}</h3>
            <p>{getTextWithFallback('guidesBioregionalCompass.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      </div>
    </section>

    <!-- Guide Information Footer -->
    <footer class="guide-footer">
      <div class="footer-content">
        <div class="guide-metadata">
          <div class="metadata-item">
            <span class="metadata-label">{bc.metadata?.version || 'Version'}:</span>
            <span class="metadata-value">{data.guideVersion}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">{bc.metadata?.audience || 'Target Audience'}:</span>
            <span class="metadata-value">{data.targetAudience?.length || 4} {bc.metadata?.audiences || 'Audiences'}</span>
          </div>
          <div class="metadata-item">
            <span class="metadata-label">{bc.metadata?.type || 'Guide Type'}:</span>
            <span class="metadata-value">{bc.metadata?.implementationGuide || 'Implementation Guide'}</span>
          </div>
        </div>
        
        <div class="footer-note">
          <p>{bc.footer?.note || 'This guide is part of the Global Governance Framework initiative to support regenerative community formation worldwide.'}</p>
        </div>
      </div>
    </footer>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('guidesBioregionalCompass.loading.text', 'Loading guide content...')}</p>
  </div>
{/if}

<style>
  /* Bioregional Compass Guide color scheme - earthy, regenerative theme */
  :root {
    --guide-primary: #2D5016;        /* Dark forest green - land connection */
    --guide-secondary: #8B5A2B;      /* Rich brown - soil/earth */
    --guide-accent: #CD853F;         /* Peru - clay/earth tones */
    --guide-success: #228B22;        /* Forest green - growth */
    --guide-warning: #DAA520;        /* Goldenrod - harvest/abundance */
    --guide-danger: #A0522D;         /* Sienna - caution/boundaries */
    --guide-light: #F5F5DC;          /* Beige - natural light */
    --guide-dark: #1C2E0A;           /* Very dark green */
    --guide-wisdom: #9ACD32;         /* Yellow green - new growth */
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
    border-top: 4px solid var(--guide-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Breadcrumb Navigation */
  .breadcrumb-nav {
    background-color: rgba(45, 80, 22, 0.05);
    border-bottom: 1px solid rgba(45, 80, 22, 0.1);
    padding: 1rem 0;
  }

  .breadcrumb-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--guide-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .breadcrumb-link:hover {
    color: var(--guide-primary);
    background-color: rgba(45, 80, 22, 0.1);
  }

  .breadcrumb-separator {
    color: #6b7280;
    font-weight: 300;
  }

  .breadcrumb-current {
    color: var(--guide-primary);
    font-weight: 600;
  }

  .breadcrumb-icon {
    font-size: 0.9rem;
  }

  .breadcrumb-text {
    font-size: 0.9rem;
  }

  /* Main Layout */
  .guide-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  /* Guide Header */
  .guide-header {
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    border: 1px solid rgba(45, 80, 22, 0.2);
    box-shadow: 0 4px 16px rgba(45, 80, 22, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .header-main {
    flex: 1;
    min-width: 300px;
  }

  .guide-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 2.2rem;
  }

  .guide-subtitle {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  .header-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--guide-secondary), var(--guide-accent));
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    text-decoration: none;
  }

  .download-btn:hover {
    background: linear-gradient(135deg, var(--guide-primary), var(--guide-secondary));
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 90, 43, 0.3);
  }

  .download-icon {
    font-size: 1.1rem;
  }

  /* Top Sections */
  .top-sections {
    margin-bottom: 4rem;
  }

  .section-selector {
    background: linear-gradient(to bottom, var(--guide-light), rgba(255, 255, 255, 0.8));
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid rgba(45, 80, 22, 0.15);
    margin-bottom: 2rem;
  }

  .selector-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 0.5rem;
  }

  .selector-description {
    color: #6b7280;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .section-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    color: #4b5563;
  }

  .tab-button:hover {
    border-color: var(--guide-accent);
    background-color: rgba(205, 133, 63, 0.1);
  }

  .tab-button.active {
    background: var(--guide-primary);
    border-color: var(--guide-primary);
    color: white;
  }

  .tab-icon {
    font-size: 1.1rem;
  }

  .tab-title {
    font-size: 0.95rem;
  }

  /* Top Section Content */
  .top-section-content {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

  .missing-section h3 {
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
    color: var(--guide-warning);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--guide-secondary);
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

  /* Main Sections */
  .main-sections {
    margin-bottom: 4rem;
  }

  .sections-title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin-bottom: 1rem;
    text-align: center;
  }

  .sections-description {
    font-size: 1.1rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .section-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .section-card {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    border: 2px solid #e5e7eb;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .section-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
  }

  .library-card {
    border-color: rgba(139, 90, 43, 0.3);
  }

  .library-card:hover {
    border-color: var(--guide-secondary);
    background: linear-gradient(135deg, rgba(139, 90, 43, 0.05), rgba(255, 255, 255, 0.95));
  }

  .playbooks-card {
    border-color: rgba(205, 133, 63, 0.3);
  }

  .playbooks-card:hover {
    border-color: var(--guide-accent);
    background: linear-gradient(135deg, rgba(205, 133, 63, 0.05), rgba(255, 255, 255, 0.95));
  }

  .guide-card {
    border-color: rgba(45, 80, 22, 0.3);
  }

  .guide-card:hover {
    border-color: var(--guide-primary);
    background: linear-gradient(135deg, rgba(45, 80, 22, 0.05), rgba(255, 255, 255, 0.95));
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .card-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0;
    flex: 1;
  }

  .card-description {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .card-subsections {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .subsection-tag {
    background: rgba(45, 80, 22, 0.1);
    color: var(--guide-primary);
    font-size: 0.8rem;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
  }

  .card-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .card-cta {
    color: var(--guide-secondary);
    font-weight: 600;
    font-size: 0.95rem;
  }

  /* Guide Footer */
  .guide-footer {
    background: linear-gradient(135deg, rgba(45, 80, 22, 0.05), rgba(139, 90, 43, 0.05));
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid rgba(45, 80, 22, 0.1);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .guide-metadata {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .metadata-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .metadata-label {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .metadata-value {
    font-size: 0.9rem;
    color: var(--guide-primary);
    font-weight: 600;
  }

  .footer-note {
    flex: 1;
    min-width: 300px;
  }

  .footer-note p {
    color: #4b5563;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
  }

  /* Content styling */
  .top-section-content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--guide-primary);
  }
  
  .top-section-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--guide-secondary);
  }
  
  .top-section-content :global(h3),
  .top-section-content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--guide-accent);
  }

  .top-section-content :global(h4) {
    font-size: 1.2rem;
  }
  
  .top-section-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Blockquotes */
  .top-section-content :global(blockquote) {
    background-color: rgba(139, 90, 43, 0.1);
    border-left: 4px solid var(--guide-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  /* Lists */
  .top-section-content :global(ul), .top-section-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .top-section-content :global(ul) {
    list-style-type: none;
  }

  .top-section-content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .top-section-content :global(ul li::before) {
    content: "🌱";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1rem;
    color: var(--guide-success);
  }

  /* Ordered lists */
  .top-section-content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .top-section-content :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .top-section-content :global(ol li::marker) {
    color: var(--guide-secondary);
    font-weight: 600;
  }

  /* Links */
  .top-section-content :global(a) {
    color: var(--guide-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .top-section-content :global(a:hover) {
    color: var(--guide-primary);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .guide-container {
      padding: 1rem 0.5rem;
    }

    .breadcrumb-container {
      padding: 0 1rem;
    }
    
    .guide-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .guide-title {
      font-size: 2rem;
    }

    .guide-subtitle {
      font-size: 1rem;
    }

    .header-actions {
      margin-top: 1rem;
    }

    .section-selector {
      padding: 1.5rem;
    }

    .selector-title {
      font-size: 1.5rem;
    }

    .section-tabs {
      flex-direction: column;
    }

    .tab-button {
      justify-content: flex-start;
      padding: 1rem;
    }

    .top-section-content {
      padding: 1.5rem;
    }

    .sections-title {
      font-size: 1.75rem;
    }

    .sections-description {
      font-size: 1rem;
    }

    .section-cards {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .section-card {
      padding: 1.5rem;
    }

    .footer-content {
      flex-direction: column;
      gap: 1.5rem;
    }

    .guide-metadata {
      flex-direction: column;
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .breadcrumb-container {
      font-size: 0.85rem;
      gap: 0.25rem;
    }

    .guide-title {
      font-size: 1.75rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .title-icon {
      font-size: 1.5rem;
    }

    .download-btn {
      font-size: 0.9rem;
      padding: 0.75rem 1rem;
    }
  }
</style>
