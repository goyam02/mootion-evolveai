import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Settings2, Globe, FileBadge, Zap, Headphones, ArrowUp, ArrowLeft, Mic, Layers, FileX } from 'lucide-react';

const pcmToBase64 = (pcmData: Float32Array) => {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < pcmData.length; i++) {
    let s = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

type ExpandedPanel = 'none' | 'storyboard' | 'playground' | 'universe' | 'prove-it' | 'challenge' | 'listen' | 'flashcards' | 'stop';

export default function ConceptWorkspace() {
  const { nodeId } = useParams();
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'Topic Name';
  const navigate = useNavigate();

  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>('none');
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      text: `Hey! Let's explore ${topic}. What would you like to start with — a quick video, or jump straight into the orbit simulator?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const isLeftExpanded = expandedPanel === 'storyboard' || expandedPanel === 'playground' || expandedPanel === 'universe';
  const isRightExpanded = expandedPanel === 'prove-it' || expandedPanel === 'challenge' || expandedPanel === 'listen' || expandedPanel === 'flashcards' || expandedPanel === 'stop';

  const stopRecording = () => {
    if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
     return stopRecording;
  }, []);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    setIsRecording(true);

    try {
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        audioCtxRef.current = audioCtx;
        nextStartTimeRef.current = audioCtx.currentTime;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/live?topic=${encodeURIComponent(topic)}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
        source.connect(processor);
        processor.connect(audioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
            ws.send(JSON.stringify({ audio: base64 }));
          }
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            const binary = atob(msg.audio);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const int16Array = new Int16Array(bytes.buffer);
            const float32Array = new Float32Array(int16Array.length);
            for (let i = 0; i < int16Array.length; ++i) {
              float32Array[i] = int16Array[i] / 32768;
            }
            const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 16000);
            audioBuffer.getChannelData(0).set(float32Array);
            
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            if (nextStartTimeRef.current < now) nextStartTimeRef.current = now;
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
          }
          if (msg.interrupted) {
             nextStartTimeRef.current = audioCtx.currentTime;
          }
        };

        ws.onclose = stopRecording;
        ws.onerror = stopRecording;
    } catch(e) {
        console.error("Mic error:", e);
        stopRecording();
    }
  };

  const handleSendMessage = (e?: React.FormEvent, preset?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = preset || inputValue;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { id: Date.now().toString(), role: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInputValue('');
    
    // Simulate thinking and options appearing
    if (textToSend.toLowerCase().includes('orbit')) {
       setTimeout(() => {
         setShowOptions(true);
       }, 800);
    } else {
        setTimeout(() => {
             setMessages([...newMsgs, { id: Date.now().toString(), role: 'assistant', text: `That's interesting! Let's dive deeper into ${textToSend}.` }]);
        }, 800);
    }
  };

  return (
    <div className="h-screen w-full bg-[#fafaf8] flex p-4 gap-4 overflow-hidden relative"
         style={{ backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: 'center top' }}>
      {/* LEFT SIDEBAR - VISUAL SPACE */}
      <motion.div 
        layout
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        animate={{
          width: expandedPanel === 'none' ? '280px' : isLeftExpanded ? 'calc(100% - 384px)' : '0px',
          opacity: isRightExpanded ? 0 : 1,
          pointerEvents: isRightExpanded ? 'none' : 'auto',
          borderWidth: isRightExpanded ? '0px' : '1px'
        }}
        className="bg-white rounded-3xl border-gray-200 shadow-sm flex flex-col h-full flex-shrink-0 relative overflow-hidden"
      >
        <div className="p-5 flex items-center gap-2 border-b border-gray-100 pb-4">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
           <h2 className="font-semibold text-gray-800">Visual space</h2>
        </div>
        
        {isLeftExpanded ? (
          <div className="flex-1 w-full h-full bg-gray-50 flex flex-col items-center justify-center relative">
            <button 
              onClick={() => setExpandedPanel('none')} 
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100 z-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            {expandedPanel === 'storyboard' && <div className="text-xl font-medium text-gray-500 flex flex-col items-center gap-4"><Play className="w-12 h-12 text-blue-500" /> Storyboard Player...</div>}
            {expandedPanel === 'playground' && <div className="text-xl font-medium text-gray-500 flex flex-col items-center gap-4"><Settings2 className="w-12 h-12 text-green-500" /> Interactive Simulation...</div>}
            {expandedPanel === 'universe' && <div className="text-xl font-medium text-gray-500 flex flex-col items-center gap-4"><Globe className="w-12 h-12 text-indigo-500" /> 3D Universe View...</div>}
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3 flex-1">
             <button onClick={() => setExpandedPanel('storyboard')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-blue-100 text-blue-600 rounded-full p-2.5">
                   <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Storyboard</h3>
                   <p className="text-xs text-gray-500">Kepler's laws</p>
                </div>
             </button>
             
             <button onClick={() => setExpandedPanel('playground')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-green-100 text-green-600 rounded-full p-2.5">
                   <Settings2 className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Playground</h3>
                   <p className="text-xs text-gray-500">Orbit simulator</p>
                </div>
             </button>

             <button onClick={() => setExpandedPanel('universe')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-indigo-100 text-indigo-600 rounded-full p-2.5">
                   <Globe className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Universe</h3>
                   <p className="text-xs text-gray-500">Solar system</p>
                </div>
             </button>
          </div>
        )}
      </motion.div>

      {/* CENTER CHAT */}
      <motion.div 
        layout
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        animate={{
            width: expandedPanel === 'none' ? 'calc(100% - 624px)' : isRightExpanded ? '320px' : '320px',
            opacity: 1
        }}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col h-full flex-shrink-0 overflow-hidden"
      >
        <div className="p-5 flex items-center justify-between border-b border-gray-100 pb-4">
           <div className="flex items-center gap-3">
              <button onClick={() => navigate('/roadmap')} className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-black" />
              </button>
              <h2 className="font-semibold text-gray-900">{topic}</h2>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
           {messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                 msg.role === 'user' 
                  ? 'bg-indigo-50 text-indigo-950 rounded-br-sm' 
                  : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'
               }`}>
                  {msg.text}
               </div>
             </div>
           ))}
           
           {showOptions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 mt-2"
              >
                  <p className="text-sm text-gray-500 ml-2">Choose an interactive tool:</p>
                  <div className="flex flex-wrap gap-2">
                     <button onClick={() => setExpandedPanel('storyboard')} className="border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 text-sm font-medium transition-colors">Storyboard</button>
                     <button onClick={() => setExpandedPanel('playground')} className="border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 text-sm font-medium transition-colors">Playground</button>
                     <button onClick={() => setExpandedPanel('universe')} className="border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 text-sm font-medium transition-colors">Universe</button>
                     <button onClick={() => setExpandedPanel('listen')} className="border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 text-sm font-medium transition-colors">Listen</button>
                  </div>
              </motion.div>
           )}
        </div>

        <div className="p-4 pt-2">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                 type="text" 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Ask anything about this topic..."
                 className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
              />
              <button 
                 type="submit" 
                 disabled={!inputValue.trim()}
                 className="absolute right-2 top-2 bottom-2 bg-black text-white rounded-xl w-10 flex items-center justify-center disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                 <ArrowUp className="w-5 h-5" />
              </button>
            </form>
        </div>
      </motion.div>

      {/* RIGHT SIDEBAR - PRACTICE SPACE */}
      <motion.div 
        layout
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        animate={{
          width: expandedPanel === 'none' ? '280px' : isRightExpanded ? 'calc(100% - 384px)' : '0px',
          opacity: isLeftExpanded ? 0 : 1,
          pointerEvents: isLeftExpanded ? 'none' : 'auto',
          borderWidth: isLeftExpanded ? '0px' : '1px'
        }}
        className="bg-white rounded-3xl border-gray-200 shadow-sm flex flex-col h-full flex-shrink-0 relative overflow-hidden"
      >
        <div className="p-5 flex items-center gap-2 border-b border-gray-100 pb-4 relative z-10 bg-white">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
           <h2 className="font-semibold text-gray-800">Practice space</h2>
        </div>
        
        {isRightExpanded ? (
          <div className="flex-1 w-full h-full bg-gray-50 flex flex-col items-center justify-center relative">
            <button 
              onClick={() => setExpandedPanel('none')} 
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-100 z-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            {expandedPanel === 'prove-it' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10">
                 <div className="w-full max-w-2xl bg-white border border-gray-100 shadow-xl rounded-3xl p-12 text-center flex flex-col items-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">Teach the AI</h3>
                    <button onClick={toggleRecording} className="w-32 h-32 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100 hover:bg-green-100 hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-green-200 text-green-500 mb-8 relative group">
                       {isRecording ? <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div> : <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping group-hover:hidden"></div>}
                       <Mic className={`w-12 h-12 relative z-10 ${isRecording ? 'animate-pulse text-green-600' : ''}`} />
                    </button>
                    <p className="text-gray-500 text-lg">
                       {isRecording ? "Listening & thinking... Speak your mind." : `Click to start speaking. I will ask counter-questions to test your understanding of ${topic}.`}
                    </p>
                 </div>
              </div>
            )}
            {expandedPanel === 'challenge' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative z-10">
                 <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-xl rounded-3xl p-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3"><Zap className="w-6 h-6 text-orange-500"/> Interactive Quiz: {topic}</h3>
                    <div className="flex gap-10">
                       <div className="flex-1 space-y-4">
                          <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400 font-medium text-center h-20 flex items-center justify-center">Drag correct answer here</div>
                          <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400 font-medium text-center h-20 flex items-center justify-center">Drag correct answer here</div>
                          <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-gray-400 font-medium text-center h-20 flex items-center justify-center">Drag correct answer here</div>
                       </div>
                       <div className="w-72 space-y-4">
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 cursor-move hover:border-blue-400 hover:shadow-md font-semibold text-gray-800 transition-all active:scale-95 flex items-center gap-3"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Gravity</div>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 cursor-move hover:border-blue-400 hover:shadow-md font-semibold text-gray-800 transition-all active:scale-95 flex items-center gap-3"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Mass</div>
                          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 cursor-move hover:border-blue-400 hover:shadow-md font-semibold text-gray-800 transition-all active:scale-95 flex items-center gap-3"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> Orbit</div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
            {expandedPanel === 'listen' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
                  <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none z-0"></div>
                  <div className="w-64 h-64 rounded-full bg-blue-50 flex items-center justify-center border-8 border-blue-100 shadow-[0_0_80px_rgba(59,130,246,0.3)] relative z-10 text-blue-500 animate-[bounce_4s_infinite]">
                     <Headphones className="w-24 h-24" />
                  </div>
                  <p className="mt-12 text-2xl font-semibold text-blue-900 relative z-10 tracking-tight">Listening to AI explaining {topic}...</p>
              </div>
            )}
            {expandedPanel === 'flashcards' && <div className="text-xl font-medium text-gray-500 flex flex-col items-center gap-4 relative z-10"><Layers className="w-12 h-12 text-purple-500" /> Flashcards Interface...</div>}
            {expandedPanel === 'stop' && <div className="text-xl font-medium text-gray-500 flex flex-col items-center gap-4 relative z-10"><FileX className="w-12 h-12 text-rose-500" /> Stop / Report Issue...</div>}
          </div>
        ) : (
           <div className="p-4 flex flex-col gap-3 flex-1">
             <button onClick={() => setExpandedPanel('prove-it')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-amber-100 text-amber-700 rounded-full p-2.5">
                   <FileBadge className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Prove It</h3>
                   <p className="text-xs text-gray-500">Teach the AI</p>
                </div>
             </button>
             
             <button onClick={() => setExpandedPanel('challenge')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-red-50 text-red-600 rounded-full p-2.5">
                   <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Challenge</h3>
                   <p className="text-xs text-gray-500">3 questions ready</p>
                </div>
             </button>

             <button onClick={() => setExpandedPanel('listen')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-blue-50 text-blue-600 rounded-full p-2.5">
                   <Headphones className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Listen</h3>
                   <p className="text-xs text-gray-500">Audio lessons</p>
                </div>
             </button>

             <button onClick={() => setExpandedPanel('flashcards')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-purple-100 text-purple-600 rounded-full p-2.5">
                   <Layers className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Flashcards</h3>
                   <p className="text-xs text-gray-500">Review concepts</p>
                </div>
             </button>

             <button onClick={() => setExpandedPanel('stop')} className="bg-gray-50 border border-gray-100 hover:border-gray-300 rounded-2xl p-4 flex items-center gap-4 transition-all text-left">
                <div className="bg-rose-100 text-rose-600 rounded-full p-2.5">
                   <FileX className="w-5 h-5" />
                </div>
                <div>
                   <h3 className="font-semibold text-gray-900 pb-0.5">Wrong one</h3>
                   <p className="text-xs text-gray-500">Stop / Report</p>
                </div>
             </button>
          </div>
        )}
        
      </motion.div>
    </div>
  );
}
