const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

code = code.replace(
  /className=\{`w-6 h-6 rounded border flex items-center justify-center text-sm \$\{wrongOneSelected !== null && optIdx === wrongOneData\[currentWrongOneQ\]\.wrongAnswerIndex \? 'bg-green-500 border-green-600 text-white' : 'border-gray-300'\}`\}/g,
  'className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm shrink-0 font-bold ${wrongOneSelected !== null && optIdx === wrongOneData[currentWrongOneQ].wrongAnswerIndex ? \\'bg-green-500 border-green-600 text-white\\' : wrongOneSelected === optIdx && optIdx !== wrongOneData[currentWrongOneQ].wrongAnswerIndex ? \\'bg-red-500 border-red-600 text-white\\' : \\'border-gray-200 text-gray-500 bg-gray-50\\'}`}'
);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
