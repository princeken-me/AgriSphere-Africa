import React, { useState, useEffect } from 'react';
import { Sprout, Bell, MessageSquare, Globe, User, LogOut, ChevronDown, Menu, X, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { UserProfile, CurrencyCode, UserRole } from '../../types';
import { CURRENCY_RATES } from '../../utils/currency';
import { Button } from './Button';

interface NavbarProps {
  currentUser: UserProfile | null;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onRoleSwitch: (role: UserRole) => void;
  unreadNotifsCount: number;
  unreadMessagesCount: number;
  cartCount?: number;
  onOpenCart?: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenAIAgronomist: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentCurrency,
  onCurrencyChange,
  onRoleSwitch,
  unreadNotifsCount,
  unreadMessagesCount,
  cartCount = 0,
  onOpenCart,
  activePage,
  onNavigate,
  onOpenAIAgronomist,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Marketplace', page: 'marketplace' },
    { label: currentUser?.role === 'buyer' ? 'Buyer Hub' : 'Farmer Dashboard', page: currentUser?.role === 'buyer' ? 'buyer-dashboard' : 'farmer-dashboard' },
    { label: 'AI Assistant', page: 'ai-assistant' },
    { label: 'Orders & Escrow', page: 'orders' },
    { label: 'Messages', page: 'messages' }
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200/80' : 'bg-white border-b border-stone-200 shadow-2xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo with micro hover scale */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => onNavigate('landing')}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white shadow-xs group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold tracking-tight text-emerald-950 font-display">AgriSphere</span>
              <span className="text-xl font-light text-stone-500">Africa</span>
            </div>
          </div>

          {/* Nav Items (Desktop) with smooth pill highlight transitions */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-stone-600">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-emerald-800 font-bold bg-emerald-50 shadow-2xs'
                      : 'hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* AI Crop Advisor trigger button with pulse animation */}
            <button
              onClick={onOpenAIAgronomist}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>AI Agronomist</span>
            </button>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <select
                value={currentCurrency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-2.5 py-1.5 cursor-pointer hover:bg-stone-100 hover:border-stone-300 transition-all duration-200 focus:outline-none"
              >
                {Object.keys(CURRENCY_RATES).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_RATES[curr as CurrencyCode].symbol.trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Role quick toggle selector */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-1 bg-stone-100 border border-stone-200 p-0.5 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => onRoleSwitch('farmer')}
                  className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                    currentUser.role === 'farmer' ? 'bg-emerald-700 text-white shadow-xs scale-100' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Farmer View"
                >
                  Farmer
                </button>
                <button
                  onClick={() => onRoleSwitch('buyer')}
                  className={`px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer ${
                    currentUser.role === 'buyer' ? 'bg-emerald-700 text-white shadow-xs scale-100' : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Buyer View"
                >
                  Buyer
                </button>
              </div>
            )}

            {/* Cart Icon with bounce/pulse */}
            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                title="View Wholesale Escrow Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Icon with bounce */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Messages Icon */}
            <button
              onClick={() => onNavigate('messages')}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <div className="h-7 w-[1px] bg-stone-200 hidden sm:block"></div>

            {/* Profile Menu / Authentication state */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-stone-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-stone-200"
                >
                  <img
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-600/20"
                  />
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 hidden sm:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-fade-in-down origin-top-right">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                        {currentUser?.country || 'Kenya'} • {currentUser?.role || 'user'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-emerald-800 flex items-center gap-2 transition-colors duration-150"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('settings');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-emerald-800 flex items-center gap-2 transition-colors duration-150"
                    >
                      <Globe className="w-4 h-4 text-stone-400" />
                      Platform Settings
                    </button>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onNavigate('login')} className="hover:scale-105 active:scale-95 transition-all">
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => onNavigate('register')} className="hover:scale-105 active:scale-95 transition-all">
                  Register
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with smooth animation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3 animate-fade-in-down">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                  activePage === item.page ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAIAgronomist();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              Launch AI Agronomist Diagnostic
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  onRoleSwitch(currentUser.role === 'farmer' ? 'buyer' : 'farmer');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
              >
                Switch to {currentUser.role === 'farmer' ? 'Buyer' : 'Farmer'} Mode
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
