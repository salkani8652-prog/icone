import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2, RotateCcw } from 'lucide-react';

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
  const { loginAdmin, changeAdminPin, resetAdminPin, isDefaultPin } = useProducts();
  const [mode, setMode] = useState<'login' | 'change_password'>('login');

  // Login form state
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Change password form state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!pin.trim()) {
      setLoginError('Silakan masukkan password atau PIN.');
      return;
    }
    if (loginAdmin(pin.trim())) {
      setPin('');
      setLoginError('');
      onSuccess();
    } else {
      setLoginError('Password / PIN tidak cocok. Silakan coba lagi atau gunakan opsi Reset.');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!oldPin.trim()) {
      setChangeError('Masukkan password saat ini.');
      return;
    }
    if (newPin.trim().length < 4) {
      setChangeError('Password baru minimal 4 karakter.');
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setChangeError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    const success = changeAdminPin(oldPin.trim(), newPin.trim());
    if (success) {
      setChangeSuccess('Password berhasil diperbarui! Anda dapat langsung masuk.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        loginAdmin(newPin.trim());
        onSuccess();
      }, 1000);
    } else {
      setChangeError('Password lama tidak sesuai. Jika lupa, klik opsi "Reset ke Default".');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset password admin ke bawaan pabrikan ("admin123")?')) {
      resetAdminPin();
      setPin('admin123');
      setLoginError('');
      setChangeError('');
      setChangeSuccess('Password telah di-reset ke "admin123". Silakan klik Masuk.');
      setMode('login');
    }
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

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'Login CMS Administrator' : 'Ganti Password Administrator'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'login'
                ? 'Portal pengelolaan katalog & spesifikasi radio'
                : 'Perbarui kata sandi akses kontrol CMS'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Login vs Ganti Password */}
        <div className="flex rounded bg-slate-950 p-1 mt-4 border border-slate-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setChangeError('');
            }}
            className={`flex-1 py-1.5 rounded transition-colors ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('change_password');
              setLoginError('');
              setChangeError('');
            }}
            className={`flex-1 py-1.5 rounded transition-colors ${
              mode === 'change_password'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ganti Password
          </button>
        </div>

        {/* MODE 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password / PIN Admin
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="Masukkan password admin"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setLoginError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-10 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-[11px] text-rose-400 mt-1.5 font-medium">{loginError}</p>
              )}
            </div>

            {/* Quick Helper Box (Hanya tampil jika password masih default pabrikan) */}
            {isDefaultPin && (
              <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Default Pabrikan: <code className="text-amber-400 font-mono font-bold">admin123</code></span>
                  <button
                    type="button"
                    onClick={() => setPin('admin123')}
                    className="text-amber-400 hover:underline font-medium text-[10px]"
                  >
                    Isi admin123
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-[10px] text-slate-500">Lupa password?</span>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-slate-400 hover:text-amber-400 font-medium text-[10px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            )}

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
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
              >
                Masuk Dashboard
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: GANTI PASSWORD */}
        {mode === 'change_password' && (
          <form onSubmit={handleChangePasswordSubmit} className="mt-4 space-y-3 text-xs">
            {changeSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 space-y-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold">{changeSuccess}</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Password / PIN Saat Ini
                  </label>
                  <input
                    type="password"
                    placeholder="Masukkan password lama (default: admin123)"
                    value={oldPin}
                    onChange={(e) => {
                      setOldPin(e.target.value);
                      setChangeError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Password Baru (Minimal 4 Karakter)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Masukkan password baru"
                      value={newPin}
                      onChange={(e) => {
                        setNewPin(e.target.value);
                        setChangeError('');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 pr-9 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Ulangi Password Baru (Konfirmasi)
                  </label>
                  <input
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={confirmPin}
                    onChange={(e) => {
                      setConfirmPin(e.target.value);
                      setChangeError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {changeError && (
                  <p className="text-[11px] text-rose-400 font-medium">{changeError}</p>
                )}

                {isDefaultPin && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Lupa? Reset ke admin123</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                  >
                    Simpan Password Baru
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
