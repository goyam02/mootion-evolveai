const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const oldListenTargetStart = `{expandedPanel === 'listen' && (`;
const oldListenTargetEnd = `            {expandedPanel === 'flashcards' && (`;

let listenStartIndex = code.indexOf(oldListenTargetStart);
let listenEndIndex = code.indexOf(oldListenTargetEnd, listenStartIndex);

if (listenStartIndex !== -1 && listenEndIndex !== -1) {
    let listenReplacement = `{expandedPanel === 'listen' && (
              <div className="w-full h-full flex flex-col items-center relative bg-white overflow-hidden min-h-[400px]">
                  <div className="absolute inset-0 bg-[#fafafa] z-0"></div>
                  {isPlayingListen && <div className="absolute inset-0 bg-gray-100/50 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none z-0"></div>}
                  
                  <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 mt-12 mb-20 relative z-10">
                     <div className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center relative transition-all duration-700 \${isPlayingListen ? 'bg-white shadow-[0_0_80px_rgba(0,0,0,0.06)] border-8 border-white scale-105' : 'bg-gray-100 shadow-sm border-8 border-white'}\`}>
                        <Headphones className={\`w-16 h-16 transition-all duration-700 \${isPlayingListen ? 'text-black' : 'text-gray-400'}\`} />
                     </div>
                     
                     <div className="max-w-md w-full flex flex-col items-center gap-6">
                       {isLoadingPractice ? (
                         <p className="text-sm text-gray-400 animate-pulse tracking-wide font-medium">Synthesizing audio...</p>
                       ) : (
                         <>
                           <div className="min-h-[40px] px-4 w-full flex flex-col items-center justify-center">
                              {displayedListenIndex < 0 ? (
                                <p className="text-[15px] text-gray-400 animate-pulse tracking-wide text-center">Loading audio...</p>
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
