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
    title: `${t("sidebar.mailgun")} - ${t("meta.title")}`,
    description: t("configuration.mailgun.description"),
  };
}

export default async function MailgunConfigPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("configuration.mailgun.title")}
        description={t("configuration.mailgun.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.mailgun.intro.title")}</h2>
          <p className="mb-4">
            Mailgun es un servicio de envío de correos electrónicos que se integra con Supabase para 
            mejorar la entrega de correos de autenticación. NextPlate utiliza Mailgun como proveedor 
            SMTP personalizado para enviar correos de confirmación, recuperación de contraseñas y 
            otras notificaciones.
          </p>
          <p className="mb-4">
            Utilizar Mailgun en lugar del servicio interno de Supabase ofrece varias ventajas:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Mayor límite de envíos diarios</li>
            <li>Uso de un dominio personalizado para mejorar la confiabilidad</li>
            <li>Configuraciones avanzadas como SPF y DKIM para mejorar la entregabilidad</li>
            <li>Estadísticas detalladas sobre la entrega de correos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.mailgun.setup.title")}</h2>
          <h3 className="text-xl font-semibold mt-6 mb-3">Creación de una cuenta en Mailgun</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve a <a href="https://www.mailgun.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mailgun.com</a> y crea una cuenta.</li>
            <li>Verifica tu cuenta y añade un método de pago (Mailgun ofrece un plan gratuito con límites).</li>
            <li>Añade y verifica un dominio para el envío de correos o usa el sandbox domain para pruebas.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtención de credenciales SMTP</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Mailgun, selecciona tu dominio.</li>
            <li>Ve a la sección {'"'}Domain Settings{'"'} {'>'}  {'"'}SMTP{'"'}.</li>
            <li>Anota la siguiente información:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>SMTP Host: smtp.mailgun.org</li>
                <li>Puerto: 587 (TLS) o 465 (SSL)</li>
                <li>Usuario: normalmente tiene el formato postmaster@tu-dominio.com</li>
                <li>Contraseña: se proporciona en la página de configuración SMTP</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("configuration.mailgun.supabase.title")}</h2>
          <p className="mb-4">
            Para configurar Supabase para usar Mailgun como proveedor SMTP:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Supabase, ve a Authentication {'>'}  Email Templates.</li>
            <li>Haz clic en {'"'}SMTP Settings{'"'} en la parte superior.</li>
            <li>Activa {'"'}Custom SMTP{'"'} y completa los campos con la información de Mailgun:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Host: smtp.mailgun.org</li>
                <li>Port: 587</li>
                <li>User: tu-usuario-de-mailgun</li>
                <li>Password: tu-contraseña-de-mailgun</li>
                <li>Sender Name: El nombre que aparecerá como remitente</li>
                <li>Sender Email: El correo que aparecerá como remitente (debe ser verificado en Mailgun)</li>
              </ul>
            </li>
            <li>Haz clic en {'"'}Save{'"'} para guardar la configuración.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("configuration.mailgun.templates.title")}</h2>
          <p className="mb-4">
            Supabase permite personalizar las plantillas de correo electrónico para diferentes eventos:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Confirmación de correo:</strong> Enviado cuando un usuario se registra para verificar su dirección de correo.</li>
            <li><strong>Invitación:</strong> Enviado cuando un usuario es invitado a la aplicación.</li>
            <li><strong>Cambio de correo electrónico:</strong> Enviado cuando un usuario solicita cambiar su dirección de correo.</li>
            <li><strong>Restablecimiento de contraseña:</strong> Enviado cuando un usuario solicita restablecer su contraseña.</li>
          </ul>
          <p className="mb-4">
            Para personalizar estas plantillas:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>En el dashboard de Supabase, ve a Authentication {'>'} Email Templates.</li>
            <li>Selecciona la plantilla que deseas personalizar.</li>
            <li>Modifica el asunto y el contenido según tus necesidades.</li>
            <li>Puedes usar variables como {'{{ .ConfirmationURL }}'} que serán reemplazadas con valores reales.</li>
            <li>Haz clic en {'"'}Save{'"'} para guardar los cambios.</li>
          </ol>
          <div className="bg-muted p-4 rounded-md my-4">
            <p className="text-sm mb-2 font-medium">Ejemplo de plantilla de restablecimiento de contraseña:</p>
            <pre className="text-sm overflow-x-auto">
              <code>
{`<h2>Restablecer tu contraseña</h2>
<p>Hola,</p>
<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para establecer una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
<p>Saludos,<br>El equipo de NextPlate</p>`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/configuration"
        prevLabel={t("sidebar.supabase")}
        nextPath="/configuration/stripe"
        nextLabel={t("sidebar.stripe")}
      />
    </>
  );
}
