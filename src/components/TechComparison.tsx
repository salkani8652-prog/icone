import React, { useState } from 'react';
import { Wifi, Radio, CheckCircle2, ChevronRight, Zap, Globe, Shield, Activity } from 'lucide-react';

interface TechComparisonProps {
  onSelectCategory: (category: 'poc' | 'dmr') => void;
}

export const TechComparison: React.FC<TechComparisonProps> = ({ onSelectCategory }) => {
  const [selectedSector, setSelectedSector] = useState<'mining' | 'fleet' | 'security' | 'emergency'>('mining');

  const sectorRecommendations = {
    mining: {
      title: 'Pertambangan & Remote Sites',
      recommendation: 'Hybrid DMR + PoC',
      primaryChoice: 'dmr' as const,
      description: 'Di pit tambang terbuka atau terowongan underground tanpa sinyal operator, radio DMR dengan repeater IP Multi-Site adalah wajib untuk keselamatan jiwa (Mission-Critical). PoC digunakan di kantor perwakilan kota untuk memantau dispatch.',
      keySpec: 'DMR Tier II/III, IP68, Man Down, Intrinsically Safe'
    },
    fleet: {
      title: 'Armada Logistik & Transportasi',
      recommendation: 'Radio PoC (Push-to-Talk over Cellular)',
      primaryChoice: 'poc' as const,
      description: 'Truk antar-kota dan kurir logistik membutuhkan jangkauan antar-provinsi tanpa membangun repeater sendiri. Radio PoC 4G LTE dengan GPS tracking dan tombol PTT instan adalah solusi paling hemat biaya dan efisien.',
      keySpec: '4G LTE Dual SIM, GPS Tracking, Voice Announce, Unlimited Range'
    },
    security: {
      title: 'Pengamanan Kawasan Industri & Gedung',
      recommendation: 'DMR Konvensional atau PoC Wi-Fi',
      primaryChoice: 'dmr' as const,
      description: 'Di kawasan pabrik seluas 50-200 hektar atau gedung pencakar langit, DMR Tier II memberikan respons instan tanpa lag dan audio jernih tembus bising mesin. Di hotel berbintang, PoC via Wi-Fi internal gedung sangat populer.',
      keySpec: 'Enkripsi Suara, Tombol Darurat SOS, Dual Slot TDMA'
    },
    emergency: {
      title: 'Search & Rescue (SAR) & Tanggap Bencana',
      recommendation: 'Radio DMR Murni (RF Dedicated)',
      primaryChoice: 'dmr' as const,
      description: 'Ketika bencana alam merobohkan menara BTS seluler dan memutus listrik, jaringan seluler lumpuh. Radio DMR tetap berfungsi 100% secara direct mode point-to-point tanpa infrastruktur apapun.',
      keySpec: 'Output RF 5W, Baterai Cadangan, MIL-STD-810G, AES-256'
    }
  };

  const comparisonRows = [
    {
      parameter: 'Jangkauan Komunikasi',
      poc: 'Nasional & Global (Selama ada sinyal 4G LTE / Wi-Fi)',
      dmr: 'Line-of-Sight RF (3 - 15 km direct, hingga puluhan km via Repeater)',
      winner: 'poc'
    },
    {
      parameter: 'Ketergantungan Infrastruktur',
      poc: 'Bergantung pada tower BTS operator seluler / ISP Wi-Fi',
      dmr: '100% Independen (Dapat beroperasi direct tanpa tower)',
      winner: 'dmr'
    },
    {
      parameter: 'Izin Frekuensi Kominfo (ISR)',
      poc: 'Bebas izin spektrum (Menggunakan frekuensi operator publik)',
      dmr: 'Memerlukan alokasi ISR Kominfo untuk frekuensi private',
      winner: 'poc'
    },
    {
      parameter: 'Biaya Operasional Rutin',
      poc: 'Biaya paket data SIM Card bulanan & Server Cloud PTT',
      dmr: 'Bebas biaya bulanan (Capex 1 kali beli milik sendiri)',
      winner: 'dmr'
    },
    {
      parameter: 'Latensi Respon PTT',
      poc: 'Sangat cepat (~300 - 500 ms melalui packet data)',
      dmr: 'Instan seketika (< 100 ms kecepatan transmisi gelombang radio RF)',
      winner: 'dmr'
    },
    {
      parameter: 'Fitur Multimedia & Dispatch',
      poc: 'Video streaming live, GPS real-time akurat, foto inspeksi',
      dmr: 'Suara jernih AMBE+2, telemetry, GPS koordinat, SMS singkat',
      winner: 'poc'
    },
    {
      parameter: 'Keamanan Percakapan',
      poc: 'Enkripsi data TLS/SSL cloud server 256-bit',
      dmr: 'Enkripsi hardware internal AES-256 / ARC4 tingkat militer',
      winner: 'equal'
    }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title & Editorial */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-mono text-amber-500 uppercase tracking-widest">
          PANDUAN TEKNOLOGI & ARSITEKTUR JARINGAN
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Memahami Perbedaan Mendasar Radio PoC vs Radio DMR
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Kedua teknologi memiliki keunggulan spesifik. Pilih arsitektur yang paling tepat sesuai dengan kondisi medan geografis dan regulasi operasi Anda.
        </p>
      </div>

      {/* Two Column Feature Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PoC Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Wifi className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded">
              PUSH-TO-TALK OVER CELLULAR
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Radio PoC (Cellular PTT)</h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Memanfaatkan jaringan 4G/LTE dan Wi-Fi publik atau privat. Mengubah smartphone rugged menjadi walkie-talkie berjangkauan tanpa batas antar-kota dengan layar sentuh dan video call.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Jangkauan tak terbatas dari Sabang sampai Merauke tanpa bangun repeater</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Dukungan GPS Live Tracking dan integrasi Dispatcher Software terpusat</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>Bebas pengurusan izin alokasi frekuensi radio tahunan (ISR)</span>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('poc')}
            className="w-full mt-4 py-2 text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Katalog Produk Radio PoC</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* DMR Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded">
              DIGITAL MOBILE RADIO (ETSI)
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Radio DMR (Digital RF)</h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Memancarkan gelombang radio frekuensi VHF/UHF secara mandiri. Standar global ETSI dengan teknologi TDMA 2-slot dan enkripsi militer AES-256 yang tetap bekerja saat sinyal seluler mati total.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>100% Mandiri tanpa ketergantungan sinyal operator seluler (Zero Network Downtime)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Latensi PTT instan &lt;100ms dengan vocoder AMBE+2 peredam bising berat</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Bebas biaya langganan paket data bulanan (Aset permanen sekali beli)</span>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('dmr')}
            className="w-full mt-4 py-2 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Katalog Produk Radio DMR</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Sector Recommendation Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-amber-400 tracking-wider">KONSULTAN PEMILIHAN SISTEM</span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Rekomendasi Berdasarkan Sektor Operasional Anda
          </h3>
        </div>

        {/* Sector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['mining', 'fleet', 'security', 'emergency'] as const).map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`px-3 py-2 text-xs font-medium rounded transition-colors text-left border ${
                selectedSector === sector
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sectorRecommendations[sector].title}
            </button>
          ))}
        </div>

        {/* Selected Sector Panel */}
        <div className="bg-slate-950 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-white">
              Rekomendasi Sistem: <span className="text-amber-400">{sectorRecommendations[selectedSector].recommendation}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Kriteria Utama: {sectorRecommendations[selectedSector].keySpec}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {sectorRecommendations[selectedSector].description}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onSelectCategory(sectorRecommendations[selectedSector].primaryChoice)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Lihat Produk Rekomendasi untuk {sectorRecommendations[selectedSector].title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Spec Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Matriks Perbandingan Teknis Detail
          </h3>
          <span className="text-xs font-mono text-slate-400">Parameter Komparatif</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 sm:px-6 font-semibold">Parameter Evaluasi</th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-sky-400">Radio PoC (Cellular PTT)</th>
                <th className="py-3 px-4 sm:px-6 font-semibold text-amber-400">Radio DMR (Digital RF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-medium text-white">{row.parameter}</td>
                  <td className="py-3.5 px-4 sm:px-6 leading-relaxed">
                    <span className={row.winner === 'poc' ? 'text-sky-300 font-medium' : ''}>
                      {row.poc}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 leading-relaxed">
                    <span className={row.winner === 'dmr' ? 'text-amber-300 font-medium' : ''}>
                      {row.dmr}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
