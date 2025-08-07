import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type IndustrySection } from "@shared/schema";

interface IndustryIconProps {
  industry: string;
  className?: string;
}

function IndustryIcon({ industry, className = "w-12 h-12" }: IndustryIconProps) {
  const icons = {
    corporativo: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    gastronomia: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
    industrial: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m2 3 20 9-20 9Z" />
      </svg>
    ),
    medico: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 18 18.25V19a1 1 0 1 1-2 0v-.75a1.374 1.374 0 0 0-1.374-1.374H9.374A1.374 1.374 0 0 0 8 17.25V19a1 1 0 1 1-2 0v-.75c0-.546.146-1.059.401-1.503l-.547-.547Z" />
      </svg>
    ),
    seguridad: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      </svg>
    ),
    educacion: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  };

  return icons[industry as keyof typeof icons] || icons.corporativo;
}

export default function IndustrySection() {
  const { data: sections, isLoading } = useQuery({
    queryKey: ['/api/industry-sections'],
    queryFn: () => fetch('/api/industry-sections?active=true').then(res => res.json()),
  });

  if (isLoading || !sections || sections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-uniform-primary to-uniform-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-uniform-gold/20 text-uniform-gold text-sm font-semibold px-4 py-2 rounded-full mb-4">
            NUESTRAS ESPECIALIDADES
          </div>
          <h2 className="text-4xl font-poppins font-black text-white mb-4">
            Uniformes por Industria
          </h2>
          <p className="text-lg text-white/90 font-roboto max-w-3xl mx-auto">
            Cada sector tiene necesidades únicas. Descubre nuestras soluciones especializadas
            diseñadas específicamente para tu industria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section: IndustrySection) => (
            <div
              key={section.id}
              className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: section.backgroundColor }}
            >
              {/* Background Image */}
              {section.imageUrl && (
                <div className="absolute inset-0">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="relative p-6 h-full flex flex-col justify-between min-h-[280px]">
                <div>
                  {/* Badge */}
                  <div className="inline-block bg-uniform-gold text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                    ESPECIALIDAD
                  </div>

                  {/* Icon */}
                  <div className="mb-4" style={{ color: section.textColor }}>
                    <IndustryIcon industry={section.industry} className="w-16 h-16" />
                  </div>

                  {/* Title and Description */}
                  <h3
                    className="text-2xl font-poppins font-black mb-2"
                    style={{ color: section.textColor }}
                  >
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p
                      className="text-sm font-roboto font-medium mb-4"
                      style={{ color: section.textColor }}
                    >
                      {section.subtitle}
                    </p>
                  )}
                  {section.description && (
                    <p
                      className="text-sm font-roboto opacity-90"
                      style={{ color: section.textColor }}
                    >
                      {section.description}
                    </p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  <Link href={section.linkUrl || `/store/catalog?category=${section.industry}`}>
                    <Button
                      variant="outline"
                      className="flex-1 text-sm font-semibold hover:scale-105 transition-transform duration-200"
                      style={{
                        borderColor: section.textColor,
                        color: section.textColor,
                        backgroundColor: 'transparent'
                      }}
                    >
                      {section.buttonText || 'Explorar productos'} →
                    </Button>
                  </Link>
                  <Link href="/store/quote-request">
                    <Button
                      className="flex-1 text-sm font-semibold bg-uniform-gold text-black hover:bg-uniform-gold/90 hover:scale-105 transition-all duration-200"
                    >
                      Ver más
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics - Reduced version */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/30">
          <div className="text-center">
            <div className="text-xl font-poppins font-black text-uniform-gold drop-shadow-lg">500+</div>
            <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Empresas Satisfechas</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-poppins font-black text-uniform-gold drop-shadow-lg">15+</div>
            <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Años de Experiencia</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-poppins font-black text-uniform-gold drop-shadow-lg">24h</div>
            <div className="text-xs text-white font-roboto font-medium drop-shadow-sm">Respuesta Garantizada</div>
          </div>
        </div>
      </div>
    </section>
  );
}