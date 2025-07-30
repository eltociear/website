<!-- src/routes/frameworks/climate-and-energy-governance/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import SectionNotice from '$lib/components/SectionNotice.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract climateFramework translations for shorter references
  $: cf = $t('climateFramework') || {};
  $: translationFunction = $t;
  
  // Debug logging
  $: if (browser && mounted) {
    console.log('Climate Framework translations:', cf);
    console.log('Has climate framework keys:', Object.keys(cf));
  }

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

  // Dropdown states
  let isDropdownOpen = false;
  let isNavDropdownOpen = false;

  // Guide selection
  let selectedGuide = 'climate-energy-technical-guide';

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    const guideIds = ['climate-energy-technical-guide', 'climate-energy-stakeholder-guide', 'climate-energy-action-guide'];
    const foundationSections = [...guideIds, 'introduction', 'guiding-principles'];
    const governanceSections = ['governance-structure', 'core-pillars', 'policy-mechanisms', 'stakeholder-engagement'];
    const implementationSections = ['financing-the-framework', 'implementation-roadmap', 'metrics-for-success', 'challenges-and-solutions', 'implementation-tools', 'conclusion'];
    const resourceSections = ['appendix-a', 'appendix-b'];

    if (foundationSections.includes(activeSection)) {
      foundationOpen = true;
    } else if (governanceSections.includes(activeSection)) {
      governanceOpen = true;
    } else if (implementationSections.includes(activeSection)) {
      implementationOpen = true;
    } else if (resourceSections.includes(activeSection)) {
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
      
      // Setup click outside handler for dropdowns
      document.addEventListener('click', handleClickOutside);
      
      initializing = false;
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        document.removeEventListener('click', handleClickOutside);
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
    return cf.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return cf.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return cf.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the lite guide PDF
  function downloadLiteGuide(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/climate-energy-framework-lite${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `climate-energy-framework-lite${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function selectGuide(guide) {
    selectedGuide = guide;
    setActiveSection(guide);
  }
  
  // Get guides from short reference
  $: guides = cf.guides || [];
  
  // Check if the active section is any of the guides
  $: isGuideActive = ['climate-energy-technical-guide', 'climate-energy-stakeholder-guide', 'climate-energy-action-guide'].includes(activeSection);

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

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    if (isDropdownOpen) isNavDropdownOpen = false;
  }

  function toggleNavDropdown() {
    isNavDropdownOpen = !isNavDropdownOpen;
    if (isNavDropdownOpen) isDropdownOpen = false;
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event) {
    if (!browser) return;
    
    const dropdown = document.querySelector('.card-actions .dropdown');
    const navDropdown = document.querySelector('.dropdown-li');
    
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen = false;
    }
    
    if (navDropdown && !navDropdown.contains(event.target)) {
      isNavDropdownOpen = false;
    }
  }

  // Get the core framework sections (without number prefixes)
  $: coreFrameworkSections = Object.keys(data?.sections || {}).filter(section => 
    !['index', 'climate-energy-technical-guide', 'climate-energy-stakeholder-guide', 'climate-energy-action-guide', 'appendix-a', 'appendix-b'].includes(section)
  );

  // Check if current section is supplementary
  $: isSupplementaryActive = ['appendix-a', 'appendix-b'].includes(activeSection);

  // Get section progress for core sections
  $: getSectionProgress = () => {
    const coreIndex = coreFrameworkSections.indexOf(activeSection);
    return coreIndex >= 0 ? coreIndex + 1 : 0;
  };

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{cf.meta?.title || 'Climate & Energy Framework'}</title>
  <meta name="description" content="{cf.meta?.description || 'Climate & Energy Framework'}" />
</svelte:head>

<SectionNotice 
  type="warning" 
  customContent={true}
>
  <p>{$t('common.notices.section.frameworks.q42025redraft')}</p>
</SectionNotice>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Lite Guides -->
      {#if !isPrintMode && !isGuideActive && activeSection === 'index'}
        <div class="lite-guide-card">
          <div class="card-content">
            <div class="card-icon">📘</div>
            <div class="card-text">
              <h3>{cf.guideCard?.title || 'New to the Climate & Energy Framework?'}</h3>
              <p>{cf.guideCard?.description || 'Start with one of our simplified guides that explain the core concepts for different audiences.'}</p>
            </div>
            <div class="card-actions">
              <div class="dropdown">
                <button class="primary-btn dropdown-toggle" on:click={toggleDropdown}>
                  {cf.guideCard?.buttonText || 'Choose a Guide'} <span class="arrow-icon">▾</span>
                </button>
                {#if isDropdownOpen}
                  <div class="dropdown-menu">
                    {#each guides as guide}
                      <button class="dropdown-item" on:click={() => { selectGuide(guide.id); isDropdownOpen = false; }}>
                        <span class="guide-icon">{guide.icon}</span>
                        <div class="guide-info">
                          <span class="guide-title">{guide.title}</span>
                          <span class="guide-desc">{guide.description}</span>
                        </div>
                      </button>
                    {/each}
                  </div>
                {/if}
              </div>
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
              class:has-active={isGuideActive || ['introduction', 'guiding-principles'].includes(activeSection)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">(5)</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each guides as guide}
                  {#if data?.sections?.[guide.id]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === guide.id}
                      on:click={() => setActiveSection(guide.id)}
                    >
                      <span class="nav-icon">{guide.icon}</span>
                      <span class="nav-title">{getShortSectionTitle(guide.id)}</span>
                    </button>
                  {/if}
                {/each}
                {#if data?.sections?.['introduction']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'introduction'}
                    on:click={() => setActiveSection('introduction')}
                  >
                    <span class="nav-icon">📋</span>
                    <span class="nav-title">{getShortSectionTitle('introduction')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['guiding-principles']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'guiding-principles'}
                    on:click={() => setActiveSection('guiding-principles')}
                  >
                    <span class="nav-icon">📋</span>
                    <span class="nav-title">{getShortSectionTitle('guiding-principles')}</span>
                  </button>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Governance Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={governanceOpen}
              class:has-active={['governance-structure', 'core-pillars', 'policy-mechanisms', 'stakeholder-engagement'].some(section => activeSection === section)}
              on:click={toggleGovernance}
            >
              <span class="accordion-icon">🏛️</span>
              <span class="accordion-title">{getSectionCategoryTitle('governance')}</span>
              <span class="section-count">(4)</span>
              <span class="toggle-arrow" class:rotated={governanceOpen}>▼</span>
            </button>
            {#if governanceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each ['governance-structure', 'core-pillars', 'policy-mechanisms', 'stakeholder-engagement'] as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">📋</span>
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
              class:has-active={['financing-the-framework', 'implementation-roadmap', 'metrics-for-success', 'challenges-and-solutions', 'implementation-tools', 'conclusion'].some(section => activeSection === section)}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
              <span class="section-count">(6)</span>
              <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
            </button>
            {#if implementationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each ['financing-the-framework', 'implementation-roadmap', 'metrics-for-success', 'challenges-and-solutions', 'implementation-tools', 'conclusion'] as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">📋</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
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
              class:has-active={isSupplementaryActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📄</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#if data?.sections?.['appendix-a']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'appendix-a'}
                    on:click={() => setActiveSection('appendix-a')}
                  >
                    <span class="nav-icon">📋</span>
                    <span class="nav-title">{getSectionTitle('appendix-a')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['appendix-b']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'appendix-b'}
                    on:click={() => setActiveSection('appendix-b')}
                  >
                    <span class="nav-icon">📖</span>
                    <span class="nav-title">{getSectionTitle('appendix-b')}</span>
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && coreFrameworkSections.includes(activeSection)}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((getSectionProgress() / coreFrameworkSections.length) * 100)}%"></div>
          </div>
          <span class="progress-text">{cf.progress?.text?.replace('{current}', getSectionProgress()).replace('{total}', coreFrameworkSections.length) || `Section ${getSectionProgress()} of ${coreFrameworkSections.length}`}</span>
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
                  <strong>{cf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{cf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}

            {#if section.startsWith('climate-energy-')}
              <!-- Guide selector if we're in one of the guides and not in print mode -->
              {#if !isPrintMode}
                <div class="guide-selector">
                  <h2>{cf.guideSelector?.title || 'Climate & Energy Framework Guides'}</h2>
                  <p>{cf.guideSelector?.description || 'Choose the guide version that best matches your needs:'}</p>
                  
                  <div class="guide-cards">
                    {#each guides as guide}
                      <div 
                        class="guide-card" 
                        class:active={activeSection === guide.id}
                        on:click={() => selectGuide(guide.id)}
                        on:keydown={(e) => e.key === 'Enter' && selectGuide(guide.id)}
                        role="button"
                        tabindex="0"
                      >
                        <div class="guide-icon">{guide.icon}</div>
                        <div class="guide-title">{guide.title}</div>
                        <div class="guide-desc">{guide.description}</div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <!-- Render the selected Guide -->
              <svelte:component this={data.sections[section].default} t={translationFunction} />
              
              <!-- Navigation buttons at bottom of guide -->
              {#if !isPrintMode}
                <div class="lite-guide-navigation">
                  <button class="secondary-btn" on:click={() => downloadLiteGuide(section.replace('climate-energy-', ''))}>
                    {cf.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                  </button>
                  <button class="primary-btn" on:click={() => setActiveSection('index')}>
                    {cf.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                  </button>
                </div>
              {/if}

            {:else}
              <!-- Render ALL sections including index from markdown files -->
              <svelte:component this={data.sections[section].default} t={translationFunction} />
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if coreFrameworkSections.includes(activeSection) && !isPrintMode}
              <div class="section-navigation">
                {#if getSectionProgress() > 1}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const prevSection = coreFrameworkSections[currentIndex - 1];
                    if (prevSection) setActiveSection(prevSection);
                  }}>
                    ← {cf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if getSectionProgress() < coreFrameworkSections.length}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    if (nextSection) setActiveSection(nextSection);
                  }}>
                    {cf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{cf.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{cf.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{cf.loading?.text || 'Loading climate & energy content...'}</p>
  </div>
{/if}

<style>
  /* Climate & Energy Framework color scheme */
  :root {
    --energy-primary: #2B4B8C;
    --energy-secondary: #4B8AC2;
    --energy-accent: #6DAA3F;
    --energy-success: #20B2AA;
    --energy-warning: #F5A623;
    --energy-danger: #C43B3B;
    --energy-light: #E8F4FD;
    --energy-dark: #1A365D;
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
    border-top: 4px solid var(--energy-primary);
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
    background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
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
    background-color: rgba(75, 138, 194, 0.05);
  }

  .accordion-header:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    background-color: rgba(75, 138, 194, 0.1);
  }

  .accordion-header.has-active {
    background-color: rgba(43, 75, 140, 0.1);
    color: var(--energy-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(75, 138, 194, 0.1);
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
    background-color: rgba(75, 138, 194, 0.05);
    color: #374151;
  }

  .nav-item:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    background-color: rgba(75, 138, 194, 0.1);
  }

  .nav-item.active {
    background-color: var(--energy-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--energy-secondary);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1), rgba(75, 138, 194, 0.1));
    border: 1px solid rgba(43, 75, 140, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--energy-primary);
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
    background: linear-gradient(90deg, rgba(43, 75, 140, 0.1), rgba(75, 138, 194, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--energy-primary);
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
    background: linear-gradient(90deg, var(--energy-primary), var(--energy-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--energy-primary);
    font-weight: 500;
  }

  /* Lite Guide card */
  .lite-guide-card {
    background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    border: 1px solid rgba(43, 75, 140, 0.2);
    overflow: visible !important;
    position: relative;
    z-index: 1;
  }

  .lite-guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: visible;
    border: 1px solid rgba(43, 75, 140, 0.3);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    color: var(--energy-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--energy-primary);
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
    background-color: var(--energy-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--energy-secondary);
    transform: translateY(-1px);
  }

  .primary-btn:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    background-color: var(--energy-secondary);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--energy-primary);
    border: 1px solid var(--energy-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: #e8eaf6;
    transform: translateY(-1px);
  }

  .secondary-btn:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    background-color: #e8eaf6;
    transform: translateY(-1px);
  }
  
  .lite-guide-navigation {
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
    background-color: var(--energy-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--energy-secondary);
    transform: translateY(-1px);
  }

  .nav-btn:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    background-color: var(--energy-secondary);
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
    background-color: rgba(75, 138, 194, 0.1);
    border: 1px solid rgba(75, 138, 194, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--energy-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--energy-secondary);
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
    color: var(--energy-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--energy-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--energy-accent);
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
    background-color: #f3f6f9;
    border-left: 4px solid var(--energy-primary);
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
    content: "✦";
    position: absolute;
    left: 0;
    top: 0.1em;
    color: var(--energy-primary);
    font-size: 0.9rem;
  }

  /* Links */
  .content :global(a) {
    color: var(--energy-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--energy-dark);
  }
  
  /* Dropdown styles for guides */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    width: auto !important;
    min-width: 300px !important;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    margin-top: 0;
    padding-top: 10px;
    white-space: normal !important;
    display: block;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: normal !important;
    background-color: transparent;
    border: 0;
    cursor: pointer;
  }
  
  .dropdown-item:hover, .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: #e8eaf6;
  }

  .dropdown-item:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
  }
  
  /* Guide selector styles */
  .guide-selector {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .guide-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .guide-card {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .guide-card:hover {
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    transform: translateY(-2px);
    border-color: var(--energy-primary);
  }

  .guide-card:focus-visible {
    outline: 2px solid var(--energy-accent);
    outline-offset: 2px;
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    transform: translateY(-2px);
    border-color: var(--energy-primary);
  }
  
  .guide-card.active {
    border-color: var(--energy-primary);
    background-color: #e8eaf6;
  }
  
  .guide-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .guide-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--energy-primary);
  }
  
  .guide-desc {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .guide-info {
    display: flex;
    flex-direction: column;
  }
  
  /* For dropdown guide items */
  .dropdown-item .guide-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-bottom: 0;
    display: inline-block;
    width: 24px;
    text-align: center;
  }
  
  .dropdown-item .guide-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .dropdown-item .guide-desc {
    font-size: 0.75rem;
    color: #6b7280;
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
    
    .lite-guide-navigation {
      flex-direction: column;
      gap: 1rem;
    }
    
    .lite-guide-navigation button {
      width: 100%;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }
    
    .guide-cards {
      flex-direction: column;
    }
    
    .guide-card {
      max-width: none;
    }

    .loading-container {
      padding: 2rem 1rem;
    }
  }
</style>
