import { getTranslations } from "next-intl/server";
import DocContent from "../../components/doc-content";
import DocNavigation from "../../components/doc-navigation";
import { Metadata } from "next";
import { CodeBlock } from "@/components/tutorial/code-block";
import { type PageProps } from "../../api/auth/page";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  
  return {
    title: `${t("sidebar.solid")} - ${t("meta.title")}`,
    description: t("solid.description"),
  };
}

export default async function SolidPrinciplesPage({
  params,
}: PageProps) {
  // Extraer el locale de params después de que Next.js lo haya resuelto completamente
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });

  return (
    <>
      <DocContent
        title={t("bestPractices.solid.title")}
        description={t("bestPractices.solid.description")}
      >
        <section className="mb-8">
          <p className="mb-4">
            Los principios SOLID son un conjunto de cinco principios de diseño orientado a objetos que ayudan a crear 
            software más mantenible, flexible y escalable. En NextPlate, estos principios guían la arquitectura y 
            organización del código para asegurar una base sólida para tu aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.singleResponsibility.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.singleResponsibility.description")}</p>
          <p className="mb-4">
            Este principio establece que cada clase o módulo debe tener una única responsabilidad, es decir, 
            debe tener una sola razón para cambiar. Esto promueve la cohesión y hace que el código sea más 
            fácil de entender, mantener y probar.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <CodeBlock code={`// BAD: Una clase con múltiples responsabilidades
class UserManager {
  async createUser(userData) {
    // Validar datos
    if (!userData.email || !userData.password) {
      throw new Error('Invalid user data');
    }
    
    // Crear usuario en la base de datos
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    // Enviar email de bienvenida
    await sendWelcomeEmail(userData.email);
    
    // Registrar actividad
    await logActivity('user_created', data.user.id);
    
    return data.user;
  }
}

// GOOD: Separación de responsabilidades
class UserValidator {
  validate(userData) {
    if (!userData.email || !userData.password) {
      throw new Error('Invalid user data');
    }
    return userData;
  }
}

class UserRepository {
  async create(userData) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (error) throw error;
    return data.user;
  }
}

class EmailService {
  async sendWelcomeEmail(email) {
    // Lógica para enviar email
  }
}

class ActivityLogger {
  async log(action, userId) {
    // Lógica para registrar actividad
  }
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.openClosed.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.openClosed.description")}</p>
          <p className="mb-4">
            Este principio establece que las entidades de software (clases, módulos, funciones, etc.) deben estar 
            abiertas para la extensión pero cerradas para la modificación. Esto significa que debes poder agregar 
            nuevas funcionalidades sin cambiar el código existente.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <CodeBlock code={`// BAD: Violación del principio abierto/cerrado
class PaymentProcessor {
  processPayment(payment) {
    if (payment.type === 'credit_card') {
      // Procesar pago con tarjeta de crédito
    } else if (payment.type === 'paypal') {
      // Procesar pago con PayPal
    } else if (payment.type === 'bank_transfer') {
      // Procesar pago con transferencia bancaria
    }
    // Si agregamos un nuevo método de pago, tenemos que modificar esta clase
  }
}

// GOOD: Uso de interfaces y polimorfismo
interface PaymentMethod {
  process(payment): Promise<PaymentResult>;
}

class CreditCardPayment implements PaymentMethod {
  async process(payment) {
    // Implementación específica para tarjeta de crédito
  }
}

class PayPalPayment implements PaymentMethod {
  async process(payment) {
    // Implementación específica para PayPal
  }
}

class BankTransferPayment implements PaymentMethod {
  async process(payment) {
    // Implementación específica para transferencia bancaria
  }
}

// Podemos agregar nuevos métodos de pago sin modificar el código existente
class CryptoPayment implements PaymentMethod {
  async process(payment) {
    // Implementación específica para criptomonedas
  }
}

class PaymentProcessor {
  constructor(private paymentMethods: Map<string, PaymentMethod>) {}
  
  async processPayment(payment) {
    const method = this.paymentMethods.get(payment.type);
    if (!method) {
      throw new Error('Unsupported payment method');
    }
    return method.process(payment);
  }
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.liskovSubstitution.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.liskovSubstitution.description")}</p>
          <p className="mb-4">
            Este principio establece que los objetos de una clase derivada deben poder sustituir a los objetos de la 
            clase base sin afectar la funcionalidad del programa. En otras palabras, las subclases deben comportarse 
            de manera compatible con sus clases base.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <CodeBlock code={`// BAD: Violación del principio de sustitución de Liskov
class Rectangle {
  constructor(protected width: number, protected height: number) {}
  
  setWidth(width: number) {
    this.width = width;
  }
  
  setHeight(height: number) {
    this.height = height;
  }
  
  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }
  
  // Violación del principio: cambia el comportamiento esperado
  setWidth(width: number) {
    this.width = width;
    this.height = width; // Un cuadrado debe mantener lados iguales
  }
  
  setHeight(height: number) {
    this.height = height;
    this.width = height; // Un cuadrado debe mantener lados iguales
  }
}

// GOOD: Respetando el principio
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(protected width: number, protected height: number) {}
  
  setWidth(width: number) {
    this.width = width;
  }
  
  setHeight(height: number) {
    this.height = height;
  }
  
  getArea() {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private size: number) {}
  
  setSize(size: number) {
    this.size = size;
  }
  
  getArea() {
    return this.size * this.size;
  }
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.interfaceSegregation.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.interfaceSegregation.description")}</p>
          <p className="mb-4">
            Este principio establece que los clientes no deben verse obligados a depender de interfaces que no utilizan. 
            Es mejor tener muchas interfaces específicas que una interfaz general de propósito general.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <CodeBlock code={`// BAD: Interfaz demasiado grande
interface UserService {
  getUser(id: string): Promise<User>;
  createUser(userData: UserData): Promise<User>;
  updateUser(id: string, userData: UserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  getUserPreferences(userId: string): Promise<UserPreferences>;
  updateUserPreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences>;
}

// GOOD: Interfaces segregadas
interface UserReader {
  getUser(id: string): Promise<User>;
  getUserPreferences(userId: string): Promise<UserPreferences>;
}

interface UserWriter {
  createUser(userData: UserData): Promise<User>;
  updateUser(id: string, userData: UserData): Promise<User>;
  deleteUser(id: string): Promise<void>;
  updateUserPreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences>;
}

interface UserAuthService {
  sendPasswordResetEmail(email: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}

// Una clase puede implementar una o más interfaces según sus necesidades
class UserRepository implements UserReader, UserWriter {
  // Implementación...
}

class AuthService implements UserAuthService {
  // Implementación...
}`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.dependencyInversion.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.dependencyInversion.description")}</p>
          <p className="mb-4">
            Este principio establece que los módulos de alto nivel no deben depender de módulos de bajo nivel. 
            Ambos deben depender de abstracciones. Además, las abstracciones no deben depender de los detalles, 
            sino que los detalles deben depender de las abstracciones.
          </p>
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="text-sm mb-2">
              <strong>Ejemplo en NextPlate:</strong>
            </p>
            <CodeBlock code={`// BAD: Dependencia directa en implementaciones concretas
class UserService {
  private emailSender = new EmailSender();
  private userRepository = new SupabaseUserRepository();
  
  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailSender.sendWelcomeEmail(user.email);
    return user;
  }
}

// GOOD: Inversión de dependencias con inyección
interface EmailService {
  sendWelcomeEmail(email: string): Promise<void>;
}

interface UserRepository {
  create(userData: UserData): Promise<User>;
}

class EmailSender implements EmailService {
  async sendWelcomeEmail(email: string) {
    // Implementación...
  }
}

class SupabaseUserRepository implements UserRepository {
  async create(userData: UserData) {
    // Implementación con Supabase...
  }
}

class UserService {
  constructor(
    private emailService: EmailService,
    private userRepository: UserRepository
  ) {}
  
  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}

// Uso con inyección de dependencias
const emailService = new EmailSender();
const userRepository = new SupabaseUserRepository();
const userService = new UserService(emailService, userRepository);

// Para pruebas, podemos usar mocks fácilmente
const mockEmailService = { sendWelcomeEmail: jest.fn() };
const mockUserRepository = { create: jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com' }) };
const testUserService = new UserService(mockEmailService, mockUserRepository);`} />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("bestPractices.solid.implementation.title")}</h2>
          <p className="mb-4">{t("bestPractices.solid.implementation.description")}</p>
          <p className="mb-4">
            En NextPlate, los principios SOLID se aplican en varios niveles de la arquitectura:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              <strong>Componentes React:</strong> Cada componente tiene una responsabilidad única y clara. 
              Los componentes complejos se dividen en componentes más pequeños y específicos.
            </li>
            <li>
              <strong>Hooks personalizados:</strong> Encapsulan lógica reutilizable y siguen el principio de 
              responsabilidad única.
            </li>
            <li>
              <strong>Servicios:</strong> Organizados por dominio y funcionalidad, con interfaces claras y 
              dependencias inyectadas.
            </li>
            <li>
              <strong>API Routes:</strong> Cada ruta tiene una responsabilidad específica y delega en servicios 
              para la lógica de negocio.
            </li>
            <li>
              <strong>Estructura de carpetas:</strong> Organizada para reflejar la separación de responsabilidades 
              y facilitar la extensión sin modificación.
            </li>
          </ul>
          <p className="mb-4">
            Al seguir estos principios, NextPlate proporciona una base sólida para construir aplicaciones 
            mantenibles, escalables y fáciles de extender.
          </p>
        </section>

        <DocNavigation 
          locale={locale}
          prevPath="/architecture/backend"
          prevLabel={t("sidebar.backend")}
          nextPath="/best-practices/clean-code"
          nextLabel={t("sidebar.cleanCode")}
        />
      </DocContent>
    </>
  );
}
