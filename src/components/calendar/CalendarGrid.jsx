import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import CalendarDayCell from './CalendarDayCell';
import TradeDetailModal from './TradeDetailModal';
import { 
  getCalendarGrid, 
  aggregateTradesByDate, 
  isMarketHoliday, 
  isWeekend, 
  toDateString 
} from '../../utils/calendarHelpers';
import { formatCurrency } from '../../utils/formatters';
import { getMonthlyTargets } from '../../utils/goalCalculations';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const CalendarGrid = ({ trades = [], goalSettings }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Compute grid
  const grid = useMemo(() => getCalendarGrid(currentYear, currentMonth), [currentYear, currentMonth]);
  
  // Aggregate trades by date
  const tradesByDate = useMemo(() => aggregateTradesByDate(trades), [trades]);
  
  // Today's date string for comparison
  const todayStr = toDateString(today);
  
  // Month navigation
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };
  
  // Handle day click
  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setModalOpen(true);
  };
  
  // Get data for selected date modal
  const selectedDayData = selectedDate ? tradesByDate.get(selectedDate) : null;
  const selectedHoliday = selectedDate ? isMarketHoliday(selectedDate) : null;
  
  // Get Monthly Targets based on Goal Settings
  const monthlyTargets = useMemo(() => {
    if (!goalSettings || !goalSettings.capital) return [];
    return getMonthlyTargets(goalSettings.capital, goalSettings.targetPercent);
  }, [goalSettings]);

  const currentMonthTarget = monthlyTargets[currentMonth]?.targetPnL || 0;

  // Monthly summary calculations
  const monthlySummary = useMemo(() => {
    let totalPnL = 0;
    let tradingDays = 0;
    let monthWins = 0;
    let monthTotal = 0;
    
    tradesByDate.forEach((data, dateKey) => {
      // Check if this date is in the current displayed month
      const [y, m] = dateKey.split('-').map(Number);
      if (y === currentYear && m === currentMonth + 1) {
        totalPnL += data.totalPnL;
        tradingDays++;
        monthWins += data.wins;
        monthTotal += data.closedTrades.length;
      }
    });
    
    const winRate = monthTotal > 0 ? (monthWins / monthTotal) * 100 : 0;
    const progressRatio = currentMonthTarget > 0 ? (totalPnL / currentMonthTarget) * 100 : 0;
    
    return { totalPnL, tradingDays, monthTotal, winRate, progressRatio };
  }, [tradesByDate, currentYear, currentMonth, currentMonthTarget]);
  
  return (
    <>
      <Card className="p-0 overflow-hidden">
        {/* Header: Month Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-border-light">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-btn text-slate-text hover:bg-snow hover:text-ink transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <h2 className="text-lg font-bold text-ink min-w-[180px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-btn text-slate-text hover:bg-snow hover:text-ink transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <Button variant="primary" onClick={goToToday} className="text-sm px-3 py-1.5">
            Hari Ini
          </Button>
        </div>
        
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-border-light">
          {DAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={`py-2 text-center text-xs font-semibold uppercase tracking-wider ${
                i >= 5 ? 'text-slate-text' : 'text-ink'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="border-l border-t border-border-light">
          {grid.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7">
              {week.map((date, dayIdx) => {
                const dateStr = toDateString(date);
                const dayData = tradesByDate.get(dateStr) || null;
                const isCurrent = date.getMonth() === currentMonth;
                const isToday = dateStr === todayStr;
                const holiday = isMarketHoliday(dateStr);
                const isWeekendDay = isWeekend(date);
                
                return (
                  <CalendarDayCell
                    key={dateStr}
                    date={date}
                    dayData={dayData}
                    isCurrentMonth={isCurrent}
                    isToday={isToday}
                    holiday={holiday}
                    isWeekendDay={isWeekendDay}
                    onClick={handleDayClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Monthly Summary Footer */}
        <div className="border-t border-border-light bg-snow p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 text-sm overflow-x-auto pb-1 sm:pb-0">
              <div className="whitespace-nowrap">
                <span className="text-slate-text">Monthly P/L: </span>
                <span className={`font-bold ${
                  monthlySummary.totalPnL >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                }`}>
                  {formatCurrency(monthlySummary.totalPnL)}
                </span>
              </div>
              
              {currentMonthTarget > 0 && (
                <>
                  <div className="hidden md:block whitespace-nowrap">
                    <span className="text-slate-text">Target: </span>
                    <span className="font-bold text-ink">{formatCurrency(currentMonthTarget)}</span>
                  </div>
                  <div className="whitespace-nowrap">
                    <span className="text-slate-text">Progress: </span>
                    <span className={`font-bold ${
                      monthlySummary.progressRatio >= 100 ? 'text-crypto-green' : 
                      (monthlySummary.progressRatio >= 50 ? 'text-binance-yellow' : 'text-crypto-red')
                    }`}>
                      {monthlySummary.progressRatio.toFixed(1)}%
                    </span>
                  </div>
                </>
              )}

              <div className="whitespace-nowrap">
                <span className="text-slate-text">Days: </span>
                <span className="font-bold text-ink">{monthlySummary.tradingDays}</span>
              </div>
              <div className="hidden sm:block whitespace-nowrap">
                <span className="text-slate-text">Trades: </span>
                <span className="font-bold text-ink">{monthlySummary.monthTotal}</span>
              </div>
              <div className="hidden sm:block whitespace-nowrap">
                <span className="text-slate-text">Win Rate: </span>
                <span className={`font-bold ${
                  monthlySummary.winRate >= 50 ? 'text-crypto-green' : 'text-crypto-red'
                }`}>
                  {monthlySummary.winRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs text-slate-text">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-crypto-green/10 border border-crypto-green/30"></span>
                Profit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-crypto-red/10 border border-crypto-red/30"></span>
                Loss
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Entry
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-binance-yellow"></span>
                Holiday
              </span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Trade Detail Modal */}
      <TradeDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate || ''}
        dayData={selectedDayData}
        holiday={selectedHoliday}
      />
    </>
  );
};

export default CalendarGrid;
