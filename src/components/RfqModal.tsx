import React, { useState } from 'react';
import { Product, RfqRequest } from '../types/radio';
import { X, Send, MessageSquare, CheckCircle, Radio } from 'lucide-react';

interface RfqModalProps {
  product: Product | null;
  onClose: () => void;
}

export const RfqModal: React.FC<RfqModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState<RfqRequest>({
    productId: product?.id,
    productName: product ? `${product.name} (${product.modelCode})` : 'Paket Sistem Radio Komunikasi',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    quantity: 10,
    notes: '',
    urgency: 'normal',
  });

  const [accessories, setAccessories] = useState<string[]>([
    'Baterai Cadangan Ekstra',
    'Rapid Desktop Charger',
  ]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!product) return null;

  const toggleAccessory = (item: string) => {
    if (accessories.includes(item)) {
      setAccessories(accessories.filter((a) => a !== item));
    } else {
      setAccessories([...accessories, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `*PERMINTAAN PENAWARAN RESMI (RFQ) - ICONE GLOBALTECH*\n\n` +
      `*Produk:* ${product.name} [${product.modelCode}]\n` +
      `*Kategori:* ${product.category.toUpperCase()}\n` +
      `*Jumlah Kebutuhan:* ${formData.quantity} Unit\n` +
      `*Instansi / Perusahaan:* ${formData.companyName}\n` +
      `*PIC Kontak:* ${formData.contactPerson} (${formData.phone})\n` +
      `*Email:* ${formData.email}\n` +
      `*Aksesori Tambahan:* ${accessories.join(', ') || 'Standar Bawaan Box'}\n` +
      `*Catatan Proyek:* ${formData.notes || '-'}\n\n` +
      `Mohon kirimkan surat penawaran harga resmi (SPH) beserta brosur teknis.`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl my-8 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-base font-bold text-white">Minta Penawaran Resmi (RFQ)</h2>
            <span className="text-xs text-slate-400">
              Procurement & Tender Radio Komunikasi Standar Industri
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Permintaan Penawaran Berhasil Dibuat</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Terima kasih <strong>{formData.contactPerson}</strong> dari <strong>{formData.companyName}</strong>. Tim sales & technical engineer kami akan mengirimkan proposal teknis dan SPH ke email <strong>{formData.email}</strong> dalam kurun waktu 1x24 jam.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Langsung via WhatsApp Sales</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Product Info Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded p-3 flex items-center gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-contain bg-slate-900 rounded p-1"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{product.modelCode}</span>
                  <div className="font-bold text-white text-xs">{product.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {product.specs.frequencyBand} · {product.specs.ipRating}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nama Perusahaan / Instansi <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PT. Mineral Perkasa Sejahtera"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nama Kontak Person (PIC) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Budi Santoso (Head of IT/Telecom)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    No. WhatsApp / HP <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-XXXX-XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Email Resmi Perusahaan <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@perusahaan.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Perkiraan Jumlah Unit <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Accessories Checkboxes */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Paket Aksesori & Layanan Tambahan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {[
                    'Baterai Cadangan Ekstra',
                    'Multi-Unit Multi-Bay Rapid Charger (6 Unit)',
                    'Heavy-Duty Speaker Fist Mic (IP67)',
                    'Surveillance Earpiece Akustik Transparan',
                    'Jasa Pemrograman Frekuensi & Enkripsi AES',
                    'Lisensi Dispatcher Software Server',
                  ].map((acc) => (
                    <label key={acc} className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded cursor-pointer hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={accessories.includes(acc)}
                        onChange={() => toggleAccessory(acc)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>{acc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Catatan Kebutuhan Khusus / Wilayah Proyek
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Kebutuhan untuk site tambang di Kalimantan Timur, perlu uji jangkauan sinyal dan izin ISR Kominfo..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 rounded font-semibold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ajukan Penawaran</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
