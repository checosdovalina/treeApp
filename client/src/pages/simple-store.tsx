import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Settings, LogOut } from "lucide-react";
import PriceDisplay from "@/components/store/price-display";
import SimpleLoginForm from "@/components/auth/simple-login-form";
import SimpleRegisterForm from "@/components/auth/simple-register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface Product {
  id: number;
  name: string;
  price: string;
  images: string[];
  brand: string;
  category: string;
  isActive: boolean;
}

export default function SimpleStore() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: true,
  });

  const filteredProducts = products.filter(product =>
    product.isActive && 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auth/logout', true);
      xhr.withCredentials = true;
      
      const logoutPromise = new Promise<void>((resolve, reject) => {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve();
            } else {
              reject(new Error('Error cerrando sesión'));
            }
          }
        };
        xhr.onerror = () => reject(new Error('Error de conexión'));
      });

      xhr.send();
      await logoutPromise;
      window.location.reload();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">TREE Uniformes</h1>
              <Badge variant="outline" className="text-xs">
                E-commerce
              </Badge>
            </div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hola, {user?.firstName || user?.username}
                </span>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">No autenticado</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Auth Section for Non-authenticated Users */}
        {!isAuthenticated && (
          <div className="mb-12">
            <div className="max-w-md mx-auto">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold mb-2">Iniciar Sesión</h2>
                    <p className="text-sm text-gray-600">
                      Accede a tu cuenta para ver descuentos y gestionar pedidos
                    </p>
                  </div>
                  
                  <Tabs defaultValue="login">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="login">Entrar</TabsTrigger>
                      <TabsTrigger value="register">Registro</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <SimpleLoginForm />
                    </TabsContent>

                    <TabsContent value="register">
                      <SimpleRegisterForm />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-6 text-center text-gray-800">
            Productos Disponibles ({filteredProducts.length})
          </h2>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-200 rounded-md mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'No hay productos disponibles'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      {product.brand} • {product.category}
                    </p>
                    
                    <div className="mb-3">
                      <PriceDisplay 
                        price={parseFloat(product.price)} 
                        size="sm" 
                        showDiscount={isAuthenticated}
                      />
                    </div>
                    
                    <Link href={`/store/product/${product.id}`}>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        Ver Detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">TREE Uniformes & Kodiak Industrial</p>
            <p>© 2024 Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}