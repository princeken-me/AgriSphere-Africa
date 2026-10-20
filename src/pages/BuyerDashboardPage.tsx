import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, ShieldCheck, DollarSign, Store, TrendingUp, Search, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { Order, CropListing, CurrencyCode, UserProfile, MarketPriceIndex } from '../types';
import { formatPrice } from '../utils/currency';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MarketChart } from '../components/MarketChart';
import { MARKET_PRICE_INDICES } from '../data/mockData';

interface BuyerDashboardPageProps {
  currentUser: UserProfile;
  orders: Order[];
  listings: CropListing[];
  currentCurrency: CurrencyCode;
  onNavigate: (page: string) => void;
  onSelectListing: (listing: CropListing) => void;
}

export const BuyerDashboardPage: React.FC<BuyerDashboardPageProps> = ({
  currentUser,
  orders,
  listings,
  currentCurrency,
  onNavigate,
  onSelectListing
}) => {
  const buyerOrders = orders.filter((o) => o.buyerId === currentUser.id || o.buyerName.includes('Amara Diallo'));
  const totalSpentUSD = buyerOrders.reduce((sum, o) => sum + o.totalPriceUSD, 0);

  const [selectedIndex, setSelectedIndex] = useState<MarketPriceIndex>(MARKET_PRICE_INDICES[0]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Buyer Dashboard</h1>
          <p className="text-stone-500 text-sm">
            Company: {currentUser.companyName || 'GoldCoast Agribusiness Exports'} • Location: {currentUser.location || 'Accra Port Terminal'} • Status: Active Escrow Buyer
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('orders')}
            icon={<ShoppingBag className="w-4 h-4 text-emerald-700" />}
          >
            Export Orders
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('marketplace')}
            icon={<Store className="w-4 h-4" />}
          >
            Source New Crops
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Escrow Committed"
          value={formatPrice(totalSpentUSD, currentCurrency)}
          change="+14.2%"
          isPositive
          icon={<DollarSign className="w-5 h-5" />}
          subtitle="Protected in AgriSphere Vault"
        />
        <StatCard
          title="Active Orders in Flight"
          value={buyerOrders.length}
          icon={<ShoppingBag className="w-5 h-5" />}
          subtitle="In transit / Lab test stage"
        />
        <StatCard
          title="Verified Farm Partners"
          value="14 Co-ops"
          change="Verified"
          isPositive
          icon={<ShieldCheck className="w-5 h-5" />}
          subtitle="Kenya, Ghana, Ethiopia, Nigeria"
        />
        <StatCard
          title="Avg Quality Score"
          value="98.5%"
          change="Export Grade"
          isPositive
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="KEPHIS & COCOBOD Inspected"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Orders & Market Trends */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Orders Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">My Procurement Orders</h3>
                <p className="text-xs text-stone-500">Real-time status of escrow funding and dispatch milestones.</p>
              </div>
              <button onClick={() => onNavigate('orders')} className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                Full Order History →
              </button>
            </div>

            <div className="space-y-4">
              {buyerOrders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <img src={order.cropImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">{order.listingTitle}</span>
                          <Badge variant={order.status === 'in_transit' ? 'amber' : 'emerald'}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-500">
                          Supplier: <strong>{order.farmerName}</strong> • Order #{order.orderNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-extrabold text-emerald-800">{formatPrice(order.totalPriceUSD, currentCurrency)}</p>
                      <p className="text-[10px] text-stone-400">{order.quantityKg.toLocaleString()} kg @ {formatPrice(order.unitPriceUSD, currentCurrency)}/kg</p>
                    </div>
                  </div>

                  {/* Timeline mini bar */}
                  <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
                    {order.timeline.map((item, idx) => (
                      <div key={idx} className={`p-2 rounded-xl text-[10px] ${item.completed ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'bg-stone-50 text-stone-400'}`}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commodity Price Trend Analytics */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-display">Pan-African Commodity Price Indices</h3>
                <p className="text-xs text-stone-500">Track 7-day wholesale price trends for decision support.</p>
              </div>

              {/* Selector */}
              <div className="flex flex-wrap gap-1.5">
                {MARKET_PRICE_INDICES.map((idx) => (
                  <button
                    key={idx.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedIndex.id === idx.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {idx.commodity} ({idx.country})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl">
              <div>
                <span className="text-xs text-stone-500 font-medium">{selectedIndex.commodity} Spot Rate</span>
                <p className="text-lg font-black text-stone-900">{formatPrice(selectedIndex.currentPriceUSD, currentCurrency)} / kg</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500">24h Change</span>
                <p className="text-sm font-bold text-emerald-700">+{selectedIndex.priceChange24h}%</p>
              </div>
            </div>

            <MarketChart marketIndex={selectedIndex} />
          </div>

        </div>

        {/* Right Column: Recommended Suppliers & Lab Certs */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Top Recommended Crops</h4>
            <div className="space-y-3">
              {listings.slice(0, 3).map((listing) => (
                <div
                  key={listing.id}
                  onClick={() => onSelectListing(listing)}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-colors"
                >
                  <img src={listing.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-stone-900 truncate">{listing.title}</h5>
                    <p className="text-[10px] text-stone-500">{listing.farmerName} • {listing.country}</p>
                    <p className="text-xs font-extrabold text-emerald-800 mt-0.5">{formatPrice(listing.pricePerKgUSD, currentCurrency)}/kg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-white p-5 rounded-3xl space-y-3 shadow-md">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-300" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Phytosanitary Verification</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every shipment processed on AgriSphere includes digital KEPHIS, COCOBOD, or IITA lab certificates verifying moisture content, aflatoxin limits, and non-GMO status.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
