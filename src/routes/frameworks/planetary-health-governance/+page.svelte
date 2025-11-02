<!-- src/routes/frameworks/planetary-health-governance/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract planetaryHealthGovernance translations for shorter references
  $: phg = $t('planetaryHealthGovernance') || {};
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
  let toolsResourcesOpen = false;

  // Dropdown states
  let isDropdownOpen = false;

  // Define section groupings for the Planetary Health Governance framework
  const sectionGroups = {
    foundation: ['introduction', 'planetary-health-charter', 'core-principles'],
    governance: ['governance-architecture', 'cross-cutting-policies', 'framework-integration'],
    implementation: ['implementation-roadmap', 'conclusion', 'appendices'],
    toolsResources: ['preamble', 'at-a-glance', 'executive-summary-for-the-skeptic']
  };

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Reset all accordions
    foundationOpen = false;
    governanceOpen = false;
    implementationOpen = false;
    toolsResourcesOpen = false;

    // Set initial accordion states based on active section
    if (activeSection === 'index') {
      foundationOpen = true;
    } else if (sectionGroups.foundation.includes(activeSection)) {
      foundationOpen = true;
    } else if (sectionGroups.governance.includes(activeSection)) {
      governanceOpen = true;
    } else if (sectionGroups.implementation.includes(activeSection)) {
      implementationOpen = true;
    } else if (sectionGroups.toolsResources.includes(activeSection)) {
      toolsResourcesOpen = true;
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
    return phg.sections?.[section] || section;
  }

  // Get section category titles using short references
  function getSectionCategoryTitle(category) {
    return phg.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return phg.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the planetary health governance guide PDF
  function downloadPlanetaryHealthGovernanceGuide(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/planetary-health-governance-guide${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `planetary-health-governance-guide${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: allCoreSections = [
    ...sectionGroups.foundation,
    ...sectionGroups.governance,
    ...sectionGroups.implementation
  ];
  $: isCoreSection = allCoreSections.includes(activeSection);
  $: isToolsResourcesActive = sectionGroups.toolsResources.includes(activeSection);

  // Toggle functions for accordions
  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleGovernance() {
    governanceOpen = !governanceOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleToolsResources() {
    toolsResourcesOpen = !toolsResourcesOpen;
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event) {
    if (!browser) return;
    
    const dropdown = document.querySelector('.card-actions .dropdown');
    
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen = false;
    }
  }

  // Communication guides data
  const communicationGuides = [
    {
      id: 'at-a-glance',
      icon: '📋',
      title: 'At-a-Glance Summary',
      description: 'Quick 2-minute overview for busy professionals'
    },
    {
      id: 'executive-summary-for-the-skeptic',
      icon: '💼',
      title: 'Executive Summary',
      description: 'Detailed analysis for skeptical stakeholders'
    },
    {
      id: 'preamble',
      icon: '🕊️',
      title: 'Sacred Preamble',
      description: 'Poetic introduction to the spiritual foundation'
    }
  ];

  function selectCommunicationGuide(guide) {
    setActiveSection(guide);
    isDropdownOpen = false;
  }

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{phg.meta?.title || 'Planetary Health Governance Framework - Global Governance Framework'}</title>
  <meta name="description" content="{phg.meta?.description || 'Comprehensive framework for governing planetary health through integrated coordination of human, animal, and ecosystem wellbeing'}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Entry Point Card for Communication Suite -->
      {#if !isPrintMode && !isToolsResourcesActive && activeSection === 'index'}
        <div class="communication-suite-card">
          <div class="card-content">
            <div class="card-icon">💚</div>
            <div class="card-text">
              <h3>{phg.communicationCard?.title || 'How would you like to explore Planetary Health Governance?'}</h3>
              <p>{phg.communicationCard?.description || 'Choose the format that best matches your needs and time availability.'}</p>
            </div>
            <div class="card-actions">
              <div class="dropdown">
                <button class="primary-btn dropdown-toggle" on:click={toggleDropdown}>
                  {phg.communicationCard?.buttonText || 'Choose Your Entry Point'} <span class="arrow-icon">▾</span>
                </button>
                {#if isDropdownOpen}
                  <div class="dropdown-menu">
                    {#each communicationGuides as guide}
                      <button class="dropdown-item" on:click={() => selectCommunicationGuide(guide.id)}>
                        <span class="comm-guide-icon">{guide.icon}</span>
                        <div class="comm-guide-info">
                          <span class="comm-guide-title">{guide.title}</span>
                          <span class="comm-guide-desc">{guide.description}</span>
                        </div>
                      </button>
                    {/each}
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item" on:click={() => { setActiveSection('introduction'); isDropdownOpen = false; }}>
                      <span class="comm-guide-icon">🌍</span>
                      <div class="comm-guide-info">
                        <span class="comm-guide-title">Full Framework</span>
                        <span class="comm-guide-desc">Complete comprehensive governance architecture</span>
                      </div>
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for planetary health governance framework sections -->
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
              class:has-active={sectionGroups.foundation.some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">💚</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">({sectionGroups.foundation.length})</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'introduction'}
                  on:click={() => setActiveSection('introduction')}
                >
                  <span class="nav-icon">🌍</span>
                  <span class="nav-title">{getShortSectionTitle('introduction')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'planetary-health-charter'}
                  on:click={() => setActiveSection('planetary-health-charter')}
                >
                  <span class="nav-icon">📜</span>
                  <span class="nav-title">{getShortSectionTitle('planetary-health-charter')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'core-principles'}
                  on:click={() => setActiveSection('core-principles')}
                >
                  <span class="nav-icon">⚖️</span>
                  <span class="nav-title">{getShortSectionTitle('core-principles')}</span>
                </button>
              </div>
            {/if}
          </div>

          <!-- Governance & Architecture Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={governanceOpen}
              class:has-active={sectionGroups.governance.some(section => activeSection === section)}
              on:click={toggleGovernance}
            >
              <span class="accordion-icon">🏛️</span>
              <span class="accordion-title">{getSectionCategoryTitle('governance')}</span>
              <span class="section-count">({sectionGroups.governance.length})</span>
              <span class="toggle-arrow" class:rotated={governanceOpen}>▼</span>
            </button>
            {#if governanceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'governance-architecture'}
                  on:click={() => setActiveSection('governance-architecture')}
                >
                  <span class="nav-icon">🏗️</span>
                  <span class="nav-title">{getShortSectionTitle('governance-architecture')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'cross-cutting-policies'}
                  on:click={() => setActiveSection('cross-cutting-policies')}
                >
                  <span class="nav-icon">🔗</span>
                  <span class="nav-title">{getShortSectionTitle('cross-cutting-policies')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'framework-integration'}
                  on:click={() => setActiveSection('framework-integration')}
                >
                  <span class="nav-icon">🌐</span>
                  <span class="nav-title">{getShortSectionTitle('framework-integration')}</span>
                </button>
              </div>
            {/if}
          </div>

          <!-- Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={implementationOpen}
              class:has-active={sectionGroups.implementation.some(section => activeSection === section)}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🚀</span>
              <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
              <span class="section-count">({sectionGroups.implementation.length})</span>
              <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
            </button>
            {#if implementationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'implementation-roadmap'}
                  on:click={() => setActiveSection('implementation-roadmap')}
                >
                  <span class="nav-icon">🗺️</span>
                  <span class="nav-title">{getShortSectionTitle('implementation-roadmap')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'conclusion'}
                  on:click={() => setActiveSection('conclusion')}
                >
                  <span class="nav-icon">🎯</span>
                  <span class="nav-title">{getShortSectionTitle('conclusion')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'appendices'}
                  on:click={() => setActiveSection('appendices')}
                >
                  <span class="nav-icon">📚</span>
                  <span class="nav-title">{getShortSectionTitle('appendices')}</span>
                </button>
              </div>
            {/if}
          </div>

          <!-- Tools & Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={toolsResourcesOpen}
              class:has-active={isToolsResourcesActive}
              on:click={toggleToolsResources}
            >
              <span class="accordion-icon">🧰</span>
              <span class="accordion-title">{getSectionCategoryTitle('toolsResources')}</span>
              <span class="section-count">({sectionGroups.toolsResources.length})</span>
              <span class="toggle-arrow" class:rotated={toolsResourcesOpen}>▼</span>
            </button>
            {#if toolsResourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'preamble'}
                  on:click={() => setActiveSection('preamble')}
                >
                  <span class="nav-icon">🕊️</span>
                  <span class="nav-title">{getShortSectionTitle('preamble')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'at-a-glance'}
                  on:click={() => setActiveSection('at-a-glance')}
                >
                  <span class="nav-icon">📋</span>
                  <span class="nav-title">{getShortSectionTitle('at-a-glance')}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'executive-summary-for-the-skeptic'}
                  on:click={() => setActiveSection('executive-summary-for-the-skeptic')}
                >
                  <span class="nav-icon">💼</span>
                  <span class="nav-title">{getShortSectionTitle('executive-summary-for-the-skeptic')}</span>
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Progress indicator for core sections -->
      {#if !isPrintMode && isCoreSection && allCoreSections.length > 0}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((allCoreSections.indexOf(activeSection) + 1) / allCoreSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{phg.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
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
                  <strong>{phg.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{phg.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render ALL sections including index from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />

            <!-- Navigation for communication documents -->
            {#if isToolsResourcesActive && !isPrintMode}
              <div class="communication-navigation">
                <div class="nav-description">
                  <h3>Communication Suite</h3>
                  <p>These documents provide different entry points to the Planetary Health Governance Framework for various audiences and time constraints.</p>
                </div>
                <div class="communication-grid">
                  {#each communicationGuides as guide}
                    <button 
                      class="communication-card" 
                      class:active={activeSection === guide.id}
                      on:click={() => setActiveSection(guide.id)}
                    >
                      <div class="comm-card-icon">{guide.icon}</div>
                      <div class="comm-card-title">{guide.title}</div>
                      <div class="comm-card-desc">{guide.description}</div>
                    </button>
                  {/each}
                </div>
                <div class="nav-actions">
                  <button class="secondary-btn" on:click={() => downloadPlanetaryHealthGovernanceGuide()}>
                    {phg.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                  </button>
                  <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                    {phg.navigation?.continueToFramework || 'Explore Full Framework'} <span class="arrow-icon">→</span>
                  </button>
                </div>
              </div>
            {/if}

            <!-- Section navigation at bottom of core sections -->
            {#if isCoreSection && !isPrintMode && allCoreSections.length > 0}
              <div class="section-navigation">
                {#if allCoreSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = allCoreSections.indexOf(activeSection);
                    const prevSection = allCoreSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← {phg.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = allCoreSections.indexOf(activeSection);
                    const nextSection = allCoreSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {phg.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{phg.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{phg.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{phg.loading?.text || 'Loading planetary health governance framework content...'}</p>
  </div>
{/if}

<style>
  /* Planetary Health Governance color scheme - healing greens, earth tones, and vibrant life colors */
  :root {
    --health-primary: #059669; /* Emerald Green - primary health, healing, life */
    --health-secondary: #10b981; /* Green - growth, regeneration, vitality */
    --health-accent: #34d399; /* Light Green - hope, renewal, fresh energy */
    --health-earth: #92400e; /* Earth Brown - grounding, soil, stability */
    --health-deep: #064e3b; /* Deep Green - wisdom, depth, ancient knowledge */
    --health-bright: #6ee7b7; /* Bright Mint - innovation, clarity, fresh thinking */
    --health-forest: #047857; /* Forest Green - nature, ecosystems, biodiversity */
    --health-warm: #f59e0b; /* Warm Amber - community, warmth, connection */
  }

  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, #ecfdf5, #d1fae5);
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
    background-color: rgba(5, 150, 105, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(5, 150, 105, 0.1);
    color: var(--health-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(5, 150, 105, 0.1);
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
    background-color: rgba(5, 150, 105, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--health-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--health-forest);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1));
    border: 1px solid rgba(5, 150, 105, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--health-primary);
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
    background: linear-gradient(90deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--health-primary);
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
    background: linear-gradient(90deg, var(--health-primary), var(--health-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--health-primary);
    font-weight: 500;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
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
    color: var(--health-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--health-forest);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--health-secondary);
  }

  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--health-accent);
  }

  :global(blockquote) {
    background-color: rgba(110, 231, 183, 0.1);
    border-left: 4px solid var(--health-earth);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--health-earth);
    display: block;
    margin-bottom: 0.75rem;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with health-themed bullets */
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
    content: "💚";
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
    color: var(--health-primary);
    font-weight: 600;
  }

  .content :global(ul ul li::before) {
    content: "🌱";
    color: var(--health-accent);
  }

  /* Communication Suite Card */
  .communication-suite-card {
    background: linear-gradient(135deg, rgba(110, 231, 183, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(5, 150, 105, 0.1);
    border: 1px solid rgba(5, 150, 105, 0.2);
    overflow: visible !important;
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
    color: var(--health-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--health-primary);
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
    background-color: var(--health-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--health-forest);
    transform: translateY(-1px);
  }

  .secondary-btn {
    background-color: white;
    color: var(--health-primary);
    border: 1px solid var(--health-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(110, 231, 183, 0.1);
    transform: translateY(-1px);
  }

  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  .download-icon {
    display: inline-block;
    margin-left: 0.25rem;
  }

  /* Dropdown styles */
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
    min-width: 350px;
    max-width: 400px;
    padding: 0.5rem 0;
    margin: 0.125rem 0 0;
    background-color: #fff;
    border: 1px solid rgba(5, 150, 105, 0.3);
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    white-space: normal;
    display: block;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    color: #212529;
    text-align: inherit;
    white-space: normal;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .dropdown-item:hover {
    background-color: rgba(110, 231, 183, 0.1);
    color: var(--health-primary);
  }

  .dropdown-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.5rem 0;
  }
  
  .comm-guide-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .comm-guide-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .comm-guide-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--health-primary);
  }
  
  .comm-guide-desc {
    font-size: 0.875rem;
    color: #6b7280;
  }

  /* Communication Navigation */
  .communication-navigation {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid var(--health-primary);
  }

  .nav-description {
    text-align: center;
    margin-bottom: 2rem;
  }

  .nav-description h3 {
    color: var(--health-primary);
    margin-bottom: 0.5rem;
  }

  .nav-description p {
    color: #6b7280;
    font-size: 1rem;
  }

  .communication-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .communication-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
    text-align: center;
  }

  .communication-card:hover {
    border-color: var(--health-primary);
    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
    transform: translateY(-2px);
  }

  .communication-card.active {
    border-color: var(--health-primary);
    background: rgba(110, 231, 183, 0.1);
  }

  .comm-card-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .comm-card-title {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--health-primary);
    margin-bottom: 0.5rem;
  }

  .comm-card-desc {
    font-size: 0.9rem;
    color: #6b7280;
  }

  .nav-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Link styles for content */
  .content :global(a) {
    color: var(--health-forest);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--health-primary);
    text-decoration: underline;
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
    background-color: var(--health-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--health-forest);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(5, 150, 105, 0.1);
    border: 1px solid rgba(5, 150, 105, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--health-primary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--health-primary);
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

  /* Loading spinner */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid var(--health-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Missing section styling */
  .missing-section {
    text-align: center;
    padding: 2rem;
    background-color: rgba(5, 150, 105, 0.05);
    border-radius: 0.5rem;
    border: 1px solid rgba(5, 150, 105, 0.2);
  }

  .missing-section h2 {
    color: var(--health-primary);
    margin-bottom: 1rem;
  }

  .missing-section p {
    color: #6b7280;
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

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }

    .communication-grid {
      grid-template-columns: 1fr;
    }

    .nav-actions {
      flex-direction: column;
      width: 100%;
    }

    .nav-actions button {
      width: 100%;
    }
  }
</style>
