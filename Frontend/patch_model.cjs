const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/gemini-2\.5-flash/g, 'gemini-3-flash-preview');
fs.writeFileSync('server.ts', serverCode);
console.log('Replaced gemini-2.5-flash with gemini-3-flash-preview');
