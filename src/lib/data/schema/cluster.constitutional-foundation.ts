// /src/lib/data/schema/cluster.constitutional-foundation.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 0: CONSTITUTIONAL LAYER
 * The Treaty for Our Only Home - the singular constitutional framework that enables all others
 */

export const constitutionalFoundationEntities: GgfEntity[] = [
  // === THE TREATY FOR OUR ONLY HOME (Hardware) ===
  {
    id: 'framework_treaty',
    type: 'Framework',
    name: 'The Treaty for Our Only Home',
    shortName: 'The Treaty',
    description: 'Core legal framework providing enforcement mechanisms and institutional reforms for global governance',
    tier: 0,
    status: 'Ready',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    enables: ['framework_meta_gov', 'framework_justice', 'framework_shield', 'mechanism_gcf', 'framework_hearthstone'],
    ui: {
      path: '/frameworks/treaty-for-our-only-home',
      titleKey: 'framework.docs.nav.frameworkTitles.treatyForOurOnlyHome',
      emoji: '🌐',
      version: '1.1',
      slug: 'treaty-for-our-only-home'
    }
  },
  {
    id: 'institution_unsc_reformed',
    type: 'Institution',
    name: 'Reformed UN Security Council',
    shortName: 'Reformed UNSC',
    description: 'UNSC with tiered veto override and expanded membership',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty']
  },
  {
    id: 'institution_unga_reformed',
    type: 'Institution',
    name: 'Reformed UN General Assembly',
    shortName: 'Reformed UNGA',
    description: 'UNGA with binding resolution powers on crises',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty']
  },
  {
    id: 'institution_dj_tribunal',
    type: 'Institution',
    name: 'Digital Justice Tribunal',
    shortName: 'Digital Justice Tribunal',
    description: 'Adjudicates major global harms, including Ecocide and digital rights violations',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty'],
    enables: ['framework_justice', 'institution_cjet']
  },
  {
    id: 'institution_gem',
    type: 'Institution',
    name: 'Global Enforcement Mechanism',
    shortName: 'GEM',
    description: 'The Treaty\'s enforcement arm with specialized corps',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty'],
    enables: ['institution_getf']
  },
  {
    id: 'mechanism_gcf',
    type: 'EconomicMechanism',
    name: 'Global Commons Fund',
    shortName: 'Global Commons Fund',
    description: 'Fund for planetary public goods, financed by global taxes',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty'],
    enables: ['framework_aubi', 'framework_food', 'framework_drr']
  },

  // === GENESIS PROTOCOL ENTITIES (v0.3) ===
  {
    id: 'protocol_genesis',
    type: 'LegalProtocol',
    name: 'Genesis Protocol: Constitutional Convening Process',
    shortName: 'Genesis Protocol',
    description: 'The Tier 0 installation script for the Treaty, defining the pluriversal convening process for all foundational institutions.',
    tier: 0,
    status: 'Draft',
    primaryDomain: 'Governance',
    implementationPriority: 'Critical',
    dependencies: ['framework_treaty'],
    enables: [
      'institution_interim_secretariat',
      'mechanism_genesis_fund',
      'institution_gci', // Global Citizens' Assembly
      'institution_ysc', // Youth Stewardship Council
      'institution_cg',  // Council of Guardians
      'institution_dj_tribunal'
    ]
    // No UI block, as it lives on the Treaty page
  },
  {
    id: 'institution_interim_secretariat',
    type: 'Institution',
    name: 'Interim Secretariat (Genesis)',
    shortName: 'Interim Secretariat',
    description: 'The temporary (18-month) neutral body responsible for executing the Genesis Protocol\'s convening processes.',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Governance',
    implementationPriority: 'Critical',
    dependencies: ['protocol_genesis']
  },
  {
    id: 'mechanism_genesis_fund',
    type: 'EconomicMechanism',
    name: 'Genesis Fund',
    shortName: 'Genesis Fund',
    description: 'The temporary (Tier 0) financing mechanism to fund the convening processes, capitalized by the "Founding Peace Tithe" (0.1% of military budgets).',
    tier: 0,
    status: 'Proposed',
    primaryDomain: 'Economic',
    implementationPriority: 'Critical',
    dependencies: ['protocol_genesis']
  },
  {
    id: 'institution_gci',
    type: 'Institution',
    name: 'Global Citizens\' Assembly',
    shortName: 'GCA',
    description: 'The foundational pillar of democratic legitimacy, convened by sortition (democratic lottery) under the Genesis Protocol.',
    tier: 1, // It's a foundational body, so Tier 1
    status: 'Proposed',
    primaryDomain: 'Governance',
    implementationPriority: 'Critical',
    dependencies: ['protocol_genesis']
  },
  {
    id: 'institution_ysc',
    type: 'Institution',
    name: 'Youth Stewardship Council',
    shortName: 'YSC',
    description: 'The foundational pillar of intergenerational legitimacy, convened by nomination and lottery, holding veto power over long-term decisions.',
    tier: 1, // It's a foundational body, so Tier 1
    status: 'Proposed',
    primaryDomain: 'Governance',
    implementationPriority: 'Critical',
    dependencies: ['protocol_genesis']
  },
  {
    id: 'institution_cg',
    type: 'Institution',
    name: 'Council of Guardians',
    shortName: 'Guardians',
    description: 'The wisdom and oversight body (Tier 2) convened by multi-source nomination from the foundational Tier 1 bodies.',
    tier: 2, // It's convened by Tier 1, so it's Tier 2
    status: 'Proposed',
    primaryDomain: 'Governance',
    implementationPriority: 'Critical',
    dependencies: ['protocol_genesis', 'council_earth', 'institution_gci', 'institution_ysc']
  }
];

