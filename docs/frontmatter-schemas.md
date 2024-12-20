# Frontmatter Schemas

This document serves as the single source of truth for frontmatter schemas across different content types in our niche site generator.

## Common Fields
These fields are required across all content types:

```yaml
title: string           # The page title
description: string     # Meta description for SEO
slug: string           # URL-friendly identifier
keywords: string[]     # SEO keywords
image?:                # Optional but recommended for all content types
  url: string         # Full URL to image (preferably Unsplash)
  alt: string         # Descriptive alt text
  credit: string      # Photographer or image credit
topic?: string        # Topic slug (required for posts and articles)
theme?:               # Visual styling configuration
  color: string       # Base color (blue, green, purple, orange, indigo)
```

## Homepage
Used for the main landing page content and layout.

```yaml
title: "Your Niche Site"
description: "Your niche site description"
slug: "home"
keywords: ["keyword1", "keyword2"]
hero:
  title: "Welcome to Your Site"       # Hero section title
  description: "Your value proposition" # Hero description
  primaryCta:
    text: "Browse Topics"            # Primary button text
    link: "/topic"                   # Primary button link
  secondaryCta:
    text: "Latest Content"           # Secondary button text
    link: "/post"                    # Secondary button link
sections:
  topics:
    title: "Featured Topics"         # Topics section title
    description: "Explore topics"    # Topics section description
    viewAllText: "View All Topics →" # View all link text
  posts:
    title: "Latest Posts"           # Posts section title
    description: "New content"      # Posts section description
    viewAllText: "View All Posts →" # View all link text
  articles:
    title: "Popular Articles"       # Articles section title
    description: "In-depth guides"  # Articles section description
    viewAllText: "View All Articles →" # View all link text
schema:
  type: "WebSite"                  # Always "WebSite" for homepage
  dateModified: string            # ISO date of last modification
```

## Topic Pages (Hub)
Used for main topic pages that link to related posts and articles. These are the top-level "Library Hub" pages that organize content into major categories.

```yaml
title: string           # Topic title
description: string     # Topic description
slug: string           # URL-friendly identifier
theme:                 # Visual styling configuration
  color: string        # Base color (blue, green, purple, orange)
  icon: string         # Lucide icon name (briefcase, megaphone, camera, aperture)
image:
  url: string         # Unsplash image URL
  alt: string         # Descriptive alt text
  credit?: string     # Optional image credit
keywords: string[]    # SEO keywords
schema:
  type: "Article"     # Always Article for topic pages
  datePublished?: string
  dateModified?: string
  author?:
    "@type": "Person"
    name: string
```

## Post Pages
Used for content pages that belong to a topic.

```yaml
title: string          # Post title
description: string    # Post description
slug: string          # URL-friendly identifier
date: string          # Publication date (YYYY-MM-DD)
parent_topic: string  # Topic slug this post belongs to (e.g., "photography-business-basics")
keywords: string[]    # SEO keywords and for finding related content
image:
  url: string         # Unsplash image URL
  alt: string         # Descriptive alt text
  credit: string      # Photographer credit
faq?:                 # Optional FAQ section for SEO
  - question: string
    answer: string
schema:               # SEO schema configuration
  type: "HowTo"      # or "Article", "List", etc.
  datePublished: string
  dateModified: string
  steps?:            # Required for HowTo schema
    - text: string
  author?:
    "@type": "Person"
    name: string
```

## Article Pages (Individual Content)
Used for specific, detailed content pieces. These are the leaf nodes of your content tree.

```yaml
title: string          # Article title
description: string    # Article description
slug: string          # URL-friendly identifier
parent_topic?: string # Optional topic slug this article belongs to
keywords: string[]    # SEO keywords
parent_post: string         # Sub-topic URL (e.g., "/post/workplace-wellness")
breadcrumb:                 # Navigation path
  - title: "HR Library"
    url: "/topic/hr-library"
  - title: "Workplace Wellness"
    url: "/post/workplace-wellness"
  - title: "Best Office Snacks"
    url: "/article/best-office-snacks"
links:
  topic: string            # Parent topic URL
  post: string            # Parent post (sub-topic) URL
topic: string             # Topic slug (required)
schema:
  type: "ItemList"
  items:
    - "@type": "ListItem"
      position: number
      name: string
      description: string
```

