import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable Turbopack for faster builds (already using --turbo in dev script)

  // Optimize for 3D rendering
  experimental: {
    optimizePackageImports: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },

  // TODO(2): Add Three.js canvas external when implementing 3D features
  // Will need Turbopack equivalent or switch to webpack for SSR compatibility
};

export default nextConfig;
