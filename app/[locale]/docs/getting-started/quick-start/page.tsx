import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.quickStart")} - ${t("meta.title")}`,
    description: t("gettingStarted.quickStart.description"),
  };
}

export default async function QuickStartPage({
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
        title={t("gettingStarted.quickStart.title")}
        description={t("gettingStarted.quickStart.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.quickStart.overview.title")}</h2>
          <p className="mb-4">{t("gettingStarted.quickStart.overview.description")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.quickStart.prerequisites.title")}</h2>
          <p className="mb-4">{t("gettingStarted.quickStart.prerequisites.description")}</p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              Si aún no has instalado NextPlate, consulta la <a href={`/${locale}/docs/getting-started/installation`} className="text-primary hover:underline">guía de instalación</a> antes de continuar.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.quickStart.basicUsage.title")}</h2>
          <p className="mb-4">{t("gettingStarted.quickStart.basicUsage.description")}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.quickStart.basicUsage.steps.authentication.title")}</h3>
            <p className="mb-2">{t("gettingStarted.quickStart.basicUsage.steps.authentication.description")}</p>
            <CodeBlock code={`// En tu archivo .env.local
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase`} />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              La autenticación ya está configurada en NextPlate. Solo necesitas proporcionar tus credenciales de Supabase.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.quickStart.basicUsage.steps.database.title")}</h3>
            <p className="mb-2">{t("gettingStarted.quickStart.basicUsage.steps.database.description")}</p>
            <CodeBlock code={`-- Ejemplo de esquema SQL para Supabase
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Trigger para crear un perfil automáticamente cuando se registra un usuario
CREATE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, website, updated_at)
  VALUES (new.id, new.email, '', '', '', now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`} />
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.quickStart.basicUsage.steps.payments.title")}</h3>
            <p className="mb-2">{t("gettingStarted.quickStart.basicUsage.steps.payments.description")}</p>
            <CodeBlock code={`// En tu archivo .env.local
STRIPE_SECRET_KEY=tu-clave-secreta-de-stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu-clave-publicable-de-stripe
STRIPE_WEBHOOK_SECRET=tu-clave-secreta-de-webhook`} />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              NextPlate incluye integración con Stripe para procesar pagos. Configura tus claves de API para comenzar.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{t("gettingStarted.quickStart.basicUsage.steps.deployment.title")}</h3>
            <p className="mb-2">{t("gettingStarted.quickStart.basicUsage.steps.deployment.description")}</p>
            <CodeBlock code={`# Despliegue en Vercel
vercel

# O para producción
vercel --prod`} />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              NextPlate está optimizado para despliegue en Vercel, pero también puedes usar otros proveedores como Netlify o AWS Amplify.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("gettingStarted.quickStart.nextSteps.title")}</h2>
          <p className="mb-4">{t("gettingStarted.quickStart.nextSteps.description")}</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("gettingStarted.quickStart.nextSteps.items.customization")}</li>
            <li>{t("gettingStarted.quickStart.nextSteps.items.features")}</li>
            <li>{t("gettingStarted.quickStart.nextSteps.items.testing")}</li>
            <li>{t("gettingStarted.quickStart.nextSteps.items.optimization")}</li>
          </ul>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/getting-started/installation"
          prevLabel={t("sidebar.installation")}
          nextPath="/architecture"
          nextLabel={t("sidebar.overview")}
        />
      </DocContent>
    </>
  );
}
