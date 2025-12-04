<!-- src/routes/resources/whitepapers/omega-proof/research-package/[doc]/+page.svelte -->
<script>
  import { page } from '$app/stores';
  import { locale, t } from '$lib/i18n';
  import { base } from '$app/paths';
  import { slide } from 'svelte/transition';
  import { afterNavigate } from '$app/navigation'; 
  
  export let data;
  $: ({ phases, currentDoc, allDocs } = data);
  
  let activePhase = 1;
  
  $: if (currentDoc) {
    activePhase = getPhaseForDoc(currentDoc.number);
  }

  afterNavigate(({ from }) => {
    // Only run if we are actually viewing a document (not the overview dashboard)
    if (currentDoc && typeof window !== 'undefined') {
      const layoutElement = document.getElementById('package-layout-anchor');
      
      if (layoutElement) {
        // Calculate position: Scroll to the layout top minus a small buffer (2rem)
        // so the sticky sidebar aligns perfectly at the top of the viewport
        const y = layoutElement.getBoundingClientRect().top + window.scrollY - 32;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  });

  function getPhaseForDoc(docNum) {
    const num = parseInt(docNum);
    if (num <= 3) return 1; 
    if (num <= 6) return 2;
    if (num <= 10) return 3;
    return 4;
  }
  
  function togglePhase(phaseNumber) {
    if (activePhase === phaseNumber) {
      activePhase = null;
    } else {
      activePhase = phaseNumber;
    }
  }
  
  function formatDocNumber(num) {
    return num.toString().padStart(2, '0');
  }
</script>

<svelte:head>
  {#if currentDoc}
    <title>{currentDoc.title} | Omega Proof Research Package</title>
  {:else}
    <title>Research Package | The Omega Proof</title>
  {/if}
</svelte:head>

<div class="theme-wrapper">
  <div class="research-package-container">
    
    <header class="package-header">
      <div class="header-content">
        <nav class="top-nav">
          <a href="{base}/resources/whitepapers/omega-proof" class="back-link">
            ← {$t('omega.backToOverview')}
          </a>
        </nav>
        
        <div class="header-main">
          <h1>{$t('omega.researchPackageTitle')}</h1>
          <p class="header-subtitle">{$t('omega.researchPackageDescription')}</p>
        </div>
        
        <div class="header-meta">
          <div class="meta-item">
            <span class="meta-label">{$t('omega.totalDocuments')}</span>
            <span class="meta-value">13 Files</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <span class="meta-label">{$t('omega.timeFrame')}</span>
            <span class="meta-value">Nov 2025 - Jan 2026</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <span class="meta-label">{$t('omega.methodology')}</span>
            <span class="meta-value">Adversarial AI Simulation</span>
          </div>
        </div>
      </div>
    </header>

    <div class="package-layout" id="package-layout-anchor">
      <aside class="package-sidebar">
        <div class="sidebar-actions">
          <a href="{base}/resources/whitepapers/omega-proof/downloads/research-package.zip" class="download-btn">
            <span class="icon">⬇️</span>
            <span>{$t('omega.downloadZip')}</span>
          </a>
        </div>
        
        <div class="nav-tree">
          <h3 class="nav-heading">{$t('omega.documentPhases')}</h3>
          {#each phases as phase}
            <div class="phase-section" class:active={activePhase === phase.number}>
              <button 
                class="phase-toggle"
                on:click={() => togglePhase(phase.number)}
                type="button"
                aria-expanded={activePhase === phase.number}
              >
                <div class="phase-header-left">
                  <span class="phase-number">0{phase.number}</span>
                  <span class="phase-title">{phase.title}</span>
                </div>
                <span class="toggle-icon">{activePhase === phase.number ? '−' : '+'}</span>
              </button>
              
              {#if activePhase === phase.number}
                <nav class="doc-list" transition:slide={{ duration: 200 }}>
                  {#each phase.docs as doc}
                    <a 
                      href="{base}/resources/whitepapers/omega-proof/research-package/{formatDocNumber(doc.number)}"
                      class="doc-link"
                      class:active={currentDoc && currentDoc.number === doc.number}
                    >
                      <span class="doc-id">#{formatDocNumber(doc.number)}</span>
                      <div class="doc-link-content">
                        <span class="doc-link-title">{doc.title}</span>
                        <span class="doc-link-author">{doc.author}</span>
                      </div>
                    </a>
                  {/each}
                </nav>
              {/if}
            </div>
          {/each}
        </div>
      </aside>

      <main class="package-main">
        {#if currentDoc}
          <article class="document-paper">
            <header class="doc-paper-header">
              <div class="doc-breadcrumbs">
                <span class="crumb-phase">Phase {getPhaseForDoc(currentDoc.number)}</span>
                <span class="crumb-divider">/</span>
                <span class="crumb-id">Doc #{formatDocNumber(currentDoc.number)}</span>
              </div>
              
              <h1>{currentDoc.title}</h1>
              
              <div class="doc-attribution">
                <div class="attr-item">
                  <span class="attr-label">{$t('omega.author')}</span>
                  <span class="attr-value">{currentDoc.author}</span>
                </div>
                <div class="attr-item">
                  <span class="attr-label">{$t('omega.date')}</span>
                  <span class="attr-value">{currentDoc.date}</span>
                </div>
              </div>
            </header>
            
            <div class="doc-body markdown-body">
              <svelte:component this={currentDoc.component} />
            </div>
            
            <footer class="doc-paper-footer">
              <div class="doc-nav-buttons">
                {#if currentDoc.number > 0}
                  <a 
                    href="{base}/resources/whitepapers/omega-proof/research-package/{formatDocNumber(currentDoc.number - 1)}"
                    class="nav-btn prev"
                  >
                    <span class="nav-arrow">←</span> 
                    <span class="nav-text">{$t('omega.previousDocument')}</span>
                  </a>
                {:else}
                  <div></div>
                {/if}
                
                {#if currentDoc.number < 13}
                  <a 
                    href="{base}/resources/whitepapers/omega-proof/research-package/{formatDocNumber(currentDoc.number + 1)}"
                    class="nav-btn next"
                  >
                    <span class="nav-text">{$t('omega.nextDocument')}</span>
                    <span class="nav-arrow">→</span>
                  </a>
                {/if}
              </div>
            </footer>
          </article>

        {:else}
          <div class="overview-dashboard">
            <section class="overview-intro">
              <h2>{$t('omega.aboutResearchPackage')}</h2>
              <p class="lead">{$t('omega.researchPackageLongDescription')}</p>
            </section>
            
            <section class="methodology-grid">
              <div class="method-card">
                <div class="method-icon">🧬</div>
                <h4>Synthesis</h4>
                <p>Gemini generated initial frameworks and conceptual innovations.</p>
              </div>
              <div class="method-card">
                <div class="method-icon">⚔️</div>
                <h4>Challenge</h4>
                <p>Grok executed "Red Team" attacks acting as hardline personas.</p>
              </div>
              <div class="method-card">
                <div class="method-icon">🔧</div>
                <h4>Integration</h4>
                <p>DeepSeek analyzed vulnerabilities and proposed architectural fixes.</p>
              </div>
            </section>
            
            <section class="phases-preview">
              <h3>{$t('omega.whatYouWillFind')}</h3>
              <div class="phases-grid">
                {#each phases as phase}
                  <div class="phase-card">
                    <div class="phase-card-header">
                      <span class="phase-badge">Phase {phase.number}</span>
                      <h4>{phase.title}</h4>
                    </div>
                    <p>{phase.description}</p>
                    <div class="phase-footer">
                      <span class="doc-count">{phase.docs.length} Documents</span>
                      <button class="text-link" on:click={() => activePhase = phase.number}>View Docs →</button>
                    </div>
                  </div>
                {/each}
              </div>
            </section>
            
            <section class="start-cta">
              <div class="cta-box">
                <h3>{$t('omega.readyToDive')}</h3>
                <p>{$t('omega.readyToDiveDescription')}</p>
                <div class="cta-actions">
                  <a href="{base}/resources/whitepapers/omega-proof/research-package/00" class="primary-btn">
                    Start Reading (Doc #00)
                  </a>
                </div>
              </div>
            </section>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<style>
  /* --- Design Tokens & Variables --- */
  .theme-wrapper {
    --bg-dark: #0f172a;
    --bg-header: #1e1b4b;
    --bg-sidebar: #f8fafc;
    --bg-paper: #ffffff;
    
    --text-main: #1e293b;
    --text-muted: #64748b;
    --text-light: #f1f5f9;
    
    --color-primary: #1e40af; /* Deep Blue */
    --color-accent: #d97706;  /* Gold */
    --color-border: #e2e8f0;
    
    background-color: #f1f5f9;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  /* --- Header --- */
  .package-header {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    color: white;
    padding: 3rem 0;
    border-bottom: 4px solid var(--color-accent);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .back-link {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    margin-bottom: 2rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background: rgba(255,255,255,0.1);
    transition: all 0.2s;
  }

  .back-link:hover {
    background: rgba(255,255,255,0.2);
    color: white;
  }

  .header-main h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    letter-spacing: -0.02em;
  }

  .header-subtitle {
    font-size: 1.25rem;
    color: #94a3b8;
    max-width: 600px;
    line-height: 1.5;
  }

  .header-meta {
    margin-top: 2rem;
    display: flex;
    gap: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.15);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
  }

  .meta-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin-bottom: 0.25rem;
  }

  .meta-value {
    font-weight: 600;
    color: white;
  }

  .meta-divider {
    width: 1px;
    background: rgba(255,255,255,0.15);
  }

  /* --- Layout --- */
  .package-layout {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 3rem;
    padding: 3rem 2rem;
  }

  /* --- Sidebar --- */
  .package-sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    padding-right: 1rem; /* Space for scrollbar */
  }

  .download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    background: white;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
  }

  .download-btn:hover {
    background: var(--color-primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .nav-heading {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 1rem;
    font-weight: 700;
  }

  /* Phase Toggles */
  .phase-section {
    margin-bottom: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: white;
    overflow: hidden;
    transition: all 0.2s;
  }

  .phase-section.active {
    border-color: var(--color-primary);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .phase-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .phase-header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .phase-number {
    background: #f1f5f9;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }

  .phase-section.active .phase-number {
    background: var(--color-primary);
    color: white;
  }

  .phase-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-main);
  }

  .toggle-icon {
    color: var(--text-muted);
    font-weight: bold;
  }

  /* Doc List */
  .doc-list {
    border-top: 1px solid var(--color-border);
    background: #f8fafc;
  }

  .doc-link {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.15s;
  }

  .doc-link:hover {
    background: #f1f5f9;
    border-left-color: #cbd5e1;
  }

  .doc-link.active {
    background: white;
    border-left-color: var(--color-accent);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  }

  .doc-id {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.1rem;
  }

  .doc-link.active .doc-id {
    color: var(--color-accent);
    font-weight: 700;
  }

  .doc-link-content {
    display: flex;
    flex-direction: column;
  }

  .doc-link-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.3;
  }

  .doc-link-author {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
  }

  /* --- Document Paper (Main Viewer) --- */
  .document-paper {
    background: var(--bg-paper);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-border);
    padding: 4rem;
    min-height: 800px;
  }

  .doc-paper-header {
    border-bottom: 2px solid var(--color-border);
    padding-bottom: 2rem;
    margin-bottom: 3rem;
  }

  .doc-breadcrumbs {
    font-size: 0.85rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .crumb-divider {
    margin: 0 0.5rem;
    color: var(--color-border);
  }

  .crumb-id {
    color: var(--color-accent);
  }

  .doc-paper-header h1 {
    font-size: 2.5rem;
    color: var(--text-main);
    line-height: 1.2;
    margin-bottom: 1.5rem;
    font-weight: 800;
  }

  .doc-attribution {
    display: flex;
    gap: 3rem;
  }

  .attr-item {
    display: flex;
    flex-direction: column;
  }

  .attr-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .attr-value {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-main);
  }

  /* Markdown Content Styling */
  .doc-body {
    font-family: 'Merriweather', 'Georgia', serif; /* Serif for readability */
    font-size: 1.125rem;
    line-height: 1.8;
    color: #334155;
    max-width: 65ch; /* Optimal reading measure */
  }

  .doc-body :global(h2) {
    font-family: 'Inter', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  .doc-body :global(h3) {
    font-family: 'Inter', sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    color: #1e293b;
    margin-top: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .doc-body :global(p) {
    margin-bottom: 1.5rem;
  }

  .doc-body :global(blockquote) {
    border-left: 4px solid var(--color-accent);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #475569;
    background: #fffbeb;
    padding: 1.5rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .doc-body :global(ul) {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    list-style-type: disc; /* Force bullets back */
  }


  .doc-body :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    list-style-type: decimal; /* Force numbers back */
  }

  .doc-body :global(li) {
    margin-bottom: 0.5rem;
    padding-left: 0.5rem; /* Add space between bullet and text */
  }

  /* Style nested lists */
  .doc-body :global(ul ul) {
    list-style-type: circle;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .doc-body :global(ol ol) {
    list-style-type: lower-alpha;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Make the bullets Gold to match your theme */
  .doc-body :global(li::marker) {
    color: var(--color-accent);
    font-weight: bold;
  }

  .doc-body :global(strong) {
    color: #0f172a;
    font-weight: 700;
  }

  /* Document Footer Nav */
  .doc-paper-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
  }

  .doc-nav-buttons {
    display: flex;
    justify-content: space-between;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background: #eff6ff;
  }

  /* --- Overview Dashboard State --- */
  .overview-dashboard {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .overview-intro h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-main);
  }

  .overview-intro .lead {
    font-size: 1.25rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .methodology-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .method-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-border);
    text-align: center;
  }

  .method-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .method-card h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .method-card p {
    font-size: 0.9rem;
    color: var(--text-muted);
  }

  .phases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .phase-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .phase-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .phase-badge {
    background: #e0e7ff;
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    text-transform: uppercase;
  }

  .phase-card p {
    font-size: 0.95rem;
    color: var(--text-muted);
    flex-grow: 1;
    margin-bottom: 1.5rem;
  }

  .phase-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
  }

  .doc-count {
    font-size: 0.85rem;
    color: #94a3b8;
    font-weight: 600;
  }

  .text-link {
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .start-cta {
    margin-top: 2rem;
  }

  .cta-box {
    background: var(--bg-header);
    color: white;
    padding: 3rem;
    border-radius: 1rem;
    text-align: center;
    background-image: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
  }

  .cta-box h3 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .cta-box p {
    font-size: 1.2rem;
    color: #cbd5e1;
    margin-bottom: 2rem;
  }

  .primary-btn {
    background: var(--color-accent);
    color: white;
    font-weight: 700;
    text-decoration: none;
    padding: 1rem 2.5rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    transition: transform 0.2s;
    display: inline-block;
  }

  .primary-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  /* --- Responsive --- */
  @media (max-width: 900px) {
    .package-layout {
      grid-template-columns: 1fr;
      padding: 2rem 1rem;
    }

    .package-sidebar {
      position: relative;
      top: 0;
      max-height: none;
      margin-bottom: 2rem;
    }

    .document-paper {
      padding: 2rem;
    }
  }
</style>
