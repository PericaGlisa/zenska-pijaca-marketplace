import { useState, useRef, useEffect, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onError?: () => void;
}

/**
 * OptimizedImage component with:
 * - Native lazy loading with Intersection Observer
 * - Blur-up placeholder effect
 * - Progressive loading
 * - Error handling with fallback
 * - Optimized rendering with memo
 */
const OptimizedImage = memo(({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  priority = false,
  onError,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate tiny placeholder URL for blur effect (using smaller size)
  const getPlaceholderSrc = (originalSrc: string): string => {
    if (originalSrc.includes("unsplash.com")) {
      // For Unsplash, request a tiny version for blur placeholder
      return originalSrc.replace(/w=\d+/, "w=20").replace(/h=\d+/, "h=20") + "&blur=10";
    }
    return originalSrc;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        containerClassName
      )}
    >
      {/* Blur placeholder - shows immediately */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: isInView ? `url(${getPlaceholderSrc(src)})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}

      {/* Loading skeleton when not in view */}
      {!isInView && (
        <div className="absolute inset-0 bg-muted" />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
