<!-- src/routes/frameworks/guides/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { base } from '$app/paths';
  import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
  import { onMount } from 'svelte';

  // Translation state
  $: translationsReady = $isLocaleLoaded;
  $: gg = translationsReady ? ($t('guidesOverview') || {}) : {};
  $: currentLocale = $locale;

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  // Translation helper functions with fallbacks
  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  // Function to download a guide PDF
  function downloadGuideWithFallback(guideId = 'regenerative-resources', version = 'v1.0') {
    const currentLocale = $locale || 'en';
    
    // Try current locale first
    const localizedUrl = `${base}/downloads/${currentLocale}/ggf-guide-${guideId}-${version}.pdf`;
    
    // Check if localized version exists, fallback to English if not
    checkFileExists(localizedUrl)
      .then(exists => {
        if (exists) {
          downloadFile(localizedUrl, `ggf-guide-${guideId}-${version}-${currentLocale}.pdf`);
        } else {
          console.warn(`Localized PDF not found for ${currentLocale}, falling back to English`);
          const fallbackUrl = `${base}/downloads/en/ggf-guide-${guideId}-${version}.pdf`;
          downloadFile(fallbackUrl, `ggf-guide-${guideId}-${version}-en.pdf`);
        }
      })
      .catch(() => {
        // If check fails, try fallback directly
        const fallbackUrl = `${base}/downloads/en/ggf-guide-${guideId}-${version}.pdf`;
        downloadFile(fallbackUrl, `ggf-guide-${guideId}-${version}-en.pdf`);
      });
  }

  // Helper function to check if file exists
  async function checkFileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Helper function to download file
  function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Guide data - this could eventually come from a data file or API
  const guides = [
    {
      id: 'regenerative-resources',
      title: 'Regenerative Resource Stewardship',
      subtitle: 'A GGF Implementation Guide for Mineral & Resource Governance',
      description: 'A comprehensive playbook synthesizing GGF frameworks to provide clear pathways for governing mineral and resource stewardship. Designed for policymakers, BAZ leaders, community organizers, and regenerative enterprises.',
      icon: '⛏️',
      color: '#2D5016', // Deep forest green
      accentColor: '#8B4513', // Saddle brown
      version: 'v1.0',
      status: 'Available',
      route: '/frameworks/guides/regenerative-resources',
      targetAudience: ['Policymakers', 'BAZ Leaders', 'Community Organizers', 'Regenerative Enterprises'],
      keyTopics: ['Indigenous Sovereignty', 'Circular Economics', 'Commons Stewardship', 'Legal Accountability', 'Ethical Supply Chains'],
      pillars: 5,
      estimatedReadTime: '45 minutes',
      implementationComplexity: 'Intermediate'
    },
    {
      id: 'great-transition',
      title: 'The Great Transition',
      subtitle: 'A GGF Implementation Guide for Justice in Systemic Change',
      description: 'A practical playbook for managing just transitions from extractive industries to regenerative economies. Demonstrates how to use integrated GGF frameworks to ensure transition is not a cliff, but a bridge to a prosperous future.',
      icon: '🌅',
      color: '#1B4332', // Dark green - forest/transition
      accentColor: '#B07000', // Dark goldenrod - industrial heritage
      version: 'v1.0',
      status: 'Available',
      route: '/frameworks/guides/great-transition',
      targetAudience: ['Community Leaders', 'BAZ Councils', 'Regional Planners', 'Worker Cooperatives'],
      keyTopics: ['Just Transition', 'Worker Empowerment', 'Truth & Reconciliation', 'Economic Transformation', 'Stewardship Trusts'],
      pillars: 4,
      estimatedReadTime: '50 minutes',
      implementationComplexity: 'Advanced'
    },
    {
      id: 'bioregional-compass',
      title: 'The Bioregional Compass',
      subtitle: 'A GGF Implementation Guide for the Formation of a BAZ',
      description: 'The foundational playbook for communities seeking to establish a Bioregional Autonomous Zone. This guide provides a step-by-step journey from initial visioning to a fully operational BAZ, integrating GGF principles of governance, economics, and ecology.',
      icon: '🧭',
      color: '#004D40', // Teal/deep green
      accentColor: '#FFD700', // Gold
      version: 'v1.0',
      status: 'Available',
      route: '/frameworks/guides/bioregional-compass',
      targetAudience: ['Community Organizers', 'Indigenous Leaders', 'Municipal Planners', 'Ecologists', 'Local Activists'],
      keyTopics: ['Community Consensus', 'Bioregional Mapping', 'Legal Scaffolding', 'Decentralized Governance', 'GGF Integration'],
      pillars: 6,
      estimatedReadTime: '60 minutes',
      implementationComplexity: 'Advanced'
    }
    // Future guides can be added here
  ];

  // Get guide status styling
  function getStatusStyle(status) {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'Coming Soon':
        return 'status-coming-soon';
      case 'Draft':
        return 'status-draft';
      default:
        return 'status-default';
    }
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('guidesOverview.meta.title', 'Implementation Guides - Global Governance Framework')}</title>
  <meta name="description" content="{getTextWithFallback('guidesOverview.meta.description', 'Practical implementation guides for applying GGF frameworks to real-world governance challenges')}" />
