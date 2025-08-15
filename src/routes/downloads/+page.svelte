<!-- src/routes/downloads/+page.svelte (with CSS and emojis) -->
<script>
  import { t, locale, setLocale } from '$lib/i18n';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';

  // Subscribe to stores
  $: currentT = $t;
  $: currentLocale = $locale;

  // Define PDF links
  const getPdfPath = (docName) => {
    return `${base}/downloads/${currentLocale}/${docName}.pdf`;
  };

  // Helper function for language button styling
  function getLanguageButtonStyle(lang) {
    const isActive = currentLocale === lang;
    return `padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #e5e7eb; background-color: ${isActive ? '#2B4B8C' : 'white'}; color: ${isActive ? 'white' : '#2B4B8C'}; font-weight: 500; text-decoration: none;`;
  }

  // Enhanced download function with error handling
  async function handleDownload(event, docName) {
    event.preventDefault();
    
    if (!browser) return;
    
    const pdfPath = getPdfPath(docName);
    
    try {
      // Check if file exists
      const response = await fetch(pdfPath, { method: 'HEAD' });
      
      if (response.ok) {
        // File exists, proceed with download
        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = `${docName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // File doesn't exist, show graceful error
        showFileUnavailableMessage(docName);
      }
    } catch (error) {
      // Network error or other issue
      showFileUnavailableMessage(docName);
    }
  }

  function showFileUnavailableMessage(docName) {
    const message = currentT('downloads.errors.fileUnavailable', { 
      filename: docName,
      language: currentLocale === 'en' ? 'English' : 'Svenska'
    });
    
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.className = 'file-unavailable-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        color: #92400e;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 400px;
        font-size: 0.9rem;
        line-height: 1.4;
      ">
        <div style="display: flex; align-items: start; gap: 0.5rem;">
          <div style="color: #f59e0b; font-size: 1.2rem;">⚠️</div>
          <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">
              ${currentT('downloads.errors.title')}
            </div>
            <div>${message}</div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem;">
              ${currentT('downloads.errors.suggestion')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 8 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 8000);
  }
</script>

<svelte:head>
  <title>{$t('downloads.title')} - Global Governance Framework</title>
  <meta name="description" content={$t('downloads.metaDescription')} />
</svelte:head>

<style>
  .hero {
    padding: 3rem 0;
    background: linear-gradient(to bottom right, #2B4B8C, #6B5CA5);
    color: white;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .content-wrapper {
    max-width: 42rem;
    margin: 0 auto;
  }
  
  .section-title {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #2B4B8C;
  }
  
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.2;
    font-weight: 700;
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    color: #ffffff;
  }
  
  .intro-text {
    margin-bottom: 2rem;
    color: #4b5563;
    line-height: 1.7;
    font-size: 1.125rem;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .download-card {
    background-color: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
  }
  
  .card-emoji {
    font-size: 2.5rem;
  }
  
  .card-content {
    flex: 1;
    min-width: 200px;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .card-description {
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
  
  .download-button {
    display: inline-flex;
    align-items: center;
    color: white;
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }
  
  .download-button:hover {
    opacity: 0.9;
  }
  
  .download-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-left: 0.5rem;
  }
  
  .info-box {
    background-color: #f0f4f8;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    border-left: 4px solid #2B4B8C;
  }
  
  .info-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2B4B8C;
  }
  
  .info-text {
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  
  .info-link {
    color: #2B4B8C;
    text-decoration: underline;
    font-weight: 500;
  }
  
  .language-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 2rem;
    margin-top: 2rem;
  }
  
  .language-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2B4B8C;
  }
  
  .language-buttons {
    display: flex;
    gap: 1rem;
  }
  
  .other-formats {
    background-color: #e9f2e9;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-top: 2rem;
  }
  
  .other-formats-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #2D5F2D;
  }
  
  .other-formats-text {
    color: #4b5563;
    margin-bottom: 1rem;
  }
  
  .other-formats-link {
    color: #DAA520;
    text-decoration: underline;
    font-weight: 500;
  }
</style>

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="content-wrapper">
      <h1 class="hero-title">
        {$t('downloads.hero.title')}
      </h1>
      <p class="hero-subtitle">
        {$t('downloads.hero.subtitle')}
      </p>
    </div>
  </div>
</section>

<!-- Downloads Section -->
<section style="padding: 3rem 0; background-color: white;">
  <div class="container">
    <div class="content-wrapper">
      <p class="intro-text">
        {$t('downloads.intro')}
      </p>
      
      <h2 class="section-title">{$t('downloads.coreDocuments.title', 'Core Documents')}</h2>
      
      <div class="card-grid">
        <div class="download-card" style="background-color: #eef2f3; border: 1px solid #d1d5db;">
          <div class="card-emoji" style="color: #2B4B8C;">🌐</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2B4B8C;">{$t('downloads.cards.treaty.title')}</h2>
            <p class="card-description">{$t('downloads.cards.treaty.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Treaty-for-Our-Only-Home')} class="download-button" style="background-color: #DAA520; color: #2B4B8C;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Core Principles -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2B4B8C;">🧭</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.cards.principles.title')}</h2>
            <p class="card-description">{$t('downloads.cards.principles.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Core-Principles')} class="download-button" style="background-color: #2B4B8C;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Implementation Guidelines -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2D5F2D;">🛠️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.cards.implementation.title')}</h2>
            <p class="card-description">{$t('downloads.cards.implementation.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Implementation-Guidelines')} class="download-button" style="background-color: #2D5F2D;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Case Studies -->
        <div class="download-card">
          <div class="card-emoji" style="color: #DAA520;">🔍</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.cards.caseStudies.title')}</h2>
            <p class="card-description">{$t('downloads.cards.caseStudies.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Case-Studies')} class="download-button" style="background-color: #DAA520;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Resources -->
        <div class="download-card">
          <div class="card-emoji" style="color: #6B5CA5;">📚</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.cards.resources.title')}</h2>
            <p class="card-description">{$t('downloads.cards.resources.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Resources')} class="download-button" style="background-color: #6B5CA5;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Global Citizenship Framework Section -->
      <h2 class="section-title">{$t('downloads.globalCitizenship.title')}</h2>
      <p class="intro-text">
        {$t('downloads.globalCitizenship.description')}
      </p>
      
      <div class="card-grid">
        <!-- Full Global Citizenship Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2B4B8C;">🌐</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2B4B8C;">{$t('downloads.globalCitizenship.full.title')}</h2>
            <p class="card-description">{$t('downloads.globalCitizenship.full.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Global-Citizenship')} class="download-button" style="background-color: #2B4B8C;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 4-Page Overview -->
        <div class="download-card">
          <div class="card-emoji" style="color: #DAA520;">📋</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #DAA520;">{$t('downloads.globalCitizenship.summary.title')}</h2>
            <p class="card-description">{$t('downloads.globalCitizenship.summary.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Global-Citizenship-4-page-overview')} class="download-button" style="background-color: #DAA520;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Implementation Frameworks Section -->
      <h2 class="section-title">{$t('downloads.implementationFrameworks.title')}</h2>
      <p class="intro-text">
        {$t('downloads.implementationFrameworks.description')}
      </p>

      <!-- Add this right after the Implementation Frameworks introduction paragraph -->
      <div class="info-box">
        <h3 class="info-title">{$t('downloads.implementationFrameworks.moreTools.title')}</h3>
        <p class="info-text">
          {$t('downloads.implementationFrameworks.moreTools.description')} 
          <a href="{base}/frameworks/tools" class="info-link">
            {$t('downloads.implementationFrameworks.moreTools.linkText')}
          </a>
        </p>
      </div>

      <div class="card-grid">

        <!-- Emergent Governance Protocol Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #4c1d95;">🗣️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #4c1d95;">{$t('downloads.implementationFrameworks.emergentGovernance.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.emergentGovernance.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Emergent-Governance-Protocol-Framework')} class="download-button" style="background-color: #4c1d95;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Integrated Meta-Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #5E4B8B;">🔄</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.meta.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.meta.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Meta-Governance')} class="download-button" style="background-color: #5E4B8B;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Indigenous & Traditional Knowledge Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1c2b1a;">🪶</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.indigenous.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.indigenous.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Indigenous-&-Traditional-Knowledge-Framework')} class="download-button" style="background-color: #1c2b1a;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Moral Operating System Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #6B46C1;">🦋</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #6B46C1;">{$t('downloads.implementationFrameworks.moralOperatingSystem.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.moralOperatingSystem.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Moral-Operating-System-Framework')} class="download-button" style="background-color: #6B46C1;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Justice Systems Implementation Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1e40af;">⚖️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e40af;">{$t('downloads.implementationFrameworks.justiceSystems.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.justiceSystems.description')}</p>
           <button on:click={(e) => handleDownload(e, 'Justice-Systems-Framework')} class="download-button" style="background-color: #1e40af;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Shield Protocol Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1E3A8A;">🛡️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1E3A8A;">{$t('downloads.implementationFrameworks.shieldProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.shieldProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Shield-Protocol-Framework')} class="download-button" style="background-color: #1E3A8A;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Aegis Protocol Framework -->
        <div class="download-card" style="background-color: #f0f8ff; border: 1px solid #87ceeb;">
          <div class="card-emoji" style="color: #1e40af;">🛰️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e40af;">{$t('downloads.implementationFrameworks.aegisProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.aegisProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Aegis-Protocol-Framework')} class="download-button" style="background-color: #1e40af;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Planetary Health -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1e3a8a;">💚</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e3a8a;">{$t('downloads.implementationFrameworks.planetaryHealth.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.planetaryHealth.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Planetary-Health-Governance-Framework')} class="download-button" style="background-color: #1e3a8a;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Global Health & Pandemic Security Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #dc2626;">⚕️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #dc2626;">{$t('downloads.implementationFrameworks.globalHealth.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.globalHealth.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Global-Health-&-Pandemic-Security-Framework')} class="download-button" style="background-color: #dc2626;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Kinship Garden Framework - Updated Food Systems & Agriculture -->
        <div class="download-card" style="background-color: #f7f9f3; border: 1px solid #a4c639;">
          <div class="card-emoji" style="color: #2D5016;">🌱</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2D5016;">{$t('downloads.implementationFrameworks.kinshipGarden.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.kinshipGarden.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Kinship-Garden-Framework')} class="download-button" style="background-color: #2D5016;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Peace & Conflict Resolution -->
        <div class="download-card">
          <div class="card-emoji" style="color: #6B5CA5;">🕊️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.peace.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.peace.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Peace-Conflict-Resolution')} class="download-button" style="background-color: #6B5CA5;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Financial Systems Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #3A6EA5;">❤️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #3A6EA5;">{$t('downloads.implementationFrameworks.financialSystems.title', 'Financial Systems Framework')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.financialSystems.description', 'A comprehensive framework for implementing financial systems that prioritize human and ecological flourishing, including the Hearts currency system, Love Ledger, and tools for equitable resource distribution.')}</p>
            <button on:click={(e) => handleDownload(e, 'Financial-Systems-Framework')} class="download-button" style="background-color: #3A6EA5;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Work in Liberation Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2C5282;">👥</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.workInLiberation.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.workInLiberation.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Work-in-Liberation-Framework')} class="download-button" style="background-color: #2C5282;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Economic Integration -->
        <div class="download-card">
          <div class="card-emoji" style="color: #B8860B;">💱</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.economic.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.economic.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Economic-Integration')} class="download-button" style="background-color: #B8860B;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Trade & Resource Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2E7D32;">🌍</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.gaianTrade.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.gaianTrade.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Gaian-Trade-Framework')} class="download-button" style="background-color: #2E7D32;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Technology Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #4B8AC2;">🤖</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.technology.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.technology.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Technology-Governance-Framework')} class="download-button" style="background-color: #4B8AC2;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Regenerative Enterprise Framework -->
        <div class="download-card" style="background-color: #f0fdf4; border: 1px solid #bbf7d0;">
          <div class="card-emoji" style="color: #2D5C40;">✨</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2D5C40;">{$t('downloads.implementationFrameworks.regenerativeEnterprise.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.regenerativeEnterprise.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Regenerative-Enterprise-Framework')} class="download-button" style="background-color: #2D5C40;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Sundown Protocol Framework -->
        <div class="download-card" style="background-color: #fff8dc; border: 1px solid #ff6b35;">
          <div class="card-emoji" style="color: #8b4513;">🌇</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #8b4513;">{$t('downloads.implementationFrameworks.sundownProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.sundownProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Sundown-Protocol-Framework')} class="download-button" style="background-color: #8b4513;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Aethelred Accord: Biotechnology Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1565C0;">🧬</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1565C0;">{$t('downloads.implementationFrameworks.aethelredAccord.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.aethelredAccord.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Aethelred-Accord-Biotechnology-Governance')} class="download-button" style="background-color: #1565C0;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Environmental Stewardship -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2D5F2D;">🌿</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.environment.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.environment.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Environmental-Stewardship-Framework')} class="download-button" style="background-color: #2D5F2D;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Climate & Energy Governance -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2C8A78;">⚡</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.climateEnergy.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.climateEnergy.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Climate-Energy-Governance')} class="download-button" style="background-color: #2C8A78;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Water & Sanitation Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #0369a1;">💧</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #0369a1;">{$t('downloads.implementationFrameworks.water.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.water.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Water-&-Sanitation-Framework')} class="download-button" style="background-color: #0369a1;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Biodiversity Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2d5016;">🦅</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2d5016;">{$t('downloads.implementationFrameworks.biodiversity.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.biodiversity.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Biodiversity-Framework')} class="download-button" style="background-color: #2d5016;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Animal Welfare Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1e40af;">🐾</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e40af;">{$t('downloads.implementationFrameworks.animalWelfare.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.animalWelfare.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Animal-Welfare-Framework')} class="download-button" style="background-color: #1e40af;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Disaster Risk Reduction & Resilience Framework -->
        <div class="download-card" style="background-color: #fef3c7; border: 1px solid #d97706;">
          <div class="card-emoji" style="color: #B91C1C;">🌪️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B91C1C;">{$t('downloads.implementationFrameworks.disasterRiskReduction.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.disasterRiskReduction.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Disaster-Risk-Reduction-Framework')} class="download-button" style="background-color: #B91C1C;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Educational Systems -->
        <div class="download-card">
          <div class="card-emoji" style="color: #3f51b5;">🎓</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.education.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.education.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Educational-Systems')} class="download-button" style="background-color: #3f51b5;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mental Health Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1e3a8a;">🧠</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e3a8a;">{$t('downloads.implementationFrameworks.mentalHealth.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.mentalHealth.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Mental-Health-Framework')} class="download-button" style="background-color: #1e3a8a;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Synoptic Protocol Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1e40af;">👁️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1e40af;">{$t('downloads.implementationFrameworks.synopticProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.synopticProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Synoptic-Protocol-Framework')} class="download-button" style="background-color: #1e40af;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Hearthstone Protocol Framework -->
        <div class="download-card" style="background-color: #fef3e2; border: 1px solid #fed7aa;">
          <div class="card-emoji" style="color: #ea580c;">🔥</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #ea580c;">{$t('downloads.implementationFrameworks.hearthstoneProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.hearthstoneProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Hearthstone-Protocol-Framework')} class="download-button" style="background-color: #ea580c;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Conduit Protocol Framework -->
        <div class="download-card" style="background-color: #f0f9ff; border: 1px solid #7dd3fc;">
          <div class="card-emoji" style="color: #0369a1;">🔌</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #0369a1;">{$t('downloads.implementationFrameworks.conduitProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.conduitProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Conduit-Protocol-Framework')} class="download-button" style="background-color: #0369a1;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Kinship Protocol Framework -->
        <div class="download-card" style="background-color: #fef7ff; border: 1px solid #f3e8ff;">
          <div class="card-emoji" style="color: #7c3aed;">🏳️‍🌈</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #7c3aed;">{$t('downloads.implementationFrameworks.kinshipProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.kinshipProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Kinship-Protocol-Framework')} class="download-button" style="background-color: #7c3aed;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Digital Commons -->
        <div class="download-card">
          <div class="card-emoji" style="color: #6d28d9;">💻</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #6d28d9;">{$t('downloads.implementationFrameworks.digital.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.digital.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Digital-Commons-Framework')} class="download-button" style="background-color: #6d28d9;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Bioregional Polis Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2D5F2D;">🏙️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2D5F2D;">{$t('downloads.implementationFrameworks.bioregionalPolis.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.bioregionalPolis.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Bioregional-Polis-Framework')} class="download-button" style="background-color: #2D5F2D;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Living Land Protocol Framework -->
        <div class="download-card" style="background-color: #f5f5dc; border: 1px solid #8fbc8f;">
          <div class="card-emoji" style="color: #2d5016;">🛖</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #2d5016;">{$t('downloads.implementationFrameworks.livingLandProtocol.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.livingLandProtocol.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Living-Land-Protocol-Framework')} class="download-button" style="background-color: #2d5016;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Religious & Spiritual Dialogue -->
        <div class="download-card">
          <div class="card-emoji" style="color: #9B6A8F;">🕯️</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.spiritual.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.spiritual.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Spiritual-Dialogue')} class="download-button" style="background-color: #9B6A8F;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Aging Population Support Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #7c2d12;">🌳</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #7c2d12;">{$t('downloads.implementationFrameworks.aging.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.aging.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Aging-Population-Support-Framework')} class="download-button" style="background-color: #7c2d12;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Consciousness & Inner Development -->
        <div class="download-card">
          <div class="card-emoji" style="color: #4c1d95;">🧘</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #4c1d95;">{$t('downloads.implementationFrameworks.consciousness.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.consciousness.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Consciousness-Inner-Development-Framework')} class="download-button" style="background-color: #4c1d95;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Deep Time & Relativistic Governance Framework -->
        <div class="download-card">
          <div class="card-emoji" style="color: #1A1B3D;">⏳</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #1A1B3D;">{$t('downloads.implementationFrameworks.deepTimeGovernance.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.deepTimeGovernance.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Deep-Time-Governance-Framework')} class="download-button" style="background-color: #1A1B3D;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Method & Tools -->
        <div class="download-card">
          <div class="card-emoji" style="color: #2D8F85;">🧰</div>
          <div class="card-content">
            <h2 class="card-title" style="color: #B8860B;">{$t('downloads.implementationFrameworks.methods-tools.title')}</h2>
            <p class="card-description">{$t('downloads.implementationFrameworks.methods-tools.description')}</p>
            <button on:click={(e) => handleDownload(e, 'Methods-Tools')} class="download-button" style="background-color: #2D8F85;">
              {$t('downloads.downloadButton')}
              <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Language switcher section -->
      <div class="language-section">
        <h3 class="language-title">{$t('downloads.otherLanguages.title')}</h3>
        <div class="language-buttons">
          <button on:click={() => setLocale('en')} style={getLanguageButtonStyle('en')}>
            English
          </button>
          <button on:click={() => setLocale('sv')} style={getLanguageButtonStyle('sv')}>
            Svenska
          </button>
        </div>
      </div>
      
      <div class="other-formats">
        <h3 class="other-formats-title">{$t('downloads.otherFormats.title')}</h3>
        <p class="other-formats-text">
          {$t('downloads.otherFormats.description')} <a href="{base}/contact" class="other-formats-link">{$t('downloads.otherFormats.contactLink')}</a>
        </p>
      </div>
    </div>
  </div>
</section>
