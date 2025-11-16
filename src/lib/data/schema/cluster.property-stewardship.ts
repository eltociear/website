// /src/lib/data/schema/cluster.property-stewardship.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 2: PROPERTY & STEWARDSHIP TRANSITION CLUSTER
 * The Hearthstone Protocol: The bridge from extractive ownership to regenerative stewardship.
 */

export const hearthstoneEntities: GgfEntity[] = [
  // === CORE FRAMEWORK ===
  {
    id: 'framework_hearthstone',
    type: 'Framework',
    name: 'The Hearthstone Protocol: A Framework for Commons & Stewardship',
    shortName: 'Hearthstone Protocol',
    description: 'A voluntary framework providing the legal, ethical, and practical pathways for a just transition from private, extractive ownership to shared, regenerative stewardship.',
    tier: 2,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: [
      'framework_treaty',
      'framework_indigenous',
      'framework_justice',
      'framework_regenerative_enterprise',
      'framework_financial_systems',
      'framework_digital_commons',
      'framework_aurora_accord',
      'framework_technology_governance',
      'framework_education',
      'framework_urban_community',
      'framework_gaian_trade',
      'framework_shield',
      'framework_meta_gov',
      'framework_work_liberation'
    ],
    enables: [
      'institution_baz',
      'framework_aubi',
      'framework_planetary_health',
      'framework_urban_community'
    ],
    ui: {
      path: '/frameworks/hearthstone-protocol', // New path
      titleKey: 'framework.docs.nav.frameworkTitles.hearthstoneProtocol', // New key
      emoji: '🔥', // Stone emoji
      version: '1.5',
      slug: 'hearthstone-protocol' // New slug
    }
  },

  // === INSTITUTIONS ===
  {
    id: 'institution_stewardship_trust',
    type: 'Institution',
    name: 'Stewardship Trust',
    description: 'Internationally recognized legal entity replacing private title, governed for regenerative purposes.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthstone']
  },
  {
    id: 'institution_biocultural_stewardship_trust',
    type: 'Institution',
    name: 'Bio-Cultural Stewardship Trust',
    description: 'A subtype of Stewardship Trust for assets where ecology and culture are inseparable.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['institution_stewardship_trust']
  },
  {
    id: 'institution_commons_transition_office',
    type: 'Institution',
    name: 'Office of Commons Transition',
    description: 'Provides legal, mediation, and technical support for asset transition.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthstone', 'institution_gjo']
  },
  {
    id: 'institution_icc',
    type: 'Institution',
    name: 'International Commons Court',
    description: 'A specialized chamber within the Digital Justice Tribunal for commons disputes.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthstone', 'institution_dj_tribunal']
  },

  // === PLATFORMS, PROCESSES & PROTOCOLS ===
  {
    id: 'platform_commons_registry',
    type: 'Platform',
    name: 'Commons Title Registry',
    description: 'A blockchain-based registry for stewarded assets, integrated with the Love Ledger.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthstone', 'platform_love_ledger']
  },
  {
    id: 'protocol_sacred_trust',
    type: 'LegalProtocol',
    name: 'Sacred Trust Designation Process',
    description: 'Process led by the Earth Council to designate assets as sacred and inalienable.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_hearthstone', 'council_earth']
  },
  {
    id: 'protocol_rematriation_legal',
    type: 'LegalProtocol',
    name: 'Rematriation Legal Protocol',
    description: 'Overseen by the International Commons Court to transfer land to BAZ stewardship.',
    tier: 2,
    status: 'Draft',
    dependencies: ['framework_hearthstone', 'institution_icc']
  },
  {
    id: 'initiative_land_rematriation',
    type: 'Initiative',
    name: 'Land Rematriation Initiative',
    description: 'Funded by the GCF to purchase ecologically/culturally significant land for BAZ stewardship.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_hearthstone', 'mechanism_gcf']
  }
];

export const hearthstoneRelationships: GgfRelationship[] = [
  // Core establishment relationships
  {
    from: 'framework_hearthstone',
    to: 'institution_stewardship_trust',
    type: 'ESTABLISHES',
    description: 'The Hearthstone Protocol establishes the Stewardship Trust as the core legal tool for its implementation.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_hearthstone',
    to: 'institution_commons_transition_office',
    type: 'ESTABLISHES',
    description: 'Establishes the support office to facilitate all transitions.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_hearthstone',
    to: 'platform_commons_registry',
    type: 'ESTABLISHES',
    description: 'Establishes the title registry for tracking all stewarded assets.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_hearthstone',
    to: 'protocol_rematriation_legal',
    type: 'ESTABLISHES',
    description: 'The protocol for Land Back is a core legal process of the framework.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },

  // Internal operational relationships
  {
    from: 'institution_commons_transition_office',
    to: 'initiative_land_rematriation',
    type: 'OVERSEES',
    description: 'The transition office manages the practical implementation of the rematriation initiative.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'platform_commons_registry',
    to: 'institution_stewardship_trust',
    type: 'IMPLEMENTS',
    description: 'The registry is the official record for all assets held in Stewardship Trusts.',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'protocol_rematriation_legal',
    to: 'institution_baz',
    type: 'DELEGATES_TO',
    description: 'The rematriation protocol legally transfers title and stewardship authority to BAZs.',
    strength: 'Strong',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  }
];
