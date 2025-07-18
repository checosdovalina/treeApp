import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, ArrowRight, Building, User } from "lucide-react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("customer");

  // Redirect authenticated users
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/store');
    }
    return null;
  }

  const handleReplicAuth = () => {
    window.location.href = '/api/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uniform-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-uniform-primary rounded-full p-3">
              <Building className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-uniform-neutral-900 mb-2">
            Uniformes Laguna
          </h1>
          <p className="text-gray-600">
            Bienvenido a nuestra plataforma de uniformes
          </p>
        </div>

        {/* Main Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-uniform-neutral-900">
              Iniciar Sesión
            </CardTitle>
            <p className="text-sm text-gray-600">
              Selecciona el tipo de cuenta que deseas acceder
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Account Type Selector */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="customer" 
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Administrador
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="space-y-4">
                <div className="text-center py-4">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Portal de Clientes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Accede a tu cuenta de cliente para explorar productos, realizar pedidos y gestionar tu perfil
                  </p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-600" />
                      Catálogo completo de uniformes
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-600" />
                      Carrito de compras personalizado
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-600" />
                      Historial de pedidos
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-600" />
                      Solicitar cotizaciones
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleReplicAuth}
                  className="w-full bg-uniform-primary hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Iniciar Sesión como Cliente
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="text-center py-4">
                  <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Panel de Administración
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Acceso completo para gestionar productos, pedidos, clientes y reportes del negocio
                  </p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                      Gestión de productos e inventario
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                      Procesamiento de pedidos
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                      Generación de cotizaciones
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                      Reportes de ventas y analytics
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Acceso Restringido:</strong> Solo usuarios con permisos de administrador pueden acceder a esta sección.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleReplicAuth}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  Iniciar Sesión como Administrador
                </Button>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Additional Info */}
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">
                ¿No tienes una cuenta? El acceso se asignará automáticamente al registrarte
              </p>
              <p>
                <strong>Nota:</strong> Las cuentas de administrador requieren autorización especial
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Uniformes Laguna. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}