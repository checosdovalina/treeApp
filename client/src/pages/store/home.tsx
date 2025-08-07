import StoreLayout from "@/components/layout/store-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Shirt, Shield, Users } from "lucide-react";
import ProductCard from "@/components/store/product-card";

export default function StoreHome() {
  const { data: topProducts, isLoading } = useQuery({
    queryKey: ['/api/dashboard/top-products', { limit: 8 }],
  });

  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-uniform-primary to-blue-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Uniformes Profesionales de Calidad
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Equipamos a tu empresa con uniformes que reflejan profesionalismo y calidad. 
              Catálogo completo para todas las industrias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-white text-uniform-primary hover:bg-gray-100"
              >
                Ver Catálogo
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-uniform-primary"
              >
                Solicitar Cotización
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - HIDDEN */}
      {/* 
      <section className="py-16 bg-uniform-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-uniform-neutral-900 mb-4">
              Categorías Destacadas
            </h2>
            <p className="text-uniform-secondary text-lg">
              Encuentra el uniforme perfecto para tu industria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Shirt className="h-20 w-20 text-uniform-primary" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-uniform-neutral-900 mb-2">
                  Corporativo
                </h3>
                <p className="text-uniform-secondary mb-4">
                  Trajes ejecutivos, camisas y accesorios para oficinas y empresas corporativas
                </p>
                <Button variant="outline" className="text-uniform-primary border-uniform-primary">
                  Ver productos →
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Shield className="h-20 w-20 text-uniform-accent" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-uniform-neutral-900 mb-2">
                  Salud
                </h3>
                <p className="text-uniform-secondary mb-4">
                  Uniformes médicos, batas y scrubs para hospitales y clínicas
                </p>
                <Button variant="outline" className="text-uniform-primary border-uniform-primary">
                  Ver productos →
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Users className="h-20 w-20 text-purple-600" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-uniform-neutral-900 mb-2">
                  Servicios
                </h3>
                <p className="text-uniform-secondary mb-4">
                  Uniformes para restaurantes, hoteles y servicios en general
                </p>
                <Button variant="outline" className="text-uniform-primary border-uniform-primary">
                  Ver productos →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      */}

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-uniform-neutral-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-uniform-secondary text-lg">
                Los uniformes más populares de nuestro catálogo
              </p>
            </div>
            <Button 
              variant="outline"
              className="hidden md:block text-uniform-primary border-uniform-primary"
            >
              Ver Todo el Catálogo
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-64 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {topProducts?.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
                    No hay productos disponibles
                  </h3>
                  <p className="text-uniform-secondary">
                    Pronto tendremos productos disponibles para ti
                  </p>
                </div>
              ) : (
                topProducts?.slice(0, 8).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-uniform-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Necesitas uniformes para tu empresa?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Solicita una cotización personalizada y obtén los mejores precios 
            para pedidos al por mayor.
          </p>
          <Button 
            size="lg"
            className="bg-white text-uniform-primary hover:bg-gray-100"
          >
            Solicitar Cotización
          </Button>
        </div>
      </section>
    </StoreLayout>
  );
}
