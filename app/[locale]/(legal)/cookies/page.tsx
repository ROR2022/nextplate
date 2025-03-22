"use client";

import LegalDocumentComponent from "@/components/legal-document";

/**
 * Página de Política de Cookies
 * Utiliza el componente LegalDocument para mostrar el contenido de la política de cookies
 * siguiendo el principio de Responsabilidad Única al delegar la presentación al componente.
 */
export default function CookiesPage() {
  return (
    <main className="container mx-auto py-8">
      <LegalDocumentComponent contentKey="legal.cookies" />
    </main>
  );
}
