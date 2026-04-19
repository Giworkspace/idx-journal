import React from 'react';
import { Link } from 'react-router-dom';
import { useTradeStore } from '../hooks/useTradeStore';
import { useGoalStore } from '../hooks/useGoalStore';
import CalendarGrid from '../components/calendar/CalendarGrid';
import Button from '../components/ui/Button';

const Calendar = () => {
  const { trades } = useTradeStore();
  const { goalSettings } = useGoalStore(trades);

  if (trades.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 text-binance-yellow opacity-20 mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="9" y1="14" x2="9" y2="14.01"></line>
            <line x1="12" y1="14" x2="12" y2="14.01"></line>
            <line x1="15" y1="14" x2="15" y2="14.01"></line>
            <line x1="9" y1="18" x2="9" y2="18.01"></line>
            <line x1="12" y1="18" x2="12" y2="18.01"></line>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">No Trades to Display</h1>
        <p className="text-slate-text mb-8 max-w-md">
          Start recording your trades to see your daily performance visualized on the calendar.
        </p>
        <Link to="/trades/new">
          <Button variant="pill">Add Your First Trade</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Calendar</h1>
      <CalendarGrid trades={trades} goalSettings={goalSettings} />
    </div>
  );
};

export default Calendar;
