import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BookmarkNavProps {
  sections: { id: string; label: string }[];
}

export function BookmarkNav({ sections }: BookmarkNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px' },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1.5 items-end pr-0"
    >
      {sections.map((section, i) => {
        const active = activeId === section.id;
        return (
          <motion.button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.06, type: 'spring', stiffness: 220, damping: 22 }}
            whileHover={{ x: -6 }}
            className={`group relative flex items-center gap-3 pr-5 pl-4 py-1.5 origin-right transition-all
              ${active ? 'bg-accent text-accent-foreground' : 'bg-foreground/85 text-background hover:bg-accent/90'}
            `}
            style={{
              clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)',
            }}
          >
            <span
              className={`block h-1.5 w-1.5 rounded-full transition-all
                ${active ? 'bg-accent-foreground scale-100' : 'bg-background/60 scale-75 group-hover:scale-100'}
              `}
            />
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all
                ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'}
              `}
            >
              {section.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
