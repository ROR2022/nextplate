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
    title: `${t("sidebar.deployment")} - ${t("meta.title")}`,
    description: t("development.deployment.description"),
  };
}

export default async function DeploymentPage({
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
        title={t("development.deployment.title")}
        description={t("development.deployment.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.deployment.intro.title")}</h2>
          <p className="mb-4">
            Desplegar tu aplicación NextPlate en producción es un paso crucial para hacer que tu 
            proyecto esté disponible para los usuarios finales. Esta guía cubre diferentes opciones 
            de despliegue, desde servicios gestionados hasta configuraciones manuales, para ayudarte 
            a elegir la mejor opción para tu proyecto.
          </p>
          <p className="mb-4">
            NextPlate está optimizado para ser desplegado en varios proveedores de hosting, con 
            configuraciones específicas para garantizar el mejor rendimiento y la máxima compatibilidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.deployment.vercel.title")}</h2>
          <p className="mb-4">
            Vercel es la plataforma creada por los desarrolladores de Next.js y ofrece la mejor 
            experiencia de despliegue para aplicaciones Next.js, incluyendo NextPlate.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Ventajas de Vercel</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Integración nativa con Next.js y todas sus características</li>
            <li>Despliegues automáticos desde GitHub, GitLab o Bitbucket</li>
            <li>Previews para cada Pull Request</li>
            <li>Análisis de rendimiento integrados</li>
            <li>Escalado automático</li>
            <li>CDN global para una entrega rápida</li>
            <li>Soporte para funciones serverless y Edge</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pasos para desplegar en Vercel</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea una cuenta en <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel</a>.</li>
            <li>Conecta tu repositorio de GitHub, GitLab o Bitbucket.</li>
            <li>Selecciona el repositorio de tu proyecto NextPlate.</li>
            <li>Configura las variables de entorno necesarias:
              <div className="bg-muted p-3 rounded-md my-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Variables de Supabase (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)</li>
                  <li>Variables de autenticación (NEXT_PUBLIC_APP_URL)</li>
                  <li>Variables de servicios externos (Stripe, OpenAI, etc.)</li>
                </ul>
              </div>
            </li>
            <li>Haz clic en {'"'}Deploy{'"'} y espera a que se complete el proceso.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración del dominio</h3>
          <p className="mb-4">
            Para configurar un dominio personalizado en Vercel:
          </p>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Ve a la configuración del proyecto en el dashboard de Vercel.</li>
            <li>Navega a la sección {'"'}Domains{'"'}.</li>
            <li>Añade tu dominio y sigue las instrucciones para configurar los registros DNS.</li>
            <li>Vercel proporciona automáticamente certificados SSL para tu dominio.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.deployment.netlify.title")}</h2>
          <p className="mb-4">
            Netlify es otra excelente opción para desplegar aplicaciones Next.js, con características 
            similares a Vercel pero con algunas diferencias en la configuración.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Ventajas de Netlify</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Despliegues automáticos desde repositorios Git</li>
            <li>Previews para cada Pull Request</li>
            <li>Funciones serverless integradas</li>
            <li>CDN global</li>
            <li>Formularios integrados</li>
            <li>Gestión de identidad de usuarios</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pasos para desplegar en Netlify</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea una cuenta en <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netlify</a>.</li>
            <li>Haz clic en {'"'}New site from Git{'"'} y conecta tu repositorio.</li>
            <li>Configura las opciones de build:
              <div className="bg-muted p-3 rounded-md my-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Build command: <code>npm run build</code></li>
                  <li>Publish directory: <code>.next</code></li>
                </ul>
              </div>
            </li>
            <li>Añade un archivo <code>netlify.toml</code> a la raíz de tu proyecto con la siguiente configuración:
              <div className="bg-muted p-3 rounded-md my-2">
                <pre className="text-sm overflow-x-auto">
                  <code>
{`[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_USE_NETLIFY_EDGE = "true"`}
                  </code>
                </pre>
              </div>
            </li>
            <li>Configura las variables de entorno necesarias en la sección {'"'}Build & deploy{'"'} {'>'}  {'"'}Environment{'"'}.</li>
            <li>Haz clic en {'"'}Deploy site{'"'}.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.deployment.docker.title")}</h2>
          <p className="mb-4">
            Docker permite empaquetar tu aplicación NextPlate en un contenedor que puede ser desplegado 
            en cualquier plataforma que soporte Docker, como AWS, Google Cloud, Azure, o tu propio servidor.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Ventajas de Docker</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Entorno consistente entre desarrollo y producción</li>
            <li>Fácil escalado horizontal</li>
            <li>Portabilidad entre diferentes plataformas de hosting</li>
            <li>Control total sobre la configuración del servidor</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración de Docker</h3>
          <p className="mb-4">
            NextPlate incluye un <code>Dockerfile</code> optimizado para producción:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pasos para desplegar con Docker</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Construye la imagen Docker:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>docker build -t nextplate .</code>
              </div>
            </li>
            <li>Ejecuta el contenedor:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your_value -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value nextplate</code>
              </div>
            </li>
            <li>Para desplegar en servicios de contenedores en la nube:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>AWS ECS o EKS</li>
                <li>Google Cloud Run o GKE</li>
                <li>Azure Container Instances o AKS</li>
                <li>DigitalOcean App Platform</li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("development.deployment.self.title")}</h2>
          <p className="mb-4">
            Si prefieres tener control total sobre tu infraestructura, puedes desplegar NextPlate 
            en tu propio servidor.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Requisitos del servidor</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Node.js 18.0.0 o superior</li>
            <li>npm o yarn</li>
            <li>Al menos 1GB de RAM (recomendado 2GB o más)</li>
            <li>Sistema operativo Linux (recomendado Ubuntu 20.04 o superior)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pasos para el despliegue manual</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Clona el repositorio en tu servidor:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>git clone https://github.com/tu-usuario/nextplate.git</code>
              </div>
            </li>
            <li>Instala las dependencias:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>cd nextplate && npm install</code>
              </div>
            </li>
            <li>Crea un archivo <code>.env.local</code> con las variables de entorno necesarias.</li>
            <li>Compila la aplicación:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>npm run build</code>
              </div>
            </li>
            <li>Inicia el servidor:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>npm run start</code>
              </div>
            </li>
            <li>Configura un proceso de gestión como PM2 para mantener la aplicación en ejecución:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>npm install -g pm2</code><br />
                <code>pm2 start npm --name &quot;nextplate&quot; -- start</code>
              </div>
            </li>
            <li>Configura un servidor web como Nginx como proxy inverso:
              <div className="bg-muted p-3 rounded-md my-2">
                <pre className="text-sm overflow-x-auto">
                  <code>
{`# /etc/nginx/sites-available/nextplate
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}
                  </code>
                </pre>
              </div>
            </li>
            <li>Configura HTTPS con Certbot:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>sudo certbot --nginx -d tu-dominio.com</code>
              </div>
            </li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automatización de despliegues</h3>
          <p className="mb-4">
            Para automatizar los despliegues en tu propio servidor, puedes utilizar herramientas como:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>GitHub Actions para ejecutar scripts de despliegue en cada push</li>
            <li>Jenkins para configurar pipelines de CI/CD</li>
            <li>GitLab CI/CD para automatizar el proceso de despliegue</li>
            <li>Scripts personalizados que utilizan SSH para conectarse al servidor y actualizar la aplicación</li>
          </ul>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/development/i18n"
        prevLabel={t("sidebar.i18n")}
        nextPath="/api"
        nextLabel={t("sidebar.api")}
      />
    </>
  );
}
