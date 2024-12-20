import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import { InternalLinker } from '@/utils/internal-linking';
import { getThemeColors } from '@/utils/theme';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { FAQ } from '@/components/FAQ';
import { ContentCard } from '@/components/ContentCard';
import { Schema, ThemeColor } from '@/types/schema';
import { Calendar, Clock, Tag } from 'lucide-react';
import { findRelatedPosts } from '@/utils/posts';
import { getContentMetadata, getTopicData, getAllTopics, getSiteWideCTA } from '@/utils/content';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ContentSidebar } from '@/components/ContentSidebar';
import { Markdown } from '@/lib/markdown';
import { InlineCallToAction } from '@/components/cta';

interface PostProps {
  params: { slug: string };
}

function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function getPostData(slug: string): Promise<{ data: Schema; content: string }> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/posts', `${slug}.md`),
    'utf-8'
  );
  const { data, content } = matter(markdownWithMeta);
  
  // Ensure parent_topic is included in the data
  if (data.parent_topic) {
    console.log('Found parent topic in frontmatter:', data.parent_topic);
  }
  
  return {
    data: {
      ...data,
      parent_topic: data.parent_topic || undefined
    } as Schema,
    content
  };
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const { data } = await getPostData(params.slug);
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.image ? [data.image.url] : []
    }
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/posts'));
  return files.map(filename => ({
    slug: filename.replace('.md', ''),
  }));
}

export default async function Post({ params }: PostProps) {
  const { data, content } = await getPostData(params.slug);
  const linker = new InternalLinker(`/post/${params.slug}`);
  const colors = getThemeColors(data.theme?.color || 'indigo');
  const readingTime = getReadingTime(content);

  // Get schema data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': data.type,
    headline: data.title,
    description: data.description,
    image: data.image?.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: data.author && {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url
    },
    ...(data.type === 'HowTo' && {
      step: data.steps?.map(step => ({
        '@type': 'HowToStep',
        text: step.text
      }))
    }),
    ...(data.type === 'List' && {
      itemListElement: data.items?.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: item
        }
      }))
    })
  };

  // Get related content
  const relatedPosts = await findRelatedPosts(data);
  
  // Get all topics for the footer
  const topics = getAllTopics();

  // Get parent topic data if it exists
  const parentTopic = data.parent_topic ? getTopicData(data.parent_topic) : undefined;

  const linkClasses: Record<ThemeColor, string> = {
    blue: 'text-blue-600 hover:text-blue-800',
    green: 'text-green-600 hover:text-green-800',
    purple: 'text-purple-600 hover:text-purple-800',
    orange: 'text-orange-600 hover:text-orange-800',
    indigo: 'text-indigo-600 hover:text-indigo-800',
    amber: 'text-amber-600 hover:text-amber-800'
  };

  const linkClass = linkClasses[data.theme?.color || 'indigo'];

  // Custom components for ReactMarkdown
  const components: Components = {
    p: ({ children }) => {
      return (
        <p className="mb-4 leading-relaxed">
          {children}
        </p>
      );
    },
    h2: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return (
        <h2 id={id} className="scroll-mt-24 text-2xl font-bold mt-8 mb-4">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return (
        <h3 id={id} className="scroll-mt-24 text-xl font-bold mt-6 mb-3">
          {children}
        </h3>
      );
    },
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    a: ({ href, children }) => {
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className={`${linkClass} underline underline-offset-2`}>
            {children}
          </Link>
        );
      }
      return (
        <a 
          href={href} 
          className="text-slate-600 hover:text-slate-800 underline underline-offset-2" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    img: ({ src, alt }) => (
      <div className="my-8">
        <Image
          src={src || ''}
          alt={alt || ''}
          width={800}
          height={400}
          className="rounded-lg"
        />
      </div>
    ),
  };

  // Extract headings from content for TOC
  const headings = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Match h2 headings (##)
    const h2Match = line.match(/^##\s+([^#].*?)(?:\s*#*\s*)?$/);
    if (h2Match) {
      headings.push({
        id: h2Match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        text: h2Match[1].trim(),
        level: 2
      });
      continue;
    }
    
    // Match h3 headings (###)
    const h3Match = line.match(/^###\s+([^#].*?)(?:\s*#*\s*)?$/);
    if (h3Match) {
      headings.push({
        id: h3Match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        text: h3Match[1].trim(),
        level: 3
      });
    }
  }

  const tocItems = headings;

  // Add FAQ section to TOC if it exists
  if (data.faq && data.faq.length > 0) {
    tocItems.push({
      id: 'frequently-asked-questions',
      text: 'Frequently Asked Questions',
      level: 2,
    });
  }

  // Get site-wide CTA
  const cta = await getSiteWideCTA();

  return (
    <Layout data={data} topics={topics}>
      {/* Hero Section */}
      <div className={`${colors.light} bg-gradient-to-b to-white border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">{data.title}</h1>
                <p className="text-xl text-slate-600">{data.description}</p>
              </div>
              {data.keywords && data.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <span 
                      key={index} 
                      className="bg-black/5 text-slate-500 text-xs px-2.5 py-0.5 rounded-full border border-slate-200/50"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {data.datePublished && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={data.datePublished}>
                      {new Date(data.datePublished).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime}</span>
                </div>
              </div>
            </div>
            {data.image && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={data.image.url}
                  alt={data.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {data.image.credit && (
                  <div className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    Photo by {data.image.credit}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb topic={parentTopic} currentTitle={data.title} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-lg max-w-none prose-slate">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Inline CTA */}
            <InlineCallToAction 
              config={cta}
              className="my-8"
            />

            {/* FAQ Section */}
            {data.faq && data.faq.length > 0 && (
              <FAQ items={data.faq} themeColor={data.theme?.color || 'indigo'} />
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Related Posts</h2>
                <div className="space-y-4">
                  {relatedPosts.map((post, index) => (
                    <Link
                      key={`post-${index}`}
                      href={`/post/${post.slug}`}
                      className="flex gap-4 group"
                    >
                      {post.image && (
                        <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={post.image.url}
                            alt={post.image.alt || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-slate-900 group-hover:text-slate-600">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <ContentSidebar 
            toc={tocItems}
            activeColor={data.theme?.color || 'indigo'}
            hasFaq={!!data.faq && data.faq.length > 0}
            cta={cta}
          />
        </div>
      </div>
    </Layout>
  );
}