import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StoreLayout from "@/components/layout/store-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/store/product-card";
import { Search, Filter, Grid3X3, List, Shirt } from "lucide-react";

export default function StoreCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products', { 
      search, 
      categoryId: category, 
      isActive: true,
      limit: 50
    }],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const filteredProducts = products?.filter((product: any) => {
    let matchesPrice = true;
    
    if (priceRange) {
      const price = parseFloat(product.price);
      switch (priceRange) {
        case "0-100":
          matchesPrice = price <= 100;
          break;
        case "100-200":
          matchesPrice = price > 100 && price <= 200;
          break;
        case "200+":
          matchesPrice = price > 200;
          break;
      }
    }
    
    return matchesPrice;
  });

  const sortedProducts = filteredProducts?.sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-uniform-neutral-900 mb-4">Catálogo de Productos</h1>
          <p className="text-uniform-secondary">
            Encuentra el uniforme perfecto para tu empresa o uso personal
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Buscar productos
                </label>
                <div className="relative">
                  <Input
                    placeholder="Buscar uniformes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-uniform-secondary h-4 w-4" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Categoría
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
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

              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Precio
                </label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquier precio</SelectItem>
                    <SelectItem value="0-100">$0 - $100</SelectItem>
                    <SelectItem value="100-200">$100 - $200</SelectItem>
                    <SelectItem value="200+">$200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Ordenar por
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                    <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-uniform-secondary">
              {sortedProducts?.length || 0} productos encontrados
            </p>
            {(search || category || priceRange) && (
              <div className="flex items-center space-x-2">
                {search && (
                  <Badge variant="secondary">
                    Búsqueda: "{search}"
                  </Badge>
                )}
                {category && (
                  <Badge variant="secondary">
                    Categoría: {categories?.find((c: any) => c.id.toString() === category)?.name}
                  </Badge>
                )}
                {priceRange && (
                  <Badge variant="secondary">
                    Precio: ${priceRange}
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPriceRange("");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedProducts?.length === 0 ? (
          <div className="text-center py-16">
            <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-uniform-secondary mb-4">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("");
                setPriceRange("");
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts?.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.images?.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Shirt className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-uniform-neutral-900 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-uniform-secondary text-sm mb-3">
                            {product.description || 'Sin descripción'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-2xl font-bold text-uniform-neutral-900">
                                ${product.price}
                              </span>
                              <div className="text-sm text-uniform-secondary">
                                <div>Tallas: {product.sizes?.join(', ') || 'No definidas'}</div>
                                <div>Colores: {product.colors?.join(', ') || 'No definidos'}</div>
                              </div>
                            </div>
                            <Button className="bg-uniform-primary hover:bg-blue-700">
                              Ver Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {sortedProducts?.length > 0 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Anterior
                  </Button>
                  <Button size="sm" className="bg-uniform-primary">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </StoreLayout>
  );
}
