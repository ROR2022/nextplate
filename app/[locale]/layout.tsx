import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {ReactNode} from 'react';
import {locales, type Locale} from '@/i18n';
import HeaderAuth from "@/components/header-auth";
import SettingsMenu from "@/components/settings-menu";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
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
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={`/${locale}`}>NextPlate</Link>
              </div>
              <div className="flex items-center gap-4">
                
                <SettingsMenu />
                {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
              </div>
            </div>
          </nav>
          <div className="flex flex-col gap-20 max-w-5xl p-5">
            {children}
            
          </div>

          <Footer />
        </div>
        <CookieConsentBanner />
      </main>
    </NextIntlClientProvider>
  );
}
