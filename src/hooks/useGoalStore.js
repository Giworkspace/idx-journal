import { useState, useCallback, useMemo } from 'react';
import { getGoalSettings, saveGoalSettings } from '../utils/goalStore';
import {
  getAnnualProgress,
  getMonthlyActuals,
  getMonthlyTargets,
  getWeeklyActuals,
  getWeeklyTargets,
  getGoalStatus,
  getCurrentWeekData
} from '../utils/goalCalculations';
import { GOALS_STORAGE_KEY } from '../constants';

export const useGoalStore = (trades) => {
  const [goalSettings, setGoalSettings] = useState(() => getGoalSettings());

  const updateGoalSettings = useCallback((newSettings) => {
    const saved = saveGoalSettings(newSettings);
    setGoalSettings(saved);
  }, []);

  const annualProgress = useMemo(() => 
    getAnnualProgress(trades, goalSettings), 
    [trades, goalSettings]
  );

  const currentWeekData = useMemo(() => 
    getCurrentWeekData(trades, goalSettings), 
    [trades, goalSettings]
  );

  const getMonthlyBreakdown = useCallback(() => {
    const targets = getMonthlyTargets(goalSettings.capital, goalSettings.targetPercent);
    const actuals = getMonthlyActuals(trades, goalSettings.year);
    
    return targets.map((target, i) => {
      const actual = actuals[i];
      return {
        ...target,
        ...actual,
        status: getGoalStatus(actual.actualPnL, target.targetPnL)
      };
    });
  }, [trades, goalSettings.capital, goalSettings.targetPercent, goalSettings.year]);

  const getWeeklyBreakdown = useCallback((monthIndex) => {
    const targets = getWeeklyTargets(
      goalSettings.capital, 
      goalSettings.targetPercent, 
      goalSettings.year, 
      monthIndex
    );
    const actuals = getWeeklyActuals(trades, goalSettings.year, monthIndex);

    return targets.map((target, i) => {
      const actual = actuals[i];
      return {
        ...target,
        ...actual,
        status: getGoalStatus(actual.actualPnL, target.targetPnL)
      };
    });
  }, [trades, goalSettings.capital, goalSettings.targetPercent, goalSettings.year]);

  const hasGoalConfigured = localStorage.getItem(GOALS_STORAGE_KEY) !== null;

  return {
    goalSettings,
    updateGoalSettings,
    annualProgress,
    currentWeekData,
    getMonthlyBreakdown,
    getWeeklyBreakdown,
    hasGoalConfigured
  };
};
