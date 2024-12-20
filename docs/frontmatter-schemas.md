# Frontmatter Schemas

This document serves as the single source of truth for frontmatter schemas across different content types in our niche site generator.

## Common Fields
These fields are common across content types:

```yaml
title: string           # The page title
description: string     # Meta description for SEO
slug: string           # URL-friendly identifier
keywords: string[]     # SEO keywords
image?:                # Optional image configuration
  url: string         # Full URL to image (preferably Unsplash)
  alt: string         # Descriptive alt text
  credit: string      # Photographer or image credit
theme?:               # Optional visual styling configuration
  color: string      # Base color (indigo, purple, etc.)
  icon?: string      # Icon name (briefcase, etc.)
```

## Homepage
Used for the main landing page.

```yaml
title: string          # Site title
description: string    # Site description
slug: "home"          # Must be "home"
keywords: string[]    # SEO keywords
hero:
  title: string       # Hero section title
  description: string # Hero description
  cta:
    text: string     # CTA button text
    link: string     # CTA button link
schema:
  type: "WebSite"    # Must be "WebSite"
  dateModified: string # Last modification date
```

## Topic Pages (Hub)
Used for main topic pages that link to related posts and articles.

```yaml
title: string          # Topic title
description: string    # Topic description
slug: string          # URL-friendly identifier
keywords: string[]    # SEO keywords
theme:
  color: string       # Base color (indigo, purple, etc.)
  icon: string        # Icon name (briefcase, etc.)
image:
  url: string         # Image URL
  alt: string         # Alt text
  credit: string      # Credit
schema:
  type: "Article"     # Must be "Article"
  datePublished: string
  dateModified: string
  author:
    "@type": "Person"
    name: string
```

## Post Pages (Spoke)
Used for content pages that belong to a topic.

```yaml
title: string          # Post title
description: string    # Post description
slug: string          # URL-friendly identifier
date: string          # Publication date (YYYY-MM-DD)
parent_topic: string  # Parent topic slug
keywords: string[]    # SEO keywords
image:
  url: string         # Image URL
  alt: string         # Alt text
  credit: string      # Credit
faq:                  # FAQ section
  - question: string
    answer: string
schema:
  type: "HowTo" | "Article"
  datePublished: string
  dateModified: string
  steps:              # Required for HowTo type
    - text: string    # Step description
  author:
    "@type": "Person"
    name: string
```

## Article Pages (Programmatic SEO)
Used for AI-generated content pages targeting specific keywords.

```yaml
title: string          # Article title
description: string    # Article description
slug: string          # URL-friendly identifier
keywords: string[]    # SEO keywords
template:             # Template configuration
  pattern: string     # Template pattern
  variables:          # Template variables
    contentType: string
    photographyType: string
image:
  url: string         # Image URL
  alt: string         # Alt text
  credit: string      # Credit
theme:
  color: string       # Base color
faq:                  # FAQ section
  - question: string
    answer: string
schema:
  type: "List"        # Must be "List"
  items:             # List items
    - name: string
      description: string
```

## Site Configuration
Used for global site configuration.

```yaml
title: string          # Site title
description: string    # Site description
navigation:            # Navigation links
  - label: string
    link: string
footer:
  company:
    name: string
    description: string
  social:
    twitter: string   # Twitter URL
    facebook: string  # Facebook URL
    instagram: string # Instagram URL
  resources:
    title: string
    links:
      - label: string
        link: string
  legal:
    title: string
    links:
      - label: string
        link: string
copyright: string      # Copyright notice
```

## CTA Configuration
Used for global CTA configuration.

```yaml
type: "email" | "link" # CTA type
title: string          # CTA title
description: string    # CTA description
buttonText: string     # Button text
icon: "download" | "mail" | "external" | "gift" | "none" # Icon type
trackingId: string     # Analytics tracking ID
email?:                # Required for email type
  listId: number      # Email list ID
href?: string         # Required for link type (URL)
