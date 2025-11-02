<!-- src/routes/frameworks/institutional-regeneration/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  const DEBUG_LOG = false;

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: ir = translationsReady ? ($t('institutionalRegeneration') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'executive-summary';
  let mounted = false;
  let isPrintMode = false;
  let foundationOpen = false;
  let seedTrackOpen = false;

  // Computed values
  $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];
  $: seedTrackSections = Object.keys(data?.sections || {}).filter(section => 
    section.startsWith('seed-track-mvp/')
  );
  $: isSeedTrackSection = seedTrackSections.includes(activeSection);
  $: foundationSections = ['executive-summary', 'regeneration-compact'];

  function initializeAccordionStates() {
    foundationOpen = foundationSections.includes(activeSection);
    seedTrackOpen = seedTrackSections.includes(activeSection);
  }

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/institutional-regeneration') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/institutional-regeneration${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/institutional-regeneration');
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
    }
  });

  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    initializeAccordionStates();
    
    if (browser) {
      const newUrl = `/frameworks/institutional-regeneration${window.location.search}#${section}`;
      history.replaceState(null, '', newUrl);
    }
  }

  // Translation helper functions
  function getSectionTitle(section) {
    return translationsReady ? (ir.sections?.[section] || section.replace(/[-_]/g, ' ').replace(/\//g, ' - ')) 
                             : section.replace(/[-_]/g, ' ').replace(/\//g, ' - ');
  }

  function getSectionCategoryTitle(category) {
    return translationsReady ? (ir.categories?.[category] || category) : category;
  }

  function getShortSectionTitle(section) {
    return translationsReady ? (ir.sectionsShort?.[section] || getSectionTitle(section)) : getSectionTitle(section);
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Action functions
  function downloadFrameworkPDF(type = 'complete') {
    const filenames = {
      'executive-summary': 'institutional-regeneration-executive-summary',
      'regeneration-compact': 'institutional-regeneration-compact',
      'seed-track': 'institutional-regeneration-seed-track-mvp'
    };
    const filename = filenames[type] || 'institutional-regeneration-framework';
    const link = document.createElement('a');
    link.href = `${base}/assets/pdf/${filename}-${currentLocale}.pdf`;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function openStakeholderTool() {
    window.open(`${base}/frameworks/tools/institutional-regeneration/stakeholder-and-power-mapping-exercise.html`, '_blank');
  }

  function toggleFoundation() { foundationOpen = !foundationOpen; }
  function toggleSeedTrack() { seedTrackOpen = !seedTrackOpen; }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('institutionalRegeneration.meta.title', 'Institutional Regeneration Framework - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('institutionalRegeneration.meta.description', 'A comprehensive framework for transforming international organizations toward agility, inclusion, and effectiveness')}" />
</svelte:head>

{#if mounted}
  <div class="documentation-container">
    {#if !isPrintMode}
      <FrameworkSidebar />
    {/if}

    <div class="content">
      <!-- Quick Access Card -->
      {#if !isPrintMode && activeSection === 'executive-summary' && translationsReady}
        <div class="framework-guide-card">
          <div class="card-content">
            <div class="card-icon">🧭</div>
            <div class="card-text">
              <h3>{ir.guideCard?.title || 'Ready to Transform Your Institution?'}</h3>
              <p>{ir.guideCard?.description || 'Start with our Executive Summary to understand the challenge, then explore the Regeneration Compact to begin your transformation journey.'}</p> 
            </div>
            <div class="card-actions">
              <button class="tool-btn" on:click={openStakeholderTool}>
                {ir.guideCard?.toolButton || 'Try Stakeholder Mapping Tool'} <span class="tool-icon">🗺️</span>
              </button>
              <button class="primary-btn" on:click={() => setActiveSection('regeneration-compact')}>
                {ir.guideCard?.compactButton || 'View Partnership Agreement'} <span class="arrow-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Navigation -->
      {#if !isPrintMode} 
        <div class="section-nav">
          <!-- Foundation Accordion -->
          <div class="nav-accordion">
            <button 
              class="accordion-header" 
              class:open={foundationOpen}
              class:has-active={foundationSections.includes(activeSection)}
              on:click={toggleFoundation}
            >
              <span class="accordion-icon">📋</span>
              <span class="accordion-title">{getSectionCategoryTitle('foundation')}</span>
              <span class="section-count">(2)</span>
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
                      <span class="nav-icon">{section === 'executive-summary' ? '📊' : '🤝'}</span>
                      <span class="nav-title">{getSectionTitle(section)}</span>
                    </button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>

          <!-- Seed Track Accordion -->
          {#if seedTrackSections.length > 0}
            <div class="nav-accordion">
              <button 
                class="accordion-header" 
                class:open={seedTrackOpen}
                class:has-active={isSeedTrackSection}
                on:click={toggleSeedTrack}
              >
                <span class="accordion-icon">🌱</span>
                <span class="accordion-title">{getSectionCategoryTitle('seedTrack')}</span>
                <span class="section-count">({seedTrackSections.length})</span>
                <span class="toggle-arrow" class:rotated={seedTrackOpen}>▼</span>
              </button>
              {#if seedTrackOpen}
                <div class="accordion-content" transition:slide={{ duration: 200 }}>
                  {#each seedTrackSections as section}
                    <button 
                      class="nav-item subsection-item" 
                      class:active={activeSection === section}
                      on:click={() => setActiveSection(section)}
                    >
                      <span class="nav-icon">
                        {#if section.includes('introduction')}📖
                        {:else if section.includes('module-1')}🎯
                        {:else if section.includes('module-2')}⚙️
                        {:else if section.includes('module-3')}🌿
                        {:else if section.includes('next-steps')}➡️
                        {:else}📄{/if}
                      </span>
                      <span class="nav-title">{getShortSectionTitle(section)}</span>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Progress indicator -->
      {#if !isPrintMode && isSeedTrackSection && seedTrackSections.length > 0 && translationsReady}
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill" style="width: {((seedTrackSections.indexOf(activeSection) + 1) / seedTrackSections.length * 100)}%"></div>
          </div>
          <span class="progress-text">{ir.progress?.text?.replace('{current}', seedTrackSections.indexOf(activeSection) + 1).replace('{total}', seedTrackSections.length) || `Module ${seedTrackSections.indexOf(activeSection) + 1} of ${seedTrackSections.length}`}</span>
        </div>
      {/if}

      <!-- Action buttons -->
      {#if !isPrintMode && (activeSection === 'executive-summary' || activeSection === 'regeneration-compact') && translationsReady}
        <div class="action-buttons">
          <button class="download-btn" on:click={() => downloadFrameworkPDF('executive-summary')}>
            <span class="btn-icon">📥</span>
            {ir.actions?.downloadExecutive || 'Download Executive Summary PDF'}
          </button>
          <button class="download-btn" on:click={() => downloadFrameworkPDF('regeneration-compact')}>
            <span class="btn-icon">📥</span>
            {ir.actions?.downloadCompact || 'Download Regeneration Compact PDF'}
          </button>
          <button class="download-btn" on:click={() => downloadFrameworkPDF('seed-track')}>
            <span class="btn-icon">📥</span>
            {ir.actions?.downloadSeedTrack || 'Download Seed Track MVP PDF'}
          </button>
          <button class="tool-btn" on:click={openStakeholderTool}>
            <span class="btn-icon">📥</span>
            {ir.actions?.openTool || 'Open Stakeholder Mapping Tool'}
          </button>
        </div>
      {/if}

      <!-- Content sections -->
      {#each sectionsToShow as section (section)}
        {#if data?.sections?.[section]}
          <div class="section-content" id={section}>
            <!-- Language fallback notice -->
            {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section) && translationsReady}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌐</div>
                <div class="notice-content">
                  <strong>{ir.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{ir.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}
            
            <svelte:component this={data.sections[section].default} t={$t} />
            
            <!-- Navigation buttons -->
            {#if isSeedTrackSection && !isPrintMode && seedTrackSections.length > 0 && translationsReady}
              <div class="section-navigation">
                {#if seedTrackSections.indexOf(activeSection) > 0}
                  <button class="nav-btn prev-btn" on:click={() => {
                    const currentIndex = seedTrackSections.indexOf(activeSection);
                    setActiveSection(seedTrackSections[currentIndex - 1]);
                  }}>
                    ← {ir.navigation?.previousModule || 'Previous Module'}
                  </button>
                {/if}
                
                {#if seedTrackSections.indexOf(activeSection) < seedTrackSections.length - 1}
                  <button class="nav-btn next-btn" on:click={() => {
                    const currentIndex = seedTrackSections.indexOf(activeSection);
                    setActiveSection(seedTrackSections[currentIndex + 1]);
                  }}>
                    {ir.navigation?.nextModule || 'Next Module'} →
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <div class="missing-section">
            <h2>{getTextWithFallback('institutionalRegeneration.errors.sectionNotFound', `Section "${section}" not found`).replace('{section}', section)}</h2>
            <p>{getTextWithFallback('institutionalRegeneration.errors.contentInDevelopment', 'This content is still being developed.')}</p>
          </div>
        {/if}
      {/each}
    </div>
  </div>
{:else}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('institutionalRegeneration.loading.text', 'Loading framework content...')}</p>
  </div>
{/if}

<style>
  /* Institutional Regeneration Framework color scheme */
  :root {
    --ir-primary: #005F73;
    --ir-secondary: #4A624E;
    --ir-accent: #E9C46A;
    --ir-success: #2A9D8F;
    --ir-warning: #F7B801;
    --ir-danger: #D62828;
    --ir-light: #FAF9F6;
    --ir-dark: #0A3A4A;
    --ir-wisdom: #3C3C3B;
    --ir-transformation: #F4A261;
  }

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
    border-top: 4px solid var(--ir-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

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

  .framework-guide-card {
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.1);
    border: 1px solid rgba(37, 99, 235, 0.2);
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
    color: var(--ir-primary);
    flex-shrink: 0;
  }
  
  .card-text {
    flex: 1;
    min-width: 200px;
  }
  
  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--ir-primary);
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

  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to bottom, var(--ir-light), #f8fafc);
    border-radius: 0.5rem;
    padding: 1rem;
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
    background-color: rgba(37, 99, 235, 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(37, 99, 235, 0.1);
    color: var(--ir-primary);
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
    margin-bottom: 0.25rem;
  }

  .nav-item:hover {
    background-color: rgba(5, 150, 105, 0.05);
    color: #374151;
  }

  .nav-item.active {
    background-color: var(--ir-primary);
    color: white;
    font-weight: 600;
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

  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(5, 150, 105, 0.1));
    border-radius: 0.5rem;
    border-left: 4px solid var(--ir-primary);
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
    background: linear-gradient(90deg, var(--ir-primary), var(--ir-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--ir-primary);
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
    border-radius: 0.5rem;
    border: 1px dashed rgba(37, 99, 235, 0.3);
  }
  
  .primary-btn, .download-btn, .tool-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border: none;
    font-size: 0.9rem;
  }

  .primary-btn {
    background-color: var(--ir-primary);
    color: white;
  }
  
  .primary-btn:hover {
    background-color: var(--ir-secondary);
    transform: translateY(-1px);
  }

  .download-btn {
    background-color: var(--ir-secondary);
    color: white;
  }

  .download-btn:hover {
    background-color: var(--ir-success);
    transform: translateY(-1px);
  }

  .tool-btn {
    background-color: var(--ir-accent);
    color: white;
  }

  .tool-btn:hover {
    background-color: var(--ir-transformation);
    transform: translateY(-1px);
  }

  .section-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-btn {
    background-color: var(--ir-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--ir-secondary);
    transform: translateY(-1px);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

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
    color: var(--ir-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--ir-secondary);
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
    color: var(--ir-primary);
  }
  
  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--ir-secondary);
  }
  
  .content :global(h3),
  .content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--ir-accent);
  }

  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  .content :global(blockquote) {
    background-color: rgba(5, 150, 105, 0.1);
    border-left: 4px solid var(--ir-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

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
    content: "•";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1.2rem;
    color: var(--ir-secondary);
  }

  .content :global(ol) {
    list-style-type: decimal;
  }

  .content :global(ol li) {
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
  }

  .content :global(ol li::marker) {
    color: var(--ir-secondary);
    font-weight: 600;
  }

  .content :global(a) {
    color: var(--ir-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--ir-primary);
  }

  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }

    .section-nav {
      padding: 0.75rem;
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

    .action-buttons {
      flex-direction: column;
    }

    .action-buttons button {
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
</style>
