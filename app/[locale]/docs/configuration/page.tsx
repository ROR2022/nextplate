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
    title: `${t("sidebar.supabase")} - ${t("meta.title")}`,
    description: t("configuration.supabase.description"),
  };
}

export default async function ConfigurationPage({
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
        title={t("configuration.supabase.title")}
        description={t("configuration.supabase.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.supabase.setup.title")}</h2>
          <p className="mb-4">
            Supabase es una plataforma de desarrollo de código abierto que proporciona todos los 
            servicios de backend que necesitas para construir una aplicación. NextPlate utiliza 
            Supabase para autenticación y gestión de base de datos.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Creación de un proyecto en Supabase</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a> y crea una cuenta o inicia sesión.</li>
            <li>Haz clic en &quot;New Project&quot; y selecciona una organización.</li>
            <li>Configura tu proyecto:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nombre del proyecto: Elige un nombre para tu proyecto.</li>
                <li>Base de datos: Crea una contraseña para la base de datos.</li>
                <li>Región: Selecciona la región más cercana a tus usuarios.</li>
              </ul>
            </li>
            <li>Haz clic en &quot;Create new project&quot; y espera a que se complete la configuración.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.supabase.auth.title")}</h2>
          <p className="mb-4">
            Supabase Auth proporciona un sistema completo de autenticación de usuarios. NextPlate 
            viene preconfigurado para usar autenticación con email/contraseña, Google y GitHub.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración de proveedores OAuth</h3>
          <p className="mb-4">
            Para configurar proveedores OAuth como Google y GitHub:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Supabase, ve a Authentication {'>'} Providers.</li>
            <li>Activa los proveedores que deseas utilizar (Google, GitHub, etc.).</li>
            <li>Para Google:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Crea un proyecto en <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a>.</li>
                <li>Configura las credenciales OAuth 2.0 para tu aplicación.</li>
                <li>Añade la URL de redirección de Supabase a los orígenes autorizados.</li>
                <li>Copia el Client ID y Client Secret a Supabase.</li>
              </ul>
            </li>
            <li>Para GitHub:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Ve a GitHub {'>'} Settings {'>'} Developer settings {'>'} OAuth Apps {'>'} New OAuth App.</li>
                <li>Configura la aplicación con la URL de callback de Supabase.</li>
                <li>Copia el Client ID y Client Secret a Supabase.</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.supabase.database.title")}</h2>
          <p className="mb-4">
            Supabase proporciona una base de datos PostgreSQL con todas las funciones. NextPlate 
            incluye esquemas predefinidos para usuarios y otras entidades necesarias.
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración de la base de datos</h3>
          <p className="mb-4">
            Para configurar la base de datos con el esquema necesario:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Supabase, ve a Table Editor.</li>
            <li>Puedes crear tablas manualmente o usar SQL para crear el esquema completo.</li>
            <li>NextPlate incluye scripts SQL en la carpeta <code>supabase/migrations</code> que puedes ejecutar en el SQL Editor.</li>
          </ol>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`-- Ejemplo de creación de una tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear un perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE create_profile_for_user();`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("configuration.supabase.environment.title")}</h2>
          <p className="mb-4">
            Para conectar tu aplicación NextPlate con Supabase, necesitas configurar las variables 
            de entorno adecuadas.
          </p>
          <p className="mb-4">
            Crea un archivo <code>.env.local</code> en la raíz de tu proyecto con las siguientes variables:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth Redirect
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Puedes encontrar estas claves en el dashboard de Supabase en Settings {'>'} API.
          </p>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/best-practices/patterns"
        prevLabel={t("sidebar.patterns")}
        nextPath="/configuration/mailgun"
        nextLabel={t("sidebar.mailgun")}
      />
    </>
  );
}
