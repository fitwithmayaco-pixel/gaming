import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Search, 
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Flame,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import type { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleCategorySelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navCategories: { label: string; cat: ProductCategory; icon: any }[] = [
    { label: 'ALL ASSETS', cat: 'all', icon: Sparkles },
    { label: 'E-BOOKS', cat: 'ebook', icon: BookOpen },
    { label: 'THUMBNAILS', cat: 'thumbnail', icon: ImageIcon },
    { label: 'STICKERS', cat: 'sticker', icon: Flame },
    { label: 'BUNDLES', cat: 'bundle', icon: Package },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#06050a]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={() => setSelectedCategory('all')}
        >
          {/* Rockstar Star Emblem */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffb700] via-[#ff5e00] to-[#ff007a] p-[1.5px] shadow-[0_0_20px_rgba(255,183,0,0.4)] group-hover:shadow-[0_0_25px_rgba(255,0,122,0.6)] transition-all">
            <div className="w-full h-full bg-[#0a0912] rounded-[10px] flex items-center justify-center font-black text-amber-400 font-gta text-lg">
              ★
            </div>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-gta font-black text-lg md:text-xl text-white tracking-tighter">
                GTA VI
              </span>
              <span className="font-gta italic text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] to-[#ff5e00]">
                STORE
              </span>
            </div>
            <span className="text-[10px] font-rajdhani font-bold tracking-widest text-gray-400 uppercase">
              LEONIDA DIGITAL ASSETS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          {navCategories.map((item) => {
            const Icon = item.icon;
            const isCurrent = selectedCategory === item.cat;
            return (
              <button
                key={item.cat}
                onClick={() => handleCategorySelect(item.cat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white shadow-[0_0_15px_rgba(255,0,122,0.4)]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions & Auth */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center gap-2 bg-[#141220] border border-[#ff007a]/50 rounded-xl px-3 py-1.5 shadow-lg animate-fadeIn">
                <Search className="w-4 h-4 text-[#ff007a]" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-36 sm:w-48 font-rajdhani"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Admin Panel Link (Only visible to admin) */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff007a] text-white font-rajdhani font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-300/40 hover:brightness-110 transition-all animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* Auth State Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[11px] font-bold text-white font-rajdhani leading-none">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className={`text-[9px] uppercase font-bold tracking-wider ${isAdmin ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isAdmin ? '⭐ Admin' : 'Player'}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-rajdhani font-bold text-xs uppercase tracking-wider border border-white/20 transition-all hover:border-[#ff007a]"
            >
              <User className="w-3.5 h-3.5 text-[#ff007a]" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0c0b14] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navCategories.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.cat}
                  onClick={() => handleCategorySelect(item.cat)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider ${
                    selectedCategory === item.cat
                      ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white'
                      : 'bg-white/5 text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <div className="pt-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#ff007a] text-white font-rajdhani font-bold text-xs uppercase tracking-wider"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Go to Admin Panel</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Sub-bar neon border line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007a] to-transparent opacity-60" />
    </header>
  );
};
