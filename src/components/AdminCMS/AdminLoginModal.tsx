import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useProducts();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setPin('');
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('PIN Administrator tidak valid');
    }
  };

  const handleUseDefault = () => {
    setPin('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Login CMS Administrator</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola katalog produk, harga, dan spesifikasi teknis
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Masukkan PIN Admin
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                placeholder="PIN Keamanan (Default: admin123)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest"
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] text-rose-400 mt-1">{errorMsg}</p>
            )}
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-400 flex items-center justify-between">
            <span>PIN Standar Pabrikan: <code className="text-amber-400 font-mono font-bold">admin123</code></span>
            <button
              type="button"
              onClick={handleUseDefault}
              className="text-amber-400 hover:underline font-medium text-[10px]"
            >
              Isi Otomatis
            </button>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
            >
              Masuk Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
