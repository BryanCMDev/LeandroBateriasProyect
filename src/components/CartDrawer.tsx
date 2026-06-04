import { X, Plus, Minus, Trash, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  setView: (view: 'catalog' | 'checkout' | 'admin' | 'login') => void;
  lang: 'ES' | 'EN';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  updateQuantity,
  removeFromCart,
  setView,
  lang,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalSum = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    onClose();
    setView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <h2 className="text-md font-sans font-bold flex items-center gap-2 text-slate-100">
              <ShoppingBag size={18} className="text-blue-400" />
              <span>{lang === 'ES' ? 'Carrito de Compras' : 'Your Shopping Cart'}</span>
            </h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 gap-4">
                <div className="p-4 rounded-full bg-slate-800 text-slate-500">
                  <ShoppingBag size={48} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">{lang === 'ES' ? 'Tu carrito está vacío' : 'Your cart is empty'}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                    {lang === 'ES' 
                      ? 'Navega por nuestro catálogo y agrega las mejores baterías.' 
                      : 'Explore our catalog and add the best power batteries.'}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                >
                  {lang === 'ES' ? 'Volver al Catálogo' : 'Browse Catalog'}
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800"
                >
                  {/* Thumbnail Image */}
                  <div className="w-16 h-16 rounded bg-slate-900 flex-shrink-0 overflow-hidden relative flex items-center justify-center border border-slate-850">
                    <img 
                      alt={item.product.title} 
                      className="w-12 h-12 object-contain" 
                      src={item.product.imageUrl}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Description */}
                  <div className="flex-grow">
                    <h3 className="font-sans font-bold text-xs text-slate-100 line-clamp-1">
                      {item.product.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      SKU: {item.product.sku}
                    </p>
                    <div className="flex justify-between items-center mt-1.5">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-slate-800 bg-slate-900 px-2 py-0.5 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="text-slate-400 hover:text-slate-100 p-0.5 transition-colors cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-200 min-w-[12px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="text-slate-400 hover:text-slate-100 p-0.5 transition-colors cursor-pointer"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <span className="text-xs font-bold font-sans text-blue-400 block">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono block">
                          S/ {item.product.price.toFixed(2)} c/u
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove CTA */}
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-md hover:bg-slate-900 transition-colors cursor-pointer"
                    title={lang === 'ES' ? 'Eliminar del carrito' : 'Remove from cart'}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Summary & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-800 p-6 bg-slate-950 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Subtotal ({cartItems.length} {lang === 'ES' ? 'items' : 'items'})</span>
                  <span className="font-mono text-slate-200">S/ {(totalSum / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>IGV (18%)</span>
                  <span className="font-mono text-slate-200">S/ {(totalSum - totalSum / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-md font-bold text-slate-100 pt-2 border-t border-slate-900">
                  <span>{lang === 'ES' ? 'Total Estimado' : 'Estimated Total'}</span>
                  <span className="font-sans text-blue-400 text-lg">S/ {totalSum.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-sm py-3.5 rounded-lg border border-blue-500 shadow-lg shadow-blue-950/40 hover:scale-[1.01] transition-all cursor-pointer transform active:scale-95"
              >
                <span>{lang === 'ES' ? 'IR AL CHECKOUT SEGURO' : 'PROCEED TO CHECKOUT'}</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-[10px] text-slate-400 leading-snug">
                🚨 {lang === 'ES' 
                  ? 'Delivery e instalación incluidos en el precio para Lima Metropolitana.' 
                  : 'Free delivery and setup included for Metro Lima area.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
