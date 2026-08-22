import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VideoItem } from "@/data/latest-updates";
import { useState, useEffect } from "react";
import { ExternalLink, AlertCircle, Eye } from "lucide-react";

interface VideoModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset states when video changes or modal closes
  useEffect(() => {
    if (!isOpen) {
      setVideoError(false);
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!video) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  const handleClose = () => {
    setVideoError(false);
    setIsLoading(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border border-slate-800 text-white rounded-3xl shadow-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-850 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light font-bold text-[10px] uppercase tracking-wider">
              {video.category || "Official Media"}
            </span>
            {videoError && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                Restricted
              </span>
            )}
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 line-clamp-1">
            {video.title}
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {video.youtubeId ? (
            <>
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <span className="text-sm text-slate-400">Loading video...</span>
                  </div>
                </div>
              )}

              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />

              {/* Video Unavailable Overlay - Minimalistic & User Friendly */}
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center animate-in fade-in duration-300">
                  {/* Decorative element */}
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl animate-pulse" />
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                    This video is restricted
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    The content owner has blocked playback on external websites.
                  </p>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all duration-300 hover:scale-105 group"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  <p className="mt-2.5 text-[10px] text-slate-500">
                    Opens in a new tab on YouTube.com
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-slate-500" />
              </div>
              <p className="text-sm font-medium">
                This media will be available for streaming shortly on the official university portal.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}