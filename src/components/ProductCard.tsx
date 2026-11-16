import React, { useState } from 'react';
import { Zap, Star, Eye, BookOpen, Image as ImageIcon, Flame, Package, ArrowRight } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onQuickView }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryBadge = () => {
    switch (product.category) {
      case 'ebook':
        return {
          icon: BookOpen,
          label: 'E-BOOK GUIDE',
          bg: 'bg-[#ff007a]/15 text-[#ff007a] border-[#ff007a]/40',
        };
      case 'thumbnail':
        return {
          icon: ImageIcon,
          label: '4K THUMBNAIL',
          bg: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/40',
        };
      case 'sticker':
        return {
          icon: Flame,
          label: 'NEON STICKERS',
          bg: 'bg-[#ff8c00]/15 text-[#ff8c00] border-[#ff8c00]/40',
        };
      case 'bundle':
        return {
          icon: Package,
          label: 'MEGA BUNDLE',
          bg: 'bg-[#ffb700]/15 text-[#ffb700] border-[#ffb700]/40',
        };
      default:
        return {
          icon: BookOpen,
          label: 'DIGITAL ASSET',
          bg: 'bg-white/10 text-gray-300 border-white/20',
        };
    }
  };

  const badgeInfo = getCategoryBadge();
  const IconComponent = badgeInfo.icon;

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  // Direct checkout/access redirect
  const handleAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.gumroad_url || 'https://gumroad.com', '_blank', 'noopener,noreferrer');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((centerY - y) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotX, y: rotY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      className="perspective-1000"
      onMouseMove={(e) => {
        setIsHovered(true);
        handleMouseMove(e);
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="group relative rounded-3xl bg-[#0d0c15] border border-white/10 hover:border-[#ff007a]/60 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_0_35px_rgba(255,0,122,0.3)] preserve-3d"
        style={{
          transform: isHovered ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-6px)` : 'none',
        }}
      >
        {/* Top Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 text-[10px] font-rajdhani font-black tracking-widest text-white uppercase rounded-md bg-gradient-to-r from-[#ff007a] to-[#ff5e00] shadow-lg border border-white/20">
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-2.5 py-0.5 text-[10px] font-bold font-rajdhani tracking-wider text-emerald-300 uppercase rounded bg-emerald-950/90 border border-emerald-500/40">
              {discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Image Container */}
        <div 
          onClick={handleAccessClick}
          className="relative w-full aspect-[16/11] overflow-hidden bg-black/60 cursor-pointer"
          title="Click to Get Access"
        >
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/gta6-cover1.jpeg';
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c15] via-transparent to-transparent opacity-70" />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white text-xs font-rajdhani font-black uppercase tracking-wider shadow-2xl scale-95 group-hover:scale-100 transition-transform">
              <Zap className="w-4 h-4 fill-current text-amber-300 animate-pulse" />
              <span>Get Access Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-rajdhani font-bold tracking-wider uppercase border ${badgeInfo.bg}`}>
                <IconComponent className="w-3 h-3" />
                {badgeInfo.label}
              </span>

              <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || 5.0}</span>
                {product.sales_count && (
                  <span className="text-gray-500 font-normal">({product.sales_count})</span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 
              onClick={handleAccessClick}
              className="text-lg font-bold text-white hover:text-[#ff007a] transition-colors leading-snug cursor-pointer mb-2 font-rajdhani"
            >
              {product.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5 mb-5 py-2 border-y border-white/5">
                {product.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-rajdhani tracking-wider">Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white font-rajdhani">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuickView(product)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                title="Quick Preview"
                type="button"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Get Access Button */}
              <button
                onClick={handleAccessClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#ff5e00] hover:brightness-110 text-white font-rajdhani font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,0,122,0.4)] active:scale-95 cursor-pointer"
                type="button"
              >
                <Zap className="w-4 h-4 fill-current text-amber-300" />
                <span>Get Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
