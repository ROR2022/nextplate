import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function NotFound() {
  const locale = useLocale();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-xl mb-8">Lo sentimos, la página que estás buscando no existe.</p>
      <Link 
        href={`/${locale}`} 
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
