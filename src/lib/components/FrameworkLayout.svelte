<!-- src/lib/components/FrameworkLayout.svelte -->
<script>
	import { t, locale, isLocaleLoaded } from '$lib/i18n';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { replaceState } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { slide } from 'svelte/transition';

	// --- PROPS ---
	// 1. Use Svelte 5 $props() for runes mode
	let {
		/** The main framework data object */
		framework,
		/** The data object from +page.server.js (contains .sections) */
		data,
		/**
		 * The navigation structure.
		 * Example:
		 * [
		 * {
		 * id: 'overview',
		 * titleKey: 'overview',
		 * defaultTitle: 'Overview',
		 * icon: '📋',
		 * sections: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic']
		 * },
		 * { ... next accordion group ... }
		 * ]
		 */
		navGroups = [],
		/** The main i18n translation object for the page (e.g., planetaryImmuneSystem or treatyFramework) */
		i18nPageObject = {},
		/** PDF info object { path: '...', label: '...' } */
		pdfInfo = { path: '', label: 'Loading...' },
		/** Status object { text: '...', class: '...' } */
		status = { text: 'Unknown', class: 'concept' }
	} = $props();

	// --- STATE ---
	let activeSection = $state('index');
	let isPrintMode = $state(false);
	let mounted = $state(false);
	let initializing = $state(true);

	// Accordion state - now dynamic!
	let accordionState = $state({});

	// --- DERIVED STATE ---
	let currentLocale = $derived($locale);
	let translationsReady = $derived($isLocaleLoaded);
	let sectionIcons = $derived(i18nPageObject.sectionIcons || {});

	// --- FUNCTIONS ---
	function getSectionCategoryTitle(group) {
		const key = group.titleKey;
		const defaultTitle = group.defaultTitle;
		return (
			(translationsReady && i18nPageObject.categories?.[key]) || defaultTitle || key
		);
	}

	function getShortSectionTitle(section) {
		return (
			(translationsReady && i18nPageObject.sectionsShort?.[section]) ||
			(translationsReady && i18nPageObject.sections?.[section]) ||
			section
		);
	}

	function toggleAccordion(groupId) {
		accordionState[groupId] = !accordionState[groupId];
	}

	function initializeAccordionStates() {
		const newStates = {};
		let sectionFound = false;

		for (const group of navGroups) {
			if (group.sections.includes(activeSection)) {
				newStates[group.id] = true;
				sectionFound = true;
			} else {
				newStates[group.id] = false;
			}
		}

		// If section not in any group (or is 'index'), open the first group
		if (!sectionFound && navGroups.length > 0) {
			newStates[navGroups[0].id] = true;
		}
		accordionState = newStates;
	}

	function setActiveSection(section) {
		if (!data?.sections?.[section]) return;
		activeSection = section;
		initializeAccordionStates();
		if (browser) {
			const url = new URL(window.location.href);
			url.hash = section;
			replaceState(url.toString(), {});
			setTimeout(() => {
				const contentElement = document.querySelector('.section-content');
				if (contentElement) {
					contentElement.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
						inline: 'nearest'
					});
				}
			}, 100);
		}
	}

	// --- LIFECYCLE ---
	onMount(async () => {
		await tick();
		mounted = true;

		if (browser) {
			const urlParams = new URLSearchParams(window.location.search);
			isPrintMode = urlParams.get('print') === 'true';

			window.showAllSectionsForPrint = () => {
				isPrintMode = true;
			};

			const sectionParam = urlParams.get('section');

			if (sectionParam && data?.sections?.[sectionParam]) {
				activeSection = sectionParam;
			} else if (window.location.hash) {
				const hash = window.location.hash.substring(1);
				if (hash && data?.sections?.[hash]) {
					activeSection = hash;
				}
			} else {
				activeSection = 'index';
			}

			// Initialize accordions based on navGroups
			initializeAccordionStates();

			const handleHashChange = () => {
				const hash = window.location.hash.substring(1);
				if (hash && data?.sections?.[hash] && activeSection !== hash) {
					activeSection = hash;
					initializeAccordionStates();

					setTimeout(() => {
						const contentElement = document.querySelector('.content');
						if (contentElement) {
							contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
						} else {
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}
					}, 100);
				}
			};
			window.addEventListener('hashchange', handleHashChange);
			initializing = false;

			return () => {
				window.removeEventListener('hashchange', handleHashChange);
				if (window.showAllSectionsForPrint) {
					delete window.showAllSectionsForPrint;
				}
			};
		}
		initializing = false;
	});

	// *** REMOVED THE ERRONEOUS $props() BLOCK HERE ***
