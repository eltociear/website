// /src/lib/data/schema/cluster.infrastructure.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 2: SHARED INFRASTRUCTURE CLUSTER
 * The Conduit Protocol: The circulatory system for a resilient planetary civilization.
 */

export const conduitProtocolEntities: GgfEntity[] = [
  // === CORE FRAMEWORK ===
  {
    id: 'framework_conduit_protocol',
    type: 'Framework',
    name: 'The Conduit Protocol: A Framework for Shared Infrastructure',
    shortName: 'Conduit Protocol',
    description: 'A unified, resilient global commons for clean energy, secure data, and clean water.',
    tier: 2,
    status: 'Ready',
    implementationPriority: 'Critical',
    primaryDomain: 'Governance',
    dependencies: [
      'framework_hearthstone', 'framework_climate_energy', 'framework_mobility_commons',
      'framework_aurora_accord', 'framework_water_sanitation', 'framework_indigenous',
      'framework_treaty', 'institution_quantum_lab', 'protocol_indigenous_ai',
      'framework_synoptic', 'framework_mental_health', 'framework_cultural_heritage',
      'framework_justice', 'framework_phoenix_protocol', 'framework_regenerative_enterprise',
      'institution_commons_transition_office'
    ],
    enables: [
      'framework_aubi', 'framework_regenerative_enterprise', 'framework_drr',
      'framework_urban_community', 'framework_rural_development', 'process_crisis_command'
    ],
    ui: {
      path: '/frameworks/conduit-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.conduitProtocol',
      emoji: '🔌',
      version: '1.0',
      slug: 'conduit-protocol'
      // Decide on a group, e.g., 'planetaryHealthResilience' or 'globalEconomicSystems'
    }
  },

  // === INSTITUTIONS & COUNCILS ESTABLISHED BY THE PROTOCOL ===
  {
    id: 'council_gic',
    type: 'Council',
    name: 'Global Infrastructure Council',
    description: 'A sub-council of the MGCC setting global standards for grid interoperability and resilience.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_conduit_protocol', 'council_mgcc']
  },
  {
    id: 'institution_bga',
    type: 'Institution',
    name: 'Bioregional Grid Authorities',
    description: 'BAZ-level or regional bodies managing local infrastructure, co-governed by communities.',
    tier: 2,
    status: 'Pilot',
    dependencies: ['framework_conduit_protocol', 'institution_baz']
  },
  {
    id: 'institution_decom_trust',
    type: 'Institution',
    name: 'Fossil Fuel Decommissioning Trust',
    description: 'Funded by a Reparations Levy to decommission legacy infrastructure and manage reparations.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_conduit_protocol', 'framework_hearthstone', 'mechanism_gcf']
  },
   {
    id: 'institution_cic',
    type: 'Institution',
    name: 'Crisis Infrastructure Command',
    description: 'Chartered by the GIC and activated by Meta-Governance Crisis Command to manage infrastructure during crises.',
    tier: 2,
    status: 'Proposed',
    dependencies: ['framework_conduit_protocol', 'council_gic', 'process_crisis_command']
  }
];

export const conduitProtocolRelationships: GgfRelationship[] = [
  // Core establishment relationships
  { from: 'framework_conduit_protocol', to: 'council_gic', type: 'ESTABLISHES' },
  { from: 'framework_conduit_protocol', to: 'institution_bga', type: 'ESTABLISHES' },
  { from: 'framework_conduit_protocol', to: 'institution_decom_trust', type: 'ESTABLISHES' },
  { from: 'framework_conduit_protocol', to: 'institution_cic', type: 'ESTABLISHES' },

  // Key operational relationships from the document
  { from: 'council_gic', to: 'council_mgcc', type: 'REPORTS_TO', description: 'GIC is a sub-council of the Meta-Governance Coordination Council.' },
  { from: 'institution_bga', to: 'institution_commons_transition_office', type: 'ESCALATES_TO', description: 'Underperforming BGAs are placed under temporary stewardship by the Office of Commons Transition.' },
  { from: 'institution_decom_trust', to: 'framework_justice', type: 'INTEGRATES_WITH', description: 'Partners with Justice Systems Framework for Intergenerational Repair Programs.' },
  { from: 'institution_cic', to: 'process_crisis_command', type: 'REPORTS_TO', description: 'Activated by and reports to the Meta-Governance Crisis Command.' },

  // Connections to other frameworks
  { from: 'framework_hearthstone', to: 'framework_conduit_protocol', type: 'ENABLES', description: 'Hearthstone provides legal tools (Stewardship Trusts) to transition infrastructure into commons.' },
  { from: 'framework_climate_energy', to: 'framework_conduit_protocol', type: 'GUIDES', description: 'Sets decarbonization targets for the energy grid infrastructure.' },
  { from: 'framework_aurora_accord', to: 'framework_conduit_protocol', type: 'GUIDES', description: 'Provides data governance and cybersecurity standards for all grid infrastructure.' },
  { from: 'framework_indigenous', to: 'framework_conduit_protocol', type: 'GUIDES', description: 'Ensures all infrastructure projects respect Indigenous sovereignty and obtain FPIC 2.0.' },
  { from: 'framework_conduit_protocol', to: 'framework_aubi', type: 'ENABLES', description: 'A resilient grid is necessary for the AUBI system and Love Ledger to function globally.' }
];
