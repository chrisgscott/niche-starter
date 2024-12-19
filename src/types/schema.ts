export interface ImageData {
  url: string;
  alt: string;
  credit?: string;
}

export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'amber';

export interface Theme {
  color: ThemeColor;
  icon?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  text: string;
}

export interface SchemaAuthor {
  "@type": "Person";
  name: string;
  url?: string;
}

export interface Schema {
  title: string;
  description: string;
  slug: string;
  date: string;
  parent_topic?: string;
  keywords: string[];
  theme?: {
    color: ThemeColor;
    icon?: string;
  };
  image?: ImageData;
  faq?: FAQItem[];
  type: string;
  datePublished: string;
  dateModified?: string;
  steps?: HowToStep[];
  items?: string[];
  author?: SchemaAuthor;
}

export interface Post extends Schema {
  parent_topic: string;  // Required for posts
  date: string;         // Required for posts
}
