<!-- src/routes/resources/whitepapers/omega-proof/white-paper/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { locale, t } from '$lib/i18n';
  import { base } from '$app/paths';
  
  export let data;
  
  const { sections, currentLocale, usedFallback } = data;
  
  let activeSection = 'introduction';
  let readingProgress = 0;
  let showTableOfContents = false;
  
  // Section metadata
  const sectionMeta = [
    { id: 'introduction', number: 1, titleKey: 'omega.sections.introduction' },
    { id: 'apparatus', number: 2, titleKey: 'omega.sections.apparatus' },
    { id: 'data', number: 3, titleKey: 'omega.sections.data' },
    { id: 'diagnosis', number: 4, titleKey: 'omega.sections.diagnosis' },
    { id: 'prescription', number: 5, titleKey: 'omega.sections.prescription' },
    { id: 'trajectory', number: 6, titleKey: 'omega.sections.trajectory' },
    { id: 'conclusion', number: 7, titleKey: 'omega.sections.conclusion' }
  ];
  
  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      showTableOfContents = false;
    }
  }
  
  function updateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    readingProgress = (scrolled / documentHeight) * 100;
  }
  
  onMount(() => {
    // Reading progress tracking
    window.addEventListener('scroll', updateReadingProgress);
    
    // Scroll spy for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { threshold: 0.3 }
    );
    
    sectionMeta.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    // Check for hash navigation
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      setTimeout(() => scrollToSection(targetId), 100);
    }
    
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      observer.disconnect();
    };
  });
</script>

<svelte:head>
  <title>The Omega Proof: Full Paper | Global Governance Frameworks</title>
  <meta name="description" content="Complete 7-section analysis demonstrating the architectural impossibility of peace under current international system constraints." />
</svelte:head>

<!-- Reading Progress Bar -->
<div class="reading-progress-container">
  <div class="reading-progress-bar" style="width: {readingProgress}%"></div>
</div>

