import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchDocsContent, extractRelevantSnippets } from '@/lib/search-docs';

// Configurar el cliente de OpenAI con la API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Ruta API para el chatbot con OpenAI
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el mensaje y opciones del cuerpo de la solicitud
    const { message, locale = 'es', useOpenAI = false, skipDocs = false } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Se requiere un mensaje' },
        { status: 400 }
      );
    }

    // Si se solicita explícitamente usar OpenAI o saltar la búsqueda en docs
    if (useOpenAI || skipDocs) {
      return await getOpenAIResponse(message, locale);
    }

    // Buscar primero en la documentación
    const searchResults = await searchDocsContent(message, locale, 3);
    
    // Si encontramos resultados relevantes, los devolvemos como sugerencias
    if (searchResults && searchResults.length > 0) {
      const suggestions = searchResults.map(doc => {
        // Extraer snippet relevante del documento
        const snippet = extractRelevantSnippets(doc, message);
        
        return {
          title: doc.title,
          section: doc.section,
          path: `/${locale}/docs/${doc.section}${doc.path}`,
          snippet
        };
      });
      
      return NextResponse.json({
        reply: formatDocSuggestions(suggestions, locale),
        suggestions,
        fromDocs: true
      });
    }
    
    // Si no hay resultados en la documentación, usar OpenAI
    return await getOpenAIResponse(message, locale);
  } catch (error) {
    console.error('Error en el chatbot:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * Obtiene una respuesta de OpenAI
 */
async function getOpenAIResponse(message: string, locale: string) {
  // Verificar que existe API key
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'La API key de OpenAI no está configurada', isMissingApiKey: true },
      { status: 500 }
    );
  }

  // Texto del sistema según el idioma
  const systemContent = locale === 'en' 
    ? "You are a friendly and helpful assistant for NextPlate, an advanced boilerplate for web applications. Answer concisely and directly."
    : "Eres un asistente amigable y útil para NextPlate, un boilerplate avanzado para aplicaciones web. Responde de manera concisa y directa.";

  // Enviar solicitud a OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  // Extraer la respuesta
  const reply = response.choices[0].message.content;

  return NextResponse.json({ 
    reply,
    fromDocs: false
  });
}

/**
 * Formatea las sugerencias de documentación en un mensaje amigable
 */
function formatDocSuggestions(suggestions: any[], locale: string): string {
  if (!suggestions || suggestions.length === 0) {
    return locale === 'en' 
      ? "I couldn't find specific information about that in our documentation."
      : "No pude encontrar información específica sobre eso en nuestra documentación.";
  }
  
  const intro = locale === 'en'
    ? "I found some relevant information in our documentation:"
    : "Encontré información relevante en nuestra documentación:";
    
  const suggestionTexts = suggestions.map((s, i) => {
    return `\n\n${i + 1}. **${s.title}** (${locale === 'en' ? 'Section' : 'Sección'}: ${s.section}):\n"${s.snippet}"\n[${locale === 'en' ? 'Read more' : 'Leer más'}](${s.path})`;
  }).join('');
  
  const askOpenAI = locale === 'en'
    ? "\n\nWould you like me to provide a more specific answer using AI?"
    : "\n\n¿Te gustaría que te proporcione una respuesta más específica usando IA?";
    
  return `${intro}${suggestionTexts}${askOpenAI}`;
} 