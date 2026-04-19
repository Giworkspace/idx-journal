import React from 'react';
import Card from '../ui/Card';
import { calculateFees, calculateNetPnL } from '../../utils/tradeStore';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const FeeCalculator = ({ status = 'Closed', lots, entryPrice, exitPrice }) => {
  const { buyFee, sellFee, totalFees } = calculateFees(status, lots, entryPrice, exitPrice);
  const netPnL = calculateNetPnL(status, lots, entryPrice, exitPrice, totalFees);

  return (
    <Card className="bg-snow p-4 border-none shadow-none">
      <div className="text-sm font-semibold text-ink mb-3">Fee Breakdown</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase text-slate-text">Buy Fee</div>
          <div className="text-sm text-slate-text">{formatCurrency(buyFee)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-text">Sell Fee</div>
          <div className="text-sm text-slate-text">{status === 'Closed' ? formatCurrency(sellFee) : '-'}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-text font-semibold">Total Fees</div>
          <div className="text-sm font-semibold text-ink">{formatCurrency(totalFees)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-text font-semibold">Net P/L</div>
          <div className={`text-sm font-bold ${status === 'Open' ? 'text-slate-text' : (netPnL > 0 ? 'text-crypto-green' : 'text-crypto-red')}`}>
            {status === 'Open' ? 'Floating' : formatCurrency(netPnL)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-text italic">
        Fees auto-calculated based on IDX standard rates
      </p>
    </Card>
  );
};

export default FeeCalculator;
