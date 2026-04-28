import { motion } from 'framer-motion';
import profileStampOriginal from '@/assets/profile-stamp-original.png';

export function StampPhoto() {
  return (
    <motion.div
      className="relative z-10 flex-shrink-0"
      initial={{ rotate: -7, opacity: 0, y: 24, scale: 0.94 }}
      animate={{ rotate: -3, opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.2 }}
      whileHover={{
        rotate: 0,
        scale: 1.045,
        y: -6,
        transition: { type: 'spring', stiffness: 280, damping: 14 },
      }}
      style={{ transformOrigin: 'center center' }}
    >
      {/* Soft drop shadow under the postcard */}
      <div className="absolute inset-1 translate-y-3 translate-x-1 blur-2xl bg-black/25 rounded-md" />

      {/* The postcard — image fills it edge to edge */}
      <div
        className="relative overflow-hidden rounded-[2px] shadow-[0_4px_18px_-4px_rgba(20,15,10,0.35),0_1px_0_rgba(0,0,0,0.05)]"
        style={{ width: 'clamp(270px, 32vw, 360px)' }}
      >
        <img
          src={profileStampOriginal}
          alt="Profile"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
        {/* Subtle inner vignette for depth */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
      </div>

      {/* Single piece of washi tape in the center */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 origin-center"
        style={{ rotate: -2 }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5e1b8]/60 via-[#e8d4a8]/50 to-[#f5e1b8]/60 rounded-sm" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139,119,82,0.15) 2px,
            rgba(139,119,82,0.15) 4px
          )`
        }} />
        <div className="absolute inset-0 border border-[#d4c098]/40 rounded-sm" />
        <div className="absolute inset-0 shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
      </motion.div>
    </motion.div>
  );
}
