<!-- src/routes/frameworks/meta-governance/+page.svelte -->
<script>
	import { t, locale, isLocaleLoaded } from '$lib/i18n';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';
	import { initializeFrameworkPageScroll } from '$lib/utils/scrollManager.js';
	import { onMount } from 'svelte';

	// --- PROPS ---
	let { data } = $props();

	// --- FRAMEWORK-SPECIFIC DATA ---
	const framework = getFrameworkBySlug('meta-governance');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('quick-start');

	// --- DERIVED STATE ---
	let metaGovernance = $derived($t('metaGovernance') || {});
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

	// --- SECTION GROUPINGS (based on +page.js sections) ---
	const sectionGroups = {
		overview: ['index', 'introduction', 'quick-start'],
		foundation: ['principles', 'value-proposition', 'structural'],
		implementation: ['implementation', 'evaluation', 'case-models'],
		vision: ['future', 'manifesto', 'appendix', 'related']
	};

	// --- NAVIGATION STRUCTURE ---
	const navGroups = [
		{
			id: 'overview',
			titleKey: 'overview',
			defaultTitle: 'Foundation',
			icon: '🏛️', // Classical architecture representing governance
			sections: sectionGroups.overview
		},
		{
			id: 'foundation',
			titleKey: 'foundation',
			defaultTitle: 'Core Principles',
			icon: '⚖️', // Balance representing principles and structure
			sections: sectionGroups.foundation
		},
		{
			id: 'implementation',
			titleKey: 'implementation',
			defaultTitle: 'Implementation & Models',
			icon: '🔧', // Tools representing implementation
			sections: sectionGroups.implementation
		},
		{
			id: 'vision',
			titleKey: 'vision',
			defaultTitle: 'Vision & Future',
			icon: '🔮', // Crystal ball representing future vision
			sections: sectionGroups.vision
		}
	];

	// --- QUICK START GUIDES (for index page) ---
	let quickStartGuides = $derived(() => {
		try {
			const guides = metaGovernance?.quickStart?.guides;
			if (Array.isArray(guides)) {
				return guides;
			}
			// Fallback guides
			return [
				{
					id: 'quick-start',
					icon: '⚡',
					title: 'Quick Start',
					description: '5-minute overview of meta-governance principles and implementation'
				},
				{
					id: 'introduction',
					icon: '🏛️',
					title: 'Introduction',
					description: 'Deep dive into the foundations of coordinated global governance'
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
		...metaGovernance,
		sectionIcons: {
			// Overview
			index: framework?.emoji || '🏛️',
			introduction: '🏛️', // Classical governance
			'quick-start': '⚡', // Lightning for quick start
			
			// Foundation  
			principles: '⚖️', // Balance for principles
			'value-proposition': '💎', // Diamond for value
			structural: '🔧', // Tools for structural
			
			// Implementation
			implementation: '🗺️', // Map for implementation pathway
			evaluation: '📊', // Chart for evaluation
			'case-models': '📋', // Clipboard for case studies
			
			// Vision
			future: '🔮', // Crystal ball for future vision
			manifesto: '📜', // Scroll for manifesto
			appendix: '📚', // Books for appendix
			related: '🔗' // Links for related frameworks
		}
	});

	// --- PAGE-SPECIFIC REACTIVITY ---
	const allQuickStartSections = ['quick-start', 'introduction'];

	// --- SCROLL MANAGEMENT ---
	onMount(() => {
		initializeFrameworkPageScroll();
	});
</script>

<svelte:head>
	<title>
		{i18nPageObject.meta?.title ||
			'Meta-Governance Framework - Coordinated Global Governance'}
	</title>
	<meta
		name="description"
		content={i18nPageObject.meta?.description ||
			'Comprehensive framework for coordinated global governance systems enabling planetary-scale decision-making...'}
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
								<span class="badge-icon">{framework?.emoji || '🏛️'}</span>
								<span>{framework?.title || 'Meta-Governance Framework'}</span>
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
						{i18nPageObject.meta?.title || 'Meta-Governance Framework'}
					</h1>
					<p class="intro-description">
						{i18nPageObject.meta?.description ||
							'Comprehensive framework for coordinated global governance systems enabling planetary-scale decision-making while preserving local autonomy and democratic participation.'}
					</p>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title">
						<span class="title-icon">⚡</span>
						<span>{metaGovernance.navigation?.beginYourJourney || 'Begin Your Journey'}</span>
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
										{selectedGuide === guide.id ? 'Reading' : 'Start Here'}
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
						<span class="btn-icon">🏛️</span>
						<span>{metaGovernance.navigation?.exploreFramework || 'Explore Framework'}</span>
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
					{#if activeSection === 'quick-start'}
						<button
							type="button"
							class="nav-btn"
							on:click={() => setActiveSection('introduction')}
						>
							<span class="btn-icon">🏛️</span>
							<span>Introduction</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'introduction'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('quick-start')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Quick Start</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('principles')}
						>
							<span class="btn-icon">⚖️</span>
							<span>Core Principles</span>
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
									{metaGovernance.errors?.sectionNotFound?.replace('{section}', activeSection) ||
										`Section "${activeSection}" not found`}
								</h2>
								<p>
									{metaGovernance.errors?.contentInDevelopment ||
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
					{#if activeSection === 'principles'}
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
							on:click={() => setActiveSection('value-proposition')}
						>
							<span class="btn-icon">💎</span>
							<span>Value Proposition</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'value-proposition'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('principles')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Principles</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('structural')}
						>
							<span class="btn-icon">🔧</span>
							<span>Structural Components</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'structural'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('value-proposition')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Value Proposition</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('implementation')}
						>
							<span class="btn-icon">🗺️</span>
							<span>Implementation</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'implementation'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('structural')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Structural Components</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('evaluation')}
						>
							<span class="btn-icon">📊</span>
							<span>Evaluation</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'evaluation'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('implementation')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Implementation</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('case-models')}
						>
							<span class="btn-icon">📋</span>
							<span>Case Models</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'case-models'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('evaluation')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Evaluation</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('future')}
						>
							<span class="btn-icon">🔮</span>
							<span>Vision & Future</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'future'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('case-models')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Case Models</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('manifesto')}
						>
							<span class="btn-icon">📜</span>
							<span>Manifesto</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'manifesto'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('future')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Future Vision</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('appendix')}
						>
							<span class="btn-icon">📚</span>
							<span>Appendix</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'appendix'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('manifesto')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Manifesto</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('related')}
						>
							<span class="btn-icon">🔗</span>
							<span>Related Frameworks</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'related'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('appendix')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Appendix</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>
