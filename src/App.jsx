import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TradeLog from './pages/TradeLog';
import TradeEntry from './pages/TradeEntry';
import Calendar from './pages/Calendar';
import Goals from './pages/Goals';
import Button from './components/ui/Button';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-bold text-binance-yellow mb-4">404</h1>
    <p className="text-lg text-slate-text mb-8">Page not found</p>
    <Link to="/">
      <Button variant="pill">Go to Dashboard</Button>
    </Link>
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trades" element={<TradeLog />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/trades/new" element={<TradeEntry />} />
        <Route path="/trades/edit/:id" element={<TradeEntry />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
