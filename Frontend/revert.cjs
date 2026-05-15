const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

// The string added was `<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\n                     {isLoadingPractice ? (` instead of `{isLoadingPractice ? (`.
// Let's replace ALL instances of `<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\n                     {isLoadingPractice ? (` back to `{isLoadingPractice ? (`
// Then I'll ONLY add it back for `wrong-one`. Wait, I changed the `wrong-one` outer wrapper to `flex flex-col min-h-0` which makes sense if the inner wrapper is `flex-1 overflow-y-auto`. Did I change the outer wrappers for `challenge`, `listen`, `flashcards`? No!
// I also added `\n` literally for the first one somehow ?? Look at grep:
// `<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\n                     <div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">`

code = code.replace(/<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\\n                     <div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">/g, "");
code = code.replace(/<div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">\n                     \{isLoadingPractice \? \(/g, "{isLoadingPractice ? (");
code = code.replace(/<\/div>\n                     <\/div>\n                     \)}/g, ")}"); // Cleanup extra closing divs from earlier if any

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
