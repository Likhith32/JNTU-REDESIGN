export interface PressNote {
  id: string;
  slug: string;
  category: string;
  title: string;
  homepageDisplayDate: string; // "19 AUG 2026"
  publishedAt: string; // "03/08/2026 21:13"
  documentDate: string; // "03/08/2026"
  revisedDate: string; // "19/08/2026"
  status: "Published" | "Archived" | "Draft";
  excerpt: string;
  documentUrl: string;
  documentName: string;
  heading: string;
  subject: string;
  references: string[];
  schedule: {
    activity: string;
    existingDate: string;
    revisedDate: string;
  }[];
  notes: string[];
  signedBy: string;
  isCustom?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  category?: string;
  duration?: string;
  isAvailable?: boolean;
  isCustom?: boolean;
}

// ── Default Real University Press Notes (Empty until published) ──
export const PRESS_NOTES: PressNote[] = [];

// ── Official Supplied Videos Dataset ──
export const VIDEOS: VideoItem[] = [
  {
    id: "video-1",
    title: "JNTUGV-80th Independence Day Celebrations-2026",
    youtubeId: "D_NEmEYQ0cc", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=D_NEmEYQ0cc",
    category: "Campus Events",
    isAvailable: true,
  },
  {
    id: "video-2",
    title: "JNTU-GV 1st Convocation 2026 Highlights",
    youtubeId: "owP9inWL0v0", // Fixed - added the correct YouTube ID
    youtubeUrl: "https://www.youtube.com/watch?v=owP9inWL0v0",
    category: "Convocation",
    isAvailable: true, // Changed to true
  },
  {
    id: "video-3",
    title: "JNTU-GV 1st Convocation LIVE",
    youtubeId: "Uh-jubgP4u4", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=Uh-jubgP4u4",
    category: "Convocation",
    isAvailable: true,
  },
  {
    id: "video-4",
    title: "JNTUGV- CEV - Annual & Sports Day Celebrations 2025 - Part 1",
    youtubeId: "nZrDBmIszLI", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=nZrDBmIszLI",
    category: "Annual Day",
    isAvailable: true,
  },
  {
    id: "video-5",
    title: "JNTU-GV CEV Annual and Sports Day 2025 - Part 2",
    youtubeId: "MaBKBua5tSU", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=MaBKBua5tSU",
    category: "Annual Day",
    isAvailable: true,
  },
  {
    id: "video-6",
    title: "JNTU-GV CEV Annual and Sports Day 2025 - Part 3",
    youtubeId: "_OisHrlRB4o", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=_OisHrlRB4o",
    category: "Annual Day",
    isAvailable: true,
  },
  {
    id: "video-7",
    title: "JNTU-GV Campus Tour 2026",
    youtubeId: "o6Fku5fkDmw", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=o6Fku5fkDmw",
    category: "Campus Tour",
    isAvailable: true,
  },
  {
    id: "video-8",
    title: "JNTU Gurajada Opens Germany Job Opportunities for ITI Students || Yuva",
    youtubeId: "_E7Is-_h8u8", // Works
    youtubeUrl: "https://www.youtube.com/watch?v=_E7Is-_h8u8",
    category: "Career & Global",
    isAvailable: true,
  },
];

export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : trimmed;
}

export function getYouTubeThumbnail(videoId: string): string {
  if (!videoId) return "/images/hero-carousal/hero-campus.webp";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeFallbackThumbnail(videoId: string): string {
  if (!videoId) return "/images/hero-carousal/hero-campus.webp";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ── Local Storage Admin Sync Helpers (Recent items first) ──
const PRESS_NOTES_STORAGE_KEY = "jntugv_custom_press_notes_v1";
const VIDEOS_STORAGE_KEY = "jntugv_custom_videos_v1";

export function getActivePressNotes(): PressNote[] {
  if (typeof window === "undefined") return PRESS_NOTES;
  try {
    const raw = localStorage.getItem(PRESS_NOTES_STORAGE_KEY);
    if (!raw) return PRESS_NOTES;
    const custom = JSON.parse(raw);
    if (Array.isArray(custom) && custom.length > 0) {
      // Recent custom items first, followed by default press notes
      const existingSlugs = new Set(custom.map((c: PressNote) => c.slug));
      const remainingDefaults = PRESS_NOTES.filter((d) => !existingSlugs.has(d.slug));
      return [...custom, ...remainingDefaults];
    }
  } catch (e) {
    console.error("Failed to load custom press notes:", e);
  }
  return PRESS_NOTES;
}

export function savePressNoteToStorage(newNote: PressNote): PressNote[] {
  if (typeof window === "undefined") return PRESS_NOTES;
  try {
    const current = getActivePressNotes();
    const filtered = current.filter((n) => n.id !== newNote.id && n.slug !== newNote.slug);
    const updated = [newNote, ...filtered]; // Recent comes FIRST
    localStorage.setItem(PRESS_NOTES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("jntugv_press_notes_updated"));
    return updated;
  } catch (e) {
    console.error("Failed to save custom press note:", e);
    return PRESS_NOTES;
  }
}

export function deletePressNoteFromStorage(id: string): PressNote[] {
  if (typeof window === "undefined") return PRESS_NOTES;
  try {
    const current = getActivePressNotes();
    const updated = current.filter((n) => n.id !== id);
    localStorage.setItem(PRESS_NOTES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("jntugv_press_notes_updated"));
    return updated;
  } catch (e) {
    console.error("Failed to delete custom press note:", e);
    return PRESS_NOTES;
  }
}

export function getActiveVideos(): VideoItem[] {
  if (typeof window === "undefined") return VIDEOS;
  try {
    const raw = localStorage.getItem(VIDEOS_STORAGE_KEY);
    if (!raw) return VIDEOS;
    const custom = JSON.parse(raw);
    if (Array.isArray(custom) && custom.length > 0) {
      // Recent custom videos first, followed by defaults
      const existingIds = new Set(custom.map((c: VideoItem) => c.id));
      const remainingDefaults = VIDEOS.filter((d) => !existingIds.has(d.id));
      return [...custom, ...remainingDefaults];
    }
  } catch (e) {
    console.error("Failed to load custom videos:", e);
  }
  return VIDEOS;
}

export function saveVideoToStorage(newVideo: VideoItem): VideoItem[] {
  if (typeof window === "undefined") return VIDEOS;
  try {
    const current = getActiveVideos();
    const filtered = current.filter((v) => v.id !== newVideo.id);
    const updated = [newVideo, ...filtered]; // Recent comes FIRST
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("jntugv_videos_updated"));
    return updated;
  } catch (e) {
    console.error("Failed to save custom video:", e);
    return VIDEOS;
  }
}

export function deleteVideoFromStorage(id: string): VideoItem[] {
  if (typeof window === "undefined") return VIDEOS;
  try {
    const current = getActiveVideos();
    const updated = current.filter((v) => v.id !== id);
    localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("jntugv_videos_updated"));
    return updated;
  } catch (e) {
    console.error("Failed to delete custom video:", e);
    return VIDEOS;
  }
}
