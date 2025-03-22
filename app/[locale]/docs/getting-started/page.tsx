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
    title: `${t("sidebar.introduction")} - ${t("meta.title")}`,
    description: t("gettingStarted.introduction.description"),
  };
}

export default async function GettingStartedPage({
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
        title={t("gettingStarted.introduction.title")}
        description={t("gettingStarted.introduction.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.introduction.whatIs.title")}</h2>
          <p className="mb-4">
            NextPlate es un boilerplate avanzado diseñado para desarrolladores full-stack que buscan 
            acelerar la creación de aplicaciones web escalables, modernas y conformes con normativas legales. 
            Este boilerplate incluye todo lo necesario para comenzar rápidamente con un proyecto profesional.
          </p>
          <p className="mb-4">
            El nombre combina &ldquo;Next&rdquo; (por Next.js) y &ldquo;Plate&rdquo; (por plantilla), evocando una base sólida, 
            moderna y lista para usar en el desarrollo de aplicaciones web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.introduction.keyFeatures.title")}</h2>
          <ul className="space-y-4">
            <li>
              <strong>Autenticación segura:</strong> Mediante Supabase, con funcionalidades como registro, 
              inicio de sesión, recuperación de contraseña y verificación de email.
            </li>
            <li>
              <strong>Interfaz de usuario moderna:</strong> Gracias a los componentes preconfigurados de Shadcn, 
              listos para personalizar según las necesidades del proyecto.
            </li>
            <li>
              <strong>Integración de pagos:</strong> Con Stripe, incluyendo soporte para suscripciones, 
              pagos únicos y manejo de eventos mediante webhooks.
            </li>
            <li>
              <strong>Funcionalidades de inteligencia artificial:</strong> Con ejemplos de integración de OpenAI, 
              como generación de contenido o chatbots interactivos.
            </li>
            <li>
              <strong>Internacionalización:</strong> Para soportar múltiples idiomas (español e inglés) 
              mediante next-intl.
            </li>
            <li>
              <strong>Documentos legales personalizables:</strong> Términos y Condiciones, Declaración de Privacidad, 
              Aviso de Uso de Cookies y un banner de consentimiento de cookies integrado con react-cookie-consent, 
              facilitando el cumplimiento de normativas como el GDPR.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.introduction.uniqueValue.title")}</h2>
          <p className="mb-4">
            NextPlate se distingue por ofrecer una solución integral que combina las mejores herramientas 
            del ecosistema de Next.js con un enfoque en el cumplimiento normativo. A diferencia de otros 
            boilerplates, incluye:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Documentos legales preconfigurados y personalizables, algo poco común en plantillas similares.
            </li>
            <li>
              Un banner de cookies listo para usar, esencial para cumplir con regulaciones de privacidad como el GDPR.
            </li>
            <li>
              Integraciones avanzadas (autenticación, pagos, IA) que funcionan de manera conjunta desde el primer momento.
            </li>
          </ul>
          <p className="mt-4">
            Esto permite a los desarrolladores lanzar aplicaciones web modernas en tiempo récord, con la 
            tranquilidad de que las bases técnicas y legales están cubiertas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.introduction.targetAudience.title")}</h2>
          <p className="mb-4">
            NextPlate está dirigido a:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Desarrolladores full-stack que buscan una plantilla robusta para proyectos con autenticación, 
              pagos, IA y compliance legal preconfigurados.
            </li>
            <li>
              Startups y freelancers que necesitan lanzar un MVP (Producto Mínimo Viable) rápidamente.
            </li>
            <li>
              Equipos pequeños que desean una base técnica sólida sin invertir tiempo en integrar herramientas manualmente.
            </li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/"
        prevLabel={t("home.title")}
        nextPath="/getting-started/installation"
        nextLabel={t("sidebar.installation")}
      />
    </>
  );
}
