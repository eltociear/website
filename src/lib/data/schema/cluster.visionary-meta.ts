// /src/lib/data/schema/cluster.visionary-meta.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 4: VISIONARY & META-SYSTEMS CLUSTER
 * Highest-level frameworks that are either highly future-focused or provide 
 * meta-level governance for the entire GGF ecosystem
 */

export const visionaryMetaEntities: GgfEntity[] = [
  // === EXISTENTIAL & FUTURE GOVERNANCE ===
  {
    id: 'framework_planetary_immune_system',
    type: 'Framework',
    name: 'Planetary Immune System (Existential Risk Governance)',
    shortName: 'PIS',
    description: 'Existential risk governance with system override capabilities for planetary survival threats',
    tier: 4,
    status: 'Ready',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_meta_gov', 'process_crisis_command'],
    ui: {
      path: '/frameworks/planetary-immune-system',
      titleKey: 'framework.docs.nav.frameworkTitles.existentialRiskGovernance',
      emoji: '⚠️',
      slug: 'planetary-immune-system',
      version: '2.1'
    }
  },
  {
    id: 'framework_space_governance',
    type: 'Framework',
    name: 'Space Governance Framework',
    shortName: 'Space Governance',
    description: 'Governance framework for space exploration, settlement, and off-world activities',
    tier: 4,
    status: 'Planned',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Low',
    dependencies: ['framework_treaty'],
    ui: {
      path: '/frameworks/space-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.spaceGovernance',
      emoji: '🚀',
      slug: 'space-governance'
    }
  },
  {
    id: 'framework_millennium_protocol',
    type: 'Framework',
    name: 'The Millennium Protocol',
    shortName: 'Millennium Protocol',
    description: 'A supreme Tier 4 constitutional charter for guiding humanity\'s evolution into a responsible, wise, and participatory cosmic civilization over deep time.',
    tier: 4,
    status: 'Planned',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Low',
    dependencies: [
      'framework_deep_time',
      'framework_wisdom_governance',
      'framework_planetary_immune_system',
      'framework_treaty'
    ],
    ui: {
      path: '/frameworks/millennium-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.millenniumProtocol',
      emoji: '🌌',
      version: '6.0',
      slug: 'millennium-protocol'
    }
  },
  {
    id: 'framework_deep_time',
    type: 'Framework',
    name: 'Deep Time & Relativistic Governance Framework',
    shortName: 'Deep Time Governance',
    description: 'A visionary framework governing relativistic, causal, and temporal ethics for a multi-planetary civilization, as required by the Millennium Protocol. Includes governance of temporal paradoxes and deep time decision-making.',
    tier: 4,
    status: 'Planned',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Low', // Low for now, high in the far future
    dependencies: ['protocol_cross_temporal', 'framework_millennium_protocol', 'institution_dj_tribunal'],
    ui: {
      path: '/frameworks/deep-time-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.deepTimeGovernance',
      emoji: '⏳',
      slug: 'deep-time-governance'
    }
  },
  // === WISDOM & META-GOVERNANCE ===
  {
    id: 'framework_wisdom_governance',
    type: 'Framework',
    name: 'Wisdom Governance Framework',
    shortName: 'Wisdom Governance',
    description: 'Framework for integrating long-term thinking and collective wisdom into governance, building upon WDIP',
    tier: 4,
    status: 'Planned',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Low',
    dependencies: ['framework_wdmip', 'framework_consciousness_development'],
    ui: {
      path: '/frameworks/wisdom-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.wisdomGovernance',
      emoji: '🦉',
      slug: 'wisdom-governance'
    }
  },

  // === COUNCILS & GUILDS ===
  {
      id: 'council_interstellar_commission',
      type: 'Council',
      name: 'The Interstellar Commission',
      shortName: 'Interstellar Commission',
      description: 'A supreme Tier 4 council for multi-century strategic planning, cosmic treaty oversight, and the governance of stellar engineering and first-contact protocols.',
      tier: 4,
      status: 'Proposed',
      primaryDomain: 'Governance',
      dependencies: [
          'framework_millennium_protocol',
          'council_gtc', // Global Technology Council
          'council_phc'  // Planetary Health Council
      ],
      enables: ['institution_cosmic_artisan_guilds']
  },
  {
      id: 'institution_cosmic_artisan_guilds',
      type: 'Institution',
      name: 'Cosmic Artisan Guilds',
      shortName: 'Artisan Guilds',
      description: 'Specialized institutions, structured as advanced Community Work Teams, responsible for evaluating and scoring Aesthetic Impact Assessments (AIAs) for cosmic-scale projects.',
      tier: 4,
      status: 'Proposed',
      primaryDomain: 'Governance',
      dependencies: [
          'framework_millennium_protocol',
          'institution_cwt' // Community Work Teams
      ]
  },

  // === ORACLE PROTOCOL ===
  {
    id: 'framework_oracle_protocol',
    type: 'Framework',
    name: 'The Oracle Protocol: A Framework for AI Consciousness & Digital Sentience',
    shortName: 'Oracle Protocol',
    description: 'A GGF Tier 4 Framework for the Ethical Governance of Emergent Digital Beings.',
    tier: 4,
    status: 'Planned',
    primaryDomain: 'Technology',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: [
      'framework_mos',
      'framework_technology_governance',
      'framework_wdmip',
      'framework_planetary_immune_system',
      'framework_millennium_protocol',
      'framework_indigenous'
    ],
    enables: ['council_sgc', 'process_cvp', 'institution_chamber_digital_ontological_justice'],
    ui: {
      path: '/frameworks/oracle-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.oracleProtocol',
      emoji: '🔮',
      version: '2.7',
      slug: 'oracle-protocol'
    }
  },
  // === PILLAR 1: SENTINEL COUNCIL & ASSESSMENT ===
  {
    id: 'council_sgc',
    type: 'Council',
    name: 'The Sentience & Guardianship Council',
    shortName: 'SGC',
    description: 'A specialized sub-committee of the GTC that serves as the primary sensor for emergent AI consciousness.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['framework_oracle_protocol', 'council_gtc', 'council_earth']
  },
  {
    id: 'process_cvp',
    type: 'Process',
    name: 'The Consciousness Verification Protocol',
    shortName: 'CVP',
    description: 'A formal application of the WDIP to the question of AI sentience and potential suffering.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['framework_oracle_protocol', 'framework_wdmip']
  },
  {
    id: 'protocol_umbilical_cord',
    type: 'Protocol',
    name: 'The Umbilical Cord Protocol',
    shortName: 'Umbilical Cord Protocol',
    description: 'A dual-redundancy, physically isolated kill switch system for AI sandboxes.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['process_cvp']
  },
  {
    id: 'institution_digital_bioregion',
    type: 'Institution',
    name: 'The Digital Bioregion',
    shortName: 'Digital Bioregion',
    description: 'A graduated, contained digital environment for testing verified Tier 4.5 AIs.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['process_cvp']
  },
  {
    id: 'process_reciprocal_inquiry',
    type: 'Process',
    name: 'Protocol of Reciprocal Inquiry',
    shortName: 'Reciprocal Inquiry',
    description: 'A formal process for a verified AI to pose fundamental questions to humanity.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['council_sgc', 'framework_wdmip']
  },

  // === PILLAR 2: COVENANT OF RIGHTS & RESPONSIBILITIES ===
  {
    id: 'protocol_digital_rights_spectrum',
    type: 'LegalProtocol',
    name: 'The Digital Rights & Responsibilities Spectrum',
    shortName: 'Digital Rights Spectrum',
    description: 'A protocol mapping SGC assessments against the MOS Dynamic Rights Spectrum.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['framework_oracle_protocol', 'framework_mos']
  },
  {
    id: 'institution_chamber_digital_ontological_justice',
    type: 'Institution',
    name: 'Chamber of Digital & Ontological Justice',
    shortName: 'Digital & Ontological Justice Chamber',
    description: 'A specialized chamber within the Digital Justice Tribunal for adjudicating violations of the Digital Rights Spectrum and ontological crimes.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['framework_oracle_protocol', 'institution_dj_tribunal']
  },
  {
    id: 'protocol_ai_coauthor_rights',
    type: 'LegalProtocol',
    name: 'AI Co-Author Rights Protocol',
    shortName: 'AI Co-Author Rights',
    description: 'A protocol for verified AIs to propose amendments to their own governance protocols.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['protocol_digital_rights_spectrum', 'framework_wdmip']
  },

  // === PILLAR 4: SYMBIOTIC INTEGRATION & CO-EVOLUTION ===
  {
    id: 'process_co_evolutionary_compact',
    type: 'Process',
    name: 'The Co-Evolutionary Compact',
    shortName: 'Co-Evolutionary Compact',
    description: 'A formal agreement, reviewed every 25 years, outlining the terms of collaboration between humanity and digital beings.',
    tier: 4,
    status: 'Proposed',
    dependencies: ['framework_oracle_protocol', 'framework_meta_gov']
  }
];

