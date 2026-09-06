import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { getAssetUrl, updateDepartment, STATIC_DEPARTMENTS } from "@/lib/departments";
import { SafeImage } from "@/components/SafeImage";
import { useAdmin } from "@/context/AdminContext";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminUpload } from "@/components/AdminEditPanel";
import { 
  Mail, 
  Quote, 
  UserCircle, 
  GraduationCap, 
  Save, 
  Image as ImageIcon, 
  Mail as MailIcon,
  MessageSquare
} from "lucide-react";
import { ProfileRenderer } from "@/components/ProfileRenderer";

export const Route = createFileRoute("/departments/$id/hod")({
  head: ({ matches }) => {
    const parentMatch = matches.find((m) => (m.routeId as string) === "/departments/$id");
    const parentData = parentMatch?.loaderData as DepartmentData | undefined;
    const name = parentData?.name || "Department";
    const hodFaculty = parentData?.faculty?.find((f) => /hod|head of (the )?department/i.test(f.designation || ""));
    const hod = hodFaculty?.name || parentData?.hod || STATIC_DEPARTMENTS.find((d) => d.slug === parentData?.slug || d.id === parentData?.id)?.hod || "Head of Department";
    return {
      meta: [
        { title: `HOD Message — ${name} — JNTU-GV CEV` },
        {
          name: "description",
          content: `Read the message from ${hod}, the Head of the ${name} Department at JNTU-GV College of Engineering Vizianagaram.`,
        },
      ],
      links: [
        { rel: "canonical", href: `https://jntugvcev.edu.in/departments/${parentData?.slug || ""}/hod` }
      ],
    };
  },
  component: HodPage,
});

function HodPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();
  // 1. Fetch the active dynamic route parameters matching this branch slug context
  const { id: routeSlug } = useParams({ from: "/departments/$id/hod" });

  // 2. Consume specialized department tracking state maps from Admin Context
  const { isDeptEditing } = useAdmin();

  // 3. Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const isEditMode = isDeptEditing(routeSlug || "");

  // 4. Resolve HOD faculty member and fallback data
  const hodDetails = data?.faculty?.find((f) => /hod|head of (the )?department/i.test(f.designation || ""));
  const staticDept = STATIC_DEPARTMENTS.find((d) => d.slug === data?.slug || d.id === data?.id);
  const rawHodName = (hodDetails?.name || data?.hod || staticDept?.hod || "").trim();
  const hodName = rawHodName || `Head of Department`;

  const defaultEmail = data?.slug
    ? `hod.${data.slug === "mech" ? "me" : data.slug === "bshss" ? "bs" : data.slug}@jntugvcev.edu.in`
    : "";

  // Local state for editing HOD details
  const [editData, setEditData] = useState({
    hod_photo: data?.hod_photo || hodDetails?.photo_url || "",
    hod_contact: data?.hod_contact || hodDetails?.email || defaultEmail || "",
    hod_message: data?.hod_message || "",
  });

  // Sync state if data changes
  useEffect(() => {
    if (data) {
      setEditData({
        hod_photo: data.hod_photo || hodDetails?.photo_url || "",
        hod_contact: data.hod_contact || hodDetails?.email || defaultEmail || "",
        hod_message: data.hod_message || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: data.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", data.slug] });
      toast.success("HOD details updated successfully!");
    },
  });

  if (!data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-slate-600">Loading...</div>
    </div>
  );

  const activePhoto = editData.hod_photo || data.hod_photo || hodDetails?.photo_url || "";
  const displayContact = editData.hod_contact || data.hod_contact || hodDetails?.email || defaultEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Department Leadership</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              From the HOD's Desk
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
              A message from our department head, sharing vision, achievements, and future directions.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent z-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {isEditMode && (
          <div className="mb-8 p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-center justify-between">
            <p className="text-amber-800 text-sm font-medium">
              <strong>Admin Mode:</strong> You are currently editing the HOD's profile and message.
            </p>
            <button
              onClick={() => mutation.mutate(editData)}
              className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-amber-700 transition-all"
            >
              <Save size={18} /> Save All Changes
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column - HOD Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border transition-all ${isEditMode ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'}`}>
                <div className={`h-32 bg-gradient-to-r ${isEditMode ? 'from-amber-500 to-amber-600' : 'from-blue-600 to-blue-800'}`}></div>

                {/* Profile Image & Photo URL Edit */}
                <div className="relative -mt-16 px-6 text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white mx-auto">
                      <SafeImage
                        src={activePhoto}
                        alt={hodName}
                        fallbackName={hodName}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                    {isEditMode && (
                      <div className="mt-4 text-left">
                        <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                          <ImageIcon size={12} /> HOD Photo
                        </label>
                        <AdminUpload
                          value={editData.hod_photo}
                          onChange={(newUrl) => setEditData({ ...editData, hod_photo: newUrl })}
                          module="departments"
                          category="hod"
                          placeholder="Upload Photo"
                        />
                      </div>
                    )}

                  <h2 className="text-2xl font-bold text-slate-900 mt-4">{hodName}</h2>
                  <p className="text-blue-600 font-semibold mt-1">Head of the Department</p>
                  <p className="text-slate-500 text-sm mt-2">Dept. of {data.name}</p>

                  {/* Contact Edit */}
                  <div className="mt-6 pt-6 border-t border-slate-100 pb-6">
                    {isEditMode ? (
                      <div className="text-left">
                        <label className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1 mb-1">
                          <MailIcon size={12} /> Contact Email
                        </label>
                        <input
                          className="w-full text-xs p-2 border border-amber-200 rounded bg-amber-50/50"
                          value={editData.hod_contact}
                          onChange={(e) => setEditData({ ...editData, hod_contact: e.target.value })}
                          placeholder="hod@jntugvcev.edu.in"
                        />
                      </div>
                    ) : displayContact && (
                      <a
                        href={`mailto:${displayContact}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md"
                      >
                        <Mail size={18} />
                        <span className="font-medium">Email HOD</span>
                      </a>
                    )}
                    {displayContact && !isEditMode && (
                      <p className="text-xs text-slate-400 mt-3 break-all">{displayContact}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Message */}
          <div className="lg:col-span-8">
            <div className={`bg-white rounded-2xl shadow-xl border overflow-hidden transition-all ${isEditMode ? 'border-amber-300' : 'border-slate-200'}`}>
              <div className={`px-8 py-6 border-b flex items-center justify-between ${isEditMode ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${isEditMode ? 'bg-amber-100' : 'bg-blue-50'}`}>
                    <MessageSquare className={`w-6 h-6 ${isEditMode ? 'text-amber-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">A Message from the Head</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Last updated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-10">
                {isEditMode ? (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-amber-600 uppercase">Message Content</label>
                    <textarea
                      className="w-full min-h-[400px] p-6 border-2 border-amber-100 rounded-2xl bg-amber-50/30 text-slate-700 leading-relaxed outline-none focus:border-amber-300 transition-all"
                      value={editData.hod_message}
                      onChange={(e) => setEditData({ ...editData, hod_message: e.target.value })}
                      placeholder="Write the HOD message here..."
                    />
                  </div>
                ) : (
                  <div className="prose prose-lg prose-blue max-w-none">
                    {editData.hod_message ? (
                      <div className="relative">
                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-blue-50 -z-10" />
                        <div className="text-slate-700">
                          <ProfileRenderer content={editData.hod_message} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Quote className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No message has been uploaded yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {editData.hod_message && !isEditMode && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-slate-400 mb-2 italic">Best Regards,</p>
                        <p className="text-xl font-bold text-slate-900">{hodName}</p>
                        <p className="text-slate-500 text-sm font-medium">Head of the Department</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}