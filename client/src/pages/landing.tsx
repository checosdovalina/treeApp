import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import treeLogo from "@assets/TREE LOGO_1753399074765.png";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  isActive: boolean;
}

function CompactBrandsGrid() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ['/api/brands'],
    queryFn: () => fetch('/api/brands').then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 h-24 animate-pulse">
            <div className="bg-gray-200 rounded h-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const activeBrands = brands?.filter((brand: Brand) => brand.isActive) || [];
  const displayBrands = activeBrands.slice(0, 2); // Solo mostrar 2 marcas

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayBrands.map((brand: Brand) => (
        <div
          key={brand.id}
          className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => window.location.href = `/store/catalog?brand=${brand.id}`}
        >
          <div className="flex items-center justify-center h-16 mb-2">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-12 max-w-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center w-12 h-12 bg-uniform-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-uniform-primary" />
              </div>
            )}
          </div>
          <h3 className="text-sm font-semibold text-center text-gray-900 truncate">
            {brand.name}
          </h3>
        </div>
      ))}
    </div>
  );
}

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

      {/* Hero Section - Hidden */}

      {/* Brands Section - Compact */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-100 rounded-xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-uniform-primary mb-2">
                MARCAS DESTACADAS
              </h2>
              <p className="text-sm text-gray-600">
                Calidad garantizada
              </p>
            </div>

            <CompactBrandsGrid />
            
            <div className="text-center mt-6">
              <Button 
                variant="outline"
                size="sm"
                className="text-uniform-primary border-uniform-primary"
                onClick={() => window.location.href = '/store/brands'}
              >
                Ver todas las marcas →
              </Button>
            </div>
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
                  <Package className="text-uniform-primary h-6 w-6" />
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
                  <Package className="text-uniform-accent h-6 w-6" />
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
                  <Package className="text-purple-600 h-6 w-6" />
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
                  <Package className="text-orange-600 h-6 w-6" />
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
                  src={treeLogo} 
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