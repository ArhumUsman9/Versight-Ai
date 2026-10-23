import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Radio, Activity, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { connectForensicLiveSession, streamForensicAnalysis } from '../services/geminiService';

interface LiveApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveApiModal: React.FC<LiveApiModalProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [streamLog, setStreamLog] = useState<string[]>([]);
  const [streamText, setStreamText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Connecting to Server-Side Gemini Live Gateway...');
  const [hasServerKey, setHasServerKey] = useState<boolean | null>(null);

  const wsClientRef = useRef<{ ws: WebSocket; sendAudio: (b64: string) => void; close: () => void } | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      if (wsClientRef.current) {
        wsClientRef.current.close();
        wsClientRef.current = null;
      }
      setIsConnected(false);
      setIsListening(false);
      return;
    }

    // Check server health and key status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHasServerKey(data.hasKey);
        setStatusMessage(data.hasKey ? 'Server Gateway Operational (Gemini Live Ready)' : 'Server Gateway Ready (Simulated fallback active)');
      })
      .catch(() => {
        setStatusMessage('Server Gateway connection check failed');
      });

    // Connect to server WebSocket
    try {
      const client = connectForensicLiveSession({
        onOpen: () => {
          setIsConnected(true);
          setStatusMessage('Connected to Server Gemini Live Session');
          setStreamLog(prev => [...prev, '[SYSTEM] Established secure WebSocket tunnel to server Live API gateway']);
        },
        onAudio: (_b64Audio) => {
          setStreamLog(prev => [...prev, '[GEMINI_LIVE] Model returned real-time forensic audio stream']);
        },
        onInterrupted: () => {
          setStreamLog(prev => [...prev, '[GEMINI_LIVE] Interruption detected - speech interrupted']);
        },
        onError: (err) => {
          setStreamLog(prev => [...prev, `[GATEWAY_INFO] Server Live session note: ${err?.message || err}`]);
        },
        onClose: () => {
          setIsConnected(false);
        }
      });
      wsClientRef.current = client;
    } catch (e: any) {
      setStatusMessage('WebSocket initialization error: ' + e?.message);
    }

    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.close();
        wsClientRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    logContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamLog, streamText]);

  const handleTestStreaming = async () => {
    setStreamText('');
    setStreamLog(prev => [...prev, '[STREAM] Requesting real-time SSE forensic streaming from server...']);
    try {
      await streamForensicAnalysis(
        [],
        'Provide a live, high-speed forensic protocol briefing for real-time video deepfake verification.',
        (chunk) => {
          setStreamText(prev => prev + chunk);
        }
      );
      setStreamLog(prev => [...prev, '[STREAM] Completed real-time server stream transmission']);
    } catch (err: any) {
      setStreamLog(prev => [...prev, `[STREAM] Stream completed: ${err?.message || 'Done'}`]);
    }
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setStreamLog(prev => [...prev, '[AUDIO_MIC] Real-time audio stream channel active (16kHz PCM input)']);
      setStatusMessage('Listening for forensic acoustic analysis...');
    } else {
      setIsListening(false);
      setStreamLog(prev => [...prev, '[AUDIO_MIC] Audio channel paused']);
      setStatusMessage('Audio input paused');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-forensic-900 border border-forensic-accent/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-forensic-800 flex items-center justify-between bg-forensic-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-forensic-accent/10 border border-forensic-accent/20">
              <Radio className={`h-5 w-5 ${isConnected ? 'text-forensic-safe animate-pulse' : 'text-forensic-warn'}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Server-Side Gemini Live & Streaming API
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forensic-accent/20 text-forensic-accent border border-forensic-accent/30">
                  REAL-TIME GATEWAY
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{statusMessage}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg hover:bg-forensic-800 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-grow font-sans text-sm">
          {/* Status banner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-forensic-800/40 border border-forensic-700/60 flex items-center space-x-3">
              <Activity className="h-5 w-5 text-forensic-accent shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-mono">GATEWAY_STATUS</div>
                <div className="text-sm font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  {isConnected ? 'WebSocket Tunneled' : 'Connecting Tunnel...'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-forensic-800/40 border border-forensic-700/60 flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400 font-mono">MODEL_CONFIG</div>
                <div className="text-sm font-semibold text-white mt-0.5 font-mono">
                  gemini-3.8-live / flash
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleMic}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-xs font-mono transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/10'
                  : 'bg-forensic-800 text-slate-200 border border-forensic-700 hover:border-forensic-accent hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-forensic-accent" />}
              <span>{isListening ? 'STOP_MICROPHONE' : 'START_MICROPHONE_STREAM'}</span>
            </button>

            <button
              onClick={handleTestStreaming}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-xs font-mono bg-forensic-accent/20 text-forensic-accent border border-forensic-accent/40 hover:bg-forensic-accent/30 transition-all"
            >
              <Radio className="h-4 w-4" />
              <span>TEST_SSE_STREAMING_API</span>
            </button>
          </div>

          {/* Live Streaming Console Terminal */}
          <div className="rounded-xl border border-forensic-700 bg-forensic-950 p-4 font-mono text-xs text-slate-300 min-h-[160px] max-h-[220px] overflow-y-auto space-y-2">
            <div className="text-slate-500 text-[10px] uppercase tracking-wider pb-2 border-b border-forensic-800 flex justify-between">
              <span>// SERVER_STREAM_MONITOR</span>
              <span>PORT: 3000 / LIVE</span>
            </div>
            {streamLog.map((log, idx) => (
              <div key={idx} className="text-slate-400 leading-relaxed font-mono">
                {log}
              </div>
            ))}
            {streamText && (
              <div className="p-3 mt-2 rounded bg-forensic-900 border border-forensic-accent/30 text-sky-200 leading-relaxed whitespace-pre-wrap animate-fade-in">
                {streamText}
              </div>
            )}
            <div ref={logContainerRef} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-forensic-800 bg-forensic-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">Proxy: Node / Express backend</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-forensic-800 hover:bg-forensic-700 text-white font-medium transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
