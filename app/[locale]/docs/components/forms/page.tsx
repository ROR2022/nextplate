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
    title: `${t("sidebar.forms")} - ${t("meta.title")}`,
    description: t("components.forms.description"),
  };
}

export default async function ComponentsFormsPage({
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
        title={t("components.forms.title")}
        description={t("components.forms.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.forms.intro.title")}</h2>
          <p className="mb-4">
            Los componentes de formularios en NextPlate proporcionan una manera sencilla y accesible 
            de crear formularios interactivos en tu aplicación. Estos componentes están diseñados para 
            trabajar juntos, ofreciendo una experiencia de usuario consistente y validación robusta.
          </p>
          <p className="mb-4">
            Todos los componentes de formularios están optimizados para trabajar con React Hook Form y 
            Zod para validación, proporcionando una experiencia de desarrollo fluida y una interfaz de 
            usuario coherente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Input</h2>
          <p className="mb-4">
            El componente Input es la base para la entrada de texto en formularios. Proporciona estilos 
            consistentes, manejo de estados (error, deshabilitado, etc.) y soporte para íconos y addons.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Input } from "@/components/ui/input";

// Uso básico
<Input placeholder="Ingresa tu nombre" />

// Con etiqueta y mensaje de error
<div className="space-y-2">
  <Label htmlFor="email">Correo electrónico</Label>
  <Input 
    id="email"
    type="email" 
    placeholder="ejemplo@correo.com" 
    error={errors.email?.message}
  />
  {errors.email && (
    <p className="text-sm text-red-500">{errors.email.message}</p>
  )}
</div>

// Con ícono
<Input 
  placeholder="Buscar..." 
  startIcon={<SearchIcon className="h-4 w-4" />} 
/>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Select</h2>
          <p className="mb-4">
            El componente Select permite a los usuarios elegir una opción de una lista desplegable. 
            Proporciona estilos consistentes y soporte para opciones agrupadas y personalizadas.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Select } from "@/components/ui/select";

// Uso básico
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona una opción" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
    <SelectItem value="option3">Opción 3</SelectItem>
  </SelectContent>
</Select>

// Con etiqueta y mensaje de error
<div className="space-y-2">
  <Label htmlFor="country">País</Label>
  <Select
    value={form.watch("country")}
    onValueChange={(value) => form.setValue("country", value)}
  >
    <SelectTrigger id="country">
      <SelectValue placeholder="Selecciona un país" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="es">España</SelectItem>
      <SelectItem value="mx">México</SelectItem>
      <SelectItem value="ar">Argentina</SelectItem>
    </SelectContent>
  </Select>
  {form.formState.errors.country && (
    <p className="text-sm text-red-500">
      {form.formState.errors.country.message}
    </p>
  )}
</div>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Checkbox</h2>
          <p className="mb-4">
            El componente Checkbox permite a los usuarios seleccionar una o múltiples opciones de una lista. 
            Proporciona estilos consistentes y soporte para estados indeterminados.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Checkbox } from "@/components/ui/checkbox";

// Uso básico
<Checkbox />

// Con etiqueta
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label
    htmlFor="terms"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Acepto los términos y condiciones
  </label>
</div>

// Grupo de checkboxes
<div className="space-y-2">
  <div className="flex items-center space-x-2">
    <Checkbox id="option1" checked={options.includes("option1")} 
      onCheckedChange={(checked) => {
        if (checked) {
          setOptions([...options, "option1"]);
        } else {
          setOptions(options.filter(x => x !== "option1"));
        }
      }} 
    />
    <label htmlFor="option1">Opción 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <Checkbox id="option2" checked={options.includes("option2")} 
      onCheckedChange={(checked) => {
        if (checked) {
          setOptions([...options, "option2"]);
        } else {
          setOptions(options.filter(x => x !== "option2"));
        }
      }} 
    />
    <label htmlFor="option2">Opción 2</label>
  </div>
</div>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Radio Group</h2>
          <p className="mb-4">
            El componente RadioGroup permite a los usuarios seleccionar una opción de un conjunto de alternativas. 
            Proporciona estilos consistentes y manejo de estados.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Uso básico
<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <label htmlFor="option1">Opción 1</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <label htmlFor="option2">Opción 2</label>
  </div>
</RadioGroup>

// Con React Hook Form
<Controller
  name="plan"
  control={form.control}
  render={({ field }) => (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="space-y-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="basic" id="basic" />
        <label htmlFor="basic">Plan Básico</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="pro" id="pro" />
        <label htmlFor="pro">Plan Pro</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="enterprise" id="enterprise" />
        <label htmlFor="enterprise">Plan Empresarial</label>
      </div>
    </RadioGroup>
  )}
/>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Textarea</h2>
          <p className="mb-4">
            El componente Textarea permite a los usuarios ingresar texto multilínea. 
            Proporciona estilos consistentes y soporte para autoajuste y conteo de caracteres.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Textarea } from "@/components/ui/textarea";

// Uso básico
<Textarea placeholder="Escribe tu mensaje aquí..." />

// Con etiqueta y mensaje de error
<div className="space-y-2">
  <Label htmlFor="message">Mensaje</Label>
  <Textarea 
    id="message"
    placeholder="Escribe tu mensaje aquí..." 
    error={errors.message?.message}
  />
  {errors.message && (
    <p className="text-sm text-red-500">{errors.message.message}</p>
  )}
</div>

// Con contador de caracteres
<div className="space-y-2">
  <Textarea 
    placeholder="Escribe tu bio aquí..." 
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    maxLength={280}
  />
  <div className="text-xs text-gray-500 text-right">
    {bio.length}/280 caracteres
  </div>
</div>`}
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/components/layout"
        prevLabel={t("sidebar.layout")}
        nextPath="/components/data"
        nextLabel={t("sidebar.data")}
      />
    </>
  );
}
