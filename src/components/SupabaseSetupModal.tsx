import React, { useState } from 'react';
import { X, Copy, Check, Database, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'sql' | 'admin'>('guide');
  const isConfigured = isSupabaseConfigured();
  const { setDemoAdmin, setDemoUser, role } = useAuth();

  if (!isOpen) return null;

  const sqlCode = `-- 🌴 1. CREATE PROFILES TABLE (User Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto create profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 🌴 2. CREATE PRODUCTS TABLE (E-books, Thumbnails, Stickers)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ebook', 'thumbnail', 'sticker', 'bundle')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  original_price NUMERIC(10, 2),
  image_url TEXT NOT NULL,
  preview_images TEXT[] DEFAULT '{}',
  gumroad_url TEXT NOT NULL,
  badge TEXT,
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT 
USING (is_active = true OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')));

CREATE POLICY "Admins can insert products" ON public.products FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admins can update products" ON public.products FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admins can delete products" ON public.products FOR DELETE 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- 🌴 3. CREATE STORAGE BUCKET FOR THUMBNAIL UPLOADS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- 👑 4. HOW TO MAKE YOUR ACCOUNT ADMIN:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@HERE.COM';`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0f0e18] border border-[#ff007a]/40 rounded-2xl shadow-[0_0_50px_rgba(255,0,122,0.25)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#1c122c] to-[#0f0e18]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff007a]/20 text-[#ff007a]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
                Supabase Database Setup Guide
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-sans uppercase font-semibold ${
                  isConfigured 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isConfigured ? 'Connected' : 'Demo Mode (Offline)'}
                </span>
              </h2>
              <p className="text-xs text-gray-400">Follow these 3 simple steps to connect Supabase & configure Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-6 bg-black/40">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-[#ff007a] text-[#ff007a]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            1. Setup Steps (English & Urdu)
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-[#ff007a] text-[#ff007a]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            2. SQL Query (1-Click Copy)
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-colors ${
              activeTab === 'admin'
                ? 'border-[#ff007a] text-[#ff007a]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            3. Make Admin & Testing
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-300 flex-1">
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#00f0ff] font-bold uppercase tracking-wider text-xs">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-mono">1</span>
                  Create Free Supabase Project
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#ff007a] underline inline-flex items-center gap-1 font-semibold">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a new free project.
                </p>
                <div className="text-[13px] text-gray-400 bg-black/40 p-3 rounded-lg border border-white/5">
                  <strong className="text-white">Urdu:</strong> supabase.com pr ja kr free account banayein aur New Project create krein.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#ff007a] font-bold uppercase tracking-wider text-xs">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff007a]/20 text-[#ff007a] font-mono">2</span>
                  Run the SQL Queries
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Go to Supabase Dashboard &rarr; Click <strong>SQL Editor</strong> in the left sidebar &rarr; Click <strong>New Query</strong> &rarr; Switch to the <strong>"SQL Query"</strong> tab above, copy the SQL, paste it and click <strong>RUN</strong>.
                </p>
                <div className="text-[13px] text-gray-400 bg-black/40 p-3 rounded-lg border border-white/5">
                  <strong className="text-white">Urdu:</strong> Left sidebar me SQL Editor me ja kar new query me hamara SQL paste karein aur green RUN button dabayein. Sari tables, security rules aur sample GTA 6 products khud ban jaenge!
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[#ff9900] font-bold uppercase tracking-wider text-xs">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff9900]/20 text-[#ff9900] font-mono">3</span>
                  Add Keys to your .env file
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  In Supabase, go to <strong>Project Settings &rarr; API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public key</strong> into your local <code className="text-[#ff007a] bg-black px-1.5 py-0.5 rounded">.env</code> file:
                </p>
                <pre className="p-3 bg-black/80 rounded-lg text-xs font-mono text-emerald-400 border border-white/10 overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Complete SQL Schema with Profiles, Products, Storage & RLS:</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff007a] to-[#ff5e00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy SQL Query'}
                </button>
              </div>
              <div className="relative">
                <pre className="p-4 bg-black/90 border border-white/10 rounded-xl text-xs font-mono text-gray-300 overflow-x-auto max-h-[380px] leading-relaxed">
                  {sqlCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1b152d] to-[#0e0c19] border border-[#ff007a]/30 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff007a]" />
                  How to make yourself Admin in Supabase:
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-300 leading-relaxed">
                  <li>Go to the website's <strong className="text-white">Login / Sign Up</strong> page and create an account with your email.</li>
                  <li>Go to your Supabase SQL Editor and run this single command:</li>
                </ol>
                <div className="p-3 bg-black/80 border border-white/10 rounded-lg text-xs font-mono text-amber-300 flex items-center justify-between">
                  <span>UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL@EXAMPLE.COM';</span>
                </div>
                <p className="text-xs text-gray-400">
                  That's it! As soon as this command runs, that user gets instant Admin access to the Admin Dashboard. Regular users cannot access or edit products.
                </p>
              </div>

              {/* Local Demo Quick Switcher */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#00f0ff] flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Local Testing Mode (Instant Admin Test)
                </h4>
                <p className="text-xs text-gray-400">
                  Current Role: <strong className="text-[#ff007a] uppercase font-bold">{role}</strong>. You can switch your local role right now to test the Admin Panel immediately:
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      setDemoAdmin();
                      onClose();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg"
                  >
                    👑 Switch to Admin Mode
                  </button>
                  <button
                    onClick={() => {
                      setDemoUser();
                      onClose();
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider"
                  >
                    👤 Switch to Regular User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">
            A full copy is also saved in <code className="text-[#00f0ff]">supabase-schema.sql</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
