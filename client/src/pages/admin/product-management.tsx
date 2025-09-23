import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, Package, DollarSign, Edit3, Save, X, Eye, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@shared/schema";

interface ProductWithDetails extends Product {
  brandName?: string;
  categoryName?: string;
}

interface EditingState {
  productId: number;
  newPrice: string;
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [sortBy, setSortBy] = useState<"sku" | "name" | "price">("sku");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products/management"],
  });

  const { data: brands = [] } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["/api/brands"],
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ productId, price }: { productId: number; price: number }) => {
      return await apiRequest("PATCH", `/api/products/${productId}/price`, { price });
    },
    onSuccess: (_, { productId, price }) => {
      toast({
        title: "Precio actualizado",
        description: `Precio actualizado exitosamente a $${price.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products/management"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditing(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar precio",
        variant: "destructive",
      });
    },
  });

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // Position cursor at the end instead of selecting all text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [editing]);

  const handleStartEdit = (product: ProductWithDetails) => {
    setEditing({
      productId: product.id,
      newPrice: product.price.toString()
    });
  };

  const handleSave = () => {
    if (!editing) return;
    
    const newPrice = parseFloat(editing.newPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser un número válido mayor que 0",
        variant: "destructive",
      });
      return;
    }

    updatePriceMutation.mutate({
      productId: editing.productId,
      price: newPrice
    });
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm || 
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brandName && product.brandName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesBrand = !selectedBrand || selectedBrand === "all" || product.brandName === selectedBrand;
      
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "sku":
          aValue = (a.sku || "").toLowerCase();
          bValue = (b.sku || "").toLowerCase();
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price.toString());
          bValue = parseFloat(b.price.toString());
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: "sku" | "name" | "price") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: "sku" | "name" | "price") => {
    if (sortBy !== field) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-uniform-neutral-900 font-poppins">
            Gestión Masiva de Productos
          </h1>
          <p className="text-uniform-secondary mt-1">
            Visualiza y edita precios de manera rápida y eficiente
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Package className="h-3 w-3" />
            <span>{filteredAndSortedProducts.length} productos</span>
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por SKU, nombre del producto o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-products"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-48" data-testid="select-brand-filter">
                    <SelectValue placeholder="Filtrar por marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-all-brands">Todas las marcas</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name} data-testid={`option-brand-${brand.id}`}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(searchTerm || selectedBrand) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedBrand("");
                  }}
                  data-testid="button-clear-filters"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Lista de Productos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-uniform-primary rounded-full"></div>
              <p className="mt-2 text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("sku")}
                      data-testid="header-sku"
                    >
                      <div className="flex items-center space-x-1">
                        <span>SKU</span>
                        <span className="text-sm">{getSortIcon("sku")}</span>
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("name")}
                      data-testid="header-name"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Producto</span>
                        <span className="text-sm">{getSortIcon("name")}</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("price")}
                      data-testid="header-price"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Precio</span>
                        <span className="text-sm">{getSortIcon("price")}</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900" data-testid={`text-sku-${product.id}`}>
                          {product.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" data-testid={`text-name-${product.id}`}>
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {product.brandName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {product.categoryName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editing && editing.productId === product.id ? (
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                ref={inputRef}
                                type="text"
                                inputMode="decimal"
                                value={editing.newPrice}
                                onChange={(e) => setEditing({ ...editing, newPrice: e.target.value })}
                                onKeyDown={handleKeyPress}
                                className="w-32 pl-8 text-sm"
                                data-testid={`input-price-${product.id}`}
                                placeholder="0.00"
                              />
                            </div>
                            <div className="flex items-center space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleSave}
                                disabled={updatePriceMutation.isPending}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                data-testid={`button-save-${product.id}`}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={updatePriceMutation.isPending}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                data-testid={`button-cancel-${product.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="text-lg font-semibold text-gray-900" data-testid={`text-price-${product.id}`}>
                              ${parseFloat(product.price.toString()).toFixed(2)}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartEdit(product)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={product.isActive ? "default" : "secondary"}
                          className={product.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {product.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/admin/products/${product.id}`, '_blank')}
                          className="flex items-center space-x-1"
                          data-testid={`button-view-${product.id}`}
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAndSortedProducts.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 
                      `No se encontraron productos que coincidan con "${searchTerm}"` :
                      "No hay productos registrados en el sistema"
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}