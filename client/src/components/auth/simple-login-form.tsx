import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface SimpleLoginFormProps {
  onSuccess?: () => void;
}

export default function SimpleLoginForm({ onSuccess }: SimpleLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use XMLHttpRequest instead of fetch to avoid any conflicts
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/login', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;

      const loginPromise = new Promise<any>((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (parseError) {
                reject(new Error('Respuesta del servidor inválida'));
              }
            } else {
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                reject(new Error(errorResponse.message || 'Error de autenticación'));
              } catch {
                reject(new Error('Error de autenticación'));
              }
            }
          }
        };

        xhr.onerror = function() {
          reject(new Error('Error de conexión'));
        };
      });

      xhr.send(JSON.stringify({ username, password }));
      const response = await loginPromise;

      console.log("Login successful:", response);

      // Redirect based on role
      if (response.user && response.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/store';
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Error de conexión");
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
      
      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
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
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Credenciales de prueba:</p>
        <p className="text-sm"><strong>Usuario:</strong> admin</p>
        <p className="text-sm"><strong>Contraseña:</strong> admin123</p>
      </div>
    </form>
  );
}