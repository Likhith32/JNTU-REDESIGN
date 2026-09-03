import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { imageUrl, getAssetUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SubNav } from "@/components/SubNav";
import { STUDENT_SUBNAV } from "@/lib/site";
import { getCampusGallery, getJntugvGalleryImages, addCampusGalleryItem, deleteCampusGalleryItem } from "@/funcs/site.server";
import { useQuery } from "@tanstack/react-query";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { useAdmin } from "@/context/AdminContext";
import { SocialPublishingPanel } from "@/components/SocialPublishingPanel";
import { toast } from "sonner";
import {
  Share2,
  Plus,
  Trash2,
  Upload,
  X,
  Shield,
  Instagram,
  Linkedin,
  Image as ImageIcon,
  CheckCircle2,
  Send,
  Calendar,
} from "lucide-react";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import cultureImg from "@/assets/culture.jpeg";

export const Route = createFileRoute("/gallery")({
  loader: async () => await getCampusGallery(),
  head: () => ({
    meta: [
      { title: "Gallery — JNTU-GV CEV" },
      { name: "description", content: "Moments from across the JNTU-GV Vizianagaram campus." },
      { property: "og:title", content: "Gallery — JNTU-GV CEV" },
      {
        property: "og:description",
        content: "Pictures from campus, classrooms, labs, sports and culture.",
      },
      { property: "og:image", content: campusImg },
    ],
  }),
  component: GalleryPage,
});

const DEFAULT_IMAGES = [
  {
    id: -1,
    src: "uploads/photo-gallery/independence_day.jpeg",
    caption: "80th Independence Day Celebrations on Campus in Presence of Hon'ble Vice-Chancellor",
  },
  { id: -2, src: "uploads/photo-gallery/IMG_6832.JPG", caption: "Campus Administration & Main Building" },
  { id: -3, src: "uploads/photo-gallery/IMG_6840.JPG", caption: "Cultural Fest & Student Celebrations" },
  { id: -4, src: "uploads/photo-gallery/IMG_6844.JPG", caption: "Advanced Engineering Laboratories" },
  { id: -5, src: "uploads/photo-gallery/IMG_6859.JPG", caption: "Central Knowledge Commons & Library" },
  { id: -6, src: "uploads/photo-gallery/IMG_6868.JPG", caption: "Campus Life & Student Interactions" },
  { id: -7, src: "uploads/photo-gallery/IMG_6872.JPG", caption: "Sports Meet & Athletic Complex" },
  { id: -8, src: "uploads/photo-gallery/IMG_6875.JPG", caption: "Hostel & Residential Blocks" },
  { id: -9, src: "uploads/photo-gallery/IMG_6920.JPG", caption: "Placements Drive & Auditorium Session" },
];

function normalizeSrcForStorage(src: string): string {
  const trimmed = src.trim();
  const legacyHostPattern = /^https?:\/\/89\.116\.134\.182(:\d+)?\/local-assets\//;
  if (legacyHostPattern.test(trimmed)) {
    return trimmed.replace(legacyHostPattern, "");
  }
  return trimmed;
}

type TargetPlatform = "instagram" | "linkedin" | "combined" | null;

