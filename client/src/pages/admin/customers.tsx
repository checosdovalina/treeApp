import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Search, Mail, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCustomers() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // For now, we'll simulate customer data since we need to query users with role 'customer'
  // In a real app, this would be a proper API call to get customers
  const customers = [
    {
      id: "1",
      firstName: "María",
      lastName: "Contreras",
      email: "maria.contreras@empresa.com",
      role: "customer",
      createdAt: new Date().toISOString(),
      totalOrders: 5,
      totalSpent: "2,450.00"
    },
    {
      id: "2", 
      firstName: "Juan",
      lastName: "Rodríguez",
      email: "juan.rodriguez@corporativo.com",
      role: "customer",
      createdAt: new Date().toISOString(),
      totalOrders: 3,
      totalSpent: "1,890.00"
    },
    {
      id: "3",
      firstName: "Laura",
      lastName: "Fernández",
      email: "laura.fernandez@hotel.com",
      role: "customer", 
      createdAt: new Date().toISOString(),
      totalOrders: 8,
      totalSpent: "4,200.00"
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const filteredCustomers = customers?.filter((customer: any) => 
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const getCustomerTypeBadge = (totalSpent: string) => {
    const amount = parseFloat(totalSpent);
    if (amount >= 3000) {
      return <Badge variant="default" className="bg-yellow-500">VIP</Badge>;
    } else if (amount >= 1500) {
      return <Badge variant="default" className="bg-blue-500">Premium</Badge>;
    }
    return <Badge variant="secondary">Regular</Badge>;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-uniform-neutral-900">Gestión de Clientes</h1>
          <p className="text-uniform-secondary mt-2">Administra la base de datos de clientes</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-uniform-neutral-900 mb-2">
                  Buscar clientes
                </label>
                <div className="relative">
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-uniform-secondary h-4 w-4" />
                </div>
              </div>
              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  Exportar Lista
                </Button>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-uniform-primary hover:bg-blue-700">
                  Enviar Newsletter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">{customers.length}</div>
                <div className="text-sm text-uniform-secondary">Total Clientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {customers.filter(c => parseFloat(c.totalSpent) >= 3000).length}
                </div>
                <div className="text-sm text-uniform-secondary">Clientes VIP</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  ${customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0).toLocaleString()}
                </div>
                <div className="text-sm text-uniform-secondary">Ingresos Totales</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  ${(customers.reduce((sum, c) => sum + parseFloat(c.totalSpent), 0) / customers.length).toFixed(0)}
                </div>
                <div className="text-sm text-uniform-secondary">Ticket Promedio</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Clientes ({filteredCustomers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-uniform-secondary py-8">
                        No hay clientes que coincidan con la búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers?.map((customer: any) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 avatar-gradient-${(parseInt(customer.id) % 4) + 1}`}>
                              <span className="text-white font-medium">
                                {customer.firstName?.[0]}{customer.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                              <div className="text-sm text-uniform-secondary">ID: {customer.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{getCustomerTypeBadge(customer.totalSpent)}</TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell className="font-medium">${customer.totalSpent}</TableCell>
                        <TableCell className="text-uniform-secondary">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Customer Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Detalle del Cliente
              </DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center avatar-gradient-${(parseInt(selectedCustomer.id) % 4) + 1}`}>
                    <span className="text-white text-xl font-medium">
                      {selectedCustomer.firstName?.[0]}{selectedCustomer.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                    <p className="text-uniform-secondary">{selectedCustomer.email}</p>
                    {getCustomerTypeBadge(selectedCustomer.totalSpent)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Información Personal</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-uniform-secondary" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-uniform-secondary" />
                        <span>No especificado</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Estadísticas</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Total de pedidos:</span>
                        <span className="font-medium">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Total gastado:</span>
                        <span className="font-medium">${selectedCustomer.totalSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Promedio por pedido:</span>
                        <span className="font-medium">
                          ${(parseFloat(selectedCustomer.totalSpent) / selectedCustomer.totalOrders).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-uniform-secondary">Cliente desde:</span>
                        <span className="font-medium">
                          {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Pedidos Recientes</h3>
                  <div className="text-center text-uniform-secondary py-8">
                    Los pedidos del cliente aparecerían aquí
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    Ver Todos los Pedidos
                  </Button>
                  <Button className="bg-uniform-primary hover:bg-blue-700">
                    Enviar Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
