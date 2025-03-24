"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

/**
 * Componente que agrupa los selectores de idioma y tema en un menú desplegable.
 * Implementa el principio de Composición sobre Herencia al combinar funcionalidades.
 * Sigue el principio de Responsabilidad Única al encargarse únicamente de la gestión de configuraciones.
 */
export default function SettingsMenu() {
  // Estado para controlar si el componente está montado
  const [mounted, setMounted] = useState(false);
  
  // Hooks para tema e idioma
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  // Traducciones
  const t = useTranslations('common');

  // Función para cambiar el idioma
  const changeLanguage = (newLocale: string) => {
    // Obtener la ruta actual sin el locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Construir la nueva ruta con el nuevo locale
    const newPath = `/${newLocale}${pathWithoutLocale || '/'}`;
    
    // Navegar a la nueva ruta
    router.push(newPath);
  };

  // useEffect solo se ejecuta en el cliente, ahora podemos mostrar la UI con seguridad
  useEffect(() => {
    setMounted(true);
  }, []);

  // No renderizar nada hasta que el componente esté montado
  if (!mounted) {
    return null;
  }
//md:not-sr-only md:ml-1
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span className="not-sr-only ml-1">{t('preferences')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('settings')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Grupo de selección de idioma */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pl-2">
            {t('language')}
          </DropdownMenuLabel>
          <DropdownMenuItem 
            className={`flex items-center gap-2 ${locale === 'es' ? 'bg-accent' : ''}`}
            onClick={() => changeLanguage('es')}
          >
            <Globe className="h-4 w-4" />
            <span>Español</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`flex items-center gap-2 ${locale === 'en' ? 'bg-accent' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            <Globe className="h-4 w-4" />
            <span>English</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Grupo de selección de tema */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pl-2">
            {t('theme')}
          </DropdownMenuLabel>
          <DropdownMenuItem 
            className={`flex items-center gap-2 ${theme === 'light' ? 'bg-accent' : ''}`}
            onClick={() => setTheme('light')}
          >
            <Sun className="text-muted-foreground" />
            <span>{t('light')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-accent' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <Moon className="text-muted-foreground" />
            <span>{t('dark')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className={`flex items-center gap-2 ${theme === 'system' ? 'bg-accent' : ''}`}
            onClick={() => setTheme('system')}
          >
            <Settings className="text-muted-foreground" />
            <span>{t('system')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
