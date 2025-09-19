import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import StoreLayout from "@/components/layout/store-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('POST', '/api/contact-messages', data);
    },
    onSuccess: () => {
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <StoreLayout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
              Contáctanos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-roboto">
              Estamos aquí para ayudarte con cualquier pregunta sobre nuestros uniformes y servicios.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Información de Contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">
                  Información de Contacto
                </h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-uniform-primary p-3 rounded-lg">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                          <p className="text-gray-600">+52 1 871 104 7637</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-uniform-primary p-3 rounded-lg">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Correo Electrónico</h3>
                          <p className="text-gray-600">info@treeuniformes.com</p>
                          <p className="text-gray-600">ventas@treeuniformes.com</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-uniform-primary p-3 rounded-lg">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                          <p className="text-gray-600">
                            Laguna, Coahuila<br />
                            México
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-uniform-primary p-3 rounded-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">Horarios de Atención</h3>
                          <p className="text-gray-600">
                            Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                            Sábados: 9:00 AM - 2:00 PM<br />
                            Domingos: Cerrado
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-poppins">Envíanos un Mensaje</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="font-roboto">Nombre Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="font-roboto">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-roboto">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="font-roboto">Asunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1"
                        data-testid="input-subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-roboto">Mensaje *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1"
                        placeholder="Cuéntanos cómo podemos ayudarte..."
                        data-testid="textarea-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full bg-uniform-primary hover:bg-uniform-primary/90"
                      data-testid="button-submit"
                    >
                      {contactMutation.isPending ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sección de Ubicación */}
          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-poppins text-center">Nuestra Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600 font-roboto">
                    Mapa interactivo disponible próximamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}