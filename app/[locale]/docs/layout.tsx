import { ReactNode } from "react";
import DocSidebar from "./components/doc-sidebar";
import DocSearch from "./components/doc-search";
import DocMobileNav from "./components/doc-mobile-nav";

interface DocsLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsLayout({
  children,
  params,
}: DocsLayoutProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;

  return (
    <div className="container py-4 px-3 sm:py-6 md:py-10 md:px-4">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Sidebar para desktop - oculto en móvil */}
        <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-20">
            <DocSidebar locale={locale} />
          </div>
        </div>
        
        {/* Contenido principal y barra superior móvil */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center justify-between gap-2 mb-4 md:mb-6 w-full">
            <DocMobileNav locale={locale} />
            <div className="flex-1 max-w-[calc(100%-65px)]">
              <DocSearch locale={locale} />
            </div>
          </div>
          
          <main className="overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
