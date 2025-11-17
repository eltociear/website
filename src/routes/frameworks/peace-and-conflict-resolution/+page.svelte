<!-- src/routes/frameworks/peace-and-conflict-resolution/+page.svelte -->
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
	const framework = getFrameworkBySlug('peace-and-conflict-resolution');

	// --- STATE ---
	let selectedGuide = $state('at-a-glance');

	// --- DERIVED STATE ---
	let peaceFramework = $derived($t('peaceAndConflictResolution') || {});
	let currentLocale = $derived($locale || 'en');
	let translationsReady = $derived($isLocaleLoaded || false);
	let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
	let statusClass = $derived(framework ? getStatusClass(framework.status) : 'concept');

	// --- FUNCTIONS ---
	function getStatusText(status) {
		const statusKey = statusMapping[status];
		if (statusKey) {
			const translated = translationsReady ? $t(statusKey) : null;
			if (translated && translated !== statusKey) return translated;
		}
		switch (status) {
			case 'ready': return 'Ready';
			case 'review': return 'In Review';
			case 'planned': return 'Planned';
			default: return status || 'Unknown';
		}
	}

	function getStatusClass(status) {
		return status ? status.replace(/-/, ' ') : 'concept';
	}

	function selectGuide(guideId, setActiveSection) {
		selectedGuide = guideId;
		setActiveSection(guideId);
	}

	// --- COMPUTED VALUES ---
	let pdfPath = $derived(
		framework && framework.slug && framework.version
			? `/downloads/${currentLocale === 'sv' ? 'sv' : 'en'}/${framework.slug}-framework-v${framework.version}.pdf`
			: ''
	);

	let pdfLabel = $derived(
		translationsReady
			? ($t('common.actions.downloadPdf') || (currentLocale === 'sv' ? 'Ladda ner PDF' : 'Download PDF'))
			: ($t('common.ui.loading') || 'Loading...')
	);

	let pdfInfo = $derived({ path: pdfPath, label: pdfLabel });
	let statusInfo = $derived({ text: statusText, class: statusClass });

	// --- SECTION GROUPINGS ---
	const sectionGroups = {
		overview: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic', 'preamble'],
		foundation: ['framework-overview', 'theoretical-foundation', 'governance-architecture'],
		operational: ['prevention-early-warning', 'active-conflict-resolution', 'post-conflict-transformation', 'scale-specific-applications'],
		implementation: ['ggf-integration', 'technology-tools', 'training-professional-development', 'cultural-adaptation-decolonization'],
		deployment: ['implementation-roadmap', 'measurement-evaluation', 'risk-management', 'resources-sustainability'],
		resources: ['conclusion', 'implementation-tools'],
		appendices: ['appendix-a-case-studies', 'appendix-b-templates', 'appendix-c-cultural-adaptation', 'appendix-d-technical', 'appendix-e-reference']
	};

	// --- NAVIGATION STRUCTURE ---
	const navGroups = [
		{ id: 'overview', titleKey: 'overview', defaultTitle: 'Overview', icon: '📋', sections: sectionGroups.overview },
		{ id: 'foundation', titleKey: 'foundation', defaultTitle: 'Part I: Foundations', icon: '🏗️', sections: sectionGroups.foundation },
		{ id: 'operational', titleKey: 'operational', defaultTitle: 'Part II: Operational Framework', icon: '⚖️', sections: sectionGroups.operational },
		{ id: 'implementation', titleKey: 'implementation', defaultTitle: 'Part III: Implementation', icon: '🔧', sections: sectionGroups.implementation },
		{ id: 'deployment', titleKey: 'deployment', defaultTitle: 'Part IV: Deployment', icon: '🚀', sections: sectionGroups.deployment },
		{ id: 'resources', titleKey: 'resources', defaultTitle: 'Resources & Tools', icon: '📚', sections: sectionGroups.resources },
		{ id: 'appendices', titleKey: 'appendices', defaultTitle: 'Appendices', icon: '📎', sections: sectionGroups.appendices }
	];

	// --- QUICK START GUIDES ---
	let quickStartGuides = $derived(() => {
		try {
			const guides = peaceFramework?.quickStart?.guides;
			if (Array.isArray(guides)) return guides;
			return [
				{ id: 'at-a-glance', icon: '⚡', title: 'At a glance', description: '5-minute overview of values-based peace transformation' },
				{ id: 'executive-summary-for-the-skeptic', icon: '🤔', title: 'For skeptics', description: 'Evidence-based case for regenerative conflict resolution' }
			];
		} catch (e) {
			return [
				{ id: 'at-a-glance', icon: '⚡', title: 'At a glance', description: '5-minute overview of values-based peace transformation' },
				{ id: 'executive-summary-for-the-skeptic', icon: '🤔', title: 'For skeptics', description: 'Evidence-based case for regenerative conflict resolution' }
			];
		}
	});

	const allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];

	// --- i18n PAGE OBJECT ---
	let i18nPageObject = $derived({
		...peaceFramework,
		sectionIcons: {
			index: framework?.emoji || '🕊️', 'at-a-glance': '⚡', 'executive-summary-for-the-skeptic': '🤔', 'preamble': '🕊️',
			'framework-overview': '🔍', 'theoretical-foundation': '📚', 'governance-architecture': '🏛️',
			'prevention-early-warning': '🚨', 'active-conflict-resolution': '⚖️', 'post-conflict-transformation': '🌱', 'scale-specific-applications': '🎯',
			'ggf-integration': '🔗', 'technology-tools': '🛠️', 'training-professional-development': '🎓', 'cultural-adaptation-decolonization': '🌍',
			'implementation-roadmap': '🗺️', 'measurement-evaluation': '📊', 'risk-management': '🛡️', 'resources-sustainability': '♻️',
			'conclusion': '🏁', 'implementation-tools': '🧰',
			'appendix-a-case-studies': '📋', 'appendix-b-templates': '📄', 'appendix-c-cultural-adaptation': '🌐', 'appendix-d-technical': '⚙️', 'appendix-e-reference': '📖'
		}
	});

	// --- LIFECYCLE ---
	onMount(() => {
		if (browser) {
			initializeFrameworkPageScroll();
		}
	});
