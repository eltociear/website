<!-- src/routes/frameworks/guides/bioregional-compass/the-guide/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let data;

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: bc = translationsReady ? ($t('guidesBioregionalCompass') || {}) : {};
  $: guide = translationsReady ? ($t('guidesBioregionalCompassTheGuide') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let mounted = false;
  let activeSection = 'introduction'; // Start with introduction
  let sectionProgressContainer;
  let showTableOfContents = false;
  let readingProgress = 0;

  // Computed values
  $: currentSectionData = data.guideSections.find(s => s.id === activeSection);
  $: currentSectionIndex = data.guideSections.findIndex(s => s.id === activeSection);
  $: isFirstSection = currentSectionIndex === 0;
  $: isLastSection = currentSectionIndex === data.guideSections.length - 1;
  $: nextSection = !isLastSection ? data.guideSections[currentSectionIndex + 1] : null;
  $: previousSection = !isFirstSection ? data.guideSections[currentSectionIndex - 1] : null;

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser && !translationsReady) {
      try {
        await loadTranslations($locale, '/frameworks/guides/bioregional-compass/the-guide');
      } catch (e) {
        console.error('Failed to reload translations:', e);
      }
    }

    // Check for section hash in URL
    if (browser && window.location.hash) {
      const hashSection = window.location.hash.slice(1);
      if (data.guideSections.some(s => s.id === hashSection)) {
        activeSection = hashSection;
      }
    }

    // Set up reading progress tracking
    if (browser) {
      setupReadingProgress();
    }
  });

  function setupReadingProgress() {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      readingProgress = Math.min(scrolled, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }

  function setActiveSection(sectionId) {
    if (!data.guideSections.some(s => s.id === sectionId)) return;
    
    activeSection = sectionId;
    
    if (browser) {
      // Update URL hash
      const newUrl = `${window.location.pathname}#${sectionId}`;
      history.replaceState(null, '', newUrl);

      // Scroll to content
      setTimeout(() => {
        const contentElement = document.querySelector('.guide-content');
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

  function navigateToSection(direction) {
    if (direction === 'next' && nextSection) {
      setActiveSection(nextSection.id);
    } else if (direction === 'previous' && previousSection) {
      setActiveSection(previousSection.id);
    }
  }

  function toggleTableOfContents() {
    showTableOfContents = !showTableOfContents;
  }

  function formatSectionTitle(section) {
    if (section.pillarNumber !== undefined) {
      return `${section.title}${section.subtitle ? ': ' + section.subtitle : ''}`;
    }
    return section.title;
  }

  function getSectionType(section) {
    if (section.pillarNumber !== undefined) return 'pillar';
    if (['introduction', 'how-to-use-this-guide', 'defining-your-minimum-viable-baz'].includes(section.id)) return 'foundation';
    return 'graduation';
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('guidesBioregionalCompassTheGuide.meta.title', 'The Complete Formation Guide - Bioregional Compass')}</title>
  <meta name="description" content="{getTextWithFallback('guidesBioregionalCompassTheGuide.meta.description', 'Step-by-step journey through the six pillars of BAZ formation')}" />
</svelte:head>

{#if mounted}
  <!-- Reading Progress Bar -->
  <div class="reading-progress-container">
    <div class="reading-progress-bar" style="width: {readingProgress}%"></div>
  </div>

  <!-- Breadcrumb Navigation -->
  <div class="breadcrumb-nav">
    <nav class="breadcrumb-container">
      <a href="/resources" class="breadcrumb-link">
        <span class="breadcrumb-icon">🌍</span>
        <span class="breadcrumb-text">{guide.navigation?.resources || 'Resources'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides" class="breadcrumb-link">
        <span class="breadcrumb-icon">📖</span>
        <span class="breadcrumb-text">{guide.navigation?.guides || 'Implementation Guides'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <a href="/frameworks/guides/bioregional-compass" class="breadcrumb-link">
        <span class="breadcrumb-icon">🧭</span>
        <span class="breadcrumb-text">{guide.navigation?.bioregionalCompass || 'Bioregional Compass'}</span>
      </a>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-current">{guide.navigation?.theGuide || 'The Complete Guide'}</span>
    </nav>
  </div>

  <div class="guide-container">
    <!-- Guide Header -->
    <header class="guide-header">
      <div class="header-content">
        <h1 class="guide-title">
          <span class="title-icon">📚</span>
          {guide.title || 'The Complete Formation Guide'}
        </h1>
        <p class="guide-subtitle">
          {guide.subtitle || 'Step-by-step journey through the six pillars of BAZ formation'}
        </p>
        
        <!-- Guide Stats -->
        <div class="guide-stats">
          <div class="stat-item">
            <span class="stat-number">{data.totalSections}</span>
            <span class="stat-label">{guide.stats?.sections || 'Sections'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.totalEstimatedReadTime}</span>
            <span class="stat-label">{guide.stats?.minutesRead || 'Min Read'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.totalPillars}</span>
            <span class="stat-label">{guide.stats?.pillars || 'Pillars'}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="content-layout">
      <!-- Table of Contents Sidebar -->
      <aside class="toc-sidebar" class:expanded={showTableOfContents}>
        <div class="toc-header">
          <h2 class="toc-title">{guide.tableOfContents?.title || 'Table of Contents'}</h2>
          <button class="toc-toggle" on:click={toggleTableOfContents}>
            <span class="toggle-icon" class:rotated={showTableOfContents}>▼</span>
          </button>
        </div>

        <div class="toc-content" class:hidden={!showTableOfContents}>
          <!-- Foundation Sections -->
          <div class="toc-category">
            <h3 class="category-title">
              <span class="category-icon">🌱</span>
              {guide.tableOfContents?.foundation || 'Foundation'}
            </h3>
            <ul class="toc-list">
              {#each data.sectionsByType.introduction as section}
                <li class="toc-item">
                  <button 
                    class="toc-link" 
                    class:active={activeSection === section.id}
                    on:click={() => setActiveSection(section.id)}
                  >
                    <span class="section-icon">{section.icon}</span>
                    <span class="section-title">{formatSectionTitle(section)}</span>
                    <span class="section-time">{section.estimatedTime}</span>
                  </button>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Pillars -->
          <div class="toc-category">
            <h3 class="category-title">
              <span class="category-icon">🏛️</span>
              {guide.tableOfContents?.pillars || 'The Six Pillars'}
            </h3>
            <ul class="toc-list">
              {#each data.sectionsByType.pillars as section}
                <li class="toc-item">
                  <button 
                    class="toc-link pillar-link" 
                    class:active={activeSection === section.id}
                    on:click={() => setActiveSection(section.id)}
                  >
                    <span class="section-icon">{section.icon}</span>
                    <div class="pillar-info">
                      <span class="pillar-number">Pillar {section.pillarNumber}</span>
                      <span class="pillar-title">{section.title.replace(`Pillar ${section.pillarNumber}: `, '')}</span>
                      {#if section.subtitle}
                        <span class="pillar-subtitle">{section.subtitle}</span>
                      {/if}
                    </div>
                    <span class="section-time">{section.estimatedTime}</span>
                  </button>
                </li>
              {/each}
            </ul>
          </div>

          <!-- Graduation -->
          <div class="toc-category">
            <h3 class="category-title">
              <span class="category-icon">🎓</span>
              {guide.tableOfContents?.graduation || 'Graduation'}
            </h3>
            <ul class="toc-list">
              {#each data.sectionsByType.graduation as section}
                <li class="toc-item">
                  <button 
                    class="toc-link" 
                    class:active={activeSection === section.id}
                    on:click={() => setActiveSection(section.id)}
                  >
                    <span class="section-icon">{section.icon}</span>
                    <span class="section-title">{formatSectionTitle(section)}</span>
                    <span class="section-time">{section.estimatedTime}</span>
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Current Section Content -->
        <div class="guide-content">
          {#if currentSectionData}
            <!-- Section Header -->
            <div class="section-header">
              <div class="section-meta">
                <span class="section-type {getSectionType(currentSectionData)}">{getSectionType(currentSectionData)}</span>
                <span class="section-time">⏱️ {currentSectionData.estimatedTime}</span>
              </div>
              
              <h1 class="section-title">
                <span class="section-icon">{currentSectionData.icon}</span>
                {formatSectionTitle(currentSectionData)}
              </h1>
            </div>

            <!-- Language Fallback Notice -->
            {#if data.sectionsUsingEnglishFallback?.includes(activeSection)}
              <div class="language-fallback-notice">
                <div class="notice-icon">🌍</div>
                <div class="notice-content">
                  <strong>{guide.languageFallback?.title || 'Content in your language coming soon'}</strong>
                  <p>{guide.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
                </div>
              </div>
            {/if}

            <!-- Render Section Content -->
            <div class="markdown-content">
              {#if data.loadedContent[activeSection]}
                <svelte:component this={data.loadedContent[activeSection].default} t={$t} />
              {:else}
                <div class="missing-content">
                  <h3>{guide.errors?.sectionNotFound?.replace('{section}', activeSection) || `Section "${activeSection}" not found`}</h3>
                  <p>{guide.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
                </div>
              {/if}
            </div>

            <!-- Section Navigation -->
            <div class="section-navigation">
              {#if previousSection}
                <button 
                  class="nav-btn prev-btn" 
                  on:click={() => navigateToSection('previous')}
                >
                  <span class="nav-arrow">←</span>
                  <div class="nav-info">
                    <span class="nav-label">{guide.navigation?.previous || 'Previous'}</span>
                    <span class="nav-title">{formatSectionTitle(previousSection)}</span>
                  </div>
                </button>
              {/if}
              
              {#if nextSection}
                <button 
                  class="nav-btn next-btn" 
                  on:click={() => navigateToSection('next')}
                >
                  <div class="nav-info">
                    <span class="nav-label">{guide.navigation?.next || 'Next'}</span>
                    <span class="nav-title">{formatSectionTitle(nextSection)}</span>
                  </div>
                  <span class="nav-arrow">→</span>
                </button>
              {/if}
            </div>
          {:else}
            <div class="no-section">
              <h3>{guide.errors?.invalidSection || 'Invalid Section'}</h3>
              <p>{guide.errors?.selectValidSection || 'Please select a valid section from the table of contents.'}</p>
            </div>
          {/if}
        </div>
      </main>
    </div>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('guidesBioregionalCompassTheGuide.loading.text', 'Loading guide content...')}</p>
  </div>
{/if}

<style>
  /* Bioregional Compass The Guide color scheme */
  :root {
    --guide-primary: #2D5016;
    --guide-secondary: #8B5A2B;
    --guide-accent: #CD853F;
    --guide-success: #228B22;
    --guide-warning: #DAA520;
    --guide-light: #F5F5DC;
    --guide-dark: #1C2E0A;
    --guide-wisdom: #9ACD32;
    
    /* Section type colors */
    --foundation-color: #8B4513;
    --pillar-color: #228B22;
    --graduation-color: #9932CC;
  }

  /* Reading Progress Bar */
  .reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--guide-primary), var(--guide-accent));
    transition: width 0.3s ease;
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
    border-top: 4px solid var(--guide-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Breadcrumb Navigation */
  .breadcrumb-nav {
    background-color: rgba(45, 80, 22, 0.05);
    border-bottom: 1px solid rgba(45, 80, 22, 0.1);
    padding: 1rem 0;
    margin-top: 4px; /* Account for progress bar */
  }

  .breadcrumb-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--guide-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .breadcrumb-link:hover {
    color: var(--guide-primary);
    background-color: rgba(45, 80, 22, 0.1);
  }

  .breadcrumb-separator {
    color: #6b7280;
    font-weight: 300;
  }

  .breadcrumb-current {
    color: var(--guide-primary);
    font-weight: 600;
  }

  /* Main Layout */
  .guide-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .guide-header {
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    border: 1px solid rgba(45, 80, 22, 0.2);
    text-align: center;
  }

  .guide-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 2.2rem;
  }

  .guide-subtitle {
    font-size: 1.1rem;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .guide-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--guide-primary);
  }

  .stat-label {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Content Layout */
  .content-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* Table of Contents Sidebar */
  .toc-sidebar {
    position: sticky;
    top: 6rem;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .toc-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toc-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0;
  }

  .toc-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  .toc-toggle:hover {
    background-color: rgba(45, 80, 22, 0.1);
  }

  .toggle-icon {
    font-size: 0.8rem;
    color: #6b7280;
    transition: transform 0.2s ease;
  }

  .toggle-icon.rotated {
    transform: rotate(180deg);
  }

  .toc-content {
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .toc-content.hidden {
    max-height: 0;
    opacity: 0;
  }

  .toc-category {
    border-bottom: 1px solid #f3f4f6;
  }

  .toc-category:last-child {
    border-bottom: none;
  }

  .category-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--guide-secondary);
    margin: 0;
    padding: 1rem 1.5rem 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .category-icon {
    font-size: 1rem;
  }

  .toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .toc-item {
    margin: 0;
  }

  .toc-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
    color: #4b5563;
  }

  .toc-link:hover {
    background-color: rgba(45, 80, 22, 0.05);
  }

  .toc-link:hover .section-time,
  .toc-link:hover .pillar-number,
  .toc-link:hover .pillar-title,
  .toc-link:hover .pillar-subtitle,
  .toc-link:hover .section-title {
    color: var(--guide-primary);
  }

  .toc-link:hover .pillar-number {
    color: var(--guide-accent);
  }

  .toc-link.active {
    background-color: var(--guide-primary);
    color: white;
    box-shadow: 0 2px 8px rgba(45, 80, 22, 0.3);
    position: relative;
  }

  .toc-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--guide-accent);
    border-radius: 0 2px 2px 0;
  }

  .section-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .section-title {
    flex: 1;
    font-weight: 500;
    font-size: 0.9rem !important;
    line-height: 1.3;
  }

  .section-time {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 400;
  }

  /* Force white text for all child elements in active state */
  .toc-link.active .section-time,
  .toc-link.active .pillar-number,
  .toc-link.active .pillar-title,
  .toc-link.active .pillar-subtitle,
  .toc-link.active .section-icon,
  .toc-link.active .section-title {
    color: white !important;
  }

  /* Specific targeting for the pillar elements */
  .toc-link.active .pillar-number {
    opacity: 0.9;
  }

  .toc-link.active .pillar-subtitle {
    opacity: 0.8;
  }

  .pillar-link {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
  }

  .pillar-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    width: 100%;
  }

  .pillar-number {
    font-size: 0.8rem;
    color: var(--guide-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .toc-link.active .pillar-number {
    color: rgba(255, 255, 255, 0.9);
  }

  .pillar-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--guide-primary);
  }

  .toc-link.active .pillar-title {
    color: white;
  }

  .pillar-subtitle {
    font-size: 0.8rem;
    color: #6b7280;
    font-style: italic;
    font-weight: 400;
  }

  .toc-link.active .pillar-subtitle {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Main Content */
  .main-content {
    min-width: 0;
  }

  .guide-content {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .section-header {
    padding: 2rem;
    background: linear-gradient(135deg, var(--guide-light), rgba(45, 80, 22, 0.1));
    border-bottom: 1px solid #e5e7eb;
  }

  .section-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .section-type {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .section-type.foundation {
    background-color: var(--foundation-color);
  }

  .section-type.pillar {
    background-color: var(--pillar-color);
  }

  .section-type.graduation {
    background-color: var(--graduation-color);
  }

  .section-time {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: #6b7280;
    color: white;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    line-height: 1.2;
  }

  .section-title .section-icon {
    font-size: 1.8rem;
  }

  /* Language Fallback Notice */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(218, 165, 32, 0.1);
    border: 1px solid rgba(218, 165, 32, 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin: 2rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: #DAA520;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content {
    flex: 1;
  }

  .notice-content strong {
    color: var(--guide-secondary);
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

  /* Markdown Content */
  .markdown-content {
    padding: 2rem;
  }

  .missing-content {
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    color: #6b7280;
  }

  .missing-content h3 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .no-section {
    padding: 4rem 2rem;
    text-align: center;
    color: #6b7280;
  }

  .no-section h3 {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  /* Section Navigation */
  .section-navigation {
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    gap: 1rem;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background-color: white;
    border: 2px solid var(--guide-primary);
    border-radius: 0.5rem;
    color: var(--guide-primary);
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    text-decoration: none;
    max-width: 45%;
  }

  .nav-btn:hover {
    background-color: var(--guide-primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
  }

  .prev-btn {
    margin-right: auto;
  }

  .next-btn {
    margin-left: auto;
  }

  .nav-arrow {
    font-size: 1.2rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .nav-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .nav-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }

  .nav-title {
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Content Styling */
  .markdown-content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--guide-primary);
  }
  
  .markdown-content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--guide-secondary);
  }
  
  .markdown-content :global(h3),
  .markdown-content :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--guide-accent);
  }

  .markdown-content :global(h4) {
    font-size: 1.2rem;
  }
  
  .markdown-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #4b5563;
  }

  .markdown-content :global(blockquote) {
    background-color: rgba(139, 90, 43, 0.1);
    border-left: 4px solid var(--guide-secondary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  .markdown-content :global(ul), .markdown-content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
    color: #4b5563;
  }

  .markdown-content :global(ul) {
    list-style-type: none;
  }

  .markdown-content :global(ul li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }

  .markdown-content :global(ul li::before) {
    content: "🌱";
    position: absolute;
    left: 0;
    top: 0.1em;
    font-size: 1rem;
    color: var(--guide-success);
  }

  .markdown-content :global(ol) {
    list-style-type: decimal;
    counter-reset: item;
  }

  .markdown-content :global(ol li) {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
    color: #4b5563;
  }

  .markdown-content :global(ol li::marker) {
    color: var(--guide-secondary);
    font-weight: 600;
  }

  .markdown-content :global(a) {
    color: var(--guide-secondary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: var(--guide-primary);
  }

  /* Tables */
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .markdown-content :global(th),
  .markdown-content :global(td) {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .markdown-content :global(th) {
    background-color: var(--guide-light);
    font-weight: 600;
    color: var(--guide-primary);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .content-layout {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .toc-sidebar {
      position: static;
      max-height: none;
      order: -1;
    }

    .toc-content {
      max-height: 400px;
      overflow-y: auto;
    }

    .toc-content.hidden {
      max-height: 0;
    }
  }

  @media (max-width: 768px) {
    .guide-container {
      padding: 1rem 0.5rem;
    }

    .breadcrumb-container {
      padding: 0 1rem;
    }

    .guide-header {
      padding: 2rem 1.5rem;
      margin-bottom: 2rem;
    }

    .guide-title {
      font-size: 2rem;
      flex-direction: column;
      gap: 0.5rem;
    }

    .title-icon {
      font-size: 1.8rem;
    }

    .guide-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .stat-number {
      font-size: 1.5rem;
    }

    .section-header {
      padding: 1.5rem;
    }

    .section-title {
      font-size: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .section-title .section-icon {
      font-size: 1.5rem;
    }

    .markdown-content {
      padding: 1.5rem;
    }

    .section-navigation {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-btn {
      max-width: 100%;
    }

    .toc-header {
      padding: 1rem;
    }

    .toc-title {
      font-size: 1.1rem;
    }

    .category-title {
      padding: 0.75rem 1rem 0.5rem 1rem;
    }

    .toc-link {
      padding: 0.75rem 1rem;
    }

    .pillar-link {
      padding: 1rem;
    }
  }

  @media (max-width: 480px) {
    .breadcrumb-container {
      font-size: 0.85rem;
      gap: 0.25rem;
    }

    .guide-title {
      font-size: 1.75rem;
    }

    .section-meta {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .nav-info {
      text-align: left;
    }

    .nav-title {
      font-size: 0.85rem;
    }
  }
</style>
