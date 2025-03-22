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
    title: `${t("sidebar.phases")} - ${t("meta.title")}`,
    description: t("development.phases.description"),
  };
}

export default async function PhasesPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("development.phases.title")}
        description={t("development.phases.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.intro.title")}</h2>
          <p className="mb-4">
            {t("development.phases.intro.description")}
          </p>
          <div className="bg-muted p-4 rounded-md my-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">1. {t("development.phases.planning.title")}</h3>
                <p className="text-sm">{t("development.phases.planning.description")}</p>
              </div>
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">2. {t("development.phases.design.title")}</h3>
                <p className="text-sm">{t("development.phases.design.description")}</p>
              </div>
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">3. {t("development.phases.development.title")}</h3>
                <p className="text-sm">{t("development.phases.development.description")}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-between mt-4">
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">4. {t("development.phases.testing.title")}</h3>
                <p className="text-sm">{t("development.phases.testing.description")}</p>
              </div>
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">5. {t("development.phases.deployment.title")}</h3>
                <p className="text-sm">{t("development.phases.deployment.description")}</p>
              </div>
              <div className="flex-1 p-4 bg-card rounded-md border">
                <h3 className="font-semibold mb-2">6. {t("development.phases.maintenance.title")}</h3>
                <p className="text-sm">{t("development.phases.maintenance.description")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.planning.title")}</h2>
          <p className="mb-4">
            {t("development.phases.planning.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Recopilación y análisis de requisitos</li>
            <li>Definición del alcance del proyecto</li>
            <li>Creación de historias de usuario</li>
            <li>Estimación de tiempos y recursos</li>
            <li>Identificación de riesgos potenciales</li>
            <li>Establecimiento de hitos y entregables</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Documento de requisitos</li>
            <li>Backlog del producto</li>
            <li>Plan de proyecto</li>
            <li>Análisis de riesgos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.design.title")}</h2>
          <p className="mb-4">
            {t("development.phases.design.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Diseño de la arquitectura de la aplicación</li>
            <li>Creación de wireframes y prototipos</li>
            <li>Diseño de la experiencia de usuario (UX)</li>
            <li>Diseño de la interfaz de usuario (UI)</li>
            <li>Definición del modelo de datos</li>
            <li>Selección de tecnologías y herramientas</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Documento de arquitectura</li>
            <li>Prototipos de UI/UX</li>
            <li>Esquema de base de datos</li>
            <li>Guía de estilo</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.development.title")}</h2>
          <p className="mb-4">
            {t("development.phases.development.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Configuración del entorno de desarrollo</li>
            <li>Implementación de la estructura base del proyecto</li>
            <li>Desarrollo de características según el backlog</li>
            <li>Integración continua</li>
            <li>Revisiones de código</li>
            <li>Pruebas unitarias</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Código fuente</li>
            <li>Documentación técnica</li>
            <li>Pruebas unitarias</li>
            <li>Informes de progreso</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.testing.title")}</h2>
          <p className="mb-4">
            {t("development.phases.testing.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Pruebas de integración</li>
            <li>Pruebas funcionales</li>
            <li>Pruebas de rendimiento</li>
            <li>Pruebas de seguridad</li>
            <li>Pruebas de usabilidad</li>
            <li>Corrección de errores</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Plan de pruebas</li>
            <li>Casos de prueba</li>
            <li>Informes de errores</li>
            <li>Documentación de pruebas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.deployment.title")}</h2>
          <p className="mb-4">
            {t("development.phases.deployment.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Preparación del entorno de producción</li>
            <li>Configuración de infraestructura</li>
            <li>Despliegue de la aplicación</li>
            <li>Migración de datos (si es necesario)</li>
            <li>Pruebas post-despliegue</li>
            <li>Monitoreo inicial</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Plan de despliegue</li>
            <li>Documentación de infraestructura</li>
            <li>Aplicación en producción</li>
            <li>Informes de despliegue</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.phases.maintenance.title")}</h2>
          <p className="mb-4">
            {t("development.phases.maintenance.description")}
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Actividades clave</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Monitoreo continuo</li>
            <li>Corrección de errores</li>
            <li>Actualizaciones de seguridad</li>
            <li>Mejoras de rendimiento</li>
            <li>Implementación de nuevas características</li>
            <li>Soporte a usuarios</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-3">Entregables</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Informes de rendimiento</li>
            <li>Actualizaciones de la aplicación</li>
            <li>Documentación actualizada</li>
            <li>Informes de incidentes</li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/development"
        prevLabel={t("sidebar.workflow")}
        nextPath="/development/testing"
        nextLabel={t("sidebar.testing")}
      />
    </>
  );
}
