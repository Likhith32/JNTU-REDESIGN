import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/PageHero";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  FileText,
  Calendar,
  Clock,
  ArrowLeft,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PRESS_NOTES, getActivePressNotes, PressNote } from "@/data/latest-updates";

const heroBg = "/images/hero-carousal/hero-campus.webp";

export const Route = createFileRoute("/latest-updates/press-notes/$slug")({
  head: ({ params }) => {
    const all = typeof window !== "undefined" ? getActivePressNotes() : PRESS_NOTES;
    const note = all.find((n) => n.slug === params.slug) || PRESS_NOTES[0];
    return {
      meta: [
        { title: `${note?.title || "Press Note"} — JNTU-GV CEV` },
        {
          name: "description",
          content: note?.excerpt || "Official university press note from JNTU-GV.",
        },
        { property: "og:title", content: note?.title || "Press Note — JNTU-GV CEV" },
        { property: "og:description", content: note?.excerpt || "" },
      ],
    };
  },
  component: PressNoteDetailPage,
});

function PressNoteDetailPage() {
  const { slug } = Route.useParams();
  const [note, setNote] = useState<PressNote | undefined>(() => {
    return getActivePressNotes().find((n) => n.slug === slug);
  });

  useEffect(() => {
    const found = getActivePressNotes().find((n) => n.slug === slug);
    setNote(found);
  }, [slug]);

  if (!note) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-3xl font-bold text-ink">Press Note Not Found</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          The requested official release could not be located or has been archived.
        </p>
        <Link to="/latest-updates" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" /> Return to Latest Updates
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Press Release"
        title="Official Notification"
        subtitle="Complete record and verification details of published university announcements."
        image={heroBg}
      />

      <section className="py-16 md:py-24 bg-sand/30">
        <div className="container-narrow max-w-4xl mx-auto">
          {/* Back Link */}
          <RevealOnScroll>
            <div className="mb-8">
              <Link
                to="/latest-updates"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Latest Updates
              </Link>
            </div>
          </RevealOnScroll>

          {/* Main Document Card Container */}
          <RevealOnScroll delay={80}>
            <div className="bg-white rounded-[36px] border border-border shadow-elegant overflow-hidden">
              {/* Document Header & Metadata Bar */}
              <div className="p-6 sm:p-10 border-b border-border bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
                <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 mb-6">
                  <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-200/90 p-2 shadow-xs flex items-center justify-center">
                    <img
                      src="/logo-circle.png"
                      alt="JNTU-GV Emblem"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          {note.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                          Status: {note.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified Official Release
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-ink leading-tight tracking-tight">
                      {note.title}
                    </h1>
                  </div>
                </div>

                {/* Structured Metadata Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-border/80 shadow-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Published
                    </div>
                    <div className="text-sm font-bold text-ink mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {note.publishedAt}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Document Date
                    </div>
                    <div className="text-sm font-bold text-ink mt-0.5 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      {note.documentDate}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary font-bold">
                      Revised Date
                    </div>
                    <div className="text-sm font-extrabold text-primary mt-0.5 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {note.revisedDate}
                    </div>
                  </div>
                </div>

                {/* Prominent Source Document Button */}
                <div className="mt-6">
                  <a
                    href={note.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full sm:w-auto !py-3.5 !px-8 text-xs uppercase tracking-widest font-bold inline-flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Download className="h-4 w-4" />
                    VIEW UPLOADED SOURCE DOCUMENT
                    <ExternalLink className="h-3.5 w-3.5 opacity-70 ml-1" />
                  </a>
                </div>
              </div>

              {/* Complete Official Document Body */}
              <div className="p-6 sm:p-10 md:p-12 space-y-8 font-sans text-ink">
                {/* Intro / Corrigendum Statement */}
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 text-sm sm:text-base leading-relaxed font-medium text-slate-800">
                  <p className="font-bold text-primary mb-1 uppercase tracking-wider text-xs">
                    {note.category === "PRESS COVERAGE" ? "Press Release Overview" : "Official Corrigendum"}
                  </p>
                  {note.excerpt}
                </div>

                {/* Newspaper Clipping Image if available */}
                {note.imageUrl && (
                  <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      className="w-full h-auto max-h-[650px] object-contain mx-auto"
                    />
                    <div className="p-3 bg-slate-100/80 border-t border-slate-200 text-xs text-slate-600 text-center font-semibold">
                      📰 Official Press Coverage Clipping — {note.title}
                    </div>
                  </div>
                )}

                {/* References */}
                {note.references && note.references.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      References:
                    </h3>
                    <ol className="space-y-2.5 list-decimal list-inside text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/70 p-5 rounded-2xl border border-slate-200/70">
                      {note.references.map((refText, idx) => (
                        <li key={idx} className="pl-1">
                          <span className="font-normal">{refText}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Subject and Heading */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-center py-2">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                      {note.heading}
                    </span>
                  </div>

                  <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
                    <span className="text-amber-900 font-bold uppercase text-xs block mb-1">
                      Subject
                    </span>
                    {note.subject}
                  </div>
                </div>

                {/* Schedule Table */}
                {note.schedule && note.schedule.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Revised Schedule Details:
                    </h3>
                    <div className="overflow-x-auto rounded-2xl border border-border shadow-xs">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border-b border-border">
                          <tr>
                            <th className="p-4">Activity</th>
                            <th className="p-4 whitespace-nowrap">Existing Date</th>
                            <th className="p-4 whitespace-nowrap text-primary">Revised Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-white">
                          {note.schedule.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-4 font-medium text-slate-800 leading-relaxed">
                                {row.activity}
                              </td>
                              <td className="p-4 whitespace-nowrap text-slate-600 font-semibold">
                                {row.existingDate}
                              </td>
                              <td className="p-4 whitespace-nowrap text-primary font-extrabold bg-primary/5">
                                {row.revisedDate}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Terms and Notes */}
                {note.notes && note.notes.length > 0 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed italic">
                    {note.notes.map((noteText, idx) => (
                      <p key={idx}>{noteText}</p>
                    ))}
                  </div>
                )}

                {/* Official Signoff */}
                <div className="pt-6 border-t border-border flex justify-end">
                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-slate-900 whitespace-pre-line">
                      {note.signedBy}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      JNTU-GV College of Engineering Vizianagaram
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
