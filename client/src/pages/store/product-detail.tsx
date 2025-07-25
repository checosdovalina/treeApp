import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import StoreLayout from "@/components/layout/store-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/cart";
import type { Product, InventoryItem } from "../../lib/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id && !isNaN(Number(id)),
  });

  const { data: inventory = [] } = useQuery<InventoryItem[]>({
    queryKey: [`/api/products/${id}/inventory`],
    enabled: !!id && !isNaN(Number(id)),
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error('Product not found');
      return addToCart({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0] || '',
        size: selectedSize,
        color: selectedColor,
        quantity
      });
    },
    onSuccess: () => {
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado al carrito.",
      });
    },
  });

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
              Producto no encontrado
            </h3>
            <p className="text-uniform-secondary">
              El producto que buscas no existe o ha sido eliminado
            </p>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes?.length > 0) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor && product.colors?.length > 0) {
      toast({
        title: "Selecciona un color",
        description: "Por favor selecciona un color antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate();
  };

  const getStockForVariant = () => {
    if (!inventory || !selectedSize || !selectedColor) return 0;
    const variant = inventory.find((item) => 
      item.size === selectedSize && item.color === selectedColor
    );
    return variant?.quantity || 0;
  };

  const stock = getStockForVariant();
  const isInStock = stock > 0;

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-uniform-secondary">
            <li><a href="/store" className="hover:text-uniform-primary">Inicio</a></li>
            <li>/</li>
            <li><a href="/store/catalog" className="hover:text-uniform-primary">Catálogo</a></li>
            <li>/</li>
            <li className="text-uniform-neutral-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images?.length > 0 ? (
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
            
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-uniform-primary' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-uniform-neutral-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-uniform-secondary ml-2">(24 reseñas)</span>
                </div>
                <Badge variant="secondary">En stock</Badge>
              </div>
              <p className="text-3xl font-bold text-uniform-neutral-900 mb-4">
                ${product.price}
              </p>
            </div>

            {product.description && (
              <div>
                <p className="text-uniform-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Talla
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Color
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color: string) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                Cantidad
              </label>
              <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, stock || 10))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSize && selectedColor && (
                <p className="text-sm text-uniform-secondary mt-1">
                  {stock} unidades disponibles
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-uniform-primary hover:bg-blue-700"
                  onClick={handleAddToCart}
                  disabled={!isInStock || addToCartMutation.isPending}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addToCartMutation.isPending ? "Agregando..." : "Agregar al Carrito"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="outline" className="w-full">
                Comprar Ahora
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 text-uniform-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Envío Gratis</div>
                <div className="text-xs text-uniform-secondary">En pedidos +$500</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-uniform-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Garantía</div>
                <div className="text-xs text-uniform-secondary">6 meses</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 text-uniform-primary mx-auto mb-2" />
                <div className="text-sm font-medium">Devoluciones</div>
                <div className="text-xs text-uniform-secondary">30 días</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas (24)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <p>{product.description || "Descripción detallada del producto disponible próximamente."}</p>
                    <h4>Características principales:</h4>
                    <ul>
                      <li>Material de alta calidad</li>
                      <li>Diseño profesional y elegante</li>
                      <li>Fácil cuidado y mantenimiento</li>
                      <li>Disponible en múltiples tallas y colores</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Tallas disponibles</h4>
                      <p className="text-uniform-secondary">{product.sizes?.join(', ') || 'No especificadas'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Colores disponibles</h4>
                      <p className="text-uniform-secondary">{product.colors?.join(', ') || 'No especificados'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Material</h4>
                      <p className="text-uniform-secondary">Información disponible próximamente</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Cuidado</h4>
                      <p className="text-uniform-secondary">Lavado en máquina, agua fría</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-uniform-secondary py-8">
                    Las reseñas de clientes estarán disponibles próximamente
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StoreLayout>
  );
}
