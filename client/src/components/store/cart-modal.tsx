import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Minus, Trash2, ShoppingBag, Shirt } from "lucide-react";
import { useCart } from "@/lib/cart";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Link } from "wouter";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const shipping = total > 500 ? 0 : 50;
  const finalTotal = total + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    onClose();
    // Navigate to checkout - this would be implemented based on your routing
    window.location.href = '/store/checkout';
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-uniform-neutral-900">
              Carrito de Compras
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-uniform-secondary mt-1">
            {itemCount} producto{itemCount !== 1 ? 's' : ''}
          </p>
        </DialogHeader>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-uniform-secondary mb-4">
                Agrega algunos productos para comenzar
              </p>
              <Button
                onClick={handleContinueShopping}
                className="bg-uniform-primary hover:bg-blue-700"
              >
                Explorar Productos
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-neutral-200 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Shirt className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-uniform-neutral-900 text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.size && (
                          <Badge variant="secondary" className="text-xs">
                            {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="secondary" className="text-xs">
                            {item.color}
                          </Badge>
                        )}

                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}
                          min={1}
                          max={99}
                          className="scale-75"
                        />
                        <span className="text-sm font-semibold text-uniform-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 border-t border-neutral-200">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-uniform-secondary">Subtotal:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-uniform-secondary">Envío:</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <Badge variant="default" className="bg-uniform-accent text-xs">
                          Gratis
                        </Badge>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold text-uniform-primary">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {total < 500 && (
                  <div className="text-xs text-uniform-secondary text-center p-2 bg-blue-50 rounded-lg">
                    Agrega ${(500 - total).toFixed(2)} más para envío gratis
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-uniform-primary hover:bg-blue-700"
                    onClick={handleCheckout}
                  >
                    Proceder al Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleContinueShopping}
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
