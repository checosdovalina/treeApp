import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Grid3X3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export default function SimpleCategoriesSection() {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const activeCategories = categories.filter((category: Category) => category.isActive);

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Categorías</h2>
            <p className="text-gray-600">Cargando categorías...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeCategories.length) return null;

  // Categorías con iconos temáticos
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('médico') || name.includes('hospitalario')) {
      return '🏥';
    } else if (name.includes('industrial') || name.includes('manufactura')) {
      return '🏭';
    } else if (name.includes('corporativo') || name.includes('oficina')) {
      return '💼';
    } else if (name.includes('gastronomía') || name.includes('cocina')) {
      return '👨‍🍳';
    } else if (name.includes('seguridad') || name.includes('vigilancia')) {
      return '🛡️';
    } else if (name.includes('servicios') || name.includes('limpieza')) {
      return '🧹';
    } else if (name.includes('escolar') || name.includes('estudiante')) {
      return '🎓';
    } else {
      return '👔';
    }
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-emerald-500 to-teal-600', // Verde salud
      'from-orange-500 to-red-600',   // Naranja industrial
      'from-blue-500 to-indigo-600',  // Azul corporativo
      'from-yellow-500 to-orange-600', // Amarillo gastronomía
      'from-gray-500 to-slate-600',   // Gris seguridad
      'from-purple-500 to-pink-600',  // Púrpura servicios
      'from-cyan-500 to-blue-600',    // Cian hospitalario
      'from-lime-500 to-green-600',   // Lima manufactura
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Categorías
          </h2>
          <p className="text-gray-600">
            Encuentra uniformes por sector o industria
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeCategories.map((category: Category, index: number) => (
            <Link 
              key={category.id} 
              href={`/store/catalog?category=${category.id}`}
              className="block group"
            >
              <Card className="hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white border-gray-200 overflow-hidden">
                <CardContent className="p-6 text-center">
                  {/* Category Icon with Gradient Background */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${getCategoryGradient(index)} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <span className="filter drop-shadow-sm">
                      {getCategoryIcon(category.name)}
                    </span>
                  </div>
                  
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="text-xs text-blue-600 font-medium group-hover:underline">
                    Ver productos →
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-8">
          <Link href="/store/catalog">
            <Button variant="outline" className="px-6">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Ver todos los productos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}