<!-- src/routes/get-involved/+page.svelte -->
<script>
  import { t, locale } from '$lib/i18n';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';

  console.log('Get involved hub page loading...');

  $: currentLocale = $locale;

  $: isSalvageMode = $page.url.searchParams.get('source') === 'salvage';

  // Force scroll to top on navigation to ensure Hero visibility
  afterNavigate(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  });

  // Expanded states for detail sections
  let expandedSection = null;

  function toggleSection(section) {
    expandedSection = expandedSection === section ? null : section;
  }

  // Simple fallback text with bilingual support
  const fallbackText = {
    en: {
      title: 'Get Involved',
      subtitle: 'Help Build the Community These Frameworks Envision',
      heroIntro: 'These frameworks exist as carefully-designed blueprints awaiting the people to bring them to life. Whether you\'re a community organizer, technologist, funder, translator, or advocate—there\'s a role for you in transforming vision into reality.',

      currentStateTitle: 'The Honest Reality',
      
      translationTitle: 'Translation',
      translationDescription: 'Help make these frameworks accessible worldwide by translating content into your language. Even partial translations increase accessibility for non-English speaking communities.',
      translationCta: 'Start Translating',
      
      websiteTitle: 'Website Development',
      websiteDescription: 'Contribute to the technical infrastructure, build new features, and improve the platform that powers this mission. From bug fixes to major features—all contributions welcome.',
      websiteCta: 'Join Developers',
      
      outreachTitle: 'Community & Outreach',
      outreachDescription: 'Spread the vision, build advocacy networks, and connect these frameworks with communities that can benefit from them. Help grow the movement from grassroots to global.',
      outreachCta: 'Build Community',
      
      frameworksTitle: 'Framework Development',
      frameworksDescription: 'Create new governance frameworks, refine existing ones, test implementations, and document lessons learned. Help expand the ecosystem with your domain expertise.',
      frameworksCta: 'Contribute Frameworks',

      fundingTitle: 'Funding & Resources',
      fundingDescription: 'Provide financial support to enable organizational development, pilot projects, and infrastructure building. Help transform frameworks from blueprints to functioning systems.',
      fundingCta: 'Support the Work',

      implementationTitle: 'Implementation & Testing',
      implementationDescription: 'Apply these frameworks in real contexts—your community, organization, or region. Test what works, document what doesn\'t, share learnings with others.',
      implementationCta: 'Implement Frameworks',

      researchTitle: 'Research & Analysis',
      researchDescription: 'Contribute academic rigor, policy analysis, feasibility studies, and evidence-based refinement. Help strengthen frameworks with research and evaluation.',
      researchCta: 'Contribute Research',
      
      whyContribute: 'Why Contribute?',
      
      globalImpact: 'Global Impact Through Local Action',
      
      getStarted: 'Ready to Get Started?',
      
      communityNote: 'Building Together'
    },
    sv: {
      title: 'Engagera dig',
      subtitle: 'Hjälp till att bygga gemenskapen som dessa ramverk föreställer sig',
      heroIntro: 'Dessa ramverk existerar som noggrant utformade ritningar som väntar på människor som kan förverkliga dem. Oavsett om du är en samhällsorganisatör, teknolog, finansiär, översättare eller förespråkare—det finns en roll för dig i att omvandla vision till verklighet.',

      currentStateTitle: 'Den ärliga verkligheten',
      
      translationTitle: 'Översättning',
      translationDescription: 'Hjälp till att göra dessa ramverk tillgängliga över hela världen genom att översätta innehåll till ditt språk. Även partiella översättningar ökar tillgängligheten för icke-engelsktalande samhällen.',
      translationCta: 'Börja översätta',
      
      websiteTitle: 'Webbutveckling',
      websiteDescription: 'Bidra till den tekniska infrastrukturen, bygg nya funktioner och förbättra plattformen som driver detta uppdrag. Från buggfixar till stora funktioner—alla bidrag är välkomna.',
      websiteCta: 'Gå med utvecklare',
      
      outreachTitle: 'Gemenskap & uppsökande verksamhet',
      outreachDescription: 'Sprid visionen, bygg opinionsbildande nätverk och koppla dessa ramverk till samhällen som kan dra nytta av dem. Hjälp till att växa rörelsen från gräsrötter till global.',
      outreachCta: 'Bygg gemenskap',
      
      frameworksTitle: 'Ramverksutveckling',
      frameworksDescription: 'Skapa nya styrningsramverk, förfina befintliga, testa implementeringar och dokumentera lärdomar. Hjälp till att utöka ekosystemet med din domänexpertis.',
      frameworksCta: 'Bidra med ramverk',

      fundingTitle: 'Finansiering & resurser',
      fundingDescription: 'Tillhandahåll ekonomiskt stöd för att möjliggöra organisationsutveckling, pilotprojekt och infrastrukturbyggande. Hjälp till att omvandla ramverk från ritningar till fungerande system.',
      fundingCta: 'Stöd arbetet',

      implementationTitle: 'Implementering & testning',
      implementationDescription: 'Tillämpa dessa ramverk i verkliga sammanhang—din gemenskap, organisation eller region. Testa vad som fungerar, dokumentera vad som inte gör det, dela lärdomar med andra.',
      implementationCta: 'Implementera ramverk',

      researchTitle: 'Forskning & analys',
      researchDescription: 'Bidra med akademisk stringens, policyanalys, genomförbarhetsstudier och evidensbaserad förfining. Hjälp till att stärka ramverk med forskning och utvärdering.',
      researchCta: 'Bidra med forskning',
      
      whyContribute: 'Varför bidra?',
      
      globalImpact: 'Global påverkan genom lokal handling',
      
      getStarted: 'Redo att komma igång?',
      
      communityNote: 'Bygga tillsammans'
    }
  };

  // Simple text function with language support
  function getText(key) {
    // Try the translation system first
    let value = $t(`getInvolved.${key}`);
   
    // If we get a value that's not just the key, use it
    if (value && value !== '' && value !== `getInvolved.${key}`) {
      return value;
    }
    
    // Fallback to language-specific text
    const langTexts = fallbackText[currentLocale] || fallbackText.en;
    return langTexts[key] || fallbackText.en[key] || key;
  }

  function getButtonText(section) {
    return expandedSection === section 
      ? $t('getInvolved.lessDetails') 
      : $t('getInvolved.moreDetails');
  }
