import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import treeLogo from "@assets/TREE LOGO_1753399074765.png";
import { Shirt, Shield, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={treeLogo} 
                alt="TREE Uniformes & Kodiak Industrial"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">TREE Uniformes</h1>
                <p className="text-sm text-gray-600">& Kodiak Industrial</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-uniform-primary hover:bg-blue-700"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            TREE Uniformes & Kodiak Industrial
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Especialistas en uniformes corporativos e industriales. Equipamos a tu empresa 
            con productos que reflejan profesionalismo y seguridad. Catálogo completo 
            para todas las industrias con gestión integral de inventario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-uniform-primary hover:bg-blue-700"
              onClick={() => window.location.href = '/store'}
            >
              Ver Catálogo
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/auth/register'}
            >
              Registrarse
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/api/login'}
            >
              Acceso Administrador
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-uniform-neutral-900 mb-4">
              Plataforma Completa de E-commerce
            </h2>
            <p className="text-uniform-secondary text-lg">
              Gestión integral de uniformes con herramientas profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shirt className="text-uniform-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-uniform-neutral-900 mb-2">
                  Gestión de Productos
                </h3>
                <p className="text-uniform-secondary text-sm">
                  Control completo del inventario por tallas, colores y stock disponible
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-uniform-accent h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-uniform-neutral-900 mb-2">
                  Presupuestos
                </h3>
                <p className="text-uniform-secondary text-sm">
                  Creación y gestión de cotizaciones profesionales para empresas
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-uniform-neutral-900 mb-2">
                  Gestión de Clientes
                </h3>
                <p className="text-uniform-secondary text-sm">
                  Base de datos completa con historial de compras y clasificación
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-orange-600 h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-uniform-neutral-900 mb-2">
                  Reportes de Ventas
                </h3>
                <p className="text-uniform-secondary text-sm">
                  Estadísticas detalladas y productos más vendidos con filtros
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-uniform-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para modernizar tu negocio de uniformes?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Accede al panel de administración para gestionar productos, inventario, 
            pedidos y generar reportes profesionales.
          </p>
          <Button 
            size="lg"
            variant="outline"
            className="bg-white text-uniform-primary hover:bg-gray-50"
            onClick={() => window.location.href = '/api/login'}
          >
            Acceder al Sistema
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-uniform-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/TREE LOGO_1753399074765.png" 
                  alt="TREE Uniformes & Kodiak Industrial"
                  className="h-10 w-auto filter brightness-0 invert"
                />
                <div>
                  <h3 className="text-xl font-bold">TREE Uniformes</h3>
                  <p className="text-sm text-gray-400">& Kodiak Industrial</p>
                </div>
              </div>
              <p className="text-gray-300">
                Equipamos a tu empresa con uniformes que reflejan profesionalismo y calidad. 
                Más de 10 años de experiencia en el sector.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Uniformes Corporativos</li>
                <li>Uniformes Médicos</li>
                <li>Uniformes de Servicios</li>
                <li>Accesorios</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-300">
                <p>📍 Laguna, Coahuila, México</p>
                <p>📞 +52 871 123 4567</p>
                <p>✉️ info@treeuniformes.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 TREE Uniformes & Kodiak Industrial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
