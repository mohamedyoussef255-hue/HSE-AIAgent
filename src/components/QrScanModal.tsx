import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, X, RefreshCw, Cpu } from 'lucide-react';
import { Asset } from '../types';
import { INITIAL_ASSETS } from '../data/mockData';

interface QrScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: Asset) => void;
}

export const QrScanModal: React.FC<QrScanModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSimulateScan = (asset: Asset) => {
    setIsScanning(false);
    setSelectedAssetId(asset.id);
    setTimeout(() => {
      onSelectAsset(asset);
      onClose();
      setIsScanning(true);
      setSelectedAssetId('');
    }, 600);
  };

  return (
    <div id="qr-scan-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">مسح كود الأصل (QR / NFC Scanner)</h3>
              <p className="text-xs text-slate-400">امسح كود المعدة أو اخترها لجلب البيانات آلياً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-64 bg-slate-950 rounded-2xl border-2 border-dashed border-amber-500/40 flex items-center justify-center overflow-hidden shadow-inner group">
            {/* Laser scan line animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce transition-all duration-1000 top-1/4" />
            
            {/* Viewfinder corners */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

            <div className="text-center p-4">
              <Camera className="w-12 h-12 text-slate-600 mx-auto mb-2 animate-pulse" />
              <p className="text-xs text-slate-400 font-medium">وجّه الكاميرا نحو رمز QR على جسم المعدة</p>
              <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-slate-800 text-amber-300 rounded font-mono">
                جاهز للمسح الضوئي (NFC / QR)
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            أو اختر أحد الأصول المتواجدة في موقعك الحالي بنقرة واحدة:
          </p>
        </div>

        {/* Quick Asset List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
          {INITIAL_ASSETS.map((asset) => {
            const isSelected = selectedAssetId === asset.id;
            return (
              <button
                key={asset.id}
                onClick={() => handleSimulateScan(asset)}
                className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-start justify-between group ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                      {asset.code}
                    </span>
                    <span className="font-semibold text-sm">{asset.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>📍 {asset.station}</span>
                    <span>• {asset.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-center">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <span className="text-xs text-slate-400 group-hover:text-amber-400 transition-colors flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> مسح
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
