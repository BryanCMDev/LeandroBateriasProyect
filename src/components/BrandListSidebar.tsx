import { BRANDS, AMPERAGES } from '../data';

interface BrandListSidebarProps {
  selectedBrands: string[];
  setSelectedBrands: (brands: string[] | ((prev: string[]) => string[])) => void;
  selectedAmperages: string[];
  setSelectedAmperages: (amperages: string[] | ((prev: string[]) => string[])) => void;
  lang: 'ES' | 'EN';
  onClose?: () => void; // Optional mobile drawer close function
}

export default function BrandListSidebar({
  selectedBrands,
  setSelectedBrands,
  selectedAmperages,
  setSelectedAmperages,
  lang,
  onClose,
}: BrandListSidebarProps) {
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev: string[]) => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };

  const handleAmperageToggle = (amp: string) => {
    setSelectedAmperages((prev: string[]) => {
      if (prev.includes(amp)) {
        return prev.filter(a => a !== amp);
      } else {
        return [...prev, amp];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedAmperages([]);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Brands Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-sans font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide">
            {lang === 'ES' ? 'Marcas' : 'Brands'}
          </h3>
          {(selectedBrands.length > 0 || selectedAmperages.length > 0) && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {lang === 'ES' ? 'Limpiar Todo' : 'Clear All'}
            </button>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          {BRANDS.map((brand) => (
            <label 
              key={brand}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input 
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 h-4 w-4 transition-colors"
                id={`brand-${brand}`}
              />
              <span className="font-sans text-sm text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amperage Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors duration-200">
        <h3 className="font-sans font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide mb-4">
          {lang === 'ES' ? 'Amperaje' : 'Amperage'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {AMPERAGES.map((amp) => {
            const isActive = selectedAmperages.includes(amp);
            return (
              <button
                key={amp}
                onClick={() => handleAmperageToggle(amp)}
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-2 ring-blue-600/10'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 transition-colors'
                }`}
              >
                {amp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary instructions */}
      <div className="text-xs text-slate-400 dark:text-slate-500 bg-blue-50/20 dark:bg-slate-950/20 border border-blue-500/10 rounded-lg p-3 text-center">
        💡 {lang === 'ES' 
          ? 'Las baterías vienen cargadas y listas para instalar.' 
          : 'Batteries come fully charged and ready to be installed.'}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden w-full bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 font-bold py-2.5 rounded-lg text-sm transition-transform active:scale-98 cursor-pointer mt-2"
        >
          {lang === 'ES' ? 'Aplicar Filtros' : 'Apply Filters'}
        </button>
      )}
    </div>
  );
}