<!-- Floating Navigation -->
<nav class="floating-nav" class:expanded={showTableOfContents}>
  <button 
    class="nav-toggle"
    on:click={() => showTableOfContents = !showTableOfContents}
    aria-label="Toggle table of contents"
  >
    {#if showTableOfContents}
      ✕
    {:else}
      ☰
    {/if}
  </button>
  
  {#if showTableOfContents}
    <div class="nav-content">
      <h3>{$t('omega.tableOfContents')}</h3>
      <ol class="section-list">
        {#each sectionMeta as section}
          <li class:active={activeSection === section.id}>
            <button on:click={() => scrollToSection(section.id)}>
              <span class="section-number">{section.number}</span>
              <span class="section-title">{$t(section.titleKey)}</span>
            </button>
          </li>
        {/each}
      </ol>
      
      <div class="nav-actions">
        <a href="{base}/resources/whitepapers/omega-proof" class="btn-back">
          ← {$t('omega.backToOverview')}
        </a>
      </div>
    </div>
  {/if}
</nav>

<!-- Language Fallback Notice -->
{#if usedFallback}
  <div class="language-notice">
    <p>
      ⚠️ {$t('omega.fallbackNotice')}
    </p>
  </div>
{/if}

<!-- Main Content -->
<article class="white-paper">
  <header class="paper-header">
    <div class="header-content">
      <p class="epigraph">{$t('omega.epigraph')}</p>
      <h1>{$t('omega.paperTitle')}</h1>
      <p class="subtitle">{$t('omega.paperSubtitle')}</p>
      
      <div class="paper-meta">
        <span>{$t('omega.date')}: December 2025</span>
        <span class="separator">•</span>
        <span>{$t('omega.authors')}: Björn Kenneth Holmström</span>
        <span class="separator">•</span>
        <span>{$t('omega.readingTime')}: ~60 minutes</span>
      </div>
      
      <div class="header-actions">
        <a href="{base}/resources/whitepapers/omega-proof" class="btn btn-secondary">
          ← {$t('omega.backToOverview')}
        </a>
        <a href="{base}/resources/whitepapers/omega-proof/downloads/omega-proof.pdf" class="btn btn-primary" download>
          <span>📥</span> Download PDF
        </a>
        <button on:click={() => window.print()} class="btn btn-tertiary">
          {$t('omega.printPaper')}
        </button>
      </div>
    </div>
  </header>

  <!-- Section 1: Introduction -->
  <section id="introduction" class="paper-section">
    <div class="section-header">
      <span class="section-number">1</span>
      <h2>{$t('omega.sections.introduction')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.introduction.component} />
    </div>
  </section>

  <!-- Section 2: Apparatus -->
  <section id="apparatus" class="paper-section">
    <div class="section-header">
      <span class="section-number">2</span>
      <h2>{$t('omega.sections.apparatus')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.apparatus.component} />
    </div>
  </section>

  <!-- Section 3: Data -->
  <section id="data" class="paper-section">
    <div class="section-header">
      <span class="section-number">3</span>
      <h2>{$t('omega.sections.data')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.data.component} />
    </div>
  </section>

  <!-- Section 4: Diagnosis -->
  <section id="diagnosis" class="paper-section">
    <div class="section-header">
      <span class="section-number">4</span>
      <h2>{$t('omega.sections.diagnosis')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.diagnosis.component} />
    </div>
  </section>

  <!-- Section 5: Prescription -->
  <section id="prescription" class="paper-section">
    <div class="section-header">
      <span class="section-number">5</span>
      <h2>{$t('omega.sections.prescription')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.prescription.component} />
    </div>
  </section>

  <!-- Section 6: Trajectory -->
  <section id="trajectory" class="paper-section">
    <div class="section-header">
      <span class="section-number">6</span>
      <h2>{$t('omega.sections.trajectory')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.trajectory.component} />
    </div>
  </section>

  <!-- Section 7: Conclusion -->
  <section id="conclusion" class="paper-section">
    <div class="section-header">
      <span class="section-number">7</span>
      <h2>{$t('omega.sections.conclusion')}</h2>
    </div>
    <div class="section-content">
      <svelte:component this={sections.conclusion.component} />
    </div>
  </section>

  <!-- Paper Footer -->
  <footer class="paper-footer">
    <div class="footer-content">
      <p class="closing-epigraph">{$t('omega.closingEpigraph')}</p>
      <p class="end-mark">{$t('omega.endOfPaper')}</p>
      
      <div class="footer-actions">
        <a href="{base}/resources/whitepapers/omega-proof" class="btn btn-primary">
          ← {$t('omega.backToOverview')}
        </a>
        <a href="{base}/resources/whitepapers/omega-proof/research-package/0" class="btn btn-secondary">
          {$t('omega.browseResearch')}
        </a>
        <a href="{base}/get-involved?source=salvage" class="btn btn-tertiary">
          {$t('omega.joinSalvage')}
        </a>
      </div>
    </div>
  </footer>
</article>

<style>
  /* Reading Progress Bar */
  .reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #f3f4f6;
    z-index: 1000;
  }

  @media (prefers-color-scheme: dark) {
    .reading-progress-container {
      background: #1f2937;
    }
  }

  .reading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #4f46e5);
    transition: width 0.1s ease-out;
  }

  /* Floating Navigation */
  .floating-nav {
    position: fixed;
    top: 4rem;
    right: 2rem;
    z-index: 100;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
  }

  @media (prefers-color-scheme: dark) {
    .floating-nav {
      background: #1f2937;
      border-color: #374151;
    }
  }

  .floating-nav.expanded {
    width: 320px;
  }

  .nav-toggle {
    display: block;
    width: 3rem;
    height: 3rem;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: #111827;
    transition: transform 0.3s;
  }

  @media (prefers-color-scheme: dark) {
    .nav-toggle {
      color: #f9fafb;
    }
  }

  .nav-toggle:hover {
    transform: scale(1.1);
  }

  .nav-content {
    padding: 1rem;
    padding-top: 0;
  }

  .nav-content h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .nav-content h3 {
      border-color: #374151;
    }
  }

  .section-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
  }

  .section-list li {
    margin-bottom: 0.25rem;
  }

  .section-list button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    border-radius: 0.375rem;
    transition: all 0.2s;
    font-size: 0.875rem;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .section-list button {
      color: #f9fafb;
    }
  }

  .section-list button:hover {
    background: #f3f4f6;
  }

  @media (prefers-color-scheme: dark) {
    .section-list button:hover {
      background: #374151;
    }
  }

  .section-list li.active button {
    background: #3b82f6;
    color: white;
  }

  .section-list .section-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    background: #f3f4f6;
    font-weight: 700;
    font-size: 0.75rem;
    flex-shrink: 0;
  }

  @media (prefers-color-scheme: dark) {
    .section-list .section-number {
      background: #374151;
    }
  }

  .section-list li.active .section-number {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .nav-actions {
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .nav-actions {
      border-color: #374151;
    }
  }

  .btn-back {
    display: block;
    text-align: center;
    padding: 0.5rem;
    text-decoration: none;
    color: #6b7280;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  @media (prefers-color-scheme: dark) {
    .btn-back {
      color: #9ca3af;
    }
  }

  .btn-back:hover {
    background: #f3f4f6;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .btn-back:hover {
      background: #374151;
      color: #f9fafb;
    }
  }

  /* Language Fallback Notice */
  .language-notice {
    background: #f59e0b;
    color: white;
    padding: 0.75rem 1.5rem;
    text-align: center;
    font-size: 0.875rem;
  }

  /* Main Article */
  .white-paper {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Paper Header */
  .paper-header {
    padding: 3rem 0;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 3rem;
  }

  @media (prefers-color-scheme: dark) {
    .paper-header {
      border-color: #374151;
    }
  }

  .epigraph {
    font-size: 1.125rem;
    font-style: italic;
    color: #ef4444;
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
  }

  .paper-header h1 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    text-align: center;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 2rem;
  }

  @media (prefers-color-scheme: dark) {
    .subtitle {
      color: #9ca3af;
    }
  }

  .paper-meta {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  @media (prefers-color-scheme: dark) {
    .paper-meta {
      color: #9ca3af;
    }
  }

  .separator {
    color: #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .separator {
      color: #374151;
    }
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Paper Sections */
  .paper-section {
    margin-bottom: 4rem;
    scroll-margin-top: 5rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .section-header {
      border-color: #374151;
    }
  }

  .section-header .section-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    background: #3b82f6;
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .section-header h2 {
    font-size: 2rem;
    margin: 0;
  }

  .section-content {
    font-family: 'Merriweather', 'Georgia', serif; /* Matches Research Package */
    line-height: 1.9; /* Slightly looser for long-form reading */
    font-size: 1.125rem;
    color: #334155; /* Softer dark grey */
    max-width: 65ch; /* Optimal reading width */
  }

  @media (prefers-color-scheme: dark) {
    .section-content {
      color: #cbd5e1;
    }
  }

  /* Keep Headings Sans-Serif for contrast */
  .section-content :global(h1),
  .section-content :global(h2),
  .section-content :global(h3),
  .section-content :global(h4),
  .section-content :global(h5),
  .section-content :global(h6) {
    font-family: 'Inter', sans-serif; /* Restore Sans-Serif for headers */
    font-weight: 700;
    color: #1e293b; /* Dark Navy */
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(h1),
    .section-content :global(h2),
    .section-content :global(h3),
    .section-content :global(h4),
    .section-content :global(h5),
    .section-content :global(h6) {
      color: #f1f5f9;
    }
  }

  /* Specific sizing for each level */
  .section-content :global(h1) { font-size: 2.25rem; }
  .section-content :global(h2) { font-size: 1.875rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
  .section-content :global(h3) { font-size: 1.5rem; }
  .section-content :global(h4) { font-size: 1.25rem; }

  /* First heading shouldn't have top margin */
  .section-content > :global(*:first-child) {
    margin-top: 0;
  }

  /* Markdown Content Styling */
  .section-content :global(h3) {
    font-size: 1.5rem;
    margin: 2rem 0 1rem;
  }

  .section-content :global(h4) {
    font-size: 1.25rem;
    margin: 1.5rem 0 0.75rem;
  }

  .section-content :global(p) {
    margin-bottom: 1.25rem;
    color: #374151;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(p) {
      color: #d1d5db;
    }
  }

  /* Fix for Lists - Explicitly restore styles */
  .section-content :global(ul) {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
    list-style-type: disc; /* Restores bullets */
  }

  .section-content :global(ol) {
    margin: 1.5rem 0;
    padding-left: 1.5rem;
    list-style-type: decimal; /* Restores numbers */
  }

  .section-content :global(li) {
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
    color: #374151;
  }

  /* Nested Lists */
  .section-content :global(ul ul) {
    list-style-type: circle;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .section-content :global(ol ol) {
    list-style-type: lower-alpha;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Gold Markers to match branding */
  .section-content :global(li::marker) {
    color: #d97706; /* Gold/Accent */
    font-weight: bold;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(li) {
      color: #d1d5db;
    }
  }

  .section-content :global(blockquote) {
    border-left: 4px solid #d97706; /* Gold/Accent (Matches Research Pkg) */
    background: #fffbeb; /* Light Yellow background */
    padding: 1.5rem 2rem;
    margin: 2rem 0;
    color: #4b5563;
    font-style: italic;
    border-radius: 0 0.5rem 0.5rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Subtle lift */
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(blockquote) {
      background: #1e1b4b; /* Dark Navy background for dark mode */
      color: #94a3b8;
      border-left-color: #fbbf24; /* Lighter Gold */
    }
  }

  .section-content :global(code) {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
    font-family: 'Fira Code', monospace;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(code) {
      background: #1f2937;
    }
  }

  .section-content :global(pre) {
    background: #f3f4f6;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(pre) {
      background: #1f2937;
    }
  }

  .section-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
  }

  .section-content :global(th),
  .section-content :global(td) {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    text-align: left;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(th),
    .section-content :global(td) {
      border-color: #374151;
    }
  }

  .section-content :global(th) {
    background: #f3f4f6;
    font-weight: 600;
  }

  @media (prefers-color-scheme: dark) {
    .section-content :global(th) {
      background: #1f2937;
    }
  }

  /* Paper Footer */
  .paper-footer {
    margin-top: 4rem;
    padding: 3rem 0;
    border-top: 2px solid #e5e7eb;
    text-align: center;
  }

  @media (prefers-color-scheme: dark) {
    .paper-footer {
      border-color: #374151;
    }
  }

  .closing-epigraph {
    font-size: 1.25rem;
    font-style: italic;
    color: #6b7280;
    margin-bottom: 1rem;
  }

  @media (prefers-color-scheme: dark) {
    .closing-epigraph {
      color: #9ca3af;
    }
  }

  .end-mark {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .footer-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Buttons */
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-block;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-secondary {
    background: transparent;
    border: 2px solid #3b82f6;
    color: #3b82f6;
  }

  .btn-secondary:hover {
    background: #3b82f6;
    color: white;
  }

  .btn-tertiary {
    background: #f3f4f6;
    color: #111827;
  }

  @media (prefers-color-scheme: dark) {
    .btn-tertiary {
      background: #1f2937;
      color: #f9fafb;
    }
  }

  .btn-tertiary:hover {
    background: #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    .btn-tertiary:hover {
      background: #374151;
    }
  }

  /* Print Styles */
  @media print {
    .reading-progress-container,
    .floating-nav,
    .language-notice,
    .header-actions,
    .footer-actions {
      display: none !important;
    }

    .white-paper {
      max-width: 100%;
      padding: 0;
      margin: 0;
    }

    /* Ensure text is black for saving ink/readability */
    .section-content, 
    .section-content :global(p),
    .section-content :global(li) {
      color: #000000 !important;
    }

    /* Expand links so they are readable on paper */
    .section-content :global(a)::after {
      content: " (" attr(href) ")";
      font-size: 0.8em;
      color: #666;
    }
    .paper-section {
      page-break-inside: avoid;
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .floating-nav {
      right: 1rem;
      top: 3.5rem;
    }

    .white-paper {
      padding: 1rem;
    }

    .paper-header h1 {
      font-size: 1.75rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
    }

    .section-header .section-number {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.25rem;
    }
  }
</style>
