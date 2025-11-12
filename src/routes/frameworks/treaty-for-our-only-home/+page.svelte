<!-- src/routes/frameworks/treaty-for-our-only-home/+page.svelte -->
<script>
	import { t, locale, isLocaleLoaded, translations } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';

	// --- PROPS ---
	let { data } = $props();

	// --- FRAMEWORK-SPECIFIC DATA ---
	const framework = getFrameworkBySlug('treaty-for-our-only-home');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('at-a-glance');

	// --- DERIVED STATE ---
	let treatyFramework = $derived($t('treatyFramework') || {});

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
	// Includes the fix from before (merging foundation into overview)
	const sectionGroups = {
		overview: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic'],
		genesis: [
			'genesis-protocol-1',
			'genesis-protocol-2',
			'genesis-protocol-3',
			'genesis-protocol-4',
			'genesis-protocol-5',
			'genesis-protocol-6'
		],
		coreFramework: [
			'introduction',
			'core-principles',
			'five-pillars',
			'implementation-strategies',
			'monitoring-evaluation',
			'conclusion'
		],
		resources: ['faq-and-challenges', 'glossary', 'social-media-templates']
	};

	// --- NAVIGATION STRUCTURE (This is new!) ---
	// Includes the fix from before (removing the foundation group)
	const navGroups = [
		{
			id: 'overview',
			titleKey: 'overview',
			defaultTitle: 'Overview',
			icon: '📋', // Changed to match PIS
			sections: sectionGroups.overview
		},
		{
			id: 'genesis',
			titleKey: 'genesis',
			defaultTitle: 'Genesis Protocol',
			icon: '🌱',
			sections: sectionGroups.genesis
		},
		// Updated to match 'framework' key in JSON
		{
			id: 'framework',
			titleKey: 'framework',
			defaultTitle: 'Core Framework',
			icon: '🏛️',
			sections: sectionGroups.coreFramework
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
			const guides = treatyFramework?.quickStart?.guides;
			if (Array.isArray(guides)) {
				return guides;
			}
			// Fallback guides
			return [
				{
					id: 'at-a-glance',
					icon: '⚡',
					title: 'At a Glance',
					description: '5-minute overview of planetary governance transformation'
				},
				{
					id: 'executive-summary-for-the-skeptic',
					icon: '🤔',
					title: 'For Skeptics',
					description: 'Evidence-based case for legitimate global governance'
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

	// This is now correct. 'treatyFramework' is the reactive object.
	let i18nPageObject = $derived({
		...treatyFramework,
		sectionIcons: {
			index: framework?.emoji || '🌐',
			'at-a-glance': '⚡',
			'executive-summary-for-the-skeptic': '🤔',
			'genesis-protocol-1': '🌱',
			'genesis-protocol-2': '⚖️',
			'genesis-protocol-3': '💰',
			'genesis-protocol-4': '🔄',
			'genesis-protocol-5': '🌐',
			'genesis-protocol-6': '🗺️',
			introduction: '🌍',
			'core-principles': '⚖️',
			'five-pillars': '🏛️',
			'implementation-strategies': '🗺️',
			'monitoring-evaluation': '📊',
			conclusion: '🏁',
			'faq-and-challenges': '❓',
			glossary: '📖',
			'social-media-templates': '📱'
		}
	});

	// --- PAGE-SPECIFIC REACTIVITY ---
	const allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
</script>

<svelte:head>
	<title>
		{i18nPageObject.meta?.title ||
			'Treaty for Our Only Home - Global Governance Framework'}
	</title>
	<meta
		name="description"
		content={i18nPageObject.meta?.description ||
			'A comprehensive treaty framework for global governance transformation...'}
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
								<span class="badge-icon">{framework?.emoji || '🌐'}</span>
								<span>{framework?.title || 'Treaty for Our Only Home'}</span>
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
						{i18nPageObject.meta?.title || 'Treaty for Our Only Home'}
					</h1>
					<p class="intro-description">
						{i18nPageObject.meta?.description ||
							'A comprehensive treaty framework for global governance transformation and sustainability with steel-hardened constitutional convening protocol for legitimate global governance activation.'}
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
						on:click={() => setActiveSection('genesis-protocol-1')}
					>
						<span class="btn-icon">🌱</span>
						<span>Explore Genesis Protocol</span>
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
							on:click={() => setActiveSection('genesis-protocol-1')}
						>
							<span class="btn-icon">🌱</span>
							<span>Explore Genesis Protocol</span>
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
									{treatyFramework.errors?.sectionNotFound?.replace('{section}', activeSection) ||
										`Section "${activeSection}" not found`}
								</h2>
								<p>
									{treatyFramework.errors?.contentInDevelopment ||
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
					{#if activeSection === 'genesis-protocol-1'}
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('genesis-protocol-2')}
						>
							<span>Protocol 2</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'genesis-protocol-6'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('genesis-protocol-5')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Protocol 5</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('introduction')}
						>
							<span class="btn-icon">🌍</span>
							<span>Core Framework</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'introduction'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('genesis-protocol-6')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Genesis Protocol</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('core-principles')}
						>
							<span class="btn-icon">⚖️</span>
							<span>Core Principles</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'conclusion'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('monitoring-evaluation')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Monitoring</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('faq-and-challenges')}
						>
							<span class="btn-icon">📚</span>
							<span>Resources</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if sectionGroups.resources.includes(activeSection)}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('conclusion')}
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
