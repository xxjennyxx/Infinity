import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Experience } from './components/Experience';
import { MemoryScroll } from './components/MemoryScroll';

type ViewMode = 'book' | 'detail';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('book');
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  const handleItemClick = useCallback((itemId: string) => {
    setSelectedMemory(itemId);
    setViewMode('detail');
  }, []);

  const handleBackToBook = useCallback(() => {
    setViewMode('book');
    setSelectedMemory(null);
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#1a1814]">
      {/* Grain overlay for vintage feel */}
      <div className="grain-overlay" />

      <AnimatePresence mode="wait">
        {viewMode === 'book' && (
          <motion.div
            key="book-view"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            {/* Vignette effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
              }}
            />

            {/* 3D Canvas */}
            <div className="absolute inset-0">
              <Experience onItemClick={handleItemClick} />
            </div>

            {/* Title - centered at top */}
            <motion.div
              className="absolute top-8 left-0 right-0 text-center pointer-events-none z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-6xl text-gold tracking-[0.2em]">
                INFINITY
              </h1>
              <p className="font-body text-parchment/50 mt-3 text-sm tracking-widest uppercase">
                Digital Memory Scrapbook
              </p>
            </motion.div>

            {/* Instructions - centered at bottom */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 text-center pointer-events-none z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p className="font-body text-parchment/40 text-sm italic">
                Click the edge of the page to flip
              </p>
            </motion.div>
          </motion.div>
        )}

        {viewMode === 'detail' && (
          <MemoryScroll key="detail-view" onBack={handleBackToBook} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
