import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.installation")} - ${t("meta.title")}`,
    description: t("gettingStarted.installation.description"),
  };
}

export default async function InstallationPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("gettingStarted.installation.title")}
        description={t("gettingStarted.installation.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.installation.requirements.title")}</h2>
          <p className="mb-4">{t("gettingStarted.installation.requirements.description")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("gettingStarted.installation.requirements.items.node")}</li>
            <li>{t("gettingStarted.installation.requirements.items.npm")}</li>
            <li>{t("gettingStarted.installation.requirements.items.git")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.installation.steps.title")}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.installation.steps.clone.title")}</h3>
            <p className="mb-2">{t("gettingStarted.installation.steps.clone.description")}</p>
            <CodeBlock code={`git clone https://github.com/yourusername/nextplate.git
cd nextplate`} />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.installation.steps.dependencies.title")}</h3>
            <p className="mb-2">{t("gettingStarted.installation.steps.dependencies.description")}</p>
            <CodeBlock code="npm install" />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.installation.steps.env.title")}</h3>
            <p className="mb-2">{t("gettingStarted.installation.steps.env.description")}</p>
            <CodeBlock code="cp .env.example .env.local" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Edita el archivo .env.local para configurar tus variables de entorno específicas.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.installation.steps.run.title")}</h3>
            <p className="mb-2">{t("gettingStarted.installation.steps.run.description")}</p>
            <CodeBlock code="npm run dev" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              La aplicación estará disponible en http://localhost:3000
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.installation.troubleshooting.title")}</h2>
          <p className="mb-4">{t("gettingStarted.installation.troubleshooting.description")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("gettingStarted.installation.troubleshooting.items.dependencies")}</li>
            <li>{t("gettingStarted.installation.troubleshooting.items.cache")}</li>
            <li>{t("gettingStarted.installation.troubleshooting.items.modules")}</li>
          </ul>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/getting-started"
          prevLabel={t("sidebar.introduction")}
          nextPath="/getting-started/quick-start"
          nextLabel={t("sidebar.quickStart")}
        />
      </DocContent>
    </>
  );
}
