import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DiaryEntryProps {
  date: string;
  title: string;
  children: ReactNode;
  delay?: number;
  id?: string;
  number?: string;
  kicker?: string;
}

export function DiaryEntry({ date, title, children, delay = 0, id, number, kicker }: DiaryEntryProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-16 md:mb-28 max-w-2xl mx-auto scroll-mt-20 md:scroll-mt-24"
    >
      <div className="flex items-baseline gap-3 mb-4">
        {number && (
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {number}
          </span>
        )}
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {date}
        </span>
        <div className="h-px bg-foreground/15 flex-1" />
      </div>

      {kicker && (
        <p className="font-handwriting text-2xl text-accent -rotate-1 mb-1">{kicker}</p>
      )}

      <h2 className="font-display font-light text-4xl md:text-5xl text-foreground mb-8 tracking-tight leading-[1.05] inline-block relative">
        {title}
        <motion.svg
          viewBox="0 0 100 6"
          preserveAspectRatio="none"
          className="absolute -bottom-2 left-0 w-full h-2 stroke-accent/70"
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <motion.path
            d="M0 3 Q 25 0 50 3 T 100 3"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: delay + 0.35, ease: 'easeInOut' }}
          />
        </motion.svg>
      </h2>

      <div className="font-serif text-lg md:text-[1.18rem] leading-[1.7] text-foreground/85 space-y-5">
        {children}
      </div>
    </motion.section>
  );
}
