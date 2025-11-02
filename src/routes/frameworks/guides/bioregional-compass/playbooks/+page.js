// src/routes/frameworks/guides/bioregional-compass/playbooks/+page.js
import { locale, loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export const csr = true;

const DEBUG_FRAMEWORK_LOADING = false; // Set to true only when debugging

export async function load({ depends, url, params }) {
  // Declare dependency on locale
  depends('app:locale');
  
  const currentLocale = get(locale);
  
  if (DEBUG_FRAMEWORK_LOADING) console.log('=== Bioregional Compass Playbooks +page.js load function ===');
  if (DEBUG_FRAMEWORK_LOADING) console.log('URL pathname:', url.pathname);
  if (DEBUG_FRAMEWORK_LOADING) console.log('Current locale:', currentLocale);
  
  // Load translations for playbooks page
  try {
    await loadTranslations(currentLocale, '/frameworks/guides/bioregional-compass/playbooks');
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
  
  // Define the playbooks in logical order within categories
  const playbooks = [
    // Legal & Regulatory Challenges
    {
      id: 'legal-strategy-and-resilience-playbook',
      category: 'legal',
      priority: 1,
      difficulty: 'advanced',
      estimatedTime: '2-3 weeks study',
      challenges: ['Legal compliance', 'Regulatory navigation', 'Risk management']
    },
    {
      id: 'legal-challenge-scenarios-and-mitigations',
      category: 'legal', 
      priority: 2,
      difficulty: 'advanced',
      estimatedTime: '1-2 weeks study',
      challenges: ['Emergency response', 'Compliance issues', 'Legal disputes']
    },
    
    // Governance & Leadership
    {
      id: 'governance-resilience-and-evolution-playbook',
      category: 'governance',
      priority: 3,
      difficulty: 'advanced', 
      estimatedTime: '3-4 weeks study',
      challenges: ['Governance crises', 'Power dynamics', 'System evolution']
    },
    {
      id: 'scale-specific-governance-pathways',
      category: 'governance',
      priority: 4,
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks study', 
      challenges: ['Scale transitions', 'Governance adaptation', 'System design']
    },
    
    // External Relations & Communication
    {
      id: 'external-relationship-management',
      category: 'relationships',
      priority: 5,
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks study',
      challenges: ['Stakeholder relations', 'Partnership building', 'Boundary management']
    },
    {
      id: 'diplomatic-playbook',
      category: 'relationships',
      priority: 6,
      difficulty: 'advanced',
      estimatedTime: '3-4 weeks study',
      challenges: ['Government relations', 'Hostile environments', 'Political navigation']
    },
    {
      id: 'culture-war-mitigation-and-external-communication',
      category: 'relationships', 
      priority: 7,
      difficulty: 'advanced',
      estimatedTime: '2-3 weeks study',
      challenges: ['Public perception', 'Media relations', 'Narrative management']
    },
    {
      id: 'crisis-and-conflict-management',
      category: 'relationships',
      priority: 8,
      difficulty: 'advanced',
      estimatedTime: '3-4 weeks study', 
      challenges: ['Crisis response', 'Conflict resolution', 'Emergency management']
    },
    
    // Innovation & Adaptation
    {
      id: 'balancing-innovation-and-tradition',
      category: 'adaptation',
      priority: 9,
      difficulty: 'intermediate',
      estimatedTime: '2-3 weeks study',
      challenges: ['Cultural integration', 'Innovation adoption', 'Wisdom preservation']
    },
    {
      id: 'technology-integration-and-resilience',
      category: 'adaptation',
      priority: 10,
      difficulty: 'advanced',
      estimatedTime: '3-4 weeks study',
      challenges: ['Technology selection', 'Digital sovereignty', 'System resilience']
    }
  ];
  
  // Categories for organization
  const categories = {
    legal: {
      title: 'Legal & Regulatory Challenges',
      description: 'Strategic approaches to legal compliance, regulatory navigation, and institutional resilience',
      icon: '⚖️'
    },
    governance: {
      title: 'Governance & Leadership',
      description: 'Advanced governance strategies, leadership development, and organizational resilience',
      icon: '🏛️'
    },
    relationships: {
      title: 'External Relations & Communication',
      description: 'Managing stakeholder relationships, communications strategy, and conflict resolution',
      icon: '🤝'
    },
    adaptation: {
      title: 'Innovation & Adaptation',
      description: 'Balancing tradition with innovation, technology integration, and cultural evolution',
      icon: '🔄'
    }
  };
  
  // Calculate total strategies across all playbooks
  const totalStrategies = playbooks.reduce((sum, playbook) => {
    return sum + (playbook.challenges ? playbook.challenges.length : 3); // Estimate 3 if no challenges defined
  }, 0);
  
  return {
    playbooks,
    categories,
    
    // Metadata
    totalPlaybooks: playbooks.length,
    totalStrategies,
    
    // Debug info
    debug: {
      currentLocale,
      pathHandling: {
        originalPath: url.pathname,
        cleanedPath: '/frameworks/guides/bioregional-compass/playbooks'
      },
      searchParams: browser ? (url.search || 'none') : 'prerendering'
    }
  };
}
