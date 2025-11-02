<!-- src/routes/frameworks/moral-operating-system/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Extract Moral Operating System translations for shorter references
  $: moralOperatingSystem = $t('moral-operating-system') || {};
  $: translationFunction = $t;

  // Keep track of which section is active (for sub-navigation)
  let activeSection = 'introduction';

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
  let layer1Open = true; // Start with layer 1 (essence) open
  let layer2Open = false;
  let layer3Open = false;
  let layer4Open = false;
  let ecosystemOpen = false;

  // Define section groupings by MOS layers
  const sectionGroups = {
    layer1: ['index', 'essence', 'executive-summary-for-the-skeptic', 'preamble'],
    layer2: ['introduction', 'foundational-values-principles', 'rights-commitments', 'governance-integration', 'implementation-plan'],
    layer3: ['appendix-a', 'appendix-b', 'appendix-c', 'appendix-d'],
    layer4: ['what-is-a-right', 'living-continuum-worth', 'entitlement-to-entanglement', 'spiral-ethical-growth', 'ontological-humility', 'rights-promise-future'],
    ecosystem: ['ecosystem-integration']
  };

  // Section icons - tailored to ethical framework and rights theme
  const sectionIcons = {
    // Layer 1: Essence & Preamble
    'index': '🦋',
    'essence': '💎',
    'preamble': '🌟',
    'executive-summary-for-the-skeptic': '🤔',
    
    // Layer 2: Core Framework
    'introduction': '🔮',
    'foundational-values-principles': '⚖️',
    'rights-commitments': '📜',
    'governance-integration': '🔗',
    'implementation-plan': '🗺️',
    
    // Layer 3: Implementation Appendices
    'appendix-a': '🧭',
    'appendix-b': '📊',
    'appendix-c': '⚙️',
    'appendix-d': '🛠️',
    
    // Layer 4: Philosophical Treatise
    'what-is-a-right': '❓',
    'living-continuum-worth': '🌈',
    'entitlement-to-entanglement': '🕸️',
    'spiral-ethical-growth': '🌀',
    'ontological-humility': '🙏',
    'rights-promise-future': '🌅',
    
    // Ecosystem Integration
    'ecosystem-integration': '🌍'
  };

  // Initialize accordion states after mount
  function initializeAccordionStates() {
    // Reset all accordions
    layer1Open = false;
    layer2Open = false;
    layer3Open = false;
    layer4Open = false;
    ecosystemOpen = false;

    // Set initial accordion states based on active section
    if (sectionGroups.layer1.includes(activeSection)) {
      layer1Open = true;
    } else if (sectionGroups.layer2.includes(activeSection)) {
      layer2Open = true;
    } else if (sectionGroups.layer3.includes(activeSection)) {
      layer3Open = true;
    } else if (sectionGroups.layer4.includes(activeSection)) {
      layer4Open = true;
    } else if (sectionGroups.ecosystem.includes(activeSection)) {
      ecosystemOpen = true;
    } else {
      // Default state for unknown sections
      layer1Open = true;
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
      } else {
        // Default to essence instead of index
        activeSection = 'essence';
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
    return moralOperatingSystem.sections?.[section] || section;
  }

  // Get section category titles using short references
  function getSectionCategoryTitle(category) {
    return moralOperatingSystem.categories?.[category] || category;
  }

  // Function to get shortened section titles for navigation using short references
  function getShortSectionTitle(section) {
    return moralOperatingSystem.sectionsShort?.[section] || getSectionTitle(section);
  }

  // Function to download the MOS guide PDF
  function downloadMOSGuide(version = '') {
    const versionSuffix = version ? `-${version}` : '';
    const pdfUrl = `${base}/assets/pdf/moral-operating-system-framework${versionSuffix}-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `moral-operating-system-framework${versionSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Computed values - add safety checks
  $: allQuickStartSections = ['essence', 'executive-summary-for-the-skeptic'];
  $: isQuickStartActive = allQuickStartSections.includes(activeSection);
  $: allCoreSections = [
    ...sectionGroups.layer2,
    ...sectionGroups.layer3,
    ...sectionGroups.layer4,
    ...sectionGroups.ecosystem
  ];
  $: isCoreSection = allCoreSections.includes(activeSection);

  // Get quick start guides from translations
  $: quickStartGuides = moralOperatingSystem.quickStart?.guides || [
    {
      id: 'essence',
      icon: '💎',
      title: 'One-Page Essence',
      description: 'Rights for all beings in 60 seconds'
    },
    {
      id: 'executive-summary-for-the-skeptic',
      icon: '🤔',
      title: 'For Skeptics',
      description: 'Business case for ethical governance'
    }
  ];

  // For the guide selector
  let selectedGuide = 'essence';

  function selectGuide(guide) {
    selectedGuide = guide;
    setActiveSection(guide);
  }

  // Toggle functions for accordions
  function toggleLayer1() {
    layer1Open = !layer1Open;
  }

  function toggleLayer2() {
    layer2Open = !layer2Open;
  }

  function toggleLayer3() {
    layer3Open = !layer3Open;
  }

  function toggleLayer4() {
    layer4Open = !layer4Open;
  }

  function toggleEcosystem() {
    ecosystemOpen = !ecosystemOpen;
  }

  // For handling dropdown states
  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event) {
    if (browser) {
      const clickedInsideDropdown = event.target.closest('.dropdown');
      if (!clickedInsideDropdown && isDropdownOpen) {
        isDropdownOpen = false;
      }
    }
  }

  // Close dropdown when pressing Escape key
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      isDropdownOpen = false;
    }
  }

  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeydown);
      };
    }
  });

  // Handle locale changes - add safety check
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
<title>{moralOperatingSystem.meta?.title || 'Moral Operating System: Ethical Source Code for Planetary Governance - Global Governance Framework'}</title>
<meta name="description" content="{moralOperatingSystem.meta?.description || 'Rights for humans, animals, ecosystems, AI, and future beings through the Dynamic Rights Spectrum, distributed guardianship, and Right Relationship principles'}" />
</svelte:head>

