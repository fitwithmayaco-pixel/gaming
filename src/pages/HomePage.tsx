import { useState, useRef, useMemo } from 'react';
import { Hero } from '../components/Hero';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { StatsSection } from '../components/StatsSection';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../types';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const HomePage = () => {
  const { filteredProducts, loading, setSelectedCategory, setSearchQuery } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');

  const productsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadFirst = () => {
    const firstProduct = filteredProducts[0];
    if (firstProduct) {
      window.open(firstProduct.gumroad_url || 'https://gumroad.com', '_blank', 'noopener,noreferrer');
    }
  };

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      case 'rating':
        return list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
      case 'featured':
      default:
        return list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Cinematic Hero with 3D Book & Local Video */}
      <Hero
        onExploreClick={scrollToProducts}
        onDownloadClick={handleDownloadFirst}
        onPreviewClick={() => {
          if (filteredProducts[0]) setSelectedProduct(filteredProducts[0]);
        }}
      />

      {/* Main Catalog Section */}
      <section ref={productsSectionRef} className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="text-xs font-rajdhani font-black uppercase tracking-widest text-[#00f0ff]">
              LEONIDA STATE DIGITAL REPOSITORY
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-gta uppercase text-white tracking-tight">
            OFFICIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#00f0ff]">DIGITAL RELEASES</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Click on any product card to get instant digital access.
          </p>
        </div>

        {/* Category Filter & Search Bar */}
        <CategoryFilter sortBy={sortBy} setSortBy={setSortBy} />

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#ff007a] border-t-transparent animate-spin" />
            <p className="text-sm font-rajdhani uppercase tracking-widest text-gray-400">Loading Digital Assets...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 mt-6">
            <AlertCircle className="w-12 h-12 text-[#ff007a] mb-3" />
            <h3 className="text-lg font-bold font-rajdhani uppercase text-white">No products found</h3>
            <p className="text-xs text-gray-400 max-w-md mt-1 mb-6">
              No digital assets match your filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Quick View Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
