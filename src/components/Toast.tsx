import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, Copy, Check, Key, Sparkles } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  secretCode?: string;
  createdAt: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-[calc(100%-2.5rem)] pointer-events-none">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleCopyCode = () => {
    if (toast.secretCode) {
      navigator.clipboard.writeText(toast.secretCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pointer-events-auto bg-slate-900/95 text-white backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-4 flex gap-3 items-start animate-in slide-in-from-bottom-5 fade-in duration-300 transition-all">
      <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 mt-0.5 border border-emerald-500/30">
        <CheckCircle2 className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>{toast.title}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </h4>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {toast.message}
        </p>

        {toast.secretCode && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between bg-slate-800/80 rounded-xl px-3 py-1.5 border-slate-700">
            <div className="flex items-center gap-1.5 min-w-0">
              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-400">সিক্রেট কোড:</span>
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                {toast.secretCode}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/30 transition-colors shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>কপি করুন</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