</script>

{#if !mounted || initializing}
	<div class="loading-container">
		<div class="loading-spinner"></div>
		<p>Loading {framework?.name || 'Framework'}...</p>
	</div>
{:else}
	{#if data?.sectionsUsingEnglishFallback?.length > 0}
		<div class="language-fallback-notice">
			<div class="notice-icon">🌐</div>
			<div class="notice-content">
				<strong>Language Notice</strong>
				<p>
					Some sections are displayed in English because translations for "{currentLocale}"
					are not yet available. We're working to expand language support for all frameworks.
				</p>
			</div>
		</div>
	{/if}

	<div class="documentation-container" class:print-mode={isPrintMode}>
		{#if !isPrintMode}
			<nav class="section-nav" aria-label="Framework Navigation">
				<div class="back-to-overview">
					<a href="{base}/frameworks" class="back-link">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2.5"
							stroke="currentColor"
							width="16"
							height="16"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
							/>
						</svg>
      <span>
          {(translationsReady && (i18nPageObject.navigation?.backToOverview || $t('common.navigation.backToFrameworks'))) ||
              'Back to Frameworks Overview'}
      </span>
					</a>
				</div>

				{#each navGroups as group}
					<div class="nav-section">
						<button
							type="button"
							class="accordion-header"
							class:open={accordionState[group.id]}
							on:click={() => toggleAccordion(group.id)}
							aria-expanded={accordionState[group.id]}
						>
							<span class="accordion-icon">{group.icon || '📚'}</span>
							<span>{getSectionCategoryTitle(group)}</span>
							<span class="arrow-icon" class:rotated={accordionState[group.id]}>▼</span>
						</button>
						{#if accordionState[group.id]}
							<div class="nav-section-content" transition:slide|local={{ duration: 200 }}>
								{#each group.sections as section}
									{#if data?.sections?.[section]}
										<button
											type="button"
											class="nav-item"
											class:active={activeSection === section}
											on:click={() => setActiveSection(section)}
											data-section={section}
										>
											<span class="nav-icon">{sectionIcons[section] || '📄'}</span>
											<span class="nav-text">{getShortSectionTitle(section)}</span>
										</button>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				<div class="download-section">
					{#if pdfInfo.path}
						<a
							href={pdfInfo.path}
							class="download-btn"
							download
							target="_blank"
							rel="noopener noreferrer"
							title="Download {framework.name} PDF"
						>
							<svg
								class="download-icon"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							<span>{pdfInfo.label}</span>
						</a>
					{:else}
						<button class="download-btn disabled" disabled title="PDF not yet available">
							<svg
								class="download-icon"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
							<span>{pdfInfo.label}</span>
						</button>
					{/if}
				</div>
			</nav>
		{/if}

		<main class="content-area" id="main-content">
			<slot {activeSection} {setActiveSection} />
		</main>
	</div>
{/if}

<style>
	/* ALL STYLES from +page-pis.svelte go here */
	:root {
		--pis-primary: #2b4b8c;
		--pis-secondary: #6b5ca5;
		--pis-accent: #daa520;
		--pis-light: #fffbeb;
		--pis-dark: #1e3a8a;
		--pis-emergency: #dc2626;
		--pis-warning: #f59e0b;
		--pis-success: #10b981;
		--pis-info: #3b82f6;
		--pis-text: #1f2937;
		--pis-text-light: #6b7280;
		--pis-border: #e5e7eb;
		--pis-bg: #ffffff;
		--pis-bg-secondary: #f8fafc;
	}
	.back-to-overview {
		padding: 0 1.5rem 1.5rem 1.5rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: white;
		text-decoration: none;
		font-weight: 600;
		transition: none;
	}
	.back-link:hover {
		color: var(--pis-accent);
	}
	.back-link svg {
		flex-shrink: 0;
	}
	.documentation-container {
		display: grid;
		grid-template-columns: 280px 1fr;
		min-height: 100vh;
		gap: 0;
		background-color: var(--pis-bg-secondary);
	}
	.documentation-container.print-mode {
		display: block;
		grid-template-columns: none;
	}
	.section-nav {
		background: linear-gradient(to bottom right, #2b4b8c, #6b5ca5);
		color: white;
		padding: 1.5rem 0;
		overflow-y: auto;
		height: 100vh;
		position: sticky;
		top: 0;
		box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
	}
	.nav-section {
		margin-bottom: 0.5rem;
	}
	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}
	.accordion-header:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
	}
	.accordion-header.open {
		background-color: rgba(255, 255, 255, 0.15);
		color: white;
	}
	.accordion-icon {
		font-size: 1.1rem;
		flex-shrink: 0;
	}
	.nav-section-content {
		padding-left: 0.5rem;
	}
	.nav-item {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem 0.5rem 2rem;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		border-left: 3px solid transparent;
	}
	.nav-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
		border-left-color: var(--pis-accent);
	}
	.nav-item.active {
		background-color: var(--pis-accent);
		color: var(--pis-dark);
		font-weight: 600;
		border-left-color: var(--pis-light);
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
	}
	.nav-icon {
		font-size: 1rem;
		flex-shrink: 0;
	}
	.nav-text {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.download-section {
		padding: 0 1.5rem;
		margin-bottom: 1.5rem;
	}
	.download-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: var(--pis-accent);
		color: var(--pis-primary);
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}
	.download-btn:hover {
		background-color: var(--pis-light);
		color: var(--pis-dark);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
	.download-icon {
		width: 1.25rem;
		height: 1.25rem;
		stroke-width: 2;
		flex-shrink: 0;
	}
	.content-area {
		padding: 2rem;
		background-color: var(--pis-bg);
		min-height: 100vh;
		overflow-x: auto;
	}
	.content-area :global(.intro-section) {
		max-width: 800px;
		margin: 0 auto;
	}
	.content-area :global(.intro-header) {
		text-align: center;
		margin-bottom: 3rem;
	}
	.content-area :global(.framework-badge) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, var(--pis-primary), var(--pis-secondary));
		color: white;
		padding: 0.5rem 1.25rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		box-shadow: 0 2px 4px rgba(30, 64, 175, 0.2);
	}
	.content-area :global(.badge-icon) {
		font-size: 1.1rem;
	}
	.content-area :global(.framework-badges-container) {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}
	.content-area :global(.framework-meta-badge) {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.content-area :global(.status-badge) {
		display: inline-block;
		font-size: 0.7rem;
		padding: 0.15rem 0.4rem;
		border-radius: 1rem;
		margin-left: 0.5rem;
		vertical-align: middle;
		white-space: nowrap;
	}
	.content-area :global(.status-badge.concept) {
		background-color: #fef3c7;
		color: #92400e;
	}
	.content-area :global(.status-badge.development) {
		background-color: #dbeafe;
		color: #1e40af;
	}
	.content-area :global(.status-badge.review) {
		background-color: #e0e7ff;
		color: #4338ca;
	}
	.content-area :global(.status-badge.community-review) {
		background-color: #fef3c7;
		color: #92400e;
	}
	.content-area :global(.status-badge.ready) {
		background-color: #d1fae5;
		color: #065f46;
	}
	.content-area :global(.status-badge.planned) {
		background-color: #e0e7ff;
		color: #3730a3;
	}
	.content-area :global(.status-badge.coming-soon) {
		background-color: #f3e8ff;
		color: #6b21a8;
	}
	.content-area :global(.version-badge) {
		display: inline-block;
		font-size: 0.65rem;
		padding: 0.1rem 0.3rem;
		border-radius: 0.75rem;
		margin-left: 0.5rem;
		vertical-align: middle;
		background-color: #1e40af;
		color: #ffffff;
		font-weight: 600;
		font-family: 'Monaco', 'Menlo', monospace;
		white-space: nowrap;
	}
	.content-area :global(.main-title) {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--pis-primary);
		margin-bottom: 1rem;
		line-height: 1.2;
	}
	.content-area :global(.intro-description) {
		font-size: 1.1rem;
		color: var(--pis-text-light);
		line-height: 1.6;
		max-width: 600px;
		margin: 0 auto;
	}
	.content-area :global(.quick-start-section) {
		margin: 3rem 0;
	}
	.content-area :global(.section-title) {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--pis-primary);
		margin-bottom: 2rem;
		text-align: center;
		justify-content: center;
	}
	.content-area :global(.title-icon) {
		font-size: 1.5rem;
	}
	.content-area :global(.guide-cards) {
		display: flex;
		gap: 2rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.content-area :global(.guide-card) {
		background: white;
		border: 2px solid var(--pis-border);
		border-radius: 1rem;
		padding: 2rem;
		max-width: 320px;
		transition: all 0.3s;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	.content-area :global(.guide-card:hover) {
		border-color: var(--pis-accent);
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(218, 165, 32, 0.1);
	}
	.content-area :global(.guide-card.active) {
		border-color: var(--pis-primary);
		background: linear-gradient(
			135deg,
			rgba(43, 75, 140, 0.02),
			rgba(107, 92, 165, 0.02)
		);
		box-shadow: 0 4px 12px rgba(30, 64, 175, 0.15);
	}
	.content-area :global(.card-header) {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.content-area :global(.card-icon) {
		font-size: 2rem;
		background: linear-gradient(135deg, var(--pis-light), var(--pis-accent));
		padding: 0.75rem;
		border-radius: 0.75rem;
	}
	.content-area :global(.card-title) {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--pis-primary);
		margin: 0;
	}
	.content-area :global(.card-description) {
		margin-bottom: 1.5rem;
	}
	.content-area :global(.card-description p) {
		color: var(--pis-text-light);
		margin: 0;
		line-height: 1.5;
	}
	.content-area :global(.card-actions) {
		display: flex;
		justify-content: center;
	}
	.content-area :global(.guide-btn) {
		padding: 0.75rem 1.5rem;
		border: 2px solid var(--pis-primary);
		background: white;
		color: var(--pis-primary);
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	.content-area :global(.guide-btn:hover) {
		background: var(--pis-primary);
		color: white;
		transform: translateY(-1px);
	}
	.content-area :global(.guide-btn.primary) {
		background: var(--pis-primary);
		color: white;
	}
	.content-area :global(.guide-btn.primary:hover) {
		background: var(--pis-dark);
	}
	.content-area :global(.guide-container) {
		max-width: 900px;
		margin: 0 auto;
	}
	.content-area :global(.guide-header) {
		margin-bottom: 2rem;
	}
	.content-area :global(.back-btn) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		color: var(--pis-accent);
		font-weight: 600;
		cursor: pointer;
		padding: 0.5rem 0;
		margin-bottom: 1.5rem;
		transition: color 0.2s;
	}
	.content-area :global(.back-btn:hover) {
		color: var(--pis-primary);
	}
	.content-area :global(.guide-navigation) {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	.content-area :global(.guide-nav-btn) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border: 2px solid var(--pis-border);
		background: white;
		color: var(--pis-text);
		border-radius: 0.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	.content-area :global(.guide-nav-btn:hover) {
		border-color: var(--pis-accent);
		background: var(--pis-light);
	}
	.content-area :global(.guide-nav-btn.active) {
		border-color: var(--pis-primary);
		background: var(--pis-primary);
		color: white;
	}
	.content-area :global(.guide-nav-icon) {
		font-size: 1.1rem;
	}
	.content-area :global(.section-container) {
		max-width: 900px;
		margin: 0 auto;
	}
	.content-area :global(.section-content) {
		background: white;
		border-radius: 1rem;
		padding: 2.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		margin-bottom: 2rem;
		border: 1px solid var(--pis-border);
	}
	.content-area :global(.section-navigation),
	.content-area :global(.index-navigation) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
	}
	.content-area :global(.index-navigation) {
		justify-content: center;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--pis-border);
	}
	.content-area :global(.nav-btn) {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border: 2px solid;
		border-radius: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
		font-size: 0.95rem;
	}
	.content-area :global(.nav-btn.primary) {
		border-color: var(--pis-primary);
		background: var(--pis-primary);
		color: white;
	}
	.content-area :global(.nav-btn.primary:hover) {
		background: var(--pis-dark);
		border-color: var(--pis-dark);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(30, 64, 175, 0.2);
	}
	.content-area :global(.nav-btn.secondary) {
		border-color: var(--pis-accent);
		background: white;
		color: var(--pis-accent);
	}
	.content-area :global(.nav-btn.secondary:hover) {
		background: var(--pis-accent);
		color: var(--pis-primary);
		transform: translateY(-1px);
	}
	.content-area :global(.btn-icon) {
		font-size: 1.1rem;
	}
	.content-area :global(.btn-arrow) {
		font-size: 1.1rem;
		font-weight: 700;
	}
	.content-area :global(.content) {
		line-height: 1.7;
		color: var(--pis-text);
	}
	.content-area :global(.content h1) {
		font-size: 2rem;
		font-weight: 800;
		color: var(--pis-primary);
		margin-bottom: 1.5rem;
		line-height: 1.3;
	}
	.content-area :global(.content h2) {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--pis-primary);
		margin-top: 2rem;
		margin-bottom: 1rem;
		line-height: 1.4;
	}
	.content-area :global(.content h3) {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--pis-primary);
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}
	.content-area :global(.content h4) {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--pis-dark);
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}
	.content-area :global(.content p) {
		margin-bottom: 1.25rem;
		color: var(--pis-text);
	}
	.content-area :global(.content strong) {
		font-weight: 700;
		color: var(--pis-primary);
	}
	.content-area :global(.content ul),
	.content-area :global(.content ol) {
		margin-bottom: 1.25rem;
		padding-left: 1.5rem;
	}
	.content-area :global(.content li) {
		margin-bottom: 0.5rem;
		color: var(--pis-text);
	}
	:global(blockquote) {
		background: var(--pis-light);
		border-left: 4px solid var(--pis-accent);
		padding: 1.5rem;
		margin: 2rem 0;
		border-radius: 0 0.5rem 0.5rem 0;
		font-style: italic;
		position: relative;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	:global(blockquote::before) {
		content: '"';
		position: absolute;
		top: -0.5rem;
		left: 1rem;
		font-size: 3rem;
		font-weight: 700;
		color: var(--pis-accent);
		line-height: 1;
	}
	:global(blockquote p:first-child) {
		font-size: 1.1rem;
		color: var(--pis-primary);
		display: block;
		margin-bottom: 0.75rem;
	}
	:global(blockquote p:last-child) {
		margin-top: 0.75rem;
		font-style: italic;
	}
	:global(blockquote a) {
		color: var(--pis-primary);
		text-decoration: underline;
		font-weight: 500;
	}
	:global(blockquote a:hover) {
		color: var(--pis-dark);
	}
	:global(.content table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.95rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		border-radius: 0.375rem;
		overflow: hidden;
	}
	:global(.content thead) {
		background: linear-gradient(
			to right,
			var(--pis-primary),
			var(--pis-secondary)
		);
	}
	:global(.content th) {
		padding: 0.75rem 1rem;
		font-weight: 600;
		text-align: left;
		color: #ffffff;
		border: none;
		border-bottom: 2px solid var(--pis-primary);
	}
	:global(.content td) {
		padding: 0.75rem 1rem;
		border: 1px solid #e5e7eb;
		border-left: none;
		border-right: none;
		vertical-align: top;
	}
	:global(.content tr:nth-child(odd)) {
		background-color: #f3f4f8;
	}
	:global(.content tr:nth-child(even)) {
		background-color: #ffffff;
	}
	:global(.content tr:hover) {
		background-color: var(--pis-light);
	}
	:global(.content tbody tr:last-child td) {
		border-bottom: none;
	}
	.content-area :global(.content a) {
		color: var(--pis-accent);
		text-decoration: underline;
		font-weight: 500;
		transition: all 0.2s;
	}
	.content-area :global(.content a:hover) {
		color: var(--pis-emergency);
		text-decoration: underline;
	}
	.content-area :global(.content a[href^='http']):after,
	.content-area :global(.content a[href^='https']):after {
		content: ' ↗';
		font-size: 0.8em;
		vertical-align: super;
	}
	.content-area :global(.content a[href$='.pdf']):after {
		content: ' ↓';
		font-size: 0.8em;
	}
	.language-fallback-notice {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background-color: rgba(43, 75, 140, 0.1);
		border: 1px solid rgba(43, 75, 140, 0.3);
		border-radius: 0.5rem;
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
	}
	.notice-icon {
		font-size: 1.25rem;
		color: var(--pis-primary);
		flex-shrink: 0;
		margin-top: 0.125rem;
	}
	.notice-content {
		flex: 1;
	}
	.notice-content strong {
		color: var(--pis-primary);
		font-size: 0.95rem;
		display: block;
		margin-bottom: 0.25rem;
	}
	.notice-content p {
		color: #4b5563;
		font-size: 0.875rem;
		margin: 0;
		line-height: 1.5;
	}
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 400px;
		text-align: center;
	}
	.loading-spinner {
		width: 3rem;
		height: 3rem;
		border: 3px solid var(--pis-light);
		border-top: 3px solid var(--pis-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.content-area :global(.missing-section) {
		text-align: center;
		padding: 3rem 2rem;
		background-color: var(--pis-light);
		border: 1px solid var(--pis-accent);
		border-radius: 0.5rem;
		margin: 2rem 0;
	}
	.content-area :global(.missing-section h2) {
		color: var(--pis-emergency);
		margin-bottom: 1rem;
	}
	.content-area :global(.missing-section p) {
		color: #6b7280;
		margin-bottom: 2rem;
	}
	@media (max-width: 768px) {
		.documentation-container {
			grid-template-columns: 1fr;
		}
		.section-nav {
			height: auto;
			position: static;
			padding: 0.75rem;
		}
		.accordion-header {
			padding: 0.5rem 0.75rem;
			font-size: 0.9rem;
		}
		.nav-item {
			padding: 0.5rem 0.75rem;
			font-size: 0.85rem;
		}
		.content-area :global(.card-content) {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
		.content-area :global(.card-actions) {
			width: 100%;
			justify-content: center;
		}
		.content-area :global(.guide-navigation) {
			flex-direction: column;
			gap: 1rem;
		}
		.content-area :global(.guide-navigation button) {
			width: 100%;
		}
		.content-area :global(.guide-cards) {
			flex-direction: column;
		}
		.content-area :global(.guide-card) {
			max-width: none;
		}
		.content-area :global(.section-navigation) {
			flex-direction: column;
			gap: 1rem;
		}
		.content-area :global(.nav-btn) {
			width: 100%;
			margin: 0 !important;
		}
	}
	.arrow-icon {
		display: inline-block;
		margin-left: 0.25rem;
		transition: transform 0.2s ease;
	}
	.arrow-icon.rotated {
		transform: rotate(180deg);
	}
	html {
		scroll-behavior: smooth;
	}
	#main-content {
		scroll-margin-top: 2rem;
	}
	.content-area :global(.section-content) {
		scroll-margin-top: 2rem;
	}
	.content-area :global(.content) {
		scroll-margin-top: 2rem;
		position: relative;
	}
</style>
