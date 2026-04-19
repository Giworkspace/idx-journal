import React from 'react';
import Card from '../ui/Card';

const MetricCard = ({ label, value, trend, icon, valueColor }) => {
  const getValueColorClass = () => {
    if (valueColor === 'green') return 'text-crypto-green';
    if (valueColor === 'red') return 'text-crypto-red';
    return 'text-ink';
  };

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-card bg-snow flex items-center justify-center">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-slate-text">{label}</span>
      </div>
      
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${getValueColorClass()}`}>
          {value}
        </span>
        
        {trend && (
          <div className={`flex items-center text-xs font-medium mt-1 ${trend.isPositive ? 'text-crypto-green' : 'text-crypto-red'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span className="ml-0.5">{trend.value}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
