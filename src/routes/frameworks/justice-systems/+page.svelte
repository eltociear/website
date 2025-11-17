<!-- src/routes/frameworks/justice-systems/+page.svelte -->
<script>
	import { t, locale, isLocaleLoaded, translations } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';
	import { initializeFrameworkPageScroll } from '$lib/utils/scrollManager.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	const framework = getFrameworkBySlug('justice-systems');
	let selectedGuide = $state('at-a-glance');

	let justiceFramework = $derived($t('justiceFramework') || {});
	let currentLocale = $derived($locale || 'en');
	let translationsReady = $derived($isLocaleLoaded || false);
	let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
	let statusClass = $derived(framework ? getStatusClass(framework.status) : 'concept');

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

	const sectionGroups = {
		overview: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic'],
		foundation: ['introduction', 'governance-structure', 'legal-framework'],
		framework: ['institutional-relationships', 'implementation-mechanisms', 'digital-justice-innovation', 'monitoring-accountability', 'stakeholder-engagement', 'challenges-mitigation'],
		resources: ['timeline-milestones', 'conclusion', 'appendices']
	};

	const navGroups = [
		{ id: 'overview', titleKey: 'overview', defaultTitle: 'Overview', icon: '📋', sections: sectionGroups.overview },
		{ id: 'foundation', titleKey: 'foundation', defaultTitle: 'Foundation', icon: '🏛️', sections: sectionGroups.foundation },
		{ id: 'framework', titleKey: 'framework', defaultTitle: 'Core Framework', icon: '⚖️', sections: sectionGroups.framework },
		{ id: 'resources', titleKey: 'resources', defaultTitle: 'Resources', icon: '📚', sections: sectionGroups.resources }
	];

	let quickStartGuides = $derived(() => {
		try {
			const guides = justiceFramework?.quickStart?.guides;
			if (Array.isArray(guides)) return guides;
			return [
				{ id: 'at-a-glance', icon: '⚡', title: 'At-a-glance', description: '5-minute overview of justice transformation framework' },
				{ id: 'executive-summary-for-the-skeptic', icon: '🤔', title: 'For skeptics', description: 'Evidence-based case for equitable global justice systems' }
			];
		} catch (e) {
			return [
				{ id: 'at-a-glance', icon: '⚡', title: 'At-a-glance', description: '5-minute overview of justice transformation framework' },
				{ id: 'executive-summary-for-the-skeptic', icon: '🤔', title: 'For skeptics', description: 'Evidence-based case for equitable global justice systems' }
			];
		}
	});

	const allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];

	let i18nPageObject = $derived({
		...justiceFramework,
		sectionIcons: {
			index: framework?.emoji || '⚖️',
			'at-a-glance': '⚡',
			'executive-summary-for-the-skeptic': '🤔',
			'introduction': '🏛️',
			'governance-structure': '🏢',
			'legal-framework': '📜',
			'institutional-relationships': '🔗',
			'implementation-mechanisms': '⚙️',
			'digital-justice-innovation': '💻',
			'monitoring-accountability': '📊',
			'stakeholder-engagement': '🤝',
			'challenges-mitigation': '🛡️',
			'timeline-milestones': '📅',
			'conclusion': '🎯',
			'appendices': '📎'
		}
	});

	onMount(() => {
		if (browser) {
			initializeFrameworkPageScroll();
		}
	});
</script>

<svelte:head>
	<title>{i18nPageObject.meta?.title || 'Justice Systems Implementation Framework - Global Justice Transformation'}</title>
	<meta name="description" content={i18nPageObject.meta?.description || 'A comprehensive framework for implementing equitable, transparent, and resilient global justice systems...'} />
</svelte:head>

<FrameworkLayout {framework} {data} {navGroups} {i18nPageObject} {pdfInfo} status={statusInfo}>
	<svelte:fragment slot="default" let:activeSection let:setActiveSection>
		{#if activeSection === 'index'}
			<div class="intro-section">
				<div class="intro-header">
					{#if framework}
						<div class="framework-badges-container">
							<div class="framework-badge">
								<span class="badge-icon">{framework?.emoji || '⚖️'}</span>
								<span>{framework?.title || 'Justice Systems Implementation Framework'}</span>
							</div>
							<div class="framework-meta-badge">
								<span class="status-badge {statusInfo.class}" title={statusInfo.text}>{statusInfo.text}</span>
								{#if framework?.version}<span class="version-badge">v{framework.version}</span>{/if}
							</div>
						</div>
					{/if}
					<h1 class="main-title">{i18nPageObject.meta?.title || 'Justice Systems Implementation Framework'}</h1>
					<p class="intro-description">{i18nPageObject.meta?.description || 'A comprehensive framework for implementing equitable, transparent, and resilient global justice systems aligned with the Moral Operating System.'}</p>
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
					<button type="button" class="nav-btn primary" on:click={() => setActiveSection('introduction')}>
						<span class="btn-icon">🏛️</span><span>Explore Framework</span><span class="btn-arrow">→</span>
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
							<span class="btn-arrow">←</span><span>At-a-glance</span>
						</button>
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('introduction')}>
							<span class="btn-icon">🏛️</span><span>Explore Framework</span><span class="btn-arrow">→</span>
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
								<h2>{justiceFramework.errors?.sectionNotFound?.replace('{section}', activeSection) || `Section "${activeSection}" not found`}</h2>
								<p>{justiceFramework.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
								<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('index')}>
									<span class="btn-icon">🏠</span><span>Return to Overview</span>
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'introduction'}
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('governance-structure')}>
							<span>Governance Structure</span><span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'conclusion'}
						<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('challenges-mitigation')} style="margin-right: auto;">
							<span class="btn-arrow">←</span><span>Challenges & Mitigation</span>
						</button>
						<button type="button" class="nav-btn primary" on:click={() => setActiveSection('appendices')}>
							<span class="btn-icon">📎</span><span>Resources</span><span class="btn-arrow">→</span>
						</button>
					{:else if sectionGroups.resources.includes(activeSection)}
						<button type="button" class="nav-btn secondary" on:click={() => setActiveSection('conclusion')} style="margin-right: auto;">
							<span class="btn-arrow">←</span><span>Back to Framework</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
