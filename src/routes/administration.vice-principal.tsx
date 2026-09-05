import { createFileRoute } from "@tanstack/react-router";
import { imageUrl, getAssetUrl } from "@/lib/assets";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ADMINISTRATION_SUBNAV } from "@/lib/site";
import { Quote, Mail, MapPin, Save, X, BookOpen, Award } from "lucide-react";
const campusImg = imageUrl("hero-carousal/hero-campus.jpg");
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import { getLeadershipData, updateLeadershipData } from "@/funcs/leadership";
import { AdminUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/administration/vice-principal")({
  head: () => ({
    meta: [
      { title: "Vice Principal — Administration — JNTU-GV CEV" },
      {
        name: "description",
        content:
          "Vice Principal's message and profile of JNTU-GV College of Engineering Vizianagaram.",
      },
    ],
  }),
  component: VicePrincipalPage,
});

function VicePrincipalPage() {
  const queryClient = useQueryClient();
  const { isAdmin, isEditMode } = useAdmin();
  const [editedData, setEditedData] = useState<any>(null);

  const { data: vicePrincipal, isLoading } = useQuery({
    queryKey: ["leadership", "vice-principal"],
    queryFn: () => getLeadershipData({ data: "vice-principal" }),
  });

  const updateMutation = useMutation({
    mutationFn: updateLeadershipData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadership", "vice-principal"] });
      setEditedData(null);
      toast.success("Vice Principal's information updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update Vice Principal's information.");
    },
  });

  const handleSave = () => {
    if (!editedData) return;
    updateMutation.mutate({ data: { id: vicePrincipal.id, ...editedData } });
  };

  if (isLoading || !vicePrincipal)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="spinner" />
      </div>
    );

  const data = editedData || vicePrincipal;

  return (
    <>
      <PageHero
        eyebrow="Administration"
        title="Vice Principal's Desk"
        subtitle="Supporting academic excellence and administrative efficiency."
        image={campusImg}
      />
      <SubNav items={ADMINISTRATION_SUBNAV} />

      <section className="py-24 md:py-32 container-narrow">
        <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-start max-w-6xl mx-auto">
          {/* Profile Sidebar */}
          <RevealOnScroll>
            <div className="space-y-8 lg:sticky lg:top-32">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[40px] bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors duration-200" />
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white shadow-elegant bg-card">
                  {isEditMode ? (
                    <AdminUpload
                      value={data.image}
                      onChange={(newUrl) => setEditedData({ ...data, image: newUrl })}
                      module="administration"
                      category="leadership"
                      className="w-full h-full"
                    />
                  ) : (
                    <img decoding="async" loading="lazy"
                      src={getAssetUrl(data.image || "https://jntugvcev.edu.in/local-assets/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg")}
                      alt={data.name}
                      className="h-full w-full object-cover transition-all duration-700"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      className="w-full text-2xl font-bold text-ink bg-primary/5 p-2 rounded outline-none"
                      value={data.name}
                      onChange={(e) => setEditedData({ ...data, name: e.target.value })}
                    />
                    <input
                      className="w-full text-primary font-medium bg-primary/5 p-2 rounded outline-none"
                      value={data.designation}
                      onChange={(e) => setEditedData({ ...data, designation: e.target.value })}
                    />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-ink">{data.name}</h2>
                    <p className="text-primary font-medium">{data.designation}</p>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    {isEditMode ? (
                      <input
                        className="flex-1 bg-primary/5 p-1 rounded outline-none text-sm"
                        value={data.email}
                        onChange={(e) => setEditedData({ ...data, email: e.target.value })}
                      />
                    ) : (
                      <span className="text-sm">{data.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">Vice Principal's Office, Admin Block</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Message Content */}
          <div className="space-y-12">
            <RevealOnScroll delay={100}>
              <div className="relative">
                <Quote className="h-12 w-12 text-primary/10 absolute -top-6 -left-6" />
                {isEditMode ? (
                  <textarea
                    className="w-full text-display text-2xl md:text-3xl text-ink leading-tight italic bg-primary/5 p-4 rounded outline-none min-h-[120px]"
                    value={data.quote}
                    onChange={(e) => setEditedData({ ...data, quote: e.target.value })}
                  />
                ) : (
                  <p className="text-display text-2xl md:text-3xl text-ink leading-tight italic">
                    "{data.quote}"
                  </p>
                )}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-200">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Academic Coordination</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Overseeing the implementation of academic regulations, course delivery, and
                    examination schedules across all departments.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-card border border-border hover:border-primary/20 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5 group-hover:bg-[var(--gradient-royal)] group-hover:text-white transition-all duration-200">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-3">Student Affairs</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Managing student welfare programs, discipline, and campus life initiatives to
                    foster a holistic learning environment.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="prose prose-lg text-muted-foreground max-w-none border-t border-border pt-12">
                <h3 className="text-ink font-bold">Responsibilities</h3>
                <ul className="space-y-2 mt-4">
                  <li>Formulating and implementing academic calendars.</li>
                  <li>Monitoring faculty performance and development programs.</li>
                  <li>Coordinating with the College Academic Committee (CAC).</li>
                  <li>Overseeing admissions and registration processes.</li>
                  <li>Ensuring student discipline and welfare on campus.</li>
                </ul>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  );
}
