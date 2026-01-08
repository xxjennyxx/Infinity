import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FlippingBook } from './FlippingBook';

interface ExperienceProps {
  onItemClick?: (itemId: string) => void;
}

function Lights() {
  return (
    <>
      {/* Main key light - warm tone from above */}
      <directionalLight
        position={[2, 5, 3]}
        intensity={1.5}
        color="#ffeedd"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light from the left */}
      <directionalLight
        position={[-3, 3, 2]}
        intensity={0.6}
        color="#e6d5c3"
      />

      {/* Back rim light */}
      <pointLight
        position={[0, 2, -3]}
        intensity={0.4}
        color="#ffcc99"
      />

      {/* Ambient for base illumination */}
      <ambientLight intensity={0.4} color="#f5e6d3" />
    </>
  );
}

export function Experience({ onItemClick }: ExperienceProps) {
  return (
    <Canvas
      camera={{
        position: [0, 3, 5],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      shadows
      dpr={[1, 2]}
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <color attach="background" args={['#1a1814']} />
      
      <Suspense fallback={null}>
        <Lights />
        <FlippingBook onItemClick={onItemClick} />
      </Suspense>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        minDistance={3}
        maxDistance={12}
      />
    </Canvas>
  );
}
