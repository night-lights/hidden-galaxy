'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { GalaxyScene } from './GalaxyScene';

export function GalaxyView() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
        }}
      >
        <Suspense fallback={null}>
          <GalaxyScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
