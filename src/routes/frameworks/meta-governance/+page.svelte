<!-- src/routes/frameworks/meta-governance/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import ConstellationMap from '$lib/components/ConstellationMap.svelte';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, afterUpdate } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Keep track of which section is active (for sub-navigation)
  let activeSection = data.initialSection || 'introduction'; // Start with the section from load function
  let mounted = false;

  onMount(() => {
    mounted = true;
    if (browser) {
      // Function to handle hash changes and initial load
      const handleHashNavigation = () => {
        const hash = window.location.hash.substring(1);
        if (DEBUG_LOG) console.log('Hash detected:', hash); // Debug log
        
        if (hash && data.sections[hash]) {
          if (DEBUG_LOG) console.log('Setting active section to:', hash); // Debug log
          activeSection = hash;
          
          // Scroll to content after a brief delay
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
        } else if (hash && hash !== 'index' && hash !== '') {
          // If hash doesn't match a section, default to index but keep the hash
          if (DEBUG_LOG) console.log('Hash not found, defaulting to index but keeping hash:', hash);
          activeSection = 'index';
        } else {
          // No hash or introduction hash
          activeSection = data.initialSection || 'introduction';
        }
      };

      // Handle initial page load
      handleHashNavigation();
      
      // Listen for hash changes (for same-page navigation)
      const handleHashChangeEvent = () => {
        if (DEBUG_LOG) console.log('Hash change event triggered'); // Debug log
        handleHashNavigation();
      };

      window.addEventListener('hashchange', handleHashChangeEvent);
      
      // Also listen for popstate (back/forward navigation)
      window.addEventListener('popstate', handleHashNavigation);
      
      return () => {
        window.removeEventListener('hashchange', handleHashChangeEvent);
        window.removeEventListener('popstate', handleHashNavigation);
      };
    }
  });

  // Function to set active section
  function setActiveSection(section) {
    if (browser && section !== activeSection) {
      // Only update the hash, not the full URL path
      window.location.hash = section;
      activeSection = section;
      
      // Scroll to content
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

  // Check if we're in print mode
  const isPrintMode = data.isPrintMode;

  // If in print mode, we'll show all sections
  // This is a special state just for PDF generation
  $: sectionsToShow = isPrintMode ? Object.keys(data.sections || {}) : [activeSection];

  // Make this function available globally for the PDF generator
  if (browser) {
    window.showAllSectionsForPrint = () => {
      sectionsToShow = Object.keys(data.sections || {});
    };
  }

  // This will track the current locale for our component
  $: currentLocale = $locale;

  // Swedish translations for the INTRODUCTION section (renamed from introSv)
  const introductionTextSv = {
    title: "Integrerad Meta-Styrning",
    subtitle: "En introduktion till planetär samordning",
    paragraph1: "Integrerad meta-styrning är konsten och arkitekturen att designa, samordna och utveckla styrningssystem över domäner, nivåer, kulturer och tidsskalor. När globala utmaningar blir alltmer sammankopplade och komplexa, erbjuder meta-styrning den nödvändiga strukturen för att harmonisera olika insatser till en sammanhängande helhet—utan att överskrida autonomi, mångfald eller subsidiaritet.",
    paragraph2: "Detta ramverk beskriver principer, strukturer och mekanismer för hur olika styrningsdomäner interagerar, överlappar och utvecklas i linje med gemensamma mål. Det är tänkt som en potentiell \"konstitution för planetär samordning\"—ett levande, adaptivt system som utvecklas genom kollektivt lärande."
  };

  // English translations as fallback for INTRODUCTION
  const introductionTextEn = {
    title: "Integrated Meta-Governance",
    subtitle: "An introduction to planetary coordination",
    paragraph1: "Integrated Meta-Governance is the art and architecture of designing, aligning, and evolving governance systems across domains, levels, cultures, and timescales. As global challenges become increasingly interconnected and complex, meta-governance offers the scaffolding necessary to harmonize diverse efforts into a coherent whole—without overriding autonomy, diversity, or subsidiarity.",
    paragraph2: "This framework outlines principles, structures, and mechanisms to guide how various governance domains interact, overlap, and evolve in alignment with shared goals. It is envisioned as a potential \"constitution for planetary coordination\"—a living, adaptive system that evolves through collective learning."
  };

  // Group sections logically with multi-lingual support
  function getSectionCategoryTitle(category) {
    const categoryTitles = {
      en: {
        foundation: "Foundation",
        implementation: "Implementation & Practice",
        resources: "Resources & Tools"
      },
      sv: {
        foundation: "Grund",
        implementation: "Implementering & praktik",
        resources: "Resurser & verktyg"
      }
    };
    
    return (categoryTitles[currentLocale] || categoryTitles.en)[category] || category;
  }

  // Get section titles in current language - UPDATED with new structure
  function getSectionTitle(section) {
    const titles = {
      en: {
        'quick-start': "Meta-Governance Lite",
        'introduction': "Introduction",    // NEW: Introduction section for introduction.md
        'index': "Overview",              // This is now the overview (index.md)
        'principles': "Core Principles",
        'value-proposition': "Value Proposition",
        'structural': "Structural Components",
        'implementation': "Implementation Strategies",
        'evaluation': "Evaluation Framework",
        'case-models': "Case Models in Action",
        'future': "Future Potential",
        'manifesto': "Why Join?",
        'appendix': "Appendix",
        'related': "Related"
      },
      sv: {
        'quick-start': "Meta-styrning lite",
        'introduction': "Introduktion",   // NEW: Introduction section for introduction.md
        'index': "Översikt",             // This is now the overview (index.md)
        'principles': "Grundläggande principer",
        'value-proposition': "Värdeerbjudande",
        'structural': "Strukturella komponenter",
        'implementation': "Implementeringsstrategier",
        'evaluation': "Utvärderingsramverk",
        'case-models': "Fallmodeller i praktiken",
        'future': "Framtida potential",
        'manifesto': "Varför delta?",
        'appendix': "Bilaga",
        'related': "Relaterat"
      }
    };
    
    return (titles[currentLocale] || titles.en)[section] || section;
  }

  // Function to get shortened section titles for navigation
  function getShortSectionTitle(section) {
    const fullTitle = getSectionTitle(section);
    
    const shortTitles = {
      'Introduction': 'Introduction',
      'Overview': 'Overview',
      'Core Principles': 'Principles',
      'Value Proposition': 'Value Proposition',
      'Structural Components': 'Structure',
      'Implementation Strategies': 'Implementation',
      'Evaluation Framework': 'Evaluation',
      'Case Models in Action': 'Case Models',
      'Future Potential': 'Future',
      'Why Join?': 'Why Join?',
      'Appendix': 'Appendix',
      'Related': 'Related',
      'Introduktion': 'Introduktion',
      'Översikt': 'Översikt',
      'Grundläggande principer': 'Principer',
      'Värdeerbjudande': 'Värdeerbjudande',
      'Strukturella komponenter': 'Struktur',
      'Implementeringsstrategier': 'Implementering',
      'Utvärderingsramverk': 'Utvärdering',
      'Fallmodeller i praktiken': 'Fallmodeller',
      'Framtida potential': 'Framtid',
      'Varför delta?': 'Varför delta?',
      'Bilaga': 'Bilaga',
      'Relaterat': 'Relaterat'
    };
    
    return shortTitles[fullTitle] || fullTitle;
  }

  function getSectionIcon(section) {
    const sectionIcons = {
      'introduction': '🌟',     // NEW: Star icon for Introduction  
      'index': '🗺️',          // Map icon for Overview (index.md)
      'principles': '📜',       // Scroll for principles
      'value-proposition': '💎', // Gem for value
      'structural': '🏗️',      // Building construction for structure
      'implementation': '⚙️',   // Gears for implementation
      'evaluation': '📊',       // Bar chart for evaluation
      'case-models': '📖',      // Open book for case models
      'future': '🔭',          // Telescope for future potential
      'manifesto': '📢',       // Megaphone for a call to action/manifesto
      'appendix': '📎',        // Paperclip for appendix
      'related': '🔗'          // Link for related topics
    };
    // Return the icon or a default fallback
    return sectionIcons[section] || '✦';
  }

  // Choose the right intro text based on the current locale
  $: introductionText = currentLocale === 'sv' ? introductionTextSv : introductionTextEn;

  $: if (browser && $locale) {
    invalidate('app:locale');
  }
  
  // Function to download the lite guide PDF
  function downloadLiteGuide() {
    const pdfUrl = `${base}/assets/pdf/meta-governance-lite-${currentLocale}.pdf`;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'meta-governance-lite.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Check which sections are active - UPDATED with new structure
  $: isLiteActive = activeSection === 'quick-start';
  $: isFoundationActive = ['introduction', 'index', 'principles', 'value-proposition'].includes(activeSection); // Added 'introduction' and 'index'
  $: isImplementationActive = ['structural', 'implementation', 'evaluation', 'case-models'].includes(activeSection);
  $: isResourceActive = ['future', 'manifesto', 'appendix', 'related'].includes(activeSection);

  // For handling accordion states
  let foundationOpen = true; // Start with foundation open
  let implementationOpen = false;
  let resourcesOpen = false;

  function toggleFoundation() {
    foundationOpen = !foundationOpen;
  }

  function toggleImplementation() {
    implementationOpen = !implementationOpen;
  }

  function toggleResources() {
    resourcesOpen = !resourcesOpen;
  }

  // Close dropdowns when clicking outside
  function handleClickOutside(event) {
    if (browser) {
      const dropdown = document.querySelector('.card-actions .dropdown');
      
      if (dropdown && !dropdown.contains(event.target)) {
        // Handle dropdown close if needed
      }
    }
  }

  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });

  // Get the total number of numbered sections (01-10)
  $: numberedSections = Object.keys(data.sections || {}).filter(section => 
    section.match(/^\d{2}-/)
  ).sort();

  // Define section groupings - UPDATED with new structure
  $: foundationSections = ['introduction', 'index', 'principles', 'value-proposition']; // Added 'introduction' and 'index' here
  $: implementationSections = ['structural', 'implementation', 'evaluation', 'case-models'];
  $: resourceSections = ['future', 'manifesto', 'appendix', 'related'];

  // Get current section index for progress
  $: currentSectionIndex = numberedSections.indexOf(activeSection);
  $: isNumberedSection = activeSection.match(/^\d{2}-/);

  // Get localized text for buttons and UI elements
  function getLocalizedText(key) {
    const texts = {
      en: {
        newToFramework: "New to Meta-Governance?",
        startWithLite: "Start with our simplified guide that explains the core concepts in plain language.",
        readLite: "Read Meta-Governance Lite",
        downloadPdf: "Download PDF Version",
        continueToFull: "Continue to Full Framework",
        resources: "Resources"
      },
      sv: {
        newToFramework: "Ny inom meta-styrning?",
        startWithLite: "Börja med vår förenklade guide som förklarar kärnkoncepten på enkelt språk.",
        readLite: "Läs meta-styrning lite",
        downloadPdf: "Ladda ner PDF-version",
        continueToFull: "Fortsätt till fullständigt ramverk",
        resources: "Resurser"
      }
    };
    
    return (texts[currentLocale] || texts.en)[key] || key;
  }
</script>

<svelte:window on:click={handleClickOutside}/>


{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}
    <div class="content">

      <!-- Quick Access Card for Lite Guide -->
      {#if !isPrintMode && !isLiteActive && activeSection === 'introduction'}
        <div class="lite-guide-card">
          <div class="card-content">
            <div class="card-icon">📘</div>
            <div class="card-text">
              <h3>{getLocalizedText('newToFramework')}</h3>
              <p>{getLocalizedText('startWithLite')}</p>
            </div>
            <div class="card-actions">
              <button class="primary-btn" on:click={() => setActiveSection('quick-start')}>
                {getLocalizedText('readLite')} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      {#if data.isModular}
        <!-- Sub-navigation for framework sections -->
        {#if !isPrintMode} 
          <div class="section-nav">
            <!-- Lite Guide -->
            <div class="nav-section">
              <button 
                class="nav-item lite-item" 
                class:active={activeSection === 'quick-start'}
                on:click={() => setActiveSection('quick-start')}
              >
                <span class="nav-icon">📘</span>
                <span class="nav-title">{getSectionTitle('quick-start')}</span>
              </button>
            </div>

            <!-- Foundation Accordion - NOW INCLUDES INTRODUCTION AND OVERVIEW -->
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={foundationOpen}
                class:has-active={isFoundationActive}
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
                class:has-active={isImplementationActive}
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
                class:has-active={isResourceActive}
                on:click={toggleResources}
              >
                <span class="accordion-icon">📚</span>
                <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
                <span class="section-count">({resourceSections.length})</span>
                <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
              </button>
              {#if resourcesOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each resourceSections as section}
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
          </div>
        {/if}

        <!-- Progress indicator for numbered sections -->
        {#if !isPrintMode && isNumberedSection}
          <div class="progress-indicator">
            <div class="progress-bar">
              <div class="progress-fill" style="width: {((currentSectionIndex + 1) / numberedSections.length) * 100}%"></div>
            </div>
            <span class="progress-text">Section {currentSectionIndex + 1} of {numberedSections.length}</span>
          </div>
        {/if}

        <!-- Show active section, or all sections in print mode -->
        {#each sectionsToShow as section}
          <div class="section-content" id={section}>
            <!-- Language fallback notice (skip for introduction since we have custom text) -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'introduction'}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{currentLocale === 'sv' ? 'Innehåll på svenska kommer snart' : 'Content in your language coming soon'}</strong>
                  <p>{currentLocale === 'sv' ? 'Detta avsnitt visas för närvarande på engelska tills den svenska översättningen är klar.' : 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            {#if section === 'quick-start'}
              <!-- Render Lite Guide -->
              <svelte:component this={data.sections[section].default} />
              
              <!-- Navigation buttons at bottom of lite guide -->
              {#if !isPrintMode}
                <div class="lite-guide-navigation">
                  <button class="secondary-btn" on:click={downloadLiteGuide}>
                    {getLocalizedText('downloadPdf')} <span class="download-icon">↓</span>
                  </button>
                  <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                    {getLocalizedText('continueToFull')} <span class="arrow-icon">→</span>
                  </button>
                </div>
              {/if}

            {:else if section === 'introduction'}
              <!-- Render Introduction (custom text + constellation map) -->
              <div class="introduction-section">
                <h1>{introductionText.title}</h1>
                <h2>{introductionText.subtitle}</h2>
                <p>{introductionText.paragraph1}</p>
                <p>{introductionText.paragraph2}</p>
              </div>
              <!-- Show constellation map for introduction section -->
              <ConstellationMap />
              
            {:else if section === 'index'}
              <!-- Render Overview section from index.md -->
              {#if data.sections[section]}
                <svelte:component this={data.sections[section].default} />
              {:else}
                <p>Overview section not found</p>
              {/if}
              
            {:else if data.sections[section]}
              <!-- Render normal sections from markdown files -->
              <svelte:component this={data.sections[section].default} />
            {:else}
              <p>Section {section} not found</p>
            {/if}

            <!-- Section navigation at bottom of numbered sections -->
            {#if isNumberedSection && !isPrintMode}
              <div class="section-navigation">
                {#if currentSectionIndex > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = numberedSections.indexOf(activeSection);
                    const prevSection = numberedSections[currentIndex - 1];
                    setActiveSection(prevSection);
                  }}>
                    ← Previous Section
                  </button>
                {/if}
                
                {#if currentSectionIndex < numberedSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = numberedSections.indexOf(activeSection);
                    const nextSection = numberedSections[currentIndex + 1];
                    setActiveSection(nextSection);
                  }}>
                    Next Section →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      {:else}
        <!-- Legacy single file display -->
        <div class="introduction-section">
          <h1>{introductionText.title}</h1>
          <h2>{introductionText.subtitle}</h2>
          <p>{introductionText.paragraph1}</p>
          <p>{introductionText.paragraph2}</p>
        </div>
        
        <!-- Show constellation map -->
        <ConstellationMap />

        <!-- The rest of the content -->
        <div class="remaining-content">
          <svelte:component this={data.component} />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Meta-governance cosmic color scheme */
  :root {
    --meta-primary: #2B4B8C; /* Cosmic blue - depth, integration, systems thinking */
    --meta-secondary: #6B5CA5; /* Cosmic purple - wisdom, coordination, synthesis */
    --meta-accent: #DAA520; /* Gold - value, interconnection, emergence */
    --meta-earth: #2D5F2D; /* Earthy green - grounding, sustainability, balance */
    --meta-light: #f0f4ff; /* Light cosmic blue - clarity, openness */
    --meta-medium: #e6f7ff; /* Medium cosmic blue */
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
    min-width: 0; /* This rule already exists */

    /* Add these new rules */
    max-width: 960px; /* A comfortable width for reading. Adjust as needed. */
    margin: 0 auto;   /* This centers the container horizontally. */
    padding: 2rem 1rem; /* This provides vertical and horizontal spacing inside the container. */
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
    background-color: rgba(43, 75, 140, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(43, 75, 140, 0.1);
    color: var(--meta-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(43, 75, 140, 0.1);
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
    background-color: rgba(43, 75, 140, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--meta-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--meta-secondary);
  }

  /* Updated styling for Introduction item (renamed from overview-item) */
  .introduction-item {
    background: linear-gradient(135deg, rgba(43, 75, 140, 0.1), rgba(218, 165, 32, 0.1));
    border: 1px solid rgba(43, 75, 140, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .introduction-item.active {
    background: var(--meta-primary);
    color: white;
  }

  .lite-item {
    background: linear-gradient(135deg, rgba(218, 165, 32, 0.1), rgba(107, 92, 165, 0.1));
    border: 1px solid rgba(218, 165, 32, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .lite-item.active {
    background: var(--meta-accent);
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
    background-color: rgba(43, 75, 140, 0.1);
    color: var(--meta-primary);
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

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(43, 75, 140, 0.1), rgba(218, 165, 32, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--meta-primary);
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
    background: linear-gradient(90deg, var(--meta-primary), var(--meta-accent));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--meta-primary);
    font-weight: 500;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  /* Updated styling for introduction section (renamed from overview-section) */
  .introduction-section {
    margin-bottom: 2rem;
  }

  .introduction-section h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--meta-primary);
  }

  .introduction-section h2 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--meta-secondary);
    font-style: italic;
  }

  .introduction-section p {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
    font-size: 1rem;
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

    .card-content {
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem;
      gap: 0.75rem;
    }
    
    .card-text {
      width: 100%;
    }
    
    .card-actions {
      width: 100%;
    }
    
    .primary-btn {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .card-content {
      padding: 0.75rem;
    }
    
    .card-icon {
      font-size: 1.5rem;
    }
    
    .card-text h3 {
      font-size: 1rem;
    }
    
    .card-text p {
      font-size: 0.85rem;
    }
  }
  
  .content {
    min-width: 0;
  }
  
  .map-container {
    margin: 2rem 0;
  }
  
  /* Additional styles for markdown content */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--meta-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--meta-primary);
  }
  
  .content :global(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--meta-primary);
  }

  /* Styling for h4 headers (#### in Markdown) */
  :global(h4) {
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--meta-primary);
  }

  /* Styling for the inset box (blockquote) */
  :global(blockquote) {
    background-color: #f3f6f9;
    border-left: 4px solid var(--meta-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--meta-primary);
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
    color: var(--meta-accent);
    text-decoration: underline;
    font-weight: 500;
  }

  :global(blockquote a:hover) {
    color: #B8860B;
  }
  
  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }
  
  /* Lists with meta-governance themed bullets */
  .content :global(ul), .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
    color: #4b5563;
  }

  .content :global(ul) {
    list-style-type: none;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1rem;
  }

  /* Apply stars to all ul li EXCEPT those in section-nav */
  .content :global(ul li:not(.section-nav li))::before {
    content: "✦";
    position: absolute;
    left: 0;
    top: 0.1em;
    color: var(--meta-accent);
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
    color: var(--meta-primary);
    font-weight: 600;
  }

  /* Nested lists */
  .content :global(ul ul), .content :global(ol ul) {
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .content :global(ul ul li::before) {
    content: "✧";
    color: var(--meta-secondary);
  }

  /* Table styles for markdown content with cosmic theme */
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
    background: linear-gradient(to right, var(--meta-primary), var(--meta-secondary));
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #000000;
    border: none;
    border-bottom: 2px solid var(--meta-secondary);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(odd)) {
    background-color: #f8f9fc;
  }

  :global(.content tr:nth-child(even)) {
    background-color: #ffffff;
  }

  :global(.content tr:hover) {
    background-color: #f7f1e3;
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
  
  /* Lite Guide card */
  .lite-guide-card {
    background: linear-gradient(135deg, var(--meta-light) 0%, var(--meta-medium) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(43, 75, 140, 0.1);
    border: 1px solid rgba(43, 75, 140, 0.2);
    overflow: hidden;
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
    color: var(--meta-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--meta-primary);
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
  }
  
  .primary-btn {
    background-color: var(--meta-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .primary-btn:hover {
    background-color: #1a3a6c;
    transform: translateY(-1px);
  }
  
  .secondary-btn {
    background-color: white;
    color: var(--meta-primary);
    border: 1px solid var(--meta-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .secondary-btn:hover {
    background-color: #f3f6f9;
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
    color: var(--meta-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--meta-accent);
    text-decoration: underline;
  }

  .content :global(a:active) {
    color: var(--meta-accent);
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
    color: var(--meta-secondary);
    text-decoration: none;
    border-bottom: 1px dotted var(--meta-secondary);
  }

  .content :global(a[href^="#"]):hover {
    color: var(--meta-primary);
    border-bottom-color: var(--meta-primary);
  }

  /* Make sure links in tables are readable against the background */
  .content :global(table a) {
    color: var(--meta-primary);
    font-weight: 600;
  }

  /* Links in the section navigation */
  .section-nav a {
    color: #4b5563;
    text-decoration: none;
    transition: color 0.2s;
  }

  .section-nav a:hover {
    color: var(--meta-primary);
  }
  
  /* Styles for navigation at bottom of lite guide */
  .lite-guide-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Section navigation for numbered sections */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--meta-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--meta-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }
  
  /* Responsive styles */
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
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(107, 92, 165, 0.1);
    border: 1px solid rgba(107, 92, 165, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--meta-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--meta-secondary);
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
