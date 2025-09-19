import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, Package, Users, Store, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardSimple() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  const { data: unreadMessagesCount, isLoading: unreadMessagesLoading } = useQuery({
    queryKey: ['/api/contact-messages/unread-count'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const { data: recentContactMessages, isLoading: contactMessagesLoading } = useQuery({
    queryKey: ['/api/contact-messages'],
    enabled: isAuthenticated && user?.role === 'admin',
    retry: false,
  });

  const getMessageStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <Badge variant="outline">Leído</Badge>
    ) : (
      <Badge variant="default">Nuevo</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No tienes permisos para acceder a esta página.</p>
            <Button 
              onClick={() => window.location.href = '/auth/login'} 
              className="mt-4 w-full"
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-uniform-neutral-900">Dashboard Administrativo</h1>
            <p className="text-uniform-secondary mt-2">Bienvenido, {user.firstName} {user.lastName}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => window.open('/store', '_blank')}
              className="bg-uniform-primary hover:bg-uniform-darker text-white flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Ver Tienda
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-uniform-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Sistema en desarrollo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-uniform-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Nuevos pedidos hoy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-uniform-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Varios</div>
              <p className="text-xs text-muted-foreground">Productos disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <Users className="h-4 w-4 text-uniform-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1+</div>
              <p className="text-xs text-muted-foreground">Usuario administrador activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes de Contacto</CardTitle>
              <Mail className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unreadMessagesLoading ? "0" : String((unreadMessagesCount as any)?.count || 0)}
              </div>
              <p className="text-xs text-muted-foreground">nuevos sin leer</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Administra tu catálogo de uniformes</p>
              <Button 
                onClick={() => window.location.href = '/admin/products'}
                className="w-full"
              >
                Ver Productos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos y Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Revisa pedidos y genera reportes</p>
              <Button 
                onClick={() => window.location.href = '/admin/orders'}
                className="w-full"
              >
                Ver Pedidos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Gestiona cotizaciones de clientes</p>
              <Button 
                onClick={() => window.location.href = '/admin/quotes'}
                className="w-full"
              >
                Ver Cotizaciones
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Messages */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mensajes de Contacto Recientes</CardTitle>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {contactMessagesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-uniform-secondary">Cargando mensajes...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Remitente</TableHead>
                      <TableHead>Asunto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(!recentContactMessages || (recentContactMessages as any)?.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-uniform-secondary py-8">
                          No hay mensajes de contacto
                        </TableCell>
                      </TableRow>
                    ) : (
                      (recentContactMessages as any)?.slice(0, 5).map((message: any) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <Mail className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-uniform-neutral-900">{message.name}</p>
                                <p className="text-sm text-uniform-secondary">{message.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-uniform-neutral-900 truncate max-w-48">
                              {message.subject}
                            </p>
                            <p className="text-sm text-uniform-secondary truncate max-w-48">
                              {message.message}
                            </p>
                          </TableCell>
                          <TableCell>{getMessageStatusBadge(message.isRead)}</TableCell>
                          <TableCell className="text-uniform-secondary">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // TODO: Implementar función para marcar como leído/responder
                                toast({
                                  title: "Función próximamente",
                                  description: "La función de respuesta estará disponible pronto.",
                                });
                              }}
                              data-testid={`button-respond-${message.id}`}
                            >
                              {message.isRead ? "Responder" : "Marcar leído"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}