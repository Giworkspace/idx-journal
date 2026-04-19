import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import TagSelector from '../ui/TagSelector';
import Button from '../ui/Button';
import FeeCalculator from './FeeCalculator';
import ScreenshotUpload from './ScreenshotUpload';
import { 
  IDX_SECTORS, 
  PSYCHOLOGY_TAGS, 
  STRATEGY_TAGS, 
  TRADE_STATUS, 
  DEFAULT_TRADE 
} from '../../constants';
import { calculateFees, calculateNetPnL } from '../../utils/tradeStore';

const TradeForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => {
    if (!initialData) return { ...DEFAULT_TRADE };
    return {
      ...DEFAULT_TRADE,
      ...initialData,
      entryDate: initialData.entryDate || initialData.date || '',
      status: initialData.status || (initialData.type === 'Buy' ? 'Open' : 'Closed')
    };
  });
  const [errors, setErrors] = useState({});

  const sectorOptions = [
    { value: '', label: 'Select sector...' },
    ...IDX_SECTORS.map(s => ({ value: s, label: s }))
  ];

  const statusOptions = TRADE_STATUS.map(s => ({ value: s, label: s }));

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'ticker' ? value.toUpperCase() : value
    }));
    // Clear error for the field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = ['entryDate', 'ticker', 'status', 'lots', 'entryPrice'];
    
    if (formData.status === 'Closed') {
      requiredFields.push('exitDate', 'exitPrice');
    }
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { buyFee, sellFee, totalFees } = calculateFees(
      formData.status,
      Number(formData.lots),
      Number(formData.entryPrice),
      Number(formData.exitPrice || 0)
    );

    const netPnL = calculateNetPnL(
      formData.status,
      Number(formData.lots),
      Number(formData.entryPrice),
      Number(formData.exitPrice || 0),
      totalFees
    );

    const completeTrade = {
      ...formData,
      lots: Number(formData.lots),
      entryPrice: Number(formData.entryPrice),
      exitPrice: formData.status === 'Closed' ? Number(formData.exitPrice) : 0,
      buyFee,
      sellFee,
      totalFees,
      netPnL,
      updatedAt: new Date().toISOString()
    };

    onSubmit(completeTrade);
  };

  const isFeeCalcVisible = formData.lots && formData.entryPrice && (formData.status === 'Open' || formData.exitPrice);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ink">Trade Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            error={errors.status}
            required
          />
          <Input
            type="text"
            label="Ticker"
            placeholder="e.g. BBCA"
            value={formData.ticker}
            onChange={(e) => handleChange('ticker', e.target.value)}
            error={errors.ticker}
            required
          />
          <Input
            type="date"
            label="Entry Date"
            value={formData.entryDate}
            onChange={(e) => handleChange('entryDate', e.target.value)}
            error={errors.entryDate}
            required
          />
          <Input
            type="number"
            label="Lots"
            min="1"
            placeholder="Number of lots"
            value={formData.lots}
            onChange={(e) => handleChange('lots', e.target.value)}
            error={errors.lots}
            required
          />
          <Input
            type="number"
            label="Entry Price (IDR)"
            min="0"
            placeholder="Entry price"
            value={formData.entryPrice}
            onChange={(e) => handleChange('entryPrice', e.target.value)}
            error={errors.entryPrice}
            required
          />
          {formData.status === 'Closed' && (
            <>
              <Input
                type="date"
                label="Exit Date"
                value={formData.exitDate}
                onChange={(e) => handleChange('exitDate', e.target.value)}
                error={errors.exitDate}
                required
              />
              <Input
                type="number"
                label="Exit Price (IDR)"
                min="0"
                placeholder="Exit price"
                value={formData.exitPrice}
                onChange={(e) => handleChange('exitPrice', e.target.value)}
                error={errors.exitPrice}
                required
              />
            </>
          )}
          <Select
            label="Sector"
            options={sectorOptions}
            value={formData.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
          />
        </div>
      </div>

      {isFeeCalcVisible && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <FeeCalculator 
            status={formData.status}
            lots={Number(formData.lots)} 
            entryPrice={Number(formData.entryPrice)} 
            exitPrice={Number(formData.exitPrice || 0)} 
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">Psychology Log</h3>
          <p className="text-sm text-slate-text mb-3">How were you feeling during this trade?</p>
          <TagSelector 
            tags={PSYCHOLOGY_TAGS}
            selectedTags={formData.psychologyTags}
            onChange={(tags) => handleChange('psychologyTags', tags)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink mb-3">Strategy</h3>
          <TagSelector 
            tags={STRATEGY_TAGS}
            selectedTags={formData.strategyTags}
            onChange={(tags) => handleChange('strategyTags', tags)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink mb-3">Chart Screenshot</h3>
        <ScreenshotUpload 
          screenshot={formData.screenshot}
          onChange={(val) => handleChange('screenshot', val)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink mb-1">Trade Notes</h3>
        <textarea
          className="w-full rounded-input border border-border-light p-3 min-h-[120px] focus:border-black focus:outline-none text-ink placeholder:text-slate-text/50"
          placeholder="Add your notes about this trade..."
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border-light">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="pill" type="submit">
          {initialData ? 'Update Trade' : 'Save Trade'}
        </Button>
      </div>
    </form>
  );
};

export default TradeForm;
