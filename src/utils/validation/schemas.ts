import { z } from 'zod';

// Common schemas
export const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  credit: z.string()
});

export const themeSchema = z.object({
  color: z.enum(['blue', 'green', 'purple', 'orange', 'indigo', 'amber']),
  icon: z.string().optional()
});

export const schemaAuthorSchema = z.object({
  '@type': z.literal('Person'),
  name: z.string()
});

export const faqSchema = z.array(z.object({
  question: z.string(),
  answer: z.string()
}));

// Base schema for all content types
export const baseSchema = z.object({
  contentType: z.enum(['article', 'post', 'topic', 'config', 'page']).optional(),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  keywords: z.array(z.string()),
  image: imageSchema,
  theme: themeSchema.optional(),
  schema: z.object({
    type: z.enum(['Article', 'HowTo', 'ItemList', 'WebSite']),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
    author: schemaAuthorSchema.optional()
  })
});

// Topic schema
export const topicSchema = baseSchema.extend({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  keywords: z.array(z.string()),
  theme: themeSchema,
  schema: z.object({
    type: z.literal('Article'),
    datePublished: z.string(),
    dateModified: z.string(),
    author: schemaAuthorSchema
  })
});

// Post schema
export const postSchema = baseSchema.extend({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  date: z.string(),
  parent_topic: z.string(),
  keywords: z.array(z.string()),
  faq: faqSchema,
  schema: z.object({
    type: z.enum(['HowTo', 'Article']),
    steps: z.array(z.object({
      text: z.string()
    })).optional()
  })
});

// Article specific schemas
const templateSchema = z.object({
  pattern: z.string(),
  variables: z.record(z.string())
});

const schemaItemSchema = z.object({
  name: z.string(),
  description: z.string()
});

// Article schema
export const articleSchema = baseSchema.extend({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  keywords: z.array(z.string()),
  template: templateSchema,
  faq: faqSchema.optional(),
  schema: z.object({
    type: z.literal('List'),
    items: z.array(schemaItemSchema)
  })
});

// Home page specific schemas
const heroSchema = z.object({
  title: z.string(),
  description: z.string(),
  cta: z.object({
    text: z.string(),
    link: z.string()
  })
});

// Home page schema
export const homeSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.literal('home'),
  keywords: z.array(z.string()),
  hero: heroSchema,
  schema: z.object({
    type: z.literal('WebSite'),
    dateModified: z.string()
  })
});

// CTA specific schemas
const emailConfigSchema = z.object({
  listId: z.number()
});

const ctaIconEnum = z.enum(['download', 'mail', 'external', 'gift', 'arrow', 'book']);

// CTA config schema
export const ctaConfigSchema = z.object({
  type: z.enum(['email', 'link']),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  icon: ctaIconEnum,
  trackingId: z.string(),
  email: emailConfigSchema.optional(),
  href: z.string().url().optional()
});

const linkConfigSchema = z.object({
  href: z.string().url()
});

// Site specific schemas
const navigationSchema = z.array(z.object({
  label: z.string(),
  link: z.string()
}));

const footerSchema = z.object({
  company: z.object({
    name: z.string(),
    description: z.string()
  }),
  social: z.object({
    twitter: z.string().url(),
    facebook: z.string().url(),
    instagram: z.string().url()
  }),
  resources: z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      link: z.string()
    }))
  }),
  legal: z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      link: z.string()
    }))
  })
});

// Site config schema
export const siteConfigSchema = z.object({
  title: z.string(),
  description: z.string(),
  navigation: navigationSchema,
  footer: footerSchema,
  copyright: z.string()
});

// Config schema (for other config types)
export const configSchema = z.object({
  contentType: z.literal('config'),
  type: z.enum(['email', 'link']).describe('Options: "email" | "link"'),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
  icon: z.enum(['download', 'mail', 'external', 'gift', 'arrow', 'book'])
    .describe('Options: "download" | "mail" | "external" | "gift" | "arrow" | "book"'),
  trackingId: z.string(),
  email: emailConfigSchema.optional(),
  href: z.string().url().optional(),
  navigation: navigationSchema.optional(),
  footer: footerSchema.optional(),
  copyright: z.string().optional()
});

// Page schema
export const pageSchema = z.object({
  contentType: z.literal('page'),
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  keywords: z.array(z.string()),
  hero: z.object({
    title: z.string(),
    description: z.string(),
    cta: z.object({
      text: z.string(),
      link: z.string()
    })
  }).optional(),
  schema: z.object({
    type: z.literal('WebSite'),
    dateModified: z.string()
  })
});
