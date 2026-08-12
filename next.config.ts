import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Firestore reads during static export can exceed the default 60s on slow networks
  staticPageGenerationTimeout: 180,
};

export default nextConfig;
