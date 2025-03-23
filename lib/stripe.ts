/**
 * Utilidad para interactuar con la API de Stripe
 * Proporciona funciones para crear sesiones de checkout y manejar suscripciones
 */

import { loadStripe } from '@stripe/stripe-js';
import type { Stripe as StripeClient } from '@stripe/stripe-js';

// Verificar que la variable de entorno pública esté definida
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('La variable de entorno NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está definida');
}

// Inicializar el cliente de Stripe para el navegador (lazy-loaded)
let stripePromise: Promise<StripeClient | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  }
  return stripePromise;
};

// Inicializar el cliente de Stripe para el servidor solo cuando sea necesario
export const getServerStripe = async () => {
  // No ejecutar este código en el cliente
  if (typeof window !== 'undefined') {
    throw new Error('Esta función solo debe ser llamada en el servidor');
  }

  // Importar Stripe dinámicamente solo en el servidor
  const { default: Stripe } = await import('stripe');
  
  // Verificar que la variable de entorno del servidor esté definida
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('La variable de entorno STRIPE_SECRET_KEY no está definida');
  }
  
  // Crear una nueva instancia de Stripe
  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-02-24.acacia',
    appInfo: {
      name: 'NextPlate',
      version: '1.0.0',
    },
  });
};

/**
 * Crear una sesión de checkout para una suscripción
 * @param priceId - ID del precio de Stripe
 * @param customerId - ID del cliente en Stripe (opcional)
 * @param successUrl - URL de redirección en caso de éxito
 * @param cancelUrl - URL de redirección en caso de cancelación
 * @param metadata - Metadatos adicionales para la sesión
 */
export async function createSubscriptionCheckout({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  priceId: string;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  // console.log('[STRIPE:CHECKOUT] Starting checkout session creation', {
  //   priceId,
  //   customerId: customerId || 'not provided',
  //   successUrl,
  //   cancelUrl,
  //   metadata
  // });
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Esta función solo debe ser llamada en el servidor');
    }

    const stripe = await getServerStripe();

    //extraer el email del metadata
    const email = metadata.email;
    // console.log(`[STRIPE:CHECKOUT] Customer email: ${email || 'not provided'}`);

    // Crear la sesión de checkout
    // console.log('[STRIPE:CHECKOUT] Creating Stripe checkout session');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      ...(customerId && { customer: customerId }),
    });
    
    // console.log(`[STRIPE:CHECKOUT] Session created: ${session.id}`);
    // console.log(`[STRIPE:CHECKOUT] Customer: ${session.customer || 'will be created during checkout'}`);
    
    return { sessionId: session.id };
  } catch {
    // console.error('[STRIPE:CHECKOUT] Error creating checkout session');
    throw new Error('No se pudo crear la sesión de checkout');
  }
}

/**
 * Obtener los detalles de una suscripción
 * @param subscriptionId - ID de la suscripción en Stripe
 */
export async function getSubscription(subscriptionId: string) {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Esta función solo debe ser llamada en el servidor');
    }

    const stripe = await getServerStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error al obtener la suscripción:', error);
    throw new Error('No se pudo obtener la suscripción');
  }
}

/**
 * Cancelar una suscripción
 * @param subscriptionId - ID de la suscripción en Stripe
 */
export async function cancelSubscription(subscriptionId: string) {
  const stripe = await getServerStripe();
  
  // Cancelar suscripción al final del período actual
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  });
  
  return subscription;
}

/**
 * Crear un portal de facturación para que el cliente gestione su suscripción
 * @param customerId - ID del cliente en Stripe
 * @param returnUrl - URL de retorno después de usar el portal
 */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  try {
    if (typeof window !== 'undefined') {
      throw new Error('Esta función solo debe ser llamada en el servidor');
    }

    const stripe = await getServerStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error al crear la sesión del portal de facturación:', error);
    throw new Error('No se pudo crear la sesión del portal de facturación');
  }
}
