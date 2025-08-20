import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface LocalLoginFormProps {
  onSuccess?: () => void;
}

export default function LocalLoginForm({ onSuccess }: LocalLoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      // Check if response is valid
      if (!response) {
        throw new Error("No se pudo conectar al servidor");
      }

      // Read response text first
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      if (!response.ok) {
        let errorMessage = "Error de autenticación";
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = "Error del servidor";
          }
        }
        throw new Error(errorMessage);
      }

      // Parse JSON response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Respuesta del servidor inválida");
      }

      // Success - redirect based on role
      console.log("Login successful, user:", data.user);
      
      if (data.user && data.user.role === 'admin') {
        console.log("Redirecting to admin panel");
        window.location.href = '/admin';
      } else {
        console.log("Redirecting to store");
        window.location.href = '/store';
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Login error details:", error);
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
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
}