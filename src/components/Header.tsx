import React from 'react';
import { ShoppingCart, User, Sun, Moon, ArrowLeft } from 'lucide-react';
import { ViewType, DbStatus } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  cartCount: number;
  toggleCartOpen: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  lang: 'ES' | 'EN';
  setLang: (lang: 'ES' | 'EN') => void;
  dbStatus?: DbStatus | null;
}

export default function Header({
  currentView,
  setView,
  cartCount,
  toggleCartOpen,
  theme,
  setTheme,
  lang,
  setLang,
  dbStatus,
}: HeaderProps) {
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('catalog');
  };

  return (
    <header className="w-full border-b border-neutral-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 md:px-10 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <a 
            href="#home" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <img 
              alt="Leandro Baterías Logo" 
              className="h-8 w-auto object-contain rounded group-hover:scale-105 transition-transform duration-200" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLDwS70qO1G09ZgsQ-chUbzKoBWuPsQktcaRujrfCwRFLun7ZEGaITYBpA_zr0m4XgRWxONzTidciaBWoePhpoXEkm_c0lWQkqzHHl1wvG9CfSSRsVPHqHHZIK3EHF7STay-VGst1susV65ExCL1qZnYaliu4JpUXEQn204Ugf9KeJoexBSfYUsh5cAIW0M20lwCFSLbFYj8fAOr4WvAnw-P_YTTxQio6bJtoI9RBLUWrLEqeFJOMjALyjH90-W80EAF9nS2YUgQ"
            />
            <span className="font-sans text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 uppercase hidden sm:block">
              LEANDRO BATERÍAS
            </span>
          </a>

          {dbStatus && (
            <div 
              className="hidden md:flex items-center gap-1.5 ml-3 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-900 transition-colors duration-200"
              title={dbStatus.connected ? `Conectado a SQL Server en ${dbStatus.server}` : `Modo Local Activo: ${dbStatus.error || 'Almacenamiento local JSON'}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dbStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-neutral-500 dark:text-slate-400">
                {dbStatus.connected ? 'SQL Server' : 'Modo Offline'}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links - Hidden on Checkout and Login for transactional focus, visible on Catalog */}
        {currentView === 'catalog' && (
          <nav className="hidden md:flex space-x-6">
            <a 
              href="#catalog" 
              onClick={(e) => { e.preventDefault(); setView('catalog'); }}
              className="font-medium text-sm text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1"
            >
              {lang === 'ES' ? 'Catálogo' : 'Catalog'}
            </a>
            <a 
              href="#brands" 
              onClick={(e) => { e.preventDefault(); }}
              className="font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {lang === 'ES' ? 'Marcas' : 'Brands'}
            </a>
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); }}
              className="font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {lang === 'ES' ? 'Nosotros' : 'About Us'}
            </a>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); }}
              className="font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {lang === 'ES' ? 'Contacto' : 'Contact'}
            </a>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="flex items-center gap-1 font-sans text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => setLang('ES')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${lang === 'ES' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
            >
              ES
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button 
              onClick={() => setLang('EN')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${lang === 'EN' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            title={lang === 'ES' ? 'Alternar tema de color' : 'Toggle theme'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Shopping Cart Trigger - Hidden on Login/Admin */}
          {currentView !== 'login' && currentView !== 'admin' && (
            <button 
              onClick={toggleCartOpen}
              className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 dark:bg-blue-500 text-slate-900 dark:text-white text-[10px] font-bold rounded-full h-4 fit-content px-1 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Sign-In or Dashboard Route */}
          {currentView === 'admin' ? (
            <button 
              onClick={() => setView('catalog')}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              {lang === 'ES' ? 'Ver Tienda' : 'View Store'}
            </button>
          ) : (
            <button 
              onClick={() => setView(currentView === 'login' ? 'catalog' : 'login')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              title={lang === 'ES' ? 'Iniciar Sesión / Panel Admin' : 'Sign In / Admin Log'}
            >
              <User size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
