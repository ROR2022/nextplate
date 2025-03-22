"use client";

import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from "@/components/theme-switcher";
import LanguageSelectorNextIntl from "@/components/language-selector-next-intl";
import Link from "next/link";

// Tipo para los enlaces del footer
type FooterLink = {
  text: string;
  url: string;
};

/**
 * Componente para mostrar el pie de página de la landing page.
 * Muestra enlaces y copyright de NextPlate.
 * Utiliza next-intl para las traducciones.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de mostrar el pie de página.
 */
export default function Footer() {
  // Obtener las traducciones usando next-intl
  const t = useTranslations('landing.footer');

  // Obtener los enlaces desde las traducciones
  const links: FooterLink[] = [
    {
      text: t('links.0.text'),
      url: t('links.0.url')
    },
    {
      text: t('links.1.text'),
      url: t('links.1.url')
    },
    {
      text: t('links.2.text'),
      url: t('links.2.url')
    },
    {
      text: t('links.3.text'),
      url: t('links.3.url')
    },
    {
      text: t('links.4.text'),
      url: t('links.4.url')
    }
  ];

  return (
    <footer className="w-full py-8 border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            {t('copyright')}
          </div>

          {/* Enlaces */}
          <nav className="flex flex-wrap gap-6 justify-center">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Selectores de idioma y tema */}
          <div className="flex items-center gap-4">
            <LanguageSelectorNextIntl />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
