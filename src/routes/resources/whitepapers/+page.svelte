<!-- src/routes/resources/whitepapers/+page.svelte -->
<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import Follow from '$lib/components/Follow.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data; // SvelteKit provides data from +page.js
  
  // Get the current language from load data
  $: currentLang = data.currentLocale || 'en';
  
  // Helper function for translations with fallbacks
  function getWhitepaperTranslation(key, fallback) {
    if (browser) {
      return $t(`whitepapers.${key}`) || fallback;
    }
    return fallback;
  }

  // Get status color and icon
  function getStatusInfo(status) {
    const statusMap = {
      published: { color: '#16a34a', bgColor: '#dcfce7', icon: '✅', label: 'Published' },
      draft: { color: '#eab308', bgColor: '#fef3c7', icon: '📝', label: 'Draft' },
      review: { color: '#3b82f6', bgColor: '#dbeafe', icon: '👁️', label: 'In Review' },
      archived: { color: '#6b7280', bgColor: '#f3f4f6', icon: '📁', label: 'Archived' }
    };
    return statusMap[status] || statusMap.draft;
  }

  // Get category color and icon
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
  
  // Scroll to follow section
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
  <!-- Breadcrumb -->
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
    <!-- No Papers State: Include full Follow component here since it's the primary action -->
    <div class="no-papers">
      <div class="no-papers-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3>
        {getWhitepaperTranslation('noPapers.title', 'No white papers found')}
      </h3>
      <p>
        {getWhitepaperTranslation('noPapers.message', `No white papers found for the selected language (${currentLang}). Try switching to a different language using the language selector in the header.`).replace('{language}', currentLang)}
      </p>
      <p class="follow-prompt">
        {getWhitepaperTranslation('noPapers.followPrompt', 'Follow us to get notified when we publish new research!')}
      </p>
    </div>
    
    <!-- Follow component for no-papers state -->
    <Follow />
    
  {:else}
    <!-- Papers exist: Show strategic Follow placement -->
    <div class="papers-section">
      <div class="papers-count">
        {data.papers.length} {data.papers.length === 1 ? getWhitepaperTranslation('papersCount.single', 'paper') : getWhitepaperTranslation('papersCount.plural', 'papers')} {getWhitepaperTranslation('papersCount.found', 'found')}
      </div>
      
      <div class="papers-list">
        {#each data.papers as paper, index}
          <article class="paper-card" class:featured={index === 0 && paper.meta.status === 'published'}>
            <div class="paper-header">
              <div class="paper-badges">
                <!-- Status Badge -->
                {#if paper.meta.status}
                  {@const statusInfo = getStatusInfo(paper.meta.status)}
                  <div 
                    class="status-badge"
                    style="color: {statusInfo.color}; background-color: {statusInfo.bgColor};"
                  >
                    <span class="badge-icon">{statusInfo.icon}</span>
                    <span class="badge-text">{getWhitepaperTranslation(`status.${paper.meta.status}`, statusInfo.label)}</span>
                  </div>
                {/if}

                <!-- Category Badge -->
                {#if paper.meta.category}
                  {@const categoryInfo = getCategoryInfo(paper.meta.category)}
                  <div 
                    class="category-badge"
                    style="background-color: {categoryInfo.color};"
                  >
                    <span class="badge-icon">{categoryInfo.icon}</span>
                    <span class="badge-text">{getWhitepaperTranslation(`categories.${paper.meta.category}`, paper.meta.category)}</span>
                  </div>
                {/if}

                <!-- Featured Badge -->
                {#if index === 0 && paper.meta.status === 'published'}
                  <div class="featured-badge">
                    <span class="badge-icon">⭐</span>
                    <span class="badge-text">{getWhitepaperTranslation('latestBadge', 'Latest')}</span>
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
                {getWhitepaperTranslation('meta.publishedOn', 'Published on')} {new Date(paper.meta.date).toLocaleDateString(currentLang === 'sv' ? 'sv-SE' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} {getWhitepaperTranslation('meta.by', 'by')} {paper.meta.author}
              </p>
              
              <p class="paper-description">{paper.meta.description}</p>
              
              <!-- Paper Metadata -->
              <div class="paper-metadata">
                {#if paper.meta.pages}
                  <div class="meta-item">
                    <span class="meta-label">📄</span>
                    <span class="meta-value">{paper.meta.pages} {getWhitepaperTranslation('meta.pages', 'pages')}</span>
                  </div>
                {/if}
                {#if paper.meta.readTime}
                  <div class="meta-item">
                    <span class="meta-label">⏱️</span>
                    <span class="meta-value">{paper.meta.readTime} {getWhitepaperTranslation('meta.readTime', 'min read')}</span>
                  </div>
                {/if}
                {#if paper.meta.version}
                  <div class="meta-item">
                    <span class="meta-label">📝</span>
                    <span class="meta-value">v{paper.meta.version}</span>
                  </div>
                {/if}
              </div>

              {#if paper.meta.tags && paper.meta.tags.length > 0}
                <div class="paper-tags">
                  {#each paper.meta.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
              
              <div class="paper-actions">
                <a 
                  href="{base}/resources/whitepapers/{paper.slug}?lang={currentLang}"
                  class="action-button primary"
                >
                  <span class="button-icon">👁️</span>
                  {getWhitepaperTranslation('actions.readOnline', 'Read Online')}
                </a>

                {#if paper.meta.pdfPath}
                  <a 
                    href="{paper.meta.pdfPath}"
                    class="action-button secondary"
                    download
                  >
                    <span class="button-icon">📥</span>
                    {getWhitepaperTranslation('actions.downloadPdf', 'Download PDF')}
                  </a>
                {/if}

                <!-- Future: Citation button -->
                <!--
                <button class="action-button tertiary">
                  <span class="button-icon">📝</span>
                  {getWhitepaperTranslation('actions.cite', 'Cite')}
                </button>
                -->
              </div>
            </div>
          </article>

          <!-- Strategic Follow placement: After first few papers (when user has seen value) -->
          {#if index === Math.min(2, data.papers.length - 1) && data.papers.length > 1}
            <div class="strategic-follow" id="follow-section">
              <div class="follow-intro">
                <h3>{getWhitepaperTranslation('strategicFollow.title', 'Interested in our research?')}</h3>
                <p>{getWhitepaperTranslation('strategicFollow.subtitle', 'Stay connected to receive updates on new white papers and research publications.')}</p>
              </div>
              <Follow />
            </div>
          {/if}
        {/each}
      </div>
      
      <!-- If only one paper, place Follow component after the single paper -->
      {#if data.papers.length === 1}
        <div class="strategic-follow" id="follow-section">
          <div class="follow-intro">
            <h3>{getWhitepaperTranslation('strategicFollow.title', 'Interested in our research?')}</h3>
            <p>{getWhitepaperTranslation('strategicFollow.subtitle', 'Stay connected to receive updates on new white papers and research publications.')}</p>
          </div>
          <Follow />
        </div>
      {/if}
    </div>
    
    <!-- Lightweight bottom prompt: Points to the main Follow section -->
    <div class="bottom-prompt">
      <div class="prompt-content">
        <span class="prompt-text">
          {getWhitepaperTranslation('bottomPrompt.text', 'Want research updates?')}
        </span>
        <button type="button" class="prompt-link" on:click={scrollToFollow}>
          {getWhitepaperTranslation('bottomPrompt.link', 'See all follow options →')}
        </button>
      </div>
    </div>
  {/if}
</div>

<ShareButtons 
  title="Global Governance Frameworks White Papers"
  hashtags="Research,GlobalGovernance,SystemsThinking"
  position="left"
/>

<style>
  .container {
    max-width: 900px;
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
    margin-bottom: 2rem;
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
  
  /* Papers Section */
  .papers-section {
    margin: 2rem 0;
  }
  
  .papers-count {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
  }
  
  .papers-list {
    display: grid;
    gap: 2rem;
  }
  
  /* Paper Cards */
  .paper-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    position: relative;
  }
  
  .paper-card:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    transform: translateY(-3px);
    border-color: #3b82f6;
  }
  
  .paper-card.featured {
    border: 2px solid #1E40AF;
    background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  }
  
  .paper-card.featured::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1E40AF, #3b82f6, #1E40AF);
  }

  /* Paper Header & Badges */
  .paper-header {
    padding: 1.5rem 1.5rem 0 1.5rem;
  }

  .paper-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .status-badge,
  .category-badge,
  .featured-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.625rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid currentColor;
  }

  .category-badge {
    color: white;
    border: none;
  }

  .featured-badge {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    color: #1e40af;
    border: none;
  }

  .badge-icon {
    font-size: 0.8rem;
  }

  .badge-text {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Paper Content */
  .paper-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  .paper-title {
    margin: 0 0 1rem 0;
  }

  .title-link {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    text-decoration: none;
    line-height: 1.3;
    display: block;
    transition: color 0.2s;
  }

  .title-link:hover {
    color: #1E40AF;
  }
  
  .paper-card.featured .title-link {
    font-size: 1.75rem;
    color: #1E40AF;
  }
  
  .paper-meta {
    font-size: 0.875rem;
    color: #6B7280;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .meta-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  .paper-description {
    color: #4B5563;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
  
  .paper-card.featured .paper-description {
    font-size: 1.1rem;
  }

  /* Paper Metadata */
  .paper-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .meta-label {
    font-size: 0.9rem;
  }

  .meta-value {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }
  
  /* Tags */
  .paper-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .tag {
    background: rgba(30, 64, 175, 0.1);
    color: #1E40AF;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* Action Buttons */
  .paper-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    min-width: 140px;
    justify-content: center;
  }

  .action-button.primary {
    background: linear-gradient(135deg, #1E40AF 0%, #3b82f6 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
  }

  .action-button.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(30, 64, 175, 0.3);
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  }

  .action-button.secondary {
    background: white;
    color: #475569;
    border: 1px solid #d1d5db;
  }

  .action-button.secondary:hover {
    background: #f8fafc;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  .action-button.tertiary {
    background: transparent;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }

  .action-button.tertiary:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }

  .button-icon {
    font-size: 1rem;
  }
  
  /* Strategic Follow Section */
  .strategic-follow {
    margin: 3rem 0;
    scroll-margin-top: 2rem;
  }
  
  .follow-intro {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .follow-intro h3 {
    font-size: 1.5rem;
    color: #2B4B8C;
    margin-bottom: 0.5rem;
  }
  
  .follow-intro p {
    color: #6B7280;
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
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
  
  /* Responsive design */
  @media (max-width: 768px) {
    .container {
      margin: 1rem auto 2rem;
      padding: 0 1rem;
    }
    
    .whitepapers-header h1 {
      font-size: 2rem;
    }
    
    .whitepapers-subtitle {
      font-size: 1rem;
    }
    
    .paper-content {
      padding: 0 1rem 1rem 1rem;
    }

    .paper-header {
      padding: 1rem 1rem 0 1rem;
    }
  }
</style>
