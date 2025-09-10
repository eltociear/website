// /src/lib/data/schema/_index.ts

/**
 * GGF Schema - Complete Index with ALL Frameworks
 * Single source of truth aggregating all cluster data
 */

// Import all cluster data
import { constitutionalFoundationEntities, constitutionalFoundationRelationships } from './cluster.constitutional-foundation';
import { institutionalRegenerationEntities, institutionalRegenerationRelationships } from './cluster.institutional-regeneration';
import { pathfinderProtocolEntities, pathfinderProtocolRelationships } from './cluster.pathfinder-protocol';
import { justTransitionEntities, justTransitionRelationships } from './cluster.just-transition';
import { governanceOSEntities, governanceOSRelationships } from './cluster.governance-os';
import { implementationOSEntities, implementationOSRelationships } from './cluster.implementation-os';
import { ethicalOSEntities, ethicalOSRelationships } from './cluster.ethical-os';
import { justiceOSEntities, justiceOSRelationships } from './cluster.justice-os';
import { economicOSEntities, economicOSRelationships } from './cluster.economic-os';
import { technologyOSEntities, technologyOSRelationships } from './cluster.technology-os';
import { ecologicalEntities, ecologicalRelationships } from './cluster.ecological';
import { humanFlourishingEntities, humanFlourishingRelationships } from './cluster.human-flourishing';
import { socialEquityEntities, socialEquityRelationships } from './cluster.social-equity';
import { culturalKnowledgeEntities, culturalKnowledgeRelationships } from './cluster.cultural-knowledge';
import { mobilityCommonsEntities, mobilityCommonsRelationships, developmentEntities, developmentRelationships } from './cluster.development';
import { visionaryMetaEntities, visionaryMetaRelationships } from './cluster.visionary-meta';
import { dataOSEntities, dataOSRelationships } from './cluster.data-os';
import { hearthstoneEntities, hearthstoneRelationships } from './cluster.property-stewardship';
import { conduitProtocolEntities, conduitProtocolRelationships } from './cluster.infrastructure';


// Import types and metadata
import type { GgfEntity, GgfRelationship, GgfCluster, ValidationResult } from './_types';
import { tierMetadata, groupMetadata } from './_types';

const completeApplicationLayerEntities: GgfEntity[] = [

  // === TIER 2: FOUNDATIONAL APPLICATION LAYER ===
  {
    id: 'council_phc',
    type: 'Council',
    name: 'Planetary Health Council',
    shortName: 'PHC',
    description: 'Meta-Governance council overseeing planetary boundaries',
    tier: 1, // Part of core governance OS
    status: 'Proposed',
    primaryDomain: 'Ecological',
    geographicScope: 'Global',
    implementationPriority: 'Critical',
    dependencies: ['framework_meta_gov']
  },
];

// Additional relationships for the complete entities
const completeApplicationLayerRelationships: GgfRelationship[] = [
  // === TIER 1 → TIER 2 ENABLING RELATIONSHIPS ===
  {
    from: 'framework_aubi',
    to: 'framework_work_liberation',
    type: 'ENABLES',
    description: 'AUBI enables Work Liberation implementation',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },
  {
    from: 'council_phc',
    to: 'framework_food',
    type: 'ENABLES',
    description: 'PHC provides governance foundation for food systems',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'mechanism_gcf',
    to: 'framework_global_health',
    type: 'FUNDS',
    description: 'Global Commons Fund finances health system implementation',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_aurora_accord',
    to: 'framework_technology_governance',
    type: 'ENABLES',
    description: 'Data governance enables comprehensive technology governance',
    strength: 'Strong',
    frequency: 'Continuous',
    sequenceType: 'Sequential'
  },

  // === TIER 2 → TIER 3 ENABLING RELATIONSHIPS ===
  {
    from: 'framework_global_health',
    to: 'framework_migration',
    type: 'ENABLES',
    description: 'Stable health systems enable equitable migration governance',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_educational_systems',
    to: 'framework_digital_commons',
    type: 'ENABLES',
    description: 'Educational systems enable knowledge commons preservation',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },

  // === TIER 3 → TIER 4 ENABLING RELATIONSHIPS ===
  {
    from: 'framework_digital_commons',
    to: 'framework_consciousness_development',
    type: 'ENABLES',
    description: 'Knowledge commons enable consciousness development',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Sequential'
  },
  {
    from: 'framework_meta_gov',
    to: 'framework_planetary_immune_system',
    type: 'ENABLES',
    description: 'Meta-Governance enables system-level crisis override capabilities',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Sequential'
  },

  // === CROSS-TIER COORDINATION ===
  {
    from: 'framework_planetary_immune_system',
    to: 'framework_meta_gov',
    type: 'OVERSEES',
    description: 'Planetary Immune System can override entire system during existential crises',
    strength: 'Strong',
    frequency: 'Crisis-Only',
    sequenceType: 'Conditional'
  },
  {
    from: 'council_earth',
    to: 'council_phc',
    type: 'GUIDES',
    description: 'Earth Council provides Indigenous wisdom to planetary health decisions',
    strength: 'Strong',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  },
  {
    from: 'institution_baz',
    to: 'framework_food',
    type: 'IMPLEMENTS',
    description: 'BAZs implement regenerative food systems locally',
    strength: 'Medium',
    frequency: 'Regular',
    sequenceType: 'Parallel'
  }
];

