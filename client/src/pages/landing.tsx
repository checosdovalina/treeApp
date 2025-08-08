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

      {/* Hero Section - Simplified */}
      <section className="relative py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-uniform-gold/20 text-uniform-gold text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🏆 CALIDAD PREMIUM GARANTIZADA
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            test
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            PROFESIONALES
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Especialistas en uniformes profesionales para hospitales, industrias, restaurantes y empresas corporativas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg"
              className="bg-uniform-gold hover:bg-yellow-600 text-black font-semibold"
              onClick={() => window.location.href = '/store'}
            >
              🔍 EXPLORAR CATÁLOGO
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-uniform-primary text-uniform-primary"
              onClick={() => window.location.href = '/quote'}
            >
              💼 SOLICITAR COTIZACIÓN
            </Button>
          </div>
        </div>
      </section>

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
    </div>
  );
}