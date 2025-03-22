"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from './languageContext';
import { getContentByKey, ContentStructure } from './contentService';

/**
 * Hook personalizado para acceder al contenido según el idioma actual.
 * Combina el contexto de idioma con el servicio de contenido.
 * Implementa el principio de Responsabilidad Única al separar la lógica de acceso al contenido.
 * 
 * @param contentKey - Clave para acceder al contenido específico (formato: 'seccion.subseccion.propiedad')
 * @returns - El contenido solicitado y un indicador de carga
 */
export function useContent<T extends ContentStructure | string | number | boolean | null = ContentStructure>(contentKey: string): {
  content: T | null;
  isLoading: boolean;
  error: Error | null;
} {
  // Obtener el idioma actual del contexto
  const { language } = useLanguage();
  
  // Estados para el contenido, carga y errores
  const [content, setContent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Efecto para cargar el contenido cuando cambia el idioma o la clave
  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getContentByKey(contentKey, language);
        
        // Solo actualizar el estado si el componente sigue montado
        if (isMounted) {
          setContent(result as T);
          setIsLoading(false);
        }
      } catch (err) {
        // Solo actualizar el estado si el componente sigue montado
        if (isMounted) {
          console.error(`Error loading content for key ${contentKey}:`, err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      }
    };
    
    loadContent();
    
    // Limpieza para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [language, contentKey]);

  return { content, isLoading, error };
}

/**
 * Versión simplificada del hook useContent que no maneja estados de carga o errores.
 * Útil para componentes que no necesitan mostrar estados de carga.
 * 
 * @param contentKey - Clave para acceder al contenido específico
 * @param defaultValue - Valor por defecto si el contenido no está disponible
 * @returns - El contenido solicitado o el valor por defecto
 */
export function useContentSimple<T extends ContentStructure | string | number | boolean | null = ContentStructure>(contentKey: string, defaultValue: T): T {
  const { content } = useContent<T>(contentKey);
  return content !== null ? content : defaultValue;
}
