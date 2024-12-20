import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import { Layout } from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { Schema, ThemeColor } from '@/types/schema';
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
      ...data,
      slug: filename.replace('.md', ''),
      readingTime: getReadingTime(content)
    } as Post;
  });

  // Sort posts by date, most recent first
  return posts.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

export default async function Posts() {
  const posts = await getAllPosts();

  // Group posts by theme color for visual variety
  const themeColors: ThemeColor[] = ['indigo', 'blue', 'green', 'purple', 'orange', 'amber'];
  const getThemeColor = (index: number): ThemeColor => themeColors[index % themeColors.length];

  return (
    <Layout data={{
      title: 'All Posts',
      description: 'Explore our comprehensive collection of photography business guides, tips, and strategies.',
      slug: 'posts',
      date: new Date().toISOString(),
      keywords: ['photography', 'business', 'guides'],
      type: 'CollectionPage'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/post/${post.slug}`}
              className={`block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 bg-${getThemeColor(index)}-50 hover:bg-${getThemeColor(index)}-100`}
            >
              {post.image && (
                <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={post.image.url}
                    alt={post.image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.readingTime}</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
