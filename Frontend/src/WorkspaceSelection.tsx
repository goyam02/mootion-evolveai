import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const AnimatedGridBackground = ({ step }: { step?: number }) => {
  const [activeCells, setActiveCells] = React.useState<{id: string, r: number, c: number}[]>([]);

  React.useEffect(() => {
    const update = () => {
      const cols = Math.ceil(window.innerWidth / 24);
      const rows = Math.ceil(window.innerHeight / 24);
      
      const newActive = [];
      const now = Date.now();
      let attempts = 0;
      for (let i = 0; i < 40 && attempts < 200; attempts++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        
        let exclude = false;
        if (step === 6) {
          const centerC = Math.floor(cols / 2);
          if (r >= 5 && r <= 20 && c >= centerC - 16 && c <= centerC + 16) {
            exclude = true;
          }
        }

        if (!exclude) {
          newActive.push({
            id: `cell-${i}-${now}`,
            r,
            c,
          });
          i++;
        }
      }
      setActiveCells(newActive);
    };

    update();
    const interval = setInterval(update, 3500);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
         style={{ 
            backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            backgroundPosition: 'center top'
         }}>
         <AnimatePresence>
         {activeCells.map(cell => (
            <motion.div 
              key={cell.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="absolute bg-gray-400 opacity-40"
              style={{
                top: cell.r * 24,
                left: cell.c * 24,
                width: 24,
                height: 24,
              }}
            />
         ))}
         </AnimatePresence>
    </div>
  );
};

export default function WorkspaceSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans text-black flex flex-col justify-center items-center px-8 relative overflow-hidden">
      <AnimatedGridBackground step={6} />
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col justify-center items-center mt-20">
        <motion.div 
           initial={{ opacity: 0, y: 20 }} 
           animate={{ opacity: 1, y: 0 }} 
           className="w-full text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">What do you want to learn?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto auto-rows-fr">
           <motion.button 
             initial={{ opacity: 0, scale: 0.9, y: 30 }} 
             animate={{ opacity: 1, scale: 1, y: 0 }} 
             transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
             onClick={() => navigate('/workspace/study')}
             className="bg-white border border-gray-200 rounded-[2rem] p-10 flex flex-col items-start text-left hover:shadow-xl hover:-translate-y-1 transition-all group relative h-[340px]"
           >
             <h3 className="text-[2.2rem] leading-tight font-medium mb-4 text-gray-900 tracking-tight">I know what I want to study</h3>
             <p className="text-gray-500 text-lg leading-relaxed pr-8">
               Type a specific topic like Gravitation, Organic Chemistry, or Calculus.
             </p>
             <div className="mt-auto">
               <div className="border border-black rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-medium group-hover:bg-black group-hover:text-white transition-colors">
                 Text Input
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
               </div>
             </div>
           </motion.button>

           <motion.button 
             initial={{ opacity: 0, scale: 0.9, y: 30 }} 
             animate={{ opacity: 1, scale: 1, y: 0 }} 
             transition={{ duration: 0.5, delay: 0.25, type: "spring", stiffness: 100 }}
             onClick={() => navigate('/workspace/syllabus')}
             className="bg-white border border-gray-200 rounded-[2rem] p-10 flex flex-col items-start text-left hover:shadow-xl hover:-translate-y-1 transition-all group relative h-[340px]"
           >
             <h3 className="text-[2.2rem] leading-tight font-medium mb-4 text-gray-900 tracking-tight">I have a syllabus</h3>
             <p className="text-gray-500 text-lg leading-relaxed pr-8">
               Upload a PDF or image of your syllabus to get started.
             </p>
             <div className="mt-auto">
               <div className="border border-black rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-medium group-hover:bg-black group-hover:text-white transition-colors">
                 Upload File
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
               </div>
             </div>
           </motion.button>
        </div>
      </div>
    </div>
  );
}
