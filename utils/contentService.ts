/**
 * Content Service
 * 
 * Este servicio maneja la carga de contenido basado en archivos JSON según el idioma seleccionado.
 * Sigue el patrón Singleton para garantizar una única instancia del servicio.
 * Implementa principios SOLID, especialmente el Principio de Responsabilidad Única.
 */

// Tipos para el contenido
export type Language = 'es' | 'en';

// Interfaz para la estructura del contenido
export interface ContentStructure {
  [key: string]: string | number | boolean | ContentStructure | Array<string | number | boolean | ContentStructure>;
}

// Interfaz para el servicio de contenido
export interface ContentService {
  getContent: (language: Language) => Promise<ContentStructure>;
  getCurrentLanguage: () => Language;
  setCurrentLanguage: (language: Language) => void;
}

// Implementación del servicio de contenido como Singleton
class ContentServiceImpl implements ContentService {
  private static instance: ContentServiceImpl;
  private currentLanguage: Language = 'es'; // Idioma por defecto
  private contentCache: Record<Language, ContentStructure | null> = {
    es: null,
    en: null
  };

  private constructor() {}

  // Método para obtener la instancia única (patrón Singleton)
  public static getInstance(): ContentServiceImpl {
    if (!ContentServiceImpl.instance) {
      ContentServiceImpl.instance = new ContentServiceImpl();
    }
    return ContentServiceImpl.instance;
  }

  // Obtener el contenido según el idioma
  public async getContent(language: Language): Promise<ContentStructure> {
    try {
      // Si ya está en caché, devolver directamente
      if (this.contentCache[language]) {
        return this.contentCache[language] as ContentStructure;
      }
      
      // Cargar el contenido desde el archivo JSON
      const content = await import(`../content/${language}.json`) as { default: ContentStructure };
      
      // Guardar en caché para futuros accesos
      this.contentCache[language] = content.default;
      
      return content.default;
    } catch (error) {
      console.error(`Error loading content for language ${language}:`, error);
      // Fallback al idioma por defecto si hay error
      if (language !== 'es') {
        return this.getContent('es');
      }
      throw new Error(`Failed to load content for language ${language}`);
    }
  }

  // Obtener el idioma actual
  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  // Establecer el idioma actual
  public setCurrentLanguage(language: Language): void {
    this.currentLanguage = language;
  }
}

// Exportar la instancia única del servicio
export const contentService = ContentServiceImpl.getInstance();

// Función helper para obtener contenido específico por clave
export async function getContentByKey(key: string, language: Language = 'es'): Promise<ContentStructure | string | number | boolean | null> {
  const content = await contentService.getContent(language);
  
  // Dividir la clave por puntos para acceder a propiedades anidadas
  const keys = key.split('.');
  let result: unknown = content;
  
  // Navegar por el objeto usando las claves
  for (const k of keys) {
    if (result && typeof result === 'object' && result !== null && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      console.warn(`Key ${key} not found in content for language ${language}`);
      return null;
    }
  }
  
  return result as ContentStructure | string | number | boolean | null;
}
