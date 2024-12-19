# Frontmatter Schemas

This document serves as the single source of truth for frontmatter schemas across different content types in our niche site generator.

## Common Fields
These fields are required across all content types:

```yaml
title: string           # The page title
description: string     # Meta description for SEO
slug: string           # URL-friendly identifier
keywords: string[]     # SEO keywords
```

## Topic Pages (Hub)
Used for main topic pages that link to related posts and articles.

```yaml
title: "Example Topic"
description: "Comprehensive guide about example topic"
slug: "example-topic"
keywords: ["keyword 1", "keyword 2", "keyword 3"]
links:
  posts: string[]          # Array of related post URLs
  related_articles: string[] # Array of related article URLs
schema:
  type: "Article"          # Always "Article" for topics
  datePublished?: string   # Optional, ISO date
  dateModified?: string    # Optional, ISO date
  author?:                 # Optional author information
    "@type": "Person"
    name: string
image:
  url: "https://images.unsplash.com/[image-id]"  # Unsplash image URL
  alt: "Descriptive alt text"                     # Image alt text
  credit: "Photographer Name"                     # Unsplash photographer credit
```

## Post Pages (Spoke)
Used for detailed content pages that belong to a topic.

```yaml
title: "How to Example"
description: "Step-by-step guide for example"
slug: "how-to-example"
date: "2024-12-19"        # Required for posts
keywords: ["how to", "example", "guide"]
image:
  url: "https://images.unsplash.com/[image-id]"  # Unsplash image URL
  alt: "Descriptive alt text"                     # Image alt text
  credit: "Photographer Name"                     # Unsplash photographer credit
links:
  topic: string           # Parent topic URL
  related_posts: string[] # Array of related post URLs
  related_articles: string[] # Array of related article URLs
faq:
  - question: string
    answer: string
schema:
  type: "HowTo"          # Always "HowTo" for posts
  steps:                 # Required for HowTo schema
    - "@type": "HowToStep"
      text: string
  totalTime?: string     # Optional, ISO duration
  estimatedCost?:        # Optional cost information
    "@type": "MonetaryAmount"
    currency: string
    value: number
```

## Article Pages (Programmatic SEO)
Used for template-driven, programmatically generated content.

```yaml
title: "List of Examples"
description: "Comprehensive list of examples"
slug: "list-of-examples"
keywords: ["list", "examples", "comprehensive"]
image:
  url: "https://images.unsplash.com/[image-id]"  # Unsplash image URL
  alt: "Descriptive alt text"                     # Image alt text
  credit: "Photographer Name"                     # Unsplash photographer credit
links:
  topic: string           # Parent topic URL
faq:
  - question: string
    answer: string
schema:
  type: "ItemList"       # Always "ItemList" for articles
  items:                 # Required list items
    - "@type": "ListItem"
      position: number
      name: string
      description?: string
```

## Image Guidelines

Images are sourced from Unsplash API with the following requirements:
- High quality (minimum 1200px width)
- Relevant to the content
- Properly credited to photographer
- Descriptive alt text for accessibility
- Landscape orientation preferred (16:9 or 3:2 ratio)

## Schema Guidelines

Each content type has specific schema.org structured data:
- Topics use Article schema
- Posts use HowTo schema
- Articles use ItemList schema

Additional schema types (FAQ, BreadcrumbList) are automatically added where appropriate.

## Validation Rules

1. **Required Fields**:
   - All common fields are mandatory
   - Schema type must match the content type
   - Posts must include a date
   - Topics must include at least one post link
   - Articles must include at least one list item

2. **URL Format**:
   - All URLs in `links` should start with "/"
   - URLs should match the pattern: `/{type}/{slug}`
   - Slugs should be kebab-case

3. **Schema Rules**:
   - Topic pages: Use Article schema
   - Post pages: Use HowTo schema with steps
   - Article pages: Use ItemList schema with items

## Examples

Example files can be found in the following directories:
- `/src/content/topics/` - Topic examples
- `/src/content/posts/` - Post examples
- `/src/content/articles/` - Article examples

## Updating This Document

When making changes to frontmatter requirements:

1. Update this document first
2. Update corresponding TypeScript interfaces in page components
3. Update validation logic if any exists
4. Update example content to match new requirements
5. Document the change in CHANGELOG.md
