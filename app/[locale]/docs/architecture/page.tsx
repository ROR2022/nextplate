import { getTranslations } from "next-intl/server";
import DocContent from "../components/doc-content";
import DocNavigation from "../components/doc-navigation";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.overview")} - ${t("meta.title")}`,
    description: t("architecture.overview.description"),
  };
}

export default async function ArchitecturePage({
  params,
}: {
  params: { locale: string };
}) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("architecture.overview.title")}
        description={t("architecture.overview.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.overview.diagram.title")}</h2>
          <p className="mb-4">
            La arquitectura de NextPlate se compone de los siguientes componentes interconectados:
          </p>
          <div className="bg-muted p-6 rounded-lg my-6 overflow-x-auto">
            <pre className="text-sm">
              <code>
{`[Usuario] <--> [Frontend: Next.js Pages] <--> [Backend: Next.js API Routes]
    |                   |                            |
    |                   |                            |
[Supabase Auth]       [Supabase DB]               [Stripe API]
    |                   |                            |
[Mailgun SMTP] <---- [Supabase Auth]              [OpenAI API]
    |                   |                            |
[Legal Documents]    [Cookie Consent]             [Other External Services]`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.overview.mainFlow.title")}</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>El usuario interactúa con el frontend (páginas de Next.js).</li>
            <li>El frontend envía solicitudes al backend (rutas de API de Next.js).</li>
            <li>El backend se conecta a servicios externos según la funcionalidad:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Supabase Auth para autenticación, que a su vez usa Mailgun para enviar correos electrónicos (ej. confirmación de registro, recuperación de contraseñas).</li>
                <li>Supabase DB para gestionar datos estructurados (usuarios, documentos legales).</li>
                <li>Stripe para procesamiento de pagos.</li>
                <li>OpenAI para funcionalidades de inteligencia artificial.</li>
              </ul>
            </li>
            <li>Las respuestas regresan al frontend para su visualización.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("architecture.overview.components.title")}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("architecture.overview.components.frontend.title")}</h3>
            <p className="mb-2"><strong>Descripción:</strong></p>
            <p className="mb-4">
              Interfaz de usuario construida con React en Next.js, estilizada con Shadcn y TailwindCSS. Incluye páginas como:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>/login, /register, /forgot-password: Autenticación del usuario.</li>
              <li>/dashboard: Panel principal para usuarios autenticados.</li>
              <li>/terms, /privacy, /cookies: Documentos legales estáticos.</li>
              <li>/settings: Configuración de idioma y tema.</li>
            </ul>
            <p className="mb-2"><strong>Interacciones:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Envía solicitudes HTTP a las rutas de API para autenticación, pagos y funcionalidades de IA.</li>
              <li>Renderiza componentes dinámicos según el estado del usuario (autenticado o no) y sus preferencias.</li>
            </ul>
            <p className="mb-2"><strong>Justificación:</strong></p>
            <p>
              Next.js ofrece Server-Side Rendering (SSR) y Client-Side Rendering (CSR), optimizando rendimiento y SEO, 
              lo que mejora la experiencia del usuario.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("architecture.overview.components.backend.title")}</h3>
            <p className="mb-2"><strong>Descripción:</strong></p>
            <p className="mb-4">
              Lógica del servidor implementada en /pages/api/:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>/api/auth/[...supabase].ts: Maneja autenticación con Supabase.</li>
              <li>/api/payments.ts: Procesa pagos con Stripe.</li>
              <li>/api/openai.ts: Integra funcionalidades de IA con OpenAI.</li>
              <li>/api/legal.ts: Gestiona documentos legales.</li>
            </ul>
            <p className="mb-2"><strong>Interacciones:</strong></p>
            <p className="mb-4">
              Recibe solicitudes del frontend, procesa la lógica y se conecta a servicios externos (Supabase, Stripe, OpenAI).
            </p>
            <p className="mb-2"><strong>Justificación:</strong></p>
            <p>
              Las rutas de API de Next.js permiten un desarrollo full-stack eficiente al unificar frontend y backend en un solo proyecto.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("architecture.overview.scalability.title")}</h2>
          <ul className="space-y-4">
            <li>
              <strong>Frontend/Backend:</strong> Next.js en Vercel escala automáticamente con el tráfico.
            </li>
            <li>
              <strong>Supabase:</strong> Escalable con réplicas y sharding para manejar mayor volumen de datos.
            </li>
            <li>
              <strong>Mailgun:</strong> Escalable según el plan contratado, con alta capacidad de envío.
            </li>
            <li>
              <strong>Stripe/OpenAI:</strong> Servicios gestionados que se adaptan a la demanda sin intervención manual.
            </li>
            <li>
              <strong>Optimización:</strong> Uso de caching y lazy loading para mejorar el rendimiento en el frontend.
            </li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/getting-started/quick-start"
        prevLabel={t("sidebar.quickStart")}
        nextPath="/architecture/frontend"
        nextLabel={t("sidebar.frontend")}
      />
    </>
  );
}
