import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MDXComponents';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <MDXRemote 
      source={content}
      components={mdxComponents}
    />
  );
}
