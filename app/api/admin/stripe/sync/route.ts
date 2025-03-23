import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { syncProductsAndPrices } from '@/utils/stripe-sync';

/**
 * Endpoint para sincronizar manualmente los datos de Stripe con Supabase
 * POST /api/admin/stripe/sync
 */
export async function POST() {
  try {
    // Verificar autenticación y permisos de administrador
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ 
        error: 'No autorizado', 
        details: 'Debe iniciar sesión para acceder a esta función' 
      }, { status: 401 });
    }
    
    // Verificar si el usuario es administrador
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json({ 
        error: 'Error de perfil', 
        details: 'No se pudo verificar el perfil de usuario' 
      }, { status: 500 });
    }
    
    if (profile.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Acceso denegado', 
        details: 'Se requiere rol de administrador para esta operación' 
      }, { status: 403 });
    }
    
    // Ejecutar la sincronización de productos y precios
    const result = await syncProductsAndPrices(supabase);
    
    return NextResponse.json({
      message: 'Sincronización completada con éxito',
      timestamp: new Date().toISOString(),
      details: result
    });
  } catch (error) {
    console.error('Error al sincronizar con Stripe:', error);
    
    return NextResponse.json(
      { 
        error: 'Error de sincronización', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
} 