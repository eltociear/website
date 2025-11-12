<!-- src/routes/frameworks/aegis-protocol/+page.svelte -->
<script>
	import { t, locale, isLocaleLoaded } from '$lib/i18n';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';
	import { initializeFrameworkPageScroll } from '$lib/utils/scrollManager.js';
	import { onMount } from 'svelte';

	// --- PROPS ---
	let { data } = $props();

	// --- FRAMEWORK-SPECIFIC DATA ---
	const framework = getFrameworkBySlug('aegis-protocol');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('at-a-glance');

	// --- DERIVED STATE ---
	let aegisProtocol = $derived($t('aegisProtocol') || {});
	let currentLocale = $derived($locale || 'en');
	let translationsReady = $derived($isLocaleLoaded || false);
	let statusText = $derived(framework ? getStatusText(framework.status) : 'Status Unknown');
	let statusClass = $derived(framework ? getStatusClass(framework.status) : 'concept');

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
		overview: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic'],
		vision: ['introduction-vision', 'foundational-principles', 'integration-architecture'],
		implementation: ['historical-grounding', 'strategic-resilience', 'economic-modeling', 'non-state-integration'],
		mechanics: ['implementation-phases', 'three-pillars', 'root-causes', 'success-metrics'],
		action: ['faq', 'taking-action'],
		briefings: ['strategic-briefing-for-the-russian-federation', 'the-china-engagement-strategy', 'the-european-ally-briefing', 'the-global-south-partnership-proposal'],
		resources: ['appendices']
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
			id: 'vision',
			titleKey: 'vision',
			defaultTitle: 'Vision & Principles',
			icon: '🎯',
			sections: sectionGroups.vision
		},
		{
			id: 'implementation',
			titleKey: 'implementation',
			defaultTitle: 'Implementation Strategy',
			icon: '🏗️',
			sections: sectionGroups.implementation
		},
		{
			id: 'mechanics',
			titleKey: 'mechanics',
			defaultTitle: 'Core Mechanics',
			icon: '⚙️',
			sections: sectionGroups.mechanics
		},
		{
			id: 'action',
			titleKey: 'action',
			defaultTitle: 'Taking Action',
			icon: '🚀',
			sections: sectionGroups.action
		},
		{
			id: 'briefings',
			titleKey: 'briefings',
			defaultTitle: 'Strategic Briefings',
			icon: '🌍',
			sections: sectionGroups.briefings
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
			const guides = aegisProtocol?.quickStart?.guides;
			if (Array.isArray(guides)) {
				return guides;
			}
			// Fallback guides
			return [
				{
					id: 'at-a-glance',
					icon: '⚡',
					title: 'At a Glance',
					description: '5-minute overview of planetary defense architecture'
				},
				{
					id: 'executive-summary-for-the-skeptic',
					icon: '🤔',
					title: 'For Skeptics',
					description: 'Evidence-based case for coordinated civilizational resilience'
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

	// --- PAGE-SPECIFIC I18N OBJECT ---
	let i18nPageObject = $derived({
		...aegisProtocol,
		sectionIcons: {
			index: framework?.emoji || '🛡️',
			'at-a-glance': '⚡',
			'executive-summary-for-the-skeptic': '🤔',
			'introduction-vision': '🎯',
			'foundational-principles': '⚖️',
			'integration-architecture': '🏗️',
			'historical-grounding': '📚',
			'strategic-resilience': '🛡️',
			'economic-modeling': '💰',
			'non-state-integration': '🤝',
			'implementation-phases': '📅',
			'three-pillars': '🏛️',
			'root-causes': '🔍',
			'success-metrics': '📊',
			faq: '❓',
			'taking-action': '🚀',
			'strategic-briefing-for-the-russian-federation': '🇷🇺',
			'the-china-engagement-strategy': '🇨🇳',
			'the-european-ally-briefing': '🇪🇺',
			'the-global-south-partnership-proposal': '🌍',
			appendices: '📋'
		}
	});

	// --- PAGE-SPECIFIC REACTIVITY ---
	const allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];

	// --- SCROLL MANAGEMENT ---
	onMount(() => {
		initializeFrameworkPageScroll();
	});
</script>

<svelte:head>
	<title>
		{i18nPageObject.meta?.title ||
			'Aegis Protocol - Planetary Defense Framework'}
	</title>
	<meta
		name="description"
		content={i18nPageObject.meta?.description ||
			'Comprehensive framework for coordinated civilizational resilience and planetary defense architecture...'}
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
								<span class="badge-icon">{framework?.emoji || '🛡️'}</span>
								<span>{framework?.title || 'Aegis Protocol'}</span>
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
						{i18nPageObject.meta?.title || 'Aegis Protocol'}
					</h1>
					<p class="intro-description">
						{i18nPageObject.meta?.description ||
							'Comprehensive framework for coordinated civilizational resilience and planetary defense architecture against existential risks while preserving democratic governance and cultural sovereignty.'}
					</p>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title">
						<span class="title-icon">⚡</span>
						<span>{aegisProtocol.navigation?.beginYourJourney || 'Quick Start'}</span>
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
						on:click={() => setActiveSection('introduction-vision')}
					>
						<span class="btn-icon">🎯</span>
						<span>{aegisProtocol.navigation?.exploreFramework || 'Explore Framework'}</span>
						<span class="btn-arrow">→</span>
					</button>
				</div>
			</div>
		{:else if allQuickStartSections.includes(activeSection)}
			<div class="guide-container">
				<div class="guide-header">
					<button type="button" class="back-btn" on:click={() => setActiveSection('index')}>
						<span>{aegisProtocol.navigation?.backToFrameworksOverview || '← Back to Overview'}</span>
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
							on:click={() => setActiveSection('introduction-vision')}
						>
							<span class="btn-icon">🎯</span>
							<span>{aegisProtocol.navigation?.exploreFramework || 'Explore Framework'}</span>
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
									{aegisProtocol.errors?.sectionNotFound?.replace('{section}', activeSection) ||
										`Section "${activeSection}" not found`}
								</h2>
								<p>
									{aegisProtocol.errors?.contentInDevelopment ||
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
					{#if activeSection === 'introduction-vision'}
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('foundational-principles')}
						>
							<span class="btn-icon">⚖️</span>
							<span>Foundational Principles</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'integration-architecture'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('foundational-principles')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Principles</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('historical-grounding')}
						>
							<span class="btn-icon">🏗️</span>
							<span>Implementation Strategy</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'non-state-integration'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('economic-modeling')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Economic Modeling</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('implementation-phases')}
						>
							<span class="btn-icon">⚙️</span>
							<span>Core Mechanics</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'success-metrics'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('root-causes')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Root Causes</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('faq')}
						>
							<span class="btn-icon">🚀</span>
							<span>Taking Action</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'taking-action'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('faq')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>FAQ</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('strategic-briefing-for-the-russian-federation')}
						>
							<span class="btn-icon">🌍</span>
							<span>Strategic Briefings</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'the-global-south-partnership-proposal'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('the-european-ally-briefing')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>European Briefing</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('appendices')}
						>
							<span class="btn-icon">📚</span>
							<span>Resources</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if sectionGroups.resources.includes(activeSection)}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('the-global-south-partnership-proposal')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Back to Briefings</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
