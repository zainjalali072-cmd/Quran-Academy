import React from "react";
import { motion } from "motion/react";
import photorealisticQuran from "../assets/images/photorealistic_open_quran_1784123735832.jpg";

export default function AutoOpeningQuran() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" style={{ perspective: "1200px" }}>
      
      {/* 1. CIRCULAR ROTATING SURAH AL-IKHLAS TEXT */}
      <div className="absolute w-72 h-72 md:w-[26rem] md:h-[26rem] flex items-center justify-center animate-spin-slow pointer-events-none">
        <svg className="w-full h-full text-[#d9b45c]" viewBox="0 0 320 320">
          <defs>
            {/* Clockwise circular path for Surah text */}
            <path
              id="ikhlasCirclePath"
              d="M 160, 160 m -135, 0 a 135,135 0 1,1 270,0 a 135,135 0 1,1 -270,0"
              fill="none"
            />
          </defs>
          <text className="font-arabic fill-[#d9b45c] text-[12.5px] md:text-[13px] font-bold tracking-[0.08em]">
            <textPath href="#ikhlasCirclePath" startOffset="0%">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✦ قُلْ هُوَ اللَّهُ أَحَدٌ ✦ اللَّهُ الصَّمَدُ ✦ لَمْ يَلِدْ وَلَمْ يُولَدْ ✦ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ✦
            </textPath>
          </text>
        </svg>
      </div>

      {/* Decorative Outer Ring with Star/Octagram */}
      <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-[#d9b45c]/15 animate-spin-slow-reverse pointer-events-none" />
      <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-dashed border-[#d9b45c]/10 pointer-events-none" />

      {/* Glowing Divine Aura and Particles */}
      <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-[#d9b45c]/15 rounded-full filter blur-[50px] animate-pulse pointer-events-none" />
      
      {/* Floating particles background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#d9b45c]/40 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-10, -50, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 2. PHOTOREALISTIC OPEN HOLY QURAN DISPLAY WITH GOLDEN GLOW FRAME */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-52 h-52 md:w-64 md:h-64 flex items-center justify-center"
      >
        {/* Soft, continuous bobbing animation for realistic floating feel */}
        <motion.div
          animate={{
            y: [-6, 6, -6],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full flex items-center justify-center p-2"
        >
          {/* Inner precise golden frame with ambient drop shadow */}
          <div className="absolute inset-0 rounded-full border-2 border-[#d9b45c]/35 shadow-[0_0_40px_rgba(217,180,92,0.3)] flex items-center justify-center p-1.5 bg-gradient-to-b from-[#0e1015] via-[#12141b] to-[#07080b] overflow-hidden">
            
            {/* Extremely detailed photorealistic open Quran image */}
            <img
              src={photorealisticQuran}
              alt="Holy Quran Book Open with Gold Foil and Authentic Calligraphy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full transform scale-105 select-none pointer-events-none"
            />
            
            {/* Delicate inner gold overlay to blend beautifully */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b]/50 via-transparent to-transparent pointer-events-none rounded-full" />
            <div className="absolute inset-0 border border-[#d9b45c]/20 pointer-events-none rounded-full" />
          </div>
          
          {/* Extra outer thin glow ring right around the book circle */}
          <div className="absolute -inset-1 rounded-full border border-[#d9b45c]/20 pointer-events-none animate-pulse" />
        </motion.div>
      </motion.div>

    </div>
  );
}
