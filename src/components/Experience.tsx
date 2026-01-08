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
      {/* Main key light - warm tone from front-right */}
      <directionalLight
        position={[2, 5, 3]}
        intensity={1.2}
        color="#ffeedd"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light from the front-left */}
      <directionalLight
        position={[-3, 3, 2]}
        intensity={0.8}
        color="#e6d5c3"
      />

      {/* Back-right light (for 360 view) */}
      <directionalLight
        position={[2, 4, -3]}
        intensity={1.0}
        color="#ffeedd"
      />

      {/* Back-left light (for 360 view) */}
      <directionalLight
        position={[-2, 4, -3]}
        intensity={0.8}
        color="#e6d5c3"
      />

      {/* Top light for even illumination */}
      <pointLight
        position={[0, 6, 0]}
        intensity={0.6}
        color="#fff5e6"
      />

      {/* Higher ambient for base illumination */}
      <ambientLight intensity={0.6} color="#f5e6d3" />
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
