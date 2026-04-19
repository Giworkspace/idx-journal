import { useState, useCallback, useMemo } from 'react';
import { 
  getTrades, 
  saveTrade, 
  updateTrade, 
  deleteTrade, 
  getMetrics 
} from '../utils/tradeStore';

export const useTradeStore = () => {
  const [trades, setTrades] = useState(() => getTrades());

  const metrics = useMemo(() => getMetrics(trades), [trades]);

  const refreshTrades = useCallback(() => {
    setTrades(getTrades());
  }, []);

  const addTrade = useCallback((tradeData) => {
    saveTrade(tradeData);
    refreshTrades();
  }, [refreshTrades]);

  const removeTrade = useCallback((id) => {
    deleteTrade(id);
    refreshTrades();
  }, [refreshTrades]);

  const editTrade = useCallback((id, data) => {
    updateTrade(id, data);
    refreshTrades();
  }, [refreshTrades]);

  return { 
    trades, 
    metrics, 
    addTrade, 
    removeTrade, 
    editTrade, 
    refreshTrades 
  };
};
