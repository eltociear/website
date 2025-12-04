<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { goto } from '$app/navigation';
  import Follow from '$lib/components/Follow.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data;
  
  // Get the current language from load data
  $: currentLang = data.currentLocale || 'en';

  // Reactive update when locale changes
  $: if (browser && $locale) {
    invalidateAll();
  }

  $: if (browser && $locale && $page.url.searchParams.get('lang') !== $locale) {
    const url = new URL($page.url);
    url.searchParams.set('lang', $locale);
    goto(url.toString(), { replaceState: true, noScroll: true });
  }
  
  // Helper function for translations
  function getWhitepaperTranslation(key, fallback) {
    if (browser) {
      return $t(`whitepapers.${key}`) || fallback;
    }
    return fallback;
  }

  // Helper to find the Omega Proof paper
  $: omegaPaper = data.papers.find(p => p.slug === 'omega-proof');
  $: standardPapers = data.papers.filter(p => p.slug !== 'omega-proof');

  function getStatusInfo(status) {
    const statusMap = {
      published: { color: '#16a34a', bgColor: '#dcfce7', icon: '✅', label: 'Published' },
      draft: { color: '#eab308', bgColor: '#fef3c7', icon: '📝', label: 'Draft' },
      review: { color: '#3b82f6', bgColor: '#dbeafe', icon: '👁️', label: 'In Review' },
      archived: { color: '#6b7280', bgColor: '#f3f4f6', icon: '📁', label: 'Archived' }
    };
    return statusMap[status] || statusMap.draft;
  }

  function getCategoryInfo(category) {
    const categoryMap = {
      methodology: { color: '#1E40AF', icon: '🔬' },
      governance: { color: '#2B4B8C', icon: '🏛️' },
      economics: { color: '#2D5F2D', icon: '💰' },
      technology: { color: '#7C2D12', icon: '⚙️' },
      philosophy: { color: '#6B5CA5', icon: '🤔' },
      policy: { color: '#DC2626', icon: '📋' }
    };
    return categoryMap[category] || { color: '#6b7280', icon: '📄' };
  }
  
  function scrollToFollow() {
    const followSection = document.getElementById('follow-section');
    if (followSection) {
      followSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

<svelte:head>
  <title>{getWhitepaperTranslation('title', 'White Papers')} - Global Governance Framework</title>
  <meta name="description" content="Explore our collection of research white papers on global governance, regenerative systems, and planetary solutions." />
  <meta property="og:title" content="{getWhitepaperTranslation('title', 'White Papers')} - Global Governance Framework" />
  <meta property="og:description" content="Research publications exploring methodologies for addressing the global polycrisis." />
</svelte:head>

<div class="container">
  <nav class="breadcrumb">
    <a href="{base}/resources" class="breadcrumb-link">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      {getWhitepaperTranslation('breadcrumb.resources', 'Resources')}
    </a>
    <span class="breadcrumb-separator">→</span>
    <span class="breadcrumb-current">{getWhitepaperTranslation('breadcrumb.whitepapers', 'White Papers')}</span>
  </nav>

  <div class="whitepapers-header">
    <h1>{getWhitepaperTranslation('title', 'White Papers')}</h1>
    <p class="whitepapers-subtitle">
      {getWhitepaperTranslation('subtitle', 'Research publications exploring methodologies and frameworks for addressing complex systemic challenges')}
    </p>
  </div>
  
  {#if data.papers.length === 0}
    <div class="no-papers">
      <div class="no-papers-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3>{getWhitepaperTranslation('noPapers.title', 'No white papers found')}</h3>
      <p>
        {getWhitepaperTranslation('noPapers.message', `No white papers found for the selected language (${currentLang}). Try switching to a different language using the language selector in the header.`).replace('{language}', currentLang)}
      </p>
      <p class="follow-prompt">
        {getWhitepaperTranslation('noPapers.followPrompt', 'Follow us to get notified when we publish new research!')}
      </p>
    </div>
    <Follow />
    
  {:else}
     {#if omegaPaper}
      <div class="omega-hero-wrapper">
        <div class="omega-hero-card">
          <div class="omega-content">
            <div class="omega-badges">
              <span class="omega-badge featured">FEATURED RESEARCH</span>
              <span class="omega-badge status">Completed Jan 2026</span>
            </div>
            
            <h2>
              <a href="{base}/resources/whitepapers/omega-proof" style="color: inherit; text-decoration: none;">
                The Omega Proof
              </a>
            </h2>
            
            <p class="omega-subtitle">An Empirical Demonstration of the Nation-State System's Terminal Incompatibility with Planetary Peace</p>
            <p class="omega-desc">
              We used adversarial AI to simulate the four veto-players in the Ukraine war. They unanimously rejected a mathematically optimal peace deal. This is the autopsy of why peace is architecturally impossible under current rules.
            </p>
            
            <div class="omega-actions">
              <div class="button-row">
                <a href="{base}/resources/whitepapers/omega-proof" class="omega-btn">
                  Read the Analysis →
                </a>
                {#if omegaPaper.meta.pdfPath}
                  <a href="{omegaPaper.meta.pdfPath}" class="omega-btn secondary" download>
                    <span class="icon">📥</span> Download PDF
                  </a>
                {/if}
              </div>
              <span class="omega-meta">65 Pages • 13 Research Docs • 4 Terminal Bugs</span>
            </div>
          </div>
          
          <div class="omega-visual">
            <div class="visual-placeholder">Ω</div>
          </div>
        </div>
      </div>
    {/if}

    <div class="papers-section">
      <div class="papers-count">
        {standardPapers.length} {standardPapers.length === 1 ? getWhitepaperTranslation('papersCount.single', 'other paper') : getWhitepaperTranslation('papersCount.plural', 'other papers')} {getWhitepaperTranslation('papersCount.found', 'found')}
      </div>
      
      <div class="papers-list">
        {#each standardPapers as paper, index}
          <article class="paper-card">
            <div class="paper-header">
              <div class="paper-badges">
                {#if paper.meta.status}
                  {@const statusInfo = getStatusInfo(paper.meta.status)}
                  <div class="status-badge" style="color: {statusInfo.color}; background-color: {statusInfo.bgColor};">
                    <span class="badge-icon">{statusInfo.icon}</span>
                    <span class="badge-text">{getWhitepaperTranslation(`status.${paper.meta.status}`, statusInfo.label)}</span>
                  </div>
                {/if}
                {#if paper.meta.category}
                  {@const categoryInfo = getCategoryInfo(paper.meta.category)}
                  <div class="category-badge" style="background-color: {categoryInfo.color};">
                    <span class="badge-icon">{categoryInfo.icon}</span>
                    <span class="badge-text">{getWhitepaperTranslation(`categories.${paper.meta.category}`, paper.meta.category)}</span>
                  </div>
                {/if}
              </div>
            </div>

            <div class="paper-content">
              <h2 class="paper-title">
                <a href="{base}/resources/whitepapers/{paper.slug}?lang={currentLang}" class="title-link">
                  {paper.meta.title}
                </a>
              </h2>
              
              <p class="paper-meta">
                <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {new Date(paper.meta.date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <p class="paper-description">{paper.meta.description}</p>
              
              <div class="paper-actions">
                <a href="{base}/resources/whitepapers/{paper.slug}?lang={currentLang}" class="action-button primary">
                  <span class="button-icon">👁️</span>
                  {getWhitepaperTranslation('actions.readOnline', 'Read')}
                </a>
                {#if paper.meta.pdfPath}
                  <a href="{paper.meta.pdfPath}" class="action-button secondary" download>
                    <span class="button-icon">📥</span> PDF
                  </a>
                {/if}
              </div>
            </div>
          </article>
        {/each}
      </div>
      
      <div class="strategic-follow" id="follow-section">
        <div class="follow-intro">
          <h3>{getWhitepaperTranslation('strategicFollow.title', 'Interested in our research?')}</h3>
          <p>{getWhitepaperTranslation('strategicFollow.subtitle', 'Stay connected to receive updates on new white papers and research publications.')}</p>
        </div>
        <Follow />
      </div>
    </div>
  {/if}
</div>

<style>
  /* --- Omega Hero Styles --- */
  .omega-hero-wrapper {
    margin-bottom: 4rem;
  }

  .omega-hero-card {
    display: flex;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    border-radius: 1rem;
    overflow: hidden;
    text-decoration: none;
    color: white;
    box-shadow: 0 20px 40px -10px rgba(30, 27, 75, 0.4);
    transition: transform 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .omega-hero-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px -12px rgba(30, 27, 75, 0.5);
  }

  .omega-content {
    flex: 2;
    padding: 3rem;
  }

  .omega-visual {
    flex: 1;
    background: rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid rgba(255,255,255,0.1);
  }

  .visual-placeholder {
    font-size: 8rem;
    font-weight: 800;
    color: rgba(255,255,255,0.1);
    font-family: serif;
  }

  .omega-badges {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .omega-badge {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
  }

  .omega-badge.featured {
    background: #d97706; /* Gold */
    color: white;
  }

  .omega-badge.status {
    background: rgba(255,255,255,0.1);
    color: #cbd5e1;
  }

  .omega-hero-card h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(to right, #fff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .omega-subtitle {
    font-size: 1.1rem;
    color: #94a3b8;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .omega-desc {
    font-size: 1rem;
    line-height: 1.6;
    color: #cbd5e1;
    margin-bottom: 2rem;
    max-width: 600px;
  }

  .omega-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Add this new class */
  .button-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Update .omega-btn and add .secondary variant */
  .omega-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    color: #1e1b4b;
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    width: fit-content;
    text-decoration: none;
    transition: all 0.2s;
  }

  .omega-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .omega-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
  }

  .omega-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: white;
  }

  .omega-meta {
    font-size: 0.85rem;
    color: #94a3b8;
    font-family: monospace;
  }

  /* --- Responsive --- */
  @media (max-width: 768px) {
    .omega-hero-card {
      flex-direction: column;
    }
    .omega-visual {
      display: none;
    }
    .omega-content {
      padding: 2rem;
    }
    .omega-hero-card h2 {
      font-size: 2rem;
    }
  }

  /* --- Rest of Existing Styles --- */
  .container {
    max-width: 1000px;
    margin: 2rem auto 4rem;
    padding: 0 20px;
  }

  /* Breadcrumb */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
  }

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6B7280;
    text-decoration: none;
    transition: color 0.2s;
  }

  .breadcrumb-link:hover {
    color: #2B4B8C;
  }

  .breadcrumb-link svg {
    width: 1rem;
    height: 1rem;
  }

  .breadcrumb-separator {
    color: #9CA3AF;
  }

  .breadcrumb-current {
    color: #2B4B8C;
    font-weight: 500;
  }
  
  /* Header */
  .whitepapers-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .whitepapers-header h1 {
    font-size: 2.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .whitepapers-subtitle {
    font-size: 1.125rem;
    color: #6B7280;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
  
  /* No Papers State */
  .no-papers {
    text-align: center;
    padding: 3rem 2rem;
    background-color: #f9fafb;
    border-radius: 0.75rem;
    margin: 2rem 0;
    border: 2px dashed #d1d5db;
  }
  
  .no-papers-icon {
    width: 4rem;
    height: 4rem;
    color: #9CA3AF;
    margin: 0 auto 1rem;
  }
  
  .no-papers h3 {
    font-size: 1.5rem;
    color: #374151;
    margin-bottom: 1rem;
  }
  
  .no-papers p {
    color: #6b7280;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .follow-prompt {
    font-weight: 500;
    color: #2B4B8C !important;
    margin-top: 1rem !important;
  }
  
  /* Papers List */
  .papers-count {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .papers-list {
    display: grid;
    gap: 1.5rem;
  }
  
  /* Paper Cards */
  .paper-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.2s ease-in-out;
  }
  
  .paper-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }

  .paper-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .status-badge,
  .category-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .category-badge {
    color: white;
  }

  .paper-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .title-link {
    font-weight: 700;
    color: #1e293b;
    text-decoration: none;
    line-height: 1.3;
    transition: color 0.2s;
  }

  .title-link:hover {
    color: #1E40AF;
  }
  
  .paper-meta {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-icon {
    width: 1rem;
    height: 1rem;
  }
  
  .paper-description {
    color: #475569;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .paper-actions {
    display: flex;
    gap: 0.75rem;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }

  .action-button.primary {
    background: white;
    color: #1E40AF;
    border: 1px solid #1E40AF;
  }

  .action-button.primary:hover {
    background: #eff6ff;
  }

  .action-button.secondary {
    background: white;
    color: #475569;
    border: 1px solid #d1d5db;
  }

  .action-button.secondary:hover {
    background: #f8fafc;
    border-color: #9ca3af;
  }

  .strategic-follow {
    margin: 4rem 0;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .follow-intro {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .follow-intro h3 {
    font-size: 1.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .follow-intro p {
    color: #6B7280;
    font-size: 1rem;
  }
  
  /* Bottom Prompt */
  .bottom-prompt {
    margin-top: 3rem;
    padding: 1rem 0;
    border-top: 1px solid #e5e7eb;
  }
  
  .prompt-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .prompt-text {
    color: #6B7280;
    font-size: 0.875rem;
  }
  
  .prompt-link {
    background: none;
    border: none;
    color: #2B4B8C;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.2s;
  }
  
  .prompt-link:hover {
    color: #1E40AF;
  }
</style>
