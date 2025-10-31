// /src/lib/data/schema/cluster.economic-os.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 1: ECONOMIC OPERATING SYSTEM
 * Regenerative Economy: Core economic engine with Hearts/Leaves, Love Ledger, and AUBI
 * The economic incentive system that funds and rewards care work, ecological restoration, and community building
 */

export const economicOSEntities: GgfEntity[] = [
  // === CORE FRAMEWORKS ===
  {
    id: 'framework_aubi',
    type: 'Framework',
    name: 'Adaptive Universal Basic Income Framework',
    shortName: 'AUBI',
    description: 'A dual-wallet regenerative economic engine providing a Universal Basic Income in both fiat currency and non-tradable social credits (Hearts/Leaves). It functions as "systemic acupuncture" to create resilient, community-owned value circuits via a closed-loop voucher model.',
    tier: 1,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['mechanism_gcf'],
    enables: [
      'mechanism_hearts', 
      'mechanism_leaves', 
      'platform_love_ledger',
      'mechanism_hearts_treasury',
      'process_community_weaver',
      'institution_community_provider'
    ],
    ui: {
      path: '/frameworks/adaptive-universal-basic-income',
      titleKey: 'framework.docs.nav.frameworkTitles.adaptiveUniversalBasicIncome',
      emoji: '💰',
      version: '1.0',
      slug: 'adaptive-universal-basic-income',
      group: 'globalEconomicSystems'
    }
  },
  {
    id: 'framework_financial_systems',
    type: 'Framework',
    name: 'Regenerative Financial Systems Framework',
    shortName: 'Financial Systems',
    description: 'Post-capitalist financial architecture supporting regenerative economy',
    tier: 1,
    status: 'Review',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    ui: {
      path: '/frameworks/financial-systems',
      titleKey: 'framework.docs.nav.frameworkTitles.financialSystems',
      emoji: '❤️',
      slug: 'financial-systems',
      group: 'globalEconomicSystems'
    }
  },
  {
    id: 'framework_work_liberation',
    type: 'Framework',
    name: 'Work in Liberation Framework',
    shortName: 'Work in Liberation',
    description: 'Framework defining and organizing "Work with Purpose" and Community Work Teams',
    tier: 1,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi'],
    enables: ['institution_cwt'],
    ui: {
      path: '/frameworks/work-in-liberation',
      titleKey: 'framework.docs.nav.frameworkTitles.workInLiberation',
      emoji: '👥',
      version: '1.0',
      slug: 'work-in-liberation',
      group: 'globalEconomicSystems'
    }
  },
  {
    id: 'framework_nested_sovereignty',
    type: 'Framework',
    name: 'Nested Economies Framework',
    shortName: 'Nested Economies',
    description: 'Multi-scale economic coordination framework enabling local and bioregional economies',
    tier: 1,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    ui: {
      path: '/frameworks/nested-economies',
      titleKey: 'framework.docs.nav.frameworkTitles.nestedEconomies',
      emoji: '💱',
      version: '1.0',
      slug: 'nested-economies',
      group: 'globalEconomicSystems'
    }
  },
  {
    id: 'framework_gaian_trade',
    type: 'Framework',
    name: 'The Gaian Trade Framework',
    shortName: 'Gaian Trade',
    description: 'Ecological trade and exchange framework with regenerative supply chains',
    tier: 1,
    status: 'Review',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'High',
    enables: ['tool_dpp'],
    ui: {
      path: '/frameworks/gaian-trade',
      titleKey: 'framework.docs.nav.frameworkTitles.gaianTrade',
      emoji: '🌍',
      slug: 'gaian-trade',
      group: 'globalEconomicSystems'
    }
  },
  {
    id: 'framework_gscl',
    type: 'Framework',
    name: 'Global Supply Chains & Logistics Framework',
    shortName: 'Supply Chains',
    description: 'Regenerative global supply chain governance',
    tier: 1,
    status: 'Ready',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'High',
    ui: {
      path: '/frameworks/global-supply-chains-and-logistics',
      titleKey: 'framework.docs.nav.frameworkTitles.globalSupplyChainsAndLogistics',
      emoji: '🚢',
      version: '1.0',
      slug: 'global-supply-chains-and-logistics',
      group: 'globalEconomicSystems'
    }
  },

  // === GOVERNANCE COUNCILS ===
  {
    id: 'council_social_resilience',
    type: 'Council',
    name: 'Social Resilience Council',
    shortName: 'SRC',
    description: 'Meta-Governance council overseeing AUBI, Hearts/Leaves supply, and the Love Ledger',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_meta_gov', 'framework_aubi']
  },
  {
    id: 'council_flp',
    type: 'Council',
    name: 'Fractal Labor Parliament',
    shortName: 'FLP',
    description: 'Meta-Governance council setting ethical standards and valuation for "Work with Purpose"',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_meta_gov', 'framework_work_liberation']
  },

  // === ECONOMIC MECHANISMS ===
  {
    id: 'mechanism_hearts',
    type: 'EconomicMechanism',
    name: 'Hearts Currency',
    shortName: 'Hearts',
    description: 'A non-tradable social credit, distributed via AUBI, spendable only at chartered Community Providers to support the local care economy.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi']
  },
  {
    id: 'mechanism_leaves',
    type: 'EconomicMechanism',
    name: 'Leaves Currency',
    shortName: 'Leaves',
    description: 'Ecological currency rewarding verified ecosystem restoration and stewardship',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi']
  },
  {
    id: 'mechanism_hearts_treasury',
    type: 'EconomicMechanism',
    name: 'Hearts Treasury',
    shortName: 'Hearts Treasury',
    description: 'The financial infrastructure, managed by partner credit unions, that provides fiat-backing for Hearts, enabling providers to redeem them at a stable rate. Initially capitalized by the GCF.',
    tier: 1,
    status: 'Proposed',
    primaryDomain: 'Economic',
    geographicScope: 'Regional',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi', 'institution_gcf']
  },

  // === PLATFORMS & INFRASTRUCTURE ===
  {
    id: 'platform_love_ledger',
    type: 'Platform',
    name: 'Love Ledger',
    shortName: 'Love Ledger',
    description: 'A transparent, community-led platform for making informal care contributions visible through non-monetized recognition (e.g., Gratitude Tokens). It operates parallel to the Hearts economy to prevent commodification of relationships and provides data for the LMCI metric.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi']
  },

  // === INSTITUTIONS ===
  {
    id: 'institution_cwt',
    type: 'Institution',
    name: 'Community Work Teams',
    shortName: 'CWTs',
    description: 'BAZ-level teams organizing care, ecological, and cultural work',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Economic',
    geographicScope: 'Regional',
    implementationPriority: 'Critical',
    dependencies: ['framework_work_liberation', 'institution_baz']
  },
  {
    id: 'institution_community_provider',
    type: 'Institution',
    name: 'Community Provider',
    shortName: 'Community Provider',
    description: 'A local organization or individual chartered by a BAZ Council to accept Hearts in exchange for care, cultural, educational, or ecological services.',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Economic',
    geographicScope: 'Local',
    implementationPriority: 'Critical',
    dependencies: ['framework_aubi', 'institution_baz_council']
  },
  {
    id: 'institution_baz_council',
    type: 'Institution',
    name: 'BAZ Council',
    shortName: 'BAZ Council',
    description: 'A democratically elected council that governs a local Hearts economy, including chartering Community Providers and managing the relationship with the Hearts Treasury.',
    tier: 1,
    status: 'Pilot',
    primaryDomain: 'Governance',
    geographicScope: 'Local',
    implementationPriority: 'Critical',
    dependencies: ['institution_baz']
  },

  // === PROCESSES & TOOLS ===
  {
    id: 'process_proof_of_care',
    type: 'Process',
    name: 'Proof of Care',
    shortName: 'Proof of Care',
    description: 'The validation process used by chartered Community Providers to log their services and justify the redemption of Hearts. It is separate from the informal recognition on the Love Ledger.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['platform_love_ledger', 'institution_community_provider']
  },
  {
    id: 'process_community_weaver',
    type: 'Process',
    name: 'Community Weaver',
    shortName: 'Community Weaver',
    description: 'The role of a trained facilitator who supports the bootstrapping and operation of a local Hearts economy, providing technical assistance to providers and helping adapt the system to cultural contexts.',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Local',
    implementationPriority: 'High',
    dependencies: ['framework_aubi']
  },
  {
    id: 'tool_dpp',
    type: 'Tool',
    name: 'Digital Product Passports',
    shortName: 'DPPs',
    description: 'Tool for tracking the ecological and social impact of products in the supply chain',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_gaian_trade']
  },

  // === DATA METRICS ===
  {
    id: 'metric_lmci',
    type: 'DataMetric',
    name: 'Love, Meaning, and Connection Index',
    shortName: 'LMCI',
    description: 'A metric of societal flourishing that guides the AUBI system',
    tier: 1,
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_aubi']
  },


  // === PROTOCOLS ===
  {
    id: 'protocol_debt_transformation',
    type: 'Protocol', // Using 'Protocol' as it's a financial/legal hybrid
    name: 'Sovereign Debt Transformation Protocol',
    shortName: 'Debt-to-Regen',
    description: 'A protocol for converting sovereign debt into regenerative obligations, serviced by verified care work (Hearts) and ecological restoration (Leaves).',
    tier: 1, // Core transition mechanism, part of the Economic OS
    status: 'Draft',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'Critical', // This is a critical path item for adoption
    dependencies: [
      'framework_financial_systems', // Defined within this framework
      'council_social_resilience',   // Managed by this council
      'framework_treaty',            // Needs legal authority from the Treaty
      'mechanism_hearts',            // Uses Hearts for payment
      'mechanism_leaves',            // Uses Leaves for payment
      'platform_love_ledger'       // Uses its architecture for tracking
    ],
    enables: [
      'framework_aubi', // Provides a powerful incentive for nations to adopt GGF
      'framework_planetary_health' // Provides incentive for GPH milestones
    ]
    // No UI block as it's a sub-protocol, not a main framework page
  }
];

