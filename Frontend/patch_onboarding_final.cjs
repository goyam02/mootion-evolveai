const fs = require('fs');
let code = fs.readFileSync('src/Onboarding.tsx', 'utf8');

// Container
code = code.replace(
  /<div className="min-h-screen bg-\[#fafaf8\] font-sans text-black flex flex-col items-center pt-10 px-8 relative">/g,
  '<div className="h-screen h-[100dvh] overflow-hidden bg-[#fafaf8] font-sans text-black flex flex-col items-center justify-center p-4 md:p-8 relative">'
);

code = code.replace(
  /<div className="w-full max-w-\[500px\] flex-1 flex flex-col justify-start relative z-10 bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm min-h-\[460px\] mt-10 mb-10">/g,
  '<div className="w-full max-w-[500px] flex flex-col relative z-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm h-[520px] max-h-full">'
);

// Progress bars layout 
code = code.replace(
  /<div className="w-full mb-10">/g,
  '<div className="w-full mb-6 shrink-0">'
);

// Body wrapper
code = code.replace(
  /<div className="relative w-full flex-1">/g,
  '<div className="relative w-full flex-1 min-h-0">'
);

// Bottom nav
code = code.replace(
  /<div className="w-full flex justify-end items-center mt-auto pb-4 pt-16 relative z-20">/g,
  '<div className="w-full flex justify-end items-center mt-4 shrink-0 relative z-20">'
);

// Step props
code = code.replace(
  /className: "flex flex-col w-full"/g,
  'className: "flex flex-col w-full h-full"'
);

// Step 1
code = code.replace(
  /case 1:\s*return \(\s*<motion\.div key="step-1" \{\.\.\.stepProps\}>\s*<h2 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">What should we call you\?<\/h2>\s*<p className="text-gray-500 mb-8 font-medium">Let's start with your name\.<\/p>\s*<input[^>]+>\s*<\/motion\.div>/m,
  `case 1:
        return (
          <motion.div key="step-1" {...stepProps}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-[1.15] tracking-tight shrink-0">What should we call you?</h2>
            <p className="text-gray-600 mb-6 font-medium shrink-0">Let's start with your name.</p>
            <div className="flex flex-col justify-center flex-1 min-h-0">
               <input 
                 type="text" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="Enter your name" 
                 className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 md:py-4 px-5 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all mb-2"
               />
            </div>
          </motion.div>`
);

// Step 2
code = code.replace(
  /case 2:\s*return \(\s*<motion\.div key="step-2" \{\.\.\.stepProps\}>\s*<h2 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">What's your email\?<\/h2>\s*<p className="text-gray-500 mb-8 font-medium">We'll use this to keep your progress safe\.<\/p>\s*<input[^>]+>\s*<\/motion\.div>/m,
  `case 2:
        return (
          <motion.div key="step-2" {...stepProps}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-[1.15] tracking-tight shrink-0">What's your email?</h2>
            <p className="text-gray-600 mb-6 font-medium shrink-0">We'll use this to keep your progress safe.</p>
            <div className="flex flex-col justify-center flex-1 min-h-0">
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="Enter your email" 
                 className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 md:py-4 px-5 text-black placeholder-gray-400 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all mb-2"
               />
            </div>
          </motion.div>`
);

// Step 3
code = code.replace(
  /case 3:\s*return \(\s*<motion\.div key="step-3" \{\.\.\.stepProps\}>\s*<h2 className="[A-Za-z0-9\s\-_\[\]\.<>\/]+<\/h2>\s*<p className="[A-Za-z0-9\s\-_]+">Select up to 5 topics that interest you\.<\/p>\s*<div className="flex flex-wrap gap-x-3 gap-y-4">[\s\S]*?<\/div>\s*<\/motion\.div>/m,
  `case 3:
        return (
          <motion.div key="step-3" {...stepProps}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-[1.15] tracking-tight shrink-0">Help us personalize<br/>your learning experience.</h2>
            <p className="text-gray-600 mb-4 font-medium shrink-0">Select up to 5 topics that interest you.</p>
            <div className="flex flex-wrap gap-2 overflow-y-auto min-h-0 content-start flex-1 pb-4 pr-2">
              {TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={\`px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 \${
                      isSelected 
                        ? 'border-[1.5px] border-black text-white bg-black' 
                        : 'border border-gray-100 text-gray-500 hover:border-gray-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-white'
                    }\`}
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </motion.div>`
);

// Step 4
code = code.replace(
  /case 4:\s*return \(\s*<motion\.div key="step-4" \{\.\.\.stepProps\}>\s*<h2 className="[A-Za-z0-9\s\-_\[\]\.<>\/]+<\/h2>\s*<p className="[A-Za-z0-9\s\-_]+">Be honest, this helps us tailor the pace\.<\/p>\s*<div className="w-full flex flex-col gap-4">[\s\S]*?<\/div>\s*<\/motion\.div>/m,
  `case 4:
         return (
          <motion.div key="step-4" {...stepProps}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-[1.15] tracking-tight shrink-0">How quickly do you grasp information?</h2>
            <p className="text-gray-600 mb-4 font-medium shrink-0">Be honest, this helps us tailor the pace.</p>
            <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 justify-center">
              {['Visual (Images/Videos)', 'Auditory (Listening)', 'Reading/Writing', 'Kinesthetic (Doing)'].map((style) => (
                <button
                  key={style}
                  onClick={() => setLearningStyle(style)}
                  className={\`w-full py-3 md:py-4 px-5 text-left rounded-xl transition-all duration-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0 \${
                    learningStyle === style
                      ? 'border-[1.5px] border-black bg-black text-white'
                      : 'border border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                  }\`}
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>`
);

// Step 5
code = code.replace(
  /case 5:\s*return \(\s*<motion\.div key="step-5" \{\.\.\.stepProps\}>\s*<h2 className="[A-Za-z0-9\s\-_\[\]\.<>\/]+<\/h2>\s*<p className="[A-Za-z0-9\s\-_]+">Everyone learns differently\.<\/p>\s*<div className="w-full flex flex-col gap-4">[\s\S]*?<\/div>\s*<\/motion\.div>/m,
  `case 5:
        return (
          <motion.div key="step-5" {...stepProps}>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 leading-[1.15] tracking-tight shrink-0">What is your learning style?</h2>
             <p className="text-gray-600 mb-4 font-medium shrink-0">Everyone learns differently.</p>
            <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 justify-center">
              {['Very quickly', 'Quickly', 'Average pace', 'Take my time'].map((pace) => (
                <button
                  key={pace}
                  onClick={() => setGraspInfo(pace)}
                  className={\`w-full py-3 md:py-4 px-5 text-left rounded-xl transition-all duration-200 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0 \${
                    graspInfo === pace
                      ? 'border-[1.5px] border-black bg-black text-white'
                      : 'border border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                  }\`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </motion.div>`
);

fs.writeFileSync('src/Onboarding.tsx', code);
