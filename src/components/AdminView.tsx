import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Edit2, SlidersHorizontal, Trash2, 
  HelpCircle, LogOut, LayoutDashboard, Database, 
  FileSpreadsheet, Settings, AlertTriangle, TrendingUp, 
  Truck, ArrowRight, X, Sparkles, Filter, Check, Eye 
} from 'lucide-react';
import { Product, Order, ViewType, DbStatus } from '../types';

interface AdminViewProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setView: (view: ViewType) => void;
  lang: 'ES' | 'EN';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  dbStatus?: DbStatus | null;
}

type AdminTab = 'dashboard' | 'inventario' | 'pedidos' | 'configuracion';

export default function AdminView({
  products,
  setProducts,
  orders,
  setView,
  lang,
  theme,
  setTheme,
  dbStatus,
}: AdminViewProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Search/Filters states
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('Todas');

  // Modal forms states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Field States
  const [brand, setBrand] = useState('Bosch');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('185');
  const [stock, setStock] = useState('45');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [amperage, setAmperage] = useState('50Ah');

  // Sparkline/Emergency stats
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  // Computed metrics
  const totalSalesAmount = 12450.00; // Fixed sum corresponding to layout mockup $12,450
  const activeOrdersCount = 42;      // Fixed count corresponding to mockup 42

  // Dynamically compute number of under-stocked items (stock <= 5)
  const lowStockCount = useMemo(() => {
    return products.filter((prod) => prod.stock <= 5).length;
  }, [products]);

  // Handle Edit Trigger
  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setBrand(prod.brand);
    setModel(prod.model);
    setPrice(prod.price.toString());
    setStock(prod.stock.toString());
    setSku(prod.sku);
    setImageUrl(prod.imageUrl);
    setAmperage(prod.amperage || '55Ah');
    setShowEditModal(true);
  };

  // Save new battery product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !price || !stock) return;

    const generatedSku = sku.trim() || `LB-${brand.toUpperCase()}-${model.replace(/\s+/g, '-').toUpperCase()}`;
    const fallbackImage = imageUrl.trim() || 'https://lh3.googleusercontent.com/aida/ADBb0uhivUAA_n0A3t8u22AhazDLDczs1VdO3uzRmOpoOJpeSIBqtNoBivcIPLmQ4JGlQFCV7y2qsi5F1K-Xx3CmuEhqEZWSQeznMM5x911a-bMApPM022RWHSF9EL_nuQWB7fV7P2TNL8eCLltVCbwIg7tCNWnX6NinnE0I5cQ1VOyJsEytnzCqV2-wQr-NWav-Ruwc8nTnhWdnl0esPe7ofGHhPMgGq8Ul8A5nWokn5jL4XBU-GVBUW-Su'; // Etna mockup image fallback

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: `${brand} ${model}`,
      sku: generatedSku,
      brand,
      model,
      price: parseFloat(price) || 150,
      stock: parseInt(stock) || 10,
      amperage,
      voltage: '12V',
      imageUrl: fallbackImage
    };

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((savedProduct) => {
        setProducts((prev) => [savedProduct, ...prev]);
      })
      .catch((err) => {
        console.error('Failed to post product to backend API, using local fallback state:', err);
        setProducts((prev) => [newProduct, ...prev]);
      });
    
    // Reset Form
    setModel('');
    setPrice('185');
    setStock('45');
    setSku('');
    setImageUrl('');
    setShowAddModal(false);
  };

  // Submit edits for battery product
  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedFields = {
      brand,
      model,
      title: `${brand} ${model}`,
      price: parseFloat(price) || editingProduct.price,
      stock: parseInt(stock) || 0,
      sku: sku || editingProduct.sku,
      imageUrl: imageUrl || editingProduct.imageUrl,
      amperage,
      voltage: '12V'
    };

    fetch(`/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    })
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((savedProduct) => {
        setProducts((prev) => prev.map((prod) => prod.id === editingProduct.id ? savedProduct : prod));
      })
      .catch((err) => {
        console.error('Failed to update product via API, using local update:', err);
        setProducts((prev) => 
          prev.map((prod) => {
            if (prod.id === editingProduct.id) {
              return {
                ...prod,
                ...updatedFields
              };
            }
            return prod;
          })
        );
      });

    setShowEditModal(false);
    setEditingProduct(null);
  };

  // Delete product logic helper
  const handleDeleteProduct = (productId: string) => {
    if (confirm(lang === 'ES' ? '¿Está seguro de eliminar esta batería del inventario?' : 'Are you sure you want to delete this product?')) {
      fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('API Error');
          return res.json();
        })
        .then(() => {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        })
        .catch((err) => {
          console.error('Failed to delete product via API, deleting locally:', err);
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        });
    }
  };

  // Filter products for the detailed Inventory Table
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch = 
        prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchBrand = brandFilter === 'Todas' || prod.brand === brandFilter;

      return matchSearch && matchBrand;
    });
  }, [products, searchTerm, brandFilter]);

  // Brand Options for selecting in the filter dropdown
  const uniqueBrands = useMemo(() => {
    const set = new Set(products.map(p => p.brand));
    return ['Todas', ...Array.from(set)];
  }, [products]);

  return (
    <div className="flex h-screen overflow-hidden dark:bg-slate-950 bg-slate-100 transition-colors duration-200">
      
      {/* SIDE NAVBAR PANEL */}
      <aside className="hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-900 dark:text-slate-100 h-screen w-64 flex-shrink-0 py-6 transition-colors duration-200">
        
        {/* Brand Banner */}
        <div className="px-6 pb-6 border-b border-slate-800 mb-6">
          <img 
            alt="Leandro Baterías Logo" 
            className="h-10 w-auto mb-3 rounded-md" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLDwS70qO1G09ZgsQ-chUbzKoBWuPsQktcaRujrfCwRFLun7ZEGaITYBpA_zr0m4XgRWxONzTidciaBWoePhpoXEkm_c0lWQkqzHHl1wvG9CfSSRsVPHqHHZIK3EHF7STay-VGst1susV65ExCL1qZnYaliu4JpUXEQn204Ugf9KeJoexBSfYUsh5cAIW0M20lwCFSLbFYj8fAOr4WvAnw-P_YTTxQio6bJtoI9RBLUWrLEqeFJOMjALyjH90-W80EAF9nS2YUgQ"
          />
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase select-none">
            Leandro Baterías
          </h1>
          <p className="text-xs text-slate-400 font-sans font-semibold mt-0.5">
            {lang === 'ES' ? 'PANEL DE ADMINISTRACIÓN' : 'ADMIN CONTROL PANEL'}
          </p>
        </div>

        {/* Tab links navigation */}
        <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          <button 
            onClick={() => { setActiveTab('dashboard'); setSearchTerm(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-950/40 font-bold'
                : 'text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>{lang === 'ES' ? 'Resumen general' : 'Dashboard Summary'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('inventario'); setSearchTerm(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer ${
              activeTab === 'inventario'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-950/40 font-bold'
                : 'text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Database size={16} />
            <span>{lang === 'ES' ? 'Gestión de Inventario' : 'Inventory Manager'}</span>
          </button>

          <button 
            onClick={() => { setActiveTab('pedidos'); setSearchTerm(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer ${
              activeTab === 'pedidos'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-950/40 font-bold'
                : 'text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet size={16} />
            <span>{lang === 'ES' ? 'Historial de Pedidos' : 'Order Receipts'}</span>
            <span className="ml-auto bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full text-blue-300">
              {orders.length}
            </span>
          </button>

          <button 
            onClick={() => { setActiveTab('configuracion'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-sans text-xs font-semibold cursor-pointer ${
              activeTab === 'configuracion'
                ? 'bg-blue-600 text-slate-900 dark:text-white shadow-lg shadow-blue-950/40 font-bold'
                : 'text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            <Settings size={16} />
            <span>{lang === 'ES' ? 'Configuración' : 'Settings'}</span>
          </button>
        </div>

        {/* Brand controls footer inside sidebar */}
        <div className="px-4 pt-4 border-t border-slate-800 mt-auto flex flex-col gap-3">
          
          {/* Emergency Stock warning button option with popover */}
          <button 
            onClick={() => setShowEmergencyDialog(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-650 hover:bg-red-650/90 text-slate-900 dark:text-white rounded-lg font-sans font-bold text-xs active:scale-98 transition-transform cursor-pointer shadow-lg shadow-red-950/20"
          >
            <AlertTriangle size={14} className="animate-spin" />
            <span>{lang === 'ES' ? 'Stock de Emergencia' : 'Emergency Stock'}</span>
          </button>

          {/* Logout Action CTA */}
          <button 
            onClick={() => setView('catalog')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-900 dark:text-slate-100 hover:bg-slate-800/50 transition-all font-sans text-xs font-semibold cursor-pointer"
          >
            <LogOut size={16} />
            <span>{lang === 'ES' ? 'Cerrar Sesión' : 'Logout Admin'}</span>
          </button>
        </div>
      </aside>

      {/* DYNAMIC PANE AREA VIEWPORT */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-200">
        
        {/* Dynamic Header Block with CTA Add Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
          <div>
            <h1 className="font-sans font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight leading-tight">
              {activeTab === 'dashboard' && (lang === 'ES' ? 'Resumen del Dashboard' : 'Dashboard Overview')}
              {activeTab === 'inventario' && (lang === 'ES' ? 'Control de Inventario' : 'Inventory Control Catalog')}
              {activeTab === 'pedidos' && (lang === 'ES' ? 'Historial de Transacciones' : 'Sales Transaction Registry')}
              {activeTab === 'configuracion' && (lang === 'ES' ? 'Configuración del Sistema' : 'System Configuration Panel')}
            </h1>
            <p className="font-sans text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeTab === 'dashboard' && (lang === 'ES' ? 'Visualice ingresos, flujos y alertas críticas de stock.' : 'Monitor revenue, orders, and understocked batteries in real-time.')}
              {activeTab === 'inventario' && (lang === 'ES' ? 'Modifique precios, agregue marcas o ajuste niveles del almacén.' : 'Edit battery listing specifications, wholesale pricing, or warehouse counts.')}
              {activeTab === 'pedidos' && (lang === 'ES' ? 'Gestione comprobantes electrónicos generados y entregas.' : 'Review generated electronic receipts, customers details, and delivery logs.')}
              {activeTab === 'configuracion' && (lang === 'ES' ? 'Ajustes globales del sistema, roles e integraciones.' : 'Adjust global margins, VAT rates, and administrator accounts.')}
            </p>
          </div>

          {/* "+ Agregar Nueva Batería" only on relevant tabs */}
          {(activeTab === 'dashboard' || activeTab === 'inventario') && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-sans font-bold text-xs px-5 py-3 rounded-lg border border-blue-500 shadow-md shadow-blue-500/10 cursor-pointer transition-all hover:scale-[1.01] transform active:scale-95 flex-shrink-0"
            >
              <Plus size={14} />
              <span>{lang === 'ES' ? 'Agregar Nueva Batería' : 'Add New Battery'}</span>
            </button>
          )}
        </div>

        {/* Tab Selection on Mobile Viewport (supressed on desktop) */}
        <div className="flex md:hidden bg-slate-200 dark:bg-slate-900 p-1 rounded-xl mb-6">
          {(['dashboard', 'inventario', 'pedidos'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center py-2 text-xs font-bold font-sans rounded-lg tracking-wide uppercase transition-all whitespace-nowrap overflow-hidden text-ellipsis ${
                activeTab === tab
                  ? 'bg-blue-600 text-slate-900 dark:text-white font-bold shadow'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* VIEW TAB PANE 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* WIDGETS STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sales widget card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between h-40 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <span className="font-sans font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    {lang === 'ES' ? 'Ventas Totales (Hoy)' : 'Total Sales Amount (Today)'}
                  </span>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans mt-2">
                    $12,450
                  </div>
                  <div className="text-emerald-500 font-sans text-xs font-bold mt-1.5 flex items-center gap-1 select-none">
                    <TrendingUp size={12} />
                    <span>+8.2% {lang === 'ES' ? 'vs ayer' : 'vs yesterday'}</span>
                  </div>
                </div>
              </div>

              {/* Active orders widget card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between h-40 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <span className="font-sans font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                    {lang === 'ES' ? 'Pedidos Activos' : 'Active Orders Logs'}
                  </span>
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <Truck size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans mt-2">
                    {activeOrdersCount}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-sans text-xs mt-1.5">
                    {lang === 'ES' ? '12 pendientes de envío hoy' : '12 delivery trucks scheduled'}
                  </div>
                </div>
              </div>

              {/* Under stock widget card */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-between h-40 transition-colors duration-200">
                {/* Red warning subtle light banner */}
                <div className="absolute inset-0 bg-red-550/[0.03] select-none pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <span className="font-sans font-extrabold text-red-600 dark:text-red-400 text-xs uppercase tracking-wider">
                    {lang === 'ES' ? 'Stock Bajo' : 'Critical Stock Alert'}
                  </span>
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                    <AlertTriangle size={16} className="animate-pulse" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-3xl font-extrabold text-red-650 dark:text-red-400 font-sans mt-2">
                    {lowStockCount}
                  </div>
                  <div className="text-red-600 dark:text-red-400 font-sans text-xs font-semibold mt-1.5">
                    {lang === 'ES' ? 'SKUs requieren atención inmediata' : 'SKUs require restocking replenishment'}
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK PREVIEW LIST BAR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left hand details list */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm col-span-2 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                    {lang === 'ES' ? 'Baterías con Crítica de Stock' : 'Low Stock Inventory Alert List'}
                  </h3>
                  <button 
                    onClick={() => setActiveTab('inventario')}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>{lang === 'ES' ? 'Ver todo el almacén' : 'View all items'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {products.filter(p => p.stock <= 5).length === 0 ? (
                    <div className="text-center py-6 text-slate-400 font-sans text-xs">
                      ✅ {lang === 'ES' ? 'Todo el stock está saludable.' : 'All inventory levels are looking healthy.'}
                    </div>
                  ) : (
                    products.filter(p => p.stock <= 5).slice(0, 3).map((prod) => (
                      <div 
                        key={prod.id}
                        className="flex items-center justify-between p-3.5 bg-red-550/[0.02] border border-red-500/10 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            alt={prod.title} 
                            className="w-10 h-10 object-contain bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800" 
                            src={prod.imageUrl}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{prod.title}</h4>
                            <p className="font-mono text-[10px] text-slate-500">SKU: {prod.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 block">
                            {prod.stock} {lang === 'ES' ? 'uds' : 'qty'}
                          </span>
                          <button 
                            onClick={() => openEditModal(prod)}
                            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold mt-0.5"
                          >
                            {lang === 'ES' ? 'Reabastecer' : 'Restock'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right hand dynamic orders status */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-sans font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                    {lang === 'ES' ? 'Últimos Pedidos' : 'Recent Receipts'}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord.id} className="text-xs border-b border-slate-100 dark:border-slate-800/40 pb-2.5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-850 dark:text-slate-200">{ord.customerName}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono">{ord.id}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] mt-1 text-slate-500">
                          <span>{ord.date} • {ord.paymentMethod.toUpperCase()}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-350">
                            S/ {ord.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('pedidos')}
                  className="mt-4 w-full text-center py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-200 font-sans font-bold text-xs cursor-pointer transition-colors"
                >
                  {lang === 'ES' ? 'Ver Todos los Pedidos' : 'Manage All Receipts'}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* VIEW TAB PANE 2: INVENTORY LIST TABLE */}
        {activeTab === 'inventario' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Filter toolbelt controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              
              {/* Search text match */}
              <div className="relative flex-1 max-w-md flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all px-3 py-2">
                <Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  type="text"
                  placeholder={lang === 'ES' ? 'Buscar SKU, marca o modelo...' : 'Search SKU, brand or model...'}
                  className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white outline-none focus:ring-0 placeholder:text-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Brand filter selection */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 flex-shrink-0 text-xs">
                <Filter size={14} className="text-slate-450" />
                <span className="text-slate-400 select-none">Marca:</span>
                <select 
                  className="bg-transparent border-none font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-0 p-0 cursor-pointer text-xs"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  {uniqueBrands.map((b) => (
                    <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-900 dark:text-slate-100">{b}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Inventory listing data table main */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-6 select-none">{lang === 'ES' ? 'Imagen' : 'Image preview'}</th>
                      <th className="py-4 px-4 font-mono">SKU</th>
                      <th className="py-4 px-4">{lang === 'ES' ? 'Marca y Modelo' : 'Brand name & Model'}</th>
                      <th className="py-4 px-4 text-right">{lang === 'ES' ? 'Precio unitario' : 'Specs Price'}</th>
                      <th className="py-4 px-4 text-center">{lang === 'ES' ? 'Stock Actual' : 'Warehouse Stock'}</th>
                      <th className="py-4 px-4 text-center">{lang === 'ES' ? 'Estado Almacén' : 'Active Status'}</th>
                      <th className="py-4 px-6 text-right select-none">{lang === 'ES' ? 'Acciones' : 'Actions Edit'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-sans text-xs">
                          😞 {lang === 'ES' ? 'No se encontraron baterías con los filtros actuales.' : 'No batteries match your current query.'}
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const isLowStock = prod.stock <= 5;
                        return (
                          <tr 
                            key={prod.id} 
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group relative"
                          >
                            {/* Visual Highlight indicator on low stock left edge like in mockup */}
                            {isLowStock && (
                              <td className="absolute left-0 top-0 bottom-0 w-1 bg-red-650" />
                            )}

                            {/* Thumbnail preview */}
                            <td className="py-3 px-6">
                              <img 
                                alt={prod.title} 
                                className="w-12 h-12 object-contain bg-slate-50 p-1 rounded-lg border border-slate-200 dark:border-slate-850" 
                                src={prod.imageUrl}
                                referrerPolicy="no-referrer"
                              />
                            </td>

                            {/* SKU Label code text */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-300">
                              {prod.sku}
                            </td>

                            {/* Brand model heading */}
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                                {prod.brand}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-xs block -mt-0.5">
                                {prod.model} {prod.amperage ? `(${prod.amperage})` : ''}
                              </span>
                            </td>

                            {/* Price formatted */}
                            <td className="py-3 px-4 text-right text-slate-900 dark:text-slate-100 font-sans text-[13px] font-extrabold">
                              S/ {prod.price.toFixed(2)}
                            </td>

                            {/* Stock total formatted */}
                            <td className={`py-3 px-4 text-center text-sm font-sans font-extrabold ${isLowStock ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                              {prod.stock}
                            </td>

                            {/* Active status indicator pill */}
                            <td className="py-3 px-4 text-center">
                              {prod.stock === 0 ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/25">
                                  {lang === 'ES' ? 'Agotado' : 'Out of stock'}
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 animate-pulse">
                                  {lang === 'ES' ? 'Stock Bajo' : 'Low Stock'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                                  {lang === 'ES' ? 'En Stock' : 'Active'}
                                </span>
                              )}
                            </td>

                            {/* Edit pencil Actions options */}
                            <td className="py-3 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => openEditModal(prod)}
                                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-colors cursor-pointer"
                                  title={lang === 'ES' ? 'Editar batería' : 'Edit item'}
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                                  title={lang === 'ES' ? 'Eliminar batería' : 'Delete item'}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Data registry footer count */}
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 flex items-center justify-between text-slate-500">
                <span>
                  {lang === 'ES' 
                    ? `Mostrando ${filteredProducts.length} de ${products.length} registros` 
                    : `Showing ${filteredProducts.length} of ${products.length} registered entries`}
                </span>
                <div className="flex gap-2">
                  <button disabled className="p-1 rounded bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 disabled:opacity-50 border border-slate-200 dark:border-slate-800">
                    &lt;
                  </button>
                  <button disabled={filteredProducts.length < 10} className="p-1 rounded bg-white dark:bg-slate-850 hover:bg-slate-100 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                    &gt;
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW TAB PANE 3: ORDERS HISTORIC */}
        {activeTab === 'pedidos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-4 px-6">{lang === 'ES' ? 'Código' : 'ID'}</th>
                      <th className="py-4 px-4">{lang === 'ES' ? 'Fecha' : 'Date'}</th>
                      <th className="py-4 px-4">{lang === 'ES' ? 'Cliente' : 'Customer name'}</th>
                      <th className="py-4 px-4">{lang === 'ES' ? 'Método' : 'Method'}</th>
                      <th className="py-4 px-4">{lang === 'ES' ? 'Productos Adquiridos' : 'Items logs'}</th>
                      <th className="py-4 px-4 text-right">Total</th>
                      <th className="py-4 px-6 text-center">{lang === 'ES' ? 'Estado' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                          {lang === 'ES' ? 'No hay transacciones registradas todavía.' : 'No transactions registered.'}
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20">
                          <td className="py-3.5 px-6 font-mono font-bold text-blue-600 dark:text-blue-400 select-all">
                            {ord.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {ord.date}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {ord.customerName}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-400 capitalize">
                            {ord.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px] truncate" title={ord.items.map(i => `${i.product.title} (x${i.quantity})`).join(', ')}>
                            {ord.items.map(i => `${i.product.title} (x${i.quantity})`).join(', ')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100 text-[13px]">
                            S/ {ord.total.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              {lang === 'ES' ? 'Pagado' : 'Paid'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW TAB PANE 4: CONFIGURATION */}
        {activeTab === 'configuracion' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
            <h3 className="font-sans font-bold text-slate-900 dark:text-white text-md border-b border-slate-100 dark:border-slate-850 pb-3">
              {lang === 'ES' ? 'Parámetros del Sistema' : 'System Administration Parameters'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300 font-sans">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Tasa de Impuestos IGV (%)' : 'Tax rate VAT (%)'}</label>
                  <input readOnly type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-3 outline-none" value="18" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Moneda Principal' : 'Primary Currency'}</label>
                  <input readOnly type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-3 outline-none" value="Soles del Perú (S/.)" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Costo de Envío e Instalación' : 'Flat setup deliver charge'}</label>
                  <input readOnly type="text" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-3 outline-none" value="S/ 45.00" />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Conexión a Pasarela' : 'Gateway Gateway API link'}</label>
                  <span className="block p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-bold font-mono text-[10px] uppercase">
                    ● {lang === 'ES' ? 'Nativo Visa/Mastercard Activa' : 'Gateway online active'}
                  </span>
                </div>
              </div>

            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-xs leading-relaxed text-slate-500">
              ℹ️ {lang === 'ES' ? 'Parámetros del sistema se actualizan automáticamente en base a regulaciones peruanas.' : 'System parameters automatically conform to Peruvian local tax laws.'}
            </div>

            {/* SQL Server Integration Card */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 bg-slate-50 dark:bg-slate-900/40 text-xs font-sans space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-900 dark:text-white flex items-center gap-2">
                <Database size={16} className={dbStatus?.connected ? 'text-green-500 animate-pulse' : 'text-amber-500'} />
                <span>{lang === 'ES' ? 'Vincular Base de Datos SQL Server' : 'SQL Server Database Integration'}</span>
              </h4>

              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                {lang === 'ES' ? 
                  'Leandro Baterías cuenta con soporte nativo para de bases de datos relacionales en Microsoft SQL Server. Al vincular una base de datos, el stock del almacén, catálogo de baterías, pedidos y comprobantes del e-commerce se almacenarán de forma duradera.' 
                  : 'Leandro Baterías comes out of the box with Microsoft SQL Server relational database support. Once mapped, your live showroom, warehouse stock counts, orders, and receipt ledgers persist securely.'}
              </p>

              {/* Status panel */}
              {dbStatus ? (
                <div className={`p-4 rounded-xl border ${
                  dbStatus.connected 
                    ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      {lang === 'ES' ? 'ESTADO DE CONEXIÓN' : 'CONNECTION STATUS'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      dbStatus.connected ? 'bg-green-500/20' : 'bg-amber-500/20'
                    }`}>
                      {dbStatus.connected ? (lang === 'ES' ? 'CONECTADO' : 'CONNECTED') : (lang === 'ES' ? 'MODO LOCAL' : 'MODO LOCAL')}
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div>
                      <strong className="opacity-75">{lang === 'ES' ? 'Motor:' : 'Engine:'}</strong> Microsoft SQL Server (Transact-SQL)
                    </div>
                    {dbStatus.server && (
                      <div>
                        <strong className="opacity-75">{lang === 'ES' ? 'Servidor:' : 'Server Host:'}</strong> {dbStatus.server}
                      </div>
                    )}
                    {dbStatus.database && (
                      <div>
                        <strong className="opacity-75">{lang === 'ES' ? 'Base de Datos:' : 'Schema Database:'}</strong> {dbStatus.database}
                      </div>
                    )}
                    <div>
                      <strong className="opacity-75">{lang === 'ES' ? 'Modo de Respaldo:' : 'Backup system:'}</strong> Almacenamiento JSON local (`data_store.json`) {dbStatus.connected ? 'en espera/sincronizado' : 'activo'}
                    </div>
                    {!dbStatus.connected && dbStatus.error && (
                      <div className="pt-2 text-amber-700 dark:text-amber-500 font-sans block">
                        <strong>Detalle del Modo Local:</strong> {lang === 'ES' ? 'Listo para conectarse al proporcionar credenciales SQL en Ajustes. Usando base de datos guardada localmente de Leandro Baterías.' : 'Ready to connect upon entering database secrets. Defaulting to local persistent JSON file.'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-850 animate-pulse text-center">
                  {lang === 'ES' ? 'Cargando estado del almacenamiento...' : 'Obtaining database cluster registry...'}
                </div>
              )}

              {/* Informative credentials section */}
              <div className="bg-slate-100 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-850 p-4 rounded-xl space-y-3">
                <span className="font-bold text-[10px] uppercase text-slide-500 block tracking-wider text-slate-500">
                  {lang === 'ES' ? 'CÓMO VINCULAR TU INSTANCIA DE SQL SERVER' : 'HOW TO MAP YOUR MSSQL SERVER INSTANCE'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'ES' ? 
                    'Para conectar su base de datos corporativa de SQL Server en producción, configure las siguientes variables de entorno en el panel de Settings de Google AI Studio (o en su archivo .env):' 
                    : 'To configure your production Enterprise SQL Server instance, insert these application variables in your hosting environment configuration/Settings panel:'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed bg-slate-50 dark:bg-slate-950 text-slate-300 p-3 rounded-lg border border-slate-800">
                  <div>DB_SERVER=tu-servidor-mssql.net</div>
                  <div>DB_PORT=1433</div>
                  <div>DB_USER=usuario_administrador</div>
                  <div>DB_PASSWORD=••••••••</div>
                  <div>DB_NAME=leandro_baterias</div>
                  <div>DB_TRUST_SERVER_CERTIFICATE=true</div>
                </div>
                <div className="text-[10px] text-blue-500 dark:text-blue-400 font-sans leading-relaxed">
                  💡 {lang === 'ES' ? 
                    'Nota: El sistema creará de forma inteligente las tablas [Products], [Orders] y [OrderItems] en el primer encendido y sembrará los registros iniciales automáticamente.' 
                    : 'Note: The system automatically generates [Products], [Orders], and [OrderItems] schemas during startup and seeds baseline elements instantly.'}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: ADD NEW BATTERY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide">
                {lang === 'ES' ? 'Agregar Nueva Batería' : 'Add New Battery'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:text-white transition-colors p-1 rounded-full hover:bg-slate-850 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 bg-white dark:bg-slate-900 text-xs text-slate-300">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Marca' : 'Brand'}</label>
                  <select 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="Capsa">Capsa</option>
                    <option value="Solite">Solite</option>
                    <option value="Varta">Varta</option>
                    <option value="Ultrabat">Ultrabat</option>
                    <option value="Etna">Etna</option>
                    <option value="Enerjet">Enerjet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Amperaje' : 'Amperage'}</label>
                  <select 
                    value={amperage} 
                    onChange={(e) => setAmperage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="40Ah">40Ah</option>
                    <option value="50Ah">50Ah</option>
                    <option value="70Ah">70Ah</option>
                    <option value="90Ah">90Ah</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">{lang === 'ES' ? 'Modelo (Ej. S5 75Ah)' : 'Model specification'}</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ej. U1R 500"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-600 outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 border-slate-800">
                  <label className="block font-bold">{lang === 'ES' ? 'Precio de Venta ($ / S/.)' : 'Retail Price'}</label>
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="absolute left-3 text-slate-500">S/</span>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent border-none px-3 py-2 pl-8 text-slate-900 dark:text-white outline-none focus:ring-0 placeholder:text-slate-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Stock Inicial' : 'Initial Warehouse stock'}</label>
                  <input 
                    required
                    type="number" 
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-600 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">SKU ( LB-MARCA-MODELO )</label>
                <input 
                  type="text" 
                  placeholder={lang === 'ES' ? 'Auto-generado' : 'Auto-generated SKU code'}
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-blue-500 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold">{lang === 'ES' ? 'URL de la Imagen' : 'Battery Image asset URL'}</label>
                <input 
                  type="url" 
                  placeholder="https://images.com/battery.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-300 placeholder:text-slate-600 outline-none focus:border-blue-500 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 block">
                  {lang === 'ES' ? '* Dejar vacío para usar una imagen del demo por defecto.' : '* Leave empty for standard default placeholder rendering.'}
                </span>
              </div>

              <div className="px-6 py-4 -mx-6 -mb-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-lg font-bold bg-transparent text-slate-400 border border-slate-700 hover:bg-slate-850 cursor-pointer"
                >
                  {lang === 'ES' ? 'Cancelar' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white shadow shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                >
                  {lang === 'ES' ? 'Guardar Cambios' : 'Save Battery'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITING BATTERY */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white select-none">
              <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide">
                {lang === 'ES' ? `Editar Batería: ${editingProduct.brand}` : `Edit Battery specifications: ${editingProduct.brand}`}
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:text-white transition-colors p-1 rounded-full hover:bg-slate-850 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-6 space-y-4 bg-white dark:bg-slate-900 text-xs text-slate-300">
              
              <div className="space-y-1">
                <label className="block font-bold">{lang === 'ES' ? 'Marca' : 'Brand name'}</label>
                <input 
                  required
                  type="text" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold">{lang === 'ES' ? 'Modelo' : 'Model'}</label>
                <input 
                  required
                  type="text" 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Precio de Venta ($ / S/.)' : 'Price spec'}</label>
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <span className="absolute left-3 text-slate-500">S/</span>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent border-none px-3 py-2 pl-8 text-slate-900 dark:text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">{lang === 'ES' ? 'Stock Actual' : 'Stock level'}</label>
                  <input 
                    required
                    type="number" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold">SKU</label>
                  <input 
                    required
                    type="text" 
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold">Amperaje</label>
                  <input 
                    required
                    type="text" 
                    value={amperage}
                    onChange={(e) => setAmperage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">{lang === 'ES' ? 'URL de imagen asset' : 'Product Image url logo'}</label>
                <input 
                  required
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono text-xs"
                />
              </div>

              <div className="px-6 py-4 -mx-6 -mb-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-lg font-bold bg-transparent text-slate-400 border border-slate-700 hover:bg-slate-850 cursor-pointer"
                >
                  {lang === 'ES' ? 'Cancelar' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white shadow shadow-blue-500/10 cursor-pointer transition-all"
                >
                  {lang === 'ES' ? 'Guardar Cambios' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DIALOG 3: EMERGENCY STOCK POPUP WARNING */}
      {showEmergencyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-red-500/50 rounded-2xl shadow-xl max-w-sm w-full text-center p-6 space-y-4 text-slate-900 dark:text-slate-100 font-sans">
            <div className="w-14 h-14 bg-red-500/15 rounded-full flex items-center justify-center text-red-500 mx-auto animate-bounce border border-red-500/30">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-md font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {lang === 'ES' ? 'Protocolo Stock de Emergencia' : 'Emergency Replenishment Trigger'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ES' 
                  ? '¿Deseas activar el reabastecimiento crítico automático para todas las marcas con bajo inventario (Capsa, Enerjet)?' 
                  : 'Are you sure you want to run quick inventory replenishment protocol for all understocked battery series in the supplier loop?'}
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button 
                onClick={() => setShowEmergencyDialog(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                No, {lang === 'ES' ? 'Cancelar' : 'Decline'}
              </button>
              <button 
                onClick={() => {
                  setProducts(prev => prev.map(p => p.stock <= 5 ? { ...p, stock: 20 } : p));
                  setShowEmergencyDialog(false);
                  setTimeout(() => alert(lang === 'ES' ? '¡Stock de emergencia reestablecido en +20 unidades!' : 'Emergency stock levels refreshed successfully with +20 units!'), 100);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 rounded-lg text-slate-900 dark:text-white border border-red-500 cursor-pointer"
              >
                {lang === 'ES' ? 'Activar Protocolo' : 'Execute Supply Trigger'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
