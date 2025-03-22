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
    title: `${t("sidebar.layout")} - ${t("meta.title")}`,
    description: t("components.layout.description"),
  };
}

export default async function ComponentsLayoutPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("components.layout.title")}
        description={t("components.layout.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.layout.intro.title")}</h2>
          <p className="mb-4">
            Los componentes de layout en NextPlate proporcionan estructuras para organizar el contenido 
            de tu aplicación de manera coherente y responsiva. Estos componentes están diseñados para 
            trabajar juntos, creando layouts complejos mientras mantienen una experiencia de usuario 
            consistente en diferentes dispositivos y tamaños de pantalla.
          </p>
          <p className="mb-4">
            Todos los componentes de layout están optimizados para trabajar con Tailwind CSS y son 
            altamente personalizables para adaptarse a las necesidades específicas de tu aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Header</h2>
          <p className="mb-4">
            El componente Header proporciona una barra de navegación superior para tu aplicación, 
            incluyendo logo, menú de navegación y acciones de usuario.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Header } from "@/components/layout/header";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>variant</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Variante visual del header (default, transparent, colored)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>sticky</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>true</code></td>
                  <td className="border p-2">Si es true, el header permanece fijo en la parte superior al desplazarse</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>logo</code></td>
                  <td className="border p-2">ReactNode</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Componente de logo personalizado</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>navItems</code></td>
                  <td className="border p-2">array</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Array de elementos de navegación</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Footer</h2>
          <p className="mb-4">
            El componente Footer proporciona un pie de página para tu aplicación, incluyendo enlaces, 
            información de copyright y otros elementos.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Footer } from "@/components/layout/footer";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>variant</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Variante visual del footer (default, simple, complex)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>logo</code></td>
                  <td className="border p-2">ReactNode</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Componente de logo personalizado</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>navItems</code></td>
                  <td className="border p-2">array</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Array de elementos de navegación</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>socialLinks</code></td>
                  <td className="border p-2">array</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Array de enlaces a redes sociales</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>copyright</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Texto de copyright</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
          <p className="mb-4">
            El componente Sidebar proporciona una barra lateral para navegación o contenido adicional.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Sidebar } from "@/components/layout/sidebar";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar>
        <nav className="space-y-2">
          <a href="/dashboard" className="block p-2 hover:bg-muted rounded-md">Dashboard</a>
          <a href="/dashboard/settings" className="block p-2 hover:bg-muted rounded-md">Settings</a>
          <a href="/dashboard/profile" className="block p-2 hover:bg-muted rounded-md">Profile</a>
        </nav>
      </Sidebar>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>variant</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Variante visual del sidebar (default, compact, expanded)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>collapsible</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>false</code></td>
                  <td className="border p-2">Si es true, el sidebar se puede contraer</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>defaultCollapsed</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>false</code></td>
                  <td className="border p-2">Si es true, el sidebar comienza contraído</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>position</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>left</code></td>
                  <td className="border p-2">Posición del sidebar (left, right)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>width</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>64</code></td>
                  <td className="border p-2">Ancho del sidebar en píxeles o unidades de Tailwind</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Container</h2>
          <p className="mb-4">
            El componente Container proporciona un contenedor centrado con ancho máximo para el contenido.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Container } from "@/components/layout/container";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function HomePage() {
  return (
    <Container>
      <h1>Welcome to NextPlate</h1>
      <p>This content is centered and has a maximum width.</p>
    </Container>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>size</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Tamaño del contenedor (sm, default, lg, xl, full)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>className</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Clases CSS adicionales</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Grid</h2>
          <p className="mb-4">
            El componente Grid proporciona un sistema de cuadrícula flexible para organizar elementos en filas y columnas.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Grid, GridItem } from "@/components/layout/grid";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function GridExample() {
  return (
    <Grid cols={3} gap={4}>
      <GridItem>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem colSpan={2}>Item 4 (spans 2 columns)</GridItem>
      <GridItem>Item 5</GridItem>
    </Grid>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades de Grid</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>cols</code></td>
                  <td className="border p-2">number | object</td>
                  <td className="border p-2"><code>1</code></td>
                  <td className="border p-2">Número de columnas o objeto con breakpoints</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>gap</code></td>
                  <td className="border p-2">number | object</td>
                  <td className="border p-2"><code>4</code></td>
                  <td className="border p-2">Espacio entre elementos o objeto con breakpoints</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>className</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Clases CSS adicionales</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades de GridItem</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>colSpan</code></td>
                  <td className="border p-2">number | object</td>
                  <td className="border p-2"><code>1</code></td>
                  <td className="border p-2">Número de columnas que ocupa o objeto con breakpoints</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>rowSpan</code></td>
                  <td className="border p-2">number | object</td>
                  <td className="border p-2"><code>1</code></td>
                  <td className="border p-2">Número de filas que ocupa o objeto con breakpoints</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>className</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Clases CSS adicionales</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Ejemplo con breakpoints responsivos</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function ResponsiveGridExample() {
  return (
    <Grid
      cols={{
        base: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      }}
      gap={{
        base: 2,
        md: 4,
        xl: 6,
      }}
    >
      <GridItem>Item 1</GridItem>
      <GridItem
        colSpan={{
          base: 1,
          md: 2,
        }}
      >
        Item 2 (spans 2 columns on md and up)
      </GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem>Item 4</GridItem>
      <GridItem>Item 5</GridItem>
    </Grid>
  );
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/components/ui"
        prevLabel={t("sidebar.ui")}
        nextPath="/components/forms"
        nextLabel={t("sidebar.forms")}
      />
    </>
  );
}
