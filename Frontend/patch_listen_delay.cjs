const fs = require('fs');
let code = fs.readFileSync('src/ConceptWorkspace.tsx', 'utf8');

// 1. Add displayedListenIndex state
code = code.replace(
  'const [listenIndex, setListenIndex] = useState(0);',
  'const [listenIndex, setListenIndex] = useState(0);\n  const [displayedListenIndex, setDisplayedListenIndex] = useState(-1);'
);

// 2. Clear displayedListenIndex when listenSentences is fetched
code = code.replace(
  'setListenSentences(data.sentences);',
  'setListenSentences(data.sentences);\n        setDisplayedListenIndex(-1);'
);

// 3. Clear displayedListenIndex if reset via the Restart button
code = code.replace(
  'setListenIndex(0);\n                                 setIsPlayingListen(true);',
  'setListenIndex(0);\n                                 setDisplayedListenIndex(-1);\n                                 setIsPlayingListen(true);'
);


// 4. In playCurrentSentence, set displayedListenIndex right before playing audio
const ttsPlayTarget = `                     const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
                     buffer.getChannelData(0).set(float32Array);
                     
                     if (cancel) return;

                     const playSource = audioCtx.createBufferSource();
                     playSource.buffer = buffer;
                     playSource.connect(audioCtx.destination);
                     listenSourceRef.current = playSource;
                     
                     playSource.start(0);`;

const ttsPlayReplacement = `                     const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
                     buffer.getChannelData(0).set(float32Array);
                     
                     if (cancel) return;

                     const playSource = audioCtx.createBufferSource();
                     playSource.buffer = buffer;
                     playSource.connect(audioCtx.destination);
                     listenSourceRef.current = playSource;
                     
                     setDisplayedListenIndex(listenIndex);
                     playSource.start(0);`;

code = code.replace(ttsPlayTarget, ttsPlayReplacement);

fs.writeFileSync('src/ConceptWorkspace.tsx', code);
console.log('Done listen delay state insertion');
