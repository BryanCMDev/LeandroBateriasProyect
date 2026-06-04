import { ViewType } from '../types';

interface FooterProps {
  lang: 'ES' | 'EN';
  setView: (view: ViewType) => void;
}

export default function Footer({ lang, setView }: FooterProps) {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 w-full py-8 mt-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide">
            Leandro Baterías
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            © 2026 Leandro Baterías. {lang === 'ES' ? 'Confiabilidad de Alta Energía.' : 'High Energy Reliability.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#privacy" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            {lang === 'ES' ? 'Política de Privacidad' : 'Privacy Policy'}
          </a>
          <a href="#terms" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            {lang === 'ES' ? 'Términos de Servicio' : 'Terms of Service'}
          </a>
          <a href="#warranty" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
            {lang === 'ES' ? 'Garantía oficial' : 'Official Warranty'}
          </a>
          <button 
            onClick={() => setView('login')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
          >
            {lang === 'ES' ? 'Acceso de Administrador' : 'Admin Login'}
          </button>
        </div>
      </div>
    </footer>
  );
}
