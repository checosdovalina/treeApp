import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Search, 
  Filter,
  Package,
  ArrowRight,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Phone
} from "lucide-react";

export default function StorePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Bienvenido",
        description: "Inicia sesión para acceder a todas las funciones.",
        variant: "default",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated,
    retry: false,
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión expirada",
          description: "Redirigiendo al login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    },
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', { search: searchTerm, category: selectedCategory, isActive: true }],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ['/api/products/featured'],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <CustomerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <Package className="h-16 w-16 text-uniform-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido a Uniformes Laguna
            </h2>
            <p className="text-gray-600 mb-6">
              Inicia sesión para explorar nuestro catálogo completo de uniformes de calidad
            </p>
            <Button 
              onClick={() => window.location.href = "/login"}
              className="bg-uniform-primary hover:bg-blue-700"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const handleAddToCart = (product: any) => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Selecciona opciones",
        description: "Por favor selecciona talla y color antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    toast({
      title: "Agregado al carrito",
      description: `${product.name} (${selectedSize}, ${selectedColor})`,
    });

    // Reset selections
    setSelectedSize("");
    setSelectedColor("");
    setSelectedProduct(null);
  };

  const handleWhatsApp = (product: any) => {
    const message = `Hola, me interesa el producto: ${product.name} - $${product.price}`;
    const whatsappUrl = `https://wa.me/5218711234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-uniform-primary to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Uniformes de Calidad
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8">
                Viste el profesionalismo con nuestros uniformes corporativos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-uniform-primary hover:bg-gray-100"
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explorar Catálogo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-uniform-primary"
                  onClick={() => window.location.href = "/customer/quotes"}
                >
                  Solicitar Cotización
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir Uniformes Laguna?
              </h2>
              <p className="text-lg text-gray-600">
                Calidad, durabilidad y diseño profesional en cada prenda
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Calidad Garantizada
                </h3>
                <p className="text-gray-600">
                  Materiales premium y confección de alta calidad para mayor durabilidad
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Entrega Rápida
                </h3>
                <p className="text-gray-600">
                  Tiempos de entrega optimizados para satisfacer tus necesidades
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Atención Personalizada
                </h3>
                <p className="text-gray-600">
                  Asesoría especializada para encontrar el uniforme perfecto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestras Categorías
              </h2>
              <p className="text-lg text-gray-600">
                Encuentra el uniforme perfecto para tu industria
              </p>
            </div>
            
            {categories && categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category: any) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="bg-uniform-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-uniform-primary/20 transition-colors">
                        <Package className="h-8 w-8 text-uniform-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {category.name.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description || "Productos de calidad"}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCategory(category.id.toString())}
                        className="group-hover:bg-uniform-primary group-hover:text-white"
                      >
                        Ver productos
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Categorías en preparación
                </h3>
                <p className="text-gray-600">
                  Pronto tendremos disponibles nuestras categorías de productos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Products Catalog */}
        <div id="catalog" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Catálogo de Productos
                </h2>
                <p className="text-lg text-gray-600">
                  Explora nuestra amplia selección de uniformes
                </p>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
                <div className="relative">
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las categorías</SelectItem>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay productos disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory 
                    ? "Intenta ajustar tus filtros de búsqueda"
                    : "Pronto tendremos productos disponibles para ti"
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                          className="p-2 bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {product.isActive && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-500">
                            Stock Disponible
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description || 'Producto de calidad premium'}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">4.8</span>
                        </div>
                      </div>
                      
                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Colores:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.slice(0, 6).map((color: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full border-2 ${
                                  selectedColor === color 
                                    ? 'border-gray-900 ring-2 ring-gray-300' 
                                    : 'border-gray-300'
                                }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                            ))}
                            {product.colors.length > 6 && (
                              <span className="text-xs text-gray-500 flex items-center">
                                +{product.colors.length - 6}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Tallas:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size: string, index: number) => (
                              <button
                                key={index}
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 py-1 text-xs border rounded ${
                                  selectedSize === size
                                    ? 'border-uniform-primary bg-uniform-primary text-white'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-uniform-primary hover:bg-blue-700"
                          onClick={() => {
                            setSelectedProduct(product);
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(product)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}