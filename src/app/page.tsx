import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentCard } from '@/components/ContentCard';
import Link from 'next/link';

interface ContentItem {
  title: string;
  description: string;
  slug: string;
  type: 'topic' | 'post' | 'article';
  image?: {
    url: string;
    alt: string;
    credit: string;
  };
  date?: string;
}

export default async function Home() {
  // Function to read content files
  const getContentFiles = (directory: string, type: 'topic' | 'post' | 'article'): ContentItem[] => {
    const contentDir = path.join(process.cwd(), 'src/content', `${type}s`);
    const files = fs.readdirSync(contentDir);
    
    return files.map(filename => {
      const fileContent = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
      const { data } = matter(fileContent);
      return {
        title: data.title,
        description: data.description,
        slug: filename.replace('.md', ''),
        type,
        image: data.image,
        date: data.date
      };
    });
  };

  // Get all content
  const topics = getContentFiles('topics', 'topic');
  const posts = getContentFiles('posts', 'post');
  const articles = getContentFiles('articles', 'article');

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Niche Site Content</h1>
      
      {/* Topics Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <span className="text-blue-600 mr-2">📚</span> Topics
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((item) => (
            <ContentCard
              key={item.slug}
              href={`/topic/${item.slug}`}
              title={item.title}
              description={item.description}
              type={item.type}
              image={item.image}
            />
          ))}
        </div>
      </section>

      {/* Posts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <span className="text-green-600 mr-2">📝</span> Posts
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((item) => (
            <ContentCard
              key={item.slug}
              href={`/post/${item.slug}`}
              title={item.title}
              description={item.description}
              type={item.type}
              image={item.image}
              date={item.date}
            />
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <span className="text-purple-600 mr-2">📊</span> Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <ContentCard
              key={item.slug}
              href={`/article/${item.slug}`}
              title={item.title}
              description={item.description}
              type={item.type}
              image={item.image}
            />
          ))}
        </div>
      </section>

      {/* Development Links */}
      <section className="mt-16 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-gray-600 mr-2">🛠</span> Development Links
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/topic/home-office-setup" className="text-blue-600 hover:underline">
              Example Topic: Home Office Setup
            </Link>
          </li>
          <li>
            <Link href="/post/choose-perfect-desk" className="text-blue-600 hover:underline">
              Example Post: Choosing a Desk
            </Link>
          </li>
          <li>
            <Link href="/post/ergonomic-chair-selection" className="text-blue-600 hover:underline">
              Example Post: Ergonomic Chair Selection
            </Link>
          </li>
          <li>
            <Link href="/article/best-home-office-chairs" className="text-blue-600 hover:underline">
              Example Article: Best Office Chairs
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