{#if mounted}
<div class="documentation-container">
  {#if !isPrintMode}
    <FrameworkSidebar />
  {/if}

  <div class="content">
    <!-- Quick Access Card for MOS Quick Start -->
    {#if !isPrintMode && !isQuickStartActive && (activeSection === 'index' || activeSection === 'introduction')}
      <div class="mos-guide-card">
        <div class="card-content">
          <div class="card-icon">🦋</div>
          <div class="card-text">
            <h3>{moralOperatingSystem.quickStart?.new || 'New to the Moral Operating System?'}</h3>
            <p>{moralOperatingSystem.quickStart?.start || 'Start with our quick guides that explain rights for all beings and ethical governance.'}</p>
          </div>
          <div class="card-actions">
            <div class="dropdown">
              <button 
                class="primary-btn dropdown-toggle" 
                on:click={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                type="button"
              >
                {moralOperatingSystem.quickStart?.button || 'Choose Guide'} 
                <span class="arrow-icon" class:rotated={isDropdownOpen}>▾</span>
              </button>
              <div 
                class="dropdown-menu" 
                class:show={isDropdownOpen}
                role="menu"
                aria-hidden={!isDropdownOpen}
              >
                {#each quickStartGuides as guide}
                  <button 
                    class="dropdown-item" 
                    on:click|stopPropagation={() => selectGuide(guide.id)}
                    role="menuitem"
                    type="button"
                  >
                    <span class="guide-icon">{guide.icon}</span>
                    <div class="guide-info">
                      <span class="guide-title">{guide.title}</span>
                      <span class="guide-desc">{guide.description}</span>
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Sub-navigation for MOS framework sections by layers -->
    {#if !isPrintMode && !initializing} 
      <div class="section-nav">
        <!-- Layer 1: Essence & Preamble -->
        <div class="nav-accordion">
          <button 
            class="accordion-header layer1-header" 
            class:open={layer1Open}
            class:has-active={sectionGroups.layer1.some(section => activeSection === section)}
            on:click={toggleLayer1}
          >
            <span class="accordion-icon">💎</span>
            <span class="accordion-title">{getSectionCategoryTitle('layer1') || 'Layer 1: Essence & Preamble'}</span>
            <span class="section-count">({sectionGroups.layer1.length})</span>
            <span class="toggle-arrow" class:rotated={layer1Open}>▼</span>
          </button>
          {#if layer1Open}
            <div class="accordion-content" transition:slide={{ duration: 200 }}>
              {#each sectionGroups.layer1 as section}
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === section}
                  class:featured-item={section === 'essence' || section === 'executive-summary-for-the-skeptic'}
                  on:click={() => setActiveSection(section)}
                >
                  <span class="nav-icon">{sectionIcons[section]}</span>
                  <span class="nav-title">{getShortSectionTitle(section)}</span>
                  {#if section === 'essence'}
                    <span class="featured-badge">Quick</span>
                  {:else if section === 'executive-summary-for-the-skeptic'}
                    <span class="featured-badge">Business</span>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Layer 2: Core Framework -->
        <div class="nav-accordion">
          <button 
            class="accordion-header" 
            class:open={layer2Open}
            class:has-active={sectionGroups.layer2.some(section => activeSection === section)}
            on:click={toggleLayer2}
          >
            <span class="accordion-icon">🔮</span>
            <span class="accordion-title">{getSectionCategoryTitle('layer2') || 'Layer 2: Core Framework'}</span>
            <span class="section-count">({sectionGroups.layer2.length})</span>
            <span class="toggle-arrow" class:rotated={layer2Open}>▼</span>
          </button>
          {#if layer2Open}
            <div class="accordion-content" transition:slide={{ duration: 200 }}>
              {#each sectionGroups.layer2 as section}
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === section}
                  on:click={() => setActiveSection(section)}
                >
                  <span class="nav-icon">{sectionIcons[section]}</span>
                  <span class="nav-title">{getShortSectionTitle(section)}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Layer 3: Implementation Appendices -->
        <div class="nav-accordion">
          <button 
            class="accordion-header" 
            class:open={layer3Open}
            class:has-active={sectionGroups.layer3.some(section => activeSection === section)}
            on:click={toggleLayer3}
          >
            <span class="accordion-icon">🛠️</span>
            <span class="accordion-title">{getSectionCategoryTitle('layer3') || 'Layer 3: Implementation'}</span>
            <span class="section-count">({sectionGroups.layer3.length})</span>
            <span class="toggle-arrow" class:rotated={layer3Open}>▼</span>
          </button>
          {#if layer3Open}
            <div class="accordion-content" transition:slide={{ duration: 200 }}>
              {#each sectionGroups.layer3 as section}
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === section}
                  on:click={() => setActiveSection(section)}
                >
                  <span class="nav-icon">{sectionIcons[section]}</span>
                  <span class="nav-title">{getShortSectionTitle(section)}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Layer 4: Philosophical Treatise -->
        <div class="nav-accordion">
          <button 
            class="accordion-header" 
            class:open={layer4Open}
            class:has-active={sectionGroups.layer4.some(section => activeSection === section)}
            on:click={toggleLayer4}
          >
            <span class="accordion-icon">🌀</span>
            <span class="accordion-title">{getSectionCategoryTitle('layer4') || 'Layer 4: Philosophy'}</span>
            <span class="section-count">({sectionGroups.layer4.length})</span>
            <span class="toggle-arrow" class:rotated={layer4Open}>▼</span>
          </button>
          {#if layer4Open}
            <div class="accordion-content" transition:slide={{ duration: 200 }}>
              {#each sectionGroups.layer4 as section}
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === section}
                  on:click={() => setActiveSection(section)}
                >
                  <span class="nav-icon">{sectionIcons[section]}</span>
                  <span class="nav-title">{getShortSectionTitle(section)}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Ecosystem Integration -->
        <div class="nav-accordion">
          <button 
            class="accordion-header" 
            class:open={ecosystemOpen}
            class:has-active={sectionGroups.ecosystem.some(section => activeSection === section)}
            on:click={toggleEcosystem}
          >
            <span class="accordion-icon">🌍</span>
            <span class="accordion-title">{getSectionCategoryTitle('ecosystem') || 'Ecosystem Integration'}</span>
            <span class="section-count">({sectionGroups.ecosystem.length})</span>
            <span class="toggle-arrow" class:rotated={ecosystemOpen}>▼</span>
          </button>
          {#if ecosystemOpen}
            <div class="accordion-content" transition:slide={{ duration: 200 }}>
              {#each sectionGroups.ecosystem as section}
                <button 
                  class="nav-item subsection-item" 
                  class:active={activeSection === section}
                  on:click={() => setActiveSection(section)}
                >
                  <span class="nav-icon">{sectionIcons[section]}</span>
                  <span class="nav-title">{getShortSectionTitle(section)}</span>
                </button>
              {/each}
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
        <span class="progress-text">{moralOperatingSystem.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
      </div>
    {/if}

    <!-- Show active section, or all sections in print mode -->
    {#each sectionsToShow as section (section)}
      {#if data?.sections?.[section]}
        <div class="section-content" id={section}>
          <!-- Language fallback notice -->
          {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section)}
            <div class="language-fallback-notice">
              <div class="notice-icon">🌐</div>
              <div class="notice-content">
                <strong>{moralOperatingSystem.languageFallback?.title || 'Content in your language coming soon'}</strong>
                <p>{moralOperatingSystem.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
              </div>
            </div>
          {/if}
          
          <!-- Handle quick start sections specially -->
          {#if allQuickStartSections.includes(section) && section !== 'index' && section !== 'introduction'}
            <!-- Quick start selector if we're in one of the guides and not in print mode -->
            {#if !isPrintMode}
              <div class="guide-selector">
                <h2>{moralOperatingSystem.quickStart?.title || 'Moral Operating System Quick Start'}</h2>
                <p>{moralOperatingSystem.quickStart?.description || 'Choose the version that best matches your needs:'}</p>
                
                <div class="guide-cards">
                  {#each quickStartGuides as guide}
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
            
            <!-- Render the selected Quick Start -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
            
            <!-- Navigation buttons at bottom of quick start -->
            {#if !isPrintMode}
              <div class="guide-navigation">
                <button class="secondary-btn" on:click={() => downloadMOSGuide(section.replace('-', ''))}>
                  {moralOperatingSystem.quickStart?.download || 'Download PDF Version'} <span class="download-icon">↓</span>
                </button>
                <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                  {moralOperatingSystem.quickStart?.continue || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                </button>
              </div>
            {/if}
          {:else}
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={translationFunction} />
          {/if}

          {#if activeSection === 'introduction' && !isPrintMode}
            <div class="introduction-navigation">
              <button class="primary-btn" on:click={() => setActiveSection('foundational-values-principles')}>
                {moralOperatingSystem.introduction?.continue || 'Continue to Foundational Values'} 
                <span class="arrow-icon">→</span>
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
                  ← {moralOperatingSystem.navigation?.previousSection || 'Previous Section'}
                </button>
              {/if}
              
              {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                <button class="nav-btn next-btn" on:click={() => {
                  const currentIndex = allCoreSections.indexOf(activeSection);
                  const nextSection = allCoreSections[currentIndex + 1];
                  setActiveSection(nextSection);
                }}>
                  {moralOperatingSystem.navigation?.nextSection || 'Next Section'} →
                </button>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="missing-section">
          <h2>{moralOperatingSystem.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
          <p>{moralOperatingSystem.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
        </div>
      {/if}
    {/each}
  </div>
</div>
{:else}
<!-- Loading state to prevent hydration issues -->
<div class="loading-container">
  <div class="loading-spinner"></div>
  <p>{moralOperatingSystem.loading?.text || 'Loading moral operating system...'}</p>
</div>
{/if}

<style>
  /* Ethereal Wisdom & Rights theme for Moral Operating System */
  :root {
    --primary-brand: #6B46C1;        /* Deep mystical purple (for headers, primary buttons) */
    --accent-action: #EC4899;        /* Vibrant pink/magenta (for CTAs, highlights, love/care) */
    --text-primary: #1F2937;         /* Dark charcoal (instead of pure black for text) */
    --text-secondary: #4B5563;       /* Muted gray for subtitles and secondary info */
    --background-main: #FEFCFF;      /* Very light lavender background */
    --background-alt: #F3F0FF;       /* Light purple for cards or alternate sections */
    --border-color: #E5E7EB;         /* Subtle border color */
    /* Semantic Colors */
    --color-warning: #F59E0B;        /* Golden amber for warnings */
    --color-danger: #DC2626;         /* Deep red for errors */
    --color-success: #10B981;        /* Emerald green for success */
    --color-wisdom: #8B5CF6;         /* Lighter purple for wisdom elements */
    
    /* MOS specific colors */
    --mos-primary: var(--primary-brand);
    --mos-secondary: #8B5CF6;        /* Lighter purple */
    --mos-accent: var(--accent-action);
    --mos-rights: #3B82F6;           /* Blue for rights */
    --mos-consciousness: #F59E0B;    /* Amber for consciousness */
    --mos-spirit: #EC4899;           /* Pink for spiritual elements */
    --mos-light: #F3F0FF;            /* Very light purple */
    --mos-dark: #553C9A;             /* Dark purple */
    
    /* Dynamic Rights Spectrum colors */
    --tier1-human: #3B82F6;          /* Blue for humans */
    --tier2-animals: #10B981;        /* Green for animals */
    --tier3-ecosystems: #059669;     /* Dark green for ecosystems */
    --tier4-ai: #F59E0B;             /* Amber for AI */
    --tier5-planetary: #8B5CF6;      /* Purple for planetary */
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
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(135deg, var(--background-main), var(--background-alt));
    border-radius: 0.75rem;
    padding: 1rem;
    border: 1px solid rgba(107, 70, 193, 0.1);
  }

  .nav-section {
    margin-bottom: 0.5rem;
  }

  .nav-accordion {
    margin-bottom: 0.5rem;
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 4px rgba(107, 70, 193, 0.05);
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
    background-color: rgba(107, 70, 193, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(107, 70, 193, 0.1);
    color: var(--mos-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(139, 92, 246, 0.1);
    border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  }

  /* Special styling for layer 1 header (essence) */
  .layer1-header {
    background: linear-gradient(135deg, rgba(107, 70, 193, 0.1), rgba(139, 92, 246, 0.1));
    border-bottom: 1px solid rgba(107, 70, 193, 0.2);
  }

  .layer1-header.has-active {
    background: linear-gradient(135deg, rgba(107, 70, 193, 0.15), rgba(139, 92, 246, 0.15));
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
    border-top: 1px solid rgba(139, 92, 246, 0.2);
    background-color: #fefcff;
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
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    position: relative;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .nav-item:hover {
    background-color: rgba(107, 70, 193, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--mos-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--mos-dark);
  }

  /* Special styling for featured items (essence and executive summary) */
  .featured-item {
    background: linear-gradient(135deg, rgba(107, 70, 193, 0.08), rgba(139, 92, 246, 0.08));
    border: 1px solid rgba(107, 70, 193, 0.15);
    border-radius: 0.25rem;
    margin: 0.25rem;
    padding-right: 3rem; /* Make space for badge */
  }

  .featured-item.active {
    background: var(--mos-primary);
    border-color: var(--mos-primary);
  }

  .featured-badge {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--mos-accent);
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .featured-item.active .featured-badge {
    background: rgba(255, 255, 255, 0.2);
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

  /* MOS Guide Card */
  .mos-guide-card {
    background: linear-gradient(135deg, #fefcff 0%, #f3f0ff 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(107, 70, 193, 0.1);
    border: 1px solid rgba(107, 70, 193, 0.2);
    overflow: visible !important;
    position: relative;
    z-index: 1;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    position: relative;
    overflow: visible;
  }

  .mos-guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: visible;
    border: 1px solid rgba(107, 70, 193, 0.3);
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
    color: var(--mos-primary);
    flex-shrink: 0;
  }

  .card-text {
    flex: 1;
    min-width: 200px;
  }

  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--mos-primary);
    font-size: 1.25rem;
  }

  .card-text p {
    margin: 0;
    color: #4b5563;
    font-size: 1rem;
  }

  .primary-btn {
    background-color: var(--mos-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover {
    background-color: var(--mos-dark);
    transform: translateY(-1px);
  }

  .secondary-btn {
    background-color: white;
    color: var(--mos-primary);
    border: 1px solid var(--mos-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    background-color: var(--mos-light);
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

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(107, 70, 193, 0.1), rgba(139, 92, 246, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--mos-primary);
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
    background: linear-gradient(90deg, var(--mos-primary), var(--mos-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--mos-primary);
    font-weight: 500;
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
    border: 1px solid rgba(139, 92, 246, 0.2);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .guide-card:hover {
    box-shadow: 0 4px 6px rgba(107, 70, 193, 0.1);
    transform: translateY(-2px);
    border-color: var(--mos-primary);
  }

  .guide-card.active {
    border-color: var(--mos-primary);
    background-color: var(--mos-light);
  }

  .guide-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .guide-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--mos-primary);
  }

  .guide-desc {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .guide-info {
    display: flex;
    flex-direction: column;
  }

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
    top: calc(100% + 4px);
    left: 0;
    z-index: 1001;
    min-width: 320px;
    max-width: 400px;
    padding: 0.5rem 0;
    background-color: #fff;
    border: 1px solid rgba(107, 70, 193, 0.3);
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    white-space: normal;
    /* Default hidden state */
    visibility: hidden;
    opacity: 0;
    transform: translateY(-8px);
    transition: all 0.2s ease;
    pointer-events: none;
  }

  /* Show dropdown when open */
  .dropdown-menu.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
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
    transition: background-color 0.15s ease;
  }

  .dropdown-item:hover, 
  .dropdown-item:focus {
    color: #16181b;
    text-decoration: none;
    background-color: var(--mos-light);
  }

  /* For dropdown guide items */
  .dropdown-item .guide-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-bottom: 0;
    display: inline-block;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }

  .dropdown-item .guide-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .dropdown-item .guide-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--mos-primary);
  }

  .dropdown-item .guide-desc {
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.3;
  }

  /* Section Navigation */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--mos-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--mos-dark);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--mos-primary);
  }

  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--mos-secondary);
  }

  .content :global(h3),
  :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--mos-rights);
  }

  :global(h4) {
    font-size: 1.2rem;
  }

  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  /* Lists - Simple and Clean Styling */
  .content :global(ul), 
  .content :global(ol) {
    margin: 1rem 0 1.5rem 0;
    padding-left: 1.5rem;
    color: #4b5563;
    line-height: 1.6;
  }

  /* Bullet Lists */
  .content :global(ul) {
    list-style-type: disc;
  }

  .content :global(ul li) {
    margin-bottom: 0.5rem;
    padding-left: 0.25rem;
  }

  /* Nested bullet lists */
  .content :global(ul ul) {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
    list-style-type: circle;
  }

  .content :global(ul ul ul) {
    list-style-type: square;
  }

  /* Numbered Lists */
  .content :global(ol) {
    list-style-type: decimal;
  }

  .content :global(ol li) {
    margin-bottom: 0.5rem;
    padding-left: 0.25rem;
  }

  /* Nested numbered lists */
  .content :global(ol ol) {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
    list-style-type: lower-alpha;
  }

  .content :global(ol ol ol) {
    list-style-type: lower-roman;
  }

  /* Mixed nested lists */
  .content :global(ul ol), 
  .content :global(ol ul) {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  /* List markers styling */
  .content :global(li::marker) {
    color: var(--mos-primary);
    font-weight: 500;
  }

  /* Better spacing for lists with paragraphs */
  .content :global(li p) {
    margin: 0.25rem 0;
  }

  .content :global(li p:first-child) {
    margin-top: 0;
  }

  .content :global(li p:last-child) {
    margin-bottom: 0;
  }

  /* Blockquotes */
  :global(blockquote) {
    background-color: var(--mos-light);
    border-left: 4px solid var(--mos-primary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--mos-primary);
    display: block;
    margin-bottom: 0.75rem;
  }

  :global(blockquote ul),
  :global(blockquote ol) {
    margin-left: 0;
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
    color: var(--mos-primary);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: var(--mos-dark);
  }

  /* Tables */
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
    background: linear-gradient(to right, var(--mos-primary), var(--mos-secondary));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--mos-primary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: #fefcff;
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: var(--mos-light);
  }

  :global(.content tbody tr:last-child td) {
    border-bottom: none;
  }

  :global(.content table caption),
  :global(.content table tfoot) {
    background-color: var(--mos-light);
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--mos-primary);
    text-align: left;
    border-top: 1px solid var(--mos-primary);
  }

  :global(.content td.highlight) {
    color: var(--mos-primary);
    font-weight: 600;
  }

  /* Links */
  .content :global(a) {
    color: var(--mos-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--mos-dark);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--mos-dark);
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

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--mos-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--mos-secondary);
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

  /* Loading state */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid var(--mos-light);
    border-top: 3px solid var(--mos-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Missing section styling */
  .missing-section {
    text-align: center;
    padding: 3rem 2rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    margin: 2rem 0;
  }

  .missing-section h2 {
    color: var(--color-danger);
    margin-bottom: 1rem;
  }

  .missing-section p {
    color: #6b7280;
    margin-bottom: 2rem;
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
    
    .guide-cards {
      flex-direction: column;
    }
    
    .guide-card {
      max-width: none;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-btn {
      width: 100%;
      margin: 0 !important;
    }
  }

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

  .arrow-icon {
    display: inline-block;
    margin-left: 0.25rem;
    transition: transform 0.2s ease;
  }

  .arrow-icon.rotated {
    transform: rotate(180deg);
  }

  html {
    scroll-behavior: smooth;
  }

  #main-content {
    scroll-margin-top: 2rem;
  }

  .section-content {
    scroll-margin-top: 2rem;
  }

  .content {
    scroll-margin-top: 2rem;
    position: relative;
  }

  .introduction-navigation {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Special styling for introduction in navigation */
  .nav-item[data-section="introduction"] {
    font-weight: 600;
    background: linear-gradient(135deg, rgba(107, 70, 193, 0.05), rgba(139, 92, 246, 0.05));
    border-left: 3px solid var(--mos-primary);
  }
</style>
