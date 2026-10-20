import React from 'react';
import { LayoutDashboard, Store, ShoppingBag, MessageSquare, Bell, Settings, User, Sparkles, CloudSun, TrendingUp, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  userRole: UserRole;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAIAgronomist: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole,
  activePage,
  onNavigate,
  onOpenAIAgronomist
}) => {
  const farmerNav = [
    { label: 'Farmer Dashboard', page: 'farmer-dashboard', icon: LayoutDashboard },
    { label: 'AI Farming Assistant', page: 'ai-assistant', icon: Sparkles },
    { label: 'Marketplace', page: 'marketplace', icon: Store },
    { label: 'Orders & Escrow', page: 'orders', icon: ShoppingBag },
    { label: 'Messages & Bids', page: 'messages', icon: MessageSquare },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'My Farm Profile', page: 'profile', icon: User },
    { label: 'Settings', page: 'settings', icon: Settings }
  ];

  const buyerNav = [
    { label: 'Buyer Dashboard', page: 'buyer-dashboard', icon: LayoutDashboard },
    { label: 'AI Farming Assistant', page: 'ai-assistant', icon: Sparkles },
    { label: 'Crop Marketplace', page: 'marketplace', icon: Store },
    { label: 'My Orders', page: 'orders', icon: ShoppingBag },
    { label: 'Direct Messages', page: 'messages', icon: MessageSquare },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'Business Profile', page: 'profile', icon: User },
    { label: 'Settings', page: 'settings', icon: Settings }
  ];

  const items = userRole === 'buyer' ? buyerNav : farmerNav;

  return (
    <aside className="w-64 border-r border-stone-200 bg-white p-6 shrink-0 hidden lg:flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* Main Menu Label */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Main Menu</p>
          <nav className="space-y-1">
            {items.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Account & Settings Label */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Account & Tools</p>
          <nav className="space-y-1">
            {items.slice(5).map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`w-full flex items-center gap-3 rounded-lg p-2.5 text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Agronomist Action Button */}
        <button
          onClick={onOpenAIAgronomist}
          className="w-full p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-1.5 bg-white/10 rounded-md">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">AI Crop Agronomist</p>
            <p className="text-[10px] text-emerald-100">Diagnosis & Advisory</p>
          </div>
        </button>
      </div>

      {/* Sidebar Footer Weather Card */}
      <div className="bg-stone-900 text-white rounded-xl p-4 space-y-2 mt-4">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold flex items-center gap-1 text-emerald-400">
            <CloudSun className="w-3.5 h-3.5" /> Regional Weather
          </span>
          <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">Kitale</span>
        </div>
        <p className="text-base font-bold text-white">27°C <span className="text-xs font-normal text-stone-400">| Partly Cloudy</span></p>
        <p className="text-[10px] text-stone-400">Rainfall expected in 48h. Harvesting window active.</p>
      </div>
    </aside>
  );
};
