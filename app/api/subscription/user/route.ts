import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerStripe } from '@/lib/stripe';

/**
 * Endpoint para obtener la información de suscripción del usuario actual
 * GET /api/subscription/user
 */
export async function GET() {
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
    
    // Buscar suscripciones activas del usuario
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error al obtener las suscripciones:', error);
      return NextResponse.json(
        { error: 'Error al obtener las suscripciones' },
        { status: 500 }
      );
    }
    
    // Si no hay suscripciones, devolver un objeto vacío
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ subscription: null });
    }
    
    // Obtener la suscripción más reciente (la primera en el array)
    const latestSubscription = subscriptions[0];
    
    // Verificar si la suscripción está activa en Stripe
    try {
      // Solo obtener detalles de Stripe si hay un ID de suscripción
      if (latestSubscription.stripe_subscription_id) {
        // Obtener cliente de Stripe
        const stripe = await getServerStripe();
        
        const stripeSubscription = await stripe.subscriptions.retrieve(
          latestSubscription.stripe_subscription_id
        );
        
        // Obtener detalles del producto asociado al precio
        const price = await stripe.prices.retrieve(
          latestSubscription.stripe_price_id,
          { expand: ['product'] }
        );
        
        // Combinar la información de Supabase y Stripe
        return NextResponse.json({
          subscription: {
            ...latestSubscription,
            stripe_details: {
              status: stripeSubscription.status,
              current_period_end: new Date(stripeSubscription.current_period_end * 1000),
              cancel_at_period_end: stripeSubscription.cancel_at_period_end,
              product: price.product,
              price: {
                id: price.id,
                unit_amount: price.unit_amount,
                currency: price.currency,
                interval: price.recurring?.interval,
                interval_count: price.recurring?.interval_count,
              }
            }
          }
        });
      }
    } catch (stripeError) {
      console.error('Error al obtener detalles de Stripe:', stripeError);
      // Si hay un error al obtener los detalles de Stripe, devolver solo la información de Supabase
    }
    
    // Si no se pudo obtener la información de Stripe, devolver solo la información de Supabase
    return NextResponse.json({ subscription: latestSubscription });
    
  } catch (error) {
    console.error('Error en el endpoint de suscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
