<!-- src/routes/frameworks/water-and-sanitation-governance/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import SectionNotice from '$lib/components/SectionNotice.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Extract waterSanitationFramework translations for shorter references
  $: wsf = $t('waterSanitationFramework') || {};
  $: translationFunction = $t;
  
  // Keep track of which section is active (for sub-navigation)
  let activeSection = 'index';

  // This will track the current locale for our component
  $: currentLocale = $locale;

  // Check if we're in print mode - simplified to avoid hydration issues
  let isPrintMode = false;
  
  // Client-side only initialization to avoid hydration mismatches
  let mounted = false;
  let initializing = true;

  // If in print mode, we'll show all sections
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

  // Accordion states - initialize in a way that prevents hydration issues
  let foundationOpen = false;
  let governanceOpen = false;
  let implementationOpen = false;
  let resourcesOpen = false;

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    if (['theory-of-change', 'guiding-principles', 'institutional-policy-framework', 'financing-investment'].includes(activeSection)) {
      foundationOpen = true;
    } else if (['service-delivery-infrastructure', 'monitoring-accountability', 'climate-environmental-integration', 'innovation-knowledge-sharing', 'crisis-response-adaptation'].includes(activeSection)) {
      governanceOpen = true;
    } else if (['social-behavioral-change', 'global-partnerships', 'ethical-systems-framing'].includes(activeSection)) {
      implementationOpen = true;
    } else if (['implementation-roadmap', 'regional-implementation-blueprints', 'visual-accessibility-aids', 'glossary', 'executive-summary', 'quick-implementation-guide', 'youth-leadership-guide'].includes(activeSection)) {
      resourcesOpen = true;
    } else {
      // Default state for overview
      foundationOpen = true;
    }
  }

  onMount(async () => {
    await tick(); // Wait for DOM to be ready
    mounted = true;
    
    if (browser) {
      // Check print mode only on client
      const urlParams = new URLSearchParams(window.location.search);
      isPrintMode = urlParams.get('print') === 'true';
      
      // Make this function available globally for the PDF generator
      window.showAllSectionsForPrint = () => {
        isPrintMode = true;
      };

      // Handle URL parameters and hash
      const sectionParam = urlParams.get('section');
      
      if (sectionParam && data?.sections?.[sectionParam]) {
        activeSection = sectionParam;
      } else if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash]) {
          activeSection = hash;
        }
      }

      // Initialize accordion states after setting active section
      initializeAccordionStates();

      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          initializeAccordionStates();
          
          // Scroll to content
          setTimeout(() => {
            const contentElement = document.querySelector('.content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      initializing = false;
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
    
    initializing = false;
  });

  // Function to set active section
  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    initializeAccordionStates();
    
    if (browser) {
      const url = new URL(window.location.href);
      url.hash = section;
      history.replaceState(null, '', url.toString());

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

  // Get section titles in current language using short references
  function getSectionTitle(section) {
    return wsf.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return wsf.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return wsf.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/water-guide${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `water-guide${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isQuickGuideActive = activeSection === 'quick-implementation-guide';
  $: isSupplementaryActive = ['theory-of-change', 'executive-summary', 'quick-implementation-guide', 'youth-leadership-guide', 'implementation-roadmap', 'regional-implementation-blueprints', 'visual-accessibility-aids', 'glossary'].includes(activeSection);
  
  // Define section groups without numbering
  $: foundationSections = ['theory-of-change', 'guiding-principles', 'institutional-policy-framework', 'financing-investment'];
  $: governanceSections = ['service-delivery-infrastructure', 'monitoring-accountability', 'climate-environmental-integration', 'innovation-knowledge-sharing', 'crisis-response-adaptation'];
  $: implementationSections = ['social-behavioral-change', 'global-partnerships', 'ethical-systems-framing'];
  
  $: coreFrameworkSections = [...foundationSections, ...governanceSections, ...implementationSections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);

  $: if (mounted && data?.sections) {
    if (DEBUG_LOG) console.log('Available sections:', Object.keys(data.sections));
    if (DEBUG_LOG) console.log('Foundation sections that exist:', foundationSections.filter(s => data.sections[s]));
    if (DEBUG_LOG) console.log('Governance sections that exist:', governanceSections.filter(s => data.sections[s]));
    if (DEBUG_LOG) console.log('Implementation sections that exist:', implementationSections.filter(s => data.sections[s]));
  }

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleGovernance() {
    governanceOpen = !governanceOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleResources() {
    resourcesOpen = !resourcesOpen;
  }

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{wsf.meta?.title || 'Water & Sanitation Governance Framework - Global Governance Framework'}</title>
  <meta name="description" content="{wsf.meta?.description || 'A transformative blueprint for achieving universal access to safely managed water and sanitation while healing our planet\'s water systems'}" />
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
      <!-- Quick Access Card for Water Framework -->
      {#if !isPrintMode && !isQuickGuideActive && activeSection === 'index'}
        <div class="water-guide-card">
          <div class="card-content">
            <div class="card-icon">💧</div>
            <div class="card-text">
              <h3>{wsf.guideCard?.title || 'New to Water Governance?'}</h3>
              <p>{wsf.guideCard?.description || 'Start with our practical guide that explains how communities can begin transforming their water systems today.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('quick-implementation-guide')}>
                {wsf.guideCard?.buttonText || 'Read the Quick Implementation Guide'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for framework sections -->
      {#if !isPrintMode && !initializing} 
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
              class:has-active={foundationSections.some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌊</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">({foundationSections.length})</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each foundationSections as section}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">💧</span>
                    <span class="nav-title">{getShortSectionTitle(section)}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Governance & Systems Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={governanceOpen}
              class:has-active={governanceSections.some(section => activeSection === section)}
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
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">🌊</span>
                    <span class="nav-title">{getShortSectionTitle(section)}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={implementationSections.some(section => activeSection === section)}
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
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">💧</span>
                    <span class="nav-title">{getShortSectionTitle(section)}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={resourcesOpen}
              class:has-active={isSupplementaryActive && activeSection !== 'theory-of-change'}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📄</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(7)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'executive-summary'}
                  on:click={() => setActiveSection('executive-summary')}
                >
                  <span class="nav-icon">📋</span>
                  <span class="nav-title">{getSectionTitle('executive-summary')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'quick-implementation-guide'}
                  on:click={() => setActiveSection('quick-implementation-guide')}
                >
                  <span class="nav-icon">🚀</span>
                  <span class="nav-title">{getSectionTitle('quick-implementation-guide')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'youth-leadership-guide'}
                  on:click={() => setActiveSection('youth-leadership-guide')}
                >
                  <span class="nav-icon">🌊</span>
                  <span class="nav-title">{getSectionTitle('youth-leadership-guide')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'implementation-roadmap'}
                  on:click={() => setActiveSection('implementation-roadmap')}
                >
                  <span class="nav-icon">🗺️</span>
                  <span class="nav-title">{getSectionTitle('implementation-roadmap')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'regional-implementation-blueprints'}
                  on:click={() => setActiveSection('regional-implementation-blueprints')}
                >
                  <span class="nav-icon">🌍</span>
                  <span class="nav-title">{getSectionTitle('regional-implementation-blueprints')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'visual-accessibility-aids'}
                  on:click={() => setActiveSection('visual-accessibility-aids')}
                >
                  <span class="nav-icon">👁️</span>
                  <span class="nav-title">{getSectionTitle('visual-accessibility-aids')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'glossary'}
                  on:click={() => setActiveSection('glossary')}
                >
                  <span class="nav-icon">📖</span>
                  <span class="nav-title">{getSectionTitle('glossary')}</span>
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && isCoreSection && coreFrameworkSections.length > 0}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((coreFrameworkSections.indexOf(activeSection) + 1) / coreFrameworkSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{wsf.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'index'}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{wsf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{wsf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
            
            <!-- Navigation buttons at bottom of quick guide -->
            {#if section === 'quick-implementation-guide' && !isPrintMode}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadFramework('quick')}>
                  {wsf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('guiding-principles')}>
                  {wsf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && coreFrameworkSections.length > 0}
              <div class="section-navigation">
                {#if coreFrameworkSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const prevSection = coreFrameworkSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {wsf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {wsf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{wsf.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{wsf.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{wsf.loading?.text || 'Loading framework content...'}</p>
  </div>
{/if}

<style>
  /* Water & Sanitation Framework color scheme - ocean blues, life-giving teals, earth greens */
  :root {
    --water-primary: #0369a1; /* Deep Ocean Blue - depth, trust, reliability */
    --water-secondary: #0891b2; /* Cyan Blue - flow, movement, accessibility */
    --water-accent: #0d9488; /* Teal - balance, healing, sustainability */
    --water-sacred: #1e40af; /* Sacred Blue - spiritual connection, reverence */
    --water-light: #67e8f9; /* Light Cyan - purity, clarity, hope */
    --water-earth: #15803d; /* Forest Green - life, growth, regeneration */
    --water-justice: #dc2626; /* Strong Red - urgency, justice, human rights */
    --water-wisdom: #4338ca; /* Indigo - traditional knowledge, wisdom */
  }

  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 0.5rem;
  }

  .nav-accordion {
    margin-bottom: 0.5rem;
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
    background-color: rgba(13, 148, 136, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(3, 105, 161, 0.1);
    color: var(--water-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(13, 148, 136, 0.1);
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
    border-bottom: 1px solid #e5e7eb;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .nav-item:hover {
    background-color: rgba(13, 148, 136, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--water-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--water-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(3, 105, 161, 0.1), rgba(13, 148, 136, 0.1));
    border: 1px solid rgba(3, 105, 161, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--water-primary);
    color: white;
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  .nav-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-number {
    font-size: 0.8rem;
    background-color: rgba(3, 105, 161, 0.1);
    color: var(--water-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 600;
    min-width: 2rem;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-item.active .nav-number {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
  }

  /* Auto-expand accordion when section is active */
  .accordion-header.has-active + .accordion-content {
    display: block;
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(3, 105, 161, 0.1), rgba(13, 148, 136, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--water-primary);
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
    background: linear-gradient(90deg, var(--water-primary), var(--water-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--water-primary);
    font-weight: 500;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem; /* Adds space above when scrolled to */
  }

  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
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
  }
  
  .content {
    min-width: 0;
  }
  
  /* Additional styles for markdown content */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--water-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--water-secondary);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--water-accent);
  }

  /* Styling for h4 headers (#### in Markdown) */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--water-accent);
  }

  /* Styling for the inset box (blockquote) */
  :global(blockquote) {
    background-color: rgba(103, 232, 249, 0.1);
    border-left: 4px solid var(--water-sacred);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--water-sacred);
    display: block;
    margin-bottom: 0.75rem;
  }

  :global(blockquote ul) {
    margin-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }

  :global(blockquote li) {
    margin-bottom: 0.5rem;
  }

  :global(blockquote p:last-child) {
    margin-top: 0.75rem;
    font-style: italic;
  }

  :global(blockquote a) {
    color: var(--water-secondary);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: var(--water-primary);
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with water-themed bullets */
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

  /* Apply water symbols to all ul li EXCEPT those in section-nav */
  .content :global(ul li:not(.section-nav li))::before {
    content: "💧";
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
    color: var(--water-secondary);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "🌊";
    color: var(--water-light);
  }

  /* Table styles for water framework */
  :global(.content table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    overflow: hidden;
  }

  :global(.content thead) {
    background: linear-gradient(to right, var(--water-primary), var(--water-secondary));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--water-primary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: rgba(103, 232, 249, 0.05);
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: rgba(103, 232, 249, 0.1);
  }

  :global(.content tbody tr:last-child td) {
    border-bottom: none;
  }
  
  /* Water guide card */
  .water-guide-card {
    background: linear-gradient(135deg, rgba(103, 232, 249, 0.1) 0%, rgba(3, 105, 161, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(3, 105, 161, 0.1);
    border: 1px solid rgba(3, 105, 161, 0.2);
    overflow: visible !important;
    position: relative;
    z-index: 1;
  }

  .water-guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: hidden;
    border: 1px solid rgba(3, 105, 161, 0.3);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
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
    color: var(--water-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--water-primary);
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
    background-color: var(--water-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--water-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--water-primary);
    border: 1px solid var(--water-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(103, 232, 249, 0.1);
    transform: translateY(-1px);
  }
  
  .download-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }
  
  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Link styles for content */
  .content :global(a) {
    color: var(--water-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--water-primary);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--water-primary);
  }

  /* External link styles with a subtle indicator */
  .content :global(a[href^="http"]):after, 
  .content :global(a[href^="https://"]):after {
    content: " ↗";
    font-size: 0.8em;
    vertical-align: super;
  }

  /* PDF link styles with download indicator */
  .content :global(a[href$=".pdf"]):after {
    content: " ↓";
    font-size: 0.8em;
  }

  /* Section link styles - more subtle but still distinct */
  .content :global(a[href^="#"]) {
    color: var(--water-accent);
    text-decoration: none;
    border-bottom: 1px dotted var(--water-accent);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--water-secondary);
    border-bottom-color: var(--water-secondary);
  }

  /* Make sure links in tables are readable against the background */
  .content :global(table a) {
    color: var(--water-secondary);
    font-weight: 600;
  }

  /* Links in the section navigation */
  .section-nav a {
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s;
  }

  .section-nav a:hover {
    color: var(--water-primary);
  }

  /* Styles for navigation at bottom of guide */
  .guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Section navigation for core framework sections */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--water-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--water-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }
  
  @media (max-width: 640px) {
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
  }

  /* Water Framework specific theme elements */

  /* Special callouts for water concepts */
  .content :global(.human-rights-callout) {
    background-color: rgba(220, 38, 38, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-justice);
  }

  .content :global(.sacred-waters-callout) {
    background-color: rgba(67, 56, 202, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-wisdom);
  }

  .content :global(.regenerative-callout) {
    background-color: rgba(21, 128, 61, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-earth);
  }

  .content :global(.community-empowerment-callout) {
    background-color: rgba(13, 148, 136, 0.1);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-accent);
  }

  /* Special styling for case studies */
  .content :global(.case-study) {
    background-color: rgba(3, 105, 161, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-primary);
  }

  .content :global(.case-study-title) {
    color: var(--water-primary);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Alert/warning styling */
  .content :global(.alert) {
    background-color: rgba(220, 38, 38, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--water-justice);
  }

  .content :global(.alert-title) {
    color: var(--water-justice);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Highlight boxes for important water concepts */
  .content :global(.concept-highlight) {
    background-color: rgba(103, 232, 249, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(103, 232, 249, 0.3);
  }

  .content :global(.concept-highlight-title) {
    color: var(--water-secondary);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(103, 232, 249, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Water rights principles styling */
  .content :global(.rights-highlight) {
    background-color: rgba(220, 38, 38, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(220, 38, 38, 0.3);
  }

  .content :global(.rights-highlight-title) {
    color: var(--water-justice);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(220, 38, 38, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Implementation practices styling */
  .content :global(.implementation-highlight) {
    background-color: rgba(13, 148, 136, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(13, 148, 136, 0.3);
  }

  .content :global(.implementation-highlight-title) {
    color: var(--water-accent);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(13, 148, 136, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Indigenous wisdom styling */
  .content :global(.indigenous-highlight) {
    background-color: rgba(67, 56, 202, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(67, 56, 202, 0.3);
  }

  .content :global(.indigenous-highlight-title) {
    color: var(--water-wisdom);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(67, 56, 202, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Climate adaptation and environmental styling */
  .content :global(.climate-highlight) {
    background-color: rgba(21, 128, 61, 0.1);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(21, 128, 61, 0.3);
  }

  .content :global(.climate-highlight-title) {
    color: var(--water-earth);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(21, 128, 61, 0.3);
    padding-bottom: 0.5rem;
  }

  /* Language fallback notice */
   .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(3, 105, 161, 0.1);
    border: 1px solid rgba(3, 105, 161, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--water-primary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--water-primary);
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

  /* Responsive notice */
  @media (max-width: 640px) {
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
</style>
