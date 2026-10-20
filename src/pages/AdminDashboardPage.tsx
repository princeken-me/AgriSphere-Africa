import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Store,
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Award,
  RefreshCw,
  Megaphone,
  Sliders,
  DollarSign,
  Globe,
  FileSpreadsheet,
  ArrowUpRight,
  Eye,
  Check,
  UserPlus
} from 'lucide-react';
import { UserProfile, CropListing, Order, UserRole, CurrencyCode } from '../types';
import { firestoreService } from '../lib/firebase';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

interface AdminDashboardPageProps {
  currentUser: UserProfile | null;
  users: UserProfile[];
  listings: CropListing[];
  orders: Order[];
  onUpdateUsers: (users: UserProfile[]) => void;
  onUpdateListings: (listings: CropListing[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onNavigate: (page: string) => void;
  onOpenAddProductModal: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  users,
  listings,
  orders,
  onUpdateUsers,
  onUpdateListings,
  onUpdateOrders,
  onNavigate,
  onOpenAddProductModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'orders' | 'settings'>('overview');

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('All');
  const [userCountryFilter, setUserCountryFilter] = useState<string>('All');

  const [listingSearch, setListingSearch] = useState('');
  const [listingCategoryFilter, setListingCategoryFilter] = useState<string>('All');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // System Settings State
  const [escrowFeeRate, setEscrowFeeRate] = useState<number>(2.5);
  const [systemBroadcast, setSystemBroadcast] = useState<string>(
    'System Advisory: Cross-border trade clearing active across Kenya (KEPHIS) & Ghana (COCOBOD). Normal inspection turnaround 24 hours.'
  );
  const [isBroadcastSaved, setIsBroadcastSaved] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Modal State for Add User
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    role: 'farmer' as UserRole,
    country: 'Kenya',
    phone: '',
    location: '',
    companyName: ''
  });

