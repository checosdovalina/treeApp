import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedProductForm } from "@/components/admin/advanced-product-form";
import CategoryManager from "@/components/admin/category-manager";
import BrandManager from "@/components/admin/brand-manager";
import InventoryManager from "@/components/admin/inventory-manager";
import { Plus, Search, Edit, Trash2, Package, FolderOpen, Tag, BarChart3, AlertTriangle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AdminProducts() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("products");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products', search, category, status],
    enabled: isAuthenticated,
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    enabled: isAuthenticated,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (user as any)?.role !== 'admin') {
    return null;
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleManageInventory = (product: any) => {
    setSelectedProduct(product);
    setActiveTab("inventory");
  };

  const getStatusBadge = (isActive: boolean, stock?: number) => {
    if (!isActive) {
      return <Badge variant="secondary">Inactivo</Badge>;
    }
    if (stock === 0) {
      return <Badge variant="destructive">Sin stock</Badge>;
    }
    if (stock && stock < 10) {
      return <Badge variant="outline">Bajo stock</Badge>;
    }
    return <Badge variant="default">Activo</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Gestión de Productos</h1>
            <p className="text-uniform-secondary mt-2">Administra tu catálogo de uniformes, categorías e inventario</p>
          </div>
          <AdvancedProductForm
            product={editingProduct}
            onSuccess={handleFormClose}
            trigger={
              <Button className="bg-uniform-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            }
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Productos
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Marcas
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Inventario
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                      Buscar productos
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Buscar por nombre..."
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
                    <Select value={category || "all"} onValueChange={(value) => setCategory(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categories && Array.isArray(categories) ? categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        )) : null}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                      Estado
                    </label>
                    <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="true">Activos</SelectItem>
                        <SelectItem value="false">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                      Ordenar por
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre A-Z" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nombre A-Z</SelectItem>
                        <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                        <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                        <SelectItem value="created">Más recientes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-uniform-secondary">Cargando productos...</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products && Array.isArray(products) && products.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
                        No hay productos
                      </h3>
                      <p className="text-uniform-secondary mb-4">
                        Comienza agregando tu primer producto al catálogo
                      </p>
                      <AdvancedProductForm
                        onSuccess={() => {}}
                        trigger={
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Producto
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    products && Array.isArray(products) ? products.map((product: any) => (
                      <Card 
                        key={product.id} 
                        className="overflow-hidden hover:shadow-md transition-shadow product-card-hover"
                      >
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            {(() => {
                              if (!product.images?.length) {
                                return <Package className="h-16 w-16 text-gray-400" />;
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
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>';
                                    }
                                  }}
                                />
                              );
                            })()}
                          </div>
                          <div className="absolute top-3 left-3">
                            {getStatusBadge(product.isActive)}
                          </div>
                          <div className="absolute top-3 right-3">
                            <div className="flex space-x-1">
                              <AdvancedProductForm
                                product={product}
                                onSuccess={() => {}}
                                trigger={
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="p-2 bg-white/90 hover:bg-white"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                size="sm"
                                variant="secondary"
                                className="p-2 bg-white/90 hover:bg-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleManageInventory(product);
                                }}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="p-2 bg-white/90 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(product.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 
                            className="font-semibold text-uniform-neutral-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => window.open(`/store/product/${product.id}`, '_blank')}
                            title="Clic para ver en la tienda"
                          >
                            {product.name}
                          </h3>
                          {product.sku && (
                            <p className="text-xs text-blue-600 font-mono mb-1">
                              SKU: {product.sku}
                            </p>
                          )}
                          <p className="text-sm text-uniform-secondary mb-3 line-clamp-2">
                            {product.description || 'Sin descripción'}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-uniform-neutral-900">
                              ${product.price}
                            </span>
                            <span className="text-sm text-uniform-secondary">
                              ID: {product.id}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-uniform-secondary">Tallas:</span>
                              <span className="text-uniform-neutral-900">
                                {product.sizes?.join(', ') || 'No definidas'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-uniform-secondary">Colores:</span>
                              <div className="flex space-x-1">
                                {product.colors?.slice(0, 3).map((color: string, index: number) => {
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
                                    <div
                                      key={index}
                                      className="w-4 h-4 rounded-full border-2 border-gray-300"
                                      style={{ backgroundColor: hexColor }}
                                      title={color}
                                    />
                                  );
                                })}
                                {product.colors?.length > 3 && (
                                  <span className="text-xs text-uniform-secondary">
                                    +{product.colors.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : null
                  )}
                </div>

                {/* Pagination */}
                {products && Array.isArray(products) && products.length > 0 && (
                  <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-uniform-secondary">
                      Mostrando {Array.isArray(products) ? products.length : 0} productos
                    </div>
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
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="brands" className="space-y-6">
            <BrandManager />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            {selectedProduct ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Inventario: {selectedProduct.name}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedProduct(null)}
                  >
                    Volver a productos
                  </Button>
                </div>
                <InventoryManager 
                  productId={selectedProduct.id} 
                  productName={selectedProduct.name} 
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un producto
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Primero selecciona un producto para gestionar su inventario
                  </p>
                  <Button 
                    onClick={() => setActiveTab("products")}
                    className="bg-uniform-primary hover:bg-blue-700"
                  >
                    Ver productos
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}