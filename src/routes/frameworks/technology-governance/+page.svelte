<!-- src/routes/frameworks/technology-governance/+page.svelte -->
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
  $: tf = translationsReady ? ($t('technologyGovernance') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let structureOpen = false;
  let operationOpen = false;
  let implementationOpen = false;
  let examplesOpen = false;
  let referenceOpen = false;
  let toolsOpen = false;
  let crisisOpen = false;
  let coordinationOpen = false;
  let evaluationOpen = false;

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  
  // Define section categories based on the data structure
  $: foundationSections = ['at-a-glance', 'executive-summary-for-the-skeptic', 'principles', 'position'];
  $: structureSections = ['gtc', 'trrt', 'oversight'];
  $: operationSections = ['indigenous', 'mechanisms', 'economy'];
  $: implementationSections = ['roadmap', 'tools', 'emerging', 'evaluation'];
  $: examplesSections = ['case-studies', 'international'];
  $: referenceSections = ['glossary', 'references', 'contributing'];
  $: toolsSections = ['playbook', 'trrt-detailed', 'starter-kit-detailed'];
  $: crisisSections = ['circuit-breaker', 'crisis-unit'];
  $: coordinationSections = ['international-detailed', 'implementation-strategy'];
  $: evaluationSections = ['documentation', 'philosophy'];

  $: isFoundationSection = foundationSections.includes(activeSection);
  $: isStructureSection = structureSections.includes(activeSection);
  $: isOperationSection = operationSections.includes(activeSection);
  $: isImplementationSection = implementationSections.includes(activeSection);
  $: isExamplesSection = examplesSections.includes(activeSection);
  $: isReferenceSection = referenceSections.includes(activeSection);
  $: isToolsSection = toolsSections.includes(activeSection);
  $: isCrisisSection = crisisSections.includes(activeSection);
  $: isCoordinationSection = coordinationSections.includes(activeSection);
  $: isEvaluationSection = evaluationSections.includes(activeSection);
  $: isExecutiveSummaryActive = activeSection === 'executive-summary-for-the-skeptic';

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    foundationOpen = foundationSections.includes(activeSection);
    structureOpen = structureSections.includes(activeSection);
    operationOpen = operationSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    examplesOpen = examplesSections.includes(activeSection);
    referenceOpen = referenceSections.includes(activeSection);
    toolsOpen = toolsSections.includes(activeSection);
    crisisOpen = crisisSections.includes(activeSection);
    coordinationOpen = coordinationSections.includes(activeSection);
    evaluationOpen = evaluationSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/technology-governance') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/technology-governance${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/technology-governance');
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
      const newUrl = `/frameworks/technology-governance${window.location.search}#${section}`;
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
    return translationsReady ? (tf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (tf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (tf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/technology-governance${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `technology-governance${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleStructure() { structureOpen = !structureOpen; }
  function toggleOperation() { operationOpen = !operationOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleExamples() { examplesOpen = !examplesOpen; }
  function toggleReference() { referenceOpen = !referenceOpen; }
  function toggleTools() { toolsOpen = !toolsOpen; }
  function toggleCrisis() { crisisOpen = !crisisOpen; }
  function toggleCoordination() { coordinationOpen = !coordinationOpen; }
  function toggleEvaluation() { evaluationOpen = !evaluationOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('technologyGovernance.meta.title', 'Technology Governance Implementation Framework - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('technologyGovernance.meta.description', 'Comprehensive framework for governing technology development through adaptive, inclusive, and ethically-aligned governance')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Technology Governance -->
      {#if !isPrintMode && !isExecutiveSummaryActive && activeSection === 'index' && translationsReady}
        <div class="tech-guide-card">
          <div class="card-content">
            <div class="card-icon">🤖</div>
            <div class="card-text">
              <h3>{tf.guideCard?.title || 'New to Technology Governance?'}</h3>
              <p>{tf.guideCard?.description || 'Start with our executive summary designed for skeptics—addressing practical concerns about technology governance and implementation.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
                {tf.guideCard?.buttonText || 'Read Executive Summary for Skeptics'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for technology governance sections -->
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
              class:has-active={isFoundationSection}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🔬</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
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
                        {:else if section === 'principles'}⚖️
                        {:else if section === 'position'}📍
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Structure Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={structureOpen}
              class:has-active={isStructureSection}
              on:click={toggleStructure}
            >
              <span class="accordion-icon">🏗️</span>
              <span class="accordion-title">{getSectionCategoryTitle('structure')}</span>
              <span class="section-count">({structureSections.length})</span>
              <span class="toggle-arrow" class:rotated={structureOpen}>▼</span>
            </button>
            {#if structureOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each structureSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'gtc'}🏛️
                        {:else if section === 'trrt'}📊
                        {:else if section === 'oversight'}👁️
                        {:else}🔧{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Operation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={operationOpen}
              class:has-active={isOperationSection}
              on:click={toggleOperation}
            >
              <span class="accordion-icon">⚙️</span>
              <span class="accordion-title">{getSectionCategoryTitle('operation')}</span>
              <span class="section-count">({operationSections.length})</span>
              <span class="toggle-arrow" class:rotated={operationOpen}>▼</span>
            </button>
            {#if operationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each operationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'indigenous'}🪶
                        {:else if section === 'mechanisms'}🔄
                        {:else if section === 'economy'}💚
                        {:else}⚙️{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={isImplementationSection}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🚀</span>
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
                        {#if section === 'roadmap'}🗺️
                        {:else if section === 'tools'}🛠️
                        {:else if section === 'emerging'}🔮
                        {:else if section === 'evaluation'}📊
                        {:else}🚀{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Examples Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={examplesOpen}
              class:has-active={isExamplesSection}
              on:click={toggleExamples}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('examples')}</span>
              <span class="section-count">({examplesSections.length})</span>
              <span class="toggle-arrow" class:rotated={examplesOpen}>▼</span>
            </button>
            {#if examplesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each examplesSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'case-studies'}📖
                        {:else if section === 'international'}🌍
                        {:else}📚{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Reference Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={referenceOpen}
              class:has-active={isReferenceSection}
              on:click={toggleReference}
            >
              <span class="accordion-icon">📄</span>
              <span class="accordion-title">{getSectionCategoryTitle('reference')}</span>
              <span class="section-count">({referenceSections.length})</span>
              <span class="toggle-arrow" class:rotated={referenceOpen}>▼</span>
            </button>
            {#if referenceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each referenceSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'glossary'}📖
                        {:else if section === 'references'}🔗
                        {:else if section === 'contributing'}🤝
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Tools Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={toolsOpen}
              class:has-active={isToolsSection}
              on:click={toggleTools}
            >
              <span class="accordion-icon">🧰</span>
              <span class="accordion-title">{getSectionCategoryTitle('tools')}</span>
              <span class="section-count">({toolsSections.length})</span>
              <span class="toggle-arrow" class:rotated={toolsOpen}>▼</span>
            </button>
            {#if toolsOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each toolsSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'playbook'}📘
                        {:else if section === 'trrt-detailed'}📋
                        {:else if section === 'starter-kit-detailed'}🎯
                        {:else}🛠️{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Crisis Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={crisisOpen}
              class:has-active={isCrisisSection}
              on:click={toggleCrisis}
            >
              <span class="accordion-icon">🚨</span>
              <span class="accordion-title">{getSectionCategoryTitle('crisis')}</span>
              <span class="section-count">({crisisSections.length})</span>
              <span class="toggle-arrow" class:rotated={crisisOpen}>▼</span>
            </button>
            {#if crisisOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each crisisSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'circuit-breaker'}⚡
                        {:else if section === 'crisis-unit'}🛡️
                        {:else}🚨{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Coordination Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={coordinationOpen}
              class:has-active={isCoordinationSection}
              on:click={toggleCoordination}
            >
              <span class="accordion-icon">🌐</span>
              <span class="accordion-title">{getSectionCategoryTitle('coordination')}</span>
              <span class="section-count">({coordinationSections.length})</span>
              <span class="toggle-arrow" class:rotated={coordinationOpen}>▼</span>
            </button>
            {#if coordinationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each coordinationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'international-detailed'}🤝
                        {:else if section === 'implementation-strategy'}📋
                        {:else}🌐{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Evaluation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={evaluationOpen}
              class:has-active={isEvaluationSection}
              on:click={toggleEvaluation}
            >
              <span class="accordion-icon">📊</span>
              <span class="accordion-title">{getSectionCategoryTitle('evaluation')}</span>
              <span class="section-count">({evaluationSections.length})</span>
              <span class="toggle-arrow" class:rotated={evaluationOpen}>▼</span>
            </button>
            {#if evaluationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each evaluationSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'documentation'}📝
                        {:else if section === 'philosophy'}🤔
                        {:else}📊{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
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
                  <strong>{tf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{tf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of executive summary -->
            {#if section === 'executive-summary-for-the-skeptic' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework('executive-summary')}>
                  {tf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('principles')}>
                  {tf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('technologyGovernance.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('technologyGovernance.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('technologyGovernance.loading.text', 'Loading technology governance content...')}</p>
  </div>
{/if}

<style>
  /* Technology Governance color scheme - Modern tech with warm accents */
  :root {
    --tech-primary: #1a365d;      /* Deep blue-gray for authority */
    --tech-secondary: #3182ce;     /* Bright blue for technology */
    --tech-accent: #38b2ac;        /* Teal for innovation */
    --tech-success: #38a169;       /* Green for positive outcomes */
    --tech-warning: #ed8936;       /* Orange for caution */
    --tech-danger: #e53e3e;        /* Red for critical issues */
    --tech-light: #ebf8ff;         /* Very light blue background */
    --tech-dark: #2d3748;          /* Dark gray for text */
    --tech-wisdom: #4a5568;        /* Medium gray for secondary text */
    --tech-gradient: linear-gradient(135deg, #3182ce 0%, #38b2ac 100%);
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
    border-top: 4px solid var(--tech-primary);
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
    background: linear-gradient(to bottom, var(--tech-light), #f1f5f9);
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
    background-color: rgba(56, 178, 172, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--tech-accent);
    outline-offset: 2px;
    background-color: rgba(56, 178, 172, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(26, 54, 93, 0.1);
    color: var(--tech-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(56, 178, 172, 0.1);
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
    background-color: rgba(56, 178, 172, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--tech-accent);
    outline-offset: 2px;
    background-color: rgba(56, 178, 172, 0.1);
  }

  .nav-item.active {
    background-color: var(--tech-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--tech-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(26, 54, 93, 0.1), rgba(56, 178, 172, 0.1));
    border: 1px solid rgba(26, 54, 93, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--tech-primary);
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

  /* Tech guide card */
  .tech-guide-card {
    background: linear-gradient(135deg, rgba(56, 178, 172, 0.1) 0%, rgba(26, 54, 93, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(26, 54, 93, 0.1);
    border: 1px solid rgba(26, 54, 93, 0.2);
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
    color: var(--tech-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--tech-primary);
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
    background-color: var(--tech-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--tech-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--tech-accent);
    outline-offset: 2px;
    background-color: var(--tech-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--tech-primary);
    border: 1px solid var(--tech-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(56, 178, 172, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--tech-accent);
    outline-offset: 2px;
    background-color: rgba(56, 178, 172, 0.1);
    transform: translateY(-1px);
  }
  
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
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
    background-color: rgba(56, 178, 172, 0.1);
    border: 1px solid rgba(56, 178, 172, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--tech-accent);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--tech-accent);
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
    color: var(--tech-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--tech-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--tech-accent);
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
    background-color: rgba(56, 178, 172, 0.1);
    border-left: 4px solid var(--tech-accent);
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
    color: var(--tech-accent);
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
    color: var(--tech-accent);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--tech-accent);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--tech-primary);
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

    .loading-container {
      padding: 2rem 1rem;
    }
  }
</style>
