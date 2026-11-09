import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, FormFactor, TechnicalSpecs, CustomSpecItem } from '../../types/radio';
import { useProducts } from '../../context/ProductContext';
import { X, Save, Plus, Trash2, Image, Layers, Radio, Shield, Battery, Zap, Sliders } from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PRESET_IMAGES = [
  { label: 'Icone Full Lineup (Official)', url: '/assets/aistudio/WhatsApp_Image_2026-07-20_at_19.53.28_51ebda55.jpeg' },
  { label: 'PoC Smart Terminal (Touchscreen)', url: '/src/assets/images/product_poc_smart_terminal_1794197268075.jpg' },
  { label: 'DMR Tactical Handheld (Keypad)', url: '/src/assets/images/product_dmr_tactical_handheld_1794197268240.jpg' },
  { label: 'DMR Mobile Base Rig (In-Vehicle)', url: '/src/assets/images/product_dmr_mobile_base_1794197268226.jpg' },
  { label: 'PoC & DMR Hero Showcase', url: '/src/assets/images/hero_radio_poc_dmr_1794197266754.jpg' },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = useProducts();
  const [activeTab, setActiveTab] = useState<'basic' | 'highlights' | 'rf' | 'power_audio' | 'rugged' | 'security' | 'custom'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [modelCode, setModelCode] = useState('');
  const [category, setCategory] = useState<ProductCategory>('poc');
  const [formFactor, setFormFactor] = useState<FormFactor>('handheld');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [price, setPrice] = useState<number>(3500000);
  const [isPriceOnRequest, setIsPriceOnRequest] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Technical Specs State
  const [specs, setSpecs] = useState<TechnicalSpecs>({
    dimensions: '130 x 58 x 30 mm',
    weight: '280 g',
    display: '2.4" Color Display',
    keypad: 'Numeric Keypad + PTT',
    operatingSystem: 'Embedded OS',
    processor: '',
    frequencyBand: 'UHF 400-470 MHz / 4G LTE',
    rfPowerOutput: '5W / 1W',
    channelCapacity: '1024 Kanal',
    channelSpacing: '12.5 kHz',
    dmrTier: 'Tier II',
    vocoder: 'AMBE+2',
    cellularBands: 'LTE B1/B3/B5/B8/B40',
    wifi: '2.4GHz Wi-Fi',
    bluetooth: 'BT 4.2',
    satelliteGps: 'GPS / GLONASS',
    speakerOutput: '2.5W Audio',
    noiseSuppression: 'Dual-Mic Noise Cancellation',
    batteryCapacity: '4,000 mAh Li-Ion',
    batteryLife: '20 Jam (5-5-90)',
    chargingInterface: 'Type-C & Desktop Cradle',
    ipRating: 'IP68',
    militaryStandard: 'MIL-STD-810H',
    operatingTemperature: '-30°C to +60°C',
    dropResistance: '1.8 Meter ke Beton',
    atexCertified: false,
    encryption: 'AES-256 bit',
    emergencyFeatures: ['Tombol Darurat SOS', 'Man Down Alert', 'Lone Worker'],
    pocPlatform: 'RealPTT / POCSTARS',
    customSpecs: [],
  });

  const [emergencyText, setEmergencyText] = useState('');
  const [customSpecsList, setCustomSpecsList] = useState<CustomSpecItem[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setModelCode(productToEdit.modelCode);
      setCategory(productToEdit.category);
      setFormFactor(productToEdit.formFactor);
      setTagline(productToEdit.tagline);
      setDescription(productToEdit.description);
      setHighlightsText(productToEdit.highlights.join('\n'));
      setImageUrl(productToEdit.imageUrl);
      setPrice(productToEdit.price || 0);
      setIsPriceOnRequest(productToEdit.isPriceOnRequest);
      setInStock(productToEdit.inStock);
      setIsFeatured(productToEdit.isFeatured);
      setSpecs(productToEdit.specs);
      setEmergencyText(productToEdit.specs.emergencyFeatures.join(', '));
      setCustomSpecsList(productToEdit.specs.customSpecs || []);
    } else {
      // Defaults for new product
      setName('');
      setModelCode('NX-');
      setCategory('poc');
      setFormFactor('handheld');
      setTagline('');
      setDescription('');
      setHighlightsText('Koneksi instan satu tombol (PTT)\nDesain tahan banting IP68\nBaterai tahan lebih dari 20 jam');
      setImageUrl(PRESET_IMAGES[0].url);
      setPrice(3500000);
      setIsPriceOnRequest(false);
      setInStock(true);
      setIsFeatured(false);
      setEmergencyText('Tombol Darurat SOS, Man Down Sensor, Lone Worker Alert');
      setCustomSpecsList([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddCustomSpec = () => {
    setCustomSpecsList([...customSpecsList, { key: '', value: '' }]);
  };

  const handleUpdateCustomSpec = (index: number, field: 'key' | 'value', val: string) => {
    const next = [...customSpecsList];
    next[index][field] = val;
    setCustomSpecsList(next);
  };

  const handleRemoveCustomSpec = (index: number) => {
    setCustomSpecsList(customSpecsList.filter((_, i) => i !== index));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const emergencyFeatures = emergencyText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const finalSpecs: TechnicalSpecs = {
      ...specs,
      emergencyFeatures,
      customSpecs: customSpecsList.filter((item) => item.key.trim() !== ''),
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        modelCode,
        category,
        formFactor,
        tagline,
        description,
        highlights,
        imageUrl,
        price: isPriceOnRequest ? null : price,
        isPriceOnRequest,
        inStock,
        isFeatured,
        specs: finalSpecs,
      });
    } else {
      addProduct({
        name,
        modelCode,
        category,
        formFactor,
        tagline,
        description,
        highlights,
        imageUrl,
        price: isPriceOnRequest ? null : price,
        isPriceOnRequest,
        inStock,
        isFeatured,
        specs: finalSpecs,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-lg shadow-2xl my-6 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div>
            <div className="text-[10px] font-mono text-amber-400 font-bold tracking-wider">
              {productToEdit ? 'CMS EDIT PRODUK' : 'CMS PRODUK BARU'}
            </div>
            <h2 className="text-base font-bold text-white">
              {productToEdit ? `Edit Spesifikasi: ${productToEdit.name}` : 'Tambah Produk Radio Baru ke Katalog'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto shrink-0 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'basic' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Info Dasar & Foto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('highlights')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'highlights' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Deskripsi & Keunggulan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rf')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'rf' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Spek Frekuensi & RF
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('power_audio')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'power_audio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Daya & Audio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rugged')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'rugged' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            5. Ketahanan Fisik & IP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'security' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            6. Enkripsi & Darurat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'custom' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7. Spek Kustom
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="product-editor-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nama Resmi Produk <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Icone DMR-7000 Tactical Handheld Radio"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kode Model / Tipe <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NX-7000 DMR"
                    value={modelCode}
                    onChange={(e) => setModelCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kategori Radio
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="poc">Radio PoC (Push-to-Talk over Cellular)</option>
                    <option value="dmr">Radio DMR (Digital Mobile Radio ETSI)</option>
                    <option value="repeater">Base Station & Repeater</option>
                    <option value="accessory">Aksesoris & Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Bentuk Fisik (Form Factor)
                  </label>
                  <select
                    value={formFactor}
                    onChange={(e) => setFormFactor(e.target.value as FormFactor)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="handheld">Handheld / Walkie Talkie Portable</option>
                    <option value="mobile_vehicle">Rig Kendaraan / In-Vehicle Mobile</option>
                    <option value="base_repeater">Base Station Rack / Repeater</option>
                    <option value="accessory">Aksesoris Perangkat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tagline Ringkas Produk <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Radio Digital DMR Tier II/III Dual Slot TDMA dengan Enkripsi Militer AES-256"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price & Stock Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-slate-950 border border-slate-800 rounded">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Harga Satuan (IDR)
                  </label>
                  <input
                    type="number"
                    disabled={isPriceOnRequest}
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={isPriceOnRequest}
                      onChange={(e) => setIsPriceOnRequest(e.target.checked)}
                      className="rounded text-amber-500 border-slate-700"
                    />
                    <span className="text-slate-300 font-medium">Harga atas Permintaan (RFQ)</span>
                  </label>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-amber-500 border-slate-700"
                    />
                    <span className="text-slate-300 font-medium">Status: Ready Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-amber-500 border-slate-700"
                    />
                    <span className="text-amber-400 font-medium">Tampilkan di Produk Unggulan</span>
                  </label>
                </div>
              </div>

              {/* Image Selection */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">
                  Foto Produk (Pilih Preset atau Gunakan URL / File)
                </label>

                {/* Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-2 rounded border text-left flex flex-col items-center gap-2 transition-colors ${
                        imageUrl === preset.url
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-16 h-12 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-slate-300 text-center line-clamp-1">{preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom URL & Upload */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Atau masukkan URL gambar..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono text-[11px]"
                  />
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer text-xs font-medium whitespace-nowrap">
                    Upload Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESCRIPTION & HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan kegunaan, arsitektur, dan peruntukan operasional radio..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Poin Keunggulan Utama (1 Poin per Baris)
                </label>
                <textarea
                  rows={4}
                  placeholder="Jangkauan komunikasi nasional via 4G LTE&#10;Sertifikasi IP68 tahan rendam air&#10;Enkripsi AES-256 tingkat militer"
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-xs leading-relaxed"
                />
                <span className="text-[11px] text-slate-500">
                  Setiap baris baru akan ditampilkan sebagai poin centang di lembar spesifikasi.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: RF & NETWORK SPECS */}
          {activeTab === 'rf' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Rentang Frekuensi / Bandwidth <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: UHF 400-470 MHz atau 4G LTE B1/B3/B8"
                    value={specs.frequencyBand}
                    onChange={(e) => setSpecs({ ...specs, frequencyBand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Daya Pancar RF (Power Output)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: High: 5W / Low: 1W (Handheld) atau 45W (Rig)"
                    value={specs.rfPowerOutput || ''}
                    onChange={(e) => setSpecs({ ...specs, rfPowerOutput: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kapasitas Kanal / Zona
                  </label>
                  <input
                    type="text"
                    placeholder="1,024 Kanal / 64 Zona"
                    value={specs.channelCapacity}
                    onChange={(e) => setSpecs({ ...specs, channelCapacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Spasi Kanal (Channel Spacing)
                  </label>
                  <input
                    type="text"
                    placeholder="12.5 kHz / 25 kHz"
                    value={specs.channelSpacing || ''}
                    onChange={(e) => setSpecs({ ...specs, channelSpacing: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Standar Protokol DMR
                  </label>
                  <input
                    type="text"
                    placeholder="ETSI DMR Tier II & Tier III Trunking"
                    value={specs.dmrTier || ''}
                    onChange={(e) => setSpecs({ ...specs, dmrTier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Vocoder Digital
                  </label>
                  <input
                    type="text"
                    placeholder="AMBE+2™ Enhanced Digital Vocoder"
                    value={specs.vocoder || ''}
                    onChange={(e) => setSpecs({ ...specs, vocoder: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Dukungan Seluler (Bila PoC)
                  </label>
                  <input
                    type="text"
                    placeholder="4G LTE FDD/TDD, 3G WCDMA, 2G GSM"
                    value={specs.cellularBands || ''}
                    onChange={(e) => setSpecs({ ...specs, cellularBands: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Koneksi Wi-Fi & Bluetooth
                  </label>
                  <input
                    type="text"
                    placeholder="Wi-Fi Dual Band & BT 5.0 BLE"
                    value={specs.wifi || ''}
                    onChange={(e) => setSpecs({ ...specs, wifi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Navigasi Satelit GPS
                </label>
                <input
                  type="text"
                  placeholder="GPS / GLONASS / BeiDou / AGPS"
                  value={specs.satelliteGps}
                  onChange={(e) => setSpecs({ ...specs, satelliteGps: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 4: POWER & AUDIO */}
          {activeTab === 'power_audio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Kapasitas Baterai
                  </label>
                  <input
                    type="text"
                    placeholder="4,800 mAh Li-Polymer Smart Battery"
                    value={specs.batteryCapacity}
                    onChange={(e) => setSpecs({ ...specs, batteryCapacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Estimasi Waktu Operasi
                  </label>
                  <input
                    type="text"
                    placeholder="Hingga 24 Jam (Operasi Standar 5-5-90)"
                    value={specs.batteryLife}
                    onChange={(e) => setSpecs({ ...specs, batteryLife: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Antarmuka Pengisian Daya
                </label>
                <input
                  type="text"
                  placeholder="USB Type-C Fast Charging & Rapid Desktop Cradle"
                  value={specs.chargingInterface}
                  onChange={(e) => setSpecs({ ...specs, chargingInterface: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Daya Speaker Output (Akustik)
                  </label>
                  <input
                    type="text"
                    placeholder="2.5W Rated Audio (112 dB @ 30cm)"
                    value={specs.speakerOutput}
                    onChange={(e) => setSpecs({ ...specs, speakerOutput: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Peredam Kebisingan (Noise Suppression)
                  </label>
                  <input
                    type="text"
                    placeholder="Dual-Mic AI Active Noise Cancellation"
                    value={specs.noiseSuppression}
                    onChange={(e) => setSpecs({ ...specs, noiseSuppression: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RUGGEDNESS & ENVIRONMENTAL */}
          {activeTab === 'rugged' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Dimensi Fisik (P x L x T)
                  </label>
                  <input
                    type="text"
                    placeholder="128 x 56 x 34 mm"
                    value={specs.dimensions}
                    onChange={(e) => setSpecs({ ...specs, dimensions: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Berat Bersih
                  </label>
                  <input
                    type="text"
                    placeholder="310 g (termasuk baterai & antena)"
                    value={specs.weight}
                    onChange={(e) => setSpecs({ ...specs, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Layar & Tampilan Display
                  </label>
                  <input
                    type="text"
                    placeholder="1.8 Inch TFT Sunlight-Readable"
                    value={specs.display}
                    onChange={(e) => setSpecs({ ...specs, display: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Keypad & Tombol Kontrol
                  </label>
                  <input
                    type="text"
                    placeholder="Full Numeric Keypad + PTT + SOS"
                    value={specs.keypad}
                    onChange={(e) => setSpecs({ ...specs, keypad: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Tingkat Proteksi Ingress (IP Rating) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="IP68 Submersible (2m selama 2 jam)"
                    value={specs.ipRating}
                    onChange={(e) => setSpecs({ ...specs, ipRating: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Standar Militer (MIL-STD)
                  </label>
                  <input
                    type="text"
                    placeholder="MIL-STD-810H Shock, Drop & Vibration"
                    value={specs.militaryStandard}
                    onChange={(e) => setSpecs({ ...specs, militaryStandard: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Suhu Kerja Operasional
                  </label>
                  <input
                    type="text"
                    placeholder="-30°C hingga +60°C"
                    value={specs.operatingTemperature}
                    onChange={(e) => setSpecs({ ...specs, operatingTemperature: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Ketahanan Jatuh (Drop Resistance)
                  </label>
                  <input
                    type="text"
                    placeholder="Tahan jatuh 1.8 meter ke permukaan beton"
                    value={specs.dropResistance}
                    onChange={(e) => setSpecs({ ...specs, dropResistance: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & EMERGENCY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Standar Enkripsi Suara & Data
                </label>
                <input
                  type="text"
                  placeholder="AES-256 bit Hardware Level Encryption & ARC4"
                  value={specs.encryption || ''}
                  onChange={(e) => setSpecs({ ...specs, encryption: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Fitur Keselamatan Pekerja (Pisahkan dengan Koma)
                </label>
                <input
                  type="text"
                  placeholder="Tombol SOS Khusus, Man Down Sensor, Lone Worker, Priority Interrupt"
                  value={emergencyText}
                  onChange={(e) => setEmergencyText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Platform Server Kompatibel (Khusus Radio PoC)
                </label>
                <input
                  type="text"
                  placeholder="RealPTT / POCSTARS / WalkieFleet / Zello Work"
                  value={specs.pocPlatform || ''}
                  onChange={(e) => setSpecs({ ...specs, pocPlatform: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOM SPECS */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Atribut Spesifikasi Tambahan</h4>
                  <p className="text-[11px] text-slate-400">
                    Tambahkan parameter teknis khusus yang spesifik untuk model perangkat ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomSpec}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Spek</span>
                </button>
              </div>

              {customSpecsList.length === 0 ? (
                <div className="p-6 bg-slate-950 border border-slate-800 rounded text-center text-slate-500">
                  Belum ada spesifikasi kustom. Klik tombol "Tambah Baris Spek" untuk menambahkan parameter baru.
                </div>
              ) : (
                <div className="space-y-2">
                  {customSpecsList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nama Parameter (Contoh: Kamera Depan)"
                        value={item.key}
                        onChange={(e) => handleUpdateCustomSpec(idx, 'key', e.target.value)}
                        className="w-1/3 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                      />
                      <input
                        type="text"
                        placeholder="Nilai Spesifikasi (Contoh: 13 MP AF dengan Flash)"
                        value={item.value}
                        onChange={(e) => handleUpdateCustomSpec(idx, 'value', e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomSpec(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Modal Footer Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70 shrink-0">
          <span className="text-[11px] text-slate-500">
            Perubahan akan otomatis disimpan ke database lokal dan diperbarui di katalog seketika.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              form="product-editor-form"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{productToEdit ? 'Simpan Perubahan Spek' : 'Publikasikan ke Katalog'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
