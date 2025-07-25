import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ArrowRight } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
}

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ['/api/brands'],
    retry: false,
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    retry: false,
  });

  // Count products per brand
  const getProductCount = (brandId: number) => {
    if (!products || !Array.isArray(products)) return 0;
    return products.filter((product: any) => product.brandId === brandId).length;
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-16 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const activeBrands = (brands && Array.isArray(brands)) ? brands.filter((brand: Brand) => brand.isActive) : [];

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestras Marcas</h1>
          <p className="text-gray-600 max-w-2xl">
            Descubre la amplia selección de marcas de calidad que ofrecemos. 
            Cada marca representa compromiso con la excelencia y la durabilidad.
          </p>
        </div>

        {activeBrands.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No hay marcas disponibles</h2>
            <p className="text-gray-600">
              Estamos trabajando para traerte las mejores marcas muy pronto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBrands.map((brand: Brand) => {
              const productCount = getProductCount(brand.id);
              
              return (
                <Link 
                  key={brand.id} 
                  href={`/store/catalog?brand=${brand.id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02] border border-gray-200">
                    <CardContent className="p-6">
                      {/* Brand Logo/Icon */}
                      <div className="flex items-center justify-center w-16 h-16 bg-uniform-primary/10 rounded-lg mb-4 group-hover:bg-uniform-primary/20 transition-colors">
                        {brand.logo ? (
                          <img 
                            src={brand.logo} 
                            alt={brand.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-uniform-primary" />
                        )}
                      </div>

                      {/* Brand Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-uniform-primary transition-colors">
                            {brand.name}
                          </h3>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-uniform-primary group-hover:translate-x-1 transition-all" />
                        </div>

                        {brand.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {brand.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {productCount} {productCount === 1 ? 'producto' : 'productos'}
                          </Badge>
                          
                          <span className="text-sm text-uniform-primary font-medium group-hover:underline">
                            Ver productos
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No encuentras la marca que buscas?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contáctanos y te ayudaremos a encontrar exactamente lo que necesitas. 
            Trabajamos con una amplia red de proveedores para ofrecerte las mejores opciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/524771234567?text=Hola,%20me%20interesa%20conocer%20más%20marcas%20disponibles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-uniform-primary text-white rounded-lg hover:bg-uniform-primary/90 transition-colors font-medium"
            >
              <Package className="h-5 w-5 mr-2" />
              Solicitar marca específica
            </a>
            <Link 
              href="/store/catalog"
              className="inline-flex items-center justify-center px-6 py-3 border border-uniform-primary text-uniform-primary rounded-lg hover:bg-uniform-primary hover:text-white transition-colors font-medium"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}