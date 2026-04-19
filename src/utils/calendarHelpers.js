import { IDX_MARKET_HOLIDAYS } from '../constants';

/**
 * Returns a 2D array (6 rows × 7 cols) representing a month grid.
 * Each cell is a Date object. Cells outside the current month are from
 * adjacent months (to fill the grid). Week starts on Monday.
 * @param {number} year
 * @param {number} month - 0-indexed (0=Jan, 11=Dec)
 * @returns {Date[][]} 6×7 grid of Date objects
 */
export const getCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get day of week for first day (0=Sun, 1=Mon, ..., 6=Sat)
  // Convert to Monday-start: Mon=0, Tue=1, ..., Sun=6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6; // Sunday becomes 6
  
  const grid = [];
  // Start from the Monday before (or on) the first day
  const startDate = new Date(year, month, 1 - startDow);
  
  for (let week = 0; week < 6; week++) {
    const row = [];
    for (let day = 0; day < 7; day++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + (week * 7 + day));
      row.push(d);
    }
    grid.push(row);
  }
  
  return grid;
};

/**
 * Aggregates trades by date string.
 * @param {Array} trades - array of trade objects with { date, netPnL, ... }
 * @returns {Map<string, { trades: Array, totalPnL: number, wins: number, losses: number }>}
 */
export const aggregateTradesByDate = (trades) => {
  const map = new Map();

  const getOrInitDate = (dateKey) => {
    if (!map.has(dateKey)) {
      map.set(dateKey, { closedTrades: [], openedTrades: [], totalPnL: 0, wins: 0, losses: 0 });
    }
    return map.get(dateKey);
  };

  trades.forEach(trade => {
    // 1. Process Entry Date (Marker for opening position)
    const entryDateKey = trade.entryDate || trade.date; 
    if (entryDateKey) {
      const entry = getOrInitDate(entryDateKey);
      entry.openedTrades.push(trade);
    }

    // 2. Process Exit Date (For realized PnL)
    const isClosed = trade.status === 'Closed' || trade.type === 'Sell';
    const exitDateKey = isClosed ? (trade.exitDate || trade.date) : null;
    
    if (exitDateKey) {
      const exitEntry = getOrInitDate(exitDateKey);
      exitEntry.closedTrades.push(trade);
      exitEntry.totalPnL += (trade.netPnL || 0);
      
      if ((trade.netPnL || 0) > 0) {
        exitEntry.wins++;
      } else {
        exitEntry.losses++;
      }
    }
  });
  
  return map;
};

/**
 * Checks if a date matches any IDX market holiday.
 * @param {string} dateString - 'YYYY-MM-DD' format
 * @returns {{ date: string, name: string } | null}
 */
export const isMarketHoliday = (dateString) => {
  return IDX_MARKET_HOLIDAYS.find(h => h.date === dateString) || null;
};

/**
 * Returns true if date falls on Saturday or Sunday.
 * @param {Date} date - Date object
 * @returns {boolean}
 */
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday=0, Saturday=6
};

/**
 * Formats a Date object to 'YYYY-MM-DD' string.
 * @param {Date} date
 * @returns {string}
 */
export const toDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
