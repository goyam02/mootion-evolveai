const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

code = code.replace(
  '<div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10 overflow-y-auto">',
  '<div className="w-full h-full p-4 md:p-8 relative z-10 flex items-center justify-center">'
);

code = code.replace(
  '<div className="w-full max-w-4xl bg-white border border-gray-100 shadow-xl rounded-3xl p-10 mt-auto mb-auto">',
  '<div className="w-full max-w-4xl max-h-full bg-white border border-gray-100 shadow-xl rounded-3xl flex flex-col min-h-0">'
);

code = code.replace(
  '<div className="flex justify-between items-center mb-8">',
  '<div className="p-6 md:p-10 pb-6 shrink-0 border-b border-gray-50 flex justify-between items-center z-10">'
);

code = code.replace(
  '{isLoadingPractice ? (',
  '<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\\n                     {isLoadingPractice ? ('
);

code = code.replace(
  '<div className="flex flex-col gap-8">',
  '<div className="flex flex-col gap-6">'
);

code = code.replace(
  '<div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">',
  '<div className="bg-white p-2 rounded-2xl">'
);

code = code.replace(
  '<p className="font-semibold text-xl mb-6 text-red-600">Which statement is INCORRECT?</p>',
  '<p className="font-semibold text-lg md:text-xl mb-6 text-gray-900">Which statement is INCORRECT?</p>'
);

code = code.replace(
  '<div className="mt-4 flex justify-end">',
  '<div className="mt-2 flex justify-end shrink-0">'
);

const stringToFind = `                                    </button>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <div className="text-center py-12 flex flex-col items-center">`;

const replaceWith = `                                    </button>
                                 </div>
                              )}
                           </div>
                           </div>
                        ) : (
                           <div className="text-center py-12 flex flex-col items-center">`;

code = code.replace(stringToFind, replaceWith);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
