// /src/lib/data/schema/cluster.pathfinder-protocol.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 1: PATHFINDER PROTOCOL CLUSTER
 * Voluntary framework for transforming corporate purpose to align with planetary well-being
 * Bridges corporate transformation with GGF ecosystem integration
 */

export const pathfinderProtocolEntities: GgfEntity[] = [
  // === CORE FRAMEWORK ===
  {
    id: 'framework_pathfinder_protocol',
    type: 'Framework',
    name: 'Pathfinder Protocol',
    shortName: 'Pathfinder Protocol',
    description: 'Voluntary framework for aligning corporate purpose with planetary well-being through six-module transformation system',
    tier: 2,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi', 'framework_gaian_trade', 'framework_aurora_accord', 'framework_work_liberation'],
    enables: ['process_pathfinder_program', 'institution_regeneration_audit_council', 'mechanism_pathfinder_certification'],
    ui: {
      path: '/frameworks/pathfinder-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.pathfinderProtocol',
      emoji: '🧭',
      version: '1.0',
      slug: 'pathfinder-protocol',
      group: 'globalEconomicSystems'
    }
  },

  // === GOVERNANCE COUNCILS ===
  {
    id: 'council_stakeholder',
    type: 'Council',
    name: 'Stakeholder Council',
    shortName: 'Stakeholder Council',
    description: 'Multi-stakeholder governance body within pathfinder enterprises including employees, communities, and ecological representatives',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Institutional',
    implementationPriority: 'Critical',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'council_turing',
    type: 'Council',
    name: 'Turing Council',
    shortName: 'Turing Council',
    description: 'Enterprise-level ethical AI governance body ensuring human-AI symbiosis and algorithmic accountability',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Technology',
    geographicScope: 'Institutional',
    implementationPriority: 'High',
    dependencies: ['framework_pathfinder_protocol', 'framework_aurora_accord']
  },

  // === SPECIALIZED INSTITUTIONS ===
  {
    id: 'institution_regeneration_audit_council',
    type: 'Institution',
    name: 'Regeneration Audit Council',
    shortName: 'Regeneration Audit Council',
    description: 'GGF body overseeing Pathfinder Protocol certification and maturity model validation with equitable stakeholder representation',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'institution_community_ecology_panel',
    type: 'Institution',
    name: 'Community & Ecology Review Panel',
    shortName: 'Community Review Panel',
    description: 'Local stakeholder body reviewing corporate impact, evolving into Joint BAZ-Corporate Review Board',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Governance',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_pathfinder_protocol']
  },

  // === PROCESSES & PROTOCOLS ===
  {
    id: 'process_pathfinder_program',
    type: 'Process',
    name: 'Pathfinder Program',
    shortName: 'Pathfinder Program',
    description: 'Five-phase implementation pathway for enterprise transformation from exploration to systemic leadership',
    tier: 1,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Institutional',
    implementationPriority: 'Critical',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'protocol_human_ai_conflict',
    type: 'LegalProtocol',
    name: 'Human-AI Conflict Resolution Protocol',
    shortName: 'AI Conflict Resolution',
    description: 'Procedural mechanism for addressing AI-related harms with escalation to GGF justice systems',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Technology',
    geographicScope: 'Institutional',
    implementationPriority: 'High',
    dependencies: ['framework_pathfinder_protocol', 'framework_aurora_accord']
  },

  {
    id: 'protocol_annual_review_adaptation',
    type: 'Process',
    name: 'Annual Review & Adaptation Protocol',
    shortName: 'Annual Review Protocol',
    description: 'Living document evolution process with equitable stakeholder representation and feedback integration',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_pathfinder_protocol']
  },

  // === TOOLS & MECHANISMS ===
  {
    id: 'mechanism_pathfinder_certification',
    type: 'DataMetric',
    name: 'Pathfinder Certification System',
    shortName: 'Pathfinder Certification',
    description: 'Three-tier maturity model: Exploring, Integrating, Leading with comprehensive impact metrics',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'tool_regenerative_investment_thesis',
    type: 'Tool',
    name: 'Regenerative Investment Thesis Template',
    shortName: 'Investment Thesis Template',
    description: 'Standardized template for pitching Return on Regeneration to impact investors',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Institutional',
    implementationPriority: 'High',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'tool_digital_product_passport',
    type: 'Tool',
    name: 'Digital Product Passport',
    shortName: 'Digital Product Passport',
    description: 'Blockchain-based tracking system for product lifecycle, ecological impact, and labor conditions',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_pathfinder_protocol', 'framework_gaian_trade']
  },

  // === DATA METRICS ===
  {
    id: 'metric_reparations_index',
    type: 'DataMetric',
    name: 'Reparations Index',
    shortName: 'Reparations Index',
    description: 'Percentage of profits allocated to impacted communities, weighted higher for extractive industries',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Institutional',
    implementationPriority: 'High',
    dependencies: ['framework_pathfinder_protocol']
  },

  {
    id: 'metric_intergenerational_equity',
    type: 'DataMetric',
    name: 'Intergenerational Equity Score',
    shortName: 'Intergenerational Equity Score',
    description: 'Long-term impact assessment audited by Guardians of the Future',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Institutional',
    implementationPriority: 'Medium',
    dependencies: ['framework_pathfinder_protocol', 'framework_youth']
  }
];

