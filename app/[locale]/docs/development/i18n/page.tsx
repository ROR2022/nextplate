import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.i18n")} - ${t("meta.title")}`,
    description: t("development.i18n.description"),
  };
}

export default async function I18nPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("development.i18n.title")}
        description={t("development.i18n.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.i18n.intro.title")}</h2>
          <p className="mb-4">
            La internacionalización (i18n) es el proceso de diseñar y preparar tu aplicación para que 
            sea accesible y utilizable por usuarios de diferentes idiomas y regiones. NextPlate 
            incluye una configuración completa de i18n utilizando la biblioteca next-intl, lo que 
            facilita la creación de aplicaciones multilingües.
          </p>
          <p className="mb-4">
            Esta sección explica cómo utilizar y extender las capacidades de i18n en tu proyecto NextPlate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.i18n.structure.title")}</h2>
          <p className="mb-4">
            NextPlate organiza los archivos de traducción de la siguiente manera:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`messages/
├── en.json        # Traducciones en inglés
├── es.json        # Traducciones en español
└── fr.json        # Traducciones en francés`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Cada archivo contiene un objeto JSON con las traducciones para ese idioma, organizadas en 
            secciones lógicas:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`{
  "meta": {
    "title": "NextPlate - Next.js Boilerplate",
    "description": "A starter template for Next.js applications"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "back": "Back"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "email": "Email",
    "password": "Password"
  },
  "home": {
    "title": "Welcome to NextPlate",
    "description": "A modern Next.js starter template"
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.i18n.usage.title")}</h2>
          <p className="mb-4">
            NextPlate utiliza next-intl para gestionar las traducciones. Aquí hay ejemplos de cómo 
            usar las traducciones en diferentes contextos:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">En componentes del lado del cliente</h3>
          <p className="mb-4">
            Usa el hook <code>useTranslations</code> para acceder a las traducciones:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <button>{t('button.submit')}</button>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">En componentes del lado del servidor</h3>
          <p className="mb-4">
            Usa la función <code>getTranslations</code> para acceder a las traducciones:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: 'common' });
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">En metadatos de página</h3>
          <p className="mb-4">
            Usa <code>getTranslations</code> para configurar metadatos traducidos:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description')
  };
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.i18n.routing.title")}</h2>
          <p className="mb-4">
            NextPlate implementa el enrutamiento basado en locales utilizando el parámetro <code>[locale]</code> 
            en las rutas:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`app/
├── [locale]/        # Todas las páginas están dentro de este directorio
│   ├── page.tsx     # Página principal
│   ├── about/       # Ruta /about
│   │   └── page.tsx
│   └── dashboard/   # Ruta /dashboard
│       └── page.tsx`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración de locales</h3>
          <p className="mb-4">
            Los locales disponibles se configuran en <code>middleware.ts</code>:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Lista de locales soportados
  locales: ['en', 'es', 'fr'],
  
  // Locale por defecto
  defaultLocale: 'en'
});

export const config = {
  // Matcher para las rutas que deben ser procesadas por el middleware
  matcher: ['/((?!api|_next|.*\\..*).*)']
};`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Navegación entre páginas</h3>
          <p className="mb-4">
            Para navegar entre páginas manteniendo el locale actual, usa el componente <code>Link</code> 
            de next-intl:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`'use client';

import { Link } from 'next-intl';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cambio de idioma</h3>
          <p className="mb-4">
            Para permitir a los usuarios cambiar el idioma, usa el componente <code>LocaleSwitcher</code>:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';

export default function LocaleSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div>
      <select 
        value={locale} 
        onChange={(e) => changeLocale(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("development.i18n.best.title")}</h2>
          <p className="mb-4">
            Sigue estas mejores prácticas para una internacionalización efectiva:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Organización de traducciones</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Organiza las traducciones en namespaces lógicos (auth, common, dashboard, etc.).</li>
            <li>Usa claves jerárquicas para mantener las traducciones organizadas.</li>
            <li>Mantén las traducciones sincronizadas entre los diferentes archivos de idioma.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Interpolación y pluralización</h3>
          <p className="mb-4">
            next-intl soporta interpolación de variables y pluralización:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Interpolación
// En el archivo de traducciones:
{
  "welcome": "Welcome, {name}!"
}

// En el componente:
t('welcome', { name: 'John' })

// Pluralización
// En el archivo de traducciones:
{
  "items": {
    "one": "You have {count} item",
    "other": "You have {count} items"
  }
}

// En el componente:
t('items', { count: 5 })`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Fechas y números</h3>
          <p className="mb-4">
            next-intl proporciona utilidades para formatear fechas y números según el locale:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`'use client';

import { useFormatter } from 'next-intl';

export default function DateDisplay() {
  const format = useFormatter();
  const date = new Date();
  
  return (
    <div>
      <p>
        {format.dateTime(date, {
          dateStyle: 'full',
          timeStyle: 'short'
        })}
      </p>
      <p>
        {format.number(1234567.89, {
          style: 'currency',
          currency: 'EUR'
        })}
      </p>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Añadir un nuevo idioma</h3>
          <p className="mb-4">
            Para añadir soporte para un nuevo idioma:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea un nuevo archivo de traducción en la carpeta <code>messages/</code> (por ejemplo, <code>de.json</code> para alemán).</li>
            <li>Copia el contenido de un archivo existente y traduce todos los valores.</li>
            <li>Añade el nuevo locale a la lista de locales en <code>middleware.ts</code>.</li>
            <li>Actualiza el componente <code>LocaleSwitcher</code> para incluir el nuevo idioma.</li>
          </ol>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/development/testing"
        prevLabel={t("sidebar.testing")}
        nextPath="/development/deployment"
        nextLabel={t("sidebar.deployment")}
      />
    </>
  );
}
