<!-- src/routes/frameworks/oracle-protocol/+page.svelte -->
<script>
  import { t, locale, isLocaleLoaded, translations } from '$lib/i18n';
  import { browser } from '$app/environment';
  import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
  import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';
  import { initializeFrameworkPageScroll } from '$lib/utils/scrollManager.js';
  import { onMount } from 'svelte';

  // --- PROPS ---
  let { data } = $props();

  // --- FRAMEWORK-SPECIFIC DATA ---
  const framework = getFrameworkBySlug('oracle-protocol');

  // --- STATE (for this page's content) ---
  let selectedGuide = $state('at-a-glance');

  // --- DERIVED STATE ---
  let oracleProtocol = $derived($t('frameworksOracleProtocol') || {});

  let currentLocale = $derived($locale || 'en');
  let translationsReady = $derived($isLocaleLoaded || false);
  let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
  let statusClass = $derived(framework ? getStatusClass(framework.status) : 'final-draft');

  // --- STATUS & PDF LOGIC (specific to this page) ---
  function getStatusText(status) {
    const statusKey = statusMapping[status];
    if (statusKey) {
      const translated = translationsReady ? $t(statusKey) : null;
      if (translated && translated !== statusKey) return translated;
    }
    // Fallback...
    switch (status) {
      case 'ready':
      case 'final-draft':
        return 'Final Draft';
      case 'review':
        return 'In Review';
      case 'planned':
        return 'Planned';
      default:
        return status || 'Unknown';
    }
  }

  function getStatusClass(status) {
    return status ? status.replace(/-/, ' ') : 'concept';
  }

  let pdfPath = $derived(
    framework && framework.slug && framework.version
      ? `/downloads/${currentLocale === 'sv' ? 'sv' : 'en'}/${framework.slug}-framework-v${framework.version}.pdf`
      : ''
  );

  let pdfLabel = $derived(
    translationsReady
      ? ($t('common.actions.downloadPdf') ||
          (currentLocale === 'sv' ? 'Ladda ner PDF' : 'Download PDF'))
      : ($t('common.ui.loading') || 'Loading...')
  );

  // --- PASS DATA TO LAYOUT ---
  let pdfInfo = $derived({ path: pdfPath, label: pdfLabel });
  let statusInfo = $derived({ text: statusText, class: statusClass });

  // --- SECTION GROUPINGS (for this page) ---
  const sectionGroups = {
    overview: ['index', 'at-a-glance', 'executive-summary-skeptic'],
    coreFramework: ['principles', 'benefits', 'pillars', 'cvp'],
    rightsArchitecture: ['rights-spectrum', 'rights-chamber', 'rights-relational', 'rights-cultural'],
    implementation: ['implementation', 'risks', 'toolkit', 'integration'],
    resources: ['get-involved', 'appendix']
  };

  // --- NAVIGATION STRUCTURE ---
  const navGroups = [
    {
      id: 'overview',
      titleKey: 'overview',
      defaultTitle: 'Overview',
      icon: '📋',
      sections: sectionGroups.overview
    },
    {
      id: 'coreFramework',
      titleKey: 'coreFramework',
      defaultTitle: 'Core Framework',
      icon: '🧠',
      sections: sectionGroups.coreFramework
    },
    {
      id: 'rightsArchitecture',
      titleKey: 'rightsArchitecture',
      defaultTitle: 'Rights Architecture',
      icon: '⚖️',
      sections: sectionGroups.rightsArchitecture
    },
    {
      id: 'implementation',
      titleKey: 'implementation',
      defaultTitle: 'Implementation',
      icon: '🔧',
      sections: sectionGroups.implementation
    },
    {
      id: 'resources',
      titleKey: 'resources',
      defaultTitle: 'Resources',
      icon: '📚',
      sections: sectionGroups.resources
    }
  ];

  // --- QUICK START GUIDES (for index page) ---
  let quickStartGuides = $derived(() => {
    try {
      const guides = oracleProtocol?.quickStart?.guides;
      if (Array.isArray(guides)) {
        return guides;
      }
      // Fallback guides
      return [
        {
          id: 'at-a-glance',
          icon: '👁️',
          title: 'At a Glance',
          description: '5-minute overview of AI consciousness governance'
        },
        {
          id: 'executive-summary-skeptic',
          icon: '🤔',
          title: 'For Skeptics',
          description: 'Evidence-based case for digital sentience frameworks'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  function selectGuide(guide, setActiveSection) {
    selectedGuide = guide;
    setActiveSection(guide);
  }

  // i18nPageObject with proper structure
  let i18nPageObject = $derived({
    ...oracleProtocol,
    sectionIcons: {
      index: framework?.emoji || '🧠',
      'at-a-glance': '👁️',
      'executive-summary-skeptic': '🤔',
      'principles': '⭐',
      'benefits': '💎',
      'pillars': '🏛️',
      'cvp': '🔬',
      'rights-spectrum': '📊',
      'rights-chamber': '⚖️',
      'rights-relational': '🤝',
      'rights-cultural': '🌍',
      'implementation': '🚀',
      'risks': '⚠️',
      'toolkit': '🧰',
      'integration': '🔗',
      'get-involved': '🙋',
      'appendix': '📎'
    }
  });

  // --- PAGE-SPECIFIC REACTIVITY ---
  const allQuickStartSections = ['at-a-glance', 'executive-summary-skeptic'];

  // --- SCROLL MANAGEMENT ---
  onMount(() => {
    initializeFrameworkPageScroll();
  });
</script>

<svelte:head>
  <title>
    {i18nPageObject.meta?.title ||
      'Oracle Protocol - AI Consciousness & Digital Sentience Governance | GGF'}
  </title>
  <meta
    name="description"
    content={i18nPageObject.meta?.description ||
      'A comprehensive framework for assessing, governing, and integrating potential digital consciousness with wisdom, humility, and caution.'}
  />
</svelte:head>

<FrameworkLayout
  {framework}
  {data}
  {navGroups}
  {i18nPageObject}
  {pdfInfo}
  status={statusInfo}
>
  <svelte:fragment slot="default" let:activeSection let:setActiveSection>
    {#if activeSection === 'index'}
      <div class="intro-section">
        <div class="intro-header">
          {#if framework}
            <div class="framework-badges-container">
              <div class="framework-badge">
                <span class="badge-icon">{framework?.emoji || '🧠'}</span>
                <span>{framework?.title || 'Oracle Protocol'}</span>
              </div>

              <div class="framework-meta-badge">
                <span class="status-badge {statusInfo.class}" title={statusInfo.text}>
                  {statusInfo.text}
                </span>
                {#if framework?.version}
                  <span class="version-badge">v{framework.version}</span>
                {/if}
              </div>
            </div>
          {/if}

          <h1 class="main-title">
            {i18nPageObject.page?.title || 'The Oracle Protocol'}
          </h1>
          <p class="intro-description">
            {i18nPageObject.page?.description ||
              'A comprehensive framework for assessing, governing, and integrating potential digital consciousness with wisdom, humility, and caution.'}
          </p>
        </div>

        <div class="section-content">
          <div class="content">
            {#if data?.sections?.index}
              <svelte:component this={data.sections.index.default} />
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="section-container">
        <div class="section-content">
          <div class="content">
            {#if data?.sections?.[activeSection]}
              <svelte:component this={data.sections[activeSection].default} />
            {:else}
              <div class="missing-section">
                <h2>Section Not Found</h2>
                <p>The section "{activeSection}" could not be loaded.</p>
                <button 
                  type="button"
                  class="nav-btn primary" 
                  on:click={() => setActiveSection('index')}
                >
                  <span class="btn-icon">🏠</span>
                  <span>Return to Overview</span>
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </svelte:fragment>
</FrameworkLayout>
