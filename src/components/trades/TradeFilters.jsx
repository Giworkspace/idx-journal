import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { STRATEGY_TAGS, TRADE_STATUS } from '../../constants';

const TradeFilters = ({ filters, onFilterChange }) => {
  const strategyOptions = [
    { value: '', label: 'All' },
    ...STRATEGY_TAGS.map(tag => ({ value: tag, label: tag }))
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    ...TRADE_STATUS.map(status => ({ value: status, label: status }))
  ];

  const handleClear = () => {
    onFilterChange({
      search: '',
      dateFrom: '',
      dateTo: '',
      strategy: '',
      status: ''
    });
  };

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-3 items-end mb-6">
      <div className="w-full md:w-auto md:min-w-[200px]">
        <Input
          placeholder="Search ticker..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="w-full md:w-auto">
        <Input
          type="date"
          label="From"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="w-full md:w-auto">
        <Input
          type="date"
          label="To"
          value={filters.dateTo}
          onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="w-full md:w-auto md:min-w-[150px]">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="w-full md:w-auto md:min-w-[150px]">
        <Select
          label="Strategy"
          options={strategyOptions}
          value={filters.strategy}
          onChange={(e) => onFilterChange({ ...filters, strategy: e.target.value })}
          className="w-full"
        />
      </div>
      
      <div className="w-full md:w-auto">
        <Button 
          variant="secondary" 
          onClick={handleClear}
          className="w-full md:w-auto"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default TradeFilters;
