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
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Eye
} from "lucide-react";

export default function CatalogPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedGarmentType, setSelectedGarmentType] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [productImages, setProductImages] = useState<{[key: number]: string}>({});
  const [productColorImages, setProductColorImages] = useState<{[key: number]: any[]}>({});
  const [selectedColors, setSelectedColors] = useState<{[key: number]: string}>({});

  // Extract route parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const garmentTypeParam = urlParams.get('garmentType');
    const brandParam = urlParams.get('brand');
    
    if (garmentTypeParam) {
      // Map URL garment types to database IDs
      const garmentTypeMap: { [key: string]: string } = {
        'polo': '6',
        'playera': '3',
        'camisa': '5'
      };
      
      if (garmentTypeMap[garmentTypeParam]) {
        setSelectedGarmentType(garmentTypeMap[garmentTypeParam]);
      }
    }
    
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [location]);

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: isAuthenticated,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['/api/brands'],
    enabled: isAuthenticated,
  });

  const { data: garmentTypes = [] } = useQuery({
    queryKey: ['/api/garment-types'],
    enabled: isAuthenticated,
  });

  const { data: colors = [] } = useQuery({
    queryKey: ['/api/colors'],
    enabled: isAuthenticated,
  });

  // Obtener imágenes por color para cada producto
  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0 && isAuthenticated) {
      products.forEach((product: any) => {
        if (!productColorImages[product.id]) {
          fetch(`/api/products/${product.id}/color-images`)
            .then(res => res.json())
            .then(colorImages => {
              setProductColorImages(prev => ({
                ...prev,
                [product.id]: colorImages
              }));
            })
            .catch(err => console.log('Error fetching color images:', err));
        }
      });
    }
  }, [products, isAuthenticated, productColorImages]);

  // Filter products
  const filteredProducts = (Array.isArray(products) ? products : []).filter((product: any) => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === "all" ||
      product.categoryId?.toString() === selectedCategory;
    
    const matchesBrand = !selectedBrand || selectedBrand === "all" ||
      product.brand === (Array.isArray(brands) ? brands.find((b: any) => b.id.toString() === selectedBrand)?.name : "");
    
    const matchesGender = !selectedGender || selectedGender === "all" ||
      product.gender?.toLowerCase() === selectedGender.toLowerCase();
    
    const matchesGarmentType = !selectedGarmentType || selectedGarmentType === "all" ||
      product.garmentTypeId?.toString() === selectedGarmentType;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesGender && matchesGarmentType;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'price_asc':
        return (a.price || 0) - (b.price || 0);
      case 'price_desc':
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-uniform-primary"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
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
    // Clear custom images for this product
    setProductImages(prev => {
      const updated = { ...prev };
      delete updated[product.id];
      return updated;
    });
  };

  const handleWhatsApp = (product: any) => {
    const message = `Hola, me interesa el producto: ${product.name} - $${product.price}`;
    const whatsappUrl = `https://wa.me/5218711234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const navigateToProduct = (productId: number) => {
    navigate(`/store/product/${productId}`);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedGender("all");
    setSelectedGarmentType("all");
  };

  // Función para obtener el código hexadecimal de un color
  const getColorHex = (colorName: string, availableColors: any) => {
    if (!availableColors || !Array.isArray(availableColors)) return '#ccc';
    
    const color = availableColors.find((c: any) => 
      c.name?.toLowerCase() === colorName?.toLowerCase()
    );
    return color?.hexCode || '#ccc';
  };

  // Función para cambiar color del producto en el card
  const handleColorChange = (productId: number, colorName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevenir navegación del card
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorName
    }));
  };

  // Función para obtener la imagen a mostrar basada en el color seleccionado
  const getProductDisplayImage = (product: any) => {
    const selectedColor = selectedColors[product.id];
    const colorImages = productColorImages[product.id];
    
    if (selectedColor && colorImages && Array.isArray(colors)) {
      // Buscar el color object por nombre
      const colorObj = colors.find((c: any) => c.name === selectedColor);
      if (colorObj) {
        // Buscar las imágenes para este color
        const colorImageSet = colorImages.find((ci: any) => ci.colorId === colorObj.id);
        if (colorImageSet && colorImageSet.images && colorImageSet.images.length > 0) {
          return colorImageSet.images[0]; // Usar la primera imagen del color
        }
      }
    }
    
    // Fallback a la imagen principal del producto
    return product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/300/300';
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

          {/* Compact Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            {/* Search and Quick Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-auto min-w-[140px] h-9">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Categorías</SelectItem>
                    {categories && Array.isArray(categories) ? categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>

                {/* Brand Filter */}
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-auto min-w-[120px] h-9">
                    <SelectValue placeholder="Marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Marcas</SelectItem>
                    {brands && Array.isArray(brands) ? brands.map((brand: any) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>{brand.name}</SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>

                {/* Gender Filter */}
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-auto min-w-[100px] h-9">
                    <SelectValue placeholder="Género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="hombre">Hombre</SelectItem>
                    <SelectItem value="mujer">Mujer</SelectItem>
                  </SelectContent>
                </Select>

                {/* Garment Type Filter */}
                <Select value={selectedGarmentType} onValueChange={setSelectedGarmentType}>
                  <SelectTrigger className="w-auto min-w-[130px] h-9">
                    <SelectValue placeholder="Tipo de Prenda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Tipos</SelectItem>
                    {garmentTypes && Array.isArray(garmentTypes) ? garmentTypes.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.displayName}</SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-auto min-w-[120px] h-9">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Por defecto</SelectItem>
                    <SelectItem value="name_asc">Nombre A-Z</SelectItem>
                    <SelectItem value="name_desc">Nombre Z-A</SelectItem>
                    <SelectItem value="price_asc">Precio menor</SelectItem>
                    <SelectItem value="price_desc">Precio mayor</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters Button */}
                {(searchTerm || (selectedCategory && selectedCategory !== "all") || (selectedBrand && selectedBrand !== "all") || (selectedGender && selectedGender !== "all") || (selectedGarmentType && selectedGarmentType !== "all")) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-9 px-3 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || (selectedCategory && selectedCategory !== "all") || (selectedBrand && selectedBrand !== "all") || (selectedGender && selectedGender !== "all") || (selectedGarmentType && selectedGarmentType !== "all")) && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                <span className="text-xs font-medium text-gray-500">Filtros activos:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && selectedCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {Array.isArray(categories) ? categories.find((c: any) => c.id.toString() === selectedCategory)?.name : ""}
                    <button onClick={() => setSelectedCategory("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && selectedBrand !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                    {Array.isArray(brands) ? brands.find((b: any) => b.id.toString() === selectedBrand)?.name : ""}
                    <button onClick={() => setSelectedBrand("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedGender && selectedGender !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
                    {selectedGender}
                    <button onClick={() => setSelectedGender("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedGarmentType && selectedGarmentType !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                    {Array.isArray(garmentTypes) ? garmentTypes.find((t: any) => t.id.toString() === selectedGarmentType)?.displayName : ""}
                    <button onClick={() => setSelectedGarmentType("all")}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              {sortedProducts.length} productos encontrados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros para ver más resultados
              </p>
              <Button onClick={clearAllFilters} variant="outline">
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {sortedProducts.map((product: any) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => navigateToProduct(product.id)}>
                  <div className="relative">
                    <img
                      src={getProductDisplayImage(product)}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
                    />
                    {/* SKU Badge removido - ya no se muestra en las tarjetas de producto */}
                    {product.isActive === false && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive">No disponible</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                          title="Agregar a favoritos"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.categoryName && (
                        <Badge variant="outline" className="text-xs">
                          {product.categoryName}
                        </Badge>
                      )}
                      {product.brandName && (
                        <Badge variant="outline" className="text-xs">
                          {product.brandName}
                        </Badge>
                      )}
                      {product.gender && (
                        <Badge variant="outline" className="text-xs">
                          {product.gender}
                        </Badge>
                      )}
                    </div>

                    {/* Colores disponibles */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Colores disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.colors.slice(0, 5).map((color: string, index: number) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded-full border shadow-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
                                selectedColors[product.id] === color 
                                  ? 'border-2 border-uniform-primary ring-2 ring-uniform-primary ring-opacity-30' 
                                  : 'border border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ 
                                backgroundColor: getColorHex(color, colors) || '#ccc'
                              }}
                              title={color}
                              onClick={(e) => handleColorChange(product.id, color, e)}
                            />
                          ))}
                          {product.colors.length > 5 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{product.colors.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tallas disponibles */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Tallas disponibles:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.slice(0, 6).map((size: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-1 py-0 h-5 text-gray-600"
                            >
                              {size}
                            </Badge>
                          ))}
                          {product.sizes.length > 6 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{product.sizes.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-uniform-primary">
                        ${product.price}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToProduct(product.id);
                          }}
                          className="h-8 px-2"
                          title="Ver detalles"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsApp(product);
                          }}
                          className="h-8 px-2"
                          title="Contactar por WhatsApp"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="h-8 px-3"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}