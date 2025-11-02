// src/lib/data/precomputedFrameworkDatabase.js
// Fixed version with proper subscription management and caching

import { writable, derived, get } from 'svelte/store';

// Singleton pattern for database state
let frameworksStore = null;
let databaseStore = null;
let initializationPromise = null;
let isInitialized = false;

// Pre-compute expensive operations at module load time
const getIcon = (() => {
  const iconMap = new Map([
    ['treaty', '🏛️'],
    ['climate', '🌍'],
    ['energy', '🌍'],
    ['peace', '🕊️'],
    ['technology', '⚡'],
    ['education', '📚'],
    ['digital', '💻'],
    ['culture', '🏛️'],
    ['space', '🚀'],
    ['consciousness', '🧠'],
    ['environment', '🌱'],
    ['urban', '🏙️'],
    ['ethics', '⚖️']
  ]);
  
  return (slug) => {
    if (!slug) return '📋';
    
    for (const [key, icon] of iconMap) {
      if (slug.includes(key)) return icon;
    }
    return '📋';
  };
})();

const tierColors = Object.freeze({
  0: '#8B5A3C',
  1: '#2D5F2D', 
  2: '#6B5CA5',
  3: '#DEB887',
  4: '#2F4F4F'
});

// Cached tier info
export const TIER_INFO_CACHE = new Map([
  [0, { class: 'tier-0', priority: 'critical', label: 'framework.tier.0.title' }],
  [1, { class: 'tier-1', priority: 'urgent', label: 'framework.tier.1.title' }],
  [2, { class: 'tier-2', priority: 'important', label: 'framework.tier.2.title' }],
  [3, { class: 'tier-3', priority: 'strategic', label: 'framework.tier.3.title' }],
  [4, { class: 'tier-4', priority: 'visionary', label: 'framework.tier.4.title' }]
]);

export function getTierInfoOptimized(tier) {
  return TIER_INFO_CACHE.get(tier) || {
    label: 'findYourPlace.tiers.developmental',
    class: 'tier-developmental',
    priority: 'strategic'
  };
}

// Process frameworks into database format - MEMOIZED
let lastFrameworks = null;
let lastDatabase = null;

function processFrameworksToDatabase(frameworks) {
  // Return cached result if input hasn't changed
  if (frameworks === lastFrameworks && lastDatabase) {
    return lastDatabase;
  }
  
  const database = frameworks.reduce((acc, framework) => {
    const key = framework.slug;
    
    acc[key] = {
      name: framework.titleKey,
      description: `findYourPlace.frameworks.database.${framework.slug.replace(/-/g, '')}.description`,
      tier: framework.tier,
      color: tierColors[framework.tier] || '#6B7280',
      route: framework.path,
      importance: framework.tier === 0 ? 'critical' : 'normal',
      icon: getIcon(framework.slug),
      status: framework.status,
      version: framework.version,
      slug: framework.slug
    };
    
    return acc;
  }, {});
  
  // Cache the result
  lastFrameworks = frameworks;
  lastDatabase = database;
  
  return database;
}

// Create stores for reactive framework data
function createFrameworkStores() {
  if (frameworksStore && databaseStore) {
    return { frameworksStore, databaseStore };
  }
  
  // Store for raw frameworks data
  frameworksStore = writable([]);
  
  // Derived store for computed database with memoization
  databaseStore = derived(
    frameworksStore,
    ($frameworks) => processFrameworksToDatabase($frameworks),
    {} // Initial value
  );
  
  return { frameworksStore, databaseStore };
}

