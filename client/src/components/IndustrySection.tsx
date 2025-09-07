import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { type IndustrySection } from "@shared/schema";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const { data: sections, isLoading, isError } = useQuery({
    queryKey: ['/api/industry-sections'],
    queryFn: async () => {
      const res = await fetch('/api/industry-sections?active=true');
      if (!res.ok) {
        throw new Error('Failed to fetch industry sections');
      }
      return res.json();
    },
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading || isError || !sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-uniform-gold/20 text-uniform-gold text-sm font-semibold px-4 py-2 rounded-full mb-4">
            EXPLORA NUESTRAS OPCIONES
          </div>
          <h2 className="text-3xl md:text-4xl font-poppins font-black text-white mb-2">
            CATEGORÍAS DISPONIBLES
          </h2>
          <p className="text-lg text-white/90 font-roboto max-w-2xl mx-auto">
            Descubre nuestra amplia gama de uniformes profesionales especializados
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 ${
              !canScrollPrev ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 ${
              !canScrollNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden mx-8" ref={emblaRef}>
            <div className="flex gap-6">
              {sections.map((section: IndustrySection) => (
                <div
                  key={section.id}
                  className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex-none w-80"
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
                      {/* Icon */}
                      <div className="mb-4" style={{ color: section.textColor || '#ffffff' }}>
                        <IndustryIcon industry={section.industry} className="w-16 h-16" />
                      </div>

                      {/* Title and Description */}
                      <h3
                        className="text-2xl font-poppins font-black mb-2"
                        style={{ color: section.textColor || '#ffffff' }}
                      >
                        {section.title}
                      </h3>
                      {section.subtitle && (
                        <p
                          className="text-sm font-roboto font-medium mb-4"
                          style={{ color: section.textColor || '#ffffff' }}
                        >
                          {section.subtitle}
                        </p>
                      )}
                      {section.description && (
                        <p
                          className="text-sm font-roboto opacity-90"
                          style={{ color: section.textColor || '#ffffff' }}
                        >
                          {section.description}
                        </p>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2 mt-6">
                      <Link href={section.linkUrl || `/store/catalog?category=${section.industry}`}>
                        <Button
                          variant="outline"
                          className="w-full text-sm font-semibold hover:scale-105 transition-transform duration-200"
                          style={{
                            borderColor: section.textColor || '#ffffff',
                            color: section.textColor || '#ffffff',
                            backgroundColor: 'transparent'
                          }}
                        >
                          {section.buttonText || 'EXPLORAR CATÁLOGO'} →
                        </Button>
                      </Link>
                      <Link href="/store/quote-request">
                        <Button
                          className="w-full text-sm font-semibold bg-uniform-gold text-black hover:bg-uniform-gold/90 hover:scale-105 transition-all duration-200"
                        >
                          SOLICITAR COTIZACIÓN
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section with "Soluciones Completas" */}
        <div className="text-center mt-12 pt-8 border-t border-white/30">
          <h4 className="text-2xl font-poppins font-black text-uniform-gold mb-2">
            Soluciones Completas
          </h4>
          <p className="text-white/90 font-roboto">
            Desde el diseño hasta la entrega
          </p>
        </div>
      </div>
    </section>
  );
}