"use client";

import React from 'react';
import { useLanguage } from '@/utils/languageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

/**
 * Componente para seleccionar el idioma de la aplicación.
 * Permite al usuario cambiar entre español e inglés.
 * Sigue el principio de Responsabilidad Única al encargarse únicamente de la selección de idioma.
 */
export default function LanguageSelector() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1"
      aria-label={`Cambiar a idioma ${language === 'es' ? 'inglés' : 'español'}`}
    >
      <Globe className="h-4 w-4" />
      <span className="ml-1">{language === 'es' ? 'ES' : 'EN'}</span>
    </Button>
  );
}

/**
 * Versión del selector de idioma con etiquetas completas.
 * Muestra el nombre completo del idioma en lugar de la abreviatura.
 */
export function LanguageSelectorFull() {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label={`Cambiar a idioma ${language === 'es' ? 'inglés' : 'español'}`}
    >
      <Globe className="h-4 w-4" />
      <span>
        {language === 'es' ? 'Español' : 'English'}
      </span>
    </Button>
  );
}

/**
 * Versión del selector de idioma como menú desplegable.
 * Útil cuando se tienen más de dos idiomas.
 */
export function LanguageSelectorMenu() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="relative inline-block text-left">
      <Button
        variant="outline"
        className="flex items-center gap-2"
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'es' ? 'Español' : 'English'}</span>
      </Button>
      
      <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <button
            onClick={() => setLanguage('es')}
            className={`block px-4 py-2 text-sm w-full text-left ${language === 'es' ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
            role="menuitem"
          >
            Español
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`block px-4 py-2 text-sm w-full text-left ${language === 'en' ? 'bg-accent text-accent-foreground' : 'text-foreground'}`}
            role="menuitem"
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
