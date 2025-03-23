import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createBillingPortalSession } from '@/lib/stripe';

/**
 * Endpoint para crear una sesión del portal de facturación de Stripe
 * POST /api/subscription/billing-portal
 */
export async function POST(request: NextRequest) {
  try {
    // Crear cliente de Supabase
    const supabase = await createClient();
    
    // Verificar que el usuario esté autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener el body de la solicitud
    const { returnUrl } = await request.json();
    
    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Se requiere una URL de retorno' },
        { status: 400 }
      );
    }
    
    // Buscar el ID de cliente de Stripe del usuario
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error al obtener el cliente de Stripe:', error);
      return NextResponse.json(
        { error: 'Error al obtener el cliente de Stripe' },
        { status: 500 }
      );
    }
    
    // Verificar que el usuario tenga un ID de cliente de Stripe
    if (!subscriptions || subscriptions.length === 0 || !subscriptions[0].stripe_customer_id) {
      return NextResponse.json(
        { error: 'No se encontró un cliente de Stripe para este usuario' },
        { status: 404 }
      );
    }
    
    const customerId = subscriptions[0].stripe_customer_id;
    
    // Crear una sesión del portal de facturación
    const { url } = await createBillingPortalSession({
      customerId,
      returnUrl,
    });
    
    // Devolver la URL del portal
    return NextResponse.json({ url });
    
  } catch (error) {
    console.error('Error al crear la sesión del portal de facturación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
