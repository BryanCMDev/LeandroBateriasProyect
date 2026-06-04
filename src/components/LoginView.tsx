import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { ViewType } from '../types';

interface LoginViewProps {
  setView: (view: ViewType) => void;
  lang: 'ES' | 'EN';
  onLoginSuccess: () => void;
}

export default function LoginView({ setView, lang, onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorVisible(false);

    // Simulated short delay for high-fidelity interactive feel
    setTimeout(() => {
      // Allow 'admin' and 'admin' to pass
      if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
        onLoginSuccess();
        setView('admin');
      } else {
        setErrorVisible(true);
        setIsSubmitting(false);
      }
    }, 800);
  };

  const autofillAdmin = () => {
    setUsername('admin');
    setPassword('admin');
    setErrorVisible(false);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {/* Login Card */}
      <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8 flex flex-col items-center transition-colors duration-200">
        
        {/* Brand Logo & Presentation */}
        <div className="mb-6 flex flex-col items-center select-none text-center">
          <img 
            alt="Leandro Baterías Logo" 
            className="h-24 w-auto mb-4 object-contain animate-pulse" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLDwS70qO1G09ZgsQ-chUbzKoBWuPsQktcaRujrfCwRFLun7ZEGaITYBpA_zr0m4XgRWxONzTidciaBWoePhpoXEkm_c0lWQkqzHHl1wvG9CfSSRsVPHqHHZIK3EHF7STay-VGst1susV65ExCL1qZnYaliu4JpUXEQn204Ugf9KeJoexBSfYUsh5cAIW0M20lwCFSLbFYj8fAOr4WvAnw-P_YTTxQio6bJtoI9RBLUWrLEqeFJOMjALyjH90-W80EAF9nS2YUgQ"
          />
          <h1 className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-100">
            Leandro Baterías
          </h1>
          <p className="font-sans text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
            {lang === 'ES' ? 'Sistema de Gestión' : 'Management System'}
          </p>
        </div>

        {/* Login Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
          
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label 
              className="font-sans text-xs font-bold text-slate-600 dark:text-slate-400" 
              htmlFor="username"
            >
              {lang === 'ES' ? 'Usuario' : 'Username'}
            </label>
            <div className="relative flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                <User size={16} />
              </span>
              <input 
                className="w-full bg-transparent border-none py-3 pl-10 pr-4 text-slate-900 dark:text-slate-100 text-sm font-sans focus:outline-none focus:ring-0 placeholder:text-slate-400/70"
                id="username" 
                name="username" 
                placeholder={lang === 'ES' ? 'Ingrese su usuario' : 'Enter username'}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label 
              className="font-sans text-xs font-bold text-slate-600 dark:text-slate-400" 
              htmlFor="password"
            >
              {lang === 'ES' ? 'Contraseña' : 'Password'}
            </label>
            <div className="relative flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Lock size={16} />
              </span>
              <input 
                className="w-full bg-transparent border-none py-3 pl-10 pr-10 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-0 placeholder:text-slate-400/50"
                id="password" 
                name="password" 
                placeholder="••••••••" 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                className="absolute right-3 text-slate-400 hover:text-blue-500 transition-colors p-1 rounded focus:outline-none cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-sans font-bold text-sm py-3 rounded-lg border border-blue-500 shadow-md shadow-blue-950/20 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? (lang === 'ES' ? 'Ingresando...' : 'Accessing...') : (lang === 'ES' ? 'Ingresar al Sistema' : 'Access System')}</span>
            <LogIn size={16} className={`${isSubmitting ? 'animate-bounce' : ''}`} />
          </button>
        </form>

        {/* Demo Hint Helper */}
        <div className="mt-4 p-3 w-full bg-blue-500/5 rounded-lg border border-blue-500/10 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            💡 {lang === 'ES' ? 'Para fines del demo, ingresa con' : 'To request access, use'} <strong>admin</strong> / <strong>admin</strong>
          </p>
          <button 
            onClick={autofillAdmin}
            className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
          >
            {lang === 'ES' ? 'Auto-completar Credenciales' : 'Autocomplete Credentials'}
          </button>
        </div>

        {/* Error State Panel */}
        {errorVisible && (
          <div className="mt-4 w-full bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2.5 animate-bounce">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-600 dark:text-red-400 font-sans">
              <strong>{lang === 'ES' ? 'Credenciales incorrectas' : 'Incorrect credentials'}</strong>
              <p className="mt-0.5">{lang === 'ES' ? 'Por favor use admin / admin para acceder.' : 'Please enter admin / admin to access.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Text */}
      <div className="mt-6 text-center select-none">
        <p className="font-sans text-xs text-slate-400 dark:text-slate-500">
          Leandro Baterías - {lang === 'ES' ? 'Sistema de Gestión Interno v3.11' : 'Internal Management System v3.11'}
        </p>
      </div>
    </div>
  );
}
