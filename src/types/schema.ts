export interface ImageData {
  url: string;
  alt: string;
  credit: string;
}

export type ThemeColor = 'indigo' | 'blue' | 'green' | 'purple' | 'orange' | 'amber';

export interface Theme {
  color: ThemeColor;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BaseSchema {
  title: string;
  description: string;
  slug: string;
  theme?: Theme;
  keywords: string[];
  faq?: FAQItem[];
  links?: {
    posts?: string[];
    related_articles?: string[];
  };
  image?: ImageData;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
}

export interface ArticleSchemaData {
  type: 'Article';
}

export interface HowToStep {
  step: string;
}

export interface HowToSchemaData {
  type: 'HowTo';
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: number;
  };
}

export interface ListSchemaData {
  type: 'List';
  items: string[];
}

export interface FAQSchemaData {
  type: 'FAQ';
  items: FAQItem[];
}

export type SchemaData = ArticleSchemaData | HowToSchemaData | ListSchemaData | FAQSchemaData;
export type Schema = BaseSchema & SchemaData;
