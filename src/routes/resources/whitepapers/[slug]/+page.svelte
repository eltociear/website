<!-- src/routes/resources/whitepapers/[slug]/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { t, locale } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import { invalidateAll } from '$app/navigation';
  import Follow from '$lib/components/Follow.svelte';
  import ShareButtons from '$lib/components/ShareButtons.svelte';
  
  export let data;
  
  let ContentComponent = null;
  let loading = true;
  let error = null;

  // Reactive data destructuring - this updates when data changes
  $: ({ paper, currentUrl, currentLocale } = data);

  // Reactive update when locale changes
  $: if (browser && $locale) {
    // When locale changes, invalidate and reload data
    invalidateAll();
  }

  // Reactive content loading - this runs whenever paper or currentLocale changes
  $: if (paper && currentLocale) {
    loadContent();
  }

  // Helper function for translations with fallbacks
  function getWhitepaperTranslation(key, fallback) {
    if (browser) {
      return $t(`whitepapers.${key}`) || fallback;
    }
    return fallback;
  }

  // Get status info for display
  function getStatusInfo(status) {
    const statusMap = {
      published: { color: '#16a34a', bgColor: '#dcfce7', icon: '✅', label: 'Published' },
      draft: { color: '#eab308', bgColor: '#fef3c7', icon: '📝', label: 'Draft' },
      review: { color: '#3b82f6', bgColor: '#dbeafe', icon: '👁️', label: 'In Review' },
      archived: { color: '#6b7280', bgColor: '#f3f4f6', icon: '📦', label: 'Archived' }
    };
    return statusMap[status] || statusMap.draft;
  }

  // Get category info for display
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

  // Generate hashtags for sharing
  $: shareHashtags = generateShareHashtags(paper.meta);

  function generateShareHashtags(metadata) {
    let hashtags = [];
    
    // Add custom hashtags from paper metadata if they exist
    if (metadata.hashtags && Array.isArray(metadata.hashtags)) {
      hashtags.push(...metadata.hashtags);
    }
    
    // Add tag-based hashtags if tags exist and no custom hashtags
    if (metadata.tags && Array.isArray(metadata.tags) && hashtags.length === 0) {
      // Convert tags to hashtags (remove spaces, capitalize)
      hashtags.push(...metadata.tags.map(tag => 
        tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
      ));
    }
    
    // Always include default hashtags based on category and type
    const defaultHashtags = ['Research', 'GlobalGovernance', 'SystemsThinking'];
    if (metadata.category) {
      defaultHashtags.push(metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1));
    }
    
    // Merge custom hashtags with defaults, avoiding duplicates
    const allHashtags = [...new Set([...hashtags, ...defaultHashtags])];
    
    // Limit to reasonable number for sharing (max 5-6)
    return allHashtags.slice(0, 6).join(',');
  }

  // Separate function to load content that can be called reactively
  async function loadContent() {
    if (!browser || !paper || !currentLocale) return;
    
    loading = true;
    error = null;
    ContentComponent = null;

    try {
      console.log('Loading paper content:', paper.slug, 'for locale:', currentLocale);
      
      // Dynamically import the MDSveX component
      const paperModule = await import(`../../../../lib/content/papers/${currentLocale}/${paper.slug}.md`);
      ContentComponent = paperModule.default;
      loading = false;
    } catch (e) {
      console.error('Error loading paper content:', e);
      console.error('Attempted path:', `../../../../lib/content/papers/${currentLocale}/${paper.slug}.md`);
      error = 'Failed to load paper content';
      loading = false;
    }
  }

  // Initial load on mount
  onMount(() => {
    if (paper && currentLocale) {
      loadContent();
    }
  });
</script>

