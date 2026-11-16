import React, { useState } from 'react';
import { Zap, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface Props {
  coverImage: string;
  title: string;
  price?: number;
  originalPrice?: number;
  badge?: string;
  onDownload: () => void;
  onPreview: () => void;
}

export const Book3D: React.FC<Props> = ({
  coverImage,
  title,
  badge = 'EXCLUSIVE ASSET',
  onDownload,
  onPreview,
}) => {
  const [rotate, setRotate] = useState({ x: 8, y: -15 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 18;
    const rotateY = ((x - centerX) / centerX) * 22;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 8, y: -15 });
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* 3D Perspective Stage */}
      <div
        className="relative perspective-1500 cursor-pointer group"
        onMouseMove={(e) => {
          setIsHovered(true);
          handleMouseMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        onClick={onPreview}
      >
        {/* Glowing Backlight Flare */}
        <div 
          className="absolute -inset-6 rounded-full blur-[60px] opacity-75 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,122,0.45) 0%, rgba(255,94,0,0.3) 40%, transparent 70%)',
          }}
        />

        {/* 3D Book Object */}
        <div
          className="relative w-64 sm:w-72 md:w-80 aspect-[1/1.42] preserve-3d transition-transform duration-200 ease-out book-shadow rounded-r-2xl"
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          }}
        >
          {/* Front Cover */}
          <div className="absolute inset-0 rounded-r-2xl overflow-hidden border border-white/20 bg-[#0d0b17] shadow-2xl">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover object-center filter contrast-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/gta6-cover1.jpeg';
              }}
            />

            {/* Gloss Sheen Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `linear-gradient(${120 + rotate.y * 2}deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)`,
                opacity: isHovered ? 0.7 : 0.35,
              }}
            />

            {/* Top Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 text-[10px] font-rajdhani font-black tracking-widest text-white uppercase rounded bg-gradient-to-r from-[#ff007a] to-[#ff5e00] shadow-md border border-white/20">
                {badge}
              </span>
            </div>

            {/* Bottom Information Bar (No static price) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/85 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-rajdhani uppercase text-gray-400 font-bold block">
                    Official Guide
                  </span>
                  <span className="text-sm font-black font-rajdhani text-white uppercase tracking-wider">
                    Leonida Companion
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-rajdhani font-bold text-[#00f0ff] uppercase bg-black/60 px-2.5 py-1 rounded border border-[#00f0ff]/30">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Mockup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Book Spine (Left 3D Edge) */}
          <div
            className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-[#140f24] via-[#2d1b46] to-[#0d0a17] origin-left border-y border-l border-white/20 flex items-center justify-center"
            style={{
              transform: 'rotateY(-90deg) translateX(-32px)',
            }}
          >
            <span className="text-[9px] font-rajdhani font-bold tracking-widest uppercase text-gray-300 -rotate-90 whitespace-nowrap">
              GTA VI MASTER COMPANION
            </span>
          </div>

          {/* Page Thickness (Right Edge Pages) */}
          <div
            className="absolute top-1 bottom-1 right-0 w-6 bg-gradient-to-l from-[#e6e2d8] via-[#cdc7b7] to-[#aea898] origin-right rounded-r-sm"
            style={{
              transform: 'rotateY(90deg) translateX(24px)',
              boxShadow: 'inset 0 0 5px rgba(0,0,0,0.4)',
            }}
          />
        </div>

        {/* Floating 3D Hint */}
        <div className="text-center mt-6">
          <span className="text-[11px] font-rajdhani font-semibold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5 group-hover:text-[#ff007a] transition-colors">
            <span>🖱️ Hover to rotate in 3D • Click for Details</span>
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ff007a] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-rajdhani font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,0,122,0.5)] active:scale-95 cursor-pointer"
          type="button"
        >
          <Zap className="w-4 h-4 fill-current text-amber-300" />
          <span>Get Access Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onPreview}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-rajdhani font-bold text-xs uppercase tracking-wider border border-white/15 transition-all cursor-pointer"
          type="button"
        >
          <BookOpen className="w-4 h-4 text-[#00f0ff]" />
          <span>Quick Preview</span>
        </button>
      </div>
    </div>
  );
};
