import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { customerRegistrationSchema, type CustomerRegistration, type Company } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User, Building, MapPin, Phone, Mail, ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";

export default function CustomerRegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyOption, setCompanyOption] = useState<"existing" | "new" | "none">("none");
  const { toast } = useToast();

  // Fetch companies for selection
  const { data: companies, isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies", "active"],
    enabled: companyOption === "existing",
  });

  const form = useForm<CustomerRegistration>({
    resolver: zodResolver(customerRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyId: undefined,
      newCompany: {
        name: "",
        taxId: "",
        industry: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
      },
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: CustomerRegistration) => {
      return await apiRequest("POST", "/api/register/customer", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al registrarse",
        description: error.message || "Ocurrió un error durante el registro",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerRegistration) => {
    registerMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Bienvenido a TREE Uniformes!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tu email y contraseña para:
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/store/catalog">
                  Explorar nuestro catálogo
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/store/quote-request">
                  Solicitar presupuesto
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-uniform-primary hover:text-uniform-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Cliente</h1>
          <p className="text-gray-600">
            Crea tu cuenta para realizar compras y solicitar presupuestos personalizados
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          Teléfono *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 6 caracteres"
                              data-testid="input-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Repite tu contraseña"
                              data-testid="input-confirm-password"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              data-testid="button-toggle-confirm-password"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <Building className="h-5 w-5 mr-2" />
                    Información de Empresa (Opcional)
                  </h3>
                  
                  <RadioGroup
                    value={companyOption}
                    onValueChange={(value: "existing" | "new" | "none") => {
                      setCompanyOption(value);
                      if (value === "none") {
                        form.setValue("companyId", undefined);
                        form.setValue("newCompany", undefined);
                      }
                    }}
                    className="mb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="no-company" />
                      <Label htmlFor="no-company">Sin empresa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing-company" />
                      <Label htmlFor="existing-company">Seleccionar empresa existente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new-company" />
                      <Label htmlFor="new-company">Crear nueva empresa</Label>
                    </div>
                  </RadioGroup>

                  {companyOption === "existing" && (
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value?.toString()} 
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una empresa" />
                              </SelectTrigger>
                              <SelectContent>
                                {companiesLoading ? (
                                  <SelectItem value="loading" disabled>Cargando...</SelectItem>
                                ) : companies?.length ? (
                                  companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id.toString()}>
                                      {company.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-companies" disabled>
                                    No hay empresas disponibles
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {companyOption === "new" && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <h4 className="font-medium flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Empresa
                      </h4>
                      
                      <FormField
                        control={form.control}
                        name="newCompany.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la empresa *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de la empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="newCompany.taxId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RFC / ID Fiscal</FormLabel>
                              <FormControl>
                                <Input placeholder="RFC123456789" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="newCompany.industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industria / Sector</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una industria" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="retail">Retail / Comercio</SelectItem>
                                    <SelectItem value="hospitality">Hospitalidad / Gastronomía</SelectItem>
                                    <SelectItem value="healthcare">Salud</SelectItem>
                                    <SelectItem value="industrial">Industrial</SelectItem>
                                    <SelectItem value="construction">Construcción</SelectItem>
                                    <SelectItem value="education">Educación</SelectItem>
                                    <SelectItem value="security">Seguridad</SelectItem>
                                    <SelectItem value="corporate">Corporativo</SelectItem>
                                    <SelectItem value="other">Otro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="newCompany.contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email de contacto</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="contacto@empresa.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="newCompany.contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Teléfono de contacto</FormLabel>
                              <FormControl>
                                <Input placeholder="123-456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="newCompany.website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sitio web</FormLabel>
                            <FormControl>
                              <Input placeholder="https://empresa.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    Dirección *
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección completa</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Calle, número, colonia, referencias..."
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input placeholder="Ciudad" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="Estado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="flex-1"
                  >
                    {registerMutation.isPending ? "Registrando..." : "Crear Cuenta"}
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-uniform-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}