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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from '../ui/Card';

// Register Chart.js components
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

const EquityCurveChart = ({ trades = [] }) => {
  // Compute equity curve: cumulative sum of netPnL across trades sorted by date
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let cumulativePnL = 0;
  const chartData = sortedTrades.map(trade => {
    cumulativePnL += Number(trade.netPnL || 0);
    return {
      date: new Date(trade.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' }),
      value: cumulativePnL
    };
  });

  const data = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: 'Cumulative P/L',
        data: chartData.map(d => d.value),
        borderColor: '#F0B90B', // binance-yellow
        backgroundColor: 'rgba(240, 185, 11, 0.1)', // 10% opacity yellow
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#F0B90B',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return new Intl.NumberFormat('id-ID', { 
              style: 'currency', 
              currency: 'IDR', 
              minimumFractionDigits: 0 
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#848E9C', // slate-text
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: '#E6E8EA',
        },
        ticks: {
          color: '#848E9C',
          font: {
            size: 11
          },
          callback: (value) => {
            if (value >= 1000000 || value <= -1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            }
            if (value >= 1000 || value <= -1000) {
              return (value / 1000).toFixed(0) + 'K';
            }
            return value;
          }
        }
      },
    },
  };

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-ink mb-4">Equity Curve</h3>
      <div className="flex-1 min-h-[250px] md:min-h-[300px]">
        {trades.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-text gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-sm">No trades yet. Add your first trade to see the equity curve.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EquityCurveChart;
