import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Package,
  Phone,
  MessageCircle
} from "lucide-react";

export default function CartPage() {
  const { items, getTotalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const total = getTotalPrice();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: number, size: string, color: string, newQuantity: number, gender?: string) => {
    if (newQuantity < 1) {
      removeItem(productId, size, color, gender);
    } else {
      updateQuantity(productId, size, color, newQuantity, gender);
    }
  };

  const handleCheckout = async () => {
    if (!items.length) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de proceder al checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Pedido procesado",
        description: "Tu pedido ha sido enviado. Te contactaremos pronto.",
      });
      
      clearCart();
      window.location.href = "/customer/orders";
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const orderDetails = items.map(item => 
      `• ${item.productName} (${item.size}, ${item.color}) - Cantidad: ${item.quantity} - $${item.price * item.quantity}`
    ).join('\n');
    
    const message = `Hola, me gustaría hacer el siguiente pedido:

${orderDetails}

Total: $${total.toFixed(2)}

Gracias.`;
    
    const whatsappUrl = `https://wa.me/5218711047637?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-8">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Explora nuestro catálogo y encuentra los uniformes perfectos para ti
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = "/store"}
                  className="bg-uniform-primary hover:bg-blue-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continuar Comprando
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/customer/quotes"}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Solicitar Cotización
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
              <p className="text-gray-600 mt-2">
                Revisa tus productos antes de confirmar el pedido
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "/store"}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Seguir Comprando
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Productos ({items.length})</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Limpiar carrito
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}-${item.color}-${item.gender}`} className="flex items-center space-x-4 p-4 border rounded-lg">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.productName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-8 w-8 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-600">
                              Talla: {item.size}
                            </span>
                            <span className="text-sm text-gray-600">
                              Color: {item.color}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            ${item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1, item.gender)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, item.size, item.color, parseInt(e.target.value) || 1, item.gender)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1, item.gender)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId, item.size, item.color, item.gender)}
                            className="text-red-600 hover:text-red-700 mt-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>Por calcular</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (16%)</span>
                    <span>${(total * 0.16).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(total * 1.16).toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-uniform-primary hover:bg-blue-700"
                    >
                      {isCheckingOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceder al Pago
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleWhatsAppOrder}
                      className="w-full"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Ordenar por WhatsApp
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center pt-4">
                    <p>
                      Al proceder al pago, aceptas nuestros términos y condiciones.
                    </p>
                    <p className="mt-2">
                      <strong>Nota:</strong> Los pedidos se procesan manualmente y te contactaremos
                      para confirmar detalles y forma de pago.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              {user && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nombre:</span>
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}