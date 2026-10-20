import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus, Filter, Sprout, Combine, Droplet, AlertCircle } from 'lucide-react';
import { ScheduleEvent } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface SchedulesViewProps {
  schedules: ScheduleEvent[];
  onAddSchedule: (schedule: Omit<ScheduleEvent, 'id'>) => void;
  onUpdateStatus: (id: string, status: ScheduleEvent['status']) => void;
}

export const SchedulesView: React.FC<SchedulesViewProps> = ({
  schedules,
  onAddSchedule,
  onUpdateStatus
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [cropName, setCropName] = useState('Yellow Maize');
  const [plotName, setPlotName] = useState('Plot A - North Field');
  const [type, setType] = useState<ScheduleEvent['type']>('harvest');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-15');
  const [notes, setNotes] = useState('');

  const filtered = schedules.filter((s) => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule({
      farmId: 'farm_001',
      type,
      title: title || `${type.toUpperCase()}: ${cropName}`,
      cropName,
      plotName,
      startDate,
      endDate,
      status: 'scheduled',
      notes
    });
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const getEventIcon = (t: ScheduleEvent['type']) => {
    switch (t) {
      case 'planting':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'harvest':
        return <Combine className="w-4 h-4 text-amber-600" />;
      case 'irrigation':
        return <Droplet className="w-4 h-4 text-sky-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-700" /> Farm Planting & Harvest Schedule
          </h3>
          <p className="text-xs text-stone-500">Agro-calendar milestones for field operations, irrigation, and crop collection.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            {['all', 'planting', 'harvest', 'fertilizer', 'irrigation'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                  filterType === t ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Add Event
          </Button>
        </div>
      </div>

      {/* Schedule Events Timeline List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                {getEventIcon(item.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.type === 'harvest' ? 'amber' : item.type === 'planting' ? 'emerald' : 'sky'}>
                    {item.type.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-stone-500 font-semibold">{item.plotName}</span>
                </div>

                <h4 className="text-base font-bold text-stone-900">{item.title}</h4>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1 font-medium text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> {item.startDate} to {item.endDate}
                  </span>
                  <span>•</span>
                  <span>Crop: <strong>{item.cropName}</strong></span>
                </div>

                {item.notes && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl mt-2 border border-stone-100">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Status & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                item.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : item.status === 'in_progress'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}>
                {item.status === 'completed' ? '✓ Completed' : item.status === 'in_progress' ? '⏳ In Progress' : '📅 Scheduled'}
              </span>

              {item.status !== 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(item.id, 'completed')}
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                >
                  Mark Complete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Schedule Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Schedule Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Maize Batch #2 Dehusking"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="harvest">Harvest</option>
                <option value="planting">Planting</option>
                <option value="irrigation">Irrigation</option>
                <option value="fertilizer">Fertilizer / Chemical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Crop</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Field Plot Name</label>
            <input
              type="text"
              required
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              placeholder="e.g. Plot A - North Field"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes & Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions for field workers..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
