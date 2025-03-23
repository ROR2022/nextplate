import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cancelSubscription } from '@/lib/stripe';
import { updateSubscriptionStatus } from '@/utils/subscription';

/**
 * Endpoint para cancelar una suscripción
 * POST /api/subscription/cancel
 */
export async function POST() {
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
    
    // Buscar la suscripción activa del usuario
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error al obtener la suscripción:', error);
      return NextResponse.json(
        { error: 'Error al obtener la suscripción' },
        { status: 500 }
      );
    }
    
    // Verificar que el usuario tenga una suscripción activa
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró una suscripción activa para este usuario' },
        { status: 404 }
      );
    }
    
    const subscription = subscriptions[0];
    
    // Cancelar la suscripción en Stripe
    await cancelSubscription(subscription.stripe_subscription_id);
    
    // Actualizar el estado de la suscripción en la base de datos
    await updateSubscriptionStatus(supabase, subscription.stripe_subscription_id, 'canceled');
    
    // Devolver la respuesta
    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: 'canceled',
        canceled_at: new Date(),
      }
    });
    
  } catch (error) {
    console.error('Error al cancelar la suscripción:', error);
    return NextResponse.json(
      { error: 'Error al cancelar la suscripción' },
      { status: 500 }
    );
  }
}
