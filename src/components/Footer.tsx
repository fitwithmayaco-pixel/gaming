import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Heart, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-[#050508] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Top neon glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff007a] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ffb700] via-[#ff5e00] to-[#ff007a] p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full bg-[#0a0912] rounded-[9px] flex items-center justify-center font-black text-amber-400 font-gta text-base">
                  ★
                </div>
              </div>
              <span className="font-gta font-black text-lg text-white">
                GTA VI <span className="text-gradient-gta">STORE</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The ultimate Leonida State digital repository: comprehensive walkthrough e-books, 4K YouTube thumbnails, and high-res vector stickers.
            </p>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-rajdhani uppercase tracking-widest text-[#00f0ff]">
              Digital Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Strategy E-Books & Guides</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">4K YouTube Thumbnail Packs</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Neon Vice City Stickers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Creator All-In-One Bundles</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-rajdhani uppercase tracking-widest text-[#ff8c00]">
              Portal Access
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link to={isAdmin ? "/admin" : "/auth"} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel ({isAdmin ? 'Access Granted' : 'Restricted'})</span>
                </Link>
              </li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Sign In / Register</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Download Catalog</Link></li>
            </ul>
          </div>

          {/* Col 4: Buyer Protection & Delivery */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-rajdhani uppercase tracking-widest text-[#ff007a]">
              Delivery Guarantee
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              All digital assets are encrypted and available for immediate download right upon checkout. High-speed direct servers.
            </p>
            <div className="flex flex-col gap-1.5 text-[11px] text-gray-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Secure Encrypted Link
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Instant File Download
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-gray-400">
          <p>
            Grand Theft Auto and GTA VI are registered trademarks of Take-Two Interactive & Rockstar Games. This website is an independent digital fan creation.
          </p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#ff007a] fill-current" />
            <span>for Vice City Creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
