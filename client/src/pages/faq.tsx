import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  HelpCircle, 
  Package, 
  ShoppingCart, 
  Truck,
  CreditCard,
  Users,
  Phone,
  MessageCircle,
  Mail,
  ChevronDown,
  Search,
  Clock,
  CheckCircle
} from "lucide-react";

export default function FAQPage() {
  const handleWhatsAppContact = () => {
    const message = "Hola! Tengo una pregunta que no está en las FAQ";
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
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-blue-100 font-roboto max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Contact */}
          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-uniform-blue mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-uniform-blue mb-4">
                  ¿No encuentras lo que buscas?
                </h3>
                <p className="text-gray-700 mb-4">
                  Si no encuentras la respuesta a tu pregunta, contáctanos directamente
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Link href="/support">
                    <Button variant="outline">
                      Centro de Ayuda
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-poppins font-bold text-uniform-blue mb-6 text-center">
              Categorías de Preguntas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <Package className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Productos</h3>
                  <p className="text-gray-600 text-sm">
                    Tallas, materiales, personalización
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <ShoppingCart className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pedidos</h3>
                  <p className="text-gray-600 text-sm">
                    Como comprar, cotizaciones, seguimiento
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-6">
                  <Truck className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Envíos</h3>
                  <p className="text-gray-600 text-sm">
                    Tiempos, costos, cobertura
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Products FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-uniform-blue" />
              <h2 className="text-2xl font-poppins font-bold text-uniform-blue">
                Sobre Nuestros Productos
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué tipos de uniformes manejan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Manejamos una amplia gama de uniformes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Uniformes industriales y de seguridad</li>
                    <li>Uniformes médicos y hospitalarios</li>
                    <li>Uniformes corporativos y ejecutivos</li>
                    <li>Uniformes escolares</li>
                    <li>Ropa promocional y publicitaria</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Puedo personalizar los uniformes?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Sí, ofrecemos servicios de personalización completos incluyendo bordados, 
                    serigrafía, transferencias y aplicaciones de logos. Podemos personalizar 
                    colores, agregar nombres, logos empresariales y modificar diseños según 
                    tus necesidades específicas.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cómo sé qué talla elegir?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Tenemos una guía de tallas detallada en cada producto. También ofrecemos 
                    muestras físicas para empresas con pedidos grandes. Recomendamos contactarnos 
                    para asesoría personalizada en tallas, especialmente para pedidos corporativos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué materiales utilizan?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Utilizamos materiales de alta calidad como algodón, poliéster, mezclas 
                    algodón-poliéster, drill, gabardina y telas especializadas según el tipo 
                    de uniforme. Todos nuestros materiales cumplen con estándares de calidad 
                    y durabilidad industrial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Orders FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-uniform-blue" />
              <h2 className="text-2xl font-poppins font-bold text-uniform-blue">
                Pedidos y Compras
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cómo puedo hacer un pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Puedes hacer pedidos de varias formas:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>A través de nuestro catálogo online</li>
                    <li>Solicitando una cotización personalizada</li>
                    <li>Por WhatsApp (+52 1 871 104 7637)</li>
                    <li>Visitando nuestras instalaciones</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cuál es el pedido mínimo?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    No tenemos pedido mínimo para productos de catálogo. Para uniformes 
                    personalizados, el pedido mínimo es de 12 piezas por diseño. Para 
                    empresas ofrecemos condiciones especiales según el volumen de compra.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cuánto tiempo tarda mi pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Los tiempos varían según el tipo de pedido:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Productos en stock: 3-5 días hábiles</li>
                    <li>Uniformes personalizados: 10-15 días hábiles</li>
                    <li>Pedidos corporativos grandes: 15-20 días hábiles</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Puedo cancelar o modificar mi pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Puedes cancelar o modificar tu pedido antes de que entre a producción. 
                    Una vez iniciada la producción de uniformes personalizados, no es posible 
                    hacer cambios. Contáctanos inmediatamente si necesitas hacer modificaciones.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Shipping FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="h-6 w-6 text-uniform-blue" />
              <h2 className="text-2xl font-poppins font-bold text-uniform-blue">
                Envíos y Entregas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿A qué lugares envían?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Realizamos envíos a toda la República Mexicana. Tenemos tarifas especiales 
                    para la zona norte (Coahuila, Nuevo León, Tamaulipas). Para envíos 
                    internacionales, contáctanos para cotización especial.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cuánto cuesta el envío?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">
                    Los costos varían por zona:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Zona local (Torreón): Desde $80</li>
                    <li>Zona norte: Desde $120</li>
                    <li>Zona centro: Desde $150</li>
                    <li>Zona sur: Desde $180</li>
                    <li><strong>Envío GRATIS en compras mayores a $2,000</strong></li>
                  </ul>
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
                    Te enviamos el número de guía por WhatsApp y email una vez que tu pedido 
                    es enviado. Puedes rastrear tu paquete en la página de la paquetería 
                    correspondiente. También puedes consultarnos el estatus en cualquier momento.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué pasa si no estoy cuando llega el envío?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    La paquetería intentará la entrega hasta 3 veces. Si no hay nadie para 
                    recibir el paquete, podrás recogerlo en la sucursal más cercana. También 
                    puedes coordinar una nueva fecha de entrega directamente con la paquetería.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Payment FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-6 w-6 text-uniform-blue" />
              <h2 className="text-2xl font-poppins font-bold text-uniform-blue">
                Pagos y Facturación
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
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
                    <li>Crédito empresarial (clientes establecidos)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Manejan facturación fiscal?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Sí, somos una empresa establecida que maneja facturación fiscal completa. 
                    Podemos emitir facturas con todos los requisitos fiscales vigentes. 
                    Solo necesitamos tus datos fiscales completos para generar la factura.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Ofrecen crédito empresarial?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Para empresas establecidas ofrecemos condiciones de crédito especiales. 
                    Evaluamos cada caso según el historial crediticio y volumen de compra. 
                    Contáctanos para conocer las condiciones disponibles para tu empresa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Cuándo debo pagar mi pedido?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Para pedidos estándar requerimos el 50% de anticipo y el resto contra 
                    entrega. Para pedidos empresariales grandes podemos ofrecer condiciones 
                    especiales de pago. Los pedidos personalizados requieren el 100% del pago 
                    antes de iniciar producción.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Company FAQ */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-uniform-blue" />
              <h2 className="text-2xl font-poppins font-bold text-uniform-blue">
                Servicios Empresariales
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Ofrecen descuentos por volumen?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Sí, manejamos escalas de descuento según el volumen de compra. 
                    Los descuentos inician desde 50 piezas y pueden llegar hasta el 25% 
                    en pedidos corporativos grandes. Contáctanos para una cotización 
                    personalizada según tu volumen de compra.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Pueden hacer uniformes con nuestro diseño?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Absolutamente. Podemos confeccionar uniformes completamente personalizados 
                    según tus especificaciones de diseño, colores corporativos, y requisitos 
                    específicos. Nuestro equipo de diseño puede ayudarte a desarrollar el 
                    uniforme perfecto para tu empresa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Ofrecen servicio de medidas a domicilio?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Para pedidos corporativos grandes (más de 100 piezas) ofrecemos servicio 
                    de toma de medidas en las instalaciones del cliente. Este servicio tiene 
                    un costo adicional que varía según la ubicación y el número de personas 
                    a medir.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ¿Qué garantía ofrecen en productos corporativos?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Ofrecemos garantía completa contra defectos de fabricación por 30 días. 
                    Para pedidos corporativos grandes incluimos servicio de reposición 
                    gratuita por defectos y ajustes menores de tallas dentro de los primeros 
                    15 días después de la entrega.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-uniform-blue text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              ¿Tienes más preguntas?
            </h3>
            <p className="text-blue-100 mb-6">
              Nuestro equipo de atención al cliente está listo para ayudarte con cualquier duda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              <Button 
                className="bg-uniform-gold text-uniform-blue hover:bg-yellow-400 hover:text-uniform-blue font-semibold"
                onClick={() => window.open('tel:+5218711047637')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </Button>
              <Link href="/store/contact">
                <Button 
                  className="bg-uniform-gold text-uniform-blue hover:bg-yellow-400 hover:text-uniform-blue font-semibold"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Mensaje
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Horario de Atención</span>
              </div>
              <p className="text-sm text-blue-100">
                Lunes a Viernes: 9:00 AM - 6:00 PM | Sábados: 9:00 AM - 2:00 PM
              </p>
            </div>
          </section>
        </div>
      </div>
    </CustomerLayout>
  );
}