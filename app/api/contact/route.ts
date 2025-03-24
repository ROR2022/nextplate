import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * API para manejar el envío de formularios de contacto
 * POST /api/contact
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { name, email, message } = await request.json();
    
    // Validar los datos requeridos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Se requieren todos los campos' },
        { status: 400 }
      );
    }
    
    // Validar formato de email (básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }
    
    // Crear cliente de Supabase
    const supabase = await createClient();
    
    // Guardar el mensaje en la base de datos (asumiendo que existe una tabla 'contact_messages')
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        { name, email, message, created_at: new Date().toISOString() }
      ]);
    
    if (error) {
      console.error('Error al guardar el mensaje de contacto:', error);
      return NextResponse.json(
        { error: 'Error al procesar el mensaje' },
        { status: 500 }
      );
    }
    
    // Aquí podrías añadir código para enviar un email de notificación usando Mailgun
    // Ejemplo:
    // await sendEmail({
    //   to: 'admin@yourdomain.com',
    //   subject: `Nuevo mensaje de contacto de ${name}`,
    //   text: `Mensaje de ${name} (${email}):\n\n${message}`
    // });
    
    return NextResponse.json({ 
      success: true,
      message: 'Mensaje enviado con éxito'
    });
    
  } catch (error) {
    console.error('Error en endpoint de contacto:', error);
    return NextResponse.json(
      { error: 'Error del servidor al procesar la solicitud' },
      { status: 500 }
    );
  }
} 