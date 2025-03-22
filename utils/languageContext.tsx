"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, contentService } from './contentService';

// Interfaz para el contexto de idioma
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props para el proveedor de contexto
interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

/**
 * Proveedor de contexto para gestionar el idioma en toda la aplicación.
 * Sigue el patrón de diseño Context para proporcionar estado global.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children, 
  initialLanguage = 'es' 
}) => {
  // Estado para el idioma actual
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  // Efecto para inicializar el idioma desde localStorage si está disponible
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
        contentService.setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  // Función para cambiar el idioma
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    contentService.setCurrentLanguage(newLanguage);
    
    // Guardar en localStorage para persistencia
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };

  // Función para alternar entre idiomas
  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(newLanguage);
  };

  // Valor del contexto
  const value = {
    language,
    setLanguage,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de idioma.
 * Proporciona una forma sencilla de acceder y modificar el idioma actual.
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
