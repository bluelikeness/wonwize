
import React, { useState, useEffect } from 'react';
import { RefreshCw, BrainCircuit, Globe, LayoutDashboard, History, Settings, Download, Share2 } from 'lucide-react';
import RateCard from './components/RateCard';
import FXChart from './components/FXChart';
import Converter from './components/Converter';
import InstallGuide from './components/InstallGuide';
import { fetchMarketData } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isBlob, setIsBlob] = useState(false);

  useEffect(() => {
    // 현재 URL이 Blob(임시 미리보기)인지 확인
    if (window.location.protocol === 'blob:') {
      setIsBlob(true);
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchMarketData();
    setData(result);
    
    const mockHistory = Array.from({ length: 7 }, (_, i) => ({
      date: `10/${20 + i}`,
      usd: 1370 + Math.random() * 30,
      jpy: 900 + Math.random() * 20
    }));
    setHistory(mockHistory);
    setIsLoading(false);
  };

  const handleShare = async () => {
    // Blob URL일 경우 공유 기능 제한 (의미 없는 주소이므로)
    if (isBlob) {
      setIsInstallModalOpen(true);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: '원와이즈 환율 앱',
          text: '매일 달러와 엔화 환율을 확인해보세요!',
          url: window.location.href,
        });
      } catch (err) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setIsInstallModalOpen(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 shadow-2xl relative">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-10 glass-morphism">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">원와이즈</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Daily FX Tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all text-slate-600"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <RateCard 
            label="미국 달러 (USD)" 
            symbol="$" 
            value={data?.rates?.usd?.value || 0} 
            change={data?.rates?.usd?.change || 0}
            percent={data?.rates?.usd?.percent || 0}
            isLoading={isLoading}
          />
          <RateCard 
            label="일본 엔 (JPY 100)" 
            symbol="¥" 
            value={data?.rates?.jpy?.value || 0} 
            change={data?.rates?.jpy?.change || 0}
            percent={data?.rates?.jpy?.percent || 0}
            isLoading={isLoading}
          />
        </div>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
            <History className="w-4 h-4 text-indigo-500" />
            최근 추이
          </h3>
          <FXChart data={history} dataKey="usd" color="#6366f1" />
          <div className="mt-4 pt-4 border-t border-slate-50">
            <FXChart data={history} dataKey="jpy" color="#f43f5e" />
          </div>
        </section>

        <Converter 
          usdRate={data?.rates?.usd?.value || 1380} 
          jpyRate={data?.rates?.jpy?.value || 915} 
        />

        <section className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold">AI 인사이트</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-white/10 rounded animate-pulse w-4/5"></div>
            </div>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed relative z-10">
              {data?.insight}
            </p>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50 nav-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">홈</span>
        </button>
        <button 
          onClick={handleShare}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-500"
        >
          <Share2 className="w-6 h-6" />
          <span className="text-[10px] font-bold">휴대폰 전송</span>
        </button>
        <button 
          onClick={() => setIsInstallModalOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-500"
        >
          <Download className="w-6 h-6" />
          <span className="text-[10px] font-bold">앱 설치</span>
        </button>
      </nav>

      <InstallGuide 
        isOpen={isInstallModalOpen} 
        onClose={() => setIsInstallModalOpen(false)}
        onInstallClick={handleNativeInstall}
        showNativeButton={!!deferredPrompt}
        isBlob={isBlob}
      />
    </div>
  );
};

export default App;
