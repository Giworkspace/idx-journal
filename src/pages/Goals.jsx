import React, { useState } from 'react';
import { useTradeStore } from '../hooks/useTradeStore';
import { useGoalStore } from '../hooks/useGoalStore';
import GoalSettings from '../components/goals/GoalSettings';
import AnnualProgress from '../components/goals/AnnualProgress';
import MonthlyBreakdown from '../components/goals/MonthlyBreakdown';
import WeeklyBreakdown from '../components/goals/WeeklyBreakdown';
import WeeklyTargetCard from '../components/goals/WeeklyTargetCard';
import Button from '../components/ui/Button';
import { MONTHS } from '../constants';
import { calcWeeklyTarget } from '../utils/goalCalculations';

/**
 * Goals Page
 * Displays annual progress, monthly breakdown, and weekly breakdown of trading goals.
 */
const Goals = () => {
  const { trades } = useTradeStore();
  const {
    goalSettings,
    updateGoalSettings,
    annualProgress,
    currentWeekData,
    getMonthlyBreakdown,
    getWeeklyBreakdown,
    hasGoalConfigured
  } = useGoalStore(trades);

  // Local state for UI interactions
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showSettings, setShowSettings] = useState(!hasGoalConfigured);

  const weeklyTargetPercent = calcWeeklyTarget(goalSettings.targetPercent) * 100;

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1E2026]">Goals & Progress</h1>
        <Button 
          variant="secondary" 
          onClick={() => setShowSettings(!showSettings)} 
          className="text-sm"
        >
          {showSettings ? '✕ Close Settings' : '⚙️ Edit Goals'}
        </Button>
      </div>

      {/* Goal Settings Section */}
      {showSettings && (
        <div className="mb-6">
          <GoalSettings 
            goalSettings={goalSettings} 
            onSave={(newSettings) => { 
              updateGoalSettings(newSettings); 
              setShowSettings(false); 
            }} 
          />
        </div>
      )}

      {/* This Week's Target */}
      <div className="mb-6">
        <WeeklyTargetCard currentWeekData={currentWeekData} />
      </div>

      {/* Annual Progress Overview */}
      <div className="mb-6">
        <AnnualProgress annualProgress={annualProgress} />
      </div>

      {/* Monthly Breakdown Table/Grid */}
      <div className="mb-6">
        <MonthlyBreakdown 
          monthlyData={getMonthlyBreakdown()} 
          onMonthSelect={(index) => setSelectedMonth(index)} 
          selectedMonth={selectedMonth} 
        />
      </div>

      {/* Weekly Breakdown (Conditional) */}
      {selectedMonth !== null && (
        <div className="mb-6">
          <WeeklyBreakdown 
            weeklyData={getWeeklyBreakdown(selectedMonth)} 
            monthName={MONTHS[selectedMonth]} 
            onClose={() => setSelectedMonth(null)}
            capital={goalSettings.capital}
            weeklyTargetPercent={weeklyTargetPercent}
          />
        </div>
      )}
    </div>
  );
};

export default Goals;
