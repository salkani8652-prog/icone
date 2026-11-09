import React, { useState, useMemo, useRef } from 'react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types/radio';
import {
  Plus,
  Edit3,
  Copy,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle,
  KeyRound,
  Shield,
  Layers,
  Radio,
  Wifi,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenCreate: () => void;
  onOpenEdit: (product: Product) => void;
  onViewLiveCatalog: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenCreate,
  onOpenEdit,
  onViewLiveCatalog,
}) => {
  const {
    products,
    deleteProduct,
    duplicateProduct,
    resetToDefault,
    exportCatalogJson,
    importCatalogJson,
    adminPin,
    changeAdminPin,
    resetAdminPin,
    showToast,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Pin change modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pinError, setPinError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const total = products.length;
    const poc = products.filter((p) => p.category === 'poc').length;
    const dmr = products.filter((p) => p.category === 'dmr').length;
    const repeater = products.filter((p) => p.category === 'repeater').length;
    const accessory = products.filter((p) => p.category === 'accessory').length;
    const inStock = products.filter((p) => p.inStock).length;
    return { total, poc, dmr, repeater, accessory, inStock };
  }, [products]);

  // Filter products for table
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.modelCode.toLowerCase().includes(q) ||
          p.specs.frequencyBand.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, categoryFilter, searchQuery]);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const res = importCatalogJson(content);
          if (!res.success) {
            showToast(res.message, 'error');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!oldPin.trim()) {
      setPinError('Masukkan password saat ini.');
      return;
    }
    if (newPin.trim().length < 4) {
      setPinError('Password baru minimal 4 karakter.');
      return;
    }
    if (newPin.trim() !== confirmPin.trim()) {
      setPinError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    if (changeAdminPin(oldPin.trim(), newPin.trim())) {
      setShowPinModal(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setPinError('');
    } else {
      setPinError('Password lama salah. Jika lupa, gunakan tombol Reset ke Default.');
    }
  };

  const formatPrice = (price: number | null, isPriceOnRequest: boolean) => {
    if (isPriceOnRequest || price === null || price === 0) {
      return 'RFQ (Harga Proyek)';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>ICONE GLOBALTECH CMS CONTROL CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manajemen Katalog & Spesifikasi Teknis Radio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Perbarui data produk, rentang frekuensi, sertifikasi IP rating, dan lembar spesifikasi secara instan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onViewLiveCatalog}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Lihat Tampilan Publik</span>
          </button>
          <button
            onClick={onOpenCreate}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Perangkat</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{stats.total}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-sky-400 uppercase">Radio PoC (LTE)</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{stats.poc}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-amber-400 uppercase">Radio DMR (RF)</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{stats.dmr}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-indigo-400 uppercase">Base & Repeater</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{stats.repeater}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Aksesoris Audio</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{stats.accessory}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Ready Stock</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{stats.inStock}</div>
        </div>
      </div>

      {/* CMS Toolbar & Tools */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, model, frekuensi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'poc', label: 'PoC' },
                { id: 'dmr', label: 'DMR' },
                { id: 'repeater', label: 'Repeater' },
                { id: 'accessory', label: 'Aksesoris' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    categoryFilter === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Backup & Tools Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportCatalogJson}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1.5"
              title="Unduh backup data katalog format JSON"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Ekspor JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1.5"
              title="Pulihkan katalog dari file backup JSON"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Impor JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              onClick={() => setShowPinModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1.5"
              title="Ganti PIN Keamanan Admin"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganti PIN</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin me-reset katalog ke data pabrikan awal? Perubahan kustom akan dihapus.')) {
                  resetToDefault();
                }
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800 hover:border-rose-900/50 rounded transition-colors flex items-center gap-1.5"
              title="Reset ke data awal pabrikan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pabrik</span>
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border border-slate-800 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Perangkat & Model</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Spektrum / Band</th>
                <th className="py-3 px-4 font-semibold">Ketahanan IP</th>
                <th className="py-3 px-4 font-semibold">Estimasi Harga</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi CMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Model & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 object-contain bg-slate-950 rounded p-1 border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-mono font-bold text-amber-400 text-xs">
                          {prod.modelCode}
                        </div>
                        <div className="font-semibold text-white max-w-[200px] truncate" title={prod.name}>
                          {prod.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-300 uppercase">
                      {prod.category}
                    </span>
                  </td>

                  {/* Frequency */}
                  <td className="py-3 px-4 font-mono text-slate-200">
                    <div className="max-w-[150px] truncate" title={prod.specs.frequencyBand}>
                      {prod.specs.frequencyBand}
                    </div>
                  </td>

                  {/* IP Rating */}
                  <td className="py-3 px-4 font-mono text-emerald-400">
                    {prod.specs.ipRating}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono tabular-nums text-white">
                    {formatPrice(prod.price, prod.isPriceOnRequest)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className={prod.inStock ? 'text-emerald-400' : 'text-amber-400'}>
                      {prod.inStock ? 'Ready' : 'Inden'}
                    </span>
                    {prod.isFeatured && (
                      <span className="block text-[10px] text-amber-400">★ Unggulan</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenEdit(prod)}
                        title="Edit spesifikasi teknis produk"
                        className="p-1.5 text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => duplicateProduct(prod.id)}
                        title="Duplikasi produk ini (Buat varian baru)"
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        title="Hapus produk dari katalog"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 text-slate-100">
            <h3 className="text-base font-bold text-white">Hapus Perangkat dari Katalog?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anda akan menghapus <strong>{productToDelete.name} ({productToDelete.modelCode})</strong> beserta seluruh riwayat spesifikasi teknisnya. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Ganti Password / PIN Admin</h3>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinError('');
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePinSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  value={oldPin}
                  onChange={(e) => {
                    setOldPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Masukkan password saat ini (default: admin123)"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password Baru (Minimal 4 Karakter)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPin}
                    onChange={(e) => {
                      setNewPin(e.target.value);
                      setPinError('');
                    }}
                    placeholder="Masukkan password baru"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 pr-9 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ulangi Password Baru (Konfirmasi)</label>
                <input
                  type="password"
                  required
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Ketik ulang password baru"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-400 font-medium">{pinError}</p>
              )}

              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset password admin ke bawaan pabrikan ("admin123")?')) {
                      resetAdminPin();
                      setShowPinModal(false);
                      setOldPin('');
                      setNewPin('');
                      setConfirmPin('');
                      setPinError('');
                    }
                  }}
                  className="hover:text-amber-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ke admin123</span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinError('');
                  }}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
