// /src/lib/data/schema/cluster.social-equity.ts

import type { GgfEntity, GgfRelationship } from './_types';

/**
 * TIER 3: SOCIAL EQUITY & INCLUSION CLUSTER
 * Frameworks ensuring deep equity, inclusion, and intersectional justice
 * Embeds principles of intersectional justice directly into the GGF architecture
 */

export const socialEquityEntities: GgfEntity[] = [
  // === CORE FRAMEWORKS ===
  {
    id: 'framework_disability',
    type: 'Framework',
    name: 'Universal Access & Disability Justice Layer',
    shortName: 'Disability Justice',
    description: 'Framework ensuring full inclusion and rights for persons with disabilities',
    tier: 3,
    status: 'Coming-Soon',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_justice', 'framework_aubi'],
    enables: ['institution_gda', 'tool_dia', 'institution_care_coops'],
    ui: {
      path: '/frameworks/disability-rights-and-inclusion',
      titleKey: 'framework.docs.nav.frameworkTitles.disabilityRightsAndInclusion',
      emoji: '♿',
      slug: 'disability-rights-and-inclusion',
      group: 'humanSocialSystems'
    }
  },
  {
    id: 'framework_gender',
    type: 'Framework',
    name: 'Gender & Kinship Justice Layer',
    shortName: 'Gender & Kinship',
    description: 'Framework ensuring gender equality and LGBTQ+ rights with intersectional approach',
    tier: 3,
    status: 'Ready',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_justice'],
    enables: ['council_gkjc'],
    ui: {
      path: '/frameworks/kinship-protocol',
      titleKey: 'framework.docs.nav.frameworkTitles.kinshipProtocol',
      emoji: '🫂',
      version: '1.0',
      slug: 'kinship-protocol'
    }
  },
  {
    id: 'framework_youth',
    type: 'Framework',
    name: 'Youth & Future Generations Integration Protocol',
    shortName: 'Youth & Future Gens',
    description: 'Framework for youth engagement and intergenerational equity',
    tier: 3,
    status: 'Planned',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_meta_gov'],
    enables: ['institution_gya', 'process_iia', 'institution_gof'],
    ui: {
      path: '/frameworks/youth-and-intergenerational-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.youthAndIntergenerationalGovernance',
      emoji: '👶',
      slug: 'youth-and-intergenerational-governance'
    }
  },
  {
    id: 'framework_elder',
    type: 'Framework',
    name: 'Intergenerational Wisdom & Elder Justice Layer',
    shortName: 'Elder Justice',
    description: 'Framework for supporting aging populations and integrating elder wisdom',
    tier: 3,
    status: 'Review',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_global_health', 'framework_meta_gov'],
    enables: ['council_coe'],
    ui: {
      path: '/frameworks/aging-population-support-governance',
      titleKey: 'framework.docs.nav.frameworkTitles.agingPopulationSupportGovernance',
      emoji: '🌳',
      slug: 'aging-population-support-governance'
    }
  },
  {
    id: 'framework_migration',
    type: 'Framework',
    name: 'Migration & Human Mobility Framework',
    shortName: 'Migration',
    description: 'Equitable migration governance and rights protection for people in motion, including specific Climate Migration and Sanctuary Protocols guided by Indigenous hospitality principles.',
    tier: 3,
    status: 'Review',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_justice', 'framework_global_health'],
    enables: ['council_pmc', 'protocol_gmp', 'protocol_crv', 'process_es_migration'],
    ui: {
      path: '/frameworks/migration-and-human-mobility',
      titleKey: 'framework.docs.nav.frameworkTitles.migrationAndHumanMobility',
      emoji: '🗺️',
      slug: 'migration-and-human-mobility',
      group: 'socialFabricJustice'
    }
  },

  // === GOVERNANCE COUNCILS ===
  {
    id: 'council_gkjc',
    type: 'Council',
    name: 'Gender & Kinship Justice Council',
    shortName: 'GKJC',
    description: 'Specialized Meta-Governance council setting global standards for gender and LGBTQ+ equity',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_gender', 'framework_meta_gov']
  },
  {
    id: 'council_coe',
    type: 'Council',
    name: 'Council of Elders',
    shortName: 'CoE',
    description: 'High-level advisory body within Meta-Governance providing long-term perspective and wisdom',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_elder', 'framework_meta_gov']
  },
  {
    id: 'council_pmc',
    type: 'Council',
    name: 'Planetary Migration Council',
    shortName: 'PMC',
    description: 'Meta-Governance council with 50% migrant representation, responsible for global migration policy',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_migration', 'framework_meta_gov']
  },

  // === SPECIALIZED INSTITUTIONS ===
  {
    id: 'institution_gda',
    type: 'Institution',
    name: 'Global Disability Alliance',
    shortName: 'GDA',
    description: 'Cross-cutting caucus within Meta-Governance holding seats on all major councils to ensure disability justice',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_disability', 'framework_meta_gov']
  },
  {
    id: 'institution_gya',
    type: 'Institution',
    name: 'Global Youth Assembly (Youth Caucus)',
    shortName: 'GYA Youth Caucus',
    description: 'Formal caucus within Meta-Governance for selecting youth delegates to all councils',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_youth', 'framework_meta_gov']
  },
  {
    id: 'institution_care_coops',
    type: 'Institution',
    name: 'Care Cooperatives',
    shortName: 'Care Coops',
    description: 'Disabled-led Community Work Teams focused on collective care, funded via AUBI',
    tier: 3,
    status: 'Pilot',
    primaryDomain: 'Economic',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_disability', 'framework_aubi', 'framework_work_liberation']
  },
  {
    id: 'institution_gof',
    type: 'Institution',
    name: 'Guardians of the Future',
    shortName: 'GoF',
    description: 'BAZ-led ombudsman offices with legal standing to challenge policies on behalf of future generations',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_youth', 'institution_baz']
  },
  {
    id: 'institution_ge_ombudsperson',
    type: 'Institution',
    name: 'Global Equity Ombudsperson',
    shortName: 'GE Ombudsperson',
    description: 'Treaty institution investigating and addressing grievances related to systemic inequity',
    tier: 3,
    status: 'Proposed',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_treaty', 'framework_justice']
  },

  // === PROCESSES, PROTOCOLS & TOOLS ===
  {
    id: 'tool_dia',
    type: 'Tool',
    name: 'Disability Impact Assessments',
    shortName: 'DIAs',
    description: 'Mandatory assessments for all new GGF policies to ensure accessibility and justice',
    tier: 3,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_disability']
  },
  {
    id: 'process_iia',
    type: 'Process',
    name: 'Intergenerational Impact Assessments',
    shortName: 'IIAs',
    description: 'Mandatory assessments evaluating the 50+ year impacts of new policies',
    tier: 3,
    status: 'Draft',
    primaryDomain: 'Governance',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_youth']
  },
  {
    id: 'protocol_gmp',
    type: 'LegalProtocol',
    name: 'Global Mobility Passport',
    shortName: 'GMP',
    description: 'Blockchain-based digital identity for migrants, integrated with the Love Ledger',
    tier: 3,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'Medium',
    dependencies: ['framework_migration', 'platform_love_ledger']
  },
  {
    id: 'protocol_crv',
    type: 'LegalProtocol',
    name: 'Climate Resilience Visas',
    shortName: 'CRV',
    description: 'Legal, temporary relocation rights automatically triggered by IPCC climate thresholds',
    tier: 3,
    status: 'Draft',
    primaryDomain: 'Justice',
    geographicScope: 'Global',
    implementationPriority: 'High',
    dependencies: ['framework_migration', 'process_crisis_command']
  },
  {
    id: 'process_es_migration',
    type: 'Process',
    name: 'Ecological Stewardship Migration',
    shortName: 'ES Migration',
    description: 'Regenerative resettlement programs where migrants contribute to ecosystem restoration in BAZs',
    tier: 3,
    status: 'Pilot',
    primaryDomain: 'Justice',
    geographicScope: 'Regional',
    implementationPriority: 'Medium',
    dependencies: ['framework_migration', 'institution_baz']
  }
];