// === AGGREGATE ALL ENTITIES AND RELATIONSHIPS ===
export const allEntities: GgfEntity[] = [
  ...constitutionalFoundationEntities,
  ...institutionalRegenerationEntities,
  ...pathfinderProtocolEntities,
  ...justTransitionEntities,
  ...governanceOSEntities,
  ...implementationOSEntities,
  ...ethicalOSEntities,
  ...justiceOSEntities,
  ...economicOSEntities,
  ...dataOSEntities,
  ...technologyOSEntities, 
  ...ecologicalEntities, 
  ...humanFlourishingEntities, 
  ...socialEquityEntities,
  ...culturalKnowledgeEntities,
  ...mobilityCommonsEntities,
  ...developmentEntities, 
  ...visionaryMetaEntities,
  ...completeApplicationLayerEntities,
  ...hearthstoneEntities,
  ...conduitProtocolEntities
];

export const allRelationships: GgfRelationship[] = [
  ...constitutionalFoundationRelationships,
  ...institutionalRegenerationRelationships,
  ...pathfinderProtocolRelationships,
  ...justTransitionRelationships,
  ...governanceOSRelationships,
  ...implementationOSRelationships,
  ...ethicalOSRelationships,
  ...justiceOSRelationships,
  ...economicOSRelationships,
  ...dataOSRelationships,
  ...technologyOSRelationships,
  ...ecologicalRelationships,
  ...humanFlourishingRelationships,
  ...socialEquityRelationships,
  ...culturalKnowledgeRelationships,
  ...mobilityCommonsRelationships,
  ...developmentRelationships,
  ...visionaryMetaRelationships,
  ...completeApplicationLayerRelationships,
  ...hearthstoneRelationships,
  ...conduitProtocolRelationships
];

