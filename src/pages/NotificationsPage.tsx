import React from 'react';
import { Bell, ShieldCheck, CloudSun, TrendingUp, CheckCircle2, Trash2 } from 'lucide-react';
import { NotificationItem } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onNavigate: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
  onNavigate
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'escrow':
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case 'weather':
        return <CloudSun className="w-5 h-5 text-amber-600" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Notifications & Alerts</h1>
          <p className="text-xs text-stone-500">Escrow milestones, solar weather advisories, and price index surges.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onMarkAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearNotifications} icon={<Trash2 className="w-4 h-4 text-rose-600" />}>
            Clear
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-stone-200">
            <Bell className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No new notifications</h3>
            <p className="text-xs text-stone-500">You're all caught up on trade escrow and weather alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 flex items-start gap-4 transition-all ${
                !n.read ? 'bg-emerald-50/40 border-emerald-200' : 'bg-white'
              }`}
            >
              <div className={`p-2.5 rounded-2xl shrink-0 ${
                !n.read ? 'bg-emerald-100' : 'bg-stone-100'
              }`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900">{n.title}</h4>
                  <span className="text-[10px] text-stone-400 font-medium">{n.timestamp}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.message}</p>
                {n.actionUrl && (
                  <button
                    onClick={() => onNavigate(n.actionUrl!)}
                    className="mt-2 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    View Details →
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
