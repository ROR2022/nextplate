"use client";

import LegalDocumentComponent from "@/components/legal-document";

/**
 * Página de Política de Privacidad
 * Utiliza el componente LegalDocument para mostrar el contenido de la política de privacidad
 * siguiendo el principio de Responsabilidad Única al delegar la presentación al componente.
 */
export default function PrivacyPage() {
  return (
    <main className="container mx-auto py-8">
      <LegalDocumentComponent contentKey="legal.privacy" />
    </main>
  );
}
