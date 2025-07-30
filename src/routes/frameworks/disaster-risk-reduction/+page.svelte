<!-- src/routes/frameworks/disaster-risk-reduction/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import SectionNotice from '$lib/components/SectionNotice.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, afterUpdate, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract disasterFramework translations for shorter references
  $: df = $t('disasterFramework') || {};
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
  let frameworkOpen = false;
  let implementationOpen = false;
  let advancedOpen = false;
  let synthesisOpen = false;
  let resourcesOpen = false;

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Set initial accordion states based on active section
    if (['introduction', 'principles'].includes(activeSection)) {
      foundationOpen = true;
    } else if (['components', 'approaches', 'engagement'].includes(activeSection)) {
      frameworkOpen = true;
    } else if (['barriers', 'resources', 'monitoring'].includes(activeSection)) {
      implementationOpen = true;
    } else if (['governance', 'scalability'].includes(activeSection)) {
      advancedOpen = true;
    } else if (['conclusion', 'annexes'].includes(activeSection)) {
      synthesisOpen = true;
    } else if (['technical-guide', 'community-guide', 'emergency-response-guide', 'case-studies', 'tools-templates'].includes(activeSection)) {
      resourcesOpen = true;
    } else {
      // Default state for overview
      foundationOpen = true;
    }
  }

  onMount(async () => {
    await tick();
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
    return df.sections?.[section] || section;
  }

  // Group sections logically with multi-lingual support using short references
  function getSectionCategoryTitle(category) {
    return df.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return df.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the framework PDF
  function downloadFramework(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/disaster-risk-reduction-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `disaster-risk-reduction-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: isGuideActive = ['technical-guide', 'community-guide', 'emergency-response-guide'].includes(activeSection);
  $: isSupplementaryActive = isGuideActive || ['case-studies', 'tools-templates'].includes(activeSection);
  $: foundationSections = ['introduction', 'principles'];
  $: frameworkSections = ['components', 'approaches', 'engagement'];
  $: implementationSections = ['barriers', 'resources', 'monitoring'];
  $: advancedSections = ['governance', 'scalability'];
  $: synthesisSections = ['conclusion', 'annexes'];
  $: coreFrameworkSections = [...foundationSections, ...frameworkSections, ...implementationSections, ...advancedSections, ...synthesisSections];
  $: isCoreSection = coreFrameworkSections.includes(activeSection);

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleFramework() {
    frameworkOpen = !frameworkOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleAdvanced() {
    advancedOpen = !advancedOpen;
  }

  function toggleSynthesis() {
    synthesisOpen = !synthesisOpen;
  }

  function toggleResources() {
    resourcesOpen = !resourcesOpen;
  }

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }

  // Guide selector functionality
  let selectedGuide = 'technical-guide';
  
  function selectGuide(guide) {
    selectedGuide = guide;
    setActiveSection(guide);
  }

  // Get guides from translation data
  $: guides = df.guides || [
    { id: 'technical-guide', title: 'Technical Guide', description: 'Detailed guide for policy implementers', icon: '📊' },
    { id: 'community-guide', title: 'Community Guide', description: 'Practical guide for community leaders', icon: '🤝' },
    { id: 'emergency-response-guide', title: 'Emergency Response Guide', description: 'Rapid response guide', icon: '🚨' }
  ];
</script>

<svelte:head>
  <title>{df.meta?.title || 'Disaster Risk Reduction & Resilience Framework - Global Governance Framework'}</title>
  <meta name="description" content="{df.meta?.description || 'A comprehensive framework for building disaster resilience through community-centered approaches and innovative governance'}" />
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
      <!-- Quick Access Card for DRR Framework -->
      {#if !isPrintMode && !isGuideActive && activeSection === 'index'}
        <div class="drr-guide-card">
          <div class="card-content">
            <div class="card-icon">🌍</div>
            <div class="card-text">
              <h3>{df.guideCard?.title || 'New to Disaster Risk Reduction & Resilience Framework?'}</h3>
              <p>{df.guideCard?.description || 'Start with our introduction that explains the framework\'s vision, global context, and collaborative development approach.'}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                {df.guideCard?.buttonText || 'Read the Introduction'} <span class="arrow-icon">→</span>
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

          <!-- Foundation & Principles Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={foundationSections.some(section => activeSection === section)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">🌟</span>
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
                      <span class="nav-icon">🔹</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Core Framework Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={frameworkOpen}
              class:has-active={frameworkSections.some(section => activeSection === section)}
              on:click={toggleFramework}
            >
              <span class="accordion-icon">🏗️</span>
              <span class="accordion-title">{getSectionCategoryTitle('framework')}</span>
              <span class="section-count">({frameworkSections.length})</span>
              <span class="toggle-arrow" class:rotated={frameworkOpen}>▼</span>
            </button>
            {#if frameworkOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each frameworkSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">🔹</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Implementation Guidance Accordion -->
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
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">🔹</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Advanced Implementation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={advancedOpen}
              class:has-active={advancedSections.some(section => activeSection === section)}
              on:click={toggleAdvanced}
            >
              <span class="accordion-icon">⚙️</span>
              <span class="accordion-title">{getSectionCategoryTitle('advanced')}</span>
              <span class="section-count">({advancedSections.length})</span>
              <span class="toggle-arrow" class:rotated={advancedOpen}>▼</span>
            </button>
            {#if advancedOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each advancedSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">🔹</span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Synthesis & Resources Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={synthesisOpen}
              class:has-active={synthesisSections.some(section => activeSection === section)}
              on:click={toggleSynthesis}
            >
              <span class="accordion-icon">📚</span>
              <span class="accordion-title">{getSectionCategoryTitle('synthesis')}</span>
              <span class="section-count">({synthesisSections.length})</span>
              <span class="toggle-arrow" class:rotated={synthesisOpen}>▼</span>
            </button>
            {#if synthesisOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each synthesisSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">{section === 'conclusion' ? '✨' : '📄'}</span>
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
              <span class="section-count">(5)</span>
              <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
            </button>
            {#if resourcesOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each guides as guide}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === guide.id}
                    on:click={() => setActiveSection(guide.id)}
                  >
                    <span class="nav-icon">{guide.icon}</span>
                    <span class="nav-title">{guide.title}</span>
                  </button>
                {/each}
                {#if data?.sections?.['case-studies']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'case-studies'}
                    on:click={() => setActiveSection('case-studies')}
                  >
                    <span class="nav-icon">📖</span>
                    <span class="nav-title">{getSectionTitle('case-studies')}</span>
                  </button>
                {/if}
                {#if data?.sections?.['tools-templates']}
                  <button 
                    class="nav-item subsection-item" 
                    class:active={activeSection === 'tools-templates'}
                    on:click={() => setActiveSection('tools-templates')}
                  >
                    <span class="nav-icon">🔧</span>
                    <span class="nav-title">{getSectionTitle('tools-templates')}</span>
                  </button>
                {/if}
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
          <span class="progress-text">{df.progress?.text?.replace('{current}', coreFrameworkSections.indexOf(activeSection) + 1).replace('{total}', coreFrameworkSections.length) || `Section ${coreFrameworkSections.indexOf(activeSection) + 1} of ${coreFrameworkSections.length}`}</span>
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
                  <strong>{df.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{df.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            {#if isGuideActive && section === activeSection}
              <!-- Guide selector if we're in one of the guides and not in print mode -->
              {#if !isPrintMode}
                <div class="guide-selector">
                  <h2>Disaster Risk Reduction Framework Guides</h2>
                  <p>Choose the guide version that best matches your needs:</p>
                  
                  <div class="guide-cards">
                    {#each guides as guide}
                      <div 
                        class="guide-card" 
                        class:active={activeSection === guide.id}
                        on:click={() => selectGuide(guide.id)}
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
              <svelte:component this={data.sections[section].default} />
              
              <!-- Navigation buttons at bottom of guide -->
              {#if !isPrintMode}
                <div class="guide-navigation">
                  <button class="secondary-btn" on:click={() => downloadFramework(section.replace('-guide', ''))}>
                    {df.navigation?.downloadPdf || 'Download PDF Version'} <span class="download-icon">↓</span>
                  </button>
                  <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                    {df.navigation?.continueToFramework || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                  </button>
                </div>
              {/if}

            {:else}
              <!-- Render ALL sections including index from markdown files -->
              <svelte:component this={data.sections[section].default} t={translationFunction} />
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
                    ← {df.navigation?.previousSection || 'Previous Section'}
                  </button>
                {/if}
                
                {#if coreFrameworkSections.indexOf(activeSection) < coreFrameworkSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = coreFrameworkSections.indexOf(activeSection);
                    const nextSection = coreFrameworkSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    {df.navigation?.nextSection || 'Next Section'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{df.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
            <p>{df.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
 {:else}
  <!-- Loading state to prevent hydration issues -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{df.loading?.text || 'Loading disaster risk reduction content...'}</p>
  </div>
{/if}

<style>
  /* DRR Framework color scheme - inspired by earth, climate, and resilience */
  :root {
    --drr-primary: #2B4B8C; /* Cosmic Blue - stability, trust, governance */
    --drr-secondary: #6b7280; /* Grounding Gray - balance, neutrality */
    --drr-earth: #2D5F2D; /* Earthy Green - nature, sustainability, ecosystems */
    --drr-climate: #4B5CA5; /* Climate Purple - adaptation, transformation */
    --drr-community: #C43B3B; /* Community Red - urgency, action, solidarity */
    --drr-resilience: #DAA520; /* Resilience Gold - hope, strength, recovery */
    --drr-water: #1E6B96; /* Water Blue - flow, adaptation, life */
    --drr-wisdom: #8B4513; /* Wisdom Brown - indigenous knowledge, grounding */
    --drr-healing: #6DAA3F; /* Healing Green - recovery, regeneration */
    --drr-innovation: #9370DB; /* Innovation Purple - creativity, solutions */
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
    background-color: rgba(45, 95, 45, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(43, 75, 140, 0.1);
    color: var(--drr-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(45, 95, 45, 0.1);
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
    background-color: rgba(45, 95, 45, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--drr-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--drr-earth);
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1), rgba(45, 95, 45, 0.1));
    border: 1px solid rgba(43, 75, 140, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .overview-item.active {
    background: var(--drr-primary);
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
    background: linear-gradient(90deg, rgba(43, 75, 140, 0.1), rgba(45, 95, 45, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--drr-primary);
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
    background: linear-gradient(90deg, var(--drr-primary), var(--drr-earth));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--drr-primary);
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
  
  /* Additional styles for markdown content with DRR theme */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--drr-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--drr-earth);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--drr-climate);
  }

  /* Styling for h4 headers */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--drr-water);
  }

  /* Styling for blockquote - representing community wisdom */
  :global(blockquote) {
    background-color: rgba(43, 75, 140, 0.05);
    border-left: 4px solid var(--drr-earth);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
    position: relative;
  }

  :global(blockquote::before) {
    content: "🌍";
    position: absolute;
    left: -12px;
    top: 8px;
    background: white;
    padding: 2px;
    border-radius: 50%;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--drr-primary);
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
    color: var(--drr-climate);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: var(--drr-primary);
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with DRR themed symbols */
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

  /* Apply shield symbols to all ul li EXCEPT those in section-nav */
  .content :global(ul li:not(.section-nav li))::before {
    content: "🛡️";
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
    color: var(--drr-climate);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "🔹";
    color: var(--drr-earth);
  }

  /* Table styles for DRR framework */
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
    background: linear-gradient(to right, var(--drr-primary), var(--drr-earth));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--drr-primary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: rgba(43, 75, 140, 0.03);
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: rgba(43, 75, 140, 0.08);
  }

  :global(.content tbody tr:last-child td) {
    border-bottom: none;
  }

  /* For responsive tables on small screens */
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
  
  /* DRR framework guide card */
  .drr-guide-card {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.08) 0%, rgba(45, 95, 45, 0.08) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    border: 1px solid rgba(43, 75, 140, 0.2);
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
    color: var(--drr-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--drr-primary);
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
    background-color: var(--drr-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: var(--drr-earth);
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--drr-primary);
    border: 1px solid var(--drr-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    background-color: rgba(43, 75, 140, 0.08);
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
    color: var(--drr-climate);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--drr-primary);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--drr-earth);
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
    color: var(--drr-water);
    text-decoration: none;
    border-bottom: 1px dotted var(--drr-water);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--drr-climate);
    border-bottom-color: var(--drr-climate);
  }

  /* Make sure links in tables are readable against the background */
  .content :global(table a) {
    color: var(--drr-climate);
    font-weight: 600;
  }

  /* Links in the section navigation */
  .section-nav a {
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s;
  }

  .section-nav a:hover {
    color: var(--drr-primary);
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
    background-color: var(--drr-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--drr-earth);
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
    
    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .section-navigation button {
      width: 100%;
    }
  }

  /* DRR Framework specific theme elements */

  /* Special callouts for DRR concepts */
  .content :global(.resilience-callout) {
    background-color: rgba(43, 75, 140, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-primary);
  }

  .content :global(.community-callout) {
    background-color: rgba(45, 95, 45, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-earth);
  }

  .content :global(.climate-callout) {
    background-color: rgba(75, 92, 165, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-climate);
  }

  .content :global(.innovation-callout) {
    background-color: rgba(218, 165, 32, 0.08);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-resilience);
  }

  /* Special styling for case studies */
  .content :global(.case-study) {
    background-color: rgba(30, 107, 150, 0.08);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-water);
  }

  .content :global(.case-study-title) {
    color: var(--drr-water);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Alert/warning styling */
  .content :global(.alert) {
    background-color: rgba(196, 59, 59, 0.08);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border-left: 4px solid var(--drr-community);
  }

  .content :global(.alert-title) {
    color: var(--drr-community);
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* Highlight boxes for important DRR concepts */
  .content :global(.concept-highlight) {
    background-color: rgba(43, 75, 140, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(43, 75, 140, 0.2);
  }

  .content :global(.concept-highlight-title) {
    color: var(--drr-primary);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(43, 75, 140, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Indigenous knowledge integration styling */
  .content :global(.indigenous-knowledge-highlight) {
    background-color: rgba(139, 69, 19, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(139, 69, 19, 0.2);
  }

  .content :global(.indigenous-knowledge-highlight-title) {
    color: var(--drr-wisdom);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Ecosystem-based solutions styling */
  .content :global(.ecosystem-highlight) {
    background-color: rgba(109, 170, 63, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(109, 170, 63, 0.2);
  }

  .content :global(.ecosystem-highlight-title) {
    color: var(--drr-healing);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(109, 170, 63, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Gender-responsive and inclusive DRR styling */
  .content :global(.inclusive-highlight) {
    background-color: rgba(147, 112, 219, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(147, 112, 219, 0.2);
  }

  .content :global(.inclusive-highlight-title) {
    color: var(--drr-innovation);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(147, 112, 219, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Climate adaptation styling */
  .content :global(.adaptation-highlight) {
    background-color: rgba(30, 107, 150, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(30, 107, 150, 0.2);
  }

  .content :global(.adaptation-highlight-title) {
    color: var(--drr-water);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(30, 107, 150, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Conflict-sensitive DRR styling */
  .content :global(.conflict-sensitive-highlight) {
    background-color: rgba(196, 59, 59, 0.05);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 1.5rem 0;
    border: 1px solid rgba(196, 59, 59, 0.2);
  }

  .content :global(.conflict-sensitive-highlight-title) {
    color: var(--drr-community);
    font-weight: 600;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid rgba(196, 59, 59, 0.2);
    padding-bottom: 0.5rem;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(45, 95, 45, 0.1);
    border: 1px solid rgba(45, 95, 45, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--drr-earth);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--drr-earth);
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
