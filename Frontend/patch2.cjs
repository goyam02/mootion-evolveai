const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

// 1. replace outer wrapper
code = code.replace(
  /<div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10 overflow-y-auto">\s*/g,
  '<div className="w-full h-full p-4 md:p-8 relative z-10 flex items-center justify-center">\n'
);

// 2. replace inner wrapper
code = code.replace(
  /<div className="w-full max-w-4xl bg-white border border-gray-100 shadow-xl rounded-3xl p-10 mt-auto mb-auto">\s*/g,
  '<div className="w-full max-w-4xl max-h-full bg-white border border-gray-100 shadow-xl rounded-3xl flex flex-col min-h-0">\n'
);

// 3. header wrapper
code = code.replace(
  /<div className="flex justify-between items-center mb-8">/g,
  '<div className="p-6 md:p-10 pb-6 shrink-0 border-b border-gray-50 flex justify-between items-center z-10">'
);

// 4. loading wrapper -> add scrollable container wrapper
code = code.replace(
  /\{isLoadingPractice \? \(/g,
  '<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\n                     {isLoadingPractice ? ('
);

// 5. playing flex col
code = code.replace(
  /<div className="flex flex-col gap-8">/g,
  '<div className="flex flex-col gap-6">'
);

// 6. question wrapper
code = code.replace(
  /<div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">/g,
  '<div className="bg-white p-2 rounded-2xl">'
);

// 7. Question title
code = code.replace(
  /<p className="font-semibold text-xl mb-6 text-red-600">Which statement is INCORRECT\?<\/p>/g,
  '<p className="font-semibold text-lg md:text-xl mb-6 text-gray-900">Which statement is INCORRECT?</p>'
);

// 8. Add extra div close to match the scrollable body open
// Let's find: `) : (\n                           <div className="text-center py-12 flex flex-col items-center">`
code = code.replace(
  /\) : \(\s*<div className="text-center py-12 flex flex-col items-center">/g,
  ') : (\n                           <div className="text-center py-12 flex flex-col items-center">'
);

// Actually, injecting an extra div close is tricky with regex. Let's find the specific block end:
let blockEndIndex = code.lastIndexOf('No trick questions available.</div>\n                     )}');
if(blockEndIndex !== -1) {
    code = code.slice(0, blockEndIndex) + '</div>\n                     ' + code.slice(blockEndIndex);
}


fs.writeFileSync('src/ConceptWorkspace.tsx', code);
