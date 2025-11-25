"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function AudioPlayer({ audioUrl, title, onEnded }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Ignore AbortError which happens when pause() is called while play() is pending
          if (error.name !== "AbortError") {
            console.error("Audio play failed:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  // Auto-play when audio source changes
  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
      setProgress(0);
    }
  }, [audioUrl]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (onEnded) onEnded();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-lg p-4 shadow-lg transition-transform duration-300 translate-y-0">
      <div className="container mx-auto flex items-center justify-between gap-4 max-w-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-1" />
            )}
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">Now Playing</p>
            <p className="text-xs text-slate-500 truncate max-w-[200px]">{title}</p>
          </div>
        </div>

        <div className="flex-1 mx-4">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <audio
          ref={audioRef}
          src={audioUrl}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}
