import { useRef, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
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
const BOOK_DEPTH = 0.4;

interface PageProps {
  pageIndex: number;
  currentPage: number;
  isCover?: boolean;
  isBack?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

function Page({ pageIndex, currentPage, isCover, isBack, onNextPage, onPrevPage }: PageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frontRef = useRef<THREE.Mesh>(null);
  const backRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  // Determine if this page should be flipped
  const isFlipped = pageIndex < currentPage;
  const targetAngle = isFlipped ? -Math.PI : 0;

  // Animate page flip with bending effect
  useFrame(() => {
    if (!groupRef.current || !frontRef.current || !backRef.current) return;

    const currentAngle = groupRef.current.rotation.y;
    const angleDiff = targetAngle - currentAngle;
    
    // Smooth spring animation
    if (Math.abs(angleDiff) > 0.001) {
      groupRef.current.rotation.y += angleDiff * 0.1;
      
      // Calculate flip progress (0 to 1)
      const progress = Math.abs(groupRef.current.rotation.y) / Math.PI;
      
      // Apply bending to geometry
      applyPageBend(frontRef.current.geometry as THREE.PlaneGeometry, progress);
      applyPageBend(backRef.current.geometry as THREE.PlaneGeometry, progress);
    }
  });

  // Apply bending deformation during flip
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
      
      // Normalize X from 0 (spine) to 1 (edge)
      const normalizedX = originalX / PAGE_WIDTH;
      
      // Bend curve - more bend toward the edge
      const bend = Math.sin(normalizedX * Math.PI * 0.8) * bendStrength * normalizedX;
      
      positions.setX(i, originalX);
      positions.setY(i, originalY);
      positions.setZ(i, bend);
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  // Handle click - determine if left or right side
  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    // Get local click position
    const localPoint = e.point.clone();
    if (groupRef.current) {
      groupRef.current.worldToLocal(localPoint);
    }

    // If clicking on right half and this is the current top page, flip next
    if (localPoint.x > PAGE_WIDTH * 0.3 && pageIndex === currentPage) {
      onNextPage();
    }
    // If clicking on left half and this page is flipped, flip back
    else if (localPoint.x < PAGE_WIDTH * 0.3 && pageIndex === currentPage - 1) {
      onPrevPage();
    }
  }, [pageIndex, currentPage, onNextPage, onPrevPage]);

  // Page colors
  const frontColor = isCover || isBack ? '#2a1810' : '#f8f4eb';
  const backColor = '#f8f4eb';

  // Z offset to prevent z-fighting
  const zOffset = (pages.length - pageIndex) * 0.003;

  return (
    <group
      ref={groupRef}
      position={[0, 0, zOffset]}
      rotation={[0, 0, 0]}
    >
      {/* Front face of page */}
      <mesh
        ref={frontRef}
        position={[PAGE_WIDTH / 2, 0, 0.001]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_SEGMENTS, 1]} />
        <meshStandardMaterial
          color={frontColor}
          roughness={isCover ? 0.75 : 0.9}
          metalness={isCover ? 0.1 : 0}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Back face of page */}
      <mesh
        ref={backRef}
        position={[PAGE_WIDTH / 2, 0, -0.001]}
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

      {/* Cover decorations */}
      {isCover && (
        <group position={[PAGE_WIDTH / 2, 0, 0.01]}>
          {/* Gold frame lines */}
          <mesh position={[0, 0.9, 0]}>
            <planeGeometry args={[1.6, 0.03]} />
            <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <planeGeometry args={[1.6, 0.03]} />
            <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Center diamond */}
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

          {/* Corner dots */}
          {[[-0.7, 1.2], [0.7, 1.2], [-0.7, -1.2], [0.7, -1.2]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0]}>
              <circleGeometry args={[0.05, 16]} />
              <meshStandardMaterial color="#c9a050" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* Content page decorations */}
      {!isCover && !isBack && !isFlipped && (
        <group position={[PAGE_WIDTH / 2, 0, 0.01]}>
          {/* Photo placeholder */}
          <mesh position={[0, 0.3, 0]}>
            <planeGeometry args={[1.5, 1.1]} />
            <meshStandardMaterial color="#e8e0d0" roughness={0.95} />
          </mesh>
          {/* Tape */}
          <mesh position={[0, 0.9, 0.001]} rotation={[0, 0, 0.08]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshStandardMaterial color="#f5efdc" transparent opacity={0.85} />
          </mesh>
          {/* Lines for text */}
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
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef<THREE.Group>(null);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, pages.length - 1));
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  // Subtle floating animation
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.015;
    }
  });

  return (
    <group ref={bookRef} position={[0, 0, 0]} rotation={[-0.25, 0, 0]}>
      {/* ===== BOOK SPINE ===== */}
      <mesh position={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.16, PAGE_HEIGHT + 0.1, BOOK_DEPTH]} />
        <meshStandardMaterial color="#1a0f08" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Spine gold decoration */}
      <mesh position={[-0.08, 0, BOOK_DEPTH / 2 + 0.001]}>
        <planeGeometry args={[0.1, PAGE_HEIGHT * 0.7]} />
        <meshStandardMaterial color="#c9a050" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ===== BOOK THICKNESS - Page Stack ===== */}
      {/* Right side pages (unread) */}
      <mesh position={[PAGE_WIDTH / 2, 0, -BOOK_DEPTH / 4]} castShadow receiveShadow>
        <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT - 0.05, BOOK_DEPTH / 2 - 0.02]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>

      {/* Page edges texture - right */}
      <mesh position={[PAGE_WIDTH + 0.001, 0, -BOOK_DEPTH / 4]}>
        <planeGeometry args={[BOOK_DEPTH / 2 - 0.02, PAGE_HEIGHT - 0.05]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.98} side={THREE.DoubleSide} />
      </mesh>

      {/* Left side pages (read) */}
      <mesh position={[-PAGE_WIDTH / 2, 0, -BOOK_DEPTH / 4]} castShadow receiveShadow>
        <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT - 0.05, BOOK_DEPTH / 2 - 0.02]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>

      {/* Page edges texture - left */}
      <mesh position={[-PAGE_WIDTH - 0.001, 0, -BOOK_DEPTH / 4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[BOOK_DEPTH / 2 - 0.02, PAGE_HEIGHT - 0.05]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.98} side={THREE.DoubleSide} />
      </mesh>

      {/* Bottom page edge */}
      <mesh position={[0, -PAGE_HEIGHT / 2 - 0.001, -BOOK_DEPTH / 4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PAGE_WIDTH * 2, BOOK_DEPTH / 2]} />
        <meshStandardMaterial color="#ece4d4" roughness={0.95} />
      </mesh>

      {/* ===== FLIPPING PAGES ===== */}
      {pages.map((page, index) => (
        <Page
          key={page.id}
          pageIndex={index}
          currentPage={currentPage}
          isCover={page.type === 'cover'}
          isBack={page.type === 'back'}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      ))}

      {/* ===== PAGE INDICATOR ===== */}
      <group position={[0, -PAGE_HEIGHT / 2 - 0.4, 0.2]}>
        {pages.map((_, i) => (
          <mesh key={i} position={[(i - (pages.length - 1) / 2) * 0.18, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial 
              color={i <= currentPage ? '#c9a050' : '#3a3a3a'} 
              transparent 
              opacity={i <= currentPage ? 1 : 0.4} 
            />
          </mesh>
        ))}
      </group>

      {/* ===== CLICK HINTS ===== */}
      {currentPage < pages.length - 1 && (
        <mesh position={[PAGE_WIDTH - 0.15, 0, 0.1]}>
          <planeGeometry args={[0.08, 0.25]} />
          <meshBasicMaterial color="#c9a050" transparent opacity={0.5} />
        </mesh>
      )}
      {currentPage > 0 && (
        <mesh position={[-PAGE_WIDTH + 0.15, 0, 0.1]}>
          <planeGeometry args={[0.08, 0.25]} />
          <meshBasicMaterial color="#c9a050" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
