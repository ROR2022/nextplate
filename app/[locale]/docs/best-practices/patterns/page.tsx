import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("patterns.title")} - ${t("meta.title")}`,
    description: t("patterns.description"),
  };
}

export default async function DesignPatternsPage({
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
        title={t("patterns.title")}
        description={t("patterns.description")}
      >
        <section className="mb-8">
          <p className="mb-4">
            {t("patterns.introduction")}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("patterns.creational.title")}</h2>
          <p className="mb-4">
            {t("patterns.creational.description")}
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.creational.factoryMethod.title")}</h3>
          <p className="mb-4">
            {t("patterns.creational.factoryMethod.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Interfaz para diferentes tipos de notificaciones
interface Notification {
  send(user: User, message: string): Promise<void>;
}

// Implementaciones concretas
class EmailNotification implements Notification {
  async send(user: User, message: string) {
    // Lógica para enviar email
  }
}

class PushNotification implements Notification {
  async send(user: User, message: string) {
    // Lógica para enviar notificación push
  }
}

class SMSNotification implements Notification {
  async send(user: User, message: string) {
    // Lógica para enviar SMS
  }
}

// Factory Method
class NotificationFactory {
  static createNotification(type: 'email' | 'push' | 'sms'): Notification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'push':
        return new PushNotification();
      case 'sms':
        return new SMSNotification();
      default:
        throw new Error(\`Tipo de notificación no soportado: \${type}\`);
    }
  }
}

// Uso
async function notifyUser(user: User, message: string, type: 'email' | 'push' | 'sms') {
  const notification = NotificationFactory.createNotification(type);
  await notification.send(user, message);
}`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.creational.singleton.title")}</h3>
          <p className="mb-4">
            {t("patterns.creational.singleton.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Singleton para la conexión a la base de datos
class Database {
  private static instance: Database;
  private client: any;

  private constructor() {
    // Inicialización de la conexión
    this.client = createDatabaseClient();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string, params: any[] = []) {
    return this.client.query(sql, params);
  }
}

// Uso
const db = Database.getInstance();
const users = await db.query('SELECT * FROM users');`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("patterns.structural.title")}</h2>
          <p className="mb-4">
            {t("patterns.structural.description")}
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.structural.adapter.title")}</h3>
          <p className="mb-4">
            {t("patterns.structural.adapter.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Interfaz que espera nuestro sistema
interface PaymentProcessor {
  processPayment(amount: number, currency: string, cardDetails: CardDetails): Promise<PaymentResult>;
}

// Servicio externo con una interfaz diferente
class StripeService {
  async createCharge(chargeDetails: {
    amount: number;
    currency: string;
    source: string;
    description?: string;
  }) {
    // Implementación para Stripe
  }
}

// Adapter para Stripe
class StripeAdapter implements PaymentProcessor {
  private stripeService: StripeService;

  constructor(stripeService: StripeService) {
    this.stripeService = stripeService;
  }

  async processPayment(amount: number, currency: string, cardDetails: CardDetails): Promise<PaymentResult> {
    // Convertir CardDetails a formato de Stripe
    const stripeToken = await this.createStripeToken(cardDetails);
    
    // Usar el servicio de Stripe
    const stripeResult = await this.stripeService.createCharge({
      amount: amount * 100, // Stripe usa centavos
      currency,
      source: stripeToken,
      description: 'Payment from NextPlate'
    });
    
    // Convertir resultado de Stripe a nuestro formato
    return this.convertToPaymentResult(stripeResult);
  }

  private async createStripeToken(cardDetails: CardDetails): Promise<string> {
    // Lógica para crear un token de Stripe
  }

  private convertToPaymentResult(stripeResult: any): PaymentResult {
    // Convertir resultado de Stripe a nuestro formato
  }
}`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.structural.composite.title")}</h3>
          <p className="mb-4">
            {t("patterns.structural.composite.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Componente base para elementos de UI
interface UIComponent {
  render(): JSX.Element;
}

// Componente hoja (no tiene hijos)
class Button implements UIComponent {
  constructor(private label: string, private onClick: () => void) {}

  render(): JSX.Element {
    return <button onClick={this.onClick}>{this.label}</button>;
  }
}

// Componente hoja
class Input implements UIComponent {
  constructor(private placeholder: string, private onChange: (value: string) => void) {}

  render(): JSX.Element {
    return <input placeholder={this.placeholder} onChange={(e) => this.onChange(e.target.value)} />;
  }
}

// Componente compuesto (puede tener hijos)
class Form implements UIComponent {
  private children: UIComponent[] = [];

  add(component: UIComponent): void {
    this.children.push(component);
  }

  remove(component: UIComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  render(): JSX.Element {
    return (
      <form>
        {this.children.map((child, index) => (
          <div key={index}>{child.render()}</div>
        ))}
      </form>
    );
  }
}

// Uso
const loginForm = new Form();
loginForm.add(new Input('Email', (value) => console.log('Email:', value)));
loginForm.add(new Input('Password', (value) => console.log('Password:', value)));
loginForm.add(new Button('Login', () => console.log('Login clicked')));

// Renderizar el formulario
const formElement = loginForm.render();`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("patterns.behavioral.title")}</h2>
          <p className="mb-4">
            {t("patterns.behavioral.description")}
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.behavioral.observer.title")}</h3>
          <p className="mb-4">
            {t("patterns.behavioral.observer.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// En React, el patrón Observer está implementado en el sistema de hooks
// Ejemplo con Context API y useContext

// Crear un contexto
const UserContext = React.createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});

// Proveedor del contexto (Subject)
function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
    };
    
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Componentes que observan los cambios (Observers)
function UserProfile() {
  // Este componente se actualizará automáticamente cuando cambie el usuario
  const { user } = useContext(UserContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function UserSettings() {
  // Este componente también observa los cambios en el usuario
  const { user, setUser } = useContext(UserContext);

  const updateUserName = async (newName: string) => {
    if (!user) return;
    
    // Actualizar en la base de datos
    await updateUser({ ...user, name: newName });
    
    // Actualizar el estado, lo que notificará a todos los observadores
    setUser({ ...user, name: newName });
  };

  // Resto del componente...
}`} />
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.behavioral.strategy.title")}</h3>
          <p className="mb-4">
            {t("patterns.behavioral.strategy.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Interfaz para estrategias de autenticación
interface AuthStrategy {
  authenticate(credentials: any): Promise<User | null>;
}

// Implementaciones concretas
class EmailPasswordStrategy implements AuthStrategy {
  async authenticate(credentials: { email: string; password: string }): Promise<User | null> {
    // Lógica para autenticar con email y contraseña
  }
}

class GoogleStrategy implements AuthStrategy {
  async authenticate(credentials: { token: string }): Promise<User | null> {
    // Lógica para autenticar con Google
  }
}

class GithubStrategy implements AuthStrategy {
  async authenticate(credentials: { code: string }): Promise<User | null> {
    // Lógica para autenticar con GitHub
  }
}

// Contexto que usa la estrategia
class AuthService {
  private strategy: AuthStrategy;

  constructor(strategy: AuthStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: AuthStrategy): void {
    this.strategy = strategy;
  }

  async login(credentials: any): Promise<User | null> {
    return this.strategy.authenticate(credentials);
  }
}

// Uso
const authService = new AuthService(new EmailPasswordStrategy());

// Login con email y contraseña
const user1 = await authService.login({ email: 'user@example.com', password: 'password123' });

// Cambiar a autenticación con Google
authService.setStrategy(new GoogleStrategy());
const user2 = await authService.login({ token: 'google-auth-token' });`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("patterns.architectural.title")}</h2>
          <p className="mb-4">
            {t("patterns.architectural.description")}
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.architectural.mvc.title")}</h3>
          <p className="mb-4">
            {t("patterns.architectural.mvc.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <p className="text-sm mb-2">
              {t("patterns.architectural.mvc.example")}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>{t("patterns.architectural.mvc.model")}</strong>: {t("patterns.architectural.mvc.modelDescription")}</li>
              <li><strong>{t("patterns.architectural.mvc.view")}</strong>: {t("patterns.architectural.mvc.viewDescription")}</li>
              <li><strong>{t("patterns.architectural.mvc.controller")}</strong>: {t("patterns.architectural.mvc.controllerDescription")}</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t("patterns.architectural.repository.title")}</h3>
          <p className="mb-4">
            {t("patterns.architectural.repository.description")}
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>{t("patterns.example")}</strong>
            </p>
            <CodeBlock code={`// Definición de la entidad
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Interfaz del repositorio
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// Implementación con Supabase
class SupabaseUserRepository implements UserRepository {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToUser(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !data) return null;
    
    return this.mapToUser(data);
  }

  // Implementación de otros métodos...

  private mapToUser(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: new Date(data.created_at)
    };
  }
}

// Uso en un servicio
class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;
    
    // Transformar User a UserProfile
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.role === 'admin'
    };
  }
}

// Inyección de dependencias
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const userRepository = new SupabaseUserRepository(supabase);
const userService = new UserService(userRepository);`} />
          </div>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/best-practices/clean-code"
          prevLabel={t("sidebar.cleanCode")}
          nextPath="/configuration"
          nextLabel={t("sidebar.configuration")}
        />
      </DocContent>
    </>
  );
}
