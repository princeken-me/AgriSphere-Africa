import React, { useState } from 'react';
import { Sprout, ShieldCheck, Globe, Mail, Phone, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3500);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-8 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => onNavigate('landing')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-display group-hover:text-emerald-400 transition-colors duration-200">
                AgriSphere Africa
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Empowering 100,000+ African smallholder farmers and agricultural cooperatives with real-time market access, escrow trade security, and AI crop diagnostics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="font-semibold">100% Escrow Protected Trade</span>
            </div>
          </div>

          {/* Platform Links with hover slide */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Platform Hubs
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: 'Crop Marketplace', page: 'marketplace' },
                { label: 'Farmer Yield Analytics', page: 'farmer-dashboard' },
                { label: 'Buyer Procurement Hub', page: 'buyer-dashboard' },
                { label: 'Escrow Trade Tracking', page: 'orders' }
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="hover:text-emerald-400 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1 text-stone-400 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-emerald-400" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Regional Corridors
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2 hover:text-stone-200 transition-colors">
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                East Africa: Nairobi & Kampala
              </li>
              <li className="flex items-center gap-2 hover:text-stone-200 transition-colors">
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                West Africa: Accra & Lagos
              </li>
              <li className="flex items-center gap-2 hover:text-stone-200 transition-colors">
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                Horn of Africa: Addis Ababa
              </li>
              <li className="flex items-center gap-2 hover:text-stone-200 transition-colors">
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                Southern Africa: Johannesburg
              </li>
              <li className="flex items-center gap-2 hover:text-stone-200 transition-colors">
                <span className="w-1 h-1 rounded-full bg-stone-600" />
                Central Africa: Kigali
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact with active state transition */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Pan-African Network
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Get weekly commodity price indices and AI yield forecast reports directly in your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed to weekly agricultural commodity reports!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-stone-900 border border-stone-800 text-xs text-white px-3.5 py-2.5 rounded-xl w-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar with smooth link hover */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 AgriSphere Africa Ltd. Built for sustainable Pan-African agricultural growth.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Terms of Service</span>
            <span className="hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Phytosanitary Standards</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar with pulsating live indicator */}
      <div className="mt-8 flex h-9 items-center justify-between border-t border-stone-800/80 bg-stone-950 px-6 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Cloud Sync: <span className="text-emerald-400 font-semibold">Active & Live</span></span>
          </div>
          <span className="hidden sm:inline">GPS Geofencing: 1.2m Accuracy</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Version 2.4.1</span>
          <span>© AgriSphere Africa</span>
        </div>
      </div>
    </footer>
  );
};
