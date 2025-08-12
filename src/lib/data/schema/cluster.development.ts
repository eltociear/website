// /src/lib/data/schema/cluster.development.ts

import type { GgfEntity, GgfRelationship } from './_types';

// Entities for The Mobility Commons
export const mobilityCommonsEntities: GgfEntity[] = [
  {
    id: 'framework_mobility_commons',
    type: 'Framework',
    name: 'The Mobility Commons: A Framework for Regenerative Transportation & Mobility',
    shortName: 'The Mobility Commons',
    description: 'A GGF framework to govern transportation as a regenerative, equitable, and shared global resource, prioritizing fossil-free, universally accessible mobility.',
    tier: 2,
    status: 'Draft', // Status is Draft as it's a newly defined outline
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: [
      'framework_treaty', 
      'framework_meta_gov', 
      'framework_indigenous',
      'framework_climate_energy',
      'framework_aurora_accord',
      'framework_disability_justice'
    ],
    enables: ['council_gmc'],
    ui: {
      path: '/frameworks/mobility-commons',
      titleKey: 'framework.docs.nav.frameworkTitles.mobilityCommons',
      emoji: '🚆',
      slug: 'mobility-commons',
      group: 'planetaryHealthResilience' // Or 'globalEconomicSystems'
    }
  },

  {
    id: 'council_gmc',
    type: 'Council',
    name: 'Global Mobility Council',
    shortName: 'GMC',
    description: 'A specialized sub-council within the Meta-Governance Framework responsible for setting standards and coordinating transnational mobility projects.',
    tier: 2,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_mobility_commons', 'framework_meta_gov']
  }
];

