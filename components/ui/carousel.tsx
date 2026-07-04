"use client";

// A minimal, dependency-free carousel (scroll-snap + prev/next). embla-carousel is not
// installed; this keeps a small footprint. See DEPS_NEEDED.md for the richer alternative.
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CarouselContext = React.createContext<{
  scrollPrev: () => void;
  scrollNext: () => void;
  register: (el: HTMLDivElement | null) => void;
} | null>(null);

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = "horizontal", className, children, ...props }, ref) => {
    const trackRef = React.useRef<HTMLDivElement | null>(null);

    const scrollBy = (dir: 1 | -1) => {
      const el = trackRef.current;
      if (!el) return;
      const amount = orientation === "horizontal" ? el.clientWidth : el.clientHeight;
      // `scrollBy` is undefined in some non-DOM environments (e.g. jsdom); guard it.
      el.scrollBy?.(
        orientation === "horizontal"
          ? { left: dir * amount, behavior: "smooth" }
          : { top: dir * amount, behavior: "smooth" },
      );
    };

    const value = React.useMemo(
      () => ({
        scrollPrev: () => scrollBy(-1),
        scrollNext: () => scrollBy(1),
        register: (el: HTMLDivElement | null) => {
          trackRef.current = el;
        },
      }),
      [orientation],
    );

    return (
      <CarouselContext.Provider value={value}>
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  return (
    <div
      ref={(el) => {
        ctx?.register(el);
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={cn(
        "flex snap-mandatory scroll-smooth",
        orientation === "horizontal"
          ? "flex-row snap-x overflow-x-auto"
          : "flex-col snap-y overflow-y-auto",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full snap-start", className)}
      {...props}
    />
  ),
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      aria-label="Previous slide"
      className={cn("absolute left-2 top-1/2 -translate-y-1/2 rounded-full", className)}
      onClick={() => ctx?.scrollPrev()}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => {
    const ctx = React.useContext(CarouselContext);
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        aria-label="Next slide"
        className={cn("absolute right-2 top-1/2 -translate-y-1/2 rounded-full", className)}
        onClick={() => ctx?.scrollNext()}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
