import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';

const TOPICS = [
  "Computer Science", "Artificial Intelligence", "Robotics", "Data Science",
  "Mathematics", "Physics", "Chemistry", "Biology", "Engineering",
  "Astronomy", "Electronics", "Machine Learning", "Quantum Computing",
  "Bioinformatics", "Nanotechnology", "Cybersecurity", "Blockchain",
  "Web Development", "Genetics", "Aerospace", "Neuroscience", "Ecology"
];

const AnimatedGridBackground = ({ step }: { step?: number }) => {
  const [activeCells, setActiveCells] = useState<{id: string, r: number, c: number}[]>([]);

  useEffect(() => {
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
          if (r >= 2 && r <= 12 && c >= centerC - 16 && c <= centerC + 16) {
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

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState('');
  const [graspInfo, setGraspInfo] = useState('');
  const [workspaceOption, setWorkspaceOption] = useState<'study' | 'syllabus' | null>(null);
  const [topicToStudy, setTopicToStudy] = useState('');
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSyllabusFile(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg']
    },
    maxFiles: 1
  } as any);

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      if (selectedTopics.length < 5) {
        setSelectedTopics([...selectedTopics, topic]);
      }
    }
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const renderStep = () => {
    const stepProps = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20, position: 'absolute' as const },
      transition: { duration: 0.3, ease: 'easeOut' },
      className: "flex flex-col w-full"
    };

    switch (step) {
      case 1:
        return (
          <motion.div key="step-1" {...stepProps}>
            <h2 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">What should we call you?</h2>
            <p className="text-gray-500 mb-8 font-medium">Let's start with your name.</p>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-4 px-6 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all mb-6"
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step-2" {...stepProps}>
            <h2 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">What's your email?</h2>
            <p className="text-gray-500 mb-8 font-medium">We'll use this to keep your progress safe.</p>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-4 px-6 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all mb-6"
            />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step-3" {...stepProps}>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 leading-[1.15] tracking-tight">Help us personalize<br/>your learning experience.</h2>
            <p className="text-gray-600 mb-8 font-medium">Select up to 5 topics that interest you.</p>
            <div className="flex flex-wrap gap-x-3 gap-y-4">
              {TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'border-[1.5px] border-black text-white bg-black' 
                        : 'border border-gray-100 text-gray-500 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-white'
                    }`}
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </motion.div>
        );
      case 4:
         return (
          <motion.div key="step-4" {...stepProps}>
            <h2 className="text-4xl font-bold mb-3 text-gray-900 leading-[1.15] tracking-tight">How quickly do you grasp information?</h2>
            <p className="text-gray-600 mb-8 font-medium">Be honest, this helps us tailor the pace.</p>
            <div className="w-full flex flex-col gap-4">
              {['Visual (Images/Videos)', 'Auditory (Listening)', 'Reading/Writing', 'Kinesthetic (Doing)'].map((style) => (
                <button
                  key={style}
                  onClick={() => setLearningStyle(style)}
                  className={`w-full py-5 px-6 text-left rounded-xl transition-all duration-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    learningStyle === style
                      ? 'border-[1.5px] border-black bg-black text-white'
                      : 'border border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>
         );
       case 5:
        return (
          <motion.div key="step-5" {...stepProps}>
            <h2 className="text-4xl font-bold mb-3 text-gray-900 leading-[1.15] tracking-tight">What is your learning style?</h2>
             <p className="text-gray-600 mb-8 font-medium">Everyone learns differently.</p>
            <div className="w-full flex flex-col gap-4">
              {['Very quickly', 'Quickly', 'Average pace', 'Take my time'].map((pace) => (
                <button
                  key={pace}
                  onClick={() => setGraspInfo(pace)}
                  className={`w-full py-5 px-6 text-left rounded-xl transition-all duration-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    graspInfo === pace
                      ? 'border-[1.5px] border-black bg-black text-white'
                      : 'border border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (step === 6) {
      navigate('/workspace');
    }
  }, [step, navigate]);

  if (step === 6) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans text-black flex flex-col items-center pt-10 px-8 relative">
      <AnimatedGridBackground step={step} />
      <div className="w-full max-w-3xl flex items-center mb-16 px-4 md:px-0 relative z-10 hidden">
        <div className="flex items-center gap-2">
          {/* Custom logo to loosely reflect the image: Green oval and pink rectangle overlapping */}
          <div className="flex items-center space-x-[-6px]">
             <div className="w-3 h-5 rounded-full bg-[#92d021] shadow-sm z-10" />
             <div className="w-4 h-5 rounded-md bg-[#c03472] transform rotate-12 drop-shadow-sm" />
          </div>
          <span className="font-bold text-[19px] ml-1 tracking-tight text-gray-800">Awesome</span>
        </div>
      </div>

      <div className="w-full max-w-[500px] flex-1 flex flex-col justify-start relative z-10 bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm min-h-[460px] mt-10 mb-10">
        {/* Progress Bars */}
        <div className="w-full mb-10">
          <div className="flex gap-2 mb-3 w-[80%] md:w-[60%]">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden relative">
                 <div 
                   className={`absolute top-0 left-0 h-full w-full transition-all duration-500 ease-out ${
                     s < step ? 'bg-black' : s === step ? 'bg-black' : 'bg-transparent'
                   }`} 
                 />
              </div>
            ))}
          </div>
          <div className="text-[13px] text-gray-400 font-medium">
            {step} of 5
          </div>
        </div>

        <div className="relative w-full flex-1">
          <AnimatePresence mode="popLayout">
            {renderStep()}
          </AnimatePresence>
        </div>
        
        {/* Bottom Navigation */}
        <div className="w-full flex justify-end items-center mt-auto pb-4 pt-16 relative z-20">
          <button 
            onClick={handleNext}
            className="font-semibold text-black hover:text-gray-600 transition-colors flex items-center gap-1 text-base tracking-wide"
          >
            Continue
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
