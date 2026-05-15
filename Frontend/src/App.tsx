/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import React, { useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Onboarding from './Onboarding';
import Roadmap from './Roadmap';

const gridCols = 51;
const gridRows = 9;
const cellSize = 16;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.8
    }
  }
};

const letterVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const pixelVariants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 700,
      damping: 30
    }
  }
};

const LETTERS = [
  {
    letter: 'M',
    offsetX: 1,
    pixels: [
      [0,6], [0,5], [0,4], [0,3], [0,2], [0,1], [0,0],
      [1,1], [2,2], [3,3],
      [4,2], [5,1],
      [6,0], [6,1], [6,2], [6,3], [6,4], [6,5], [6,6]
    ]
  },
  {
    letter: 'O1',
    offsetX: 10,
    pixels: [
      [1,6], [0,5], [0,4], [0,3], [0,2], [0,1], [1,0],
      [2,0], [3,0],
      [4,1], [4,2], [4,3], [4,4], [4,5],
      [3,6], [2,6]
    ]
  },
  {
    letter: 'O2',
    offsetX: 17,
    pixels: [
      [1,6], [0,5], [0,4], [0,3], [0,2], [0,1], [1,0],
      [2,0], [3,0],
      [4,1], [4,2], [4,3], [4,4], [4,5],
      [3,6], [2,6]
    ]
  },
  {
    letter: 'T',
    offsetX: 24,
    pixels: [
      [2,6], [2,5], [2,4], [2,3], [2,2], [2,1],
      [0,0], [1,0], [2,0], [3,0], [4,0]
    ]
  },
  {
    letter: 'I',
    offsetX: 31,
    pixels: [
      [0,6], [1,6], [2,6],
      [1,5], [1,4], [1,3], [1,2], [1,1],
      [0,0], [1,0], [2,0]
    ]
  },
  {
    letter: 'O3',
    offsetX: 36,
    pixels: [
      [1,6], [0,5], [0,4], [0,3], [0,2], [0,1], [1,0],
      [2,0], [3,0],
      [4,1], [4,2], [4,3], [4,4], [4,5],
      [3,6], [2,6]
    ]
  },
  {
    letter: 'N',
    offsetX: 43,
    pixels: [
      [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6],
      [1,1], [2,2], [3,3], [4,4],
      [5,0], [5,1], [5,2], [5,3], [5,4], [5,5], [5,6]
    ]
  }
];

const PixelTarget = ({ r, c, CELL, char1, char2, char3, scrollProgress, triggerIndex, totalTriggers }: any) => {
  const getFillHex = (char: string) => {
    if(char === 'R') return '#ff2b2b';
    if(char === 'U') return '#2b65ff';
    if(char === 'D') return '#cccccc';
    if(char === 'E') return '#555555';
    if(char === 'B') return '#111111';
    if(char === 'C') return '#e0fcfc';
    if(char === 'P') return '#ffb3b3';
    if(char === 'W') return '#ffffff';
    return 'transparent';
  };

  const staggerFactor = triggerIndex / totalTriggers;

  // Phase 1: Potion to Pi (0.2 to ~0.4)
  const triggerStart1 = 0.2 + staggerFactor * 0.15;
  const triggerEnd1 = triggerStart1 + 0.05;

  // Phase 2: Pi to Atom (quick, 0.7 to 0.8)
  const triggerStart2 = 0.7 + staggerFactor * 0.05;
  const triggerEnd2 = triggerStart2 + 0.05;

  let opRanges1 = [1, 1, 0, 0, 0];
  let opRanges2 = [0, 0, 1, 1, 0];
  let opRanges3 = [0, 0, 0, 0, 1];
  
  if (char1 === char2) {
      opRanges1 = [1, 1, 1, 0, 0];
      opRanges2 = [0, 0, 0, 0, 0]; 
  }
  if (char2 === char3) {
      if (char1 === char2) {
          opRanges1 = [1, 1, 1, 1, 1];
      } else {
          opRanges2 = [0, 0, 1, 1, 1];
      }
      opRanges3 = [0, 0, 0, 0, 0];
  }

  const op1 = useTransform(scrollProgress, [0, triggerStart1, triggerEnd1, triggerStart2, triggerEnd2], opRanges1);
  const op2 = useTransform(scrollProgress, [0, triggerStart1, triggerEnd1, triggerStart2, triggerEnd2], opRanges2);
  const op3 = useTransform(scrollProgress, [0, triggerStart1, triggerEnd1, triggerStart2, triggerEnd2], opRanges3);

  return (
    <>
      {char1 !== ' ' && (
        <motion.rect
          x={c * CELL}
          y={r * CELL}
          width={CELL}
          height={CELL}
          fill={getFillHex(char1)}
          style={{ opacity: op1 }}
        />
      )}
      {char2 !== ' ' && (
        <motion.rect
          x={c * CELL}
          y={r * CELL}
          width={CELL}
          height={CELL}
          fill={getFillHex(char2)}
          style={{ opacity: op2 }}
        />
      )}
      {char3 !== ' ' && (
        <motion.rect
          x={c * CELL}
          y={r * CELL}
          width={CELL}
          height={CELL}
          fill={getFillHex(char3)}
          style={{ opacity: op3 }}
        />
      )}
    </>
  );
};

