import React, { useState, useEffect, useRef } from 'react';
import { Zap, Sparkles, Video, Play, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Book3D } from './Book3D';

interface Props {
  onExploreClick: () => void;
  onDownloadClick: () => void;
  onPreviewClick: () => void;
}

export const Hero: React.FC<Props> = ({ onExploreClick, onDownloadClick, onPreviewClick }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const TRAILER_ID = 'QdBZY2fkU-0';
  // Preload: website open hote hi iframe silently background me load hoga
  const iframeSrc = `https://www.youtube-nocookie.com/embed/${TRAILER_ID}?autoplay=0&rel=0&modestbranding=1&mute=1`;

  // Preload iframe in DOM as soon as hero mounts (hidden, muted, autoplay=0)
  const preloadRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // After 2s delay (let page settle first), trigger iframe load
    const t = setTimeout(() => {
      if (preloadRef.current) {
        preloadRef.current.src = iframeSrc;
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [iframeSrc]);

  const handleCloseTrailer = () => {
    setIsVideoModalOpen(false);
    setIframeLoaded(false);
  };

  // User's exact local videos
  const videos = [
    '/videos/gta6-bg-video1.mp4',
    '/videos/gta6-bg-video2.mp4',
  ];

  const currentVideo = videos[activeVideoIndex];

  return (
    <div className="relative min-h-[96vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Video Layer - Smooth Cinematic HD Treatment */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#06050a]">
        {/* Desktop Videos (Visible on screens md and up) */}
        <video
          key={`desktop-${currentVideo}`}
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block w-full h-full object-cover object-center transition-all duration-700"
          style={{
            transform: 'translateZ(0)',
            filter: 'brightness(0.85) contrast(1.04) blur(0.6px)',
          }}
          src={currentVideo}
        />

        {/* Mobile Dedicated Video (Visible on mobile screens < md) */}
        <video
          key="mobile-video"
          autoPlay
          loop
          muted
          playsInline
          className="block md:hidden w-full h-full object-cover object-center"
          style={{
            transform: 'translateZ(0)',
            filter: 'brightness(0.88) contrast(1.04) blur(0.4px)',
          }}
          src="/videos/gta6-bg-mobile.mp4"
        />

        {/* Smooth Neon Cinematic Vignette (Soft depth that hides compression noise) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06050a] via-[#06050a]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff007a]/12 via-transparent to-[#00f0ff]/12 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#06050a_92%)] pointer-events-none" />
      </div>

      {/* Switch Background Video Pill - Visible on desktop */}
      <div className="absolute top-24 right-6 z-30 hidden md:block">
        <button
          onClick={() => setActiveVideoIndex((prev) => (prev === 0 ? 1 : 0))}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-xl border border-white/20 text-xs font-rajdhani font-bold text-gray-200 hover:text-white transition-all shadow-xl hover:border-[#ff007a]"
        >
          <Video className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>Switch Video Background ({activeVideoIndex + 1}/2)</span>
        </button>
      </div>

      {/* Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Badge, Description & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-xl mb-6 shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-[#ff007a] animate-ping" />
              <span className="text-xs md:text-sm font-rajdhani font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#ff8c00] to-[#00f0ff]">
                OFFICIAL LEONIDA STATE DIGITAL STORE & ARSENAL
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#ff8c00]" />
            </div>

            {/* Stylized GTA VI Header */}
            <div className="relative mb-3">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-gta tracking-tighter uppercase text-white leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                GRAND THEFT AUTO
              </h1>
              
              {/* Glowing Animated VI */}
              <div className="relative inline-block my-1">
                <span className="text-6xl sm:text-8xl md:text-9xl font-black font-gta italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#9d00ff] drop-shadow-[0_0_40px_rgba(255,0,122,0.85)]">
                  VI
                </span>
                <span className="text-2xl sm:text-4xl md:text-5xl font-black font-gta uppercase text-white ml-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                  DIGITAL STORE
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-gray-200 font-medium leading-relaxed mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Official GTA VI E-Books, 4K YouTube Clickbait Thumbnails, Holographic Sticker Packs & Creator Assets. Everything you need to dominate Vice City.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 max-w-lg mx-auto lg:mx-0 text-left">
              {[
                'Full-Color Illustrated Guides & Blueprints',
                'Ultra HD 4K Photoshop & Canva Assets',
                'Official Vice City & Leonida Maps',
                'Instant One-Click Digital Delivery',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-rajdhani font-semibold text-gray-100 drop-shadow">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              {/* Main Universal Action Button - No static price, clean & versatile */}
              <button
                onClick={onDownloadClick}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ff007a] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-rajdhani font-black text-sm md:text-base uppercase tracking-widest shadow-[0_0_35px_rgba(255,0,122,0.6)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-current animate-pulse text-amber-300" />
                <span>Get Access Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Explore Storefront */}
              <button
                onClick={onExploreClick}
                className="px-6 py-4 rounded-2xl bg-black/60 hover:bg-black/85 backdrop-blur-xl border border-white/20 hover:border-[#ff007a]/60 text-white font-rajdhani font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>View All Products</span>
              </button>

              {/* Watch Trailer / Video Preview */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-6 py-4 rounded-2xl bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/20 hover:border-[#00f0ff]/60 text-white font-rajdhani font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 shadow-xl cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#00f0ff] text-black flex items-center justify-center shadow-[0_0_15px_#00f0ff]">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Watch Trailer</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-xs text-gray-300 font-rajdhani drop-shadow">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Verified Digital Assets
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Instant Delivery to Email
              </span>
            </div>
          </div>

          {/* Right Column: 3D Interactive Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <Book3D
              coverImage="/images/gta6-cover1.jpeg"
              title="GTA VI Vice City Master Walkthrough E-Book"
              price={19.99}
              originalPrice={39.99}
              badge="EXCLUSIVE E-BOOK"
              onDownload={onDownloadClick}
              onPreview={onPreviewClick}
            />
          </div>

        </div>
      </div>

      {/* ── Hidden Preload iframe (loads in background silently, muted, paused) ── */}
      {/* Page open hote hi YouTube connection warm up hoti hai — modal open hote hi instant playback */}
      <iframe
        ref={preloadRef}
        title="trailer-preload"
        className="sr-only pointer-events-none"
        style={{ position: 'fixed', width: 1, height: 1, opacity: 0, top: -9999, left: -9999 }}
        allow="autoplay"
      />

      {/* Official Trailer Modal — Instant play (preloaded) */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-[#ff007a]/50 shadow-[0_0_50px_rgba(255,0,122,0.4)] bg-black">
            {/* Close Button */}
            <button
              onClick={handleCloseTrailer}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all hover:border-[#ff007a]"
            >
              ✕
            </button>

            {/* Loading shimmer shown while iframe initializes */}
            {!iframeLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black">
                {/* Pulsing GTA VI logo */}
                <div className="flex flex-col items-center gap-3 animate-pulse">
                  <div className="text-5xl font-black font-gta italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#9d00ff] drop-shadow-[0_0_30px_rgba(255,0,122,0.9)]">
                    VI
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff007a] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#ff5e00] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm font-rajdhani text-gray-400 uppercase tracking-widest">
                    Loading Trailer…
                  </span>
                </div>
              </div>
            )}

            {/* Live autoplay iframe */}
            <iframe
              key="trailer-live"
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${TRAILER_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Grand Theft Auto VI Official Trailer 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
