import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { Schema, ThemeColor } from '@/types/schema';
import { TopicCard } from '@/components/TopicCard';
import { getPostsByTopic } from '@/utils/posts';
import { HeroCallToAction } from '@/components/cta';
import { getSiteWideCTA } from '@/utils/content';

interface Topic {
  title: string;
  description: string;
  slug: string;
  theme: {
    color: ThemeColor;
    icon: string;
  };
  image?: {
    url: string;
    alt: string;
  };
  tags?: string[];
}

interface HomeContent extends Schema {
  hero: {
    title: string;
    description: string;
    cta: {
      text: string;
      link: string;
    };
  };
}

export default async function Home() {
  // Read homepage content
  const homeContent = fs.readFileSync(
    path.join(process.cwd(), 'src/content/home.md'),
    'utf-8'
  );
  const parsed = matter(homeContent);
  const home = parsed.data as HomeContent;

  // Get all topics and their posts
  const topicsPath = path.join(process.cwd(), 'src/content/topics');
  const topicsWithPosts = await Promise.all(
    fs.readdirSync(topicsPath)
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const content = fs.readFileSync(path.join(topicsPath, file), 'utf-8');
        const { data } = matter(content);
        const slug = data.slug as string;
        const posts = await getPostsByTopic(slug, 3); // Get up to 3 recent posts per topic

        return {
          title: data.title || '',
          description: data.description || '',
          slug,
          theme: data.theme || { color: 'blue', icon: 'briefcase' },
          image: data.image,
          tags: data.tags || [],
          recentPosts: posts.map(post => ({
            title: post.title,
            link: `/post/${post.slug}`
          }))
        };
      })
  );

  // Get site-wide CTA
  const cta = await getSiteWideCTA();

  return (
    <Layout 
      data={home}
      topics={topicsWithPosts.map(topic => ({
        title: topic.title,
        slug: topic.slug
      }))}
    >
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-blue-100/50 to-white border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-slate-900">
              {home.hero.title}
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              {home.hero.description}
            </p>
            <div className="flex gap-4">
              <Link
                href={home.hero.cta.link}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                {home.hero.cta.text}
              </Link>
              <Link
                href="/about"
                className="bg-white text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Global CTA Section */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <HeroCallToAction 
            config={cta}
            className="w-full"
          />
        </div>
      </div>

      {/* Topics Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Photography Business Resource Library
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to our comprehensive resource library for photography business owners.
            Explore our curated content to help you grow your skills, expand your business,
            and succeed in the competitive world of professional photography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topicsWithPosts.map((topic) => (
            <TopicCard
              key={topic.slug}
              slug={topic.slug}
              title={topic.title}
              description={topic.description}
              theme={topic.theme}
              recentPosts={topic.recentPosts}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
