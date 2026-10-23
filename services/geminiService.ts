export interface GeminiAnalysisResult {
  verdict: string;
  authenticityScore: number;
  domainAnalysis: {
    biological: { score: number; status: string; details: string };
    digital: { score: number; status: string; details: string };
    physics: { score: number; status: string; details: string };
  };
  explanation: string;
  findings: string[];
  appliedAlgorithms: string[];
}

/**
 * Executes forensic analysis on the server via /api/forensics/analyze
 */
export const analyzeImageWithGemini = async (
  input: string | string[],
  mediaType: string = 'IMAGE'
): Promise<GeminiAnalysisResult> => {
  try {
    const response = await fetch('/api/forensics/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        mediaType,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data as GeminiAnalysisResult;
  } catch (error) {
    console.error("Gemini Forensic Analysis Service Error:", error);

    return {
      verdict: 'Inconclusive — Further Analysis Required',
      authenticityScore: 0,
      domainAnalysis: {
        biological: { score: 0, status: 'FAIL', details: 'Signal interrupted' },
        digital: { score: 0, status: 'FAIL', details: 'Signal interrupted' },
        physics: { score: 0, status: 'FAIL', details: 'Signal interrupted' }
      },
      explanation: "Analysis pipeline interrupted. Please retry with a clearer sample.",
      findings: ["Pipeline Error"],
      appliedAlgorithms: ["Standard Error Check"]
    };
  }
};

/**
 * Streams forensic analysis narrative from server SSE route
 */
export const streamForensicAnalysis = async (
  input: string | string[],
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const response = await fetch('/api/forensics/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, prompt }),
  });

  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') return;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) onChunk(parsed.text);
        } catch (_) {}
      }
    }
  }
};

/**
 * Connects to the server-side Gemini Live API WebSocket endpoint
 */
export const connectForensicLiveSession = (callbacks: {
  onAudio?: (base64Audio: string) => void;
  onInterrupted?: () => void;
  onError?: (err: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
}): { ws: WebSocket; sendAudio: (base64Pcm: string) => void; close: () => void } => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/live`);

  ws.onopen = () => {
    callbacks.onOpen?.();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.audio && callbacks.onAudio) {
        callbacks.onAudio(data.audio);
      }
      if (data.interrupted && callbacks.onInterrupted) {
        callbacks.onInterrupted();
      }
      if (data.error && callbacks.onError) {
        callbacks.onError(data.error);
      }
    } catch (e) {
      console.error('Failed to parse Live WS message:', e);
    }
  };

  ws.onerror = (e) => {
    callbacks.onError?.(e);
  };

  ws.onclose = () => {
    callbacks.onClose?.();
  };

  return {
    ws,
    sendAudio: (base64Pcm: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ audio: base64Pcm }));
      }
    },
    close: () => {
      ws.close();
    }
  };
};