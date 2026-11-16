import React from 'react';
import { X, Star, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<Props> = ({ product, onClose }) => {
  if (!product) return null;

  const handleAccessRedirect = () => {
    window.open(product.gumroad_url || 'https://gumroad.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0b14] border border-[#ff007a]/40 rounded-3xl shadow-[0_0_60px_rgba(255,0,122,0.3)] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/20 transition-all hover:scale-105 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-Res Image Preview */}
        <div className="md:w-1/2 relative bg-black/70 flex items-center justify-center min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-white/10 group">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover max-h-[520px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/gta6-cover1.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b14] via-transparent to-transparent opacity-60" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-xs font-rajdhani font-black tracking-widest text-white uppercase rounded-md bg-gradient-to-r from-[#ff007a] to-[#ff5e00] shadow-lg border border-white/20">
                {product.badge}
              </span>
            </div>
          )}

          {/* Quick Click Hint */}
          <div 
            onClick={handleAccessRedirect}
            className="absolute bottom-4 left-4 right-4 py-2.5 px-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-center text-xs text-gray-200 cursor-pointer hover:border-[#ff007a]/50 transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>Click to get instant digital access</span>
          </div>
        </div>

        {/* Right Side: Product Details & CTAs */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-rajdhani font-bold uppercase tracking-wider bg-[#ff007a]/20 text-[#ff007a] border border-[#ff007a]/40">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating || 5.0} Rating</span>
                {product.sales_count && (
                  <span className="text-gray-400">({product.sales_count} orders)</span>
                )}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold font-rajdhani text-white leading-tight">
              {product.title}
            </h2>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-rajdhani uppercase tracking-wider text-gray-400 block">Instant Digital Access</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-rajdhani text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Instant Delivery
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-rajdhani uppercase tracking-wider text-gray-400 font-bold">Product Overview</h4>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Feature Bullets */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-rajdhani uppercase tracking-wider text-[#00f0ff] font-bold">What's Included:</h4>
                <div className="space-y-1.5">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA Actions */}
          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            <button
              onClick={handleAccessRedirect}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ff007a] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-rajdhani font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,0,122,0.5)] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current text-amber-300" />
              <span>Get Instant Access (${product.price.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Virus-Free & Verified
              </span>
              <span>•</span>
              <span>Instant Digital Delivery</span>
              <span>•</span>
              <span>Direct Link Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
