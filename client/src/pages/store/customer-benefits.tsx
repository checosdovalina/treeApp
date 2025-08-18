import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, User, Shield, CheckCircle, Gift, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { useDiscount } from "@/hooks/useDiscount";

export default function CustomerBenefitsPage() {
  const { getDiscountInfo } = useDiscount();
  const currentDiscount = getDiscountInfo();

  const customerTypes = [
    {
      type: "basic",
      icon: User,
      title: "Cliente Básico",
      description: "Perfecto para compras ocasionales",
      discount: "Sin descuentos",
      discountValue: 0,
      color: "gray",
      benefits: [
        "Acceso completo al catálogo",
        "Atención personalizada",
        "Solicitud de presupuestos",
        "Garantía de calidad"
      ]
    },
    {
      type: "regular",
      icon: Star,
      title: "Cliente Regular",
      description: "Para compras frecuentes y pedidos medianos",
      discount: "8% de descuento",
      discountValue: 8,
      color: "blue",
      benefits: [
        "8% de descuento en todos los productos",
        "Prioridad en atención al cliente",
        "Presupuestos preferenciales",
        "Envío preferencial",
        "Notificaciones de productos nuevos"
      ]
    },
    {
      type: "premium",
      icon: Crown,
      title: "Cliente Premium",
      description: "Para empresas y pedidos voluminosos",
      discount: "15% de descuento",
      discountValue: 15,
      color: "yellow",
      benefits: [
        "15% de descuento en todos los productos",
        "Descuentos adicionales por volumen",
        "Atención prioritaria 24/7",
        "Gestor de cuenta dedicado",
        "Precios especiales por marca",
        "Envío gratuito en pedidos grandes",
        "Acceso anticipado a nuevos productos"
      ]
    }
  ];

  const getCardStyles = (type: string) => {
    const isCurrentType = currentDiscount.userRole === type;
    
    switch (type) {
      case "premium":
        return {
          card: `border-2 ${isCurrentType ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50' : 'border-yellow-200 hover:border-yellow-300'}`,
          badge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black",
          icon: "text-yellow-600"
        };
      case "regular":
        return {
          card: `border-2 ${isCurrentType ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-blue-200 hover:border-blue-300'}`,
          badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
          icon: "text-blue-600"
        };
      case "basic":
      default:
        return {
          card: `border-2 ${isCurrentType ? 'border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50' : 'border-gray-200 hover:border-gray-300'}`,
          badge: "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
          icon: "text-gray-600"
        };
    }
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Programa de Beneficios para Clientes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En TREE Uniformes valoramos la lealtad de nuestros clientes. Nuestro programa de beneficios 
              te recompensa con descuentos y servicios especiales según tu nivel de cliente.
            </p>
          </div>

          {/* Current Status */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-md border">
              <Shield className="h-6 w-6 text-uniform-primary" />
              <span className="text-lg font-semibold text-gray-700">Tu nivel actual:</span>
              <Badge className={getCardStyles(currentDiscount.userRole).badge}>
                {currentDiscount.roleLabel}
              </Badge>
              <span className="text-lg font-bold text-uniform-primary">
                {currentDiscount.discountLabel}
              </span>
            </div>
          </div>

          {/* Customer Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {customerTypes.map((customer) => {
              const Icon = customer.icon;
              const styles = getCardStyles(customer.type);
              const isCurrentType = currentDiscount.userRole === customer.type;

              return (
                <Card 
                  key={customer.type}
                  className={`relative transition-all duration-300 hover:shadow-xl ${styles.card}`}
                >
                  {isCurrentType && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-500 text-white">Tu nivel actual</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-4 p-4 rounded-full bg-white shadow-md w-fit`}>
                      <Icon className={`h-8 w-8 ${styles.icon}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {customer.title}
                    </CardTitle>
                    <p className="text-gray-600 mb-4">
                      {customer.description}
                    </p>
                    <Badge className={`text-lg px-4 py-2 ${styles.badge}`}>
                      {customer.discount}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {customer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* How to Upgrade */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <TrendingUp className="h-12 w-12 text-uniform-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Cómo subir de nivel?
              </h2>
              <p className="text-lg text-gray-600">
                Nuestro sistema de niveles se basa en tu historial de compras y relación comercial con nosotros
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Star className="h-6 w-6 text-blue-500 mr-2" />
                  Cliente Regular
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Compras frecuentes (más de 3 pedidos)</li>
                  <li>• Pedidos con valor superior a $5,000 MXN</li>
                  <li>• Relación comercial de al menos 6 meses</li>
                  <li>• Feedback positivo y recomendaciones</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Crown className="h-6 w-6 text-yellow-500 mr-2" />
                  Cliente Premium
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Pedidos corporativos de gran volumen</li>
                  <li>• Compras anuales superiores a $50,000 MXN</li>
                  <li>• Contratos de suministro a largo plazo</li>
                  <li>• Empresas con múltiples sucursales</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-uniform-primary to-blue-700 rounded-2xl text-white p-8 text-center">
            <Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">
              ¿Interesado en subir de nivel?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contáctanos para conocer cómo puedes acceder a mayores beneficios y descuentos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store/quote-request">
                <Button size="lg" variant="secondary" className="bg-white text-uniform-primary hover:bg-gray-100">
                  <Gift className="h-5 w-5 mr-2" />
                  Solicitar Presupuesto
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-uniform-primary"
                onClick={() => {
                  const message = "Hola! Me interesa conocer más sobre el programa de beneficios para clientes";
                  const whatsappUrl = `https://wa.me/5218116789012?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                📱 Contactar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}