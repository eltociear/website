// /src/lib/data/schema/cluster.data-os.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 1: DATA OPERATING SYSTEM
 * Aurora Accord: Digital-first world data governance rules
 */

export const dataOSEntities: GgfEntity[] = [
  {
    id: 'framework_aurora_accord',
    type: 'Framework',
    name: 'Aurora Accord - Global Data Governance',
    shortName: 'Aurora Accord',
    description: 'Digital-first world data governance rules, including enhanced, quantum-resistant cybersecurity protocols to protect sensitive data, especially Traditional Ecological Knowledge held within the Digital Commons.',
    tier: 1,
    status: 'Review',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    enables: ['framework_digital_commons'],
    ui: {
      path: '/frameworks/aurora-accord',
      titleKey: 'framework.docs.nav.frameworkTitles.auroraAccord',
      emoji: '📜',
      slug: 'aurora-accord',
      group: 'globalEconomicSystems'
    }
  }
];

export const dataOSRelationships: GgfRelationship[] = [
  // === ENABLES HIGHER TIER FRAMEWORKS ===
  {
    from: 'framework_aurora_accord',
    to: 'framework_digital_commons',
    type: 'ENABLES',
    description: 'Data governance enables digital commons framework',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  
  // === COORDINATION WITH OTHER OS ===
  {
    from: 'framework_aurora_accord',
    to: 'platform_love_ledger',
    type: 'GUIDES',
    description: 'Data governance guides Love Ledger privacy and sovereignty protocols',
    strength: 'Medium',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
 
  // CONNECTION TO HEARTHSTONE FRAMEWORK
  {
    from: 'framework_aurora_accord',
    to: 'framework_hearthstone',
    type: 'GUIDES',
    description: 'The Aurora Accord provides the essential data sovereignty, privacy, and cybersecurity rules for all digital platforms within the Hearthstone Protocol, especially the Commons Title Registry.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  }
];
