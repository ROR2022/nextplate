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
    title: `${t("sidebar.ui")} - ${t("meta.title")}`,
    description: t("components.ui.description"),
  };
}

export default async function ComponentsUIPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("components.ui.title")}
        description={t("components.ui.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.ui.intro.title")}</h2>
          <p className="mb-4">
            Los componentes UI de NextPlate son los bloques de construcción fundamentales para crear 
            interfaces de usuario modernas y accesibles. Estos componentes están construidos sobre 
            Tailwind CSS y Shadcn UI, proporcionando una base sólida para el diseño de tu aplicación.
          </p>
          <p className="mb-4">
            Todos los componentes UI siguen las mejores prácticas de accesibilidad, son totalmente 
            responsivos y altamente personalizables a través de props y clases de Tailwind CSS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Button</h2>
          <p className="mb-4">
            El componente Button proporciona un botón interactivo con varias variantes y tamaños.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Button } from "@/components/ui/button";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      
      <Button disabled>Disabled</Button>
      <Button isLoading>Loading</Button>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
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
                <tr>
                  <td className="border p-2"><code>isLoading</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>false</code></td>
                  <td className="border p-2">Si es true, muestra un indicador de carga y deshabilita el botón</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Card</h2>
          <p className="mb-4">
            El componente Card proporciona un contenedor con estilo para mostrar contenido relacionado.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
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
} from "@/components/ui/card";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function CardExample() {
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

          <h3 className="text-xl font-semibold mt-6 mb-3">Componentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Componente</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>Card</code></td>
                  <td className="border p-2">Contenedor principal de la tarjeta</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>CardHeader</code></td>
                  <td className="border p-2">Sección superior de la tarjeta, generalmente contiene el título y la descripción</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>CardTitle</code></td>
                  <td className="border p-2">Título de la tarjeta</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>CardDescription</code></td>
                  <td className="border p-2">Descripción de la tarjeta</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>CardContent</code></td>
                  <td className="border p-2">Contenido principal de la tarjeta</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>CardFooter</code></td>
                  <td className="border p-2">Sección inferior de la tarjeta, generalmente contiene acciones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Input</h2>
          <p className="mb-4">
            El componente Input proporciona un campo de entrada de texto con estilo.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Input } from "@/components/ui/input";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function InputExample() {
  return (
    <div className="grid w-full gap-4">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="number" placeholder="Number input" />
      <Input type="text" placeholder="Disabled input" disabled />
      <Input type="text" placeholder="Input with error" className="border-destructive" />
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
          <p className="mb-4">
            El componente Input acepta todas las propiedades estándar de un elemento <code>input</code> HTML.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select</h2>
          <p className="mb-4">
            El componente Select proporciona un menú desplegable para seleccionar una opción de una lista.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function SelectExample() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Componentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Componente</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>Select</code></td>
                  <td className="border p-2">Contenedor principal del select</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectTrigger</code></td>
                  <td className="border p-2">Botón que abre el menú desplegable</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectValue</code></td>
                  <td className="border p-2">Muestra el valor seleccionado</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectContent</code></td>
                  <td className="border p-2">Contenedor del menú desplegable</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectGroup</code></td>
                  <td className="border p-2">Agrupa elementos relacionados</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectLabel</code></td>
                  <td className="border p-2">Etiqueta para un grupo de elementos</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>SelectItem</code></td>
                  <td className="border p-2">Elemento seleccionable individual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Checkbox</h2>
          <p className="mb-4">
            El componente Checkbox proporciona una casilla de verificación interactiva.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Checkbox } from "@/components/ui/checkbox";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`export default function CheckboxExample() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Propiedades</h3>
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
                  <td className="border p-2"><code>checked</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Estado de la casilla de verificación</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>defaultChecked</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Estado inicial de la casilla de verificación</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>onCheckedChange</code></td>
                  <td className="border p-2">function</td>
                  <td className="border p-2">-</td>
                  <td className="border p-2">Función que se llama cuando cambia el estado</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>disabled</code></td>
                  <td className="border p-2">boolean</td>
                  <td className="border p-2"><code>false</code></td>
                  <td className="border p-2">Si es true, la casilla de verificación está deshabilitada</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Dialog</h2>
          <p className="mb-4">
            El componente Dialog proporciona un diálogo modal para mostrar contenido superpuesto a la página.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Importación</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Uso</h3>
          <div className="bg-muted p-4 rounded-md my-4">
            <pre className="text-sm overflow-x-auto">
              <code>
{`import { Button } from "@/components/ui/button";

export default function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              className="col-span-3 h-10 rounded-md border border-input px-3"
              defaultValue="John Doe"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`}
              </code>
            </pre>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Componentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">Componente</th>
                  <th className="border p-2 text-left">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><code>Dialog</code></td>
                  <td className="border p-2">Contenedor principal del diálogo</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogTrigger</code></td>
                  <td className="border p-2">Elemento que abre el diálogo al hacer clic</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogContent</code></td>
                  <td className="border p-2">Contenedor del contenido del diálogo</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogHeader</code></td>
                  <td className="border p-2">Sección superior del diálogo</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogTitle</code></td>
                  <td className="border p-2">Título del diálogo</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogDescription</code></td>
                  <td className="border p-2">Descripción del diálogo</td>
                </tr>
                <tr>
                  <td className="border p-2"><code>DialogFooter</code></td>
                  <td className="border p-2">Sección inferior del diálogo, generalmente contiene acciones</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/components"
        prevLabel={t("sidebar.components")}
        nextPath="/components/layout"
        nextLabel={t("sidebar.layout")}
      />
    </>
  );
}
