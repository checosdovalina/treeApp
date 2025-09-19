import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  RefreshCw, 
  Package, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  FileText,
  ShieldCheck,
  Truck
} from "lucide-react";

export default function ReturnsPage() {
  const handleWhatsAppContact = () => {
    const message = "Hola! Tengo preguntas sobre devoluciones y garantías";
    const whatsappUrl = `https://wa.me/5218711047637?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <RefreshCw className="h-16 w-16 mx-auto mb-6 text-uniform-gold" />
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Devoluciones y Garantías
            </h1>
            <p className="text-xl text-blue-100 font-roboto max-w-2xl mx-auto">
              Conoce nuestras políticas de devolución y garantía para que compres con confianza.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Return Policy Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Política de Devoluciones
            </h2>
            
            <Card className="bg-blue-50 border-blue-200 mb-6">
              <CardContent className="p-6 text-center">
                <ShieldCheck className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-uniform-blue mb-4">
                  Compra con Confianza
                </h3>
                <p className="text-gray-700 mb-4">
                  En TREE Uniformes respaldamos la calidad de nuestros productos. 
                  Ofrecemos devoluciones y cambios bajo condiciones específicas para garantizar tu satisfacción.
                </p>
                <Badge className="bg-uniform-blue text-white text-sm">
                  Hasta 7 días para devoluciones
                </Badge>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">Productos Aceptados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Productos con defectos de fabricación
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Tallas incorrectas enviadas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Productos no personalizados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Artículos en condición original
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-lg">No Aceptamos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Uniformes personalizados
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Productos utilizados o lavados
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Artículos después de 7 días
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Productos sin etiquetas
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Clock className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <CardTitle className="text-lg">Tiempos de Proceso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uniform-blue" />
                      Evaluación: 1-2 días hábiles
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uniform-blue" />
                      Aprobación: 24 horas
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uniform-blue" />
                      Reembolso: 5-7 días hábiles
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uniform-blue" />
                      Cambio: 3-5 días hábiles
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Return Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Proceso de Devolución
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Solicita</h3>
                <p className="text-gray-600 text-sm">
                  Contáctanos dentro de los 7 días
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Autorización</h3>
                <p className="text-gray-600 text-sm">
                  Te enviamos instrucciones de envío
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Envía</h3>
                <p className="text-gray-600 text-sm">
                  Empaca y envía el producto
                </p>
              </div>

              <div className="text-center">
                <div className="bg-uniform-blue rounded-full p-4 w-16 h-16 mx-auto mb-4 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Resolución</h3>
                <p className="text-gray-600 text-sm">
                  Procesamos tu cambio o reembolso
                </p>
              </div>
            </div>
          </section>

          {/* Warranty Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Garantía de Calidad
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-uniform-blue" />
                    Defectos de Fabricación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Garantizamos nuestros productos contra defectos de fabricación por 30 días.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Costuras defectuosas</li>
                    <li>• Problemas en zipper o botones</li>
                    <li>• Defectos en tela o materiales</li>
                    <li>• Errores de confección</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-uniform-blue" />
                    Satisfacción Garantizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Si no estás satisfecho con tu compra, trabajamos contigo para encontrar una solución.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Cambio por talla diferente</li>
                    <li>• Cambio por otro producto</li>
                    <li>• Reembolso completo</li>
                    <li>• Crédito para futura compra</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Requirements for Returns */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Requisitos para Devolución
            </h2>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Importante: Lee estos requisitos antes de devolver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Condiciones del Producto:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Debe estar en condición original sin usar
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Con todas las etiquetas originales
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        Sin olores, manchas o desgaste
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        En empaque original si aplica
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Documentación Requerida:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-uniform-blue mt-0.5" />
                        Número de pedido original
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-uniform-blue mt-0.5" />
                        Motivo de la devolución
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-uniform-blue mt-0.5" />
                        Fotos del producto si hay defecto
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-uniform-blue mt-0.5" />
                        Información de contacto actualizada
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact for Returns */}
          <section className="mb-12">
            <Card className="bg-uniform-blue text-white">
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-uniform-gold" />
                <h3 className="text-2xl font-bold mb-4">
                  ¿Necesitas hacer una devolución?
                </h3>
                <p className="text-blue-100 mb-6">
                  Contáctanos para iniciar el proceso. Nuestro equipo te guiará paso a paso.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Devoluciones
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-uniform-blue"
                    onClick={() => window.open('tel:+5218711047637')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Llamar
                  </Button>
                  <Link href="/store/contact">
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-uniform-blue"
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
              Preguntas Frecuentes sobre Devoluciones
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Quién paga el envío de devolución?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Si el producto tiene defecto de fabricación, nosotros cubrimos el envío. 
                    En otros casos, el cliente cubre el costo de envío de retorno.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Puedo cambiar por una talla diferente?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Sí, siempre que el producto esté en condición original y tengamos 
                    disponibilidad de la talla solicitada.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cómo recibo mi reembolso?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Los reembolsos se procesan por el mismo método de pago original 
                    o mediante transferencia bancaria según el caso.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué pasa con productos personalizados?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Los productos personalizados no son retornables, excepto 
                    si hay error de nuestra parte en la personalización.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Customer Service */}
          <section className="bg-gray-100 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-uniform-blue mb-2">
              Atención al Cliente Especializada
            </h3>
            <p className="text-gray-600 mb-4">
              Nuestro equipo de atención al cliente está especializado en devoluciones y garantías
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/support">
                <Button variant="outline">
                  Centro de Ayuda
                </Button>
              </Link>
              <Link href="/customer/quotes">
                <Button variant="outline">
                  Mis Pedidos
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </CustomerLayout>
  );
}