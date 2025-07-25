import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Shirt } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addToCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import ImageModal from "@/components/ui/image-modal";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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

  return (
    <Link href={`/store/product/${product.id}`}>
      <Card 
        className="overflow-hidden hover:shadow-md transition-all duration-300 product-card-hover cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                onDoubleClick={handleImageDoubleClick}
                title="Doble clic para ampliar"
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
            
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-sm text-uniform-secondary">Colores:</span>
                <div className="flex space-x-1">
                  {product.colors.slice(0, 3).map((color, index) => {
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
                  {product.colors.length > 3 && (
                    <span className="text-xs text-uniform-secondary ml-1">
                      +{product.colors.length - 3}
                    </span>
                  )}
                </div>
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
        src={product.images?.[0] || ''}
        alt={product.name}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </Link>
  );
}