// Key Relationships for The Mobility Commons
export const mobilityCommonsRelationships: GgfRelationship[] = [
  // Relationship to the "Golden Triangle"
  {
    from: 'framework_treaty',
    to: 'framework_mobility_commons',
    type: 'ENABLES',
    description: 'The Treaty provides the legal authority and enforcement mechanisms (via the Digital Justice Tribunal) for the Mobility Commons\' standards and charters.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_meta_gov',
    to: 'framework_mobility_commons',
    type: 'COORDINATES_WITH',
    description: 'Meta-Governance provides the coordination architecture and hosts the Global Mobility Council as a specialized sub-council.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_indigenous',
    to: 'framework_mobility_commons',
    type: 'GUIDES',
    description: 'The Indigenous Framework provides non-negotiable guidance on BAZ-led governance, FPIC 2.0 protocols, and the protection of sacred travel routes.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  
  // Core Functional Relationships
  {
    from: 'framework_mobility_commons',
    to: 'council_gmc',
    type: 'ESTABLISHES',
    description: 'The Mobility Commons framework establishes the Global Mobility Council as its primary governance body.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_climate_energy',
    to: 'framework_mobility_commons',
    type: 'INFORMS',
    description: 'The Climate & Energy framework sets the decarbonization targets that the Mobility Commons is responsible for implementing in the transport sector.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_gscl',
    to: 'framework_mobility_commons',
    type: 'COORDINATES_WITH',
    description: 'Coordinates on shared infrastructure (ports, hubs) and policies to ensure the efficient movement of both goods and people.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },

  // Justice and Equity Layer Integration
  {
    from: 'framework_disability_justice',
    to: 'framework_mobility_commons',
    type: 'VALIDATES',
    description: 'The Disability Justice Layer provides mandatory universal design standards and auditing for all mobility infrastructure and services.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_gender_justice',
    to: 'framework_mobility_commons',
    type: 'VALIDATES',
    description: 'The Gender & Kinship Justice Council audits mobility projects for safety and equity, ensuring they serve marginalized communities.',
    strength: 'Medium',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_youth_justice',
    to: 'framework_mobility_commons',
    type: 'VALIDATES',
    description: 'The Youth & Future Generations framework provides veto power and seven-generation impact assessments for long-term mobility projects.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },

  // Economic and Technological Integration
  {
    from: 'framework_aubi',
    to: 'framework_mobility_commons',
    type: 'INTEGRATES_WITH',
    description: 'AUBI provides the Hearts/Leaves system to economically reward sustainable mobility choices and supports workers during the just transition.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_aurora_accord',
    to: 'framework_mobility_commons',
    type: 'GUIDES',
    description: 'The Aurora Accord provides the data sovereignty and privacy rules for all digital platforms used in the Mobility Commons, such as the MaaS platform.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  }
];

/**
 * TIER 3: DEVELOPMENT APPLICATIONS CLUSTER
 * Frameworks for sustainable urban and rural development coordinating 
 * human settlements with ecological and economic systems
 */

export const developmentEntities: GgfEntity[] = [
  // === CORE DEVELOPMENT FRAMEWORKS ===
  {
    id: 'framework_urban_community',
    type: 'Framework',
    name: 'The Bioregional Polis Framework',
    shortName: 'Bioregional Polis',
    description: 'Framework for sustainable urban planning and community development',
    tier: 3,
    status: 'Coming-Soon',
    primaryDomain: 'Governance',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_educational_systems', 'framework_nested_sovereignty'],
    ui: {
      path: '/frameworks/bioregional-polis',
      titleKey: 'framework.docs.nav.frameworkTitles.bioregionalPolis',
      emoji: '🏙️',
      slug: 'bioregional-polis',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'framework_rural_development',
    type: 'Framework',
    name: 'Rural Development Governance Framework',
    shortName: 'Rural Development',
    description: 'Framework for sustainable rural development and agriculture integration',
    tier: 3,
    status: 'Planned',
    primaryDomain: 'Economic',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_food', 'framework_nested_sovereignty'],
    ui: {
      path: '/frameworks/living-land-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.livingLandProtocol',
      emoji: '🛖',
      slug: 'living-land-protocol'
    }
  },

  // === TOURISM AND TRAVEL ===
  {
    id: 'framework_regenerative_journeys',
    type: 'Framework',
    name: 'The Regenerative Journeys Framework',
    shortName: 'Regenerative Journeys',
    description: 'A GGF Tier 3 framework to govern global tourism as a regenerative practice that heals communities, restores ecosystems, and fosters reciprocal relationships between guests and hosts.',
    tier: 3,
    status: 'Ready', // Based on the v3.3 designation and detail level.
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: [
      'framework_mobility_commons',
      'framework_planetary_health',
      'framework_aubi',
      'framework_indigenous',
      'framework_cultural_heritage',
      'framework_disability',
      'framework_drr'
    ],
    enables: [
      'council_baz_tourism',
      'mechanism_regenerative_tourism_levy',
      'process_tourism_impact_assessment',
      'council_regenerative_tourism_assembly'
    ],
    ui: {
      path: '/frameworks/regenerative-journeys',
      titleKey: 'framework.docs.nav.frameworkTitles.regenerativeJourneys',
      emoji: '✈️',
      slug: 'regenerative-journeys',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'council_baz_tourism',
    type: 'Council',
    name: 'BAZ Tourism Council',
    shortName: 'BAZ Tourism Council',
    description: 'A decentralized, community-led council established in each BAZ to govern local tourism, set carrying capacities, and enforce ethical protocols with veto power.',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'BAZ', // BAZ-level institution
    implementationPriority: 'High',
    dependencies: ['framework_regenerative_journeys', 'institution_baz']
  },
  {
    id: 'mechanism_regenerative_tourism_levy',
    type: 'EconomicMechanism',
    name: 'Dynamic Regenerative Tourism Levy',
    shortName: 'Tourism Levy',
    description: 'A BAZ-adjusted levy on international travel that funds the Global Commons Fund for ecological restoration, community microgrants, and a Migration Solidarity Economy.',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Economic',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_regenerative_journeys', 'mechanism_gcf']
  },
  {
    id: 'process_tourism_impact_assessment',
    type: 'Process',
    name: 'Tourism Impact Assessment (TIA)',
    shortName: 'TIA',
    description: 'A mandatory assessment for tourism projects measuring impacts on the BHI, LMCI, and a Decolonization Scorecard, ensuring accountability to regenerative principles.',
    tier: 3,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'BAZ',
    implementationPriority: 'High',
    dependencies: ['framework_regenerative_journeys', 'metric_bhi', 'metric_lmci']
  },
  {
    id: 'council_regenerative_tourism_assembly',
    type: 'Council',
    name: 'Regenerative Tourism Assembly',
    shortName: 'Tourism Assembly',
    description: 'A facilitative Meta-Governance sub-council for BAZ Tourism Councils to coordinate, share resources, and manage cross-bioregion tourism corridors.',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_regenerative_journeys', 'framework_meta_gov']
  }
];

export const developmentRelationships: GgfRelationship[] = [
  // === INTER-FRAMEWORK COORDINATION ===
  {
    from: 'framework_urban_community',
    to: 'framework_rural_development',
    type: 'COORDINATES_WITH',
    description: 'Urban and rural development must coordinate to manage resource flows, migration, and food systems',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ECOLOGICAL CLUSTER ===
  {
    from: 'framework_rural_development',
    to: 'framework_food',
    type: 'INTEGRATES_WITH',
    description: 'Rural development is inextricably linked to governance of food and agriculture systems',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_urban_community',
    to: 'framework_planetary_health',
    type: 'COLLABORATES_WITH',
    description: 'Urban planning must align with planetary health boundaries and ecological limits',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'framework_biodiversity',
    type: 'COLLABORATES_WITH',
    description: 'Rural development must integrate biodiversity conservation and ecosystem services',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ECONOMIC OS ===
  {
    from: 'framework_nested_sovereignty',
    to: 'framework_urban_community',
    type: 'GUIDES',
    description: 'Nested Sovereignty framework provides governance model for city-level and bioregional organization',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_nested_sovereignty',
    to: 'framework_rural_development',
    type: 'GUIDES',
    description: 'Nested Sovereignty provides multi-scale economic coordination for rural bioregional economies',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_aubi',
    to: 'framework_rural_development',
    type: 'SUPPORTS',
    description: 'AUBI provides economic foundation for rural communities and agricultural transitions',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_work_liberation',
    to: 'framework_urban_community',
    type: 'IMPLEMENTS',
    description: 'Urban development incorporates Community Work Teams for local infrastructure and services',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO HUMAN FLOURISHING ===
  {
    from: 'framework_education',
    to: 'framework_urban_community',
    type: 'INFORMS',
    description: 'Educational systems planning informs urban community development strategies',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_global_health',
    to: 'framework_urban_community',
    type: 'INFORMS',
    description: 'Urban planning incorporates public health principles and pandemic preparedness',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO OTHER APPLICATION CLUSTERS ===
  {
    from: 'framework_urban_community',
    to: 'framework_drr',
    type: 'INTEGRATES_WITH',
    description: 'Urban planning must incorporate disaster resilience standards and climate adaptation',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'framework_drr',
    type: 'INTEGRATES_WITH',
    description: 'Rural development planning incorporates climate resilience and disaster preparedness',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO SOCIAL EQUITY ===
  {
    from: 'framework_urban_community',
    to: 'framework_disability',
    type: 'IMPLEMENTS',
    description: 'Urban development incorporates universal design and accessibility standards from Disability Justice',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'framework_youth',
    type: 'COLLABORATES_WITH',
    description: 'Rural development addresses youth migration and intergenerational farming transitions',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO CULTURAL & KNOWLEDGE ===
  {
    from: 'framework_urban_community',
    to: 'framework_cultural_heritage',
    type: 'INTEGRATES_WITH',
    description: 'Urban development preserves and integrates cultural heritage sites and practices',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'framework_cultural_heritage',
    type: 'INTEGRATES_WITH',
    description: 'Rural development preserves traditional agricultural practices and rural cultural heritage',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ETHICAL OS ===
  {
    from: 'framework_urban_community',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Urban development implemented through BAZ governance structures where applicable',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Rural development primarily implemented through BAZ bioregional governance',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO JUSTICE OS ===
  {
    from: 'framework_urban_community',
    to: 'framework_migration',
    type: 'COORDINATES_WITH',
    description: 'Urban development must plan for climate migration and refugee integration',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_rural_development',
    to: 'framework_migration',
    type: 'COORDINATES_WITH',
    description: 'Rural development addresses migration pressures and supports climate refugee integration',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONSTITUTIONAL LAYER SUPPORT ===
  {
    from: 'mechanism_gcf',
    to: 'framework_urban_community',
    type: 'FUNDS',
    description: 'Global Commons Fund supports sustainable urban development initiatives',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_gcf',
    to: 'framework_rural_development',
    type: 'FUNDS',
    description: 'Global Commons Fund supports rural development and agricultural transition programs',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  // --- Core Framework Establishment & Dependencies ---
  {
    from: 'framework_regenerative_journeys',
    to: 'council_baz_tourism',
    type: 'ESTABLISHES',
    description: 'The Journeys framework establishes BAZ Tourism Councils as its primary local governance bodies.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_regenerative_journeys',
    to: 'mechanism_regenerative_tourism_levy',
    type: 'ESTABLISHES',
    description: 'The Journeys framework establishes the Tourism Levy as its core economic engine.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_regenerative_journeys',
    to: 'process_tourism_impact_assessment',
    type: 'ESTABLISHES',
    description: 'The Journeys framework establishes mandatory TIAs as its core accountability process.',
    strength: 'Strong',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_indigenous',
    to: 'framework_regenerative_journeys',
    type: 'GUIDES',
    description: 'The Indigenous Framework holds ultimate authority, providing non-negotiable guidance and veto power (FPIC 2.0) over all tourism activities.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_planetary_health',
    to: 'framework_regenerative_journeys',
    type: 'GUIDES',
    description: 'The Planetary Health framework provides the ecological standards and carrying capacity limits that tourism must adhere to.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },

  // --- Commons Integration ---
  {
    from: 'framework_urban_community',
    to: 'framework_hearthstone',
    type: 'INTEGRATES_WITH',
    description: 'The Urban Development framework provides the context and pilots for the "Urban Commons Transition Protocol," while the Hearthstone Protocol provides the legal tools to achieve it.',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // --- Economic & Financial Integration ---
  {
    from: 'framework_regenerative_journeys',
    to: 'framework_aubi',
    type: 'INTEGRATES_WITH',
    description: 'The Journeys framework uses the AUBI system and Love Ledger to implement its Guest Hearts program.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'mechanism_regenerative_tourism_levy',
    to: 'mechanism_gcf',
    type: 'FUNDS',
    description: 'The Tourism Levy is a primary funding stream for the Global Commons Fund.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_regenerative_journeys',
    to: 'framework_migration',
    type: 'FUNDS',
    description: 'A portion of the Tourism Levy is allocated to a Migration Solidarity Economy, supporting climate migrants.',
    strength: 'Medium',
    sequenceType: 'Parallel'
  },

  // --- Governance & Accountability Integration ---
  {
    from: 'council_baz_tourism',
    to: 'council_regenerative_tourism_assembly',
    type: 'COORDINATES_WITH',
    description: 'Local BAZ Tourism Councils coordinate through the global Regenerative Tourism Assembly for mutual aid and resource sharing.',
    strength: 'Medium',
    sequenceType: 'Parallel'
  },
  {
    from: 'process_tourism_impact_assessment',
    to: 'metric_bhi',
    type: 'USES_DATA_FROM',
    description: 'TIAs use the Biosphere Health Index as a core indicator for measuring ecological impact.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'process_tourism_impact_assessment',
    to: 'metric_lmci',
    type: 'USES_DATA_FROM',
    description: 'TIAs use the Love, Meaning, and Connection Index to measure social and cultural well-being.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_regenerative_journeys',
    to: 'framework_drr',
    type: 'INTEGRATES_WITH',
    description: 'The framework co-designs Community-First Resource Allocation and evacuation plans with the DRR Framework.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_regenerative_journeys',
    to: 'framework_disability',
    type: 'VALIDATES',
    description: 'The framework\'s inclusivity protocols are validated against the standards of the Universal Access & Disability Justice Layer.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  }  
];
