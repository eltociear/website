<!-- src/routes/frameworks/aethelred-accord/+page.svelte -->
<script>
 import { t, locale } from '$lib/i18n';
 import { browser } from '$app/environment';
 import { invalidate } from '$app/navigation';
 import { base } from '$app/paths';
 import FrameworkSidebar from '$lib/components/FrameworkSidebar.svelte';
 import { onMount, tick } from 'svelte';
 import { slide } from 'svelte/transition';

 export let data;

 // Extract Aethelred Accord translations for shorter references
 $: aethelred = $t('aethelred') || {};
 $: translationFunction = $t;
 
 // Keep track of which section is active (for sub-navigation)
 let activeSection = 'preamble';

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
 let governanceOpen = false;
 let operationsOpen = false;
 let implementationOpen = false;
 let resourcesOpen = false;

 // Define section groupings - match the Aethelred Accord structure
 const sectionGroups = {
   overview: ['preamble', 'index', 'at-a-glance', 'executive-summary-for-the-skeptic'],
   foundations: ['introduction', 'universal-declaration', 'core-principles'],
   governance: ['governance-architecture', 'operational-systems', 'crisis-response'],
   operations: ['implementation-roadmap', 'cross-cutting-mechanisms', 'funding-mechanisms'],
   implementation: ['framework-integration', 'tools-and-resources', 'getting-started'],
   resources: ['conclusion', 'appendices']
 };

 // Section icons - tailored to biotechnology governance theme
 const sectionIcons = {
   // Overview cluster
   'preamble': '📜',
   'index': '🧬',
   'at-a-glance': '⚡',
   'executive-summary-for-the-skeptic': '🤔',
   
   // Foundations & Core Principles
   'introduction': '🌱',
   'universal-declaration': '📋',
   'core-principles': '⚖️',
   
   // Governance & Architecture
   'governance-architecture': '🏛️',
   'operational-systems': '⚙️',
   'crisis-response': '🚨',
   
   // Implementation & Operations
   'implementation-roadmap': '🗺️',
   'cross-cutting-mechanisms': '🔗',
   'funding-mechanisms': '💰',
   
   // Framework Integration & Tools
   'framework-integration': '🌐',
   'tools-and-resources': '🔧',
   'getting-started': '🚀',
   
   // Conclusion & Resources
   'conclusion': '🎯',
   'appendices': '📚'
 };

 // Initialize accordion states after mount
 function initializeAccordionStates() {
   // Reset all accordions
   overviewOpen = false;
   foundationsOpen = false;
   governanceOpen = false;
   operationsOpen = false;
   implementationOpen = false;
   resourcesOpen = false;

   // Set initial accordion states based on active section
   if (sectionGroups.overview.includes(activeSection)) {
     overviewOpen = true;
   } else if (sectionGroups.foundations.includes(activeSection)) {
     foundationsOpen = true;
   } else if (sectionGroups.governance.includes(activeSection)) {
     governanceOpen = true;
   } else if (sectionGroups.operations.includes(activeSection)) {
     operationsOpen = true;
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
       // Default to preamble instead of index
       activeSection = 'preamble';
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
   return aethelred.sections?.[section] || section;
 }

 // Get section category titles using short references
 function getSectionCategoryTitle(category) {
   return aethelred.categories?.[category] || category;
 }

 // Function to get shortened section titles for navigation using short references
 function getShortSectionTitle(section) {
   return aethelred.sectionsShort?.[section] || getSectionTitle(section);
 }

 // Function to download the Aethelred Accord guide PDF
 function downloadAethelredGuide(version = '') {
   const versionSuffix = version ? `-${version}` : '';
   const pdfUrl = `${base}/assets/pdf/aethelred-accord-framework${versionSuffix}-${currentLocale}.pdf`;
   const link = document.createElement('a');
   link.href = pdfUrl;
   link.download = `aethelred-accord-framework${versionSuffix}.pdf`;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 }

 // Computed values - add safety checks
 $: allQuickStartSections = ['at-a-glance', 'executive-summary-for-the-skeptic'];
 $: isQuickStartActive = allQuickStartSections.includes(activeSection);
 $: allCoreSections = [
   ...sectionGroups.foundations,
   ...sectionGroups.governance,
   ...sectionGroups.operations,
   ...sectionGroups.implementation,
   ...sectionGroups.resources
 ];
 $: isCoreSection = allCoreSections.includes(activeSection);

 // Get quick start guides from translations
 $: quickStartGuides = aethelred.quickStart?.guides || [
   {
     id: 'at-a-glance',
     icon: '⚡',
     title: 'At a Glance',
     description: '5-minute overview of biotechnology governance'
   },
   {
     id: 'executive-summary-for-the-skeptic',
     icon: '🤔',
     title: 'For Skeptics',
     description: 'Evidence-based case for community-controlled biotech'
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

 function toggleGovernance() {
   governanceOpen = !governanceOpen;
 }

 function toggleOperations() {
   operationsOpen = !operationsOpen;
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
 <title>{aethelred.meta?.title || 'Aethelred Accord: Biotechnology Governance Framework - Global Governance Framework'}</title>
 <meta name="description" content="{aethelred.meta?.description || 'A covenant for responsible stewardship of life\'s code through community sovereignty, Indigenous rights, and democratic oversight of biotechnology'}" />
</svelte:head>

{#if mounted}
 <div class="documentation-container">
   {#if !isPrintMode}
     <FrameworkSidebar />
   {/if}

   <div class="content">
     <!-- Quick Access Card for Aethelred Accord Quick Start -->
     {#if !isPrintMode && !isQuickStartActive && (activeSection === 'index' || activeSection === 'preamble')}
       <div class="aethelred-guide-card">
         <div class="card-content">
           <div class="card-icon">🧬</div>
           <div class="card-text">
             <h3>{aethelred.quickStart?.new || 'New to Biotechnology Governance?'}</h3>
             <p>{aethelred.quickStart?.start || 'Start with our quick guides that explain community-controlled biotechnology for different audiences.'}</p>
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
                 {aethelred.quickStart?.button || 'Choose Guide'} 
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

     <!-- Sub-navigation for Aethelred Accord framework sections -->
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

         <!-- Foundations & Core Principles Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={foundationsOpen}
             class:has-active={sectionGroups.foundations.some(section => activeSection === section)}
             on:click={toggleFoundations}
           >
             <span class="accordion-icon">📚</span>
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

         <!-- Governance & Architecture Accordion -->
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

         <!-- Operations & Implementation Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={operationsOpen}
             class:has-active={sectionGroups.operations.some(section => activeSection === section)}
             on:click={toggleOperations}
           >
             <span class="accordion-icon">⚙️</span>
             <span class="accordion-title">{getSectionCategoryTitle('operations')}</span>
             <span class="section-count">({sectionGroups.operations.length})</span>
             <span class="toggle-arrow" class:rotated={operationsOpen}>▼</span>
           </button>
           {#if operationsOpen}
             <div class="accordion-content" transition:slide={{ duration: 200 }}>
               {#each sectionGroups.operations as section}
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

         <!-- Framework Integration & Tools Accordion -->
         <div class="nav-accordion">
           <button 
             class="accordion-header" 
             class:open={implementationOpen}
             class:has-active={sectionGroups.implementation.some(section => activeSection === section)}
             on:click={toggleImplementation}
           >
             <span class="accordion-icon">🔧</span>
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
         <span class="progress-text">{aethelred.progress?.text?.replace('{current}', allCoreSections.indexOf(activeSection) + 1).replace('{total}', allCoreSections.length) || `Section ${allCoreSections.indexOf(activeSection) + 1} of ${allCoreSections.length}`}</span>
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
                 <strong>{aethelred.languageFallback?.title || 'Content in your language coming soon'}</strong>
                 <p>{aethelred.languageFallback?.description || 'This section is currently displayed in English until translation is complete.'}</p>
               </div>
             </div>
           {/if}
           
           <!-- Handle quick start sections specially -->
           {#if allQuickStartSections.includes(section) && section !== 'index' && section !== 'preamble'}
             <!-- Quick start selector if we're in one of the guides and not in print mode -->
             {#if !isPrintMode}
               <div class="guide-selector">
                 <h2>{aethelred.quickStart?.title || 'Aethelred Accord Quick Start'}</h2>
                 <p>{aethelred.quickStart?.description || 'Choose the version that best matches your needs:'}</p>
                 
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
                 <button class="secondary-btn" on:click={() => downloadAethelredGuide(section.replace('-', ''))}>
                   {aethelred.quickStart?.download || 'Download PDF Version'} <span class="download-icon">↓</span>
                 </button>
                 <button class="primary-btn" on:click={() => setActiveSection('introduction')}>
                   {aethelred.quickStart?.continue || 'Continue to Full Framework'} <span class="arrow-icon">→</span>
                 </button>
               </div>
             {/if}
           {:else}
             <!-- Render sections from markdown files -->
             <svelte:component this={data.sections[section].default} t={translationFunction} />
           {/if}

           {#if activeSection === 'preamble' && !isPrintMode}
             <div class="preamble-navigation">
               <button class="primary-btn" on:click={() => setActiveSection('index')}>
                 {aethelred.preamble?.continue || 'Continue to Framework Overview'} 
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
                   ← {aethelred.navigation?.previousSection || 'Previous Section'}
                 </button>
               {/if}
               
               {#if allCoreSections.indexOf(activeSection) < allCoreSections.length - 1}
                 <button class="nav-btn next-btn" on:click={() => {
                   const currentIndex = allCoreSections.indexOf(activeSection);
                   const nextSection = allCoreSections[currentIndex + 1];
                   setActiveSection(nextSection);
                 }}>
                   {aethelred.navigation?.nextSection || 'Next Section'} →
                 </button>
               {/if}
             </div>
           {/if}
         </div>
       {:else}
         <div class="missing-section">
           <h2>{aethelred.errors?.sectionNotFound?.replace('{section}', section) || `Section "${section}" not found`}</h2>
           <p>{aethelred.errors?.contentInDevelopment || 'This content is still being developed.'}</p>
         </div>
       {/if}
     {/each}
   </div>
 </div>
{:else}
 <!-- Loading state to prevent hydration issues -->
 <div class="loading-container">
   <div class="loading-spinner"></div>
   <p>{aethelred.loading?.text || 'Loading biotechnology governance framework...'}</p>
 </div>
{/if}

<style>
 /* Aethelred Accord color scheme - Biotechnology & Life Sciences themed */
 :root {
   --aethelred-primary: #1565C0; /* Deep blue for trust and precision */
   --aethelred-secondary: #42A5F5; /* Lighter blue for innovation */
   --aethelred-accent: #7B1FA2; /* Purple for biotechnology/science */
   --aethelred-success: #2E7D32; /* Green for life and growth */
   --aethelred-warning: #F57C00; /* Amber for caution */
   --aethelred-danger: #D32F2F; /* Red for risks/alerts */
   --aethelred-light: #E3F2FD; /* Very light blue */
   --aethelred-dark: #0D47A1; /* Dark blue */
   --aethelred-dna: #7B1FA2; /* Purple for DNA/genetics */
   --aethelred-community: #4CAF50; /* Green for community */
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
   background-color: rgba(21, 101, 192, 0.05);
 }

 .accordion-header.has-active {
   background-color: rgba(21, 101, 192, 0.1);
   color: var(--aethelred-primary);
   font-weight: 600;
 }

 .accordion-header.open {
   background-color: rgba(66, 165, 245, 0.1);
   border-bottom: 1px solid #e5e7eb;
 }

 /* Special styling for overview header */
 .overview-header {
   background: linear-gradient(135deg, rgba(21, 101, 192, 0.1), rgba(66, 165, 245, 0.1));
   border-bottom: 1px solid rgba(21, 101, 192, 0.2);
 }

 .overview-header.has-active {
   background: linear-gradient(135deg, rgba(21, 101, 192, 0.15), rgba(66, 165, 245, 0.15));
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
   background-color: rgba(21, 101, 192, 0.05);
   color: #374151;
 }

 .nav-item.active {
   background-color: var(--aethelred-primary);
   color: white;
   font-weight: 600;
 }

 .nav-item.active:hover {
   background-color: var(--aethelred-secondary);
 }

 /* Special styling for featured items (at-a-glance and executive summary) */
 .featured-item {
   background: linear-gradient(135deg, rgba(21, 101, 192, 0.08), rgba(66, 165, 245, 0.08));
   border: 1px solid rgba(21, 101, 192, 0.15);
   border-radius: 0.25rem;
   margin: 0.25rem;
   padding-right: 3rem; /* Make space for badge */
 }

 .featured-item.active {
   background: var(--aethelred-primary);
   border-color: var(--aethelred-primary);
 }

 .featured-badge {
   position: absolute;
   right: 0.5rem;
   top: 50%;
   transform: translateY(-50%);
   background: var(--aethelred-accent);
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

 /* Aethelred Accord Guide Card */
 .aethelred-guide-card {
   background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
   border-radius: 0.75rem;
   margin-bottom: 2rem;
   box-shadow: 0 4px 6px rgba(21, 101, 192, 0.1);
   border: 1px solid rgba(21, 101, 192, 0.2);
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

 .aethelred-guide-card .dropdown-menu {
   position: absolute;
   top: 100%;
   left: 0;
   z-index: 1001;
   min-width: 300px;
   max-width: 350px;
   overflow: visible;
   border: 1px solid rgba(21, 101, 192, 0.3);
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
   color: var(--aethelred-primary);
   flex-shrink: 0;
 }
 
 .card-text {
   flex: 1;
   min-width: 200px;
 }
 
 .card-text h3 {
   margin: 0 0 0.5rem 0;
   color: var(--aethelred-primary);
   font-size: 1.25rem;
 }
 
 .card-text p {
   margin: 0;
   color: #4b5563;
   font-size: 1rem;
 }
 
 .primary-btn {
   background-color: var(--aethelred-primary);
   color: white;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .primary-btn:hover {
   background-color: var(--aethelred-dark);
   transform: translateY(-1px);
 }
 
 .secondary-btn {
   background-color: white;
   color: var(--aethelred-primary);
   border: 1px solid var(--aethelred-primary);
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .secondary-btn:hover {
   background-color: var(--aethelred-light);
   transform: translateY(-1px);
 }
 
 .guide-navigation {
   display: flex;
   justify-content: space-between;
   margin-top: 3rem;
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
   background: linear-gradient(90deg, rgba(21, 101, 192, 0.1), rgba(66, 165, 245, 0.1));
   border-radius: 0.5rem;
   border-left: 4px solid var(--aethelred-primary);
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
   background: linear-gradient(90deg, var(--aethelred-primary), var(--aethelred-secondary));
   border-radius: 4px;
   transition: width 0.3s ease;
 }

 .progress-text {
   font-size: 0.875rem;
   color: var(--aethelred-primary);
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
   box-shadow: 0 4px 6px rgba(21, 101, 192, 0.1);
   transform: translateY(-2px);
   border-color: var(--aethelred-primary);
 }
 
 .guide-card.active {
   border-color: var(--aethelred-primary);
   background-color: var(--aethelred-light);
 }
 
 .guide-icon {
   font-size: 2rem;
   margin-bottom: 0.5rem;
 }
 
 .guide-title {
   font-weight: 600;
   margin-bottom: 0.5rem;
   color: var(--aethelred-primary);
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
   border: 1px solid rgba(21, 101, 192, 0.3);
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
   background-color: var(--aethelred-light);
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
   color: var(--aethelred-primary);
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
   background-color: var(--aethelred-primary);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }

 .nav-btn:hover {
   background-color: var(--aethelred-dark);
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
   color: var(--aethelred-primary);
 }
 
 .content :global(h2) {
   font-size: 1.5rem;
   font-weight: 600;
   margin-top: 2rem;
   margin-bottom: 1rem;
   color: var(--aethelred-secondary);
 }
 
 .content :global(h3),
 :global(h4) {
   font-size: 1.25rem;
   font-weight: 600;
   margin-top: 1.5rem;
   margin-bottom: 0.75rem;
   color: var(--aethelred-accent);
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
   color: var(--aethelred-primary);
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
   background-color: #f0f8ff;
   border-left: 4px solid var(--aethelred-primary);
   padding: 1rem 1.5rem;
   margin: 1.5rem 0;
   border-radius: 0.5rem;
 }

 :global(blockquote > p:first-child strong) {
   font-size: 1.1rem;
   color: var(--aethelred-primary);
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
   color: var(--aethelred-primary);
   text-decoration: underline;
   font-weight: 500;
 }

 :global(blockquote a:hover) {
   color: var(--aethelred-dark);
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
   background: linear-gradient(to right, var(--aethelred-primary), var(--aethelred-secondary));
 }

 :global(.content th) {
   padding: 0.75rem 1rem;
   font-weight: 600;
   text-align: left;
   color: #ffffff;
   border: none;
   border-bottom: 2px solid var(--aethelred-primary);
 }

 :global(.content td) {
   padding: 0.75rem 1rem;
   border: 1px solid #e5e7eb;
   border-left: none;
   border-right: none;
   vertical-align: top;
 }

 :global(.content tr:nth-child(odd)) {
   background-color: #f8fcff;
 }

 :global(.content tr:nth-child(even)) {
   background-color: #ffffff;
 }

 :global(.content tr:hover) {
   background-color: var(--aethelred-light);
 }

 :global(.content tbody tr:last-child td) {
   border-bottom: none;
 }

 :global(.content table caption),
 :global(.content table tfoot) {
   background-color: var(--aethelred-light);
   padding: 0.75rem;
   font-size: 0.875rem;
   color: var(--aethelred-primary);
   text-align: left;
   border-top: 1px solid var(--aethelred-primary);
 }

 :global(.content td.highlight) {
   color: var(--aethelred-primary);
   font-weight: 600;
 }

 /* Links */
 .content :global(a) {
   color: var(--aethelred-primary);
   text-decoration: underline;
   font-weight: 500;
   transition: all 0.2s;
 }

 .content :global(a:hover) {
   color: var(--aethelred-dark);
   text-decoration: underline;
 }

 .content :global(a:active) {
   color: var(--aethelred-dark);
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
   background-color: rgba(66, 165, 245, 0.1);
   border: 1px solid rgba(66, 165, 245, 0.3);
   border-radius: 0.5rem;
   padding: 1rem 1.25rem;
   margin-bottom: 1.5rem;
 }

 .notice-icon {
   font-size: 1.25rem;
   color: var(--aethelred-secondary);
   flex-shrink: 0;
   margin-top: 0.125rem;
 }

 .notice-content {
   flex: 1;
 }

 .notice-content strong {
   color: var(--aethelred-secondary);
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
   border: 3px solid var(--aethelred-light);
   border-top: 3px solid var(--aethelred-primary);
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
   color: var(--aethelred-danger);
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

 .preamble-navigation {
   display: flex;
   justify-content: center;
   margin-top: 2rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 /* Special styling for preamble in navigation */
 .nav-item[data-section="preamble"] {
   font-weight: 600;
   background: linear-gradient(135deg, rgba(21, 101, 192, 0.05), rgba(66, 165, 245, 0.05));
   border-left: 3px solid var(--aethelred-primary);
 }
</style>
