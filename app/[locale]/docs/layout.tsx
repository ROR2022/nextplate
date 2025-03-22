import { ReactNode } from "react";
import DocSidebar from "./components/doc-sidebar";

interface DocsLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function DocsLayout({
  children,
  params,
}: DocsLayoutProps) {
  // Extraer el locale directamente de params
  const { locale } = params;

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-10">
        <DocSidebar locale={locale} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
