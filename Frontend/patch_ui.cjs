const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

// --- 1. Fix Prove-It Centering ---
const proveItMainTarget = `                     ) : (
                        <div className="flex-1 w-full flex flex-col items-center justify-center gap-10 min-h-[400px]">
                           <button 
                              onClick={toggleRecording} 
                              className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-gray-800 text-white animate-pulse shadow-[0_0_40px_rgba(0,0,0,0.1)] border-8 border-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md border-8 border-white'}\`}
                           >
                              <Mic className={\`w-20 h-20 \${isRecording ? 'text-white' : 'text-gray-500'}\`}/>
                           </button>
                           <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900 mb-2">
                                 {isRecording ? "Live Session Active" : "Tap to Start Teaching"}
                              </p>
                              <p className="text-gray-500 text-lg">
                                 {isRecording ? "Speak clearly into your microphone..." : "The AI student is waiting to learn."}
                              </p>
                           </div>
                           <div className="text-center animate-pulse text-indigo-500 min-h-[30px] font-medium w-full px-8 text-lg">
                               {isRecording && proveItInput.trim() ? proveItInput : ''}
                           </div>
                           <div className="mt-8 pt-6 w-full flex justify-center mt-auto">
                              {!isSessionEnded && (
                                 <button onClick={handleEndSession} className="px-8 py-3 bg-black text-white rounded-full font-medium tracking-wide text-sm hover:bg-gray-800 transition-colors">
                                    End Session
                                 </button>
                              )}
                           </div>
                        </div>
                     )}`;

const proveItMainReplacement = `                     ) : (
                        <div className="flex-1 w-full flex flex-col items-center relative min-h-[400px]">
                           <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 mt-12 mb-20">
                               <button 
                                  onClick={toggleRecording} 
                                  className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-gray-800 text-white animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_40px_rgba(0,0,0,0.15)] border-8 border-white' : 'bg-[#f4f4f5] text-gray-500 hover:bg-[#e4e4e7] shadow-sm border-8 border-white'}\`}
                               >
                                  <Mic className={\`w-16 h-16 \${isRecording ? 'text-white' : 'text-gray-400'}\`}/>
                               </button>
                               <div className="text-center">
                                  <p className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">
                                     {isRecording ? "Listening..." : "Tap to Start Teaching"}
                                  </p>
                                  <p className="text-gray-500 text-[15px]">
                                     {isRecording ? "Speak clearly into your microphone..." : "The AI student is waiting to learn."}
                                  </p>
                               </div>
                               <div className="text-center animate-pulse text-indigo-500 min-h-[30px] font-medium w-full px-8 text-lg">
                                   {isRecording && proveItInput.trim() ? proveItInput : ''}
                               </div>
                           </div>
                           <div className="absolute bottom-4 w-full flex justify-center">
                              {!isSessionEnded && (
                                 <button onClick={handleEndSession} className="px-10 py-3.5 bg-black text-white rounded-full font-semibold tracking-wide hover:bg-gray-800 transition-colors shadow-md">
                                    End Session
                                 </button>
                              )}
                           </div>
                        </div>
                     )}`;

code = code.replace(proveItMainTarget, proveItMainReplacement);

// --- 2. Fix Listen UI ---
const oldListenTargetStart = `{expandedPanel === 'listen' && (`;
const oldListenTargetEnd = `            {expandedPanel === 'flashcards' && (`;

let listenStartIndex = code.indexOf(oldListenTargetStart);
let listenEndIndex = code.indexOf(oldListenTargetEnd, listenStartIndex);

if (listenStartIndex !== -1 && listenEndIndex !== -1) {
    let listenReplacement = `{expandedPanel === 'listen' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative bg-white overflow-hidden">
                  <div className="absolute inset-0 bg-[#fafafa] z-0"></div>
                  {isPlayingListen && <div className="absolute inset-0 bg-gray-100/50 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none z-0"></div>}
                  
                  <div className={\`w-48 h-48 rounded-full flex items-center justify-center relative z-10 transition-all duration-700 \${isPlayingListen ? 'bg-white shadow-[0_0_80px_rgba(0,0,0,0.06)] scale-105' : 'bg-gray-100 shadow-sm'}\`}>
                     <Headphones className={\`w-20 h-20 transition-all duration-700 \${isPlayingListen ? 'text-black' : 'text-gray-400'}\`} />
                  </div>
                  
                  <div className="max-w-md w-full mt-16 relative z-10 flex flex-col items-center gap-8">
                    {isLoadingPractice ? (
                      <p className="text-xs text-gray-400 animate-pulse tracking-widest uppercase font-medium">Synthesizing audio...</p>
                    ) : (
                      <>
                        <div className="min-h-[40px] px-4 w-full flex flex-col items-center justify-center">
                           {displayedListenIndex < 0 ? (
                             <p className="text-sm text-gray-400 animate-pulse tracking-wide text-center">Loading audio...</p>
                           ) : (
                             <p className="text-base leading-relaxed text-gray-800 font-medium tracking-wide text-center animate-[fadeIn_0.5s_ease-out] line-clamp-2" key={displayedListenIndex}>
                                {listenSentences[displayedListenIndex] || "Finished."}
                             </p>
                           )}
                        </div>
                        <div className="flex justify-center gap-3">
                           <button 
                              onClick={() => {
                                 if (isPlayingListen) setIsPlayingListen(false);
                                 else setIsPlayingListen(true);
                              }} 
                              className="w-12 h-12 flex items-center justify-center bg-transparent border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none"
                              title={isPlayingListen ? 'Pause' : 'Play'}
                           >
                              {isPlayingListen ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                              ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                              )}
                           </button>
                           <button 
                              onClick={() => {
                                 setListenIndex(0);
                                 setDisplayedListenIndex(-1);
                                 setIsPlayingListen(true);
                              }} 
                              className="w-12 h-12 flex items-center justify-center bg-transparent border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none"
                              title="Restart"
                           >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                           </button>
                        </div>
                      </>
                    )}
                  </div>
              </div>
            )}
`;
    code = code.substring(0, listenStartIndex) + listenReplacement + code.substring(listenEndIndex);
} else {
    console.log("Could not find listen panel indices");
}

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Update executed');
