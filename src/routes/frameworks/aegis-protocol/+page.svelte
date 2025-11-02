<!-- src/routes/frameworks/aegis-protocol/+page.svelte -->
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
  $: af = translationsReady ? ($t('aegisProtocol') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let coreFrameworkOpen = false;
  let strategicBriefingsOpen = false;
  let resourcesOpen = false;

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  // Define the sections for each accordion group
  const foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
  const visionSections = ['introduction-vision', 'foundational-principles', 'integration-architecture'];
  const implementationSections = ['historical-grounding', 'strategic-resilience', 'economic-modeling', 'non-state-integration'];
  const mechanicsSections = ['implementation-phases', 'three-pillars', 'root-causes', 'success-metrics'];
  const actionSections = ['faq', 'taking-action'];
  const strategicBriefingSections = ['strategic-briefing-for-the-russian-federation', 'the-china-engagement-strategy', 'the-european-ally-briefing', 'the-global-south-partnership-proposal'];
  const resourceSections = ['appendices'];

  // A computed list of all sections that are part of the main "core" content for the progress bar
  $: coreFrameworkSections = [...visionSections, ...implementationSections, ...mechanicsSections, ...actionSections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);

  // States for the new accordions
  let visionOpen = false;
  let implementationOpen = false;
  let mechanicsOpen = false;
  let actionOpen = false;
  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';
  $: isSupplementaryActive = resourceSections.includes(activeSection);
  $: isStrategicBriefingActive = strategicBriefingSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    foundationOpen = foundationSections.includes(activeSection);
    visionOpen = visionSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    mechanicsOpen = mechanicsSections.includes(activeSection);
    actionOpen = actionSections.includes(activeSection);
    strategicBriefingsOpen = strategicBriefingSections.includes(activeSection);
    resourcesOpen = resourceSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/aegis-protocol') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/aegis-protocol${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/aegis-protocol');
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
      const newUrl = `/frameworks/aegis-protocol${window.location.search}#${section}`;
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
    return translationsReady ? (af.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (af.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (af.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the aegis protocol PDF
  function downloadAegisProtocol(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/aegis-protocol${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `aegis-protocol${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleResources() { resourcesOpen = !resourcesOpen; }
  function toggleVision() { visionOpen = !visionOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleMechanics() { mechanicsOpen = !mechanicsOpen; }
  function toggleAction() { actionOpen = !actionOpen; }
  function toggleStrategicBriefings() { strategicBriefingsOpen = !strategicBriefingsOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('aegisProtocol.meta.title', 'The Aegis Protocol - Global Security Transition')}</title>
  <meta name="description" content="{getTextWithFallback('aegisProtocol.meta.description', 'A comprehensive framework for transforming global military capabilities from instruments of division into engines of discovery and cosmic guardianship')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Aegis Protocol -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="aegis-guide-card">
          <div class="card-content">
            <div class="card-icon">🛰️</div>
            <div class="card-text">
              <h3>{af.guideCard?.title || 'New to the Aegis Protocol?'}</h3>
              <p>{af.guideCard?.description || 'Start with our executive summary for skeptics—addressing practical concerns about military transformation and planetary defense.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
                {af.guideCard?.buttonText || 'Read Executive Summary for Skeptics'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for aegis protocol sections -->
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
                      <span class="nav-icon">{section === 'at-a-glance' ? '⚡' : '🤔'}</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Vision & Principles Accordion -->
          {#if visionSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={visionOpen}
                class:has-active={visionSections.includes(activeSection)}
                on:click={toggleVision}
              >
                <span class="accordion-icon">🛰️</span>
                <span class="accordion-title">{getSectionCategoryTitle('vision')}</span>
                <span class="section-count">({visionSections.length})</span>
                <span class="toggle-arrow" class:rotated={visionOpen}>▼</span>
              </button>
              {#if visionOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each visionSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'introduction-vision'}🌟
                          {:else if section === 'foundational-principles'}⚖️
                          {:else if section === 'integration-architecture'}🔗
                          {:else}🛰️{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Implementation Framework Accordion -->
          {#if implementationSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={implementationOpen}
                class:has-active={implementationSections.includes(activeSection)}
                on:click={toggleImplementation}
              >
                <span class="accordion-icon">🛠️</span>
                <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
                <span class="section-count">({implementationSections.length})</span>
                <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
              </button>
              {#if implementationOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each implementationSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'historical-grounding'}📚
                          {:else if section === 'strategic-resilience'}🛡️
                          {:else if section === 'economic-modeling'}📊
                          {:else if section === 'non-state-integration'}🤝
                          {:else}🛠️{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Core Mechanics Accordion -->
          {#if mechanicsSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={mechanicsOpen}
                class:has-active={mechanicsSections.includes(activeSection)}
                on:click={toggleMechanics}
              >
                <span class="accordion-icon">⚙️</span>
                <span class="accordion-title">{getSectionCategoryTitle('mechanics')}</span>
                <span class="section-count">({mechanicsSections.length})</span>
                <span class="toggle-arrow" class:rotated={mechanicsOpen}>▼</span>
              </button>
              {#if mechanicsOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each mechanicsSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'implementation-phases'}🚀
                          {:else if section === 'three-pillars'}🏛️
                          {:else if section === 'root-causes'}🎯
                          {:else if section === 'success-metrics'}📈
                          {:else}⚙️{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Action & Engagement Accordion -->
          {#if actionSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={actionOpen}
                class:has-active={actionSections.includes(activeSection)}
                on:click={toggleAction}
              >
                <span class="accordion-icon">💫</span>
                <span class="accordion-title">{getSectionCategoryTitle('action')}</span>
                <span class="section-count">({actionSections.length})</span>
                <span class="toggle-arrow" class:rotated={actionOpen}>▼</span>
              </button>
              {#if actionOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each actionSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'faq'}❓
                          {:else if section === 'taking-action'}🚀
                          {:else}💫{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Strategic Briefings Accordion -->
          {#if strategicBriefingSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={strategicBriefingsOpen}
                class:has-active={isStrategicBriefingActive}
                on:click={toggleStrategicBriefings}
              >
                <span class="accordion-icon">🌍</span>
                <span class="accordion-title">{getSectionCategoryTitle('strategic-briefings')}</span>
                <span class="section-count">({strategicBriefingSections.length})</span>
                <span class="toggle-arrow" class:rotated={strategicBriefingsOpen}>▼</span>
              </button>
              {#if strategicBriefingsOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each strategicBriefingSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'strategic-briefing-for-the-russian-federation'}🇷🇺
                          {:else if section === 'the-china-engagement-strategy'}🇨🇳
                          {:else if section === 'the-european-ally-briefing'}🇪🇺
                          {:else if section === 'the-global-south-partnership-proposal'}🌍
                          {:else}🌐{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
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
                      <span class="nav-icon">📎</span>
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
          <span class="progress-text">{af.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
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
                  <strong>{af.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{af.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadAegisProtocol('executive-summary')}>
                  {af.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction-vision')}>
                  {af.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
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
                    ← {af.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {af.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('aegisProtocol.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('aegisProtocol.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('aegisProtocol.loading.text', 'Loading security transformation framework content...')}</p>
  </div>
{/if}

<style>
  /* Aegis Protocol color scheme - Space, Defense, and Transformation theme */
  :root {
    --aegis-primary: #1E40AF; /* Deep space blue for authority and trust */
    --aegis-secondary: #0891B2; /* Cyan for technology and communication */
    --aegis-accent: #6366F1; /* Indigo for transformation and vision */
    --aegis-defense: #475569; /* Slate gray for defense/military heritage */
    --aegis-peace: #10B981; /* Emerald for peace and growth */
    --aegis-cosmic: #8B5CF6; /* Purple for cosmic/space exploration */
    --aegis-light: #F8FAFC; /* Very light blue-gray background */
    --aegis-dark: #0F172A; /* Deep dark blue */
    --aegis-guardian: #3B82F6; /* Bright blue for guardianship */
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
    border-top: 4px solid var(--aegis-primary);
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
    background: linear-gradient(to bottom, var(--aegis-light), #f1f5f9);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .nav-accordion {
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
    background: white;
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
    color: #374151;
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(30, 64, 175, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--aegis-accent);
    outline-offset: 2px;
    background-color: rgba(30, 64, 175, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(30, 64, 175, 0.1);
    color: var(--aegis-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(8, 145, 178, 0.1);
    border-bottom: 1px solid #e5e7eb;
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
    border-top: 1px solid #e5e7eb;
    background-color: #fafafa;
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
    background-color: rgba(30, 64, 175, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--aegis-accent);
    outline-offset: 2px;
    background-color: rgba(30, 64, 175, 0.1);
  }

  .nav-item.active {
    background-color: var(--aegis-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--aegis-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(8, 145, 178, 0.1));
    border: 1px solid rgba(30, 64, 175, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--aegis-primary);
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
    background: linear-gradient(90deg, rgba(30, 64, 175, 0.1), rgba(8, 145, 178, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--aegis-primary);
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
    background: linear-gradient(90deg, var(--aegis-primary), var(--aegis-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--aegis-primary);
    font-weight: 500;
  }

  /* Aegis guide card */
  .aegis-guide-card {
    background: linear-gradient(135deg, rgba(8, 145, 178, 0.1) 0%, rgba(30, 64, 175, 0.1) 100%);
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
    color: var(--aegis-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--aegis-primary);
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
    background-color: var(--aegis-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--aegis-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--aegis-accent);
    outline-offset: 2px;
    background-color: var(--aegis-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--aegis-primary);
    border: 1px solid var(--aegis-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(8, 145, 178, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--aegis-accent);
    outline-offset: 2px;
    background-color: rgba(8, 145, 178, 0.1);
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
    background-color: var(--aegis-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--aegis-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--aegis-accent);
    outline-offset: 2px;
    background-color: var(--aegis-secondary);
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
    background-color: rgba(8, 145, 178, 0.1);
    border: 1px solid rgba(8, 145, 178, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--aegis-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--aegis-secondary);
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
    color: var(--aegis-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--aegis-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--aegis-accent);
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
    background-color: rgba(8, 145, 178, 0.1);
    border-left: 4px solid var(--aegis-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  /* Lists */
  .content :global(ul), .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .content :global(ul) {
    list-style-type: disc;
    list-style-position: outside;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
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
    color: var(--aegis-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--aegis-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--aegis-primary);
  }

  /* Aegis-themed styling for special elements */
  .content :global(.security-highlight) {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(8, 145, 178, 0.1));
    border: 1px solid var(--aegis-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .content :global(.transformation-callout) {
    background-color: rgba(99, 102, 241, 0.1);
    border-left: 4px solid var(--aegis-accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(.defense-note) {
    background-color: rgba(71, 85, 105, 0.1);
    border: 1px solid var(--aegis-defense);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-style: italic;
  }

  .content :global(.cosmic-box) {
    background-color: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--aegis-cosmic);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    position: relative;
  }

  .content :global(.cosmic-box::before) {
    content: "🛰️";
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    background: white;
    padding: 0 0.5rem;
    color: var(--aegis-cosmic);
    font-size: 1.2rem;
  }

  /* Security transition specific styling */
  .content :global(.peace-highlight) {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(30, 64, 175, 0.1));
    border-left: 4px solid var(--aegis-peace);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(.guardian-framework-box) {
    background-color: rgba(59, 130, 246, 0.05);
    border: 2px solid var(--aegis-guardian);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
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
  }

  /* Print styles */
  @media print {
    .documentation-container {
      grid-template-columns: 1fr;
      max-width: none;
      margin: 0;
      padding: 0;
    }

    .section-nav,
    .progress-indicator,
    .guide-navigation,
    .section-navigation,
    .language-fallback-notice {
      display: none;
    }

    .content :global(h1),
    .content :global(h2),
    .content :global(h3) {
      break-after: avoid;
    }

    .section-content {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
