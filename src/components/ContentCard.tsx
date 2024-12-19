import Image from 'next/image';
import Link from 'next/link';

interface ContentCardProps {
  title: string;
  description: string;
  href: string;
  type: 'topic' | 'post' | 'article';
  image?: {
    url: string;
    alt: string;
    credit: string;
  };
  date?: string;
}

const typeConfig = {
  topic: {
    color: 'primary',
    icon: '📚'
  },
  post: {
    color: 'secondary',
    icon: '📝'
  },
  article: {
    color: 'accent',
    icon: '📊'
  }
} as const;

export function ContentCard({ 
  title, 
  description, 
  href, 
  type,
  image,
  date 
}: ContentCardProps) {
  const config = typeConfig[type];
  
  return (
    <Link href={href} className="group block">
      <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
        {image && (
          <figure className="relative aspect-[16/9]">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute bottom-2 right-2 text-xs badge badge-ghost">
              Photo by {image.credit}
            </div>
          </figure>
        )}
        <div className="card-body p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge badge-${config.color} gap-1`}>
              {config.icon} {type}
            </span>
            {date && (
              <time className="text-sm opacity-75">
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
          <h3 className="card-title text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm opacity-75 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
