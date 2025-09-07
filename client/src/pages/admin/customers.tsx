import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, Search, Mail, Phone, Edit, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCustomers() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<any>(null);
  const queryClient = useQueryClient();

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

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
    retry: false,
  });

  // Fetch companies for assignment
  const { data: companies = [] } = useQuery({
    queryKey: ["/api/companies"],
    retry: false,
  });

  // Form schema for company assignment
  const companyAssignmentSchema = z.object({
    companyId: z.number().nullable().optional(),
  });

  const form = useForm<z.infer<typeof companyAssignmentSchema>>({
    resolver: zodResolver(companyAssignmentSchema),
    defaultValues: {
      companyId: null,
    },
  });

  // Mutation for updating customer company
  const updateCustomerCompanyMutation = useMutation({
    mutationFn: async ({ customerId, companyId }: { customerId: number; companyId: number | null }) => {
      return await apiRequest(`/api/customers/${customerId}/company`, {
        method: 'PATCH',
        body: JSON.stringify({ companyId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setIsEditCompanyOpen(false);
      setCustomerToEdit(null);
      toast({
        title: "Éxito",
        description: "Empresa asignada correctamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al asignar empresa",
        variant: "destructive",
      });
    },
  });

  if (isLoading || customersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const filteredCustomers = customers?.filter((customer: any) => 
    `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleEditCompany = (customer: any) => {
    setCustomerToEdit(customer);
    // Set current company if exists
    const currentCompanyId = customer.companyId || null;
    form.reset({ companyId: currentCompanyId });
    setIsEditCompanyOpen(true);
  };

  const handleCompanyAssignment = (data: z.infer<typeof companyAssignmentSchema>) => {
    if (customerToEdit) {
      updateCustomerCompanyMutation.mutate({
        customerId: customerToEdit.id,
        companyId: data.companyId || null,
      });
    }
  };

  const getCustomerTypeBadge = (customer: any) => {
    if (!customer || customer.isActive === false) {
      return <Badge variant="secondary" className="bg-gray-500">Inactivo</Badge>;
    }
    if (customer.company) {
      return <Badge variant="default" className="bg-blue-500">Corporativo</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Individual</Badge>;
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
                <div className="text-2xl font-bold text-uniform-neutral-900">{customers?.length || 0}</div>
                <div className="text-sm text-uniform-secondary">Total Clientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {customers?.filter((c: any) => c && c.isActive !== false).length || 0}
                </div>
                <div className="text-sm text-uniform-secondary">Clientes Activos</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {customers?.filter((c: any) => c && c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length || 0}
                </div>
                <div className="text-sm text-uniform-secondary">Nuevos (30 días)</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-uniform-neutral-900">
                  {customers?.filter((c: any) => c && c.companyName).length || 0}
                </div>
                <div className="text-sm text-uniform-secondary">Con Empresa</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Clientes ({filteredCustomers.length})
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
                    <TableHead>Empresa</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-uniform-secondary py-8">
                        No hay clientes que coincidan con la búsqueda
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer: any) => (
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
                        <TableCell>{getCustomerTypeBadge(customer)}</TableCell>
                        <TableCell>
                          {customer.companyName ? (
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-uniform-secondary" />
                              <span>{customer.companyName}</span>
                            </div>
                          ) : (
                            <span className="text-uniform-secondary">Sin empresa</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{customer.phone || 'N/A'}</TableCell>
                        <TableCell className="text-uniform-secondary">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCompany(customer)}
                              title="Asignar empresa"
                            >
                              <Building2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Enviar email"
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

        {/* Edit Company Modal */}
        <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Empresa</DialogTitle>
              <DialogDescription>
                Selecciona una empresa para asignar al cliente {customerToEdit?.firstName} {customerToEdit?.lastName}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCompanyAssignment)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? field.value.toString() : "none"}
                          onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una empresa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sin empresa asignada</SelectItem>
                            {companies.map((company: any) => (
                              <SelectItem key={company.id} value={company.id.toString()}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditCompanyOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateCustomerCompanyMutation.isPending}
                  >
                    {updateCustomerCompanyMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
