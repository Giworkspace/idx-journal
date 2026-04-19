import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTradeStore } from '../hooks/useTradeStore';
import TradeTable from '../components/trades/TradeTable';
import Button from '../components/ui/Button';

const TradeLog = () => {
  const navigate = useNavigate();
  const { trades, removeTrade } = useTradeStore();

  const handleEdit = (id) => {
    navigate(`/trades/edit/${id}`);
  };

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">Trade Log</h1>
        <Link to="/trades/new">
          <Button variant="pill">+ Add Trade</Button>
        </Link>
      </div>

      <TradeTable 
        trades={trades} 
        onDelete={removeTrade} 
        onEdit={handleEdit} 
      />
    </div>
  );
};

export default TradeLog;
