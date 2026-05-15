const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

// 1. Fix the top syntax
code = code.replace(
    '<h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileBadge className="w-6 h-6 text-black"/> Teach the AI: {topic}</h3>\\n                        </div>\\n                           <button onClick={handleEndSession}',
    '<h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileBadge className="w-6 h-6 text-black"/> Teach the AI: {topic}</h3>\\n                        {!isSessionEnded && (\\n                           <button onClick={handleEndSession}'
);

// 2. Hide the old prove it chat UI
code = code.replace(
    '                     <div ref={proveItListRef}',
    '                     <div className="hidden" ref={proveItListRef}'
);

// 3. Hide the input area
code = code.replace(
    '                     {!isSessionEnded && (\\n                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 relative">',
    '                     {false && (\\n                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 relative">'
);

// 4. Inject our new Prove it UI immediately before the hidden chat UI
let replacement = `
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
                              className={\`w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center transition-all \${isRecording ? 'bg-red-500 text-white animate-pulse shadow-[0_0_60px_rgba(239,68,68,0.6)]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-md border-8 border-white'}\`}
                           >
                              <Mic className={\`w-12 h-12 \${isRecording ? 'text-white' : 'text-gray-500'}\`} />
                           </button>
                           <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900 mb-2">
                                 {isRecording ? "Live Session Active" : "Tap to Start Teaching"}
                              </p>
                              <p className="text-gray-500 text-lg">
                                 {isRecording ? "Speak clearly into your microphone..." : "The AI student is waiting to learn."}
                              </p>
                           </div>
                        </div>
                     )}
                     <div className="hidden" ref={proveItListRef}
`

code = code.replace('                     <div className="hidden" ref={proveItListRef}', replacement);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Done replacement');
