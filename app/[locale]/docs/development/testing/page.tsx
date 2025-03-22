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
    title: `${t("sidebar.testing")} - ${t("meta.title")}`,
    description: t("development.testing.description"),
  };
}

export default async function TestingPage({
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
        title={t("development.testing.title")}
        description={t("development.testing.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.testing.intro.title")}</h2>
          <p className="mb-4">
            Las pruebas son una parte fundamental del desarrollo de software de calidad. NextPlate 
            incluye una configuración completa para diferentes tipos de pruebas, lo que te permite 
            verificar que tu aplicación funciona correctamente y mantener la calidad del código 
            a medida que evoluciona.
          </p>
          <p className="mb-4">
            Esta sección describe las estrategias y herramientas de prueba incluidas en NextPlate.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.testing.types.title")}</h2>
          <p className="mb-4">
            NextPlate soporta varios tipos de pruebas:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pruebas unitarias</h3>
          <p className="mb-4">
            Las pruebas unitarias verifican que las unidades individuales de código (funciones, componentes, etc.) 
            funcionan correctamente de forma aislada.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Se utilizan para probar la lógica de negocio, utilidades y componentes pequeños.</li>
            <li>Deben ser rápidas y no depender de servicios externos.</li>
            <li>Ayudan a detectar problemas temprano en el ciclo de desarrollo.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pruebas de integración</h3>
          <p className="mb-4">
            Las pruebas de integración verifican que diferentes partes de la aplicación funcionan 
            correctamente juntas.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Prueban la interacción entre componentes, páginas y servicios.</li>
            <li>Pueden incluir la integración con APIs y bases de datos.</li>
            <li>Son más lentas que las pruebas unitarias pero proporcionan mayor confianza.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Pruebas end-to-end (E2E)</h3>
          <p className="mb-4">
            Las pruebas E2E simulan la interacción de un usuario real con la aplicación, verificando 
            que los flujos completos funcionan correctamente.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Prueban la aplicación en un entorno similar al de producción.</li>
            <li>Verifican flujos completos como registro, inicio de sesión, etc.</li>
            <li>Son las más lentas pero proporcionan la mayor confianza.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.testing.tools.title")}</h2>
          <p className="mb-4">
            NextPlate incluye las siguientes herramientas de prueba:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Jest</h3>
          <p className="mb-4">
            Jest es el framework principal para pruebas unitarias y de integración.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Incluye un runner de pruebas, aserciones y mocks.</li>
            <li>Configurado para trabajar con TypeScript y React.</li>
            <li>Proporciona cobertura de código para identificar áreas sin probar.</li>
          </ul>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de prueba unitaria con Jest
import { sum } from '../utils/math';

describe('sum function', () => {
  it('adds two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });
});`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">React Testing Library</h3>
          <p className="mb-4">
            React Testing Library se utiliza para probar componentes de React de una manera centrada en el usuario.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Enfocada en probar el comportamiento en lugar de la implementación.</li>
            <li>Simula interacciones del usuario como clics, entradas de texto, etc.</li>
            <li>Trabaja con Jest para proporcionar una experiencia de prueba completa.</li>
          </ul>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de prueba de componente con React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../components/Counter';

describe('Counter component', () => {
  it('increments count when button is clicked', () => {
    render(<Counter />);
    
    // El contador comienza en 0
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    // Hacer clic en el botón de incremento
    fireEvent.click(screen.getByRole('button', { name: /increment/i }));
    
    // El contador debe ser 1 después del clic
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Playwright</h3>
          <p className="mb-4">
            Playwright se utiliza para pruebas end-to-end, simulando la interacción del usuario en navegadores reales.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Soporta múltiples navegadores (Chrome, Firefox, Safari).</li>
            <li>Proporciona APIs potentes para interactuar con la página.</li>
            <li>Incluye herramientas para depuración y generación de informes.</li>
          </ul>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Ejemplo de prueba E2E con Playwright
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  // Navegar a la página de inicio de sesión
  await page.goto('/login');
  
  // Rellenar el formulario
  await page.fill('input[name="email"]', 'usuario@ejemplo.com');
  await page.fill('input[name="password"]', 'contraseña123');
  
  // Enviar el formulario
  await page.click('button[type="submit"]');
  
  // Verificar que el usuario ha iniciado sesión correctamente
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("development.testing.running.title")}</h2>
          <p className="mb-4">
            NextPlate incluye varios comandos para ejecutar pruebas:
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
                  <td className="border p-2"><code>npm run test</code></td>
                  <td className="border p-2">Ejecuta todas las pruebas unitarias y de integración</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run test:watch</code></td>
                  <td className="border p-2">Ejecuta las pruebas en modo watch (se vuelven a ejecutar cuando cambia el código)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run test:coverage</code></td>
                  <td className="border p-2">Ejecuta las pruebas y genera un informe de cobertura</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run e2e</code></td>
                  <td className="border p-2">Ejecuta las pruebas end-to-end con Playwright</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>npm run e2e:ui</code></td>
                  <td className="border p-2">Abre la interfaz de usuario de Playwright para ejecutar y depurar pruebas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("development.testing.best.title")}</h2>
          <p className="mb-4">
            Sigue estas mejores prácticas para pruebas efectivas:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Estructura de pruebas</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Coloca las pruebas cerca del código que prueban (archivos <code>*.test.ts</code> o <code>*.test.tsx</code>).</li>
            <li>Organiza las pruebas en bloques <code>describe</code> lógicos.</li>
            <li>Usa nombres descriptivos para las pruebas que expliquen qué se está probando.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Estrategia de pruebas</h3>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Sigue la pirámide de pruebas: muchas pruebas unitarias, menos pruebas de integración, pocas pruebas E2E.</li>
            <li>Prueba los casos límite y los escenarios de error, no solo el camino feliz.</li>
            <li>Usa mocks para aislar el código que estás probando de sus dependencias.</li>
            <li>Mantén las pruebas independientes entre sí para evitar efectos secundarios.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Integración continua</h3>
          <p className="mb-4">
            NextPlate está configurado para ejecutar pruebas automáticamente en CI/CD:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Las pruebas unitarias y de integración se ejecutan en cada pull request.</li>
            <li>Las pruebas E2E se ejecutan antes de desplegar a producción.</li>
            <li>Los informes de cobertura ayudan a identificar áreas que necesitan más pruebas.</li>
          </ul>
          <p className="mb-4">
            Configura tu pipeline de CI/CD para que falle si las pruebas no pasan, garantizando que 
            solo se despliegue código de calidad.
          </p>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/development"
        prevLabel={t("sidebar.workflow")}
        nextPath="/development/i18n"
        nextLabel={t("sidebar.i18n")}
      />
    </>
  );
}
