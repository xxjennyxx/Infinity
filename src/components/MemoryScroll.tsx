import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { memories, Memory } from '../data/memories';

interface MemoryCardProps {
  memory: Memory;
  index: number;
}

function MemoryCard({ memory, index }: MemoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  
  const isLeft = index % 2 === 0;
  const rotation = memory.rotation || 0;

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: isLeft ? -100 : 100,
      rotate: isLeft ? -10 : 10,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: rotation,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1,
      },
    },
  };

  const getCardStyles = () => {
    switch (memory.type) {
      case 'photo':
        return 'bg-parchment border-4 border-white shadow-xl';
      case 'note':
        return 'bg-amber-50 border-l-4 border-gold shadow-lg';
      case 'ticket':
        return 'bg-gradient-to-r from-amber-100 to-orange-50 border-dashed border-2 border-sepia';
      case 'postcard':
        return 'bg-white border-8 border-white shadow-xl';
      default:
        return 'bg-parchment';
    }
  };

  return (
    <motion.div
      ref={ref}
      className={`relative max-w-md mx-auto ${isLeft ? 'md:mr-auto md:ml-20' : 'md:ml-auto md:mr-20'}`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ 
        transformOrigin: 'center center',
      }}
    >
      <div className={`${getCardStyles()} p-4 rounded-sm`}>
        {/* Photo types get an image */}
        {(memory.type === 'photo' || memory.type === 'postcard') && memory.imageUrl && (
          <div className="relative mb-4 overflow-hidden">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            {memory.type === 'postcard' && (
              <div className="absolute top-2 right-2 w-12 h-14 bg-dusty-rose border border-sepia flex items-center justify-center">
                <span className="text-xs text-ink font-display">STAMP</span>
              </div>
            )}
          </div>
        )}

        {/* Ticket header */}
        {memory.type === 'ticket' && (
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-dashed border-sepia">
            <span className="text-xs uppercase tracking-widest text-sepia font-bold">Admit One</span>
            <span className="text-xs text-sepia">№ {String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</span>
          </div>
        )}

        {/* Note paper lines */}
        {memory.type === 'note' && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-6 border-b border-blue-300" />
            ))}
          </div>
        )}

        <div className="relative z-10">
          <h3 className="font-display text-xl text-ink mb-1">{memory.title}</h3>
          <div className="flex items-center gap-3 text-sm text-sepia mb-3">
            <span>{memory.location}</span>
            <span>•</span>
            <span className="italic">{memory.date}</span>
          </div>
          <p className="font-body text-ink/80 leading-relaxed text-sm">
            {memory.description}
          </p>
        </div>

        {/* Tape effect for photos */}
        {memory.type === 'photo' && (
          <>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-100/80 -rotate-2" />
          </>
        )}

        {/* Postcard back pattern */}
        {memory.type === 'postcard' && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 flex-1 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface MemoryScrollProps {
  onBack: () => void;
}

export function MemoryScroll({ onBack }: MemoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-[#1a1814] via-[#2d2a26] to-[#1a1814]"
        style={{ y: backgroundY }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 glass px-4 py-2 rounded-full text-gold font-display text-sm tracking-wide hover:bg-gold/10 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Return to Book
      </motion.button>

      {/* Header */}
      <motion.div
        className="relative z-10 text-center py-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="font-display text-5xl md:text-6xl text-gold mb-2">Memories</h1>
        <p className="font-body text-parchment/60 italic text-lg">Scroll to wander through time</p>
      </motion.div>

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed right-6 top-1/2 -translate-y-1/2 w-1 h-40 bg-ink/30 rounded-full overflow-hidden z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-full bg-gradient-to-b from-gold to-dusty-rose rounded-full"
          style={{ height: scrollYProgress }}
        />
      </motion.div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="memory-scroll absolute inset-0 top-32 overflow-y-auto px-4"
      >
        <div className="max-w-4xl mx-auto pb-40 space-y-16 md:space-y-24">
          {memories.map((memory, index) => (
            <MemoryCard key={memory.id} memory={memory} index={index} />
          ))}

          {/* End message */}
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-gold to-transparent mx-auto mb-8" />
            <p className="font-display text-2xl text-gold/60 italic">
              "The journey continues..."
            </p>
            <p className="font-body text-parchment/40 mt-4">
              More memories await
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

