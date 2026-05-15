const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const micTarget = `className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_60px_rgba(239,68,68,0.6)] border-8 border-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md border-8 border-white'}\`}`;
const micReplacement = `className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-gray-800 text-white animate-pulse shadow-[0_0_40px_rgba(0,0,0,0.1)] border-8 border-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md border-8 border-white'}\`}`;
code = code.replace(micTarget, micReplacement);

const endSessionTopTarget = `                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileBadge className="w-6 h-6 text-black"/> Teach the AI: {topic}</h3>
                        {!isSessionEnded && (
                           <button onClick={handleEndSession} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors">
                              End Session
                           </button>
                        )}
                     </div>`;
const endSessionTopReplacement = `                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileBadge className="w-6 h-6 text-black"/> Teach the AI: {topic}</h3>
                     </div>`;
code = code.replace(endSessionTopTarget, endSessionTopReplacement);

const endSessionBottomTarget = `                           <div className="text-center animate-pulse text-indigo-500 min-h-[30px] font-medium w-full px-8 text-lg">
                               {isRecording && proveItInput.trim() ? proveItInput : ''}
                           </div>
                        </div>`;
const endSessionBottomReplacement = `                           <div className="text-center animate-pulse text-indigo-500 min-h-[30px] font-medium w-full px-8 text-lg">
                               {isRecording && proveItInput.trim() ? proveItInput : ''}
                           </div>
                           <div className="mt-8 pt-6 w-full flex justify-center mt-auto">
                              {!isSessionEnded && (
                                 <button onClick={handleEndSession} className="px-8 py-3 bg-black text-white rounded-full font-medium tracking-wide text-sm hover:bg-gray-800 transition-colors">
                                    End Session
                                 </button>
                              )}
                           </div>
                        </div>`;
code = code.replace(endSessionBottomTarget, endSessionBottomReplacement);

const oldListenTargetStart = `{expandedPanel === 'listen' && (`;
const oldListenTargetEnd = `            {expandedPanel === 'challenge' && (`;

let listenStartIndex = code.indexOf(oldListenTargetStart);
let listenEndIndex = code.indexOf(oldListenTargetEnd, listenStartIndex);

if (listenStartIndex !== -1 && listenEndIndex !== -1) {
    let listenReplacement = `{expandedPanel === 'listen' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative bg-white">
                  {isPlayingListen && <div className="absolute inset-0 bg-gray-50/50 animate-pulse pointer-events-none z-0"></div>}
                  
                  <div className={\`w-48 h-48 rounded-full flex items-center justify-center relative z-10 transition-all duration-700 \${isPlayingListen ? 'bg-gray-50 shadow-[0_0_60px_rgba(0,0,0,0.03)]' : 'bg-transparent'}\`}>
                     <Headphones className={\`w-16 h-16 text-gray-300 transition-all duration-700 \${isPlayingListen ? 'text-gray-800 scale-110' : ''}\`} />
                  </div>
                  
                  <div className="max-w-md w-full mt-16 relative z-10 flex flex-col items-center gap-8">
                    {isLoadingPractice ? (
                      <p className="text-xs text-gray-400 animate-pulse tracking-widest uppercase font-medium">Synthesizing audio...</p>
                    ) : (
                      <>
                        <div className="min-h-[40px] px-4 w-full flex flex-col items-center justify-center">
                           <p className="text-[15px] leading-relaxed text-gray-600 font-medium tracking-wide text-center animate-[fadeIn_0.5s_ease-out] line-clamp-2" key={listenIndex}>
                              {listenSentences[listenIndex] || "Finished."}
                           </p>
                        </div>
                        <div className="flex justify-center gap-3">
                           <button 
                              onClick={() => {
                                 if (isPlayingListen) setIsPlayingListen(false);
                                 else setIsPlayingListen(true);
                              }} 
                              className="w-12 h-12 flex items-center justify-center bg-transparent border border-gray-200 text-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
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
                                 setIsPlayingListen(true);
                              }} 
                              className="w-12 h-12 flex items-center justify-center bg-transparent border border-gray-200 text-gray-500 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
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
    // We must ensure the whitespace matches the original indentation so we don't break following blocks.
    code = code.substring(0, listenStartIndex) + listenReplacement + code.substring(listenEndIndex);
} else {
    console.log("Could not find listen panel indices");
}

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Update executed');
