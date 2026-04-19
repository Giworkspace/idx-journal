import { GOAL_STATUS, MONTHS } from '../constants';

/**
 * Converts a Date object to 'YYYY-MM-DD' string.
 * @param {Date} date 
 * @returns {string}
 */
const toDateString = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 1. Returns monthly target rate based on annual percentage (compound).
 * @param {number} annualPercent 
 * @returns {number}
 */
export const calcMonthlyTarget = (annualPercent) => {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
};

/**
 * 2. Returns weekly target rate based on annual percentage (compound).
 * @param {number} annualPercent 
 * @returns {number}
 */
export const calcWeeklyTarget = (annualPercent) => {
  return Math.pow(1 + annualPercent / 100, 1 / 52) - 1;
};

/**
 * 3. Returns expected P&L after N compounding periods.
 * @param {number} capital 
 * @param {number} rate 
 * @param {number} periods 
 * @returns {number}
 */
export const calcCompoundTarget = (capital, rate, periods) => {
  if (!capital || isNaN(capital)) return 0;
  return capital * Math.pow(1 + rate, periods) - capital;
};

/**
 * 4. Returns absolute Rp target for the year.
 * @param {number} capital 
 * @param {number} annualPercent 
 * @returns {number}
 */
export const getAnnualTarget = (capital, annualPercent) => {
  if (!capital || isNaN(capital)) return 0;
  return capital * (annualPercent / 100);
};

/**
 * 5. Filters trades where trade.date starts with the year string.
 * @param {Array} trades 
 * @param {number|string} year 
 * @returns {Array}
 */
export const filterTradesByYear = (trades, year) => {
  if (!Array.isArray(trades)) return [];
  const yearStr = String(year);
  return trades.filter(trade => {
    const isClosed = trade.status === 'Closed' || trade.type === 'Sell';
    const dateToUse = trade.exitDate || trade.date;
    return isClosed && dateToUse && dateToUse.startsWith(yearStr);
  });
};

/**
 * 6. Filters trades for a specific month (0-11).
 * @param {Array} trades 
 * @param {number} year 
 * @param {number} monthIndex 
 * @returns {Array}
 */
export const filterTradesByMonth = (trades, year, monthIndex) => {
  if (!Array.isArray(trades)) return [];
  return trades.filter(trade => {
    const isClosed = trade.status === 'Closed' || trade.type === 'Sell';
    const dateToUse = trade.exitDate || trade.date;
    if (!isClosed || !dateToUse) return false;
    
    const date = new Date(dateToUse);
    if (isNaN(date.getTime())) return false;
    return date.getFullYear() === year && date.getMonth() === monthIndex;
  });
};

/**
 * 7. Returns array of 12 objects with actual PnL and trade count for each month.
 * @param {Array} trades 
 * @param {number} year 
 * @returns {Array}
 */
export const getMonthlyActuals = (trades, year) => {
  return MONTHS.map((month, index) => {
    const monthlyTrades = filterTradesByMonth(trades, year, index);
    const actualPnL = monthlyTrades.reduce((sum, trade) => sum + (Number(trade.netPnL) || 0), 0);
    return {
      month,
      monthIndex: index,
      actualPnL,
      tradeCount: monthlyTrades.length
    };
  });
};

/**
 * 8. Returns array of 12 objects with incremental compound target for each month.
 * @param {number} capital 
 * @param {number} annualPercent 
 * @returns {Array}
 */
export const getMonthlyTargets = (capital, annualPercent) => {
  const monthlyRate = calcMonthlyTarget(annualPercent);
  return MONTHS.map((month, index) => {
    const cumulativeTargetAtEndOfMonth = calcCompoundTarget(capital, monthlyRate, index + 1);
    const cumulativeTargetAtStartOfMonth = index === 0 ? 0 : calcCompoundTarget(capital, monthlyRate, index);
    const targetPnL = cumulativeTargetAtEndOfMonth - cumulativeTargetAtStartOfMonth;
    return {
      month,
      monthIndex: index,
      targetPnL
    };
  });
};

/**
 * 9. Returns array of week objects for a month. Week starts on Monday.
 * A week belongs to a month if its Monday falls in that month.
 * @param {number} year 
 * @param {number} monthIndex 
 * @returns {Array}
 */