const GhostSection = () => {
  const CELL = 22;
  const potionMap = [
    "                      ",
    "        R             ",
    "                      ",
    "             R        ",
    "     R                ",
    "           R          ",
    "                      ",
    "         BBBB         ",
    "         BRRB         ",
    "        BBBBBB        ",
    "        BCCCCB        ",
    "        BCCCCB        ",
    "       BCCCCCCB       ",
    "      BCCCCCCCCB      ",
    "     BCCCCCCCCCCB     ",
    "    BCCCCCCCCCCCCB    ",
    "    BCCCCCCCCCCCCB    ",
    "    BRRRRRRRRRRRRB    ",
    "    BRRRRRRRRRRRRB    ",
    "    BRRRRRRRRRRRRB    ",
    "    BRPPRRRRRRRRRB    ",
    "    BPPPRRRRRRRRRB    ",
    "    BRPPRRRRRRRRRB    ",
    "     BRRRRRRRRRRB     ",
    "      BBBBBBBBBB      ",
    "                      "
  ];

  const piMap = [
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "   BBBBBBBBBBBBBBBB   ",
    "  BBBBBBBBBBBBBBBBBB  ",
    " BBB  BBB      BBB    ",
    " B    BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "      BBB      BBB    ",
    "     BBBB      BBB    ",
    "    BBBBB      BBB    ",
    "   BBBBBB      BBB B  ",
    "   BBBBBB      BBBBB  ",
    "    BBBB       BBBBB  ",
    "                 BB   ",
    "                      ",
    "                      ",
    "                      ",
    "                      "
  ];

  const atomMap = [
    "                      ",
    "                      ",
    "                      ",
    "      B               ",
    "      BB              ",
    "      BWB             ",
    "      BWWB            ",
    "      BWWWB           ",
    "      BWWWWB          ",
    "      BWWWWWB         ",
    "      BWWWWWWB        ",
    "      BWWWWWWWB       ",
    "      BWWWWWWWWB      ",
    "      BWWWWWWWWWB     ",
    "      BWWWWWWWWWWB    ",
    "      BWWWWWBBBBBB    ",
    "      BWWBBWWB        ",
    "      BWBB BWWB       ",
    "      BB    BWWB      ",
    "             BWWB     ",
    "              BB      ",
    "                      ",
    "                      ",
    "                      ",
    "                      ",
    "                      "
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const activePixels = useMemo(() => {
    const pixels = [];
    for (let r = 0; r < 26; r++) {
      for (let c = 0; c < 22; c++) {
        const char1 = potionMap[r][c] || ' ';
        const char2 = piMap[r][c] || ' ';
        const char3 = atomMap[r][c] || ' ';
        if (char1 !== ' ' || char2 !== ' ' || char3 !== ' ') {
          pixels.push({ r, c, char1, char2, char3 });
        }
      }
    }
    // Simple deterministic shuffle
    let seed = 12345;
    const random = () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    const mypixels = [...pixels];
    for (let i = mypixels.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [mypixels[i], mypixels[j]] = [mypixels[j], mypixels[i]];
    }
    return mypixels;
  }, []);

  return (
    <div ref={containerRef} className="w-full relative z-20 -mt-16 md:-mt-24 h-[350vh]">
      <section id="about" className="w-full min-h-screen bg-[#fafaf8] flex flex-col justify-center sticky top-0">
        
        <div className="relative w-full flex flex-col lg:flex-row justify-between px-8 md:px-16 lg:px-24 pt-10 md:pt-16 pb-4 md:pb-8">
          
          {/* Left column (Title) */}
          <div className="relative z-20 w-full lg:w-[25%] self-start pb-12 lg:pb-0">
             <p className="text-sm font-bold tracking-widest text-gray-900 mb-6 font-mono">01</p>
             <h2 className="text-4xl md:text-5xl lg:text-[4.2rem] font-medium tracking-tight leading-[1] text-gray-900 text-left">
               Unlock <br /> Mastery
             </h2>
          </div>

          {/* Center column (Illustration) */}
          <div className="relative z-10 w-full lg:w-[50%] flex justify-center">
             <div>
               <svg width={potionMap[0].length * CELL} height={potionMap.length * CELL} className="bg-[#fafaf8] border border-gray-200 relative z-10 w-full h-auto max-w-[700px]" viewBox={`0 0 ${potionMap[0].length * CELL} ${potionMap.length * CELL}`}>
                 <defs>
                   <pattern id="potion-grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
                     <path d={`M ${CELL} 0 L 0 0 0 ${CELL}`} fill="none" stroke="#d1d5db" strokeWidth="2" />
                   </pattern>
                 </defs>
                 <rect width="100%" height="100%" fill="url(#potion-grid)" />
                 <rect width="100%" height="100%" fill="none" stroke="#d1d5db" strokeWidth="2" />
                 
                 {activePixels.map((pixel, i) => (
                   <PixelTarget
                     key={`${pixel.r}-${pixel.c}`}
                     {...pixel}
                     CELL={CELL}
                     scrollProgress={scrollYProgress}
                     triggerIndex={i}
                     totalTriggers={activePixels.length}
                   />
                 ))}
               </svg>
             </div>
          </div>

          {/* Right column (Content) */}
          <div className="relative z-20 w-full lg:w-[25%] flex justify-end items-start pt-8 lg:pt-24 pb-4 lg:pb-0">
             <p className="text-[14px] md:text-[16px] text-gray-900 leading-[1.3] font-medium text-right lg:text-right font-sans">
               Dive deep into the <br/>wonders of Science,<br/>Technology, Engineering,<br/>and Mathematics.<br/>Our interactive models<br/>transform complex <br/>concepts into intuitive<br/>learning experiences.
             </p>
          </div>
        </div>

      </section>
    </div>
  );
};

const twitterPixels = [
  "                ",
  "             XX ",
  "            XXX ",
  "           XXXX ",
  "  X       XXXXX ",
  "   XX   XXXXXX  ",
  "   XXXXXXXXXXX  ",
  "    XXXXXXXXX   ",
  "     XXXXXXX    ",
  "     XXXXXX     ",
  "    XXXXX       ",
  "   XXXX         ",
  "  XX            ",
  "                ",
  "                ",
  "                "
];

const instagramPixels = [
  "                ",
  "  XXXXXXXXXXXX  ",
  "  X          X  ",
  "  X       XX X  ",
  "  X   XXXX   X  ",
  "  X  XX  XX  X  ",
  "  X  X    X  X  ",
  "  X  X    X  X  ",
  "  X  XX  XX  X  ",
  "  X   XXXX   X  ",
  "  X          X  ",
  "  XXXXXXXXXXXX  ",
  "                ",
  "                ",
  "                ",
  "                "
];

const githubPixels = [
  "                ",
  "                ",
  "   XX      XX   ",
  "   XX      XX   ",
  "   XXX    XXX   ",
  "   XXXXXXXXXX   ",
  "  XXXXXXXXXXXX  ",
  "  XX XXXXXX XX  ",
  "  XX XXXXXX XX  ",
  "  XXXXXXXXXXXX  ",
  "   XXXXXXXXXX   ",
  "    XXXXXXXX    ",
  "    XX    XX    ",
  "                ",
  "                ",
  "                "
];

const SocialIcon = ({ layout, hoverColor }: { layout: string[], hoverColor: string }) => {
  return (
    <div className="cursor-pointer group relative overflow-hidden flex items-center justify-center hover:scale-110 transition-transform duration-300" >
      <svg width="44" height="44" viewBox="0 0 16 16" className="text-black group-hover:hidden transition-opacity duration-200">
         {layout.map((r, y) => r.split('').map((c, x) => c === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null))}
      </svg>
      <svg width="44" height="44" viewBox="0 0 16 16" className="hidden group-hover:block transition-opacity duration-200" style={{ color: hoverColor }}>
         {layout.map((r, y) => r.split('').map((c, x) => c === 'X' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null))}
      </svg>
    </div>
  )
};

const FooterSection = () => {
  return (
    <div className="w-full bg-[#fafaf8] text-black pt-24 pb-8 font-sans mt-auto border-t border-black">
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between mb-24">
        {/* Left */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-16 md:mb-0">
          <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-4 leading-[1.1]">
            Unlock your<br/>
            <span className="text-black">potential.</span>
          </h2>
          <p className="text-gray-600 mt-6 max-w-[360px] mb-10 text-[15px] leading-relaxed font-medium">
            Ready to learn? We have the tools. Sign up to start exploring concepts in MOOTION.
          </p>
          
          <div className="relative w-full max-w-[400px]">
            <input 
              type="email" 
              placeholder="enter your email..." 
              className="w-full bg-[#fafaf8] border border-gray-300 rounded-2xl py-4 pl-6 pr-16 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black transition-colors text-sm"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-black text-white p-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center aspect-square">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-end justify-between">
          <div className="flex gap-16 md:gap-24 w-full md:w-auto">
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-black tracking-wide mb-1">Sitemap</h4>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">Home</a>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">Features</a>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">FAQ</a>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-[14px] font-bold text-black tracking-wide mb-1">Sitemap</h4>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">Twitter</a>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">Instagram</a>
              <a href="#" className="hover:text-black text-gray-600 text-[14px] transition-colors font-medium">LinkedIn</a>
            </div>
          </div>
          
          <div className="flex gap-8 mt-16 md:mt-0 w-full md:w-auto md:mr-8 justify-end">
            <SocialIcon layout={twitterPixels} hoverColor="#1DA1F2" />
            <SocialIcon layout={instagramPixels} hoverColor="#E1306C" />
            <SocialIcon layout={githubPixels} hoverColor="#24292e" />
          </div>
        </div>
      </div>
      
      {/* Bottom separator line */}
      <div className="max-w-7xl mx-auto px-8 md:px-16">
         <div className="w-full h-px bg-gray-200" />
      </div>

      {/* Bottom row */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-500 gap-4 md:gap-0 font-medium">
        <p>© 2024 MOOTION Studio. All rights reserved.</p>
        <div className="border border-gray-300 rounded-full px-5 py-2 uppercase tracking-widest text-[9px] font-bold text-gray-500">
          POWERED BY AI
        </div>
      </div>
    </div>
  )
}

function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-[#fafaf8] relative flex flex-col font-sans selection:bg-gray-300 selection:text-black text-black">
      
      {/* Section 1 */}
      <div className="w-full relative overflow-x-hidden">
        <div 
          className="relative w-full flex flex-col"
        style={{
          backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center top'
        }}
      >
        
        {/* Background Scribbles (Absolute) - Left */}
        <svg 
          className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-[600px] text-black pointer-events-none" 
          viewBox="0 0 200 600" 
          fill="none" 
        >
          <path 
            d="M 50 0 C 150 150 150 300 50 400 C -20 470 50 550 50 600" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M 50 350 C 100 370 120 450 70 500" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        </svg>

        {/* Background Scribbles (Absolute) - Right */}
        <svg 
          className="absolute -right-16 top-1/2 -translate-y-1/2 w-48 h-[600px] text-black pointer-events-none" 
          viewBox="0 0 200 600" 
          fill="none" 
        >
          <path 
            d="M 150 0 C 50 150 20 300 120 400 C 180 470 100 550 100 600" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        </svg>

        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 md:px-16 py-8 relative z-10">
          <div className="text-sm font-black uppercase tracking-widest text-black">
            MOOTION
          </div>
          
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            <a href="#" className="text-black relative group">
              Home
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-black"></span>
            </a>
            <a href="#about" className="hover:text-black transition-colors">About Us</a>
            <a href="#contact" className="hover:text-black transition-colors">Contact Us</a>
          </div>
          
          <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-black">
            <a href="#" className="hover:text-gray-600 transition-colors">Log In</a>
          </div>
        </nav>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col items-center mt-0 md:-mt-4 px-6 relative z-10 w-full">
          {/* Title Area with SVG overlays */}
          <div className="relative text-center w-full max-w-5xl flex justify-center py-2 md:py-4">
            {/* The animated MOOTION text */}
            <svg
              className="w-[80%] md:w-[85%] lg:w-[90%] text-black overflow-visible"
              viewBox={`0 0 ${gridCols * cellSize} ${gridRows * cellSize}`}
            >
              {/* Animated Pixels */}
              <motion.g
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ filter: "drop-shadow(5px 5px 0px rgba(0,0,0,0.2))" }}
              >
                {LETTERS.map((letterData, idx) => (
                  <motion.g key={idx} variants={letterVariants}>
                    {letterData.pixels.map((p, pIdx) => (
                      <motion.rect
                        key={pIdx}
                        x={(letterData.offsetX + p[0] + 1) * cellSize}
                        y={(p[1] + 1) * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill="currentColor"
                        variants={pixelVariants}
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    ))}
                  </motion.g>
                ))}
              </motion.g>
            </svg>
          </div>
          
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 6.0, ease: "easeOut" }}
             className="mt-4 md:mt-6 z-20"
          >
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-black text-white px-6 py-2.5 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-[3px_3px_0_rgba(0,0,0,0.5)] border-2 border-black rounded-lg"
            >
              Start Now
            </button>
          </motion.div>
        </main>

        {/* Illustration Section */}
        <div className="relative flex-1 w-full flex justify-center items-start outline-none pointer-events-none mt-1 md:mt-0 z-0 pb-16">
           {/* The uploaded MOOTION asset image */}
           <motion.div 
             className="relative w-full max-w-7xl flex justify-center h-auto min-h-[300px] md:min-h-[500px]"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 5.2, ease: "easeOut" }}
           >
             <img 
               src="/assests/image2.png" 
               alt="Team Collaboration" 
               className="w-[85%] md:w-[75%] lg:w-[70%] h-auto object-contain object-top drop-shadow-[5px_5px_0_rgba(0,0,0,0.1)]"
             />
           </motion.div>
        </div>

        {/* Grid Fade out (Blur effect to blend into next section) */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-b from-transparent to-[#fafaf8] pointer-events-none z-10" />
        {/* Solid block to cover the last grid line */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-[#fafaf8] pointer-events-none z-10" />
      </div>
      </div>
        
      <GhostSection />
      
      <FooterSection />
    </div>
  );
}

import WorkspaceSelection from './WorkspaceSelection';
import WorkspaceStudy from './WorkspaceStudy';
import WorkspaceSyllabus from './WorkspaceSyllabus';
import ConceptWorkspace from './ConceptWorkspace';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/workspace" element={<WorkspaceSelection />} />
        <Route path="/workspace/study" element={<WorkspaceStudy />} />
        <Route path="/workspace/syllabus" element={<WorkspaceSyllabus />} />
        <Route path="/concept/:nodeId" element={<ConceptWorkspace />} />
      </Routes>
    </Router>
  );
}

