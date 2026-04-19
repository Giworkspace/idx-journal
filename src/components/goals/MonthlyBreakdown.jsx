import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from '../ui/Card';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * MonthlyBreakdown Component
 * Displays a grouped bar chart comparing target vs actual PnL for each month.
 * 
 * @param {Array} monthlyData - Array of 12 month objects
 * @param {Function} onMonthSelect - Callback for when a bar is clicked
 * @param {Number|null} selectedMonth - Index of the currently selected month
 */
const MonthlyBreakdown = ({ monthlyData, onMonthSelect, selectedMonth }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#848E9C] text-center">
          <p className="text-3xl mb-2">📊</p>
          <p>No monthly data available</p>
        </div>
      </Card>
    );
  }

  const data = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Target',
        data: monthlyData.map(d => d.targetPnL),
        backgroundColor: monthlyData.map((d, i) => i === selectedMonth ? '#D1D5DB' : '#E6E8EA'),
        borderColor: '#848E9C',
        borderWidth: 1,
        borderRadius: 4,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
      {
        label: 'Actual',
        data: monthlyData.map(d => d.actualPnL),
        backgroundColor: monthlyData.map((d, i) => {
          const baseColor = d.actualPnL >= 0 ? '#0ECB81' : '#F6465D';
          // If we wanted to highlight actual too, we could adjust opacity or saturation, 
          // but the instructions specifically mentioned target highlight.
          return baseColor;
        }),
        borderRadius: 4,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E2026',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onMonthSelect(index);
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#848E9C',
          font: {
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: '#E6E8EA',
          drawBorder: false,
        },
        ticks: {
          color: '#848E9C',
          font: {
            size: 11,
          },
          callback: (value) => formatCompactCurrency(value)
        }
      }
    }
  };

  return (
    <Card className="" padding="p-5">
      <h3 className="text-lg font-semibold text-[#1E2026] mb-4">📊 Monthly Breakdown</h3>
      
      <div className="h-[300px]">
        <Bar data={data} options={options} />
      </div>

      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#E6E8EA] border border-[#848E9C] rounded-sm"></div>
          <span className="text-xs text-[#1E2026]">Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#0ECB81] rounded-sm"></div>
          <span className="text-xs text-[#1E2026]">Actual</span>
        </div>
      </div>

      <p className="text-xs text-[#848E9C] text-center mt-2">
        Click a month to see weekly details
      </p>
    </Card>
  );
};

export default MonthlyBreakdown;
