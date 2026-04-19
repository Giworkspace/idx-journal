import React from 'react';
import { useTradeStore } from '../hooks/useTradeStore';
import MetricCard from '../components/dashboard/MetricCard';
import EquityCurveChart from '../components/dashboard/EquityCurveChart';
import WinRateChart from '../components/dashboard/WinRateChart';
import RecentTrades from '../components/dashboard/RecentTrades';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { loadSampleData } from '../utils/sampleData';
import GoalSummaryWidget from '../components/goals/GoalSummaryWidget';
import { useGoalStore } from '../hooks/useGoalStore';

const Dashboard = () => {
  const { trades, metrics, refreshTrades } = useTradeStore();
  const { annualProgress } = useGoalStore(trades);

  const handleLoadSampleData = () => {
    loadSampleData();
    refreshTrades();
  };

  if (metrics.totalTrades === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 text-binance-yellow opacity-20 mb-6">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 19.29V5h2v14.29l11.29-11.3 1.42 1.42L5 23.12V19.29zM19 17h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm-4 0h2v2H7v-2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Welcome to IDX Journal</h1>
        <p className="text-slate-text mb-8 max-w-md">
          Start tracking your IDX trades and analyze your performance with detailed metrics and interactive charts.
        </p>
        <Link to="/trades/new">
          <Button variant="pill">Add Your First Trade</Button>
        </Link>
        
        <div className="mt-12 pt-8 border-t border-border-light w-full max-w-xs">
          <p className="text-sm text-slate-text mb-4">Or load sample data to explore</p>
          <Button variant="secondary" onClick={handleLoadSampleData} className="text-sm">
            Load Sample Data
          </Button>
        </div>
      </div>
    );
  }

  const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Net P/L"
          value={currencyFormatter.format(metrics.totalNetPnL)}
          valueColor={metrics.totalNetPnL >= 0 ? 'green' : 'red'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-binance-yellow">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          }
        />
        <MetricCard
          label="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          valueColor={metrics.winRate >= 50 ? 'green' : 'red'}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-binance-yellow">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          }
        />
        <MetricCard
          label="Profit Factor"
          value={metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor.toFixed(2)}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-binance-yellow">
              <path d="M3 6h18" />
              <path d="M12 6L12 22" />
              <path d="M7 22h10" />
              <path d="M3 6c0 0 0 2 2 2h4c2 0 2-2 2-2" />
              <path d="M13 6c0 0 0 2 2 2h4c2 0 2-2 2-2" />
            </svg>
          }
        />
        <MetricCard
          label="Total Trades"
          value={metrics.totalTrades}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-binance-yellow">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
        />
      </div>

      <div className="mt-6">
        <GoalSummaryWidget annualProgress={annualProgress} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <EquityCurveChart trades={trades} />
        </div>
        <div className="lg:col-span-1">
          <WinRateChart 
            wins={metrics.wins} 
            losses={metrics.losses} 
            winRate={Math.round(metrics.winRate * 10) / 10} 
          />
        </div>
      </div>

      <div className="mt-6">
        <RecentTrades trades={trades} />
      </div>
    </div>
  );
};

export default Dashboard;
