import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Package, Users, Shield, TrendingUp, Star, MessageCircle, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function StoreIndex() {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['/api/products', 'featured'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('isActive', 'true');
      params.append('limit', '8');
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    retry: false,
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const handleAddToCart = (product: any) => {
    if (!product.sizes?.[0] || !product.colors?.[0]) {
      toast({
        title: "Configuración requerida",
        description: "Ve a la página del producto para seleccionar talla y color",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || "/placeholder-product.jpg",
      size: product.sizes[0],
      color: product.colors[0],
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    });
  };

  const handleWhatsAppContact = (product: any) => {
    const message = `Hola! Me interesa el producto: ${product.name} - $${product.price}`;
    const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categoryImages = {
    1: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop", // Médico
    2: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop", // Industrial
    3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop", // Corporativo
    4: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", // Gastronomía
    5: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=300&fit=crop", // Seguridad
  };

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden" style={{ marginTop: '-80px', paddingTop: '100px' }}>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6 leading-tight text-white">
              TREE UNIFORMES
              <span className="block text-yellow-400">& KODIAK INDUSTRIAL</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto font-roboto">
              Calidad premium en uniformes profesionales para todas las industrias
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store/catalog">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg">
                  VER CATÁLOGO
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 text-lg">
                📲 CONSULTAR
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-uniform-darker mb-4">
              CATEGORÍAS
            </h2>
            <p className="text-uniform-dark text-lg max-w-2xl mx-auto font-roboto">
              Encuentra el uniforme perfecto para tu profesión
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories && Array.isArray(categories) ? categories.slice(0, 6).map((category: any) => (
              <Link key={category.id} href={`/store/catalog?category=${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={categoryImages[category.id as keyof typeof categoryImages] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {category.name.toUpperCase()}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            )) : null}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-uniform-darker mb-4">
              PRODUCTOS DESTACADOS
            </h2>
            <p className="text-uniform-dark text-lg max-w-2xl mx-auto font-roboto">
              Los uniformes más populares y de mejor calidad
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="h-6 bg-gray-200 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {(() => {
                      if (!product.images?.length) {
                        return (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <Package className="h-16 w-16 text-blue-400" />
                          </div>
                        );
                      }
                      
                      // Encontrar la primera imagen válida (base64 o URL que funcione)
                      const validImage = product.images.find((img: string) => {
                        return img.startsWith('data:image/') || 
                               (img.startsWith('http') && !img.includes('example.com'));
                      }) || product.images[0];
                      
                      return (
                        <img
                          src={validImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"><svg class="h-16 w-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                            }
                          }}
                        />
                      );
                    })()}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-500 text-white">Stock Disponible</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <h3 className="font-poppins font-semibold text-uniform-darker mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Color Options */}
                    <div className="mb-3">
                      <div className="flex gap-1 mb-2">
                        {product.colors?.slice(0, 4).map((color: string, index: number) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: color.toLowerCase().includes('blanco') ? '#ffffff' :
                                             color.toLowerCase().includes('negro') ? '#000000' :
                                             color.toLowerCase().includes('azul') ? '#2563eb' :
                                             color.toLowerCase().includes('rojo') ? '#dc2626' :
                                             color.toLowerCase().includes('verde') ? '#16a34a' :
                                             color.toLowerCase().includes('gris') ? '#6b7280' :
                                             '#94a3b8'
                            }}
                          />
                        ))}
                        {product.colors?.length > 4 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Tallas: {product.sizes?.join(', ').slice(0, 20)}...
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/store/product/${product.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Seleccionar opciones
                        </Button>
                      </Link>
                    </div>
                    
                    <button
                      onClick={() => handleWhatsAppContact(product)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      📲 Consultar por WhatsApp
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/store/catalog">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                VER TODOS LOS PRODUCTOS
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2 text-uniform-darker">Calidad Premium</h3>
              <p className="text-uniform-dark font-roboto">
                Materiales de primera calidad y confección profesional para durabilidad superior.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2 text-uniform-darker">Diseños Modernos</h3>
              <p className="text-uniform-dark font-roboto">
                Estilos contemporáneos que combinan funcionalidad con apariencia profesional.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2 text-uniform-darker">Atención Personalizada</h3>
              <p className="text-uniform-dark font-roboto">
                Servicio directo por WhatsApp y cotizaciones especiales para empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4 text-white">
            ¿NECESITAS UNIFORMES PARA TU EMPRESA?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100 font-roboto">
            Cotizaciones especiales para pedidos por volumen con descuentos atractivos y personalización.
          </p>
          <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg">
            📲 SOLICITAR COTIZACIÓN
          </Button>
        </div>
      </section>
    </CustomerLayout>
  );
}