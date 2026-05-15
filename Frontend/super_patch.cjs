const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const startMarker = '                 <div className="flex-1 w-full max-w-4xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl p-6 flex flex-col mt-auto mb-auto relative">';

let startIndex = code.indexOf(startMarker);
if (startIndex !== -1) {
    let replacement = startMarker + `
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileBadge className="w-6 h-6 text-black"/> Teach the AI: {topic}</h3>
                        {!isSessionEnded && (
                           <button onClick={handleEndSession} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors">
                              End Session
                           </button>
                        )}
                     </div>
                     {isSessionEnded ? (
                        <div className="flex-1 w-full flex flex-col items-center justify-center pt-8">
                           <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm w-full">
                              <h4 className="text-xl font-bold text-gray-900 mb-4">Session Wrap-up</h4>
                              {isProveItLoading ? (
                                 <div className="animate-pulse text-gray-500">Generating your feedback...</div>
                              ) : (
                                 <div className="text-left leading-relaxed text-gray-800 whitespace-pre-wrap">
                                    {proveItMessages[proveItMessages.length - 1]?.text}
                                 </div>
                              )}
                           </div>
                           <button onClick={() => {
                              setIsSessionEnded(false);
                              setProveItMessages([{ role: 'model', text: '' }]);
                           }} className="mt-8 px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors">
                              Try Again
                           </button>
                        </div>
                     ) : (
                        <div className="flex-1 w-full flex flex-col items-center justify-center gap-10 min-h-[400px]">
                           <button 
                              onClick={toggleRecording} 
                              className={\`w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_60px_rgba(239,68,68,0.6)] border-8 border-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md border-8 border-white'}\`}
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
                        </div>
                     )}
                     <div className="hidden" ref={proveItListRef}></div>
                  </div>
               </div>
            )}
            {expandedPanel === 'challenge' && (`

    const oldSegmentEnd = `            {expandedPanel === 'challenge' && (`
    let realEndIndex = code.indexOf(oldSegmentEnd, startIndex);
    if (realEndIndex !== -1) {
        let newCode = code.substring(0, startIndex) + replacement + code.substring(realEndIndex + oldSegmentEnd.length);
        fs.writeFileSync('src/ConceptWorkspace.tsx', newCode);
        console.log("SUCCESS");
    } else {
        console.log("COULD NOT FIND END INDEX");
    }
} else {
    console.log("COULD NOT FIND START MARKER");
}
