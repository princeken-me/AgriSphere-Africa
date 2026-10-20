import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, Filter, CreditCard, PieChart } from 'lucide-react';
import { FinancialTransaction, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface FinancialLedgerViewProps {
  transactions: FinancialTransaction[];
  currentCurrency: CurrencyCode;
  onAddTransaction: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

export const FinancialLedgerView: React.FC<FinancialLedgerViewProps> = ({
  transactions,
  currentCurrency,
  onAddTransaction
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<FinancialTransaction['category']>('Seeds & Fertilizers');
  const [amountUSD, setAmountUSD] = useState<number>(500);
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('Escrow');

  const totalIncomeUSD = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const totalExpenseUSD = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const netProfitUSD = totalIncomeUSD - totalExpenseUSD;

  const filtered = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      farmId: 'farm_001',
      type,
      category,
      amountUSD: Number(amountUSD),
      date: new Date().toISOString().split('T')[0],
      description: description || `${type === 'income' ? 'Farm Income' : 'Farm Expense'} - ${category}`,
      paymentMethod,
      status: 'completed'
    });
    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Income Card */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Gross Income</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-900">{formatPrice(totalIncomeUSD, currentCurrency)}</p>
          <span className="text-[10px] text-stone-500">Includes wholesale escrow crop sales</span>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Farm Expenses</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowDownRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700">{formatPrice(totalExpenseUSD, currentCurrency)}</p>
          <span className="text-[10px] text-stone-500">Seeds, fertilizer, labor & logistics</span>
        </div>

        {/* Net Profit Card */}
        <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white p-5 rounded-3xl shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Net Operating Profit</span>
            <DollarSign className="w-5 h-5 text-amber-300" />
          </div>
          <p className="text-2xl font-black text-white">{formatPrice(netProfitUSD, currentCurrency)}</p>
          <span className="text-[10px] text-emerald-200">Profit Margin: <strong>{((netProfitUSD / (totalIncomeUSD || 1)) * 100).toFixed(1)}%</strong></span>
        </div>

      </div>

      {/* Ledger Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" /> Financial Expense & Income Ledger
          </h3>
          <p className="text-xs text-stone-500">Detailed accounting of crop sales revenue, equipment, and field payroll.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            {(['all', 'income', 'expense'] as const).map((t) => (
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
            Record Entry
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200/80 text-stone-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount ({currentCurrency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-stone-500 shrink-0">{t.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg text-white font-bold text-[10px] ${
                        t.type === 'income' ? 'bg-emerald-600' : 'bg-rose-500'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}
                      </span>
                      <span className="font-bold text-stone-900">{t.description}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={t.type === 'income' ? 'emerald' : 'amber'}>{t.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-medium">{t.paymentMethod}</td>
                  <td className={`py-3.5 px-4 text-right font-black ${
                    t.type === 'income' ? 'text-emerald-800' : 'text-rose-600'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatPrice(t.amountUSD, currentCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Financial Entry">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Entry Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="expense">Expense (-)</option>
                <option value="income">Income (+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="Seeds & Fertilizers">Seeds & Fertilizers</option>
                <option value="Crop Sales">Crop Sales</option>
                <option value="Livestock Sales">Livestock Sales</option>
                <option value="Equipment & Fuel">Equipment & Fuel</option>
                <option value="Labor & Payroll">Labor & Payroll</option>
                <option value="Logistics">Logistics</option>
                <option value="Utilities & Water">Utilities & Water</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Amount (USD)</label>
              <input
                type="number"
                step="10"
                required
                value={amountUSD}
                onChange={(e) => setAmountUSD(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
              >
                <option value="Escrow">Escrow</option>
                <option value="Mobile Money">Mobile Money (M-Pesa)</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Fuel purchase for Nzoia irrigation pump"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Ledger Entry
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