  // Calculate Metrics
  const totalGmvUSD = orders.reduce((sum, o) => sum + o.totalPriceUSD, 0);
  const totalEscrowLockedUSD = orders
    .filter((o) => o.status === 'escrow_paid' || o.status === 'inspection' || o.status === 'in_transit')
    .reduce((sum, o) => sum + o.totalPriceUSD, 0);
  const totalQuantityKg = listings.reduce((sum, l) => sum + l.quantityAvailableKg, 0);
  const verifiedUserCount = users.filter((u) => u.verifiedStatus).length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.country.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchesCountry = userCountryFilter === 'All' || u.country === userCountryFilter;
    return matchesSearch && matchesRole && matchesCountry;
  });

  // Filtered Listings
  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.country.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCat = listingCategoryFilter === 'All' || l.cropCategory === listingCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.listingTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.farmerName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // User Management Actions
  const handleToggleUserVerification = (userId: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
      firestoreService.updateUser(userId, { verifiedStatus: !userToUpdate.verifiedStatus });
    }
    const updated = users.map((u) => (u.id === userId ? { ...u, verifiedStatus: !u.verifiedStatus } : u));
    onUpdateUsers(updated);
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    firestoreService.updateUser(userId, { role: newRole });
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    onUpdateUsers(updated);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) return;

    const created: UserProfile = {
      id: `usr_${newUserForm.role}_${Date.now()}`,
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      role: newUserForm.role,
      country: newUserForm.country,
      phone: newUserForm.phone || '+254 700 000 000',
      location: newUserForm.location || 'Nairobi Central Hub',
      companyName: newUserForm.companyName || undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      verifiedStatus: true
    };

    firestoreService.saveUser(created);
    onUpdateUsers([created, ...users]);
    setIsAddUserModalOpen(false);
    setNewUserForm({
      fullName: '',
      email: '',
      role: 'farmer',
      country: 'Kenya',
      phone: '',
      location: '',
      companyName: ''
    });
  };

  // Listing Management Actions
  const handleToggleFeaturedListing = (listingId: string) => {
    const listingToUpdate = listings.find(l => l.id === listingId);
    if (listingToUpdate) {
      firestoreService.saveListing({ ...listingToUpdate, featured: !listingToUpdate.featured });
    }
    const updated = listings.map((l) => (l.id === listingId ? { ...l, featured: !l.featured } : l));
    onUpdateListings(updated);
  };

  const handleDeleteListingAdmin = (listingId: string) => {
    if (window.confirm('Admin Action: Permanently delete this crop listing from the platform?')) {
      firestoreService.deleteListing(listingId);
      onUpdateListings(listings.filter((l) => l.id !== listingId));
    }
  };

  // Order Management Actions
  const handleForceReleaseEscrow = (orderId: string) => {
    if (window.confirm('Admin Action: Force release Escrow funds to the farmer/supplier?')) {
      firestoreService.updateOrder(orderId, { status: 'delivered' });
      const updated = orders.map((o) => {
        if (o.id === orderId) {
          const updatedTimeline = o.timeline.map((item) =>
            item.status === 'delivered' ? { ...item, completed: true, timestamp: 'Released by Admin' } : item
          );
          return { ...o, status: 'delivered' as const, timeline: updatedTimeline };
        }
        return o;
      });
      onUpdateOrders(updated);
    }
  };

  const handleHoldEscrowDispute = (orderId: string) => {
    if (window.confirm('Admin Action: Freeze and flag Escrow funds for quality inspection dispute?')) {
      firestoreService.updateOrder(orderId, { status: 'inspection' });
      const updated = orders.map((o) => {
        if (o.id === orderId) {
          return { ...o, status: 'inspection' as const };
        }
        return o;
      });
      onUpdateOrders(updated);
    }
  };

  const handleSaveBroadcast = () => {
    firestoreService.saveSystemSettings({
      escrowFeeRate: escrowFeeRate,
      systemBroadcast: systemBroadcast,
      maintenanceMode: false
    });
    setIsBroadcastSaved(true);
    setTimeout(() => setIsBroadcastSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              SYSTEM ADMIN CONSOLE
            </span>
            <span className="text-xs text-stone-400">• Full Governance & Control</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            AgriSphere Africa Control Panel
          </h1>
          
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
            Manage users, inspect and feature crop listings, release or hold Escrow trade funds, adjust platform commission fees, and configure pan-African agricultural compliance rules.
          </p>
        </div>

        {/* Quick System Action */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsAddUserModalOpen(true)}
            icon={<UserPlus className="w-4 h-4 text-emerald-400" />}
            className="bg-stone-800/80 border-stone-700 text-stone-100 hover:bg-stone-700 text-xs"
          >
            Add Official User
          </Button>

          <Button
            variant="primary"
            onClick={onOpenAddProductModal}
            icon={<Plus className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-md"
          >
            Create Crop Listing
          </Button>
        </div>
      </div>

      {/* Broadcast System Banner (Admin Configurable) */}
      {systemBroadcast && (
        <div className="bg-emerald-950/80 border border-emerald-800/80 text-emerald-100 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-semibold">{systemBroadcast}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-900/90 px-2.5 py-1 rounded-lg shrink-0">
            Active Broadcast
          </span>
        </div>
      )}

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="p-5 border-stone-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Gross Trade Volume</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">${totalGmvUSD.toLocaleString()} <span className="text-xs font-normal text-stone-500">USD</span></p>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month across 6 countries
          </div>
        </Card>

        <Card className="p-5 border-stone-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Escrow Locked Funds</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">${totalEscrowLockedUSD.toLocaleString()} <span className="text-xs font-normal text-stone-500">USD</span></p>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold">
            {orders.filter((o) => o.status === 'escrow_paid').length} active trades protected
          </div>
        </Card>

        <Card className="p-5 border-stone-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Total Crop Inventory</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{(totalQuantityKg / 1000).toFixed(1)}k <span className="text-xs font-normal text-stone-500">MT</span></p>
          <div className="mt-2 text-[11px] text-sky-700 font-semibold">
            {listings.length} active grain & cash crop listings
          </div>
        </Card>

        <Card className="p-5 border-stone-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Verified Traders</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-stone-900">{users.length} <span className="text-xs font-normal text-stone-500">Accounts</span></p>
          <div className="mt-2 text-[11px] text-indigo-700 font-semibold">
            {verifiedUserCount} KEPHIS/COCOBOD verified
          </div>
        </Card>

      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex items-center gap-1 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar">
        
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>System Overview & Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>User Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Store className="w-4 h-4 text-amber-400" />
          <span>Crop Inventory ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-indigo-400" />
          <span>Escrow & Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-rose-400" />
          <span>System Settings & Broadcast</span>
        </button>

      </div>

      {/* TAB 1: OVERVIEW & AUDIT LOGS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* System Security & Regional Compliance Status */}
            <Card className="lg:col-span-2 p-6 border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Pan-African Agricultural Compliance & API Gateways
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  100% OPERATIONAL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">KEPHIS Integration (Kenya)</span>
                    <span className="text-emerald-700 font-extrabold">CONNECTED</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Phytosanitary certificate validation & moisture content verifying active.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Ghana COCOBOD Board</span>
                    <span className="text-emerald-700 font-extrabold">CONNECTED</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Ashanti & Western region cocoa bean quality checks auto-verified.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Escrow Security Vault</span>
                    <span className="text-emerald-700 font-extrabold">ENCRYPTED</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Multi-sig smart escrow holding ${totalEscrowLockedUSD.toLocaleString()} USD.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Supabase Cloud Sync</span>
                    <span className="text-emerald-700 font-extrabold">ACTIVE</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Real-time chat messages, AI agronomist logs, and orders sync.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                <span>Current Platform Fee: <strong>{escrowFeeRate}% per Escrow trade</strong></span>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Configure Fees & Broadcast →
                </button>
              </div>
            </Card>

            {/* Admin Audit Log Feed */}
            <Card className="p-6 border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  System Audit Trail
                </h3>
                <span className="text-[10px] text-stone-400">Live Feed</span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Escrow Funds Locked</span>
                    <span className="text-[10px] text-stone-400">10 mins ago</span>
                  </div>
                  <p className="text-[11px] text-stone-600">Buyer Amara Diallo deposited $9,500 USD for Order AGRI-849201 (Grade A White Maize).</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Listing Verified</span>
                    <span className="text-[10px] text-stone-400">45 mins ago</span>
                  </div>
                  <p className="text-[11px] text-stone-600">Organic Ashanti Cocoa Beans (#crop_002) certified with COCOBOD Export Clearance.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">New Trader Onboarded</span>
                    <span className="text-[10px] text-stone-400">2 hours ago</span>
                  </div>
                  <p className="text-[11px] text-stone-600">Trans-Africa Logistics Ltd registered as verified regional logistics carrier.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Phytosanitary Clearance</span>
                    <span className="text-[10px] text-stone-400">5 hours ago</span>
                  </div>
                  <p className="text-[11px] text-stone-600">KEPHIS Inspector issued phytosanitary certificate for avocado shipment to Dubai.</p>
                </div>
              </div>
            </Card>

          </div>

          {/* Platform Performance Overview */}
          <Card className="p-6 border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Regional Commodity Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Grains & Cereals</span>
                <span className="text-sm font-extrabold text-emerald-800">42,000 Kg</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Cash Crops</span>
                <span className="text-sm font-extrabold text-amber-800">14,000 Kg</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Pulses & Legumes</span>
                <span className="text-sm font-extrabold text-sky-800">18,500 Kg</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Fruits & Veg</span>
                <span className="text-sm font-extrabold text-teal-800">22,000 Kg</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Nuts & Seeds</span>
                <span className="text-sm font-extrabold text-indigo-800">9,200 Kg</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Roots & Tubers</span>
                <span className="text-sm font-extrabold text-purple-800">15,000 Kg</span>
              </div>
            </div>
          </Card>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <Card className="p-6 border-stone-200 space-y-4 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">User Account & Trader Governance</h3>
              <p className="text-xs text-stone-500">Inspect, verify, manage, or change roles for registered platform traders across Africa.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setIsAddUserModalOpen(true)}
                icon={<UserPlus className="w-4 h-4" />}
                className="text-xs bg-emerald-700 hover:bg-emerald-800"
              >
                Add User Account
              </Button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, country..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="All">All User Roles</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="cooperative">Cooperatives</option>
                <option value="logistics">Logistics Carriers</option>
                <option value="admin">Platform Admins</option>
              </select>
            </div>

            <div>
              <select
                value={userCountryFilter}
                onChange={(e) => setUserCountryFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="All">All Countries</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Tanzania">Tanzania</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">Trader Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Country / Location</th>
                  <th className="p-3">KEPHIS / Verification</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{u.fullName}</p>
                          <p className="text-[11px] text-stone-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                        className="bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-bold px-2 py-1 rounded-lg focus:outline-none"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="buyer">Buyer</option>
                        <option value="cooperative">Cooperative</option>
                        <option value="logistics">Logistics</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-3 text-stone-700">
                      <p className="font-semibold">{u.country}</p>
                      <p className="text-[10px] text-stone-500">{u.location || u.farmName || u.companyName || 'Regional Hub'}</p>
                    </td>

                    <td className="p-3">
                      {u.verifiedStatus ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                          UNVERIFIED
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-stone-500 text-[11px]">
                      {u.joinedDate || '2024-01-01'}
                    </td>

                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserVerification(u.id)}
                        className={`text-[11px] px-2.5 py-1 ${
                          u.verifiedStatus ? 'text-rose-700 border-rose-200 hover:bg-rose-50' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.verifiedStatus ? 'Revoke Verification' : 'Verify Account'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      )}

      {/* TAB 3: CROP LISTINGS MANAGEMENT */}
      {activeTab === 'listings' && (
        <Card className="p-6 border-stone-200 space-y-4 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Crop Inventory & Marketplace Moderation</h3>
              <p className="text-xs text-stone-500">Feature top harvests, review quality certifications, or delete non-compliant crop listings.</p>
            </div>

            <Button
              variant="primary"
              onClick={onOpenAddProductModal}
              icon={<Plus className="w-4 h-4" />}
              className="text-xs bg-emerald-700 hover:bg-emerald-800 shrink-0"
            >
              Add New Crop Listing
            </Button>
          </div>

          {/* Search & Category Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                placeholder="Search crop title, farmer, country..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <select
                value={listingCategoryFilter}
                onChange={(e) => setListingCategoryFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="All">All Commodity Categories</option>
                <option value="Grains & Cereals">Grains & Cereals</option>
                <option value="Cash Crops">Cash Crops</option>
                <option value="Pulses & Legumes">Pulses & Legumes</option>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Nuts & Seeds">Nuts & Seeds</option>
                <option value="Roots & Tubers">Roots & Tubers</option>
              </select>
            </div>
          </div>

          {/* Listings Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">Crop Title & Category</th>
                  <th className="p-3">Supplier / Farmer</th>
                  <th className="p-3">Price & Stock</th>
                  <th className="p-3">Grade & Moisture</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredListings.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={l.image}
                          alt={l.title}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{l.title}</p>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {l.cropCategory}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-stone-700">
                      <p className="font-semibold">{l.farmerName}</p>
                      <p className="text-[10px] text-stone-500">{l.farmerLocation}, {l.country}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-extrabold text-stone-900">${l.pricePerKgUSD.toFixed(2)} / Kg</p>
                      <p className="text-[10px] text-stone-500">{(l.quantityAvailableKg / 1000).toFixed(1)} MT available</p>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-stone-800 block">{l.grade}</span>
                      <span className="text-[10px] text-stone-500">Moisture: {l.moistureContent}</span>
                    </td>

                    <td className="p-3">
                      {l.featured ? (
                        <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-600" /> FEATURED
                        </span>
                      ) : (
                        <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Standard Listing
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleFeaturedListing(l.id)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            l.featured ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                          title={l.featured ? 'Unfeature on Homepage' : 'Promote to Featured'}
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteListingAdmin(l.id)}
                          className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      )}

      {/* TAB 4: ESCROW & ORDERS GOVERNANCE */}
      {activeTab === 'orders' && (
        <Card className="p-6 border-stone-200 space-y-4 animate-in fade-in duration-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">Escrow & Trade Order Governance</h3>
              <p className="text-xs text-stone-500">Monitor active trade escrows, force release funds to suppliers, or freeze dispute orders.</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, crop, buyer name..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="All">All Escrow Statuses</option>
                <option value="escrow_paid">Escrow Locked</option>
                <option value="inspection">Inspection / Dispute</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered / Released</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto border border-stone-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">Order # & Date</th>
                  <th className="p-3">Crop Commodity</th>
                  <th className="p-3">Trader Parties</th>
                  <th className="p-3">Escrow Value</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Escrow Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-bold text-stone-900">
                      <p>{o.orderNumber}</p>
                      <span className="text-[10px] text-stone-500 font-normal">{o.orderDate}</span>
                    </td>

                    <td className="p-3">
                      <p className="font-semibold text-stone-900">{o.listingTitle}</p>
                      <p className="text-[10px] text-stone-500">{o.quantityKg.toLocaleString()} Kg @ ${o.unitPriceUSD}/Kg</p>
                    </td>

                    <td className="p-3 text-stone-700">
                      <p className="text-[11px] font-semibold text-emerald-900">Buyer: {o.buyerName}</p>
                      <p className="text-[10px] text-stone-500">Supplier: {o.farmerName}</p>
                    </td>

                    <td className="p-3">
                      <p className="font-extrabold text-stone-900">${o.totalPriceUSD.toLocaleString()} USD</p>
                      <span className="text-[10px] text-emerald-700 font-bold">100% Escrow Protected</span>
                    </td>

                    <td className="p-3">
                      {o.status === 'escrow_paid' && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" /> ESCROW LOCKED
                        </span>
                      )}
                      {o.status === 'inspection' && (
                        <span className="bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          INSPECTION / DISPUTE
                        </span>
                      )}
                      {o.status === 'in_transit' && (
                        <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          IN TRANSIT
                        </span>
                      )}
                      {o.status === 'delivered' && (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> PAYOUT RELEASED
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status !== 'delivered' ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleForceReleaseEscrow(o.id)}
                              className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 font-bold px-2 py-1"
                            >
                              Force Release
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHoldEscrowDispute(o.id)}
                              className="text-[10px] bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 font-bold px-2 py-1"
                            >
                              Freeze / Dispute
                            </Button>
                          </>
                        ) : (
                          <span className="text-[11px] font-semibold text-stone-400">Escrow Settled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </Card>
      )}

      {/* TAB 5: SYSTEM CONFIGURATION & BROADCAST */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          
          {/* Broadcast Controller */}
          <Card className="p-6 border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
              <Megaphone className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold">Global Platform Broadcast Announcement</h3>
            </div>

            <p className="text-xs text-stone-500">
              Publish urgent notices to all farmers, cooperatives, and buyers across Africa (e.g. weather alerts, port delays, regulatory updates).
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Broadcast Banner Text</label>
              <textarea
                rows={3}
                value={systemBroadcast}
                onChange={(e) => setSystemBroadcast(e.target.value)}
                placeholder="Type platform announcement..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between">
              {isBroadcastSaved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Broadcast Updated Live!
                </span>
              )}
              <Button
                variant="primary"
                onClick={handleSaveBroadcast}
                icon={<Megaphone className="w-4 h-4" />}
                className="bg-emerald-700 hover:bg-emerald-800 text-xs ml-auto"
              >
                Publish Broadcast
              </Button>
            </div>
          </Card>

          {/* Escrow Fee & System Parameters */}
          <Card className="p-6 border-stone-200 space-y-4">
            <div className="flex items-center gap-2 text-stone-900 border-b border-stone-100 pb-3">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold">Platform Parameters & Commission</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Escrow Platform Commission Fee Rate ({escrowFeeRate}%)
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.1"
                  value={escrowFeeRate}
                  onChange={(e) => setEscrowFeeRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>0.5% (Low)</span>
                  <span>2.5% (Standard)</span>
                  <span>10.0% (Max)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <label className="block font-bold text-stone-700">Maintenance & Security Toggle</label>
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <p className="font-bold text-stone-800">Platform Maintenance Mode</p>
                    <p className="text-[11px] text-stone-500">Temporarily block new orders while upgrading trade smart contracts.</p>
                  </div>
                  <button
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      maintenanceMode ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {maintenanceMode ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>

            </div>
          </Card>

        </div>
      )}

      {/* ADD OFFICIAL USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" /> Add Official User / Admin
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  placeholder="e.g. Dr. Samuel Osei"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="e.g. samuel.osei@agrisphere.africa"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                    <option value="cooperative">Cooperative</option>
                    <option value="logistics">Logistics</option>
                    <option value="admin">Platform Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Country *</label>
                  <select
                    value={newUserForm.country}
                    onChange={(e) => setNewUserForm({ ...newUserForm, country: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  placeholder="+254 712 000 111"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-emerald-700 hover:bg-emerald-800"
                >
                  Create User Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
