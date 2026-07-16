import React, { useEffect, useState } from "react";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: string;
  duration: string;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate star coordinates
    const generatedStars: Star[] = Array.from({ length: 60 }).map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const size = Math.random() * 2 + 1; // 1px to 3px
      const delay = (Math.random() * 5).toFixed(2) + "s";
      const duration = (Math.random() * 4 + 3).toFixed(2) + "s"; // 3s to 7s

      return {
        id: i,
        top,
        left,
        size,
        delay,
        duration,
      };
    });
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#f2d98a] opacity-30 animate-pulse"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: star.size > 2 ? "0 0 4px #d9b45c" : "none",
          }}
        />
      ))}
    </div>
  );
}
