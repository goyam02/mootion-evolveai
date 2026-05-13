import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { AnimatedGridBackground } from './WorkspaceSelection';

export default function WorkspaceSyllabus() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-[#fafaf8] font-sans text-black flex flex-col pt-20 px-8 relative overflow-hidden">
      <AnimatedGridBackground step={6} />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1 pb-20 items-center mt-12">
         <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-10 shadow-sm relative">
            <button onClick={() => navigate('/workspace')} className="absolute top-8 left-8 text-gray-400 hover:text-black transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div className="mt-12 flex flex-col items-center">
              <h3 className="text-2xl font-medium mb-6">Drop your syllabus</h3>
              <div 
                {...getRootProps()} 
                className={`w-full border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center transition-colors cursor-pointer mb-8 group ${
                  isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 bg-[#fafaf8] hover:bg-gray-50'
                }`}
              >
                  <input {...getInputProps()} />
                  {syllabusFile ? (
                    <>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black mb-4">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <p className="text-black font-medium">{syllabusFile.name}</p>
                      <p className="text-gray-500 text-sm mt-1">Ready to upload</p>
                    </>
                  ) : (
                    <>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 mb-4 group-hover:text-black transition-colors">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <p className="text-gray-600 font-medium group-hover:text-black transition-colors">Click or drag and drop</p>
                      <p className="text-gray-400 text-sm mt-2">PDF, PNG, or JPG (max. 10MB)</p>
                    </>
                  )}
              </div>
              <button 
                className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={() => navigate('/roadmap?type=syllabus')}
                disabled={!syllabusFile}
              >
                Upload and continue
              </button>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
