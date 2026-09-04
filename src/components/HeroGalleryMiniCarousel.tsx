import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import { JntugvGalleryItem } from "@/funcs/site.server";

interface HeroGalleryMiniCarouselProps {
  galleryImages?: JntugvGalleryItem[];
  dbGallery?: Array<{ id: number; src: string; caption?: string | null; createdAt?: string }>;
}

interface SlideItem {
  id: number | string;
  title: string;
  date?: string;
  src: string;
  description?: string;
  isNew?: boolean;
}

export function HeroGalleryMiniCarousel({
  galleryImages = [],
  dbGallery = [],
}: HeroGalleryMiniCarouselProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  // Build unique slides prioritized:
  // 1. Any newly uploaded DB gallery photos (sorted newest first)
  // 2. Featured 80th Independence Day photo
  // 3. Latest external API gallery photos
  const slides = useMemo(() => {
    const uniqueItemsMap = new Map<string, SlideItem>();

    // 1. Newly uploaded images from database gallery (newest on top)
    for (const dbItem of dbGallery) {
      if (!dbItem.src) continue;
      const cleanTitle = (dbItem.caption || "Campus Moment").trim();
      const cleanKey = cleanTitle.toLowerCase();
      if (!uniqueItemsMap.has(cleanKey)) {
        uniqueItemsMap.set(cleanKey, {
          id: `db-${dbItem.id}`,
          title: cleanTitle,
          date: "Recently Added",
          src: dbItem.src,
          isNew: true,
        });
      }
      if (uniqueItemsMap.size >= 6) break;
    }

    // 2. Featured Independence Day celebration (if not already included)
    if (!uniqueItemsMap.has("independence-day")) {
      uniqueItemsMap.set("independence-day", {
        id: "featured-independence-day",
        title: "80th Independence Day Celebrations at JNTU-GV",
        date: "Aug 15, 2026",
        src: "/images/independence_day.webp",
        description:
          "Grand celebrations at JNTU-GV campus in presence of Hon'ble Vice-Chancellor, Registrar & Faculty.",
      });
    }

    // 3. Add latest gallery images from API dataset (strictly sorted by latest date)
    const sortedGallery = [...galleryImages].sort((a, b) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    });

    for (const img of sortedGallery) {
      const rawTitle = (img.title || "").trim();
      const cleanKey = rawTitle.toLowerCase();

      // Skip duplicate of independence day or already present
      if (
        img.id === 166 ||
        cleanKey.includes("independence day") ||
        uniqueItemsMap.has(cleanKey)
      ) {
        continue;
      }

      if (img.imglink || img.file_path) {
        uniqueItemsMap.set(cleanKey, {
          id: img.id,
          title: rawTitle || "Campus Highlights",
          date: img.date
            ? new Date(img.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Campus Moment",
          src: img.imglink || img.file_path,
          description: img.description,
        });
      }

      if (uniqueItemsMap.size >= 8) break;
    }

    // 4. Fallback high-res campus items if needed (using fast local webp)
    if (uniqueItemsMap.size < 4) {
      const fallbackList = [
        {
          id: "fallback-admin",
          title: "Campus Administration & Main Building",
          date: "Campus Hub",
          src: "/images/gallery/IMG_6832.webp",
        },
        {
          id: "fallback-library",
          title: "Central Knowledge Commons & Library",
          date: "Academic Hub",
          src: "/images/gallery/IMG_6859.webp",
        },
        {
          id: "fallback-fest",
          title: "Cultural Fest & Student Celebrations",
          date: "Campus Culture",
          src: "/images/gallery/IMG_6840.webp",
        },
        {
          id: "fallback-sports",
          title: "Annual Sports Meet & Athletics",
          date: "Sports Arena",
          src: "/images/gallery/IMG_6872.webp",
        },
      ];

      for (const fb of fallbackList) {
        if (!uniqueItemsMap.has(fb.title.toLowerCase()) && uniqueItemsMap.size < 6) {
          uniqueItemsMap.set(fb.title.toLowerCase(), fb);
        }
      }
    }

    return Array.from(uniqueItemsMap.values()).slice(0, 6);
  }, [galleryImages, dbGallery]);

  // High-performance image pre-caching: pre-loads all images in memory as soon as slides change
  useEffect(() => {
    slides.forEach((slide) => {
      const url = getAssetUrl(slide.src);
      if (url && typeof window !== "undefined") {
        const img = new Image();
        img.src = url;
      }
    });
  }, [slides]);

  // Auto-rotate every 2.8s
  useEffect(() => {
    if (isMinimized || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [isMinimized, isPaused, slides.length, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  const slideVariants: import("framer-motion").Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="w-full flex justify-end select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Capsule Button aligned to the Right */
          <motion.div
            key="minimized-capsule"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-end w-full"
          >
            <button
              onClick={() => setIsMinimized(false)}
              className="group flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all cursor-pointer hover:scale-105 active:scale-95 hover:border-white/60"
              title="Expand Campus Highlights"
              aria-label="Expand Campus Highlights"
            >
              <Sparkles className="h-4 w-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-xs whitespace-nowrap">
                Campus Highlights
              </span>
              <Maximize2 className="h-3.5 w-3.5 text-white/80 group-hover:text-white transition-colors ml-0.5" />
            </button>
          </motion.div>
        ) : (
          /* Expanded Full Glassmorphic Carousel */
          <motion.div
            key="expanded-carousel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[540px] xl:max-w-[580px] 2xl:max-w-[660px] 3xl:max-w-[720px] rounded-3xl overflow-hidden bg-white/20 backdrop-blur-2xl border border-white/35 shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-white group"
          >
            {/* Top Light Glassmorphic Header without slide numbers */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/25 backdrop-blur-md border-b border-white/25">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/35 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  Campus Highlights
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/25 transition-all cursor-pointer border border-white/20 hover:border-white/40"
                  title="Minimize carousel"
                  aria-label="Minimize carousel"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Carousel Slide Stage */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900/40">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentSlide.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={getAssetUrl(currentSlide.src)}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("independence_day.jpeg")) {
                        target.src = "/images/independence_day.jpeg";
                      } else {
                        target.src = "/images/hero-carousal/hero-campus.webp";
                      }
                    }}
                  />
                  {/* Frosted vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows on Hover */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/40 z-20 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/25 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-white/40 z-20 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Bottom Details Overlay on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  {currentSlide.date && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/25 border border-white/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      <Calendar className="h-3 w-3 text-cyan-200" />
                      {currentSlide.date}
                    </span>
                  )}
                  {currentSlide.isNew && (
                    <span className="text-[11px] font-extrabold text-emerald-200 bg-emerald-500/30 border border-emerald-300/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      New
                    </span>
                  )}
                  {currentIndex === 0 && !currentSlide.isNew && (
                    <span className="text-[11px] font-extrabold text-amber-200 bg-amber-500/30 border border-amber-300/40 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-2xs">
                      Featured
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
                  {currentSlide.title}
                </h4>
              </div>
            </div>

            {/* Bottom Footer Bar with Dots and Gallery Link */}
            <div className="px-4 py-3 bg-white/20 backdrop-blur-md flex items-center justify-between gap-3 border-t border-white/25">
              {/* Animated Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? "w-6 bg-white shadow-sm"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* View Full Gallery Link */}
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-cyan-200 bg-white/15 hover:bg-white/25 border border-white/30 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
              >
                <span>View Gallery</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
