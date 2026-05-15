const fs = require('fs');

let studyCode = fs.readFileSync('src/WorkspaceStudy.tsx', 'utf8');
studyCode = studyCode.replace(' mb-20', '');
fs.writeFileSync('src/WorkspaceStudy.tsx', studyCode);

let syllabusCode = fs.readFileSync('src/WorkspaceSyllabus.tsx', 'utf8');
syllabusCode = syllabusCode.replace(' mb-20', '');
fs.writeFileSync('src/WorkspaceSyllabus.tsx', syllabusCode);

console.log('Removed mb-20 from workspaces completely');
