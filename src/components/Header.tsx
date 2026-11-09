import React from 'react';
import { useProducts } from '../context/ProductContext';
import { Shield, Radio, SlidersHorizontal, LogOut, Lock } from 'lucide-react';

interface HeaderProps {
  currentView: 'catalog' | 'cms' | 'compare' | 'guide';
  setCurrentView: (view: 'catalog' | 'cms' | 'compare' | 'guide') => void;
  openLoginModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  openLoginModal,
}) => {
  const { isAdmin, logoutAdmin, comparedProductIds } = useProducts();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-2.5 text-left text-slate-100 group transition-colors"
          >
            <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:border-amber-500 transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                Icone <span className="text-amber-500">Globaltech</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1">
                Your Radio Solutions
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setCurrentView('catalog')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentView === 'catalog'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Katalog Produk
            </button>
            <button
              onClick={() => setCurrentView('guide')}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentView === 'guide'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Panduan PoC vs DMR
            </button>
            <button
              onClick={() => setCurrentView('compare')}
              className={`relative hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                currentView === 'compare'
                  ? 'border-amber-500 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-300'
              }`}
            >
              Komparasi Spesifikasi
              {comparedProductIds.length > 0 && (
                <span className="ml-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded">
                  {comparedProductIds.length}
                </span>
              )}
            </button>
            {isAdmin && (
              <button
                onClick={() => setCurrentView('cms')}
                className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
                  currentView === 'cms'
                    ? 'border-amber-500 text-amber-400 font-semibold'
                    : 'border-transparent text-slate-300'
                }`}
              >
                Manajemen CMS
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView(currentView === 'cms' ? 'catalog' : 'cms')}
                  className="px-3.5 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{currentView === 'cms' ? 'Katalog Publik' : 'Dashboard CMS'}</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Keluar dari Admin Mode"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Login Admin CMS</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
