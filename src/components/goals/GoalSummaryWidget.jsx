import React from 'react';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent, formatCompactCurrency } from '../../utils/formatters';

const GoalSummaryWidget = ({ annualProgress }) => {
  if (!annualProgress) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-full bg-snow flex items-center justify-center mb-3">
          <span className="text-2xl" role="img" aria-label="Target">🎯</span>
        </div>
        <h3 className="text-sm font-bold text-ink mb-1">Set Your Trading Goals</h3>
        <p className="text-xs text-[#848E9C] mb-4 max-w-[200px]">
          Define your capital and return targets to track progress
        </p>
        <Link 
          to="/goals" 
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#F0B90B] text-white text-xs font-bold hover:bg-[#d9a70a] transition-colors"
        >
          Define Goals
        </Link>
      </Card>
    );
  }

  const {
    year,
    annualTargetAmount,
    actualPnL,
    progressPercent,
    status
  } = annualProgress;

  const progressWidth = Math.min(progressPercent, 100);

  return (
    <Card className="flex flex-col">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-label="Target">🎯</span>
          <span className="text-sm font-medium text-[#848E9C]">Goal Progress {year}</span>
        </div>
        <span 
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ 
            backgroundColor: (status?.color || '#F0B90B') + '1A', 
            color: status?.color || '#F0B90B' 
          }}
        >
          {status?.emoji} {status?.label}
        </span>
      </div>

      {/* Mini Progress Bar */}
      <div className="mt-3 h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${progressWidth}%`,
            backgroundColor: status?.color || '#F0B90B'
          }}
        />
      </div>

      {/* Stats Row */}
      <div className="flex justify-between items-end mt-3">
        <div>
          <p className="text-xs text-[#848E9C]">Actual</p>
          <p 
            className="text-lg font-bold" 
            style={{ color: actualPnL >= 0 ? '#0ECB81' : '#F6465D' }}
          >
            {formatCompactCurrency(actualPnL)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-[#848E9C]">Progress</p>
          <p 
            className="text-lg font-bold" 
            style={{ color: status?.color || '#F0B90B' }}
          >
            {formatPercent(progressPercent)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-[#848E9C]">Target</p>
          <p className="text-lg font-bold text-[#1E2026]">
            {formatCompactCurrency(annualTargetAmount)}
          </p>
        </div>
      </div>

      {/* View Details Link */}
      <div className="mt-3 pt-2 border-t border-[#E6E8EA]">
        <Link 
          to="/goals" 
          className="text-xs font-medium text-[#F0B90B] hover:text-[#2D7FF9] transition-colors flex items-center justify-center gap-1"
        >
          View Details <span>→</span>
        </Link>
      </div>
    </Card>
  );
};

export default GoalSummaryWidget;
