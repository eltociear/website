<script>
	import { t, locale, isLocaleLoaded } from '$lib/i18n';
	import { getFrameworkBySlug, statusMapping } from '$lib/stores/frameworkNav.js';
	import FrameworkLayout from '$lib/components/FrameworkLayout.svelte';
	import SectionNotice from '$lib/components/SectionNotice.svelte';

	// --- PROPS ---
	let { data } = $props();

	// --- FRAMEWORK-SPECIFIC DATA ---
	const framework = getFrameworkBySlug('indigenous-sovereignty-pathways');

	// --- STATE (for this page's content) ---
	let selectedGuide = $state('preamble');

	// --- DERIVED STATE ---
	let indigenousPathways = $derived($t('indigenousPathways') || {});
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
		overview: ['index', 'preamble', 'core-principles'],
		structure: ['structural-components', 'pathways-from-vision-to-action', 'key-mechanisms'],
		vision: ['vision-of-flourishing', 'interface-existing-systems', 'pathways-broader-engagement'],
		resources: ['supporting-materials-considerations', 'system-map-visual', 'glossary-references']
	};

	// --- NAVIGATION STRUCTURE ---
	const navGroups = [
		{
			id: 'overview',
			titleKey: 'overview',
			defaultTitle: 'Foundation',
			icon: '🌍', // Earth representing global indigenous presence
			sections: sectionGroups.overview
		},
		{
			id: 'structure',
			titleKey: 'structure',
			defaultTitle: 'Structural Components',
			icon: '🏛️', // Structure for governance systems
			sections: sectionGroups.structure
		},
		{
			id: 'vision',
			titleKey: 'vision',
			defaultTitle: 'Vision & Pathways',
			icon: '🌱', // Growth representing vision and pathways
			sections: sectionGroups.vision
		},
		{
			id: 'resources',
			titleKey: 'resources',
			defaultTitle: 'Resources & Integration',
			icon: '📚', // Books for resources and materials
			sections: sectionGroups.resources
		}
	];

	// --- QUICK START GUIDES (for index page) ---
	let quickStartGuides = $derived(() => {
		try {
			const guides = indigenousPathways?.quickStart?.guides;
			if (Array.isArray(guides)) {
				return guides;
			}
			// Fallback guides - focusing on cultural respectful entry points
			return [
				{
					id: 'preamble',
					icon: '🪶', // Feather for ceremony and sacred beginning
					title: 'Sacred Preamble',
					description: 'Begin with ceremonial acknowledgment and foundational understanding'
				},
				{
					id: 'core-principles',
					icon: '⚖️', // Balance representing justice and principles
					title: 'Core Principles',
					description: 'Explore foundational values like bioregional governance and seven-generation accountability'
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
		...indigenousPathways,
		sectionIcons: {
			// Overview/Foundation
			index: '🌍', // Earth representing global indigenous presence
			preamble: '🪶', // Feather for ceremony and sacred beginning
			'core-principles': '⚖️', // Balance for justice and principles
			
			// Structure sections
			'structural-components': '🏛️', // Structure for governance systems
			'pathways-from-vision-to-action': '🌱', // Seedling for planting seeds for seven generations
			'key-mechanisms': '⚙️', // Gears for mechanisms and concepts
			
			// Vision sections
			'vision-of-flourishing': '🌸', // Blossom representing flourishing
			'interface-existing-systems': '🔗', // Link for interfacing
			'pathways-broader-engagement': '🤝', // Handshake for engagement
			
			// Resources
			'supporting-materials-considerations': '🗂️', // Folder for supporting materials
			'system-map-visual': '🗺️', // Map for visual representation
			'glossary-references': '📚' // Books for references
		}
	});

	// --- PAGE-SPECIFIC REACTIVITY ---
	const allQuickStartSections = ['preamble', 'core-principles'];
</script>

<svelte:head>
	<title>
		{indigenousPathways.meta?.title ||
			'Indigenous Sovereignty Pathways - Invitational Framework for Planetary Healing'}
	</title>
	<meta
		name="description"
		content={indigenousPathways.meta?.description ||
			'An invitational framework supporting Indigenous sovereignty and planetary healing through Traditional Ecological Knowledge...'}
	/>
</svelte:head>

<!-- CRITICAL CULTURAL NOTICES - Must be preserved exactly -->
<SectionNotice 
  type="warning" 
  customContent={true}
>
  <p>{$t('common.notices.section.frameworks.text')}</p>
</SectionNotice>

<SectionNotice type="info" title="Current Status: Internal Review (V0.9 Draft)" customContent={true} dismissible={true}>
  <p>This framework is offered as a starting point for conversation. We recognize that authentic governance must emerge from Indigenous communities themselves, and we welcome engagement, correction, or redirection according to community protocols and priorities.</p>
</SectionNotice>

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
								<span class="badge-icon">{framework?.emoji || '🌍'}</span>
								<span>{framework?.title || 'Indigenous Sovereignty Pathways'}</span>
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
						{indigenousPathways.meta?.title || 'Indigenous Sovereignty Pathways'}
					</h1>
					<p class="intro-description">
						{indigenousPathways.meta?.description ||
							'An invitational framework supporting Indigenous sovereignty and planetary healing through Traditional Ecological Knowledge, offered with deep respect for Indigenous communities and their governance protocols.'}
					</p>
				</div>

				<div class="quick-start-section">
					<h2 class="section-title">
						<span class="title-icon">🪶</span>
						<span>Sacred Beginning</span>
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
										{selectedGuide === guide.id ? 'Reading' : 'Begin Here'}
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
						on:click={() => setActiveSection('preamble')}
					>
						<span class="btn-icon">🪶</span>
						<span>Begin with Sacred Preamble</span>
						<span class="btn-arrow">→</span>
					</button>
				</div>
			</div>
		{:else if allQuickStartSections.includes(activeSection)}
			<div class="guide-container">
				<div class="guide-header">
					<button type="button" class="back-btn" on:click={() => setActiveSection('index')}>
						<span>← Return to Sacred Beginning</span>
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
									Return to Sacred Beginning
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'preamble'}
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('core-principles')}
						>
							<span class="btn-icon">⚖️</span>
							<span>Core Principles</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'core-principles'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('preamble')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Sacred Preamble</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('structural-components')}
						>
							<span class="btn-icon">🏛️</span>
							<span>Structural Components</span>
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
									{indigenousPathways.errors?.sectionNotFound?.replace('{section}', activeSection) ||
										`Section "${activeSection}" not found`}
								</h2>
								<p>
									{indigenousPathways.errors?.contentInDevelopment ||
										'This content is still being developed with community guidance.'}
								</p>
								<button
									type="button"
									class="nav-btn secondary"
									on:click={() => setActiveSection('index')}
								>
									<span class="btn-icon">🌍</span>
									<span>Return to Sacred Beginning</span>
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="section-navigation">
					{#if activeSection === 'core-principles'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('preamble')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Sacred Preamble</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('structural-components')}
						>
							<span class="btn-icon">🏛️</span>
							<span>Structural Components</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'structural-components'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('core-principles')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Core Principles</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('pathways-from-vision-to-action')}
						>
							<span class="btn-icon">🌱</span>
							<span>Pathways from Vision to Action</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'pathways-from-vision-to-action'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('structural-components')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Structural Components</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('key-mechanisms')}
						>
							<span class="btn-icon">⚙️</span>
							<span>Key Mechanisms</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'key-mechanisms'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('pathways-from-vision-to-action')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Pathways from Vision to Action</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('vision-of-flourishing')}
						>
							<span class="btn-icon">🌸</span>
							<span>Vision of Flourishing</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'vision-of-flourishing'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('key-mechanisms')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Key Mechanisms</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('interface-existing-systems')}
						>
							<span class="btn-icon">🔗</span>
							<span>Interface with Existing Systems</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'interface-existing-systems'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('vision-of-flourishing')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Vision of Flourishing</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('pathways-broader-engagement')}
						>
							<span class="btn-icon">🤝</span>
							<span>Broader Engagement</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'pathways-broader-engagement'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('interface-existing-systems')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Interface with Systems</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('supporting-materials-considerations')}
						>
							<span class="btn-icon">🗂️</span>
							<span>Supporting Materials</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'supporting-materials-considerations'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('pathways-broader-engagement')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Broader Engagement</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('system-map-visual')}
						>
							<span class="btn-icon">🗺️</span>
							<span>System Map & Visual</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'system-map-visual'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('supporting-materials-considerations')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>Supporting Materials</span>
						</button>
						<button
							type="button"
							class="nav-btn primary"
							on:click={() => setActiveSection('glossary-references')}
						>
							<span class="btn-icon">📚</span>
							<span>Glossary & References</span>
							<span class="btn-arrow">→</span>
						</button>
					{:else if activeSection === 'glossary-references'}
						<button
							type="button"
							class="nav-btn secondary"
							on:click={() => setActiveSection('system-map-visual')}
							style="margin-right: auto;"
						>
							<span class="btn-arrow">←</span>
							<span>System Map & Visual</span>
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</svelte:fragment>
</FrameworkLayout>

