<!-- src/routes/frameworks/peace-and-conflict-resolution/+page.svelte -->
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
  $: pf = translationsReady ? ($t('peaceFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let operationalOpen = false;
  let implementationOpen = false;
  let deploymentOpen = false;
  let appendicesOpen = false;

  // Framework structure based on the peace framework sections
  $: foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic', 'preamble', 'framework-overview', 'theoretical-foundation', 'governance-architecture'];
  $: operationalSections = ['prevention-early-warning', 'active-conflict-resolution', 'post-conflict-transformation', 'scale-specific-applications'];
  $: implementationSections = ['ggf-integration', 'technology-tools', 'training-professional-development', 'cultural-adaptation-decolonization'];
  $: deploymentSections = ['implementation-roadmap', 'measurement-evaluation', 'risk-management', 'resources-sustainability'];
  $: appendixSections = ['appendix-a-case-studies', 'appendix-b-templates', 'appendix-c-cultural-adaptation', 'appendix-d-technical', 'appendix-e-reference'];
  $: conclusionSections = ['conclusion', 'implementation-tools'];

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: allCoreSections = [...foundationSections, ...operationalSections, ...implementationSections, ...deploymentSections, ...conclusionSections, ...appendixSections];
  $: isCoreSection = allCoreSections.includes(activeSection);
  $: isFoundationSection = foundationSections.includes(activeSection);
  $: isOperationalSection = operationalSections.includes(activeSection);
  $: isImplementationSection = implementationSections.includes(activeSection);
  $: isDeploymentSection = deploymentSections.includes(activeSection);
  $: isAppendixSection = appendixSections.includes(activeSection);
  $: isConclusionSection = conclusionSections.includes(activeSection);
  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';

  function initializeAccordionStates() {
    foundationOpen = foundationSections.includes(activeSection);
    operationalOpen = operationalSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    deploymentOpen = deploymentSections.includes(activeSection);
    appendicesOpen = appendixSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/peace-and-conflict-resolution') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/peace-and-conflict-resolution${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/peace-and-conflict-resolution');
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
      const newUrl = `/frameworks/peace-and-conflict-resolution${window.location.search}#${section}`;
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
    return translationsReady ? (pf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (pf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (pf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the peace framework PDF
  function downloadPeaceFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/peace-and-conflict-resolution${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `peace-and-conflict-resolution${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleOperational() { operationalOpen = !operationalOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleDeployment() { deploymentOpen = !deploymentOpen; }
  function toggleAppendices() { appendicesOpen = !appendicesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('peaceFramework.meta.title', 'Peace & Conflict Resolution Framework - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('peaceFramework.meta.description', 'Building sustainable peace through values-based transformation and regenerative conflict resolution')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Peace Framework -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="peace-guide-card">
          <div class="card-content">
            <div class="card-icon">🕊️</div>
            <div class="card-text">
              <h3>{pf.guideCard?.title || 'New to Values-Based Peace Transformation?'}</h3>
              <p>{pf.guideCard?.description || 'Start with our at-a-glance overview to understand how this framework transforms conflicts into opportunities for regenerative relationships.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('at-a-glance')}>
                {pf.guideCard?.buttonText || 'Read At-a-Glance Overview'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for peace framework sections -->
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

          <!-- Part I: Foundations Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={isFoundationSection}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌱</span>
              <span class="accordion-title">Part I: Foundations</span>
              <span class="section-count">({foundationSections.length})</span>
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
                      <span class="nav-icon">
                        {#if section === 'at-a-glance'}⚡
                        {:else if section === 'executive-summary-for-the-skeptic'}🤔
                        {:else if section === 'preamble'}🕯️
                        {:else if section === 'framework-overview'}🔍
                        {:else if section === 'theoretical-foundation'}📚
                        {:else if section === 'governance-architecture'}🏛️
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Part II: Operational Framework Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={operationalOpen}
              class:has-active={isOperationalSection}
              on:click={toggleOperational}
            >
              <span class="accordion-icon">🛠️</span>
              <span class="accordion-title">Part II: Operational Framework</span>
              <span class="section-count">({operationalSections.length})</span>
              <span class="toggle-arrow" class:rotated={operationalOpen}>▼</span>
            </button>
            {#if operationalOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each operationalSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'prevention-early-warning'}🔮
                        {:else if section === 'active-conflict-resolution'}🤝
                        {:else if section === 'post-conflict-transformation'}🌟
                        {:else if section === 'scale-specific-applications'}🌐
                        {:else}⚙️{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Part III: Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={isImplementationSection}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">Part III: Implementation</span>
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
                        {#if section === 'ggf-integration'}🔗
                        {:else if section === 'technology-tools'}💻
                        {:else if section === 'training-professional-development'}🎓
                        {:else if section === 'cultural-adaptation-decolonization'}🌍
                        {:else}🔧{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Part IV: Deployment Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={deploymentOpen}
              class:has-active={isDeploymentSection}
              on:click={toggleDeployment}
            >
              <span class="accordion-icon">📊</span>
              <span class="accordion-title">Part IV: Deployment</span>
              <span class="section-count">({deploymentSections.length})</span>
              <span class="toggle-arrow" class:rotated={deploymentOpen}>▼</span>
            </button>
            {#if deploymentOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each deploymentSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'implementation-roadmap'}🗺️
                        {:else if section === 'measurement-evaluation'}📈
                        {:else if section === 'risk-management'}⚠️
                        {:else if section === 'resources-sustainability'}💰
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Appendices Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={appendicesOpen}
              class:has-active={isAppendixSection}
              on:click={toggleAppendices}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">Appendices</span>
              <span class="section-count">({appendixSections.length})</span>
              <span class="toggle-arrow" class:rotated={appendicesOpen}>▼</span>
            </button>
            {#if appendicesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each appendixSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'appendix-a-case-studies'}📖
                        {:else if section === 'appendix-b-templates'}📝
                        {:else if section === 'appendix-c-cultural-adaptation'}🌍
                        {:else if section === 'appendix-d-technical'}⚙️
                        {:else if section === 'appendix-e-reference'}📚
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Conclusion & Tools -->
          {#if conclusionSections.some(section => data?.sections?.[section])}
            <div class="nav-section">
              {#each conclusionSections as section}
                {#if data?.sections?.[section]}
                  <button 
                    class="nav-item conclusion-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">
                      {#if section === 'conclusion'}✨
                      {:else if section === 'implementation-tools'}🧰
                      {:else}📄{/if}
                    </span>
                    <span class="nav-title">{getSectionTitle(section)}</span>
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Progress indicator for main sections -->
      {#if !isPrintMode && isCoreSection && allCoreSections.length > 0 && translationsReady}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((allCoreSections.indexOf(activeSection) + 1) / allCoreSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{pf.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
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
                  <strong>{pf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{pf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadPeaceFramework('executive-summary')}>
                  {pf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('framework-overview')}>
                  {pf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && allCoreSections.length > 0 && translationsReady}
              <div class="section-navigation">
                {#if allCoreSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = allCoreSections.indexOf(activeSection);
                    const prevSection = allCoreSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {pf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = allCoreSections.indexOf(activeSection);
                    const nextSection = allCoreSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {pf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('peaceFramework.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('peaceFramework.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('peaceFramework.loading.text', 'Loading peace framework content...')}</p>
  </div>
{/if}

<style>
  /* Peace & Conflict Resolution Framework color scheme */
  :root {
    --peace-primary: #2D4A4B;      /* Deep sage green */
    --peace-secondary: #7FB069;     /* Warm sage */
    --peace-accent: #52796F;        /* Medium sage */
    --peace-harmony: #C9E4CA;       /* Light harmony green */
    --peace-wisdom: #A7C957;        /* Wisdom green */
    --peace-earth: #6C584C;         /* Earth brown */
    --peace-sky: #B8C4BB;          /* Soft sky */
    --peace-light: #F1F8E9;        /* Very light green */
    --peace-dove: #E8F5E8;         /* Dove white-green */
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
    border-top: 4px solid var(--peace-primary);
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
    background: linear-gradient(to bottom, var(--peace-dove), var(--peace-light));
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .nav-accordion {
    margin-bottom: 1rem;
    border: 1px solid var(--peace-sky);
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
    color: var(--peace-primary);
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(127, 176, 105, 0.1);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--peace-accent);
    outline-offset: 2px;
    background-color: rgba(127, 176, 105, 0.15);
  }

  .accordion-header.has-active {
    background-color: rgba(45, 74, 75, 0.1);
    color: var(--peace-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(127, 176, 105, 0.15);
    border-bottom: 1px solid var(--peace-sky);
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
    color: var(--peace-accent);
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.8rem;
    color: var(--peace-accent);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    border-top: 1px solid var(--peace-sky);
    background-color: var(--peace-dove);
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
    background-color: rgba(127, 176, 105, 0.1);
    color: var(--peace-primary);
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--peace-accent);
    outline-offset: 2px;
    background-color: rgba(127, 176, 105, 0.15);
  }

  .nav-item.active {
    background-color: var(--peace-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--peace-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(45, 74, 75, 0.1), rgba(127, 176, 105, 0.1));
    border: 1px solid rgba(45, 74, 75, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--peace-primary);
    color: white;
  }

  .conclusion-item {
    background: linear-gradient(135deg, rgba(167, 201, 87, 0.1), rgba(201, 228, 202, 0.1));
    border: 1px solid rgba(167, 201, 87, 0.3);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .conclusion-item.active {
    background: var(--peace-wisdom);
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
    background: linear-gradient(90deg, rgba(45, 74, 75, 0.1), rgba(127, 176, 105, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--peace-primary);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--peace-sky);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--peace-primary), var(--peace-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--peace-primary);
    font-weight: 500;
  }

  /* Peace guide card */
  .peace-guide-card {
    background: linear-gradient(135deg, rgba(127, 176, 105, 0.1) 0%, rgba(45, 74, 75, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(45, 74, 75, 0.1);
    border: 1px solid rgba(45, 74, 75, 0.2);
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
    color: var(--peace-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--peace-primary);
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
    background-color: var(--peace-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--peace-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--peace-accent);
    outline-offset: 2px;
    background-color: var(--peace-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--peace-primary);
    border: 1px solid var(--peace-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(127, 176, 105, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--peace-accent);
    outline-offset: 2px;
    background-color: rgba(127, 176, 105, 0.1);
    transform: translateY(-1px);
  }
  
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--peace-sky);
  }

  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--peace-sky);
  }

  .nav-btn {
    background-color: var(--peace-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--peace-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--peace-accent);
    outline-offset: 2px;
    background-color: var(--peace-secondary);
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
    background-color: rgba(127, 176, 105, 0.1);
    border: 1px solid rgba(127, 176, 105, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--peace-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--peace-secondary);
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
    color: var(--peace-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--peace-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--peace-accent);
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
    background-color: rgba(127, 176, 105, 0.1);
    border-left: 4px solid var(--peace-secondary);
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
    color: var(--peace-secondary);
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
    color: var(--peace-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--peace-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--peace-primary);
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
</style>
