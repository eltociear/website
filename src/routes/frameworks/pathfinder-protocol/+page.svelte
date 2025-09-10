<!-- src/routes/frameworks/regenerative-enterprise/+page.svelte -->
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
  $: rf = translationsReady ? ($t('regenerativeFramework') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'a-compass-for-changemakers';
  let mounted = false;
  let isPrintMode = false;
  let introductionOpen = false;
  let foundationOpen = false;
  let coreModulesOpen = false;
  let implementationOpen = false;
  let justiceOpen = false;
  let ecosystemOpen = false;
  let resourcesOpen = false;

  // Section categorization based on data structure
  $: introductionSections = data?.sectionCategories?.introduction || ['foreword', 'a-compass-for-changemakers', 'ways-to-begin-the-journey'];
  $: foundationSections = data?.sectionCategories?.foundations || ['the-case-for-regeneration', 'the-core-principles'];
  $: coreModuleSections = data?.sectionCategories?.coreModules || ['module-0', 'module-1', 'module-2', 'module-3', 'module-4', 'module-5'];
  $: implementationSections = data?.sectionCategories?.implementation || ['beginning-the-journey', 'deepening-the-practice'];
  $: justiceSections = data?.sectionCategories?.justice || ['a-commitment'];
  $: ecosystemSections = data?.sectionCategories?.ecosystem || ['weaving-with-the-wider-ecosystem'];
  $: resourceSections = data?.sectionCategories?.resources || ['tools', 'keeping-the-framework-alive', 'appendices'];

  // Computed values - add safety checks
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: isCoreModuleSection = coreModuleSections.includes(activeSection);
  $: isCompassActive = activeSection === 'a-compass-for-changemakers';
  $: isResourceActive = resourceSections.includes(activeSection);

  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    introductionOpen = introductionSections.includes(activeSection);
    foundationOpen = foundationSections.includes(activeSection);
    coreModulesOpen = coreModuleSections.includes(activeSection);
    implementationOpen = implementationSections.includes(activeSection);
    justiceOpen = justiceSections.includes(activeSection);
    ecosystemOpen = ecosystemSections.includes(activeSection);
    resourcesOpen = resourceSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/regenerative-enterprise') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/regenerative-enterprise${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/regenerative-enterprise');
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
      const newUrl = `/frameworks/regenerative-enterprise${window.location.search}#${section}`;
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
    return translationsReady ? (rf.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (rf.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (rf.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/regenerative-enterprise-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `regenerative-enterprise-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function toggleIntroduction() { introductionOpen = !introductionOpen; }
  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleCoreModules() { coreModulesOpen = !coreModulesOpen; }
  function toggleImplementation() { implementationOpen = !implementationOpen; }
  function toggleJustice() { justiceOpen = !justiceOpen; }
  function toggleEcosystem() { ecosystemOpen = !ecosystemOpen; }
  function toggleResources() { resourcesOpen = !resourcesOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('regenerativeFramework.meta.title', 'Regenerative Enterprise Framework - A Guide to Business Transformation')}</title>
  <meta name="description" content="{getTextWithFallback('regenerativeFramework.meta.description', 'A comprehensive framework for transforming enterprises to serve life, communities, and planetary wellbeing')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Framework -->
      {#if !isPrintMode && isCompassActive && translationsReady}
        <div class="framework-guide-card">
          <div class="card-content">
            <div class="card-icon">✨</div>
            <div class="card-text">
              <h3>{rf.guideCard?.title || 'Ready to Begin Your Regenerative Journey?'}</h3>
              <p>{rf.guideCard?.description || 'Explore practical pathways for transforming your enterprise to serve life, create shared prosperity, and build resilient communities.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('ways-to-begin-the-journey')}>
                {rf.guideCard?.buttonText || 'Explore Ways to Begin'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for framework sections -->
      {#if !isPrintMode} 
        <div class="section-nav">
          
          <!-- Introduction Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={introductionOpen}
              class:has-active={introductionSections.includes(activeSection)}
              on:click={toggleIntroduction}
            >
              <span class="accordion-icon">🧭</span>
              <span class="accordion-title">{getSectionCategoryTitle('introduction')}</span>
              <span class="section-count">({introductionSections.length})</span>
              <span class="toggle-arrow" class:rotated={introductionOpen}>▼</span>
            </button>
            {#if introductionOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each introductionSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'foreword'}✍️
                        {:else if section === 'a-compass-for-changemakers'}🧭
                        {:else if section === 'ways-to-begin-the-journey'}🚀
                        {:else}📝{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
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
              <span class="accordion-icon">🏗️</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundations')}</span>
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
                        {#if section === 'the-case-for-regeneration'}💡
                        {:else if section === 'the-core-principles'}⚖️
                        {:else}📋{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Core Modules Accordion -->
          {#if coreModuleSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={coreModulesOpen}
                class:has-active={isCoreModuleSection}
                on:click={toggleCoreModules}
              >
                <span class="accordion-icon">⚙️</span>
                <span class="accordion-title">{getSectionCategoryTitle('coreModules')}</span>
                <span class="section-count">({coreModuleSections.length})</span>
                <span class="toggle-arrow" class:rotated={coreModulesOpen}>▼</span>
              </button>
              {#if coreModulesOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each coreModuleSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'module-0'}💻
                        {:else if section === 'module-1'}🎯
                        {:else if section === 'module-2'}🔄
                        {:else if section === 'module-3'}💰
                        {:else if section === 'module-4'}👥
                        {:else if section === 'module-5'}🌍
                        {:else}⚙️{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          <!-- Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={implementationSections.includes(activeSection)}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🛤️</span>
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
                        {#if section === 'beginning-the-journey'}🌱
                        {:else if section === 'deepening-the-practice'}🌳
                        {:else}🛤️{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Justice & Decolonization Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={justiceOpen}
              class:has-active={justiceSections.includes(activeSection)}
              on:click={toggleJustice}
            >
              <span class="accordion-icon">✊</span>
              <span class="accordion-title">{getSectionCategoryTitle('justice')}</span>
              <span class="section-count">({justiceSections.length})</span>
              <span class="toggle-arrow" class:rotated={justiceOpen}>▼</span>
            </button>
            {#if justiceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each justiceSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">✊</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Ecosystem Integration Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={ecosystemOpen}
              class:has-active={ecosystemSections.includes(activeSection)}
              on:click={toggleEcosystem}
            >
              <span class="accordion-icon">🕸️</span>
              <span class="accordion-title">{getSectionCategoryTitle('ecosystem')}</span>
              <span class="section-count">({ecosystemSections.length})</span>
              <span class="toggle-arrow" class:rotated={ecosystemOpen}>▼</span>
            </button>
            {#if ecosystemOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each ecosystemSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">🕸️</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={isResourceActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">🧰</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">({resourceSections.length})</span>
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
                      <span class="nav-icon">
                        {#if section === 'tools'}🧰
                        {:else if section === 'keeping-the-framework-alive'}🌿
                        {:else if section === 'appendices'}📚
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
      {/if}

      <!-- Progress indicator for core modules -->
      {#if !isPrintMode && isCoreModuleSection && coreModuleSections.length > 0 && translationsReady}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((coreModuleSections.indexOf(activeSection) + 1) / coreModuleSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{rf.progress?.text?.replace('{current}', coreModuleSections.indexOf(activeSection) + 1).replace('{total}', coreModuleSections.length) || `Module ${coreModuleSections.indexOf(activeSection) + 1} of ${coreModuleSections.length}`}</span>
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
                  <strong>{rf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{rf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons at bottom of compass -->
            {#if section === 'a-compass-for-changemakers' && !isPrintMode && translationsReady}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework('guide')}>
                  {rf.navigation?.downloadPdf || 'Download Framework PDF'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('the-case-for-regeneration')}>
                  {rf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core modules -->
            {#if isCoreModuleSection && !isPrintMode && coreModuleSections.length > 0 && translationsReady}
              <div class="section-navigation">
                {#if coreModuleSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreModuleSections.indexOf(activeSection);
                    const prevSection = coreModuleSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {rf.navigation?.previousModule || 'Previous Module'}
                  </button>
                {/if}
                
                {#if coreModuleSections.indexOf(activeSection) < coreModuleSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreModuleSections.indexOf(activeSection);
                    const nextSection = coreModuleSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {rf.navigation?.nextModule || 'Next Module'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('regenerativeFramework.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('regenerativeFramework.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('regenerativeFramework.loading.text', 'Loading framework content...')}</p>
  </div>
{/if}

<style>
  /* Regenerative Enterprise Framework color scheme */
  :root {
    --regen-primary: #2D5C40;
    --regen-secondary: #6BAE4F;
    --regen-accent: #4A7C59;
    --regen-growth: #8BC34A;
    --regen-earth: #8D6E63;
    --regen-life: #43A047;
    --regen-light: #E8F5E8;
    --regen-dark: #1B3E2B;
    --regen-wisdom: #5D7C68;
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
    border-top: 4px solid var(--regen-primary);
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
    background: linear-gradient(to bottom, #f0fdf4, #ecfdf5);
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
    background-color: rgba(107, 174, 79, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--regen-accent);
    outline-offset: 2px;
    background-color: rgba(107, 174, 79, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(45, 92, 64, 0.1);
    color: var(--regen-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(107, 174, 79, 0.1);
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
    background-color: rgba(107, 174, 79, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--regen-accent);
    outline-offset: 2px;
    background-color: rgba(107, 174, 79, 0.1);
  }

  .nav-item.active {
    background-color: var(--regen-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--regen-secondary);
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
    background: linear-gradient(90deg, rgba(45, 92, 64, 0.1), rgba(107, 174, 79, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--regen-primary);
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
    background: linear-gradient(90deg, var(--regen-primary), var(--regen-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--regen-primary);
    font-weight: 500;
  }

  /* Framework guide card */
  .framework-guide-card {
    background: linear-gradient(135deg, rgba(107, 174, 79, 0.1) 0%, rgba(45, 92, 64, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(45, 92, 64, 0.1);
    border: 1px solid rgba(45, 92, 64, 0.2);
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
    color: var(--regen-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--regen-primary);
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
    background-color: var(--regen-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--regen-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--regen-accent);
    outline-offset: 2px;
    background-color: var(--regen-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--regen-primary);
    border: 1px solid var(--regen-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(107, 174, 79, 0.1);
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--regen-accent);
    outline-offset: 2px;
    background-color: rgba(107, 174, 79, 0.1);
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
    background-color: var(--regen-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--regen-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--regen-accent);
    outline-offset: 2px;
    background-color: var(--regen-secondary);
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
    background-color: rgba(107, 174, 79, 0.1);
    border: 1px solid rgba(107, 174, 79, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--regen-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--regen-secondary);
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
    color: var(--regen-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--regen-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--regen-accent);
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
    background-color: rgba(107, 174, 79, 0.1);
    border-left: 4px solid var(--regen-secondary);
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
    content: "🌱";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1rem;
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
    color: var(--regen-secondary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--regen-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--regen-primary);
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
