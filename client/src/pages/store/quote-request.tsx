import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CustomerLayout from "@/components/layout/customer-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileText, Clock, User, Phone, Mail, Building, MapPin, Package, Trash2 } from "lucide-react";

// Customer info schema for guests
const customerInfoSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono requerido"),
  company: z.string().optional(),
});

// Quote request form schema
const quoteFormSchema = z.object({
  urgency: z.enum(["normal", "urgent", "very_urgent"]),
  notes: z.string().optional(),
  preferredDeliveryDate: z.string().optional(),
  // Customer info for guests
  customerInfo: customerInfoSchema.optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Import CartItem from the hook
import type { CartItem } from "@/lib/cart";

export default function QuoteRequestPage() {
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      urgency: "normal",
      notes: "",
      preferredDeliveryDate: "",
      customerInfo: isAuthenticated ? undefined : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
      },
    },
  });

  const quoteRequestMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const products = cartItems.map(item => ({
        productId: parseInt(item.id),
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
        notes: "",
      }));

      const requestData = {
        products,
        urgency: data.urgency,
        notes: data.notes,
        preferredDeliveryDate: data.preferredDeliveryDate,
        customerId: isAuthenticated ? user?.id : undefined,
        customerInfo: !isAuthenticated ? data.customerInfo : undefined,
      };

      return await apiRequest("POST", "/api/quotes/request", requestData);
    },
    onSuccess: (response) => {
      setIsSubmitted(true);
      clearCart();
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de presupuesto ha sido enviada exitosamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al enviar solicitud",
        description: error.message || "Ocurrió un error al enviar la solicitud",
        variant: "destructive",
      });
    },
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const onSubmit = (data: QuoteFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos al carrito antes de solicitar un presupuesto",
        variant: "destructive",
      });
      return;
    }
    quoteRequestMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">¡Solicitud Enviada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-gray-600">
                Tu solicitud de presupuesto ha sido enviada exitosamente. 
                Nos pondremos en contacto contigo en las próximas 24 horas.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/store/catalog">
                    Continuar comprando
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar Presupuesto</h1>
          <p className="text-gray-600">
            Obtén un presupuesto personalizado para tus productos seleccionados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Productos Seleccionados ({cartItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No hay productos en tu carrito
                  </p>
                  <Button asChild>
                    <Link href="/store/catalog">
                      Explorar productos
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{item.size}</Badge>
                          <Badge variant="secondary">{item.color}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Estimado:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quote Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Detalles de la Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Customer Info for guests */}
                  {!isAuthenticated && (
                    <div>
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <User className="h-5 w-5 mr-2" />
                        Tu Información
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="customerInfo.firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu nombre" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerInfo.lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Apellido *</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu apellido" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerInfo.email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                Email *
                              </FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="tu@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="customerInfo.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                Teléfono *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="123-456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="customerInfo.company"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              Empresa (opcional)
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de tu empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Separator className="my-6" />
                    </div>
                  )}

                  {/* Quote Details */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2" />
                      Detalles del Presupuesto
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgencia</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona la urgencia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="normal">Normal (5-7 días)</SelectItem>
                                <SelectItem value="urgent">Urgente (2-3 días)</SelectItem>
                                <SelectItem value="very_urgent">Muy urgente (24 horas)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredDeliveryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha preferida de entrega (opcional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notas adicionales (opcional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Especificaciones especiales, preguntas, o comentarios..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={quoteRequestMutation.isPending || cartItems.length === 0}
                      className="flex-1"
                    >
                      {quoteRequestMutation.isPending ? "Enviando..." : "Solicitar Presupuesto"}
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href="/store/catalog">Seguir comprando</Link>
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">¿Qué sucede después?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-uniform-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-uniform-primary font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Revisión</h4>
                  <p className="text-sm text-gray-600">
                    Revisamos tu solicitud y verificamos disponibilidad
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-uniform-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-uniform-primary font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Presupuesto</h4>
                  <p className="text-sm text-gray-600">
                    Te enviamos un presupuesto detallado por email
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-uniform-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-uniform-primary font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Contacto</h4>
                  <p className="text-sm text-gray-600">
                    Nos ponemos en contacto para finalizar detalles
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}