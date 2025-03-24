import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
    // Obtener el mensaje del cuerpo de la solicitud
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Se requiere un mensaje' },
        { status: 400 }
      );
    }

    // Verificar que existe API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'La API key de OpenAI no está configurada', isMissingApiKey: true },
        { status: 500 }
      );
    }

    // Enviar solicitud a OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente amigable y útil para NextPlate, un boilerplate avanzado para aplicaciones web. Responde de manera concisa y directa." },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    // Extraer la respuesta
    const reply = response.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error en el chatbot:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: errorMessage },
      { status: 500 }
    );
  }
} 