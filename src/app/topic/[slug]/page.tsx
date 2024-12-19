import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown, { Components } from 'react-markdown';
import { Metadata } from 'next';
import { InternalLinker } from '@/utils/internal-linking';
import { getContentMetadata } from '@/utils/content';
import Image from 'next/image';
import Link from 'next/link';
import { ContentCard } from '@/components/ContentCard';

interface SchemaArticle {
  type: 'Article';
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

interface TopicFrontmatter {
  title: string;
  description: string;
  slug: string;
  keywords: string[];
  image?: {
    url: string;
    alt: string;
    credit: string;
  };
  links: {
    posts?: string[];
    related_articles?: string[];
  };
  schema: SchemaArticle;
}

interface TopicProps {
  params: { slug: string };
}

async function getTopicData(slug: string): Promise<{ data: TopicFrontmatter; content: string }> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/topics', `${slug}.md`),
    'utf-8'
  );
  const result = matter(markdownWithMeta);
  return {
    data: result.data as TopicFrontmatter,
    content: result.content
  };
}

export async function generateMetadata({ params }: TopicProps): Promise<Metadata> {
  const { data } = await getTopicData(params.slug);

  return {
    title: data.title,
    description: data.description,
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/topics'));
  return files.map((filename) => ({ slug: filename.replace('.md', '') }));
}

export default async function Topic({ params }: TopicProps) {
  const { data, content } = await getTopicData(params.slug);
  const linker = new InternalLinker(`/topic/${params.slug}`);

  // Fetch metadata for related content
  const relatedPosts = data.links.posts?.map(postPath => ({
    ...getContentMetadata(postPath),
    path: postPath
  })) || [];

  const relatedArticles = data.links.related_articles?.map(articlePath => ({
    ...getContentMetadata(articlePath),
    path: articlePath
  })) || [];

  // Custom components for ReactMarkdown
  const components: Components = {
    p: ({ children }) => {
      return <p className="mb-4 leading-relaxed">{linker.processText(String(children))}</p>;
    },
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    a: ({ href, children }) => (
      <Link href={href || '#'} className="link link-primary">
        {children}
      </Link>
    ),
    code: ({ children }) => (
      <code className="bg-base-200 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="min-h-screen bg-base-200">
      <article className="max-w-4xl mx-auto py-8 px-4">
        <div className="card bg-base-100 shadow-xl">
          <header className="card-body">
            <h1 className="card-title text-4xl mb-4">{data.title}</h1>
            {data.image && (
              <figure className="relative aspect-[16/9] -mx-8">
                <Image
                  src={data.image.url}
                  alt={data.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute bottom-2 right-2 badge badge-ghost">
                  Photo by {data.image.credit}
                </div>
              </figure>
            )}
            <div className="flex flex-wrap gap-4 my-4">
              {data.keywords.map((keyword: string) => (
                <span key={keyword} className="badge badge-primary">
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-xl opacity-75">{data.description}</p>
          </header>

          <div className="card-body prose prose-lg max-w-none">
            <ReactMarkdown components={components}>{content}</ReactMarkdown>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="card-body border-t border-base-300">
              <h2 className="card-title text-2xl mb-6">Related Posts</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((post, index) => (
                  <ContentCard
                    key={index}
                    href={post.path}
                    type="post"
                    title={post.title}
                    description={post.description}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="card-body border-t border-base-300">
              <h2 className="card-title text-2xl mb-6">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedArticles.map((article, index) => (
                  <ContentCard
                    key={index}
                    href={article.path}
                    type="article"
                    title={article.title}
                    description={article.description}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}