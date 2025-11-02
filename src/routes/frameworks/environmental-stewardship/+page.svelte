<!-- src/routes/frameworks/environmental-stewardship/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import SectionNotice from '$lib/components/SectionNotice.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: esf = translationsReady ? ($t('environmentalStewardshipFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'index';
  let mounted = false;
  let isPrintMode = false;

  // Accordion states
  let overviewOpen = false;
  let foundationOpen = false;
  let governanceOpen = false;
  let implementationOpen = false;
  let toolsOpen = false;
  let appendicesOpen = false;

  // Computed values
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  // Define section groups
  const overviewSections = ['one-page-essence', 'first-100-days-playbook'];
  const foundationSections = ['introduction', 'guiding-principles', 'governance-structure', 'core-pillars'];
  const governanceSections = ['policy-mechanisms', 'stakeholder-engagement', 'financing-mechanisms', 'implementation-roadmap', 'metrics-for-success'];
  const implementationSections = ['visualizations', 'challenges-and-solutions', 'implementation-tools', 'reparations-protocol', 'conclusion'];
  const appendicesSections = [
    'appendices-overview',
    'appendix-a', 'appendix-b', 'appendix-c', 'appendix-d',
    'appendix-e', 'appendix-f', 'appendix-g', 'appendix-h',
    'appendix-i', 'appendix-j', 'appendix-k', 'appendix-l',
    'appendix-m', 'appendix-n', 'appendix-o', 'appendix-p',
    'appendix-q', 'appendix-r', 'appendix-s'
  ];

  // Core framework sections for progress indicator
  $: coreFrameworkSections = [...foundationSections, ...governanceSections, ...implementationSections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);
  $: isEssenceActive = activeSection === 'one-page-essence';
  $: isOverviewActive = overviewSections.includes(activeSection);
  $: isAppendixActive = appendicesSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    overviewOpen = overviewSections.includes(activeSection);
    foundationOpen = foundationSections.includes(activeSection);
    governanceOpen = governanceSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    appendicesOpen = appendicesSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/environmental-stewardship') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/environmental-stewardship${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/environmental-stewardship');
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
      const newUrl = `/frameworks/environmental-stewardship${window.location.search}#${section}`;
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
    return translationsReady ? (esf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (esf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (esf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/environmental-stewardship-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `environmental-stewardship-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleOverview() { overviewOpen = !overviewOpen; }
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleGovernance() { governanceOpen = !governanceOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleAppendices() { appendicesOpen = !appendicesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('environmentalStewardshipFramework.meta.title', 'Environmental Stewardship Framework - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('environmentalStewardshipFramework.meta.description', 'Ecological Intelligence & Rights Layer for transformative environmental governance addressing ecosystem degradation, climate change, and rights recognition')}" />
</svelte:head>

<SectionNotice 
  type="warning" 
  customContent={true}
>
  <p>{$t('common.notices.section.frameworks.text')}</p>
</SectionNotice>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Environmental Stewardship Framework -->
      {#if !isPrintMode && !isEssenceActive && activeSection === 'index' && translationsReady}
        <div class="environmental-guide-card">
          <div class="card-content">
            <div class="card-icon">🌍</div>
            <div class="card-text">
              <h3>{esf.guideCard?.title || 'New to the Environmental Stewardship Framework?'}</h3>
              <p>{esf.guideCard?.description || 'Start with our essential guides that explain the core concepts and provide immediate action steps.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('one-page-essence')}>
                {esf.guideCard?.buttonText || 'Read the One-Page Essence'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for framework sections -->
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

          <!-- Quick Start Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={overviewOpen}
              class:has-active={isOverviewActive}
              on:click={toggleOverview}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">{getSectionCategoryTitle('quickStart')}</span>
              <span class="section-count">({overviewSections.length})</span>
              <span class="toggle-arrow" class:rotated={overviewOpen}>▼</span>
            </button>
            {#if overviewOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each overviewSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{section === 'one-page-essence' ? '📄' : '🎯'}</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={foundationSections.includes(activeSection)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌱</span>
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
                        {#if section === 'introduction'}🌟
                        {:else if section === 'guiding-principles'}⚖️
                        {:else if section === 'governance-structure'}🏛️
                        {:else if section === 'core-pillars'}🏗️
                        {:else}🌿{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Governance & Policy Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={governanceOpen}
              class:has-active={governanceSections.includes(activeSection)}
              on:click={toggleGovernance}
            >
              <span class="accordion-icon">🏛️</span>
              <span class="accordion-title">{getSectionCategoryTitle('governance')}</span>
              <span class="section-count">({governanceSections.length})</span>
              <span class="toggle-arrow" class:rotated={governanceOpen}>▼</span>
            </button>
            {#if governanceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each governanceSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'policy-mechanisms'}📜
                        {:else if section === 'stakeholder-engagement'}🤝
                        {:else if section === 'financing-mechanisms'}💰
                        {:else if section === 'implementation-roadmap'}🗺️
                        {:else if section === 'metrics-for-success'}📊
                        {:else}🌿{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Implementation & Tools Accordion -->
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
                        {#if section === 'visualizations'}📈
                        {:else if section === 'challenges-and-solutions'}🧩
                        {:else if section === 'implementation-tools'}🔧
                        {:else if section === 'reparations-protocol'}⚖️
                        {:else if section === 'conclusion'}🎯
                        {:else}🌿{/if}
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
              class:has-active={isAppendixActive}
              on:click={toggleAppendices}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('appendices')}</span>
              <span class="section-count">({appendicesSections.length})</span>
              <span class="toggle-arrow" class:rotated={appendicesOpen}>▼</span>
            </button>
            {#if appendicesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each appendicesSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'appendices-overview'}📋
                        {:else if section.startsWith('appendix-')}📎
                        {:else}📚{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
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
          <span class="progress-text">{esf.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
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
                  <strong>{esf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{esf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of essence guide -->
            {#if section === 'one-page-essence' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework('essence')}>
                  {esf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                  {esf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
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
                    ← {esf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {esf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('environmentalStewardshipFramework.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('environmentalStewardshipFramework.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('environmentalStewardshipFramework.loading.text', 'Loading framework content...')}</p>
  </div>
{/if}

<style>
  /* Environmental Stewardship Framework color scheme */
  :root {
    --env-primary: #6DAA3F; /* Ecosystem Green - growth, life, renewal */
    --env-secondary: #3A6EA5; /* Harmony Blue - wisdom, stability, unity */
    --env-accent: #F5A623; /* Solar Gold - energy, transformation, illumination */
    --env-earth: #8B5A2B; /* Earth Brown - grounding, heritage, connection */
    --env-spirit: #8A4F9E; /* Rights Purple - consciousness, dignity, sovereignty */
    --env-regenerative: #20B2AA; /* Regenerative Teal - healing, balance, flow */
    --env-justice: #C43B3B; /* Justice Red - urgency, action, protection */
    --env-light: #F8FAFC; /* Very light green-blue background */
    --env-dark: #1A202C; /* Deep dark green */
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
    border-top: 4px solid var(--env-primary);
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
    background: linear-gradient(to bottom, var(--env-light), #f1f5f9);
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
    background-color: rgba(109, 170, 63, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--env-accent);
    outline-offset: 2px;
    background-color: rgba(109, 170, 63, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(109, 170, 63, 0.1);
    color: var(--env-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(109, 170, 63, 0.1);
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
    background-color: rgba(109, 170, 63, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--env-accent);
    outline-offset: 2px;
    background-color: rgba(109, 170, 63, 0.1);
  }

  .nav-item.active {
    background-color: var(--env-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--env-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(109, 170, 63, 0.1), rgba(58, 110, 165, 0.1));
    border: 1px solid rgba(109, 170, 63, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--env-primary);
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
    background: linear-gradient(90deg, rgba(109, 170, 63, 0.1), rgba(58, 110, 165, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--env-primary);
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
    background: linear-gradient(90deg, var(--env-primary), var(--env-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--env-primary);
    font-weight: 500;
  }

  /* Environmental guide card */
  .environmental-guide-card {
    background: linear-gradient(135deg, rgba(109, 170, 63, 0.1) 0%, rgba(58, 110, 165, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(109, 170, 63, 0.1);
    border: 1px solid rgba(109, 170, 63, 0.2);
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
    color: var(--env-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--env-primary);
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
    background-color: var(--env-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--env-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--env-accent);
    outline-offset: 2px;
    background-color: var(--env-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--env-primary);
    border: 1px solid var(--env-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(109, 170, 63, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--env-accent);
    outline-offset: 2px;
    background-color: rgba(109, 170, 63, 0.1);
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
    background-color: var(--env-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--env-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--env-accent);
    outline-offset: 2px;
    background-color: var(--env-secondary);
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
    background-color: rgba(109, 170, 63, 0.1);
    border: 1px solid rgba(109, 170, 63, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--env-primary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--env-primary);
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
    color: var(--env-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--env-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--env-accent);
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
    background-color: rgba(109, 170, 63, 0.1);
    border-left: 4px solid var(--env-earth);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .content :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--env-earth);
    display: block;
    margin-bottom: 0.75rem;
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
    content: "🌿";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 0.9rem;
  }

  .content :global(ol) {
    list-style-type: decimal;
  }

  .content :global(ol li) {
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }

  .content :global(ol li::marker) {
    color: var(--env-secondary);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "🍃";
    color: var(--env-regenerative);
  }

  /* Links */
  .content :global(a) {
    color: var(--env-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--env-primary);
  }

  /* External link indicators */
  .content :global(a[href^="http"]):after, 
  .content :global(a[href^="https://"]):after {
    content: " ↗";
    font-size: 0.8em;
    vertical-align: super;
  }

  .content :global(a[href$=".pdf"]):after {
    content: " ↓";
    font-size: 0.8em;
  }

  .content :global(a[href^="#"]) {
    color: var(--env-accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--env-accent);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--env-secondary);
    border-bottom-color: var(--env-secondary);
  }

  /* Table styles */
  .content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .content :global(thead) {
    background: linear-gradient(to right, var(--env-primary), var(--env-secondary));
  }

  .content :global(th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--env-primary);
  }

  .content :global(td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  .content :global(tr:nth-child(odd)) {
    background-color: rgba(109, 170, 63, 0.05);
  }

  .content :global(tr:nth-child(even)) {
    background-color: #ffffff;
  }

  .content :global(tr:hover) {
    background-color: rgba(109, 170, 63, 0.1);
  }

  .content :global(tbody tr:last-child td) {
    border-bottom: none;
  }

  /* Environmental stewardship themed callouts */
  .content :global(.ecosystem-callout) {
    background-color: rgba(109, 170, 63, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--env-primary);
  }

  .content :global(.spiritual-callout) {
    background-color: rgba(139, 90, 43, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--env-earth);
  }

  .content :global(.climate-callout) {
    background-color: rgba(58, 110, 165, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--env-secondary);
  }

  .content :global(.regenerative-callout) {
    background-color: rgba(32, 178, 170, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--env-regenerative);
  }

  .content :global(.rights-highlight) {
    background-color: rgba(138, 79, 158, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(138, 79, 158, 0.3);
  }

  .content :global(.rights-highlight-title) {
    color: var(--env-spirit);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(138, 79, 158, 0.3);
    padding-bottom: 0.5rem;
  }

  .content :global(.justice-highlight) {
    background-color: rgba(196, 59, 59, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(196, 59, 59, 0.3);
  }

  .content :global(.justice-highlight-title) {
    color: var(--env-justice);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(196, 59, 59, 0.3);
    padding-bottom: 0.5rem;
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

    .language-fallback-notice {
      padding: 0.75rem 1rem;
    }
    
    .notice-icon {
      font-size: 1.1rem;
    }
    
    .notice-content strong {
      font-size: 0.9rem;
    }
    
    .notice-content p {
      font-size: 0.8rem;
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
