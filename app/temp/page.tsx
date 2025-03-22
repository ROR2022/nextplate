//import React from 'react'
import { createClient } from '@/utils/supabase/server';


const Temp = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select();

  if (error) {
    // Manejar el error de forma más apropiada
    return <div>Error: {error.message}</div>;
  } else if (data) {
    // Usar los datos en lugar de mostrarlos en consola
  }

  return (
    <div>Temp</div>
  )
}

export default Temp