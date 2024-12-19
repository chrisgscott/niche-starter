import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Metadata } from 'next';
import { InternalLinker } from '@/utils/internal-linking';
import { getThemeColors } from '@/utils/theme';
import { getContentMetadata, findRelatedContent } from '@/utils/content';
import { getPostsByTopic } from '@/utils/posts';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { TableOfContents } from '@/components/TableOfContents';
import { FAQ } from '@/components/FAQ';
import { ContentCard } from '@/components/ContentCard';
import { PostGrid } from '@/components/PostGrid';
import { Schema, FAQItem, ThemeColor } from '@/types/schema';
import { Briefcase, Megaphone, Camera, Aperture } from 'lucide-react';
import React from 'react';

const icons = {
  briefcase: Briefcase,
  megaphone: Megaphone,
  camera: Camera,
  aperture: Aperture
} as const;

interface TopicProps {
  params: { slug: string };
}

async function getTopicData(slug: string): Promise<{ data: Schema; content: string }> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/topics', `${slug}.md`),
    'utf-8'
  );
  const result = matter(markdownWithMeta);
  return {
    data: result.data as Schema,
    content: result.content
  };
}

export async function generateMetadata({ params }: TopicProps): Promise<Metadata> {
  const { data } = await getTopicData(params.slug);
  
  // Get keywords from topic and related content
  const { posts, articles } = findRelatedContent(`/topic/${params.slug}`);
  const relatedContent = [...posts, ...articles];
  
  const allKeywords = new Set([
    ...(data.keywords || []),
    ...relatedContent.map(item => item.keywords || []).flat()
  ]);

  return {
    title: data.title,
    description: data.description,
    keywords: Array.from(allKeywords),
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.image?.url ? [data.image.url] : []
    }
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/topics'));
  return files.map(filename => ({
    slug: filename.replace('.md', ''),
  }));
}

export default async function Topic({ params }: TopicProps) {
  const { data, content } = await getTopicData(params.slug);
  const linker = new InternalLinker(`/topic/${params.slug}`);
  const colors = getThemeColors(data.theme?.color);

  const proseThemeClasses: Record<ThemeColor, string> = {
    blue: 'prose-blue',
    green: 'prose-green',
    purple: 'prose-purple',
    orange: 'prose-orange',
    indigo: 'prose-indigo',
    amber: 'prose-amber'
  };

  const themeClass = proseThemeClasses[data.theme?.color || 'indigo'];

  const linkClasses: Record<ThemeColor, string> = {
    blue: 'text-blue-600 hover:text-blue-800',
    green: 'text-green-600 hover:text-green-800',
    purple: 'text-purple-600 hover:text-purple-800',
    orange: 'text-orange-600 hover:text-orange-800',
    indigo: 'text-indigo-600 hover:text-indigo-800',
    amber: 'text-amber-600 hover:text-amber-800'
  };

  const themeColor = data.theme?.color || 'indigo';
  const linkClass = linkClasses[themeColor];

  const processContent = (content: string) => {
    // First, let the InternalLinker process any keyword-based links
    const linkedContent = linker.addLinks(content);

    // Then process any remaining markdown links that point to internal paths
    return linkedContent.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        if (url.startsWith('/')) {
          return `<a href="${url}" class="${linkClass} underline underline-offset-2">${text}</a>`;
        }
        return match;
      }
    );
  };

  // Custom components for ReactMarkdown
  const components: Components = {
    p: ({ children }) => {
      return (
        <p className="mb-4 leading-relaxed">
          {children}
        </p>
      );
    },
    a: ({ href, children }) => {
      // Apply theme color only to internal links
      if (href?.startsWith('/')) {
        return (
          <Link href={href} className={`${linkClass} underline underline-offset-2`}>
            {children}
          </Link>
        );
      }
      // Default styling for external links
      return (
        <a href={href} className="text-slate-600 hover:text-slate-800 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    h1: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return (
        <h1 id={id} className="scroll-mt-24">
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = children
        ?.toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return (
        <h2 id={id} className="scroll-mt-24">
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
        <h3 id={id} className="scroll-mt-24">
          {children}
        </h3>
      );
    },
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    code: ({ children }) => (
      <code className={`bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono`}>
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

  // Get all posts for this topic
  const posts = await getPostsByTopic(params.slug);

  // Get related content
  const { articles } = findRelatedContent(`/topic/${params.slug}`);

  // We only need posts in the grid now
  return (
    <Layout data={data}>
      {/* Hero Section */}
      <div className={`${colors.light} bg-gradient-to-b to-white border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-4">
                <div className="flex gap-2 items-center text-sm">
                  <Link href="/" className={`text-${colors.text} hover:text-${colors.textDark}`}>
                    Home
                  </Link>
                  <span className="text-slate-400">/</span>
                  <span className={`text-${colors.text}`}>{data.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  {data.theme?.icon && (
                    <div className={`${colors.dark} p-2.5 rounded-lg`}>
                      {(() => {
                        const Icon = icons[data.theme.icon as keyof typeof icons];
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                  )}
                  <h1 className="text-4xl font-bold text-slate-900">{data.title}</h1>
                </div>
                <p className="text-xl text-slate-600">{data.description}</p>
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Main Content */}
            <div className={`prose prose-slate prose-headings:scroll-mt-24 max-w-none`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <TableOfContents 
                  content={content} 
                  activeColor={data.theme?.color || 'indigo'} 
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* All Topic Posts Section */}
      {posts.length > 0 && (
        <div className="mt-16 border-t pt-16 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">All {data.title} Posts</h2>
            <PostGrid posts={posts} postsPerPage={12} />
          </div>
        </div>
      )}
    </Layout>
  );
}