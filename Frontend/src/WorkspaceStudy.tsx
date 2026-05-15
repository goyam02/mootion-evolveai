import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedGridBackground } from './WorkspaceSelection';
import LoadingOverlay from './LoadingOverlay';

export default function WorkspaceStudy() {
  const navigate = useNavigate();
  const [topicToStudy, setTopicToStudy] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLearning = async () => {
    if (!topicToStudy.trim()) return;
    setIsLoading(true);

    try {
      const startTime = Date.now();
      const response = await fetch('/api/generate-roadmap/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToStudy })
      });
      if (!response.ok) {
        let errorMsg = `Server error: ${response.status} ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch(e) {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      
      const elapsed = Date.now() - startTime;
      const minLoadingTime = 9000;
      if (elapsed < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed));
      }

      navigate(`/roadmap?topic=${encodeURIComponent(topicToStudy)}`, { state: { roadmapData: data } });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert("Failed to generate roadmap.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans text-black flex flex-col justify-center items-center px-8 relative overflow-hidden">
      <AnimatedGridBackground step={6} />
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col justify-center items-center">
         <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-10 shadow-sm relative overflow-hidden mt-20">
            <AnimatePresence>
                {isLoading && <LoadingOverlay type="text" />}
            </AnimatePresence>

            <button onClick={() => navigate('/workspace')} className="absolute top-8 left-8 text-gray-400 hover:text-black transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="mt-12 flex flex-col items-center">
              <h3 className="text-2xl font-medium mb-6 text-center">Enter your topic</h3>
              <input 
                type="text" 
                value={topicToStudy}
                onChange={(e) => setTopicToStudy(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleStartLearning(); }}
                placeholder="e.g. Gravitation, Calculus..." 
                className="w-full bg-[#fafaf8] border border-gray-300 rounded-2xl py-5 px-6 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all mb-8 text-lg text-center"
                autoFocus
              />
              <div className="flex justify-center">
                <button 
                  className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50" 
                  onClick={handleStartLearning}
                  disabled={!topicToStudy.trim() || isLoading}
                >
                  Start Learning
                </button>
              </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
