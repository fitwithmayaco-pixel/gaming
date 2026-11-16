import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, setDemoAdmin, setDemoUser, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUp(email, password, fullName);
        if (!res.success) {
          setError(res.error || 'Failed to sign up');
          setLoading(false);
          return;
        }
      } else {
        const res = await signIn(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password');
          setLoading(false);
          return;
        }
      }

      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setDemoAdmin();
    navigate('/admin');
  };

  const handleDemoUser = () => {
    setDemoUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff007a]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-rajdhani font-bold uppercase tracking-wider text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        {/* Card */}
        <div className="bg-[#0e0d18]/90 border border-[#ff007a]/40 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,0,122,0.25)]">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ffb700] via-[#ff5e00] to-[#ff007a] p-[1.5px] shadow-lg mb-3">
              <div className="w-full h-full bg-[#0a0912] rounded-[14px] flex items-center justify-center font-black text-amber-400 font-gta text-xl">
                ★
              </div>
            </div>
            <h1 className="text-2xl font-black font-gta uppercase text-white tracking-tight">
              LEONIDA <span className="text-gradient-gta">ACCESS</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-rajdhani">
              {isSignUp ? 'Create your player account' : 'Sign in to access your digital account'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${
                !isSignUp
                  ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${
                isSignUp
                  ? 'bg-gradient-to-r from-[#ff007a] to-[#ff5e00] text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                  Full Name / Gamer Tag
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jason Duval"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-rajdhani uppercase font-bold text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 font-rajdhani focus:outline-none focus:border-[#ff007a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff007a] via-[#ff5e00] to-[#ff007a] bg-[length:200%_auto] hover:bg-right transition-all duration-300 text-white font-rajdhani font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(255,0,122,0.4)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isSignUp ? 'Create Player Account' : 'Sign In Now'}
            </button>
          </form>

          {/* Quick Demo Shortcuts (If testing locally) */}
          {!isConfigured && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-[11px] font-rajdhani uppercase text-gray-400 text-center mb-2 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Demo Access</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  className="py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-rajdhani font-bold uppercase tracking-wider"
                >
                  👑 Login as Admin
                </button>
                <button
                  type="button"
                  onClick={handleDemoUser}
                  className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-rajdhani font-bold uppercase tracking-wider"
                >
                  👤 Login as User
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
