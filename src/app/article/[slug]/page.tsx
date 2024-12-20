import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import { InternalLinker } from '@/utils/internal-linking';
import { getContentMetadata, getAllTopics, getTopicData } from '@/utils/content';
import { getThemeColors } from '@/utils/theme';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { TableOfContents } from '@/components/TableOfContents';
import { FAQ } from '@/components/FAQ';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Schema, ThemeColor } from '@/types/schema';
import { Calendar, Clock } from 'lucide-react';

interface ArticleProps {
  params: { slug: string };
}

function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function getArticleData(slug: string): Promise<{ data: Schema; content: string }> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/articles', `${slug}.md`),
    'utf-8'
  );
  const result = matter(markdownWithMeta);
  return {
    data: result.data as Schema,
    content: result.content
  };
}

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { data } = await getArticleData(params.slug);

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'article'
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/articles'));
  return files.map((filename) => ({ slug: filename.replace('.md', '') }));
}

export default async function Article({ params }: ArticleProps) {
  const { data, content } = await getArticleData(params.slug);
  const linker = new InternalLinker(`/article/${params.slug}`);
  const readingTime = getReadingTime(content);
  const colors = getThemeColors(data.theme?.color || 'indigo');

  // Get all topics for the footer
  const topics = getAllTopics();

  // Get parent topic data if it exists
  const parentTopic = data.parent_topic ? getTopicData(data.parent_topic) : undefined;

  const components: Components = {
    p: ({ children }) => {
      return <p className="mb-4 leading-relaxed">{linker.processText(String(children))}</p>;
    },
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    a: ({ href, children }) => (
      <Link href={href || '#'} className={`${colors.text} hover:${colors.textDark}`}>
        {children}
      </Link>
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
                  alt={data.image.alt || data.title}
                  fill
                  className="object-cover"
                  priority
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
      <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Breadcrumb */}
        {parentTopic && (
          <div className="mb-8">
            <Breadcrumb topic={parentTopic} currentTitle={data.title} />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-slate prose-headings:scroll-mt-24 max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* FAQ Section */}
            {data.faq && <FAQ items={data.faq} themeColor={data.theme?.color || 'indigo'} />}
          </div>

          {/* Right Column */}
          <div>
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <TableOfContents 
                  content={content} 
                  activeColor={data.theme?.color || 'indigo'} 
                  hasFaq={!!data.faq && data.faq.length > 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}