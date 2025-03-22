"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

/**
 * Componente para seleccionar el idioma de la aplicación utilizando next-intl.
 * Permite al usuario cambiar entre español e inglés.
 * Sigue el principio de Responsabilidad Única al encargarse únicamente de la selección de idioma.
 */
export default function LanguageSelectorNextIntl() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  // Función para cambiar el idioma
  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    // Construir la nueva ruta con el nuevo idioma
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1"
      aria-label={`Cambiar a idioma ${locale === 'es' ? 'inglés' : 'español'}`}
    >
      <Globe className="h-4 w-4" />
      <span className="ml-1">{locale === 'es' ? 'ES' : 'EN'}</span>
    </Button>
  );
}

/**
 * Versión del selector de idioma con etiquetas completas.
 * Muestra el nombre completo del idioma en lugar de la abreviatura.
 */
export function LanguageSelectorFullNextIntl() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  // Función para cambiar el idioma
  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    // Construir la nueva ruta con el nuevo idioma
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label={`Cambiar a idioma ${locale === 'es' ? 'inglés' : 'español'}`}
    >
      <Globe className="h-4 w-4" />
      <span>
        {locale === 'es' ? 'Español' : 'English'}
      </span>
    </Button>
  );
}
