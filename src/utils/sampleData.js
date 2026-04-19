import { saveTrade, calculateFees, calculateNetPnL } from './tradeStore';

const SAMPLE_TRADES_DATA = [
  { ticker: 'BBCA', basePrice: 9500, sector: 'Finance' },
  { ticker: 'BBRI', basePrice: 5200, sector: 'Finance' },
  { ticker: 'TLKM', basePrice: 3800, sector: 'Infrastructure' },
  { ticker: 'ASII', basePrice: 5500, sector: 'Trade & Services' },
  { ticker: 'UNVR', basePrice: 3400, sector: 'Consumer Goods' },
  { ticker: 'BMRI', basePrice: 6000, sector: 'Finance' },
  { ticker: 'ANTM', basePrice: 1600, sector: 'Mining' },
  { ticker: 'INDF', basePrice: 6500, sector: 'Consumer Goods' },
  { ticker: 'ICBP', basePrice: 10500, sector: 'Consumer Goods' },
  { ticker: 'GOTO', basePrice: 70, sector: 'Technology' }
];

const SAMPLE_PSYCH = ['Disciplined', 'FOMO', 'Patient', 'Confident', 'Fearful', 'Impulsive'];
const SAMPLE_STRATS = ['Breakout', 'Support/Resistance', 'Moving Average', 'Trend Following', 'Scalping', 'Swing Trade'];

export const loadSampleData = () => {
  const now = new Date();
  let count = 0;

  SAMPLE_TRADES_DATA.forEach((stock, i) => {
    const wins = [true, true, true, false, true, false, true, true, false, true];
    const win = wins[i];
    
    const entryPrice = stock.basePrice;
    const pctChange = win 
      ? (0.02 + Math.random() * 0.08) // +2% to +10%
      : -(0.01 + Math.random() * 0.05); // -1% to -6%
    const exitPrice = Math.round(entryPrice * (1 + pctChange));
    
    const lots = Math.floor(Math.random() * 9) + 1; // 1-9
    const date = new Date(now);
    date.setDate(date.getDate() - (30 - i * 3));
    const dateStr = date.toISOString().split('T')[0];

    // Calculate fees using correct signature: calculateFees(type, lots, entryPrice, exitPrice)
    const { buyFee, sellFee, totalFees } = calculateFees('Buy', lots, entryPrice, exitPrice);
    // Calculate net P/L: calculateNetPnL(lots, entryPrice, exitPrice, totalFees)
    const netPnL = calculateNetPnL(lots, entryPrice, exitPrice, totalFees);

    const trade = {
      date: dateStr,
      ticker: stock.ticker,
      type: 'Buy',
      lots,
      entryPrice,
      exitPrice,
      buyFee,
      sellFee,
      totalFees,
      netPnL,
      sector: stock.sector,
      psychologyTags: [SAMPLE_PSYCH[i % SAMPLE_PSYCH.length]],
      strategyTags: [SAMPLE_STRATS[i % SAMPLE_STRATS.length]],
      notes: `Sample trade for ${stock.ticker}`,
      screenshot: null
    };

    saveTrade(trade);
    count++;
  });

  return count;
};

export const clearAllData = () => {
  localStorage.removeItem('idx-trading-journal');
};
