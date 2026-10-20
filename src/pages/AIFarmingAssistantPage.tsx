import React from 'react';
import { Sparkles, Sprout, ShieldCheck, HeartPulse, Brain, Zap, Globe, MessageSquare } from 'lucide-react';
import { AIFarmingAssistant } from '../components/ai/AIFarmingAssistant';
import { UserProfile } from '../types';

interface AIFarmingAssistantPageProps {
  currentUser: UserProfile | null;
  onNavigate: (page: string) => void;
}

export const AIFarmingAssistantPage: React.FC<AIFarmingAssistantPageProps> = ({
  currentUser,
  onNavigate
}) => {
  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/40 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              AgriSphere Voice & Chat Intelligence
            </span>
            <span className="text-xs text-stone-400">• Supabase Cloud Sync</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
            AI Agronomist & Farming Assistant
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
            Get instant expert guidance on seed spacing, crop disease diagnosis, fertilizer application ratios, weather advisories, and regional wholesale market prices across Africa.
          </p>
        </div>

        {/* Metric Pill Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="block text-amber-300 font-extrabold text-base">7 Topics</span>
            <span className="text-[11px] text-stone-300">Agri Modules</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="block text-emerald-400 font-extrabold text-base">Voice Input</span>
            <span className="text-[11px] text-stone-300">Speech Rec</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="block text-sky-400 font-extrabold text-base">Voice Output</span>
            <span className="text-[11px] text-stone-300">Speech Synthesis</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="block text-teal-300 font-extrabold text-base">Supabase</span>
            <span className="text-[11px] text-stone-300">History Saved</span>
          </div>
        </div>
      </div>

      {/* Main AI Chat Assistant */}
      <AIFarmingAssistant currentUserId={currentUser?.id || 'usr_farmer_001'} />

    </div>
  );
};
