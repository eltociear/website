<!-- src/routes/frameworks/adaptive-universal-basic-income/+page.svelte -->
<script>
 import { t, locale } from '$lib/i18n';
 import { browser } from '$app/environment';
 import { invalidate } from '$app/navigation';
 import { base } from '$app/paths';
 import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
 import { onMount, tick } from 'svelte';
 import { slide } from 'svelte/transition';

 export let data;

 // Extract AUBI translations for shorter references
 $: aubi = $t('aubi') || {};
 $: translationFunction = $t;
 
 // Debug logging
 $: if (browser && mounted) {
   console.log('AUBI translations:', aubi);
   console.log('Has AUBI keys:', Object.keys(aubi));
 }

 // Keep track of which section is active (for sub-navigation)
 let activeSection = 'introduction';

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
 let foundationsOpen = false;
 let economicsOpen = false;
 let governanceOpen = false;
 let implementationOpen = false;
 let resourcesOpen = false;

 // Define section groupings - match the AUBI framework structure
 const sectionGroups = {
   overview: ['index', 'at-a-glance', 'technical-fact-sheet', 'executive-summary-for-the-skeptic'],
   foundations: ['introduction', 'aubi-philosophy', 'core-architecture'],
   economics: ['four-layer-payout-system', 'hearts-leaves-currency', 'framework-integration'],
   governance: ['governance-model', 'cultural-integration', 'crisis-response-protocols'],
   implementation: ['implementation-roadmap', 'technical-infrastructure'],
   resources: ['conclusion', 'appendices']
 };

 // Section icons - tailored to economic governance theme
 const sectionIcons = {
   // Overview cluster
   'index': '💰',
   'at-a-glance': '⚡',
   'technical-fact-sheet': '📊',
   'executive-summary-for-the-skeptic': '🤔',
   
   // Foundations & Core Philosophy
   'introduction': '🌱',
   'aubi-philosophy': '❤️',
   'core-architecture': '🏗️',
   
   // Economics & Currency
   'four-layer-payout-system': '📊',
   'hearts-leaves-currency': '💚',
   'framework-integration': '🌐',
   
   // Governance & Culture
   'governance-model': '🏛️',
   'cultural-integration': '🤝',
   'crisis-response-protocols': '🚨',
   
   // Implementation & Infrastructure
   'implementation-roadmap': '🗺️',
   'technical-infrastructure': '⚙️',
   
   // Conclusion & Resources
   'conclusion': '🎯',
   'appendices': '📚'
 };

 // Initialize accordion states after mount
 function initializeAccordionStates() {
   // Reset all accordions
   overviewOpen = false;
   foundationsOpen = false;
   economicsOpen = false;
   governanceOpen = false;
   implementationOpen = false;
   resourcesOpen = false;

   // Set initial accordion states based on active section
   if (sectionGroups.overview.includes(activeSection)) {
     overviewOpen = true;
   } else if (sectionGroups.foundations.includes(activeSection)) {
     foundationsOpen = true;
   } else if (sectionGroups.economics.includes(activeSection)) {
     economicsOpen = true;
   } else if (sectionGroups.governance.includes(activeSection)) {
     governanceOpen = true;
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
       // Default to introduction
       activeSection = 'introduction';
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
   return aubi.sections?.[section] || section;
 }

 // Get section category titles using short references
 function getSectionCategoryTitle(category) {
   return aubi.categories?.[category] || category;
 }

 // Function to get shortened section titles for navigation using short references
 function getShortSectionTitle(section) {
   return aubi.sectionsShort?.[section] || getSectionTitle(section);
 }

 // Function to download the AUBI framework guide PDF
 function downloadAubiGuide(version = '') {
   const versionSuffix = version ? `-${version}` : '';
   const pdfUrl = `${base}/assets/pdf/aubi-framework${versionSuffix}-${currentLocale}.pdf`;
   const link = document.createElement('a');
   link.href = pdfUrl;
   link.download = `aubi-framework${versionSuffix}.pdf`;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 }

 // Computed values - add safety checks
 $: allQuickStartSections = ['at-a-glance', 'technical-fact-sheet', 'executive-summary-for-the-skeptic'];
 $: isQuickStartActive = allQuickStartSections.includes(activeSection);
 $: allCoreSections = [
   ...sectionGroups.foundations,
   ...sectionGroups.economics,
   ...sectionGroups.governance,
   ...sectionGroups.implementation,
   ...sectionGroups.resources
 ];
 $: isCoreSection = allCoreSections.includes(activeSection);

 // Get quick start guides from translations
 $: quickStartGuides = aubi.quickStart?.guides || [
   {
     id: 'at-a-glance',
     icon: '⚡',
     title: 'At a Glance',
     description: '5-minute overview of economic transformation'
   },
   {
     id: 'technical-fact-sheet',
     icon: '📊',
     title: 'Technical Facts',
     description: 'Comprehensive technical specifications'
   },
   {
     id: 'executive-summary-for-the-skeptic',
     icon: '🤔',
     title: 'For Skeptics',
     description: 'Evidence-based case for economic security'
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

 function toggleFoundations() {
   foundationsOpen = !foundationsOpen;
 }

 function toggleEconomics() {
   economicsOpen = !economicsOpen;
 }

 function toggleGovernance() {
   governanceOpen = !governanceOpen;
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
 <title>{aubi.meta?.title || 'AUBI Framework: Adaptive Universal Basic Income - Global Governance Framework'}</title>
 <meta name="description" content="{aubi.meta?.description || 'Economic security as the foundation for human flourishing through Indigenous-guided governance, care economy recognition, and regenerative abundance principles'}" />
</svelte:head>

{#if mounted}
 <div class="documentation-container">
   {#if !isPrintMode}
     <FrameworkSidebar />
   {/if}

   <div class="content">
     <!-- Quick Access Card for AUBI Quick Start -->
     {#if !isPrintMode && !isQuickStartActive && (activeSection === 'index' || activeSection === 'introduction')}
       <div class="aubi-guide-card">
         <div class="card-content">
           <div class="card-icon">💰</div>
           <div class="card-text">
             <h3>{aubi.quickStart?.new || 'New to Economic Transformation?'}</h3>
             <p>{aubi.quickStart?.start || 'Start with our quick guides that explain adaptive universal basic income for different audiences.'}</p>
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
                 {aubi.quickStart?.button || 'Choose Guide'} 
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

     <!-- Sub-navigation for AUBI framework sections -->
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
                   class:featured-item={section === 'at-a-glance' || section === 'executive-summary-for-the-skeptic' || section === 'technical-fact-sheet'}
                   on:click={() => setActiveSection(section)}
                 >
                   <span class="nav-icon">{sectionIcons[section]}</span>
                   <span class="nav-title">{getShortSectionTitle(section)}</span>
                   {#if section === 'at-a-glance'}
                     <span class="featured-badge">Quick</span>
                   {:else if section === 'executive-summary-for-the-skeptic'}
                     <span class="featured-badge">Evidence</span>
                   {:else if section === 'technical-fact-sheet'}
                     <span class="featured-badge">Facts</span>
                   {/if}
                 </button>
               {/each}
             </div>
           {/if}
         </div>

         <!-- Foundations & Philosophy Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={foundationsOpen}
             class:has-active={sectionGroups.foundations.some(section => activeSection === section)}
             on:click={toggleFoundations}
           >
             <span class="accordion-icon">🌱</span>
             <span class="accordion-title">{getSectionCategoryTitle('foundations')}</span>
             <span class="section-count">({sectionGroups.foundations.length})</span>
             <span class="toggle-arrow" class:rotated={foundationsOpen}>▼</span>
           </button>
           {#if foundationsOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.foundations as section}
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

         <!-- Economics & Currency Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={economicsOpen}
             class:has-active={sectionGroups.economics.some(section => activeSection === section)}
             on:click={toggleEconomics}
           >
             <span class="accordion-icon">💚</span>
             <span class="accordion-title">{getSectionCategoryTitle('economics')}</span>
             <span class="section-count">({sectionGroups.economics.length})</span>
             <span class="toggle-arrow" class:rotated={economicsOpen}>▼</span>
           </button>
           {#if economicsOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.economics as section}
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

         <!-- Governance & Culture Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={governanceOpen}
             class:has-active={sectionGroups.governance.some(section => activeSection === section)}
             on:click={toggleGovernance}
           >
             <span class="accordion-icon">🏛️</span>
             <span class="accordion-title">{getSectionCategoryTitle('governance')}</span>
             <span class="section-count">({sectionGroups.governance.length})</span>
             <span class="toggle-arrow" class:rotated={governanceOpen}>▼</span>
           </button>
           {#if governanceOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.governance as section}
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

         <!-- Implementation & Infrastructure Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={implementationOpen}
             class:has-active={sectionGroups.implementation.some(section => activeSection === section)}
             on:click={toggleImplementation}
           >
             <span class="accordion-icon">⚙️</span>
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

         <!-- Conclusion & Resources Accordion -->
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
         <span class="progress-text">{aubi.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
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
                 <strong>{aubi.languageFallback?.title || 'Content in your language coming soon'}</strong>
                 <p>{aubi.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
               </div>
             </div>
           {/if}
           
           <!-- Handle quick start sections specially -->
           {#if allQuickStartSections.includes(section) && section !== 'index' && section !== 'introduction'}
             <!-- Quick start selector if we're in one of the guides and not in print mode -->
             {#if !isPrintMode}
               <div class="guide-selector">
                 <h2>{aubi.quickStart?.title || 'AUBI Framework Quick Start'}</h2>
                 <p>{aubi.quickStart?.description || 'Choose the version that best matches your needs:'}</p>
                 
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
                 <button class="secondary-btn" on:click={() => downloadAubiGuide(section.replace('-', ''))}>
                   {aubi.quickStart?.download || 'Download PDF Version'} <span class="download-icon">↓</span>
                 </button>
                 <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                   {aubi.quickStart?.continue || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                 </button>
               </div>
             {/if}
           {:else}
             <!-- Render sections from markdown files -->
             <svelte:component this={data.sections[section].default} t={translationFunction} />
           {/if}

           {#if activeSection === 'index' && !isPrintMode}
             <div class="index-navigation">
               <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                 {aubi.index?.continue || 'Continue to Framework Introduction'} 
                 <span class="arrow-icon">→</span>
               </button>
             </div>
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
                   ← {aubi.navigation?.previousSection || 'Previous Section'}
                 </button>
               {/if}
               
               {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                 <button class="nav-btn next-btn" on:click={() => {
                   const currentIndex = allCoreSections.indexOf(activeSection);
                   const nextSection = allCoreSections[currentIndex + 1];
                   setActiveSection(nextSection);
                 }}>
                   {aubi.navigation?.nextSection || 'Next Section'} →
                 </button>
               {/if}
             </div>
           {/if}
         </div>
       {:else}
         <div class="missing-section">
           <h2>{aubi.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
           <p>{aubi.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
         </div>
       {/if}
     {/each}
   </div>
 </div>
{:else}
 <!-- Loading state to prevent hydration issues -->
 <div class="loading-container">
   <div class="loading-spinner"></div>
   <p>{aubi.loading?.text || 'Loading economic transformation framework...'}</p>
 </div>
{/if}

<style>
 /* AUBI color scheme - Economic transformation & care economy themed */
 :root {
   --aubi-primary: #2E7D32; /* Deep green for growth and abundance */
   --aubi-secondary: #66BB6A; /* Lighter green for prosperity */
   --aubi-hearts: #E91E63; /* Pink/magenta for Hearts currency */
   --aubi-leaves: #4CAF50; /* Green for Leaves currency and ecology */
   --aubi-warning: #FF9800; /* Orange for caution */
   --aubi-danger: #F44336; /* Red for risks/alerts */
   --aubi-light: #E8F5E8; /* Very light green */
   --aubi-dark: #1B5E20; /* Dark green */
   --aubi-care: #E91E63; /* Pink for care economy */
   --aubi-community: #4CAF50; /* Green for community */
   --aubi-indigenous: #8D6E63; /* Brown for Indigenous wisdom */
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
   scroll-margin-top: 2rem; /* Adds space above when scrolled to */
 }

 /* Section Navigation */
 .section-nav {
   margin-bottom: 2rem;
   border-bottom: 1px solid #e5e7eb;
   background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
   border-radius: 0.5rem;
   padding: 1rem;
 }

 .nav-section {
   margin-bottom: 0.5rem;
 }

 .nav-accordion {
   margin-bottom: 0.5rem;
   border: 1px solid #e5e7eb;
   border-radius: 0.375rem;
   overflow: hidden;
   background: white;
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
   color: #374151;
   text-align: left;
 }

 .accordion-header:hover {
   background-color: rgba(46, 125, 50, 0.05);
 }

 .accordion-header.has-active {
   background-color: rgba(46, 125, 50, 0.1);
   color: var(--aubi-primary);
   font-weight: 600;
 }

 .accordion-header.open {
   background-color: rgba(102, 187, 106, 0.1);
   border-bottom: 1px solid #e5e7eb;
 }

 /* Special styling for overview header */
 .overview-header {
   background: linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(102, 187, 106, 0.1));
   border-bottom: 1px solid rgba(46, 125, 50, 0.2);
 }

 .overview-header.has-active {
   background: linear-gradient(135deg, rgba(46, 125, 50, 0.15), rgba(102, 187, 106, 0.15));
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
   color: #6b7280;
   font-weight: 400;
 }

 .toggle-arrow {
   font-size: 0.8rem;
   color: #6b7280;
   transition: transform 0.2s ease;
   flex-shrink: 0;
 }

 .toggle-arrow.rotated {
   transform: rotate(180deg);
 }

 .accordion-content {
   border-top: 1px solid #e5e7eb;
   background-color: #fafafa;
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
   color: #4b5563;
   text-align: left;
   border-bottom: 1px solid #e5e7eb;
   position: relative;
 }

 .nav-item:last-child {
   border-bottom: none;
 }

 .nav-item:hover {
   background-color: rgba(46, 125, 50, 0.05);
   color: #374151;
 }

 .nav-item.active {
   background-color: var(--aubi-primary);
   color: white;
   font-weight: 600;
 }

 .nav-item.active:hover {
   background-color: var(--aubi-secondary);
 }

 /* Special styling for featured items (quick start guides) */
 .featured-item {
   background: linear-gradient(135deg, rgba(46, 125, 50, 0.08), rgba(102, 187, 106, 0.08));
   border: 1px solid rgba(46, 125, 50, 0.15);
   border-radius: 0.25rem;
   margin: 0.25rem;
   padding-right: 3rem; /* Make space for badge */
 }

 .featured-item.active {
   background: var(--aubi-primary);
   border-color: var(--aubi-primary);
 }

 .featured-badge {
   position: absolute;
   right: 0.5rem;
   top: 50%;
   transform: translateY(-50%);
   background: var(--aubi-hearts);
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

 /* AUBI Guide Card */
 .aubi-guide-card {
   background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
   border-radius: 0.75rem;
   margin-bottom: 2rem;
   box-shadow: 0 4px 6px rgba(46, 125, 50, 0.1);
   border: 1px solid rgba(46, 125, 50, 0.2);
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

 .aubi-guide-card .dropdown-menu {
   position: absolute;
   top: 100%;
   left: 0;
   z-index: 1001;
   min-width: 300px;
   max-width: 350px;
   overflow: visible;
   border: 1px solid rgba(46, 125, 50, 0.3);
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
   color: var(--aubi-primary);
   flex-shrink: 0;
 }
 
 .card-text {
   flex: 1;
   min-width: 200px;
 }
 
 .card-text h3 {
   margin: 0 0 0.5rem 0;
   color: var(--aubi-primary);
   font-size: 1.25rem;
 }
 
 .card-text p {
   margin: 0;
   color: #4b5563;
   font-size: 1rem;
 }
 
 .primary-btn {
   background-color: var(--aubi-primary);
   color: white;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .primary-btn:hover {
   background-color: var(--aubi-dark);
   transform: translateY(-1px);
 }
 
 .secondary-btn {
   background-color: white;
   color: var(--aubi-primary);
   border: 1px solid var(--aubi-primary);
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .secondary-btn:hover {
   background-color: var(--aubi-light);
   transform: translateY(-1px);
 }
 
 .guide-navigation {
   display: flex;
   justify-content: space-between;
   margin-top: 3rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 .index-navigation {
   display: flex;
   justify-content: center;
   margin-top: 2rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 .download-icon,
 .arrow-icon {
   display: inline-block;
   margin-left: 0.25rem;
 }

 /* Progress indicator */
 .progress-indicator {
   margin-bottom: 2rem;
   padding: 1rem;
   background: linear-gradient(90deg, rgba(46, 125, 50, 0.1), rgba(102, 187, 106, 0.1));
   border-radius: 0.5rem;
   border-left: 4px solid var(--aubi-primary);
 }

 .progress-bar {
   width: 100%;
   height: 8px;
   background-color: #e5e7eb;
   border-radius: 4px;
   overflow: hidden;
   margin-bottom: 0.5rem;
 }

 .progress-fill {
   height: 100%;
   background: linear-gradient(90deg, var(--aubi-primary), var(--aubi-secondary));
   border-radius: 4px;
   transition: width 0.3s ease;
 }

 .progress-text {
   font-size: 0.875rem;
   color: var(--aubi-primary);
   font-weight: 500;
 }

 /* Guide selector styles */
 .guide-selector {
   margin-bottom: 2rem;
   padding-bottom: 1rem;
   border-bottom: 1px solid #e5e7eb;
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
   border: 1px solid #e5e7eb;
   cursor: pointer;
   transition: all 0.2s;
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
 }
 
 .guide-card:hover {
   box-shadow: 0 4px 6px rgba(46, 125, 50, 0.1);
   transform: translateY(-2px);
   border-color: var(--aubi-primary);
 }
 
 .guide-card.active {
   border-color: var(--aubi-primary);
   background-color: var(--aubi-light);
 }
 
 .guide-icon {
   font-size: 2rem;
   margin-bottom: 0.5rem;
 }
 
 .guide-title {
   font-weight: 600;
   margin-bottom: 0.5rem;
   color: var(--aubi-primary);
 }
 
 .guide-desc {
   font-size: 0.875rem;
   color: #6b7280;
 }
 
 .guide-info {
   display: flex;
   flex-direction: column;
 }
 
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
   background-color: #fff;
   border: 1px solid rgba(46, 125, 50, 0.3);
   border-radius: 0.375rem;
   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
   white-space: normal;
   /* Default hidden state */
   visibility: hidden;
   opacity: 0;
   transform: translateY(-8px);
   transition: all 0.2s ease;
   pointer-events: none;
 }

 /* Show dropdown when open */
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
   color: #212529;
   text-align: inherit;
   white-space: normal !important;
   background-color: transparent;
   border: 0;
   cursor: pointer;
   transition: background-color 0.15s ease;
 }
 
 .dropdown-item:hover, 
 .dropdown-item:focus {
   color: #16181b;
   text-decoration: none;
   background-color: var(--aubi-light);
 }

 /* For dropdown guide items */
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
   color: var(--aubi-primary);
 }
 
 .dropdown-item .guide-desc {
   font-size: 0.8rem;
   color: #6b7280;
   line-height: 1.3;
 }

 /* Section Navigation */
 .section-navigation {
   display: flex;
   justify-content: space-between;
   margin-top: 3rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 .nav-btn {
   background-color: var(--aubi-primary);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }

 .nav-btn:hover {
   background-color: var(--aubi-dark);
   transform: translateY(-1px);
 }

 .prev-btn {
   margin-right: auto;
 }

 .next-btn {
   margin-left: auto;
 }

 /* Content styling */
 .content :global(h1) {
   font-size: 2rem;
   font-weight: 700;
   margin-bottom: 1.5rem;
   color: var(--aubi-primary);
 }
 
 .content :global(h2) {
   font-size: 1.5rem;
   font-weight: 600;
   margin-top: 2rem;
   margin-bottom: 1rem;
   color: var(--aubi-secondary);
 }
 
 .content :global(h3),
 :global(h4) {
   font-size: 1.25rem;
   font-weight: 600;
   margin-top: 1.5rem;
   margin-bottom: 0.75rem;
   color: var(--aubi-hearts);
 }

 :global(h4) {
   font-size: 1.2rem;
 }
 
 .content :global(p) {
   margin-bottom: 1rem;
   line-height: 1.7;
   color: #4b5563;
 }

 /* Lists - Simple and Clean Styling */
 .content :global(ul), 
 .content :global(ol) {
   margin: 1rem 0 1.5rem 0;
   padding-left: 1.5rem;
   color: #4b5563;
   line-height: 1.6;
 }

 /* Bullet Lists */
 .content :global(ul) {
   list-style-type: disc;
 }

 .content :global(ul li) {
   margin-bottom: 0.5rem;
   padding-left: 0.25rem;
 }

 /* Nested bullet lists */
 .content :global(ul ul) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
   list-style-type: circle;
 }

 .content :global(ul ul ul) {
   list-style-type: square;
 }

 /* Numbered Lists */
 .content :global(ol) {
   list-style-type: decimal;
 }

 .content :global(ol li) {
   margin-bottom: 0.5rem;
   padding-left: 0.25rem;
 }

 /* Nested numbered lists */
 .content :global(ol ol) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
   list-style-type: lower-alpha;
 }

 .content :global(ol ol ol) {
   list-style-type: lower-roman;
 }

 /* Mixed nested lists */
 .content :global(ul ol), 
 .content :global(ol ul) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
 }

 /* List markers styling */
 .content :global(li::marker) {
   color: var(--aubi-primary);
   font-weight: 500;
 }

 /* Better spacing for lists with paragraphs */
 .content :global(li p) {
   margin: 0.25rem 0;
 }

 .content :global(li p:first-child) {
   margin-top: 0;
 }

 .content :global(li p:last-child) {
   margin-bottom: 0;
 }

 /* Blockquotes */
 :global(blockquote) {
   background-color: #f0f8f0;
   border-left: 4px solid var(--aubi-primary);
   padding: 1rem 1.5rem;
   margin: 1.5rem 0;
   border-radius: 0.5rem;
 }

 :global(blockquote > p:first-child strong) {
   font-size: 1.1rem;
   color: var(--aubi-primary);
   display: block;
   margin-bottom: 0.75rem;
 }

 :global(blockquote ul),
 :global(blockquote ol) {
   margin-left: 0;
   margin-top: 0.75rem;
   margin-bottom: 0.75rem;
 }

 :global(blockquote li) {
   margin-bottom: 0.5rem;
 }

 :global(blockquote p:last-child) {
   margin-top: 0.75rem;
   font-style: italic;
 }

 :global(blockquote a) {
   color: var(--aubi-primary);
   text-decoration: underline;
   font-weight: 500;
 }

 :global(blockquote a:hover) {
   color: var(--aubi-dark);
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
   background: linear-gradient(to right, var(--aubi-primary), var(--aubi-secondary));
 }

 :global(.content th) {
   padding: 0.75rem 1rem;
   font-weight: 600;
   text-align: left;
   color: #ffffff;
   border: none;
   border-bottom: 2px solid var(--aubi-primary);
 }

 :global(.content td) {
   padding: 0.75rem 1rem;
   border: 1px solid #e5e7eb;
   border-left: none;
   border-right: none;
   vertical-align: top;
 }

 :global(.content tr:nth-child(odd)) {
   background-color: #f8fff8;
 }

 :global(.content tr:nth-child(even)) {
   background-color: #ffffff;
 }

 :global(.content tr:hover) {
   background-color: var(--aubi-light);
 }

 :global(.content tbody tr:last-child td) {
   border-bottom: none;
 }

 :global(.content table caption),
 :global(.content table tfoot) {
   background-color: var(--aubi-light);
   padding: 0.75rem;
   font-size: 0.875rem;
   color: var(--aubi-primary);
   text-align: left;
   border-top: 1px solid var(--aubi-primary);
 }

 :global(.content td.highlight) {
   color: var(--aubi-primary);
   font-weight: 600;
 }

 /* Links */
 .content :global(a) {
   color: var(--aubi-primary);
   text-decoration: underline;
   font-weight: 500;
   transition: all 0.2s;
 }

 .content :global(a:hover) {
   color: var(--aubi-dark);
   text-decoration: underline;
 }

 .content :global(a:active) {
   color: var(--aubi-dark);
 }

 .content :global(a[href^="http"]):after, 
 .content :global(a[href^="https://"]):after {
   content: " ↗";
   font-size: 0.8em;
   vertical-align: super;
 }

 .content :global(a[href$=".pdf"]):after {
   content: " ↓";
   font-size: 0.8em;
 }

 /* Language fallback notice */
 .language-fallback-notice {
   display: flex;
   align-items: flex-start;
   gap: 1rem;
   background-color: rgba(102, 187, 106, 0.1);
   border: 1px solid rgba(102, 187, 106, 0.3);
   border-radius: 0.5rem;
   padding: 1rem 1.25rem;
   margin-bottom: 1.5rem;
 }

 .notice-icon {
   font-size: 1.25rem;
   color: var(--aubi-secondary);
   flex-shrink: 0;
   margin-top: 0.125rem;
 }

 .notice-content {
   flex: 1;
 }

 .notice-content strong {
   color: var(--aubi-secondary);
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

 /* Loading state */
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
   border: 3px solid var(--aubi-light);
   border-top: 3px solid var(--aubi-primary);
   border-radius: 50%;
   animation: spin 1s linear infinite;
   margin-bottom: 1rem;
 }

 @keyframes spin {
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
 }

 /* Missing section styling */
 .missing-section {
   text-align: center;
   padding: 3rem 2rem;
   background-color: #fef2f2;
   border: 1px solid #fecaca;
   border-radius: 0.5rem;
   margin: 2rem 0;
 }

 .missing-section h2 {
   color: var(--aubi-danger);
   margin-bottom: 1rem;
 }

 .missing-section p {
   color: #6b7280;
   margin-bottom: 2rem;
 }

 /* Responsive Design */
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
   
   .guide-navigation {
     flex-direction: column;
     gap: 1rem;
   }
   
   .guide-navigation button {
     width: 100%;
   }
   
   .guide-cards {
     flex-direction: column;
   }
   
   .guide-card {
     max-width: none;
   }

   .section-navigation {
     flex-direction: column;
     gap: 1rem;
   }

   .nav-btn {
     width: 100%;
     margin: 0 !important;
   }
 }

 @media (max-width: 640px) {
   .language-fallback-notice {
     padding: 0.75rem 1rem;
   }
   
   .notice-icon {
     font-size: 1.1rem;
   }
   
   .notice-content strong {
     font-size: 0.9rem;
   }
   
   .notice-content p {
     font-size: 0.8rem;
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

 .section-content {
   scroll-margin-top: 2rem;
 }

 .content {
   scroll-margin-top: 2rem;
   position: relative;
 }
</style>
