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
        className="relative h-48 md:h-64 lg:h-80 flex items-center justify-center cursor-pointer transition-all duration-700 hover:brightness-110 group"
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
          <div className="space-y-6">
            {/* Main Title */}
            <h1 
              className="text-3xl md:text-5xl lg:text-6xl font-bold drop-shadow-2xl leading-tight"
              style={{ 
                color: currentPromotion.textColor || "#FFFFFF",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}
            >
              {currentPromotion.title}
            </h1>
            
            {/* Description */}
            {currentPromotion.description && (
              <p 
                className="text-lg md:text-2xl lg:text-3xl drop-shadow-lg max-w-4xl mx-auto leading-relaxed font-medium"
                style={{ 
                  color: currentPromotion.textColor || "#FFFFFF",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.7)"
                }}
              >
                {currentPromotion.description}
              </p>
            )}
            
            {/* Promo Code - More prominent */}
            {currentPromotion.promoCode && (
              <div className="flex flex-col items-center space-y-3">
                <span 
                  className="text-lg md:text-xl font-semibold"
                  style={{ color: currentPromotion.textColor || "#FFFFFF" }}
                >
                  Usa el código:
                </span>
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-2xl text-xl md:text-2xl lg:text-3xl font-mono font-black shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-yellow-300 animate-pulse">
                  {currentPromotion.promoCode}
                </span>
              </div>
            )}
            
            {/* Call to action */}
            <div 
              className="text-base md:text-lg lg:text-xl font-semibold animate-bounce"
              style={{ 
                color: currentPromotion.textColor || "#FFFFFF",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
              }}
            >
              🛒 ¡Aprovecha esta oferta limitada!
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Hero style */}
        {promotions.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-white hover:text-black hover:bg-white h-14 w-14 p-0 bg-black/50 backdrop-blur-lg border-2 border-white/40 rounded-full shadow-2xl hover:shadow-white/30 transition-all duration-500 hover:scale-125 z-20"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-white hover:text-black hover:bg-white h-14 w-14 p-0 bg-black/50 backdrop-blur-lg border-2 border-white/40 rounded-full shadow-2xl hover:shadow-white/30 transition-all duration-500 hover:scale-125 z-20"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Dismiss Button - Top right */}
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-red-500 hover:bg-white h-10 w-10 p-0 bg-black/50 backdrop-blur-lg border-2 border-white/40 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Dots Indicator - Hero style */}
      {promotions.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border-2 border-white/30 shadow-2xl">
          {promotions.map((_, index: number) => (
            <button
              key={index}
              className={`w-5 h-5 rounded-full transition-all duration-500 border-2 shadow-2xl ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 border-yellow-200 scale-150 shadow-yellow-400/70 animate-pulse' 
                  : 'bg-white/50 border-white/70 hover:bg-white/80 hover:scale-125 hover:border-white hover:shadow-white/30'
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