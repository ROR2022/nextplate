//import React from 'react'
import { createClient } from '@/utils/supabase/server';


const Temp = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").select();

  if (error) {
    console.log(error);
  } else if (data) {
    console.log(data);
  }

  return (
    <div>Temp</div>
  )
}

export default Temp