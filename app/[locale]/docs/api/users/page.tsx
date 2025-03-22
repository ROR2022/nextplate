import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
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
    title: `${t("sidebar.users")} - ${t("meta.title")}`,
    description: t("api.users.description"),
  };
}

export default async function ApiUsersPage({
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
        title={t("api.users.title")}
        description={t("api.users.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.users.intro.title")}</h2>
          <p className="mb-4">
            La API de usuarios de NextPlate proporciona endpoints para gestionar perfiles de usuario, 
            preferencias y configuraciones. Estos endpoints permiten a los usuarios ver y actualizar 
            su información personal, gestionar sus preferencias y realizar otras operaciones relacionadas 
            con su cuenta.
          </p>
          <p className="mb-4">
            Todos los endpoints de usuarios están disponibles en la ruta base <code>/api/users</code> y 
            requieren autenticación mediante un token JWT válido.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.users.endpoints.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener perfil de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/users/profile

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "avatar_url": "https://ejemplo.com/avatar.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve el perfil completo del usuario autenticado, incluyendo su información 
            personal y preferencias.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Actualizar perfil de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`PATCH /api/users/profile

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "name": "Nombre Actualizado",
  "avatar_url": "https://ejemplo.com/nuevo-avatar.jpg"
}

// Response (200 OK)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Actualizado",
    "avatar_url": "https://ejemplo.com/nuevo-avatar.jpg",
    "updated_at": "2023-01-02T00:00:00Z"
  },
  "message": "Perfil actualizado correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint actualiza la información del perfil del usuario autenticado.
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
                  <td className="border p-2"><code>name</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Nombre completo del usuario</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>avatar_url</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">URL de la imagen de perfil del usuario</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Eliminar cuenta de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`DELETE /api/users/profile

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "message": "Cuenta eliminada correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint elimina permanentemente la cuenta del usuario autenticado, incluyendo todos sus 
            datos y preferencias. Esta acción no se puede deshacer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.users.preferences.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Obtener preferencias de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/users/preferences

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": {
    "theme": "dark",
    "language": "es",
    "notifications": {
      "email": true,
      "push": false
    }
  }
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve las preferencias del usuario autenticado, como el tema, idioma y 
            configuración de notificaciones.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Actualizar preferencias de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`PATCH /api/users/preferences

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "theme": "light",
  "language": "en",
  "notifications": {
    "email": true,
    "push": true
  }
}

// Response (200 OK)
{
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true
    }
  },
  "message": "Preferencias actualizadas correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint actualiza las preferencias del usuario autenticado.
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
                  <td className="border p-2"><code>theme</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Tema de la interfaz (light, dark, system)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>language</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Código de idioma (en, es, fr, etc.)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>notifications</code></td>
                  <td className="border p-2">object</td>
                  <td className="border p-2">No</td>
                  <td className="border p-2">Configuración de notificaciones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.users.sessions.title")}</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Listar sesiones activas</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`GET /api/users/sessions

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "data": [
    {
      "id": "session_1",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
      "ip": "192.168.1.1",
      "created_at": "2023-01-01T00:00:00Z",
      "last_active_at": "2023-01-02T00:00:00Z",
      "current": true
    },
    {
      "id": "session_2",
      "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)...",
      "ip": "192.168.1.2",
      "created_at": "2023-01-01T12:00:00Z",
      "last_active_at": "2023-01-01T18:00:00Z",
      "current": false
    }
  ]
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint devuelve una lista de todas las sesiones activas del usuario autenticado, 
            incluyendo información sobre el dispositivo, ubicación y última actividad.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Revocar sesión</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`DELETE /api/users/sessions/{session_id}

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "message": "Sesión revocada correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint revoca una sesión específica del usuario autenticado, invalidando el token 
            de acceso asociado. Si se revoca la sesión actual, el usuario deberá iniciar sesión nuevamente.
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
                  <td className="border p-2"><code>session_id</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2">Sí</td>
                  <td className="border p-2">ID de la sesión a revocar</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Revocar todas las sesiones</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`DELETE /api/users/sessions

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response (200 OK)
{
  "message": "Todas las sesiones han sido revocadas correctamente"
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Este endpoint revoca todas las sesiones del usuario autenticado, excepto la sesión actual. 
            Esto es útil cuando el usuario sospecha que su cuenta ha sido comprometida.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("api.users.errors.title")}</h2>
          <p className="mb-4">
            Los endpoints de usuarios pueden devolver los siguientes errores:
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
                  <td className="border p-2"><code>unauthorized</code></td>
                  <td className="border p-2">No se ha proporcionado un token válido</td>
                </tr>
                <tr>
                  <td className="border p-2">403</td>
                  <td className="border p-2"><code>forbidden</code></td>
                  <td className="border p-2">No tienes permiso para realizar esta acción</td>
                </tr>
                <tr>
                  <td className="border p-2">404</td>
                  <td className="border p-2"><code>not_found</code></td>
                  <td className="border p-2">El recurso solicitado no existe</td>
                </tr>
                <tr>
                  <td className="border p-2">409</td>
                  <td className="border p-2"><code>conflict</code></td>
                  <td className="border p-2">La solicitud no puede ser completada debido a un conflicto</td>
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
{`// Respuesta de error (404 Not Found)
{
  "error": {
    "code": "not_found",
    "message": "La sesión especificada no existe",
    "status": 404
  }
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/api/auth"
        prevLabel={t("sidebar.auth")}
        nextPath="/api/payments"
        nextLabel={t("sidebar.payments")}
      />
    </>
  );
}
