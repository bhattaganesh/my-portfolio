'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DistortedIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshDistortMaterial
          color="#4c6ef5"
          distort={0.35}
          speed={2}
          roughness={0.1}
          metalness={0.1}
          opacity={0.85}
          transparent
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial
          color="#748ffc"
          wireframe
          opacity={0.12}
          transparent
        />
      </mesh>
    </Float>
  );
}

export function Hero3dScene() {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4c6ef5" />
        <Suspense fallback={null}>
          <DistortedIcosahedron />
        </Suspense>
      </Canvas>
    </div>
  );
}
