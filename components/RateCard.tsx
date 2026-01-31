
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RateCardProps {
  label: string;
  symbol: string;
  value: number;
  change: number;
  percent: number;
  isLoading?: boolean;
}

const RateCard: React.FC<RateCardProps> = ({ label, symbol, value, change, percent, isLoading }) => {
  const isUp = change > 0;
  const isNeutral = change === 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
        <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 font-medium text-sm">{label}</span>
        <div className={`p-2 rounded-xl ${isUp ? 'bg-rose-50' : 'bg-emerald-50'}`}>
           <span className={`text-xs font-bold ${isUp ? 'text-rose-600' : 'text-emerald-600'}`}>{symbol}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</h2>
        <span className="text-slate-400 text-sm">KRW</span>
      </div>
      <div className="flex items-center gap-1">
        {isUp ? (
          <TrendingUp className="w-4 h-4 text-rose-500" />
        ) : isNeutral ? (
          <Minus className="w-4 h-4 text-slate-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-emerald-500" />
        )}
        <span className={`text-sm font-semibold ${isUp ? 'text-rose-500' : isNeutral ? 'text-slate-400' : 'text-emerald-500'}`}>
          {isUp ? '+' : ''}{change.toFixed(1)} ({percent.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
};

export default RateCard;
