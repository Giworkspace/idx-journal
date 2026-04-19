import React from 'react';
import Card from '../ui/Card';
import { formatCurrency, formatSignedPercent } from '../../utils/formatters';

/**
 * WeeklyBreakdown Component
 * Displays a detailed table of weekly performance for a specific month.
 * 
 * @param {Object} props
 * @param {Array} props.weeklyData - Array of weekly performance objects
 * @param {string} props.monthName - Name of the month (e.g., 'Jan')
 * @param {Function} props.onClose - Callback to close the component
 * @param {number} props.capital - Total capital for percentage calculation
 * @param {number} props.weeklyTargetPercent - The weekly target percentage
 */
const WeeklyBreakdown = ({ weeklyData = [], monthName, onClose, capital, weeklyTargetPercent }) => {
  const formatPeriod = (startDate, endDate) => {
    try {
      if (!startDate || !endDate) return '-';
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';

      const options = { day: '2-digit', month: 'short' };
      return `${start.toLocaleDateString('id-ID', options)} - ${end.toLocaleDateString('id-ID', options)}`;
    } catch (e) {
      return '-';
    }
  };

  const totals = (weeklyData || []).reduce((acc, week) => {
    acc.targetPnL += (week.targetPnL || 0);
    acc.actualPnL += (week.actualPnL || 0);
    acc.tradeCount += (week.tradeCount || 0);
    return acc;
  }, { targetPnL: 0, actualPnL: 0, tradeCount: 0 });

  const totalDiff = totals.actualPnL - totals.targetPnL;
  
  // Overall status emoji logic based on actual performance vs target
  const getOverallEmoji = () => {
    if (totals.actualPnL >= totals.targetPnL) return '🚀';
    if (totals.actualPnL >= 0) return '📈';
    return '📉';
  };

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Card padding="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1E2026]">📅 Weekly Detail — {monthName}</h3>
          <button onClick={onClose} className="text-[#848E9C] hover:text-[#1E2026] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p className="text-center text-[#848E9C] py-8">No data for this month</p>
      </Card>
    );
  }

  return (
    <Card padding="p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1E2026]">📅 Weekly Detail — {monthName}</h3>
        <button onClick={onClose} className="text-[#848E9C] hover:text-[#1E2026] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-left">Week</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-left hidden md:table-cell">Period</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right">Target</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right hidden sm:table-cell">Target %</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right">Actual</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right hidden sm:table-cell">Actual %</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right">Diff</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-left">Status</th>
              <th className="text-xs font-semibold text-[#848E9C] uppercase px-3 py-2 text-right">Trades</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((week, index) => {
              const diff = (week.actualPnL || 0) - (week.targetPnL || 0);
              const isActualPositive = (week.actualPnL || 0) >= 0;
              const isDiffPositive = diff >= 0;
              
              return (
                <tr key={index} className="border-b border-[#E6E8EA] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-3 py-2.5">W{week.weekNumber}</td>
                  <td className="px-3 py-2.5 hidden md:table-cell">{formatPeriod(week.startDate, week.endDate)}</td>
                  <td className="px-3 py-2.5 text-right font-medium">{formatCurrency(week.targetPnL || 0)}</td>
                  <td className="px-3 py-2.5 text-right font-medium text-[#1E2026] hidden sm:table-cell">
                    {formatSignedPercent(weeklyTargetPercent)}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-medium ${isActualPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {formatCurrency(week.actualPnL || 0)}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-medium hidden sm:table-cell ${isActualPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {formatSignedPercent(capital > 0 ? ((week.actualPnL || 0) / capital) * 100 : 0)}
                  </td>
                  <td className={`px-3 py-2.5 text-right font-medium ${isDiffPositive ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {isDiffPositive ? '+' : ''}{formatCurrency(diff)}
                  </td>
                  <td className="px-3 py-2.5" style={{ color: week.status?.color || '#848E9C' }}>
                    <span className="md:hidden">{week.status?.emoji || ''}</span>
                    <span className="hidden md:inline">{week.status?.emoji || ''} {week.status?.label || '-'}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">{week.tradeCount || 0}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#848E9C] font-bold">
              <td className="px-3 py-2.5">Total</td>
              <td className="px-3 py-2.5 hidden md:table-cell"></td>
              <td className="px-3 py-2.5 text-right">{formatCurrency(totals.targetPnL)}</td>
              <td className="px-3 py-2.5 hidden sm:table-cell"></td>
              <td className={`px-3 py-2.5 text-right ${totals.actualPnL >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {formatCurrency(totals.actualPnL)}
              </td>
              <td className={`px-3 py-2.5 text-right hidden sm:table-cell ${totals.actualPnL >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {formatSignedPercent(capital > 0 ? (totals.actualPnL / capital) * 100 : 0)}
              </td>
              <td className={`px-3 py-2.5 text-right ${totalDiff >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                {totalDiff >= 0 ? '+' : ''}{formatCurrency(totalDiff)}
              </td>
              <td className="px-3 py-2.5">{getOverallEmoji()}</td>
              <td className="px-3 py-2.5 text-right">{totals.tradeCount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
};

export default WeeklyBreakdown;
