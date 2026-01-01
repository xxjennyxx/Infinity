# Directory Structure

This document describes the project structure for **Infinity** - A Digital Memory Scrapbook.

```
infinity/
├── docs/                          # Project documentation
│   ├── CHANGELOG.md               # Project change history
│   ├── DirectoryStructure.md      # This file - project structure
│   ├── ProjectGoals.md            # Project objectives
│   └── TASK.md                    # Task tracking
│
├── public/                        # Static assets (served as-is)
│
├── src/                           # Source code
│   ├── components/                # React components
│   │   ├── Book.tsx               # 3D Book model (React Three Fiber)
│   │   ├── Experience.tsx         # 3D scene container with Canvas
│   │   └── MemoryScroll.tsx       # 2D infinite scroll view
│   │
│   ├── data/                      # Data and mock content
│   │   └── memories.ts            # Memory artifacts data
│   │
│   ├── assets/                    # Static assets (bundled)
│   │
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles + Tailwind
│   └── vite-env.d.ts              # Vite type definitions
│
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration (root)
├── tsconfig.app.json              # TypeScript config for app
├── tsconfig.node.json             # TypeScript config for Node
└── vite.config.ts                 # Vite build configuration
```

## Component Hierarchy

```
App
├── Experience (3D View)
│   ├── Atmosphere (Lighting)
│   ├── FloatingDust (Particles)
│   ├── Book (Interactive 3D Book)
│   ├── Desk (3D Surface)
│   ├── ContactShadows
│   └── OrbitControls
│
└── MemoryScroll (2D Scroll View)
    └── MemoryCard (Individual memory items)
```

## Key Files Description

| File | Purpose |
|------|---------|
| `App.tsx` | Root component managing view mode state (3D/scroll) |
| `Experience.tsx` | React Three Fiber Canvas with 3D scene |
| `Book.tsx` | Interactive 3D book with hover/click states |
| `MemoryScroll.tsx` | Framer Motion powered infinite scroll |
| `memories.ts` | Mock data for memory artifacts |
| `index.css` | Tailwind + custom styles (grain, glass effects) |

