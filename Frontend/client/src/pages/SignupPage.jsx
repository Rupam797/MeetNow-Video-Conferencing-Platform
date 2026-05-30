import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, User, Mail, Lock, Sparkles, Star, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SignupPage = () => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[1.2fr_1fr] bg-offwhite dark:bg-primary transition-colors duration-300">
      
      {/* Left side — Decorative/Visual Panel (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-secondary border-r border-border-primary/50 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-coral/5 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline self-start">
          <div className="w-9 h-9 bg-brand text-secondary rounded-xl flex items-center justify-center shadow-md">
            <Video size={18} />
          </div>
          <span className="text-xl font-bold font-[Outfit] text-white tracking-tight">Vidor</span>
        </Link>

        {/* Hero Area */}
        <div className="my-auto max-w-lg space-y-6 z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand/10 border border-brand/20 text-brand rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Join Secure Video Calls</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold font-[Outfit] text-white leading-tight tracking-tight">
            Create an Account <br />
            and host meetings <span className="text-brand italic font-serif">instantly</span>.
          </h2>

          <p className="text-offwhite/60 text-sm font-light leading-relaxed">
            Register today to spin up permanent rooms, invite remote participants, access automatic notes and transcription, and enjoy high quality low-latency connections.
          </p>

          <div className="pt-4 flex items-center gap-4 text-xs text-offwhite/50 border-t border-border-primary/40">
            <div className="flex text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <span>Unlimited features for up to 14 days free trial</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-offwhite/40 font-[Outfit]">
          &copy; 2026 Vidor. All rights reserved. Built using Agora RTC SDK.
        </div>
      </div>

      {/* Right side — Form Card Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[400px] p-8 bg-white dark:bg-secondary rounded-3xl border border-gray-200 dark:border-border-primary/60 shadow-xl transition-all duration-300">
          {/* Logo representation on Mobile only */}
          <Link to="/" className="flex md:hidden items-center justify-center gap-2.5 mb-8 no-underline text-primary dark:text-white">
            <div className="w-8 h-8 bg-primary dark:bg-brand text-brand dark:text-primary rounded-xl flex items-center justify-center shadow-md">
              <Video size={18} />
            </div>
            <span className="text-base font-bold font-[Outfit]">Vidor</span>
          </Link>

          <div className="mb-6 text-center md:text-left">
            <h3 className="text-2xl font-bold font-[Outfit] text-primary dark:text-white">Create Account</h3>
            <p className="text-sm text-secondary dark:text-offwhite/60 mt-1.5 font-light">Set up your account to start secure video meetings</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-offwhite/65 font-[Outfit]">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="w-full py-3 pl-10 pr-3 text-sm rounded-xl border border-gray-300 dark:border-border-primary bg-transparent focus:border-brand dark:focus:border-brand focus:shadow-[0_0_0_3px_rgba(219,234,141,0.2)] dark:bg-input text-primary dark:text-white outline-none transition-all duration-150 font-[Outfit]"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-offwhite/30" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-offwhite/65 font-[Outfit]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full py-3 pl-10 pr-3 text-sm rounded-xl border border-gray-300 dark:border-border-primary bg-transparent focus:border-brand dark:focus:border-brand focus:shadow-[0_0_0_3px_rgba(219,234,141,0.2)] dark:bg-input text-primary dark:text-white outline-none transition-all duration-150 font-[Outfit]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-offwhite/30" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-secondary dark:text-offwhite/65 font-[Outfit]">Password (min. 6 characters)</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full py-3 pl-10 pr-3 text-sm rounded-xl border border-gray-300 dark:border-border-primary bg-transparent focus:border-brand dark:focus:border-brand focus:shadow-[0_0_0_3px_rgba(219,234,141,0.2)] dark:bg-input text-primary dark:text-white outline-none transition-all duration-150 font-[Outfit]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-offwhite/30" />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl bg-primary text-brand hover:bg-primary/95 dark:bg-brand dark:text-secondary dark:hover:bg-brand-hover cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-55 disabled:cursor-not-allowed font-[Outfit] shadow-md shadow-brand/10"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 rounded-full animate-spin border-brand border-t-transparent dark:border-secondary dark:border-t-transparent" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 text-sm font-[Outfit] text-secondary dark:text-offwhite/60">
            <span>Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary dark:text-brand hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
