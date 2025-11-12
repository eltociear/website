<!-- src/routes/frameworks/planetary-immune-system/+page.svelte -->
<script>
	import { t, locale, isLocaleLoaded } from '$lib/i18n';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';

	// --- PROPS ---
	let { data } = $props();

	// --- FRAMEWORK-SPECIFIC DATA ---
	const framework = getFrameworkBySlug('planetary-immune-system');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('at-a-glance');

	// --- DERIVED STATE ---
	let planetaryImmuneSystem = $derived($t('planetaryImmuneSystem') || {});
	let currentLocale = $derived($locale);
	let translationsReady = $derived($isLocaleLoaded);
	let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
	let statusClass = $derived(framework ? getStatusClass(framework.status) : 'concept');

	// --- PDF & STATUS LOGIC (specific to this page) ---
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

	let pdfPath = $derived(
		framework && framework.slug && framework.version
			? `/downloads/${currentLocale === 'sv' ? 'sv' : 'en'}/${framework.slug}-framework-v${
					framework.version
				}.pdf`
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

	// --- NAVIGATION STRUCTURE (This is new!) ---
	const navGroups = [
		{
			id: 'overview',
			titleKey: 'overview',
			defaultTitle: 'Overview',
			icon: '📋',
			sections: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic']
		},
		{
			id: 'coreFramework',
			titleKey: 'coreFramework',
			defaultTitle: 'Core Framework',
			icon: framework?.emoji || '🌍',
			sections: [
				'introduction',
				'principles',
				'structural',
				'implementation',
				'coordination-response',
				'long-term-stewardship'
			]
		},
		{
			id: 'appendices',
			titleKey: 'appendices',
			defaultTitle: 'Technical Resources',
			icon: '📚',
			sections: [
				'threat-assessment',
				'crisis-protocols',
				'technology-frameworks',
				'resource-mobilization',
				'success-metrics',
				'risk-assessment'
			]
		}
	];

	// --- QUICK START GUIDES (for index page) ---
	let quickStartGuides = $derived(
		planetaryImmuneSystem.quickStart?.guides || [
			{
				id: 'at-a-glance',
				icon: '⚡',
				title: 'At a Glance',
				description: '5-minute overview of civilizational defense'
			},
			{
				id: 'executive-summary-for-the-skeptic',
				icon: '🤔',
				title: 'For Skeptics',
				description: 'Evidence-based case for coordinated existential risk management'
			}
		]
	);

	// This function will be passed to the slot
	function selectGuide(guide, setActiveSection) {
		selectedGuide = guide;
		setActiveSection(guide);
	}

	// This page also needs to define the section icons
	let i18nPageObject = $derived({
		...planetaryImmuneSystem,
		sectionIcons: {
			index: framework?.emoji || '⚠️',
			'at-a-glance': '⚡',
			'executive-summary-for-the-skeptic': '🤔',
			introduction: '🌍',
			principles: '⚖️',
			structural: '🏗️',
			implementation: '🗺️',
			'coordination-response': '🤝',
			'long-term-stewardship': '🌱',
			'threat-assessment': '🔍',
			'crisis-protocols': '🚨',
			'technology-frameworks': '⚙️',
			'resource-mobilization': '💰',
			'success-metrics': '📊',
			'risk-assessment': '📋'
		}
	});
</script>

<svelte:head>
	<title>
		{planetaryImmuneSystem.title ||
			'Planetary Immune System: Existential Risk Response Framework'}
	</title>
	<meta
		name="description"
		content={planetaryImmuneSystem.description ||
			'Emergency response protocol for existential threats - coordinated civilizational defense while preserving democracy and community sovereignty.'}
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
								<span class="badge-icon">{framework.emoji}</span>
								<span>{$t(framework.titleKey)}</span>
							</div>

							<div class="framework-meta-badge">
								<span class="status-badge {statusInfo.class}" title={statusInfo.text}>
									{statusInfo.text}
								</span>
								{#if framework.version}
									<span class="version-badge">{framework.version}</span>
								{/if}
							</div>
						</div>
					{/if}

					<h1 class="main-title">
						{planetaryImmuneSystem.subtitle || 'Existential Risk Response Framework'}
					</h1>

					<div class="intro-description">
						<p>
							{planetaryImmuneSystem.shortDescription ||
								'Emergency response protocol for existential threats - coordinated civilizational defense while preserving democracy and community sovereignty.'}
						</p>
					</div>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title">
						<span class="title-icon">⚡</span>
						{planetaryImmuneSystem.quickStart?.title || 'Quick Start Guides'}
					</h2>

					<div class="guide-cards">
						{#each quickStartGuides as guide}
							<div class="guide-card" class:active={selectedGuide === guide.id}>
								<div class="card-header">
									<span class="card-icon">{guide.icon}</span>
									<h3 class="card-title">{guide.title}</h3>
								</div>
								<div class="card-description">
									<p>{guide.description}</p>
								</div>
								<div class="card-actions">
									<button
										type="button"
										class="guide-btn"
										class:primary={selectedGuide === guide.id}
										on:click={() => selectGuide(guide.id, setActiveSection)}
									>
										{selectedGuide === guide.id ? 'Reading' : 'Read Guide'}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="index-navigation">
					<button
						type="button"
						class="nav-btn primary"
						on:click={() => setActiveSection('introduction')}
					>
						<span class="btn-icon">🌍</span>
						<span>Start Reading Framework</span>
						<span class="btn-arrow">→</span>
					</button>
				</div>
			</div>
		{:else if ['at-a-glance', 'executive-summary-for-the-skeptic'].includes(activeSection)}
			<div class="guide-container">
				<div class="guide-header">
					<button type="button" class="back-btn" on:click={() => setActiveSection('index')}>
						<span>← Back to Overview</span>
					</button>

					<div class="guide-navigation">
						{#each quickStartGuides as guide}
							<button
								type="button"
								class="guide-nav-btn"
								class:active={activeSection === guide.id}
								on:click={() => setActiveSection(guide.id)}
							>
								<span class="guide-nav-icon">{guide.icon}</span>
								<span class="guide-nav-text">{guide.title}</span>
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
								<h2>Section not found</h2>
								<p>The section "{activeSection}" could not be loaded.</p>
								<button type="button" on:click={() => setActiveSection('index')}>
									Return to Overview
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'at-a-glance'}
						<button
							type="button"
							class="nav-btn"
							on:click={() => setActiveSection('executive-summary-for-the-skeptic')}
						>
							<span class="btn-icon">🤔</span>
							<span>For Skeptics</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'executive-summary-for-the-skeptic'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('at-a-glance')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>At a Glance</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('introduction')}
						>
							<span class="btn-icon">🌍</span>
							<span>Read Full Framework</span>
							<span class="btn-arrow">→</span>
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
								<h2>Section not found</h2>
								<p>The section "{activeSection}" could not be loaded.</p>
								<button type="button" on:click={() => setActiveSection('index')}>
									Return to Overview
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'introduction'}
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('principles')}
						>
							<span class="btn-icon">⚖️</span>
							<span>Core Principles</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'principles'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('introduction')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Introduction</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('structural')}
						>
							<span class="btn-icon">🏗️</span>
							<span>Structural Components</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'long-term-stewardship'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('coordination-response')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Coordination & Response</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('threat-assessment')}
						>
							<span class="btn-icon">📚</span>
							<span>Technical Resources</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if ['threat-assessment', 'crisis-protocols', 'technology-frameworks', 'resource-mobilization', 'success-metrics', 'risk-assessment'].includes(activeSection)}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('long-term-stewardship')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Back to Framework</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
