const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const wrongOneTarget = `                           <button 
                              key={index} 
                              onClick={() => {
                                 if (wrongOneStatus !== 'completed') {
                                    setWrongOneSelected(index);
                                 }
                              }}
                              className={\`w-full text-left p-6 rounded-2xl border-2 transition-all \${
                                 wrongOneSelected === null
                                    ? 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 bg-white'
                                    : index === wrongOneData[currentWrongOneQ]?.incorrectStatementIndex
                                       ? 'border-red-500 bg-red-50 text-red-900'
                                       : wrongOneSelected === index
                                          ? 'border-gray-300 bg-gray-50'
                                          : 'border-gray-100 opacity-50 bg-white'
                              }\`}
                              disabled={wrongOneStatus === 'completed' || wrongOneSelected !== null}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 \${
                                    wrongOneSelected !== null && index === wrongOneData[currentWrongOneQ]?.incorrectStatementIndex
                                       ? 'bg-red-500 text-white'
                                       : 'bg-gray-100 text-gray-500'
                                 }\`}>
                                    {String.fromCharCode(65 + index)}
                                 </div>
                                 <span className="text-lg font-medium leading-relaxed">{opt}</span>
                              </div>
                           </button>`;

const wrongOneReplacement = `                           <button 
                              key={index} 
                              onClick={() => {
                                 if (wrongOneStatus !== 'completed') {
                                    setWrongOneSelected(index);
                                 }
                              }}
                              className={\`w-full text-left p-6 rounded-2xl border-2 transition-all \${
                                 wrongOneSelected === null
                                    ? 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 bg-white text-gray-800'
                                    : index === wrongOneData[currentWrongOneQ]?.incorrectStatementIndex
                                       ? 'border-gray-800 bg-gray-50 text-gray-900'
                                       : wrongOneSelected === index
                                          ? 'border-gray-300 bg-gray-50 text-gray-800'
                                          : 'border-gray-100 opacity-50 bg-white text-gray-800'
                              }\`}
                              disabled={wrongOneStatus === 'completed' || wrongOneSelected !== null}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 \${
                                    wrongOneSelected !== null && index === wrongOneData[currentWrongOneQ]?.incorrectStatementIndex
                                       ? 'bg-gray-800 text-white'
                                       : 'bg-gray-100 text-gray-500'
                                 }\`}>
                                    {String.fromCharCode(65 + index)}
                                 </div>
                                 <span className="text-lg font-medium leading-relaxed">{opt}</span>
                              </div>
                           </button>`;

code = code.replace(wrongOneTarget, wrongOneReplacement);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Wrong-one patch executed');
