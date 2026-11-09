import React from 'react';
import { Product } from '../types/radio';
import { useProducts } from '../context/ProductContext';
import { Eye, Scale, Edit3, Shield, Wifi, Radio, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onOpenRfq: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onOpenRfq,
}) => {
  const { isAdmin, setEditingProduct, comparedProductIds, toggleCompare } = useProducts();
  const isCompared = comparedProductIds.includes(product.id);

  // Format IDR currency
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'poc':
        return 'Radio PoC (LTE/Wi-Fi)';
      case 'dmr':
        return 'Radio DMR (ETSI Digital)';
      case 'repeater':
        return 'Base & Repeater';
      case 'accessory':
        return 'Aksesoris & Audio';
      default:
        return category.toUpperCase();
    }
  };

  return (
    <div className="group flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-all duration-200">
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onViewDetail(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-103 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Styled SVG fallback if image path fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback container in case image error */}
        <div className="absolute inset-0 bg-slate-950 -z-10 flex flex-col items-center justify-center p-4 text-center text-slate-500">
          <Radio className="w-10 h-10 mb-2 opacity-50" />
          <span className="text-xs font-mono">{product.modelCode}</span>
        </div>

        {/* Quick Compare Button top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product.id);
          }}
          title={isCompared ? 'Hapus dari komparasi' : 'Bandingkan produk ini'}
          className={`absolute top-3 right-3 p-2 rounded text-xs transition-colors backdrop-blur-md ${
            isCompared
              ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
              : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        {/* Quick Admin Edit Button top left if Admin is logged in */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingProduct(product);
            }}
            title="Edit spesifikasi teknis produk ini via CMS"
            className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-[11px] font-semibold rounded flex items-center gap-1 shadow-md transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Spek</span>
          </button>
        )}
      </div>

      {/* Product Info Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata Line with typographic separators (Strict zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-amber-400 font-medium">{product.modelCode}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{getCategoryLabel(product.category)}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className={product.inStock ? 'text-emerald-400' : 'text-amber-300'}>
              {product.inStock ? 'Ready Stock' : 'Inden'}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onViewDetail(product)}
            className="text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Key Specs Highlights Line */}
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Spektrum / Band:</span>
              <span className="text-slate-200 font-mono truncate max-w-[170px]" title={product.specs.frequencyBand}>
                {product.specs.frequencyBand}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Proteksi / IP Rating:</span>
              <span className="text-slate-200 font-mono">{product.specs.ipRating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Kapasitas Baterai:</span>
              <span className="text-slate-200 font-mono">{product.specs.batteryCapacity}</span>
            </div>
          </div>
        </div>

        {/* Price & Actions Area */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-slate-400">Estimasi Pengadaan:</span>
            <span className="text-sm font-bold text-white font-mono tabular-nums">
              {formatPrice(product.price, product.isPriceOnRequest)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetail(product)}
              className="px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail Spek</span>
            </button>
            <button
              onClick={() => onOpenRfq(product)}
              className="px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>Minta RFQ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
