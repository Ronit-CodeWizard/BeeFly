import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode as QrIcon } from 'lucide-react';
import { ShortLink } from '../../types';

interface QrModalProps {
  link: ShortLink | null;
  fullShortUrl: string;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ link, fullShortUrl, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(fullShortUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: unknown) => console.error('Failed to generate QR code', err));
  }, [link, fullShortUrl]);

  if (!link) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${link.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">QR Code Link</h3>
              <p className="text-[11px] text-slate-400">Scan with any mobile camera</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Display */}
        <div className="my-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt={`QR code for ${link.slug}`} 
              className="w-56 h-56 rounded-lg shadow-xs" 
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        {/* Short Link Display */}
        <div className="bg-slate-100 rounded-xl p-2.5 flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono text-slate-700 truncate">
            {fullShortUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs text-xs font-medium flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
