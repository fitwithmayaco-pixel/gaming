import React from 'react';
import { Sparkles, BookOpen, Image as ImageIcon, Flame, Package, Search } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { ProductCategory } from '../types';

interface Props {
  sortBy: string;
  setSortBy: (val: string) => void;
}

export const CategoryFilter: React.FC<Props> = ({ sortBy, setSortBy }) => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useProducts();

  const categories: { id: ProductCategory; label: string; icon: any }[] = [
    { id: 'all', label: 'All Items', icon: Sparkles },
    { id: 'ebook', label: 'E-Books & Guides', icon: BookOpen },
    { id: 'thumbnail', label: '4K Thumbnails', icon: ImageIcon },
    { id: 'sticker', label: 'Neon Stickers', icon: Flame },
    { id: 'bundle', label: 'Creator Bundles', icon: Package },
  ];

  const getCount = (catId: ProductCategory) => {
    if (catId === 'all') return products.length;
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = getCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white shadow-[0_0_20px_rgba(255,0,122,0.4)] scale-105'
                    : 'bg-[#12111d] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort & Search Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#12111d] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-[#12111d] border border-white/10 rounded-xl text-xs font-rajdhani font-semibold text-gray-300 focus:outline-none focus:border-[#ff007a] cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated (★)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
