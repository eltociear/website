<!-- src/routes/frameworks/kinship-protocol/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: kp = translationsReady ? ($t('kinshipProtocol') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let coreFrameworkOpen = false;
  let implementationOpen = false;
  let transformationOpen = false;
  let communityOpen = false;
  let resourcesOpen = false;

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  // Define the sections for each accordion group
  const foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
  const visionSections = ['introduction-vision', 'core-principles', 'integration-architecture'];
  const pillarsSections = ['functional-pillars'];
  const implementationSections = ['implementation-roadmap', 'success-metrics', 'global-south-leadership'];
  const transformationSections = ['cultural-transformation', 'economic-justice', 'digital-rights'];
  const communitySections = ['crisis-response', 'kinship-festival', 'faq', 'taking-action'];
  const resourceSections = ['appendices'];

  // A computed list of all sections that are part of the main "core" content for the progress bar
  $: coreFrameworkSections = [...visionSections, ...pillarsSections, ...implementationSections, ...transformationSections, ...communitySections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);

  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';
  $: isSupplementaryActive = resourceSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    foundationOpen = foundationSections.includes(activeSection);
    coreFrameworkOpen = visionSections.includes(activeSection) || pillarsSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    transformationOpen = transformationSections.includes(activeSection);
    communityOpen = communitySections.includes(activeSection);
    resourcesOpen = resourceSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/kinship-protocol') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/kinship-protocol${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/kinship-protocol');
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
      const newUrl = `/frameworks/kinship-protocol${window.location.search}#${section}`;
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
    return translationsReady ? (kp.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (kp.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (kp.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the kinship protocol PDF
  function downloadKinshipProtocol(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/kinship-protocol${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `kinship-protocol${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleCoreFramework() { coreFrameworkOpen = !coreFrameworkOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleTransformation() { transformationOpen = !transformationOpen; }
  function toggleCommunity() { communityOpen = !communityOpen; }
  function toggleResources() { resourcesOpen = !resourcesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('kinshipProtocol.meta.title', 'The Kinship Protocol - Gender & Intersectional Justice Framework')}</title>
  <meta name="description" content="{getTextWithFallback('kinshipProtocol.meta.description', 'Transforming global governance through intersectional justice, ensuring people of all genders and identities have institutionalized power in shaping our collective future')}" />
  <meta name="keywords" content="gender justice, LGBTQ+ rights, intersectional governance, kinship protocol, global framework, gender equality, social justice, human rights, inclusive democracy" />
  
  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="The Kinship Protocol: Gender & Intersectional Justice Framework" />
  <meta property="og:description" content="Transforming global governance through intersectional justice - from decriminalization to economic equity to cultural transformation." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="{base}/images/frameworks/kinship-protocol-social.jpg" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="The Kinship Protocol: Gender & Intersectional Justice" />
  <meta name="twitter:description" content="A comprehensive framework for intersectional justice in global governance. 🫂" />
  <meta name="twitter:image" content="{base}/images/frameworks/kinship-protocol-social.jpg" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Kinship Protocol -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="kinship-guide-card">
          <div class="card-content">
            <div class="card-icon">🫂</div>
            <div class="card-text">
              <h3>{kp.guideCard?.title || 'New to the Kinship Protocol?'}</h3>
              <p>{kp.guideCard?.description || 'Start with our executive summary—addressing how intersectional justice can transform global governance for everyone.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
                {kp.guideCard?.buttonText || 'Read Executive Summary'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for kinship protocol sections -->
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
              <span class="accordion-icon">🌟</span>
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

          <!-- Core Framework Accordion -->
          {#if visionSections.length > 0 || pillarsSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={coreFrameworkOpen}
                class:has-active={visionSections.includes(activeSection) || pillarsSections.includes(activeSection)}
                on:click={toggleCoreFramework}
              >
                <span class="accordion-icon">🏗️</span>
                <span class="accordion-title">{getSectionCategoryTitle('core-framework')}</span>
                <span class="section-count">({visionSections.length + pillarsSections.length})</span>
                <span class="toggle-arrow" class:rotated={coreFrameworkOpen}>▼</span>
              </button>
              {#if coreFrameworkOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each [...visionSections, ...pillarsSections] as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'introduction-vision'}🌟
                          {:else if section === 'core-principles'}⚖️
                          {:else if section === 'integration-architecture'}🔗
                          {:else if section === 'functional-pillars'}🏛️
                          {:else}🫂{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Implementation Strategy Accordion -->
          {#if implementationSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={implementationOpen}
                class:has-active={implementationSections.includes(activeSection)}
                on:click={toggleImplementation}
              >
                <span class="accordion-icon">🗺️</span>
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
                          {#if section === 'implementation-roadmap'}🗺️
                          {:else if section === 'success-metrics'}📊
                          {:else if section === 'global-south-leadership'}🌍
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

          <!-- Transformation Areas Accordion -->
          {#if transformationSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={transformationOpen}
                class:has-active={transformationSections.includes(activeSection)}
                on:click={toggleTransformation}
              >
                <span class="accordion-icon">🔄</span>
                <span class="accordion-title">{getSectionCategoryTitle('transformation')}</span>
                <span class="section-count">({transformationSections.length})</span>
                <span class="toggle-arrow" class:rotated={transformationOpen}>▼</span>
              </button>
              {#if transformationOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each transformationSections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'cultural-transformation'}🎭
                          {:else if section === 'economic-justice'}💰
                          {:else if section === 'digital-rights'}💻
                          {:else}🔄{/if}
                        </span>
                        <span class="nav-title">{getShortSectionTitle(section)}</span>
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Community & Action Accordion -->
          {#if communitySections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={communityOpen}
                class:has-active={communitySections.includes(activeSection)}
                on:click={toggleCommunity}
              >
                <span class="accordion-icon">🤝</span>
                <span class="accordion-title">{getSectionCategoryTitle('community')}</span>
                <span class="section-count">({communitySections.length})</span>
                <span class="toggle-arrow" class:rotated={communityOpen}>▼</span>
              </button>
              {#if communityOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each communitySections as section}
                    {#if data?.sections?.[section]}
                      <button 
                        class="nav-item subsection-item" 
                        class:active={activeSection === section}
                        on:click={() => setActiveSection(section)}
                      >
                        <span class="nav-icon">
                          {#if section === 'crisis-response'}🚨
                          {:else if section === 'kinship-festival'}🎉
                          {:else if section === 'faq'}❓
                          {:else if section === 'taking-action'}🚀
                          {:else}🤝{/if}
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
              <span class="accordion-icon">📚</span>
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
          <span class="progress-text">{kp.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
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
                  <strong>{kp.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{kp.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadKinshipProtocol('executive-summary')}>
                  {kp.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction-vision')}>
                  {kp.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
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
                    ← {kp.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {kp.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('kinshipProtocol.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('kinshipProtocol.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('kinshipProtocol.loading.text', 'Loading intersectional justice framework content...')}</p>
  </div>
{/if}

<style>
  /* Kinship Protocol color scheme - Warm, inclusive, intersectional theme */
  :root {
    --kinship-primary: #d946ef; /* Vibrant magenta - bold and inclusive */
    --kinship-secondary: #f472b6; /* Pink - warmth and community */
    --kinship-accent: #06d6a0; /* Teal - growth and transformation */
    --kinship-purple: #8b5cf6; /* Purple for intersectionality */
    --kinship-orange: #fb7185; /* Coral for creativity and expression */
    --kinship-light: #fdf4ff; /* Very light purple background */
    --kinship-dark: #581c87; /* Deep purple */
    --kinship-gradient: linear-gradient(135deg, #d946ef 0%, #f472b6 50%, #06d6a0 100%);
  }

  /* Loading state */
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
    background-color: rgba(217, 70, 239, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--kinship-accent);
    outline-offset: 2px;
    background-color: rgba(217, 70, 239, 0.1);
  }

  .nav-item.active {
    background-color: var(--kinship-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--kinship-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(244, 114, 182, 0.1));
    border: 1px solid rgba(217, 70, 239, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--kinship-primary);
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
    background: linear-gradient(90deg, rgba(217, 70, 239, 0.1), rgba(244, 114, 182, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--kinship-primary);
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
    background: var(--kinship-gradient);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--kinship-primary);
    font-weight: 500;
  }

  /* Kinship guide card */
  .kinship-guide-card {
    background: linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(217, 70, 239, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(217, 70, 239, 0.1);
    border: 1px solid rgba(217, 70, 239, 0.2);
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
    color: var(--kinship-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--kinship-primary);
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
    background: var(--kinship-gradient);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background: var(--kinship-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(217, 70, 239, 0.3);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--kinship-accent);
    outline-offset: 2px;
    background: var(--kinship-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--kinship-primary);
    border: 1px solid var(--kinship-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(244, 114, 182, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--kinship-accent);
    outline-offset: 2px;
    background-color: rgba(244, 114, 182, 0.1);
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
    background: var(--kinship-gradient);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background: var(--kinship-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(217, 70, 239, 0.3);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--kinship-accent);
    outline-offset: 2px;
    background: var(--kinship-secondary);
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
    background-color: rgba(244, 114, 182, 0.1);
    border: 1px solid rgba(244, 114, 182, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--kinship-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--kinship-secondary);
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
    background: var(--kinship-gradient);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--kinship-primary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--kinship-secondary);
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
    background-color: rgba(244, 114, 182, 0.1);
    border-left: 4px solid var(--kinship-secondary);
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
    color: var(--kinship-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--kinship-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--kinship-primary);
  }

  /* Kinship-themed styling for special elements */
  .content :global(.justice-highlight) {
    background: linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(244, 114, 182, 0.1));
    border: 1px solid var(--kinship-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .content :global(.intersectional-callout) {
    background-color: rgba(6, 214, 160, 0.1);
    border-left: 4px solid var(--kinship-accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(.gender-note) {
    background-color: rgba(139, 92, 246, 0.1);
    border: 1px solid var(--kinship-purple);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    font-style: italic;
  }

  .content :global(.kinship-box) {
    background-color: rgba(251, 113, 133, 0.1);
    border: 1px solid var(--kinship-orange);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
    position: relative;
  }

  .content :global(.kinship-box::before) {
    content: "🫂";
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    background: white;
    padding: 0 0.5rem;
    color: var(--kinship-orange);
    font-size: 1.2rem;
  }

  /* Kinship-specific animations */
  .content :global(.kinship-pulse) {
    animation: kinship-pulse 2s ease-in-out infinite;
  }

  @keyframes kinship-pulse {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.3);
    }
    50% { 
      box-shadow: 0 0 0 10px rgba(217, 70, 239, 0);
    }
  }

  /* Pride-inspired gradient text for special callouts */
  .content :global(.pride-text) {
    background: linear-gradient(45deg, 
      #e40303 0%,   /* Red */
      #ff8c00 16%,  /* Orange */
      #ffed00 32%,  /* Yellow */
      #008018 48%,  /* Green */
      #004cff 64%,  /* Blue */
      #732982 80%,  /* Purple */
      #d946ef 100% /* Kinship primary */
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 700;
  }

  /* Intersectional justice theme accents */
  .content :global(.intersectional-highlight) {
    background: conic-gradient(from 0deg, 
      var(--kinship-primary), 
      var(--kinship-secondary), 
      var(--kinship-accent), 
      var(--kinship-primary)
    );
    border-radius: 50%;
    padding: 0.5rem;
    display: inline-block;
  }

  /* Justice framework specific styling */
  .content :global(.equity-highlight) {
    background: linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(6, 214, 160, 0.1));
    border-left: 4px solid var(--kinship-accent);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(.transformation-framework-box) {
    background-color: rgba(217, 70, 239, 0.05);
    border: 2px solid var(--kinship-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  /* Liberation theme styling */
  .content :global(.liberation-highlight) {
    background: var(--kinship-gradient);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-weight: 600;
  }

  .content :global(.community-box) {
    background-color: rgba(244, 114, 182, 0.1);
    border: 1px solid var(--kinship-secondary);
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
    border-top: 4px solid var(--kinship-primary);
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
    background: linear-gradient(to bottom, var(--kinship-light), #fdf2f8);
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
    background-color: rgba(217, 70, 239, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--kinship-accent);
    outline-offset: 2px;
    background-color: rgba(217, 70, 239, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(217, 70, 239, 0.1);
    color: var(--kinship-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(244, 114, 182, 0.1);
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
</style>
