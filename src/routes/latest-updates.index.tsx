import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import {
  FileText,
  Calendar,
  Clock,
  ArrowRight,
  Play,
  Sparkles,
  ExternalLink,
  Video as VideoIcon,
  CheckCircle2,
} from "lucide-react";
import {
  PressNote,
  VideoItem,
  getActivePressNotes,
  getActiveVideos,
  getYouTubeThumbnail,
  getYouTubeFallbackThumbnail,
} from "@/data/latest-updates";
import { VideoModal } from "@/components/VideoModal";

const heroBg = "/images/hero-carousal/hero-campus.webp";

export const Route = createFileRoute("/latest-updates/")({
  head: () => ({
    meta: [
      { title: "Latest Updates & Campus Media — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Official releases, press notes, corrigendums and video media from JNTU-GV College of Engineering Vizianagaram.",
      },
      { property: "og:title", content: "Latest Updates — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Stay informed with official press notes and multimedia highlights from JNTU-GV.",
      },
    ],
  }),
  component: LatestUpdatesPage,
});

function LatestUpdatesPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [pressNotes, setPressNotes] = useState<PressNote[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const load = () => {
      setPressNotes(getActivePressNotes());
      setVideos(getActiveVideos());
    };
    load();
    window.addEventListener("jntugv_press_notes_updated", load);
    window.addEventListener("jntugv_videos_updated", load);
    return () => {
      window.removeEventListener("jntugv_press_notes_updated", load);
      window.removeEventListener("jntugv_videos_updated", load);
    };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="News & Media"
        title="Latest Updates"
        subtitle="Official university releases, press notes and campus media."
        image={heroBg}
      />

      {/* TOP SECTION: LATEST PRESS NOTES */}
      <section className="py-20 md:py-28 bg-white border-b border-border">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-4 pb-8 border-b border-border/70">
              <SectionLabel
                eyebrow="Official Archive"
                title="Latest Press Notes"
                subtitle="Official notifications, circulars and corrigendums released by the administration."
              />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
                {pressNotes.length} {pressNotes.length === 1 ? "Release" : "Releases"}
              </span>
            </div>
          </RevealOnScroll>

          <div className="mt-10 space-y-6">
            {pressNotes.map((note, index) => (
              <RevealOnScroll key={note.id} delay={index * 80}>
                <Link
                  to="/latest-updates/press-notes/$slug"
                  params={{ slug: note.slug }}
                  className="group block p-6 sm:p-8 md:p-10 rounded-[32px] bg-sand/30 border border-border hover:border-primary/30 hover:bg-white hover:shadow-elegant transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 max-w-3xl">
                      {/* University Emblem / Clipping Thumbnail */}
                      <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 p-1.5 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
                        {note.imageUrl ? (
                          <img
                            src={note.imageUrl}
                            alt={note.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <img
                            src="/logo-circle.png"
                            alt="JNTU-GV Emblem"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>

                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {note.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 font-semibold text-[10px] uppercase tracking-wider">
                            {note.status}
                          </span>
                          <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full">
                            <Calendar className="h-3 w-3" />
                            {note.homepageDisplayDate}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold font-display text-ink group-hover:text-primary transition-colors leading-snug">
                          {note.title}
                        </h3>

                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {note.excerpt}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>Published on: {note.publishedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div className="btn-primary !px-6 !py-3 !text-xs uppercase tracking-widest font-bold inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        Read Press Note <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: COMPLETE VIDEO GALLERY */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container-narrow">
          <RevealOnScroll>
            <div className="flex items-end justify-between flex-wrap gap-4 pb-8 border-b border-border/70">
              <SectionLabel
                eyebrow="Multimedia Gallery"
                title="Complete Video Gallery"
                subtitle="Watch official university ceremonies, convocation milestones, campus tours and celebrations."
              />
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white text-slate-700 border border-border shadow-xs">
                {videos.length} Videos
              </span>
            </div>
          </RevealOnScroll>

          {/* Responsive Video Grid: 3 cols Desktop, 2 cols Tablet, 1 col Mobile */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <RevealOnScroll key={video.id} delay={index * 60}>
                <div
                  className="group relative flex flex-col justify-between h-full bg-white rounded-3xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Thumbnail area */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedVideo(video)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedVideo(video);
                      }
                    }}
                    className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer group/thumb"
                  >
                    <img
                      src={getYouTubeThumbnail(video.youtubeId)}
                      alt={video.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const fallback = getYouTubeFallbackThumbnail(video.youtubeId);
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/thumb:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent group-hover/thumb:opacity-90 transition-opacity" />

                    {/* Play Button */}
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl transition-all duration-300 group-hover/thumb:scale-110 group-hover/thumb:bg-primary group-hover/thumb:border-primary">
                        <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {video.category || "Official Video"}
                      </span>
                    </div>
                  </div>

                  {/* Content & Action */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h3>

                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      {video.youtubeId ? (
                        <button
                          type="button"
                          onClick={() => setSelectedVideo(video)}
                          className="text-xs font-bold text-primary hover:text-primary-glow inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          WATCH VIDEO <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground">
                          Media Stream Available Soon
                        </span>
                      )}

                      {video.youtubeUrl && (
                        <a
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-ink transition-colors p-1.5 rounded-full hover:bg-slate-100"
                          title="Open on YouTube"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={Boolean(selectedVideo)}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
