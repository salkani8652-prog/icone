import React, { useState } from 'react';
import { Product } from '../types/radio';
import { useProducts } from '../context/ProductContext';
import {
  X,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  Radio,
  Wifi,
  Battery,
  Layers,
  Edit3,
  Check,
  Printer,
  Scale,
  Volume2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenRfq: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenRfq,
}) => {
  const { isAdmin, setEditingProduct, comparedProductIds, toggleCompare } = useProducts();
  const [activeTab, setActiveTab] = useState<'all' | 'rf' | 'audio_power' | 'rugged' | 'security'>('all');

  if (!product) return null;

  const isCompared = comparedProductIds.includes(product.id);

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

  const handlePrintSpecSheet = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl my-8 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              {product.modelCode}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              LEMBAR SPESIFIKASI TEKNIS RESMI
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onClose();
                  setEditingProduct(product);
                }}
                className="px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded flex items-center gap-1.5 transition-colors border border-amber-500/30"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit di CMS</span>
              </button>
            )}
            <button
              onClick={handlePrintSpecSheet}
              title="Cetak lembar spesifikasi teknis"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 print:max-h-none print:overflow-visible">
          {/* Top Overview Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full max-h-72 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-400">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{product.specs.ipRating}</span>
                <span aria-hidden="true">·</span>
                <span>{product.specs.militaryStandard}</span>
              </div>
            </div>

            {/* Right: Primary Info & Highlights */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-amber-400 font-mono uppercase tracking-wider">
                  KATEGORI: {product.category.toUpperCase()} ({product.formFactor.replace('_', ' ').toUpperCase()})
                </div>
                <h2 className="text-2xl font-extrabold text-white">{product.name}</h2>
                <p className="text-xs text-slate-300 italic">{product.tagline}</p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Highlights */}
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-semibold text-white">Keunggulan Perangkat:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-400">Harga Satuan / Proyek:</div>
                  <div className="text-lg font-bold text-white font-mono tabular-nums">
                    {formatPrice(product.price, product.isPriceOnRequest)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                      isCompared
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Dalam Komparasi' : 'Bandingkan'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenRfq(product);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm"
                  >
                    Minta Penawaran (RFQ)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specification Section with Category Tabs */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Matriks Spesifikasi Teknis Terperinci
              </h3>
              <div className="flex items-center gap-1">
                {(['all', 'rf', 'audio_power', 'rugged', 'security'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      activeTab === tab
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab === 'all' && 'Semua'}
                    {tab === 'rf' && 'RF & Jaringan'}
                    {tab === 'audio_power' && 'Daya & Audio'}
                    {tab === 'rugged' && 'Fisik & Rugged'}
                    {tab === 'security' && 'Protokol & Fitur'}
                  </button>
                ))}
              </div>
            </div>

            {/* Spec Tables */}
            <div className="space-y-4">
              {/* Group 1: General & Dimension */}
              {(activeTab === 'all' || activeTab === 'rugged') && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold">
                    SPESIFIKASI UMUM & DIMENSI FISIK
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Dimensi (P x L x T)</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.dimensions}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Berat Bersih</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.weight}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Layar & Tampilan</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.display}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Keypad & Tombol Kontrol</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.keypad}</dd>
                    </div>
                    {product.specs.operatingSystem && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Sistem Operasi</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.operatingSystem}</dd>
                      </div>
                    )}
                    {product.specs.processor && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Prosesor & Memori</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.processor}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Group 2: RF & Network */}
              {(activeTab === 'all' || activeTab === 'rf') && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>SPESIFIKASI FREKUENSI & KONEKTIVITAS JARINGAN</span>
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Rentang Frekuensi / Band</dt>
                      <dd className="col-span-2 text-amber-300 font-mono font-medium">{product.specs.frequencyBand}</dd>
                    </div>
                    {product.specs.rfPowerOutput && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Daya Pancar RF (Power Output)</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.rfPowerOutput}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Kapasitas Kanal / Zona</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.channelCapacity}</dd>
                    </div>
                    {product.specs.channelSpacing && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Spasi Kanal (Channel Spacing)</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.channelSpacing}</dd>
                      </div>
                    )}
                    {product.specs.dmrTier && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Protokol Standar DMR</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.dmrTier}</dd>
                      </div>
                    )}
                    {product.specs.vocoder && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Vocoder Suara Digital</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.vocoder}</dd>
                      </div>
                    )}
                    {product.specs.cellularBands && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Modem Seluler</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.cellularBands}</dd>
                      </div>
                    )}
                    {product.specs.wifi && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Konektivitas Wi-Fi</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.wifi}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Navigasi Satelit GPS</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.satelliteGps}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Group 3: Audio & Battery */}
              {(activeTab === 'all' || activeTab === 'audio_power') && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                    <Battery className="w-3.5 h-3.5 text-amber-400" />
                    <span>AKUSTIK AUDIO & SISTEM MANAJEMEN DAYA</span>
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Daya Speaker Akustik</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.speakerOutput}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Peredam Bising (Noise Suppression)</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.noiseSuppression}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Kapasitas Baterai</dt>
                      <dd className="col-span-2 text-white font-mono font-medium text-amber-400">{product.specs.batteryCapacity}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Estimasi Waktu Operasi</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.batteryLife}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Antarmuka Pengisian Daya</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.chargingInterface}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Group 4: Ruggedness */}
              {(activeTab === 'all' || activeTab === 'rugged') && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>KETAHANAN LINGKUNGAN & STANDAR KEKUATAN FISIK</span>
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Tingkat Proteksi Ingress</dt>
                      <dd className="col-span-2 text-emerald-400 font-mono font-bold">{product.specs.ipRating}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Standar Militer</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.militaryStandard}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Suhu Kerja Operasional</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.operatingTemperature}</dd>
                    </div>
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Ketahanan Jatuh (Drop Test)</dt>
                      <dd className="col-span-2 text-white font-mono">{product.specs.dropResistance}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Group 5: Security & Emergency */}
              {(activeTab === 'all' || activeTab === 'security') && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>KEAMANAN ENKRIPSI & FITUR KESELAMATAN DARURAT</span>
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    {product.specs.encryption && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Standar Enkripsi Suara</dt>
                        <dd className="col-span-2 text-amber-400 font-mono font-bold">{product.specs.encryption}</dd>
                      </div>
                    )}
                    <div className="grid grid-cols-3 px-4 py-2.5">
                      <dt className="text-slate-400 font-medium">Fitur Perlindungan Pekerja</dt>
                      <dd className="col-span-2 text-white space-y-1">
                        {product.specs.emergencyFeatures.map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                    {product.specs.pocPlatform && (
                      <div className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">Platform Server Kompatibel</dt>
                        <dd className="col-span-2 text-white font-mono">{product.specs.pocPlatform}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Custom Specs if defined */}
              {product.specs.customSpecs && product.specs.customSpecs.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 rounded overflow-hidden">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400 font-semibold">
                    SPESIFIKASI TAMBAHAN PABRIKAN
                  </div>
                  <dl className="divide-y divide-slate-800/60 text-xs">
                    {product.specs.customSpecs.map((item, i) => (
                      <div key={i} className="grid grid-cols-3 px-4 py-2.5">
                        <dt className="text-slate-400 font-medium">{item.key}</dt>
                        <dd className="col-span-2 text-white font-mono">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
