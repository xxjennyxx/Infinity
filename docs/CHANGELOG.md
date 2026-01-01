# Changelog

All notable changes to the Infinity project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0] - 2026-01-01

### Added

#### Project Setup
- Initialized Vite project with React 18 + TypeScript template
- Installed Three.js ecosystem (@react-three/fiber, @react-three/drei)
- Installed Framer Motion for 2D animations
- Configured Tailwind CSS with custom theme
- Added custom fonts: Playfair Display, Crimson Text
- Defined custom color palette (parchment, sepia, ink, gold, dusty-rose)

#### 3D Scene
- Created `Experience.tsx` - main 3D canvas component
- Built `Book.tsx` - interactive 3D book model with:
  - Leather-textured covers
  - Parchment-colored pages
  - Gold decorative embossing
  - Title text rendering
  - Hover glow effect
  - Subtle floating animation
- Implemented atmospheric lighting system:
  - Warm key light (sunset tone)
  - Cool fill light
  - Rim light for depth
  - Spotlight on book
- Added desk surface with wood material
- Implemented floating dust particles
- Configured OrbitControls with restricted angles
- Added contact shadows for grounding

#### 2D Scroll View
- Created `MemoryScroll.tsx` - infinite scroll component
- Built `MemoryCard` component with 4 visual variants:
  - Photo (polaroid style with tape)
  - Note (lined paper with handwritten feel)
  - Ticket (perforated stub design)
  - Postcard (stamp and address lines)
- Implemented scroll-triggered animations using Framer Motion
- Added alternating left/right card positions
- Created scroll progress indicator
- Added floating decorative particles
- Designed end-of-scroll message

#### User Interface
- Implemented view mode state management (3D/scroll toggle)
- Created seamless transitions between views with AnimatePresence
- Added blur/scale exit animation for 3D view
- Designed header with project title
- Added hint text for user guidance
- Created grain overlay for vintage texture
- Added custom scrollbar styling
- Implemented glass morphism back button

#### Data
- Created `memories.ts` with mock memory data
- Defined Memory interface with type safety
- Added 8 sample memories across different types

#### Documentation
- Created docs folder structure
- Added DirectoryStructure.md
- Added ProjectGoals.md
- Added TASK.md
- Added CHANGELOG.md

### Technical Notes

- Used Vite 4.5.1 for macOS Big Sur compatibility
- React 18.2.0 for R3F ecosystem stability
- Three.js 0.160.0 for @react-three compatibility

---

## Future Releases

### Planned for [0.2.0]
- Page turn animation for book
- Keyboard navigation
- Reduced motion support
- Loading states

### Planned for [0.3.0]
- User-uploadable memories
- Backend integration
- Authentication

