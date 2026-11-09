import React from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types/radio';
import { X, Scale, Trash2, ArrowRight } from 'lucide-react';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRfq: (product: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  isOpen,
  onClose,
  onOpenRfq,
}) => {
  const { products, comparedProductIds, toggleCompare, clearCompare } = useProducts();

  if (!isOpen) return null;

  const comparedProducts = products.filter((p) => comparedProductIds.includes(p.id));

  const formatPrice = (price: number | null, isPriceOnRequest: boolean) => {
    if (isPriceOnRequest || price === null || price === 0) {
      return 'Harga atas Permintaan (RFQ)';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const rows = [
    { label: 'Kategori Teknologi', getVal: (p: Product) => p.category.toUpperCase() + ` (${p.formFactor.replace('_', ' ')})` },
    { label: 'Estimasi Pengadaan', getVal: (p: Product) => formatPrice(p.price, p.isPriceOnRequest) },
    { label: 'Frekuensi / Band', getVal: (p: Product) => p.specs.frequencyBand },
    { label: 'Daya Pancar RF', getVal: (p: Product) => p.specs.rfPowerOutput || 'N/A (Jaringan Seluler 4G/LTE)' },
    { label: 'Kapasitas Kanal', getVal: (p: Product) => p.specs.channelCapacity },
    { label: 'Protokol / Standar', getVal: (p: Product) => p.specs.dmrTier || p.specs.pocPlatform || 'Standar Proprietary' },
    { label: 'Tingkat Proteksi (IP)', getVal: (p: Product) => p.specs.ipRating },
    { label: 'Standar Militer', getVal: (p: Product) => p.specs.militaryStandard },
    { label: 'Kapasitas Baterai', getVal: (p: Product) => p.specs.batteryCapacity },
    { label: 'Daya Tahan Baterai', getVal: (p: Product) => p.specs.batteryLife },
    { label: 'Daya Speaker Audio', getVal: (p: Product) => p.specs.speakerOutput },
    { label: 'Peredam Kebisingan', getVal: (p: Product) => p.specs.noiseSuppression },
    { label: 'Sistem Operasi / Chip', getVal: (p: Product) => p.specs.operatingSystem || p.specs.vocoder || 'Digital Hardware' },
    { label: 'Navigasi / GPS', getVal: (p: Product) => p.specs.satelliteGps },
    { label: 'Standar Enkripsi', getVal: (p: Product) => p.specs.encryption || 'Standar Dasar' },
    { label: 'Fitur Keselamatan', getVal: (p: Product) => p.specs.emergencyFeatures.join(', ') },
    { label: 'Dimensi & Berat', getVal: (p: Product) => `${p.specs.dimensions} · ${p.specs.weight}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl my-8 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Matriks Komparasi Spesifikasi Radio</h2>
              <span className="text-xs text-slate-400">
                Membandingkan {comparedProducts.length} perangkat (Maksimal 3)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {comparedProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Scale className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">Belum ada perangkat yang dipilih untuk dibandingkan</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Klik ikon timbangan pada kartu produk di katalog untuk menambahkan perangkat ke dalam perbandingan ini.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors inline-block mt-2"
              >
                Buka Katalog Produk
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 w-48 text-slate-400 font-mono text-[11px] uppercase bg-slate-950/40">
                      Parameter Teknis
                    </th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="p-3 min-w-[220px] bg-slate-950/60 align-top">
                        <div className="space-y-2">
                          <div className="relative aspect-4/3 bg-slate-900 rounded p-2 overflow-hidden flex items-center justify-center">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="max-h-24 object-contain"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => toggleCompare(p.id)}
                              className="absolute top-1 right-1 p-1 bg-slate-950/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                              title="Hapus dari perbandingan"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold">{p.modelCode}</span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                          </div>
                          <button
                            onClick={() => {
                              onClose();
                              onOpenRfq(p);
                            }}
                            className="w-full py-1 text-[11px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                          >
                            Minta RFQ
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-medium text-slate-400 bg-slate-950/20">{row.label}</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3 font-mono text-white align-top">
                          {row.getVal(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
