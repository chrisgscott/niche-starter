import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { Layout } from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { Schema } from '@/types/schema';
import { getThemeColors } from '@/utils/theme';

export const metadata: Metadata = {
  title: 'All Posts - Photography Business Guide',
  description: 'Explore our comprehensive collection of photography business guides, tips, and strategies.',
};

interface Post extends Schema {
  slug: string;
  readingTime?: string;
}

function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      ...(data as Schema),
      slug: filename.replace('.md', ''),
      readingTime: getReadingTime(content)
    };
  });

  // Sort posts by date, most recent first
  return posts.sort((a, b) => {
    if (a.schema?.datePublished && b.schema?.datePublished) {
      return new Date(b.schema.datePublished).getTime() - new Date(a.schema.datePublished).getTime();
    }
    return 0;
  });
}

export default async function Posts() {
  const posts = await getAllPosts();

  // Group posts by theme color for visual variety
  const themeColors = ['indigo', 'blue', 'green', 'purple', 'orange', 'amber'];
  const getThemeColor = (index: number) => themeColors[index % themeColors.length];

  return (
    <Layout data={{ 
      title: 'Photography Business Guides',
      description: 'Explore our comprehensive collection of photography business guides, tips, and strategies.',
      theme: { color: 'indigo' }
    }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Photography Business Guides
            </h1>
            <p className="text-xl text-slate-600">
              In-depth guides and practical advice to help you build and grow your photography business.
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const themeColor = getThemeColor(index);
            const colors = getThemeColors(themeColor);
            
            return (
              <Link 
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group relative flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.image && (
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.image.url}
                      alt={post.image.alt || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <span className={`${colors.text} font-medium`}>
                      {post.category || 'Guide'}
                    </span>
                    {post.readingTime && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{post.readingTime}</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