export const getWeeksInMonth = (year, monthIndex) => {
  const weeks = [];
  // Find first day of month
  let date = new Date(year, monthIndex, 1);
  
  // Find the first Monday on or before the 1st of the month
  // 0 is Sunday, 1 is Monday... 6 is Saturday
  let dayOfWeek = date.getDay();
  let diff = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek); // Adjustment to get to Monday
  
  let currentMonday = new Date(date);
  currentMonday.setDate(date.getDate() + diff);

  let weekNum = 1;
  while (currentMonday.getMonth() === monthIndex || (currentMonday.getMonth() < monthIndex && currentMonday.getFullYear() === year) || (monthIndex === 0 && currentMonday.getFullYear() < year)) {
    // If currentMonday is before the month, but its week could include days in the month
    // The requirement says: "A week belongs to a month if its Monday falls in that month."
    
    if (currentMonday.getMonth() === monthIndex && currentMonday.getFullYear() === year) {
      const startDate = new Date(currentMonday);
      const endDate = new Date(currentMonday);
      endDate.setDate(startDate.getDate() + 6);
      
      weeks.push({
        weekNumber: weekNum,
        startDate,
        endDate
      });
      weekNum++;
    }
    
    // Move to next Monday
    currentMonday.setDate(currentMonday.getDate() + 7);
    
    // Safety break
    if (weeks.length > 6) break;
  }
  
  return weeks;
};

/**
 * 10. Sums netPnL of trades whose date falls within startDate-endDate for each week.
 * @param {Array} trades 
 * @param {number} year 
 * @param {number} monthIndex 
 * @returns {Array}
 */
export const getWeeklyActuals = (trades, year, monthIndex) => {
  const weeks = getWeeksInMonth(year, monthIndex);
  return weeks.map(week => {
    const startStr = toDateString(week.startDate);
    const endStr = toDateString(week.endDate);
    
    const weeklyTrades = trades.filter(trade => {
      const isClosed = trade.status === 'Closed' || trade.type === 'Sell';
      const dateToUse = trade.exitDate || trade.date;
      if (!isClosed || !dateToUse) return false;
      return dateToUse >= startStr && dateToUse <= endStr;
    });

    const actualPnL = weeklyTrades.reduce((sum, trade) => sum + (Number(trade.netPnL) || 0), 0);
    
    return {
      ...week,
      actualPnL,
      tradeCount: weeklyTrades.length
    };
  });
};

/**
 * 11. Calculates incremental compound weekly target for each week in the month.
 * @param {number} capital 
 * @param {number} annualPercent 
 * @param {number} year 
 * @param {number} monthIndex 
 * @returns {Array}
 */
export const getWeeklyTargets = (capital, annualPercent, year, monthIndex) => {
  const weeks = getWeeksInMonth(year, monthIndex);
  const weeklyRate = calcWeeklyTarget(annualPercent);
  
  // To get the week's global index, we find how many weeks passed since the start of the year
  const firstDayOfYear = new Date(year, 0, 1);
  let firstMondayOfYear = new Date(firstDayOfYear);
  let dayOfWeek = firstMondayOfYear.getDay();
  let diff = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  firstMondayOfYear.setDate(firstMondayOfYear.getDate() + diff);

  return weeks.map(week => {
    // Calculate global week index (0-indexed)
    const msDiff = week.startDate.getTime() - firstMondayOfYear.getTime();
    const globalWeekIndex = Math.round(msDiff / (7 * 24 * 60 * 60 * 1000));
    
    const cumulativeTargetAtEndOfWeek = calcCompoundTarget(capital, weeklyRate, globalWeekIndex + 1);
    const cumulativeTargetAtStartOfWeek = globalWeekIndex === 0 ? 0 : calcCompoundTarget(capital, weeklyRate, globalWeekIndex);
    const targetPnL = cumulativeTargetAtEndOfWeek - cumulativeTargetAtStartOfWeek;
    
    return {
      weekNumber: week.weekNumber,
      targetPnL
    };
  });
};

/**
 * 12. Returns a GOAL_STATUS object based on actual vs target ratio.
 * @param {number} actual 
 * @param {number} target 
 * @returns {Object}
 */
export const getGoalStatus = (actual, target) => {
  if (target <= 0) return GOAL_STATUS.ON_TRACK;
  const ratio = actual / target;
  
  if (ratio >= GOAL_STATUS.AHEAD.minRatio) return GOAL_STATUS.AHEAD;
  if (ratio >= GOAL_STATUS.ON_TRACK.minRatio) return GOAL_STATUS.ON_TRACK;
  if (ratio >= GOAL_STATUS.SLIGHTLY_BEHIND.minRatio) return GOAL_STATUS.SLIGHTLY_BEHIND;
  return GOAL_STATUS.BEHIND;
};