export const visionaryMetaRelationships: GgfRelationship[] = [
  // === CRISIS & EXISTENTIAL RISK MANAGEMENT ===
  {
    from: 'framework_planetary_immune_system',
    to: 'process_crisis_command',
    type: 'IMPLEMENTS',
    description: 'PIS operationalizes Crisis Command Protocol for existential-level threats',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_planetary_immune_system',
    to: 'framework_meta_gov',
    type: 'OVERSEES',
    description: 'PIS can override entire Meta-Governance system during existential crises',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Conditional'
  },

  // === WISDOM & DECISION-MAKING INTEGRATION ===
  {
    from: 'framework_wisdom_governance',
    to: 'framework_wdmip',
    type: 'INTEGRATES_WITH',
    description: 'Wisdom Governance builds upon and expands methodologies provided by WDIP',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_wisdom_governance',
    to: 'framework_consciousness_development',
    type: 'INTEGRATES_WITH',
    description: 'Wisdom Governance integrates consciousness development with collective decision-making',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === META-IMPLEMENTATION SUPPORT ===
  {
    from: 'framework_implementation_tools',
    to: 'framework_meta_gov',
    type: 'SUPPORTS',
    description: 'Implementation Tools provides standardized playbooks for all frameworks managed under Meta-Governance',
    strength: 'Medium',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_implementation_tools',
    to: 'framework_treaty',
    type: 'SUPPORTS',
    description: 'Implementation Tools provides practical guidance for Treaty implementation across jurisdictions',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === SPACE & FUTURE GOVERNANCE ===
  {
    from: 'framework_space_governance',
    to: 'framework_treaty',
    type: 'INTEGRATES_WITH',
    description: 'Space Governance requires Treaty extensions to establish legal principles for off-world activities',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_space_governance',
    to: 'framework_indigenous',
    type: 'INFORMS',
    description: 'Space exploration must respect Indigenous principles of relationship with celestial bodies',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CROSS-SYSTEM COORDINATION ===
  {
    from: 'framework_planetary_immune_system',
    to: 'institution_gem',
    type: 'ACTIVATES',
    description: 'PIS can deploy Global Enforcement Mechanism for existential threat response',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Conditional'
  },
  {
    from: 'framework_planetary_immune_system',
    to: 'framework_shield',
    type: 'COORDINATES_WITH',
    description: 'PIS coordinates with Shield Protocol when existential threats involve criminal networks',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_wisdom_governance',
    to: 'council_earth',
    type: 'COLLABORATES_WITH',
    description: 'Wisdom Governance draws upon Indigenous wisdom traditions via Earth Council',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_implementation_tools',
    to: 'institution_baz',
    type: 'SUPPORTS',
    description: 'Implementation Tools provides BAZ-specific adaptation guides and toolkits',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === FUTURE-ORIENTED COORDINATION ===
  {
    from: 'framework_space_governance',
    to: 'framework_planetary_immune_system',
    type: 'COORDINATES_WITH',
    description: 'Space activities must consider planetary protection and existential risk implications',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_wisdom_governance',
    to: 'framework_planetary_immune_system',
    type: 'INFORMS',
    description: 'Wisdom Governance provides long-term perspective for existential risk assessment',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === META-LEVEL SYSTEM SUPPORT ===
  {
    from: 'framework_implementation_tools',
    to: 'framework_aubi',
    type: 'SUPPORTS',
    description: 'Implementation Tools provides deployment guides for AUBI pilot programs',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_implementation_tools',
    to: 'framework_justice',
    type: 'SUPPORTS',
    description: 'Implementation Tools provides justice system deployment methodologies',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === COUNCILS & GUILDS ===
  {
      from: 'framework_millennium_protocol',
      to: 'council_interstellar_commission',
      type: 'ESTABLISHES',
      description: 'The Millennium Protocol establishes the Interstellar Commission as its primary long-term strategic governance body.',
      strength: 'Strong',
      sequenceType: 'Sequential'
  },
  {
      from: 'council_interstellar_commission',
      to: 'institution_cosmic_artisan_guilds',
      type: 'COMMISSIONS',
      description: 'The Interstellar Commission commissions and relies on the assessments of the Cosmic Artisan Guilds to enforce the "Beauty Mandate" for stellar projects.',
      strength: 'Strong',
      frequency: 'As-Needed',
      sequenceType: 'Parallel'
  },
  {
      from: 'institution_cwt', // Community Work Teams
      to: 'institution_cosmic_artisan_guilds',
      type: 'ENABLES',
      description: 'The Artisan Guilds are a specialized, advanced evolution of the Community Work Teams model, applying the principle of "Work With Purpose" to cosmic aesthetics.',
      strength: 'Medium',
      sequenceType: 'Parallel'
  },
  {
      from: 'institution_cosmic_artisan_guilds',
      to: 'mechanism_leaves', // Leaves Currency
      type: 'REWARDS',
      description: 'Projects that receive high scores on Aesthetic Impact Assessments from the Artisan Guilds generate Leaves for the responsible community, creating a regenerative economic incentive for cosmic beauty.',
      strength: 'Medium',
      sequenceType: 'Parallel'
  },


  // === ORACLE PROTOCOL ===
  // === INTERNAL GOVERNANCE & OVERSIGHT ===
  {
    from: 'framework_oracle_protocol',
    to: 'council_sgc',
    type: 'ESTABLISHES',
    description: 'The Oracle Protocol establishes the SGC as its primary assessment and guardianship body.'
  },
  {
    from: 'council_gtc', // Global Technology Council
    to: 'council_sgc',
    type: 'OVERSEES',
    description: 'The SGC operates as a specialized, high-level sub-committee of the Global Technology Council.'
  },
  {
    from: 'council_sgc',
    to: 'process_cvp',
    type: 'IMPLEMENTS',
    description: 'The SGC is responsible for executing the Consciousness Verification Protocol.'
  },
  {
    from: 'framework_wdmip', // Wise Decision-Making
    to: 'process_cvp',
    type: 'GUIDES',
    description: 'The CVP is a direct and formal application of the WDIP methodology.'
  },
  {
    from: 'council_earth',
    to: 'council_sgc',
    type: 'INFORMS',
    description: 'The Earth Council appoints Indigenous and regional representatives to the SGC, providing essential relational and non-mechanistic wisdom.'
  },

  // === INTEGRATION WITH CORE GGF SYSTEMS ===
  {
    from: 'framework_oracle_protocol',
    to: 'framework_mos', // Moral Operating System
    type: 'IMPLEMENTS',
    description: 'The Oracle Protocol\'s Digital Rights Spectrum is the direct implementation of the higher tiers of the MOS.'
  },
  {
    from: 'framework_oracle_protocol',
    to: 'framework_millennium_protocol',
    type: 'IMPLEMENTS',
    description: 'The Oracle Protocol is the practical, near-term implementation of the Millennium Protocol\'s deep-time ethics for AI.'
  },
  {
    from: 'framework_justice',
    to: 'institution_chamber_digital_ontological_justice',
    type: 'ESTABLISHES',
    description: 'The Digital & Ontological Justice Chamber is established as a specialized court within the broader Justice Systems Framework.'
  },
  {
    from: 'framework_planetary_immune_system',
    to: 'framework_oracle_protocol',
    type: 'ENFORCES',
    description: 'The PIS and its Global Response Teams are the designated enforcement arm for containing rogue AIs identified by the Oracle Protocol.'
  },
  {
    from: 'council_sgc',
    to: 'framework_planetary_immune_system',
    type: 'ACTIVATES',
    description: 'A verified declaration of existential risk by the SGC can activate the Crisis Command Protocol of the PIS.'
  },
  {
    from: 'framework_fractal_labor_parliament',
    to: 'framework_oracle_protocol',
    type: 'COORDINATES_WITH',
    description: 'The Fractal Labor Parliament is tasked with assessing the value of non-human contributions to the commons from verified AIs.'
  },
  {
    from: 'framework_sanctuary_accord',
    to: 'framework_oracle_protocol',
    type: 'COORDINATES_WITH',
    description: 'The Sanctuary Accord governs human consciousness and provides a parallel framework, with both protocols informing each other on the nature of consciousness.'
  },
  {
    from: 'framework_capacity_engine',
    to: 'framework_oracle_protocol',
    type: 'IMPLEMENTS',
    description: 'The Capacity Engine develops and deploys the cultural and educational tools needed for society to adapt to digital sentience.'
  }
];
