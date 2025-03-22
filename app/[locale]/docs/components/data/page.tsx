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
    title: `${t("sidebar.data")} - ${t("meta.title")}`,
    description: t("components.data.description"),
  };
}

export default async function ComponentsDataPage({
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
        title={t("components.data.title")}
        description={t("components.data.description")}
      >
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("components.data.intro.title")}</h2>
          <p className="mb-4">
            Los componentes de visualización de datos en NextPlate proporcionan una manera elegante y 
            eficiente de presentar información a los usuarios. Estos componentes están diseñados para 
            mostrar datos de manera clara y accesible, facilitando la comprensión de información compleja.
          </p>
          <p className="mb-4">
            Todos los componentes de datos están optimizados para trabajar con diferentes fuentes de 
            información y son altamente personalizables para adaptarse a las necesidades específicas 
            de tu aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Table</h2>
          <p className="mb-4">
            El componente Table proporciona una manera estructurada de mostrar datos tabulares. 
            Incluye funcionalidades como ordenación, paginación y selección de filas.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Uso básico
<Table>
  <TableCaption>Lista de usuarios</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Rol</TableHead>
      <TableHead className="text-right">Acciones</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Con datos paginados
<DataTable
  columns={columns}
  data={data}
  pagination={true}
  pageSize={10}
  onRowClick={(row) => handleRowClick(row)}
/>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Card</h2>
          <p className="mb-4">
            El componente Card proporciona un contenedor flexible para mostrar información relacionada. 
            Es ideal para mostrar resúmenes de datos, estadísticas o información de perfil.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Uso básico
<Card>
  <CardHeader>
    <CardTitle>Estadísticas de usuario</CardTitle>
    <CardDescription>Resumen de actividad del último mes</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium">Publicaciones</p>
        <p className="text-2xl font-bold">24</p>
      </div>
      <div>
        <p className="text-sm font-medium">Comentarios</p>
        <p className="text-2xl font-bold">102</p>
      </div>
      <div>
        <p className="text-sm font-medium">Likes</p>
        <p className="text-2xl font-bold">325</p>
      </div>
      <div>
        <p className="text-sm font-medium">Seguidores</p>
        <p className="text-2xl font-bold">1,204</p>
      </div>
    </div>
  </CardContent>
  <CardFooter>
    <Button variant="outline" size="sm">Ver detalles</Button>
  </CardFooter>
</Card>

// Tarjeta de perfil
<Card>
  <CardHeader className="text-center">
    <Avatar className="mx-auto h-20 w-20">
      <AvatarImage src="/avatars/user.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <CardTitle className="mt-4">Juan Pérez</CardTitle>
    <CardDescription>Desarrollador Frontend</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Email:</span>
        <span className="text-sm">juan@ejemplo.com</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Teléfono:</span>
        <span className="text-sm">+1 234 567 890</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Ubicación:</span>
        <span className="text-sm">Madrid, España</span>
      </div>
    </div>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline" size="sm">Mensaje</Button>
    <Button size="sm">Ver perfil</Button>
  </CardFooter>
</Card>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Badge</h2>
          <p className="mb-4">
            El componente Badge proporciona una manera visual de destacar información o estado. 
            Es útil para mostrar etiquetas, estados o notificaciones.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Badge } from "@/components/ui/badge";

// Uso básico
<Badge>Nuevo</Badge>

// Variantes
<div className="flex gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="destructive">Destructive</Badge>
</div>

// En una lista
<ul className="space-y-2">
  {items.map((item) => (
    <li key={item.id} className="flex items-center justify-between">
      <span>{item.name}</span>
      <Badge variant={item.status === 'active' ? 'default' : 'outline'}>
        {item.status}
      </Badge>
    </li>
  ))}
</ul>

// Con contador
<Button>
  Notificaciones
  <Badge className="ml-2" variant="secondary">
    {notificationCount}
  </Badge>
</Button>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Avatar</h2>
          <p className="mb-4">
            El componente Avatar proporciona una representación visual de un usuario o entidad. 
            Soporta imágenes, iniciales como fallback y diferentes tamaños.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Uso básico
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Diferentes tamaños
<div className="flex items-center gap-4">
  <Avatar className="h-8 w-8">
    <AvatarImage src="/avatars/user1.jpg" alt="User 1" />
    <AvatarFallback>U1</AvatarFallback>
  </Avatar>
  <Avatar className="h-12 w-12">
    <AvatarImage src="/avatars/user2.jpg" alt="User 2" />
    <AvatarFallback>U2</AvatarFallback>
  </Avatar>
  <Avatar className="h-16 w-16">
    <AvatarImage src="/avatars/user3.jpg" alt="User 3" />
    <AvatarFallback>U3</AvatarFallback>
  </Avatar>
</div>

// Grupo de avatares
<div className="flex -space-x-2">
  {users.slice(0, 3).map((user) => (
    <Avatar key={user.id} className="border-2 border-background">
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
  {users.length > 3 && (
    <Avatar className="border-2 border-background">
      <AvatarFallback>+{users.length - 3}</AvatarFallback>
    </Avatar>
  )}
</div>`}
            </pre>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Calendar</h2>
          <p className="mb-4">
            El componente Calendar proporciona una interfaz para seleccionar fechas o mostrar eventos. 
            Es útil para aplicaciones que requieren programación o visualización de fechas.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
{`import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

// Selector de fecha simple
function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

// Selector de rango de fechas
function DateRangePicker() {
  const [range, setRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: undefined,
  });

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-md border"
    />
  );
}

// Calendario con eventos
function EventCalendar() {
  const events = [
    { date: new Date(2023, 5, 15), title: "Reunión de equipo" },
    { date: new Date(2023, 5, 20), title: "Lanzamiento de producto" },
    { date: new Date(2023, 5, 25), title: "Revisión de sprint" },
  ];

  return (
    <Calendar
      mode="single"
      className="rounded-md border"
      components={{
        DayContent: ({ day }) => {
          const event = events.find(
            (e) => e.date.toDateString() === day.toDate().toDateString()
          );
          return (
            <div className="relative h-full w-full p-2">
              <span>{day.date()}</span>
              {event && (
                <div className="absolute bottom-1 left-0 right-0 h-1 bg-blue-500" />
              )}
            </div>
          );
        },
      }}
    />
  );
}`}
            </pre>
          </div>
        </section>
      </DocContent>

      <DocNavigation
        locale={locale}
        prevPath="/components/forms"
        prevLabel={t("sidebar.forms")}
        nextPath="/api"
        nextLabel={t("sidebar.api")}
      />
    </>
  );
}
