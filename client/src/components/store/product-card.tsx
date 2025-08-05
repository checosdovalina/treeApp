import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Shirt } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import ImageModal from "@/components/ui/image-modal";
import { ImageZoom } from "@/components/store/image-zoom";
import { getValidImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description?: string;
    price: string;
    images?: string[];
    isActive: boolean;
    salesCount?: number;
    colors?: string[];
    sizes?: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Obtener colores de la base de datos
  const { data: colors = [] } = useQuery<{id: number, name: string, hexCode: string}[]>({
    queryKey: ['/api/colors'],
  });

  // Obtener imágenes por color para este producto
  const { data: colorImages = [] } = useQuery<{
    id: number;
    productId: number;
    colorId: number;
    images: string[];
    isPrimary: boolean;
    sortOrder: number;
  }[]>({
    queryKey: [`/api/products/${product.id}/color-images`],
    enabled: !!product.id,
  });

  // Calcular colores disponibles basándose en las asignaciones de colores
  const availableColors = useMemo(() => {
    if (!colorImages.length) return [];
    
    return colorImages.map(colorImage => {
      const color = colors.find(c => c.id === colorImage.colorId);
      return color;
    }).filter(Boolean);
  }, [colorImages, colors]);

  // Calcular las imágenes a mostrar basándose en el color seleccionado
  const displayImages = useMemo(() => {
    if (!selectedColor) {
      // Si no hay color seleccionado, usar imágenes del producto o las primeras del color
      if (colorImages.length > 0) {
        return colorImages[0].images;
      }
      return product?.images || [];
    }

    // Buscar el color seleccionado en los colores disponibles
    const selectedColorObj = colors.find(c => c.name === selectedColor);
    if (!selectedColorObj) {
      return product?.images || [];
    }

    // Buscar las imágenes específicas para este color
    const colorImageSet = colorImages.find(ci => ci.colorId === selectedColorObj.id);
    if (colorImageSet && colorImageSet.images.length > 0) {
      return colorImageSet.images;
    }

    // Fallback: usar imágenes del producto si no hay específicas para el color
    return product?.images || [];
  }, [selectedColor, colorImages, colors, product?.images]);

  // Debug: Verificar cuando cambie el color seleccionado
  useEffect(() => {
    if (selectedColor) {
      console.log(`ProductCard ${product.id}: Color seleccionado cambió a "${selectedColor}"`);
      console.log(`ProductCard ${product.id}: Imágenes para mostrar:`, displayImages.length);
    }
  }, [selectedColor, displayImages, product.id]);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return addToCart({
        id: product.id.toString(),
        name: product.name,
        price: parseFloat(product.price),
        image: product.images?.[0] || '',
        quantity: 1
      });
    },
    onSuccess: () => {
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado al carrito.",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: `${product.name} ${isFavorite ? 'eliminado de' : 'agregado a'} tu lista de favoritos.`,
    });
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir navegación si se hace clic en botones
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    e.preventDefault();
    setLocation(`/store/product/${product.id}`);
  };

  return (
    <div>
      <Card 
        className="overflow-hidden hover:shadow-md transition-all duration-300 product-card-hover cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="relative">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            {displayImages && displayImages.length > 0 ? (
              <ImageZoom
                src={getValidImageUrl(displayImages, 0)} 
                alt={product.name}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Shirt className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3">
            {product.salesCount && product.salesCount > 0 && (
              <Badge className="bg-uniform-accent text-white">
                Más vendido
              </Badge>
            )}
          </div>

          {/* Action Buttons - Show on hover */}
          <div className={`absolute top-3 right-3 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-uniform-neutral-900 mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-sm text-uniform-secondary mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className="text-xl font-bold text-uniform-neutral-900">
              ${product.price}
            </span>
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <span className="text-xs text-uniform-secondary">(24)</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {product.sizes && product.sizes.length > 0 && (
              <div className="text-sm text-uniform-secondary">
                <span>Tallas: {product.sizes.slice(0, 4).join(', ')}</span>
                {product.sizes.length > 4 && <span> +{product.sizes.length - 4}</span>}
              </div>
            )}
            
            {availableColors && availableColors.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-uniform-secondary">Colores:</span>
                <div className="flex flex-wrap gap-1">
                  {availableColors.map((color, index) => {
                    if (!color) return null;
                    
                    const hexColor = color.hexCode || '#CCCCCC';
                    const isSelected = selectedColor === color.name;
                    
                    return (
                      <button
                        key={color.id}
                        className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'border-uniform-primary shadow-md scale-110' 
                            : 'border-gray-300 hover:border-uniform-primary'
                        }`}
                        style={{ backgroundColor: hexColor }}
                        title={color.name}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const newColor = isSelected ? "" : color.name;
                          setSelectedColor(newColor);
                        }}
                      />
                    );
                  })}
                </div>
                {/* Debug info */}
                {selectedColor && (
                  <p className="text-xs text-gray-500">
                    Seleccionado: {selectedColor} | Imágenes: {displayImages.length}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button 
            className="w-full bg-uniform-primary hover:bg-blue-700"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {addToCartMutation.isPending ? "Agregando..." : "Agregar al Carrito"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Image Modal */}
      <ImageModal
        src={getValidImageUrl(displayImages, 0)}
        alt={product.name}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
