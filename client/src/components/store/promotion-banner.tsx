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
      {/* Main Banner */}
      <div
        className="relative h-32 md:h-40 flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-[1.01] shadow-xl"
        onClick={handleBannerClick}
      >
        {/* Background Image - More prominent */}
        {currentPromotion.imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentPromotion.imageUrl})` }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: currentPromotion.backgroundColor || "#1F4287",
            }}
          />
        )}
        
        {/* Strong gradient overlay for text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"
          style={{
            background: currentPromotion.imageUrl 
              ? 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.5), rgba(0,0,0,0.8))'
              : 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-8">
            <h3 
              className="text-2xl md:text-3xl font-bold drop-shadow-2xl"
              style={{ color: currentPromotion.textColor || "#FFFFFF" }}
            >
              {currentPromotion.title}
            </h3>
            {currentPromotion.description && (
              <p 
                className="text-base md:text-xl drop-shadow-lg max-w-lg leading-relaxed"
                style={{ color: currentPromotion.textColor || "#FFFFFF" }}
              >
                {currentPromotion.description}
              </p>
            )}
            {currentPromotion.promoCode && (
              <div className="flex items-center space-x-3">
                <span 
                  className="text-sm md:text-base font-medium"
                  style={{ color: currentPromotion.textColor || "#FFFFFF" }}
                >
                  Código:
                </span>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-lg text-base md:text-lg font-mono font-bold shadow-2xl transform hover:scale-105 transition-transform duration-200 border-2 border-yellow-300">
                  {currentPromotion.promoCode}
                </span>
              </div>
            )}
          </div>
          
          {/* Call to action indicator */}
          <div 
            className="mt-3 text-sm md:text-base font-medium animate-pulse"
            style={{ color: currentPromotion.textColor || "#FFFFFF" }}
          >
            🛍️ Haz clic para aprovechar esta oferta
          </div>
        </div>

        {/* Navigation Arrows - Only show if multiple promotions */}
        {promotions.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-3 md:left-6 text-white hover:bg-white hover:bg-opacity-40 h-12 w-12 p-0 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-16 md:right-20 text-white hover:bg-white hover:bg-opacity-40 h-12 w-12 p-0 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-full shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Dismiss Button */}
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 md:right-6 text-white hover:bg-red-500 hover:bg-opacity-90 h-10 w-10 p-0 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Dots Indicator - Only show if multiple promotions */}
      {promotions.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          {promotions.map((_, index: number) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 shadow-xl ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 scale-125 shadow-yellow-400/50' 
                  : 'bg-white/40 border-white/60 hover:bg-white/70 hover:scale-110 hover:border-white'
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