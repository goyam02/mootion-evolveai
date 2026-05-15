const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/gemini-3-flash-preview/g, 'gemini-2.5-flash');
fs.writeFileSync('server.ts', serverCode);

let roadmapCode = fs.readFileSync('src/Roadmap.tsx', 'utf8');
const roadmapTarget = `  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let icon = <Circle className="w-5 h-5 text-gray-300" />;
  
  if (isCompleted) {
    borderColor = 'border-green-600';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-green-600 bg-green-200" />;
  } else if (isInProgress) {
    borderColor = 'border-yellow-500';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-yellow-500 bg-yellow-200" />;
  }`;
const roadmapReplacement = `  let borderColor = 'border-gray-200';
  let bgColor = 'bg-white';
  let icon = <Circle className="w-5 h-5 text-gray-300" />;
  
  if (isCompleted) {
    borderColor = 'border-gray-800';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gray-200" />;
  } else if (isInProgress) {
    borderColor = 'border-gray-400';
    bgColor = 'bg-white';
    icon = <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-100" />;
  }`;
roadmapCode = roadmapCode.replace(roadmapTarget, roadmapReplacement);
fs.writeFileSync('src/Roadmap.tsx', roadmapCode);

let syllabusCode = fs.readFileSync('src/WorkspaceSyllabus.tsx', 'utf8');
syllabusCode = syllabusCode.replace('mt-20', 'mb-20');
fs.writeFileSync('src/WorkspaceSyllabus.tsx', syllabusCode);

let studyCode = fs.readFileSync('src/WorkspaceStudy.tsx', 'utf8');
studyCode = studyCode.replace('mt-20', 'mb-20');
fs.writeFileSync('src/WorkspaceStudy.tsx', studyCode);

console.log("Patched server, roadmap, workspaces");
