const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const target = `             {expandedPanel === 'wrong-one' && (
               <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10 overflow-y-auto">
                  <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-xl rounded-3xl p-10 mt-auto mb-auto">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FileX className="w-6 h-6 text-black"/> Find the WRONG Statement: {topic}</h3>
                        {wrongOneData.length > 0 && wrongOneStatus === 'playing' && (
                           <div className="flex items-center gap-4">
                              <div className={\`font-mono text-lg font-bold \${wrongOneTimeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}\`}>
                                 00:{wrongOneTimeLeft.toString().padStart(2, '0')}
                              </div>
                              <div className="text-gray-500 font-medium">Question {currentWrongOneQ + 1} of {wrongOneData.length}</div>
                           </div>
                        )}
                     </div>

                     {isLoadingPractice ? (
                        <div className="text-center py-10 animate-pulse text-gray-500">Generating trick questions...</div>
                     ) : wrongOneData.length > 0 ? (
                        wrongOneStatus === 'playing' ? (
                           <div className="flex flex-col gap-8">
                              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                 <p className="font-semibold text-xl mb-6 text-red-600">Which statement is INCORRECT?</p>
                                 <div className="grid grid-cols-1 gap-3 mb-4">
                                    {wrongOneData[currentWrongOneQ].options.map((opt: string, optIdx: number) => (
                                      <button 
                                         key={optIdx} 
                                         onClick={() => {
                                             setWrongOneSelected(optIdx);
                                             if (optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex) {
                                                setWrongOneScore(s => s + 1);
                                             }
                                         }}
                                         disabled={wrongOneSelected !== null}
                                         className={\`border text-left shadow-sm rounded-2xl p-5 font-medium transition-all \${
                                            wrongOneSelected === null 
                                             ? 'bg-white border-gray-200 hover:border-black text-gray-800' 
                                             : optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex
                                                ? 'bg-green-50 border-green-500 text-green-900'
                                                : wrongOneSelected === optIdx
                                                   ? 'bg-red-50 border-red-500 text-red-900'
                                                   : 'bg-white border-gray-200 text-gray-400 opacity-50'
                                         }\`}
                                      >
                                         <div className="flex items-center gap-3">
                                            <div className={\`w-6 h-6 rounded border flex items-center justify-center text-sm \${wrongOneSelected !== null && optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex ? 'bg-green-500 border-green-600 text-white' : 'border-gray-300'}\`}>
                                               {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            {opt}
                                         </div>
                                      </button>
                                    ))}
                                 </div>
                                 {wrongOneSelected !== null && (
                                    <div className="mt-4 p-5 bg-blue-50 text-blue-900 text-sm rounded-xl border border-blue-100">
                                       <span className="font-bold text-base block mb-2">Explanation:</span> 
                                       {wrongOneData[currentWrongOneQ].explanation}
                                    </div>
                                 )}
                              </div>
                              {wrongOneSelected !== null && (
                                 <div className="mt-4 flex justify-end">
                                    <button 
                                       onClick={() => {
                                          if (currentWrongOneQ < wrongOneData.length - 1) {
                                             setCurrentWrongOneQ(q => q + 1);
                                             setWrongOneSelected(null);
                                             setWrongOneTimeLeft(30);
                                          } else {
                                             setWrongOneStatus('completed');
                                          }
                                       }}
                                       className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                                    >
                                       {currentWrongOneQ < wrongOneData.length - 1 ? 'Next Question' : 'View Results'}
                                    </button>
                                 </div>
                              )}
                           </div>
                        ) : (`;

const replacement = `             {expandedPanel === 'wrong-one' && (
               <div className="w-full h-full flex p-4 md:p-8 relative z-10 items-center justify-center">
                  <div className="w-full max-w-4xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl flex flex-col min-h-0 max-h-full">
                     <div className="p-6 md:p-10 pb-6 shrink-0">
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3"><FileX className="w-6 h-6 text-black"/> Find the WRONG Statement: {topic}</h3>
                           {wrongOneData.length > 0 && wrongOneStatus === 'playing' && (
                              <div className="flex items-center gap-4">
                                 <div className={\`font-mono text-lg font-bold \${wrongOneTimeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-700'}\`}>
                                    00:{wrongOneTimeLeft.toString().padStart(2, '0')}
                                 </div>
                                 <div className="text-gray-500 font-medium">Question {currentWrongOneQ + 1} of {wrongOneData.length}</div>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="px-6 md:px-10 pb-6 md:pb-10 flex-1 overflow-y-auto min-h-0">
                     {isLoadingPractice ? (
                        <div className="text-center py-10 animate-pulse text-gray-500">Generating trick questions...</div>
                     ) : wrongOneData.length > 0 ? (
                        wrongOneStatus === 'playing' ? (
                           <div className="flex flex-col gap-6">
                              <div className="bg-white p-2 rounded-2xl">
                                 <p className="font-semibold text-lg md:text-xl mb-6 text-gray-900">Which statement is INCORRECT?</p>
                                 <div className="grid grid-cols-1 gap-3 mb-4">
                                    {wrongOneData[currentWrongOneQ].options.map((opt: string, optIdx: number) => (
                                      <button 
                                         key={optIdx} 
                                         onClick={() => {
                                             setWrongOneSelected(optIdx);
                                             if (optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex) {
                                                setWrongOneScore(s => s + 1);
                                             }
                                         }}
                                         disabled={wrongOneSelected !== null}
                                         className={\`border text-left shadow-sm rounded-2xl p-5 font-medium transition-all \${
                                            wrongOneSelected === null 
                                             ? 'bg-white border-gray-200 hover:border-black text-gray-800' 
                                             : optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex
                                                ? 'bg-green-50 border-green-500 text-green-900'
                                                : wrongOneSelected === optIdx
                                                   ? 'bg-red-50 border-red-500 text-red-900'
                                                   : 'bg-white border-gray-200 text-gray-400 opacity-50'
                                         }\`}
                                      >
                                         <div className="flex items-center gap-3">
                                            <div className={\`w-6 h-6 rounded border flex items-center justify-center text-sm shrink-0 \${wrongOneSelected !== null && optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex ? 'bg-green-500 border-green-600 text-white' : wrongOneSelected === optIdx && optIdx !== wrongOneData[currentWrongOneQ].wrongAnswerIndex ? 'bg-red-500 border-red-600 text-white' : 'border-gray-300'}\`}>
                                               {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            {opt}
                                         </div>
                                      </button>
                                    ))}
                                 </div>
                                 {wrongOneSelected !== null && (
                                    <div className="mt-6 p-5 bg-blue-50 text-blue-900 text-sm rounded-xl border border-blue-100">
                                       <span className="font-bold text-base block mb-2">Explanation:</span> 
                                       {wrongOneData[currentWrongOneQ].explanation}
                                    </div>
                                 )}
                              </div>
                              {wrongOneSelected !== null && (
                                 <div className="mt-2 flex justify-end shrink-0">
                                    <button 
                                       onClick={() => {
                                          if (currentWrongOneQ < wrongOneData.length - 1) {
                                             setCurrentWrongOneQ(q => q + 1);
                                             setWrongOneSelected(null);
                                             setWrongOneTimeLeft(30);
                                          } else {
                                             setWrongOneStatus('completed');
                                          }
                                       }}
                                       className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors w-full md:w-auto"
                                    >
                                       {currentWrongOneQ < wrongOneData.length - 1 ? 'Next Question' : 'View Results'}
                                    </button>
                                 </div>
                              )}
                           </div>
                        ) : (`;

code = code.replace(target, replacement);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
