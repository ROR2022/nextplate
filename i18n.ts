import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Define los idiomas soportados
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale as string;
  // Valida que el idioma solicitado esté soportado
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Carga los mensajes para el idioma solicitado
  const messages = (await import(`./locales/${locale}/index.json`)).default;

  return {
    locale: locale as string,
    messages
  };
});

 import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: locales, // Define in this line the possible languages for translation
  defaultLocale: "es", // Define in this line the default language to be shown
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
 