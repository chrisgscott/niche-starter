import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const withMDX = createMDX({
  extension: /\.mdx?$/
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default withMDX(nextConfig);
