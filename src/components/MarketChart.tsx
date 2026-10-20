import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MarketPriceIndex } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MarketChartProps {
  marketIndex: MarketPriceIndex;
}

export const MarketChart: React.FC<MarketChartProps> = ({ marketIndex }) => {
  const data = {
    labels: marketIndex.history.map((h) => h.date),
    datasets: [
      {
        label: `${marketIndex.commodity} (${marketIndex.country}) - ${marketIndex.unit}`,
        data: marketIndex.history.map((h) => h.price),
        borderColor: '#047857', // emerald-700
        backgroundColor: 'rgba(4, 120, 87, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#047857',
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: { size: 12, family: 'Inter, sans-serif' },
          color: '#1c1917'
        }
      },
      tooltip: {
        backgroundColor: '#1c1917',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12 },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: { color: 'rgba(231, 229, 228, 0.6)' },
        ticks: {
          callback: (val: any) => `$${val}`
        }
      }
    }
  };

  return (
    <div className="w-full h-64 p-2">
      <Line data={data} options={options} />
    </div>
  );
};
