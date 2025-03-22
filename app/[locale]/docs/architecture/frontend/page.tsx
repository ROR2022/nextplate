import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.frontend")} - ${t("meta.title")}`,
    description: t("architecture.frontend.description"),
  };
}

export default async function FrontendPage({
  params,
}: PageProps) {
  // Extraer el locale de params
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("architecture.frontend.title")}
        description={t("architecture.frontend.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.overview.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.overview.description")}</p>
          <p className="mb-4">
            El frontend de NextPlate está diseñado para proporcionar una experiencia de usuario fluida y moderna, 
            aprovechando las mejores características de Next.js, React y TailwindCSS. La arquitectura está 
            organizada para maximizar la reutilización de componentes, la mantenibilidad del código y el rendimiento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.components.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.components.description")}</p>
          <p className="mb-4">
            Los componentes en NextPlate están organizados en varias categorías:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Componentes UI:</strong> Componentes básicos de interfaz de usuario como botones, 
              campos de entrada, tarjetas, etc. Basados en Shadcn UI y personalizados para NextPlate.
            </li>
            <li>
              <strong>Componentes de Layout:</strong> Estructuras de página como encabezados, pies de página, 
              barras laterales y contenedores principales.
            </li>
            <li>
              <strong>Componentes de Funcionalidad:</strong> Componentes que encapsulan lógica específica como 
              formularios de autenticación, selectores de idioma, etc.
            </li>
            <li>
              <strong>Componentes de Página:</strong> Componentes específicos para ciertas páginas o secciones.
            </li>
          </ul>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm">
              <strong>Ejemplo de estructura de componentes:</strong>
            </p>
            <CodeBlock code={`components/
├── ui/             # Componentes básicos de UI
│   ├── button.tsx
│   ├── input.tsx
│   └── ...
├── layout/         # Componentes de estructura
│   ├── header.tsx
│   ├── footer.tsx
│   └── ...
├── auth/           # Componentes relacionados con autenticación
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── ...
└── tutorial/       # Componentes específicos para tutoriales
    ├── code-block.tsx
    └── ...`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.routing.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.routing.description")}</p>
          <p className="mb-4">
            NextPlate utiliza el sistema de enrutamiento basado en archivos de Next.js, con soporte para 
            internacionalización mediante next-intl. La estructura de carpetas refleja directamente las rutas URL:
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <CodeBlock code={`app/
├── [locale]/       # Rutas internacionalizadas
│   ├── page.tsx    # Página principal
│   ├── docs/       # Documentación
│   │   ├── page.tsx
│   │   └── ...
│   ├── dashboard/  # Panel de control
│   │   ├── page.tsx
│   │   └── ...
│   └── ...
└── api/            # Rutas de API
    ├── auth/
    ├── payments/
    └── ...`} />
          </div>
          <p className="mb-4">
            El parámetro <code>[locale]</code> captura el idioma actual y permite que todas las páginas 
            estén disponibles en múltiples idiomas. La biblioteca next-intl se encarga de gestionar las 
            traducciones y el cambio de idioma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.stateManagement.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.stateManagement.description")}</p>
          <p className="mb-4">
            NextPlate utiliza varios enfoques para la gestión del estado:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Estado Local:</strong> Componentes con estado local usando <code>useState</code> y <code>useReducer</code>.
            </li>
            <li>
              <strong>Contexto de React:</strong> Para estado compartido entre componentes relacionados.
            </li>
            <li>
              <strong>Hooks Personalizados:</strong> Para encapsular lógica reutilizable y estado.
            </li>
            <li>
              <strong>Server Components:</strong> Para datos que pueden ser renderizados en el servidor.
            </li>
          </ul>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo de un contexto para gestionar el tema:</strong>
            </p>
            <CodeBlock code={`// context/theme-context.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('system');
  
  // Lógica para aplicar el tema
  useEffect(() => {
    // Implementación...
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.styling.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.styling.description")}</p>
          <p className="mb-4">
            El enfoque de estilizado en NextPlate se basa en:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>TailwindCSS:</strong> Para estilos utilitarios y responsive design.
            </li>
            <li>
              <strong>Shadcn UI:</strong> Componentes pre-estilizados y accesibles.
            </li>
            <li>
              <strong>CSS Modules:</strong> Para estilos específicos de componentes cuando es necesario.
            </li>
            <li>
              <strong>Variables CSS:</strong> Para temas y personalización.
            </li>
          </ul>
          <p className="mb-4">
            Este enfoque permite un desarrollo rápido, manteniendo la consistencia visual y permitiendo 
            la personalización cuando sea necesario.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.frontend.performance.title")}</h2>
          <p className="mb-4">{t("architecture.frontend.performance.description")}</p>
          <p className="mb-4">
            NextPlate implementa varias estrategias para optimizar el rendimiento del frontend:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Server Components:</strong> Reducen el JavaScript enviado al cliente.
            </li>
            <li>
              <strong>Carga Diferida:</strong> Componentes y módulos cargados solo cuando son necesarios.
            </li>
            <li>
              <strong>Optimización de Imágenes:</strong> Mediante el componente Image de Next.js.
            </li>
            <li>
              <strong>Prefetching:</strong> Precarga de páginas para navegación instantánea.
            </li>
            <li>
              <strong>Caché:</strong> Estrategias de caché para datos y componentes.
            </li>
          </ul>
          <p className="mb-4">
            Estas optimizaciones resultan en tiempos de carga más rápidos, mejor interactividad y una 
            experiencia de usuario más fluida.
          </p>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/architecture"
          prevLabel={t("sidebar.overview")}
          nextPath="/architecture/backend"
          nextLabel={t("sidebar.backend")}
        />
      </DocContent>
    </>
  );
}
