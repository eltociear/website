<!-- src/routes/frameworks/justice-systems/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: jf = translationsReady ? ($t('justiceFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let coreFrameworkOpen = false;
  let resourcesOpen = false;

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: coreFrameworkSections = Object.keys(data?.sections || {}).filter(section => 
    !['index', 'at-a-glance', 'executive-summary-for-the-skeptic', 'appendices'].includes(section)
  );
  $: isCoreSection = coreFrameworkSections.includes(activeSection);
  $: foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
  $: resourceSections = ['appendices'];
  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';
  $: isSupplementaryActive = resourceSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    foundationOpen = foundationSections.includes(activeSection);
    coreFrameworkOpen = coreFrameworkSections.includes(activeSection);
    resourcesOpen = resourceSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/justice-systems') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/justice-systems${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/justice-systems');
        } catch (e) {
          if (DEBUG_LOG) console.error('Failed to reload translations:', e);
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
      const newUrl = `/frameworks/justice-systems${window.location.search}#${section}`;
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
    return translationsReady ? (jf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (jf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (jf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the justice systems PDF
  function downloadJustice(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/justice-systems-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `justice-systems-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleCoreFramework() { coreFrameworkOpen = !coreFrameworkOpen; }
  function toggleResources() { resourcesOpen = !resourcesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('justiceFramework.meta.title', 'Justice Systems Implementation Framework - Global Justice Transformation')}</title>
  <meta name="description" content="{getTextWithFallback('justiceFramework.meta.description', 'A comprehensive framework for implementing equitable, transparent, and resilient global justice systems aligned with the Moral Operating System')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Justice Systems -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="justice-guide-card">
          <div class="card-content">
            <div class="card-icon">⚖️</div>
            <div class="card-text">
              <h3>{jf.guideCard?.title || 'New to the Justice Systems Framework?'}</h3>
              <p>{jf.guideCard?.description || 'Start with our executive summary designed for skeptics—addressing practical concerns about transforming global justice systems while maintaining stability and fairness.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
                {jf.guideCard?.buttonText || 'Read Executive Summary for Skeptics'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for justice systems sections -->
      {#if !isPrintMode} 
        <div class="section-nav">
          <!-- Overview -->
          <div class="nav-section">
            <button 
              class="nav-item overview-item" 
              class:active={activeSection === 'index'}
              on:click={() => setActiveSection('index')}
            >
              <span class="nav-icon">🏠</span>
              <span class="nav-title">{getSectionCategoryTitle('overview')}</span>
            </button>
          </div>

          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={foundationSections.includes(activeSection)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each foundationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{section === 'at-a-glance' ? '🔍' : '🤔'}</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Core Framework Accordion -->
          {#if coreFrameworkSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={coreFrameworkOpen}
                class:has-active={isCoreSection}
                on:click={toggleCoreFramework}
              >
                <span class="accordion-icon">⚖️</span>
                <span class="accordion-title">{getSectionCategoryTitle('framework')}</span>
                <span class="section-count">({coreFrameworkSections.length})</span>
                <span class="toggle-arrow" class:rotated={coreFrameworkOpen}>▼</span>
              </button>
              {#if coreFrameworkOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each coreFrameworkSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'introduction'}🚀
                        {:else if section === 'governance-structure'}🏛️
                        {:else if section === 'legal-framework'}📜
                        {:else if section === 'institutional-relationships'}🤝
                        {:else if section === 'implementation-mechanisms'}⚙️
                        {:else if section === 'digital-justice-innovation'}💻
                        {:else if section === 'monitoring-accountability'}📊
                        {:else if section === 'stakeholder-engagement'}👥
                        {:else if section === 'challenges-mitigation'}🛡️
                        {:else if section === 'timeline-milestones'}📅
                        {:else if section === 'conclusion'}🎯
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={isSupplementaryActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📄</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(1)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each resourceSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">📖</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && isCoreSection && coreFrameworkSections.length > 0 && translationsReady}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((coreFrameworkSections.indexOf(activeSection) + 1) / coreFrameworkSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{jf.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'index' && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{jf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{jf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadJustice('executive-summary')}>
                  {jf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                  {jf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && coreFrameworkSections.length > 0 && translationsReady}
              <div class="section-navigation">
                {#if coreFrameworkSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const prevSection = coreFrameworkSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {jf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {jf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('justiceFramework.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('justiceFramework.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('justiceFramework.loading.text', 'Loading justice systems content...')}</p>
  </div>
{/if}

<style>
  /* Justice Systems Framework color scheme - blue and justice-themed palette */
  :root {
    --justice-primary: #1e40af; /* Justice Blue - law, authority, trust */
    --justice-secondary: #3b82f6; /* Bright Blue - clarity, transparency, accessibility */
    --justice-accent: #1e3a8a; /* Deep Blue - stability, reliability, depth */
    --justice-balance: #6366f1; /* Indigo - balance, wisdom, fairness */
    --justice-truth: #0ea5e9; /* Sky Blue - truth, openness, communication */
    --justice-integrity: #0f172a; /* Dark Slate - integrity, seriousness, formality */
    --justice-equity: #059669; /* Justice Green - growth, equity, restoration */
    --justice-innovation: #7c3aed; /* Purple - innovation, transformation, progress */
    --justice-community: #dc2626; /* Red - urgency, advocacy, community action */
    --justice-peace: #10b981; /* Emerald - peace, harmony, resolution */
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
    border-top: 4px solid var(--justice-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Layout */
  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .content {
    min-width: 0;
  }
  
  .section-content {
    padding-top: 1rem;
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

  /* Section Navigation */
  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, rgba(30, 64, 175, 0.05), rgba(59, 130, 246, 0.05));
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px solid rgba(30, 64, 175, 0.1);
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .nav-accordion {
    margin-bottom: 1rem;
    border: 1px solid rgba(30, 64, 175, 0.2);
    border-radius: 0.375rem;
    overflow: hidden;
    background: white;
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--justice-integrity);
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(59, 130, 246, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--justice-truth);
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(30, 64, 175, 0.1);
    color: var(--justice-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(59, 130, 246, 0.1);
    border-bottom: 1px solid rgba(30, 64, 175, 0.2);
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
    color: var(--justice-balance);
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.8rem;
    color: var(--justice-balance);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    border-top: 1px solid rgba(30, 64, 175, 0.2);
    background: linear-gradient(to bottom, rgba(59, 130, 246, 0.02), rgba(30, 64, 175, 0.02));
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
    font-size: 0.9rem;
    color: #4b5563;
    text-align: left;
    margin-bottom: 0.25rem;
  }

  .nav-item:last-child {
    margin-bottom: 0;
  }

  .nav-item:hover {
    background-color: rgba(59, 130, 246, 0.05);
    color: var(--justice-primary);
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--justice-truth);
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.1);
  }

  .nav-item.active {
    background: linear-gradient(135deg, var(--justice-primary), var(--justice-secondary));
    color: white;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  }

  .nav-item.active:hover {
    background: linear-gradient(135deg, var(--justice-secondary), var(--justice-balance));
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.1));
    border: 1px solid rgba(30, 64, 175, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
  }

  .overview-item.active {
    background: linear-gradient(135deg, var(--justice-primary), var(--justice-secondary));
    color: white;
  }

  .subsection-item {
    padding-left: 1.5rem;
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
    background: linear-gradient(90deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--justice-primary);
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: rgba(30, 64, 175, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--justice-primary), var(--justice-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
    box-shadow: 0 1px 2px rgba(30, 64, 175, 0.2);
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--justice-primary);
    font-weight: 500;
  }

  /* Justice guide card */
  .justice-guide-card {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(30, 64, 175, 0.1);
    border: 1px solid rgba(30, 64, 175, 0.2);
    position: relative;
    z-index: 1;
  }
  
  .card-content {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem;
    align-items: center;
    gap: 1.5rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
    color: var(--justice-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--justice-primary);
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
  
  .primary-btn {
    background: linear-gradient(135deg, var(--justice-primary), var(--justice-secondary));
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  }
  
  .primary-btn:hover {
    background: linear-gradient(135deg, var(--justice-secondary), var(--justice-balance));
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(30, 64, 175, 0.3);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--justice-truth);
    outline-offset: 2px;
    background: linear-gradient(135deg, var(--justice-secondary), var(--justice-balance));
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--justice-primary);
    border: 1px solid var(--justice-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
  }
  
  .secondary-btn:hover {
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--justice-truth);
    outline-offset: 2px;
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(30, 64, 175, 0.2);
  }

  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(30, 64, 175, 0.2);
  }

  .nav-btn {
    background: linear-gradient(135deg, var(--justice-primary), var(--justice-secondary));
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  }

  .nav-btn:hover {
    background: linear-gradient(135deg, var(--justice-secondary), var(--justice-balance));
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(30, 64, 175, 0.3);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--justice-truth);
    outline-offset: 2px;
    background: linear-gradient(135deg, var(--justice-secondary), var(--justice-balance));
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

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--justice-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--justice-secondary);
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

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--justice-primary);
    background: linear-gradient(135deg, var(--justice-primary), var(--justice-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--justice-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--justice-accent);
  }

  .content :global(h4) {
    font-size: 1.2rem;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Blockquotes */
  .content :global(blockquote) {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(30, 64, 175, 0.08));
    border-left: 4px solid var(--justice-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(30, 64, 175, 0.1);
  }

  /* Lists */
  .content :global(ul), .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .content :global(ul) {
    list-style-type: none;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .content :global(ul li:not(.section-nav li))::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2rem;
    color: var(--justice-secondary);
  }

  /* Ordered lists */
  .content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .content :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .content :global(ol li::marker) {
    color: var(--justice-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--justice-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--justice-primary);
  }

  /* Special justice-themed elements */
  .content :global(.justice-highlight) {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.1));
    border: 1px solid rgba(30, 64, 175, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .content :global(.scales-icon) {
    display: inline-block;
    font-size: 1.2em;
    color: var(--justice-secondary);
    margin: 0 0.25rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }

    .section-nav {
      padding: 0.75rem;
    }

    .accordion-header {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
    }

    .nav-item {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;
    }

    .subsection-item {
      padding-left: 1rem;
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

    .loading-container {
      padding: 2rem 1rem;
    }

    .content :global(h1) {
      font-size: 1.75rem;
    }
    
    .content :global(h2) {
      font-size: 1.35rem;
    }
  }

  /* Print styles */
  @media print {
    .section-nav,
    .progress-indicator,
    .guide-navigation,
    .section-navigation,
    .language-fallback-notice {
      display: none;
    }
    
    .content {
      max-width: none;
    }
    
    .documentation-container {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
</style>
