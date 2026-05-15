const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Navigation updates
const navTarget = `          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            <a href="#" className="text-black relative group">
              Home
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-black"></span>
            </a>
            <a href="#" className="hover:text-black transition-colors">About Us</a>
            <a href="#" className="hover:text-black transition-colors">Blog</a>
            <a href="#" className="hover:text-black transition-colors">Q&A</a>
          </div>`;

const navReplacement = `          <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
            <a href="#" className="text-black relative group">
              Home
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-black"></span>
            </a>
            <a href="#about" className="hover:text-black transition-colors">About Us</a>
            <a href="#contact" className="hover:text-black transition-colors">Contact Us</a>
          </div>`;

code = code.replace(navTarget, navReplacement);

// 2. Add id="about"
code = code.replace(
  '<section className="w-full min-h-screen bg-[#fafaf8] flex flex-col justify-center sticky top-0">',
  '<section id="about" className="w-full min-h-screen bg-[#fafaf8] flex flex-col justify-center sticky top-0">'
);

// 3. Add id="contact" to the bottom section. Let's find the footer wrapper.
// It is around line 440: `<div className="w-full bg-[#e2e8f0] pt-24 pb-12 flex flex-col relative overflow-hidden z-30 font-sans">`
code = code.replace(
  '<div className="w-full bg-[#e2e8f0] pt-24 pb-12 flex flex-col relative overflow-hidden z-30 font-sans">',
  '<div id="contact" className="w-full bg-[#e2e8f0] pt-24 pb-12 flex flex-col relative overflow-hidden z-30 font-sans">'
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for Navigation');
