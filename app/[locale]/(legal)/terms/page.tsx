"use client";

import LegalDocumentComponent from "@/components/legal-document";
//import { Metadata } from "next";

/**
 * Página de Términos y Condiciones
 * Utiliza el componente LegalDocument para mostrar el contenido de los términos y condiciones
 * siguiendo el principio de Responsabilidad Única al delegar la presentación al componente.
 */
export default function TermsPage() {
  return (
    <main className="container mx-auto py-8">
      <LegalDocumentComponent contentKey="legal.terms" />
    </main>
  );
}