</svelte:head>

{#if mounted}
  <div class="guides-container">
    <FrameworkSidebar />

    <div class="content">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="main-title">
            <span class="title-icon">📚</span>
            {gg.title || 'Implementation Guides'}
          </h1>
          <p class="main-description">
            {gg.description || 'Practical playbooks for applying Global Governance Framework principles to real-world challenges. Each guide synthesizes multiple GGF frameworks into actionable implementation pathways.'}
          </p>
        </div>
        
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-number">{guides.filter(g => g.status === 'Available').length}</span>
            <span class="stat-label">{gg.stats?.available || 'Available'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{guides.length}</span>
            <span class="stat-label">{gg.stats?.total || 'Total Guides'}</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">∞</span>
            <span class="stat-label">{gg.stats?.planned || 'More Coming'}</span>
          </div>
        </div>
      </div>

      <!-- Coming Soon Notice -->
      <div class="coming-soon-notice">
        <div class="notice-icon">🚧</div>
        <div class="notice-content">
          <h3>{gg.comingSoon?.title || 'More Guides in Development'}</h3>
          <p>{gg.comingSoon?.description || 'We\'re actively developing implementation guides for urban transformation, technology governance, regenerative economics, and more. Each guide will provide the same comprehensive, multi-framework approach.'}</p>
        </div>
      </div>

      <!-- Guides Grid -->
      <div class="guides-grid">
        {#each guides as guide (guide.id)}
          <div class="guide-card" style="--guide-primary: {guide.color}; --guide-accent: {guide.accentColor};">
            <!-- Guide Header -->
            <div class="guide-header">
              <div class="guide-icon" style="color: {guide.color};">{guide.icon}</div>
              <div class="guide-meta">
                <span class="guide-version">{guide.version}</span>
                <span class="guide-status {getStatusStyle(guide.status)}">{guide.status}</span>
              </div>
            </div>

            <!-- Guide Content -->
            <div class="guide-content">
              <h2 class="guide-title">{guide.title}</h2>
              <p class="guide-subtitle">{guide.subtitle}</p>
              <p class="guide-description">{guide.description}</p>

              <!-- Guide Details -->
              <div class="guide-details">
                <div class="detail-row">
                  <span class="detail-label">{gg.labels?.readTime || 'Read Time'}:</span>
                  <span class="detail-value">{guide.estimatedReadTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{gg.labels?.complexity || 'Complexity'}:</span>
                  <span class="detail-value">{guide.implementationComplexity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">{gg.labels?.pillars || 'Pillars'}:</span>
                  <span class="detail-value">{guide.pillars} {gg.labels?.frameworks || 'frameworks'}</span>
                </div>
              </div>

              <!-- Target Audience -->
              <div class="audience-section">
                <h4 class="section-title">{gg.labels?.targetAudience || 'Target Audience'}</h4>
                <div class="audience-tags">
                  {#each guide.targetAudience as audience}
                    <span class="audience-tag">{audience}</span>
                  {/each}
                </div>
              </div>

              <!-- Key Topics -->
              <div class="topics-section">
                <h4 class="section-title">{gg.labels?.keyTopics || 'Key Topics'}</h4>
                <div class="topic-tags">
                  {#each guide.keyTopics as topic}
                    <span class="topic-tag">{topic}</span>
                  {/each}
                </div>
              </div>
            </div>

            <!-- Guide Actions -->
            <div class="guide-actions">
              {#if guide.status === 'Available'}
                <a href="{guide.route}" class="action-btn primary-btn">
                  <span class="btn-icon">📖</span>
                  {gg.actions?.readOnline || 'Read Online'}
                </a>
                <button class="action-btn secondary-btn" on:click={() => downloadGuideWithFallback(guide.id, guide.version)}>
                  <span class="btn-icon">📥</span>
                  {gg.actions?.downloadPdf || 'Download PDF'}
                </button>
              {:else}
                <button class="action-btn disabled-btn" disabled>
                  <span class="btn-icon">⏳</span>
                  {gg.actions?.comingSoon || 'Coming Soon'}
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Request Section -->
      <div class="request-section">
        <div class="request-content">
          <h3>{gg.request?.title || 'Need a Specific Implementation Guide?'}</h3>
          <p>{gg.request?.description || 'We\'re continuously developing new guides based on community needs. If you\'re working on a specific governance challenge that would benefit from a comprehensive GGF implementation guide, we\'d love to hear from you.'}</p>
          <div class="request-actions">
            <a href="/contact" class="contact-btn">
              <span class="btn-icon">💬</span>
              {gg.request?.contactButton || 'Suggest a Guide Topic'}
            </a>
            <a href="/frameworks" class="frameworks-btn">
              <span class="btn-icon">🏛️</span>
              {gg.request?.frameworksButton || 'Explore All Frameworks'}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <!-- Loading state -->
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>{getTextWithFallback('guidesOverview.loading.text', 'Loading implementation guides...')}</p>
  </div>
{/if}

<style>
  /* Guides Overview color scheme - professional blue-green */
  :root {
    --guides-primary: #0F4C75;      /* Deep blue */
    --guides-secondary: #3282B8;    /* Medium blue */
    --guides-accent: #0F3460;       /* Dark blue */
    --guides-success: #27AE60;      /* Green */
    --guides-warning: #F39C12;      /* Orange */
    --guides-light: #EBF2FA;        /* Light blue */
    --guides-neutral: #95A5A6;      /* Gray */
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
    border-top: 4px solid var(--guides-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Layout */
  .guides-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .content {
    min-width: 0;
  }

  /* Header Section */
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, var(--guides-light) 0%, #f8fafc 100%);
    border-radius: 1rem;
    border: 1px solid rgba(15, 76, 117, 0.1);
  }

  .header-content {
    flex: 1;
    max-width: 600px;
  }

  .main-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--guides-primary);
    margin-bottom: 1rem;
  }

  .title-icon {
    font-size: 2.5rem;
  }

  .main-description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #4b5563;
    margin: 0;
  }

  .header-stats {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 4px rgba(15, 76, 117, 0.1);
    min-width: 80px;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--guides-primary);
    line-height: 1;
  }

  .stat-label {
    display: block;
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  /* Coming Soon Notice */
  .coming-soon-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(15, 76, 117, 0.1));
    border: 1px solid rgba(243, 156, 18, 0.3);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 3rem;
  }

  .notice-icon {
    font-size: 2rem;
    color: var(--guides-warning);
    flex-shrink: 0;
  }

  .notice-content h3 {
    color: var(--guides-primary);
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .notice-content p {
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  /* Guides Grid */
  .guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .guide-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .guide-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: var(--guide-primary);
  }

  /* Guide Header */
  .guide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 0 1.5rem;
  }

  .guide-icon {
    font-size: 3rem;
  }

  .guide-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .guide-version {
    background: var(--guide-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .guide-status {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .status-available {
    background-color: rgba(39, 174, 96, 0.1);
    color: var(--guides-success);
    border: 1px solid var(--guides-success);
  }

  .status-coming-soon {
    background-color: rgba(243, 156, 18, 0.1);
    color: var(--guides-warning);
    border: 1px solid var(--guides-warning);
  }

  .status-draft {
    background-color: rgba(149, 165, 166, 0.1);
    color: var(--guides-neutral);
    border: 1px solid var(--guides-neutral);
  }

  /* Guide Content */
  .guide-content {
    padding: 1.5rem;
  }

  .guide-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--guide-primary);
    margin: 0 0 0.5rem 0;
  }

  .guide-subtitle {
    font-size: 1rem;
    font-weight: 500;
    color: var(--guide-accent);
    margin: 0 0 1rem 0;
  }

  .guide-description {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  /* Guide Details */
  .guide-details {
    background-color: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .detail-row:last-child {
    margin-bottom: 0;
  }

  .detail-label {
    font-weight: 500;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .detail-value {
    font-weight: 600;
    color: var(--guide-primary);
    font-size: 0.875rem;
  }

  /* Sections */
  .audience-section,
  .topics-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--guide-primary);
    margin: 0 0 0.75rem 0;
  }

  .audience-tags,
  .topic-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .audience-tag {
    background-color: rgba(50, 130, 184, 0.1);
    color: var(--guides-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(50, 130, 184, 0.3);
  }

  .topic-tag {
    background-color: rgba(15, 76, 117, 0.1);
    color: var(--guide-primary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(15, 76, 117, 0.3);
  }

  /* Guide Actions */
  .guide-actions {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    border: none;
    font-size: 0.875rem;
  }

  .primary-btn {
    background-color: var(--guide-primary);
    color: white;
  }

  .primary-btn:hover {
    background-color: var(--guide-accent);
    transform: translateY(-1px);
  }

  .secondary-btn {
    background-color: white;
    color: var(--guide-primary);
    border: 1px solid var(--guide-primary);
  }

  .secondary-btn:hover {
    background-color: rgba(15, 76, 117, 0.1);
    transform: translateY(-1px);
  }

  .disabled-btn {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  .btn-icon {
    font-size: 1rem;
  }

  /* Request Section */
  .request-section {
    background: linear-gradient(135deg, rgba(15, 76, 117, 0.1), rgba(50, 130, 184, 0.1));
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
  }

  .request-content h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--guides-primary);
    margin: 0 0 1rem 0;
  }

  .request-content p {
    font-size: 1rem;
    line-height: 1.6;
    color: #4b5563;
    margin: 0 0 2rem 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .request-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .contact-btn,
  .frameworks-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s;
  }

  .contact-btn {
    background-color: var(--guides-primary);
    color: white;
  }

  .contact-btn:hover {
    background-color: var(--guides-accent);
    transform: translateY(-1px);
  }

  .frameworks-btn {
    background-color: white;
    color: var(--guides-primary);
    border: 1px solid var(--guides-primary);
  }

  .frameworks-btn:hover {
    background-color: rgba(15, 76, 117, 0.1);
    transform: translateY(-1px);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .guides-grid {
      grid-template-columns: 1fr;
    }

    .header-section {
      flex-direction: column;
      gap: 2rem;
    }

    .header-stats {
      align-self: stretch;
      justify-content: space-around;
    }
  }

  @media (max-width: 768px) {
    .guides-container {
      grid-template-columns: 1fr;
    }

    .main-title {
      font-size: 2rem;
    }

    .title-icon {
      font-size: 2rem;
    }

    .header-section {
      padding: 1.5rem;
    }

    .header-stats {
      gap: 1rem;
    }

    .coming-soon-notice {
      padding: 1rem;
    }

    .notice-icon {
      font-size: 1.5rem;
    }

    .guide-actions {
      flex-direction: column;
    }

    .request-actions {
      flex-direction: column;
    }

    .loading-container {
      padding: 2rem 1rem;
    }
  }
</style>
