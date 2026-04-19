export const IDX_FEES = {
  buy: { broker: 0.0015, vat: 0.00015 },    // 0.15% + 0.015%
  sell: { broker: 0.0025, vat: 0.00025, pph: 0.001 } // 0.25% + 0.025% + 0.1%
};

export const IDX_SECTORS = [
  'Finance', 'Mining', 'Consumer Goods', 'Infrastructure', 
  'Trade & Services', 'Agriculture', 'Basic Industry', 
  'Miscellaneous', 'Property', 'Technology'
];

export const PSYCHOLOGY_TAGS = [
  'FOMO', 'Disciplined', 'Revenge Trade', 'Patient', 
  'Greedy', 'Confident', 'Fearful', 'Impulsive'
];

export const STRATEGY_TAGS = [
  'Breakout', 'Support/Resistance', 'Moving Average', 
  'Trend Following', 'Scalping', 'Swing Trade'
];

export const TRADE_STATUS = ['Open', 'Closed'];

export const LOT_SIZE = 100; // 1 lot = 100 shares in IDX

export const DEFAULT_TRADE = {
  id: '',
  entryDate: '',
  exitDate: '',
  ticker: '',
  status: 'Open',
  lots: '',
  entryPrice: '',
  exitPrice: '',
  buyFee: 0,
  sellFee: 0,
  totalFees: 0,
  netPnL: 0,
  sector: '',
  psychologyTags: [],
  strategyTags: [],
  notes: '',
  screenshot: null,
  createdAt: ''
};

export const IDX_MARKET_HOLIDAYS = [
  // 2024
  { date: '2024-01-01', name: 'Tahun Baru 2024' },
  { date: '2024-02-08', name: 'Tahun Baru Imlek' },
  { date: '2024-02-09', name: 'Cuti Bersama Imlek' },
  { date: '2024-03-11', name: 'Hari Raya Nyepi' },
  { date: '2024-03-12', name: 'Cuti Bersama Nyepi' },
  { date: '2024-03-28', name: 'Isra Mikraj Nabi Muhammad' },
  { date: '2024-03-29', name: 'Wafat Isa Al Masih' },
  { date: '2024-04-08', name: 'Hari Raya Idul Fitri' },
  { date: '2024-04-09', name: 'Hari Raya Idul Fitri' },
  { date: '2024-04-10', name: 'Hari Raya Idul Fitri' },
  { date: '2024-04-11', name: 'Cuti Bersama Idul Fitri' },
  { date: '2024-04-12', name: 'Cuti Bersama Idul Fitri' },
  { date: '2024-04-15', name: 'Cuti Bersama Idul Fitri' },
  { date: '2024-05-01', name: 'Hari Buruh' },
  { date: '2024-05-09', name: 'Kenaikan Isa Al Masih' },
  { date: '2024-05-10', name: 'Cuti Bersama Kenaikan Isa' },
  { date: '2024-05-23', name: 'Hari Raya Waisak' },
  { date: '2024-05-24', name: 'Cuti Bersama Waisak' },
  { date: '2024-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2024-06-17', name: 'Hari Raya Idul Adha' },
  { date: '2024-06-18', name: 'Cuti Bersama Idul Adha' },
  { date: '2024-07-07', name: 'Tahun Baru Islam' },
  { date: '2024-08-17', name: 'Hari Kemerdekaan RI' },
  { date: '2024-09-16', name: 'Maulid Nabi Muhammad' },
  { date: '2024-12-25', name: 'Hari Raya Natal' },
  { date: '2024-12-26', name: 'Cuti Bersama Natal' },
  // 2025
  { date: '2025-01-01', name: 'Tahun Baru 2025' },
  { date: '2025-01-27', name: 'Isra Mikraj Nabi Muhammad' },
  { date: '2025-01-29', name: 'Tahun Baru Imlek' },
  { date: '2025-03-14', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-03-28', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-03-29', name: 'Hari Raya Nyepi' },
  { date: '2025-03-31', name: 'Hari Raya Idul Fitri' },
  { date: '2025-04-01', name: 'Hari Raya Idul Fitri' },
  { date: '2025-04-02', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-03', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-04', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-07', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-18', name: 'Wafat Isa Al Masih' },
  { date: '2025-05-01', name: 'Hari Buruh' },
  { date: '2025-05-12', name: 'Hari Raya Waisak' },
  { date: '2025-05-29', name: 'Kenaikan Isa Al Masih' },
  { date: '2025-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2025-06-06', name: 'Hari Raya Idul Adha' },
  { date: '2025-06-07', name: 'Cuti Bersama Idul Adha' },
  { date: '2025-06-27', name: 'Tahun Baru Islam' },
  { date: '2025-08-17', name: 'Hari Kemerdekaan RI' },
  { date: '2025-09-05', name: 'Maulid Nabi Muhammad' },
  { date: '2025-12-25', name: 'Hari Raya Natal' },
  { date: '2025-12-26', name: 'Cuti Bersama Natal' },
  // 2026
  { date: '2026-01-01', name: 'Tahun Baru 2026' },
  { date: '2026-01-16', name: 'Isra Mikraj Nabi Muhammad' },
  { date: '2026-02-17', name: 'Tahun Baru Imlek' },
  { date: '2026-03-19', name: 'Hari Raya Nyepi' },
  { date: '2026-03-20', name: 'Hari Raya Idul Fitri' },
  { date: '2026-03-21', name: 'Hari Raya Idul Fitri' },
  { date: '2026-03-22', name: 'Cuti Bersama Idul Fitri' },
  { date: '2026-03-23', name: 'Cuti Bersama Idul Fitri' },
  { date: '2026-04-03', name: 'Wafat Isa Al Masih' },
  { date: '2026-05-01', name: 'Hari Buruh' },
  { date: '2026-05-14', name: 'Kenaikan Isa Al Masih' },
  { date: '2026-05-27', name: 'Hari Raya Idul Adha' },
  { date: '2026-05-31', name: 'Hari Raya Waisak' },
  { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2026-06-16', name: 'Tahun Baru Islam' },
  { date: '2026-08-17', name: 'Hari Kemerdekaan RI' },
  { date: '2026-08-26', name: 'Maulid Nabi Muhammad' },
  { date: '2026-12-25', name: 'Hari Raya Natal' },
  { date: '2026-12-26', name: 'Cuti Bersama Natal' },
];

export const GOALS_STORAGE_KEY = 'idx_journal_goals';

export const DEFAULT_GOAL_SETTINGS = {
  capital: 10000000,
  targetPercent: 100,
  year: new Date().getFullYear(),
};

export const GOAL_STATUS = {
  AHEAD: { key: 'AHEAD', emoji: '🚀', label: 'Ahead', color: '#0ECB81', minRatio: 1.1 },
  ON_TRACK: { key: 'ON_TRACK', emoji: '🟢', label: 'On Track', color: '#0ECB81', minRatio: 0.9 },
  SLIGHTLY_BEHIND: { key: 'SLIGHTLY_BEHIND', emoji: '🟡', label: 'Slightly Behind', color: '#F0B90B', minRatio: 0.7 },
  BEHIND: { key: 'BEHIND', emoji: '🔴', label: 'Behind', color: '#F6465D', minRatio: 0 },
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
