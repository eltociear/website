<!-- src/routes/frameworks/financial-systems/+page.svelte -->
<script>
 import { t, locale } from '$lib/i18n';
 import { browser } from '$app/environment';
 import { invalidate } from '$app/navigation';
 import { base } from '$app/paths';
 import SectionNotice from '$lib/components/SectionNotice.svelte';
 import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
 import { onMount, tick } from 'svelte';
 import { slide } from 'svelte/transition';

 export let data;

 // Extract Financial Systems translations for shorter references
 $: financialSystems = $t('financialSystems') || {};
 $: translationFunction = $t;
 
 // Debug logging
 $: if (browser && mounted) {
   console.log('Financial Systems translations:', financialSystems);
   console.log('Has Financial Systems keys:', Object.keys(financialSystems));
 }

 // Keep track of which section is active (for sub-navigation)
 let activeSection = 'index';

 // This will track the current locale for our component
 $: currentLocale = $locale;

 // Check if we're in print mode - simplified to avoid hydration issues
 let isPrintMode = false;
 
 // Client-side only initialization to avoid hydration mismatches
 let mounted = false;
 let initializing = true;

 // If in print mode, we'll show all sections
 $: sectionsToShow = (mounted && isPrintMode) ? Object.keys(data?.sections || {}) : [activeSection];

 // Accordion states - initialize in a way that prevents hydration issues
 let overviewOpen = true; // Start with overview open
 let philosophyOpen = false;
 let coreOpen = false;
 let implementationOpen = false;
 let resourcesOpen = false;

 // Define section groupings - match the Financial Systems structure
 const sectionGroups = {
   overview: ['index', 'at-a-glance', 'executive-summary-for-the-skeptic'],
   philosophy: ['introduction', 'hearts-leaves-philosophy'],
   core: ['core-architecture', 'value-systems-integration', 'hearts-leaves-currency', 'love-ledger-platform', 'governance-model'],
   implementation: ['implementation-roadmap', 'cultural-integration', 'technical-infrastructure', 'crisis-response-protocols', 'framework-integration'],
   resources: ['conclusion', 'appendices']
 };

 // Section icons - tailored to financial systems theme with Hearts emphasis
 const sectionIcons = {
   // Overview cluster
   'index': '❤️',
   'at-a-glance': '⚡',
   'executive-summary-for-the-skeptic': '🤔',
   
   // Philosophy & Foundation
   'introduction': '🌱',
   'hearts-leaves-philosophy': '💚',
   
   // Core Framework
   'core-architecture': '🏗️',
   'value-systems-integration': '🔄',
   'hearts-leaves-currency': '❤️🍃',
   'love-ledger-platform': '📱',
   'governance-model': '🏛️',
   
   // Implementation
   'implementation-roadmap': '🗺️',
   'cultural-integration': '🌍',
   'technical-infrastructure': '⚙️',
   'crisis-response-protocols': '🚨',
   'framework-integration': '🔗',
   
   // Resources
   'conclusion': '🎯',
   'appendices': '📚'
 };

 // Initialize accordion states after mount
 function initializeAccordionStates() {
   // Reset all accordions
   overviewOpen = false;
   philosophyOpen = false;
   coreOpen = false;
   implementationOpen = false;
   resourcesOpen = false;

   // Set initial accordion states based on active section
   if (sectionGroups.overview.includes(activeSection)) {
     overviewOpen = true;
   } else if (sectionGroups.philosophy.includes(activeSection)) {
     philosophyOpen = true;
   } else if (sectionGroups.core.includes(activeSection)) {
     coreOpen = true;
   } else if (sectionGroups.implementation.includes(activeSection)) {
     implementationOpen = true;
   } else if (sectionGroups.resources.includes(activeSection)) {
     resourcesOpen = true;
   } else {
     // Default state for unknown sections
     overviewOpen = true;
   }
 }

 onMount(async () => {
   await tick(); // Wait for DOM to be ready
   mounted = true;
   
   if (browser) {
     // Check print mode only on client
     const urlParams = new URLSearchParams(window.location.search);
     isPrintMode = urlParams.get('print') === 'true';
     
     // Make this function available globally for the PDF generator
     window.showAllSectionsForPrint = () => {
       isPrintMode = true;
     };

     // Handle URL parameters and hash
     const sectionParam = urlParams.get('section');
     
     if (sectionParam && data?.sections?.[sectionParam]) {
       activeSection = sectionParam;
     } else if (window.location.hash) {
       const hash = window.location.hash.substring(1);
       if (hash && data?.sections?.[hash]) {
         activeSection = hash;
       }
     } else {
       // Default to index
       activeSection = 'index';
     }

     // Initialize accordion states after setting active section
     initializeAccordionStates();

     // Listen for hash changes
     const handleHashChange = () => {
       const hash = window.location.hash.substring(1);
       if (hash && data?.sections?.[hash] && activeSection !== hash) {
         activeSection = hash;
         initializeAccordionStates();
         
         // Scroll to content
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
     
     // Cleanup
     return () => {
       window.removeEventListener('hashchange', handleHashChange);
       if (window.showAllSectionsForPrint) {
         delete window.showAllSectionsForPrint;
       }
     };
   }
   
   initializing = false;
 });

 // Function to set active section
 function setActiveSection(section) {
   if (!data?.sections?.[section]) return;
   
   activeSection = section;
   initializeAccordionStates();
   
   if (browser) {
     const url = new URL(window.location.href);
     url.hash = section;
     history.replaceState(null, '', url.toString());

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

 // Get section titles in current language using short references
 function getSectionTitle(section) {
   return financialSystems.sections?.[section] || section;
 }

 // Get section category titles using short references
 function getSectionCategoryTitle(category) {
   return financialSystems.categories?.[category] || category;
 }

 // Function to get shortened section titles for navigation using short references
 function getShortSectionTitle(section) {
   return financialSystems.sectionsShort?.[section] || getSectionTitle(section);
 }

 // Function to download the Financial Systems guide PDF
 function downloadFinancialSystemsGuide(version = '') {
   const versionSuffix = version ? `-${version}` : '';
   const pdfUrl = `${base}/assets/pdf/financial-systems-framework${versionSuffix}-${currentLocale}.pdf`;
   const link = document.createElement('a');
   link.href = pdfUrl;
   link.download = `financial-systems-framework${versionSuffix}.pdf`;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 }

 // Computed values - add safety checks
 $: allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
 $: isQuickStartActive = allQuickStartSections.includes(activeSection);
 $: allCoreSections = [
   ...sectionGroups.philosophy,
   ...sectionGroups.core,
   ...sectionGroups.implementation,
   ...sectionGroups.resources
 ];
 $: isCoreSection = allCoreSections.includes(activeSection);

 // Get quick start guides from translations
 $: quickStartGuides = financialSystems.quickStart?.guides || [
   {
     id: 'at-a-glance',
     icon: '⚡',
     title: 'At a Glance',
     description: '5-minute overview of Hearts & Leaves currency system'
   },
   {
     id: 'executive-summary-for-the-skeptic',
     icon: '🤔',
     title: 'For Skeptics',
     description: 'Evidence-based case for regenerative finance'
   }
 ];

 // For the guide selector
 let selectedGuide = 'at-a-glance';
 
 function selectGuide(guide) {
   selectedGuide = guide;
   setActiveSection(guide);
 }

 // Toggle functions for accordions
 function toggleOverview() {
   overviewOpen = !overviewOpen;
 }

 function togglePhilosophy() {
   philosophyOpen = !philosophyOpen;
 }

 function toggleCore() {
   coreOpen = !coreOpen;
 }

 function toggleImplementation() {
   implementationOpen = !implementationOpen;
 }

 function toggleResources() {
   resourcesOpen = !resourcesOpen;
 }

 // For handling dropdown states
 let isDropdownOpen = false;

 function toggleDropdown() {
   isDropdownOpen = !isDropdownOpen;
 }

 // Close dropdowns when clicking outside
 function handleClickOutside(event) {
   if (browser) {
     const clickedInsideDropdown = event.target.closest('.dropdown');
     if (!clickedInsideDropdown && isDropdownOpen) {
       isDropdownOpen = false;
     }
   }
 }

 // Close dropdown when pressing Escape key
 function handleKeydown(event) {
   if (event.key === 'Escape') {
     isDropdownOpen = false;
   }
 }

 onMount(() => {
   if (browser) {
     document.addEventListener('click', handleClickOutside);
     document.addEventListener('keydown', handleKeydown);
     return () => {
       document.removeEventListener('click', handleClickOutside);
       document.removeEventListener('keydown', handleKeydown);
     };
   }
 });

 // Handle locale changes - add safety check
 $: if (browser && mounted && $locale) {
   invalidate('app:locale');
 }
</script>

<svelte:head>
 <title>{financialSystems.meta?.title || 'Financial Systems Framework: Hearts & Leaves Currency - Global Governance Framework'}</title>
 <meta name="description" content="{financialSystems.meta?.description || 'A comprehensive framework for transforming finance through Hearts currency, Leaves ecological tokens, and Right Relationship economics'}" />
</svelte:head>

{#if mounted}
 <div class="documentation-container">
   {#if !isPrintMode}
     <FrameworkSidebar />
   {/if}

   <div class="content">
     <!-- Quick Access Card for Financial Systems Quick Start -->
     {#if !isPrintMode && !isQuickStartActive && activeSection === 'index'}
       <div class="financial-systems-guide-card">
         <div class="card-content">
           <div class="card-icon">❤️</div>
           <div class="card-text">
             <h3>{financialSystems.quickStart?.new || 'New to Hearts & Leaves?'}</h3>
             <p>{financialSystems.quickStart?.start || 'Start with our quick guides that explain regenerative finance and community-controlled currencies for different audiences.'}</p>
           </div>
           <div class="card-actions">
             <div class="dropdown">
               <button 
                 class="primary-btn dropdown-toggle" 
                 on:click={toggleDropdown}
                 aria-expanded={isDropdownOpen}
                 aria-haspopup="true"
                 type="button"
               >
                 {financialSystems.quickStart?.button || 'Choose Guide'} 
                 <span class="arrow-icon" class:rotated={isDropdownOpen}>▾</span>
               </button>
               <div 
                 class="dropdown-menu" 
                 class:show={isDropdownOpen}
                 role="menu"
                 aria-hidden={!isDropdownOpen}
               >
                 {#each quickStartGuides as guide}
                   <button 
                     class="dropdown-item" 
                     on:click|stopPropagation={() => selectGuide(guide.id)}
                     role="menuitem"
                     type="button"
                   >
                     <span class="guide-icon">{guide.icon}</span>
                     <div class="guide-info">
                       <span class="guide-title">{guide.title}</span>
                       <span class="guide-desc">{guide.description}</span>
                     </div>
                   </button>
                 {/each}
               </div>
             </div>
           </div>
         </div>
       </div>
     {/if}

     <!-- Sub-navigation for Financial Systems framework sections -->
     {#if !isPrintMode && !initializing} 
       <div class="section-nav">
         <!-- Overview Accordion - featuring quick start guides -->
         <div class="nav-accordion">
           <button 
             class="accordion-header overview-header" 
             class:open={overviewOpen}
             class:has-active={sectionGroups.overview.some(section => activeSection === section)}
             on:click={toggleOverview}
           >
             <span class="accordion-icon">🏠</span>
             <span class="accordion-title">{getSectionCategoryTitle('overview')}</span>
             <span class="section-count">({sectionGroups.overview.length})</span>
             <span class="toggle-arrow" class:rotated={overviewOpen}>▼</span>
           </button>
           {#if overviewOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.overview as section}
                 <button 
                   class="nav-item subsection-item" 
                   class:active={activeSection === section}
                   class:featured-item={section === 'at-a-glance' || section === 'executive-summary-for-the-skeptic'}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                   {#if section === 'at-a-glance'}
                     <span class="featured-badge">Quick</span>
                   {:else if section === 'executive-summary-for-the-skeptic'}
                     <span class="featured-badge">Evidence</span>
                   {/if}
                 </button>
               {/each}
             </div>
           {/if}
         </div>

         <!-- Philosophy & Foundation Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={philosophyOpen}
             class:has-active={sectionGroups.philosophy.some(section => activeSection === section)}
             on:click={togglePhilosophy}
           >
             <span class="accordion-icon">💚</span>
             <span class="accordion-title">{getSectionCategoryTitle('philosophy')}</span>
             <span class="section-count">({sectionGroups.philosophy.length})</span>
             <span class="toggle-arrow" class:rotated={philosophyOpen}>▼</span>
           </button>
           {#if philosophyOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.philosophy as section}
                 <button 
                   class="nav-item subsection-item" 
                   class:active={activeSection === section}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                 </button>
               {/each}
             </div>
           {/if}
         </div>

         <!-- Core Framework Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={coreOpen}
             class:has-active={sectionGroups.core.some(section => activeSection === section)}
             on:click={toggleCore}
           >
             <span class="accordion-icon">❤️</span>
             <span class="accordion-title">{getSectionCategoryTitle('core')}</span>
             <span class="section-count">({sectionGroups.core.length})</span>
             <span class="toggle-arrow" class:rotated={coreOpen}>▼</span>
           </button>
           {#if coreOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.core as section}
                 <button 
                   class="nav-item subsection-item" 
                   class:active={activeSection === section}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                 </button>
               {/each}
             </div>
           {/if}
         </div>

         <!-- Implementation Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={implementationOpen}
             class:has-active={sectionGroups.implementation.some(section => activeSection === section)}
             on:click={toggleImplementation}
           >
             <span class="accordion-icon">🚀</span>
             <span class="accordion-title">{getSectionCategoryTitle('implementation')}</span>
             <span class="section-count">({sectionGroups.implementation.length})</span>
             <span class="toggle-arrow" class:rotated={implementationOpen}>▼</span>
           </button>
           {#if implementationOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.implementation as section}
                 <button 
                   class="nav-item subsection-item" 
                   class:active={activeSection === section}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                 </button>
               {/each}
             </div>
           {/if}
         </div>

         <!-- Resources Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={resourcesOpen}
             class:has-active={sectionGroups.resources.some(section => activeSection === section)}
             on:click={toggleResources}
           >
             <span class="accordion-icon">📚</span>
             <span class="accordion-title">{getSectionCategoryTitle('resources')}</span>
             <span class="section-count">({sectionGroups.resources.length})</span>
             <span class="toggle-arrow" class:rotated={resourcesOpen}>▼</span>
           </button>
           {#if resourcesOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.resources as section}
                 <button 
                   class="nav-item subsection-item" 
                   class:active={activeSection === section}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                 </button>
               {/each}
             </div>
           {/if}
         </div>
       </div>
     {/if}

     <!-- Progress indicator for core sections -->
     {#if !isPrintMode && isCoreSection && allCoreSections.length > 0}
       <div class="progress-indicator">
         <div class="progress-bar">
           <div class="progress-fill" style="width: {((allCoreSections.indexOf(activeSection) + 1) / allCoreSections.length * 100)}%"></div>
         </div>
         <span class="progress-text">{financialSystems.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
       </div>
     {/if}

     <!-- Show active section, or all sections in print mode -->
     {#each sectionsToShow as section (section)}
       {#if data?.sections?.[section]}
         <div class="section-content" id={section}>
           <!-- Language fallback notice -->
           {#if !isPrintMode && data.sectionsUsingEnglishFallback?.includes(section)}
             <div class="language-fallback-notice">
               <div class="notice-icon">🌐</div>
               <div class="notice-content">
                 <strong>{financialSystems.languageFallback?.title || 'Content in your language coming soon'}</strong>
                 <p>{financialSystems.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
               </div>
             </div>
           {/if}
           
           <!-- Handle quick start sections specially -->
           {#if allQuickStartSections.includes(section) && section !== 'index'}
             <!-- Quick start selector if we're in one of the guides and not in print mode -->
             {#if !isPrintMode}
               <div class="guide-selector">
                 <h2>{financialSystems.quickStart?.title || 'Financial Systems Quick Start'}</h2>
                 <p>{financialSystems.quickStart?.description || 'Choose the version that best matches your needs:'}</p>
                 
                 <div class="guide-cards">
                   {#each quickStartGuides as guide}
                     <div 
                       class="guide-card" 
                       class:active={activeSection === guide.id}
                       on:click={() => selectGuide(guide.id)}
                     >
                       <div class="guide-icon">{guide.icon}</div>
                       <div class="guide-title">{guide.title}</div>
                       <div class="guide-desc">{guide.description}</div>
                     </div>
                   {/each}
                 </div>
               </div>
             {/if}
             
             <!-- Render the selected Quick Start -->
             <svelte:component this={data.sections[section].default} t={translationFunction} />
             
             <!-- Navigation buttons at bottom of quick start -->
             {#if !isPrintMode}
               <div class="guide-navigation">
                 <button class="secondary-btn" on:click={() => downloadFinancialSystemsGuide(section.replace('-', ''))}>
                   {financialSystems.quickStart?.download || 'Download PDF Version'} <span class="download-icon">↓</span>
                 </button>
                 <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                   {financialSystems.quickStart?.continue || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                 </button>
               </div>
             {/if}
           {:else}
             <!-- Render sections from markdown files -->
             <svelte:component this={data.sections[section].default} t={translationFunction} />
           {/if}

           <!-- Section navigation at bottom of core sections -->
           {#if isCoreSection && !isPrintMode && allCoreSections.length > 0}
             <div class="section-navigation">
               {#if allCoreSections.indexOf(activeSection) > 0}
                 <button class="nav-btn prev-btn" on:click={() => {
                   const currentIndex = allCoreSections.indexOf(activeSection);
                   const prevSection = allCoreSections[currentIndex - 1];
                   setActiveSection(prevSection);
                 }}>
                   ← {financialSystems.navigation?.previousSection || 'Previous Section'}
                 </button>
               {/if}
               
               {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                 <button class="nav-btn next-btn" on:click={() => {
                   const currentIndex = allCoreSections.indexOf(activeSection);
                   const nextSection = allCoreSections[currentIndex + 1];
                   setActiveSection(nextSection);
                 }}>
                   {financialSystems.navigation?.nextSection || 'Next Section'} →
                 </button>
               {/if}
             </div>
           {/if}
         </div>
       {:else}
         <div class="missing-section">
           <h2>{financialSystems.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
           <p>{financialSystems.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
         </div>
       {/if}
     {/each}
   </div>
 </div>
{:else}
 <!-- Loading state to prevent hydration issues -->
 <div class="loading-container">
   <div class="loading-spinner"></div>
   <p>{financialSystems.loading?.text || 'Loading financial systems framework...'}</p>
 </div>
{/if}

<style>
  /* Financial Systems Framework color scheme - Stewardship Theme */
  :root {
    /* Core Palette */
    --financial-primary: #2C5282;   /* Slate Blue */
    --financial-secondary: #2F855A;  /* Forest Green */
    --financial-accent: #D69E2E;    /* Warm Ochre */
    --financial-dark: #1A202C;      /* Deep Charcoal */
    --financial-light: #E2E8F0;     /* Light Slate */
    --financial-background: #FFFFFF; /* White */
    --financial-bg-subtle: #F7FAFC; /* Off-White */

    /* Currency & Semantic Colors */
    --financial-hearts: #C53030;    /* Muted Red */
    --financial-leaves: #38A169;    /* Sage Green */
    --financial-abundance: #D69E2E; /* Warm Ochre */
    --financial-flow: #4299E1;      /* Clear Blue */
    --financial-care: #C53030;      /* Muted Red */
    --financial-wisdom: #4A5568;    /* Charcoal Gray */

    /* Text & Border Colors */
    --financial-text-primary: #2D3748; /* Dark Gray-Blue */
    --financial-text-secondary: #718096;/* Medium Gray */
    --financial-border: #CBD5E0;      /* Lighter Slate */

    /* RGB Components for RGBA() transparency */
    --financial-primary-rgb: 44, 82, 130;
    --financial-secondary-rgb: 47, 133, 90;
    --financial-hearts-rgb: 197, 48, 48;
  }

  /* Layout */
  .documentation-container {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .content {
    min-width: 0;
  }

  .section-content {
    padding-top: 1rem;
    scroll-margin-top: 2rem;
  }

  /* Section Navigation */
  .section-nav {
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--financial-border);
    background-color: var(--financial-bg-subtle);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .nav-section {
    margin-bottom: 0.5rem;
  }

  .nav-accordion {
    margin-bottom: 0.5rem;
    border: 1px solid var(--financial-border);
    border-radius: 0.375rem;
    overflow: hidden;
    background: var(--financial-background);
  }

  .accordion-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--financial-text-primary);
    text-align: left;
  }

  .accordion-header:hover {
    background-color: rgba(var(--financial-primary-rgb), 0.05);
  }

  .accordion-header.has-active {
    background-color: rgba(var(--financial-primary-rgb), 0.1);
    color: var(--financial-primary);
    font-weight: 600;
  }

  .accordion-header.open {
    background-color: rgba(var(--financial-secondary-rgb), 0.1);
    border-bottom: 1px solid var(--financial-border);
  }

  /* Special styling for overview header */
  .overview-header {
    background: linear-gradient(135deg, rgba(var(--financial-primary-rgb), 0.1), rgba(var(--financial-secondary-rgb), 0.1));
    border-bottom: 1px solid rgba(var(--financial-primary-rgb), 0.2);
  }

  .overview-header.has-active {
    background: linear-gradient(135deg, rgba(var(--financial-primary-rgb), 0.15), rgba(var(--financial-secondary-rgb), 0.15));
  }

  .accordion-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .accordion-title {
    flex-grow: 1;
    font-weight: 600;
  }

  .section-count {
    font-size: 0.8rem;
    color: var(--financial-text-secondary);
    font-weight: 400;
  }

  .toggle-arrow {
    font-size: 0.8rem;
    color: var(--financial-text-secondary);
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }

  .toggle-arrow.rotated {
    transform: rotate(180deg);
  }

  .accordion-content {
    border-top: 1px solid var(--financial-border);
    background-color: var(--financial-bg-subtle);
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
    color: var(--financial-text-primary);
    text-align: left;
    border-bottom: 1px solid var(--financial-border);
    position: relative;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .nav-item:hover {
    background-color: rgba(var(--financial-primary-rgb), 0.05);
    color: var(--financial-dark);
  }

  .nav-item.active {
    background-color: var(--financial-primary);
    color: white;
    font-weight: 600;
  }

  .nav-item.active:hover {
    background-color: var(--financial-dark);
  }

  /* Special styling for featured items */
  .featured-item {
    background: linear-gradient(135deg, rgba(var(--financial-primary-rgb), 0.08), rgba(var(--financial-secondary-rgb), 0.08));
    border: 1px solid rgba(var(--financial-primary-rgb), 0.15);
    border-radius: 0.25rem;
    margin: 0.25rem;
    padding-right: 3rem; /* Make space for badge */
  }

  .featured-item.active {
    background: var(--financial-primary);
    border-color: var(--financial-primary);
  }

  .featured-badge {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--financial-abundance);
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .featured-item.active .featured-badge {
    background: rgba(255, 255, 255, 0.2);
  }

  .subsection-item {
    padding-left: 1.5rem;
  }

  .nav-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .nav-title {
    flex-grow: 1;
    text-align: left;
  }

  /* Financial Systems Guide Card */
  .financial-systems-guide-card {
    background: var(--financial-light);
    border-radius: 0.75rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(var(--financial-dark-rgb), 0.1);
    border: 1px solid var(--financial-border);
    overflow: visible !important;
    position: relative;
    z-index: 1;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    position: relative;
    overflow: visible;
  }

  .financial-systems-guide-card .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
    min-width: 300px;
    max-width: 350px;
    overflow: visible;
    border: 1px solid var(--financial-border);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .card-content {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem;
    align-items: center;
    gap: 1.5rem;
  }

  .card-icon {
    font-size: 2.5rem;
    color: var(--financial-primary);
    flex-shrink: 0;
  }

  .card-text {
    flex: 1;
    min-width: 200px;
  }

  .card-text h3 {
    margin: 0 0 0.5rem 0;
    color: var(--financial-primary);
    font-size: 1.25rem;
  }

  .card-text p {
    margin: 0;
    color: var(--financial-text-primary);
    font-size: 1rem;
  }

  /* Buttons */
  .primary-btn {
    background-color: var(--financial-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn:hover {
    background-color: var(--financial-dark);
    transform: translateY(-1px);
  }

  .secondary-btn {
    background-color: var(--financial-background);
    color: var(--financial-primary);
    border: 1px solid var(--financial-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .secondary-btn:hover {
    background-color: var(--financial-light);
    transform: translateY(-1px);
  }

  .nav-btn {
    background-color: var(--financial-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background-color: var(--financial-dark);
    transform: translateY(-1px);
  }
  
  /* Progress indicator */
  .progress-indicator {
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(var(--financial-primary-rgb), 0.1);
    border-radius: 0.5rem;
    border-left: 4px solid var(--financial-primary);
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--financial-light);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--financial-primary), var(--financial-secondary));
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: var(--financial-primary);
    font-weight: 500;
  }

  /* Content styling */
  .content :global(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--financial-primary);
  }

  .content :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--financial-secondary);
  }

  .content :global(h3),
  :global(h4) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: var(--financial-accent);
  }

  :global(h4) {
    font-size: 1.2rem;
  }

  .content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: var(--financial-text-primary);
  }

  /* Blockquotes */
  :global(blockquote) {
    background-color: var(--financial-light);
    border-left: 4px solid var(--financial-primary);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0.5rem;
  }

  :global(blockquote > p:first-child strong) {
    font-size: 1.1rem;
    color: var(--financial-primary);
    display: block;
    margin-bottom: 0.75rem;
  }

  /* Tables */
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
    background: var(--financial-primary);
  }

  :global(.content th) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    text-align: left;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid var(--financial-dark);
  }

  :global(.content td) {
    padding: 0.75rem 1rem;
    border: 1px solid var(--financial-border);
    border-left: none;
    border-right: none;
    vertical-align: top;
  }

  :global(.content tr:nth-child(even)) {
    background-color: var(--financial-bg-subtle);
  }

  :global(.content tr:nth-child(odd)) {
    background-color: var(--financial-background);
  }

  :global(.content tr:hover) {
    background-color: var(--financial-light);
  }

  /* Links */
  .content :global(a) {
    color: var(--financial-primary);
    text-decoration: underline;
    font-weight: 500;
    transition: all 0.2s;
  }

  .content :global(a:hover) {
    color: var(--financial-dark);
    text-decoration: underline;
  }

  .content :global(ul), 
  .content :global(ol) {
    margin: 1rem 0 1.5rem 0;
    padding-left: 1.5rem;
    color: var(--financial-text-primary);
    line-height: 1.6;
  }

  .content :global(ul) {
    list-style-type: none;
  }

  .content :global(ul li) {
    position: relative;
    margin-bottom: 0.5rem;
    padding-left: 1.25rem;
  }

  .content :global(ul li:not(.section-nav li))::before {
    content: "●"; /* Updated for sober theme */
    position: absolute;
    left: 0;
    top: 0;
    font-size: 0.8rem;
    color: var(--financial-primary);
  }

  .content :global(ul ul) {
    margin: 0.5rem 0;
    padding-left: 1.25rem;
  }

  .content :global(ul ul li::before) {
    content: "○"; /* Updated for sober theme */
    font-size: 0.8rem;
    color: var(--financial-secondary);
  }

  .content :global(ul ul ul li::before) {
    content: "-"; /* Updated for sober theme */
    font-size: 0.8rem;
    color: var(--financial-accent);
  }
  
  .content :global(ol) {
    list-style-type: decimal;
  }

  .content :global(li::marker) {
    color: var(--financial-primary);
    font-weight: 500;
  }

  /* --- Missing Section: Guide Selector Cards --- */
  .guide-selector {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--financial-border);
  }
  
  .guide-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .guide-card {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid var(--financial-border);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .guide-card:hover {
    box-shadow: 0 4px 6px rgba(var(--financial-dark-rgb), 0.1);
    transform: translateY(-2px);
    border-color: var(--financial-primary);
  }
  
  .guide-card.active {
    border-color: var(--financial-primary);
    background-color: var(--financial-light);
  }
  
  .guide-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .guide-title {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--financial-primary);
  }
  
  .guide-desc {
    font-size: 0.875rem;
    color: var(--financial-text-secondary);
  }
  
  .guide-info {
    display: flex;
    flex-direction: column;
  }

  /* --- Missing Section: Dropdown Menus --- */
  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1001;
    min-width: 320px;
    max-width: 400px;
    padding: 0.5rem 0;
    background-color: var(--financial-background);
    border: 1px solid var(--financial-border);
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    white-space: normal;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-8px);
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .dropdown-menu.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: var(--financial-text-primary);
    text-align: inherit;
    white-space: normal !important;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  
  .dropdown-item:hover, 
  .dropdown-item:focus {
    color: var(--financial-dark);
    text-decoration: none;
    background-color: var(--financial-light);
  }

  .dropdown-item .guide-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    margin-bottom: 0;
    display: inline-block;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
  }
  
  .dropdown-item .guide-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .dropdown-item .guide-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--financial-primary);
  }
  
  .dropdown-item .guide-desc {
    font-size: 0.8rem;
    color: var(--financial-text-secondary);
    line-height: 1.3;
  }
  
  /* --- Missing Section: Notices & States --- */
  .language-fallback-notice {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    background-color: rgba(var(--financial-secondary-rgb), 0.1);
    border: 1px solid rgba(var(--financial-secondary-rgb), 0.3);
    border-radius: 0.5rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .notice-icon {
    font-size: 1.25rem;
    color: var(--financial-secondary);
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .notice-content strong {
    color: var(--financial-secondary);
    font-size: 0.95rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .notice-content p {
    color: var(--financial-text-primary);
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
    border: 3px solid var(--financial-light);
    border-top: 3px solid var(--financial-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .missing-section {
    text-align: center;
    padding: 3rem 2rem;
    background-color: rgba(var(--financial-hearts-rgb), 0.1);
    border: 1px solid rgba(var(--financial-hearts-rgb), 0.3);
    border-radius: 0.5rem;
    margin: 2rem 0;
  }

  .missing-section h2 {
    color: var(--financial-hearts);
    margin-bottom: 1rem;
  }

  .missing-section p {
    color: var(--financial-text-primary);
    margin-bottom: 2rem;
  }
  
  /* --- Missing Section: Responsive Design --- */
  @media (max-width: 768px) {
    .documentation-container {
      grid-template-columns: 1fr;
    }

    .section-nav {
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

    .subsection-item {
      padding-left: 1rem;
    }

    .card-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .card-actions {
      width: 100%;
      justify-content: center;
    }
        
    .guide-cards {
      flex-direction: column;
    }
    
    .guide-card {
      max-width: none;
    }
  }
</style>
