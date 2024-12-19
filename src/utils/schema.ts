import { Schema } from '@/types/schema';

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

interface ArticleSchemaData {
  type: 'Article';
}

interface HowToStep {
  step: string;
}

interface HowToSchemaData {
  type: 'HowTo';
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: number;
  };
}

interface ListSchemaData {
  type: 'List';
  items: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaData {
  type: 'FAQ';
  items: FAQItem[];
}

export type SchemaData = ArticleSchemaData | HowToSchemaData | ListSchemaData | FAQSchemaData;

export function generateSchemaMarkup(data: Schema): Record<string, unknown> {
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
        step: data.steps.map(step => ({
          '@type': 'HowToStep',
          text: step.step
        })),
        totalTime: data.totalTime,
        estimatedCost: data.estimatedCost ? {
          '@type': 'MonetaryAmount',
          currency: data.estimatedCost.currency,
          value: data.estimatedCost.value
        } : undefined
      };

    case 'List':
      return {
        ...baseSchema,
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Thing',
            name: item
          }
        }))
      };

    case 'FAQ':
      return {
        ...baseSchema,
        mainEntity: data.items.map(item => ({
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
