import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StickerProps {
  children: ReactNode;
  rotate?: number;
  className?: string;
  color?: 'paper' | 'amber' | 'mint' | 'ink' | 'red';
  delay?: number;
  hoverRotate?: number;
}

const tones: Record<NonNullable<StickerProps['color']>, string> = {
  paper: 'bg-card text-foreground border border-border',
  amber: 'bg-[hsl(38,75%,80%)] text-[hsl(220,25%,18%)] dark:bg-[hsl(38,70%,75%)] dark:text-black border border-border/30',
  mint: 'bg-[hsl(160,30%,80%)] text-[hsl(220,25%,18%)] dark:bg-[hsl(160,45%,60%)] dark:text-black border border-border/30',
  ink: 'bg-[hsl(220,25%,18%)] text-[hsl(40,36%,96%)] dark:bg-white dark:text-black border border-transparent',
  red: 'bg-[hsl(10,60%,45%)] text-white dark:bg-[hsl(10,65%,50%)] dark:text-white border border-transparent',
};

export function Sticker({
  children,
  rotate = -3,
  className = '',
  color = 'paper',
  delay = 0,
  hoverRotate,
}: StickerProps) {
  const targetHoverRotate = hoverRotate ?? rotate * -0.5;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: rotate + 8 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 14, delay }}
      whileHover={{
        rotate: targetHoverRotate,
        y: -3,
        scale: 1.04,
        transition: { type: 'spring', stiffness: 320, damping: 12 },
      }}
      className={`inline-block px-3 py-1 select-none shadow-[0_3px_10px_-4px_rgba(0,0,0,0.25)] ${tones[color]} ${className}`}
      style={{ transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
}