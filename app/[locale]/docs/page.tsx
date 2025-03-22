import { getTranslations } from "next-intl/server";
import DocContent from "./components/doc-content";
import DocNavigation from "./components/doc-navigation";
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
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function DocsPage({
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
        title={t("home.title")}
        description={t("home.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("home.whatIs.title")}</h2>
          <p className="mb-4">
            {t("home.whatIs.description")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-semibold mb-2">{t("home.features.title")}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t("home.features.items.auth")}</li>
                <li>{t("home.features.items.ui")}</li>
                <li>{t("home.features.items.payments")}</li>
                <li>{t("home.features.items.ai")}</li>
                <li>{t("home.features.items.legal")}</li>
                <li>{t("home.features.items.i18n")}</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-semibold mb-2">{t("home.technologies.title")}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Next.js</li>
                <li>Supabase</li>
                <li>TypeScript</li>
                <li>Shadcn UI</li>
                <li>Stripe</li>
                <li>OpenAI</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("home.getStarted.title")}</h2>
          <p className="mb-4">
            {t("home.getStarted.description")}
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="overflow-x-auto">
              <code>git clone https://github.com/yourusername/nextplate.git</code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("home.documentation.title")}</h2>
          <p>
            {t("home.documentation.description")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {[
              {
                title: t("sidebar.gettingStarted"),
                description: t("home.documentation.sections.gettingStarted"),
                href: "/getting-started",
              },
              {
                title: t("sidebar.architecture"),
                description: t("home.documentation.sections.architecture"),
                href: "/architecture",
              },
              {
                title: t("sidebar.bestPractices"),
                description: t("home.documentation.sections.bestPractices"),
                href: "/best-practices",
              },
              {
                title: t("sidebar.configuration"),
                description: t("home.documentation.sections.configuration"),
                href: "/configuration",
              },
              {
                title: t("sidebar.development"),
                description: t("home.documentation.sections.development"),
                href: "/development",
              },
            ].map((section, index) => (
              <a
                key={index}
                href={`/${locale}/docs${section.href}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-medium text-lg mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        nextPath="/getting-started"
        nextLabel={t("sidebar.introduction")}
      />
    </>
  );
}
