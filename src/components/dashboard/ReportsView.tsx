import React from 'react';
import { FileText, Download, Printer, DollarSign, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { FarmReportSummary, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface ReportsViewProps {
  reports: FarmReportSummary;
  currentCurrency: CurrencyCode;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reports, currentCurrency }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,Period,Gross Revenue,Expenses,Net Profit,Harvest (kg),Sales (kg),Efficiency (%)\n${reports.period},${reports.totalRevenueUSD},${reports.totalExpensesUSD},${reports.netProfitUSD},${reports.totalHarvestKg},${reports.salesVolumeKg},${reports.cropYieldEfficiency}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriSphere_Farm_Report_${reports.period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" /> Agronomic & Financial Operating Reports
          </h3>
          <p className="text-xs text-stone-500">Exportable quarterly financial audits, crop yield efficiency, and logistics metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print Report
          </Button>

          <Button variant="primary" size="sm" onClick={handleDownloadCSV} icon={<Download className="w-4 h-4" />}>
            Export CSV Audit
          </Button>
        </div>
      </div>

      {/* Primary Report Certificate Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block mb-1">
              Official Estate Statement
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
              Quarterly Farm Executive Summary ({reports.period})
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Verified by AgriSphere Africa Escrow Ledger & Soil Sensors</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">Compliance Audit Approved</span>
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Gross Revenue</span>
            <span className="text-lg font-black text-emerald-800 mt-1 block">
              {formatPrice(reports.totalRevenueUSD, currentCurrency)}
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Operating Expenses</span>
            <span className="text-lg font-black text-rose-600 mt-1 block">
              {formatPrice(reports.totalExpensesUSD, currentCurrency)}
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Net Farm Profit</span>
            <span className="text-lg font-black text-stone-900 mt-1 block">
              {formatPrice(reports.netProfitUSD, currentCurrency)}
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Yield Efficiency</span>
            <span className="text-lg font-black text-emerald-700 mt-1 block flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" /> {reports.cropYieldEfficiency}%
            </span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-stone-100">
          <div className="space-y-2">
            <span className="font-bold text-stone-900 block">Harvest & Sales Distribution</span>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-700">
              <div className="flex justify-between">
                <span>Total Harvest Volume:</span>
                <strong className="text-stone-900">{reports.totalHarvestKg.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Wholesale Volume Sold:</span>
                <strong className="text-emerald-800">{reports.salesVolumeKg.toLocaleString()} kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Top Performing Commodity:</span>
                <strong className="text-stone-900">{reports.topCrop}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-stone-900 block">Regulatory & Quality Standards</span>
            <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-stone-700">
              <div className="flex justify-between">
                <span>Phytosanitary Certification:</span>
                <strong className="text-emerald-800">Verified Grade A</strong>
              </div>
              <div className="flex justify-between">
                <span>Escrow Settlement Speed:</span>
                <strong className="text-stone-900">Average 48 hrs post delivery</strong>
              </div>
              <div className="flex justify-between">
                <span>Carbon Footprint Offset:</span>
                <strong className="text-emerald-800">-14.2 Tons CO2e</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
