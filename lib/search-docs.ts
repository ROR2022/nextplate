import { promises as fs } from 'fs';
import path from 'path';

// Estructura para los documentos y su contenido
export interface DocContent {
  id: string;
  title: string;
  path: string;
  section: string;
  content: string;
  relevanceScore?: number;
}

// Caché de documentos indexados
let docsCache: DocContent[] | null = null;

/**
 * Extrae textos de traducción de un string de contenido
 */
function extractTranslationKeys(content: string): string[] {
  // Buscar patrones como t("key.subkey") o t('key.subkey')
  const tFunctionPattern = /t\(['"]([.\w]+)['"]\)/g;
  const matches = content.match(tFunctionPattern) || [];
  
  // Extraer solo las claves de los matches
  return matches.map(match => {
    const keyMatch = match.match(/t\(['"]([.\w]+)['"]\)/);
    return keyMatch ? keyMatch[1] : '';
  }).filter(key => key !== '');
}

/**
 * Extrae contenido de los fragmentos de texto entre etiquetas JSX
 */
function extractTextFromJSX(content: string): string {
  // Buscar texto entre etiquetas cerradas (simplificado)
  const textBetweenTags = content.match(/>([^<>]+)</g) || [];
  
  return textBetweenTags
    .map(match => match.replace(/^>|<$/g, '').trim())
    .filter(text => text.length > 5) // Filtrar textos muy cortos
    .join(' ');
}

/**
 * Obtiene el contenido de un archivo de documentación 
 */
export async function getDocContent(locale: string, section: string, docPath: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'app', '[locale]', 'docs', section, `${docPath || 'page'}.tsx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Extraer párrafos o textos largos - busca textos entre comillas
    const quotedTexts = fileContent.match(/["']([^\n"']{15,}?)["']/g) || [];
    const extractedQuotes = quotedTexts
      .map(quote => quote.replace(/^["']|["']$/g, '').trim())
      .filter(text => text.length > 15) // Solo textos significativos
      .join(' ');
    
    // Extraer claves de traducción
    const translationKeys = extractTranslationKeys(fileContent);
    
    // Extraer texto de JSX
    const jsxText = extractTextFromJSX(fileContent);

    // Intentar leer el archivo de traducción del idioma actual
    let translatedContent = '';
    try {
      // Cargar archivo de traducciones
      const translationPath = path.join(process.cwd(), 'locales', locale, 'index.json');
      const translationContent = await fs.readFile(translationPath, 'utf8');
      const translations = JSON.parse(translationContent);

      // Función recursiva para encontrar una clave de traducción anidada
      const getNestedTranslation = (obj: Record<string, any>, key: string): string => {
        const parts = key.split('.');
        let current = obj;
        
        for (const part of parts) {
          if (!current[part]) {
            return '';
          }
          current = current[part];
        }
        
        return typeof current === 'string' ? current : '';
      };

      // Obtener los textos traducidos para las claves encontradas
      const translatedTexts = translationKeys
        .map(key => {
          // Para claves de docs, añadir el prefijo si no lo tienen
          const fullKey = key.startsWith('docs.') ? key : `docs.${key}`;
          return getNestedTranslation(translations, fullKey);
        })
        .filter(text => text.length > 0);
      
      translatedContent = translatedTexts.join(' ');
    } catch (error) {
      console.error(`Error al leer traducciones para ${locale}:`, error);
    }
    
    // Combinar todo el contenido extraído
    const combinedContent = [
      extractedQuotes,
      translatedContent,
      jsxText
    ].filter(text => text.length > 0).join(' ');
    
    // Si no hay contenido significativo, usar el enfoque anterior
    if (combinedContent.length < 50) {
      // Método anterior como fallback
      return fileContent
        .replace(/import.*?;/g, '')
        .replace(/<.*?>/g, ' ')
        .replace(/\{.*?\}/g, ' ')
        .replace(/export.*?{/g, ' ')
        .replace(/}/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    return combinedContent;
  } catch (error) {
    console.error(`Error al leer el contenido del documento ${section}/${docPath}:`, error);
    return '';
  }
}

/**
 * Indexa todos los documentos disponibles
 */
export async function indexAllDocs(locale: string): Promise<DocContent[]> {
  if (docsCache) {
    return docsCache;
  }
  
  const docStructure = [
    { title: "Introducción", path: "", section: "getting-started" },
    { title: "Instalación", path: "/installation", section: "getting-started" },
    { title: "Inicio Rápido", path: "/quick-start", section: "getting-started" },
    { title: "Resumen", path: "", section: "architecture" },
    { title: "Frontend", path: "/frontend", section: "architecture" },
    { title: "Backend", path: "/backend", section: "architecture" },
    { title: "SOLID", path: "", section: "best-practices" },
    { title: "Código Limpio", path: "/clean-code", section: "best-practices" },
    { title: "Patrones", path: "/patterns", section: "best-practices" },
    { title: "Supabase", path: "", section: "configuration" },
    { title: "Mailgun", path: "/mailgun", section: "configuration" },
    { title: "Stripe", path: "/stripe", section: "configuration" },
    { title: "OpenAI", path: "/openai", section: "configuration" },
    { title: "Flujo de Trabajo", path: "", section: "development" },
    { title: "Fases", path: "/phases", section: "development" },
    { title: "Testing", path: "/testing", section: "development" },
    { title: "Deployment", path: "/deployment", section: "development" },
    { title: "I18n", path: "/i18n", section: "development" },
    { title: "API Overview", path: "", section: "api" },
    { title: "Auth", path: "/auth", section: "api" },
    { title: "Users", path: "/users", section: "api" },
    { title: "Payments", path: "/payments", section: "api" },
    { title: "Webhooks", path: "/webhooks", section: "api" },
    { title: "UI Components", path: "", section: "components" },
    { title: "Layout", path: "/layout", section: "components" },
    { title: "Forms", path: "/forms", section: "components" },
    { title: "Data", path: "/data", section: "components" },
  ];

  const docs: DocContent[] = [];
  
  for (const doc of docStructure) {
    // Obtener textos traducidos para el título
    let docTitle = doc.title;
    
    // Intentar cargar el título traducido para este documento
    try {
      const translationsFile = await fs.readFile(path.join(process.cwd(), 'locales', locale, 'index.json'), 'utf8');
      const translations = JSON.parse(translationsFile);
      
      // Construir la clave para este documento - por ejemplo, 'docs.sidebar.solid' para best-practices/solid
      let translationKey = `docs.sidebar.${doc.section}`;
      if (doc.path && doc.path.length > 1) {
        // Si hay un subpath, usar la última parte como clave
        const keyPart = doc.path.replace('/', '');
        translationKey = `docs.sidebar.${keyPart}`;
      }
      
      // Buscar traducción de forma recursiva
      const getPropByPath = (obj: Record<string, any>, path: string): string => {
        const parts = path.split('.');
        let current = obj;
        
        for (const part of parts) {
          if (!current[part]) {
            return '';
          }
          current = current[part];
        }
        
        if (typeof current === 'string') {
          return current;
        }
        
        return '';
      };
      
      const translatedTitle = getPropByPath(translations, translationKey);
      if (translatedTitle) {
        docTitle = translatedTitle;
      }
    } catch (error) {
      console.error(`Error al obtener traducción para ${doc.section}${doc.path}:`, error);
    }
    
    const docId = `${doc.section}${doc.path}`;
    const content = await getDocContent(locale, doc.section, doc.path.replace('/', ''));
    
    docs.push({
      id: docId,
      title: docTitle, // Usar el título traducido
      path: doc.path,
      section: doc.section,
      content
    });
  }
  
  docsCache = docs;
  return docs;
}

/**
 * Función de búsqueda en la documentación
 */
export async function searchDocsContent(query: string, locale: string, maxResults = 3): Promise<DocContent[]> {
  if (!query.trim()) {
    return [];
  }
  
  const docs = await indexAllDocs(locale);
  const lowerQuery = query.toLowerCase();
  
  // Dividir la consulta en palabras clave
  const keywords = lowerQuery.split(/\s+/);
  
  // Buscar coincidencias y calificar su relevancia
  const results = docs.map(doc => {
    const lowerContent = doc.content.toLowerCase();
    const lowerTitle = doc.title.toLowerCase();
    
    // Calcular puntuación de relevancia (simplificado)
    let score = 0;
    
    // Coincidencia exacta en título
    if (lowerTitle.includes(lowerQuery)) {
      score += 10;
    }
    
    // Coincidencia de palabras clave en título
    keywords.forEach(keyword => {
      if (lowerTitle.includes(keyword)) {
        score += 5;
      }
    });
    
    // Coincidencia exacta en contenido
    if (lowerContent.includes(lowerQuery)) {
      score += 3;
    }
    
    // Coincidencia de palabras clave en contenido
    keywords.forEach(keyword => {
      if (keyword.length > 2) { // Ignorar palabras muy cortas
        const keywordMatches = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
        score += keywordMatches * 0.5;
      }
    });
    
    return {
      ...doc,
      relevanceScore: score
    };
  });
  
  // Filtrar resultados sin puntuación y ordenar por relevancia
  return results
    .filter(doc => doc.relevanceScore! > 0)
    .sort((a, b) => b.relevanceScore! - a.relevanceScore!)
    .slice(0, maxResults);
}

/**
 * Extrae snippets relevantes del contenido del documento
 */
export function extractRelevantSnippets(doc: DocContent, query: string, maxLength = 250): string {
  const lowerContent = doc.content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Dividir el contenido en oraciones y párrafos significativos
  const sentences = doc.content
    .replace(/\s+/g, ' ')
    .split(/[.!?]/)
    .filter(s => s.trim().length > 20) // Filtrar oraciones muy cortas
    .map(s => s.trim() + '.'); // Añadir punto final
  
  // Buscar oraciones relevantes que contengan términos de búsqueda
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    // Si contiene la consulta exacta
    if (lowerSentence.includes(lowerQuery)) {
      return true;
    }
    
    // Si contiene palabras clave de la consulta
    const keywords = lowerQuery.split(/\s+/);
    let keywordMatches = 0;
    
    keywords.forEach(keyword => {
      if (keyword.length > 2 && lowerSentence.includes(keyword)) {
        keywordMatches++;
      }
    });
    
    // Requerir al menos dos coincidencias para consultas multi-palabra
    return keywords.length > 1 ? keywordMatches >= 2 : keywordMatches > 0;
  });
  
  // Si encontramos oraciones relevantes, usarlas
  if (relevantSentences.length > 0) {
    // Limitar la cantidad de oraciones a mostrar (máximo 2-3)
    const snippets = relevantSentences.slice(0, 3).join(' ');
    // Truncar si es demasiado largo
    if (snippets.length > maxLength) {
      return snippets.substring(0, maxLength) + '...';
    }
    return snippets;
  }
  
  // Método anterior como fallback si no encontramos oraciones relevantes
  // Encontrar la posición de la consulta en el contenido
  const position = lowerContent.indexOf(lowerQuery);
  
  if (position === -1) {
    // Si no hay coincidencia exacta, usar el inicio del documento
    if (sentences.length > 0) {
      // Usar las primeras oraciones significativas
      return sentences.slice(0, 2).join(' ');
    }
    return doc.content.slice(0, maxLength) + '...';
  }
  
  // Calcular el rango del snippet
  const start = Math.max(0, position - 50);
  const end = Math.min(doc.content.length, position + maxLength - 50);
  
  // Extraer y limpiar el snippet
  let snippet = doc.content.slice(start, end);
  
  // Añadir elipsis si el snippet no empieza/termina al inicio/final del documento
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < doc.content.length) {
    snippet = snippet + '...';
  }
  
  return snippet;
} 