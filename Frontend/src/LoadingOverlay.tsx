import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  type: 'text' | 'document';
}

export default function LoadingOverlay({ type }: LoadingOverlayProps) {
  const textMessages = [
    "Processing Knowledge base...",
    "Finding relevant information...",
    "Structuring concepts...",
    "Generating roadmap..."
  ];

  const docMessages = [
    "Reading the document...",
    "Extracting the knowledge base...",
    "Making logical connections...",
    "Generating roadmap..."
  ];

  const messages = type === 'text' ? textMessages : docMessages;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showNextMessage = () => {
      setCurrentMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      // Random delay between 2s and 4.5s
      const nextDelay = Math.floor(Math.random() * (4500 - 2000 + 1) + 2000);
      timeoutId = setTimeout(showNextMessage, nextDelay);
    };

    // First delay
    const firstDelay = Math.floor(Math.random() * (4500 - 2000 + 1) + 2000);
    timeoutId = setTimeout(showNextMessage, firstDelay);

    return () => clearTimeout(timeoutId);
  }, [messages.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl"
    >
      <div className="relative w-24 h-24 mb-12">
        <svg className="w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#000000" strokeWidth="4" strokeDasharray="60 190" strokeLinecap="round" className="animate-[dash_2s_ease-in-out_infinite]" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#6b7280" strokeWidth="4" strokeDasharray="40 148" strokeLinecap="round" className="animate-[dash_2s_ease-in-out_infinite_reverse] opacity-70" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="20 105" strokeLinecap="round" className="animate-[dash_1.5s_ease-in-out_infinite] opacity-50" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>

      <div className="h-10 relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="absolute text-xl font-medium text-gray-800 tracking-tight"
          >
            {messages[currentMessageIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

       <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 250; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -250; }
        }
      `}</style>
    </motion.div>
  );
}
