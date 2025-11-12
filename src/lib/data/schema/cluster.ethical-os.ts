// /src/lib/data/schema/cluster.ethical-os.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 1: ETHICAL OPERATING SYSTEM
 * Indigenous Framework: The heart providing ethical compass and philosophical foundation
 * Moral Operating System (MOS): The advisory ethical logic and rights framework for the ecosystem
 */

export const ethicalOSEntities: GgfEntity[] = [
  // === INDIGENOUS FRAMEWORK ===
  {
    id: 'framework_indigenous',
    type: 'Framework',
    name: 'An Invitational Framework for Indigenous Sovereignty and Planetary Healing ',
    shortName: 'Indigenous Sovereignty Pathways',
    description: 'A pathways framework for Indigenous-led governance and planetary stewardship',
    tier: 1,
    status: 'Review',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    enables: ['council_earth', 'institution_baz', 'protocol_fpic2'],
    ui: {
      path: '/frameworks/indigenous-sovereignty-pathways',
      titleKey: 'framework.docs.nav.frameworkTitles.indigenousSovereigntyPathways',
      emoji: '🪶',
      version: '0.9',
      slug: 'indigenous-sovereignty-pathways',
      group: 'socialFabricJustice'
    }
  },
  {
    id: 'council_earth',
    type: 'Council',
    name: 'Earth Council (Kawsay Pacha)',
    shortName: 'Earth Council',
    description: 'Provides moral authority and planetary coordination based on TEK',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_indigenous']
  },
  {
    id: 'institution_baz',
    type: 'Institution',
    name: 'Bioregional Autonomous Zones',
    shortName: 'BAZs',
    description: 'Indigenous-led governance systems based on ecosystem boundaries',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Governance',
    geographicScope: 'Regional',
    implementationPriority: 'Critical',
    dependencies: ['framework_indigenous']
  },
  {
    id: 'protocol_fpic2',
    type: 'LegalProtocol',
    name: 'Free, Prior, and Informed Consent 2.0',
    shortName: 'FPIC 2.0',
    description: 'Enhanced consent protocol with veto power for Indigenous communities',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Regional',
    implementationPriority: 'Critical',
    dependencies: ['framework_indigenous']
  },

  // === MORAL OPERATING SYSTEM ===
  {
    id: 'framework_mos',
    type: 'Framework',
    name: 'Moral Operating System',
    shortName: 'MOS',
    description: 'Advisory ethical logic for the GGF, suggesting approaches to rights for humans, non-humans, ecosystems, and technology via the Dynamic Rights Spectrum. Operates under the Genesis Protocol\'s Conscience & Sovereignty Clause.',
    tier: 1,
    status: 'Review',
    primaryDomain: 'Ethics',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: [
      'framework_treaty',
      'framework_indigenous',
      'framework_meta_gov',
      'framework_genesis'
    ],
    enables: [
      'protocol_dynamic_rights_spectrum',
      'platform_rights_status_dashboard',
      'platform_citizen_reporting_portal',
      'tool_spiral_aware_microlearning',
      'campaign_rights_for_all_beings',
      'tool_sacred_seed_kit',
      'protocol_moon_wish_test',
      'tool_contemplative_assessment_tools',
      'metric_consciousness_alignment_index',
      'process_speculative_paradigm_pilot'
    ],
    ui: {
      path: '/frameworks/moral-operating-system',
      titleKey: 'framework.docs.nav.frameworkTitles.moralOperatingSystem',
      emoji: '🦋',
      slug: 'moral-operating-system'
    }
  },

  // ===  MOS CHILD ENTITIES ===
  {
    id: 'protocol_dynamic_rights_spectrum',
    type: 'LegalProtocol',
    name: 'Dynamic Rights Spectrum',
    shortName: 'Dynamic Rights Spectrum',
    description: 'The core MOS protocol suggesting rights and protections for beings based on sentience, ecological role, and capacity for suffering (Humans, Animals, Ecosystems, AI, Emergent).',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Ethics',
    dependencies: ['framework_mos']
  },
  {
    id: 'platform_rights_status_dashboard',
    type: 'Platform',
    name: 'Rights Status Dashboard',
    shortName: 'Rights Dashboard',
    description: 'A real-time dashboard tracking rights violations and ecosystem personhood status, linked to the Citizen Reporting Portal and IUCN Red List.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Technology',
    dependencies: ['framework_mos', 'institution_dj_tribunal']
  },
  {
    id: 'platform_citizen_reporting_portal',
    type: 'Platform',
    name: 'Citizen Reporting Portal',
    shortName: 'Citizen Reporting Portal',
    description: 'A mobile-first, multi-language, anonymous portal for reporting rights violations, feeding into the Rights Status Dashboard.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Technology',
    dependencies: ['framework_mos', 'platform_rights_status_dashboard']
  },
  {
    id: 'tool_spiral_aware_microlearning',
    type: 'Tool',
    name: 'Spiral-Aware Microlearning Module',
    shortName: 'Spiral Microlearning',
    description: 'Interactive, gamified lessons for schools and public education, teaching the Spiral-Aware Rights Culture. Integrates with Educational Systems Framework.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Governance',
    dependencies: ['framework_mos', 'framework_education']
  },
  {
    id: 'campaign_rights_for_all_beings',
    type: 'Initiative',
    name: '#RightsForAllBeings Campaign',
    shortName: '#RightsForAllBeings',
    description: 'A public engagement campaign on social media to build awareness and dialogue around the MOS principles.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Governance',
    dependencies: ['framework_mos']
  },
  {
    id: 'tool_sacred_seed_kit',
    type: 'Tool',
    name: 'Sacred Seed Kit',
    shortName: 'Sacred Seed Kit',
    description: 'A toolkit for BAZs and local communities to initiate dialogues about MOS principles.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Governance',
    dependencies: ['framework_mos', 'institution_baz']
  },
  {
    id: 'protocol_moon_wish_test',
    type: 'Protocol',
    name: 'Moon Wish Test',
    shortName: 'Moon Wish Test',
    description: 'A contemplative protocol for assessing the long-term ethical implications of space governance and planetary-scale interventions.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Ethics',
    dependencies: ['framework_mos', 'council_earth', 'framework_space_governance']
  },
  {
    id: 'tool_contemplative_assessment_tools',
    type: 'Tool',
    name: 'Contemplative Assessment Tools',
    shortName: 'Contemplative Tools',
    description: 'A suite of methodologies for evaluating systems based on wisdom and consciousness, including the Consciousness Alignment Index (CAI).',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Ethics',
    dependencies: ['framework_mos']
  },
  {
    id: 'metric_consciousness_alignment_index',
    type: 'DataMetric',
    name: 'Consciousness Alignment Index (CAI)',
    shortName: 'CAI',
    description: 'A metric that measures systems for qualities like presence, clarity, compassion, integrity, and creativity.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Ethics',
    dependencies: ['tool_contemplative_assessment_tools']
  },
  {
    id: 'process_speculative_paradigm_pilot',
    type: 'Process',
    name: 'Speculative Paradigm Pilot',
    shortName: 'Speculative Pilot',
    description: 'A process to test the ethical implications of emerging technologies like neural interfaces, mycelial networks, and DAOs by 2026.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Technology',
    dependencies: ['framework_mos', 'framework_technology_governance']
  }
];

