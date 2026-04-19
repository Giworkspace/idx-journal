import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const RecentTrades = ({ trades = [] }) => {
  // Sort by date descending and take the most recent 5
  const recentTrades = [...trades]
    .sort((a, b) => {
      const dateA = new Date(a.entryDate || a.date || 0);
      const dateB = new Date(b.entryDate || b.date || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-ink">Recent Trades</h3>
        <Link to="/trades" className="text-sm text-binance-yellow hover:text-active-yellow font-medium transition-colors">
          View All →
        </Link>
      </div>

      {recentTrades.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left py-3 text-xs font-semibold text-slate-text uppercase tracking-wider">Entry Date</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-text uppercase tracking-wider">Ticker</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-text uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 text-xs font-semibold text-slate-text uppercase tracking-wider">Lots</th>
                  <th className="text-right py-3 text-xs font-semibold text-slate-text uppercase tracking-wider">Net P/L</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade, idx) => (
                  <tr key={trade.id || idx} className="border-b border-border-light last:border-0 hover:bg-snow transition-colors">
                    <td className="py-4 text-sm text-slate-text">{formatDate(trade.entryDate || trade.date)}</td>
                    <td className="py-4 text-sm font-bold text-ink">{trade.ticker}</td>
                    <td className="py-4">
                      <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                        {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-ink">{trade.lots}</td>
                    <td className={`py-4 text-sm font-semibold text-right ${trade.status === 'Open' ? 'text-slate-text' : (trade.netPnL > 0 ? 'text-crypto-green' : 'text-crypto-red')}`}>
                      {trade.status === 'Open' ? 'Floating' : formatCurrency(trade.netPnL)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="md:hidden flex flex-col">
            {recentTrades.map((trade, idx) => (
              <div key={trade.id || idx} className="py-4 border-b border-border-light last:border-0 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{trade.ticker}</span>
                    <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                      {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-text">{formatDate(trade.entryDate || trade.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-text">Lots: <span className="text-ink font-medium">{trade.lots}</span></span>
                  <span className={`text-sm font-semibold ${trade.status === 'Open' ? 'text-slate-text' : (trade.netPnL > 0 ? 'text-crypto-green' : 'text-crypto-red')}`}>
                    {trade.status === 'Open' ? 'Floating' : formatCurrency(trade.netPnL)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-slate-text mb-4">No trades recorded yet</p>
          <Link to="/trades/new" className="text-binance-yellow hover:text-active-yellow font-semibold text-sm">
            Add your first trade →
          </Link>
        </div>
      )}
    </Card>
  );
};

export default RecentTrades;
