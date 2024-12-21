import Image from 'next/image';
import Link from 'next/link';

interface ContentCardProps {
  title: string;
  description: string;
  image?: {
    url: string;
    alt?: string;
  };
  type: 'post' | 'topic' | 'article';
  slug: string;
}

export function ContentCard({ 
  title, 
  description, 
  image,
  type,
  slug
}: ContentCardProps) {
  const href = `/${type}/${slug}`;
  return (
    <Link href={href} className="group block">
      <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] transition-shadow">
        {image?.url && (
          <figure className="relative aspect-[16/9] rounded-t-lg overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </figure>
        )}
        <div className="p-4">
          <h3 className="font-medium text-slate-900 group-hover:text-slate-600">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
