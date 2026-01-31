
import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface ConverterProps {
  usdRate: number;
  jpyRate: number;
}

const Converter: React.FC<ConverterProps> = ({ usdRate, jpyRate }) => {
  const [amount, setAmount] = useState<string>('1');
  const [target, setTarget] = useState<'USD' | 'JPY'>('USD');

  const getResult = () => {
    const val = parseFloat(amount) || 0;
    const rate = target === 'USD' ? usdRate : (jpyRate / 100);
    return (val * rate).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <ArrowLeftRight className="w-5 h-5 text-indigo-400" />
        환율 계산기
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 block">금액 입력</label>
          <div className="flex gap-2">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-800 border-none rounded-xl px-4 py-3 w-full text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select 
              value={target}
              onChange={(e) => setTarget(e.target.value as any)}
              className="bg-slate-800 border-none rounded-xl px-4 py-3 text-white font-bold outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
        
        <div className="pt-2 border-t border-slate-800">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1 block">원화(KRW) 환산</label>
          <div className="text-3xl font-bold text-indigo-400">
            ₩ {getResult()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
