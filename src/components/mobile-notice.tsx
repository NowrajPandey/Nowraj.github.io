'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsVisible(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 md:hidden z-50"
        >
          <div className="bg-card border border-foreground/15 shadow-lg rounded-lg p-4 flex items-start gap-3">
            <div className="text-xl">💻</div>
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                Heads up
              </p>
              <p className="text-sm text-foreground/80 font-serif leading-snug">
                This portfolio looks best on desktop. On mobile, you might miss some niceties!
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}