</script>

<svelte:head>
  <title>{getText('title')} - Global Governance Framework</title>
  <meta name="description" content={getText('subtitle')} />
</svelte:head>

<div class="page-container">
  <div class="content">
   
    <!-- Hero Section -->
    <div class="hero-section" class:salvage-theme={isSalvageMode}>
      <div class="hero-content">
        {#if isSalvageMode}
          <h1>Join the Salvage Operation</h1>
          <p class="hero-subtitle">The system is terminal. We must build the replacement kernel.</p>
          <p class="hero-intro">
            You have seen the diagnosis. The window for voluntary transition is closing (2030-2035). 
            We need builders, architects, and funders to accelerate the development of the 
            Global Governance Frameworks by 10x. Pick a role below.
          </p>
        {:else}
          <h1>{getText('title')}</h1>
          <p class="hero-subtitle">{getText('subtitle')}</p>
          <p class="hero-intro">{getText('heroIntro')}</p>
        {/if}
      </div>
    </div>

    <!-- Current State Section -->
    <div class="current-state-section">
      <h2>{$t('getInvolved.currentState.title') || getText('currentStateTitle')}</h2>
      <p>{$t('getInvolved.currentState.paragraph1')}</p>
      <p>{$t('getInvolved.currentState.paragraph2')}</p>
    </div>

    <!-- Why Contribute Section -->
    <div class="why-contribute-section">
      <h2>{$t('getInvolved.whyContribute.title') || getText('whyContribute')}</h2>
      <p>{$t('getInvolved.whyContribute.paragraph1')}</p>
      <p>{$t('getInvolved.whyContribute.paragraph2')}</p>
      <p>{$t('getInvolved.whyContribute.paragraph3')}</p>
    </div>

    <!-- Pathways Header -->
    <div class="pathways-header">
      <h2>{$t('getInvolved.pathways.title')}</h2>
      <p>{$t('getInvolved.pathways.intro')}</p>
    </div>

    <!-- Contribution Cards -->
    <div class="contribution-cards">

      <!-- Translation Card -->
      <div class="contribution-card translation-card">
        <div class="card-icon">🌍</div>
        <div class="card-content">
          <h3>{$t('getInvolved.translationTitle') || getText('translationTitle')}</h3>
          <p>{$t('getInvolved.translationDescription') || getText('translationDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('translation')}
          >
            {getButtonText('translation')}
          </button>
          {#if expandedSection === 'translation'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.translationDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.translationDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.translationDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/get-involved/translations" class="card-cta">
            {$t('getInvolved.translationCta') || getText('translationCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>
      
      <!-- Website Development Card -->
      <div class="contribution-card website-card">
        <div class="card-icon">💻</div>
        <div class="card-content">
          <h3>{$t('getInvolved.websiteTitle') || getText('websiteTitle')}</h3>
          <p>{$t('getInvolved.websiteDescription') || getText('websiteDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('website')}
          >
            {getButtonText('translation')}
          </button>
          {#if expandedSection === 'website'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.websiteDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.websiteDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.websiteDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/get-involved/website" class="card-cta">
            {$t('getInvolved.websiteCta') || getText('websiteCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>
      
      <!-- Community & Outreach Card -->
      <div class="contribution-card outreach-card">
        <div class="card-icon">📣</div>
        <div class="card-content">
          <h3>{$t('getInvolved.outreachTitle') || getText('outreachTitle')}</h3>
          <p>{$t('getInvolved.outreachDescription') || getText('outreachDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('outreach')}
          >
            {getButtonText('outreach')}
          </button>
          {#if expandedSection === 'outreach'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.outreachDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.outreachDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.outreachDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/get-involved/outreach" class="card-cta">
            {$t('getInvolved.outreachCta') || getText('outreachCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>
      
      <!-- Framework Development Card -->
      <div class="contribution-card frameworks-card">
        <div class="card-icon">🏗️</div>
        <div class="card-content">
          <h3>{$t('getInvolved.frameworksTitle') || getText('frameworksTitle')}</h3>
          <p>{$t('getInvolved.frameworksDescription') || getText('frameworksDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('frameworks')}
          >
            {getButtonText('frameworks')}
          </button>
          {#if expandedSection === 'frameworks'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.frameworksDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.frameworksDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.frameworksDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/get-involved/frameworks" class="card-cta">
            {$t('getInvolved.frameworksCta') || getText('frameworksCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Funding Card -->
      <div class="contribution-card funding-card">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <h3>{$t('getInvolved.fundingTitle') || getText('fundingTitle')}</h3>
          <p>{$t('getInvolved.fundingDescription') || getText('fundingDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('funding')}
          >
            {getButtonText('funding')}
          </button>
          {#if expandedSection === 'funding'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.fundingDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.fundingDetails.how')}</p>
              <p><strong>{$t('getInvolved.whatsNeeded')}</strong> {$t('getInvolved.fundingDetails.whatNeeded')}</p>
            </div>
          {/if}
          <a href="{base}/get-involved/funding" class="card-cta">
            {$t('getInvolved.fundingCta') || getText('fundingCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Implementation Card -->
      <div class="contribution-card implementation-card">
        <div class="card-icon">🚀</div>
        <div class="card-content">
          <h3>{$t('getInvolved.implementationTitle') || getText('implementationTitle')}</h3>
          <p>{$t('getInvolved.implementationDescription') || getText('implementationDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('implementation')}
          >
            {getButtonText('implementation')}
          </button>
          {#if expandedSection === 'implementation'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.implementationDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.implementationDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.implementationDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/frameworks" class="card-cta">
            {$t('getInvolved.implementationCta') || getText('implementationCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Research Card -->
      <div class="contribution-card research-card">
        <div class="card-icon">🔬</div>
        <div class="card-content">
          <h3>{$t('getInvolved.researchTitle') || getText('researchTitle')}</h3>
          <p>{$t('getInvolved.researchDescription') || getText('researchDescription')}</p>
          <button 
            class="details-toggle"
            on:click={() => toggleSection('research')}
          >
            {getButtonText('research')}
          </button>
          {#if expandedSection === 'research'}
            <div class="details-content">
              <p><strong>{$t('getInvolved.why')}</strong> {$t('getInvolved.researchDetails.why')}</p>
              <p><strong>{$t('getInvolved.how')}</strong> {$t('getInvolved.researchDetails.how')}</p>
              <p><strong>{$t('getInvolved.skills')}</strong> {$t('getInvolved.researchDetails.skills')}</p>
            </div>
          {/if}
          <a href="{base}/contact" class="card-cta">
            {$t('getInvolved.researchCta') || getText('researchCta')} <span class="arrow">→</span>
          </a>
        </div>
      </div>

    </div>

    <!-- Global Impact Section -->
    <div class="global-impact-section">
      <h2>{$t('getInvolved.globalImpact.title') || getText('globalImpact')}</h2>
      <p>{$t('getInvolved.globalImpact.paragraph1')}</p>
      <p>{$t('getInvolved.globalImpact.paragraph2')}</p>
    </div>

    <!-- Get Started Section -->
    <div class="get-started-section">
      <h2>{$t('getInvolved.getStarted.title') || getText('getStarted')}</h2>
      <p>{$t('getInvolved.getStarted.paragraph1')}</p>
      <p>{$t('getInvolved.getStarted.paragraph2')}</p>
      <div class="action-buttons">
        <a href="{base}/contact" class="action-button primary">
          {$t('getInvolved.getStarted.contactCta')}
        </a>
        <a href="https://github.com/GlobalGovernanceFrameworks" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="action-button secondary">
          {$t('getInvolved.getStarted.githubCta')}
        </a>
        <a href="{base}/frameworks" class="action-button tertiary">
          {$t('getInvolved.getStarted.exploreCta')}
        </a>
      </div>
    </div>

    <!-- Community Note Section -->
    <div class="community-note-section">
      <h2>{$t('getInvolved.communityNote.title') || getText('communityNote')}</h2>
      <p>{$t('getInvolved.communityNote.paragraph1')}</p>
      <p>{$t('getInvolved.communityNote.paragraph2')}</p>
      <p>{$t('getInvolved.communityNote.paragraph3')}</p>
    </div>

  </div>
</div>

<style>
  /* Use home page color scheme */
  :root {
    --primary-blue: #2B4B8C;
    --secondary-purple: #6B5CA5;
    --earthy-green: #2D5F2D;
    --warm-gold: #DAA520;
    --dark-gold: #B8860B;
    --light-background: #f8fafc;
    --content-text: #4b5563;
    --border-color: #e5e7eb;
  }

  .page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .content {
    min-width: 0;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, var(--primary-blue), var(--secondary-purple));
    border-radius: 1rem;
    padding: 3rem 2rem;
    margin-bottom: 3rem;
    color: white;
    text-align: center;
  }

  /* Salvage Mode Hero (New) */
  .hero-section.salvage-theme {
    background: linear-gradient(135deg, #1e1b4b 0%, #7c2d12 100%); /* Navy to Dark Amber */
    border-bottom: 4px solid #d97706; /* Gold border */
  }

  .hero-content h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
  }

  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .hero-intro {
    font-size: 1.125rem;
    line-height: 1.7;
    opacity: 0.95;
    max-width: 800px;
    margin: 0 auto;
  }

  /* New Content Sections */
  .current-state-section,
  .why-contribute-section,
  .pathways-header,
  .global-impact-section,
  .get-started-section,
  .community-note-section {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .current-state-section {
    background: linear-gradient(135deg, #fef3e2 0%, #fef9f3 100%);
    border-left: 4px solid var(--warm-gold);
  }

  .why-contribute-section {
    background: linear-gradient(135deg, #f0f9ff 0%, #f8faff 100%);
    border-left: 4px solid var(--primary-blue);
  }

  .community-note-section {
    background: linear-gradient(135deg, #f0fdf4 0%, #f7fef8 100%);
    border-left: 4px solid var(--earthy-green);
  }

  .current-state-section h2,
  .why-contribute-section h2,
  .pathways-header h2,
  .global-impact-section h2,
  .get-started-section h2,
  .community-note-section h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-blue);
    margin-bottom: 1rem;
  }

  .current-state-section p,
  .why-contribute-section p,
  .pathways-header p,
  .global-impact-section p,
  .get-started-section p,
  .community-note-section p {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--content-text);
    margin-bottom: 1rem;
  }

  .pathways-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  /* Contribution Cards */
  .contribution-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .contribution-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .contribution-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .card-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-blue);
    margin-bottom: 1rem;
  }

  .card-content p {
    color: var(--content-text);
    line-height: 1.6;
    margin-bottom: 1rem;
    flex-grow: 1;
  }

  .details-toggle {
    background: none;
    border: 1px solid var(--border-color);
    color: var(--primary-blue);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    transition: all 0.2s;
  }

  .details-toggle:hover {
    background: var(--light-background);
    border-color: var(--primary-blue);
  }

  .details-content {
    background: var(--light-background);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--content-text);
  }

  .details-content strong {
    color: var(--primary-blue);
  }

  .card-cta {
    display: inline-block;
    background: var(--warm-gold);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s;
    text-align: center;
  }

  .card-cta:hover {
    background: var(--dark-gold);
  }

  .arrow {
    margin-left: 0.5rem;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    justify-content: center;
  }

  .action-button {
    padding: 0.875rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
    text-align: center;
  }

  .action-button.primary {
    background: var(--primary-blue);
    color: white;
  }

  .action-button.primary:hover {
    background: #1e3a6b;
  }

  .action-button.secondary {
    background: var(--warm-gold);
    color: white;
  }

  .action-button.secondary:hover {
    background: var(--dark-gold);
  }

  .action-button.tertiary {
    background: white;
    color: var(--primary-blue);
    border: 2px solid var(--primary-blue);
  }

  .action-button.tertiary:hover {
    background: var(--primary-blue);
    color: white;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-content h1 {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.25rem;
    }

    .hero-intro {
      font-size: 1rem;
    }

    .contribution-cards {
      grid-template-columns: 1fr;
    }

    .action-buttons {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
    }
  }
</style>
