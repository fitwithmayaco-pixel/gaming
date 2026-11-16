import { Link } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden text-center">
      {/* Red Wasted vignette */}
      <div className="absolute inset-0 bg-red-950/20 mix-blend-color-burn pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md">
        {/* Wasted Stamp */}
        <div className="inline-block px-8 py-3 bg-red-600/90 text-white font-gta font-black text-4xl sm:text-6xl tracking-widest uppercase border-4 border-red-400 rotate-[-4deg] shadow-[0_0_50px_rgba(239,68,68,0.8)] animate-pulse">
          WASTED
        </div>

        <h2 className="text-xl font-bold font-rajdhani uppercase text-white tracking-wider mt-4">
          404 - LOST IN THE LEONIDA EVERGLADES
        </h2>

        <p className="text-xs text-gray-400 leading-relaxed">
          The coordinates you entered do not exist on the Vice City map. Return to safe territory.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white font-rajdhani font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Respawn at Storefront</span>
        </Link>
      </div>
    </div>
  );
};