## Article Pages (Programmatic SEO)
Used for programmatically generated content pages that follow a template structure.

```yaml
title: string          # Article title
description: string    # Article description
slug: string          # URL-friendly identifier
parent_topic?: string # Optional topic slug this article belongs to
keywords: string[]    # SEO keywords
template:             # Template information for pSEO
  pattern: string     # The template pattern used (e.g., "Best {contentType} for {photographyType} Photographers")
  variables:          # Variables used to generate this article
    contentType: string    # E.g., "Books", "Software", "Online Courses"
    photographyType: string # E.g., "Portrait", "Wedding", "Newborn"
image:
  url: string         # Unsplash image URL
  alt: string         # Descriptive alt text
  credit: string      # Photographer credit
theme:
  color: string       # Base color (blue, green, purple, orange, indigo)
faq?:                 # Optional FAQ section for SEO
  - question: string
    answer: string
schema:               # SEO schema configuration
  type: "List"       # Usually "List" for pSEO articles
  items:             # List items for schema
    - name: string
      description: string
```

### Common Template Patterns
Our articles typically follow these patterns:
1. `"Best {contentType} for {photographyType} Photographers"`
   - Used for resource recommendations
   - Examples: "Best Books for Newborn Photographers", "Best Software for Wedding Photographers"

2. `"Essential {contentType} for {photographyType} Photography"`
   - Used for gear and equipment guides
   - Example: "Essential Equipment for Portrait Photography"

3. `"Top {contentType} for {photographyType} Photographers"`
   - Used for curated lists
   - Example: "Top Podcasts for Wedding Photographers"

## Schema.org Implementation

The frontmatter schema is automatically converted to schema.org JSON-LD format. The following schema types are supported:

1. **WebSite Schema** (Homepage)
   - Site metadata and description
   - Last modification date
   - Primary navigation structure

2. **Article Schema** (Topics)
   - Includes article metadata
   - Author information
   - Publication dates

3. **HowTo Schema** (Posts)
   - Step-by-step instructions
   - Time and cost estimates
   - Material requirements (if specified)

4. **ItemList Schema** (Articles)
   - List items with positions
   - Item descriptions
   - Related content links

5. **FAQ Schema** (Automatic)
   - Generated for any content with FAQ section
   - Question and answer pairs
   - Can be combined with other schemas

## Image Guidelines

Images are sourced from Unsplash API with the following requirements:
- High quality (minimum 1200px width)
- Relevant to the content
- Properly credited to photographer
- Descriptive alt text for accessibility
- Landscape orientation preferred (16:9 or 3:2 ratio)
- URL format: `https://images.unsplash.com/[image-id]?auto=format&fit=crop&q=80`

## Validation Rules

1. **Required Fields**:
   - All common fields are mandatory
   - Schema type must match the content type
   - Posts must include a date and steps
   - Topics must include at least one post link
   - Articles must include at least one list item

2. **URL Format**:
   - All URLs in `links` should start with "/"
   - URLs should match the pattern: `/{type}/{slug}`
   - Slugs should be kebab-case
   - Image URLs should be valid Unsplash URLs

3. **Schema Rules**:
   - Topic pages: Use Article schema
   - Post pages: Use HowTo schema with steps
   - Article pages: Use ItemList schema with items
   - FAQ schema is automatically added when FAQ section exists

## Examples

Example files can be found in the following directories:
- `/src/content/topics/` - Topic examples
- `/src/content/posts/` - Post examples
- `/src/content/articles/` - Article examples

## Updating This Document

When making changes to frontmatter requirements:

1. Update this document first
2. Update corresponding TypeScript interfaces in:
   - `/src/types/schema.ts`
   - `/src/utils/schema.ts`
3. Update schema generation in `/src/utils/schema.ts`
4. Update components that use the schema:
   - `/src/components/SchemaComponent.tsx`
   - `/src/components/Layout.tsx`
5. Update example content to match new requirements
6. Document the change in CHANGELOG.md

## CrewAI Integration

When generating content via CrewAI:
1. Follow the exact schema structure for each content type
2. Ensure all required fields are populated
3. Validate URLs and image sources
4. Generate appropriate schema-specific data (steps, list items, etc.)
5. Include FAQ sections where appropriate
