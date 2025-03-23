import { NextRequest, NextResponse } from 'next/server';
import { getServerStripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { syncSubscription } from '@/utils/stripe-sync';

/**
 * Ruta API para sincronizar manualmente una suscripción
 * POST /api/stripe/sync
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener los datos del cuerpo de la solicitud
    const { checkoutSessionId } = await request.json();
    
    if (!checkoutSessionId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere el ID de la sesión de checkout' },
        { status: 400 }
      );
    }
    
    // Obtener el ID de la suscripción de la sesión de checkout
    const stripe = await getServerStripe();
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ['subscription']
    });
    
    if (!session || !session.subscription) {
      return NextResponse.json(
        { success: false, error: 'No se encontró una suscripción en la sesión de checkout' },
        { status: 404 }
      );
    }
    
    const subscriptionId = typeof session.subscription === 'string' 
      ? session.subscription 
      : session.subscription.id;
    
    // Verificar si hay metadatos en la sesión (como el ID de usuario)
    if (session.metadata && Object.keys(session.metadata).length > 0) {
      // Verificar que el ID de usuario coincida
      if (session.metadata.userId && session.metadata.userId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'No autorizado para sincronizar esta suscripción' },
          { status: 403 }
        );
      }
    }
    
    // Sincronizar la suscripción
    const result = await syncSubscription(supabase, subscriptionId);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Suscripción sincronizada correctamente',
      subscription: result.subscription
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, error: 'Error al sincronizar la suscripción', details: errorMessage },
      { status: 500 }
    );
  }
} 