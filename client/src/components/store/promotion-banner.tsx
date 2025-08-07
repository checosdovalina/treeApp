import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@shared/schema";

interface PromotionBannerProps {
  showDismiss?: boolean;
  autoRotate?: boolean;
  rotationInterval?: number;
}

export default function PromotionBanner({ 
  showDismiss = true, 
  autoRotate = true, 
  rotationInterval = 5000 
}: PromotionBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
    refetchInterval: 60000, // Check for new promotions every minute
  });

  // Debug logging (remove in production)
  // console.log('PromotionBanner - isLoading:', isLoading);
  // console.log('PromotionBanner - promotions:', promotions);
  // console.log('PromotionBanner - promotions.length:', promotions.length);
  // console.log('PromotionBanner - isDismissed:', isDismissed);

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

  if (isLoading) {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  if (promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];
  // console.log('PromotionBanner - currentPromotion:', currentPromotion);
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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Banner */}
      <div
        className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] xl:h-[600px] flex items-center justify-center cursor-pointer transition-all duration-700 hover:brightness-110 group"
        onClick={handleBannerClick}
      >
        {/* Background Image - Full prominence */}
        {currentPromotion.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${currentPromotion.imageUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"
            style={{
              backgroundColor: currentPromotion.backgroundColor || "#1F4287",
            }}
          />
        )}
        
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Main Title */}
            <h1 
              className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black drop-shadow-2xl leading-tight tracking-tight"
              style={{ 
                color: currentPromotion.textColor || "#FFFFFF",
                textShadow: "3px 3px 6px rgba(0,0,0,0.9)"
              }}
            >
              {currentPromotion.title}
            </h1>
            
            {/* Description */}
            {currentPromotion.description && (
              <p 
                className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl drop-shadow-lg max-w-5xl mx-auto leading-relaxed font-semibold px-2"
                style={{ 
                  color: currentPromotion.textColor || "#FFFFFF",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                }}
              >
                {currentPromotion.description}
              </p>
            )}
            
            {/* Promo Code - Responsive sizing */}
            {currentPromotion.promoCode && (
              <div className="flex flex-col items-center space-y-2 md:space-y-4">
                <span 
                  className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold"
                  style={{ color: currentPromotion.textColor || "#FFFFFF" }}
                >
                  Usa el código:
                </span>
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-12 lg:py-6 rounded-2xl text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-mono font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 md:border-4 border-yellow-300 animate-pulse">
                  {currentPromotion.promoCode}
                </span>
              </div>
            )}
            
            {/* Call to action */}
            <div 
              className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-bold animate-bounce mt-2 md:mt-4"
              style={{ 
                color: currentPromotion.textColor || "#FFFFFF",
                textShadow: "2px 2px 4px rgba(0,0,0,0.9)"
              }}
            >
              🛒 ¡Aprovecha esta oferta limitada!
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Responsive sizing */}
        {promotions.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-2 sm:left-4 md:left-8 lg:left-12 top-1/2 transform -translate-y-1/2 text-white hover:text-black hover:bg-white h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 p-0 bg-black/60 backdrop-blur-xl border-2 md:border-3 border-white/50 rounded-full shadow-2xl hover:shadow-white/40 transition-all duration-500 hover:scale-110 z-20"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="absolute right-2 sm:right-4 md:right-8 lg:right-12 top-1/2 transform -translate-y-1/2 text-white hover:text-black hover:bg-white h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 p-0 bg-black/60 backdrop-blur-xl border-2 md:border-3 border-white/50 rounded-full shadow-2xl hover:shadow-white/40 transition-all duration-500 hover:scale-110 z-20"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12" />
            </Button>
          </>
        )}

        {/* Dismiss Button - Top right, responsive */}
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white hover:text-red-500 hover:bg-white h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 bg-black/50 backdrop-blur-lg border-2 border-white/40 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>

      {/* Dots Indicator - Responsive hero style */}
      {promotions.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 sm:space-x-4 md:space-x-6 bg-black/50 backdrop-blur-xl px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-full border-2 md:border-3 border-white/40 shadow-2xl">
          {promotions.map((_, index: number) => (
            <button
              key={index}
              className={`w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full transition-all duration-500 border-2 md:border-3 shadow-2xl ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 border-yellow-200 scale-125 md:scale-150 shadow-yellow-400/70 animate-pulse' 
                  : 'bg-white/60 border-white/80 hover:bg-white/90 hover:scale-110 md:hover:scale-125 hover:border-white hover:shadow-white/40'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Optional: Create a simpler version for smaller spaces
export function CompactPromotionBanner() {
  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions/active"],
  });

  if (promotions.length === 0) return null;

  const promotion = promotions[0]; // Show only the first active promotion

  return (
    <div
      className="h-12 flex items-center justify-center text-sm font-medium cursor-pointer"
      style={{
        backgroundColor: promotion.backgroundColor || "#1F4287",
        color: promotion.textColor || "#FFFFFF",
      }}
      onClick={() => {
        if (promotion.linkUrl) {
          window.open(promotion.linkUrl, '_blank');
        }
      }}
    >
      <div className="flex items-center space-x-2">
        <span>{promotion.title}</span>
        {promotion.promoCode && (
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-mono">
            {promotion.promoCode}
          </span>
        )}
      </div>
    </div>
  );
}