// Lazy initialization with proper singleton pattern
async function initializeFrameworks() {
  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Return immediately if already initialized
  if (isInitialized) {
    const { frameworksStore: fStore } = createFrameworkStores();
    return get(fStore);
  }
  
  // Start initialization
  initializationPromise = (async () => {
    const { frameworksStore: fStore } = createFrameworkStores();
    
    try {
      const frameworkNav = await import('$lib/stores/frameworkNav.js');
      const frameworks = frameworkNav.allFrameworks || [];
      
      fStore.set(frameworks);
      isInitialized = true;
      console.log('Framework database initialized with', frameworks.length, 'frameworks');
      
      return frameworks;
    } catch (error) {
      console.warn('Failed to load frameworkNav:', error);
      fStore.set([]);
      isInitialized = true; // Mark as initialized even on error to prevent retry loops
      return [];
    } finally {
      initializationPromise = null;
    }
  })();
  
  return initializationPromise;
}

// Main export - returns the database synchronously after initialization
export async function getPrecomputedFrameworkDatabase() {
  await initializeFrameworks();
  
  const { databaseStore: dbStore } = createFrameworkStores();
  return get(dbStore);
}

// Optimized lookup with proper caching
const frameworkCache = new Map();

export async function getFrameworkDetails(frameworkId) {
  if (!frameworkId) return null;
  
  // Check cache first
  if (frameworkCache.has(frameworkId)) {
    return frameworkCache.get(frameworkId);
  }
  
  try {
    const database = await getPrecomputedFrameworkDatabase();
    
    // Direct lookup
    let framework = database[frameworkId];
    
    // Try slug conversion if direct lookup fails
    if (!framework) {
      const slug = frameworkId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      framework = database[slug];
    }
    
    // Cache the result (even if null) to prevent repeated lookups
    const result = framework || null;
    frameworkCache.set(frameworkId, result);
    
    return result;
  } catch (error) {
    console.warn('Error getting framework details:', error);
    return null;
  }
}

// Optimized tier filtering
const tierCache = new Map();

export async function getFrameworksByTierOptimized(tier) {
  // Check cache first
  if (tierCache.has(tier)) {
    return tierCache.get(tier);
  }
  
  try {
    await initializeFrameworks();
    
    const { frameworksStore: fStore } = createFrameworkStores();
    const frameworks = get(fStore);
    const filtered = frameworks.filter(f => f.tier === tier);
    
    // Cache the result
    tierCache.set(tier, filtered);
    
    return filtered;
  } catch (error) {
    console.warn('Error getting frameworks by tier:', error);
    return [];
  }
}

// Store-based reactive API for components - FIXED to prevent flickering
export function useFrameworkDatabase() {
  const { frameworksStore, databaseStore } = createFrameworkStores();
  
  // Initialize only once
  if (!isInitialized && !initializationPromise) {
    initializeFrameworks();
  }
  
  return {
    frameworks: { subscribe: frameworksStore.subscribe },
    database: { subscribe: databaseStore.subscribe },
    loading: derived(databaseStore, db => Object.keys(db).length === 0)
  };
}

// Synchronous getter for already-initialized data (prevents subscriptions)
export function getFrameworkDatabaseSync() {
  if (!isInitialized) {
    console.warn('Framework database accessed before initialization');
    return {};
  }
  
  const { databaseStore } = createFrameworkStores();
  return get(databaseStore);
}

export function getFrameworkDetailsSync(frameworkId) {
  if (!frameworkId) return null;
  
  // Check cache first
  if (frameworkCache.has(frameworkId)) {
    return frameworkCache.get(frameworkId);
  }
  
  const database = getFrameworkDatabaseSync();
  
  // Direct lookup
  let framework = database[frameworkId];
  
  // Try slug conversion if direct lookup fails
  if (!framework) {
    const slug = frameworkId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    framework = database[slug];
  }
  
  const result = framework || null;
  frameworkCache.set(frameworkId, result);
  
  return result;
}

// Cleanup function for testing
export function resetFrameworkCache() {
  frameworkCache.clear();
  tierCache.clear();
  lastFrameworks = null;
  lastDatabase = null;
  frameworksStore = null;
  databaseStore = null;
  initializationPromise = null;
  isInitialized = false;
}

// Preload function to call early in app lifecycle
export async function preloadFrameworkDatabase() {
  return initializeFrameworks();
}
