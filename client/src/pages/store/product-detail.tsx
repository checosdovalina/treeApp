import { useState, useMemo, useEffect } from "react";
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
import { useCart } from "@/lib/cart";
import ImageModal from "@/components/ui/image-modal";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { GenderSelector } from "@/components/ui/gender-selector";
import { ImageZoom } from "@/components/store/image-zoom";
import type { Product, InventoryItem } from "../../lib/types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id && !isNaN(Number(id)),
  });

  const { data: inventory = [] } = useQuery<InventoryItem[]>({
    queryKey: [`/api/products/${id}/inventory`],
    enabled: !!id && !isNaN(Number(id)),
  });

  // Obtener colores de la base de datos
  const { data: colors = [] } = useQuery<{id: number, name: string, hexCode: string}[]>({
    queryKey: ['/api/colors'],
  });

  // Obtener las tallas disponibles por género
  const { data: sizesData } = useQuery<{sizes: string[]}>({
    queryKey: [`/api/size-ranges/available-sizes?garmentTypeId=${product?.garmentTypeId}&gender=${selectedGender}`],
    enabled: !!selectedGender && !!product?.garmentTypeId,
  });

  // Obtener imágenes por color del producto
  const { data: colorImages = [] } = useQuery<{
    id: number;
    productId: number;
    colorId: number;
    images: string[];
    isPrimary: boolean;
    color?: { id: number; name: string; hexCode: string };
  }[]>({
    queryKey: [`/api/products/${id}/color-images`],
    enabled: !!id && !isNaN(Number(id)),
  });

  // Obtener las tallas filtradas por género seleccionado
  const availableSizesForGender = useMemo(() => {
    if (!selectedGender) return [];
    
    // Si tenemos datos de tallas específicas por género, usarlas
    if (sizesData?.sizes) {
      // Filtrar solo las tallas que están disponibles en el producto
      return sizesData.sizes.filter(size => product?.sizes?.includes(size));
    }
    
    // Fallback: mostrar todas las tallas del producto
    return product?.sizes || [];
  }, [product?.sizes, selectedGender, sizesData]);

  // Calcular las imágenes a mostrar basándose en el color seleccionado
  const displayImages = useMemo(() => {
    console.log('=== CALCULATING DISPLAY IMAGES ===');
    console.log('Selected color:', selectedColor);
    console.log('Available color images:', colorImages.length);
    console.log('Product images:', product?.images?.length);
    console.log('All colors available:', colors.map(c => ({id: c.id, name: c.name})));
    console.log('All color image sets:', colorImages.map(ci => ({colorId: ci.colorId, imageCount: ci.images.length})));
    
    // Si no hay color seleccionado, usar imágenes del producto
    if (!selectedColor) {
      console.log('No color selected - using product images');
      const productImages = product?.images || [];
      console.log('Product images to use:', productImages.length);
      return productImages;
    }

    // Buscar el color seleccionado en los colores disponibles
    const selectedColorObj = colors.find(c => c.name === selectedColor);
    console.log('Selected color object:', selectedColorObj);
    
    if (!selectedColorObj) {
      console.log('Color not found in database - using product images');
      return product?.images || [];
    }

    // DEBUGGING ESPECÍFICO PARA ROJO
    if (selectedColor === 'Rojo') {
      console.log('🔴 DEBUGGING ROJO ESPECÍFICAMENTE:');
      console.log('Rojo color object:', selectedColorObj);
      console.log('Looking for colorId:', selectedColorObj.id);
      console.log('Available colorImages:', colorImages);
      const rojoImageSet = colorImages.find(ci => ci.colorId === selectedColorObj.id);
      console.log('Rojo image set found:', rojoImageSet);
    }

    // Buscar las imágenes específicas para este color
    const colorImageSet = colorImages.find(ci => ci.colorId === selectedColorObj.id);
    console.log('Color image set for ID', selectedColorObj.id, ':', colorImageSet);
    
    if (colorImageSet && colorImageSet.images.length > 0) {
      console.log('Using color-specific images:', colorImageSet.images);
      console.log('================================');
      return [...colorImageSet.images]; // Crear nueva array para forzar re-render
    }

    // Fallback: usar imágenes del producto si no hay específicas para el color
    console.log('No specific images for color - using product images');
    const fallbackImages = product?.images || [];
    console.log('Fallback images:', fallbackImages.length);
    console.log('================================');
    return [...fallbackImages]; // Crear nueva array para forzar re-render
  }, [selectedColor, colorImages, colors, product?.images]);

  // Resetear el índice de imagen seleccionada cuando cambien las imágenes disponibles
  useEffect(() => {
    if (selectedImage >= displayImages.length) {
      setSelectedImage(0);
    }
  }, [displayImages, selectedImage]);

  // Debug: Verificar cuando cambie el color seleccionado
  useEffect(() => {
    console.log(`ProductDetail: selectedColor changed to "${selectedColor}"`);
    console.log(`ProductDetail: displayImages length:`, displayImages.length);
    console.log(`ProductDetail: product colors:`, product?.colors);
  }, [selectedColor, displayImages, product?.colors]);

  // Auto-seleccionar género si solo hay uno disponible
  useEffect(() => {
    if (product?.genders?.length === 1 && !selectedGender) {
      setSelectedGender(product.genders[0]);
    }
  }, [product?.genders, selectedGender]);

  // Resetear la talla seleccionada cuando cambie el género
  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setSelectedSize(""); // Resetear talla al cambiar género
  };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) throw new Error('Product not found');
      
      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
        image: getValidImageUrl(displayImages, 0),
      };
      
      console.log('Adding item to cart:', cartItem);
      addItem(cartItem);
      
      // Pequeña pausa para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return cartItem;
    },
    onSuccess: (item) => {
      console.log('Successfully added to cart:', item);
      toast({
        title: "Producto agregado",
        description: `${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito.`,
      });
    },
    onError: (error: Error) => {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
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
    if (!product) {
      toast({
        title: "Error",
        description: "Producto no encontrado.",
        variant: "destructive",
      });
      return;
    }
    
    // Validar talla si el producto tiene tallas disponibles
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    // Validar color si el producto tiene colores disponibles
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Por favor selecciona un color antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    // Validar género si hay múltiples géneros disponibles
    if (product.genders && product.genders.length > 1 && !selectedGender) {
      toast({
        title: "Selecciona un género",
        description: "Por favor selecciona un género antes de agregar al carrito.",
        variant: "destructive",
      });
      return;
    }

    console.log("Adding to cart with:", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      gender: selectedGender,
      quantity
    });

    addToCartMutation.mutate();
  };

  const getStockForVariant = () => {
    if (!inventory || !selectedSize || !selectedColor) return 100; // Asumir stock disponible
    const variant = inventory.find((item) => 
      item.size === selectedSize && item.color === selectedColor
    );
    return variant?.quantity || 100; // Fallback a stock disponible
  };

  const stock = getStockForVariant();
  // Siempre asumir que hay stock disponible para evitar bloqueos
  const isInStock = true;

  // Helper function to get valid image URL
  const getValidImageUrl = (images: string[], index: number = 0): string => {
    if (!images?.length) return '';
    const targetImage = images[index];
    if (targetImage?.startsWith('data:image/') || 
        (targetImage?.startsWith('http') && !targetImage.includes('example.com'))) {
      return targetImage;
    }
    // Buscar la primera imagen válida
    return images.find((img: string) => 
      img.startsWith('data:image/') || 
      (img.startsWith('http') && !img.includes('example.com'))
    ) || targetImage || '';
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4 product-detail-container">
            <div className="aspect-[3/4] sm:aspect-[4/5] md:aspect-square bg-white rounded-lg overflow-hidden product-detail-image border border-gray-200">
              {(() => {
                if (!displayImages?.length) {
                  return (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shirt className="h-24 w-24 text-gray-400" />
                    </div>
                  );
                }
                
                const validImage = getValidImageUrl(displayImages, selectedImage);
                
                return (
                  <ImageZoom
                    key={`main-image-${selectedColor}-${selectedImage}`}
                    src={validImage}
                    alt={product.name}
                    className="w-full h-full"
                  />
                );
              })()}
            </div>
            
            {displayImages?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image: string, index: number) => (
                  <button
                    key={`thumb-${selectedColor}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded border-2 overflow-hidden bg-white ${
                      selectedImage === index ? 'border-uniform-primary' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      key={`thumb-img-${selectedColor}-${index}`}
                      src={getValidImageUrl(displayImages, index)} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain sm:object-contain lg:object-cover cursor-zoom-in"
                      onDoubleClick={() => {
                        setSelectedImage(index);
                        setIsImageModalOpen(true);
                      }}
                      title="Doble clic para ampliar"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
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

            {/* Gender Selection - Mostrar SIEMPRE si hay géneros disponibles */}
            {product.genders?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Género
                </label>
                <GenderSelector
                  availableGenders={product.genders}
                  selectedGender={selectedGender}
                  onGenderChange={handleGenderChange}
                  variant="buttons"
                />
              </div>
            )}

            {/* Size Selection - Solo mostrar cuando hay género seleccionado */}
            {product.sizes?.length > 0 && selectedGender && (
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Talla {selectedGender && `(${selectedGender})`}
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una talla" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Mostrar tallas filtradas por género seleccionado */}
                    {availableSizesForGender.map((size: string) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedGender && availableSizesForGender.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {availableSizesForGender.length} tallas disponibles para {selectedGender}
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Color {selectedColor && `- ${selectedColor}`}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((colorName: string) => {
                    // Buscar el color en la base de datos
                    const colorData = colors.find(c => c.name === colorName);
                    const hexColor = colorData?.hexCode || '#CCCCCC';
                    const isSelected = selectedColor === colorName;
                    
                    return (
                      <button
                        key={colorName}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newColor = isSelected ? "" : colorName;
                          setSelectedColor(newColor);
                          setSelectedImage(0);
                        }}
                        className={`w-10 h-10 rounded-full border-4 transition-all duration-200 ${
                          isSelected
                            ? 'border-uniform-primary ring-2 ring-blue-200 scale-110' 
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                        }`}
                        style={{ backgroundColor: hexColor }}
                        title={colorName}
                      />
                    );
                  })}
                </div>
                {/* Debug info para verificar el estado */}
                {selectedColor && (
                  <p className="text-xs text-gray-500 mt-2">
                    Color seleccionado: {selectedColor} | Imágenes: {displayImages.length}
                  </p>
                )}

              </div>
            )}



            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                Cantidad
              </label>
              <div className="flex items-center space-x-4">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                />
                {selectedSize && selectedColor && (
                  <p className="text-sm text-uniform-secondary">
                    En stock disponible
                  </p>
                )}
              </div>
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
                      <div className="flex flex-wrap gap-2">
                        {product.colors?.map((color: string, index: number) => {
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
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: hexColor }}
                                title={color}
                              />
                              <span className="text-sm text-uniform-secondary">{color}</span>
                            </div>
                          );
                        })}
                      </div>
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

      {/* Image Modal */}
      <ImageModal
        src={getValidImageUrl(displayImages, selectedImage)}
        alt={product.name}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </StoreLayout>
  );
}
