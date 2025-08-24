import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "./shopping-cart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  images: string[];
  sizes: string[];
  colors: string[];
}

interface Size {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
  hexCode: string;
}

interface AddToCartButtonProps {
  product: Product;
  sizes?: Size[];
  colors?: Color[];
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function AddToCartButton({ 
  product, 
  sizes = [], 
  colors = [], 
  className = "",
  variant = "default",
  size = "default"
}: AddToCartButtonProps) {
  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);

  const needsVariantSelection = sizes.length > 0 || colors.length > 0;

  const handleDirectAddToCart = () => {
    if (needsVariantSelection) {
      setIsOpen(true);
      return;
    }

    addToCart({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
    }, {
      onSuccess: () => {
        toast({
          title: "Producto agregado",
          description: `${product.name} se agregó al carrito`,
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo agregar el producto al carrito",
          variant: "destructive",
        });
      }
    });
  };

  const handleAddToCartWithVariants = () => {
    // Validate required selections
    if (sizes.length > 0 && !selectedSize) {
      toast({
        title: "Selecciona una talla",
        description: "Por favor selecciona una talla antes de agregar al carrito",
        variant: "destructive",
      });
      return;
    }

    if (colors.length > 0 && !selectedColor) {
      toast({
        title: "Selecciona un color",
        description: "Por favor selecciona un color antes de agregar al carrito",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      sizeId: selectedSize?.id,
      colorId: selectedColor?.id,
      quantity,
      unitPrice: product.price,
    }, {
      onSuccess: () => {
        toast({
          title: "Producto agregado",
          description: `${product.name} se agregó al carrito`,
        });
        setIsOpen(false);
        // Reset selections
        setSelectedSize(null);
        setSelectedColor(null);
        setQuantity(1);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo agregar el producto al carrito",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={className}
        onClick={handleDirectAddToCart}
        disabled={isAddingToCart}
        data-testid={`button-add-to-cart-${product.id}`}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {needsVariantSelection ? "Seleccionar" : "Agregar al Carrito"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar al Carrito</DialogTitle>
            <DialogDescription>
              Selecciona las opciones para {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Talla</Label>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((sizeOption) => (
                    <Button
                      key={sizeOption.id}
                      variant={selectedSize?.id === sizeOption.id ? "default" : "outline"}
                      size="sm"
                      className="h-10"
                      onClick={() => setSelectedSize(sizeOption)}
                      data-testid={`button-select-size-${sizeOption.id}`}
                    >
                      {sizeOption.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Color</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((colorOption) => (
                    <Button
                      key={colorOption.id}
                      variant={selectedColor?.id === colorOption.id ? "default" : "outline"}
                      size="sm"
                      className="h-12 flex items-center gap-2"
                      onClick={() => setSelectedColor(colorOption)}
                      data-testid={`button-select-color-${colorOption.id}`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: colorOption.hexCode }}
                      />
                      <span className="text-xs">{colorOption.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-lg font-medium w-12 text-center" data-testid="text-quantity">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold text-blue-600" data-testid="text-total">
                ${(parseFloat(product.price) * quantity).toFixed(2)}
              </span>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddToCartWithVariants}
                disabled={isAddingToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                data-testid="button-confirm-add-to-cart"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}