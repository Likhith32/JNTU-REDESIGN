const rawBase = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_ASSETS_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_ASSETS_URL) ||
  "http://89.116.134.182/local-assets"
).replace(/\/$/, "");
const BASE = rawBase.replace("89.116.134.182:8080", "89.116.134.182");

const assetUrlCache = new Map<string, string>();

export const getAssetUrl = (
  path: string | null | undefined,
): string => {
  if (!path) return undefined as unknown as string;

  const trimmedPath = path.trim();
  if (assetUrlCache.has(trimmedPath)) return assetUrlCache.get(trimmedPath)!;

  let resolvedUrl: string;

  if (
    trimmedPath.includes("Dr-G-J-NAGA-RAJU-latest.jpg") ||
    trimmedPath.includes("Dr.-G.-J.-Naga-Raju")
  ) {
    resolvedUrl = `${BASE}/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`;
  } else if (
    trimmedPath.startsWith("data:") ||
    trimmedPath.startsWith("/src/") ||
    trimmedPath.startsWith("/assets/") ||
    trimmedPath.startsWith("/images/") ||
    trimmedPath.startsWith("/@fs/") ||
    trimmedPath.startsWith("blob:") ||
    trimmedPath === "/logo-circle.png" ||
    trimmedPath === "/logo.png" ||
    trimmedPath === "/favicon.png"
  ) {
    resolvedUrl = trimmedPath;
  } else {
    // legacy map check
    const filename = trimmedPath.split("/").pop() ?? "";
    const LEGACY_FILENAME_MAP: Record<string, string> = {
      "hero-campus.jpg": "/images/hero-carousal/hero-campus.webp",
      "hero-campus.webp": "/images/hero-carousal/hero-campus.webp",
      "hero-2.jpg": "/images/hero-carousal/hero-2.webp",
      "hero-2.jpeg": "/images/hero-carousal/hero-2.webp",
      "hero-2.webp": "/images/hero-carousal/hero-2.webp",
      "hero-3.jpg": "/images/hero-carousal/hero-3.webp",
      "hero-3.jpeg": "/images/hero-carousal/hero-3.webp",
      "hero-3.webp": "/images/hero-carousal/hero-3.webp",
      "hero-4.jpg": "/images/hero-carousal/hero-4.webp",
      "hero-4.jpeg": "/images/hero-carousal/hero-4.webp",
      "hero-4.webp": "/images/hero-carousal/hero-4.webp",
      "hero-5.jpg": "/images/hero-carousal/hero-5.webp",
      "hero-5.jpeg": "/images/hero-carousal/hero-5.webp",
      "hero-5.webp": "/images/hero-carousal/hero-5.webp",
      "independence_day.webp": "/images/independence_day.webp",
      "independence_day.jpeg": "/images/independence_day.webp",
      "independence-day-2026.jpg": "/images/independence_day.webp",
      "Dr.-G.-J.-Naga-Raju1.png": `${BASE}/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`,
      "Dr-G-J-NAGA-RAJU-latest.jpg": `${BASE}/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg`,
      "logo.jpeg": "/logo-circle.png",
      // Department banner instant local fallbacks
      "cse-banner.jpg": `${BASE}/uploads/departments/banners/cse-banner.jpg`,
  "ece-banner.jpg": `${BASE}/uploads/departments/banners/ece-banner.jpg`,
  "eee-banner.jpg": `${BASE}/uploads/departments/banners/eee-banner.jpg`,
  "it-banner.jpg": `${BASE}/uploads/departments/banners/it-banner.jpg`,
  "mech-banner.jpg": `${BASE}/uploads/departments/banners/mech-banner.jpg`,
  "met-banner.jpg": `${BASE}/uploads/departments/banners/met-banner.jpg`,
  "sh-banner.jpg": `${BASE}/uploads/departments/banners/sh-banner.jpg`,
  "mba-banner.jpg": `${BASE}/uploads/departments/banners/mba-banner.jpg`,
    };

    if (filename.startsWith("IMG_") && (filename.endsWith(".JPG") || filename.endsWith(".jpg") || filename.endsWith(".png") || filename.endsWith(".webp"))) {
      const baseName = filename.replace(/\.[^.]+$/, "");
      resolvedUrl = `/images/gallery/${baseName}.webp`;
    } else if (LEGACY_FILENAME_MAP[filename]) {
      resolvedUrl = LEGACY_FILENAME_MAP[filename];
    } else if (
      trimmedPath.startsWith("http://") ||
      trimmedPath.startsWith("https://")
    ) {
      const vpsMatch = trimmedPath.match(
        /^https?:\/\/89\.116\.134\.182(?::\d+)?\/*(?:local-assets\/*)?(.*)$/,
      );
      if (vpsMatch) {
        const relativePath = vpsMatch[1].replace(/\\/g, "/").replace(/^\/+/, "");
        resolvedUrl = `${BASE}/${relativePath}`;
      } else if (trimmedPath.includes("89.116.134.182:8080")) {
        resolvedUrl = trimmedPath.replace("89.116.134.182:8080", "89.116.134.182");
      } else if (trimmedPath.startsWith("http://localhost:8081/")) {
        const relativePath = trimmedPath.replace("http://localhost:8081/", "");
        resolvedUrl = `${BASE}/${relativePath.replace(/\\/g, "/").replace(/^\/+/, "")}`;
      } else if (trimmedPath.includes("jntugvcev.edu.in/wp-content/")) {
        const wpPath = trimmedPath.match(/wp-content\/(.+)/);
        if (wpPath) {
          const SPECIAL_WP_FILES = [
            "EEE-3.Dr_.V.S.VAKULA-Asst-Prof.jpg",
            "V.-Mani-Kumar-Photo-Mech.jpg",
            "WhatsApp-Image-2020-08-26-at-10.23.09-AM.jpeg",
          ];
          if (SPECIAL_WP_FILES.some((f) => trimmedPath.includes(f))) {
            resolvedUrl = `${BASE}/${wpPath[1]}`;
          } else {
            resolvedUrl = `${BASE}/wp-content/${wpPath[1]}`;
          }
        } else {
          resolvedUrl = trimmedPath;
        }
      } else {
        resolvedUrl = trimmedPath;
      }
    } else {
      let cleanPath = trimmedPath.replace(/\\/g, "/");
      if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
      if (cleanPath.startsWith("uploads/")) cleanPath = `local-assets/${cleanPath}`;
      if (cleanPath.startsWith("facilities/")) cleanPath = `local-assets/uploads/${cleanPath}`;
      const isDevEnv = 
        (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) ||
        (typeof process !== "undefined" && process.env?.NODE_ENV !== "production");

      if (cleanPath.startsWith("local-assets/")) {
        if (isDevEnv) {
          resolvedUrl = `/${cleanPath}`;
        } else {
          const subPath = cleanPath.substring("local-assets/".length);
          resolvedUrl = `${BASE}/${subPath}`;
        }
      } else {
        resolvedUrl = `${BASE}/${cleanPath}`;
      }
    }
  }

  assetUrlCache.set(trimmedPath, resolvedUrl);
  return resolvedUrl;
};

export const assetUrl = (
  path: string | null | undefined,
): string => {
  return getAssetUrl(path);
};

export const uploadUrl = (path: string) =>
  assetUrl(`uploads/${path}`);

export const docUrl = (path: string) =>
  assetUrl(`docs/${path}`);

/**
 * Use ONLY for CMS/DB-driven image paths (e.g. department/leadership images
 * coming from Neon). Do NOT pass local Vite-imported assets (e.g.
 * `import heroImg from "@/assets/hero-campus.jpg"`) through this function —
 * those are already resolved by the bundler and should be used directly.
 */
export const imageUrl = (path: string) =>
  assetUrl(`images/${path}`);

export const wpUrl = (
  oldUrl: string | null | undefined,
): string => {
  if (!oldUrl) return undefined as unknown as string;

  const wpMatch = oldUrl.match(/wp-content\/(.+)/);

  if (wpMatch) {
    return `${BASE}/wp-content/${wpMatch[1]}`;
  }

  const localMatch = oldUrl.match(/localhost:\d+\/(.+)/);

  if (localMatch) {
    return `${BASE}/${localMatch[1]}`;
  }

  if (
    oldUrl.startsWith("/uploads/") ||
    oldUrl.startsWith("/images/")
  ) {
    return `${BASE}${oldUrl}`;
  }

  return assetUrl(oldUrl);
};