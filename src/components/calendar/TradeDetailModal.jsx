import React, { useEffect } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const TradeDetailModal = ({ isOpen, onClose, date, dayData = null, holiday = null }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const closedTrades = dayData ? (dayData.closedTrades || []) : [];
  const openedTrades = dayData ? (dayData.openedTrades || []) : [];
  const allTrades = [...closedTrades, ...openedTrades];

  const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.netPnL || 0), 0);
  const wins = closedTrades.filter((trade) => (trade.netPnL || 0) > 0).length;
  const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;

  // Aggregate tags and notes
  const psychologyTags = [...new Set(allTrades.flatMap((t) => t.psychologyTags || []))];
  const strategyTags = [...new Set(allTrades.flatMap((t) => t.strategyTags || []))];
  const tradesWithNotes = allTrades.filter((t) => t.notes && t.notes.trim() !== '');

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-card shadow-medium w-full max-w-lg mx-4 max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border-light p-5 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-ink">{formatDate(date)}</h2>
            <button
              onClick={onClose}
              className="text-slate-text hover:text-ink transition-colors"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {holiday && (
            <div className="mt-2">
              <Badge variant="yellow">{holiday.name}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Daily Summary */}
          <div className="bg-snow rounded-input p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-text mb-1">Daily P/L</p>
                <p
                  className={`text-lg font-bold ${
                    totalPnL >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                  }`}
                >
                  {formatCurrency(totalPnL)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-text mb-1">Trades Closed</p>
                <p className="text-lg font-bold text-ink">{closedTrades.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-text mb-1">Win Rate</p>
                <p
                  className={`text-lg font-bold ${
                    winRate >= 50 ? 'text-crypto-green' : 'text-crypto-red'
                  }`}
                >
                  {winRate.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Trades Closed */}
          {closedTrades.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-crypto-green" /> 
                Positions Closed Today
              </h3>
              {closedTrades.map((trade, index) => (
                <div
                  key={index}
                  className="border border-border-light rounded-input p-3 space-y-2 bg-snow/30"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-ink">
                        {trade.ticker}
                      </span>
                      <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                        {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                      </Badge>
                    </div>
                    <span
                      className={`font-semibold ${
                        (trade.netPnL || 0) >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                      }`}
                    >
                      {formatCurrency(trade.netPnL || 0)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-text">
                    <span>Entry: {formatCurrency(trade.entryPrice)}</span>
                    <span>Exit: {formatCurrency(trade.exitPrice)}</span>
                    <span>Lots: {trade.lots}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trades Opened */}
          {openedTrades.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 
                Positions Opened Today
              </h3>
              {openedTrades.map((trade, index) => (
                <div
                  key={index}
                  className="border border-border-light rounded-input p-3 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-ink">
                        {trade.ticker}
                      </span>
                      <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                        {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-text">
                    <span>Entry: {formatCurrency(trade.entryPrice)}</span>
                    <span>Lots: {trade.lots}</span>
                  </div>
                  {trade.sector && (
                    <div className="text-xs text-slate-text/70">
                      Sector: {trade.sector}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {allTrades.length === 0 && (
            <p className="text-center text-slate-text py-4">No trades on this day</p>
          )}

          {/* Psychology Section */}
          {psychologyTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">
                Emotional State
              </h3>
              <div className="flex flex-wrap gap-2">
                {psychologyTags.map((tag, idx) => (
                  <Badge key={idx} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Strategy Section */}
          {strategyTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">
                Strategies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {strategyTags.map((tag, idx) => (
                  <Badge key={idx} variant="yellow">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {tradesWithNotes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">
                Trade Notes
              </h3>
              <div className="space-y-3">
                {tradesWithNotes.map((trade, idx) => (
                  <div
                    key={idx}
                    className="border-b border-border-light last:border-0 pb-3 last:pb-0"
                  >
                    <p className="text-sm font-semibold text-ink mb-1">
                      {trade.ticker}
                    </p>
                    <p className="text-sm text-slate-text">{trade.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-light p-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailModal;
