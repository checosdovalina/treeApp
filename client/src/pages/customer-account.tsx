import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, ShoppingBag, CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    unitPrice: string;
    size?: string;
    color?: string;
  }>;
}

export default function CustomerAccount() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders/my-orders'],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
            <p className="text-gray-600 mb-4">
              Necesitas iniciar sesión para ver tu cuenta
            </p>
            <Link href="/store">
              <Button className="w-full">
                Ir a la Tienda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800", 
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };

    const statusLabels = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado"
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/store">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la Tienda
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-gray-900">{user?.firstName || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Apellido</label>
                  <p className="text-gray-900">{user?.lastName || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Usuario</label>
                  <p className="text-gray-900">{user?.username || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de cuenta</label>
                  <Badge variant="outline" className="mt-1">
                    {user?.role === 'admin' ? 'Administrador' : 
                     user?.role === 'premium' ? 'Premium' :
                     user?.role === 'regular' ? 'Regular' : 'Básica'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Historial de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tienes pedidos aún
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Cuando hagas tu primer pedido, aparecerá aquí
                    </p>
                    <Link href="/store">
                      <Button>
                        Explorar Productos
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                Pedido #{order.orderNumber}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold text-blue-600 mt-1">
                                ${parseFloat(order.total).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700">
                              Productos ({order.items?.length || 0})
                            </h5>
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex-1">
                                  <span className="text-gray-900">{item.productName}</span>
                                  {(item.size || item.color) && (
                                    <div className="text-gray-500 text-xs">
                                      {item.size && `Talla: ${item.size}`}
                                      {item.size && item.color && ' • '}
                                      {item.color && `Color: ${item.color}`}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="text-gray-700">
                                    {item.quantity} x ${parseFloat(item.unitPrice).toFixed(2)}
                                  </span>
                                  <div className="text-gray-900 font-medium">
                                    ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total del pedido:</span>
                              <span className="font-bold text-gray-900">
                                ${parseFloat(order.total).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}