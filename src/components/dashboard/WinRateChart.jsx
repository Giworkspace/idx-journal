import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '../ui/Card';

ChartJS.register(ArcElement, Tooltip, Legend);

const WinRateChart = ({ wins, losses, winRate }) => {
  const hasData = wins > 0 || losses > 0;

  const data = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        data: [wins, losses],
        backgroundColor: ['#0ECB81', '#F6465D'], // crypto-green, crypto-red
        hoverBackgroundColor: ['#0ECB81', '#F6465D'],
        borderWidth: 0,
        cutout: '70%',
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
        enabled: hasData,
      }
    },
  };

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-ink mb-4">Win Rate</h3>
      <div className="relative flex-1 h-[250px] flex items-center justify-center">
        {hasData ? (
          <>
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-ink">{winRate}%</span>
              <span className="text-xs text-slate-text">Win Rate</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-text">
            <p className="text-sm">No trades yet</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WinRateChart;
