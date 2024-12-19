import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown, { Components } from 'react-markdown';
import { Metadata } from 'next';
import { InternalLinker } from '@/utils/internal-linking';
import { getContentMetadata } from '@/utils/content';
import Image from 'next/image';
import Link from 'next/link';

interface SchemaListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  description: string;
}

interface SchemaList {
  type: 'List';
  items: SchemaListItem[];
}

interface ArticleFrontmatter {
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
    topic: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  schema: SchemaList;
}

interface ArticleProps {
  params: { slug: string };
}

async function getArticleData(slug: string): Promise<{ data: ArticleFrontmatter; content: string }> {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'src/content/articles', `${slug}.md`),
    'utf-8'
  );
  const result = matter(markdownWithMeta);
  return {
    data: result.data as ArticleFrontmatter,
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

  // Fetch metadata for parent topic
  const topicMetadata = data.links.topic ? getContentMetadata(data.links.topic) : null;

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
                <span key={keyword} className="badge badge-accent">
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-xl opacity-75">{data.description}</p>
          </header>

          <div className="card-body prose prose-lg max-w-none">
            {/* Schema List */}
            {data.schema.items && data.schema.items.length > 0 && (
              <div className="not-prose mb-8">
                <ul className="menu bg-base-200 rounded-box">
                  {data.schema.items.map((item, index) => (
                    <li key={index}>
                      <div className="flex items-center gap-4">
                        <span className="badge badge-primary">{index + 1}</span>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm opacity-75">{item.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ReactMarkdown components={components}>{content}</ReactMarkdown>
          </div>

          {/* FAQ Section */}
          {data.faq && data.faq.length > 0 && (
            <section className="card-body border-t border-base-300">
              <h2 className="card-title text-2xl mb-6">Frequently Asked Questions</h2>
              <div className="join join-vertical w-full">
                {data.faq.map((item, index) => (
                  <div key={index} className="collapse collapse-arrow join-item border border-base-300">
                    <input type="radio" name="faq-accordion" /> 
                    <div className="collapse-title text-xl font-medium">
                      {item.question}
                    </div>
                    <div className="collapse-content">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Back to Topic Link */}
          {topicMetadata && (
            <div className="card-body border-t border-base-300">
              <Link 
                href={data.links.topic} 
                className="btn btn-primary flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to {topicMetadata.title}
              </Link>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}