import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTradeStore } from '../hooks/useTradeStore';
import TradeForm from '../components/trades/TradeForm';

const TradeEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trades, addTrade, editTrade } = useTradeStore();

  const isEditMode = Boolean(id);
  const foundTrade = isEditMode ? trades.find(t => t.id === id) : null;

  if (isEditMode && !foundTrade) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-ink mb-4">Trade not found</h2>
        <Link to="/trades" className="text-binance-yellow hover:underline">
          Back to Trade Log
        </Link>
      </div>
    );
  }

  const handleSubmit = (data) => {
    if (isEditMode) {
      editTrade(id, data);
    } else {
      addTrade(data);
    }
    navigate('/trades');
  };

  const handleCancel = () => {
    navigate('/trades');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-ink mb-6">
        {isEditMode ? 'Edit Trade' : 'New Trade'}
      </h1>
      
      <TradeForm 
        initialData={foundTrade} 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  );
};

export default TradeEntry;
