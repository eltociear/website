<!-- src/routes/frameworks/indigenous-governance-and-traditional-knowledge/+page.svelte -->
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

  // Extract indigenousFramework translations for shorter references
  $: inf = $t('indigenousFramework') || {};
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
  let connectionOpen = false;
  let resourcesOpen = false;

  // Define section groupings for the Indigenous framework
  const sectionGroups = {
    foundation: ['preamble', 'core-principles'],
    governance: ['structural-components', 'implementation-timeline', 'key-mechanisms'],
    implementation: ['expected-outcomes', 'interface-existing-systems'],
    connection: ['pathways-broader-engagement', 'documentation-risk-assessment', 'system-map-visual'],
    resources: ['glossary-references', 'indigenous-framework-essentials']
  };

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Reset all accordions
    foundationOpen = false;
    governanceOpen = false;
    implementationOpen = false;
    connectionOpen = false;
    resourcesOpen = false;

    // Set initial accordion states based on active section
    if (activeSection === 'index') {
      foundationOpen = true;
    } else if (sectionGroups.foundation.includes(activeSection)) {
      foundationOpen = true;
    } else if (sectionGroups.governance.includes(activeSection)) {
      governanceOpen = true;
    } else if (sectionGroups.implementation.includes(activeSection)) {
      implementationOpen = true;
    } else if (sectionGroups.connection.includes(activeSection)) {
      connectionOpen = true;
    } else if (sectionGroups.resources.includes(activeSection) || activeSection === 'indigenous-framework-essentials') {
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
    return inf.sections?.[section] || section;
  }

  // Get section category titles using short references
  function getSectionCategoryTitle(category) {
    return inf.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return inf.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to get section-specific icons for indigenous framework
  function getSectionIcon(section) {
    const sectionIcons = {
      // Overview
      'index': '🌍', // Earth representing global indigenous presence
      
      // Foundation sections
      'preamble': '🪶', // Feather for ceremony and sacred beginning
      'core-principles': '⚖️', // Balance for justice and principles
      
      // Governance sections
      'structural-components': '🏛️', // Building for structure
      'implementation-timeline': '📅', // Calendar for timeline
      'key-mechanisms': '⚙️', // Gear for mechanisms
      
      // Implementation sections
      'expected-outcomes': '🎯', // Target for outcomes
      'interface-existing-systems': '🔗', // Link for interface
      
      // Connection sections
      'pathways-broader-engagement': '🌿', // Plant for growth/pathways
      'documentation-risk-assessment': '📋', // Clipboard for documentation
      'system-map-visual': '🗺️', // Map for visual systems
      
      // Resources
      'glossary-references': '📚', // Books for references
      'indigenous-framework-essentials': '🌱' // Seedling for essentials
    };
    
    return sectionIcons[section] || '🍃'; // Default leaf icon
  }

  // Function to download the indigenous guide PDF
  function downloadIndigenousGuide(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/indigenous-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `indigenous-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isEssentialsActive = activeSection === 'indigenous-framework-essentials';
  $: isSupplementaryActive = ['glossary-references', 'indigenous-framework-essentials'].includes(activeSection);
  $: isResourcesActive = sectionGroups.resources.includes(activeSection) || activeSection === 'indigenous-framework-essentials';
  $: allCoreSections = [
    ...sectionGroups.foundation,
    ...sectionGroups.governance,
    ...sectionGroups.implementation,
    ...sectionGroups.connection,
    ...sectionGroups.resources
  ];
  $: isCoreSection = allCoreSections.includes(activeSection);

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

  function toggleConnection() {
    connectionOpen = !connectionOpen;
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
  <title>{inf.meta?.title || 'Indigenous & Traditional Knowledge Governance Framework - Global Governance Framework'}</title>
  <meta name="description" content="{inf.meta?.description || 'A revolutionary blueprint for planetary transformation, positioning Indigenous peoples as sovereign architects of regenerative governance systems'}" />
</svelte:head>

<SectionNotice 
  type="warning" 
  customContent={true}
>
  <p>{$t('common.notices.section.frameworks.text')}</p>
</SectionNotice>

<SectionNotice type="info" title="Current Status: Internal Review (V0.9 Draft)" customContent={true} dismissible={true}>
  <p>This framework is a comprehensive architectural blueprint. To ensure the highest level of cohesion and integrity, it is currently undergoing a thorough internal review. This foundational work is essential to prepare the materials for the vital next phase of community engagement and co-creation, particularly with Indigenous leaders and governance practitioners. We are meticulously refining all documentation and tools to ensure they are ready for collaborative development.</p>
</SectionNotice>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card for Indigenous Framework -->
      {#if !isPrintMode && !isEssentialsActive && activeSection === 'index'}
        <div class="indigenous-guide-card">
          <div class="card-content">
            <div class="card-icon">🌍</div>
            <div class="card-text">
              <h3>{inf.buttons?.newToFramework || 'New to Indigenous Governance Framework?'}</h3>
              <p>{inf.buttons?.startWithEssentials || 'Start with our accessible essentials guide that explains the framework\'s core principles and Indigenous-led transformation pathway.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('indigenous-framework-essentials')}>
                {inf.buttons?.readEssentials || 'Read the Framework Essentials'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Sub-navigation for indigenous framework sections -->
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
              <span class="accordion-icon">🌱</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">({sectionGroups.foundation.length})</span>
              <span class="toggle-arrow" class:rotated={foundationOpen}>▼</span>
            </button>
            {#if foundationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each sectionGroups.foundation as section}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">{getSectionIcon(section)}</span>
                    <span class="nav-title">{getShortSectionTitle(section)}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Governance Architecture Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={governanceOpen}
              class:has-active={sectionGroups.governance.some(section => activeSection === section)}
              on:click={toggleGovernance}
            >
              <span class="accordion-icon">🏛️</span>
              <span class="accordion-title">{getSectionCategoryTitle('architecture')}</span>
              <span class="section-count">({sectionGroups.governance.length})</span>
              <span class="toggle-arrow" class:rotated={governanceOpen}>▼</span>
            </button>
            {#if governanceOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each sectionGroups.governance as section}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">{getSectionIcon(section)}</span>
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
              class:has-active={sectionGroups.implementation.some(section => activeSection === section)}
              on:click={toggleImplementation}
            >
              <span class="accordion-icon">🌿</span>
              <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
              <span class="section-count">({sectionGroups.implementation.length})</span>
              <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
            </button>
            {#if implementationOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each sectionGroups.implementation as section}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">{getSectionIcon(section)}</span>
                    <span class="nav-title">{getShortSectionTitle(section)}</span>
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Sacred Connections Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={connectionOpen}
              class:has-active={sectionGroups.connection.some(section => activeSection === section)}
              on:click={toggleConnection}
            >
              <span class="accordion-icon">🕸️</span>
              <span class="accordion-title">{getSectionCategoryTitle('connections')}</span>
              <span class="section-count">({sectionGroups.connection.length})</span>
              <span class="toggle-arrow" class:rotated={connectionOpen}>▼</span>
            </button>
            {#if connectionOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each sectionGroups.connection as section}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === section}
                    on:click={() => setActiveSection(section)}
                  >
                    <span class="nav-icon">{getSectionIcon(section)}</span>
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
              class:has-active={isResourcesActive}
              on:click={toggleResources}
            >
              <span class="accordion-icon">📄</span>
              <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'glossary-references'}
                  on:click={() => setActiveSection('glossary-references')}
                >
                  <span class="nav-icon">{getSectionIcon('glossary-references')}</span>
                  <span class="nav-title">{inf.buttons?.appendicesTools || 'Glossary & References'}</span>
                </button>
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === 'indigenous-framework-essentials'}
                  on:click={() => setActiveSection('indigenous-framework-essentials')}
                >
                  <span class="nav-icon">{getSectionIcon('indigenous-framework-essentials')}</span>
                  <span class="nav-title">{inf.buttons?.frameworkEssentials || 'Framework Essentials'}</span>
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
          <span class="progress-text">{inf.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
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
                  <strong>{inf.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{inf.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render ALL sections including index from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
            
            <!-- Navigation buttons at bottom of essentials guide -->
            {#if section === 'indigenous-framework-essentials' && !isPrintMode}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadIndigenousGuide('essentials')}>
                  {inf.buttons?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('preamble')}>
                  {inf.buttons?.continueToFull || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
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
                    ← {inf.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = allCoreSections.indexOf(activeSection);
                    const nextSection = allCoreSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {inf.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{inf.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{inf.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{inf.loading?.text || 'Loading indigenous framework content...'}</p>
  </div>
{/if}

<style>
  /* Indigenous & Traditional Knowledge Governance Framework color scheme */
  /* Earth tones representing connection to land, traditional wisdom, and natural cycles */
  :root {
    --indigenous-primary: #1c2b1a; /* Deep Forest Green - ancestral wisdom, land connection */
    --indigenous-secondary: #6b7280; /* Stone Gray - mountains, stability, endurance */
    --indigenous-earth: #92400e; /* Rich Earth Brown - soil, grounding, traditional knowledge */
    --indigenous-water: #0c4a6e; /* Deep Water Blue - rivers, life source, ceremony */
    --indigenous-fire: #dc2626; /* Sacred Fire Red - transformation, ceremony, life force */
    --indigenous-sun: #f59e0b; /* Golden Sun - guidance, renewal, seven generations */
    --indigenous-plant: #15803d; /* Living Plant Green - growth, medicine, traditional foods */
    --indigenous-sky: #3b82f6; /* Sky Blue - vision, dreams, future generations */
    --indigenous-sage: #6b7280; /* Sage Gray - wisdom, balance, traditional governance */
    --indigenous-light: #84cc16; /* Light Green - hope, renewal, youth leadership */
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
    scroll-margin-top: 2rem; /* Adds space above when scrolled to */
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
    background-color: rgba(28, 43, 26, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(28, 43, 26, 0.1);
    color: var(--indigenous-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(146, 64, 14, 0.1);
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
    background-color: rgba(28, 43, 26, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--indigenous-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--indigenous-earth);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(28, 43, 26, 0.1), rgba(146, 64, 14, 0.1));
    border: 1px solid rgba(28, 43, 26, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--indigenous-primary);
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
    background: linear-gradient(90deg, rgba(28, 43, 26, 0.1), rgba(146, 64, 14, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--indigenous-primary);
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
    background: linear-gradient(90deg, var(--indigenous-primary), var(--indigenous-earth));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--indigenous-primary);
    font-weight: 500;
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
    background-color: var(--indigenous-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--indigenous-earth);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  /* Indigenous framework guide card */
  .indigenous-guide-card {
    background: linear-gradient(135deg, rgba(28, 43, 26, 0.08) 0%, rgba(146, 64, 14, 0.08) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(28, 43, 26, 0.1);
    border: 1px solid rgba(28, 43, 26, 0.2);
    overflow: visible !important;
    position: relative;
    z-index: 1;
  }

  .indigenous-guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: hidden;
    border: 1px solid rgba(28, 43, 26, 0.3);
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
    color: var(--indigenous-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--indigenous-primary);
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
    background-color: var(--indigenous-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--indigenous-earth);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--indigenous-primary);
    border: 1px solid var(--indigenous-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: rgba(28, 43, 26, 0.08);
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

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--indigenous-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--indigenous-earth);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--indigenous-plant);
  }

  /* Styling for h4 headers (#### in Markdown) */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--indigenous-water);
  }

  /* Styling for the inset box (blockquote) - representing sacred teachings */
  :global(blockquote) {
    background-color: rgba(28, 43, 26, 0.05);
    border-left: 4px solid var(--indigenous-earth);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    position: relative;
  }

  :global(blockquote::before) {
    content: "🍃";
    position: absolute;
    left: -12px;
    top: 8px;
    background: white;
    padding: 2px;
    border-radius: 50%;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--indigenous-primary);
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
    color: var(--indigenous-plant);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: var(--indigenous-primary);
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with indigenous-themed symbols */
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

  /* Apply indigenous symbols to all ul li EXCEPT those in section-nav */
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
    color: var(--indigenous-earth);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "🤝";
    color: var(--indigenous-plant);
  }

  /* Table styles for indigenous framework */
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
    background: linear-gradient(to right, var(--indigenous-primary), var(--indigenous-earth));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--indigenous-primary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: rgba(28, 43, 26, 0.03);
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: rgba(28, 43, 26, 0.08);
  }

  :global(.content tbody tr:last-child td) {
    border-bottom: none;
  }

  /* Links */
  .content :global(a) {
    color: var(--indigenous-plant);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--indigenous-primary);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--indigenous-earth);
  }

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
    color: var(--indigenous-water);
    text-decoration: none;
    border-bottom: 1px dotted var(--indigenous-water);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--indigenous-plant);
    border-bottom-color: var(--indigenous-plant);
  }

  .content :global(table a) {
    color: var(--indigenous-plant);
    font-weight: 600;
  }

  /* Indigenous Framework specific theme elements */

  /* Special callouts for indigenous concepts */
  .content :global(.sovereignty-callout) {
    background-color: rgba(28, 43, 26, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-primary);
  }

  .content :global(.traditional-knowledge-callout) {
    background-color: rgba(146, 64, 14, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-earth);
  }

  .content :global(.seven-generations-callout) {
    background-color: rgba(245, 158, 11, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-sun);
  }

  .content :global(.bioregional-callout) {
    background-color: rgba(21, 128, 61, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-plant);
  }

  .content :global(.case-study) {
    background-color: rgba(12, 74, 110, 0.08);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-water);
  }

  .content :global(.case-study-title) {
    color: var(--indigenous-water);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .content :global(.alert) {
    background-color: rgba(220, 38, 38, 0.08);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--indigenous-fire);
  }

  .content :global(.alert-title) {
    color: var(--indigenous-fire);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Highlight boxes for important indigenous concepts */
  .content :global(.concept-highlight) {
    background-color: rgba(28, 43, 26, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(28, 43, 26, 0.2);
  }

  .content :global(.concept-highlight-title) {
    color: var(--indigenous-primary);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(28, 43, 26, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Traditional ecological knowledge styling */
  .content :global(.tek-highlight) {
    background-color: rgba(146, 64, 14, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(146, 64, 14, 0.2);
  }

  .content :global(.tek-highlight-title) {
    color: var(--indigenous-earth);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(146, 64, 14, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Rights of nature and legal styling */
  .content :global(.rights-nature-highlight) {
    background-color: rgba(21, 128, 61, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(21, 128, 61, 0.2);
  }

  .content :global(.rights-nature-highlight-title) {
    color: var(--indigenous-plant);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(21, 128, 61, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Ceremony and governance styling */
  .content :global(.ceremony-highlight) {
    background-color: rgba(245, 158, 11, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .content :global(.ceremony-highlight-title) {
    color: var(--indigenous-sun);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(245, 158, 11, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Climate and water styling */
  .content :global(.water-highlight) {
    background-color: rgba(12, 74, 110, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(12, 74, 110, 0.2);
  }

  .content :global(.water-highlight-title) {
    color: var(--indigenous-water);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(12, 74, 110, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Sacred fire and transformation styling */
  .content :global(.fire-highlight) {
    background-color: rgba(220, 38, 38, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(220, 38, 38, 0.2);
  }

  .content :global(.fire-highlight-title) {
    color: var(--indigenous-fire);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(220, 38, 38, 0.2);
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
  }

  @media (max-width: 640px) {
    :global(.content table) {
      display: block;
      overflow-x: auto;
    }
    
    :global(.content th),
    :global(.content td) {
      white-space: nowrap;
    }
  }

/* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(146, 64, 14, 0.1);
    border: 1px solid rgba(146, 64, 14, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--indigenous-earth);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--indigenous-earth);
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

  .scroll-target {
    height: 1px;
    width: 1px;
    visibility: hidden;
  }
</style>
