import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ShieldAlert, 
  Star, 
  Upload, 
  X, 
  BookOpen, 
  Image as ImageIcon, 
  Flame, 
  Package, 
  Eye,
  CheckCircle,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import type { Product, ProductCategory } from '../types';
import { uploadProductImage } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';

export const AdminDashboard: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<ProductCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'ebook' as 'ebook' | 'thumbnail' | 'sticker' | 'bundle',
    price: '19.99',
    original_price: '39.99',
    image_url: '/images/gta6-cover1.jpeg',
    gumroad_url: 'https://gumroad.com',
    badge: 'NEW RELEASE',
    features: 'Instant Digital Download\n180+ Full Color HD Pages\nSatellite Maps & Heist Routes',
    is_featured: false,
    rating: 5.0,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      category: 'ebook',
      price: '19.99',
      original_price: '39.99',
      image_url: '/images/gta6-cover1.jpeg',
      gumroad_url: '',
      badge: 'NEW RELEASE',
      features: 'Instant Digital Download\nHigh Resolution 4K Assets\nLifetime Free DLC Updates',
      is_featured: false,
      rating: 5.0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url,
      gumroad_url: product.gumroad_url,
      badge: product.badge || '',
      features: (product.features || []).join('\n'),
      is_featured: Boolean(product.is_featured),
      rating: product.rating || 5.0,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadProductImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      showToast('Image uploaded successfully!');
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.gumroad_url) {
      alert('Please provide a title and download link');
      return;
    }

    const featureList = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const productPayload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
      image_url: formData.image_url || '/images/gta6-cover1.jpeg',
      gumroad_url: formData.gumroad_url,
      badge: formData.badge || undefined,
      features: featureList,
      is_featured: formData.is_featured,
      is_active: true,
      rating: formData.rating,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productPayload);
        showToast('Product updated successfully!');
      } else {
        await addProduct(productPayload);
        showToast('Product published to store!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      try {
        await deleteProduct(id);
        showToast('Product removed');
      } catch (err: any) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  // RESTRICT ACCESS IF NOT ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e0d18] border border-red-500/40 text-center shadow-[0_0_50px_rgba(239,68,68,0.25)] space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-500 mx-auto flex items-center justify-center border border-red-500/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-gta uppercase text-white tracking-tight">
              ACCESS RESTRICTED
            </h1>
            <p className="text-xs font-rajdhani uppercase tracking-widest text-red-400 mt-1">
              Admin Clearance Required
            </p>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            This dashboard is only available to authorized administrator accounts.
          </p>

          <Link
            to="/auth"
            className="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white font-rajdhani font-bold text-xs uppercase tracking-wider text-center"
          >
            Sign In with Admin Account
          </Link>
        </div>
      </div>
    );
  }

  // Filter products by category tab
  const displayedProducts = activeTabFilter === 'all' 
    ? products 
    : products.filter(p => p.category === activeTabFilter);

  // Quick stats
  const stats = {
    total: products.length,
    ebooks: products.filter(p => p.category === 'ebook').length,
    thumbnails: products.filter(p => p.category === 'thumbnail').length,
    stickers: products.filter(p => p.category === 'sticker').length,
    bundles: products.filter(p => p.category === 'bundle').length,
  };

  // Preview object for modal
  const previewProduct: Product = {
    id: 'preview',
    title: formData.title || 'Your Product Title Goes Here',
    description: formData.description || 'Full product description explaining what buyers receive inside this download...',
    category: formData.category,
    price: parseFloat(formData.price) || 0,
    original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
    image_url: formData.image_url,
    gumroad_url: formData.gumroad_url,
    badge: formData.badge || undefined,
    features: formData.features.split('\n').filter(Boolean),
    rating: formData.rating,
    sales_count: 0,
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-rajdhani font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-rajdhani font-black uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              ADMIN CLEARANCE ACTIVE
            </span>
            <span className="text-xs text-gray-400 font-rajdhani">
              Logged in as <strong className="text-white">{profile?.email || user?.email}</strong>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-gta uppercase text-white tracking-tight">
            LEONIDA ASSETS <span className="text-gradient-gta">MANAGEMENT</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Upload and manage your GTA VI E-books, Thumbnails, and Stickers with direct download links.
          </p>
        </div>

        <div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ff007a] bg-[length:200%_auto] hover:bg-right text-white font-rajdhani font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,122,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Total Products', count: stats.total, icon: Package, color: 'text-white' },
          { label: 'E-Books', count: stats.ebooks, icon: BookOpen, color: 'text-[#ff007a]' },
          { label: '4K Thumbnails', count: stats.thumbnails, icon: ImageIcon, color: 'text-[#00f0ff]' },
          { label: 'Neon Stickers', count: stats.stickers, icon: Flame, color: 'text-[#ff8c00]' },
          { label: 'Creator Bundles', count: stats.bundles, icon: Star, color: 'text-amber-400' },
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#0f0e1a] border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-rajdhani uppercase font-bold text-gray-400">{item.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className={`text-2xl font-black font-rajdhani ${item.color}`}>{item.count}</span>
              <item.icon className={`w-4 h-4 ${item.color} opacity-70`} />
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
        {(['all', 'ebook', 'thumbnail', 'sticker', 'bundle'] as ProductCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTabFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-rajdhani font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTabFilter === cat
                ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Assets' : cat}
          </button>
        ))}
      </div>

      {/* Products Table / Cards */}
      {loading ? (
        <div className="py-20 text-center text-sm font-rajdhani uppercase text-gray-400">
          Loading catalog...
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="py-20 text-center bg-white/5 border border-white/10 rounded-3xl p-8">
          <p className="text-gray-400 text-sm mb-4">No products found in this category.</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#ff007a] text-white rounded-xl text-xs font-bold font-rajdhani uppercase"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl bg-[#0e0d16] border border-white/10 flex flex-col justify-between overflow-hidden relative group hover:border-[#ff007a]/40 transition-colors"
            >
              {/* Image Preview */}
              <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/gta6-cover1.jpeg';
                  }}
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold uppercase bg-black/80 text-[#00f0ff] border border-white/10">
                    {p.category}
                  </span>
                  {p.is_featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold uppercase bg-[#ff007a] text-white">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/85 text-xs font-black font-rajdhani text-white border border-white/10">
                  ${p.price.toFixed(2)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-rajdhani font-bold text-white text-base line-clamp-1 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {p.description}
                  </p>
                  
                  {/* Download Link Preview */}
                  <a
                    href={p.gumroad_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#ff007a] hover:underline font-mono truncate max-w-full"
                  >
                    <span>Link: {p.gumroad_url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-rajdhani uppercase">
                    Rating: {p.rating} ★
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-[#0f0e1a] border border-[#ff007a]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,0,122,0.3)] my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#ff007a] to-[#ff5e00] text-white">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  {editingProduct ? 'Edit Digital Asset' : 'Upload New Product'}
                </h2>
                <p className="text-xs text-gray-400">
                  Provide title, category, price, cover image, and your direct download URL.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Column */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GTA VI Vice City Walkthrough Guide"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white font-rajdhani focus:outline-none focus:border-[#ff007a] cursor-pointer"
                    >
                      <option value="ebook">E-Book Guide</option>
                      <option value="thumbnail">4K YouTube Thumbnail</option>
                      <option value="sticker">Neon Sticker Pack</option>
                      <option value="bundle">Creator Bundle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                      Badge / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BESTSELLER, HOT, NEW"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                    />
                  </div>
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                      Selling Price ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="19.99"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                      Original Price ($ USD - For Discount)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="39.99"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                    />
                  </div>
                </div>

                {/* Direct Download Link */}
                <div>
                  <label className="block text-[11px] font-rajdhani uppercase font-bold text-[#ff007a] mb-1 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    Product Download Link * (User redirects here on Click)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.gumroad_url}
                    onChange={(e) => setFormData({ ...formData, gumroad_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-[#ff007a]/40 rounded-xl text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#ff007a]"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Clicking product cover or Download button redirects user straight to this URL.
                  </span>
                </div>

                {/* Image Cover */}
                <div>
                  <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                    Cover / Thumbnail Image
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Image URL or choose local cover (/images/gta6-cover1.jpeg)"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '/images/gta6-cover1.jpeg' })}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-gray-300 font-rajdhani uppercase"
                    >
                      Use Cover 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: '/images/gta6-cover2.jpeg' })}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] text-gray-300 font-rajdhani uppercase"
                    >
                      Use Cover 2
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-rajdhani font-bold uppercase transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what is inside this asset..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                  />
                </div>

                {/* Feature Bullets */}
                <div>
                  <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                    Key Features (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Instant PDF & ePub Download&#10;High Resolution 4K Graphics"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                  />
                </div>

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#ff007a] focus:ring-[#ff007a] bg-black border-white/20"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-rajdhani uppercase font-bold text-white cursor-pointer">
                    Feature on Homepage Spotlight
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-rajdhani font-bold text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white font-rajdhani font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                <div className="sticky top-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-rajdhani font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Live Storefront Card Preview
                    </span>
                    <span className="text-[10px] text-gray-400">Updates as you type</span>
                  </div>

                  <ProductCard
                    product={previewProduct}
                    onQuickView={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
