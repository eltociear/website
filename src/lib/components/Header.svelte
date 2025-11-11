<!-- src/lib/components/Header.svelte -->
<script>
  import { t, translationsLoaded, locale, locales, getLanguageName, setLocale } from '$lib/i18n';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { 
    allFrameworks, 
    tierMetadata, 
    groupMetadata,
    getFrameworksByTier, 
    getFrameworksByTierAndGroup,
    getGroupsForTier,
    getAllTiers 
  } from '$lib/stores/frameworkNav.js';
  import { dev } from '$app/environment';

  const isDevMode = dev;

  // Handle language selection
  function handleLocaleChange(e) {
    const newLocale = e.target.value;
    setLocale(newLocale);
  }

  // Mobile menu state
  let isMenuOpen = false;
  let isFrameworksDropdownOpen = false;
  let isGetInvolvedDropdownOpen = false;
  let isResourcesDropdownOpen = false;
  
  // Mobile submenu states
  let isTieredFrameworksOpen = false;
  let openTiers = {}; // Track which tiers are open

  // Quiz state management for adaptive navigation
  let hasCompletedQuiz = false;

// PERFORMANCE FIX: Group frameworks by tier ONCE (not on every render)
  // We preserve 'tiers' as a separate variable because it's used in the template
  const tiers = getAllTiers();
  const frameworksByTier = (() => {
    const result = {};
    
    tiers.forEach(tier => {
      result[tier] = getFrameworksByTier(tier);
    });
    
    return result;
  })();

  function handleMetaGovernanceNavigation(event, section) {
    event.preventDefault();
    event.stopPropagation();
    
    if (browser) {
      console.log('Header navigation triggered for section:', section);
      console.log('Current pathname:', $page.url.pathname);
      
      // Close dropdown
      isFrameworksDropdownOpen = false;
      
      // Check if we're already on the meta-governance page
      if ($page.url.pathname === base + '/frameworks/meta-governance') {
        console.log('Already on page, updating hash');
        window.location.hash = section;
      } else {
        console.log('Navigating to page with hash');
        goto(`${base}/frameworks/meta-governance#${section}`).then(() => {
          console.log('Navigation completed');
          setTimeout(() => {
            if (window.location.hash !== `#${section}`) {
              window.location.hash = section;
            }
          }, 100);
        });
      }
    }
  }
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    // Close all dropdowns when main menu is closed
    if (!isMenuOpen) {
      isFrameworksDropdownOpen = false;
      isGetInvolvedDropdownOpen = false;
      isResourcesDropdownOpen = false;
      isTieredFrameworksOpen = false;
      openTiers = {};
    }
  };

  const toggleFrameworksDropdown = (e) => {
    e.stopPropagation();
    isFrameworksDropdownOpen = !isFrameworksDropdownOpen;
    // Close tier dropdowns when frameworks dropdown is closed
    if (!isFrameworksDropdownOpen) {
      isTieredFrameworksOpen = false;
      openTiers = {};
    }
  };

  const toggleGetInvolvedDropdown = (e) => {
    e.stopPropagation();
    isGetInvolvedDropdownOpen = !isGetInvolvedDropdownOpen;
  };

  const toggleResourcesDropdown = (e) => {
    e.stopPropagation();
    isResourcesDropdownOpen = !isResourcesDropdownOpen;
  };

  const toggleTieredFrameworks = (e) => {
    e.stopPropagation();
    isTieredFrameworksOpen = !isTieredFrameworksOpen;
    // Close all tier dropdowns when tiered frameworks is closed
    if (!isTieredFrameworksOpen) {
      openTiers = {};
    }
  };

  const toggleTier = (tier, e) => {
    e.stopPropagation();
    openTiers = {
      ...openTiers,
      [tier]: !openTiers[tier]
    };
  };
  
  const closeDropdowns = () => {
    if (isFrameworksDropdownOpen) isFrameworksDropdownOpen = false;
    if (isGetInvolvedDropdownOpen) isGetInvolvedDropdownOpen = false;
    if (isResourcesDropdownOpen) isResourcesDropdownOpen = false;
  };

  // Position submenu to align with top of viewport for maximum visibility
  function positionSubmenuToTop(submenuElement) {
    if (!submenuElement || !browser) return;
    
    const viewportHeight = window.innerHeight;
    const submenuRect = submenuElement.getBoundingClientRect();
    const parentRect = submenuElement.parentElement.getBoundingClientRect();
    
    // Calculate how much space we need
    const submenuHeight = submenuElement.scrollHeight;
    
    // If submenu is taller than viewport or would go below fold, align to top
    if (submenuHeight > viewportHeight * 0.8 || submenuRect.bottom > viewportHeight) {
      const topOffset = -parentRect.top + 10; // 10px from top of viewport
      submenuElement.style.top = `${topOffset}px`;
      submenuElement.style.maxHeight = `${viewportHeight - 20}px`; // 20px total margin
    }
  }

  // Apply positioning on hover
  function handleSubmenuHover(event) {
    const submenu = event.currentTarget.querySelector('.dropdown-menu-level3');
    if (submenu) {
      // Small delay to ensure element is rendered
      setTimeout(() => positionSubmenuToTop(submenu), 10);
    }
  }

  function setupAdvancedSubmenuPositioning() {
    if (!browser) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const submenu = entry.target.querySelector('.dropdown-menu-level3');
        if (submenu && entry.isIntersecting) {
          const rect = submenu.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          if (rect.bottom > viewportHeight - 50) {
            submenu.classList.add('align-top');
            const leftPos = rect.left;
            submenu.style.left = `${leftPos}px`;
          } else {
            submenu.classList.remove('align-top');
            submenu.style.left = '';
            submenu.style.top = '';
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all tier submenus
    document.querySelectorAll('.tier-submenu').forEach(el => {
      observer.observe(el);
    });
  }
  
  let isMobile = false;

  onMount(() => {
    // Quiz-related logic
    const checkQuizStatus = () => {
      if (browser) {
        hasCompletedQuiz = !!localStorage.getItem('globalCitizenshipQuiz');
      }
    };
    
    checkQuizStatus();
    
    const handleStorageChange = () => {
      checkQuizStatus();
    };
    
    // Mobile-related logic
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };
    
    checkMobile();
    
    // Event listeners
    if (browser) {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('focus', handleStorageChange);
      window.addEventListener('resize', checkMobile);
      document.addEventListener('click', closeDropdowns);
    }

    setupAdvancedSubmenuPositioning();
    
    // Combined cleanup
    return () => {
      if (browser) {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('focus', handleStorageChange);
        window.removeEventListener('resize', checkMobile);
        document.removeEventListener('click', closeDropdowns);
      }
    };
  });

  // Function to check if a path is active - only in browser
  function isActive(path) {
    if (!browser) return false;
    return $page.url.pathname === base + path;
  }

  // Helper function to determine framework link styling and content
  function getFrameworkDisplay(framework) {
    const isHighlighted = framework.slug === 'meta-governance' ||
                         framework.slug === 'global-citizenship-practice' ||
                         framework.slug === 'indigenous-governance-and-traditional-knowledge';
    
    const isPrimal = framework.slug === 'treaty-for-our-only-home';
    
    const showEmoji = !isPrimal && !isHighlighted;
    
    return {
      isHighlighted,
      isPrimal,
      showEmoji,
      displayText: (browser && $translationsLoaded) ? ($t(framework.titleKey) || framework.title || framework.name || framework.slug) : (framework.title || framework.name || framework.slug),
      emoji: framework.emoji || '🔗'
    };
  }
</script>

<!-- Keep all existing styles unchanged -->
<style>
  /* ==========================================================================
     HEADER STYLES - Organized Structure
     ========================================================================== */

  /* --------------------------------------------------------------------------
     1. BASE HEADER STYLES
     -------------------------------------------------------------------------- */
  header {
    background: linear-gradient(to bottom right, #2B4B8C, #6B5CA5);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header-content {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
  }

  /* --------------------------------------------------------------------------
     2. LOGO AND BRANDING
     -------------------------------------------------------------------------- */
  .logo-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-img {
    height: 40px;
    width: 40px;
    margin-right: 0.75rem;
  }

  .site-title {
    font-size: 1.2rem !important;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
  }

  /* Responsive site title sizing */
  @media (min-width: 1200px) {
    .header-content .site-title {
      font-size: 1.5rem; /* Larger on wide screens */
    }
  }

  @media (max-width: 1199px) and (min-width: 900px) {
    .header-content .site-title {
      font-size: 1.25rem; /* Medium size */
    }
  }

  @media (max-width: 899px) and (min-width: 768px) {
    .header-content .site-title {
      font-size: 1.1rem; /* Smaller but still readable */
    }
  }

  @media (max-width: 767px) {
    .header-content .site-title {
      font-size: 1rem; /* Compact for mobile */
      white-space: normal; /* Allow wrapping on mobile if absolutely necessary */
    }
  }

  /* --------------------------------------------------------------------------
     3. MOBILE MENU BUTTON
     -------------------------------------------------------------------------- */
  .menu-button {
    background: none;
    border: none;
    color: #DAA520;
    cursor: pointer;
  }

  /* --------------------------------------------------------------------------
     4. NAVIGATION CONTAINER
     -------------------------------------------------------------------------- */
  .nav-container {
    display: none;
    width: 100%;
    margin-top: 1rem;
  }

  .nav-container.open {
    display: flex;
    flex-direction: column;
  }

  /* --------------------------------------------------------------------------
     5. NAVIGATION LIST AND ITEMS
     -------------------------------------------------------------------------- */
  .nav-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .nav-item {
    margin-bottom: 1rem;
  }

  /* --------------------------------------------------------------------------
     6. NAVIGATION LINKS
     -------------------------------------------------------------------------- */
  .nav-link {
    color: #ffffff;
    text-decoration: none;
    padding-bottom: 0.25rem;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    font-size: 1rem !important;
    line-height: 1.2;
    display: inline-flex;
    align-items: center;
    white-space: nowrap; /* Prevent wrapping */
  }

  .nav-link:hover {
    color: #DAA520;
    border-left-color: #DAA520;
  }

  .nav-link.active {
    color: #DAA520;
    border-left-color: #DAA520;
    font-weight: 600;
  }

  .nav-link.nav-link-highlight {
    color: #DAA520;
  }

  /* --------------------------------------------------------------------------
     7. LANGUAGE SELECT
     -------------------------------------------------------------------------- */
  .language-select {
    padding: 0.4rem 0.7rem !important;
    border: 1px solid #2D5F2D;
    border-radius: 0.375rem;
    background-color: #ffffff;
    color: #2B4B8C;
    cursor: pointer;
    font-size: 0.9rem !important;
  }

  /* --------------------------------------------------------------------------
     8. DROPDOWN MENUS - BASE STYLES
     -------------------------------------------------------------------------- */
  .dropdown {
    position: relative;
  }

  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 0; /* Remove any gap that might cause issues */
  }

  .dropdown-icon {
    display: inline-block;
    margin-left: 0.25rem;
    vertical-align: middle;
    transition: transform 0.2s;
    width: 14px !important;
    height: 14px !important;
    flex-shrink: 0; /* Prevent icon from shrinking */
  }

  .dropdown:hover .dropdown-icon {
    transform: rotate(180deg);
  }

  .dropdown-toggle {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
  }

  /* Hover bridge for dropdowns */
  .dropdown::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 0.5rem;
    background-color: transparent;
  }

  /* --------------------------------------------------------------------------
     9. DROPDOWN MENU CONTAINERS
     -------------------------------------------------------------------------- */
  .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 210px;
    background-color: #ffffff;
    border: 1px solid #2D5F2D;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 60;
    margin-top: 0.25rem;
    padding-top: 0.25rem;
    flex-direction: column;
    overflow-x: visible;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
  }

  .dropdown-scrollable-content {
    max-height: 50vh;
    overflow-y: auto;
  }

  /* --------------------------------------------------------------------------
     10. DROPDOWN MENU ITEMS
     -------------------------------------------------------------------------- */
  .dropdown-menu a,
  .dropdown-scrollable-content a {
    display: block;
    padding: 0.5rem 0.9rem !important;
    color: #2B4B8C;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    font-size: 0.9rem !important;
    line-height: 1.3;
  }

  .dropdown-menu a:hover,
  .dropdown-scrollable-content a:hover {
    background-color: #f7f1e3;
    color: #DAA520;
    border-left-color: #DAA520;
  }

  .dropdown-menu a.active,
  .dropdown-scrollable-content a.active {
    color: #DAA520;
    border-left-color: #DAA520;
    font-weight: 600;
  }

  .dropdown-item-btn {
    display: block;
    width: 100%;
    padding: 0.5rem 0.9rem !important;
    color: #2B4B8C;
    text-decoration: none;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    font-size: 0.9rem !important;
    line-height: 1.3;
  }

  .dropdown-item-btn:hover {
    background-color: #f7f1e3;
    color: #DAA520;
    border-left-color: #DAA520;
  }

  .dropdown-item-btn:focus {
    outline: 2px solid #DAA520;
    outline-offset: -2px;
  }

  /* --------------------------------------------------------------------------
     11. DROPDOWN SEPARATORS AND SECTIONS
     -------------------------------------------------------------------------- */
  .dropdown-separator {
    height: 1px;
    background-color: #e5e7eb;
    margin: 0.5rem 0;
  }

  .dropdown-section-title {
    padding: 0.25rem 0.9rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  /* --------------------------------------------------------------------------
     12. MULTI-LEVEL DROPDOWNS - LEVEL 2
     -------------------------------------------------------------------------- */
  .dropdown-submenu {
    position: relative;
  }

  .dropdown-submenu > a {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dropdown-submenu > a::after {
    content: '▸';
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .dropdown-submenu .dropdown-menu-level2 {
    display: none;
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    min-width: 220px;
    width: max-content;
    max-width: 250px;
    background-color: #ffffff;
    border: 1px solid #2D5F2D;
    border-radius: 0.375rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow-x: visible;
    overflow-y: visible;
  }

  .dropdown-submenu:hover > .dropdown-menu-level2 {
    display: block;
  }

  /* Hover bridge for level 2 */
  .dropdown-submenu::before {
    content: '';
    position: absolute;
    top: 0;
    right: -5px;
    width: 10px;
    height: 100%;
    background-color: transparent;
    z-index: 999;
  }

  /* --------------------------------------------------------------------------
     13. MULTI-LEVEL DROPDOWNS - LEVEL 3 (TIERS)
     -------------------------------------------------------------------------- */
  .tier-submenu {
    position: relative;
  }

  .tier-submenu > a {
    display: block;
    padding: 0.4rem 0.9rem !important;
    color: #6b7280;
    background-color: transparent;
    font-weight: 500;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    font-size: 0.8rem !important;
    line-height: 1.3;
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tier-submenu > a:hover {
    background-color: #f1f5f9;
    color: #1e293b;
    border-left-color: #6B5CA5;
  }

  .tier-submenu > a::after {
    content: '▸';
    font-size: 0.75rem;
    opacity: 0.7;
    position: absolute;
    right: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .tier-submenu .dropdown-menu-level3 {
    display: none;
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    min-width: 300px;
    width: max-content;
    max-width: 350px;
    background-color: #ffffff;
    border: 1px solid #2D5F2D;
    border-radius: 0.375rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    overflow-x: visible;
    padding-top: 0.25rem;
  }

  .tier-submenu:hover > .dropdown-menu-level3 {
    display: block;
  }

  /* Hover bridge for level 3 */
  .tier-submenu::before {
    content: '';
    position: absolute;
    top: 0;
    right: -5px;
    width: 10px;
    height: 100%;
    background-color: transparent;
    z-index: 1000;
  }

  .tier-submenu .dropdown-menu-level3-scrollable {
    max-height: 400px;
    overflow-y: auto;
    padding-bottom: 0.25rem;
  }

  /* Level 3 menu items */
  .tier-submenu .dropdown-menu-level3 a,
  .tier-submenu .dropdown-menu-level3-scrollable a {
    padding: 0.5rem 1.2rem !important;
    font-size: 0.85rem !important;
    white-space: normal !important;
    display: flex;
    align-items: center;
    color: #2B4B8C;
    text-decoration: none;
    border-left: 3px solid transparent;
    transition: all 0.2s;
    line-height: 1.3;
    min-height: 2.5rem;
  }

  .tier-submenu .dropdown-menu-level3 a:hover,
  .tier-submenu .dropdown-menu-level3-scrollable a:hover {
    background-color: #f7f1e3;
    color: #DAA520;
    border-left-color: #DAA520;
  }

  .tier-submenu .dropdown-menu-level3 a.active,
  .tier-submenu .dropdown-menu-level3-scrollable a.active {
    color: #DAA520;
    border-left-color: #DAA520;
    font-weight: 600;
  }

  /* Dynamic positioning for level 3 menus */
  .tier-submenu .dropdown-menu-level3.align-top {
    position: fixed;
    top: 10px;
    max-height: calc(100vh - 20px);
    overflow-y: auto;
    z-index: 1002;
  }

  .tier-submenu .dropdown-menu-level3.align-top .dropdown-menu-level3-scrollable {
    max-height: calc(100vh - 60px);
  }

  /* Ensure proper stacking */
  .tier-submenu:hover > .dropdown-menu-level3.align-top {
    display: block;
    position: fixed;
  }

  /* --------------------------------------------------------------------------
     14. FRAMEWORK GROUPING
     -------------------------------------------------------------------------- */
  .framework-group-header {
    padding: 0.5rem 1.2rem 0.25rem 1.2rem;
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }

  .framework-group-header:first-child {
    margin-top: 0.25rem;
  }

  .group-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
  }

  .framework-group-header + a {
    padding-left: 1.5rem !important;
    font-size: 0.8rem !important;
    border-left: 3px solid transparent;
  }

  .tier-submenu .dropdown-menu-level3 .framework-group-header ~ a {
    padding-left: 1.5rem !important;
    position: relative;
  }

  .tier-submenu .dropdown-menu-level3 .framework-group-header ~ a::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #d1d5db;
    transition: background-color 0.2s;
  }

  .tier-submenu .dropdown-menu-level3 .framework-group-header ~ a:hover::before {
    background-color: #DAA520;
  }

  /* --------------------------------------------------------------------------
     15. SPECIAL FRAMEWORK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  /* Primal highlight for foundational Treaty */
  .dropdown-menu a.primal,
  .tier-submenu .dropdown-menu-level3 a.primal,
  .tier-submenu .dropdown-menu-level3-scrollable a.primal {
    background-color: #e0f2fe !important;
    font-weight: 700 !important;
    color: #1e40af !important;
    border-left: 3px solid #1d4ed8 !important;
  }

  /* Highlighted frameworks (Guiding Trio) */
  .dropdown-menu a.highlighted,
  .tier-submenu .dropdown-menu-level3 a.highlighted,
  .tier-submenu .dropdown-menu-level3-scrollable a.highlighted {
    background-color: #fffbeb !important;
    font-weight: 700 !important;
    color: #92400e !important;
    border-left-color: #92400e !important;
  }

  /* Meta-governance special styling */
  .dropdown-menu a.meta-governance {
    color: #DAA520;
    font-weight: 700;
    background-color: #fffbeb;
    border-left-color: #DAA520;
  }

  .dropdown-menu a.meta-governance:hover {
    background-color: #fef3c7;
  }

  /* --------------------------------------------------------------------------
     16. MOBILE STYLES
     -------------------------------------------------------------------------- */
  @media (max-width: 768px) {

    .dropdown-menu {
      z-index: 60;
    }
    
    .mobile-submenu {
      z-index: 61;
    }
    
    .mobile-tier-submenu {
      z-index: 62;
    }
    /* Mobile menu button visibility */
    .menu-button {
      display: block;
    }
    
    /* Mobile dropdown behavior */
    .dropdown-menu {
      position: static;
      box-shadow: none;
      border: none;
      border-left: 3px solid #2D5F2D;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      margin-left: 1rem;
      display: none;
      max-height: 80vh;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      background-color: rgba(255, 255, 255, 0.95);
      border-radius: 0.375rem;
      padding: 0.5rem 0;
    }
    
    .dropdown.open .dropdown-menu {
      display: block;
    }
    
    .dropdown .dropdown-toggle {
      display: inline-block;
      margin-left: 0.5rem;
      cursor: pointer;
    }

    /* Mobile submenu containers */
    .mobile-submenu {
      margin-left: 1rem;
      border-left: 2px solid #e5e7eb;
      background-color: #f9fafb;
      border-radius: 0.25rem;
      margin-top: 0.5rem;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .mobile-submenu.hidden {
      display: none;
    }

    .mobile-tier-submenu {
      margin-left: 1rem;
      border-left: 2px solid #e5e7eb;
      background-color: #f3f4f6;
      border-radius: 0.375rem;
      margin-top: 0.25rem;
      max-height: 60vh;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 1rem;
    }

    .mobile-tier-submenu.hidden {
      display: none;
    }

    .mobile-submenu:not(.hidden) {
      display: block;
      max-height: 70vh;
      overflow-y: auto;
    }

    /* Mobile toggle buttons */
    .mobile-submenu-toggle,
    .mobile-tier-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem 0.9rem;
      background: none;
      border: none;
      color: #2B4B8C;
      font-size: 0.9rem;
      cursor: pointer;
      text-align: left;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }

    .mobile-submenu-toggle:hover,
    .mobile-tier-toggle:hover {
      background-color: #f7f1e3;
      color: #DAA520;
      border-left-color: #DAA520;
    }

    .mobile-submenu-toggle svg,
    .mobile-tier-toggle svg {
      transition: transform 0.2s;
    }

    .mobile-submenu-toggle.open svg,
    .mobile-tier-toggle.open svg {
      transform: rotate(90deg);
    }

    /* Mobile group headers */
    .mobile-group-header {
      padding: 0.4rem 1rem 0.2rem 1rem;
      margin-top: 0.5rem;
      margin-bottom: 0.25rem;
      background-color: #f1f5f9;
      border-bottom: 1px solid #cbd5e1;
      border-radius: 0.25rem 0.25rem 0 0;
    }

    .mobile-group-header:first-child {
      margin-top: 0.25rem;
    }

    .mobile-group-label {
      font-size: 0.7rem;
      font-weight: 600;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: block;
    }

    /* Mobile framework links */
   .mobile-framework-link {
     display: block;
     padding: 0.75rem 1.25rem !important;
     font-size: 0.8rem !important;
     color: #2B4B8C;
     text-decoration: none;
     border-left: 3px solid transparent;
     transition: all 0.2s;
     background-color: rgba(255, 255, 255, 0.5);
     position: relative;
     white-space: normal !important;
     line-height: 1.4;
     min-height: 2.5rem;
     box-sizing: border-box;
     width: 100%;
   }

    .mobile-framework-link:hover {
      background-color: #f7f1e3;
      color: #DAA520;
      border-left-color: #DAA520;
    }

    .mobile-framework-link.active {
      color: #DAA520;
      border-left-color: #DAA520;
      font-weight: 600;
      background-color: #fef3c7;
    }

    /* Mobile special framework styling */
    .mobile-framework-link.highlighted {
      background-color: #fffbeb !important;
      font-weight: 700 !important;
      color: #92400e !important;
      border-left-color: #92400e !important;
    }

    .mobile-framework-link.highlighted::after {
      content: '⭐';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
    }

    .mobile-framework-link.primal {
      background-color: #e0f2fe !important;
      font-weight: 700 !important;
      color: #1e40af !important;
      border-left-color: #1d4ed8 !important;
    }

    .mobile-framework-link.primal::after {
      content: '🌍';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
    }

    /* Mobile group indicators */
    .mobile-group-header + .mobile-framework-link::before {
      content: '';
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: #d1d5db;
      transition: background-color 0.2s;
    }

    .mobile-framework-link:hover::before {
      background-color: #DAA520;
    }

    /* Mobile group spacing */
    .mobile-group-header + .mobile-framework-link + .mobile-group-header {
      margin-top: 0.75rem;
    }

    /* Disable desktop submenu behavior on mobile */
    .dropdown-submenu .dropdown-menu-level2,
    .tier-submenu .dropdown-menu-level3 {
      position: static;
      box-shadow: none;
      border: none;
      margin: 0;
      display: none;
    }

    .dropdown-submenu > a::after,
    .tier-submenu > a::after {
      display: none;
    }

    .dropdown-scrollable-content {
      max-height: 50vh;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 0.5rem;
    }

    .nav-container.open {
      display: flex;
      flex-direction: column;
      max-height: none;
      overflow: visible;
    }
    
    .dropdown.open .dropdown-menu {
      display: block;
      position: static;
      max-height: 80vh;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
    
    .mobile-tier-submenu:not(.hidden) {
      display: block;
      max-height: 60vh;
      overflow-y: auto;
    }
  }

  .mobile-submenu,
  .mobile-tier-submenu,
  .dropdown-menu,
  .dropdown-scrollable-content {
    scroll-behavior: smooth;
  }

  /* --------------------------------------------------------------------------
     17. DESKTOP STYLES
     -------------------------------------------------------------------------- */
  @media (min-width: 768px) {
    /* Desktop layout adjustments */
    .header-content {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-section {
      width: auto;
    }
    
    .menu-button {
      display: none;
    }
    
    .nav-container {
      display: flex !important;
      flex-direction: row;
      align-items: center;
      width: auto;
      margin-top: 0;
    }
    
    .nav-list {
      flex-direction: row;
      margin-right: 1.5rem;
      align-items: center;
    }
    
    .nav-item {
      margin-bottom: 0;
      margin-right: 1.5rem !important;
    }
    
    .language-select {
      margin-left: 1rem !important;
    }

    /* Right-side positioning for menus that would overflow */
    .dropdown-submenu .dropdown-menu-level2.position-right {
      left: auto;
      right: calc(100% + 2px);
    }

    .tier-submenu .dropdown-menu-level3.position-right {
      left: auto;
      right: calc(100% + 2px);
    }
  }

  /* --------------------------------------------------------------------------
     18. RESPONSIVE BREAKPOINTS
     -------------------------------------------------------------------------- */
  
  /* Extra wide screens - more space available */
  @media (min-width: 1400px) {
    .nav-item {
      margin-right: 2rem !important;
    }
    
    .nav-link {
      font-size: 1.1rem !important;
    }
  }

  /* Large desktop adjustments */
  @media (max-width: 1399px) and (min-width: 1200px) {
    .nav-item {
      margin-right: 1.8rem !important;
    }
    
    .nav-link {
      font-size: 1.05rem !important;
    }
  }

  /* Medium desktop adjustments */
  @media (max-width: 1199px) and (min-width: 1000px) {
    .nav-item {
      margin-right: 1.5rem !important;
    }
    
    .nav-link {
      font-size: 1rem !important;
    }
    
    .language-select {
      font-size: 0.9rem !important;
    }
  }

  /* Small desktop adjustments */
  @media (max-width: 999px) and (min-width: 768px) {
    .nav-item {
      margin-right: 1.2rem !important;
    }
    
    .nav-link {
      font-size: 0.95rem !important;
      white-space: nowrap; /* Prevent text wrapping */
    }
    
    .language-select {
      font-size: 0.85rem !important;
      padding: 0.35rem 0.6rem !important;
    }
    
    .dropdown-menu a {
      font-size: 0.85rem !important;
      padding: 0.45rem 0.8rem !important;
    }

    /* Ensure dropdown icons stay inline */
    .dropdown-icon {
      margin-left: 0.15rem !important;
    }
  }

  /* Very tight desktop screens */
  @media (max-width: 900px) and (min-width: 768px) {
    .nav-item {
      margin-right: 1rem !important;
    }
    
    .nav-link {
      font-size: 0.9rem !important;
      white-space: nowrap;
    }
    
    .dropdown-icon {
      margin-left: 0.1rem !important;
      width: 12px !important;
      height: 12px !important;
    }
  }

  /* --------------------------------------------------------------------------
     19. UTILITY CLASSES
     -------------------------------------------------------------------------- */
  .hidden {
    display: none;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  @media (min-width: 768px) {
    .desktop-only {
      display: block;
    }
    
    .mobile-only {
      display: none;
    }
    
    .md\:hidden {
      display: none;
    }
    
    .md\:inline-block {
      display: inline-block;
    }
  }
</style>

<header>
  <div class="container">
    <div class="header-content">
      <div class="logo-section">
        <a href="{base}/" class="logo-link">
          <img src="{base}/logo.svg" alt="Global Governance Frameworks" class="logo-img" />
          <span class="site-title">Global Governance Frameworks</span>
        </a>
        
        <button 
          type="button" 
          class="menu-button" 
          on:click={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {#if isMenuOpen}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          {/if}
        </button>
      </div>
      
      <nav class={`nav-container ${isMenuOpen ? 'open' : ''}`}>
        <ul class="nav-list">
          <li class="nav-item">
            <a 
              href="{base}/"
              class={`nav-link ${isActive('/') || isActive('') ? 'active' : ''}`}
              data-sveltekit-preload-data="tap"
            >
              {browser ? ($t('common.header.home') || 'Home') : 'Home'}
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="{base}/overview"
              class={`nav-link ${isActive('/overview') || isActive('') ? 'active' : ''}`}
              data-sveltekit-preload-data="tap"
            >
              {browser ? ($t('common.header.overview') || 'Overview') : 'Overview'}
            </a>
          </li>

          <!-- Single Frameworks Dropdown with Hierarchical Structure -->
          <li class="nav-item dropdown" class:open={isFrameworksDropdownOpen}>
            <div class="dropdown-header">
              <a 
                href="{base}/frameworks"
                class={`nav-link ${browser && $page.url.pathname.startsWith(base + '/frameworks') ? 'active' : ''}`}
                data-sveltekit-preload-data="tap"
              >
                {browser && $translationsLoaded ? ($t('common.header.framework') || 'Frameworks') : 'Frameworks'}
                <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon hidden md:inline-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <button 
                type="button" 
                class="dropdown-toggle md:hidden" 
                on:click|stopPropagation={toggleFrameworksDropdown}
                on:keydown={(e) => e.key === 'Enter' && toggleFrameworksDropdown(e)}
                aria-label={isFrameworksDropdownOpen ? 'Close frameworks menu' : 'Open frameworks menu'}
                role="button"
                tabindex="0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d={isFrameworksDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>

            <div class="dropdown-menu" on:click|stopPropagation={() => {}} role="menu">
              <!-- Adaptive Quiz/My Path Navigation -->
              {#if hasCompletedQuiz}
                <a 
                  href="{base}/my-path" 
                  class={`${isActive('/my-path') ? 'active' : ''}`}
                  data-sveltekit-preload-data="tap" 
                  role="menuitem"
                >
                  👤 {browser && $translationsLoaded ? ($t('common.header.myPath') || 'My Path') : 'My Path'}
                </a>
              {:else}
                <a 
                  href="{base}/quiz" 
                  class={`${isActive('/quiz') ? 'active' : ''}`}
                  data-sveltekit-preload-data="tap" 
                  role="menuitem"
                >
                  🧭 {browser && $translationsLoaded ? ($t('common.header.findYourPlace') || 'Find Your Place') : 'Find Your Place'}
                </a>
              {/if}
              
              <!-- Visual Separator -->
              <div class="dropdown-separator"></div>

              <!-- Desktop: Implementation Frameworks with Tiered Sub-Sub-Menus -->
              <div class="dropdown-submenu desktop-only">
                <a href="{base}/frameworks" role="menuitem">
                  {browser && $translationsLoaded ? ($t('common.header.tieredFrameworks') || 'Tiered Frameworks') : 'Tiered Frameworks'}
                </a>
                <div class="dropdown-menu-level2">
                  {#each tiers as tier}
                    {@const tierFrameworks = frameworksByTier[tier] || []}
                    {@const groups = getGroupsForTier(tier)}
                    {@const ungroupedFrameworks = getFrameworksByTierAndGroup(tier, null)}
                    
                    <div class="tier-submenu" on:mouseenter={handleSubmenuHover}>
                      <a href="{base}/frameworks/tier-{tier}" role="menuitem">
                        {browser && $translationsLoaded ? ($t(tierMetadata[tier]?.titleKey) || `Tier ${tier}`) : `Tier ${tier}`}
                      </a>
                      <div class="dropdown-menu-level3">
                        {#if groups.length > 0}
                          <!-- Display grouped frameworks -->
                          {#each groups as group}
                            {@const groupFrameworks = getFrameworksByTierAndGroup(tier, group)}
                            {@const groupInfo = groupMetadata[group]}
                            
                            {#if groupFrameworks.length > 0}
                              <div class="framework-group-header">
                                <span class="group-label">
                                  {groupInfo?.emoji || '📋'} {browser && $translationsLoaded ? ($t(groupInfo?.titleKey) || group) : group}
                                </span>
                              </div>
                              {#each groupFrameworks as framework}
                                {@const display = getFrameworkDisplay(framework)}
                                <a 
                                  href="{base}{framework.path}" 
                                  class:active={isActive(framework.path)}
                                  class:primal={display.isPrimal}
                                  class:highlighted={display.isHighlighted}
                                  data-sveltekit-preload-data="tap" 
                                  role="menuitem"
                                >
                                  {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                                </a>
                              {/each}
                            {/if}
                          {/each}
                          
                          <!-- Display ungrouped frameworks if any -->
                          {#if ungroupedFrameworks.length > 0}
                            <div class="framework-group-header">
                              <span class="group-label">
                                📌 {browser && $translationsLoaded ? ($t('framework.groups.other.title') || 'Other') : 'Other'}
                              </span>
                            </div>
                            {#each ungroupedFrameworks as framework}
                              {@const display = getFrameworkDisplay(framework)}
                              <a 
                                href="{base}{framework.path}" 
                                class:active={isActive(framework.path)}
                                class:primal={display.isPrimal}
                                class:highlighted={display.isHighlighted}
                                data-sveltekit-preload-data="tap" 
                                role="menuitem"
                              >
                                {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                              </a>
                            {/each}
                          {/if}
                        {:else}
                          <!-- Display all frameworks without grouping if no groups exist -->
                          {#each tierFrameworks as framework}
                            {@const display = getFrameworkDisplay(framework)}
                            <a 
                              href="{base}{framework.path}" 
                              class:active={isActive(framework.path)}
                              class:primal={display.isPrimal}
                              class:highlighted={display.isHighlighted}
                              data-sveltekit-preload-data="tap" 
                              role="menuitem"
                            >
                              {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                            </a>
                          {/each}
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
              
              <!-- Mobile: Collapsible Tiered Frameworks with Groups -->
              <div class="mobile-only">
                <button 
                  type="button" 
                  class={`mobile-submenu-toggle ${isTieredFrameworksOpen ? 'open' : ''}`}
                  on:click|stopPropagation={(e) => toggleTieredFrameworks(e)}
                  aria-label={isTieredFrameworksOpen ? 'Close tiered frameworks' : 'Open tiered frameworks'}
                >
                  <span>{browser && $translationsLoaded ? ($t('common.header.tieredFrameworks') || 'Tiered Frameworks') : 'Tiered Frameworks'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <div class={`mobile-submenu ${isTieredFrameworksOpen ? '' : 'hidden'}`}>
                  {#each tiers as tier}
                    {@const tierFrameworks = frameworksByTier[tier] || []}
                    {@const groups = getGroupsForTier(tier)}
                    {@const ungroupedFrameworks = getFrameworksByTierAndGroup(tier, null)}
                    
                    <div>
                      <button 
                        type="button" 
                        class={`mobile-tier-toggle ${openTiers[tier] ? 'open' : ''}`}
                        on:click|stopPropagation={(e) => toggleTier(tier, e)}
                        aria-label={openTiers[tier] ? `Close tier ${tier}` : `Open tier ${tier}`}
                      >
                        <span>{browser && $translationsLoaded ? ($t(tierMetadata[tier]?.titleKey) || `Tier ${tier}`) : `Tier ${tier}`}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <div class={`mobile-tier-submenu ${openTiers[tier] ? '' : 'hidden'}`}>
                        
                        {#if groups.length > 0}
                          <!-- Display grouped frameworks -->
                          {#each groups as group}
                            {@const groupFrameworks = getFrameworksByTierAndGroup(tier, group)}
                            {@const groupInfo = groupMetadata[group]}
                            
                            {#if groupFrameworks.length > 0}
                              <div class="mobile-group-header">
                                <span class="mobile-group-label">
                                  {groupInfo?.emoji || '📋'} {browser && $translationsLoaded ? ($t(groupInfo?.titleKey) || group) : group}
                                </span>
                              </div>
                              {#each groupFrameworks as framework}
                                {@const display = getFrameworkDisplay(framework)}
                                <a 
                                  href="{base}{framework.path}" 
                                  class:active={isActive(framework.path)}
                                  class:primal={display.isPrimal}
                                  class:highlighted={display.isHighlighted}
                                  data-sveltekit-preload-data="tap" 
                                  role="menuitem"
                                  class="mobile-framework-link"
                                >
                                  {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                                </a>
                              {/each}
                            {/if}
                          {/each}
                          
                          <!-- Display ungrouped frameworks if any -->
                          {#if ungroupedFrameworks.length > 0}
                            <div class="mobile-group-header">
                              <span class="mobile-group-label">
                                📌 {browser ? ($t('framework.groups.other.title') || 'Other') : 'Other'}
                              </span>
                            </div>
                            {#each ungroupedFrameworks as framework}
                              {@const display = getFrameworkDisplay(framework)}
                              <a 
                                href="{base}{framework.path}" 
                                class:active={isActive(framework.path)}
                                class:primal={display.isPrimal}
                                class:highlighted={display.isHighlighted}
                                data-sveltekit-preload-data="tap" 
                                role="menuitem"
                                class="mobile-framework-link"
                              >
                                {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                              </a>
                            {/each}
                          {/if}
                        {:else}
                          <!-- Display all frameworks without grouping if no groups exist -->
                          {#each tierFrameworks as framework}
                            {@const display = getFrameworkDisplay(framework)}
                            <a 
                              href="{base}{framework.path}" 
                              class:active={isActive(framework.path)}
                              class:primal={display.isPrimal}
                              class:highlighted={display.isHighlighted}
                              data-sveltekit-preload-data="tap" 
                              role="menuitem"
                              class="mobile-framework-link"
                            >
                              {display.showEmoji ? display.emoji + ' ' : ''}{display.displayText}
                            </a>
                          {/each}
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Visual Separator -->
              <div class="dropdown-separator"></div>      
                            
              <!-- Scrollable Content Area for all the static links -->
              <div class="dropdown-scrollable-content">
                <a href="{base}/frameworks" class={isActive('/frameworks') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkOverview') || 'Overview') : 'Overview'}
                </a>
                {#if isDevMode}
                <a href="{base}/frameworks/docs" class={isActive('/frameworks/docs') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkDocs') || 'Documentation') : 'Documentation'}
                </a>
                {/if}
                <a href="{base}/frameworks/docs/principles" class={isActive('/frameworks/docs/principles') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkPrinciples') || 'Principles') : 'Principles'}
                </a>
                <a href="{base}/frameworks/docs/implementation" class={isActive('/frameworks/docs/implementation') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkImplementation') || 'Implementation') : 'Implementation'}
                </a>
                <a href="{base}/frameworks/guides" class={browser && $page.url.pathname.startsWith(base + '/frameworks/guides') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkGuides') || 'Implementation Guides') : 'Implementation Guides'}
                </a>
                {#if isDevMode}
                <a href="{base}/frameworks/hubs" class={isActive('/frameworks/hubs') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkHubs') || 'Hubs') : 'Hubs'}
                </a>
                {/if}
                <a href="{base}/frameworks/tools" class={isActive('/frameworks/tools') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkTools') || 'Tools') : 'Tools'}
                </a>
                {#if isDevMode}
                <a href="{base}/frameworks/visuals" class={isActive('/frameworks/visuals') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkVisuals') || 'Visuals') : 'Visuals'}
                </a>
                <a href="{base}/downloads" class={isActive('/downloads') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkDownloads') || 'Framework Downloads') : 'Downloads'}
                </a>
                <a href="{base}/frameworks/docs/case-studies" class={isActive('/frameworks/docs/case-studies') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkCaseStudies') || 'Case Studies') : 'Case Studies'}
                </a>
                <a href="{base}/frameworks/ai-futures" class={isActive('/frameworks/ai-futures') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkAIFutures') || 'AI Futures') : 'AI Futures'}
                </a>
                <a href="{base}/frameworks/docs/resources" class={isActive('/frameworks/docs/resources') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkResources') || 'Resources') : 'Resources'}
                </a>
                <a href="{base}/frameworks/docs/glossary" class={isActive('/frameworks/docs/glossary') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                  {browser ? ($t('common.header.frameworkGlossary') || 'Glossary') : 'Glossary'}
                </a>
                {/if}
              </div>
            </div>
          </li>

          <!-- Get Involved Dropdown -->
          <li class="nav-item dropdown" class:open={isGetInvolvedDropdownOpen}>
            <div class="dropdown-header">
              <a 
                href="{base}/get-involved"
                class={`nav-link ${browser && $page.url.pathname.startsWith(base + '/get-involved') ? 'active' : ''}`}
                data-sveltekit-preload-data="tap"
              >
                {browser ? ($t('common.header.getInvolved') || 'Get Involved') : 'Get Involved'}
                <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon hidden md:inline-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <button 
                type="button" 
                class="dropdown-toggle md:hidden" 
                on:click|stopPropagation={toggleGetInvolvedDropdown}
                on:keydown={(e) => e.key === 'Enter' && toggleGetInvolvedDropdown(e)}
                aria-label={isGetInvolvedDropdownOpen ? 'Close get involved menu' : 'Open get involved menu'}
                role="button"
                tabindex="0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d={isGetInvolvedDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>

            <div class="dropdown-menu" on:click|stopPropagation={() => {}} role="menu">
              <!-- <a href="{base}/get-involved/onboarding" class={isActive('/get-involved/onboarding') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedOnboarding') ||  'Onboarding') : 'Onboarding'}
              </a> TO BE ADDED WHEN GGF CATALYST IS OFFICIALLY REGISTERED-->
              <a href="{base}/get-involved/founding" class={isActive('/get-involved/founding') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedFounding') ||  'Founding Organization') : 'Founding Organization'}
              </a>
              <a href="{base}/get-involved/frameworks" class={isActive('/get-involved/frameworks') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedFrameworks') || 'Contribute to Frameworks') : 'Contribute to Frameworks'}
              </a>
              <a href="{base}/get-involved/translations" class={isActive('/get-involved/translations') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedTranslations') || 'Contribute Translations') : 'Contribute Translations'}
              </a>
              <a href="{base}/get-involved/website" class={isActive('/get-involved/website') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedWebsite') || 'Contribute to Website') : 'Contribute to Website'}
              </a>
              <a href="{base}/get-involved/outreach" class={isActive('/get-involved/outreach') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.getInvolvedOutreach') || 'Community & Outreach') : 'Community & Outreach'}
              </a>
            </div>
          </li>

          <!-- Resources Dropdown -->
          <li class="nav-item dropdown" class:open={isResourcesDropdownOpen}>
            <div class="dropdown-header">
              <a 
                href="{base}/resources"
                class={`nav-link ${browser && $page.url.pathname.startsWith(base + '/resources') ? 'active' : ''}`}
                data-sveltekit-preload-data="tap"
              >
                {browser ? ($t('common.header.resources') || 'Resources') : 'Resources'}
                <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon hidden md:inline-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <button 
                type="button" 
                class="dropdown-toggle md:hidden" 
                on:click|stopPropagation={toggleResourcesDropdown}
                on:keydown={(e) => e.key === 'Enter' && toggleResourcesDropdown(e)}
                aria-label={isResourcesDropdownOpen ? 'Close resources menu' : 'Open resources menu'}
                role="button"
                tabindex="0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d={isResourcesDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>

            <div class="dropdown-menu" on:click|stopPropagation={() => {}} role="menu">
              <a href="{base}/blog" class={isActive('/blog') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.blog') || 'Blog') : 'Blog'}
              </a>
              <a href="{base}/updates" class={isActive('/updates') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.updates') || 'Updates') : 'Updates'}
              </a>
              <a href="{base}/resources/whitepapers" class={isActive('/resources/whitepapers') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.whitepapers') || 'Whitepapers') : 'Whitepapers'}
              </a>
              <a href="{base}/resources/books" class={isActive('/resources/books') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.books') || 'Books') : 'Books'}
              </a>
              <a href="{base}/resources/tools" class={isActive('/resources/tools') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.tools') || 'Interactive Tools') : 'Interactive Tools'}
              </a>              <a href="{base}/resources/protocols" class={isActive('/resources/protocols') ? 'active' : ''} data-sveltekit-preload-data="tap" role="menuitem">
                {browser ? ($t('common.header.protocols') || 'Protocols & Methods') : 'Protocols & Methods'}
              </a>
            </div>
          </li>

          <li class="nav-item">
            <a 
              href="{base}/about"
              class={`nav-link ${isActive('/about') ? 'active' : ''}`}
              data-sveltekit-preload-data="tap"
            >
              {browser ? ($t('common.header.about') || 'About') : 'About'}
            </a>
          </li>
          <li class="nav-item">
            <a 
              href="{base}/contact"
              class={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              data-sveltekit-preload-data="tap"
            >
              {browser ? ($t('common.header.contact') || 'Contact') : 'Contact'}
            </a>
          </li>
        </ul>
        
        <div>
          <select 
            aria-label={browser ? ($t('common.language.select') || 'Select language') : 'Select language'}
            value={browser ? $locale : 'en'} 
            on:change={handleLocaleChange}
            class="language-select"
            title={browser ? ($t('common.language.tooltip') || 'Change language') : 'Change language'}
          >
            {#each (browser ? $locales : ['en', 'sv']) as loc}
              <option value={loc}>{loc.toUpperCase()}</option>
            {/each}
          </select>
        </div>
      </nav>
    </div>
  </div>
</header>
