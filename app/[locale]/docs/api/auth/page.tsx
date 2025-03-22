import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { ReactNode } from "react";

// Definir el tipo Props de manera consistente con el resto del proyecto
type Props = {
  children?: ReactNode;
  params: {locale: string};
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.auth")} - ${t("meta.title")}`,
    description: t("api.auth.description"),
  };
}

export default async function ApiAuthPage({
  params,
}: Props) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await Promise.resolve(params);
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("api.auth.title")}
        description={t("api.auth.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.auth.intro.title")}</h2>
          <p className="mb-4">
            La API de autenticación de NextPlate proporciona endpoints para gestionar el registro de usuarios, 
            inicio de sesión, cierre de sesión, recuperación de contraseñas y otras operaciones relacionadas 
            con la autenticación. Estos endpoints están construidos sobre Supabase Auth, proporcionando una 
            capa de abstracción que facilita su uso.
          </p>
          <p className="mb-4">
            Todos los endpoints de autenticación están disponibles en la ruta base <code>/api/auth</code>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.auth.endpoints.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Registro de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/register

// Request body
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Usuario Ejemplo"
}

// Response (201 Created)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo"
  },
  "message": "Usuario registrado correctamente. Por favor, verifica tu correo electrónico."
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint registra un nuevo usuario en el sistema. Después del registro exitoso, 
            se envía un correo electrónico de confirmación a la dirección proporcionada.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>email</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Dirección de correo electrónico del usuario</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>password</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Contraseña (mínimo 8 caracteres)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>name</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Nombre completo del usuario</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Inicio de sesión</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/login

// Request body
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

// Response (200 OK)
{
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "usuario@ejemplo.com",
      "name": "Usuario Ejemplo"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_at": 1672531200
    }
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint autentica a un usuario y devuelve un token de acceso y un token de actualización 
            que pueden ser utilizados para autenticar solicitudes posteriores.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>email</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Dirección de correo electrónico del usuario</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>password</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Contraseña del usuario</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Renovación de token</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/refresh

// Request body
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response (200 OK)
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1672617600
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint renueva un token de acceso expirado utilizando un token de actualización válido.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>refresh_token</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Token de actualización obtenido durante el inicio de sesión</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cierre de sesión</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/logout

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "message": "Sesión cerrada correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint cierra la sesión actual del usuario, invalidando el token de acceso.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Solicitud de restablecimiento de contraseña</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/reset-password

// Request body
{
  "email": "usuario@ejemplo.com"
}

// Response (200 OK)
{
  "message": "Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint envía un correo electrónico con instrucciones para restablecer la contraseña 
            a la dirección de correo electrónico proporcionada.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>email</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Dirección de correo electrónico del usuario</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cambio de contraseña</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/change-password

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "current_password": "contraseña123",
  "new_password": "nuevaContraseña456"
}

// Response (200 OK)
{
  "message": "Contraseña actualizada correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint permite a un usuario autenticado cambiar su contraseña.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Parámetro</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Requerido</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>current_password</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Contraseña actual del usuario</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>new_password</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">Nueva contraseña (mínimo 8 caracteres)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.auth.oauth.title")}</h2>
          <p className="mb-4">
            NextPlate también soporta autenticación mediante proveedores OAuth como Google y GitHub.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Inicio de sesión con Google</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/google

// Response (302 Found)
// Redirecciona al flujo de autenticación de Google`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint inicia el flujo de autenticación con Google. Después de la autenticación exitosa, 
            el usuario es redirigido a la URL de redirección configurada.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Inicio de sesión con GitHub</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/github

// Response (302 Found)
// Redirecciona al flujo de autenticación de GitHub`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint inicia el flujo de autenticación con GitHub. Después de la autenticación exitosa, 
            el usuario es redirigido a la URL de redirección configurada.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("api.auth.errors.title")}</h2>
          <p className="mb-4">
            Los endpoints de autenticación pueden devolver los siguientes errores:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Código de estado</th>
                  <th className="border p-2 text-left">Código de error</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">400</td>
                  <td className="border p-2"><code>invalid_request</code></td>
                  <td className="border p-2">La solicitud contiene parámetros inválidos o faltantes</td>
                </tr>
                <tr>
                  <td className="border p-2">401</td>
                  <td className="border p-2"><code>invalid_credentials</code></td>
                  <td className="border p-2">Las credenciales proporcionadas son inválidas</td>
                </tr>
                <tr>
                  <td className="border p-2">401</td>
                  <td className="border p-2"><code>invalid_token</code></td>
                  <td className="border p-2">El token proporcionado es inválido o ha expirado</td>
                </tr>
                <tr>
                  <td className="border p-2">403</td>
                  <td className="border p-2"><code>email_not_confirmed</code></td>
                  <td className="border p-2">El correo electrónico del usuario no ha sido confirmado</td>
                </tr>
                <tr>
                  <td className="border p-2">409</td>
                  <td className="border p-2"><code>email_already_exists</code></td>
                  <td className="border p-2">Ya existe un usuario con el correo electrónico proporcionado</td>
                </tr>
                <tr>
                  <td className="border p-2">429</td>
                  <td className="border p-2"><code>too_many_requests</code></td>
                  <td className="border p-2">Se han realizado demasiadas solicitudes en un corto período de tiempo</td>
                </tr>
                <tr>
                  <td className="border p-2">500</td>
                  <td className="border p-2"><code>internal_server_error</code></td>
                  <td className="border p-2">Error interno del servidor</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Ejemplo de respuesta de error:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Respuesta de error (401 Unauthorized)
{
  "error": {
    "code": "invalid_credentials",
    "message": "Correo electrónico o contraseña incorrectos",
    "status": 401
  }
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/api"
        prevLabel={t("sidebar.api")}
        nextPath="/api/users"
        nextLabel={t("sidebar.users")}
      />
    </>
  );
}
