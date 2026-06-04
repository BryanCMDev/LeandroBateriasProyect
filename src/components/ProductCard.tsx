import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key | string;
  product: Product;
  addToCart: (product: Product) => void;
  lang: 'ES' | 'EN';
}

export default function ProductCard({ product, addToCart, lang }: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <article className="bg-[#171f33] dark:bg-[#171f33] border border-[#2d3449] dark:border-[#2d3449] rounded-xl overflow-hidden flex flex-col glow-hover transition-all duration-300">
      {/* Battery Image Section */}
      <div className="h-52 w-full bg-white relative flex items-center justify-center p-4 border-b border-slate-200 dark:border-slate-800">
        {/* State Badge */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 bg-red-100 border border-red-200 text-red-700 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {lang === 'ES' ? 'AGOTADO' : 'OUT OF STOCK'}
          </span>
        ) : isLowStock ? (
          <span className="absolute top-2 left-2 bg-amber-100 border border-amber-200 text-amber-700 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {lang === 'ES' ? 'ÚLTIMAS UNIDADES' : 'LOW STOCK'}
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-emerald-100 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm">
            {lang === 'ES' ? 'EN STOCK' : 'IN STOCK'}
          </span>
        )}

        {/* Brand Tag in Corner */}
        {product.amperage && (
          <span className="absolute top-2 right-2 bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[10px] shadow-sm">
            {product.amperage}
          </span>
        )}

        {/* Large Product Image */}
        <img 
          className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-300 hover:scale-110" 
          alt={product.title} 
          src={product.imageUrl}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Information Section */}
      <div className="p-5 flex flex-col flex-grow bg-white dark:bg-slate-900">
        {/* SKU Label */}
        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 tracking-wide mb-1 uppercase select-all">
          SKU: {product.sku}
        </span>

        {/* Product Title */}
        <h2 className="font-sans font-bold text-lg leading-snug tracking-tight text-slate-900 dark:text-white line-clamp-2 min-h-[3.5rem] mb-3">
          {product.title}
        </h2>

        {/* Technical Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {product.brand}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {product.voltage}
          </span>
          {product.stock > 0 && (
            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              Stock: {product.stock}
            </span>
          )}
        </div>

        {/* Pricing and Action Row */}
        <div className="mt-auto flex justify-between items-end pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-sans text-blue-600 dark:text-blue-400 leading-none">
              S/ {product.price.toFixed(2)}
            </span>
            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
              {lang === 'ES' ? 'Inc. IGV e Instal.' : 'Inc. Vat & Inst.'}
            </span>
          </div>

          <button 
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`font-sans text-[11px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-lg border-b-2 flex items-center gap-1.5 transition-all cursor-pointer transform active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-600 text-white shadow-sm hover:shadow-md'
            }`}
          >
            <ShoppingCart size={14} />
            <span>{isOutOfStock ? (lang === 'ES' ? 'Agotado' : 'Agotado') : (lang === 'ES' ? 'Agregar' : 'Add')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
