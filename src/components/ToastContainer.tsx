import React from 'react';
import { useProducts } from '../context/ProductContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProducts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl backdrop-blur-md text-xs text-white transition-all transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/50 text-rose-300'
              : 'bg-slate-900/95 border-amber-500/50 text-amber-300'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          
          <div className="flex-1 text-slate-100 font-medium leading-relaxed">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
