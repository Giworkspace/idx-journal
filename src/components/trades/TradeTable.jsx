import React, { useState, useMemo } from 'react';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import TradeFilters from './TradeFilters';
import { STRATEGY_TAGS } from '../../constants';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
};

const TradeTable = ({ trades, onDelete, onEdit }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    strategy: '',
    status: ''
  });

  const filteredAndSortedTrades = useMemo(() => {
    let result = [...trades];

    // Filtering logic
    if (filters.search) {
      result = result.filter(trade => 
        trade.ticker.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.dateFrom) {
      result = result.filter(trade => (trade.exitDate || trade.date) >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(trade => (trade.exitDate || trade.date) <= filters.dateTo);
    }
    if (filters.strategy) {
      result = result.filter(trade => 
        trade.strategyTags && trade.strategyTags.includes(filters.strategy)
      );
    }
    if (filters.status) {
      result = result.filter(trade => {
        const tradeStatus = trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed');
        return tradeStatus === filters.status;
      });
    }

    // Sorting logic
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'date') {
        aValue = a.entryDate || a.date;
        bValue = b.entryDate || b.date;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [trades, filters, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const handleDelete = (trade) => {
    if (window.confirm(`Delete trade ${trade.ticker} on ${formatDate(trade.date)}?`)) {
      onDelete(trade.id);
    }
  };

  const renderTags = (trade) => {
    const sTags = (trade.strategyTags || []).map(tag => ({ text: tag, variant: 'yellow' }));
    const pTags = (trade.psychologyTags || []).map(tag => ({ text: tag, variant: 'default' }));
    const allTags = [...sTags, ...pTags];
    
    if (allTags.length === 0) return null;

    const visibleTags = allTags.slice(0, 2);
    const extraCount = allTags.length - 2;

    return (
      <div className="flex gap-1">
        {visibleTags.map((tag, idx) => (
          <Badge key={idx} variant={tag.variant} className="text-[10px] px-1.5 py-0.5">
            {tag.text}
          </Badge>
        ))}
        {extraCount > 0 && (
          <Badge variant="default" className="text-[10px] px-1.5 py-0.5">
            +{extraCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <TradeFilters filters={filters} onFilterChange={setFilters} />

      {/* Desktop Layout */}
      <div className="hidden md:block overflow-x-auto rounded-card border border-border-light shadow-subtle">
        <table className="w-full text-left border-collapse">
          <thead className="bg-snow text-xs uppercase text-slate-text font-semibold tracking-wider">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('date')}>
                Entry/Exit{getSortIndicator('date')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('ticker')}>
                Ticker{getSortIndicator('ticker')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                Status{getSortIndicator('status')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('lots')}>
                Lots{getSortIndicator('lots')}
              </th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Exit</th>
              <th className="px-4 py-3">Fees</th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('netPnL')}>
                Net P/L{getSortIndicator('netPnL')}
              </th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border-light">
            {filteredAndSortedTrades.length > 0 ? (
              filteredAndSortedTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-snow/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-text">
                    {formatDate(trade.entryDate || trade.date)}
                    {trade.status === 'Closed' || trade.type === 'Sell' ? (
                      <div className="text-xs opacity-70">→ {formatDate(trade.exitDate || trade.date)}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-ink uppercase">{trade.ticker}</td>
                  <td className="px-4 py-3">
                    <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                      {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">{trade.lots}</td>
                  <td className="px-4 py-3 text-sm text-ink">{formatCurrency(trade.entryPrice)}</td>
                  <td className="px-4 py-3 text-sm text-ink">
                    {trade.status === 'Closed' || trade.type === 'Sell' ? formatCurrency(trade.exitPrice) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-text">{formatCurrency(trade.totalFees)}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${trade.status === 'Open' ? 'text-slate-text' : (trade.netPnL > 0 ? 'text-crypto-green' : 'text-crypto-red')}`}>
                    {trade.status === 'Open' ? 'Floating' : formatCurrency(trade.netPnL)}
                  </td>
                  <td className="px-4 py-3">{renderTags(trade)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(trade.id)}
                        className="text-binance-yellow hover:scale-110 transition-transform"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(trade)}
                        className="text-crypto-red hover:scale-110 transition-transform"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-10 text-center text-slate-text">No trades found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-3">
        {filteredAndSortedTrades.length > 0 ? (
          filteredAndSortedTrades.map((trade) => (
            <Card key={trade.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-ink uppercase">{trade.ticker}</span>
                    <Badge variant={trade.status === 'Open' ? 'warning' : 'default'}>
                      {trade.status || (trade.type === 'Buy' ? 'Open' : 'Closed')}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-text">
                    In: {formatDate(trade.entryDate || trade.date)}
                    {trade.status === 'Closed' || trade.type === 'Sell' ? ` | Out: ${formatDate(trade.exitDate || trade.date)}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-text">Net P/L</div>
                  <div className={`font-semibold ${trade.status === 'Open' ? 'text-slate-text' : (trade.netPnL > 0 ? 'text-crypto-green' : 'text-crypto-red')}`}>
                    {trade.status === 'Open' ? 'Floating' : formatCurrency(trade.netPnL)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-y border-border-light my-2">
                <div className="text-center">
                  <div className="text-[10px] uppercase text-slate-text">Entry</div>
                  <div className="text-sm font-medium">{formatCurrency(trade.entryPrice)}</div>
                </div>
                <div className="text-slate-text">→</div>
                <div className="text-center">
                  <div className="text-[10px] uppercase text-slate-text">Exit</div>
                  <div className="text-sm font-medium">
                    {trade.status === 'Closed' || trade.type === 'Sell' ? formatCurrency(trade.exitPrice) : '-'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase text-slate-text">Lots</div>
                  <div className="text-sm font-medium">{trade.lots}</div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-1 max-w-[60%]">
                  {renderTags(trade)}
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onEdit(trade.id)}
                    className="text-binance-yellow p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(trade)}
                    className="text-crypto-red p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-slate-text">No trades found</div>
        )}
      </div>
    </div>
  );
};

export default TradeTable;
