import React, { useState } from 'react';
import { 
  ArrowLeft, Receipt, CreditCard, CheckCircle, 
  Lock, FileText, Download, Printer, ShoppingBag, 
  Sparkles, Check, Wallet 
} from 'lucide-react';
import { Product, CartItem, ReceiptType, PaymentMethod, BillingInfo, Order } from '../types';

interface CheckoutViewProps {
  cartItems: CartItem[];
  setView: (view: 'catalog' | 'checkout' | 'admin' | 'login') => void;
  lang: 'ES' | 'EN';
  clearCart: () => void;
  addNewOrder: (order: Order) => void;
}

export default function CheckoutView({
  cartItems,
  setView,
  lang,
  clearCart,
  addNewOrder,
}: CheckoutViewProps) {
  // Billing States
  const [receiptType, setReceiptType] = useState<ReceiptType>('boleta');
  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [fullName, setFullName] = useState('Juan Pérez');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('correo@ejemplo.com');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UI Flow States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Auto service item
  const installationPrice = 45.00;

  // Compute Prices
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = cartSubtotal + (cartItems.length > 0 ? installationPrice : 0);
  const taxBase = total / 1.18;
  const igvTax = total - taxBase;

  const handleReceiptTypeChange = (type: ReceiptType) => {
    setReceiptType(type);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert(lang === 'ES' ? 'Su carrito está vacío' : 'Your cart is empty');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(lang === 'ES' ? 'Validando datos de facturación...' : 'Validating billing details...');

    setTimeout(() => {
      setProcessingStep(lang === 'ES' ? 'Conectando con la pasarela de pago seguro...' : 'Connecting to secure payment gateway...');
      
      setTimeout(() => {
        setProcessingStep(lang === 'ES' ? 'Procesando cargo...' : 'Processing charge...');
        
        setTimeout(() => {
          setProcessingStep(lang === 'ES' ? 'Generando PDF del comprobante electrónico...' : 'Generating electronic invoice PDF...');
          
          setTimeout(() => {
            const orderId = `LB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
            const newOrder: Order = {
              id: orderId,
              date: new Date().toISOString().split('T')[0],
              customerName: fullName,
              documentId: receiptType === 'factura' ? ruc : documentId,
              receiptType,
              email,
              phoneNumber,
              items: [...cartItems],
              paymentMethod,
              total,
              status: 'Pendiente',
            };

            // Propagate order up to persist in administrative state
            addNewOrder(newOrder);
            setLastCreatedOrder(newOrder);

            setIsProcessing(false);
            setShowInvoiceModal(true);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleCloseSuccess = () => {
    setShowInvoiceModal(false);
    clearCart();
    setView('catalog');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 py-8 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      
      {/* Transactional Back Nav Bar */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-850">
        <button 
          onClick={() => setView('catalog')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ES' ? 'Volver al Catálogo' : 'Back to Catalog'}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Lock size={12} className="text-emerald-500" />
          <span className="font-sans font-medium">{lang === 'ES' ? 'Checkout encriptado SSL' : 'SSL Encrypted Checkout'}</span>
        </div>
      </div>

      {/* Title block */}
      <div className="mb-8">
        <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">
          {lang === 'ES' ? 'Checkout Seguro' : 'Secure Checkout'}
        </h1>
        <p className="font-sans text-xs md:text-sm text-slate-400 mt-1">
          {lang === 'ES' ? 'Complete sus datos y método de pago para finalizar el pedido.' : 'Complete your billing details and select your payment method.'}
        </p>
      </div>

      {/* Master Grid Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Data Capture Form */}
        <form className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6" onSubmit={handlePaymentSubmit}>
          
          {/* Billing Details Container Card */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 transition-colors duration-200">
            <h2 className="font-sans font-bold text-md mb-5 flex items-center gap-2 text-blue-400 underline-offset-4 decoration-2">
              <Receipt size={18} />
              <span>{lang === 'ES' ? 'Datos de Facturación' : 'Billing Information'}</span>
            </h2>

            {/* Document Type Selectors */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'ES' ? 'Tipo de Comprobante' : 'Receipt Type'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['boleta', 'factura', 'ticket'] as ReceiptType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleReceiptTypeChange(type)}
                    className={`text-center py-2.5 rounded-lg border text-xs font-bold font-sans tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      receiptType === type
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-950/40'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Forms Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Additional logic if FACTURA selected */}
              {receiptType === 'factura' && (
                <>
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-400">
                      RUC <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="e.g. 20600123456"
                      value={ruc}
                      onChange={(e) => setRuc(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-400">
                      {lang === 'ES' ? 'Razón Social' : 'Business Name'} <span className="text-red-500">*</span>
                    </label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                      placeholder="e.g. Leandro Baterias S.A.C."
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400">
                  {lang === 'ES' ? 'Nombres y Apellidos' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="e.g. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400">
                  {receiptType === 'factura' 
                    ? (lang === 'ES' ? 'DNI del Representante' : 'ID Document') 
                    : (lang === 'ES' ? 'Documento de Identidad (DNI/CE)' : 'ID Document (DNI/CE)')} <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  type="text"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="e.g. 72124534"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400">
                  {lang === 'ES' ? 'Correo Electrónico' : 'Email Address'} <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  type="email"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="e.g. correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-400">
                  {lang === 'ES' ? 'Teléfono Móvil' : 'Mobile Phone'} <span className="text-red-500">*</span>
                </label>
                <input 
                  required
                  type="tel"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="e.g. 987654321"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                />
              </div>

            </div>
          </section>

          {/* Payment Method Container Card */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 transition-colors duration-200">
            <h2 className="font-sans font-bold text-md mb-5 flex items-center gap-2 text-blue-400">
              <CreditCard size={18} />
              <span>{lang === 'ES' ? 'Método de Pago' : 'Payment Method'}</span>
            </h2>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  id: 'yape',
                  label: 'Yape',
                  icon: (
                    <img 
                      alt="Yape" 
                      className="w-10 h-10 object-contain rounded-lg" 
                      src="https://upload.wikimedia.org/wikipedia/commons/0/08/Icono_de_la_aplicaci%C3%B3n_Yape.png?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original"
                    />
                  )
                },
                {
                  id: 'plin',
                  label: 'Plin',
                  icon: (
                    <img 
                      alt="Plin" 
                      className="w-10 h-10 object-contain rounded" 
                      src="https://images.seeklogo.com/logo-png/38/1/plin-logo-png_seeklogo-386806.png"
                    />
                  )
                },
                {
                  id: 'tarjeta',
                  label: lang === 'ES' ? 'Tarjeta' : 'Card',
                  icon: (
                    <img 
                      alt="Tarjeta" 
                      className="h-10 w-auto object-contain rounded" 
                      src="https://www.footloose.pe/arquivos/ids/1369498/logos-de-bancos-min.jpg"
                    />
                  )
                }
              ].map((method) => {
                const isActive = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`relative flex flex-col items-center justify-center p-4 border rounded-xl bg-slate-50 dark:bg-slate-950 transition-all h-28 cursor-pointer select-none group ${
                      isActive
                        ? 'border-blue-500 bg-slate-900/60 shadow-lg shadow-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-500'
                    }`}
                  >
                    {method.icon}
                    <span className="font-sans font-semibold text-xs text-slate-900 dark:text-white mt-2">
                      {method.label}
                    </span>
                    {isActive && (
                      <span className="absolute top-2 right-2 text-blue-500">
                        <CheckCircle size={16} className="fill-[#0b1326]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic UI details on option change */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all">
              {paymentMethod === 'tarjeta' ? (
                /* Card Input Subforum */
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    💳 {lang === 'ES' ? 'Ingrese los datos de su tarjeta de crédito o débito.' : 'Enter your credit or debit card details safely.'}
                  </p>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === 'ES' ? 'Nombre del Titular' : 'Cardholder Name'}
                      </label>
                      <input 
                        required={paymentMethod === 'tarjeta'}
                        type="text"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g. JUAN PEREZ"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === 'ES' ? 'Número de Tarjeta' : 'Card Number'}
                      </label>
                      <input 
                        required={paymentMethod === 'tarjeta'}
                        type="text"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors font-mono"
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {lang === 'ES' ? 'Vencimiento' : 'Expiry'}
                        </label>
                        <input 
                          required={paymentMethod === 'tarjeta'}
                          type="text"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors font-mono"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').slice(0, 5))}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          CVV
                        </label>
                        <input 
                          required={paymentMethod === 'tarjeta'}
                          type="password"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors font-mono"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Yape or Plin QR / Transfer instructions */
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Mock beautiful dynamic barcode */}
                  <div className="bg-white p-2.5 rounded-xl border border-dashed border-slate-300 flex-shrink-0 relative select-none">
                    <div className="w-28 h-28 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white text-[10px] font-bold rounded-lg border border-slate-700 p-2 text-center leading-tight">
                      <div>
                        <Wallet size={20} className="mx-auto text-blue-400 mb-1" />
                        <span className="block font-mono text-[9px] text-[#ffb596] mt-0.5 uppercase tracking-wide">
                          {paymentMethod} COMPRA
                        </span>
                        <div className="w-16 h-4 bg-white/20 mx-auto rounded mt-2 animate-pulse flex items-center justify-center">
                          <code className="text-[8px]">QR ACTIVO</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {lang === 'ES' 
                        ? `Pago con código QR o transferencia (${paymentMethod === 'yape' ? 'Yape' : 'Plin'})`
                        : `Pay using QR barcode or direct transfer (${paymentMethod === 'yape' ? 'Yape' : 'Plin'})`}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {lang === 'ES' ? 'Yapea o transfiere al número' : 'Transfer directly to'}
                      <strong className="text-blue-400 block text-sm font-mono tracking-wider mt-0.5">
                        987 654 321
                      </strong>
                      <span className="text-slate-400 text-[10px] block">
                        {lang === 'ES' ? 'Titular: Leandro Baterías S.A.C.' : 'Owner: Leandro Baterías S.A.C.'}
                      </span>
                    </p>
                    <p className="text-[10px] text-[#ffb596] italic bg-[#bc4800]/10 border border-[#bc4800]/20 rounded px-2 py-1 inline-block">
                      ⚡ {lang === 'ES' 
                        ? 'El sistema detectará el abono al dar clic en Pagar.' 
                        : 'The system automatically verifies payments upon check.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Checkout CTA block */}
          <div className="mt-2 text-right">
            <button 
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-sans font-extrabold text-sm tracking-wide rounded-lg border border-blue-500 shadow-xl shadow-blue-950/40 hover:scale-[1.01] transition-all cursor-pointer transform active:scale-95"
            >
              🚀 {lang === 'ES' ? 'PAGAR Y GENERAR COMPROBANTE' : 'PAY & GENERATE RECEIPT'}
            </button>
          </div>

        </form>

        {/* Right Hand: Order Summary column sticky */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 sticky top-28 transition-colors duration-200">
            <h2 className="font-sans font-bold text-md mb-4 border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-900 dark:text-white flex items-center justify-between">
              <span>{lang === 'ES' ? 'Resumen del Pedido' : 'Order Summary'}</span>
              <span className="text-xs text-slate-400 bg-slate-950/40 px-2 py-0.5 rounded font-mono">
                {cartItems.length} {lang === 'ES' ? 'Batería(s)' : 'Battery(ies)'}
              </span>
            </h2>

            {/* List of checkout items */}
            <div className="flex flex-col gap-3 mb-6 max-h-60 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="py-6 text-center text-slate-500 font-sans text-xs">
                  {lang === 'ES' ? 'No hay productos en el carrito' : 'Your checkout cart is empty'}
                </div>
              ) : (
                cartItems.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/50"
                  >
                    <div className="w-12 h-12 rounded bg-white flex-shrink-0 overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-800">
                      <img 
                        alt={item.product.title} 
                        className="w-10 h-10 object-contain mix-blend-multiply" 
                        src={item.product.imageUrl}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-sans font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                        {item.product.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</p>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-[10px] text-slate-400">
                          {lang === 'ES' ? 'Cant' : 'Qty'}: {item.quantity}
                        </span>
                        <span className="font-sans text-xs font-bold text-blue-400">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Dynamic installation helper item */}
              {cartItems.length > 0 && (
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/50 border-dashed">
                  <div className="w-12 h-12 rounded bg-blue-500/10 text-blue-400 flex-shrink-0 flex items-center justify-center border border-blue-500/20">
                    <Wallet size={16} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-sans font-semibold text-xs text-slate-200 line-clamp-1">
                      {lang === 'ES' ? 'Instalación a Domicilio' : 'Home Installation Delivery'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'ES' ? 'Servicio Oficial Standard' : 'Official Delivery Service'}
                    </p>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-[10px] text-slate-400">{lang === 'ES' ? 'Cant: 1' : 'Qty: 1'}</span>
                      <span className="font-sans text-xs font-bold text-blue-400">S/ {installationPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-2 bg-white dark:bg-slate-900">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{lang === 'ES' ? 'Subtotal (Excl. IGV)' : 'Subtotal (Excl. Tax)'}</span>
                <span className="font-mono text-slate-300">S/ {taxBase.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{lang === 'ES' ? 'IGV (18%)' : 'Tax IGV (18%)'}</span>
                <span className="font-mono text-slate-300">S/ {igvTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-md font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-800/50">
                <span>Total</span>
                <span className="font-sans text-blue-400 text-lg">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Extra security metadata badge */}
            <div className="mt-5 text-center bg-slate-50 dark:bg-slate-950/45 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 select-none">
              <p className="flex items-center justify-center gap-1.5 font-sans font-medium">
                <Lock size={12} className="text-emerald-500" />
                <span>{lang === 'ES' ? 'Pago 100% Protegido y Verificado' : '100% Protected & Verified'}</span>
              </p>
              <p className="mt-1">
                {lang === 'ES' 
                  ? 'Garantía oficial Leandro Baterías de hasta 18 meses.' 
                  : 'Up to 18 months Leandro Baterías original warranty.'}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* MODAL Processing Indicator */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative shadow-2xl space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto scale-100" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                {lang === 'ES' ? 'Procesando Transacción' : 'Processing Transaction'}
              </h3>
              <p className="text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-850">
                {processingStep}
              </p>
            </div>
            <p className="text-[10px] text-slate-500">
              {lang === 'ES' ? 'Por favor no cierre ni recargue esta página.' : 'Please do not close or reload this browser tab.'}
            </p>
          </div>
        </div>
      )}

      {/* MODAL Beautiful success transaction with PRINTABLE PDF preview */}
      {showInvoiceModal && lastCreatedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-300 overflow-hidden transform transition-all my-8 animate-in zoom-in-95 duration-200">
            
            {/* Header Voucher */}
            <div className="px-6 py-4 bg-slate-900 text-slate-900 dark:text-white flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={20} />
                <span className="font-sans font-extrabold text-sm tracking-wide uppercase">
                  {lang === 'ES' ? '¡Pago Procesado Exitosamente!' : 'Payment Completed!'}
                </span>
              </div>
              <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-blue-300 font-bold">
                {lastCreatedOrder.id}
              </span>
            </div>

            {/* Printable Area content preview */}
            <div className="p-6 md:p-8 space-y-6" id="printable-voucher">
              
              {/* Receipt Logo Block */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <img 
                    alt="Leandro Baterías Logo" 
                    className="h-10 w-auto object-contain rounded" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLDwS70qO1G09ZgsQ-chUbzKoBWuPsQktcaRujrfCwRFLun7ZEGaITYBpA_zr0m4XgRWxONzTidciaBWoePhpoXEkm_c0lWQkqzHHl1wvG9CfSSRsVPHqHHZIK3EHF7STay-VGst1susV65ExCL1qZnYaliu4JpUXEQn204Ugf9KeJoexBSfYUsh5cAIW0M20lwCFSLbFYj8fAOr4WvAnw-P_YTTxQio6bJtoI9RBLUWrLEqeFJOMjALyjH90-W80EAF9nS2YUgQ"
                  />
                  <h1 className="text-md font-extrabold font-sans tracking-tight text-slate-950 uppercase mt-1">
                    Leandro Baterías S.A.C.
                  </h1>
                </div>
                <div className="text-right font-sans">
                  <div className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded inline-block uppercase tracking-wide">
                    {lastCreatedOrder.receiptType} Electrónica
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">{lastCreatedOrder.date} 00:44:05 UTC</p>
                </div>
              </div>

              {/* Billing Info Table */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                    {lang === 'ES' ? 'Cliente' : 'Customer'}
                  </h4>
                  <p className="font-extrabold text-slate-950 text-sm mt-0.5">{lastCreatedOrder.customerName}</p>
                  <p className="text-slate-600 font-medium">Documento: {lastCreatedOrder.documentId}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                    {lang === 'ES' ? 'Contacto' : 'Contact'}
                  </h4>
                  <p className="font-semibold text-slate-800 mt-0.5">{lastCreatedOrder.email}</p>
                  <p className="text-slate-600 font-mono">Movil: {lastCreatedOrder.phoneNumber}</p>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-2.5 px-4">{lang === 'ES' ? 'Descripción' : 'Description'}</th>
                      <th className="py-2.5 px-3 text-center">Cant</th>
                      <th className="py-2.5 px-4 text-right">Precio Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {lastCreatedOrder.items.map((item) => (
                      <tr key={item.product.id} className="text-slate-800">
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-950">{item.product.title}</span>
                          <span className="block text-[10px] text-slate-500 font-mono">SKU: {item.product.sku}</span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* Extra Installation Row */}
                    <tr className="text-slate-800 border-dashed border-t">
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-950">{lang === 'ES' ? 'Instalación a Domicilio' : 'Home setup'}</span>
                        <span className="block text-[10px] text-slate-500">{lang === 'ES' ? 'Servicio Standard' : 'Standard Delivery'}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">1</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">S/ 45.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Breakdown totals */}
              <div className="border-t border-slate-200 pt-4 flex flex-col gap-1.5 font-sans justify-end md:ml-auto md:w-64">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-700">S/ {taxBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>IGV (18%)</span>
                  <span className="font-mono font-bold text-slate-700">S/ {igvTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-950 border-t border-slate-100 pt-2">
                  <span>{lang === 'ES' ? 'Monto Pagado' : 'Total Amount Paid'}</span>
                  <span className="font-sans text-blue-700 text-base">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Extra legal footers on document */}
              <div className="text-center font-sans border-t border-slate-200 pt-4 select-none">
                <p className="text-[10px] text-slate-500">
                  {lang === 'ES' 
                    ? 'Este documento es una representación impresa de la firma digital autorizada.' 
                    : 'This electronic receipt validates your official digital signature and warranty.'}
                </p>
                <div className="font-mono text-[9px] text-[#bc4800] mt-1 tracking-wider uppercase">
                  {lang === 'ES' ? 'Garantía del acumulador activa' : 'Active battery warranty code'}: LB-WAR-{lastCreatedOrder.id.replace('LB-ORD-', '')}
                </div>
              </div>

            </div>

            {/* Print and Continue Action CTAs */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer size={14} />
                <span>{lang === 'ES' ? 'Imprimir Comprobante' : 'Print Receipt'}</span>
              </button>
              
              <button 
                onClick={handleCloseSuccess}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Check size={14} />
                <span>{lang === 'ES' ? 'Continuar Comprando' : 'Continue Shopping'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
