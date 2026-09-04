import { useEffect, useState, type ReactNode } from "react";

interface Props {
  images: { src: string; alt: string }[];
  interval?: number; // ms
  overlay?: string;
  minHeight?: string;
  children?: ReactNode;
}

export function HeroSlideshow({
  images,
  interval = 6000,
  overlay,
  minHeight = "100svh",
  children,
}: Props) {
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });

  // Preload all slideshow images in the background so transitions are instant
  useEffect(() => {
    images.forEach((img) => {
      if (img.src) {
        const i = new Image();
        i.src = img.src;
      }
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  useEffect(() => {
    setVisited((prev) => {
      if (prev[active]) return prev;
      return { ...prev, [active]: true };
    });
  }, [active]);


  return (
    <div className="relative overflow-hidden flex flex-col justify-center" style={{ minHeight }}>
      {/* Layered images crossfade */}
      <div className="absolute inset-0">
        {images.map((img, i) => {
          if (!visited[i]) return null;
          return (
            <img decoding="async"
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out will-change-[opacity,transform]"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? "scale(1.05)" : "scale(1)",
                transitionProperty: "opacity, transform",
                transitionDuration: i === active ? "1500ms, 7000ms" : "1500ms, 0ms",
              }}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
          );
        })}
      </div>

      {overlay && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: overlay }} />
      )}

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-200 cursor-pointer ${
                i === active ? "w-8 bg-white shadow-sm" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full h-full flex flex-col justify-center">{children}</div>
    </div>
  );
}

