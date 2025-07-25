import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/lib/cart";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Search, 
  Filter,
  Package,
  Phone,
  Grid,
  List,
  ArrowUpDown,
  X
} from "lucide-react";

export default function CatalogPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Get brand from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const brandParam = urlParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [location]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para ver el catálogo completo.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: brands } = useQuery({
    queryKey: ['/api/brands'],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', searchTerm, selectedCategory, selectedBrand, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedBrand) params.append('brandId', selectedBrand);
      params.append('isActive', 'true');
      if (sortBy) params.append('sortBy', sortBy);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo...</p>
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
              Catálogo de Uniformes
            </h2>
            <p className="text-gray-600 mb-6">
              Inicia sesión para explorar nuestra colección completa de uniformes
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Catálogo de Uniformes
            </h1>
            <p className="text-lg text-gray-600">
              Explora nuestra colección completa de uniformes profesionales
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories && Array.isArray(categories) ? categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <Select value={selectedBrand || "all"} onValueChange={(value) => setSelectedBrand(value === "all" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {brands && Array.isArray(brands) ? brands.filter((brand: any) => brand.isActive).map((brand: any) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="popular">Más populares</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedBrand || searchTerm) && (
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categories?.find((cat: any) => cat.id.toString() === selectedCategory)?.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSelectedCategory("")}
                    />
                  </Badge>
                )}
                {selectedBrand && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {brands?.find((brand: any) => brand.id.toString() === selectedBrand)?.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSelectedBrand("")}
                    />
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchTerm}"
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedBrand("");
                    setSearchTerm("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              {products?.length ? (
                <>Mostrando {products.length} productos</>
              ) : (
                <>No se encontraron productos</>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {sortBy === "name" ? "Nombre A-Z" :
                 sortBy === "price-asc" ? "Precio: menor a mayor" :
                 sortBy === "price-desc" ? "Precio: mayor a menor" :
                 sortBy === "newest" ? "Más recientes" : "Más populares"}
              </span>
            </div>
          </div>

          {/* Products Grid/List */}
          {productsLoading ? (
            <div className={`grid gap-6 ${viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"}`}>
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
            <div className={`grid gap-6 ${viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mobile-grid-auto" 
              : "grid-cols-1"}`}>
              {products.map((product: any) => (
                <Card 
                  key={product.id} 
                  className={`overflow-hidden hover:shadow-lg transition-shadow product-card-hover cursor-pointer ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                  onClick={() => window.open(`/store/product/${product.id}`, '_blank')}
                >
                  <div className={`relative ${viewMode === "list" ? "md:w-48 md:flex-shrink-0" : ""}`}>
                    <div className={`bg-gray-200 flex items-center justify-center ${
                      viewMode === "list" ? "h-full md:h-48" : "w-full h-64"
                    }`}>
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
                  
                  <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className={viewMode === "list" ? "flex flex-col h-full" : ""}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 mobile-text-responsive">
                        {product.name}
                      </h3>
                      {product.sku && (
                        <p className="text-xs text-blue-600 font-mono mb-1">
                          SKU: {product.sku}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description || 'Producto de calidad premium'}
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
                      
                      {/* Colors */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Colores:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.slice(0, 6).map((color: string, index: number) => {
                              const colors = {
                                'Blanco': '#FFFFFF', 'Negro': '#000000', 'Azul': '#0066CC',
                                'Azul Marino': '#001F3F', 'Azul Claro': '#87CEEB', 'Rojo': '#FF0000',
                                'Verde': '#008000', 'Verde Quirófano': '#00CED1', 'Amarillo': '#FFFF00',
                                'Naranja': '#FFA500', 'Naranja Alta Visibilidad': '#FF6600',
                                'Gris': '#808080', 'Gris Claro': '#D3D3D3', 'Morado': '#800080',
                                'Rosa': '#FFC0CB', 'Café': '#8B4513', 'Beige': '#F5F5DC'
                              };
                              const hexColor = colors[color as keyof typeof colors] || '#CCCCCC';
                              
                              return (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedColor(color);
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 mobile-touch-target ${
                                    selectedColor === color 
                                      ? 'border-gray-900 ring-2 ring-gray-300' 
                                      : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: hexColor }}
                                  title={color}
                                />
                              );
                            })}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSize(size);
                                }}
                                className={`px-3 py-1 text-xs border rounded mobile-touch-target ${
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
                      
                      <div className={`flex gap-2 ${viewMode === "list" ? "mt-auto" : ""}`}>
                        <Button
                          size="sm"
                          className="flex-1 bg-uniform-primary hover:bg-blue-700 btn-mobile-optimized"
                          onClick={(e) => {
                            e.stopPropagation();
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsApp(product);
                          }}
                          className="mobile-touch-target"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {products && products.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button 
                variant="outline" 
                size="lg"
                className="btn-mobile-optimized"
              >
                Cargar más productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}