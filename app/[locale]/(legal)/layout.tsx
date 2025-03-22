"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Layout para las páginas legales
 * Proporciona una estructura común para todas las páginas legales
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de la estructura de las páginas legales
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Efecto para hacer scroll al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
