import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Royalty-free 80s synthwave / vice city atmosphere loop
  // Hosted on stable royalty-free CDN
  const audioUrl = 'https://assets.mixkit.co/music/preview/mixkit-synthwave-game-play-882.mp3';

  useEffect(() => {
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play was prevented:', err);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    audioRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div 
        onClick={togglePlay}
        className={`group flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-2xl backdrop-blur-xl border ${
          isPlaying 
            ? 'bg-[#18122B]/90 border-[#ff007a] shadow-[0_0_25px_rgba(255,0,122,0.4)]' 
            : 'bg-[#0f0e17]/80 border-white/10 hover:border-[#ff007a]/60'
        }`}
      >
        <div className={`p-2 rounded-full ${isPlaying ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white animate-spin' : 'bg-white/10 text-gray-300'}`} style={{ animationDuration: '6s' }}>
          <Radio className="w-4 h-4" />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-rajdhani font-bold tracking-widest text-[#00f0ff] uppercase">
              VICE CITY FM
            </span>
            {isPlaying && (
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff007a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff007a]"></span>
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors">
            {isPlaying ? 'Neon Boulevard' : 'Play Theme Audio'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 text-gray-300">
          <button
            type="button"
            className="p-1 hover:text-white transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          {isPlaying && (
            <button
              type="button"
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
      
      {!hasInteracted && (
        <div className="absolute bottom-14 right-0 mb-1 px-3 py-1 bg-black/90 border border-[#ff007a]/40 rounded-lg text-[11px] text-gray-300 whitespace-nowrap animate-bounce shadow-lg pointer-events-none">
          🎵 Click for GTA VI Vice City Vibe!
        </div>
      )}
    </div>
  );
};
