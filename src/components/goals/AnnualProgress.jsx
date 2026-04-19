import React from 'react';
import Card from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const AnnualProgress = ({ annualProgress }) => {
  if (!annualProgress) return null;

  const {
    capital,
    year,
    annualTargetAmount,
    actualPnL,
    progressPercent,
    status
  } = annualProgress;

  const pnlColor = actualPnL >= 0 ? '#0ECB81' : '#F6465D';
  const statusBgColor = status.color + '1A';

  return (
    <Card padding="p-5">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#1E2026]">🎯 Annual Progress {year}</h3>
        <span 
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{ backgroundColor: statusBgColor, color: status.color }}
        >
          {status.emoji} {status.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 mb-4">
        <div className="h-4 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${Math.min(progressPercent, 100)}%`,
              backgroundColor: status.color
            }}
          />
        </div>
        <div className="mt-1">
          <span className="text-xs text-[#848E9C]">{formatPercent(progressPercent)} of annual target</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-xs text-[#848E9C] mb-1">Actual P/L</p>
          <p className="text-lg font-bold" style={{ color: pnlColor }}>
            {formatCurrency(actualPnL)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#848E9C] mb-1">Target P/L</p>
          <p className="text-lg font-bold text-[#1E2026]">
            {formatCurrency(annualTargetAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#848E9C] mb-1">Progress</p>
          <p className="text-lg font-bold" style={{ color: status.color }}>
            {formatPercent(progressPercent)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#848E9C] mb-1">Remaining</p>
          <p className="text-lg font-bold text-[#848E9C]">
            {formatCurrency(Math.max(0, annualTargetAmount - actualPnL))}
          </p>
        </div>
      </div>

      {/* Capital info line */}
      <div className="mt-4 pt-3 border-t border-[#E6E8EA]">
        <p className="text-sm text-[#848E9C]">
          Modal: {formatCurrency(capital)} → Target Akhir Tahun: {formatCurrency(capital + annualTargetAmount)}
        </p>
      </div>
    </Card>
  );
};

export default AnnualProgress;
