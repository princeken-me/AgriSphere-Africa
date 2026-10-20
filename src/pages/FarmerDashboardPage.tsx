import React, { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  Sprout,
  CloudSun,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Package,
  Sparkles,
  MapPin,
  MessageSquare,
  Calendar as CalendarIcon,
  FileText,
  Settings as SettingsIcon,
  CheckSquare,
  CreditCard,
  HeartPulse,
  Sun
} from 'lucide-react';
import { CropListing, Order, CurrencyCode, UserProfile, NotificationItem, FarmProfile, FarmCropItem, LivestockItem, ScheduleEvent, FinancialTransaction, FarmTask } from '../types';
import { formatPrice } from '../utils/currency';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  INITIAL_FARM_PROFILE,
  INITIAL_FARM_CROPS,
  INITIAL_LIVESTOCK,
  INITIAL_SCHEDULES,
  INITIAL_FINANCIAL_TRANSACTIONS,
  INITIAL_FARM_TASKS,
  INITIAL_FARM_REPORTS
} from '../data/farmerStore';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';
import { FarmerCharts } from '../components/dashboard/FarmerCharts';
import { FarmProfileView } from '../components/dashboard/FarmProfileView';
import { SchedulesView } from '../components/dashboard/SchedulesView';
import { FinancialLedgerView } from '../components/dashboard/FinancialLedgerView';
import { TaskManagerView } from '../components/dashboard/TaskManagerView';
import { WeatherWidgetView } from '../components/dashboard/WeatherWidgetView';
import { NotificationsCalendarView } from '../components/dashboard/NotificationsCalendarView';
import { ReportsView } from '../components/dashboard/ReportsView';
import { SettingsView } from '../components/dashboard/SettingsView';

interface FarmerDashboardPageProps {
  currentUser: UserProfile;
  listings: CropListing[];
  orders: Order[];
  currentCurrency: CurrencyCode;
  onNavigate: (page: string) => void;
  onOpenAIAgronomist: () => void;
  onOpenAddProductModal: () => void;
  onEditListing: (listing: CropListing) => void;
  onDeleteListing: (listingId: string) => void;
}

export type DashboardSubTab = 
  | 'overview'
  | 'analytics'
  | 'farm_profile'
  | 'schedules'
  | 'finance'
  | 'tasks'
  | 'weather'
  | 'notifications'
  | 'reports'
  | 'settings';

