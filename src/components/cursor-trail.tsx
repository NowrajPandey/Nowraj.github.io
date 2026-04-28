import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Dot {
  x: number;
  y: number;
  id: number;
}

export function CursorTrail() {
  const [dots, setDots] = useState<Dot[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const enabledRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) {
      enabledRef.current = false;
      return;
    }

    const handleMove = (e: MouseEvent) => {
      const last = lastRef.current;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (Math.hypot(dx, dy) < 18) return;
      }
      lastRef.current = { x: e.clientX, y: e.clientY };
      const id = idRef.current++;
      setDots((prev) => {
        const next = [...prev, { x: e.clientX, y: e.clientY, id }];
        return next.length > 14 ? next.slice(next.length - 14) : next;
      });
      window.setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== id));
      }, 700);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!enabledRef.current) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <AnimatePresence>
        {dots.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0.6, scale: 0.6 }}
            animate={{ opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              left: d.x,
              top: d.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className="absolute w-2 h-2 rounded-full bg-accent/55 mix-blend-multiply"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
