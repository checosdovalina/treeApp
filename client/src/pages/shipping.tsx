import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin,
  DollarSign,
  Check,
  AlertCircle,
  Phone,
  MessageCircle,
  Calculator
} from "lucide-react";

export default function ShippingPage() {
  const handleWhatsAppContact = () => {
    const message = "Hola! Tengo preguntas sobre envíos y entregas";
    const whatsappUrl = `https://wa.me/5218711047637?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <Truck className="h-16 w-16 mx-auto mb-6 text-uniform-gold" />
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Información de Envíos
            </h1>
            <p className="text-xl text-blue-100 font-roboto max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre nuestros envíos y políticas de entrega.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Shipping Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Métodos de Envío
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Truck className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">Envío Estándar</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Paquetería convencional con seguimiento incluido
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="block">5-8 días hábiles</Badge>
                    <p className="text-sm text-gray-500">Desde $150 MXN</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-2 border-uniform-gold">
                <CardHeader className="text-center">
                  <Package className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">Envío Express</CardTitle>
                  <Badge className="bg-uniform-gold text-uniform-blue">Recomendado</Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Entrega rápida para pedidos urgentes
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="block">2-3 días hábiles</Badge>
                    <p className="text-sm text-gray-500">Desde $300 MXN</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <MapPin className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">Entrega Local</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">
                    Para la zona metropolitana de Torreón
                  </p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="block">24-48 horas</Badge>
                    <p className="text-sm text-gray-500">Desde $80 MXN</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Free Shipping */}
          <section className="mb-12">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                  <h3 className="text-xl font-semibold text-green-800">
                    ¡Envío GRATIS!
                  </h3>
                </div>
                <p className="text-green-700 mb-4">
                  En compras mayores a <strong>$2,000 MXN</strong> el envío es completamente gratuito
                </p>
                <p className="text-sm text-green-600">
                  *Válido para envío estándar en toda la República Mexicana
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Shipping Zones */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Zonas de Envío
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-uniform-blue" />
                    Zona Norte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Coahuila, Nuevo León, Tamaulipas, Chihuahua, Sonora, Durango
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Tiempo de entrega:</span>
                    <span className="font-medium">2-4 días hábiles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo desde:</span>
                    <span className="font-medium">$120 MXN</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-uniform-blue" />
                    Zona Centro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    CDMX, Estado de México, Puebla, Querétaro, Hidalgo, Morelos
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Tiempo de entrega:</span>
                    <span className="font-medium">3-5 días hábiles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo desde:</span>
                    <span className="font-medium">$150 MXN</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-uniform-blue" />
                    Zona Sur
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Veracruz, Oaxaca, Chiapas, Tabasco, Campeche, Yucatán
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Tiempo de entrega:</span>
                    <span className="font-medium">4-6 días hábiles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo desde:</span>
                    <span className="font-medium">$180 MXN</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-uniform-blue" />
                    Zona Occidente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Jalisco, Michoacán, Guanajuato, Aguascalientes, Zacatecas
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Tiempo de entrega:</span>
                    <span className="font-medium">3-5 días hábiles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Costo desde:</span>
                    <span className="font-medium">$140 MXN</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Shipping Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Proceso de Envío
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Confirmación</h3>
                <p className="text-gray-600 text-sm">
                  Recibimos y confirmamos tu pedido
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Preparación</h3>
                <p className="text-gray-600 text-sm">
                  Empacamos tu pedido con cuidado
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Envío</h3>
                <p className="text-gray-600 text-sm">
                  Enviamos con paquetería confiable
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Entrega</h3>
                <p className="text-gray-600 text-sm">
                  Recibes tu pedido en el tiempo estimado
                </p>
              </div>
            </div>
          </section>

          {/* Important Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Información Importante
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check className="h-5 w-5 text-green-500" />
                    Lo que SÍ incluimos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Seguimiento en tiempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Empaque protector gratuito
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Seguro básico incluido
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Notificaciones vía WhatsApp
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Soporte durante el envío
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Consideraciones Especiales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      Los tiempos no incluyen sábados, domingos ni días festivos
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      Direcciones rurales pueden tener costo adicional
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      Requerimos datos completos del destinatario
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                      Productos personalizados no son retornables
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Shipping Calculator CTA */}
          <section className="mb-12">
            <Card className="bg-uniform-blue text-white">
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-uniform-gold" />
                <h3 className="text-2xl font-bold mb-4">
                  ¿Quieres calcular el costo de envío?
                </h3>
                <p className="text-blue-100 mb-6">
                  Contáctanos con tu código postal y te daremos una cotización exacta
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Calcular por WhatsApp
                  </Button>
                  <Link href="/store/contact">
                    <Button 
                      className="bg-uniform-gold text-uniform-blue hover:bg-yellow-400 hover:text-uniform-blue font-semibold"
                    >
                      Enviar Mensaje
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Preguntas Frecuentes sobre Envíos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Puedo cambiar la dirección de envío?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Sí, puedes cambiar la dirección antes de que el paquete sea enviado. 
                    Contáctanos inmediatamente para hacer el cambio.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué pasa si no estoy en casa?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    La paquetería intentará la entrega hasta 3 veces. También puedes 
                    recoger tu paquete en la sucursal más cercana.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Hacen entregas en fin de semana?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Algunos servicios express incluyen entrega en sábado. 
                    Los domingos y días festivos no hay entregas.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cómo rastreo mi pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Te enviamos el número de guía por WhatsApp y email. 
                    También puedes consultar el estatus en tu cuenta.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Support */}
          <section className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-uniform-blue mb-2">
              ¿Tienes dudas sobre tu envío?
            </h3>
            <p className="text-gray-600 mb-4">
              Nuestro equipo está listo para ayudarte con cualquier pregunta sobre envíos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('tel:+5218711047637')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </Button>
              <Link href="/support">
                <Button variant="outline">
                  Centro de Ayuda
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </CustomerLayout>
  );
}