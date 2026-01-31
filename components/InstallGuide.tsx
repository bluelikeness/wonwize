
import React, { useState } from 'react';
import { X, Share, Monitor, Smartphone, Check, Copy, AlertCircle } from 'lucide-react';

interface InstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallClick?: () => void;
  showNativeButton: boolean;
  isBlob: boolean;
}

const InstallGuide: React.FC<InstallGuideProps> = ({ isOpen, onClose, onInstallClick, showNativeButton, isBlob }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Blob URL일 때는 QR코드가 작동하지 않으므로 다른 UI를 보여줌
  if (isBlob) {
    return (
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black text-slate-900">미리보기 모드</h2>
            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">설치할 수 없는 주소입니다</h3>
              <p className="text-sm text-amber-700 leading-relaxed break-keep">
                현재 보시는 화면은 임시 주소(Blob)에서 실행 중입니다. <br/><br/>
                앱을 설치하거나 휴대폰으로 전송하려면, <br/>
                <strong>정식 호스팅(배포)</strong> 후 생성된 링크를 이용해주세요.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-6 bg-slate-900 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all"
          >
            확인했습니다
          </button>
        </div>
      </div>
    );
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">진짜 앱으로<br/>설치하기</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">휴대폰에서 아래 방법대로 따라하세요.</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-5">
          {/* STEP 1: Instructions */}
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                <span className="font-bold text-slate-800 text-sm">아이폰 (사파리)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. 하단 <Share className="w-3.5 h-3.5 text-blue-500 inline" /> <b>공유</b> 버튼을 누르세요.<br/>
                2. <b>'홈 화면에 추가'</b>를 누르면 끝!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-800 text-sm">안드로이드 / 크롬</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. 우측 상단 <b>점 3개</b> 메뉴를 누르세요.<br/>
                2. <b>'앱 설치'</b> 또는 <b>'홈 화면에 추가'</b> 클릭!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center pt-2">
            <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm mb-3">
              <img src={qrCodeUrl} alt="QR 스캔" className="w-24 h-24" />
            </div>
            <button 
              onClick={handleCopyLink}
              className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 hover:underline"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? '복사되었습니다!' : '링크 복사해서 카톡으로 보내기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallGuide;