export const socialEquityRelationships: GgfRelationship[] = [
  // === INTRA-CLUSTER INTERSECTIONAL INTEGRATION ===
  {
    from: 'framework_youth',
    to: 'framework_elder',
    type: 'COLLABORATES_WITH',
    description: 'Youth and Elder frameworks linked through Reciprocal Mentorship and Intergenerational Councils',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_disability',
    to: 'framework_gender',
    type: 'INTEGRATES_WITH',
    description: 'Disability Justice ensures gender-affirming care is accessible to disabled individuals',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_gender',
    to: 'framework_disability',
    type: 'INFORMS',
    description: 'Gender & Kinship layer provides intersectional analysis, centering disabled BIPOC and queer people',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_gda',
    to: 'council_gkjc',
    type: 'COORDINATES_WITH',
    description: 'Global Disability Alliance caucus coordinates with Gender & Kinship Justice Council on intersectional issues',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO META-GOVERNANCE ===
  {
    from: 'council_gkjc',
    to: 'council_mgcc',
    type: 'REPORTS_TO',
    description: 'Gender & Kinship Justice Council operates within Meta-Governance architecture',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_gda',
    to: 'council_mgcc',
    type: 'INFORMS',
    description: 'Global Disability Alliance acts as cross-cutting caucus, holding seats and providing input to all Meta-Governance councils',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_gya',
    to: 'council_mgcc',
    type: 'IMPLEMENTS',
    description: 'GYA Youth Caucus is mechanism for selecting youth delegates to all Meta-Governance councils',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_coe',
    to: 'council_mgcc',
    type: 'INFORMS',
    description: 'Council of Elders provides wisdom and long-term perspective to all Meta-Governance councils',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'council_pmc',
    to: 'council_mgcc',
    type: 'REPORTS_TO',
    description: 'Planetary Migration Council operates within Meta-Governance architecture',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === FRAMEWORK ESTABLISHMENT OF INSTITUTIONS & TOOLS ===
  {
    from: 'framework_disability',
    to: 'institution_gda',
    type: 'ESTABLISHES',
    description: 'Disability Justice framework establishes Global Disability Alliance as cross-cutting caucus',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_disability',
    to: 'tool_dia',
    type: 'ESTABLISHES',
    description: 'Disability Justice framework mandates Disability Impact Assessments for all policies',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_disability',
    to: 'institution_care_coops',
    type: 'ESTABLISHES',
    description: 'Disability Justice framework establishes Care Cooperatives as disabled-led institutions',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_youth',
    to: 'process_iia',
    type: 'ESTABLISHES',
    description: 'Youth framework mandates Intergenerational Impact Assessments for all major policies',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_youth',
    to: 'institution_gof',
    type: 'ESTABLISHES',
    description: 'Youth framework establishes Guardians of the Future as legal advocates for future generations',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_migration',
    to: 'council_pmc',
    type: 'ESTABLISHES',
    description: 'Migration framework establishes Planetary Migration Council as governance body',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_migration',
    to: 'protocol_gmp',
    type: 'ESTABLISHES',
    description: 'Migration framework establishes Global Mobility Passport for migrant identity and rights',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_migration',
    to: 'protocol_crv',
    type: 'ESTABLISHES',
    description: 'Migration framework establishes Climate Resilience Visas for climate displacement',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_migration',
    to: 'process_es_migration',
    type: 'ESTABLISHES',
    description: 'Migration framework establishes Ecological Stewardship Migration programs',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },

  // === CONNECTIONS TO ECONOMIC OS ===
  {
    from: 'framework_aubi',
    to: 'institution_care_coops',
    type: 'FUNDS',
    description: 'AUBI provides economic engine for Care Cooperatives, rewarding care work with Hearts',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_care_coops',
    to: 'framework_work_liberation',
    type: 'IMPLEMENTS',
    description: 'Care Cooperatives are flagship type of Community Work Team in Work Liberation',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO JUSTICE OS ===
  {
    from: 'institution_gof',
    to: 'institution_dj_tribunal',
    type: 'ESCALATES_TO',
    description: 'Guardians of the Future have legal standing to challenge policies in Digital Justice Tribunal',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Conditional'
  },
  {
    from: 'institution_ge_ombudsperson',
    to: 'framework_justice',
    type: 'INTEGRATES_WITH',
    description: 'Global Equity Ombudsperson investigates systemic inequities and reports to Justice System',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === POLICY VALIDATION & OVERSIGHT ===
  {
    from: 'tool_dia',
    to: 'framework_meta_gov',
    type: 'VALIDATES',
    description: 'Disability Impact Assessments required for all GGF policies, ensuring universal design is core Meta-Governance principle',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Parallel'
  },
  {
    from: 'process_iia',
    to: 'framework_meta_gov',
    type: 'VALIDATES',
    description: 'Intergenerational Impact Assessments required for all major GGF policies',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO ETHICAL OS ===
  {
    from: 'framework_disability',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Disability Justice principles implemented through BAZ-led local governance',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_youth',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Youth engagement and future generations advocacy implemented through BAZ governance',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO INDIGENOUS FRAMEWORK ===
  {
    from: 'framework_indigenous',
    to: 'framework_migration',
    type: 'GUIDES',
    description: 'Provides guiding principles of traditional hospitality, sanctuary, and "right relationship" for the development of climate migration protocols.',
    strength: 'Strong',
    sequenceType: 'Parallel'
  },

  // === CONNECTIONS TO CONSTITUTIONAL LAYER ===
  {
    from: 'framework_treaty',
    to: 'institution_ge_ombudsperson',
    type: 'ESTABLISHES',
    description: 'Treaty establishes Global Equity Ombudsperson as institutional safeguard for equity',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  // === MIGRATION-SPECIFIC INTEGRATIONS ===
  {
    from: 'protocol_gmp',
    to: 'platform_love_ledger',
    type: 'INTEGRATES_WITH',
    description: 'Global Mobility Passport records migrant contributions (care work, teaching) into Love Ledger to earn Hearts',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'protocol_crv',
    to: 'process_crisis_command',
    type: 'IMPLEMENTS',
    description: 'Climate Resilience Visas are application of Meta-Governance Crisis Command Protocol, triggered by climate emergencies',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Conditional'
  },
  {
    from: 'process_es_migration',
    to: 'institution_baz',
    type: 'IMPLEMENTS',
    description: 'Ecological Stewardship Migration programs implemented within and governed by BAZs',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'process_es_migration',
    to: 'mechanism_leaves',
    type: 'REWARDS',
    description: 'Migrants participating in ecosystem restoration are rewarded with Leaves',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'framework_migration',
    to: 'framework_justice',
    type: 'ESCALATES_TO',
    description: 'Migration framework establishes Migration Justice Tribunals as specialized chambers within Digital Justice Tribunal',
    strength: 'Medium',
    frequency: 'As-Needed',
    sequenceType: 'Conditional'
  },
  {
    from: 'framework_migration',
    to: 'framework_drr',
    type: 'COLLABORATES_WITH',
    description: 'Coordinates with DRR&R on managing and supporting climate-displaced populations',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  }
];
