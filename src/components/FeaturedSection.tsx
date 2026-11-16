import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface Props {
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<Props> = ({ featuredProducts, onQuickView, onViewAll }) => {
  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-12 border-b border-white/5 relative">
      {/* Background Neon Glow Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-gradient-to-r from-[#ff007a]/10 via-[#ff5e00]/10 to-[#00f0ff]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff007a]/15 border border-[#ff007a]/30 text-[#ff007a] text-xs font-rajdhani font-black uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>LEONIDA SYNDICATE PICKS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-gta uppercase text-white tracking-tight">
              FEATURED <span className="text-gradient-gta">BESTSELLERS</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              The highest-rated GTA VI strategy e-books, viral YouTube thumbnail templates, and sticker collections.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-xs font-rajdhani font-bold text-[#00f0ff] hover:text-white uppercase tracking-wider group transition-colors"
          >
            <span>View All Assets</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