export const constitutionalFoundationRelationships: GgfRelationship[] = [
  // === HOW THE TREATY (Hardware) PROVIDES STRUCTURE ===
  {
    from: 'framework_treaty',
    to: 'institution_dj_tribunal',
    type: 'ESTABLISHES',
    description: 'The Treaty establishes the Digital Justice Tribunal as its primary judicial body',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_treaty',
    to: 'institution_gem',
    type: 'ESTABLISHES',
    description: 'The Treaty establishes the Global Enforcement Mechanism as its enforcement arm',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_treaty',
    to: 'mechanism_gcf',
    type: 'ESTABLISHES',
    description: 'The Treaty creates the Global Commons Fund through Pillar 4 financing mechanisms',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_treaty',
    to: 'institution_unsc_reformed',
    type: 'ESTABLISHES',
    description: 'The Treaty reforms the UNSC with tiered veto override mechanisms',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_treaty',
    to: 'institution_unga_reformed',
    type: 'ESTABLISHES',
    description: 'The Treaty grants UNGA binding resolution powers for global crises',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'institution_dj_tribunal',
    to: 'framework_treaty',
    type: 'ENFORCES',
    description: 'The Tribunal enforces the laws and principles set out in the Treaty',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_gem',
    to: 'institution_dj_tribunal',
    type: 'REPORTS_TO',
    description: 'The enforcement arm acts on the rulings of the judicial arm',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  
  // === COMMONS RELATIONSHIP ===
  {
    from: 'framework_treaty',
    to: 'framework_hearthstone',
    type: 'ENABLES',
    description: 'The Treaty provides the constitutional authority and enforcement mechanisms for the Hearthstone Protocol\'s legal tools, like Stewardship Trusts.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },

  // === GENESIS PROTOCOL ACTIVATION ===
  {
    from: 'framework_treaty',
    to: 'protocol_genesis',
    type: 'IMPLEMENTS',
    description: 'The Genesis Protocol is the constitutional convening process that activates the Treaty.'
  },
  {
    from: 'protocol_genesis',
    to: 'institution_interim_secretariat',
    type: 'ESTABLISHES',
    description: 'Establishes the temporary neutral body to run the convening.'
  },
  {
    from: 'protocol_genesis',
    to: 'mechanism_genesis_fund',
    type: 'ESTABLISHES',
    description: 'Establishes the Tier 0 fund to pay for the convening process.'
  },
  {
    from: 'protocol_genesis',
    to: 'institution_gci',
    type: 'ESTABLISHES',
    description: 'Establishes the Global Citizens\' Assembly via democratic lottery.'
  },
  {
    from: 'protocol_genesis',
    to: 'institution_ysc',
    type: 'ESTABLISHES',
    description: 'Establishes the Youth Stewardship Council as a pillar of legitimacy.'
  },
  {
    from: 'protocol_genesis',
    to: 'institution_cg',
    type: 'ESTABLISHES',
    description: 'Defines the multi-source nomination process for the Council of Guardians.'
  },
  {
    from: 'institution_cg',
    to: 'institution_dj_tribunal',
    type: 'OVERSEES',
    description: 'The Guardians (convened by Genesis) nominate and confirm the first judges of the Digital Justice Tribunal.'
  },
  {
    from: 'council_earth', // From ethical-os
    to: 'protocol_genesis',
    type: 'VALIDATES',
    description: 'The Genesis Protocol requires "Letters of Intent to Engage" from Indigenous Nations as a core part of its "Pluriversal Sovereign" activation trigger.'
  }
];
