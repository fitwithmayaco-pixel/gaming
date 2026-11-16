import { ShieldCheck, Download, Sparkles, Layers, Users, Zap } from 'lucide-react';

export const StatsSection = () => {
  return (
    <section className="py-16 bg-[#090810] border-y border-white/5 relative overflow-hidden">
      {/* Background Palm & Neon Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#ff007a]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-rajdhani font-black tracking-widest text-[#00f0ff] uppercase px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 inline-block mb-3">
            VERIFIED CREATOR ARSENAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-gta text-white tracking-tight uppercase">
            WHY CREATORS CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ffb700]">GTA VI ASSETS</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Built by seasoned graphic artists and dedicated Grand Theft Auto analysts. Delivered with zero friction.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#0f0e1a] border border-white/10 hover:border-[#ff007a]/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff007a] to-[#ff5e00] text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,0,122,0.4)] group-hover:scale-110 transition-transform">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rajdhani text-white uppercase tracking-wider mb-2">
              Instant Direct Download
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When you click on any product, secure checkout handles your purchase and download links arrive immediately in your inbox and browser.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#0f0e1a] border border-white/10 hover:border-[#00f0ff]/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#0070ff] text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rajdhani text-white uppercase tracking-wider mb-2">
              4K PSD & Canva Formats
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every thumbnail and sticker is engineered to maximize YouTube click-through rates. Layered Photoshop PSDs and Canva shareable links included.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#0f0e1a] border border-white/10 hover:border-amber-400/40 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-[#ff5e00] text-white flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-rajdhani text-white uppercase tracking-wider mb-2">
              Lifetime Free DLC Updates
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              As Rockstar Games reveals new GTA VI updates, map expansions, and online heist details, all guide e-books will receive free updated versions.
            </p>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171228] via-[#0d0b17] to-[#171228] border border-[#ff007a]/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-4xl font-black font-rajdhani text-[#ff007a]">12,500+</div>
            <div className="text-[11px] font-rajdhani uppercase tracking-wider text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Users className="w-3.5 h-3.5 text-[#ff007a]" />
              Happy Players
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-black font-rajdhani text-[#00f0ff]">4K UHD</div>
            <div className="text-[11px] font-rajdhani uppercase tracking-wider text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
              Native Resolution
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-black font-rajdhani text-amber-400">5.0 / 5.0</div>
            <div className="text-[11px] font-rajdhani uppercase tracking-wider text-gray-400 flex items-center justify-center gap-1 mt-1">
              ★ Rating
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-4xl font-black font-rajdhani text-emerald-400">100%</div>
            <div className="text-[11px] font-rajdhani uppercase tracking-wider text-gray-400 flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Digital Files
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