</script>

<svelte:head>
	<title>{i18nPageObject.meta?.title || 'Peace & Conflict Resolution Framework - Global Governance Framework'}</title>
	<meta name="description" content={i18nPageObject.meta?.description || 'Building sustainable peace through values-based transformation and regenerative conflict resolution...'} />
</svelte:head>

<FrameworkLayout {framework} {data} {navGroups} {i18nPageObject} {pdfInfo} status={statusInfo}>
	<svelte:fragment slot="default" let:activeSection let:setActiveSection>
		{#if activeSection === 'index'}
			<div class="intro-section">
				<div class="intro-header">
					{#if framework}
						<div class="framework-badges-container">
							<div class="framework-badge">
								<span class="badge-icon">{framework?.emoji || '🕊️'}</span>
								<span>{framework?.title || 'Peace & Conflict Resolution Framework'}</span>
							</div>
							<div class="framework-meta-badge">
								<span class="status-badge {statusInfo.class}" title={statusInfo.text}>{statusInfo.text}</span>
								{#if framework?.version}<span class="version-badge">v{framework.version}</span>{/if}
							</div>
						</div>
					{/if}
					<h1 class="main-title">{i18nPageObject.meta?.title || 'Peace & Conflict Resolution Framework'}</h1>
					<p class="intro-description">{i18nPageObject.meta?.description || 'Building sustainable peace through values-based transformation and regenerative conflict resolution within the Global Governance Frameworks ecosystem.'}</p>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title"><span class="title-icon">⚡</span><span>Quick Start</span></h2>
					<div class="guide-cards">
						{#each quickStartGuides as guide}
							<div class="guide-card" class:active={selectedGuide === guide.id}>
								<div class="card-header">
									<div class="card-icon">{guide.icon}</div>
									<h3 class="card-title">{guide.title}</h3>
								</div>
								<div class="card-description"><p>{guide.description}</p></div>
								<div class="card-actions">
									<button type="button" class="guide-btn" class:primary={selectedGuide === guide.id} on:click={() => selectGuide(guide.id, setActiveSection)}>
										{selectedGuide === guide.id ? 'Reading' : 'Read Guide'}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="index-navigation">
					<button type="button" class="nav-btn primary" on:click={() => setActiveSection('framework-overview')}>
						<span class="btn-icon">🏗️</span><span>Explore Framework</span><span class="btn-arrow">→</span>
					</button>
				</div>
			</div>
		{:else if allQuickStartSections.includes(activeSection)}
			<div class="guide-container">
				<div class="guide-header">
					<button type="button" class="back-btn" on:click={() => setActiveSection('index')}><span>← Back to Overview</span></button>
					<div class="guide-navigation">
						{#each quickStartGuides as guide}
							<button type="button" class="guide-nav-btn" class:active={activeSection === guide.id} on:click={() => setActiveSection(guide.id)}>
								<span class="guide-nav-icon">{guide.icon}</span><span>{guide.title}</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="section-content">
					<div class="content">
						{#if data?.sections?.[activeSection]}
							<svelte:component this={data.sections[activeSection].default} />
						{:else}
        <div class="missing-section">
	        <h2>Section not found</h2><p>The section "{activeSection}" could not be loaded.</p>
	        <button type="button" on:click={() => setActiveSection('index')}>Return to Overview</button>
        </div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'at-a-glance'}
						<button type="button" class="nav-btn" on:click={() => setActiveSection('executive-summary-for-the-skeptic')}>
							<span class="btn-icon">🤔</span><span>For Skeptics</span><span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'executive-summary-for-the-skeptic'}
						<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('at-a-glance')} style="margin-right: auto;">
							<span class="btn-arrow">←</span><span>At a Glance</span>
						</button>
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('framework-overview')}>
							<span class="btn-icon">🔍</span><span>Explore Framework</span><span class="btn-arrow">→</span>
						</button>
					{/if}
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
								<h2>{peaceFramework.errors?.sectionNotFound?.replace('{section}', activeSection) || `Section "${activeSection}" not found`}</h2>
								<p>{peaceFramework.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
								<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('index')}>
									<span class="btn-icon">🏠</span><span>Return to Overview</span>
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'framework-overview'}
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('theoretical-foundation')}>
							<span>Theoretical Foundation</span><span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'conclusion'}
						<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('resources-sustainability')} style="margin-right: auto;">
							<span class="btn-arrow">←</span><span>Resources & Sustainability</span>
						</button>
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('implementation-tools')}>
							<span class="btn-icon">🧰</span><span>Implementation Tools</span><span class="btn-arrow">→</span>
						</button>
					{:else if sectionGroups.appendices.includes(activeSection)}
						<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('implementation-tools')} style="margin-right: auto;">
							<span class="btn-arrow">←</span><span>Back to Resources</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
