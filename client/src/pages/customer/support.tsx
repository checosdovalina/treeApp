import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  FileText,
  ShoppingCart,
  User,
  Package,
  CreditCard,
  Truck,
  RefreshCw
} from "lucide-react";

export default function CustomerSupportPage() {
  const handleWhatsAppContact = () => {
    const message = "Hola! Necesito ayuda con mi pedido/cuenta";
    const whatsappUrl = `https://wa.me/5218711047637?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-uniform-gold" />
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-xl text-blue-100 font-roboto max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Contact Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Formas de Contacto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Respuesta inmediata
                  </p>
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Enviar Mensaje
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    +52 1 871 104 7637
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('tel:+5218711047637')}
                  >
                    Llamar Ahora
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    info@treeuniformes.com
                  </p>
                  <Link href="/store/contact">
                    <Button variant="outline" className="w-full">
                      Enviar Email
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 text-uniform-blue mx-auto mb-2" />
              <p className="text-sm text-gray-700">
                <strong>Horario de Atención:</strong> Lunes a Viernes 9:00 AM - 6:00 PM | Sábados 9:00 AM - 2:00 PM
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Preguntas Frecuentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="h-5 w-5 text-uniform-blue" />
                    ¿Cómo realizar un pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Puedes realizar pedidos de tres formas:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>A través de nuestro catálogo online</li>
                    <li>Solicitando una cotización personalizada</li>
                    <li>Contactándonos directamente por WhatsApp</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-uniform-blue" />
                    ¿Cuáles son los tiempos de entrega?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Los tiempos de entrega varían según el producto:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Productos en stock: 3-5 días hábiles</li>
                    <li>Uniformes personalizados: 10-15 días hábiles</li>
                    <li>Pedidos corporativos: 15-20 días hábiles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-uniform-blue" />
                    ¿Qué métodos de pago aceptan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Aceptamos múltiples formas de pago:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Transferencias bancarias</li>
                    <li>Depósitos en efectivo</li>
                    <li>Cheques empresariales</li>
                    <li>Pagos contra entrega (según el caso)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <RefreshCw className="h-5 w-5 text-uniform-blue" />
                    ¿Tienen política de devoluciones?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Sí, ofrecemos devoluciones bajo estas condiciones:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Productos con defectos de fabricación</li>
                    <li>Tallas incorrectas (dentro de 7 días)</li>
                    <li>Productos no personalizados únicamente</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-uniform-blue" />
                    ¿Hacen envíos a toda la República?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Sí, realizamos envíos a nivel nacional:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Envío gratuito en pedidos mayores a $2,000</li>
                    <li>Tarifas preferenciales para empresas</li>
                    <li>Seguimiento de paquetería incluido</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-uniform-blue" />
                    ¿Cómo crear una cuenta empresarial?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Para crear una cuenta empresarial:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Contáctanos para validar tu empresa</li>
                    <li>Proporciona datos fiscales completos</li>
                    <li>Obtén precios especiales y facturación</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Acciones Rápidas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/customer/quotes">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Mis Cotizaciones</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/store/catalog">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Ver Catálogo</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/store/quote-request">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <Mail className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Solicitar Cotización</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/customer/dashboard">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <User className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                    <p className="text-sm font-medium">Mi Cuenta</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Emergency Contact */}
          <section className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ¿Necesitas Ayuda Urgente?
            </h3>
            <p className="text-red-700 mb-4">
              Para problemas urgentes con pedidos o entregas, contáctanos inmediatamente:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Urgente
              </Button>
              <Button 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() => window.open('tel:+5218711047637')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Llamar Ahora
              </Button>
            </div>
          </section>
        </div>
      </div>
    </CustomerLayout>
  );
}