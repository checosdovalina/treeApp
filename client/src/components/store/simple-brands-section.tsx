import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Brand {
  id: number;
  name: string;
  logo?: string;
  isActive: boolean;
  description?: string;
}

export default function SimpleBrandsSection() {
  const { data: brands = [], isLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
    retry: false,
  });

  const activeBrands = brands.filter((brand: Brand) => brand.isActive);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nuestras Marcas</h2>
            <p className="text-gray-600">Cargando marcas...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeBrands.length) return null;

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Nuestras Marcas
          </h2>
          <p className="text-gray-600">
            Trabajamos con las mejores marcas del mercado
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {activeBrands.slice(0, 12).map((brand: Brand) => (
            <Link 
              key={brand.id} 
              href={`/store/catalog?brand=${brand.id}`}
              className="block group"
            >
              <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105 bg-white">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center h-16 mb-3">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-12 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {brand.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Brands Button */}
        {activeBrands.length > 12 && (
          <div className="text-center">
            <Link href="/store/brands">
              <Button variant="outline" className="px-6">
                Ver todas las marcas ({activeBrands.length})
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}