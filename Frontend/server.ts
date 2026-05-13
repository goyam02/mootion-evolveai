import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer } from "ws";
import http from "http";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });
  const PORT = 3000;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  wss.on("connection", async (clientWs, req) => {
    // Parse topic from url query
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const topic = url.searchParams.get("topic") || "a concept";

    try {
      const session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are an AI learning assistant acting as a student. The user will teach you about ${topic}. Your goal is to ask counter-questions, point out edge cases, or ask for clarification to test their understanding. Be curious and occasionally challenge their explanations slightly (but playfully and constructively) to deepen their knowledge. Keep your responses concise (1-2 sentences).`,
        },
      });

      clientWs.on("message", (data) => {
        try {
          const { audio } = JSON.parse(data.toString());
          if (audio) {
            session.sendRealtimeInput({
              audio: { data: audio, mimeType: "audio/pcm;rate=16000" },
            });
          }
        } catch (error) {
          console.error("Error sending realtime input:", error);
        }
      });

      clientWs.on("close", () => {
        // session.close() is not available or throws error? Just throwing it generally doesn't work often, let's catch it.
        try {
          if (typeof session.close === 'function') session.close();
        } catch(e) {}
      });
    } catch (e) {
      console.error("Live API connection failed: ", e);
      clientWs.close();
    }
  });


  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
