"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Theme = "pink" | "yellow" | "blue";

interface ThemeTransitionProps {
  targetTheme: Theme;
}

export default function ThemeTransition({ targetTheme }: ThemeTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const bgColors = {
    pink: "rgba(255, 247, 251, 0.9)", // slightly transparent to allow mist/particles overlay
    yellow: "rgba(255, 251, 235, 0.9)",
    blue: "rgba(239, 246, 255, 0.9)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none backdrop-blur-md"
      style={{ backgroundColor: bgColors[targetTheme] }}
    >
      {targetTheme === "yellow" && <YellowTransition />}
      {targetTheme === "pink" && <PinkTransition />}
      {targetTheme === "blue" && <BlueTransition />}
    </motion.div>
  );
}

const YellowTransition = () => {
  const petals = Array.from({ length: 30 });
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Blooming Sunflowers at the bottom */}
      <div className="absolute bottom-0 w-full flex justify-around items-end opacity-90">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`sunflower-${i}`}
            initial={{ y: "100%", scale: 0.5, rotate: -45 }}
            animate={{ y: "0%", scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1, type: "spring", bounce: 0.5 }}
            className="text-9xl drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
            style={{ originY: 1 }}
          >
            🌻
          </motion.div>
        ))}
      </div>

      {/* Swirling glowing petals */}
      {petals.map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          initial={{
            opacity: 0,
            y: "110vh",
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 360,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: "-10vh",
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.4,
            ease: "easeInOut",
          }}
          className="absolute text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#fde047" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const PinkTransition = () => {
  const butterflies = Array.from({ length: 12 });
  const hearts = Array.from({ length: 25 });

  return (
    <div className="relative w-full h-full overflow-hidden perspective-[1000px]">
      {hearts.map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          initial={{
            opacity: 0,
            y: "110vh",
            x: `${Math.random() * 100}vw`,
            scale: 0.5,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: "-10vh",
            x: `${(Math.random() * 100)}vw`,
            scale: [0.5, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
          className="absolute text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {butterflies.map((_, i) => (
        <motion.div
          key={`butterfly-${i}`}
          initial={{
            opacity: 0,
            x: "-10vw",
            y: `${Math.random() * 100}vh`,
            rotateZ: Math.random() * 45 - 20,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: "110vw",
            y: `${Math.random() * 100}vh`,
            rotateY: [0, 60, -60, 0, 60, -60, 0, 60], // 3D wing flap effect
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            delay: Math.random() * 0.3,
            ease: "easeInOut",
          }}
          className="absolute text-5xl md:text-7xl drop-shadow-[0_0_15px_rgba(255,90,169,0.9)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          🦋
        </motion.div>
      ))}
    </div>
  );
};

const BlueTransition = () => {
  const bubbles = Array.from({ length: 25 });

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Water Waves rising */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: ["100%", "-20%", "100%"] }}
        transition={{ duration: 2.8, ease: "easeInOut" }}
        className="absolute bottom-0 w-[200%] h-[120%] opacity-80"
      >
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-blue-500 fill-current drop-shadow-[0_-10px_20px_rgba(59,130,246,0.6)]" preserveAspectRatio="none">
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>
      <motion.div
        initial={{ y: "100%", x: "-20%" }}
        animate={{ y: ["100%", "-10%", "100%"], x: ["-20%", "0%", "-20%"] }}
        transition={{ duration: 3.2, ease: "easeInOut" }}
        className="absolute bottom-0 w-[200%] h-[120%] opacity-60 mix-blend-multiply"
      >
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto text-cyan-400 fill-current" preserveAspectRatio="none">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </motion.div>

      {/* Rising Bubbles */}
      {bubbles.map((_, i) => {
        const size = Math.random() * 40 + 20;
        return (
          <motion.div
            key={`bubble-${i}`}
            initial={{
              opacity: 0,
              y: "110vh",
              x: `${Math.random() * 100}vw`,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: "-20vh",
              x: `${Math.random() * 100}vw`,
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
            className="absolute rounded-full border-2 border-blue-200 bg-blue-100/30 backdrop-blur-sm z-10 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        );
      })}
    </div>
  );
};
