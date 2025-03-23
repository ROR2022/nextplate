/**
 * Utilidades para sincronizar datos entre Stripe y Supabase
 * Proporciona funciones para sincronizar productos, precios y suscripciones.
 */

import { getServerStripe } from '@/lib/stripe';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Sincroniza todos los datos de Stripe con Supabase
 * @param supabase - Cliente de Supabase
 */
export async function syncAllStripeData(supabase: SupabaseClient) {
  try {
    // Sincronizar productos
    await syncProducts(supabase);
    
    // Sincronizar precios
    await syncPrices(supabase);
    
    return { success: true, message: 'Sincronización completada con éxito' };
  } catch (error) {
    console.error('Error en la sincronización completa:', error);
    return { 
      success: false, 
      message: 'Error en la sincronización', 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

/**
 * Sincroniza los productos de Stripe con Supabase
 * @param supabase - Cliente de Supabase
 */
export async function syncProducts(supabase: SupabaseClient) {
  try {
    // Obtener el cliente de Stripe
    const stripe = await getServerStripe();
    
    // 1. Obtener todos los productos de Stripe
    const stripeProducts = await stripe.products.list({ limit: 100 });
    
    // 2. Registrar resultados
    const results = {
      total: stripeProducts.data.length,
      created: 0,
      updated: 0,
      errors: 0,
    };
    
    // 3. Para cada producto, insertarlo o actualizarlo en Supabase
    for (const product of stripeProducts.data) {
      try {
        // Buscar si el producto ya existe
        const { data: existingProduct } = await supabase
          .from('subscription_products')
          .select('id')
          .eq('stripe_product_id', product.id)
          .single();
        
        const productData = {
          stripe_product_id: product.id,
          name: product.name,
          description: product.description || '',
          active: product.active,
          metadata: product.metadata || {},
          updated_at: new Date(),
        };
        
        if (existingProduct) {
          // Actualizar producto existente
          const { error } = await supabase
            .from('subscription_products')
            .update(productData)
            .eq('stripe_product_id', product.id);
          
          if (error) {
            throw error;
          }
          results.updated++;
        } else {
          // Crear nuevo producto
          const { error } = await supabase
            .from('subscription_products')
            .insert({
              ...productData,
              created_at: new Date(),
            });
          
          if (error) {
            throw error;
          }
          results.created++;
        }
      } catch (error) {
        console.error(`Error sincronizando producto ${product.id}:`, error);
        results.errors++;
      }
    }
    
    // 4. Marcar como inactivos los productos que ya no existen en Stripe
    // Obtener todos los IDs de productos de Stripe
    const stripeProductIds = stripeProducts.data.map(p => p.id);
    
    // Marcar como inactivos los productos que no están en Stripe
    const { error } = await supabase
      .from('subscription_products')
      .update({ active: false, updated_at: new Date() })
      .not('stripe_product_id', 'in', stripeProductIds)
      .eq('active', true);
    
    if (error) {
      console.error('Error al desactivar productos obsoletos:', error);
    }
    
    return results;
  } catch (error) {
    console.error('Error en syncProducts:', error);
    throw error;
  }
}

/**
 * Sincroniza los precios de Stripe con Supabase
 * @param supabase - Cliente de Supabase
 */
export async function syncPrices(supabase: SupabaseClient) {
  try {
    // Obtener el cliente de Stripe
    const stripe = await getServerStripe();
    
    // 1. Obtener todos los precios de Stripe
    const stripePrices = await stripe.prices.list({ 
      limit: 100,
      expand: ['data.product']
    });
    
    // 2. Registrar resultados
    const results = {
      total: stripePrices.data.length,
      created: 0,
      updated: 0,
      errors: 0,
      skipped: 0,
    };
    
    // 3. Para cada precio, insertarlo o actualizarlo en Supabase
    for (const price of stripePrices.data) {
      try {
        // Verificar que el precio tenga un producto asociado
        if (!price.product) {
          console.warn(`El precio ${price.id} no tiene un producto asociado`);
          results.skipped++;
          continue;
        }
        
        // Obtener el ID del producto en nuestra base de datos
        const { data: productData } = await supabase
          .from('subscription_products')
          .select('id')
          .eq('stripe_product_id', typeof price.product === 'string' ? price.product : price.product.id)
          .single();
        
        if (!productData) {
          console.warn(`Producto no encontrado para el precio ${price.id}`);
          results.skipped++;
          continue;
        }
        
        // Buscar si el precio ya existe
        const { data: existingPrice } = await supabase
          .from('subscription_prices')
          .select('id')
          .eq('stripe_price_id', price.id)
          .single();
        
        const priceData = {
          stripe_price_id: price.id,
          product_id: productData.id,
          currency: price.currency,
          amount: price.unit_amount || 0,
          interval: price.recurring?.interval || null,
          interval_count: price.recurring?.interval_count || 1,
          trial_period_days: price.recurring?.trial_period_days || null,
          active: price.active,
          metadata: price.metadata || {},
          updated_at: new Date(),
        };
        
        if (existingPrice) {
          // Actualizar precio existente
          const { error } = await supabase
            .from('subscription_prices')
            .update(priceData)
            .eq('stripe_price_id', price.id);
          
          if (error) {
            throw error;
          }
          results.updated++;
        } else {
          // Crear nuevo precio
          const { error } = await supabase
            .from('subscription_prices')
            .insert({
              ...priceData,
              created_at: new Date(),
            });
          
          if (error) {
            throw error;
          }
          results.created++;
        }
      } catch (error) {
        console.error(`Error sincronizando precio ${price.id}:`, error);
        results.errors++;
      }
    }
    
    // 4. Marcar como inactivos los precios que ya no existen en Stripe
    // Obtener todos los IDs de precios de Stripe
    const stripePriceIds = stripePrices.data.map(p => p.id);
    
    // Marcar como inactivos los precios que no están en Stripe
    const { error } = await supabase
      .from('subscription_prices')
      .update({ active: false, updated_at: new Date() })
      .not('stripe_price_id', 'in', stripePriceIds)
      .eq('active', true);
    
    if (error) {
      console.error('Error al desactivar precios obsoletos:', error);
    }
    
    return results;
  } catch (error) {
    console.error('Error en syncPrices:', error);
    throw error;
  }
}

/**
 * Sincroniza una suscripción específica de Stripe con Supabase
 * @param supabase - Cliente de Supabase
 * @param subscriptionId - ID de la suscripción en Stripe
 */
export async function syncSubscription(supabase: SupabaseClient, subscriptionId: string) {
  // console.log(`[SYNC] Starting sync for subscription: ${subscriptionId}`);
  try {
    // Obtener el cliente de Stripe
    // console.log(`[SYNC] Getting Stripe client`);
    const stripe = await getServerStripe();
    
    // Obtener la suscripción de Stripe
    // console.log(`[SYNC] Retrieving subscription data from Stripe: ${subscriptionId}`);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['default_payment_method', 'items.data.price.product']
    });
    // console.log(`[SYNC] Subscription retrieved: ${subscription.id}, status: ${subscription.status}`);
    // console.log(`[SYNC] Customer ID: ${subscription.customer}`);
    // console.log(`[SYNC] Metadata:`, subscription.metadata);
    
    // Buscar el usuario asociado a esta suscripción
    let userId: string | undefined;
    
    // Verificar si hay metadatos en la suscripción
    if (subscription.metadata && subscription.metadata.userId) {
      userId = subscription.metadata.userId;
      //console.log(`[SYNC] Found userId in subscription metadata: ${userId}`);
    } else {
      console.warn(`[SYNC] No userId in subscription metadata, checking database...`);
      // Intentar obtener el userId de la base de datos si ya existe el cliente
      const { data: userRecord, error: userError } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', subscription.customer as string)
        .single();
      
      if (userError) {
        console.warn(`[SYNC] Error finding user in subscriptions table:`, userError);
      }
      
      if (userRecord) {
        userId = userRecord.user_id;
        //console.log(`[SYNC] Found userId in database: ${userId}`);
      } else {
        console.warn(`[SYNC] No user record found, checking customer metadata...`);
        // Ver si encuentra userId en customer metadata
        if (!userId && subscription.customer) {
          // Buscar el userId en los metadatos del cliente
          try {
            // console.log(`[SERVER:SYNC] Looking for userId in customer metadata`);
            const stripe = await getServerStripe();
            
            // console.log(`[SERVER:SYNC] Retrieving customer: ${subscription.customer}`);
            const customer = await stripe.customers.retrieve(subscription.customer as string);
            
            if (customer && !('deleted' in customer)) {
              // console.log(`[SERVER:SYNC] Customer retrieved: ${customer.id}`);
              
              if (customer.metadata && customer.metadata.userId) {
                // console.log(`[SERVER:SYNC] Found userId in customer metadata: ${customer.metadata.userId}`);
                userId = customer.metadata.userId;
              } else {
                console.warn(`[SERVER:SYNC] No userId in customer metadata`);
                
                // Buscar el perfil de usuario que tenga este customer_id
                // console.log(`[SERVER:SYNC] Looking for user profile with this customer ID`);
                const { data: userProfile } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('stripe_customer_id', customer.id)
                  .single();

                if (userProfile) {
                  userId = userProfile.id;
                }
              }
            }
          } catch (customerError) {
            console.error(`[SYNC] Error retrieving customer:`, customerError);
          }
        }
      }
    }
    
    if (!userId) {
      console.error(`[SYNC] Could not determine userId for subscription ${subscriptionId}`);
      throw new Error(`No se pudo determinar el usuario para la suscripción ${subscriptionId}`);
    }
    
    // Actualizar el stripe_customer_id en el perfil del usuario
    //console.info(`[SYNC] Updating user profile with customer ID: ${userId} -> ${subscription.customer}`);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        stripe_customer_id: subscription.customer as string,
        updated_at: new Date()
      })
      .eq('id', userId);
    
    if (profileError) {
      console.warn(`[SYNC] Error updating user profile ${userId}:`, profileError);
      // No lanzamos error para continuar con la sincronización de la suscripción
    } else {
      //console.log(`[SYNC] User profile updated successfully`);
    }
    
    // Preparar datos de la suscripción
    //console.log(`[SYNC] Preparing subscription data for database`);
    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      updated_at: new Date(),
    };
    //console.log(`[SYNC] Subscription data prepared:`, JSON.stringify(subscriptionData));
    
    // Buscar si la suscripción ya existe
    //console.log(`[SYNC] Checking if subscription already exists in database`);
    const { data: existingSubscription, error: existingError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscriptionId)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error(`[SYNC] Error checking existing subscription:`, existingError);
    }
    
    let subscriptionResult;
    
    if (existingSubscription) {
      //console.log(`[SYNC] Subscription exists, updating: ${existingSubscription.id}`);
      // Actualizar suscripción existente
      const { data, error } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('stripe_subscription_id', subscriptionId)
        .select('id')
        .single();
      
      if (error) {
        console.error(`[SYNC] Error updating subscription:`, error);
        throw error;
      }
      //console.log(`[SYNC] Subscription updated successfully: ${data.id}`);
      subscriptionResult = { id: data.id, isNew: false };
    } else {
      console.warn(`[SYNC] Subscription does not exist, creating new record`);
      // Crear nueva suscripción
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionData,
          created_at: new Date(),
        })
        .select('id')
        .single();
      
      if (error) {
        console.error(`[SYNC] Error creating subscription:`, error);
        throw error;
      }
      //console.log(`[SYNC] Subscription created successfully: ${data.id}`);
      subscriptionResult = { id: data.id, isNew: true };
    }
    
    // Sincronizar elementos de la suscripción
    //console.log(`[SYNC] Syncing subscription items`);
    for (const item of subscription.items.data) {
      //console.log(`[SYNC] Processing subscription item: ${item.id}, price: ${item.price.id}`);
      const subscriptionItemData = {
        subscription_id: subscriptionResult.id,
        stripe_subscription_item_id: item.id,
        stripe_price_id: item.price.id,
        quantity: item.quantity || 1,
        updated_at: new Date(),
      };
      
      // Buscar si el elemento ya existe
      const { data: existingItem, error: existingItemError } = await supabase
        .from('subscription_items')
        .select('id')
        .eq('stripe_subscription_item_id', item.id)
        .single();
      
      if (existingItemError && existingItemError.code !== 'PGRST116') {
        console.error(`[SYNC] Error checking existing subscription item:`, existingItemError);
      }
      
      if (existingItem) {
        //console.log(`[SYNC] Subscription item exists, updating: ${existingItem.id}`);
        // Actualizar elemento existente
        const { error } = await supabase
          .from('subscription_items')
          .update(subscriptionItemData)
          .eq('stripe_subscription_item_id', item.id);
        
        if (error) {
          console.error(`[SYNC] Error updating subscription item:`, error);
          throw error;
        }
        //console.log(`[SYNC] Subscription item updated successfully`);
      } else {
        console.warn(`[SYNC] Subscription item does not exist, creating new record`);
        // Crear nuevo elemento
        const { error, data } = await supabase
          .from('subscription_items')
          .insert({
            ...subscriptionItemData,
            created_at: new Date(),
          })
          .select('id')
          .single();
        
        if (error) {
          console.error(`[SYNC] Error creating subscription item:`, error);
          throw error;
        }
        if (data) {
          console.warn(`[SYNC] Subscription item created successfully: ${data?.id}`);
        }
      }
    }
    
    // console.log(`[SYNC] Subscription sync completed successfully: ${subscriptionId}`);
    return {
      success: true,
      subscription: subscriptionResult,
    };
  } catch (error) {
    // console.error(`[SYNC] Error syncing subscription ${subscriptionId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Sincroniza todas las suscripciones activas de un usuario desde Stripe a Supabase
 * @param supabase - Cliente de Supabase
 * @param userId - ID del usuario
 */
export async function syncUserSubscriptions(supabase: SupabaseClient, userId: string) {
  try {
    // Obtener el customer_id del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile || !profile.stripe_customer_id) {
      console.error('Error al obtener el customer_id del usuario:', profileError);
      return { success: false, error: 'No se pudo encontrar el customer_id del usuario' };
    }

    // Obtener todas las suscripciones activas del cliente en Stripe
    const stripe = await getServerStripe();
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      expand: ['data.default_payment_method', 'data.items.data.price.product']
    });

    // Sincronizar cada suscripción
    const results = [];
    for (const subscription of subscriptions.data) {
      const result = await syncSubscription(supabase, subscription.id);
      results.push({
        subscription_id: subscription.id,
        result: result
      });
    }

    return {
      success: true,
      message: `Se sincronizaron ${results.length} suscripciones para el usuario ${userId}`,
      results: results
    };
  } catch (error) {
    console.error('Error al sincronizar las suscripciones del usuario:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Sincroniza todos los productos de Stripe con la base de datos
 * @param supabase - Cliente de Supabase
 */
export async function syncAllProducts(supabase: SupabaseClient) {
  try {
    const stripe = await getServerStripe();
    const products = await stripe.products.list({
      limit: 100,
      active: true,
      expand: ['data.default_price']
    });

    const results = [];
    for (const product of products.data) {
      // Actualizar o insertar el producto
      const { data, error } = await supabase
        .from('subscription_products')
        .upsert({
          id: product.id,
          name: product.name,
          description: product.description || '',
          active: product.active,
          metadata: product.metadata,
          image: product.images && product.images.length > 0 ? product.images[0] : null,
          created: new Date(product.created * 1000).toISOString(),
          updated: new Date().toISOString()
        })
        .select();

      results.push({
        product_id: product.id,
        success: !error,
        error: error ? error.message : null,
        data: data
      });
    }

    return {
      success: true,
      message: `Se sincronizaron ${results.length} productos`,
      results
    };
  } catch (error) {
    console.error('Error al sincronizar productos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Sincroniza todos los precios de Stripe con la base de datos
 * @param supabase - Cliente de Supabase
 */
export async function syncAllPrices(supabase: SupabaseClient) {
  try {
    const stripe = await getServerStripe();
    const prices = await stripe.prices.list({
      limit: 100,
      active: true,
      expand: ['data.product']
    });

    const results = [];
    for (const price of prices.data) {
      const productId = typeof price.product === 'string'
        ? price.product
        : price.product.id;

      const { data, error } = await supabase
        .from('subscription_prices')
        .upsert({
          id: price.id,
          product_id: productId,
          active: price.active,
          currency: price.currency,
          type: price.type,
          unit_amount: price.unit_amount,
          interval: price.recurring?.interval || null,
          interval_count: price.recurring?.interval_count || null,
          trial_period_days: price.recurring?.trial_period_days || null,
          metadata: price.metadata,
          created: new Date(price.created * 1000).toISOString(),
          updated: new Date().toISOString()
        })
        .select();

      results.push({
        price_id: price.id,
        product_id: productId,
        success: !error,
        error: error ? error.message : null,
        data: data
      });
    }

    return {
      success: true,
      message: `Se sincronizaron ${results.length} precios`,
      results
    };
  } catch (error) {
    console.error('Error al sincronizar precios:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Sincroniza todos los productos y precios de Stripe con la base de datos
 * @param supabase - Cliente de Supabase
 */
export async function syncProductsAndPrices(supabase: SupabaseClient) {
  try {
    // Sincronizar productos
    const productsResult = await syncAllProducts(supabase);
    
    // Sincronizar precios
    const pricesResult = await syncAllPrices(supabase);
    
    return {
      success: productsResult.success && pricesResult.success,
      message: 'Sincronización de productos y precios completada',
      products: productsResult,
      prices: pricesResult
    };
  } catch (error) {
    console.error('Error al sincronizar productos y precios:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
} 