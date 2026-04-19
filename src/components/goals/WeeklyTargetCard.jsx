import React from 'react';
import Card from '../ui/Card';
import { formatSignedPercent, formatCurrency } from '../../utils/formatters';

const WeeklyTargetCard = ({ currentWeekData }) => {
  if (!currentWeekData) {
    return (
      <Card padding="p-5">
        <div className="text-center py-4">
          <p className="text-sm text-[#848E9C]">📌 Switch to current year to see this week's target</p>
        </div>
      </Card>
    );
  }

  const {
    weekNumber,
    startDate,
    endDate,
    targetPnL,
    actualPnL,
    targetPercent,
    actualPercent,
    progressRatio,
    tradeCount,
    status,
  } = currentWeekData;

  const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric' });
  const formattedEndDate = new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  
  const displayProgress = Math.min(Math.max(progressRatio, 0), 100);
  const actualColor = actualPercent >= 0 ? '#0ECB81' : '#F6465D';

  const remainingPercent = Math.max(targetPercent - actualPercent, 0);
  const remainingPnL = Math.max(targetPnL - actualPnL, 0);

  return (
    <Card padding="p-5">
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#1E2026]">📌 This Week's Target</h3>
        <span className="text-sm font-medium text-[#848E9C]">
          W{weekNumber} · {formattedStartDate}-{formattedEndDate}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {/* Target */}
        <div className="bg-[#F5F5F5] rounded-[8px] p-3 text-center">
          <div className="text-xs text-[#848E9C]">🎯 Target</div>
          <div className="text-xl font-bold text-[#1E2026] leading-tight mt-1">
            {formatSignedPercent(targetPercent)}
          </div>
          <div className="text-xs text-[#848E9C] mt-1">{formatCurrency(targetPnL)}</div>
        </div>

        {/* Actual */}
        <div className="bg-[#F5F5F5] rounded-[8px] p-3 text-center">
          <div className="text-xs text-[#848E9C]">📊 Actual</div>
          <div className="text-xl font-bold leading-tight mt-1" style={{ color: actualColor }}>
            {formatSignedPercent(actualPercent)}
          </div>
          <div className="text-xs text-[#848E9C] mt-1">{formatCurrency(actualPnL)}</div>
        </div>

        {/* Remaining */}
        <div className="bg-[#F5F5F5] rounded-[8px] p-3 text-center">
          <div className="text-xs text-[#848E9C]">🏁 Remaining</div>
          <div className="text-xl font-bold leading-tight mt-1" style={{ color: remainingPercent > 0 ? '#F0B90B' : '#0ECB81' }}>
            {remainingPercent > 0 ? formatSignedPercent(remainingPercent) : '✅'}
          </div>
          <div className="text-xs text-[#848E9C] mt-1">
            {remainingPercent > 0 ? formatCurrency(remainingPnL) : 'Target Achieved!'}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-[#F5F5F5] rounded-[8px] p-3 text-center">
          <div className="text-xs text-[#848E9C]">{status.emoji} Progress</div>
          <div className="text-xl font-bold leading-tight mt-1" style={{ color: status.color }}>
            {progressRatio.toFixed(1)}%
          </div>
          <div className="text-xs text-[#848E9C] mt-1">of target</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${displayProgress}%`,
              backgroundColor: status.color,
            }}
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs text-[#848E9C]">
          🔄 {tradeCount} trades this week
        </div>
        <div
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{
            backgroundColor: `${status.color}1A`,
            color: status.color,
          }}
        >
          {status.emoji} {status.label}
        </div>
      </div>
    </Card>
  );
};

export default WeeklyTargetCard;
