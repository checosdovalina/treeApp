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

  // Gradientes temáticos por categoría
  const categoryGradients = {
    1: "from-emerald-500 via-green-600 to-teal-700", // Médico - Verde salud
    2: "from-orange-500 via-red-600 to-amber-700", // Industrial - Naranja seguridad
    3: "from-blue-500 via-indigo-600 to-purple-700", // Corporativo - Azul profesional
    4: "from-yellow-500 via-orange-600 to-red-700", // Gastronomía - Colores cálidos
    5: "from-gray-500 via-slate-600 to-blue-700", // Seguridad - Gris/azul autoridad
    6: "from-pink-500 via-purple-600 to-blue-700", // Servicios - Colores de servicio
    7: "from-cyan-500 via-blue-600 to-indigo-700", // Hospitalario - Azul médico
    8: "from-stone-500 via-gray-600 to-slate-700", // Manufactura - Grises industriales
  };

  const getCategoryGradient = (categoryId: number) => {
    return categoryGradients[categoryId as keyof typeof categoryGradients] || "from-uniform-blue via-blue-600 to-slate-700";
  };

  return (
    <CustomerLayout>
      {/* Hero Section - Improved Contrast */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-uniform-blue to-blue-900 text-white overflow-hidden flex items-center" style={{ marginTop: '-80px', paddingTop: '80px' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-uniform-gold rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-uniform-gold rounded-full"></div>
          <div className="absolute bottom-40 left-20 w-20 h-20 border border-uniform-gold rounded-full"></div>
          <div className="absolute bottom-20 right-40 w-28 h-28 border border-uniform-gold rounded-full"></div>
        </div>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block bg-uniform-gold text-slate-900 px-8 py-3 rounded-full text-sm font-poppins font-bold mb-4 shadow-lg">
                  ✨ CALIDAD PREMIUM GARANTIZADA
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-poppins font-black mb-8 leading-tight drop-shadow-lg">
                <span className="block text-uniform-gold drop-shadow-lg">UNIFORMES</span>
                <span className="block text-2xl md:text-3xl text-white font-semibold mt-2 drop-shadow-md">
                  PROFESIONALES
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-xl font-roboto leading-relaxed drop-shadow-sm">
                Especialistas en uniformes profesionales para hospitales, industrias, restaurantes y empresas corporativas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/store/catalog">
                  <Button size="lg" className="bg-uniform-gold text-slate-900 hover:bg-yellow-400 font-poppins font-black px-8 py-4 text-base shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 rounded-xl border-2 border-uniform-gold w-full sm:w-auto">
                    <Package className="mr-2 h-5 w-5" />
                    EXPLORAR CATÁLOGO
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="bg-white/90 border-2 border-white text-slate-900 hover:bg-white hover:text-slate-800 font-poppins font-black px-8 py-4 text-base shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 rounded-xl backdrop-blur-sm w-full sm:w-auto"
                  onClick={() => {
                    const message = "¡Hola! Me interesa obtener información sobre uniformes profesionales y solicitar una cotización personalizada.";
                    const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  SOLICITAR COTIZACIÓN
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/30">
                <div className="text-center">
                  <div className="text-4xl font-poppins font-black text-uniform-gold drop-shadow-lg">500+</div>
                  <div className="text-sm text-white font-roboto font-medium drop-shadow-sm">Empresas Satisfechas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-poppins font-black text-uniform-gold drop-shadow-lg">15+</div>
                  <div className="text-sm text-white font-roboto font-medium drop-shadow-sm">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-poppins font-black text-uniform-gold drop-shadow-lg">24h</div>
                  <div className="text-sm text-white font-roboto font-medium drop-shadow-sm">Respuesta Garantizada</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Visual */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-xl p-4 text-center border border-uniform-gold/50">
                      <Users className="h-8 w-8 mx-auto mb-2 text-uniform-gold drop-shadow-lg" />
                      <div className="text-sm text-white font-poppins font-semibold drop-shadow-sm">Corporativo</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-xl p-4 text-center border border-uniform-gold/50">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-uniform-gold drop-shadow-lg" />
                      <div className="text-sm text-white font-poppins font-semibold drop-shadow-sm">Industrial</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-xl p-4 text-center border border-uniform-gold/50">
                      <Package className="h-8 w-8 mx-auto mb-2 text-uniform-gold drop-shadow-lg" />
                      <div className="text-sm text-white font-poppins font-semibold drop-shadow-sm">Médico</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-xl p-4 text-center border border-uniform-gold/50">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-uniform-gold drop-shadow-lg" />
                      <div className="text-sm text-white font-poppins font-semibold drop-shadow-sm">Gastronomía</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-uniform-gold font-poppins font-bold mb-2 text-lg drop-shadow-sm">
                      Soluciones Completas
                    </div>
                    <div className="text-white text-sm font-roboto font-medium drop-shadow-sm">
                      Desde el diseño hasta la entrega
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-uniform-gold/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 text-uniform-gold rotate-90" />
        </div>
      </section>

      {/* Categories Section - Redesigned */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-uniform-blue text-white px-6 py-2 rounded-full text-sm font-poppins font-semibold mb-6">
              NUESTRAS ESPECIALIDADES
            </span>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-uniform-blue mb-6">
              Uniformes por Industria
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto font-roboto leading-relaxed">
              Cada sector tiene necesidades únicas. Descubre nuestras soluciones especializadas diseñadas específicamente para tu industria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories && Array.isArray(categories) ? categories.slice(0, 6).map((category: any) => (
              <Link key={category.id} href={`/store/catalog?category=${category.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden cursor-pointer border-0 bg-white rounded-2xl min-h-[320px]">
                  <div className={`aspect-[4/3] relative overflow-hidden bg-gradient-to-br ${getCategoryGradient(category.id)}`}>
                    {/* Patrón decorativo */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-8 left-8 w-12 h-12 border border-white rounded-full"></div>
                      <div className="absolute top-12 left-12 w-8 h-8 border border-white rounded-full"></div>
                      <div className="absolute bottom-12 right-12 w-10 h-10 border border-white rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Icon based on category */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-uniform-gold/20 backdrop-blur-sm rounded-full p-3 border border-uniform-gold/50">
                        {category.name.toLowerCase().includes('corporativo') && <Users className="h-6 w-6 text-uniform-gold" />}
                        {category.name.toLowerCase().includes('industrial') && <Shield className="h-6 w-6 text-uniform-gold" />}
                        {category.name.toLowerCase().includes('médico') && <Package className="h-6 w-6 text-uniform-gold" />}
                        {category.name.toLowerCase().includes('gastronomía') && <TrendingUp className="h-6 w-6 text-uniform-gold" />}
                        {category.name.toLowerCase().includes('seguridad') && <Shield className="h-6 w-6 text-uniform-gold" />}
                        {!category.name.toLowerCase().match(/(corporativo|industrial|médico|gastronomía|seguridad)/) && <Package className="h-6 w-6 text-uniform-gold" />}
                      </div>
                    </div>
                    
                    <div className="absolute top-6 right-6">
                      <div className="bg-uniform-gold text-uniform-blue px-3 py-1 rounded-full text-xs font-poppins font-bold shadow-lg">
                        ESPECIALIDAD
                      </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-poppins font-bold text-white mb-3 leading-tight drop-shadow-lg">
                        {category.name.toUpperCase()}
                      </h3>
                      <p className="text-white/90 text-sm font-roboto leading-relaxed mb-4 drop-shadow-sm">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-uniform-gold group-hover:translate-x-2 transition-transform duration-300">
                          <span className="text-sm font-poppins font-semibold">Explorar productos</span>
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-xs text-white font-poppins font-medium">Ver más</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )) : (
              // Loading skeleton for categories
              [...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden min-h-[320px]">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse relative">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="h-6 bg-gray-300 animate-pulse mb-3 rounded"></div>
                      <div className="h-4 bg-gray-300 animate-pulse mb-2 rounded"></div>
                      <div className="h-4 bg-gray-300 animate-pulse w-3/4 rounded"></div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-uniform-blue mb-4">
              PRODUCTOS DESTACADOS
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-roboto">
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
                      <span className="text-2xl font-poppins font-bold text-uniform-blue">
                        ${product.price}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/store/product/${product.id}`} className="flex-1">
                        <Button className="w-full bg-uniform-blue hover:bg-blue-700 text-white font-poppins font-medium transition-all duration-300">
                          Seleccionar opciones
                        </Button>
                      </Link>
                    </div>
                    
                    <button
                      onClick={() => handleWhatsAppContact(product)}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 font-poppins font-medium"
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
              <Button size="lg" className="bg-uniform-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-poppins font-semibold shadow-lg transition-all duration-300 hover:shadow-xl">
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