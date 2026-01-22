# Blog Post Hashtag Configuration

This document explains how to configure custom hashtags for social media sharing on individual blog posts.

## How It Works

The ShareButtons component automatically generates hashtags for social media sharing based on the blog post's metadata. The system follows this priority order:

1. **Custom hashtags** (if specified in post frontmatter)
2. **Auto-generated from tags** (if no custom hashtags)
3. **Default fallback hashtags**

## Setting Custom Hashtags

### Method 1: Custom Hashtags Array (Recommended)

Add a `hashtags` array to your blog post's frontmatter:

```yaml
---
title: "Your Blog Post Title"
description: "Your description"
author: "Author Name"
date: "2025-01-15"
tags: ["Tag 1", "Tag 2", "Tag 3"]
hashtags: ["CustomHashtag1", "CustomHashtag2", "PostSpecific", "TopicRelevant"]
---
```

**Best Practices for Custom Hashtags:**
- Use 3-6 hashtags maximum
- Make them specific to your post content
- Avoid spaces and special characters
- Use CamelCase for multi-word hashtags
- Include relevant movement/topic hashtags

### Method 2: Auto-Generated from Tags (Default)

If you don't specify custom hashtags, the system will automatically convert your `tags` into hashtags:

```yaml
---
title: "Your Blog Post Title"
description: "Your description" 
author: "Author Name"
date: "2025-01-15"
tags: ["Climate Action", "Global Governance", "Policy Reform"]
# No hashtags specified - will auto-generate: ClimateAction, GlobalGovernance, PolicyReform
---
```

The system will:
- Remove spaces from tags
- Remove special characters
- Convert to CamelCase
- Add default hashtags

## Default Hashtags

The following hashtags are always included regardless of your custom settings:

- `GlobalGovernance`
- `Polycrisis` 
- `SystemicChange`

These help maintain brand consistency across all shared content.

## Hashtag Examples by Topic

### Climate & Environment
```yaml
hashtags: ["ClimateAction", "EnvironmentalJustice", "PlanetaryBoundaries", "GreenGovernance"]
```

### Technology & AI
```yaml
hashtags: ["AIGovernance", "TechPolicy", "DigitalRights", "FutureOfWork"]
```

### Democracy & Participation
```yaml
hashtags: ["ParticippatoryDemocracy", "CitizenEngagement", "DemocraticInnovation", "CivicTech"]
```

### International Relations
```yaml
hashtags: ["GlobalGovernance", "InternationalLaw", "Multilateralism", "PeaceBbuilding"]
```

### Economics & Justice
```yaml
hashtags: ["EconomicJustice", "WealthInequality", "AlternativeEconomics", "SocialPolicy"]
```

## Technical Implementation

The hashtag generation happens in the blog post page component:

```javascript
function generateShareHashtags(metadata) {
  let hashtags = [];
  
  // Priority 1: Custom hashtags
  if (metadata.hashtags && Array.isArray(metadata.hashtags)) {
    hashtags.push(...metadata.hashtags);
  }
  
  // Priority 2: Auto-generate from tags
  if (metadata.tags && Array.isArray(metadata.tags) && hashtags.length === 0) {
    hashtags.push(...metadata.tags.map(tag => 
      tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')
    ));
  }
  
  // Always include defaults
  const defaultHashtags = ['GlobalGovernance', 'Polycrisis', 'SystemicChange'];
  const allHashtags = [...new Set([...hashtags, ...defaultHashtags])];
  
  // Limit to 6 hashtags for optimal sharing
  return allHashtags.slice(0, 6).join(',');
}
```

## Testing Your Hashtags

After setting up your hashtags, you can test them by:

1. **Preview the post** in development mode
2. **Click the share button** to see how hashtags appear
3. **Check different platforms**:
   - Twitter/X: Shows as #hashtag
   - LinkedIn: Included in post text
   - Facebook: Added to shared content

## Character Limits by Platform

Keep in mind platform-specific limits:

- **Twitter/X**: 280 characters total (including hashtags)
- **LinkedIn**: 3,000 characters (hashtags count toward limit)
- **Facebook**: No strict limit, but shorter is better
- **Bluesky**: 300 characters total

## Migration Guide

If you have existing blog posts without custom hashtags:

1. **Audit existing posts** - review current tags
2. **Add strategic hashtags** based on content themes
3. **Test sharing** on different platforms
4. **Update systematically** - prioritize popular/recent posts

## Troubleshooting

### Common Issues

**Hashtags not appearing:**
- Check frontmatter syntax
- Ensure hashtags is an array
- Verify no special characters

**Too many hashtags:**
- System limits to 6 hashtags total
- Reduce custom hashtags if needed

**Hashtags look wrong:**
- Check for typos in frontmatter
- Ensure proper YAML array format
- Test with simple hashtags first

### Debug Mode

Add this to your blog post for debugging:

```yaml
---
# ... other frontmatter
hashtags: ["Test1", "Test2"] 
debug: true  # This will log hashtag generation to console
---
```