export const ethicalOSRelationships: GgfRelationship[] = [
  // === ETHICAL GUIDANCE TO OTHER CORE SYSTEMS (UNCHANGED) ===
  {
    from: 'framework_indigenous',
    to: 'framework_treaty',
    type: 'INFORMS',
    description: 'Indigenous principles of Rights of Nature and sovereignty foundational to Treaty legal reforms',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_indigenous',
    to: 'framework_meta_gov',
    type: 'GUIDES',
    description: 'Meta-Governance coordination must respect Indigenous protocols and sovereignty',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  
  // === INTERNAL INDIGENOUS FRAMEWORK RELATIONSHIPS (UNCHANGED) ===
  {
    from: 'framework_indigenous',
    to: 'council_earth',
    type: 'ESTABLISHES',
    description: 'Indigenous Framework establishes Earth Council as moral authority',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_indigenous',
    to: 'institution_baz',
    type: 'ESTABLISHES',
    description: 'Indigenous Framework establishes BAZs as primary governance institution',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_indigenous',
    to: 'protocol_fpic2',
    type: 'ESTABLISHES',
    description: 'Indigenous Framework establishes enhanced FPIC protocols',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  
  // === EARTH COUNCIL OVERSIGHT (UNCHANGED) ===
  {
    from: 'council_earth',
    to: 'council_mgcc',
    type: 'OVERSEES',
    description: 'Earth Council holds moral and ethical oversight over MGCC coordination',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_earth',
    to: 'institution_baz',
    type: 'OVERSEES',
    description: 'Earth Council provides guidance and oversight to BAZ governance',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  
  // === BAZ IMPLEMENTATION (UNCHANGED) ===
  {
    from: 'protocol_fpic2',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'BAZs are the primary institution for implementing FPIC 2.0',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_mgcc',
    to: 'institution_baz',
    type: 'DELEGATES_TO',
    description: 'Following subsidiarity, MGCC delegates local governance to BAZs',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === COMMONS RELATIONSHIP (UNCHANGED) ===
  {
    from: 'framework_indigenous',
    to: 'framework_hearthstone',
    type: 'GUIDES',
    description: 'The Indigenous Framework provides the core principles of Rematriation, Rightful Relationship, and stewardship that are foundational to the Hearthstone Protocol.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },

  // === NEW: MOS ESTABLISHMENT & INTEGRATION RELATIONSHIPS ===
  
  // MOS Dependency on Genesis Protocol
  {
    from: 'framework_genesis', // Assumed ID for Genesis Protocol
    to: 'framework_mos',
    type: 'GUIDES',
    description: 'The Genesis Protocol\'s "Conscience & Sovereignty Clause" provides the foundational operating constraints for the MOS.'
  },

  // MOS Establishes its Tools
  { from: 'framework_mos', to: 'protocol_dynamic_rights_spectrum', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'platform_rights_status_dashboard', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'platform_citizen_reporting_portal', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'tool_spiral_aware_microlearning', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'campaign_rights_for_all_beings', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'tool_sacred_seed_kit', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'protocol_moon_wish_test', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'tool_contemplative_assessment_tools', type: 'ESTABLISHES' },
  { from: 'tool_contemplative_assessment_tools', to: 'metric_consciousness_alignment_index', type: 'ESTABLISHES' },
  { from: 'framework_mos', to: 'process_speculative_paradigm_pilot', type: 'ESTABLISHES' },

  // MOS Advisory Integrations (from doc)
  {
    from: 'framework_mos',
    to: 'framework_treaty',
    type: 'INFORMS',
    description: 'Offers advisory translation of the Dynamic Rights Spectrum into Ecocide law for the Digital Justice Tribunal.'
  },
  {
    from: 'framework_mos',
    to: 'framework_aubi',
    type: 'INFORMS',
    description: 'Provides ethical guidance on suggesting rewards for stewardship (Tiers 2-3) via Hearts/Leaves.'
  },
  {
    from: 'framework_mos',
    to: 'framework_work_liberation',
    type: 'INFORMS',
    description: 'Offers ethical grounding for organizing Community Work Teams like River Guardians to uphold rights.'
  },
  {
    from: 'framework_mos',
    to: 'framework_education',
    type: 'INTEGRATES_WITH',
    description: 'Provides the Spiral-Aware Microlearning Module for embedding a Spiral-Aware Rights Culture in curricula.'
  },
  {
    from: 'framework_mos',
    to: 'framework_technology_governance',
    type: 'INFORMS',
    description: 'Provides ethical guidance for the AI Consciousness Assessment Framework.'
  },
  {
    from: 'framework_mos',
    to: 'council_earth',
    type: 'INFORMS',
    description: 'Offers guidance to the Earth Council for consideration, while respecting its sovereign precedence.'
  },
  {
    from: 'framework_mos',
    to: 'council_phc', // Planetary Health Council
    type: 'INFORMS',
    description: 'Provides ethical guidance to the Planetary Health Council for applying the Dynamic Rights Spectrum.'
  }
];
