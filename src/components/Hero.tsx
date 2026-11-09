import React from 'react';
import { ArrowRight, ShieldCheck, Radio, Wifi, Zap } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenGuide: () => void;
  onOpenRfq: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onOpenGuide,
  onOpenRfq,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800 text-slate-100">
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.08),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wider">
              <span>STANDAR TELEKOMUNIKASI INDUSTRI</span>
              <span aria-hidden="true">·</span>
              <span>ETSI DMR TIER II & III</span>
              <span aria-hidden="true">·</span>
              <span>4G LTE PTT OVER CELLULAR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Infrastruktur Radio PoC & DMR untuk Komunikasi Kritis Tanpa Kompromi
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Solusi komunikasi terintegrasi untuk sektor pertambangan, minyak & gas, logistik armada, dan pengamanan objek vital. Menghubungkan jaringan seluler tak terbatas (PoC) dan radio frekuensi independen terenkripsi (DMR).
            </p>

            {/* Key feature proof points (zero-pill text with separators) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300 pt-1 pb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                IP68 Submersible & MIL-STD-810H
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-amber-400" />
                Enkripsi Militer AES-256
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Wifi className="w-4 h-4 text-amber-400" />
                Dispatch Console Ready
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <span>Lihat Katalog Produk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenGuide}
                className="px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors whitespace-nowrap"
              >
                Perbedaan PoC vs DMR
              </button>
              <button
                onClick={onOpenRfq}
                className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors whitespace-nowrap"
              >
                Minta Penawaran Resmi (RFQ) →
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_radio_poc_dmr_1794197266754.jpg"
                alt="Radio PoC dan DMR Profesional Icone Globaltech"
                className="w-full h-auto object-cover aspect-16/9 lg:aspect-4/3 transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200 font-mono">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  DMR TACTICAL + POC SMART
                </span>
                <span className="text-slate-400">READY FOR DEPLOYMENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
