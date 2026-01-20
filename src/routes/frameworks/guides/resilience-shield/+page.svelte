<!-- src/routes/frameworks/guides/resilience-shield/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, loadTranslations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { invalidate } from '$app/navigation';
  import { base } from '$app/paths';
  import { onMount, tick } from 'svelte';

  export let data;

  // Translation state - use isLocaleLoaded for better reactivity
  $: translationsReady = $isLocaleLoaded;
  $: rs = translationsReady ? ($t('resilienceShieldGuide') || {}) : {};
  $: currentLocale = $locale;

  // Component state
  let activeSection = 'introduction';
  let mounted = false;
  let isPrintMode = false;

  // Section metadata matching +page.js loader
  const sectionMetadata = [
    { id: 'introduction', emoji: '🏠' },
    { id: 'overview', emoji: '🗺️' },
    { id: 'local-resilience-fund', emoji: '💰' },
    { id: 'community-work-teams', emoji: '🤝' },
    { id: 'crisis-command', emoji: '⚡' },
    { id: 'implementation', emoji: '🔧' },
    { id: 'case-studies', emoji: '📖' }
  ];

  // Computed values
  $: sectionsToShow = (mounted && isPrintMode) ? sectionMetadata.map(s => s.id) : [activeSection];

  onMount(async () => {
    await tick();
    mounted = true;
    
    if (browser) {
      // Fix URL corruption and preserve hash fragments
      let extractedHash = window.location.hash;
      
      if (window.location.pathname !== '/frameworks/guides/resilience-shield') {
        const pathname = window.location.pathname;
        const lastPart = pathname.split('/').pop();
        
        // Extract section from corrupted pathname
        if (data?.sections?.[lastPart] && !extractedHash) {
          extractedHash = `#${lastPart}`;
        }
        
        // Correct the URL
        const correctUrl = `/frameworks/guides/resilience-shield${window.location.search}${extractedHash}`;
        window.history.replaceState(null, '', correctUrl);
      }
      
      // Force reload translations if needed
      if (!translationsReady) {
        try {
          await loadTranslations($locale, '/frameworks/guides/resilience-shield');
        } catch (e) {
          console.error('Failed to reload translations:', e);
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
      
      // Global function for PDF generation
      window.showAllSectionsForPrint = () => { isPrintMode = true; };
      
      // Listen for hash changes
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        if (hash && data?.sections?.[hash] && activeSection !== hash) {
          activeSection = hash;
          
          // Scroll to content
          setTimeout(() => {
            const contentElement = document.querySelector('.section-content');
            if (contentElement) {
              contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        if (window.showAllSectionsForPrint) {
          delete window.showAllSectionsForPrint;
        }
      };
    }
  });

  // Function to set active section
  function setActiveSection(section) {
    if (!data?.sections?.[section]) return;
    
    activeSection = section;
    
    if (browser) {
      const newUrl = `/frameworks/guides/resilience-shield${window.location.search}#${section}`;
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

  // Translation helper functions with fallbacks
  function getSectionTitle(section) {
    return translationsReady ? (rs.sections?.[section] || section.replace(/[-_]/g, ' ')) 
                             : section.replace(/[-_]/g, ' ');
  }

  function getTextWithFallback(key, fallback) {
    return translationsReady ? ($t(key) || fallback) : fallback;
  }

  function downloadGuideWithFallback(guideId = 'resilience-shield', version = 'alpha-1.0') {
    const currentLocale = $locale || 'sv';
    
    // Try current locale first
    const localizedUrl = `${base}/downloads/${currentLocale}/resiliensskolden-${version}.pdf`;
    
    // Check if localized version exists, fallback to Swedish if not
    checkFileExists(localizedUrl)
      .then(exists => {
        if (exists) {
          downloadFile(localizedUrl, `resiliensskolden-${version}-${currentLocale}.pdf`);
        } else {
          console.warn(`Localized PDF not found for ${currentLocale}, falling back to Swedish`);
          const fallbackUrl = `${base}/downloads/sv/resiliensskolden-${version}.pdf`;
          downloadFile(fallbackUrl, `resiliensskolden-${version}-sv.pdf`);
        }
      })
      .catch(() => {
        // If check fails, try fallback directly
        const fallbackUrl = `${base}/downloads/sv/resiliensskolden-${version}.pdf`;
        downloadFile(fallbackUrl, `resiliensskolden-${version}-sv.pdf`);
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

  // Handle locale changes
  $: if (browser && mounted && $locale) {
    invalidate('app:locale');
  }
</script>

<svelte:head>
  <title>{getTextWithFallback('resilienceShield.meta.title', 'Resiliensskölden - Ett protokoll för kommunal säkerhet')}</title>
  <meta name="description" content="{getTextWithFallback('resilienceShield.meta.description', 'En praktisk guide för svenska kommuner att bygga resiliens mot gängvåld, klimatkriser och försörjningskedjor')}" />
</svelte:head>

{#if mounted}
  <div class="breadcrumb-nav">
    <a href="/frameworks/guides" class="breadcrumb-link">
      <span class="breadcrumb-icon">←</span>
      <span class="breadcrumb-text">{rs.navigation?.backToGuides || 'Tillbaka till implementationsguider'}</span>
    </a>
  </div>

  <div class="documentation-container">
    <!-- Sidebar navigation -->
    <div class="sidebar">
      {#if !isPrintMode} 
        <div class="section-nav">
          <h3 class="nav-header">{rs.navigation?.sections || 'Avsnitt'}</h3>
          
          {#each sectionMetadata as section}
            <button 
              class="nav-item" 
              class:active={activeSection === section.id}
              on:click={() => setActiveSection(section.id)}
            >
              <span class="nav-icon">{section.emoji}</span>
              <span class="nav-title">{getSectionTitle(section.id)}</span>
            </button>
          {/each}

          <!-- Download section -->
          <div class="download-section">
            <button 
              class="download-btn"
              on:click={() => downloadGuideWithFallback('resilience-shield', 'alpha-1.0')}
            >
              <span class="download-icon">⬇️</span>
              <span>{rs.actions?.downloadPdf || 'Ladda ner PDF'}</span>
            </button>
            
            <button 
              class="print-btn"
              on:click={() => { isPrintMode = true; setTimeout(() => window.print(), 500); }}
            >
              <span class="print-icon">🖨️</span>
              <span>{rs.actions?.print || 'Skriv ut'}</span>
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Main content area -->
    <div class="main-content">
      {#if !translationsReady}
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Laddar innehåll...</p>
        </div>
      {:else}
        <!-- Alert banner -->
        <div class="alert-banner">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <strong>{rs.alert?.title || 'Detta är inte en bidragsansökan'}</strong>
            <p>{rs.alert?.description || 'Detta är ett ensidigt kunskapsöverföring. Vi ger er protokollen. Ni behåller er suveränitet.'}</p>
          </div>
        </div>

        <!-- Section content -->
        {#each sectionsToShow as sectionId}
          {#if data?.sections?.[sectionId]?.default}
            <div class="section-content" id={sectionId}>
              <div class="content">
                <svelte:component this={data.sections[sectionId].default} />
              </div>
            </div>
          {/if}
        {/each}

        <!-- CTA Footer (only on last section in non-print mode) -->
        {#if !isPrintMode && activeSection === 'case-studies'}
          <div class="cta-footer">
            <h3>{rs.cta?.title || 'Redo att börja?'}</h3>
            <p>{rs.cta?.description || 'Kontakta oss för att diskutera implementering i er kommun.'}</p>
            <div class="cta-buttons">
              <button 
                class="cta-primary"
                on:click={() => downloadGuideWithFallback('resilience-shield', 'alpha-1.0')}
              >
                {rs.cta?.downloadButton || 'Ladda ner komplett protokoll'}
              </button>
              <a href="mailto:kontakt@ggf.earth" class="cta-secondary">
                {rs.cta?.contactButton || 'Kontakta oss'}
              </a>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  /* CSS Variables for Resilience Shield theme */
  :global(:root) {
    --shield-primary: #1e3a8a;     /* Dark blue - authority */
    --shield-secondary: #dc2626;   /* Red - urgency */
    --shield-accent: #059669;      /* Green - resilience */
    --shield-warning: #f59e0b;     /* Amber - caution */
  }

  /* Breadcrumb navigation */
  .breadcrumb-nav {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem 2rem 0;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--shield-primary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .breadcrumb-link:hover {
    color: var(--shield-secondary);
    gap: 0.75rem;
  }

  .breadcrumb-icon {
    font-size: 1.25rem;
  }

  /* Main container */
  .documentation-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    top: 2rem;
    height: fit-content;
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
  }

  .section-nav {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .nav-header {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border: none;
    background: transparent;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    font-size: 0.95rem;
  }

  .nav-item:hover {
    background: rgba(30, 58, 138, 0.1);
  }

  .nav-item.active {
    background: var(--shield-primary);
    color: white;
    font-weight: 500;
  }

  .nav-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .nav-title {
    flex: 1;
  }

  /* Download section */
  .download-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .download-btn,
  .print-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
  }

  .download-btn {
    background: var(--shield-primary);
    color: white;
  }

  .download-btn:hover {
    background: var(--shield-secondary);
    transform: translateY(-1px);
  }

  .print-btn {
    background: white;
    border: 1px solid var(--shield-primary);
    color: var(--shield-primary);
  }

  .print-btn:hover {
    background: rgba(30, 58, 138, 0.05);
  }

  /* Main content */
  .main-content {
    min-width: 0;
  }

  /* Loading state */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    gap: 1rem;
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid #e5e7eb;
    border-top-color: var(--shield-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Alert banner */
  .alert-banner {
    display: flex;
    gap: 1rem;
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(30, 58, 138, 0.1));
    border: 2px solid var(--shield-secondary);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .alert-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .alert-content strong {
    display: block;
    color: var(--shield-secondary);
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .alert-content p {
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
  }

  /* Section content */
  .section-content {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .content :global(h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--shield-primary);
  }
  
  .content :global(h2) {
    font-size: 1.75rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--shield-secondary);
  }
  
  .content :global(h3) {
    font-size: 1.375rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--shield-accent);
  }

  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: #374151;
  }

  .content :global(ul),
  .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    color: #374151;
  }

  .content :global(ul li),
  .content :global(ol li) {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }

  .content :global(strong) {
    color: var(--shield-primary);
    font-weight: 600;
  }

  .content :global(a) {
    color: var(--shield-primary);
    text-decoration: underline;
    transition: color 0.2s;
  }

  .content :global(a:hover) {
    color: var(--shield-secondary);
  }

  .content :global(blockquote) {
    background: rgba(30, 58, 138, 0.05);
    border-left: 4px solid var(--shield-primary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  /* Enhanced bullet points */
  .content :global(ul) {
    margin-bottom: 1.5rem;
    padding-left: 0;
    list-style: none;
  }

  .content :global(ul li) {
    position: relative;
    padding-left: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.7;
    color: #374151;
  }

  .content :global(ul li::before) {
    content: "▸";
    position: absolute;
    left: 0.5rem;
    color: var(--shield-primary);
    font-weight: bold;
    font-size: 1.1em;
  }

  /* Nested bullet points */
  .content :global(ul ul) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .content :global(ul ul li::before) {
    content: "•";
    color: var(--shield-secondary);
    font-size: 1.2em;
  }

  .content :global(ul ul ul li::before) {
    content: "◦";
    color: var(--shield-accent);
  }

  /* Enhanced numbered lists */
  .content :global(ol) {
    margin-bottom: 1.5rem;
    padding-left: 0;
    list-style: none;
    counter-reset: item;
  }

  .content :global(ol li) {
    position: relative;
    padding-left: 2.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.7;
    color: #374151;
    counter-increment: item;
  }

  .content :global(ol li::before) {
    content: counter(item);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--shield-primary);
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1;
  }

  /* Nested numbered lists - smaller circles */
  .content :global(ol ol) {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    counter-reset: subitem;
  }

  .content :global(ol ol li) {
    counter-increment: subitem;
    padding-left: 2rem;
  }

  .content :global(ol ol li::before) {
    content: counter(item) "." counter(subitem);
    width: auto;
    min-width: 2rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    background: var(--shield-secondary);
    border-radius: 0.75rem;
    font-size: 0.8125rem;
  }

  /* Third level - even smaller */
  .content :global(ol ol ol li::before) {
    background: var(--shield-accent);
    font-size: 0.75rem;
  }

  /* Alternative style: outlined numbers */
  .content :global(ol.outlined) {
    padding-left: 0;
  }

  .content :global(ol.outlined li::before) {
    background: white;
    color: var(--shield-primary);
    border: 2px solid var(--shield-primary);
    font-weight: 700;
  }

  /* CTA Footer */
  .cta-footer {
    background: linear-gradient(135deg, var(--shield-primary), var(--shield-secondary));
    color: white;
    border-radius: 0.75rem;
    padding: 2.5rem;
    text-align: center;
    margin-top: 3rem;
  }

  .cta-footer h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .cta-footer p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.95;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-primary,
  .cta-secondary {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    font-size: 1.0625rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    text-decoration: none;
    display: inline-block;
  }

  .cta-primary {
    background: white;
    color: var(--shield-primary);
  }

  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .cta-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .documentation-container {
      grid-template-columns: 240px 1fr;
      gap: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .breadcrumb-nav {
      padding: 1rem;
    }
    
    .documentation-container {
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 0.5rem;
    }
    
    .sidebar {
      position: static;
      max-height: none;
    }

    .section-nav {
      margin-bottom: 1rem;
      padding: 1rem;
    }

    .nav-item {
      padding: 0.65rem 0.85rem;
      font-size: 0.9rem;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .cta-primary,
    .cta-secondary {
      width: 100%;
    }
  }

  /* Print styles */
  @media print {
    .breadcrumb-nav,
    .sidebar,
    .alert-banner,
    .cta-footer {
      display: none;
    }

    .documentation-container {
      display: block;
      padding: 0;
    }

    .section-content {
      box-shadow: none;
      page-break-inside: avoid;
    }
  }
</style>
