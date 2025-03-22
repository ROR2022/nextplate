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
    title: `${t("sidebar.workflow")} - ${t("meta.title")}`,
    description: t("development.workflow.description"),
  };
}

export default async function DevelopmentPage({
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
        title={t("development.workflow.title")}
        description={t("development.workflow.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.intro.title")}</h2>
          <p className="mb-4">
            NextPlate está diseñado para proporcionar un flujo de trabajo de desarrollo eficiente y 
            estructurado. Esta sección describe las mejores prácticas para trabajar con el proyecto, 
            desde la configuración del entorno de desarrollo hasta el despliegue en producción.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.setup.title")}</h2>
          <p className="mb-4">
            Antes de comenzar a desarrollar con NextPlate, asegúrate de tener configurado correctamente 
            tu entorno de desarrollo:
          </p>
          <h3 className="text-xl font-semibold mt-6 mb-3">Requisitos previos</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Node.js (versión 18.0.0 o superior)</li>
            <li>npm (versión 9.0.0 o superior) o yarn (versión 1.22.0 o superior)</li>
            <li>Git</li>
            <li>Editor de código (recomendado: VS Code con extensiones para React y TypeScript)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Configuración inicial</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Clona el repositorio:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>git clone https://github.com/tu-usuario/nextplate.git</code>
              </div>
            </li>
            <li>Instala las dependencias:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>cd nextplate && npm install</code>
              </div>
            </li>
            <li>Crea un archivo <code>.env.local</code> basado en <code>.env.example</code>:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>cp .env.example .env.local</code>
              </div>
            </li>
            <li>Configura las variables de entorno según las instrucciones de la sección de configuración.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.commands.title")}</h2>
          <p className="mb-4">
            NextPlate incluye varios comandos útiles para el desarrollo:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Comando</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>npm run dev</code></td>
                  <td className="border p-2">Inicia el servidor de desarrollo en <code>http://localhost:3000</code></td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run build</code></td>
                  <td className="border p-2">Compila la aplicación para producción</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run start</code></td>
                  <td className="border p-2">Inicia la aplicación compilada en modo producción</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run lint</code></td>
                  <td className="border p-2">Ejecuta ESLint para verificar problemas de código</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run format</code></td>
                  <td className="border p-2">Formatea el código con Prettier</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run test</code></td>
                  <td className="border p-2">Ejecuta las pruebas unitarias</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run e2e</code></td>
                  <td className="border p-2">Ejecuta las pruebas end-to-end con Playwright</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.branching.title")}</h2>
          <p className="mb-4">
            Recomendamos seguir un modelo de ramificación basado en Git Flow para el desarrollo:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><strong>main:</strong> Rama principal que contiene el código de producción.</li>
            <li><strong>develop:</strong> Rama de desarrollo donde se integran las nuevas características.</li>
            <li><strong>feature/nombre-caracteristica:</strong> Ramas para desarrollar nuevas características.</li>
            <li><strong>bugfix/nombre-error:</strong> Ramas para corregir errores.</li>
            <li><strong>release/version:</strong> Ramas para preparar una nueva versión para producción.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Flujo de trabajo recomendado</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea una nueva rama desde <code>develop</code> para tu característica o corrección:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>git checkout -b feature/mi-nueva-caracteristica develop</code>
              </div>
            </li>
            <li>Desarrolla y realiza commits regularmente:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>git commit -m &quot;feat: añadir nueva funcionalidad&quot;</code>
              </div>
            </li>
            <li>Sigue las convenciones de commits (basadas en Conventional Commits).</li>
            <li>Cuando termines, crea un Pull Request a <code>develop</code>.</li>
            <li>Después de la revisión y aprobación, fusiona el PR.</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.conventions.title")}</h2>
          <p className="mb-4">
            Seguir convenciones consistentes mejora la mantenibilidad del código:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Convenciones de código</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Utiliza TypeScript para todo el código.</li>
            <li>Sigue las reglas de ESLint y Prettier configuradas en el proyecto.</li>
            <li>Utiliza nombres descriptivos para variables, funciones y componentes.</li>
            <li>Escribe comentarios para código complejo o no obvio.</li>
            <li>Mantén los componentes pequeños y enfocados en una sola responsabilidad.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Convenciones de commits</h3>
          <p className="mb-4">
            NextPlate sigue el estándar de Conventional Commits:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`<tipo>[alcance opcional]: <descripción>

[cuerpo opcional]

[notas de pie opcionales]`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Tipos comunes:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><code>feat:</code> Nueva característica</li>
            <li><code>fix:</code> Corrección de error</li>
            <li><code>docs:</code> Cambios en la documentación</li>
            <li><code>style:</code> Cambios que no afectan al significado del código</li>
            <li><code>refactor:</code> Cambio de código que no corrige un error ni añade una característica</li>
            <li><code>test:</code> Adición o corrección de pruebas</li>
            <li><code>chore:</code> Cambios en el proceso de build o herramientas auxiliares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("development.workflow.deployment.title")}</h2>
          <p className="mb-4">
            NextPlate está optimizado para ser desplegado en varios proveedores:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Vercel (Recomendado)</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea una cuenta en <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel</a>.</li>
            <li>Importa tu repositorio de GitHub, GitLab o Bitbucket.</li>
            <li>Configura las variables de entorno según las instrucciones de configuración.</li>
            <li>Haz clic en &quot;Deploy&quot;.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Netlify</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
            <li>Crea una cuenta en <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Netlify</a>.</li>
            <li>Importa tu repositorio.</li>
            <li>Configura el comando de build: <code>npm run build</code></li>
            <li>Configura el directorio de publicación: <code>.next</code></li>
            <li>Configura las variables de entorno.</li>
            <li>Haz clic en &quot;Deploy site&quot;.</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">Despliegue manual</h3>
          <ol className="list-decimal pl-5 space-y-2 mb-4">
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
            <li>Opcionalmente, usa PM2 o similar para gestionar el proceso:
              <div className="bg-muted p-3 rounded-md my-2">
                <code>pm2 start npm --name &quot;nextplate&quot; -- start</code>
              </div>
            </li>
          </ol>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/configuration/openai"
        prevLabel={t("sidebar.openai")}
        nextPath="/development/testing"
        nextLabel={t("sidebar.testing")}
      />
    </>
  );
}
