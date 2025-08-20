import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import type { Promotion } from "@shared/schema";

interface Promotion {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  ctaText?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

interface SimplePromotionBannerProps {
  showDismiss?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number;
  height?: 'small' | 'medium' | 'large';
}

export default function SimplePromotionBanner({ 
  showDismiss = false, 
  autoRotate = true, 
  rotationInterval = 5000,
  height = 'small'
}: SimplePromotionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
    refetchInterval: 60000, // Check for new promotions every minute
  });

  // Auto rotation
  useEffect(() => {
    if (!autoRotate || promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, promotions.length, rotationInterval]);

  // Reset index when promotions change
  useEffect(() => {
    setCurrentIndex(0);
  }, [promotions]);

  if (isLoading || isDismissed || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];
  if (!currentPromotion) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleBannerClick = () => {
    if (currentPromotion.linkUrl) {
      window.open(currentPromotion.linkUrl, '_blank');
    }
  };

  const heightClasses = {
    small: 'h-32',
    medium: 'h-48', 
    large: 'h-96'
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
      {/* Banner Content */}
      <div 
        className={`relative ${heightClasses[height]} flex items-center justify-center cursor-pointer`}
        onClick={handleBannerClick}
        style={{
          backgroundImage: currentPromotion.imageUrl ? `url(${currentPromotion.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
            {currentPromotion.title}
          </h2>
          {currentPromotion.description && (
            <p className="text-lg md:text-2xl lg:text-3xl xl:text-4xl opacity-90 max-w-5xl mx-auto mb-8">
              {currentPromotion.description}
            </p>
          )}
          {currentPromotion.linkUrl && (
            <Button 
              size="lg" 
              className="mt-8 bg-white text-blue-700 hover:bg-gray-100 text-xl px-12 py-4 font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                handleBannerClick();
              }}
            >
              Ver más
            </Button>
          )}
        </div>

        {/* Navigation arrows - only show if multiple promotions */}
        {promotions.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all"
              aria-label="Promoción anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-all"
              aria-label="Siguiente promoción"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dismiss button */}
        {showDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 text-white transition-all"
            aria-label="Cerrar banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Indicators - only show if multiple promotions */}
        {promotions.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Ir a promoción ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}