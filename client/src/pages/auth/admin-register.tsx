import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Building, User, Mail, Lock, AlertCircle } from "lucide-react";

// import treeLogo from "@assets/TREE LOGO_1753399074765.png";
const treeLogo = "/tree-logo.png";

export default function AdminRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    role: "admin" as const,
    adminCode: ""
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/auth/register-admin", data);
    },
    onSuccess: () => {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta de administrador ha sido creada. Ya puedes iniciar sesión.",
      });
      setLocation("/api/login");
    },
    onError: (error: any) => {
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo crear la cuenta. Verifica los datos e intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!formData.adminCode || formData.adminCode !== "TREE2024ADMIN") {
      toast({
        title: "Error",
        description: "Código de administrador inválido",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-uniform-blue to-uniform-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={treeLogo} 
            alt="TREE Uniformes & Kodiak Industrial"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">TREE UNIFORMES</h1>
          <p className="text-uniform-gold font-medium">Panel de Administración</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center">
            <div className="w-12 h-12 bg-uniform-primary rounded-full flex items-center justify-center mx-auto">
              <Building className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-uniform-primary">Registro de Administrador</CardTitle>
            <CardDescription>
              Crea tu cuenta de administrador para gestionar la plataforma
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Código de Admin */}
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="text-sm font-medium">
                  Código de Administrador *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="Ingresa el código de administrador"
                    value={formData.adminCode}
                    onChange={(e) => handleInputChange("adminCode", e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-admin-code"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Contacta al administrador principal para obtener este código
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">Nombre *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Apellido</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>

              {/* Información de seguridad */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Las cuentas de administrador tienen acceso completo al sistema. 
                  Asegúrate de usar una contraseña segura y mantener tus credenciales protegidas.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-uniform-primary hover:bg-uniform-primary/90"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  "Crear Cuenta de Administrador"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Button variant="link" className="p-0 h-auto text-uniform-primary" asChild>
                  <Link href="/api/login" data-testid="link-login">
                    Iniciar Sesión
                  </Link>
                </Button>
              </p>
              <p className="text-sm text-gray-600">
                <Button variant="link" className="p-0 h-auto text-uniform-primary" asChild>
                  <Link href="/" data-testid="link-store">
                    Volver a la Tienda
                  </Link>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}