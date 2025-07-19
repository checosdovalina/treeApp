import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Package,
  Phone,
  ArrowRight,
  Users,
  Award,
  Truck,
  ShieldCheck
} from "lucide-react";

export default function StoreIndex() {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['/api/products', { featured: true, limit: 8 }],
    retry: false,
  });

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size: "M", // Default size
      color: "Azul", // Default color
      quantity: 1,
    });

    toast({
      title: "Agregado al carrito",
      description: `${product.name} agregado exitosamente`,
    });
  };

  const handleWhatsApp = (product?: any) => {
    const message = product 
      ? `Hola, me interesa el producto: ${product.name} - $${product.price}`
      : "Hola, me gustaría información sobre sus uniformes";
    const whatsappUrl = `https://wa.me/5218711234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const features = [
    {
      icon: Users,
      title: "Más de 15 años de experiencia",
      description: "Especialistas en uniformes para empresas de todos los tamaños"
    },
    {
      icon: Award,
      title: "Calidad garantizada",
      description: "Materiales premium y diseños duraderos para uso profesional"
    },
    {
      icon: Truck,
      title: "Entrega a domicilio",
      description: "Enviamos a toda la región de La Laguna y alrededores"
    },
    {
      icon: ShieldCheck,
      title: "Garantía de satisfacción",
      description: "Si no estás completamente satisfecho, lo arreglamos"
    }
  ];

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-uniform-primary via-blue-600 to-blue-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  Uniformes
                  <span className="block text-uniform-accent">Profesionales</span>
                  para tu Empresa
                </h1>
                <p className="text-xl lg:text-2xl mb-8 text-blue-100">
                  Diseñamos y confeccionamos uniformes de la más alta calidad 
                  para empresas en La Laguna, Coahuila.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-uniform-accent hover:bg-green-600 text-white font-semibold px-8 py-4 text-lg"
                    onClick={() => window.location.href = isAuthenticated ? "/store/catalog" : "/login"}
                  >
                    {isAuthenticated ? "Ver Catálogo" : "Explorar Catálogo"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-uniform-primary font-semibold px-8 py-4 text-lg"
                    onClick={() => handleWhatsApp()}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Contactar por WhatsApp
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-full h-96 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <Package className="h-32 w-32 text-white/50" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-uniform-accent rounded-full flex items-center justify-center">
                    <Award className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir Uniformes Laguna?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Somos la mejor opción en uniformes empresariales, con años de experiencia 
                sirviendo a empresas locales y regionales.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-uniform-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Productos Destacados
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explora algunos de nuestros uniformes más populares y de mayor calidad
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-64 bg-gray-200 animate-pulse loading-shimmer"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 loading-shimmer"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 loading-shimmer"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse loading-shimmer"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !featuredProducts || featuredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Productos disponibles próximamente
                </h3>
                <p className="text-gray-600 mb-6">
                  Estamos preparando nuestro catálogo con los mejores uniformes para ti
                </p>
                <Button 
                  onClick={() => handleWhatsApp()}
                  className="bg-uniform-primary hover:bg-blue-700"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Consultar por WhatsApp
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mobile-grid-auto">
                {featuredProducts.slice(0, 8).map((product: any) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 product-card-hover">
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        {product.images?.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="p-2 bg-white/90 hover:bg-white mobile-touch-target"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      {product.isActive && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-500">
                            Disponible
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 mobile-text-responsive">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description || 'Producto de calidad premium para uso profesional'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl lg:text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {isAuthenticated ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-uniform-primary hover:bg-blue-700 btn-mobile-optimized"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Agregar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-uniform-primary hover:bg-blue-700 btn-mobile-optimized"
                            onClick={() => window.location.href = "/login"}
                          >
                            Ver Producto
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(product)}
                          className="mobile-touch-target"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = isAuthenticated ? "/store/catalog" : "/login"}
                className="btn-mobile-optimized"
              >
                {isAuthenticated ? "Ver Catálogo Completo" : "Iniciar Sesión para Ver Más"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-uniform-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              ¿Listo para equipar tu empresa?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Contáctanos hoy mismo y obtén una cotización personalizada 
              para los uniformes de tu empresa. Sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-uniform-accent hover:bg-green-600 text-white font-semibold px-8 py-4 text-lg"
                onClick={() => handleWhatsApp()}
              >
                <Phone className="mr-2 h-5 w-5" />
                Solicitar Cotización
              </Button>
              {!isAuthenticated && (
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-uniform-primary font-semibold px-8 py-4 text-lg"
                  onClick={() => window.location.href = "/login"}
                >
                  Crear Cuenta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}