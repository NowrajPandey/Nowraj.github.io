'use client'
import { motion } from 'framer-motion';
import { Play, Download, Sparkles, Pause, Volume2, FileAudio, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TTSEngineProps {
  isGenerating: boolean;
  audioUrl: string | null;
  onGenerate: () => void;
  onPreview: () => void;
  isDisabled?: boolean;
}

export default function TTSEngine({ isGenerating, audioUrl, onGenerate, onPreview, isDisabled }: TTSEngineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileName, setFileName] = useState('vibe-speech');
  const [isEditing, setIsEditing] = useState(false);
  const [tempFileName, setTempFileName] = useState('vibe-speech');
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioUrl]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleFileNameSave = () => {
    if (tempFileName.trim()) {
      setFileName(tempFileName.trim());
    } else {
      setTempFileName(fileName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFileNameSave();
    } else if (e.key === 'Escape') {
      setTempFileName(fileName);
      setIsEditing(false);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${fileName}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onPreview}
          disabled={isGenerating || isDisabled}
          className="tactile-btn flex-1 flex items-center justify-center gap-2"
        >
          <Sparkles size={18} />
          Preview Line
        </button>

        <button
          onClick={onGenerate}
          disabled={isGenerating || isDisabled}
          className="tactile-btn tactile-btn-primary flex-[2] flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <div className="loading-wave">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>
              <Play size={18} fill="currentColor" />
              Generate Audio
            </>
          )}
        </button>
      </div>

      {audioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                animate={{ 
                  boxShadow: isPlaying 
                    ? '0 0 8px rgba(34, 197, 94, 0.6)' 
                    : '0 0 0px rgba(34, 197, 94, 0)'
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Audio Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-lg px-3 py-1.5 border border-[var(--border-subtle)]">
                <FileAudio size={14} className="text-[var(--accent-color)]" />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={tempFileName}
                      onChange={(e) => setTempFileName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleFileNameSave}
                      className="bg-transparent text-sm outline-none w-24 text-[var(--text-primary)]"
                      placeholder="File name"
                    />
                    <button
                      onClick={handleFileNameSave}
                      className="text-[var(--accent-color)] hover:text-[var(--accent-hover)]"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setTempFileName(fileName);
                      setIsEditing(true);
                    }}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {fileName}.mp3
                  </button>
                )}
              </div>
              <button
                onClick={downloadAudio}
                className="tactile-btn p-2"
                title="Download"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="custom-audio-player">
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            
            <div 
              className="audio-progress-bar"
              onClick={handleProgressClick}
            >
              <div 
                className="audio-progress" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="audio-controls">
              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Volume2 size={14} />
                <span>System</span>
              </div>
              
              <button onClick={togglePlay} className="audio-play-btn">
                {isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" style={{ marginLeft: 2 }} />
                )}
              </button>
              
              <div className="audio-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}