function GalleryPage() {
  const records = Route.useLoaderData() as any[];
  const { isAdmin } = useAdmin();
  const router = useRouter();

  // Admin upload modal / state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({ src: "", caption: "" });
  const [uploading, setUploading] = useState(false);

  // Social publishing modal state
  const [activeShareItem, setActiveShareItem] = useState<{
    item: any;
    targetPlatform: TargetPlatform;
  } | null>(null);

  // Fetch live images from the JNTU-GV external API with memory caching
  const { data: apiImages = [] } = useQuery({
    queryKey: ["jntugv-gallery"],
    queryFn: () => getJntugvGalleryImages(),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  // Convert API images to the same shape as local records
  const apiGalleryItems = apiImages.map((img) => ({
    id: -(img.id + 1000), // negative IDs to avoid collision
    src: img.imglink,
    caption: img.title || img.description,
    date: img.date,
    isExternal: true,
  }));

  const localImages = (records.length > 0 ? records : []).map((r: any) => ({
    ...r,
    date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : undefined,
  }));

  const rawImages = [
    ...localImages,
    ...apiGalleryItems,
    ...(apiGalleryItems.length === 0 && localImages.length === 0 ? DEFAULT_IMAGES : []),
  ];

  // Strictly deduplicate by caption/title and src, then sort strictly by date descending
  const seenKeys = new Set<string>();
  const images = rawImages
    .filter((img) => {
      const key = (img.caption || img.src || "").trim().toLowerCase();
      if (!key || seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.date || 0).getTime();
      const timeB = new Date(b.date || 0).getTime();
      return timeB - timeA;
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", "gallery");
    formData.append("category", "campus");
    if (newImage.caption) formData.append("name", newImage.caption);

    const tId = toast.loading(`Uploading photo ${file.name}...`);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        const assetUrl = json.path;
        setNewImage((prev) => ({ ...prev, src: assetUrl }));
        toast.success(`Photo uploaded successfully!`, { id: tId });
      } else {
        toast.error(json.error || "Upload failed", { id: tId });
      }
    } catch (err: any) {
      toast.error("Failed to upload image file", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  const handleAddSubmit = async (e?: React.FormEvent, targetPlatform: TargetPlatform = null) => {
    if (e) e.preventDefault();
    if (!newImage.src.trim()) {
      toast.error("Please provide an image file or URL.");
      return;
    }

    const tId = toast.loading("Adding photo to gallery...");
    try {
      const res = await addCampusGalleryItem({
        data: {
          src: normalizeSrcForStorage(newImage.src),
          caption: newImage.caption || "Campus Moment",
        },
      });

      toast.success("Photo added to gallery!", { id: tId });
      const addedItem = {
        id: res.id,
        src: normalizeSrcForStorage(newImage.src),
        caption: newImage.caption || "Campus Moment",
        instagramPosted: false,
        linkedinPosted: false,
      };

      setNewImage({ src: "", caption: "" });
      setShowAddForm(false);
      router.invalidate();

      // Open specific social platform modal if specified
      if (targetPlatform && res && res.id) {
        setActiveShareItem({
          item: addedItem,
          targetPlatform,
        });
      }
    } catch {
      toast.error("Failed to add photo.", { id: tId });
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Delete this photo from the campus gallery?")) return;
    const tId = toast.loading("Deleting photo...");
    try {
      await deleteCampusGalleryItem({ data: { id } });
      toast.success("Photo deleted successfully.", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete photo.", { id: tId });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A campus, in moments."
        subtitle="A growing visual record of the rhythms, faces and seasons of life at JNTU-GV CEV."
        image={cultureImg}
      />
      <SubNav items={STUDENT_SUBNAV} />

      {/* Admin Action Bar on Gallery Page */}
      {isAdmin && (
        <div className="bg-slate-900 text-white border-b border-slate-800 py-5 px-6 shadow-inner">
          <div className="container-narrow flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white font-display flex items-center gap-2">
                  <span>Admin Gallery Controls</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold uppercase tracking-widest">
                    Active Mode
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Upload campus photos to gallery or share directly to LinkedIn & Instagram.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 bg-[#0F4C81] hover:bg-[#0D3F6D] text-white text-xs font-bold rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer border border-sky-400/20 shrink-0"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? "Close Panel" : "Upload New Photo"}</span>
            </button>
          </div>

          {/* Add Photo Form Panel */}
          {showAddForm && (
            <div className="container-narrow mt-5 pt-5 border-t border-slate-800 animate-fade-in">
              <div className="bg-slate-850 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-350 font-display">
                    New Gallery Photo Entry
                  </h5>
                  <span className="text-[10px] text-slate-400 font-medium">Select action button after filling details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-350 block">
                      Upload Image File or Paste URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://... or upload file"
                        className="flex-1 bg-slate-900 border border-slate-750 rounded-2xl px-4 py-2.5 text-xs font-medium text-white outline-none focus:border-sky-400 transition"
                        value={newImage.src}
                        onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                        required
                      />
                      <label className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shrink-0 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? "..." : "File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-350 block">
                      Photo Caption / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Sports Meet 2026..."
                      className="w-full bg-slate-900 border border-slate-750 rounded-2xl px-4 py-2.5 text-xs font-medium text-white outline-none focus:border-sky-400 transition"
                      value={newImage.caption}
                      onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                    />
                  </div>
                </div>

                {/* Explicit Platform Option Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleAddSubmit(e, null)}
                    className="px-4.5 py-2.5 bg-[#0F4C81] hover:bg-[#0D3F6D] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5 border border-sky-400/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Gallery Only</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleAddSubmit(e, "linkedin")}
                    className="px-4.5 py-2.5 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Post on LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleAddSubmit(e, "instagram")}
                    className="px-4.5 py-2.5 bg-[#E4405F] hover:bg-[#c12a45] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Post on Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleAddSubmit(e, "combined")}
                    className="px-4.5 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Post on Both</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <section className="py-20 container-narrow">
        <RevealOnScroll>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {images.map((img, i) => {
              const isDatabaseItem = typeof img.id === "number" && img.id > 0;
              const formattedItem = {
                id: isDatabaseItem ? img.id : Math.abs(img.id || i + 1),
                src: img.src,
                caption: img.caption || "Campus Moment",
                title: img.caption || "Campus Moment",
                instagramPosted: img.instagramPosted || false,
                linkedinPosted: img.linkedinPosted || false,
              };

              return (
                <div
                  key={img.id || i}
                  className="break-inside-avoid mb-5 overflow-hidden rounded-2xl hover-lift relative group transition-all duration-300"
                >
                  <ImageWithLoader
                    src={img.src.startsWith("http") ? img.src : getAssetUrl(img.src)}
                    alt={img.caption || "Campus Moment"}
                    smartFit={true}
                    wrapperClassName="w-full min-h-[220px] max-h-[480px] rounded-2xl border border-border/40 shadow-sm"
                  />

                  {/* Date Badge Overlay */}
                  {img.date && (
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full bg-black/75 border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-xs">
                        <Calendar className="h-3 w-3 text-amber-400" />
                        {img.date}
                      </span>
                    </div>
                  )}

                  {/* Admin Direct Platform Controls Overlay on Image */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl opacity-90 hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() =>
                          setActiveShareItem({
                            item: formattedItem,
                            targetPlatform: "linkedin",
                          })
                        }
                        className="px-2.5 py-1 bg-[#0A66C2] hover:bg-[#084e96] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow transition cursor-pointer active:scale-95"
                        title="Post on LinkedIn"
                      >
                        <Linkedin className="w-3 h-3" />
                        <span className="hidden sm:inline">LinkedIn</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveShareItem({
                            item: formattedItem,
                            targetPlatform: "instagram",
                          })
                        }
                        className="px-2.5 py-1 bg-[#E4405F] hover:bg-[#c12a45] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow transition cursor-pointer active:scale-95"
                        title="Post on Instagram"
                      >
                        <Instagram className="w-3 h-3" />
                        <span className="hidden sm:inline">Instagram</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveShareItem({
                            item: formattedItem,
                            targetPlatform: "combined",
                          })
                        }
                        className="p-1 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow transition cursor-pointer active:scale-95"
                        title="Share on Both Platforms"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {isDatabaseItem && (
                        <button
                          onClick={() => handleDeleteItem(img.id)}
                          className="p-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl border border-rose-500/30 transition cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                      <p className="text-xs font-semibold tracking-wide uppercase text-primary-glow">Moment</p>
                      <p className="text-sm font-medium mt-1">{img.caption}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </section>

      {/* Social Media Publishing Modal with Auto-Opened Platform Preview */}
      {activeShareItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 my-auto">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-2xl text-white shadow-sm ${
                  activeShareItem.targetPlatform === "linkedin"
                    ? "bg-[#0A66C2]"
                    : activeShareItem.targetPlatform === "instagram"
                    ? "bg-[#E4405F]"
                    : "bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600"
                }`}>
                  {activeShareItem.targetPlatform === "linkedin" ? (
                    <Linkedin className="w-4.5 h-4.5" />
                  ) : activeShareItem.targetPlatform === "instagram" ? (
                    <Instagram className="w-4.5 h-4.5" />
                  ) : (
                    <ImageIcon className="w-4.5 h-4.5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider font-display">
                    {activeShareItem.targetPlatform === "linkedin"
                      ? "Publish to LinkedIn"
                      : activeShareItem.targetPlatform === "instagram"
                      ? "Publish to Instagram"
                      : "Publish to Social Media"}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold truncate max-w-md">
                    {activeShareItem.item.caption || "Campus Moment"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveShareItem(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              <SocialPublishingPanel
                itemId={activeShareItem.item.id}
                itemType="gallery"
                defaultPlatform={activeShareItem.targetPlatform}
                initialData={{
                  title: activeShareItem.item.caption || "Campus Moment",
                  caption: activeShareItem.item.caption || "Campus Moment",
                  src: activeShareItem.item.src,
                  url: activeShareItem.item.src,
                  instagramPosted: activeShareItem.item.instagramPosted || false,
                  linkedinPosted: activeShareItem.item.linkedinPosted || false,
                }}
                onStatusUpdate={() => {
                  router.invalidate();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