/**
 * 13. Master function to calculate annual progress and monthly breakdown.
 * @param {Array} trades 
 * @param {Object} goalSettings 
 * @returns {Object}
 */
export const getAnnualProgress = (trades, goalSettings) => {
  const { capital = 0, targetPercent = 0, year = new Date().getFullYear() } = goalSettings || {};
  
  const annualTrades = filterTradesByYear(trades, year);
  const actualPnL = annualTrades.reduce((sum, trade) => sum + (Number(trade.netPnL) || 0), 0);
  const annualTargetAmount = getAnnualTarget(capital, targetPercent);
  const progressPercent = annualTargetAmount > 0 ? (actualPnL / annualTargetAmount) * 100 : 0;
  
  const currentMonthIndex = new Date().getFullYear() === Number(year) ? new Date().getMonth() : (Number(year) < new Date().getFullYear() ? 11 : 0);
  
  const monthlyRate = calcMonthlyTarget(targetPercent);
  const expectedPnLByNow = calcCompoundTarget(capital, monthlyRate, currentMonthIndex + 1);
  
  const status = getGoalStatus(actualPnL, expectedPnLByNow);
  
  const targets = getMonthlyTargets(capital, targetPercent);
  const actuals = getMonthlyActuals(trades, Number(year));
  
  const monthlyData = targets.map((target, index) => ({
    ...target,
    ...actuals[index]
  }));

  return {
    capital,
    targetPercent,
    year,
    annualTargetAmount,
    actualPnL,
    progressPercent,
    status,
    monthlyData,
    currentMonthIndex
  };
};

/**
 * 14. Returns current week's target and actual data with percentage calculations.
 * @param {Array} trades 
 * @param {Object} goalSettings - { capital, targetPercent, year }
 * @returns {Object|null} Current week data or null if not viewing current year
 */
export const getCurrentWeekData = (trades, goalSettings) => {
  const { capital = 0, targetPercent = 0, year } = goalSettings || {};
  
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Only show "this week" for the current year
  if (Number(year) !== currentYear) return null;
  
  const currentMonthIndex = today.getMonth();
  const weeks = getWeeksInMonth(currentYear, currentMonthIndex);
  
  // Find which week today falls into
  const todayStr = toDateString(today);
  let currentWeekIndex = -1;
  
  for (let i = 0; i < weeks.length; i++) {
    const startStr = toDateString(weeks[i].startDate);
    const endStr = toDateString(weeks[i].endDate);
    if (todayStr >= startStr && todayStr <= endStr) {
      currentWeekIndex = i;
      break;
    }
  }
  
  // If today doesn't fall in any week, use the most recent past week
  if (currentWeekIndex === -1) {
    for (let i = weeks.length - 1; i >= 0; i--) {
      const endStr = toDateString(weeks[i].endDate);
      if (todayStr > endStr) {
        currentWeekIndex = i;
        break;
      }
    }
  }
  
  // Fallback: if still not found, use first week
  if (currentWeekIndex === -1 && weeks.length > 0) {
    currentWeekIndex = 0;
  }
  
  if (currentWeekIndex === -1 || weeks.length === 0) return null;
  
  const targets = getWeeklyTargets(capital, targetPercent, currentYear, currentMonthIndex);
  const actuals = getWeeklyActuals(trades, currentYear, currentMonthIndex);
  
  const weekTarget = targets[currentWeekIndex] || { targetPnL: 0 };
  const weekActual = actuals[currentWeekIndex] || { actualPnL: 0, tradeCount: 0 };
  const currentWeek = weeks[currentWeekIndex];
  
  const weeklyTargetRate = calcWeeklyTarget(targetPercent);
  const weeklyTargetPct = weeklyTargetRate * 100;
  const actualPct = capital > 0 ? (weekActual.actualPnL / capital) * 100 : 0;
  const progressRatio = weeklyTargetPct > 0 ? (actualPct / weeklyTargetPct) * 100 : 0;
  
  return {
    weekNumber: currentWeek.weekNumber,
    startDate: currentWeek.startDate,
    endDate: currentWeek.endDate,
    targetPnL: weekTarget.targetPnL,
    actualPnL: weekActual.actualPnL,
    targetPercent: weeklyTargetPct,
    actualPercent: actualPct,
    progressRatio,
    tradeCount: weekActual.tradeCount,
    status: getGoalStatus(weekActual.actualPnL, weekTarget.targetPnL)
  };
};