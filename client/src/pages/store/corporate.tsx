import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Heart, 
  Star, 
  Package,
  Phone,
  Mail,
  MessageCircle,
  Award,
  CheckCircle,
  TrendingUp,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function CorporatePage() {
  const { isAuthenticated, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: corporateProducts, isLoading } = useQuery({
    queryKey: ['/api/products', 'corporate'],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('isActive', 'true');
      params.append('categoryId', '3'); // Corporativo category ID
      params.append('limit', '12');
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
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
      id: product.id.toString(),
      name: product.name,
      price: product.discountedPrice || product.price,
      image: product.images?.[0] || "/placeholder-product.jpg",
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`,
    });
  };

  const handleWhatsAppContact = (product: any) => {
    const message = `Hola! Me interesa el producto corporativo: ${product.name} - $${product.price}`;
    const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Building2 className="h-16 w-16 mx-auto mb-6 text-uniform-gold" />
              <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
                UNIFORMES CORPORATIVOS
              </h1>
              <p className="text-xl mb-8 text-blue-100 font-roboto max-w-2xl mx-auto">
                Eleva la imagen profesional de tu empresa con nuestros uniformes corporativos de alta calidad. 
                Diseños elegantes que proyectan confianza y profesionalismo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store/quote-request">
                  <Button size="lg" className="bg-uniform-gold text-uniform-blue hover:bg-yellow-300 font-semibold px-8 py-4">
                    Solicitar Cotización
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-uniform-blue px-8 py-4"
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent("Hola! Me interesa conocer más sobre sus uniformes corporativos")}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-poppins font-bold text-uniform-blue mb-4">
                ¿Por qué elegir nuestros uniformes corporativos?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Ofrecemos soluciones integrales para la imagen corporativa de tu empresa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Award className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Imagen Profesional</h3>
                  <p className="text-gray-600 text-sm">
                    Proyecta confianza y profesionalismo con diseños elegantes
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
                  <p className="text-gray-600 text-sm">
                    Materiales de alta calidad que duran y mantienen su apariencia
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Personalización</h3>
                  <p className="text-gray-600 text-sm">
                    Bordados y estampados con el logo de tu empresa
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Descuentos por Volumen</h3>
                  <p className="text-gray-600 text-sm">
                    Precios especiales para pedidos corporativos grandes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Corporate Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-poppins font-bold text-uniform-blue mb-4">
                PRODUCTOS CORPORATIVOS DESTACADOS
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Nuestra selección de uniformes corporativos más populares
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            ) : corporateProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {corporateProducts.map((product: any) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      {(() => {
                        if (!product.images?.length) {
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                              <Package className="h-16 w-16 text-blue-400" />
                            </div>
                          );
                        }
                        
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
                        <Badge className="bg-uniform-blue text-white">Corporativo</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button 
                          className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                          data-testid={`button-favorite-${product.id}`}
                        >
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
                      <h3 className="font-poppins font-semibold text-uniform-darker mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

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
                        <span className="text-2xl font-poppins font-bold text-uniform-blue" data-testid={`text-price-${product.id}`}>
                          ${product.discountedPrice || product.price}
                        </span>
                        {product.discount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            -{product.discount}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/store/product/${product.id}`} className="flex-1">
                          <Button 
                            className="w-full bg-uniform-blue hover:bg-blue-700 text-white font-poppins font-medium transition-all duration-300"
                            data-testid={`button-view-product-${product.id}`}
                          >
                            Ver Producto
                          </Button>
                        </Link>
                      </div>
                      
                      <button
                        onClick={() => handleWhatsAppContact(product)}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300 font-poppins font-medium"
                        data-testid={`button-whatsapp-${product.id}`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Consultar por WhatsApp
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay productos corporativos disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  Pronto agregaremos más productos a esta categoría
                </p>
                <Link href="/store/catalog">
                  <Button variant="outline">
                    Ver todo el catálogo
                  </Button>
                </Link>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/store/catalog?categoryId=3">
                <Button size="lg" className="bg-uniform-blue hover:bg-blue-700 text-white px-8 py-4 text-lg font-poppins font-semibold">
                  VER TODOS LOS PRODUCTOS CORPORATIVOS
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Corporate Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-poppins font-bold text-uniform-blue mb-4">
                SERVICIOS CORPORATIVOS
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Soluciones integrales para empresas de todos los tamaños
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Building2 className="h-12 w-12 text-uniform-blue mb-4" />
                  <CardTitle className="text-xl">Personalización Corporativa</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Bordado de logos empresariales
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Estampado en serigrafía
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Colores corporativos personalizados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Diseño de imagen corporativa
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Package className="h-12 w-12 text-uniform-blue mb-4" />
                  <CardTitle className="text-xl">Pedidos por Volumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Descuentos especiales por cantidad
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Entrega programada
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Gestión de inventario
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Facturación empresarial
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-uniform-blue mb-4" />
                  <CardTitle className="text-xl">Asesoría Especializada</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Consultoría en imagen corporativa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Toma de medidas in situ
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Seguimiento postventa
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Atención personalizada
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">
              ¿LISTO PARA TRANSFORMAR LA IMAGEN DE TU EMPRESA?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Solicita una cotización personalizada y descubre nuestros descuentos especiales para empresas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store/quote-request">
                <Button size="lg" className="bg-uniform-gold text-uniform-blue hover:bg-yellow-300 font-semibold px-8 py-4">
                  <Mail className="mr-2 h-5 w-5" />
                  Solicitar Cotización
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-uniform-blue px-8 py-4"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent("Hola! Quisiera solicitar una cotización para uniformes corporativos")}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Llamar Ahora
              </Button>
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}