'use client';

import { OrbitControls } from '@react-three/drei';

export function GalaxyScene() {
  // Generate 15 spheres in circular arrangement
  const spheres = Array.from({ length: 15 }, (_, i) => {
    const angle = (i / 15) * Math.PI * 2;
    const radius = 5;
    return {
      id: i,
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2, // Random Y variation
        Math.sin(angle) * radius,
      ] as [number, number, number],
      color: i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff00ff' : '#ffff00',
    };
  });

  return (
    <>
      {/* Lighting setup from ticket lines 38-42 */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* OrbitControls for mouse interaction */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
        maxPolarAngle={Math.PI / 1.5}
      />

      {/* Test spheres with emissive materials */}
      {spheres.map((sphere) => (
        <mesh key={sphere.id} position={sphere.position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            emissive={sphere.color}
            emissiveIntensity={2.0}
            color="#000000"
          />
        </mesh>
      ))}
    </>
  );
}
