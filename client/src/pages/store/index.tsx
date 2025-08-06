import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";
import PromotionBanner from "@/components/store/promotion-banner";
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
      {/* Promotion Banner */}
      <PromotionBanner />
      
      {/* Hero Section - Compact */}
      <section className="relative bg-gradient-to-br from-slate-900 via-uniform-blue to-blue-900 text-white overflow-hidden flex items-center" style={{ marginTop: '-80px', paddingTop: '80px', minHeight: '60vh' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 border border-uniform-gold rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-uniform-gold rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-16 h-16 border border-uniform-gold rounded-full"></div>
          <div className="absolute bottom-10 right-40 w-20 h-20 border border-uniform-gold rounded-full"></div>
        </div>
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-4">
                <span className="inline-block bg-uniform-gold text-slate-900 px-6 py-2 rounded-full text-sm font-poppins font-bold mb-3 shadow-lg">
                  ✨ CALIDAD PREMIUM GARANTIZADA
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-black mb-6 leading-tight drop-shadow-lg">
                <span className="block text-uniform-gold drop-shadow-lg">UNIFORMES</span>
                <span className="block text-xl md:text-2xl lg:text-3xl text-white font-semibold mt-1 drop-shadow-md">
                  PROFESIONALES
                </span>
              </h1>
              
              <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-xl font-roboto leading-relaxed drop-shadow-sm">
                Especialistas en uniformes profesionales para hospitales, industrias, restaurantes y empresas corporativas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              
              {/* Stats - Compact */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/30">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-poppins font-black text-uniform-gold drop-shadow-lg">500+</div>
                  <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Empresas Satisfechas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-poppins font-black text-uniform-gold drop-shadow-lg">15+</div>
                  <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Años de Experiencia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-poppins font-black text-uniform-gold drop-shadow-lg">24h</div>
                  <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Respuesta Garantizada</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Visual Compact */}
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-lg p-3 text-center border border-uniform-gold/50">
                      <Users className="h-6 w-6 mx-auto mb-1 text-uniform-gold drop-shadow-lg" />
                      <div className="text-xs text-white font-poppins font-semibold drop-shadow-sm">Corporativo</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-lg p-3 text-center border border-uniform-gold/50">
                      <Shield className="h-6 w-6 mx-auto mb-1 text-uniform-gold drop-shadow-lg" />
                      <div className="text-xs text-white font-poppins font-semibold drop-shadow-sm">Industrial</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-lg p-3 text-center border border-uniform-gold/50">
                      <Package className="h-6 w-6 mx-auto mb-1 text-uniform-gold drop-shadow-lg" />
                      <div className="text-xs text-white font-poppins font-semibold drop-shadow-sm">Médico</div>
                    </div>
                    <div className="bg-uniform-gold/30 backdrop-blur-sm rounded-lg p-3 text-center border border-uniform-gold/50">
                      <TrendingUp className="h-6 w-6 mx-auto mb-1 text-uniform-gold drop-shadow-lg" />
                      <div className="text-xs text-white font-poppins font-semibold drop-shadow-sm">Gastronomía</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-uniform-gold font-poppins font-bold mb-1 text-base drop-shadow-sm">
                      Soluciones Completas
                    </div>
                    <div className="text-white text-xs font-roboto font-medium drop-shadow-sm">
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

      {/* Product Categories Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-uniform-blue text-white px-6 py-2 rounded-full text-sm font-poppins font-semibold mb-4">
              NUESTRAS ESPECIALIDADES
            </span>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-uniform-blue mb-4">
              Uniformes por Categoría
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-roboto leading-relaxed">
              Cada sector tiene necesidades únicas. Descubre nuestras soluciones especializadas diseñadas específicamente para tu industria.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { name: 'Camisas', query: 'camisa', gradient: 'from-blue-500 via-indigo-600 to-purple-700', icon: '👔' },
              { name: 'Polos', query: 'polo', gradient: 'from-emerald-500 via-green-600 to-teal-700', icon: '👕' },
              { name: 'Playeras', query: 'playera', gradient: 'from-orange-500 via-red-600 to-pink-700', icon: '👚' },
              { name: 'Pantalones', query: 'pantalon', gradient: 'from-gray-500 via-slate-600 to-blue-700', icon: '👖' },
              { name: 'Chamarras', query: 'chamarra', gradient: 'from-cyan-500 via-blue-600 to-indigo-700', icon: '🧥' },
              { name: 'Chalecos', query: 'chaleco', gradient: 'from-yellow-500 via-orange-600 to-red-700', icon: '🦺' },
              { name: 'Seguridad', query: 'seguridad', gradient: 'from-red-500 via-orange-600 to-yellow-700', icon: '🛡️' },
              { name: 'Gorras', query: 'gorra', gradient: 'from-purple-500 via-pink-600 to-red-700', icon: '🧢' },
              { name: 'Promocionales', query: 'promocional', gradient: 'from-green-500 via-teal-600 to-blue-700', icon: '🎁' },
              { name: 'Toallas', query: 'toalla', gradient: 'from-blue-500 via-cyan-600 to-teal-700', icon: '🏖️' },
              { name: 'Termos', query: 'termo', gradient: 'from-slate-500 via-gray-600 to-blue-700', icon: '🍵' },
              { name: 'Plásticos', query: 'plastico', gradient: 'from-indigo-500 via-purple-600 to-pink-700', icon: '🥤' },
              { name: 'Cobertores', query: 'cobertor', gradient: 'from-amber-500 via-orange-600 to-red-700', icon: '🛏️' },
              { name: 'Tarimas', query: 'tarima', gradient: 'from-stone-500 via-gray-600 to-slate-700', icon: '📦' },
            ].map((category, index) => (
              <Link key={index} href={`/store/catalog?search=${category.query}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer border-0 bg-white rounded-xl h-full">
                  <div className={`aspect-square relative overflow-hidden bg-gradient-to-br ${category.gradient}`}>
                    {/* Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 right-2 w-8 h-8 border border-white rounded-full"></div>
                      <div className="absolute bottom-2 left-2 w-6 h-6 border border-white rounded-full"></div>
                    </div>
                    
                    {/* Category Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl md:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                    </div>
                    
                    {/* Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 text-center">
                      <h3 className="text-white font-poppins font-bold text-sm md:text-base leading-tight">
                        {category.name.toUpperCase()}
                      </h3>
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                  </div>
                </Card>
              </Link>
            ))}
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