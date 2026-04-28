interface MarqueeStripProps {
  items: string[];
  className?: string;
}

export function MarqueeStrip({ items, className = '' }: MarqueeStripProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative w-full overflow-hidden border-y border-foreground/15 bg-foreground text-background ${className}`}>
      <div className="marquee-track flex gap-12 py-3 whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-12"
          >
            {item}
            <span aria-hidden className="inline-block w-2 h-2 rotate-45 bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