<svelte:head>
  <title>{paper.meta.title} - Global Governance Framework</title>
  <meta name="description" content={paper.meta.description} />
  <meta property="og:title" content={paper.meta.title} />
  <meta property="og:description" content={paper.meta.description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={currentUrl} />
  
  <!-- Research paper specific meta tags -->
  <meta name="citation_title" content={paper.meta.title} />
  <meta name="citation_author" content={paper.meta.author} />
  <meta name="citation_publication_date" content={paper.meta.date} />
  {#if paper.meta.version}
    <meta name="citation_technical_report_number" content="v{paper.meta.version}" />
  {/if}
  
  <!-- Add this to handle external referrals better -->
  <meta name="robots" content="index, follow" />
  
  <!-- Canonical URL to prevent duplicate content issues -->
  <link rel="canonical" href={currentUrl} />
</svelte:head>

<div class="container paper-page">
  <article>
    <!-- Breadcrumb navigation -->
    <nav class="breadcrumb">
      <a href="{base}/resources" class="breadcrumb-link">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        {getWhitepaperTranslation('breadcrumb.resources', 'Resources')}
      </a>
      <span class="breadcrumb-separator">→</span>
      <a href="{base}/resources/whitepapers?lang={currentLocale}" class="breadcrumb-link">
        {getWhitepaperTranslation('breadcrumb.whitepapers', 'White Papers')}
      </a>
      <span class="breadcrumb-separator">→</span>
      <span class="breadcrumb-current">{paper.meta.title}</span>
    </nav>

    <!-- Paper Header -->
    <header class="paper-header">
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

        <!-- Version Badge -->
        {#if paper.meta.version}
          <div class="version-badge">
            <span class="badge-icon">📝</span>
            <span class="badge-text">v{paper.meta.version}</span>
          </div>
        {/if}
      </div>

      <h1>{paper.meta.title}</h1>
      
      <div class="paper-meta">
        <div class="meta-primary">
          <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {getWhitepaperTranslation('meta.publishedOn', 'Published on')} {new Date(paper.meta.date).toLocaleDateString(currentLocale === 'sv' ? 'sv-SE' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} {getWhitepaperTranslation('meta.by', 'by')} {paper.meta.author}
        </div>
        
        <div class="meta-secondary">
          {#if paper.meta.pages}
            <span class="meta-item">
              📄 {paper.meta.pages} {getWhitepaperTranslation('meta.pages', 'pages')}
            </span>
          {/if}
          {#if paper.meta.readTime}
            <span class="meta-item">
              ⏱️ {paper.meta.readTime} {getWhitepaperTranslation('meta.readTime', 'min read')}
            </span>
          {/if}
        </div>
      </div>

      <!-- Paper Description -->
      {#if paper.meta.description}
        <div class="paper-description">
          <p>{paper.meta.description}</p>
        </div>
      {/if}

      <!-- Tags -->
      {#if paper.meta.tags && paper.meta.tags.length > 0}
        <div class="paper-tags">
          {#each paper.meta.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}

      <!-- Action Buttons -->
      <div class="paper-actions">
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
          {getWhitepaperTranslation('actions.cite', 'Cite This Paper')}
        </button>
        -->
      </div>
    </header>

    <!-- Paper Content -->
    {#key currentLocale}
      <div class="paper-content">
        {#if loading}
          <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>{getWhitepaperTranslation('loading', 'Loading content...')}</p>
          </div>
        {:else if error}
          <div class="error-state">
            <p class="error">{error}</p>
            <p class="debug-info">
              Attempted to load: {paper.slug} in {currentLocale}
            </p>
          </div>
        {:else if ContentComponent}
          <svelte:component this={ContentComponent} />
        {:else}
          <p class="no-content">{getWhitepaperTranslation('noContent', 'No content available')}</p>
        {/if}
      </div>
    {/key}
  </article>

  <!-- Follow section after paper content -->
  {#if !loading && !error && ContentComponent}
    <div class="paper-follow-section">
      <div class="follow-intro">
        <h3>{getWhitepaperTranslation('paperFollow.title', 'Found this research valuable?')}</h3>
        <p>{getWhitepaperTranslation('paperFollow.subtitle', 'Stay connected for updates on new research publications and methodological developments.')}</p>
      </div>
      <Follow />
    </div>

    <!-- Paper navigation -->
    <div class="paper-navigation">
      <div class="nav-content">
        <div class="nav-item">
          <a href="{base}/resources/whitepapers?lang={currentLocale}" class="nav-link primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {getWhitepaperTranslation('navigation.moreResearch', 'More Research')}
          </a>
        </div>
        <div class="nav-item">
          <a href="{base}/resources" class="nav-link secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {getWhitepaperTranslation('navigation.allResources', 'All Resources')}
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- ShareButtons component with paper-specific hashtags -->
<ShareButtons 
  title={paper.meta.title}
  description={paper.meta.description}
  url={currentUrl}
  hashtags={shareHashtags}
  position="right"
/>

<style>
  /* Container and basic layout */
  .container {
    max-width: 800px;
    margin: 2rem auto 4rem;
    padding: 0 20px;
  }

  /* Breadcrumb navigation */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    display: inline-flex;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }

  /* Paper Header */
  .paper-header {
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 2rem;
    margin-bottom: 3rem;
  }

  .paper-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .status-badge,
  .category-badge,
  .version-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid currentColor;
  }

  .category-badge {
    color: white;
    border: none;
  }

  .version-badge {
    background: #f3f4f6;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }

  .badge-icon {
    font-size: 0.8rem;
  }

  .badge-text {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Article header */
  h1 {
    font-size: 2.8rem;
    color: #1E40AF;
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
  }

  .paper-meta {
    margin-bottom: 1.5rem;
  }

  .meta-primary {
    font-size: 1rem;
    color: #6B7280;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .meta-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .meta-secondary {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .meta-item {
    font-size: 0.875rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .paper-description {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border-left: 4px solid #1E40AF;
    margin-bottom: 1.5rem;
  }

  .paper-description p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #1e40af;
    margin: 0;
    font-weight: 500;
  }

  .paper-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .tag {
    background: rgba(30, 64, 175, 0.1);
    color: #1E40AF;
    padding: 0.3rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
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

  /* Loading and error states */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 0;
    color: #6B7280;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #1E40AF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-state {
    padding: 2rem 0;
  }

  .error {
    color: #dc2626;
    padding: 1rem;
    background-color: #fef2f2;
    border-radius: 0.5rem;
    border: 1px solid #fecaca;
    margin-bottom: 1rem;
  }

  .debug-info {
    color: #6b7280;
    font-size: 0.875rem;
    font-style: italic;
  }

  .no-content {
    text-align: center;
    color: #6B7280;
    padding: 2rem 0;
  }

  /* Paper content */
  .paper-content {
    margin-bottom: 3rem;
  }

  /* Follow section after paper */
  .paper-follow-section {
    margin: 4rem 0 3rem;
    padding-top: 2rem;
    border-top: 2px solid #f3f4f6;
  }

  .follow-intro {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .follow-intro h3 {
    font-size: 1.5rem;
    color: #1E40AF;
    margin-bottom: 0.5rem;
  }

  .follow-intro p {
    color: #6B7280;
    font-size: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Paper navigation */
  .paper-navigation {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .nav-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    justify-content: center;
  }

  .nav-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .nav-link.primary {
    background-color: #1E40AF;
    color: white;
  }

  .nav-link.primary:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
  }

  .nav-link.secondary {
    background-color: #f9fafb;
    color: #6B7280;
    border: 1px solid #e5e7eb;
  }

  .nav-link.secondary:hover {
    background-color: #f3f4f6;
    color: #1E40AF;
    transform: translateY(-1px);
  }

  /* Global styles for rendered markdown content - ONLY apply to .paper-content */
  .paper-content :global(h2) {
    font-size: 2rem;
    color: #1E40AF;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e0f2fe;
    padding-bottom: 0.5rem;
  }

  .paper-content :global(h3) {
    font-size: 1.6rem;
    color: #4B5563;
    margin-top: 2rem;
    margin-bottom: 0.8rem;
  }

  .paper-content :global(h4) {
    font-size: 1.3rem;
    color: #6B7280;
    margin-top: 1.5rem;
    margin-bottom: 0.6rem;
  }

  .paper-content :global(p) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .paper-content :global(ul),
  .paper-content :global(ol) {
    color: #4B5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    padding-left: 30px;
    list-style-position: outside;
  }

  .paper-content :global(ul) {
    list-style-type: disc;
  }

  .paper-content :global(ol) {
    list-style-type: decimal;
  }

  .paper-content :global(li) {
    margin-bottom: 0.5rem;
    display: list-item;
  }

  .paper-content :global(li::marker) {
    color: #1E40AF;
    font-weight: bold;
  }

  .paper-content :global(strong) {
    font-weight: 600;
    color: #1E40AF;
  }

  .paper-content :global(em) {
    font-style: italic;
    color: #6B5CA5;
  }

  .paper-content :global(a) {
    color: #1E40AF;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .paper-content :global(a:hover) {
    color: #1d4ed8;
  }

  .paper-content :global(img) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 2rem auto;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .paper-content :global(blockquote) {
    border-left: 4px solid #1E40AF;
    margin: 2rem 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 0 8px 8px 0;
    position: relative;
  }

  .paper-content :global(blockquote::before) {
    content: '"';
    font-size: 4rem;
    color: #1E40AF;
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    opacity: 0.3;
  }

  .paper-content :global(blockquote p) {
    font-style: italic;
    color: #1e40af;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  .paper-content :global(code) {
    background-color: #f1f5f9;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #1E40AF;
    font-family: 'Monaco', 'Menlo', monospace;
  }

  .paper-content :global(pre) {
    background-color: #0f172a;
    color: #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 2rem 0;
    box-shadow: 0 4px 15px rgba(15, 23, 42, 0.3);
  }

  .paper-content :global(pre code) {
    background: none;
    padding: 0;
    color: inherit;
    font-size: 0.9rem;
  }

  .paper-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .paper-content :global(th) {
    background: linear-gradient(135deg, #1E40AF 0%, #3b82f6 100%);
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
  }

  .paper-content :global(td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .paper-content :global(tr:nth-child(even)) {
    background-color: #f8fafc;
  }

  .paper-content :global(hr) {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, #1E40AF, transparent);
    margin: 3rem 0;
  }

  /* Academic citation styles */
  .paper-content :global(.citation) {
    font-size: 0.9rem;
    color: #6b7280;
    border-left: 2px solid #e5e7eb;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
  }

  /* Footnote styles */
  .paper-content :global(.footnote) {
    font-size: 0.85rem;
    color: #6b7280;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Ensure Follow component is NOT affected by paper styles */
  .paper-follow-section :global(.follow-compact) {
    font-size: initial !important;
    line-height: initial !important;
    color: white !important;
  }

  .paper-follow-section :global(.follow-compact *) {
    color: inherit !important;
  }

  .paper-follow-section :global(.follow-compact h3) {
    color: #fbbf24 !important;
    font-size: 1.125rem !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }

  .paper-follow-section :global(.follow-compact p) {
    color: white !important;
    font-size: 0.8rem !important;
    line-height: 1.2 !important;
    opacity: 0.9 !important;
  }

  .paper-follow-section :global(.follow-compact .action-label span) {
    color: white !important;
    font-size: 0.875rem !important;
    font-weight: 500 !important;
  }

  .paper-follow-section :global(.follow-compact .action-icon) {
    color: #fbbf24 !important;
  }

  .paper-follow-section :global(.follow-compact .social-btn) {
    color: white !important;
  }

  .paper-follow-section :global(.follow-compact .social-btn svg) {
    color: white !important;
  }

  .paper-follow-section :global(.follow-compact .global-note) {
    color: white !important;
    opacity: 0.8 !important;
    font-size: 0.75rem !important;
    font-style: italic !important;
  }

  .paper-follow-section :global(.follow-compact .btn) {
    color: #1E40AF !important;
  }

  .paper-follow-section :global(.follow-compact .btn-secondary) {
    color: #fbbf24 !important;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .container {
      margin: 1rem auto 2rem;
      padding: 0 1rem;
    }

    h1 {
      font-size: 2.2rem;
    }

    .paper-content :global(h2) {
      font-size: 1.7rem;
    }

    .paper-content :global(h3) {
      font-size: 1.4rem;
    }

    .paper-content :global(h4) {
      font-size: 1.2rem;
    }

    .paper-content :global(p) {
      font-size: 1rem;
    }

    .nav-content {
      grid-template-columns: 1fr;
    }

    .paper-follow-section {
      margin: 2rem 0;
    }

    .paper-badges {
      gap: 0.375rem;
    }

    .meta-secondary {
      flex-direction: column;
      gap: 0.5rem;
    }

    .paper-actions {
      flex-direction: column;
    }

    .action-button {
      justify-content: center;
    }

    .breadcrumb {
      margin-bottom: 1rem;
    }

    .breadcrumb-current {
      max-width: 150px;
    }

    .paper-content :global(blockquote) {
      margin: 1.5rem 0;
      padding: 1rem;
    }

    .paper-content :global(blockquote::before) {
      font-size: 3rem;
      top: -0.25rem;
      left: 0.5rem;
    }

    .paper-content :global(pre) {
      padding: 1rem;
      font-size: 0.8rem;
    }

    .paper-content :global(table) {
      font-size: 0.875rem;
    }

    .paper-content :global(th),
    .paper-content :global(td) {
      padding: 0.5rem 0.75rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem;
    }

    .nav-link {
      padding: 0.625rem 0.75rem;
      font-size: 0.875rem;
    }

    .action-button {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      min-width: 120px;
    }

    .paper-description {
      padding: 1rem;
    }

    .paper-description p {
      font-size: 1rem;
    }

    .breadcrumb-current {
      max-width: 120px;
    }
  }

  /* Print styles for academic papers */
  @media print {
    .container {
      max-width: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb,
    .paper-actions,
    .paper-follow-section,
    .paper-navigation {
      display: none;
    }

    .paper-header {
      border-bottom: 2px solid #333;
      margin-bottom: 2rem;
    }

    h1 {
      color: #000;
      font-size: 24pt;
    }

    .paper-content :global(h2) {
      color: #000;
      font-size: 18pt;
      page-break-after: avoid;
    }

    .paper-content :global(h3) {
      color: #000;
      font-size: 14pt;
      page-break-after: avoid;
    }

    .paper-content :global(p) {
      color: #000;
      font-size: 11pt;
      line-height: 1.6;
    }

    .paper-content :global(blockquote) {
      background: #f5f5f5;
      border-left: 4px solid #333;
    }

    .paper-content :global(pre) {
      background: #f5f5f5;
      color: #000;
      border: 1px solid #ccc;
    }
  }

  details {
    margin: 1rem 0;
    padding: 0.5rem;
    border-left: 3px solid #e2e8f0;
  }

  summary {
    cursor: pointer;
    font-weight: 600;
    padding: 0.5rem 0;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::before {
    content: "▶ ";
    transition: transform 0.2s ease;
  }

  details[open] summary::before {
    transform: rotate(90deg);
  }

  details[open] {
    border-left-color: #3b82f6;
  }
</style>
