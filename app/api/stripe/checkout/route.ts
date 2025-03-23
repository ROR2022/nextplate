import { NextRequest, NextResponse } from 'next/server';
import { createSubscriptionCheckout } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';

/**
 * Ruta API para crear una sesión de checkout de Stripe para suscripciones
 * POST /api/stripe/checkout
 */
export async function POST(request: NextRequest) {
  // console.log('[CHECKOUT] Starting checkout session creation');
  
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { priceId, successUrl, cancelUrl } = await request.json();
    // console.log('[CHECKOUT] Received request data:', { priceId, successUrl, cancelUrl });

    // Validar los datos requeridos
    if (!priceId) {
      // console.error('[CHECKOUT] Missing price ID');
      return NextResponse.json(
        { error: 'Se requiere el ID del precio' },
        { status: 400 }
      );
    }

    if (!successUrl || !cancelUrl) {
      // console.error('[CHECKOUT] Missing redirect URLs');
      return NextResponse.json(
        { error: 'Se requieren las URLs de redirección' },
        { status: 400 }
      );
    }

    // Obtener el usuario autenticado
    // console.log('[CHECKOUT] Getting authenticated user');
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      // console.error('[CHECKOUT] Error getting user:', userError);
    }

    if (!user) {
      // console.error('[CHECKOUT] User not authenticated');
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }
    
    // console.log(`[CHECKOUT] User authenticated: ${user.id}, ${user.email}`);

    // Obtener el perfil del usuario para verificar si ya tiene un customer_id en Stripe
    // console.log(`[CHECKOUT] Getting user profile`);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      // console.error('[CHECKOUT] Error getting user profile:', profileError);
      return NextResponse.json(
        { error: 'Error al obtener los datos del usuario' },
        { status: 500 }
      );
    }

    // Usar el customerId existente o null para que Stripe cree uno nuevo
    const customerId = profile?.stripe_customer_id || undefined;
    // console.log(`[CHECKOUT] Using customer ID: ${customerId || 'New customer will be created'}`);

    // Agregar metadatos para vincular la suscripción con el usuario
    const metadata = {
      userId: user.id,
      email: user.email || ''
    };
    // console.log(`[CHECKOUT] Setting metadata:`, metadata);

    // Crear la sesión de checkout
    // console.log(`[CHECKOUT] Creating checkout session with price ID: ${priceId}`);
    const { sessionId } = await createSubscriptionCheckout({
      priceId,
      customerId,
      successUrl,
      cancelUrl,
      metadata
    });
    
    // console.log(`[CHECKOUT] Checkout session created: ${sessionId}`);

    // Devolver el ID de la sesión
    return NextResponse.json({ sessionId });
  } catch (error) {
    // console.error('[CHECKOUT] Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: 'Error al crear la sesión de checkout', details: errorMessage },
      { status: 500 }
    );
  }
}