export const pathfinderProtocolRelationships: GgfRelationship[] = [
  // === DEPENDENCIES ON OTHER FRAMEWORKS ===
  {
    from: 'framework_aubi',
    to: 'framework_pathfinder_protocol',
    type: 'ENABLES',
    description: 'AUBI provides Hearts/Leaves currency system that Pathfinder enterprises use for equitable value distribution',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  
  {
    from: 'framework_gaian_trade',
    to: 'framework_pathfinder_protocol',
    type: 'ENABLES',
    description: 'Gaian Trade provides Digital Product Passports and regenerative trade zone frameworks for Pathfinder operations',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  {
    from: 'framework_aurora_accord',
    to: 'framework_pathfinder_protocol',
    type: 'GUIDES',
    description: 'Aurora Accord provides data governance standards for Pathfinder digital infrastructure and AI ethics',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  {
    from: 'framework_work_liberation',
    to: 'framework_pathfinder_protocol',
    type: 'CERTIFIES',
    description: 'Work in Liberation provides human flourishing certification and Green Job Score metrics for Pathfinder enterprises',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === INTERNAL PATHFINDER RELATIONSHIPS ===
  {
    from: 'framework_pathfinder_protocol',
    to: 'process_pathfinder_program',
    type: 'ESTABLISHES',
    description: 'Pathfinder Protocol establishes Pathfinder Program as primary implementation pathway',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  {
    from: 'framework_pathfinder_protocol',
    to: 'institution_regeneration_audit_council',
    type: 'ESTABLISHES',
    description: 'Pathfinder Protocol establishes Regeneration Audit Council for certification oversight',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  {
    from: 'framework_pathfinder_protocol',
    to: 'council_stakeholder',
    type: 'ESTABLISHES',
    description: 'Pathfinder Protocol establishes Stakeholder Councils as core governance mechanism in enterprises',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  {
    from: 'framework_pathfinder_protocol',
    to: 'council_turing',
    type: 'ESTABLISHES',
    description: 'Pathfinder Protocol establishes Turing Councils for ethical AI governance within enterprises',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  // === CERTIFICATION AND OVERSIGHT ===
  {
    from: 'institution_regeneration_audit_council',
    to: 'mechanism_pathfinder_certification',
    type: 'OVERSEES',
    description: 'Regeneration Audit Council manages Pathfinder certification system and maturity model validation',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  {
    from: 'protocol_annual_review_adaptation',
    to: 'institution_regeneration_audit_council',
    type: 'IMPLEMENTS',
    description: 'Annual Review Protocol is managed by Regeneration Audit Council for framework evolution',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === TECHNOLOGY INTEGRATION ===
  {
    from: 'council_turing',
    to: 'protocol_human_ai_conflict',
    type: 'IMPLEMENTS',
    description: 'Turing Councils implement Human-AI Conflict Resolution Protocol within enterprises',
    strength: 'Strong',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },

  {
    from: 'tool_digital_product_passport',
    to: 'framework_gaian_trade',
    type: 'IMPLEMENTS',
    description: 'Digital Product Passports implement Gaian Trade standards for supply chain transparency',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO GGF JUSTICE SYSTEMS ===
  {
    from: 'protocol_human_ai_conflict',
    to: 'institution_dj_tribunal',
    type: 'ESCALATES_TO',
    description: 'AI conflict resolution escalates to Digital Justice Tribunal for complex adjudication',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Conditional'
  },

  // === BIOREGIONAL INTEGRATION ===
  {
    from: 'institution_community_ecology_panel',
    to: 'institution_baz',
    type: 'EVOLVES_INTO',
    description: 'Community Review Panels evolve into Joint BAZ-Corporate Review Boards when BAZs become operational',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Sequential'
  },

  // === ECONOMIC SYSTEM INTEGRATION ===
  {
    from: 'mechanism_hearts',
    to: 'framework_pathfinder_protocol',
    type: 'REWARDS',
    description: 'Pathfinder enterprises create conditions for employees and communities to earn Hearts currency through care work',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  {
    from: 'mechanism_leaves',
    to: 'framework_pathfinder_protocol',
    type: 'REWARDS',
    description: 'Pathfinder enterprises generate Leaves currency through ecological restoration and stewardship activities',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === METRICS AND MEASUREMENT ===
  {
    from: 'metric_lmci',
    to: 'framework_pathfinder_protocol',
    type: 'MEASURES',
    description: 'LMCI provides primary well-being metric for Pathfinder enterprise transformation tracking',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  {
    from: 'metric_reparations_index',
    to: 'framework_indigenous',
    type: 'IMPLEMENTS',
    description: 'Reparations Index implements Indigenous framework principles for community benefit distribution',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === RELATIONSHIP FOR HEARTHSTONE PROTOCOL ===
  {
    from: 'framework_pathfinder_protocol',
    to: 'framework_hearthstone',
    type: 'COLLABORATES_WITH',
    description: 'The Pathfinder Protocol provides the "Corporate Co-op Conversion Process" that allows certified enterprises to voluntarily transition their assets into Stewardship Trusts under the Hearthstone Protocol.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  }
];
