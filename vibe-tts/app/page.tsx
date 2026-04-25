'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TTSEngine from '../components/TTSEngine';

const VOICES = [
  { id: "en-US-AndrewNeural", name: "Andrew (Bold)", lang: "en-US" },
  { id: "en-US-AvaNeural", name: "Ava (Natural)", lang: "en-US" },
  { id: "en-IN-NeerjaNeural", name: "Neerja (India)", lang: "en-IN" },
  { id: "en-GB-SoniaNeural", name: "Sonia (UK)", lang: "en-GB" },
];

interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  voiceName: string;
  timestamp: Date;
}

export default function VibeTTS() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light');
    }
    
    const savedHistory = localStorage.getItem('ttsHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const playClick = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {}
  };

  const API_URL = typeof window !== 'undefined' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001')
    : 'http://localhost:8001';

  const handleAction = async (preview = false, retryCount = 0) => {
    playClick();
    const content = preview ? text.split(/[.!?]/)[0] : text;
    if (!content || content.trim().length === 0) return;

    setError(null);
    setIsGenerating(true);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch(`${API_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBuffer = await response.arrayBuffer();
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const voiceInfo = VOICES.find(v => v.id === selectedVoice);
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text: content,
        voice: selectedVoice,
        voiceName: voiceInfo?.name || selectedVoice,
        timestamp: new Date(),
      };
      setHistory(prev => {
        const updated = [newItem, ...prev].slice(0, 20);
        localStorage.setItem('ttsHistory', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("TTS Error:", err);
      
      if (retryCount < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return handleAction(preview, retryCount + 1);
      }
      
      setError('Failed to generate audio. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setText(item.text);
    setSelectedVoice(item.voice);
    setShowHistory(false);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center p-6 md:p-12"
      >
        <div className="w-full max-w-3xl space-y-10">
          <header className="flex items-center justify-between">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-6xl font-black tracking-tighter"
            >
              VIBE<span className="text-accent">.</span>TTS
            </motion.h1>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => setShowHistory(true)}
                className="tactile-btn px-4 py-2 text-sm"
              >
                History
              </button>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="tactile-btn p-2"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </motion.div>
          </header>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <textarea
              className="w-full h-64 p-6 text-base md:text-lg outline-none"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            
            <div className="flex items-center justify-between p-4 border-t border-[var(--border-subtle)]">
              <select
                className="tactile-btn px-4 py-2 text-sm cursor-pointer"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
              >
                {VOICES.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              
              <span className="text-sm text-[var(--text-muted)]">
                {text.length} characters
              </span>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TTSEngine
              isGenerating={isGenerating}
              audioUrl={audioUrl}
              onGenerate={() => handleAction(false)}
              onPreview={() => handleAction(true)}
              isDisabled={!text.trim()}
            />
          </motion.div>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="py-8 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <span className="text-xs uppercase tracking-widest">crafted with</span>
            <span className="footer-heart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span className="text-xs uppercase tracking-widest">from</span>
          </div>
          <p className="footer-text">
            <span>Nowraj Pandey</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] italic">
            <span className="love">with love from India</span>
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></span>
            <span className="text-[10px] text-[var(--accent-color)] uppercase tracking-widest">VIBE.TTS</span>
            <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"></span>
          </div>
        </div>
      </motion.footer>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="history-modal"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="tactile-btn p-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3">
                {history.length === 0 ? (
                  <p className="text-center text-[var(--text-muted)] py-8">No history yet</p>
                ) : (
                  history.map(item => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="history-item"
                    >
                      <p className="text-sm truncate">{item.text}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-[var(--text-muted)]">
                        <span>{item.voiceName}</span>
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}