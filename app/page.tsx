import { redirect } from 'next/navigation';

/**
 * Página de redirección a la versión internacionalizada.
 * Redirige automáticamente al usuario al idioma predeterminado (español).
 */
export default function Home() {
  // Redirigir a la versión en español (idioma predeterminado)
  redirect('/es');
}
