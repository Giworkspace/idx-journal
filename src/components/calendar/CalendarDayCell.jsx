import React from 'react';
import { formatCompactCurrency } from '../../utils/formatters';
import { toDateString } from '../../utils/calendarHelpers';

const CalendarDayCell = ({ date, dayData, isCurrentMonth, isToday, holiday, isWeekendDay, onClick }) => {
  const dayNumber = date.getDate();
  const dateStr = toDateString(date);
  
  // Determine background color based on P/L
  let bgClass = '';
  if (dayData && dayData.totalPnL > 0) {
    bgClass = 'bg-crypto-green/10'; // light green tint
  } else if (dayData && dayData.totalPnL < 0) {
    bgClass = 'bg-crypto-red/10'; // light red tint
  }
  
  // Opacity for non-current-month days and weekends
  let opacityClass = '';
  if (!isCurrentMonth) {
    opacityClass = 'opacity-30';
  } else if (isWeekendDay && !dayData) {
    opacityClass = 'opacity-50';
  }
  
  // Today ring
  const todayClass = isToday ? 'ring-2 ring-binance-yellow ring-inset' : '';
  
  // Determine if cell is clickable (has trades)
  const hasExits = dayData && dayData.closedTrades && dayData.closedTrades.length > 0;
  const hasEntries = dayData && dayData.openedTrades && dayData.openedTrades.length > 0;
  const isClickable = hasExits || hasEntries;
  
  const handleClick = () => {
    if (onClick) {
      onClick(dateStr);
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className={`
        relative p-1 sm:p-2 min-h-[40px] sm:min-h-[80px] md:min-h-[100px]
        border-b border-r border-border-light
        transition-colors duration-200
        ${bgClass}
        ${opacityClass}
        ${todayClass}
        ${isClickable ? 'cursor-pointer hover:bg-snow' : 'cursor-default'}
        rounded-[2px]
      `}
      title={holiday ? `🏖️ ${holiday.name}` : ''}
    >
      {/* Day number + Indicators */}
      <div className="flex items-start justify-between">
        <span className={`text-xs sm:text-sm font-medium ${
          isToday ? 'text-binance-yellow font-bold' :
          isWeekendDay ? 'text-slate-text' :
          'text-ink'
        }`}>
          {dayNumber}
        </span>
        
        <div className="flex gap-1">
          {/* Entry blue dot */}
          {hasEntries && isCurrentMonth && (
            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" title="Positions Opened" />
          )}
          {/* Holiday yellow dot */}
          {holiday && isCurrentMonth && (
            <span className="w-2 h-2 rounded-full bg-binance-yellow flex-shrink-0 mt-0.5" title={holiday.name} />
          )}
        </div>
      </div>
      
      {/* Desktop: Show P/L and win/loss count */}
      {hasExits && isCurrentMonth && (
        <>
          {/* P/L amount - hidden on very small screens */}
          <div className="hidden sm:block mt-1">
            <span className={`text-[10px] sm:text-xs font-semibold ${
              dayData.totalPnL > 0 ? 'text-crypto-green' : 'text-crypto-red'
            }`}>
              {formatCompactCurrency(dayData.totalPnL)}
            </span>
          </div>
          
          {/* Win/Loss count - hidden on very small screens */}
          <div className="hidden md:block mt-0.5">
            <span className="text-[10px] text-slate-text">
              {dayData.wins}W / {dayData.losses}L
            </span>
          </div>
          
          {/* Mobile: Show colored dot indicator only */}
          <div className="sm:hidden flex justify-center mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${
              dayData.totalPnL > 0 ? 'bg-crypto-green' : 'bg-crypto-red'
            }`} />
          </div>
        </>
      )}
      
      {/* Holiday name - desktop only */}
      {holiday && isCurrentMonth && (
        <div className="hidden lg:block mt-0.5">
          <span className="text-[9px] text-binance-yellow leading-tight line-clamp-1">
            {holiday.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default CalendarDayCell;
