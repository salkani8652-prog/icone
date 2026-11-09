import React from 'react';
import { Radio, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenGuide: () => void;
  onOpenCompare: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenGuide,
  onOpenCompare,
  onOpenLogin,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Icone <span className="text-amber-500">Globaltech</span>
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Distributor resmi & perakitan sistem komunikasi radio PoC (Push-to-Talk over Cellular) dan Digital Mobile Radio (DMR) untuk sektor industri berat, pertambangan, dan keamanan di Indonesia.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Sertifikasi Postel & Kominfo</span>
            </div>
          </div>

          {/* Links: Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Kategori Perangkat
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory('poc')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Radio PoC 4G LTE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('dmr')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Radio DMR Digital Tier II & III
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('repeater')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Base Station & Repeater IP Multi-Site
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessory')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Aksesoris Audio & Baterai
                </button>
              </li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Layanan & Panduan
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={onOpenGuide}
                  className="hover:text-amber-400 transition-colors"
                >
                  Panduan Pemilihan PoC vs DMR
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompare}
                  className="hover:text-amber-400 transition-colors"
                >
                  Matriks Perbandingan Spesifikasi
                </button>
              </li>
              <li>
                <a
                  href="#katalog-produk"
                  className="hover:text-amber-400 transition-colors"
                >
                  Pengajuan Penawaran Resmi (RFQ)
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="text-amber-400/80 hover:text-amber-400 transition-colors"
                >
                  Login Admin Portal CMS
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Office */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Pusat Layanan Teknis
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Kawasan Telekomunikasi & Industri Terpadu, Jakarta / Balikpapan Hub, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+62 21-8899-7700 / +62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>sales@icone-globaltech.co.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Icone Globaltech Systems. Seluruh hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Standar ETSI DMR</span>
            <span>·</span>
            <span>3GPP LTE PTT</span>
            <span>·</span>
            <span>Sistem CMS Berkelanjutan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
