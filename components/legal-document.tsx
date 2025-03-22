"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useLocale } from 'next-intl';
import { getContentByKey } from "@/utils/contentService";
import type { Language } from "@/utils/contentService";

// Tipos para las secciones legales
export type LegalSection = {
  title: string;
  content: string | string[];
  subsections?: LegalSection[];
};

// Tipo para el documento legal completo
export type LegalDocument = {
  title: string;
  lastUpdated: string;
  introduction: string;
  sections: LegalSection[];
};

type LegalDocumentProps = {
  contentKey: string; // Clave para acceder al contenido (ej: 'legal.terms')
};

/**
 * Componente para mostrar documentos legales con formato estructurado.
 * Implementa el principio de Responsabilidad Única al encargarse únicamente de renderizar documentos legales.
 * Sigue el principio de Abierto/Cerrado al ser extensible para diferentes tipos de documentos legales.
 */
export default function LegalDocumentComponent({ contentKey }: LegalDocumentProps) {
  const [content, setContent] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale() as Language;
  const [mounted, setMounted] = useState(false);

  // Cargar el contenido basado en la clave y el idioma actual
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const legalContent = await getContentByKey(contentKey, locale) as LegalDocument;
        setContent(legalContent);
      } catch (error) {
        console.error(`Error loading content for key ${contentKey}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      loadContent();
    }
  }, [contentKey, locale, mounted]);

  // Asegurar que el componente solo se renderice en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Renderizar un estado de carga
  if (isLoading || !content) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-pulse">
        <div className="h-10 bg-muted rounded-md w-3/4 mb-8"></div>
        <div className="h-6 bg-muted rounded-md w-1/4 mb-4"></div>
        <div className="space-y-4 mt-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 bg-muted rounded-md w-1/2"></div>
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-full"></div>
              <div className="h-4 bg-muted rounded-md w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Función para renderizar párrafos de contenido
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((paragraph, idx) => (
        <p key={idx} className="mb-4">
          {paragraph}
        </p>
      ));
    }
    return <p className="mb-4">{content}</p>;
  };

  // Función recursiva para renderizar secciones y subsecciones
  const renderSection = (section: LegalSection, level = 2) => {
    // Crear el elemento de encabezado dinámicamente basado en el nivel
    const headingLevel = Math.min(level, 6);
    
    return (
      <div key={section.title} className="mb-8">
        {headingLevel === 2 && <h2 className="font-semibold mb-4 text-xl">{section.title}</h2>}
        {headingLevel === 3 && <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>}
        {headingLevel === 4 && <h4 className="font-semibold mb-4 text-lg">{section.title}</h4>}
        {headingLevel === 5 && <h5 className="font-semibold mb-4 text-lg">{section.title}</h5>}
        {headingLevel === 6 && <h6 className="font-semibold mb-4 text-lg">{section.title}</h6>}
        
        <div className="text-muted-foreground">
          {renderContent(section.content)}
        </div>
        {section.subsections && (
          <div className="ml-6 mt-4">
            {section.subsections.map(subsection => 
              renderSection(subsection, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {locale === 'es' ? 'Última actualización' : 'Last updated'}: {content.lastUpdated}
      </p>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="mb-8">
          {renderContent(content.introduction)}
        </div>
        
        {content.sections.map(section => renderSection(section))}
      </div>
    </div>
  );
}
