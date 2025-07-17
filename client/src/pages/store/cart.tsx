import { useState } from "react";
import StoreLayout from "@/components/layout/store-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart, updateCartItemQuantity, removeFromCart } from "@/lib/cart";
import { Link } from "wouter";

export default function Cart() {
  const { items, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");

  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.16; // 16% IVA
  const finalTotal = total + shipping + tax;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartItemQuantity(id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-uniform-secondary mb-6">
              Agrega algunos productos para comenzar tu compra
            </p>
            <Link href="/store/catalog">
              <Button className="bg-uniform-primary hover:bg-blue-700">
                Explorar Productos
              </Button>
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Carrito de Compras</h1>
            <p className="text-uniform-secondary mt-2">
              {itemCount} producto{itemCount !== 1 ? 's' : ''} en tu carrito
            </p>
          </div>
          <Link href="/store/catalog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-uniform-neutral-900">{item.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.size && (
                          <Badge variant="secondary">Talla: {item.size}</Badge>
                        )}
                        {item.color && (
                          <Badge variant="secondary">Color: {item.color}</Badge>
                        )}
                      </div>
                      <p className="text-uniform-secondary text-sm mt-1">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-uniform-neutral-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-uniform-secondary">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-uniform-secondary">Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="default" className="bg-uniform-accent">Gratis</Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-uniform-secondary">IVA (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                {total < 500 && (
                  <div className="text-sm text-uniform-secondary text-center p-3 bg-blue-50 rounded-lg">
                    Agrega ${(500 - total).toFixed(2)} más para envío gratis
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle>Código de Descuento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button className="w-full bg-uniform-primary hover:bg-blue-700 text-lg py-6">
              Proceder al Checkout
            </Button>

            {/* Security Badges */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-4 text-sm text-uniform-secondary">
                <span>🔒 Compra Segura</span>
                <span>📦 Envío Protegido</span>
              </div>
              <div className="text-xs text-uniform-secondary">
                Aceptamos tarjetas de crédito, débito y transferencias
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-uniform-neutral-900 mb-6">
            También te puede interesar
          </h2>
          <div className="text-center text-uniform-secondary py-8 border-2 border-dashed border-gray-200 rounded-lg">
            Productos recomendados aparecerán aquí
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