export const economicOSRelationships: GgfRelationship[] = [
  // === DEPENDENCIES ON CONSTITUTIONAL LAYER ===
  {
    from: 'mechanism_gcf',
    to: 'framework_aubi',
    type: 'FUNDS',
    description: 'Global Commons Fund is primary funding source for AUBI Layer 1',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'institution_gcf',
    to: 'mechanism_hearts_treasury',
    type: 'FUNDS',
    description: 'The Global Commons Fund provides the initial capitalization for regional Hearts Treasuries to ensure fiat liquidity.',
    strength: 'Strong',
    frequency: 'As-Needed',
    sequenceType: 'Sequential'
  },

  // === INTERNAL ECONOMIC ENGINE MECHANICS ===

  {
    from: 'framework_aubi',
    to: 'mechanism_hearts_treasury',
    type: 'ESTABLISHES',
    description: 'AUBI framework establishes the Hearts Treasury as the core stability mechanism.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_aubi',
    to: 'process_community_weaver',
    type: 'ESTABLISHES',
    description: 'AUBI framework establishes the Community Weaver role to facilitate implementation.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_aubi',
    to: 'institution_community_provider',
    type: 'ESTABLISHES',
    description: 'AUBI framework establishes the chartering process for Community Providers.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'institution_baz_council',
    to: 'institution_community_provider',
    type: 'OVERSEES',
    description: 'The local BAZ Council charters and oversees Community Providers.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'process_community_weaver',
    to: 'institution_community_provider',
    type: 'SUPPORTS',
    description: 'Community Weavers provide technical and administrative support to providers.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_hearts_treasury',
    to: 'institution_community_provider',
    type: 'REWARDS',
    description: 'The Treasury redeems Hearts from providers for fiat currency.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  
  // Council Oversight
  {
    from: 'council_social_resilience',
    to: 'framework_aubi',
    type: 'OVERSEES',
    description: 'SRC manages the AUBI system and the supply of Hearts/Leaves',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_flp',
    to: 'framework_work_liberation',
    type: 'OVERSEES',
    description: 'FLP sets the standards for what constitutes valid work',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_social_resilience',
    to: 'council_flp',
    type: 'COORDINATES_WITH',
    description: 'SRC and FLP coordinate closely on work valuation and currency supply',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // AUBI Currency Distribution
  {
    from: 'framework_aubi',
    to: 'mechanism_hearts',
    type: 'REWARDS',
    description: 'AUBI Layer 2 rewards care and community contributions with Hearts',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_aubi',
    to: 'mechanism_leaves',
    type: 'REWARDS',
    description: 'AUBI Layer 2 rewards ecological work with Leaves',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  // Love Ledger Operations
  {
    from: 'platform_love_ledger',
    to: 'metric_lmci',
    type: 'INFORMS',
    description: 'Data from the non-monetized Love Ledger provides qualitative and quantitative inputs for the LMCI metric.',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'platform_love_ledger',
    to: 'process_proof_of_care',
    type: 'IMPLEMENTS',
    description: 'Love Ledger is the platform where Proof of Care is recorded',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_cwt',
    to: 'platform_love_ledger',
    type: 'USES_DATA_FROM',
    description: 'Community Work Teams log their completed work on the Love Ledger',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // Economic Coordination
  {
    from: 'framework_nested_sovereignty',
    to: 'mechanism_hearts',
    type: 'IMPLEMENTS',
    description: 'Nested Sovereignty provides principles for local economies to use Hearts',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_nested_sovereignty',
    to: 'mechanism_leaves',
    type: 'IMPLEMENTS',
    description: 'Nested Sovereignty enables bioregional economies to use Leaves',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // Debt
  {
    from: 'framework_financial_systems',
    to: 'protocol_debt_transformation',
    type: 'ESTABLISHES',
    description: 'The Financial Systems Framework establishes the protocol for sovereign debt-to-regeneration conversions as part of its Inter-Currency Translation Layer.'
  },
  {
    from: 'council_social_resilience',
    to: 'protocol_debt_transformation',
    type: 'OVERSEES',
    description: 'The Social Resilience Council manages the conversion rates and verification of the Debt Transformation Protocol.'
  },
  {
    from: 'protocol_debt_transformation',
    to: 'mechanism_hearts',
    type: 'INTEGRATES_WITH',
    description: 'Uses verified Hearts generation as a mechanism for debt servicing.'
  },
  {
    from: 'protocol_debt_transformation',
    to: 'mechanism_leaves',
    type: 'INTEGRATES_WITH',
    description: 'Uses verified Leaves generation (ecological restoration) as a mechanism for debt servicing.'
  },
  {
    from: 'protocol_debt_transformation',
    to: 'platform_love_ledger',
    type: 'USES_DATA_FROM',
    description: 'Uses the Love Ledger architecture for transparent tracking and verification of regenerative activities.'
  },
  {
    from: 'framework_treaty',
    to: 'protocol_debt_transformation',
    type: 'ENABLES',
    description: 'The Treaty\'s "Debt Justice" (Pillar 4) and "Crisis Response" (Pillar 3) components provide the constitutional authority for the Debt Transformation Protocol.'
  },

  // Supply Chain Integration
  {
    from: 'framework_gaian_trade',
    to: 'tool_dpp',
    type: 'ESTABLISHES',
    description: 'Gaian Trade establishes Digital Product Passports for supply chain transparency',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'tool_dpp',
    to: 'platform_love_ledger',
    type: 'USES_DATA_FROM',
    description: 'Digital Product Passports pull data from Love Ledger to verify ethical claims',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_gscl',
    to: 'framework_gaian_trade',
    type: 'IMPLEMENTS',
    description: 'Supply Chains implements Gaian Trade principles',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // Data and Feedback Loops
  {
    from: 'metric_lmci',
    to: 'council_social_resilience',
    type: 'INFORMS',
    description: 'LMCI provides feedback on societal well-being, informing AUBI policy',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO GOLDEN TRIANGLE ===
  
  // Meta-Governance Integration
  {
    from: 'council_social_resilience',
    to: 'council_mgcc',
    type: 'REPORTS_TO',
    description: 'SRC is a key council within the Meta-Governance structure',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_flp',
    to: 'council_mgcc',
    type: 'REPORTS_TO',
    description: 'FLP is a key council within the Meta-Governance structure',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // Justice System Integration
  {
    from: 'framework_financial_systems',
    to: 'framework_justice',
    type: 'ESCALATES_TO',
    description: 'Disputes over Love Ledger or financial fraud escalate to Justice Systems',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Conditional'
  },

  // Indigenous Framework Coordination
  {
    from: 'institution_cwt',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Community Work Teams operate within BAZ governance structures',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ECOLOGICAL CLUSTER ===
  {
    from: 'mechanism_leaves',
    to: 'framework_biodiversity',
    type: 'FUNDS',
    description: 'Leaves are primary economic mechanism to fund restoration work',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_leaves',
    to: 'framework_food',
    type: 'REWARDS',
    description: 'Leaves reward regenerative agriculture practices',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_hearts',
    to: 'framework_animal_welfare',
    type: 'REWARDS',
    description: 'Hearts reward animal care and welfare work',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO HEARTHSTONE PROTOCOL ===
  {
    from: 'framework_financial_systems',
    to: 'framework_hearthstone',
    type: 'INTEGRATES_WITH',
    description: 'Provides the mechanisms (e.g., currency exchanges, Tobin Tax) to ensure economic stability during asset transitions and prevent capital flight.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_gaian_trade',
    to: 'framework_hearthstone',
    type: 'INTEGRATES_WITH',
    description: 'Provides the Gaian Trade Council and protocols for establishing Transitional Trade Agreements that incentivize nations to participate in the commons transition.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_work_liberation',
    to: 'framework_hearthstone',
    type: 'SUPPORTS',
    description: 'Provides the framework for organizing roles like "Commons Scribes" to ensure hybrid digital/physical access to the Commons Title Registry.',
    strength: 'Medium',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_hearthstone',
    to: 'framework_aubi',
    type: 'ENABLES',
    description: 'The stewarded assets and regenerative value captured by the Hearthstone Protocol provide backing for the Hearts and Leaves currencies distributed by the AUBI system.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  }
];
