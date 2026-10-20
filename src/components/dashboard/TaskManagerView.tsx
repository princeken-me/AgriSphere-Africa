import React, { useState } from 'react';
import { CheckSquare, Square, Clock, AlertTriangle, Plus, User, CheckCircle2 } from 'lucide-react';
import { FarmTask } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface TaskManagerViewProps {
  tasks: FarmTask[];
  onAddTask: (task: Omit<FarmTask, 'id'>) => void;
  onUpdateTaskStatus: (id: string, status: FarmTask['status']) => void;
}

export const TaskManagerView: React.FC<TaskManagerViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<FarmTask['priority']>('medium');
  const [dueDate, setDueDate] = useState('2026-08-05');
  const [assignedTo, setAssignedTo] = useState('Kwame Owusu');
  const [category, setCategory] = useState('Quality Control');

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      farmId: 'farm_001',
      title: title || 'New Farm Task',
      priority,
      status: 'pending',
      dueDate,
      assignedTo,
      category
    });
    setIsModalOpen(false);
    setTitle('');
  };

  const getPriorityBadge = (p: FarmTask['priority']) => {
    switch (p) {
      case 'high':
        return <Badge variant="rose">High Priority</Badge>;
      case 'medium':
        return <Badge variant="amber">Medium Priority</Badge>;
      default:
        return <Badge variant="stone">Low Priority</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-700" /> Agronomic Task Manager & To-Do List
          </h3>
          <p className="text-xs text-stone-500">Coordinate field operations, veterinary schedules, and regulatory compliance.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            {['all', 'pending', 'in_progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                  filter === st ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Task
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filtered.map((t) => (
          <Card key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() =>
                  onUpdateTaskStatus(t.id, t.status === 'completed' ? 'pending' : 'completed')
                }
                className="mt-0.5 text-stone-400 hover:text-emerald-700 cursor-pointer transition-colors"
              >
                {t.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(t.priority)}
                  <Badge variant="emerald">{t.category}</Badge>
                </div>

                <h4 className={`text-sm font-bold ${
                  t.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-900'
                }`}>
                  {t.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> Due: <strong>{t.dueDate}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stone-400" /> Assigned: {t.assignedTo}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              <select
                value={t.status}
                onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as any)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Farm Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Calibrate Solar Drip Pressure Sensors"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned To</label>
              <input
                type="text"
                required
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Maintenance / Crop Care"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
