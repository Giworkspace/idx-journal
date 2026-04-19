import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { formatCurrency } from '../../utils/formatters';
import { calcMonthlyTarget, calcWeeklyTarget } from '../../utils/goalCalculations';

const GoalSettings = ({ goalSettings, onSave }) => {
  const [formData, setFormData] = useState({
    capital: goalSettings?.capital || 0,
    targetPercent: goalSettings?.targetPercent || 0,
    year: goalSettings?.year || new Date().getFullYear(),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (goalSettings) {
      setFormData({
        capital: goalSettings.capital,
        targetPercent: goalSettings.targetPercent,
        year: goalSettings.year,
      });
    }
  }, [goalSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (Number(formData.capital) <= 0) {
      newErrors.capital = 'Modal harus lebih dari 0';
    }
    if (Number(formData.targetPercent) <= 0) {
      newErrors.targetPercent = 'Target harus lebih dari 0%';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      capital: Number(formData.capital),
      targetPercent: Number(formData.targetPercent),
      year: Number(formData.year),
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: currentYear - 1, label: String(currentYear - 1) },
    { value: currentYear, label: String(currentYear) },
    { value: currentYear + 1, label: String(currentYear + 1) },
  ];

  const capital = Number(formData.capital) || 0;
  const targetPercent = Number(formData.targetPercent) || 0;

  const monthlyTargetRate = calcMonthlyTarget(targetPercent);
  const weeklyTargetRate = calcWeeklyTarget(targetPercent);
  const yearEndCapital = capital * (1 + targetPercent / 100);
  const yearEndProfit = (capital * targetPercent) / 100;

  return (
    <Card padding="p-5">
      <h3 className="text-lg font-semibold text-[#1E2026] mb-4">⚙️ Goal Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            label="Modal Awal (Starting Capital)"
            type="number"
            placeholder="10000000"
            min={0}
            step={100000}
            value={formData.capital}
            onChange={(e) => handleChange('capital', e.target.value)}
            error={errors.capital}
          />
          <div className="text-xs text-slate-text mt-1">
            {formatCurrency(capital)}
          </div>
        </div>

        <Input
          label="Target Return Tahunan (%)"
          type="number"
          placeholder="100"
          min={1}
          max={1000}
          step={1}
          value={formData.targetPercent}
          onChange={(e) => handleChange('targetPercent', e.target.value)}
          error={errors.targetPercent}
        />

        <Select
          label="Active Year"
          options={yearOptions}
          value={formData.year}
          onChange={(e) => handleChange('year', e.target.value)}
        />
      </div>

      <div className="bg-[#F5F5F5] rounded-[8px] p-4 mb-6">
        <h4 className="text-sm font-bold text-[#1E2026] mb-3">📊 Target Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-text">Monthly Target</p>
            <p className="text-sm font-semibold text-[#1E2026]">
              {(monthlyTargetRate * 100).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Weekly Target</p>
            <p className="text-sm font-semibold text-[#1E2026]">
              {(weeklyTargetRate * 100).toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Year-end Capital</p>
            <p className="text-sm font-semibold text-[#1E2026]">
              {formatCurrency(yearEndCapital)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-text">Year-end Profit</p>
            <p className="text-sm font-semibold text-[#1E2026]">
              {formatCurrency(yearEndProfit)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          💾 Simpan Target
        </Button>
      </div>
    </Card>
  );
};

export default GoalSettings;
