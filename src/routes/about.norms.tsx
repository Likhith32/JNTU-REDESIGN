import { createFileRoute, useRouter } from "@tanstack/react-router";
import { imageUrl, uploadUrl } from "@/lib/assets";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SectionLabel } from "@/components/SectionLabel";
import { FileText, Download, ShieldCheck, Building2, ExternalLink, Plus, Trash2 } from "lucide-react";
const heroImg = imageUrl("hero-carousal/hero-campus.jpg");
import { getPageContent, updatePageSection, getAcademicRegulations, addAcademicRegulation, deleteAcademicRegulation } from "@/funcs/site.server";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  AdminModeBanner,
  AdminPanel,
  AdminPanelHeader,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSaveButton,
} from "@/components/AdminEditPanel";

export const Route = createFileRoute("/about/norms")({
  loader: async () => {
    const [pageContent, regulations] = await Promise.all([
      getPageContent({ data: "norms" }),
      getAcademicRegulations(),
    ]);
    return { pageContent, regulations };
  },
  head: () => ({
    meta: [
      { title: "Norms & Recognition — JNTU-GV CEV" },
      {
        name: "description",
        content: "Official recognition, UGC status and establishment norms of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: NormsPage,
});

const DEFAULTS = {
  heroTitle: "Norms & Recognition",
  heroSubtitle: "Official certifications and government mandates that define our institutional framework.",
  recTitle: "Institutional Recognition",
  recSubtitle: "As a constituent college of a state-funded university, we adhere to the highest standards of academic and administrative compliance.",
  ugcTitle: "UGC 12(B) and 2(f) Recognition",
  ugcDesc: "JNTU-GV College of Engineering Vizianagaram is recognized by the University Grants Commission (UGC) under Section 2(f) and 12(B) of the UGC Act, 1956. This recognition makes the college eligible for central assistance and grants for research and development activities.",
  ugcStat1: "2(f)",
  ugcStat1Label: "UGC Recognized",
  ugcStat2: "12(B)",
  ugcStat2Label: "Grant Eligible",
};

const DEFAULT_DOCUMENTS = [
  {
    id: -1,
    title: "UGC 2(f) & 12(B) Recognition",
    size: "Official certificate recognizing the institution under the UGC Act, 1956.",
    link: "http://89.116.134.182/local-assets/uploads/2020/08/UGC-1-747x1024-1.pdf",
    date: "Recognition",
  },
  {
    id: -2,
    title: "University Establishment Order (GO MS. No. 14)",
    size: "Government Order (GO MS. No. 14) regarding the establishment of the university.",
    link: "http://89.116.134.182/local-assets/uploads/2021/03/13022019HE_MS14.pdf",
    date: "Government Order",
  },
  {
    id: -3,
    title: "JNTU Act (Act No. 30 of 2008)",
    size: "Legislative act establishing Jawaharlal Nehru Technological University.",
    link: "http://89.116.134.182/local-assets/uploads/2021/03/JNTUACT-compressed.pdf",
    date: "University Act",
  },
  {
    id: -4,
    title: "Right to Information (RTI) Act, 2005",
    size: "Statutory information disclosure rules and designated Public Information Officers.",
    link: "http://89.116.134.182/local-assets/uploads/2021/02/rti-act.pdf",
    date: "Statutory Act",
  },
  {
    id: -5,
    title: "AICTE Anti-Ragging Notification (2009)",
    size: "AICTE regulations on prevention and prohibition of ragging in technical institutions.",
    link: "http://89.116.134.182/local-assets/uploads/2026/08/AICTE_Antiragging_2009.pdf",
    date: "AICTE Regulation",
  },
];

function getDocIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("recognition") || c.includes("ugc") || c.includes("shield")) return ShieldCheck;
  if (c.includes("order") || c.includes("govt") || c.includes("establishment")) return Building2;
  return FileText;
}

function NormsPage() {
  const { pageContent, regulations } = Route.useLoaderData();
  const { isEditMode } = useAdmin();
  const router = useRouter();

  const heroRec = pageContent.find((r) => r.sectionKey === "hero") as any;
  const recRec = pageContent.find((r) => r.sectionKey === "rec") as any;
  const ugcRec = pageContent.find((r) => r.sectionKey === "ugc") as any;

  const [editTexts, setEditTexts] = useState({
    heroTitle: heroRec?.title || DEFAULTS.heroTitle,
    heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
    recTitle: recRec?.title || DEFAULTS.recTitle,
    recSubtitle: recRec?.content || DEFAULTS.recSubtitle,
    ugcTitle: ugcRec?.title || DEFAULTS.ugcTitle,
    ugcDesc: ugcRec?.content || DEFAULTS.ugcDesc,
    ugcStat1: ugcRec?.extras || DEFAULTS.ugcStat1,
    ugcStat1Label: ugcRec?.subtag || DEFAULTS.ugcStat1Label,
    ugcStat2: ugcRec?.date || DEFAULTS.ugcStat2,
    ugcStat2Label: ugcRec?.tag || DEFAULTS.ugcStat2Label,
  });

  const [newDoc, setNewDoc] = useState({
    title: "",
    category: "Recognition", // maps to date in DB
    desc: "", // maps to size in DB
    link: "",
  });

  useEffect(() => {
    setEditTexts({
      heroTitle: heroRec?.title || DEFAULTS.heroTitle,
      heroSubtitle: heroRec?.content || DEFAULTS.heroSubtitle,
      recTitle: recRec?.title || DEFAULTS.recTitle,
      recSubtitle: recRec?.content || DEFAULTS.recSubtitle,
      ugcTitle: ugcRec?.title || DEFAULTS.ugcTitle,
      ugcDesc: ugcRec?.content || DEFAULTS.ugcDesc,
      ugcStat1: ugcRec?.extras || DEFAULTS.ugcStat1,
      ugcStat1Label: ugcRec?.subtag || DEFAULTS.ugcStat1Label,
      ugcStat2: ugcRec?.date || DEFAULTS.ugcStat2,
      ugcStat2Label: ugcRec?.tag || DEFAULTS.ugcStat2Label,
    });
  }, [pageContent]);

  async function handleSaveSection(section: string) {
    const tId = toast.loading("Saving content section...");
    try {
      if (section === "hero") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "hero",
            title: editTexts.heroTitle,
            content: editTexts.heroSubtitle,
          },
        });
      } else if (section === "rec") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "rec",
            title: editTexts.recTitle,
            content: editTexts.recSubtitle,
          },
        });
      } else if (section === "ugc") {
        await updatePageSection({
          data: {
            page: "norms",
            sectionKey: "ugc",
            title: editTexts.ugcTitle,
            content: editTexts.ugcDesc,
            extras: editTexts.ugcStat1,
            subtag: editTexts.ugcStat1Label,
            date: editTexts.ugcStat2,
            tag: editTexts.ugcStat2Label,
          },
        });
      }
      toast.success("Changes saved successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to save section.", { id: tId });
    }
  }

  async function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!newDoc.title || !newDoc.link) {
      toast.error("Please fill in the title and PDF link.");
      return;
    }
    const tId = toast.loading("Adding document...");
    try {
      await addAcademicRegulation({
        data: {
          title: newDoc.title,
          category: "Norms",
          link: newDoc.link,
        },
      });
      toast.success("Document added successfully!", { id: tId });
      setNewDoc({ title: "", category: "Recognition", desc: "", link: "" });
      router.invalidate();
    } catch {
      toast.error("Failed to add document.", { id: tId });
    }
  }

  async function handleDeleteDocument(id: number) {
    if (id < 0) {
      toast.error("Default documents cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this document?")) return;
    const tId = toast.loading("Deleting document...");
    try {
      await deleteAcademicRegulation({ data: { id } });
      toast.success("Document deleted successfully!", { id: tId });
      router.invalidate();
    } catch {
      toast.error("Failed to delete document.", { id: tId });
    }
  }

  const dbDocs = regulations.filter((r) => r.category === "Norms");
  const documents = dbDocs.length > 0 ? dbDocs : DEFAULT_DOCUMENTS;

  return (
    <>
      {isEditMode && <AdminModeBanner label="Norms & Recognition Editor Active" />}

      <PageHero
        eyebrow="Compliance"
        title={editTexts.heroTitle}
        subtitle={editTexts.heroSubtitle}
        image={heroImg}
      />

      {isEditMode && (
        <section className="container-narrow py-6">
          <AdminPanel>
            <AdminPanelHeader title="Edit Hero Headers">
              <AdminSaveButton onClick={() => handleSaveSection("hero")} label="Save Hero" />
            </AdminPanelHeader>
            <div className="space-y-4">
              <AdminField label="Hero Title">
                <AdminInput
                  value={editTexts.heroTitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroTitle: e.target.value })}
                />
              </AdminField>
              <AdminField label="Hero Subtitle">
                <AdminTextarea
                  value={editTexts.heroSubtitle}
                  onChange={(e) => setEditTexts({ ...editTexts, heroSubtitle: e.target.value })}
                  rows={2}
                />
              </AdminField>
            </div>
          </AdminPanel>
        </section>
      )}

      <section className="py-24 md:py-32 container-narrow">
        <RevealOnScroll>
          {isEditMode ? (
            <div className="mb-8">
              <AdminPanel>
                <AdminPanelHeader title="Edit Recognition Description">
                  <AdminSaveButton onClick={() => handleSaveSection("rec")} label="Save Section" />
                </AdminPanelHeader>
                <div className="space-y-4">
                  <AdminField label="Section Title">
                    <AdminInput
                      value={editTexts.recTitle}
                      onChange={(e) => setEditTexts({ ...editTexts, recTitle: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Section Subtitle">
                    <AdminTextarea
                      value={editTexts.recSubtitle}
                      onChange={(e) => setEditTexts({ ...editTexts, recSubtitle: e.target.value })}
                      rows={3}
                    />
                  </AdminField>
                </div>
              </AdminPanel>
            </div>
          ) : (
            <SectionLabel
              eyebrow="Certification"
              title={editTexts.recTitle}
              subtitle={editTexts.recSubtitle}
            />
          )}
        </RevealOnScroll>

        {isEditMode && (
          <div className="mb-10 bg-slate-50 border border-slate-200 rounded-[32px] p-8 max-w-4xl">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Add Compliance Document
            </h3>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UGC 2(f) Recognition"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Sub-category / Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recognition, Government Order"
                    className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="Official certificate recognizing the institution under..."
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  value={newDoc.desc}
                  onChange={(e) => setNewDoc({ ...newDoc, desc: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  PDF Download URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  value={newDoc.link}
                  onChange={(e) => setNewDoc({ ...newDoc, link: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 text-xs uppercase tracking-widest font-bold">
                Publish Document
              </button>
            </form>
          </div>
        )}

        <div className="mt-16 grid gap-6 max-w-4xl">
          {documents.map((doc, i) => {
            const Icon = getDocIcon(doc.date);
            return (
              <RevealOnScroll key={doc.id} delay={i * 100}>
                <div className="group relative flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] bg-white border border-border hover:border-primary/20 hover:shadow-elegant transition-all duration-200">
                  <a
                    href={doc.link || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      <Icon className="h-8 w-8" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2">
                        {doc.date}
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{doc.size}</p>
                    </div>

                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-ink text-xs font-bold uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </div>
                  </a>

                  {isEditMode && doc.id > 0 && (
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-3 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition ml-4 shrink-0"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* UGC Details Strip */}
        <RevealOnScroll delay={300} className="mt-20">
          {isEditMode ? (
            <AdminPanel>
              <AdminPanelHeader title="Edit UGC Strip Content">
                <AdminSaveButton onClick={() => handleSaveSection("ugc")} label="Save Strip" />
              </AdminPanelHeader>
              <div className="space-y-4">
                <AdminField label="UGC Strip Title">
                  <AdminInput
                    value={editTexts.ugcTitle}
                    onChange={(e) => setEditTexts({ ...editTexts, ugcTitle: e.target.value })}
                  />
                </AdminField>
                <AdminField label="UGC Strip Body Description">
                  <AdminTextarea
                    value={editTexts.ugcDesc}
                    onChange={(e) => setEditTexts({ ...editTexts, ugcDesc: e.target.value })}
                    rows={4}
                  />
                </AdminField>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <AdminField label="Stat 1 Value">
                      <AdminInput
                        value={editTexts.ugcStat1}
                        onChange={(e) => setEditTexts({ ...editTexts, ugcStat1: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Stat 1 Label">
                      <AdminInput
                        value={editTexts.ugcStat1Label}
                        onChange={(e) => setEditTexts({ ...editTexts, ugcStat1Label: e.target.value })}
                      />
                    </AdminField>
                  </div>
                  <div>
                    <AdminField label="Stat 2 Value">
                      <AdminInput
                        value={editTexts.ugcStat2}
                        onChange={(e) => setEditTexts({ ...editTexts, ugcStat2: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Stat 2 Label">
                      <AdminInput
                        value={editTexts.ugcStat2Label}
                        onChange={(e) => setEditTexts({ ...editTexts, ugcStat2Label: e.target.value })}
                      />
                    </AdminField>
                  </div>
                </div>
              </div>
            </AdminPanel>
          ) : (
            <div className="rounded-[40px] bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="relative grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">{editTexts.ugcTitle}</h2>
                  <p className="mt-6 text-white/60 leading-relaxed">{editTexts.ugcDesc}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-primary-glow">{editTexts.ugcStat1}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-2">
                      {editTexts.ugcStat1Label}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-bold text-primary-glow">{editTexts.ugcStat2}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40 mt-2">
                      {editTexts.ugcStat2Label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </RevealOnScroll>
      </section>
    </>
  );
}
