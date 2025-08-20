import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, UserPlus, User, Crown, Star, Shield, ChevronRight } from "lucide-react";

export default function LoginRegisterSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-12 bg-gradient-to-br from-uniform-blue via-blue-700 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4 drop-shadow-lg">
              Accede a tu Cuenta
            </h2>
            <p className="text-gray-200 text-lg font-roboto drop-shadow-sm">
              Inicia sesión o regístrate para acceder a descuentos exclusivos y gestionar tus pedidos
            </p>
          </div>

          {/* Login/Register Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Login Card */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-uniform-blue w-fit">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Iniciar Sesión
                </CardTitle>
                <p className="text-gray-600">
                  Ya tienes una cuenta? Accede para ver tus descuentos y pedidos
                </p>
              </CardHeader>
              
              <CardContent className="text-center">
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="w-full bg-uniform-blue hover:bg-blue-700 text-white font-poppins font-semibold py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>¿Admin? Accede con tu cuenta para ir al panel administrativo</p>
                </div>
              </CardContent>
            </Card>

            {/* Register Card */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-green-600 w-fit">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Crear Cuenta
                </CardTitle>
                <p className="text-gray-600">
                  Regístrate y comienza a disfrutar de nuestros beneficios exclusivos
                </p>
              </CardHeader>
              
              <CardContent className="text-center">
                <Link href="/auth/register">
                  <Button 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-poppins font-semibold py-3 shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear Cuenta
                  </Button>
                </Link>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>Registro gratuito • Descuentos inmediatos • Gestión de pedidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Benefits Preview */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Niveles de Cliente y Beneficios
              </h3>
              <ChevronRight 
                className={`h-5 w-5 text-white transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
            </div>
            
            {isExpanded && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Básico */}
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <User className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <Badge className="bg-gray-500 text-white mb-2">Cliente Básico</Badge>
                  <p className="text-white text-sm">Sin descuentos</p>
                  <p className="text-gray-300 text-xs mt-1">Acceso completo al catálogo</p>
                </div>

                {/* Regular */}
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <Badge className="bg-blue-500 text-white mb-2">Cliente Regular</Badge>
                  <p className="text-white text-sm font-semibold">8% de descuento</p>
                  <p className="text-gray-300 text-xs mt-1">Atención prioritaria</p>
                </div>

                {/* Premium */}
                <div className="bg-white/20 rounded-lg p-4 text-center border border-yellow-400/50">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black mb-2">Cliente Premium</Badge>
                  <p className="text-white text-sm font-bold">15% de descuento</p>
                  <p className="text-gray-300 text-xs mt-1">Gestor dedicado • Envío gratuito</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Browse CTA */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">
              ¿Prefieres explorar primero nuestros productos?
            </p>
            <Link href="/store/catalog">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-uniform-blue font-poppins font-medium"
              >
                Explorar Catálogo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}