const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

const target = `                        <div className="flex flex-col gap-4">
                          {listenSentences.map((sentence, index) => (
                            <p 
                              key={index} 
                              className={\`text-xl md:text-2xl font-serif transition-all duration-500 \${
                                index === listenIndex 
                                  ? 'text-black font-semibold scale-105 opacity-100' 
                                  : index < listenIndex 
                                    ? 'text-gray-400 opacity-60' 
                                    : 'text-gray-300 opacity-30'
                              }\`}
                            >
                              {sentence}
                            </p>
                          ))}
                        </div>`;

const replacement = `                        <div className="flex flex-col items-center justify-center min-h-[160px] w-full px-4 overflow-hidden">
                           <p className="text-3xl md:text-4xl font-serif text-black font-medium leading-relaxed tracking-tight text-center" key={listenIndex}>
                              {listenSentences[listenIndex] || "Finished."}
                           </p>
                        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Listen area updated');
