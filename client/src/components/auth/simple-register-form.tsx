import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SimpleRegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function SimpleRegisterForm({ onSuccess, onSwitchToLogin }: SimpleRegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      // Use XMLHttpRequest for consistency
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/register', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;

      const registerPromise = new Promise<any>((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 201) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (parseError) {
                reject(new Error('Respuesta del servidor inválida'));
              }
            } else {
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                reject(new Error(errorResponse.message || 'Error de registro'));
              } catch {
                reject(new Error('Error de registro'));
              }
            }
          }
        };

        xhr.onerror = function() {
          reject(new Error('Error de conexión'));
        };
      });

      xhr.send(JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      }));

      const response = await registerPromise;

      console.log("Registration successful:", response);

      // Redirect to store (new users get basic role)
      window.location.href = '/store';

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Error de registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Tu nombre"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Tu apellido"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          placeholder="Nombre de usuario"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="tu@email.com"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          placeholder="Mínimo 6 caracteres"
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          placeholder="Repite tu contraseña"
          required
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </Button>

      {onSwitchToLogin && (
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-uniform-blue hover:underline"
            disabled={isLoading}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </button>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Beneficios de registrarse:</strong>
        </p>
        <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1">
          <li>• Acceso a descuentos por volumen</li>
          <li>• Historial de pedidos</li>
          <li>• Cotizaciones personalizadas</li>
          <li>• Soporte prioritario</li>
        </ul>
      </div>
    </form>
  );
}