import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shirt, CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import CustomerLayout from "@/components/layout/customer-layout";
import { Link, useLocation } from "wouter";

export default function Checkout() {
  const { items, total, itemCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.16; // IVA 16%
  const finalTotal = total + shipping + tax;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        throw new Error("Debes iniciar sesión para realizar una compra");
      }

      const orderData = {
        order: {
          customerId: user?.id?.toString(),
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerPhone: formData.phone,
          status: "pending",
          subtotal: total.toString(),
          shipping: shipping.toString(),
          tax: tax.toString(),
          total: finalTotal.toString(),
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          notes: formData.notes,
        },
        items: items.map(item => ({
          productId: parseInt(item.id),
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price.toString(),
          totalPrice: (item.price * item.quantity).toString(),
          size: item.size,
          color: item.color,
          gender: "unisex", // default value, can be enhanced later
        })),
      };

      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: (order) => {
      clearCart();
      toast({
        title: "¡Pedido creado exitosamente!",
        description: `Tu pedido #${order.id} ha sido procesado. Te contactaremos pronto.`,
      });
      
      // Invalidate customer data cache to refresh dashboard
      queryClient.invalidateQueries({ queryKey: ['/api/customer/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/customer/stats'] });
      
      setLocation("/customer/orders");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al procesar el pedido",
        variant: "destructive",
      });
    },
  });

  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      const quoteData = {
        customerId: isAuthenticated ? user?.id : null,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        products: items.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        notes: formData.notes,
        urgency: 'normal', // Urgencia por defecto
      };

      return await apiRequest("POST", "/api/quotes/request", quoteData);
    },
    onSuccess: (response) => {
      clearCart();
      toast({
        title: "¡Presupuesto solicitado exitosamente!",
        description: `Tu solicitud de presupuesto #${response.quote.quoteNumber} ha sido enviada. Te contactaremos pronto con los detalles.`,
      });
      
      // Invalidate customer data cache to refresh dashboard
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['/api/customer/quotes'] });
        queryClient.invalidateQueries({ queryKey: ['/api/customer/stats'] });
      }
      
      setLocation(isAuthenticated ? "/customer/quotes" : "/store");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al crear la solicitud de presupuesto",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleOrder = () => {
    if (!validateForm()) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para realizar una compra",
        variant: "destructive",
      });
      return;
    }
    
    createOrderMutation.mutate();
  };

  const handleQuote = () => {
    if (!validateForm()) return;
    createQuoteMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Shirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-uniform-neutral-900 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-uniform-secondary mb-4">
              Agrega algunos productos para continuar con la compra
            </p>
            <Button asChild className="bg-uniform-primary hover:bg-blue-700">
              <Link href="/store/catalog">Explorar Productos</Link>
            </Button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/store/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al carrito
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-uniform-neutral-900">Finalizar Compra</h1>
          <p className="text-uniform-secondary">Completa tu información para procesar el pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de checkout */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Información personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dirección de envío */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Dirección de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Calle, número, colonia"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notas adicionales */}
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="notes">Comentarios o instrucciones especiales</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ej: Horario de entrega preferido, instrucciones especiales..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Shirt className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex items-center space-x-2">
                          {item.size && <Badge variant="secondary" className="text-xs">{item.size}</Badge>}
                          {item.color && <Badge variant="secondary" className="text-xs">{item.color}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} productos)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-uniform-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Garantías */}
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Envío gratis en compras mayores a $500</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Button
                    onClick={handleOrder}
                    className="w-full bg-uniform-primary hover:bg-blue-700"
                    size="lg"
                    disabled={createOrderMutation.isPending || createQuoteMutation.isPending}
                    data-testid="button-order"
                  >
                    {createOrderMutation.isPending ? "Procesando..." : "Realizar Pedido"}
                  </Button>

                  <Button
                    onClick={handleQuote}
                    variant="outline"
                    className="w-full border-uniform-primary text-uniform-primary hover:bg-uniform-primary hover:text-white"
                    size="lg"
                    disabled={createOrderMutation.isPending || createQuoteMutation.isPending}
                    data-testid="button-quote"
                  >
                    {createQuoteMutation.isPending ? "Enviando..." : "Solicitar Presupuesto"}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Al realizar el pedido o solicitar presupuesto, recibirás un email de confirmación y nos pondremos en contacto contigo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}