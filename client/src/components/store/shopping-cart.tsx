import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string;
  product: {
    id: number;
    name: string;
    sku: string;
    price: string;
    images: string[];
  };
  size?: {
    id: number;
    name: string;
  };
  color?: {
    id: number;
    name: string;
    hexCode: string;
  };
}

interface CartData {
  cart: {
    id: number;
    userId: number;
  };
  items: CartItem[];
}

export function ShoppingCartDrawer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery<CartData>({
    queryKey: ['/api/cart'],
    retry: false,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      return await apiRequest(`/api/cart/item/${itemId}`, 'PUT', { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await apiRequest(`/api/cart/item/${itemId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Producto eliminado",
        description: "El producto fue eliminado del carrito",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/cart/clear', 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Carrito vaciado",
        description: "Se eliminaron todos los productos del carrito",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive",
      });
    }
  });

  const items = cartData?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (parseFloat(item.unitPrice) * item.quantity), 0);

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCartMutation.mutate();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
          data-testid="button-open-cart"
        >
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              data-testid="badge-cart-count"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? 'Tu carrito está vacío' : `${itemCount} producto${itemCount > 1 ? 's' : ''} en el carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No tienes productos en tu carrito</p>
              <Button variant="outline" onClick={() => window.location.href = '/store'}>
                Explorar Productos
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product.images[0] ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate" data-testid={`text-product-name-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500">SKU: {item.product.sku}</p>
                        
                        {(item.size || item.color) && (
                          <div className="flex gap-2 mt-1">
                            {item.size && (
                              <Badge variant="secondary" className="text-xs">
                                {item.size.name}
                              </Badge>
                            )}
                            {item.color && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs flex items-center gap-1"
                              >
                                <div 
                                  className="w-2 h-2 rounded-full border"
                                  style={{ backgroundColor: item.color.hexCode }}
                                />
                                {item.color.name}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              data-testid={`button-decrease-quantity-${item.id}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-medium px-2" data-testid={`text-quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                              data-testid={`button-increase-quantity-${item.id}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeItemMutation.isPending}
                            data-testid={`button-remove-item-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            ${parseFloat(item.unitPrice).toFixed(2)} c/u
                          </span>
                          <span className="font-medium" data-testid={`text-item-total-${item.id}`}>
                            ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-blue-600" data-testid="text-cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-proceed-checkout"
                  >
                    Proceder al Pago
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClearCart}
                    disabled={clearCartMutation.isPending}
                    data-testid="button-clear-cart"
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cartData } = useQuery<CartData>({
    queryKey: ['/api/cart'],
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: {
      productId: number;
      sizeId?: number;
      colorId?: number;
      quantity: number;
      unitPrice: string;
    }) => {
      return await apiRequest('/api/cart/add', 'POST', item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const itemCount = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return {
    itemCount,
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
}