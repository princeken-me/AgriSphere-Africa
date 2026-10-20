import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MONTHLY_SALES_DATA, PRODUCTS_SOLD_BREAKDOWN } from '../../data/farmerStore';
import { CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface FarmerChartsProps {
  currentCurrency: CurrencyCode;
}

export const FarmerCharts: React.FC<FarmerChartsProps> = ({ currentCurrency }) => {

  // 1. Line Chart: Monthly Revenue & Sales Volume
  const lineChartData = {
    labels: MONTHLY_SALES_DATA.map((d) => d.month),
    datasets: [
      {
        label: 'Gross Revenue (USD)',
        data: MONTHLY_SALES_DATA.map((d) => d.revenueUSD),
        borderColor: '#047857', // emerald-700
        backgroundColor: 'rgba(4, 120, 87, 0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#047857',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Farm Expenses (USD)',
        data: MONTHLY_SALES_DATA.map((d) => d.expensesUSD),
        borderColor: '#e11d48', // rose-600
        backgroundColor: 'rgba(225, 29, 72, 0.08)',
        tension: 0.35,
        fill: true,
        borderDash: [5, 5],
        pointBackgroundColor: '#e11d48',
        yAxisID: 'y'
      }
    ]
  };

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Plus Jakarta Sans, sans-serif', size: 11, weight: 'bold' },
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
        bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${formatPrice(context.parsed.y, currentCurrency)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#78716c' }
      },
      y: {
        grid: { color: 'rgba(231, 229, 228, 0.6)' },
        ticks: {
          font: { size: 10, weight: 'bold' },
          color: '#78716c',
          callback: (value) => `$${value}`
        }
      }
    }
  };

  // 2. Bar Chart: Products Sold (Volume in Kg)
  const barChartData = {
    labels: PRODUCTS_SOLD_BREAKDOWN.map((p) => p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || '')),
    datasets: [
      {
        label: 'Volume Sold (kg)',
        data: PRODUCTS_SOLD_BREAKDOWN.map((p) => p.quantityKg),
        backgroundColor: [
          '#059669', // emerald-600
          '#d97706', // amber-600
          '#0284c7', // sky-600
          '#7c3aed'  // violet-600
        ],
        borderRadius: 8,
        borderSkipped: false
      }
    ]
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1917',
        callbacks: {
          label: (context) => ` Volume: ${context.parsed.y.toLocaleString()} kg`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' }, color: '#78716c' }
      },
      y: {
        grid: { color: 'rgba(231, 229, 228, 0.6)' },
        ticks: {
          font: { size: 10, weight: 'bold' },
          color: '#78716c',
          callback: (val) => `${Number(val) / 1000}k kg`
        }
      }
    }
  };

  // 3. Doughnut Chart: Revenue Share per Commodity
  const doughnutData = {
    labels: PRODUCTS_SOLD_BREAKDOWN.map((p) => p.name),
    datasets: [
      {
        data: PRODUCTS_SOLD_BREAKDOWN.map((p) => p.revenueUSD),
        backgroundColor: ['#047857', '#f59e0b', '#0284c7', '#8b5cf6'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 10, weight: 'bold' },
          boxWidth: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#1c1917',
        callbacks: {
          label: (ctx) => ` Revenue: ${formatPrice(ctx.parsed, currentCurrency)}`
        }
      }
    },
    cutout: '68%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-700" /> Farm Analytics & Sales Charts
          </h3>
          <p className="text-xs text-stone-500">Live Chart.js telemetry tracking monthly gross revenue, expenses, and crop output.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue vs Expense Line Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" /> Monthly Revenue vs. Farm Expenses
            </h4>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut: Revenue by Crop */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-700" /> Revenue Share by Commodity
            </h4>
          </div>

          <div className="h-56 w-full flex items-center justify-center relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Bar Chart: Products Sold Volume */}
        <div className="lg:col-span-12 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-700" /> Crop Harvest Volume Sold (Kilograms)
            </h4>
            <span className="text-xs text-stone-500 font-medium">Total: 71,500 kg sold</span>
          </div>

          <div className="h-56 w-full">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};
