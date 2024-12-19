import { Schema, HowToStep, FAQItem } from '@/types/schema';

interface BaseSchema {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
}

interface MonetaryAmount {
  currency: string;
  amount: number;
}

interface ArticleSchemaData {
  type: 'Article';
}

interface HowToSchemaData {
  type: 'HowTo';
  steps?: HowToStep[];
  totalTime?: string;
  estimatedCost?: MonetaryAmount;
}

interface ListSchemaData {
  type: 'List';
  items?: string[];
}

interface FAQSchemaData {
  type: 'FAQ';
  faq?: FAQItem[];
}

export type SchemaData = ArticleSchemaData | HowToSchemaData | ListSchemaData | FAQSchemaData;

export function generateSchemaMarkup(data: Schema & { 
  totalTime?: string;
  estimatedCost?: MonetaryAmount;
}): Record<string, unknown> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.title,
    description: data.description,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: data.author ? {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url
    } : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://example.com/${data.slug}`
    }
  };

  switch (data.type) {
    case 'HowTo':
      return {
        ...baseSchema,
        step: data.steps?.map(step => ({
          '@type': 'HowToStep',
          text: step.text
        })),
        totalTime: data.totalTime,
        estimatedCost: data.estimatedCost ? {
          '@type': 'MonetaryAmount',
          currency: data.estimatedCost.currency,
          amount: data.estimatedCost.amount
        } : undefined
      };

    case 'List':
      return {
        ...baseSchema,
        itemListElement: data.items?.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Thing',
            name: item
          }
        }))
      };

    case 'FAQ':
      if (!data.faq) return baseSchema;
      return {
        ...baseSchema,
        mainEntity: data.faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      };

    case 'Article':
    default:
      return baseSchema;
  }
}
