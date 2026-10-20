import React, { useState } from 'react';
import { Sprout, ShieldCheck, MapPin, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Globe, Users, ShoppingBag, Leaf, Coins, Zap, BarChart3, Award, ExternalLink } from 'lucide-react';
import { CropListing, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MapContainer } from '../components/MapContainer';

interface LandingPageProps {
  listings: CropListing[];
  currentCurrency: CurrencyCode;
  onNavigate: (page: string) => void;
  onSelectListing: (listing: CropListing) => void;
  onOpenAIAgronomist: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  listings,
  currentCurrency,
  onNavigate,
  onSelectListing,
  onOpenAIAgronomist
}) => {
  const [activeCommodityIndex, setActiveCommodityIndex] = useState<number | null>(null);
  const featuredListings = listings.filter((l) => l.featured).slice(0, 4);

  return (
    <div className="space-y-16 pb-12 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-white pt-16 pb-24 rounded-b-3xl sm:rounded-b-[3rem] shadow-2xl">
        {/* Ambient Glowing Background Orbs with Animations */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-ambient-glow animation-delay-300" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge with gentle pulse and entrance */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md animate-fade-in-down hover:bg-emerald-500/20 transition-colors duration-300 cursor-default">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="tracking-wide">Pan-African Digital Agriculture & Trade Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-display animate-fade-in-up animation-delay-100">
                Connecting African Farmers directly to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 transition-all duration-300">Global Escrow Markets</span>.
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                AgriSphere Africa empowers smallholders, cooperatives, and commercial buyers across Kenya, Ghana, Nigeria, Ethiopia, and beyond with real-time commodity pricing, AI crop diagnostics, and guaranteed escrow payments.
              </p>

              {/* Call to Actions with tactile micro-interactions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 animate-fade-in-up animation-delay-300">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('marketplace')}
                  icon={<ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                >
                  Explore Crop Marketplace
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={onOpenAIAgronomist}
                  icon={<Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />}
                  className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40 hover:border-emerald-400/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 backdrop-blur-xs"
                >
                  Try AI Agronomist
                </Button>
              </div>

              {/* Stats strip with subtle hover lifts */}
              <div className="pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-center lg:text-left animate-fade-in-up animation-delay-400">
                <div className="p-2.5 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">12,500+</div>
                  <div className="text-xs text-stone-400 font-medium">Verified Farmers</div>
                </div>
                <div className="p-2.5 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-display">$14.2M+</div>
                  <div className="text-xs text-stone-400 font-medium">Escrow Traded</div>
                </div>
                <div className="p-2.5 rounded-2xl transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-xs">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">8 Hubs</div>
                  <div className="text-xs text-stone-400 font-medium">African Corridors</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Preview Card with Floating and Glow */}
            <div className="lg:col-span-5 animate-fade-in-up animation-delay-300">
              <div className="bg-stone-900/85 backdrop-blur-xl border border-stone-800/90 p-6 sm:p-7 rounded-3xl shadow-2xl space-y-4 hover:border-emerald-500/40 hover:shadow-emerald-950/40 transition-all duration-500 group">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Commodity Price Index</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                    Real-Time 2026
                  </span>
                </div>

                {/* Ticker items with individual hover elevations */}
                <div className="space-y-3">
                  {[
                    { title: 'White Maize (Kenya)', location: 'Trans-Nzoia Grain Belt', price: 0.38, shift: '+6.4% today', positive: true },
                    { title: 'Ashanti Cocoa (Ghana)', location: 'Kumasi Agricultural Co-op', price: 3.85, shift: '+3.2% today', positive: true },
                    { title: 'Magna Teff (Ethiopia)', location: 'Debre Zeit Highlands', price: 1.45, shift: 'Stable (0.0%)', positive: false }
                  ].map((item, idx) => (
                    <div
                      key={item.title}
                      onMouseEnter={() => setActiveCommodityIndex(idx)}
                      onMouseLeave={() => setActiveCommodityIndex(null)}
                      className={`p-3.5 bg-stone-950/70 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        activeCommodityIndex === idx
                          ? 'border-emerald-500/60 bg-stone-900 translate-x-1 shadow-md'
                          : 'border-stone-800/80 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-500" /> {item.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-400 font-mono">
                          {formatPrice(item.price, currentCurrency)}/kg
                        </span>
                        <p className={`text-[10px] font-semibold ${item.positive ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {item.shift}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Protected Escrow Footer Pill */}
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/50 rounded-2xl flex items-center justify-between text-xs text-emerald-200 transition-all duration-300 hover:bg-emerald-950/90">
                  <span className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Guaranteed Escrow Payouts</span>
                  </span>
                  <button
                    onClick={() => onNavigate('register')}
                    className="text-amber-300 hover:text-amber-200 hover:translate-x-0.5 transition-all font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5 text-emerald-700 animate-spin" style={{ animationDuration: '18s' }} />
              <span>Geographic Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Pan-African Agricultural Trade Map
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Browse verified smallholder harvests, cold-chain warehouses, and agricultural co-ops across Africa in real-time.
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('marketplace')}
            className="group hover:border-emerald-600 hover:text-emerald-800 transition-all duration-200 self-start md:self-auto"
          >
            <span>View Full Map & Filters</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-lg border border-stone-200/90 hover:border-emerald-500/40 transition-all duration-300">
          <MapContainer listings={listings} onSelectListing={onSelectListing} height="460px" />
        </div>
      </section>

      {/* Featured Marketplace Crops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-display">Featured Harvest Listings</h2>
            <p className="text-xs text-stone-500">Inspected for moisture, grade quality, and phytosanitary clearance.</p>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 group cursor-pointer transition-colors duration-200"
          >
            <span>Browse All ({listings.length})</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <Card
              key={listing.id}
              hoverEffect
              onClick={() => onSelectListing(listing)}
              className="overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image with zoom on hover */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-emerald-950/85 text-white backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {listing.country}
                    </span>
                    {listing.organic && (
                      <span className="bg-amber-400 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                        Organic
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {listing.cropCategory}
                    </span>
                    <span className="text-[11px] font-medium text-stone-400">
                      Grade {listing.grade}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors duration-200 line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{listing.farmerLocation}</span>
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                  <p className="text-[10px] text-stone-400 font-medium">Price per kg</p>
                  <p className="text-sm font-black text-emerald-800 font-mono">
                    {formatPrice(listing.pricePerKgUSD, currentCurrency)}
                  </p>
                </div>
                <Button variant="primary" size="sm" className="group-hover:bg-emerald-800 transition-colors duration-200">
                  View Specs
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Core Features */}
      <section className="bg-gradient-to-b from-stone-100/80 to-stone-50/90 border-y border-stone-200/90 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              Why AgriSphere Africa
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Built specifically for African Agricultural Trade
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Eliminating multi-layer middlemen, reducing post-harvest losses, and ensuring farmers get paid instantly upon quality delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors duration-200">
                100% Escrow Payment Guarantee
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Buyers lock funds into AgriSphere neutral escrow prior to harvest dispatch. Payouts release automatically once digital lab inspection is signed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-amber-400/60 hover:-translate-y-1.5 transition-all duration-300 group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors duration-200">
                Gemini AI Crop Agronomist
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Smallholders diagnose leaf pests, soil moisture stress, and fertilizer requirements in seconds using tailored AI models tuned for African ecosystems.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-sky-400/60 hover:-translate-y-1.5 transition-all duration-300 group space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900 group-hover:text-sky-800 transition-colors duration-200">
                Cross-Border Currency Conversion
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Seamlessly transact across Kenyan Shillings (KES), Nigerian Naira (NGN), Ghanaian Cedi (GHS), Ethiopian Birr (ETB), and USD.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-8 sm:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl hover:shadow-emerald-950/40 transition-shadow duration-500">
          
          {/* Ambient Glow in CTA */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 text-center lg:text-left relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/50">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sustainable Agriculture Transformation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display">
              Ready to scale your agricultural trade?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
              Join thousands of smallholders, exporters, food processors, and agricultural cooperatives transforming Pan-African food security.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 relative z-10">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('register')}
              className="bg-white text-stone-900 hover:bg-stone-100 hover:scale-105 active:scale-95 shadow-lg transition-all duration-300"
            >
              Create Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 text-white hover:bg-white/10 hover:scale-105 active:scale-95 backdrop-blur-xs transition-all duration-300"
              onClick={() => onNavigate('marketplace')}
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
