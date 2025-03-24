import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import {locales, type Locale} from '@/i18n';
import MainNavbar from "@/components/main-navbar";
import Footer from "@/components/footer";
import CookieConsentBanner from "@/components/cookie-consent";

type Props = {
  children: ReactNode;
  params: {locale: string};
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  // Obtener el locale de forma asíncrona
  const { locale } = await Promise.resolve(params);
  
  //console.log('locale:..', locale);

  // Validar que el locale es soportado
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  //console.log('si vemos esto es que el locale es soportado...');

  // Cargar los mensajes para el locale
  let messages;
  try {
    // Usar una ruta absoluta con el alias @/ para importar los mensajes
    messages = (await import(`@/locales/${locale}/index.json`)).default;
    //console.log('messages:..', messages);
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    console.error('error:..', error);
    notFound();
  }

  

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <MainNavbar locale={locale} />
          <div className="flex flex-col gap-20 max-w-5xl p-5">
            {children}
            
          </div>

          <Footer locale={locale} />
        </div>
        <CookieConsentBanner />
      </main>
    </NextIntlClientProvider>
  );
}