// === CLUSTER DEFINITIONS ===
export const clusters: GgfCluster[] = [
  // TIER 0: CONSTITUTIONAL LAYER
  {
    id: 'constitutional_foundation',
    name: 'Constitutional Foundation',
    description: 'The Treaty for Our Only Home - the singular constitutional framework that enables all others',
    tier: 0,
    entities: constitutionalFoundationEntities.map(e => e.id),
    color: '#1e1b4b'
  },

  // TIER 1: CORE OPERATING SYSTEMS
  {
    id: 'implementation_os',
    name: 'Implementation & Adaptation OS',
    description: 'The GGF\'s primary "operating manual," providing the practical \'how-to\' for all other frameworks.',
    tier: 1,
    entities: [
      'framework_implementation_adaptation',
      'institution_ggf_catalyst',
      'platform_community_of_practice',
      'institution_ggf_failure_library'
    ],
    color: '#7c3aed' // Standard Tier 1 Purple
  },
  {
    id: 'just_transition_security_cluster',
    name: 'Just Transition System (Security)',
    description: 'The Aegis Protocol: A framework for transitioning the military-industrial complex into a regenerative global security architecture.',
    tier: 1,
    entities: justTransitionEntities.filter(e => e.tier === 1).map(e => e.id),
    color: '#7c3aed' // Purple for Tier 1
  },
  {
    id: 'institutional_regeneration_cluster',
    name: 'Institutional Regeneration System',
    description: 'Practical framework for transforming existing global governance institutions from bureaucratic inertia to agile, mission-driven service',
    tier: 1,
    entities: institutionalRegenerationEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'governance_os',
    name: 'Governance Operating System',
    description: 'Meta-Governance: The nervous system coordinating all other frameworks',
    tier: 1,
    entities: governanceOSEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'ethical_os',
    name: 'Ethical Operating System',
    description: 'Indigenous Framework: The heart providing ethical compass and philosophical foundation',
    tier: 1,
    entities: ethicalOSEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'justice_os',
    name: 'Justice Operating System',
    description: 'Justice & Peace: Rule of law infrastructure for the entire ecosystem',
    tier: 1,
    entities: justiceOSEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'economic_os',
    name: 'Economic Operating System',
    description: 'Regenerative Economy: Core economic engine with Hearts/Leaves, Love Ledger, and AUBI',
    tier: 1,
    entities: economicOSEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'data_os',
    name: 'Data Operating System',
    description: 'Aurora Accord: Digital-first world data governance rules',
    tier: 1,
    entities: dataOSEntities.map(e => e.id),
    color: '#7c3aed'
  },
  {
    id: 'human_flourishing_cluster',
    name: 'Human Flourishing & Capability Systems',
    description: 'Core systems ensuring healthy, capable, and informed citizenry with epistemic integrity',
    tier: 2,
    entities: humanFlourishingEntities.map(e => e.id),
    color: '#059669'
  },
  {
    id: 'technology_os',
    name: 'Technology Operating System',
    description: 'Core technology governance with ethical AI, biotech, and digital systems oversight',
    tier: 1,
    entities: technologyOSEntities.map(e => e.id),
    color: '#7c3aed'
  },

  // TIER 2: FOUNDATIONAL APPLICATIONS
  {
    id: 'just_transition_industry_cluster',
    name: 'Just Transition System (Industry)',
    description: 'The Sundown Protocol: A framework for retiring harmful industries and rebirthing regenerative futures.',
    tier: 2,
    entities: justTransitionEntities.filter(e => e.tier === 2).map(e => e.id),
    color: '#059669' // Green for Tier 2
  },
  {
    id: 'property_stewardship_cluster',
    name: 'Property & Stewardship Transition',
    description: 'The Hearthstone Protocol: The bridge from extractive ownership to regenerative stewardship.',
    tier: 2,
    entities: hearthstoneEntities.map(e => e.id),
    color: '#059669'
  },
  {
    id: 'infrastructure_cluster',
    name: 'Shared Infrastructure Systems',
    description: 'The Conduit Protocol: The circulatory system for a resilient planetary civilization.',
    tier: 2,
    entities: conduitProtocolEntities.map(e => e.id),
    color: '#059669' // Green for Tier 2
  },
  {
    id: 'regenerative_enterprise_cluster',
    name: 'Regenerative Enterprise System',
    description: 'Voluntary framework for transforming corporate purpose to align with planetary well-being through systemic business model innovation',
    tier: 2,
    entities: regenerativeEnterpriseEntities.map(e => e.id),
    color: '#059669'
  },
  {
    id: 'ecological_life_support_cluster',
    name: 'Ecological Life Support Systems',
    description: 'Core biophysical systems that sustain life on Earth - the heart of planetary stewardship',
    tier: 2,
    entities: ecologicalEntities.map(e => e.id),
    color: '#059669'
  },
  {
    id: 'human_capability_applications',
    name: 'Human Capability Systems',
    description: 'Systems ensuring healthy, capable, and informed citizenry',
    tier: 2,
    entities: completeApplicationLayerEntities.filter(e => 
      e.tier === 2 && 
      ['Governance', 'Economic'].includes(e.primaryDomain!) &&
      // EXCLUDE the frameworks now in Human Flourishing cluster
      !['framework_educational_systems', 'framework_global_health', 'framework_mental_health'].includes(e.id)
    ).map(e => e.id),
    color: '#059669'
  },
  {
    id: 'technology_applications',
    name: 'Technology Governance Applications',
    description: 'Technology and biotech governance systems',
    tier: 2,
    entities: completeApplicationLayerEntities.filter(e => e.tier === 2 && e.primaryDomain === 'Technology').map(e => e.id),
    color: '#059669'
  },
  // TIER 3: EQUITY & CULTURAL SYSTEMS
  {
    id: 'equity_cultural_layer',
    name: 'Remaining Specialized Applications',
    description: 'Migration and other remaining specialized application frameworks',
    tier: 3,
    entities: completeApplicationLayerEntities.filter(e => 
      e.tier === 3 &&
      // EXCLUDE frameworks now in other specialized clusters
      !['framework_disability_rights', 'framework_gender_equality', 'framework_youth_intergenerational', 'framework_aging_population'].includes(e.id) &&
      !['framework_digital_commons', 'framework_cultural_heritage', 'framework_religious_spiritual'].includes(e.id) &&
      !['framework_urban_community', 'framework_rural_development', 'framework_migration'].includes(e.id)
    ).map(e => e.id),
    color: '#dc2626'
  },
  {
    id: 'social_equity_inclusion_cluster',
    name: 'Social Equity & Inclusion Systems',
    description: 'Frameworks ensuring deep equity, inclusion, and intersectional justice for all communities',
    tier: 3,
    entities: socialEquityEntities.map(e => e.id),
    color: '#dc2626'
  },
  {
    id: 'cultural_knowledge_commons_cluster',
    name: 'Cultural & Knowledge Commons Systems',
    description: 'The "soul" of the GGF - heritage preservation, knowledge commons, and wisdom cultivation',
    tier: 3, // Primary tier, though spans 3-4
    entities: culturalKnowledgeEntities.map(e => e.id),
    color: '#dc2626'
  },
  {
    id: 'development_applications_cluster',
    name: 'Development Applications',
    description: 'Sustainable urban and rural development frameworks coordinating human settlements with ecological systems',
    tier: 3,
    entities: [
      ...developmentEntities.map(e => e.id),
      ...mobilityCommonsEntities.map(e => e.id)
    ],
    color: '#dc2626'
  },
  // TIER 4: VISIONARY & META-SYSTEMS
  {
    id: 'visionary_meta_systems_cluster',
    name: 'Visionary & Meta-Systems',
    description: 'Highest-level frameworks for future governance, existential risks, and system-wide implementation',
    tier: 4,
    entities: visionaryMetaEntities.map(e => e.id),
    color: '#0891b2'
  }
];

