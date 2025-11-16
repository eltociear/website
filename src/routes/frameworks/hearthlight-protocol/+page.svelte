<!-- src/routes/frameworks/hearthlight-protocol/+page.svelte -->
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
	const framework = getFrameworkBySlug('hearthlight-protocol');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('at-a-glance');

	// --- DERIVED STATE ---
	let hearthlightFramework = $derived($t('hearthlightFramework') || {});

	let currentLocale = $derived($locale || 'en');
	let translationsReady = $derived($isLocaleLoaded || false);
	let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
	let statusClass = $derived(framework ? getStatusClass(framework.status) : 'concept');

	// --- STATUS & PDF LOGIC (specific to this page) ---
	function getStatusText(status) {
		const statusKey = statusMapping[status];
		if (statusKey) {
			// This is correct: $t is used for a specific string.
			const translated = translationsReady ? $t(statusKey) : null;
			if (translated && translated !== statusKey) return translated;
		}
		// Fallback...
		switch (status) {
			case 'ready':
				return 'Ready';
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

	// --- SECTION GROUPINGS (for this page) ---
	const sectionGroups = {
		overview: ['index', 'at-a-glance', 'executive-summary-skeptics'],
		coreFramework: [
			'vision-purpose',
			'core-principles',
			'framework-architecture',
			'implementation-strategy',
			'ggf-integration',
			'performance-indicators',
			'risk-management',
			'pathways-forward'
		]
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
			id: 'framework',
			titleKey: 'framework',
			defaultTitle: 'Core Framework',
			icon: '🧸',
			sections: sectionGroups.coreFramework
		}
	];

	// --- QUICK START GUIDES (for index page) ---
	let quickStartGuides = $derived(() => {
		try {
			const guides = hearthlightFramework?.quickStart?.guides;
			if (Array.isArray(guides)) {
				return guides;
			}
			// Fallback guides
			return [
				{
					id: 'at-a-glance',
					icon: '⚡',
					title: 'At a Glance',
					description: '5-minute overview of childhood flourishing framework'
				},
				{
					id: 'executive-summary-skeptics',
					icon: '🤔',
					title: 'For Decision-Makers',
					description: 'Evidence-based case for childhood-centered governance'
				}
			];
		} catch (e) {
			console.warn('Error loading quick start guides:', e);
			return [
				{
					id: 'at-a-glance',
					icon: '⚡',
					title: 'At a Glance',
					description: '5-minute overview of childhood flourishing framework'
				},
				{
					id: 'executive-summary-skeptics',
					icon: '🤔',
					title: 'For Decision-Makers',
					description: 'Evidence-based case for childhood-centered governance'
				}
			];
		}
	});

	// For tracking which sections are "quick start" sections
	const allQuickStartSections = ['at-a-glance', 'executive-summary-skeptics'];

	// --- i18n PAGE OBJECT (for meta tags and titles) ---
	let i18nPageObject = $derived({
		...hearthlightFramework,
		sectionIcons: {
			index: framework?.emoji || '🧸',
			'at-a-glance': '⚡',
			'executive-summary-skeptics': '🤔',
			'vision-purpose': '🎯',
			'core-principles': '⚖️',
			'framework-architecture': '🏗️',
			'implementation-strategy': '🗺️',
			'ggf-integration': '🔗',
			'performance-indicators': '📊',
			'risk-management': '🛡️',
			'pathways-forward': '🚀'
		}
	});

	// --- GUIDE LOGIC ---
	function selectGuide(guideId, setActiveSection) {
		selectedGuide = guideId;
		setActiveSection(guideId);
	}

	// --- SCROLL MANAGER ---
	onMount(() => {
		if (browser) {
			console.log('Setting up framework page scroll manager');
			initializeFrameworkPageScroll();
		}
	});
</script>

<svelte:head>
	<title>
		{i18nPageObject.meta?.title || 'Hearthlight Protocol - Framework for Childhood Flourishing'}
	</title>
	<meta
		name="description"
		content={i18nPageObject.meta?.description ||
			'A comprehensive framework for childhood flourishing within regenerative civilization...'}
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
								<span class="badge-icon">{framework?.emoji || '🧸'}</span>
								<span>{framework?.title || 'Hearthlight Protocol'}</span>
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
						{i18nPageObject.meta?.title || 'Hearthlight Protocol'}
					</h1>
					<p class="intro-description">
						{i18nPageObject.meta?.description ||
							'A Framework for Childhood Flourishing - Establishing childhood as a sacred trust at the heart of regenerative civilization, ensuring every child\'s inalienable right to safety, holistic development, and joyful play.'}
					</p>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title">
						<span class="title-icon">⚡</span>
						<span>Quick Start</span>
					</h2>

					<div class="guide-cards">
						{#each quickStartGuides as guide}
							<div class="guide-card" class:active={selectedGuide === guide.id}>
								<div class="card-header">
									<div class="card-icon">{guide.icon}</div>
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
						on:click={() => setActiveSection('vision-purpose')}
					>
						<span class="btn-icon">🧸</span>
						<span>Explore Framework</span>
						<span class="btn-arrow">→</span>
					</button>
				</div>
			</div>
		{:else if allQuickStartSections.includes(activeSection)}
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
								<span>{guide.title}</span>
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
							on:click={() => setActiveSection('executive-summary-skeptics')}
						>
							<span class="btn-icon">🤔</span>
							<span>For Decision-Makers</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'executive-summary-skeptics'}
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
							on:click={() => setActiveSection('vision-purpose')}
						>
							<span class="btn-icon">🧸</span>
							<span>Explore Framework</span>
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
								<h2>
									{hearthlightFramework.errors?.sectionNotFound?.replace('{section}', activeSection) ||
										`Section "${activeSection}" not found`}
								</h2>
								<p>
									{hearthlightFramework.errors?.contentInDevelopment ||
										'This content is still being developed.'}
								</p>
								<button
									type="button"
									class="nav-btn secondary"
									on:click={() => setActiveSection('index')}
								>
									<span class="btn-icon">🏠</span>
									<span>Return to Overview</span>
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'vision-purpose'}
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('core-principles')}
						>
							<span>Core Principles</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'pathways-forward'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('risk-management')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Risk Management</span>
						</button>
					{:else if sectionGroups.coreFramework.includes(activeSection)}
						<!-- Navigation logic for middle sections can be added here -->
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
