import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PolaroidProps {
  src?: string;
  caption: string;
  rotation?: number;
  className?: string;
  children?: ReactNode;
  tapeColor?: 'amber' | 'mint';
}

export function Polaroid({
  src,
  caption,
  rotation = 2,
  className = '',
  children,
  tapeColor = 'amber',
}: PolaroidProps) {
  const tape =
    tapeColor === 'mint'
      ? 'bg-[hsl(var(--tape-mint)/0.85)] border-[hsl(var(--tape-mint))]'
      : 'bg-[hsl(var(--tape-amber)/0.85)] border-[hsl(var(--tape-amber))]';

  return (
    <motion.div
      initial={{ opacity: 0, rotate: rotation - 6, y: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, rotate: rotation, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 15 }}
      whileHover={{
        scale: 1.045,
        rotate: rotation > 0 ? rotation + 2 : rotation - 2,
        y: -4,
        zIndex: 30,
      }}
      style={{ ['--rest-rotate' as string]: `${rotation}deg` }}
      className={`relative inline-block bg-card pt-2 sm:pt-3 px-2 sm:px-3 pb-8 sm:pb-10 paper-card paper-edge cursor-pointer ${className}`}
    >
      <div className="relative w-28 sm:w-44 md:w-48 aspect-square overflow-hidden bg-foreground/5 flex items-center justify-center">
        {src ? (
          <img
            src={src}
            alt={caption}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          children
        )}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_24px_rgba(0,0,0,0.18)]" />
      </div>

      <div className="font-handwriting text-foreground/85 text-center text-lg sm:text-xl leading-none absolute bottom-2 sm:bottom-2.5 left-0 right-0">
        {caption}
      </div>

      <div
        className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-4 sm:h-5 rotate-[4deg] border ${tape} shadow-sm`}
      />
    </motion.div>
  );
}
