# Infinity ∞

A Digital Memory Scrapbook - An interactive 3D website to archive and explore travel memories.

![Made with React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.160.0-000000?style=flat&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript)

## Overview

Infinity merges 3D WebGL scenes with 2D DOM elements to create an immersive memory exploration experience:

1. **The Book (Home)** - A 3D interactive book sitting on a vintage desk
2. **The Memory Scroll (Detail View)** - An infinite scrolling canvas where memory artifacts float in

## Features

- 🎨 **3D Interactive Scene** - React Three Fiber powered book with atmospheric lighting
- 📜 **Infinite Scroll Gallery** - Framer Motion animated memory cards
- 🎭 **Seamless Transitions** - Smooth blend between 3D and 2D views
- 🌅 **Vintage Aesthetic** - Warm color palette with grain overlay effects
- 📱 **Responsive Design** - Works across desktop and mobile devices

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 3D rendering |
| [Drei](https://github.com/pmndrs/drei) | R3F helpers |
| [Framer Motion](https://www.framer.com/motion/) | 2D animations |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd infinity

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
infinity/
├── src/
│   ├── components/
│   │   ├── Book.tsx          # 3D Book model
│   │   ├── Experience.tsx    # 3D scene container
│   │   └── MemoryScroll.tsx  # Infinite scroll view
│   ├── data/
│   │   └── memories.ts       # Memory data
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
└── docs/                     # Documentation
```

See [docs/DirectoryStructure.md](./docs/DirectoryStructure.md) for detailed structure.

## Usage

1. **Explore the Book** - Use mouse to orbit around the 3D book (limited angles)
2. **Open Memories** - Click the book to transition to the memory scroll
3. **Browse Memories** - Scroll through floating memory cards
4. **Return** - Click "Return to Book" to go back to 3D view

## Memory Types

The scrapbook supports four types of memory artifacts:

| Type | Description |
|------|-------------|
| 📸 Photo | Polaroid-style images with tape |
| 📝 Note | Lined paper with handwritten text |
| 🎫 Ticket | Perforated ticket stubs |
| 💌 Postcard | Stamped postcards |

## Customization

### Adding Memories

Edit `src/data/memories.ts` to add your own memories:

```typescript
{
  id: 'unique-id',
  type: 'photo', // 'photo' | 'note' | 'ticket' | 'postcard'
  title: 'Memory Title',
  date: 'January 2024',
  location: 'City, Country',
  description: 'Your memory description...',
  imageUrl: 'https://...', // Optional for photos/postcards
  rotation: -2, // Optional slight rotation
}
```

### Theme Colors

Customize colors in `tailwind.config.js`:

```javascript
colors: {
  'parchment': '#f5f0e8',
  'sepia': '#8b7355',
  'ink': '#2d2a26',
  'gold': '#c9a050',
  'dusty-rose': '#d4a5a5',
}
```

## Documentation

- [Project Goals](./docs/ProjectGoals.md)
- [Directory Structure](./docs/DirectoryStructure.md)
- [Task Tracking](./docs/TASK.md)
- [Changelog](./docs/CHANGELOG.md)

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

*"The journey continues..."*
