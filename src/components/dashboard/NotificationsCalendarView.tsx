import React, { useState } from 'react';
import { Bell, Calendar as CalendarIcon, CheckCircle2, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { NotificationItem, ScheduleEvent } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface NotificationsCalendarViewProps {
  notifications: NotificationItem[];
  schedules: ScheduleEvent[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsCalendarView: React.FC<NotificationsCalendarViewProps> = ({
  notifications,
  schedules,
  onMarkRead,
  onClearAll
}) => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'calendar'>('notifications');

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'weather':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'market':
        return <Tag className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Selector */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`text-sm font-bold flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'notifications'
                ? 'border-emerald-700 text-emerald-900 font-display'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications ({notifications.filter((n) => !n.read).length} Unread)
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`text-sm font-bold flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'calendar'
                ? 'border-emerald-700 text-emerald-900 font-display'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Integrated Farm Calendar
          </button>
        </div>

        {activeTab === 'notifications' && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Mark All Read
          </Button>
        )}
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.read ? 'bg-emerald-50/40 border-emerald-200/80' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-stone-100 border border-stone-200 shrink-0 mt-0.5">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={n.type === 'order' ? 'emerald' : n.type === 'weather' ? 'amber' : 'sky'}>
                      {n.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-stone-400">{n.timestamp}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">{n.title}</h4>
                  <p className="text-xs text-stone-600">{n.description}</p>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => onMarkRead(n.id)}
                  className="p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        /* Calendar Tab */
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">August 2026 Schedule Events</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((s) => (
                <div key={s.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <Badge variant={s.type === 'harvest' ? 'amber' : 'emerald'}>{s.type.toUpperCase()}</Badge>
                    <span className="text-stone-500 font-semibold">{s.startDate} to {s.endDate}</span>
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">{s.title}</h5>
                  <p className="text-stone-600">Location: <strong>{s.plotName}</strong> ({s.cropName})</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
