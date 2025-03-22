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
    title: `${t("sidebar.components")} - ${t("meta.title")}`,
    description: t("components.overview.description"),
  };
}

export default async function ComponentsPage({
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
        title={t("components.overview.title")}
        description={t("components.overview.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.intro.title")}</h2>
          <p className="mb-4">
            NextPlate incluye una amplia biblioteca de componentes reutilizables construidos sobre 
            Tailwind CSS y Shadcn UI. Estos componentes están diseñados para ser altamente personalizables, 
            accesibles y fáciles de usar, permitiéndote construir interfaces de usuario modernas y 
            responsivas rápidamente.
          </p>
          <p className="mb-4">
            Esta documentación cubre los componentes principales disponibles en NextPlate, sus propiedades, 
            variantes y ejemplos de uso. Todos los componentes siguen las mejores prácticas de accesibilidad 
            y están optimizados para rendimiento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.structure.title")}</h2>
          <p className="mb-4">
            Los componentes de NextPlate están organizados en las siguientes categorías:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Categoría</th>
                  <th className="border p-2 text-left">Descripción</th>
                  <th className="border p-2 text-left">Ubicación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">UI</td>
                  <td className="border p-2">Componentes básicos de interfaz de usuario</td>
                  <td className="border p-2"><code>components/ui</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Layout</td>
                  <td className="border p-2">Componentes para estructurar el diseño de la página</td>
                  <td className="border p-2"><code>components/layout</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Auth</td>
                  <td className="border p-2">Componentes relacionados con la autenticación</td>
                  <td className="border p-2"><code>components/auth</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Forms</td>
                  <td className="border p-2">Componentes para la creación y gestión de formularios</td>
                  <td className="border p-2"><code>components/forms</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Data Display</td>
                  <td className="border p-2">Componentes para mostrar datos y listas</td>
                  <td className="border p-2"><code>components/data</code></td>
                </tr>
                <tr>
                  <td className="border p-2">Feedback</td>
                  <td className="border p-2">Componentes para mostrar mensajes y notificaciones</td>
                  <td className="border p-2"><code>components/feedback</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.usage.title")}</h2>
          <p className="mb-4">
            Para utilizar un componente en tu aplicación, simplemente impórtalo desde su ubicación correspondiente:
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// Importar un componente UI
import { Button } from "@/components/ui/button";

// Usar el componente en tu JSX
export default function MyComponent() {
  return (
    <Button variant="default">Click me</Button>
  );
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            La mayoría de los componentes aceptan propiedades para personalizar su apariencia y comportamiento. 
            Consulta la documentación específica de cada componente para ver todas las propiedades disponibles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.ui.title")}</h2>
          <p className="mb-4">
            Los componentes UI son los bloques de construcción básicos para tu interfaz de usuario. 
            Incluyen elementos como botones, tarjetas, campos de entrada, menús desplegables y más.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Button</h3>
          <p className="mb-4">
            El componente Button proporciona un botón interactivo con varias variantes y tamaños.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Button } from "@/components/ui/button";

export default function ButtonExample() {
  return (
    <div className="flex gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`}
              </code>
            </pre>
          </div>
          <p className="mb-4">
            Propiedades principales:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Propiedad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Valor por defecto</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>variant</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Variante visual del botón (default, destructive, outline, secondary, ghost, link)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>size</code></td>
                  <td className="border p-2">string</td>
                  <td className="border p-2"><code>default</code></td>
                  <td className="border p-2">Tamaño del botón (default, sm, lg, icon)</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>asChild</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>false</code></td>
                  <td className="border p-2">Si es true, el botón se renderizará como su elemento hijo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Card</h3>
          <p className="mb-4">
            El componente Card proporciona un contenedor con estilo para mostrar contenido relacionado.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.auth.title")}</h2>
          <p className="mb-4">
            Los componentes de autenticación proporcionan interfaces para el registro, inicio de sesión 
            y gestión de cuentas de usuario.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">SignInForm</h3>
          <p className="mb-4">
            El componente SignInForm proporciona un formulario completo para el inicio de sesión de usuarios.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto">
      <SignInForm />
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">SignUpForm</h3>
          <p className="mb-4">
            El componente SignUpForm proporciona un formulario completo para el registro de nuevos usuarios.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto">
      <SignUpForm />
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">OAuthButtons</h3>
          <p className="mb-4">
            El componente OAuthButtons proporciona botones para iniciar sesión con proveedores OAuth como Google y GitHub.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto">
      <OAuthButtons />
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.forms.title")}</h2>
          <p className="mb-4">
            Los componentes de formularios proporcionan elementos para la creación y gestión de formularios, 
            incluyendo validación y manejo de errores.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Form</h3>
          <p className="mb-4">
            El componente Form proporciona un contenedor para formularios con validación integrada utilizando 
            React Hook Form y Zod.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export default function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}`}
              </code>
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">{t("components.overview.data.title")}</h2>
          <p className="mb-4">
            Los componentes de visualización de datos proporcionan interfaces para mostrar y manipular datos, 
            como tablas, listas y gráficos.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Table</h3>
          <p className="mb-4">
            El componente Table proporciona una tabla con estilo para mostrar datos tabulares.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableExample() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">DataTable</h3>
          <p className="mb-4">
            El componente DataTable proporciona una tabla avanzada con funcionalidades como ordenación, 
            filtrado y paginación.
          </p>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { DataTable } from "@/components/data/data-table";
import { columns } from "./columns";

export default function DataTableExample() {
  const data = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "inactive",
    },
  ];

  return <DataTable columns={columns} data={data} />;
}`}
              </code>
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/api/webhooks"
        prevLabel={t("sidebar.webhooks")}
        nextPath="/components/ui"
        nextLabel={t("sidebar.ui")}
      />
    </>
  );
}
