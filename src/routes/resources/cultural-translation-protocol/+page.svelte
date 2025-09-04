<!-- src/routes/resources/cultural-translation-protocol/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: ctp = translationsReady ? ($t('culturalTranslationProtocol') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'introduction';
  let mounted = false;
  let isPrintMode = false;
  let phaseOneOpen = false;
  let phaseTwoOpen = false;
  let phaseThreeOpen = false;

  // Computed values
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: phaseOneSections = ['purpose-foundation', 'recognition-principles'];
  $: phaseTwoSections = ['deep-dialogue', 'co-design-adaptation'];
  $: phaseThreeSections = ['validation-integration', 'safeguards-implementation'];
  $: isPhaseOneSection = phaseOneSections.includes(activeSection);
  $: isPhaseTwoSection = phaseTwoSections.includes(activeSection);
  $: isPhaseThreeSection = phaseThreeSections.includes(activeSection);

  function initializeAccordionStates() {
    phaseOneOpen = phaseOneSections.includes(activeSection);
    phaseTwoOpen = phaseTwoSections.includes(activeSection);
    phaseThreeOpen = phaseThreeSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // URL handling
      const urlParams = new URLSearchParams(window.location.search);
      isPrintMode = urlParams.get('print') === 'true';
      
      const sectionParam = urlParams.get('section');
      const hashSection = window.location.hash.substring(1);
      
      if (sectionParam && data?.sections?.[sectionParam]) {
        activeSection = sectionParam;
      } else if (hashSection && data?.sections?.[hashSection]) {
        activeSection = hashSection;
      }
      
      initializeAccordionStates();
      
      // Global function for PDF generation
      window.showAllSectionsForPrint = () => { isPrintMode = true; };
      
      // Hash change listener
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          initializeAccordionStates();
          
          setTimeout(() => {
            const contentElement = document.querySelector('.section-content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
  });

  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    initializeAccordionStates();
    
    if (browser) {
      const newUrl = `/resources/cultural-translation-protocol${window.location.search}#${section}`;
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

  function getSectionTitle(section) {
    return translationsReady ? (ctp.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (ctp.categories?.[category] || category) : category;
  }

  function downloadProtocolPDF() {
    const currentLocale = $locale || 'en';
    
    // Define which languages you actually have PDFs for
    const availableLocales = ['sv', 'es', 'fr']; // Update this list
    const targetLocale = availableLocales.includes(currentLocale) ? currentLocale : 'en';
    
    const localizedUrl = `${base}/downloads/${targetLocale}/cultural-translation-protocol.pdf`;
    
    checkFileExists(localizedUrl)
      .then(exists => {
        if (exists) {
          downloadFile(localizedUrl, `cultural-translation-protocol-${targetLocale}.pdf`);
        } else {
          const fallbackUrl = `${base}/downloads/en/cultural-translation-protocol.pdf`;
          downloadFile(fallbackUrl, `cultural-translation-protocol-en.pdf`);
        }
      })
      .catch(() => {
        const fallbackUrl = `${base}/downloads/en/cultural-translation-protocol.pdf`;
        downloadFile(fallbackUrl, `cultural-translation-protocol-en.pdf`);
      });
  }

  async function checkFileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Accordion toggle functions
  function togglePhaseOne() { phaseOneOpen = !phaseOneOpen; }
  function togglePhaseTwo() { phaseTwoOpen = !phaseTwoOpen; }
  function togglePhaseThree() { phaseThreeOpen = !phaseThreeOpen; }

  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{ctp.meta?.title || 'Cultural Translation Protocol - Global Governance Framework'}</title>
  <meta name="description" content="{ctp.meta?.description || 'A comprehensive guide for adapting governance frameworks across diverse cultural contexts while respecting sovereignty'}" />
</svelte:head>

{#if mounted}
  <div class="breadcrumb-nav">
    <a href="/resources" class="breadcrumb-link">
      <span class="breadcrumb-icon">←</span>
      <span class="breadcrumb-text">{ctp.navigation?.backToResources || 'Back to Resources'}</span>
    </a>
  </div>

  <div class="documentation-container">
    <div class="sidebar">
      {#if !isPrintMode} 
        <div class="section-nav">
          <!-- Overview -->
          <div class="nav-section">
            <button 
              class="nav-item overview-item" 
              class:active={activeSection === 'introduction'}
              on:click={() => setActiveSection('introduction')}
            >
              <span class="nav-icon">🌍</span>
              <span class="nav-title">{getSectionCategoryTitle('introduction')}</span>
            </button>
            
            <button 
              class="nav-item overview-item" 
              class:active={activeSection === 'overview'}
              on:click={() => setActiveSection('overview')}
            >
              <span class="nav-icon">📋</span>
              <span class="nav-title">{getSectionCategoryTitle('overview')}</span>
            </button>
          </div>

          <!-- Phase I: Foundation -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={phaseOneOpen}
              class:has-active={isPhaseOneSection}
              on:click={togglePhaseOne}
            >
              <span class="accordion-icon">🏗️</span>
              <span class="accordion-title">{getSectionCategoryTitle('phaseOne')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={phaseOneOpen}>▼</span>
            </button>
            {#if phaseOneOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each phaseOneSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'purpose-foundation'}🎯
                        {:else if section === 'recognition-principles'}⚖️
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Phase II: Implementation -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={phaseTwoOpen}
              class:has-active={isPhaseTwoSection}
              on:click={togglePhaseTwo}
            >
              <span class="accordion-icon">🔄</span>
              <span class="accordion-title">{getSectionCategoryTitle('phaseTwo')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={phaseTwoOpen}>▼</span>
            </button>
            {#if phaseTwoOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each phaseTwoSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'deep-dialogue'}💬
                        {:else if section === 'co-design-adaptation'}🎨
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Phase III: Validation & Integration -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={phaseThreeOpen}
              class:has-active={isPhaseThreeSection}
              on:click={togglePhaseThree}
            >
              <span class="accordion-icon">✅</span>
              <span class="accordion-title">{getSectionCategoryTitle('phaseThree')}</span>
              <span class="section-count">(2)</span>
              <span class="toggle-arrow" class:rotated={phaseThreeOpen}>▼</span>
            </button>
            {#if phaseThreeOpen}
              <div class="accordion-content" transition:slide={{ duration: 200 }}>
                {#each phaseThreeSections as section}
                  {#if data?.sections?.[section]}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section === 'validation-integration'}🔍
                        {:else if section === 'safeguards-implementation'}🛡️
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
          
          <!-- Download PDF Button -->
          <div class="download-section">
             <button class="download-btn" on:click={downloadProtocolPDF}>
               <span class="download-icon">📥</span>
               <span class="download-text">{ctp.navigation?.downloadPdf || 'Download Complete Protocol (PDF)'}</span>
             </button>
          </div>
        </div>
      {/if}
    </div>

    <div class="content">
      <!-- Progress indicator for phase sections -->
      {#if !isPrintMode && (isPhaseOneSection || isPhaseTwoSection || isPhaseThreeSection) && translationsReady}
        <div class="progress-indicator">
          {#if isPhaseOneSection}
            <div class="progress-bar">
              <div class="progress-fill" style="width: {((phaseOneSections.indexOf(activeSection) + 1) / phaseOneSections.length * 100)}%"></div>
            </div>
            <span class="progress-text">{ctp.progress?.phaseOne?.replace('{current}', phaseOneSections.indexOf(activeSection) + 1).replace('{total}', phaseOneSections.length) || `Phase I: Section ${phaseOneSections.indexOf(activeSection) + 1} of ${phaseOneSections.length}`}</span>
          {:else if isPhaseTwoSection}
            <div class="progress-bar">
              <div class="progress-fill" style="width: {((phaseTwoSections.indexOf(activeSection) + 1) / phaseTwoSections.length * 100)}%"></div>
            </div>
            <span class="progress-text">{ctp.progress?.phaseTwo?.replace('{current}', phaseTwoSections.indexOf(activeSection) + 1).replace('{total}', phaseTwoSections.length) || `Phase II: Section ${phaseTwoSections.indexOf(activeSection) + 1} of ${phaseTwoSections.length}`}</span>
          {:else if isPhaseThreeSection}
            <div class="progress-bar">
              <div class="progress-fill" style="width: {((phaseThreeSections.indexOf(activeSection) + 1) / phaseThreeSections.length * 100)}%"></div>
            </div>
            <span class="progress-text">{ctp.progress?.phaseThree?.replace('{current}', phaseThreeSections.indexOf(activeSection) + 1).replace('{total}', phaseThreeSections.length) || `Phase III: Section ${phaseThreeSections.indexOf(activeSection) + 1} of ${phaseThreeSections.length}`}</span>
          {/if}
        </div>
      {/if}

      <!-- Show active section, or all sections in print mode -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && section !== 'introduction' && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{ctp.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{ctp.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <!-- Render sections from markdown files -->
            <svelte:component this={data.sections[section].default} t={$t} />
          </div>
        {:else}
          <div class="missing-section">
            <h2>Section "{section}" not found</h2>
            <p>This content is still being developed.</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{ctp.loading?.text || 'Loading protocol content...'}</p>
  </div>
{/if}

<style>
  /* Cultural Translation Protocol color scheme - multicultural/bridge theme */
  :root {
    --protocol-primary: #6366f1;      /* Indigo - universality */
    --protocol-secondary: #d97706;    /* Amber - cultural wisdom */
    --protocol-accent: #10b981;       /* Emerald - growth/adaptation */
    --protocol-success: #059669;      /* Green - successful integration */
    --protocol-warning: #f59e0b;      /* Yellow - caution needed */
    --protocol-danger: #dc2626;       /* Red - cultural appropriation risk */
    --protocol-light: #f8fafc;        /* Slate - clean background */
    --protocol-dark: #1e293b;         /* Slate dark */
    --protocol-wisdom: #8b5cf6;       /* Purple - deep knowledge */
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
    border-top: 4px solid var(--protocol-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Breadcrumb */
  .breadcrumb-nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 1rem 0 1rem;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--protocol-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    padding: 0.5rem 0;
  }

  .breadcrumb-link:hover {
    color: var(--protocol-primary);
    transform: translateX(-2px);
  }

  /* Layout */
  .documentation-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    min-height: calc(100vh - 200px);
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }
  
  .content {
    min-width: 0;
    padding: 0;
  }
  
  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  /* Section Navigation */
  .section-nav {
    background: linear-gradient(to bottom, var(--protocol-light), #f1f5f9);
    border-radius: 0.75rem;
    padding: 1.25rem;
    border: 1px solid rgba(99, 102, 241, 0.15);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
  }

  .nav-section {
    margin-bottom: 1rem;
  }

  .download-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(99, 102, 241, 0.1));
    border-radius: 0.5rem;
    border: 1px solid rgba(217, 119, 6, 0.2);
  }

  .download-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--protocol-secondary), var(--protocol-accent));
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  .download-btn:hover {
    background: linear-gradient(135deg, var(--protocol-primary), var(--protocol-secondary));
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(217, 119, 6, 0.3);
  }

  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(217, 119, 6, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--protocol-primary);
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
    background: linear-gradient(90deg, var(--protocol-primary), var(--protocol-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  /* Navigation styles - similar to great transition guide but with protocol colors */
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
    background-color: rgba(217, 119, 6, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(99, 102, 241, 0.1);
    color: var(--protocol-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(217, 119, 6, 0.1);
    border-bottom: 1px solid #e5e7eb;
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

  .nav-item:hover {
    background-color: rgba(217, 119, 6, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--protocol-primary);
    color: white;
    font-weight: 600;
  }

  .overview-item {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(217, 119, 6, 0.1));
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 0.375rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  /* Language fallback notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(217, 119, 6, 0.1);
    border: 1px solid rgba(217, 119, 6, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--protocol-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--protocol-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--protocol-accent);
  }

  /* Enhanced content styling for rendered markdown */
  .content :global(.section-content) {
      line-height: 1.7;
      color: #374151;
      font-size: 1.05rem;
  }

  /* Typography hierarchy */
  .content :global(h1) {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--protocol-primary);
      line-height: 1.2;
      border-bottom: 3px solid var(--protocol-primary);
      padding-bottom: 0.75rem;
  }
  
  .content :global(h2) {
      font-size: 1.75rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
      color: var(--protocol-secondary);
      line-height: 1.3;
      position: relative;
  }

  .content :global(h2::before) {
      content: "";
      position: absolute;
      left: -1rem;
      top: 0.5rem;
      width: 4px;
      height: 60%;
      background: linear-gradient(180deg, var(--protocol-secondary), var(--protocol-accent));
      border-radius: 2px;
  }
  
  .content :global(h3) {
      font-size: 1.4rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--protocol-accent);
      line-height: 1.4;
  }

  .content :global(h4) {
      font-size: 1.2rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--protocol-wisdom);
      line-height: 1.4;
  }

  /* Paragraph and text styling */
  .content :global(p) {
      margin-bottom: 1.25rem;
      line-height: 1.7;
      color: #4b5563;
  }

  .content :global(p:first-of-type) {
      font-size: 1.1rem;
      font-weight: 500;
      color: #374151;
  }

  /* Lists with enhanced styling */
  .content :global(ul),
  .content :global(ol) {
      margin-bottom: 1.5rem;
      padding-left: 2rem;
  }

  .content :global(li) {
      margin-bottom: 0.75rem;
      line-height: 1.6;
      color: #4b5563;
      position: relative;
  }

  .content :global(ul li::marker) {
      color: var(--protocol-accent);
      font-size: 1.2em;
  }

  .content :global(ol li::marker) {
      color: var(--protocol-primary);
      font-weight: 600;
  }

  /* Enhanced list items with icons */
  .content :global(ul li) {
      list-style: none;
      padding-left: 1.5rem;
      position: relative;
  }

  .content :global(ul li::before) {
      content: "◆";
      position: absolute;
      left: 0;
      color: var(--protocol-accent);
      font-weight: bold;
  }

  /* Nested lists */
  .content :global(ul ul li::before) {
      content: "▸";
      color: var(--protocol-secondary);
  }

  /* Blockquotes */
  .content :global(blockquote) {
      border-left: 4px solid var(--protocol-primary);
      background: linear-gradient(90deg, 
          rgba(99, 102, 241, 0.1), 
          rgba(99, 102, 241, 0.05));
      padding: 1.5rem 2rem;
      margin: 2rem 0;
      border-radius: 0 0.5rem 0.5rem 0;
      font-style: italic;
      font-size: 1.05rem;
      color: #374151;
  }

  .content :global(blockquote p) {
      margin-bottom: 0.5rem;
  }

  .content :global(blockquote p:last-child) {
      margin-bottom: 0;
  }

  /* Code styling */
  .content :global(code) {
      background: #f1f5f9;
      color: #e11d48;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      border: 1px solid #e2e8f0;
  }

  .content :global(pre) {
      background: #1e293b;
      color: #f8fafc;
      padding: 1.5rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1.5rem 0;
      border: 1px solid #334155;
  }

  .content :global(pre code) {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
  }

  /* Tables */
  .content :global(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 2rem 0;
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .content :global(th) {
      background: linear-gradient(135deg, var(--protocol-primary), var(--protocol-secondary));
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
  }

  .content :global(td) {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      color: #374151;
  }

  .content :global(tr:nth-child(even) td) {
      background: #f8fafc;
  }

  .content :global(tr:hover td) {
      background: rgba(99, 102, 241, 0.05);
  }

  /* Links */
  .content :global(a) {
      color: var(--protocol-primary);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s;
      font-weight: 500;
  }

  .content :global(a:hover) {
      color: var(--protocol-secondary);
      border-bottom-color: var(--protocol-secondary);
  }

  /* Strong and emphasis */
  .content :global(strong) {
      color: var(--protocol-primary);
      font-weight: 700;
  }

  .content :global(em) {
      color: var(--protocol-secondary);
      font-style: italic;
  }

  /* Special content blocks */
  .content :global(.protocol-highlight) {
      background: linear-gradient(135deg, 
          rgba(217, 119, 6, 0.1), 
          rgba(99, 102, 241, 0.1));
      border: 1px solid rgba(217, 119, 6, 0.3);
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin: 1.5rem 0;
      border-left: 4px solid var(--protocol-secondary);
  }

  .content :global(.phase-banner) {
      background: linear-gradient(135deg, 
          rgba(139, 92, 246, 0.1), 
          rgba(16, 185, 129, 0.1));
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 0.75rem;
      padding: 1.5rem 2rem;
      margin: 2rem 0;
      text-align: center;
  }

  .content :global(.phase-banner h3) {
      margin-top: 0;
      color: var(--protocol-wisdom);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
      .content :global(h1) {
          font-size: 1.875rem;
      }
      
      .content :global(h2) {
          font-size: 1.5rem;
          margin-top: 2rem;
      }
      
      .content :global(h3) {
          font-size: 1.25rem;
      }

      .content :global(h2::before) {
          display: none;
      }

      .content :global(blockquote) {
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
      }

      .content :global(table) {
          font-size: 0.9rem;
      }

      .content :global(th),
      .content :global(td) {
          padding: 0.5rem 0.75rem;
      }
  }

  /* Print styles */
  @media print {
      .content :global(*) {
          color: #000 !important;
          background: #fff !important;
      }
      
      .content :global(h1),
      .content :global(h2),
      .content :global(h3) {
          page-break-after: avoid;
      }
      
      .content :global(blockquote),
      .content :global(table) {
          page-break-inside: avoid;
      }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }
    
    .sidebar {
      position: static;
    }

    .section-nav {
      margin-bottom: 1rem;
    }
  }
</style>
