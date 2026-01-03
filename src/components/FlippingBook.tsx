import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

// Page content data
const pages = [
  { id: 'cover', type: 'cover' as const },
  { id: 'page1', type: 'content' as const, items: [{ id: 'memory1', title: 'Santorini Sunset' }] },
  { id: 'page2', type: 'content' as const, items: [{ id: 'memory2', title: 'Kyoto Gardens' }] },
  { id: 'page3', type: 'content' as const, items: [{ id: 'memory3', title: 'Paris Nights' }] },
  { id: 'back', type: 'back' as const },
];

// Book dimensions
const PAGE_WIDTH = 2.2;
const PAGE_HEIGHT = 3;
const PAGE_SEGMENTS = 30;
const BOOK_DEPTH = 0.05;

// Z-offset per page
const PAGE_Z_OFFSET = 0.025;
// Decoration offset from page surface
const DECORATION_Z = 0.008;


interface PageProps {
  pageIndex: number;
  currentPage: number;
  totalPages: number;
  isCover?: boolean;
  isBack?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function Page({ pageIndex, currentPage, totalPages, isCover, isBack, onNextPage, onPrevPage }: PageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frontRef = useRef<THREE.Mesh>(null);
  const backRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  console.log({isCover});
  console.log({isBack});
  console.log({pageIndex});
  console.log({currentPage});

  useCursor(hovered);

  // Determine if this page should be flipped
  const isFlipped = pageIndex < currentPage;
  const targetAngle = isFlipped ? -Math.PI : 0;
  
  // Is this the current active page (top of right stack or top of left stack)
  const isCurrentRightPage = pageIndex === currentPage;
  const isCurrentLeftPage = pageIndex === currentPage - 1;

  // Z-offset based on flip state
  const getZOffset = () => {
    if (isFlipped) {
      return pageIndex * PAGE_Z_OFFSET;
    } else {
      return (totalPages - pageIndex) * PAGE_Z_OFFSET;
    }
  };

  useFrame(() => {
    if (!groupRef.current || !frontRef.current || !backRef.current) return;

    const currentAngle = groupRef.current.rotation.y;
    const angleDiff = targetAngle - currentAngle;
    
    const targetZ = getZOffset();
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.15;
    
    if (Math.abs(angleDiff) > 0.001) {
      groupRef.current.rotation.y += angleDiff * 0.1;
      
      const progress = Math.abs(groupRef.current.rotation.y) / Math.PI;
      applyPageBend(frontRef.current.geometry as THREE.PlaneGeometry, progress);
      applyPageBend(backRef.current.geometry as THREE.PlaneGeometry, progress);
    }
  });

  const applyPageBend = (geometry: THREE.PlaneGeometry, progress: number) => {
    const positions = geometry.attributes.position;
    const originalPositions = geometry.userData.originalPositions;
    
    if (!originalPositions) {
      geometry.userData.originalPositions = positions.array.slice();
      return;
    }

    const bendStrength = Math.sin(progress * Math.PI) * 0.4;
    
    for (let i = 0; i < positions.count; i++) {
      const originalX = originalPositions[i * 3];
      const originalY = originalPositions[i * 3 + 1];
      const normalizedX = originalX / PAGE_WIDTH;
      const bend = Math.sin(normalizedX * Math.PI * 0.8) * bendStrength * normalizedX;
      
      positions.setX(i, originalX);
      positions.setY(i, originalY);
      positions.setZ(i, bend);
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    if (isFlipped && isCurrentLeftPage) {
      onPrevPage();
    } else if (!isFlipped && isCurrentRightPage) {
      onNextPage();
    }
  }, [isFlipped, isCurrentLeftPage, isCurrentRightPage, onNextPage, onPrevPage]);

  // Cover: dark brown front, parchment back
  // Content pages: parchment both sides
  // Back cover: dark brown front, parchment back
  const frontColor = isCover || isBack ? '#2a1810' : '#f8f4eb';
  const backColor = isCover || isBack ? '#2a1810' : '#f8f4eb';

  return (
    <group
      ref={groupRef}
      position={[0, 0, getZOffset()]}
      rotation={[0, 0, 0]}
    >
      {/* Front face */}
      <mesh
        ref={frontRef}
        position={[PAGE_WIDTH / 2, 0, 0.002]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]} />
        <meshStandardMaterial
          color={frontColor}
          roughness={isCover || isBack ? 0.75 : 0.9}
          metalness={isCover || isBack ? 0.1 : 0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back face */}
      <mesh
        ref={backRef}
        position={[PAGE_WIDTH / 2, 0, -0.002]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]} />
        <meshStandardMaterial
          color={backColor}
          roughness={0.9}
          metalness={0}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cover front decorations (only when not flipped) */}
      {isCover && !isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, DECORATION_Z]}>
          <mesh position={[0, 0.9, 0]}>
            <planeGeometry args={[1.6, 0.03]} />
            <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <planeGeometry args={[1.6, 0.03]} />
            <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.35, 0.35]} />
            <meshStandardMaterial 
              color="#c9a050" 
              metalness={0.8} 
              roughness={0.2}
              emissive="#c9a050"
              emissiveIntensity={hovered ? 0.4 : 0.15}
            />
          </mesh>
          {[[-0.7, 1.2], [0.7, 1.2], [-0.7, -1.2], [0.7, -1.2]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0]}>
              <circleGeometry args={[0.05, 16]} />
              <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Inside cover decorations (when flipped to the left) */}
      {isCover && isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, -DECORATION_Z]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <planeGeometry args={[PAGE_WIDTH - 0.3, PAGE_HEIGHT - 0.3]} />
            <meshStandardMaterial color="#231510" roughness={0.85} />
          </mesh>
          {/* Four corner dots */}
          {[[-0.7, 1.1], [0.7, 1.1], [-0.7, -1.1], [0.7, -1.1]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.001]}>
              <circleGeometry args={[0.04, 16]} />
              <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Back cover front decorations */}
      {isBack && !isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, DECORATION_Z]}>
          <mesh>
            <planeGeometry args={[PAGE_WIDTH - 0.3, PAGE_HEIGHT - 0.3]} />
            <meshStandardMaterial color="#231510" roughness={0.85} />
          </mesh>
          {[[-0.7, 1.1], [0.7, 1.1], [-0.7, -1.1], [0.7, -1.1]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.001]}>
              <circleGeometry args={[0.04, 16]} />
              <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Back cover back decorations (when flipped to the left) */}
      {isBack && isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, -DECORATION_Z]} rotation={[0, Math.PI, 0]}>
          <mesh>
            <planeGeometry args={[PAGE_WIDTH - 0.3, PAGE_HEIGHT - 0.3]} />
            <meshStandardMaterial color="#231510" roughness={0.85} />
          </mesh>
          {[[-0.7, 1.1], [0.7, 1.1], [-0.7, -1.1], [0.7, -1.1]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.001]}>
              <circleGeometry args={[0.04, 16]} />
              <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Content page FRONT decorations */}
      {!isCover && !isBack && !isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, DECORATION_Z]}>
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[1.5, 1.1]} />
            <meshStandardMaterial color="#e8e0d0" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.9, 0.001]} rotation={[0, 0, 0.08]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshStandardMaterial color="#f5efdc" transparent opacity={0.85} />
          </mesh>
          {[-0.5, -0.7, -0.9].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <planeGeometry args={[1.4, 0.015]} />
              <meshStandardMaterial color="#d0c8b8" />
            </mesh>
          ))}
        </group>
      )}

      {/* Content page BACK decorations (visible when flipped) */}
      {!isCover && !isBack && isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, -DECORATION_Z]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[1.5, 1.1]} />
            <meshStandardMaterial color="#e8e0d0" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.9, 0.001]} rotation={[0, 0, -0.08]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshStandardMaterial color="#f5efdc" transparent opacity={0.85} />
          </mesh>
          {[-0.5, -0.7, -0.9].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <planeGeometry args={[1.4, 0.015]} />
              <meshStandardMaterial color="#d0c8b8" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

interface FlippingBookProps {
  onItemClick?: (itemId: string) => void;
}

export function FlippingBook({ onItemClick }: FlippingBookProps) {
  void onItemClick;
  
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<THREE.Group>(null);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, pages.length));
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.015;
    }
  });

  return (
    <group ref={bookRef} position={[0, 0, 0]} rotation={[-0.25, 0, 0]}>
      {/* Book Spine */}
      <mesh position={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.16, PAGE_HEIGHT + 0.1, BOOK_DEPTH]} />
        <meshStandardMaterial color="#1a0f08" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Spine gold decoration */}
      <mesh position={[-0.08, 0, BOOK_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[0.1, PAGE_HEIGHT * 0.7]} />
        <meshStandardMaterial color="#c9a050" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Flipping Pages */}
      {pages.map((page, index) => (
        <Page
          key={page.id}
          pageIndex={index}
          currentPage={currentPage}
          totalPages={pages.length}
          isCover={page.type === 'cover'}
          isBack={page.type === 'back'}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      ))}

      {/* Page Indicator */}
      <group position={[0, -PAGE_HEIGHT / 2 - 0.4, 0.2]}>
        {pages.map((_, i) => (
          <mesh key={i} position={[(i - (pages.length - 1) / 2) * 0.18, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial 
              color={i < currentPage ? '#c9a050' : '#3a3a3a'} 
              transparent 
              opacity={i < currentPage ? 1 : 0.4} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
