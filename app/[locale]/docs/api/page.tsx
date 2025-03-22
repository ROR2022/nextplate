import { getTranslations } from "next-intl/server";
import DocContent from "../components/doc-content";
import DocNavigation from "../components/doc-navigation";
import { Metadata } from "next";
import { type PageProps } from "../api/auth/page";


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.api")} - ${t("meta.title")}`,
    description: t("api.overview.description"),
  };
}

export default async function ApiPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("api.overview.title")}
        description={t("api.overview.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.overview.intro.title")}</h2>
          <p className="mb-4">
            NextPlate proporciona una API completa que te permite interactuar con tu aplicación 
            de forma programática. Esta API está construida utilizando las API Routes de Next.js, 
            lo que permite crear endpoints serverless que pueden ser consumidos por tu frontend 
            o por aplicaciones externas.
          </p>
          <p className="mb-4">
            Esta documentación cubre los diferentes endpoints disponibles, cómo autenticarse, 
            y ejemplos de uso para cada operación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.overview.structure.title")}</h2>
          <p className="mb-4">
            La API de NextPlate sigue una estructura RESTful y está organizada en los siguientes 
            grupos principales:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Grupo</th>
                  <th className="border p-2 text-left">Descripción</th>
                  <th className="border p-2 text-left">Base URL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Autenticación</td>
                  <td className="border p-2">Endpoints para registro, inicio de sesión y gestión de sesiones</td>
                  <td className="border p-2"><code>/api/auth</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Usuarios</td>
                  <td className="border p-2">Gestión de perfiles de usuario y preferencias</td>
                  <td className="border p-2"><code>/api/users</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Pagos</td>
                  <td className="border p-2">Procesamiento de pagos y gestión de suscripciones</td>
                  <td className="border p-2"><code>/api/payments</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Webhooks</td>
                  <td className="border p-2">Endpoints para recibir eventos de servicios externos</td>
                  <td className="border p-2"><code>/api/webhooks</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.overview.authentication.title")}</h2>
          <p className="mb-4">
            La mayoría de los endpoints de la API requieren autenticación. NextPlate utiliza tokens JWT 
            para autenticar las solicitudes.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Obtención de un token</h3>
          <p className="mb-4">
            Para obtener un token de acceso, debes autenticarte utilizando el endpoint de inicio de sesión:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/login

// Request body
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

// Response
{
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
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso del token</h3>
          <p className="mb-4">
            Una vez que tienes un token, debes incluirlo en el encabezado <code>Authorization</code> 
            de tus solicitudes:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo con fetch
fetch('/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Ejemplo con axios
axios.get('/api/users/profile', {
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Renovación del token</h3>
          <p className="mb-4">
            Cuando un token de acceso expira, puedes utilizar el token de actualización para obtener 
            un nuevo token sin necesidad de volver a iniciar sesión:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/refresh

// Request body
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": 1672617600
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("api.overview.responses.title")}</h2>
          <p className="mb-4">
            La API de NextPlate sigue un formato de respuesta consistente:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Respuestas exitosas</h3>
          <p className="mb-4">
            Las respuestas exitosas tienen un código de estado 2xx y devuelven los datos solicitados:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de respuesta exitosa (200 OK)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@ejemplo.com",
    "name": "Usuario Ejemplo",
    "created_at": "2023-01-01T00:00:00Z"
  }
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Respuestas de error</h3>
          <p className="mb-4">
            Las respuestas de error tienen un código de estado 4xx o 5xx y devuelven información sobre el error:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de respuesta de error (400 Bad Request)
{
  "error": {
    "code": "invalid_request",
    "message": "El campo email es obligatorio",
    "status": 400
  }
}

// Ejemplo de respuesta de error (401 Unauthorized)
{
  "error": {
    "code": "unauthorized",
    "message": "No autorizado para acceder a este recurso",
    "status": 401
  }
}

// Ejemplo de respuesta de error (500 Internal Server Error)
{
  "error": {
    "code": "internal_server_error",
    "message": "Error interno del servidor",
    "status": 500
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("api.overview.examples.title")}</h2>
          <p className="mb-4">
            A continuación se muestran algunos ejemplos de uso común de la API:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Registro de usuario</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/auth/register

// Request body
{
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "name": "Nuevo Usuario"
}

// Response (201 Created)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "nuevo@ejemplo.com",
    "name": "Nuevo Usuario"
  },
  "message": "Usuario registrado correctamente. Por favor, verifica tu correo electrónico."
}`}
              </code>
            </pre>
          </div>

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

          <h3 className="text-xl font-semibold mt-6 mb-3">Crear una sesión de pago</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`POST /api/payments/create-checkout-session

// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Request body
{
  "price_id": "price_1234567890",
  "success_url": "https://tu-dominio.com/payment/success",
  "cancel_url": "https://tu-dominio.com/payment/canceled"
}

// Response (200 OK)
{
  "data": {
    "session_id": "cs_test_1234567890",
    "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
  }
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/development/deployment"
        prevLabel={t("sidebar.deployment")}
        nextPath="/api/auth"
        nextLabel={t("sidebar.auth")}
      />
    </>
  );
}
