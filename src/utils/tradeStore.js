import { IDX_FEES, LOT_SIZE } from '../constants';

const STORAGE_KEY = 'idx-trading-journal';

export const generateId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const getTrades = () => {
  try {
    const trades = localStorage.getItem(STORAGE_KEY);
    return trades ? JSON.parse(trades) : [];
  } catch (error) {
    console.error('Error reading trades from localStorage', error);
    return [];
  }
};

export const saveTrade = (trade) => {
  const trades = getTrades();
  const newTrade = {
    ...trade,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  const updatedTrades = [...trades, newTrade];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
  return newTrade;
};

export const updateTrade = (id, updatedData) => {
  const trades = getTrades();
  const updatedTrades = trades.map(trade => 
    trade.id === id ? { ...trade, ...updatedData } : trade
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
  return updatedTrades;
};

export const deleteTrade = (id) => {
  const trades = getTrades();
  const updatedTrades = trades.filter(trade => trade.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrades));
  return updatedTrades;
};

export const calculateFees = (status, lots, entryPrice, exitPrice) => {
  const buyValue = lots * LOT_SIZE * entryPrice;
  const buyFee = buyValue * (IDX_FEES.buy.broker + IDX_FEES.buy.vat);
  
  let sellFee = 0;
  if (status === 'Closed' && exitPrice) {
    const sellValue = lots * LOT_SIZE * exitPrice;
    sellFee = sellValue * (IDX_FEES.sell.broker + IDX_FEES.sell.vat + IDX_FEES.sell.pph);
  }
  
  return { 
    buyFee, 
    sellFee, 
    totalFees: buyFee + sellFee 
  };
};

export const calculateNetPnL = (status, lots, entryPrice, exitPrice, totalFees) => {
  if (status === 'Open') return 0; // Floating PnL is not realized
  const grossPnL = lots * LOT_SIZE * (exitPrice - entryPrice);
  const netPnL = grossPnL - totalFees;
  return netPnL;
};

export const getMetrics = (trades) => {
  // Only calculate metrics for closed trades
  const closedTrades = trades.filter(trade => trade.status === 'Closed' || trade.type === 'Sell');
  
  const totalNetPnL = closedTrades.reduce((sum, trade) => sum + (trade.netPnL || 0), 0);
  const totalTrades = closedTrades.length;
  const wins = closedTrades.filter(trade => trade.netPnL > 0).length;
  const losses = closedTrades.filter(trade => trade.netPnL <= 0).length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  
  const winningTradesPnL = closedTrades
    .filter(trade => trade.netPnL > 0)
    .reduce((sum, trade) => sum + trade.netPnL, 0);
  
  const losingTradesPnL = Math.abs(
    closedTrades
      .filter(trade => trade.netPnL <= 0)
      .reduce((sum, trade) => sum + trade.netPnL, 0)
  );
  
  const profitFactor = losingTradesPnL !== 0 ? winningTradesPnL / losingTradesPnL : (winningTradesPnL > 0 ? Infinity : 0);
  
  return { 
    totalNetPnL, 
    totalTrades, 
    winRate, 
    profitFactor, 
    wins, 
    losses 
  };
};