<style>
	/* Indigenous & Traditional Knowledge Governance Framework color scheme */
	/* Earth tones representing connection to land, traditional wisdom, and natural cycles */
	:root {
		--indigenous-primary: #1c2b1a; /* Deep Forest Green - ancestral wisdom, land connection */
		--indigenous-secondary: #6b7280; /* Stone Gray - mountains, stability, endurance */
		--indigenous-earth: #92400e; /* Rich Earth Brown - soil, grounding, traditional knowledge */
		--indigenous-water: #0c4a6e; /* Deep Water Blue - rivers, life source, ceremony */
		--indigenous-fire: #dc2626; /* Sacred Fire Red - transformation, ceremony, life force */
		--indigenous-sun: #f59e0b; /* Golden Sun - guidance, renewal, seven generations */
		--indigenous-plant: #15803d; /* Living Plant Green - growth, medicine, traditional foods */
		--indigenous-sky: #3b82f6; /* Sky Blue - vision, dreams, future generations */
		--indigenous-sage: #6b7280; /* Sage Gray - wisdom, balance, traditional governance */
		--indigenous-light: #84cc16; /* Light Green - hope, renewal, youth leadership */
	}

	/* Special Indigenous framework guide card */
	.indigenous-guide-card {
		background: linear-gradient(135deg, rgba(28, 43, 26, 0.08) 0%, rgba(146, 64, 14, 0.08) 100%);
		border-radius: 0.75rem;
		margin-bottom: 2rem;
		border: 1px solid rgba(28, 43, 26, 0.12);
		position: relative;
		overflow: visible;
		box-shadow: 0 4px 6px -1px rgba(28, 43, 26, 0.1);
	}

	.card-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1.5rem;
	}

	.card-icon {
		font-size: 2.5rem;
		color: var(--indigenous-primary);
		flex-shrink: 0;
	}

	.card-text {
		flex: 1;
	}

	.card-text h3 {
		margin: 0 0 0.5rem 0;
		color: var(--indigenous-primary);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.card-text p {
		margin: 0;
		color: #6b7280;
		line-height: 1.5;
	}

	.card-actions {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-shrink: 0;
	}

	.primary-btn {
		background-color: var(--indigenous-primary);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.primary-btn:hover {
		background-color: var(--indigenous-earth);
		transform: translateY(-1px);
	}

	.arrow-icon {
		transition: transform 0.2s;
	}

	.primary-btn:hover .arrow-icon {
		transform: translateX(2px);
	}
</style>
