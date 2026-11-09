import React, { useState, useMemo } from 'react';
import { Product } from '../types/radio';
import { ProductCard } from './ProductCard';
import { useProducts } from '../context/ProductContext';
import { TECHNICAL_CATEGORIES, FORM_FACTORS } from '../data/defaultProducts';
import { Search, Filter, Scale, Plus, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ProductCatalogProps {
  onViewDetail: (product: Product) => void;
  onOpenRfq: (product: Product) => void;
  onOpenCompare: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onViewDetail,
  onOpenRfq,
  onOpenCompare,
}) => {
  const { products, isAdmin, setIsCreateModalOpen, comparedProductIds, clearCompare } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'model' | 'price_asc' | 'price_desc'>('featured');

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Form factor filter
      if (selectedFormFactor !== 'all' && item.formFactor !== selectedFormFactor) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchModel = item.modelCode.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchFreq = item.specs.frequencyBand.toLowerCase().includes(q);
        const matchIp = item.specs.ipRating.toLowerCase().includes(q);
        if (!matchName && !matchModel && !matchDesc && !matchFreq && !matchIp) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      }
      if (sortBy === 'model') {
        return a.modelCode.localeCompare(b.modelCode);
      }
      if (sortBy === 'price_asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0;
    });
  }, [products, selectedCategory, selectedFormFactor, searchQuery, sortBy]);

  return (
    <div id="katalog-produk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header with Title & Admin Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-1">
            KATALOG RESMI PERANGKAT KOMUNIKASI
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Radio PoC, Radio DMR & Sistem Repeater
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Menampilkan {filteredProducts.length} perangkat berstandar industri dengan spesifikasi teknis lengkap.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru ke Katalog</span>
          </button>
        )}
      </div>

      {/* Filter Bar: Category Tabs & Search Box */}
      <div className="space-y-4">
        {/* Category Segmented Tabs (§1.A functional interactive filter controls) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {TECHNICAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Search + FormFactor + Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari model, frekuensi (UHF/VHF/LTE), IP rating..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Form Factor Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedFormFactor}
              onChange={(e) => setSelectedFormFactor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              {FORM_FACTORS.map((ff) => (
                <option key={ff.id} value={ff.id} className="bg-slate-900 text-slate-200">
                  {ff.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="featured" className="bg-slate-900 text-slate-200">Urutan: Produk Unggulan</option>
              <option value="model" className="bg-slate-900 text-slate-200">Urutan: Kode Model (A-Z)</option>
              <option value="price_asc" className="bg-slate-900 text-slate-200">Urutan: Harga Terendah</option>
              <option value="price_desc" className="bg-slate-900 text-slate-200">Urutan: Harga Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid (§2.A 3-column desktop grid with generous gap) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewDetail}
              onOpenRfq={onOpenRfq}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-12 text-center space-y-4">
          <Filter className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Tidak ada produk yang cocok</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tidak ditemukan perangkat radio dengan kriteria pencarian "{searchQuery}" atau filter kategori yang dipilih.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedFormFactor('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded hover:bg-amber-500/20 transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      )}

      {/* Floating Sticky Comparison Bar if 1 or more items selected */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-950/95 border border-amber-500/40 rounded-lg shadow-2xl px-5 py-3 flex items-center gap-4 text-xs text-white backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">{comparedProductIds.length} Perangkat</span>
            <span className="text-slate-400">siap dibandingkan spesifikasinya</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompare}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors whitespace-nowrap"
            >
              Buka Matriks Komparasi
            </button>
            <button
              onClick={clearCompare}
              className="text-slate-400 hover:text-white px-2 py-1 text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
