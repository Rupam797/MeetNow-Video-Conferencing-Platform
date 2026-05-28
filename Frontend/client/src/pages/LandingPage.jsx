import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  Video, Shield, Monitor, Zap, Users, ArrowRight, Star,
  ChevronRight, ChevronLeft, Globe, Check, Sparkles,
  MessageSquare, VolumeX, Volume2, FileText, Calendar,
  Clock, Heart, HelpCircle, Facebook, Instagram
} from 'lucide-react';

const LandingPage = () => {
  // Interactive States
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annually'
  const [isNoiseFiltered, setIsNoiseFiltered] = useState(true);
  const [selectedLang, setSelectedLang] = useState('English');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      stars: 5,
      quote: "I used to dread Monday meetings. Now, I actually look forward to them. MeetNow makes every second feel worth attending.",
      author: "Kevin Park",
      role: "Senior Project Manager at Veloce",
      initials: "KP"
    },
    {
      stars: 5,
      quote: "The live translation is mind-blowing. We hosted a team meeting with developers in France, Tokyo, and Brazil, and everyone communicated flawlessly.",
      author: "Sora Takahashi",
      role: "VP of Engineering at GlobalSync",
      initials: "ST"
    },
    {
      stars: 5,
      quote: "Agora HD stream is crystal clear even on my weak home broadband connection. The UI matches our corporate aesthetic perfectly.",
      author: "Marie Dupont",
      role: "Product Lead at CoreUX",
      initials: "MD"
    }
  ];

  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'Swedish', flag: '🇸🇪' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'Italian', flag: '🇮🇹' }
  ];

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-theme-offwhite min-h-screen text-theme-charcoal selection:bg-theme-lime selection:text-theme-charcoal">
      <Navbar />

      {/* ── HERO BANNER SECTION ── */}
      <section id="home" className="max-w-[1120px] mx-auto px-4 md:px-6 pt-32 pb-12 relative">
        <div className="rounded-3xl bg-theme-charcoal text-theme-white p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-lg border border-theme-charcoal">
          {/* Decorative subtle gradient glow */}
          <div className="absolute inset-0 bg-radial-gradient from-theme-olive/15 via-transparent to-transparent pointer-events-none"></div>

          {/* Highlight Badge */}
          <div className="bg-theme-lime/10 border border-theme-lime/30 text-theme-lime px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-1.5 animate-pulse">
            <Sparkles size={14} className="text-theme-lime" />
            <span>TRUSTED BY 50K+ TEAMS WORLDWIDE</span>
          </div>

          {/* Headline */}
          <h1 className="font-[Outfit] text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6">
            The Smartest Room in the <span className="text-theme-lime italic font-serif">Building is Online</span>
          </h1>

          {/* Paragraph and rating */}
          <p className="text-theme-lightgray max-w-xl text-base md:text-lg mb-8 leading-relaxed font-light">
            MeetNow transforms every meeting with real-time AI – live transcription, sentiment detection, smart summaries, and intelligent noise cancellation.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 z-10">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-theme-lime hover:bg-theme-lime/90 text-theme-charcoal font-bold text-sm shadow-md transition-all active:scale-[0.98] no-underline"
            >
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-theme-lightgray/40 hover:border-theme-white text-theme-white font-semibold text-sm transition-all active:scale-[0.98] no-underline bg-transparent"
            >
              Try Demo Account
            </Link>
          </div>

          {/* User Ratings Overview */}
          <div className="flex items-center gap-3 mb-12">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full border-2 border-theme-charcoal bg-theme-beige flex items-center justify-center text-[10px] font-bold text-theme-charcoal">KP</span>
              <span className="w-8 h-8 rounded-full border-2 border-theme-charcoal bg-theme-lightgray flex items-center justify-center text-[10px] font-bold text-theme-charcoal">MD</span>
              <span className="w-8 h-8 rounded-full border-2 border-theme-charcoal bg-theme-lime flex items-center justify-center text-[10px] font-bold text-theme-charcoal">ST</span>
            </div>
            <div className="flex flex-col items-start text-xs text-theme-lightgray">
              <div className="flex text-theme-lime">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <span className="ml-1 text-theme-white font-bold">4.9/5</span>
              </div>
              <span>from 12,000+ happy developers</span>
            </div>
          </div>

          {/* Interactive Laptop/Window Mockup */}
          <div className="w-full max-w-[840px] rounded-2xl border-4 border-theme-lightgray/40 bg-theme-charcoal/95 overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01] text-left">
            {/* Mock Header */}
            <div className="bg-theme-charcoal border-b border-theme-lightgray/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-theme-coral"></div>
                <div className="w-3 h-3 rounded-full bg-theme-beige"></div>
                <div className="w-3 h-3 rounded-full bg-theme-lime"></div>
              </div>
              <div className="text-[11px] text-theme-lightgray/60 font-mono bg-theme-charcoal/50 px-3 py-1 rounded-md border border-theme-lightgray/5">
                meet.now/demo-room-923
              </div>
              <div className="w-14"></div>
            </div>

            {/* Video Client Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[340px] bg-theme-charcoal">
              {/* Left & Middle: Main active video tile */}
              <div className="md:col-span-2 p-3 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-theme-charcoal/80 min-h-[260px]">
                {/* Background Representation of Presenter */}
                <div className="absolute inset-0 bg-theme-charcoal/40 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-theme-lime/20 shadow-inner relative">
                    <img 
                      src="/sarah_avatar.png" 
                      alt="Sarah Jenkins (Host)" 
                      className="w-full h-full object-cover"
                    />
                    {/* Pulsing online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-theme-lime border-4 border-theme-charcoal flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-theme-charcoal animate-ping"></span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-start z-10">
                  <div className="bg-theme-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 text-theme-white border border-theme-lightgray/15">
                    <div className="w-2.5 h-2.5 rounded-full bg-theme-lime animate-pulse"></div>
                    <span>Sarah Jenkins (Host)</span>
                  </div>
                  <div className="bg-theme-charcoal/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-theme-lime font-bold border border-theme-lime/20">
                    HD STREAM
                  </div>
                </div>

                {/* Subtitle / Live transcription preview banner overlay */}
                <div className="z-10 bg-theme-charcoal/90 border border-theme-lightgray/10 p-3 rounded-xl backdrop-blur-sm max-w-[90%] mx-auto">
                  <span className="text-theme-lime font-bold text-xs">AI Live Transcript: </span>
                  <span className="text-theme-white text-xs">"...and here we see the Q2 engagement metrics scaling up rapidly."</span>
                </div>
              </div>

              {/* Right: Sidebar chats / participants */}
              <div className="border-t md:border-t-0 md:border-l border-theme-lightgray/10 p-4 flex flex-col justify-between bg-theme-charcoal/40 text-theme-white">
                <div>
                  <div className="flex justify-between items-center pb-2.5 border-b border-theme-lightgray/10 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-theme-lightgray">AI Meeting Assistant</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-theme-lime shadow-[0_0_8px_#D7E97A]"></span>
                  </div>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    <div className="bg-theme-charcoal/60 p-2 rounded-lg border border-theme-lightgray/5">
                      <div className="flex justify-between text-[10px] text-theme-lime font-semibold mb-1">
                        <span>Action Item</span>
                        <span>10:42 AM</span>
                      </div>
                      <p className="text-xs text-theme-white/90">Sarah to send updated wireframes to engineering team today.</p>
                    </div>
                    <div className="bg-theme-charcoal/60 p-2 rounded-lg border border-theme-lightgray/5">
                      <div className="flex justify-between text-[10px] text-theme-lime font-semibold mb-1">
                        <span>Meeting Summary</span>
                        <span>10:41 AM</span>
                      </div>
                      <p className="text-xs text-theme-white/80">Approved marketing budget. Adjusted hiring target timelines.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-theme-lightgray/10 mt-3">
                  <span className="text-[10px] text-theme-lightgray block mb-1 font-semibold">PARTICIPANTS</span>
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-theme-beige flex items-center justify-center text-[8px] text-theme-charcoal font-bold border border-theme-charcoal">SJ</div>
                    <div className="w-6 h-6 rounded-full bg-theme-lightgray flex items-center justify-center text-[8px] text-theme-charcoal font-bold border border-theme-charcoal">KP</div>
                    <div className="w-6 h-6 rounded-full bg-theme-olive flex items-center justify-center text-[8px] text-theme-white font-bold border border-theme-charcoal">ST</div>
                    <div className="w-6 h-6 rounded-full bg-theme-lime flex items-center justify-center text-[8px] text-theme-charcoal font-bold border border-theme-charcoal">+12</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Bottom Control Bar */}
            <div className="bg-theme-charcoal border-t border-theme-lightgray/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-theme-lime"></span>
                <span className="text-xs text-theme-white/70 font-semibold font-[Outfit]">01:42:08</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg bg-theme-lightgray/15 hover:bg-theme-lightgray/25 flex items-center justify-center text-theme-white transition-all cursor-pointer">
                  <Volume2 size={15} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-theme-lightgray/15 hover:bg-theme-lightgray/25 flex items-center justify-center text-theme-white transition-all cursor-pointer">
                  <Video size={15} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-theme-lime/20 hover:bg-theme-lime/30 flex items-center justify-center text-theme-lime transition-all cursor-pointer">
                  <Monitor size={15} />
                </button>
              </div>
              <button className="px-4 py-1.5 rounded-full bg-theme-coral hover:bg-theme-coral-dark text-theme-white text-xs font-bold tracking-wide transition-all cursor-pointer">
                End Call
              </button>
            </div>
          </div>

          {/* Bottom Overlapping Scroll Down Indicator (moved outside card to prevent overflow clipping) */}
          <a
            href="#transform"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-theme-lime hover:bg-theme-lime/90 flex items-center justify-center text-theme-charcoal shadow-md border-4 border-theme-offwhite cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 z-10"
            title="Scroll Down"
          >
            <ChevronRight size={24} className="rotate-90 text-theme-charcoal" />
          </a>
        </div>
      </section>

      {/* ── INTRO TRANSFORMATION STATEMENT ── */}
      <section id="transform" className="py-20 px-6 max-w-4xl mx-auto text-center border-b border-theme-lightgray/30">
        <h2 className="font-[Outfit] text-2xl md:text-4xl font-extrabold leading-normal text-theme-charcoal">
          <span className="text-theme-olive font-serif">MeetNow</span> — transforms every meeting with real-time AI — <span className="text-theme-olive bg-theme-lime/30 px-2 py-0.5 rounded">live transcription</span>, sentiment detection, smart summaries, and intelligent noise cancellation. Your meetings, reimagined.
        </h2>
      </section>

      {/* ── METRICS/STATS BAR ── */}
      <section className="py-12 max-w-[1120px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="bg-theme-charcoal text-theme-white p-6 rounded-2xl flex items-center gap-5 border border-theme-charcoal shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-theme-white/10 flex items-center justify-center text-theme-lime">
              <Users size={24} />
            </div>
            <div>
              <div className="text-3xl font-extrabold font-[Outfit] text-theme-white leading-tight">2M+</div>
              <div className="text-xs text-theme-lightgray uppercase tracking-wider font-semibold">Meetings Hosted</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-theme-lime text-theme-charcoal p-6 rounded-2xl flex items-center gap-5 border border-theme-olive/20 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-theme-charcoal/10 flex items-center justify-center text-theme-charcoal">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-3xl font-extrabold font-[Outfit] text-theme-charcoal leading-tight">0.3s</div>
              <div className="text-xs text-theme-charcoal/80 uppercase tracking-wider font-semibold">IR Response Time</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-theme-white text-theme-charcoal p-6 rounded-2xl flex items-center gap-5 border border-theme-lightgray shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-theme-offwhite flex items-center justify-center text-theme-olive">
              <Shield size={24} />
            </div>
            <div>
              <div className="text-3xl font-extrabold font-[Outfit] text-theme-charcoal leading-tight">98%</div>
              <div className="text-xs text-theme-charcoal/60 uppercase tracking-wider font-semibold">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI FEATURES SECTION ── */}
      <section id="features" className="py-20 max-w-[1120px] mx-auto px-4 md:px-6">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="flex flex-col items-start">
            <h2 className="text-4xl md:text-5xl font-extrabold font-[Outfit] text-theme-charcoal mb-4 tracking-tight leading-tight">
              AI that works<br />inside <span className="font-serif italic text-theme-olive">every meeting</span>
            </h2>
            <Link
              to="/signup"
              className="bg-theme-charcoal hover:bg-theme-charcoal/90 text-theme-white font-bold text-[10px] px-6 py-3 rounded-full uppercase tracking-widest no-underline inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Discover AI Tools</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="max-w-sm flex items-start gap-4 bg-theme-white p-4 rounded-2xl border border-theme-lightgray shadow-sm">
            <div className="flex -space-x-1.5 mt-1">
              <span className="w-6 h-6 rounded-full bg-theme-beige text-[8px] font-bold border border-theme-white flex items-center justify-center">KP</span>
              <span className="w-6 h-6 rounded-full bg-theme-lightgray text-[8px] font-bold border border-theme-white flex items-center justify-center">MD</span>
              <span className="w-6 h-6 rounded-full bg-theme-lime text-[8px] font-bold border border-theme-white flex items-center justify-center">ST</span>
            </div>
            <div>
              <div className="text-sm font-bold text-theme-charcoal leading-snug">Highly trusted globally</div>
              <p className="text-[11px] text-theme-charcoal/60 mt-0.5">
                Teams all over the world use our platform because it actually works.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Noise Cancellation */}
          <div className="bg-theme-white p-6 rounded-3xl border border-theme-lightgray flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-theme-offwhite text-theme-charcoal flex items-center justify-center mb-4">
                <VolumeX size={20} />
              </div>
              <h3 className="text-xl font-bold font-[Outfit] mb-2">Noise Cancellation</h3>
              <p className="text-xs text-theme-charcoal/60 leading-relaxed mb-6">
                Mute all unwanted background noises – keyboard typing, dog barks, children playing – instantly.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="bg-theme-offwhite p-4 rounded-2xl border border-theme-lightgray/60 font-[Outfit]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-theme-charcoal/80">Intelligent Filter</span>
                <button
                  onClick={() => setIsNoiseFiltered(!isNoiseFiltered)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${isNoiseFiltered ? 'bg-theme-lime' : 'bg-theme-lightgray'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-theme-charcoal transition-transform duration-200 ${isNoiseFiltered ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="h-10 flex items-center justify-center gap-1">
                {Array.from({ length: 15 }).map((_, idx) => {
                  // Generate custom bar heights based on state
                  const baseHeight = isNoiseFiltered ? 4 : 16;
                  const randomFactor = Math.sin(idx * 0.8) * (isNoiseFiltered ? 4 : 14);
                  const finalHeight = Math.max(4, baseHeight + randomFactor);

                  return (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-300 ${isNoiseFiltered ? 'bg-theme-olive/30' : 'bg-theme-coral'}`}
                      style={{ height: `${finalHeight}px` }}
                    ></div>
                  );
                })}
              </div>

              <div className="flex justify-between text-[9px] font-bold mt-3 text-theme-charcoal/60 uppercase">
                <span className={!isNoiseFiltered ? 'text-theme-coral' : ''}>Audible</span>
                <span className={isNoiseFiltered ? 'text-theme-olive' : ''}>Muted (Active)</span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Meeting Summaries */}
          <div className="bg-theme-white p-6 rounded-3xl border border-theme-lightgray flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-theme-offwhite text-theme-charcoal flex items-center justify-center mb-4">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-bold font-[Outfit] mb-2">AI Meeting Summaries</h3>
              <p className="text-xs text-theme-charcoal/60 leading-relaxed mb-6">
                Generate bulleted notes, key decisions, and upcoming action items from your talk automatically.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="bg-theme-offwhite p-4 rounded-2xl border border-theme-lightgray/60 text-xs text-theme-charcoal/80 space-y-2">
              <div className="text-[10px] uppercase font-bold text-theme-charcoal/50 tracking-wider mb-1">Key Takeaways</div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-md bg-theme-lime text-theme-charcoal flex items-center justify-center flex-shrink-0 text-[8px] font-bold">✓</div>
                <span>Finalized Q3 marketing launch schedule.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-md bg-theme-lime text-theme-charcoal flex items-center justify-center flex-shrink-0 text-[8px] font-bold">✓</div>
                <span>Allocated development budget for Agoras SDK update.</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-md bg-theme-olive/20 text-theme-charcoal/30 flex items-center justify-center flex-shrink-0 text-[8px] font-bold"></div>
                <span className="text-theme-charcoal/50">Schedule engineering review for Friday.</span>
              </div>
            </div>
          </div>

          {/* Card 3: Live Transcription */}
          <div className="bg-theme-white p-6 rounded-3xl border border-theme-lightgray flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-theme-offwhite text-theme-charcoal flex items-center justify-center mb-4">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-xl font-bold font-[Outfit] mb-2">Live Transcriptions</h3>
              <p className="text-xs text-theme-charcoal/60 leading-relaxed mb-6">
                Real-time speech-to-text with auto speaker labels, matching context and tags dynamically.
              </p>
            </div>

            {/* Interactive Mockup */}
            <div className="bg-theme-offwhite p-4 rounded-2xl border border-theme-lightgray/60 space-y-2 font-[Outfit] text-[11px]">
              <div className="flex items-center gap-1.5 pb-1 border-b border-theme-lightgray/30 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-theme-coral animate-ping"></div>
                <span className="text-[10px] font-semibold text-theme-charcoal/60">LIVE TRANSCRIPT</span>
              </div>

              <div className="space-y-2 max-h-[88px] overflow-y-auto pr-1">
                <div>
                  <span className="font-bold text-theme-olive">Sarah (10:14)</span>
                  <p className="text-theme-charcoal/80 leading-snug">Let's check the latency on the Europe servers.</p>
                </div>
                <div>
                  <span className="font-bold text-theme-charcoal">David (10:15)</span>
                  <p className="text-theme-charcoal/80 leading-snug">It's currently at 0.3s, very stable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNFAIR ADVANTAGE IN EVERY BOARDROOM ── */}
      <section className="py-20 bg-theme-white border-y border-theme-lightgray/40">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          {/* Header */}
          <h2 className="font-[Outfit] text-center text-4xl md:text-5xl font-extrabold text-theme-charcoal mb-16 tracking-tight">
            Unfair Advantage <br /><span className="font-serif italic text-theme-olive">in Every Boardroom</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Mockups */}
            <div className="flex flex-col gap-6">
              {/* Meeting View Mockup */}
              <div className="bg-theme-charcoal p-4 rounded-3xl border border-theme-charcoal shadow-md overflow-hidden relative min-h-[220px] flex items-center justify-center">
                {/* Simulated Grid Call */}
                <div className="grid grid-cols-2 gap-3 w-full h-full max-w-md">
                  <div className="bg-theme-charcoal/60 aspect-video rounded-xl border border-theme-lightgray/10 flex items-center justify-center text-xs font-bold text-theme-lightgray p-2 relative">
                    👨‍💻 David (London)
                  </div>
                  <div className="bg-theme-charcoal/60 aspect-video rounded-xl border border-theme-lightgray/10 flex items-center justify-center text-xs font-bold text-theme-lightgray p-2 relative">
                    👩‍🔬 Amy (Zurich)
                  </div>
                  <div className="bg-theme-charcoal/60 aspect-video rounded-xl border border-theme-lightgray/10 flex items-center justify-center text-xs font-bold text-theme-lightgray p-2 relative">
                    👨‍💼 Carl (Dallas)
                  </div>
                  <div className="bg-theme-charcoal/60 aspect-video rounded-xl border border-theme-lightgray/10 flex items-center justify-center text-xs font-bold text-theme-lightgray p-2 relative bg-theme-olive/10">
                    <div className="text-center">
                      <div className="text-[10px] text-theme-lime uppercase tracking-wider font-bold">Screen Share</div>
                      <div className="text-[9px] text-theme-white/70">Sarah (Host)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2 Column for Small Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Card A: Stacked Avatars */}
                <div className="bg-theme-offwhite border border-theme-lightgray/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <span className="w-8 h-8 rounded-full bg-theme-beige flex items-center justify-center text-[10px] font-bold border-2 border-theme-offwhite text-theme-charcoal">SJ</span>
                      <span className="w-8 h-8 rounded-full bg-theme-lightgray flex items-center justify-center text-[10px] font-bold border-2 border-theme-offwhite text-theme-charcoal">KP</span>
                      <span className="w-8 h-8 rounded-full bg-theme-lime flex items-center justify-center text-[10px] font-bold border-2 border-theme-offwhite text-theme-charcoal">ST</span>
                    </div>
                    <span className="text-xs font-bold font-[Outfit] text-theme-charcoal">+12 Participants</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-theme-lime"></div>
                </div>

                {/* Card B: Mini Calendar Scheduling */}
                <div className="bg-theme-charcoal text-theme-white p-5 rounded-2xl flex items-center gap-3.5 border border-theme-charcoal shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-theme-white/10 flex items-center justify-center text-theme-lime">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-theme-lime tracking-widest leading-none mb-1">MeetNow Day 30</div>
                    <div className="text-xs text-theme-white/90 font-medium font-[Outfit]">Annual Board Meeting</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Details */}
            <div className="flex flex-col justify-between">
              {/* Translations list */}
              <div className="bg-theme-offwhite p-6 rounded-3xl border border-theme-lightgray/80 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={18} className="text-theme-olive" />
                  <h4 className="text-sm font-bold font-[Outfit] text-theme-charcoal">40+ Languages Translated Worldwide</h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => setSelectedLang(lang.name)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all cursor-pointer ${selectedLang === lang.name ? 'bg-theme-charcoal text-theme-lime' : 'bg-theme-white border border-theme-lightgray text-theme-charcoal/80 hover:border-theme-charcoal/60'}`}
                    >
                      <span className="mr-1">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Elevate text and lists */}
              <div className="flex flex-col items-start gap-4">
                <h3 className="text-2xl font-bold font-[Outfit] text-theme-charcoal">Elevate your virtual meetings</h3>
                <p className="text-xs text-theme-charcoal/60 leading-relaxed max-w-md">
                  Conferencing tools and custom solutions engineered to make virtual teamwork feel as natural, productive, and secure as meeting in person.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>99.9% Client SLA Satisfaction Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>20M+ Saved Working Hours every single week</span>
                  </div>
                </div>

                <Link
                  to="/signup"
                  className="bg-theme-charcoal hover:bg-theme-charcoal/90 text-theme-white font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider no-underline inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Discover More</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS THAT SPEAK FOR THEMSELVES (TESTIMONIALS) ── */}
      <section className="py-20 max-w-[1120px] mx-auto px-4 md:px-6">
        {/* Title row */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-[Outfit] text-theme-charcoal tracking-tight">
            Results That <span className="font-serif italic text-theme-olive">Speak for Themselves</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevTestimonial}
              className="w-10 h-10 rounded-full border border-theme-lightgray bg-theme-white flex items-center justify-center text-theme-charcoal hover:border-theme-charcoal transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextTestimonial}
              className="w-10 h-10 rounded-full border border-theme-lightgray bg-theme-white flex items-center justify-center text-theme-charcoal hover:border-theme-charcoal transition-all cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel card */}
        <div className="bg-theme-white border border-theme-lightgray p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-sm transition-all duration-300">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-theme-beige flex items-center justify-center text-theme-charcoal font-[Outfit] text-3xl font-extrabold shadow-sm flex-shrink-0">
            {testimonials[activeTestimonial].initials}
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex justify-center md:justify-start text-theme-olive mb-3 gap-0.5">
              {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, idx) => (
                <Star key={idx} size={15} fill="currentColor" className="text-theme-olive" />
              ))}
            </div>

            <blockquote className="text-lg md:text-xl font-medium font-[Outfit] text-theme-charcoal leading-relaxed mb-4">
              "{testimonials[activeTestimonial].quote}"
            </blockquote>

            <div>
              <cite className="not-italic font-bold text-sm text-theme-charcoal block">
                {testimonials[activeTestimonial].author}
              </cite>
              <span className="text-xs text-theme-charcoal/50">
                {testimonials[activeTestimonial].role}
              </span>
            </div>
          </div>
        </div>

        {/* Logos footer grid */}
        <div className="mt-16 text-center">
          <span className="text-[10px] font-bold text-theme-charcoal/40 uppercase tracking-widest block mb-8">Trusted by the best</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 items-center justify-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-xl font-bold font-mono tracking-tighter text-theme-charcoal">ODO</span>
            <span className="text-xl font-bold font-mono tracking-tighter text-theme-charcoal">TRYUM</span>
            <span className="text-xl font-bold font-mono tracking-tighter text-theme-charcoal">LOCK</span>
            <span className="text-xl font-bold font-mono tracking-tighter text-theme-charcoal">HEXA</span>
            <span className="text-xl font-bold font-mono tracking-tighter text-theme-charcoal">LINE</span>
          </div>
        </div>
      </section>

      {/* ── ONE PLAN AWAY FROM BETTER MEETINGS (PRICING) ── */}
      <section id="pricing" className="py-20 bg-theme-white border-t border-theme-lightgray/40">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-[Outfit] text-theme-charcoal mb-4 tracking-tight">
              One Plan Away <br /><span className="font-serif italic text-theme-olive">from Better Meetings</span>
            </h2>

            {/* Toggle pricing cycle */}
            <div className="inline-flex items-center gap-1.5 bg-theme-offwhite p-1 rounded-full border border-theme-lightgray/60 mt-4">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all cursor-pointer ${billingCycle === 'monthly' ? 'bg-theme-charcoal text-theme-lime' : 'bg-transparent text-theme-charcoal/70'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${billingCycle === 'annually' ? 'bg-theme-charcoal text-theme-lime' : 'bg-transparent text-theme-charcoal/70'}`}
              >
                <span>Annually</span>
                <span className="bg-theme-lime text-theme-charcoal text-[9px] font-extrabold px-1.5 py-0.5 rounded">SAVE 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            {/* Card 1: Starter */}
            <div className="bg-theme-offwhite border border-theme-lightgray/60 p-8 rounded-3xl flex flex-col justify-between shadow-sm transition-transform duration-200 hover:-translate-y-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-theme-charcoal/55">Starter</span>
                <p className="text-xs text-theme-charcoal/50 mt-1 mb-6">Perfect for individuals and small test projects.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-[Outfit] text-theme-charcoal">$0</span>
                  <span className="text-xs text-theme-charcoal/60">/ Free</span>
                </div>

                <hr className="border-theme-lightgray/80 mb-8" />

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Up to 5 participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>40 minutes meeting limit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Basic audio/video stream</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal/40">
                    <Check size={14} className="text-theme-charcoal/10 bg-theme-charcoal/5 rounded-full p-0.5 flex-shrink-0" />
                    <span>AI Transcription & Summaries</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full text-center py-3 rounded-xl border border-theme-charcoal hover:bg-theme-charcoal hover:text-theme-lime font-bold text-xs uppercase tracking-wider text-theme-charcoal transition-all no-underline inline-block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Card 2: Professional (LIME HIGHLIGHT ACTIVE CARD) */}
            <div className="bg-theme-lime border border-theme-olive/30 p-8 rounded-3xl flex flex-col justify-between shadow-lg transform md:-translate-y-4 transition-transform duration-200">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-theme-charcoal">Professional</span>
                  <span className="bg-theme-charcoal text-theme-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
                </div>
                <p className="text-xs text-theme-charcoal/70 mt-1 mb-6">Designed for growing business and collaborative teams.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-[Outfit] text-theme-charcoal">
                    {billingCycle === 'monthly' ? '$29' : '$23'}
                  </span>
                  <span className="text-xs text-theme-charcoal/80 font-medium">/ month</span>
                </div>

                <hr className="border-theme-charcoal/15 mb-8" />

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Up to 50 participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Unlimited meeting limit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>AI Transcriptions & Summaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Noise cancellation active filter</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>50GB cloud recording storage</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full text-center py-3 rounded-xl bg-theme-charcoal hover:bg-theme-charcoal/90 text-theme-white font-bold text-xs uppercase tracking-wider transition-all no-underline inline-block shadow-sm"
              >
                Free Trial for 14 Days
              </Link>
            </div>

            {/* Card 3: Enterprise */}
            <div className="bg-theme-offwhite border border-theme-lightgray/60 p-8 rounded-3xl flex flex-col justify-between shadow-sm transition-transform duration-200 hover:-translate-y-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-theme-charcoal/55">Enterprise</span>
                <p className="text-xs text-theme-charcoal/50 mt-1 mb-6">Custom features and dedicated infrastructure.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-[Outfit] text-theme-charcoal">Custom</span>
                </div>

                <hr className="border-theme-lightgray/80 mb-8" />

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Unlimited participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Dedicated server instances</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Custom API & SSO integrations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-theme-charcoal">
                    <Check size={14} className="text-theme-lime bg-theme-charcoal rounded-full p-0.5 flex-shrink-0" />
                    <span>Dedicated 24/7 account support</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="w-full text-center py-3 rounded-xl bg-theme-charcoal hover:bg-theme-charcoal/90 text-theme-white font-bold text-xs uppercase tracking-wider transition-all no-underline inline-block shadow-sm"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
      <section className="max-w-[1120px] mx-auto px-4 md:px-6 py-12">
        <div className="rounded-3xl bg-theme-charcoal text-theme-white p-8 md:p-16 relative overflow-hidden flex flex-col items-center text-center shadow-lg border border-theme-charcoal">
          {/* Subtle clouds background representation in custom theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-theme-charcoal via-theme-olive/10 to-theme-charcoal pointer-events-none"></div>

          {/* Tiny details avatars overlap */}
          <div className="flex -space-x-1.5 mb-6 z-10">
            <span className="w-8 h-8 rounded-full bg-theme-beige flex items-center justify-center text-[10px] font-bold border-2 border-theme-charcoal text-theme-charcoal">SJ</span>
            <span className="w-8 h-8 rounded-full bg-theme-lightgray flex items-center justify-center text-[10px] font-bold border-2 border-theme-charcoal text-theme-charcoal">KP</span>
            <span className="w-8 h-8 rounded-full bg-theme-lime flex items-center justify-center text-[10px] font-bold border-2 border-theme-charcoal text-theme-charcoal">ST</span>
            <span className="px-3 bg-theme-charcoal/80 border border-theme-lightgray/10 rounded-full flex items-center justify-center text-[9px] font-bold tracking-tight text-theme-white">50K+</span>
          </div>

          <h2 className="font-[Outfit] text-3xl md:text-5xl font-extrabold max-w-3xl leading-tight mb-6 z-10">
            Join 50,000+ teams already using MeetNow — starting today.
          </h2>

          <div className="z-10">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-theme-lime hover:bg-theme-lime/90 text-theme-charcoal font-extrabold text-sm shadow-md transition-all active:scale-[0.98] no-underline"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="about" className="bg-theme-offwhite py-16 px-4 md:px-6">
        <div className="max-w-[1120px] mx-auto bg-theme-charcoal text-theme-white p-8 md:p-12 rounded-[32px] border border-theme-charcoal shadow-xl flex flex-col gap-12">

          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 pb-8 border-b border-theme-lightgray/10">

            {/* Left Side: Newsletter and Branding */}
            <div className="flex flex-col justify-between gap-8">
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-bold font-[Outfit] tracking-tight">Subscribe to Newsletter</h3>
                <p className="text-xs text-theme-lightgray/60 leading-relaxed max-w-sm">
                  Stay updated with the latest trends, tips, and exclusive offers. Subscribe to our newsletter today!
                </p>

                {/* Email Form input (pill card style) */}
                <form onSubmit={(e) => e.preventDefault()} className="flex items-center max-w-xs bg-transparent border border-theme-lightgray/20 rounded-full p-1 pl-4 focus-within:border-theme-lime transition-all">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="bg-transparent flex-grow text-xs outline-none text-theme-white placeholder-theme-lightgray/40 py-2.5"
                    required
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-theme-white hover:bg-theme-lime text-theme-charcoal flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
                  >
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>

              <div>
                {/* Footer Logo */}
                <div className="flex items-center gap-2.5 text-lg font-bold text-theme-white mb-2">
                  <div className="w-8 h-8 bg-theme-lime rounded-xl flex items-center justify-center text-theme-charcoal shadow-sm">
                    <Video size={18} />
                  </div>
                  <span className="font-[Outfit] tracking-tight">MeetNow</span>
                </div>
                <p className="text-[10px] text-theme-lightgray/40">
                  © 2026 MeetNow. All rights reserved.
                </p>
              </div>
            </div>

            {/* Right Side: Links columns */}
            <div className="grid grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="text-xs font-semibold text-theme-white mb-4">Quick Links</h4>
                <ul className="space-y-3 text-xs text-theme-lightgray/60">
                  <li><a href="#home" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Home</a></li>
                  <li><a href="#features" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Features</a></li>
                  <li><a href="#pricing" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Pricing Plan</a></li>
                  <li><a href="#faq" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">FAQ</a></li>
                  <li><a href="#about" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-theme-white mb-4">Resources</h4>
                <ul className="space-y-3 text-xs text-theme-lightgray/60">
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Help Center</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Documentation</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Security</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">API for Developers</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Community</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-theme-white mb-4">Support</h4>
                <ul className="space-y-3 text-xs text-theme-lightgray/60">
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Live Chat</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Customer Support</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Report an Issue</a></li>
                  <li><a href="#" className="hover:text-theme-white hover:scale-[1.01] inline-block transition-all no-underline">Account Help</a></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Footer Bottom Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-theme-lightgray/40 gap-4">
            {/* Follow Us */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-theme-lightgray/50 font-medium">Follow Us</span>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded-lg bg-theme-charcoal/20 border border-theme-lightgray/10 hover:border-theme-white flex items-center justify-center text-theme-lightgray/60 hover:text-theme-white transition-all"><Facebook size={14} /></a>
                <a href="#" className="w-8 h-8 rounded-lg bg-theme-charcoal/20 border border-theme-lightgray/10 hover:border-theme-white flex items-center justify-center text-theme-lightgray/60 hover:text-theme-white transition-all"><Instagram size={14} /></a>
                <a href="#" className="w-8 h-8 rounded-lg bg-theme-charcoal/20 border border-theme-lightgray/10 hover:border-theme-white flex items-center justify-center text-theme-lightgray/60 hover:text-theme-white transition-all">
                  <span className="font-bold text-[10px]">in</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-theme-charcoal/20 border border-theme-lightgray/10 hover:border-theme-white flex items-center justify-center text-theme-lightgray/60 hover:text-theme-white transition-all">
                  <span className="font-bold text-[10px] font-sans">X</span>
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <a href="#" className="hover:text-theme-white hover:scale-[1.01] transition-all no-underline">Privacy Policy</a>
              <a href="#" className="hover:text-theme-white hover:scale-[1.01] transition-all no-underline">Terms & Condition</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
