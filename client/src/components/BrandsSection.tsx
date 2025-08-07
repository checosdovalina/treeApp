import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Brand } from "@shared/schema";

export default function BrandsSection() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ['/api/brands'],
    queryFn: () => fetch('/api/brands?active=true').then(res => res.json()),
  });

  if (isLoading || !brands || brands.length === 0) {
    return null;
  }

  // Filtrar solo marcas con logo
  const brandsWithLogos = brands.filter((brand: Brand) => brand.logo);

  if (brandsWithLogos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-uniform-primary to-uniform-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-uniform-gold/20 text-uniform-gold text-sm font-semibold px-4 py-2 rounded-full mb-4">
            NUESTRAS MARCAS
          </div>
          <h2 className="text-4xl font-poppins font-black text-white mb-4">
            Marcas de Confianza
          </h2>
          <p className="text-lg text-white/90 font-roboto max-w-3xl mx-auto">
            Trabajamos con las mejores marcas del mercado para ofrecerte la más alta calidad 
            en uniformes profesionales e industriales.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {brandsWithLogos.map((brand: Brand) => (
            <Link 
              key={brand.id} 
              href={`/store/catalog?brand=${encodeURIComponent(brand.name)}`}
              className="group"
            >
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer">
                {/* Logo Container */}
                <div className="aspect-square flex items-center justify-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={`Logo ${brand.name}`}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 font-semibold text-sm">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Brand Name - Hidden on hover for cleaner look */}
                <div className="mt-4 text-center opacity-70 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold text-gray-700 truncate">
                    {brand.name}
                  </h3>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-uniform-primary/95 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h3 className="text-lg font-bold mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-3">
                      Ver productos de esta marca
                    </p>
                    <div className="inline-block bg-uniform-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                      VER CATÁLOGO →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link href="/store/catalog">
            <div className="inline-block bg-uniform-gold hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl">
              Ver Todo el Catálogo
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}