export const FarmerDashboardPage: React.FC<FarmerDashboardPageProps> = ({
  currentUser,
  listings,
  orders,
  currentCurrency,
  onNavigate,
  onOpenAIAgronomist,
  onOpenAddProductModal,
  onEditListing,
  onDeleteListing
}) => {
  const [activeTab, setActiveTab] = useState<DashboardSubTab>('overview');

  // Dashboard Reactive State Stores
  const [farmProfile, setFarmProfile] = useState<FarmProfile>(INITIAL_FARM_PROFILE);
  const [farmCrops, setFarmCrops] = useState<FarmCropItem[]>(INITIAL_FARM_CROPS);
  const [livestock, setLivestock] = useState<LivestockItem[]>(INITIAL_LIVESTOCK);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>(INITIAL_SCHEDULES);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_FINANCIAL_TRANSACTIONS);
  const [tasks, setTasks] = useState<FarmTask[]>(INITIAL_FARM_TASKS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const farmerListings = listings.filter((l) => l.farmerId === currentUser.id || l.farmerName === currentUser.fullName);
  const farmerOrders = orders.filter((o) => o.farmerId === currentUser.id || o.farmerName === currentUser.fullName);

  const totalEarningsUSD = farmerOrders
    .filter((o) => o.status === 'delivered' || o.status === 'in_transit' || o.status === 'escrow_paid')
    .reduce((sum, o) => sum + o.totalPriceUSD, 0);

  const totalSalesVolumeKg = farmerOrders.reduce((sum, o) => sum + o.quantityKg, 0);

  // Handlers
  const handleAddCrop = (crop: Omit<FarmCropItem, 'id'>) => {
    const newItem: FarmCropItem = { ...crop, id: `fc_${Date.now()}` };
    setFarmCrops((prev) => [newItem, ...prev]);
  };

  const handleDeleteCrop = (id: string) => {
    setFarmCrops((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddLivestock = (item: Omit<LivestockItem, 'id'>) => {
    const newItem: LivestockItem = { ...item, id: `ls_${Date.now()}` };
    setLivestock((prev) => [newItem, ...prev]);
  };

  const handleDeleteLivestock = (id: string) => {
    setLivestock((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddSchedule = (schedule: Omit<ScheduleEvent, 'id'>) => {
    const newItem: ScheduleEvent = { ...schedule, id: `sch_${Date.now()}` };
    setSchedules((prev) => [newItem, ...prev]);
  };

  const handleUpdateScheduleStatus = (id: string, status: ScheduleEvent['status']) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleAddTransaction = (tx: Omit<FinancialTransaction, 'id'>) => {
    const newItem: FinancialTransaction = { ...tx, id: `ft_${Date.now()}` };
    setTransactions((prev) => [newItem, ...prev]);
  };

  const handleAddTask = (task: Omit<FarmTask, 'id'>) => {
    const newItem: FarmTask = { ...task, id: `task_${Date.now()}` };
    setTasks((prev) => [newItem, ...prev]);
  };

  const handleUpdateTaskStatus = (id: string, status: FarmTask['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateProfile = (updated: Partial<FarmProfile>) => {
    setFarmProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Farmer Command Hub
            </span>
            <span className="text-xs text-stone-500">• {farmProfile.farmName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">Farmer Dashboard</h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Region: <strong>{currentUser.location || farmProfile.location}</strong> • Estate Area: <strong>{farmProfile.totalSizeHectares} Ha</strong> • Soil Health: <strong>94/100</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAIAgronomist}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            AI Agronomist
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddProductModal}
            icon={<Plus className="w-4 h-4" />}
          >
            List Harvest Product
          </Button>
        </div>
      </div>

      {/* Sub-Navigation Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 border-b border-stone-200 no-scrollbar text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'analytics', label: 'Sales Charts', icon: TrendingUp },
          { id: 'farm_profile', label: 'Farm Profile & Land', icon: Sprout },
          { id: 'schedules', label: 'Schedules', icon: CalendarIcon },
          { id: 'finance', label: 'Expenses & Income', icon: CreditCard },
          { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
          { id: 'weather', label: 'Weather & Spray', icon: CloudSun },
          { id: 'notifications', label: 'Notifications', icon: MessageSquare },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DashboardSubTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-View Content Switching */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* 5 Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Sales"
              value={`${(totalSalesVolumeKg || 69500).toLocaleString()} kg`}
              change="+14.2%"
              isPositive
              icon={<TrendingUp className="w-5 h-5" />}
              subtitle="Wholesale Delivered"
            />
            <StatCard
              title="Active Products"
              value={farmerListings.length}
              icon={<Package className="w-5 h-5" />}
              subtitle="Listed on Marketplace"
            />
            <StatCard
              title="Total Revenue"
              value={formatPrice(totalEarningsUSD || 51200, currentCurrency)}
              change="+18.4%"
              isPositive
              icon={<DollarSign className="w-5 h-5" />}
              subtitle="Escrow Guaranteed"
            />
            <StatCard
              title="Active Orders"
              value={farmerOrders.length}
              icon={<ShieldCheck className="w-5 h-5" />}
              subtitle="Inspection & Dispatch"
            />
            <StatCard
              title="Messages & Offers"
              value="4 New"
              icon={<MessageSquare className="w-5 h-5" />}
              subtitle="Buyer Conversations"
            />
          </div>

          {/* Chart.js Visualization Block */}
          <FarmerCharts currentCurrency={currentCurrency} />

          {/* Quick Grid: Active Crop Listings & Escrow Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Active Crop Listings */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 font-display">My Active Marketplace Listings</h3>
                  <p className="text-xs text-stone-500">Available to wholesale grain, coffee & produce buyers.</p>
                </div>
                <button
                  onClick={onOpenAddProductModal}
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                >
                  + Add Harvest Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {farmerListings.map((listing) => (
                  <Card key={listing.id} className="p-4 flex gap-3 relative group">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="emerald">{listing.cropCategory}</Badge>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditListing(listing)}
                            className="text-stone-400 hover:text-emerald-700 text-[11px] font-semibold underline px-1 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteListing(listing.id)}
                            className="text-stone-400 hover:text-rose-600 text-[11px] font-semibold underline px-1 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate">{listing.title}</h4>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-extrabold text-emerald-800">{formatPrice(listing.pricePerKgUSD, currentCurrency)}/kg</span>
                        <span className="text-stone-500">{listing.quantityAvailableKg.toLocaleString()} kg left</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Active Orders & Weather Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Escrow Orders Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-stone-900 font-display">Active Escrow Trade Orders</h3>
                  <button onClick={() => onNavigate('orders')} className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer">
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {farmerOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={order.cropImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{order.orderNumber}</span>
                            <Badge variant={order.status === 'in_transit' ? 'amber' : 'emerald'}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            Buyer: <strong>{order.buyerName}</strong> • {order.quantityKg.toLocaleString()} kg
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] text-stone-400">Escrow Value</p>
                        <p className="text-xs font-extrabold text-emerald-800">{formatPrice(order.totalPriceUSD, currentCurrency)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. SALES CHARTS TAB */}
      {activeTab === 'analytics' && (
        <FarmerCharts currentCurrency={currentCurrency} />
      )}

      {/* 3. FARM PROFILE TAB */}
      {activeTab === 'farm_profile' && (
        <FarmProfileView
          profile={farmProfile}
          crops={farmCrops}
          livestock={livestock}
          onAddCrop={handleAddCrop}
          onAddLivestock={handleAddLivestock}
          onDeleteCrop={handleDeleteCrop}
          onDeleteLivestock={handleDeleteLivestock}
        />
      )}

      {/* 4. SCHEDULES TAB */}
      {activeTab === 'schedules' && (
        <SchedulesView
          schedules={schedules}
          onAddSchedule={handleAddSchedule}
          onUpdateStatus={handleUpdateScheduleStatus}
        />
      )}

      {/* 5. FINANCIAL LEDGER TAB */}
      {activeTab === 'finance' && (
        <FinancialLedgerView
          transactions={transactions}
          currentCurrency={currentCurrency}
          onAddTransaction={handleAddTransaction}
        />
      )}

      {/* 6. TASK MANAGER TAB */}
      {activeTab === 'tasks' && (
        <TaskManagerView
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
        />
      )}

      {/* 7. WEATHER & AGRONOMY TAB */}
      {activeTab === 'weather' && (
        <WeatherWidgetView onOpenAIAgronomist={onOpenAIAgronomist} />
      )}

      {/* 8. NOTIFICATIONS & CALENDAR TAB */}
      {activeTab === 'notifications' && (
        <NotificationsCalendarView
          notifications={notifications}
          schedules={schedules}
          onMarkRead={handleMarkNotificationRead}
          onClearAll={handleClearAllNotifications}
        />
      )}

      {/* 9. REPORTS TAB */}
      {activeTab === 'reports' && (
        <ReportsView reports={INITIAL_FARM_REPORTS} currentCurrency={currentCurrency} />
      )}

      {/* 10. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <SettingsView profile={farmProfile} onUpdateProfile={handleUpdateProfile} />
      )}

    </div>
  );
};
