import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Play,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
  Clock,
  Plus,
  Trash2,
  X,
  Video as VideoIcon,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  PressNote,
  VideoItem,
  getActivePressNotes,
  savePressNoteToStorage,
  deletePressNoteFromStorage,
  getActiveVideos,
  saveVideoToStorage,
  deleteVideoFromStorage,
  getYouTubeThumbnail,
  getYouTubeFallbackThumbnail,
  extractYouTubeId,
} from "@/data/latest-updates";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { VideoModal } from "@/components/VideoModal";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

export function LatestUpdatesSection() {
  const { isEditMode } = useAdmin();

  // ── Press Notes State ──
  const [pressNotes, setPressNotes] = useState<PressNote[]>([]);
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [noteDirection, setNoteDirection] = useState(0);
  const [isShufflingNote, setIsShufflingNote] = useState(false);

  // ── Videos State ──
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [videoDirection, setVideoDirection] = useState(0);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [selectedModalVideo, setSelectedModalVideo] = useState<VideoItem | null>(null);
  // Track thumbnail URL for each video
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<string, string>>({});

  // ── Admin Modal States ──
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  // Form states for new Press Note
  const [newNoteForm, setNewNoteForm] = useState({
    title: "",
    category: "PRESS NOTE",
    homepageDisplayDate: "",
    publishedAt: "",
    documentDate: "",
    revisedDate: "",
    status: "Published" as const,
    excerpt: "",
    documentUrl: "",
    documentName: "",
    heading: "EXTENSION OF TIMELINES",
    subject: "",
  });

  // Form states for new Video
  const [newVideoForm, setNewVideoForm] = useState({
    title: "",
    youtubeInput: "",
    category: "Campus Events",
  });

  // Load and subscribe to live data
  useEffect(() => {
    const loadData = () => {
      const loadedVideos = getActiveVideos();
      setPressNotes(getActivePressNotes());
      setVideos(loadedVideos);

      // Pre-load thumbnail URLs for all videos
      const urls: Record<string, string> = {};
      loadedVideos.forEach(video => {
        if (video.youtubeId) {
          // Start with maxres, will fallback if needed
          urls[video.id] = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
        }
      });
      setThumbnailUrls(urls);
    };
    loadData();

    window.addEventListener("jntugv_press_notes_updated", loadData);
    window.addEventListener("jntugv_videos_updated", loadData);
    return () => {
      window.removeEventListener("jntugv_press_notes_updated", loadData);
      window.removeEventListener("jntugv_videos_updated", loadData);
    };
  }, []);

  const displayVideos = videos.length > 0 ? videos : [];
  const currentNote = pressNotes[activeNoteIndex] || pressNotes[0];
  const currentVideo = displayVideos[activeVideoIndex] || displayVideos[0];

  // ── Auto-advance Video Carousel Every 3 Seconds ──
  useEffect(() => {
    if (isHoveringVideo || Boolean(selectedModalVideo) || displayVideos.length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      setVideoDirection(1);
      setActiveVideoIndex((prev) => (prev + 1) % displayVideos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHoveringVideo, selectedModalVideo, displayVideos.length]);

  // ── Press Note Carousel Handlers ──
  const handlePrevNote = () => {
    if (pressNotes.length <= 1) {
      setIsShufflingNote(true);
      setTimeout(() => setIsShufflingNote(false), 400);
      return;
    }
    setNoteDirection(-1);
    setActiveNoteIndex((prev) => (prev - 1 + pressNotes.length) % pressNotes.length);
  };

  const handleNextNote = () => {
    if (pressNotes.length <= 1) {
      setIsShufflingNote(true);
      setTimeout(() => setIsShufflingNote(false), 400);
      return;
    }
    setNoteDirection(1);
    setActiveNoteIndex((prev) => (prev + 1) % pressNotes.length);
  };

  const handleSelectNote = (idx: number) => {
    if (idx === activeNoteIndex) return;
    setNoteDirection(idx > activeNoteIndex ? 1 : -1);
    setActiveNoteIndex(idx);
  };

  // ── Video Carousel Manual Handlers ──
  const handlePrevVideo = () => {
    if (displayVideos.length <= 1) return;
    setVideoDirection(-1);
    setActiveVideoIndex((prev) => (prev - 1 + displayVideos.length) % displayVideos.length);
  };

  const handleNextVideo = () => {
    if (displayVideos.length <= 1) return;
    setVideoDirection(1);
    setActiveVideoIndex((prev) => (prev + 1) % displayVideos.length);
  };

  // ── Admin Handlers ──
  const handleCreatePressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteForm.title.trim() || !newNoteForm.excerpt.trim()) {
      toast.error("Please fill in the required title and excerpt fields.");
      return;
    }

    const now = new Date();
    const formattedDisplay =
      newNoteForm.homepageDisplayDate ||
      now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    const formattedPublished =
      newNoteForm.publishedAt ||
      `${now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newSlug =
      newNoteForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) + `-${Date.now().toString().slice(-4)}`;

    const newNote: PressNote = {
      id: `custom-note-${Date.now()}`,
      slug: newSlug,
      category: newNoteForm.category || "PRESS NOTE",
      title: newNoteForm.title,
      homepageDisplayDate: formattedDisplay,
      publishedAt: formattedPublished,
      documentDate: newNoteForm.documentDate || formattedDisplay,
      revisedDate: newNoteForm.revisedDate || formattedDisplay,
      status: "Published",
      excerpt: newNoteForm.excerpt,
      documentUrl: newNoteForm.documentUrl || "https://api.jntugv.edu.in/press-notes/",
      documentName: newNoteForm.documentName || `${newNoteForm.title}.docx`,
      heading: newNoteForm.heading || "OFFICIAL NOTIFICATION",
      subject: newNoteForm.subject || newNoteForm.title,
      references: [],
      schedule: [],
      notes: ["All terms and conditions remain in accordance with official university guidelines."],
      signedBy: "Sd/-\nRegistrar",
      isCustom: true,
    };

    const updated = savePressNoteToStorage(newNote);
    setPressNotes(updated);
    setActiveNoteIndex(0);
    setShowAddNoteModal(false);
    toast.success("New Press Note published successfully! (Recent first)");

    setNewNoteForm({
      title: "",
      category: "PRESS NOTE",
      homepageDisplayDate: "",
      publishedAt: "",
      documentDate: "",
      revisedDate: "",
      status: "Published",
      excerpt: "",
      documentUrl: "",
      documentName: "",
      heading: "EXTENSION OF TIMELINES",
      subject: "",
    });
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoForm.title.trim() || !newVideoForm.youtubeInput.trim()) {
      toast.error("Please provide both a title and a YouTube ID / URL.");
      return;
    }

    const videoId = extractYouTubeId(newVideoForm.youtubeInput);
    if (!videoId) {
      toast.error("Please enter a valid YouTube Video ID or link.");
      return;
    }

    const newVideo: VideoItem = {
      id: `custom-vid-${Date.now()}`,
      title: newVideoForm.title,
      youtubeId: videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      category: newVideoForm.category || "Campus Media",
      isAvailable: true,
      isCustom: true,
    };

    const updated = saveVideoToStorage(newVideo);
    setVideos(updated);
    setActiveVideoIndex(0);
    setShowAddVideoModal(false);
    toast.success("New Video added successfully! (Recent first)");

    // Set initial thumbnail URL
    setThumbnailUrls(prev => ({
      ...prev,
      [newVideo.id]: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }));

    setNewVideoForm({
      title: "",
      youtubeInput: "",
      category: "Campus Events",
    });
  };

  const handleDeletePressNote = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this press note?")) {
      const updated = deletePressNoteFromStorage(id);
      setPressNotes(updated);
      setActiveNoteIndex(0);
      toast.success("Press note removed.");
    }
  };

  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this video?")) {
      const updated = deleteVideoFromStorage(id);
      setVideos(updated);
      setActiveVideoIndex(0);
      toast.success("Video removed.");
    }
  };

  // ── Thumbnail URL Functions ──
  const getThumbnailUrl = (videoId: string): string => {
    if (!videoId) return "/images/hero-carousal/hero-campus.webp";

    // Return the stored thumbnail URL or default to maxres
    return thumbnailUrls[videoId] || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Handle thumbnail error - try fallback
  const handleThumbnailError = (videoId: string, videoItemId: string) => {
    const currentUrl = thumbnailUrls[videoItemId] || '';

    // If currently using maxres, try hqdefault
    if (currentUrl.includes('maxresdefault')) {
      setThumbnailUrls(prev => ({
        ...prev,
        [videoItemId]: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }));
    }
    // If hqdefault fails, try sddefault
    else if (currentUrl.includes('hqdefault')) {
      setThumbnailUrls(prev => ({
        ...prev,
        [videoItemId]: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
      }));
    }
    // If all fail, use a placeholder
    else if (currentUrl.includes('sddefault')) {
      setThumbnailUrls(prev => ({
        ...prev,
        [videoItemId]: '/images/hero-carousal/hero-campus.webp'
      }));
    }
  };

  // Check if using fallback thumbnail
  const isUsingFallback = (videoItemId: string): boolean => {
    const url = thumbnailUrls[videoItemId] || '';
    return url.includes('hqdefault') || url.includes('sddefault') || url.includes('hero-campus.webp');
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-sand/40 border-y border-border/60">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="absolute top-1/2 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -right-48 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <div className="container-narrow">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-border/80">
            <div>
              <div className="text-eyebrow flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Latest Updates
              </div>
              <h2 className="text-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mt-2 tracking-tight">
                Official Releases & Media
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl font-normal">
                Official releases, announcements & campus media.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              {isEditMode && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Press Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddVideoModal(true)}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Video
                  </button>
                </div>
              )}

              <Link
                to="/latest-updates"
                className="story-link text-primary font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 py-1"
              >
                VIEW ALL <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        {/* ── Two-Column Responsive Layout ── */}
        <div className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
          {/* LEFT SIDE: 45% Width — Press Notes */}
          <div className="w-full lg:w-[45%] flex flex-col justify-between">
            <RevealOnScroll delay={100} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    FEATURED PRESS NOTE
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {pressNotes.length > 0 ? `${activeNoteIndex + 1} / ${pressNotes.length}` : "0 / 0"}
                  </span>
                </div>

                <div className="relative min-h-[400px] sm:min-h-[440px] flex flex-col justify-center">
                  <motion.div
                    aria-hidden
                    animate={{
                      rotate: isShufflingNote ? [-4, -7, -4] : -3,
                      x: isShufflingNote ? [-8, -14, -8] : -6,
                      y: isShufflingNote ? [-4, -8, -4] : -4,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0 bg-white/50 border border-slate-200/60 rounded-[36px] shadow-sm pointer-events-none hidden sm:block"
                  />
                  <motion.div
                    aria-hidden
                    animate={{
                      rotate: isShufflingNote ? [-2, -4, -2] : -1.5,
                      x: isShufflingNote ? [-4, -8, -4] : -3,
                      y: isShufflingNote ? [-2, -4, -2] : -2,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 bg-white/80 border border-slate-200/80 rounded-[36px] shadow-sm pointer-events-none hidden sm:block"
                  />

                  {currentNote ? (
                    <AnimatePresence mode="wait" custom={noteDirection}>
                      <motion.div
                        key={currentNote.id}
                        custom={noteDirection}
                        initial={{
                          opacity: 0,
                          x: noteDirection !== 0 ? noteDirection * 35 : 0,
                          scale: 0.97,
                        }}
                        animate={{
                          opacity: 1,
                          x: isShufflingNote ? [0, 8, -4, 0] : 0,
                          scale: 1,
                          rotate: isShufflingNote ? [0, 1.5, -1, 0] : 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: noteDirection !== 0 ? noteDirection * -35 : 0,
                          scale: 0.97,
                        }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 h-full"
                      >
                        <Link
                          to="/latest-updates/press-notes/$slug"
                          params={{ slug: currentNote.slug }}
                          className="group relative flex flex-col justify-between h-full min-h-[400px] sm:min-h-[440px] p-6 sm:p-8 md:p-9 rounded-[36px] bg-white border border-slate-200 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-2xl hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                          <div>
                            <div className="flex items-start gap-4 sm:gap-5 mb-5">
                              <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-slate-200/90 p-1.5 sm:p-2 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                                <img
                                  src="/logo-circle.png"
                                  alt="JNTU-GV University Emblem"
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                      {currentNote.category}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 font-semibold text-[10px] uppercase tracking-wider">
                                      {currentNote.status}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-full">
                                    <Calendar className="h-3.5 w-3.5 text-blue-700" />
                                    <span>{currentNote.homepageDisplayDate}</span>
                                  </div>
                                </div>

                                <h3 className="mt-3.5 text-lg sm:text-xl md:text-[22px] font-extrabold font-display text-ink group-hover:text-primary transition-colors leading-snug tracking-tight">
                                  {currentNote.title}
                                </h3>
                              </div>
                            </div>

                            <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed font-normal line-clamp-3 pl-0 sm:pl-1">
                              {currentNote.excerpt}
                            </p>
                          </div>

                          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span>Published: {currentNote.publishedAt}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              {isEditMode && currentNote.isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeletePressNote(currentNote.id, e)}
                                  className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                  title="Delete Press Note"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                                READ PRESS NOTE <ArrowRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative z-10 h-full"
                    >
                      <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] sm:min-h-[440px] p-8 sm:p-10 rounded-[36px] bg-white border border-slate-200 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.08)]">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-50 border border-slate-200/90 p-3 shadow-xs flex items-center justify-center mb-5">
                          <img
                            src="/logo-circle.png"
                            alt="JNTU-GV University Emblem"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <span className="px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-900 font-bold text-[10px] uppercase tracking-widest mb-3">
                          OFFICIAL PRESS RELEASE
                        </span>

                        <h3 className="text-xl sm:text-2xl font-bold font-display text-ink tracking-tight">
                          No updates till now
                        </h3>

                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                          Official press releases, employment notifications, and university circulars will appear here once issued.
                        </p>

                        {isEditMode && (
                          <button
                            type="button"
                            onClick={() => setShowAddNoteModal(true)}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
                          >
                            <Plus size={14} /> Add Press Note
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {pressNotes.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevNote}
                    aria-label="Previous Press Note"
                    className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 hover:text-primary active:scale-90 transition-all cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2 px-1">
                    {pressNotes.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectNote(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeNoteIndex === idx ? "w-6 bg-blue-600" : "w-2.5 bg-blue-200 hover:bg-blue-300"
                          }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextNote}
                    aria-label="Next Press Note"
                    className="h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-ink hover:bg-slate-50 hover:text-primary active:scale-90 transition-all cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </RevealOnScroll>
          </div>

          {/* RIGHT SIDE: 55% Width — Vertical Video Carousel */}
          <div
            className="w-full lg:w-[55%] flex flex-col justify-between"
            onMouseEnter={() => setIsHoveringVideo(true)}
            onMouseLeave={() => setIsHoveringVideo(false)}
          >
            <RevealOnScroll delay={180} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Play className="h-3.5 w-3.5 text-primary" />
                      LATEST VIDEOS
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[9px] uppercase tracking-wider">
                      Auto-slides 3s
                    </span>
                  </div>

                  <Link
                    to="/latest-updates"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    VIEW ALL VIDEOS →
                  </Link>
                </div>

                {/* Vertical Card Frame */}
                <div className="relative min-h-[400px] sm:min-h-[440px] rounded-[36px] bg-slate-950 border border-slate-800 p-5 sm:p-7 text-white shadow-elegant flex flex-col justify-between overflow-hidden group">
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                  {currentVideo ? (
                    <AnimatePresence mode="wait" custom={videoDirection}>
                      <motion.div
                        key={currentVideo.id}
                        custom={videoDirection}
                        initial={{ opacity: 0, y: videoDirection >= 0 ? 40 : -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: videoDirection >= 0 ? -40 : 40 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        {/* Video Thumbnail Frame */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedModalVideo(currentVideo)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedModalVideo(currentVideo);
                            }
                          }}
                          className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 cursor-pointer group/thumb shadow-inner"
                        >
                          <img
                            src={getThumbnailUrl(currentVideo.id)}
                            alt={currentVideo.title}
                            loading="lazy"
                            decoding="async"
                            onError={() => handleThumbnailError(currentVideo.youtubeId, currentVideo.id)}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                          />

                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                          {/* Play Button Orb - always visible */}
                          <div className="absolute inset-0 grid place-items-center">
                            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-primary group-hover/thumb:border-primary">
                              <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current ml-1" />
                            </div>
                          </div>

                          {/* Category Tag */}
                          <div className="absolute top-3.5 left-3.5">
                            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                              {currentVideo.category || "Official Media"}
                            </span>
                          </div>

                          {/* Show fallback indicator */}
                          {isUsingFallback(currentVideo.id) && (
                            <div className="absolute bottom-3.5 left-3.5">
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[8px] font-medium uppercase tracking-wider text-amber-400">
                                Low Quality
                              </span>
                            </div>
                          )}

                          {isEditMode && currentVideo.isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteVideo(currentVideo.id, e)}
                              className="absolute top-3.5 right-3.5 p-2 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 z-20 shadow-md transition-transform hover:scale-105"
                              title="Delete Video"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Video Title */}
                        <div className="mt-4">
                          <h4 className="text-base sm:text-lg md:text-xl font-bold font-display text-white leading-snug line-clamp-2 drop-shadow-sm group-hover:text-primary-glow transition-colors">
                            {currentVideo.title}
                          </h4>
                          {isUsingFallback(currentVideo.id) && (
                            <p className="text-[10px] text-amber-400/60 mt-1 flex items-center gap-1.5">
                              <AlertCircle className="h-3 w-3" />
                              <span>Using lower quality preview</span>
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : null}

                  {/* Bottom Bar */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                        VIDEO {activeVideoIndex + 1} OF {displayVideos.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevVideo}
                        aria-label="Previous Video"
                        className="h-8 w-8 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Previous Video"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextVideo}
                        aria-label="Next Video"
                        className="h-8 w-8 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Next Video"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>

      {/* ── Admin Modal: Add New Press Note ── */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Publish New Press Note (Recent First)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePressNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Press Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={newNoteForm.title}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, title: e.target.value })}
                  placeholder="e.g. JNTUGV - Revised Notification for Academic Schedule 2026-Reg"
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={newNoteForm.category}
                    onChange={(e) => setNewNoteForm({ ...newNoteForm, category: e.target.value })}
                    placeholder="PRESS NOTE"
                    className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                    Homepage Display Date
                  </label>
                  <input
                    type="text"
                    value={newNoteForm.homepageDisplayDate}
                    onChange={(e) =>
                      setNewNoteForm({ ...newNoteForm, homepageDisplayDate: e.target.value })
                    }
                    placeholder="e.g. 19 AUG 2026"
                    className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Short Excerpt / Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newNoteForm.excerpt}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, excerpt: e.target.value })}
                  placeholder="Brief summary of the official notification for the homepage card."
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Source Document URL (DOCX / PDF link)
                </label>
                <input
                  type="text"
                  value={newNoteForm.documentUrl}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, documentUrl: e.target.value })}
                  placeholder="https://api.jntugv.edu.in/... or uploads/..."
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-ink font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !px-6 !py-2.5 !text-xs uppercase tracking-wider font-bold"
                >
                  Publish Press Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Admin Modal: Add New Video ── */}
      {showAddVideoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 grid place-items-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-amber-600" />
                Add YouTube Video (Recent First)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddVideoModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={newVideoForm.title}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, title: e.target.value })}
                  placeholder="e.g. JNTUGV - Annual Day Celebrations 2026"
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  YouTube Video ID or Link *
                </label>
                <input
                  type="text"
                  required
                  value={newVideoForm.youtubeInput}
                  onChange={(e) =>
                    setNewVideoForm({ ...newVideoForm, youtubeInput: e.target.value })
                  }
                  placeholder="e.g. D_NEmEYQ0cc or https://www.youtube.com/watch?v=..."
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={newVideoForm.category}
                  onChange={(e) =>
                    setNewVideoForm({ ...newVideoForm, category: e.target.value })
                  }
                  placeholder="Campus Events"
                  className="w-full bg-white border border-border rounded-xl p-3 text-sm text-ink outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddVideoModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-ink font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !px-6 !py-2.5 !text-xs uppercase tracking-wider font-bold"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Video Modal */}
      <VideoModal
        video={selectedModalVideo}
        isOpen={Boolean(selectedModalVideo)}
        onClose={() => setSelectedModalVideo(null)}
      />
    </section>
  );
}