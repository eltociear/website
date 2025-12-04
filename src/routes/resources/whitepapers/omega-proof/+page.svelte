<script>
  import { page } from '$app/stores';
  import { locale, t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  
  export let data;
  
  // Destructure with fallbacks
  const { paper, currentUrl, currentLocale } = data;
  const { meta, slug } = paper;
  
  let activeSection = 'overview';
  let showResearchPackage = false;

  // Section metadata
  const sections = [
    { id: 'introduction', number: 1, titleKey: 'omega.sections.introduction' },
    { id: 'apparatus', number: 2, titleKey: 'omega.sections.apparatus' },
    { id: 'data', number: 3, titleKey: 'omega.sections.data' },
    { id: 'diagnosis', number: 4, titleKey: 'omega.sections.diagnosis' },
    { id: 'prescription', number: 5, titleKey: 'omega.sections.prescription' },
    { id: 'trajectory', number: 6, titleKey: 'omega.sections.trajectory' },
    { id: 'conclusion', number: 7, titleKey: 'omega.sections.conclusion' }
  ];

  // Research package phases
  const researchPhases = [
    {
      phase: 1,
      title: 'Initial Concept Development',
      docs: ['00', '01', '02', '03'],
      description: 'From idealistic vision to pragmatic realpolitik framework'
    },
    {
      phase: 2,
      title: 'First Red Team Challenge',
      docs: ['04', '05', '06'],
      description: 'Steel-manning the opposition—designing the attack'
    },
    {
      phase: 3,
      title: 'Protocol Omega Development',
      docs: ['07', '08', '09', '10'],
      description: 'Building the mechanically perfect peace machine'
    },
    {
      phase: 4,
      title: 'Final Protocol and Red Team',
      docs: ['11', '12', '13'],
      description: 'Bulletproof edition and unanimous rejection'
    }
  ];

  // Visual assets (Updated with the new Cost Curve visual)
  const visuals = [
    {
      id: 'terminal-bugs',
      title: 'Four Terminal Bugs',
      file: 'visual-four-terminal-bugs.svg',
      description: 'Cascade failure pattern in Westphalian architecture'
    },
    {
      id: 'cost-curve', // NEW VISUAL ADDED HERE
      title: 'The Systemic Exhaustion Cross-Over',
      file: 'visual-vertical-cost-curve.svg',
      description: 'The thermodynamic trap where maintenance costs exceed productive capacity'
    },
    {
      id: 'three-worlds',
      title: 'Three Possible Worlds',
      file: 'visual-three-worlds.svg',
      description: 'Probability-weighted futures with impact of preparation'
    },
    {
      id: 'preparedness',
      title: '2027 Preparedness Index',
      file: 'visual-preparedness-index.svg',
      description: 'Gap analysis showing 10x acceleration needed'
    }
  ];

  function scrollToSection(sectionId) {
    activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function downloadResearchPackage() {
    window.location.href = `${base}/resources/whitepapers/omega-proof/downloads/research-package.zip`;
  }
  
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { threshold: 0.5 }
    );
    
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>{meta.title} | Global Governance Frameworks</title>
  <meta name="description" content={meta.description} />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={currentUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
</svelte:head>

<div class="omega-theme">
  <header class="hero">
    <div class="container">
      <div class="death-certificate-badge">
        <span class="pulse"></span>
        <p class="epigraph">"This is not a warning. This is a death certificate."</p>
      </div>
      
      <h1 class="title">{meta.title}</h1>
      <p class="subtitle">{meta.subtitle}</p>
      
      <div class="meta-info">
        <span class="meta-item">{$t('omega.date')}: {meta.date}</span>
        <span class="separator">|</span>
        <span class="meta-item">{$t('omega.authors')}: Björn Kenneth Holmström + AI</span>
      </div>
      
      <div class="quick-links">
        <a href="#executive-summary" class="btn btn-primary">
          {$t('omega.readExecutiveSummary')}
        </a>
        <a href="{base}/resources/whitepapers/omega-proof/white-paper" class="btn btn-secondary">
          {$t('omega.readFullPaper')}
        </a>
        <a href="{base}/resources/whitepapers/omega-proof/downloads/omega-proof.pdf" class="btn btn-outline-light" download>
          <span>📥</span> PDF
        </a>
      </div>
    </div>
  </header>

  <section id="executive-summary" class="executive-summary">
    <div class="container">
      <div class="section-header">
        <h2>{$t('omega.executiveSummary')}</h2>
        <p class="section-subtitle">
          {$t('omega.executiveSummarySubtitle')}
        </p>
      </div>
      
      <div class="summary-content">
        <div class="summary-block experiment-block">
          <div class="block-header">
            <h3>{$t('omega.theExperiment')}</h3>
          </div>
          <div class="highlight-box experiment">
            <div class="exp-row">
              <span class="exp-label">{$t('omega.researchQuestion')}:</span>
              <p class="exp-text">{$t('omega.researchQuestionText')}</p>
            </div>
            <div class="exp-row">
              <span class="exp-label">{$t('omega.method')}:</span>
              <p class="exp-text">{$t('omega.methodText')}</p>
            </div>
            <div class="exp-row result-row">
              <span class="exp-label">{$t('omega.result')}:</span>
              <p class="exp-text result-text">{$t('omega.resultText')}</p>
            </div>
            <div class="exp-row conclusion-row">
              <span class="exp-label">{$t('omega.conclusion')}:</span>
              <p class="exp-text conclusion-text">{$t('omega.conclusionText')}</p>
            </div>
          </div>
        </div>
        
        <div class="summary-block">
          <h3>{$t('omega.fourTerminalBugs')}</h3>
          <div class="bugs-grid">
            <div class="bug-card bug-1">
              <div class="bug-header">
                <span class="bug-number">01</span>
                <h4>{$t('omega.bug1Title')}</h4>
              </div>
              <p class="bug-desc">{$t('omega.bug1Description')}</p>
              <div class="rejection-box">
                <span class="rejection-label">Kyiv:</span>
                <p>"{$t('omega.kyivRejection')}"</p>
              </div>
            </div>
            
            <div class="bug-card bug-2">
              <div class="bug-header">
                <span class="bug-number">02</span>
                <h4>{$t('omega.bug2Title')}</h4>
              </div>
              <p class="bug-desc">{$t('omega.bug2Description')}</p>
              <div class="rejection-box">
                <span class="rejection-label">Moscow:</span>
                <p>"{$t('omega.moscowRejection')}"</p>
              </div>
            </div>
            
            <div class="bug-card bug-3">
              <div class="bug-header">
                <span class="bug-number">03</span>
                <h4>{$t('omega.bug3Title')}</h4>
              </div>
              <p class="bug-desc">{$t('omega.bug3Description')}</p>
              <div class="rejection-box">
                <span class="rejection-label">Washington:</span>
                <p>"{$t('omega.washingtonRejection')}"</p>
              </div>
            </div>
            
            <div class="bug-card bug-4">
              <div class="bug-header">
                <span class="bug-number">04</span>
                <h4>{$t('omega.bug4Title')}</h4>
              </div>
              <p class="bug-desc">{$t('omega.bug4Description')}</p>
              <div class="rejection-box">
                <span class="rejection-label">Beijing:</span>
                <p>"{$t('omega.beijingRejection')}"</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="summary-block">
          <h3>{$t('omega.theTimeline')}</h3>
          <div class="timeline-box">
            <p class="timeline-intro">{$t('omega.timelineIntro')}</p>
            <div class="timeline-grid">
              <div class="timeline-item">
                <span class="timeline-icon">📉</span>
                <strong>{$t('omega.demographicExhaustion')}</strong>
                <span>{$t('omega.demographicText')}</span>
              </div>
              <div class="timeline-item">
                <span class="timeline-icon">💸</span>
                <strong>{$t('omega.financialExhaustion')}</strong>
                <span>{$t('omega.financialText')}</span>
              </div>
              <div class="timeline-item">
                <span class="timeline-icon">🌍</span>
                <strong>{$t('omega.ecologicalExhaustion')}</strong>
                <span>{$t('omega.ecologicalText')}</span>
              </div>
            </div>
            <div class="probability-footer">
              <div class="prob-item">
                <span class="prob-label">{$t('omega.voluntaryTransition')}</span>
                <span class="prob-value low">&lt;15%</span>
              </div>
              <div class="prob-item">
                <span class="prob-label">{$t('omega.crisisDriven')}</span>
                <span class="prob-value high">&gt;60%</span>
              </div>
            </div>
            <div class="window-alert">
              <strong>{$t('omega.windowRemaining')}:</strong> {$t('omega.windowText')}
            </div>
          </div>
        </div>
        
        <div class="summary-block">
          <h3>{$t('omega.threePossibleWorlds')}</h3>
          <div class="worlds-grid">
            <div class="world-card world-1">
              <div class="world-header">
                <span class="world-title">World 1</span>
                <span class="probability high">70-80%</span>
              </div>
              <h4>{$t('omega.world1Title')}</h4>
              <p>{$t('omega.world1Description')}</p>
            </div>
            
            <div class="world-card world-2">
              <div class="world-header">
                <span class="world-title">World 2</span>
                <span class="probability medium">15-25%</span>
              </div>
              <h4>{$t('omega.world2Title')}</h4>
              <p>{$t('omega.world2Description')}</p>
            </div>
            
            <div class="world-card world-3">
              <div class="world-header">
                <span class="world-title">World 3</span>
                <span class="probability low">&lt;5%</span>
              </div>
              <h4>{$t('omega.world3Title')}</h4>
              <p>{$t('omega.world3Description')}</p>
            </div>
          </div>
          
          <div class="impact-box">
            <p class="impact-statement">
              {$t('omega.impactStatement')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="visual-assets-section">
    <div class="container">
      <h2>Visual Intelligence</h2>
      <p class="section-desc">Key architectural diagrams from the simulation.</p>
      <div class="visuals-grid">
        {#each visuals as visual}
          <a href="{base}/resources/whitepapers/omega-proof/visuals#{visual.id}" class="visual-card">
            <div class="visual-preview">
              <img src="{base}/images/omega-proof/{visual.file}" alt={visual.title} />
            </div>
            <div class="visual-info">
              <h3>{visual.title}</h3>
              <span class="view-link">View Diagram →</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <section class="paper-navigation">
    <div class="container">
      <h2>{$t('omega.fullPaperSections')}</h2>
      <div class="sections-list">
        {#each sections as section}
          <a href="{base}/resources/whitepapers/omega-proof/white-paper#{section.id}" class="section-link">
            <span class="section-num">0{section.number}</span>
            <span class="section-name">{$t(section.titleKey)}</span>
            <span class="section-arrow">→</span>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <section class="research-package">
    <div class="container">
      <div class="package-header">
        <div>
          <h2>{$t('omega.researchPackage')}</h2>
          <p>{$t('omega.researchPackageSubtitle')}</p>
        </div>
        <div class="package-controls">
          <button on:click={() => showResearchPackage = !showResearchPackage} class="btn btn-outline">
            {showResearchPackage ? $t('omega.hideDocuments') : $t('omega.browseDocuments')}
          </button>
          <button on:click={downloadResearchPackage} class="btn btn-accent">
            {$t('omega.downloadZip')}
          </button>
        </div>
      </div>
      
      {#if showResearchPackage}
        <div class="research-grid">
          {#each researchPhases as phase}
            <div class="phase-column">
              <div class="phase-title">
                <span class="phase-badge">Phase {phase.phase}</span>
                <h4>{phase.title}</h4>
              </div>
              <div class="docs-list">
                {#each phase.docs as docNum}
                  <a href="{base}/resources/whitepapers/omega-proof/research-package/{docNum}" class="doc-item">
                    <span class="doc-icon">📄</span>
                    <span class="doc-name">{$t(`omega.researchDoc${docNum}`)}</span>
                  </a>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2>{$t('omega.ctaTitle')}</h2>
        <p class="cta-text">{$t('omega.ctaText')}</p>
        
        <div class="cta-buttons">
          <a href="{base}/resources/whitepapers/omega-proof/white-paper" class="btn btn-primary-large">
            {$t('omega.readFullPaper')}
          </a>
          <a href="{base}/resources/whitepapers/omega-proof/downloads/omega-proof.pdf" class="btn btn-secondary-large" download>
            <span>📥</span> Download PDF
          </a>
          <a href="{base}/get-involved?source=salvage" class="btn btn-secondary-large">
            {$t('omega.joinSalvage')}
          </a>
        </div>
        
        <p class="cta-footer">
          <em>{$t('omega.ctaFooter')}</em>
        </p>
      </div>
    </div>
  </section>
</div>

<style>
  /* --- Design Variables --- */
  .omega-theme {
    --bg-dark: #0f172a;
    --bg-header: #1e1b4b; /* Deep Navy */
    --color-accent: #d97706; /* Amber/Gold */
    --color-accent-light: #fbbf24;
    --color-text-main: #1e293b;
    --color-text-light: #64748b;
    --font-ui: 'Inter', sans-serif;
    --font-serif: 'Merriweather', serif;
    
    font-family: var(--font-ui);
    color: var(--color-text-main);
    background-color: #f8fafc;
  }

  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* --- Hero Section --- */
  .hero {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #1e40af 100%);
    color: white;
    padding: 5rem 0 7rem 0;
    text-align: center;
    position: relative;
    clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
  }

  .death-certificate-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(220, 38, 38, 0.2);
    border: 1px solid rgba(220, 38, 38, 0.5);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    margin-bottom: 2rem;
  }

  .pulse {
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  .epigraph {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 0.95rem;
    color: #fca5a5;
    margin: 0;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .subtitle {
    font-size: 1.5rem;
    color: #cbd5e1;
    max-width: 800px;
    margin: 0 auto 2.5rem auto;
    font-weight: 300;
  }

  .meta-info {
    display: flex;
    justify-content: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: #94a3b8;
    margin-bottom: 3rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .quick-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  /* --- Buttons --- */
  .btn {
    padding: 0.85rem 1.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    font-size: 1rem;
    border: none;
    cursor: pointer;
  }

  .btn-primary {
    background: var(--color-accent);
    color: white;
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); background: #b45309; }

  .btn-secondary {
    background: rgba(255,255,255,0.1);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.2); }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--color-accent);
    color: var(--color-accent);
  }
  .btn-outline:hover { background: #fffbeb; }

  .btn-outline-light {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.4);
    color: white;
  }
  .btn-outline-light:hover {
    background: rgba(255,255,255,0.1);
    border-color: white;
  }

  /* Add styles for Tertiary Large button (if not already present) */
  .btn-tertiary-large {
    padding: 1.25rem 2.5rem;
    font-size: 1.2rem;
    border-radius: 0.75rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    background: transparent;
    color: #94a3b8;
    border: 2px solid #334155;
  }
  .btn-tertiary-large:hover {
    color: white;
    border-color: white;
  }

  .btn-accent {
    background: var(--color-accent);
    color: white;
  }
  .btn-accent:hover { background: #b45309; }

  .btn-primary-large, .btn-secondary-large {
    padding: 1.25rem 2.5rem;
    font-size: 1.2rem;
    border-radius: 0.75rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-primary-large { background: white; color: var(--bg-header); }
  .btn-primary-large:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
  
  .btn-secondary-large { border: 2px solid rgba(255,255,255,0.3); color: white; }
  .btn-secondary-large:hover { background: rgba(255,255,255,0.1); }

  /* --- Executive Summary --- */
  .executive-summary {
    padding: 4rem 0;
    margin-top: -3rem; /* Overlap hero */
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  .section-header h2 { font-size: 2.5rem; font-weight: 800; color: #1e293b; }
  .section-subtitle { font-size: 1.2rem; color: #64748b; }

  .summary-block {
    margin-bottom: 4rem;
  }
  .summary-block h3 {
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }

  /* Experiment Block */
  .highlight-box {
    background: white;
    border-left: 5px solid var(--color-accent);
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }
  .exp-row { margin-bottom: 1.25rem; display: flex; gap: 1rem; }
  .exp-label { font-weight: 700; min-width: 140px; color: #475569; }
  .exp-text { margin: 0; line-height: 1.6; color: #1e293b; }
  .result-text { color: #dc2626; font-weight: 600; }
  .conclusion-text { font-weight: 700; font-size: 1.1rem; }

  /* Bugs Grid */
  .bugs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  .bug-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s;
  }
  .bug-card:hover { transform: translateY(-3px); border-color: var(--color-accent); }
  
  .bug-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .bug-number { 
    background: #f1f5f9; color: var(--bg-header); font-weight: 800; 
    padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.8rem;
  }
  .bug-card h4 { margin: 0; font-size: 1.1rem; color: #1e293b; }
  .bug-desc { font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; line-height: 1.5; }
  .rejection-box { 
    background: #fef2f2; border-left: 3px solid #ef4444; 
    padding: 0.75rem; font-size: 0.85rem; border-radius: 0 0.5rem 0.5rem 0;
  }
  .rejection-label { color: #ef4444; font-weight: 700; display: block; margin-bottom: 0.25rem; }
  .rejection-box p { margin: 0; font-style: italic; color: #7f1d1d; }

  /* Timeline */
  .timeline-box {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
  }
  .timeline-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }
  .timeline-item { display: flex; flex-direction: column; gap: 0.5rem; }
  .timeline-icon { font-size: 2rem; margin-bottom: 0.5rem; }
  .probability-footer {
    display: flex; gap: 3rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9;
  }
  .prob-item { display: flex; flex-direction: column; }
  .prob-label { font-size: 0.8rem; text-transform: uppercase; color: #94a3b8; }
  .prob-value { font-size: 1.5rem; font-weight: 800; }
  .prob-value.low { color: #ef4444; }
  .prob-value.high { color: #d97706; }
  .window-alert {
    margin-top: 1.5rem; background: #fff7ed; color: #9a3412; 
    padding: 1rem; border-radius: 0.5rem; text-align: center;
  }

  /* Three Worlds */
  .worlds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .world-card {
    padding: 2rem;
    border-radius: 1rem;
    color: white;
  }
  .world-1 { background: linear-gradient(145deg, #7f1d1d, #450a0a); }
  .world-2 { background: linear-gradient(145deg, #1e3a8a, #172554); border: 2px solid var(--color-accent); }
  .world-3 { background: linear-gradient(145deg, #14532d, #052e16); opacity: 0.7; }
  
  .world-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
  .world-title { text-transform: uppercase; font-weight: 700; font-size: 0.85rem; opacity: 0.8; }
  .probability { font-weight: 800; }
  .world-card h4 { font-size: 1.5rem; margin: 0 0 0.5rem 0; }
  .world-card p { opacity: 0.9; line-height: 1.5; margin: 0; }
  
  .impact-box {
    background: var(--color-accent);
    color: white;
    text-align: center;
    padding: 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1.1rem;
  }

  /* --- Visual Assets --- */
  .visual-assets-section {
    background: #fff;
    padding: 4rem 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
  }
  .section-desc { color: #64748b; margin-bottom: 2rem; }
  .visuals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  .visual-card { text-decoration: none; color: inherit; }
  .visual-preview {
    background: #0f172a;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
  }
  .visual-preview img { width: 100%; height: auto; display: block; }
  .visual-card:hover .visual-preview { transform: translateY(-5px); border-color: var(--color-accent); }
  .visual-info h3 { font-size: 1.1rem; margin: 0 0 0.25rem 0; color: #1e293b; }
  .view-link { font-size: 0.85rem; color: var(--color-accent); font-weight: 600; }

  /* --- Paper Nav --- */
  .paper-navigation { padding: 4rem 0; background: #f8fafc; }
  .sections-list {
    display: flex; flex-direction: column; gap: 0.5rem; max-width: 800px;
  }
  .section-link {
    display: flex; align-items: center; gap: 1rem;
    background: white; padding: 1rem 1.5rem; border-radius: 0.5rem;
    text-decoration: none; color: #1e293b; border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }
  .section-link:hover { border-color: var(--color-accent); transform: translateX(5px); }
  .section-num { font-family: monospace; color: #94a3b8; }
  .section-name { font-weight: 600; flex-grow: 1; }
  .section-arrow { color: var(--color-accent); }

  /* --- Research Package --- */
  .research-package { padding: 4rem 0; background: white; }
  .package-header { 
    display: flex; justify-content: space-between; align-items: center; 
    margin-bottom: 3rem; flex-wrap: wrap; gap: 1.5rem;
  }
  .package-controls { display: flex; gap: 1rem; }
  
  .research-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  .phase-title { 
    display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; 
    padding-bottom: 0.5rem; border-bottom: 2px solid #f1f5f9;
  }
  .phase-badge { 
    font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700; 
  }
  .docs-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .doc-item {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem;
    text-decoration: none; color: #334155; font-size: 0.9rem;
    border-radius: 0.25rem; transition: background 0.1s;
  }
  .doc-item:hover { background: #f1f5f9; color: var(--color-accent); }

  /* --- CTA Section --- */
  .cta-section {
    padding: 6rem 0;
    background: var(--bg-header);
    color: white;
    text-align: center;
  }
  .cta-text { font-size: 1.5rem; margin-bottom: 3rem; color: #cbd5e1; }
  .cta-buttons { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .cta-footer { color: #94a3b8; font-family: var(--font-serif); }

  /* Responsive */
  @media (max-width: 768px) {
    .title { font-size: 2.5rem; }
    .package-header { flex-direction: column; text-align: center; }
    .hero { padding: 3rem 0 5rem 0; }
  }
</style>
