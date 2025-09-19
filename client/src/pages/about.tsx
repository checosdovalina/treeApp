import CustomerLayout from "@/components/layout/customer-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Building2,
  Shirt,
  Star,
  CheckCircle,
  Target,
  Heart
} from "lucide-react";

export default function AboutPage() {
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-uniform-blue to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Building2 className="h-16 w-16 mx-auto mb-6 text-uniform-gold" />
              <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
                ACERCA DE NOSOTROS
              </h1>
              <p className="text-xl mb-8 text-blue-100 font-roboto max-w-2xl mx-auto">
                Con años de experiencia en el sector textil, TREE Uniformes & Kodiak Industrial 
                se ha posicionado como líder en la fabricación y distribución de uniformes de alta calidad.
              </p>
            </div>
          </div>
        </section>

        {/* Historia Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-poppins font-bold text-uniform-blue mb-4">
                  Nuestra Historia
                </h2>
                <p className="text-gray-600 text-lg">
                  Una empresa familiar comprometida con la calidad y el servicio
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    TREE Uniformes & Kodiak Industrial nació con la visión de proveer uniformes 
                    de la más alta calidad para empresas de todos los sectores. Desde nuestros 
                    inicios, nos hemos enfocado en combinar durabilidad, comodidad y estilo 
                    profesional en cada una de nuestras prendas.
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Trabajamos con las mejores marcas del mercado y contamos con un equipo 
                    especializado que entiende las necesidades específicas de cada industria, 
                    desde el sector corporativo hasta el industrial y médico.
                  </p>
                </div>
                <div className="bg-blue-50 p-8 rounded-lg">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <Clock className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                      <h3 className="font-semibold text-lg text-uniform-blue">10+</h3>
                      <p className="text-gray-600 text-sm">Años de experiencia</p>
                    </div>
                    <div>
                      <Users className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                      <h3 className="font-semibold text-lg text-uniform-blue">500+</h3>
                      <p className="text-gray-600 text-sm">Empresas atendidas</p>
                    </div>
                    <div>
                      <Shirt className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                      <h3 className="font-semibold text-lg text-uniform-blue">50,000+</h3>
                      <p className="text-gray-600 text-sm">Uniformes entregados</p>
                    </div>
                    <div>
                      <Star className="h-8 w-8 text-uniform-blue mx-auto mb-2" />
                      <h3 className="font-semibold text-lg text-uniform-blue">98%</h3>
                      <p className="text-gray-600 text-sm">Satisfacción del cliente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-poppins font-bold text-uniform-blue mb-4">
                      Nuestra Misión
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Proveer uniformes de la más alta calidad que fortalezcan la imagen 
                      corporativa de nuestros clientes, garantizando durabilidad, comodidad 
                      y diseño profesional en cada prenda.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <Heart className="h-12 w-12 text-uniform-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-poppins font-bold text-uniform-blue mb-4">
                      Nuestra Visión
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Ser la empresa líder en uniformes corporativos e industriales en la región, 
                      reconocida por nuestra excelencia en servicio, innovación en diseños y 
                      compromiso con la satisfacción del cliente.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-poppins font-bold text-uniform-blue mb-4">
                  Nuestros Valores
                </h2>
                <p className="text-gray-600 text-lg">
                  Los principios que guían nuestro trabajo diario
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Award className="h-8 w-8 text-uniform-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-uniform-blue mb-2">Calidad</h3>
                  <p className="text-gray-600">
                    Utilizamos solo materiales premium y procesos de manufactura que garantizan 
                    la durabilidad y resistencia de nuestros uniformes.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-uniform-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-uniform-blue mb-2">Compromiso</h3>
                  <p className="text-gray-600">
                    Nos comprometemos con cada cliente para entregar productos que superen 
                    sus expectativas en tiempo y forma.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Users className="h-8 w-8 text-uniform-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-uniform-blue mb-2">Servicio</h3>
                  <p className="text-gray-600">
                    Ofrecemos atención personalizada y asesoría especializada para encontrar 
                    la solución perfecta para cada empresa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto Section */}
        <section className="py-16 bg-uniform-blue text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-poppins font-bold mb-8">
                ¿Listo para trabajar con nosotros?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Contáctanos y descubre cómo podemos ayudarte a fortalecer la imagen de tu empresa
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5 text-uniform-gold" />
                  <span>+52 1 871 104 7637</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-uniform-gold" />
                  <span>info@treeuniformes.com</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <MapPin className="h-5 w-5 text-uniform-gold" />
                  <span>Torreón, Coahuila</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/store/contact">
                  <Button size="lg" className="bg-uniform-gold text-uniform-blue hover:bg-yellow-300 font-semibold px-8 py-4">
                    Contáctanos
                  </Button>
                </Link>
                <Link href="/store/quote-request">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-uniform-blue px-8 py-4"
                  >
                    Solicitar Cotización
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
}