// === UTILITY FUNCTIONS ===

// Export types and metadata
export { tierMetadata, groupMetadata };
export type { GgfEntity, GgfRelationship, GgfCluster, ValidationResult };

// Enhanced validation functions
export function validateSchema(entities: GgfEntity[], relationships: GgfRelationship[]): ValidationResult {
  const entityIds = new Set(entities.map(e => e.id));
  const errors: string[] = [];
  
  // Check that all relationship endpoints exist
  for (const rel of relationships) {
    if (!entityIds.has(rel.from)) {
      errors.push(`Relationship references unknown entity: ${rel.from}`);
    }
    if (!entityIds.has(rel.to)) {
      errors.push(`Relationship references unknown entity: ${rel.to}`);
    }
  }
  
  // Check tier consistency - lower tiers shouldn't depend on higher tiers
  for (const entity of entities) {
    if (entity.dependencies) {
      for (const depId of entity.dependencies) {
        const dependency = entities.find(e => e.id === depId);
        if (dependency && entity.tier !== undefined && dependency.tier !== undefined) {
          if (dependency.tier > entity.tier) {
            errors.push(`Tier violation: ${entity.name} (Tier ${entity.tier}) depends on ${dependency.name} (Tier ${dependency.tier})`);
          }
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getEntitiesByTier(tier: 0 | 1 | 2 | 3 | 4): GgfEntity[] {
  return allEntities.filter(entity => entity.tier === tier);
}

export function getFrameworksWithUI(): GgfEntity[] {
  return allEntities.filter(entity => entity.type === 'Framework' && entity.ui);
}

export function getImplementationSequence(): GgfEntity[][] {
  const sequence: GgfEntity[][] = [];
  
  // Tier 0: Constitutional prerequisite
  sequence.push(getEntitiesByTier(0));
  
  // Tier 1: Core operating systems (can be implemented in parallel after Tier 0)
  sequence.push(getEntitiesByTier(1));
  
  // Tier 2: Application layer (depends on Tier 1)
  sequence.push(getEntitiesByTier(2));
  
  // Tier 3: Equity and cultural layer (depends on Tier 2)
  sequence.push(getEntitiesByTier(3));
  
  // Tier 4: Visionary governance (depends on lower tiers)
  sequence.push(getEntitiesByTier(4));
  
  return sequence;
}

export function getCriticalPath(): GgfEntity[] {
  return allEntities.filter(entity => 
    entity.implementationPriority === 'Critical' || 
    entity.tier === 0 || 
    (entity.tier === 1 && entity.primaryDomain === 'Governance')
  );
}

// Legacy compatibility exports
export const entities = allEntities;
export const relationships = allRelationships;
