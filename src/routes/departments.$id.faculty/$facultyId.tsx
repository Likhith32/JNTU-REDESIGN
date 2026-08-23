import { createFileRoute, useLoaderData, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFacultyProfile } from "@/lib/departments";
import { setFacultyCredentials } from "@/lib/facultyAuth";
import { toast } from "sonner";
import { useFaculty } from "@/context/FacultyContext";
import {
  ArrowLeft, GraduationCap, Trophy, Globe,
  Briefcase, BookOpen, Save, Plus, Trash2, Camera, Type, IdCard, LogOut, RotateCcw, KeyRound, Mail,
  FileText, ExternalLink, Paperclip, Upload, Download, FolderKanban, File, CheckCircle2, Settings
} from "lucide-react";
import { getAssetUrl } from "@/lib/assets";
import { SafeImage } from "@/components/SafeImage";
import { PersonAvatarUpload, AdminUpload } from "@/components/AdminEditPanel";
import { PasswordInput, TextInput } from "@/components/AccountSettingsLayout";
import axios from "axios";

export const Route = createFileRoute("/departments/$id/faculty/$facultyId")({
  component: FacultyDetailProfilePage,
});

interface SectionItem {
  title: string;
  document_url?: string;
}

interface ConsultancyProject {
  title: string;
  client: string;
  status: string;
  document_url?: string;
}

interface ProfileDocument {
  id: string;
  title: string;
  category: string; // "Resume/CV" | "Certificate" | "Publication" | "Experience Letter" | "Other"
  document_url: string;
  uploaded_at?: string;
}

function parseSectionItem(item: any): SectionItem {
  if (!item) return { title: "", document_url: "" };
  if (typeof item === "string") {
    const trimmed = item.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") {
          return {
            title: parsed.title || parsed.name || "",
            document_url: parsed.document_url || parsed.url || "",
          };
        }
      } catch (e) {
        // Fallback to plain string
      }
    }
    return { title: item, document_url: "" };
  }
  if (typeof item === "object") {
    return {
      title: item.title || item.name || "",
      document_url: item.document_url || item.url || "",
    };
  }
  return { title: String(item), document_url: "" };
}

function serializeSectionItem(item: SectionItem): any {
  if (item.document_url && item.document_url.trim() !== "") {
    return JSON.stringify({
      title: item.title,
      document_url: item.document_url,
    });
  }
  return item.title;
}

function ItemDocUploader({
  docUrl,
  onUpload,
  onRemove,
  isEditMode,
  deptId,
  facultyName,
}: {
  docUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  isEditMode: boolean;
  deptId: string;
  facultyName: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds maximum limit of 15MB.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("module", "departments");
      formData.append("category", "faculty");
      formData.append("dept", deptId || "general");
      formData.append("name", facultyName || "faculty");

      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data?.path) {
        onUpload(res.data.path);
        toast.success("Document uploaded successfully!");
      } else {
        toast.error(res.data?.error || "Failed to upload document.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Document upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (docUrl && docUrl.trim() !== "") {
    const fullUrl = getAssetUrl(docUrl);
    return (
      <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0">
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline"
          title="View Attached Document"
        >
          <FileText size={13} />
          <span>View Doc</span>
          <ExternalLink size={11} />
        </a>
        {isEditMode && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:bg-red-50 p-0.5 rounded transition ml-0.5"
            title="Remove document"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    );
  }

  if (isEditMode) {
    return (
      <label className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition shrink-0">
        {uploading ? (
          <>
            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Paperclip size={12} />
            <span>Attach Doc</span>
          </>
        )}
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    );
  }

  return null;
}

function FacultyDetailProfilePage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { logout } = useFaculty();
  const { id: deptId, facultyId } = Route.useParams();
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const queryClient = useQueryClient();

  // Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const { isDeptEditing } = useAdmin();
  const { isOwnProfile } = useFaculty();

  const facultyRaw = data?.faculty?.find((f: any) => String(f.id) === String(facultyId));
  const isDeptLevelEdit = isDeptEditing(deptId || ""); // admin/HOD
  const isFacultySelfEdit = isOwnProfile(facultyId);    // the faculty member themself

  const isEditMode = isDeptLevelEdit || isFacultySelfEdit;
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Local reactive edit state mapping
  const [editState, setEditState] = useState<any>(null);

  const parseRawFacultyData = (raw: any) => {
    if (!raw) return null;
    return {
      name: raw.name || "",
      designation: raw.designation || "",
      photo_url: raw.photo_url || "",
      qualifications: (raw.qualifications || ["M.Tech", "Ph.D"]).map(parseSectionItem),
      specialization: raw.specialization || "Advanced Systems Architectures",
      experience_years: raw.experience_years ?? 10,
      awards: (raw.awards || ["Best Faculty Achievement Award"]).map(parseSectionItem),
      fellowships: (raw.fellowships || ["Institutional Research Fellow"]).map(parseSectionItem),
      professional_memberships: (raw.professional_memberships || ["IEEE Member", "ISTE Life Member"]).map(parseSectionItem),
      international_exchanges: (raw.international_exchanges || ["Visiting Professor Scheme"]).map(parseSectionItem),
      sabbaticals: (raw.sabbaticals || ["Research Sabbatical Leave Program"]).map(parseSectionItem),
      consultancy_projects: raw.consultancy_projects || [
        { title: "Industrial Optimization Framework", client: "Local Technical Agency", status: "Completed" }
      ],
      fdps_attended: (raw.fdps_attended || ["National Faculty Development Initiative"]).map(parseSectionItem),
      conferences_attended: (raw.conferences_attended || ["International Research Symposium Presentation"]).map(parseSectionItem),
      documents: raw.documents || [],
    };
  };

  const resetToOriginal = () => {
    if (facultyRaw) {
      setEditState(parseRawFacultyData(facultyRaw));
      toast.info("Unsaved modifications reverted to original profile.");
    }
  };

  useEffect(() => {
    if (facultyRaw) {
      setEditState(parseRawFacultyData(facultyRaw));
    }
  }, [facultyRaw]);

  const mutation = useMutation({
    mutationFn: (payload: any) => {
      // Serialize items back to text array format for DB backward compatibility
      const serializedPayload = {
        ...payload,
        qualifications: payload.qualifications.map(serializeSectionItem),
        awards: payload.awards.map(serializeSectionItem),
        fellowships: payload.fellowships.map(serializeSectionItem),
        professional_memberships: payload.professional_memberships.map(serializeSectionItem),
        international_exchanges: payload.international_exchanges.map(serializeSectionItem),
        sabbaticals: payload.sabbaticals.map(serializeSectionItem),
        fdps_attended: payload.fdps_attended.map(serializeSectionItem),
        conferences_attended: payload.conferences_attended.map(serializeSectionItem),
        consultancy_projects: payload.consultancy_projects,
        documents: payload.documents || [],
      };
      return updateFacultyProfile({ data: { facultyId, profileData: serializedPayload } });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      await router.invalidate();
      toast.success("Faculty profile modifications updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to commit database changes execution.");
    }
  });

  if (!facultyRaw || !editState) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-bold text-slate-800">Faculty member record not found.</h3>
        <Link to="/departments/$id/faculty" params={{ id: deptId }} className="text-blue-600 text-sm underline mt-2 inline-block">
          Return back to roster
        </Link>
      </div>
    );
  }

  // --- Core Utility State Manipulators for Array/JSON Collections ---
  const handleItemTitleChange = (field: string, index: number, value: string) => {
    const updatedArr = [...editState[field]];
    updatedArr[index] = { ...updatedArr[index], title: value };
    setEditState({ ...editState, [field]: updatedArr });
  };

  const handleItemDocChange = (field: string, index: number, docUrl: string) => {
    const updatedArr = [...editState[field]];
    updatedArr[index] = { ...updatedArr[index], document_url: docUrl };
    setEditState({ ...editState, [field]: updatedArr });
  };

  const addArrayElement = (field: string, defaultValue = "New Entry Item") => {
    setEditState({ ...editState, [field]: [...editState[field], { title: defaultValue, document_url: "" }] });
  };

  const removeArrayElement = (field: string, index: number) => {
    setEditState({ ...editState, [field]: editState[field].filter((_: any, i: number) => i !== index) });
  };

  const handleConsultancyChange = (index: number, key: keyof ConsultancyProject, value: string) => {
    const updatedProjects = [...editState.consultancy_projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };
    setEditState({ ...editState, consultancy_projects: updatedProjects });
  };

  const addConsultancyProject = () => {
    const newProj: ConsultancyProject = { title: "New Enterprise Project", client: "Agency Partner", status: "Active", document_url: "" };
    setEditState({ ...editState, consultancy_projects: [...editState.consultancy_projects, newProj] });
  };

  // --- Documents Tab State Manipulators ---
  const addDocument = () => {
    const newDoc: ProfileDocument = {
      id: Math.random().toString(36).substring(2, 11),
      title: "New Document",
      category: "Resume/CV",
      document_url: "",
      uploaded_at: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    setEditState({ ...editState, documents: [...(editState.documents || []), newDoc] });
  };

  const updateDocument = (index: number, patch: Partial<ProfileDocument>) => {
    const updatedDocs = [...(editState.documents || [])];
    updatedDocs[index] = { ...updatedDocs[index], ...patch };
    setEditState({ ...editState, documents: updatedDocs });
  };

  const removeDocument = (index: number) => {
    const updatedDocs = (editState.documents || []).filter((_: any, i: number) => i !== index);
    setEditState({ ...editState, documents: updatedDocs });
  };

  const tabs = [
    { id: "profile", label: "1. Profile Overview", icon: GraduationCap },
    { id: "achievements", label: "2. Achievements", icon: Trophy },
    { id: "exchanges", label: "3. Exchanges & Sabbaticals", icon: Globe },
    { id: "consultancy", label: "4. Consultancy Projects", icon: Briefcase },
    { id: "development", label: "5. Professional Dev", icon: BookOpen },
    { id: "documents", label: "6. Documents", icon: FileText },
  ];

  return (
    <div className="animate-in fade-in duration-300 space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header Control Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 backdrop-blur-md p-3 md:px-5 md:py-3 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Left: Back Button & Session Status */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/departments/$id/faculty"
            params={{ id: deptId }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>Back to Faculty List</span>
          </Link>

          {isFacultySelfEdit && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Faculty Portal Session
            </span>
          )}
        </div>

        {/* Right: Actions (Account Settings, Logout, Revert, Save) */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {isFacultySelfEdit && (
            <>
              <Link
                to="/faculty-account-settings"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Manage login email and password"
              >
                <KeyRound size={14} className="text-slate-600" />
                <span>Account Settings</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate({ to: "/staff-2b9f6e3d" });
                }}
                className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Sign out of faculty profile"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          )}

          {isEditMode && (
            <>
              <button
                type="button"
                onClick={resetToOriginal}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl font-bold text-xs border border-slate-300 transition cursor-pointer"
                title="Revert unsaved changes"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Undo</span>
              </button>
              <button
                onClick={() => mutation.mutate(editState)}
                disabled={mutation.isPending}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Header Block */}
      <div className={`relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row gap-8 items-center border transition-all ${isEditMode ? 'border-amber-400 ring-4 ring-amber-400/10' : 'border-transparent'}`}>
        {isEditMode ? (
          <div className="shrink-0 flex flex-col items-center gap-2">
            <PersonAvatarUpload
              value={editState.photo_url || ""}
              onChange={(newUrl) => setEditState({ ...editState, photo_url: newUrl })}
              module="departments"
              category="faculty"
              dept={deptId}
              name={editState.name || facultyRaw.name}
              size={144}
              fallbackName={editState.name}
            />
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Click photo to change
            </span>
          </div>
        ) : (
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/10 shrink-0 bg-white/5 relative group">
            <SafeImage
              src={editState.photo_url}
              alt={editState.name}
              decoding="async"
              loading="lazy"
              fallbackName={editState.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="text-center md:text-left flex-grow space-y-4 w-full">
          {!isEditMode ? (
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-500/20 border border-blue-400/20 text-blue-300">
                Faculty Profile Record
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight pt-1">{editState.name}</h2>
              <p className="text-lg text-slate-300 font-medium">{editState.designation}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><Type size={12} /> Faculty Name</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-sm outline-none font-bold text-white focus:ring-2 focus:ring-amber-400/40" value={editState.name} onChange={(e) => setEditState({ ...editState, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1"><IdCard size={12} /> Designation</label>
                <input className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-sm outline-none text-white focus:ring-2 focus:ring-amber-400/40" value={editState.designation} onChange={(e) => setEditState({ ...editState, designation: e.target.value })} />
              </div>
            </div>
          )}
        </div>
      </div>

      {isDeptLevelEdit && (
        <FacultyLoginPanel facultyId={Number(facultyId)} currentEmail={(facultyRaw as any).faculty_email || ""} />
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm tracking-tight transition-all cursor-pointer ${isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Core Dynamic Content Body Panel */}
      <div className={`bg-white border rounded-[2rem] p-6 md:p-8 shadow-sm transition-all ${isEditMode ? 'border-amber-300 bg-amber-50/10' : 'border-slate-100'}`}>

        {/* --- Tab 1: Profile --- */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">1. Faculty Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-2">Educational Qualifications</span>
                <div className="space-y-2.5">
                  {editState.qualifications.map((item: SectionItem, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        disabled={!isEditMode}
                        className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg w-full outline-none disabled:opacity-100 border border-transparent focus:border-slate-300"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("qualifications", idx, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("qualifications", idx, url)}
                        onRemove={() => handleItemDocChange("qualifications", idx, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("qualifications", idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg shrink-0"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("qualifications", "M.Tech")} className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold border border-dashed border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50/50 cursor-pointer"><Plus size={12} /> Add Degree</button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Area of Specialization</span>
                  <input
                    disabled={!isEditMode}
                    className="text-slate-800 border bg-transparent border-slate-200 disabled:border-transparent p-2 rounded-xl text-sm font-semibold w-full outline-none focus:bg-white"
                    value={editState.specialization}
                    onChange={(e) => setEditState({ ...editState, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">Experience (Years)</span>
                  <input
                    type="number"
                    disabled={!isEditMode}
                    className="text-slate-800 border bg-transparent border-slate-200 disabled:border-transparent p-2 rounded-xl text-sm font-semibold w-full outline-none focus:bg-white"
                    value={editState.experience_years}
                    onChange={(e) => setEditState({ ...editState, experience_years: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: Achievements --- */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">2. Faculty Achievements</h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Awards Row */}
              <div>
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Awards Received</h4>
                <div className="space-y-2.5">
                  {editState.awards.map((item: SectionItem, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <input
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-700 bg-transparent outline-none border-b border-transparent focus:border-slate-200 disabled:opacity-100 py-1"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("awards", idx, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("awards", idx, url)}
                        onRemove={() => handleItemDocChange("awards", idx, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("awards", idx)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("awards", "National/Institutional Research Honor")} className="flex items-center gap-1 text-[11px] text-blue-700 font-bold pt-1 cursor-pointer"><Plus size={12} /> Add Award Item</button>
                  )}
                </div>
              </div>

              {/* Fellowships Row */}
              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Fellowships</h4>
                <div className="space-y-2.5">
                  {editState.fellowships.map((item: SectionItem, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                      <input
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-700 bg-transparent outline-none border-b border-transparent focus:border-slate-200 disabled:opacity-100 py-1"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("fellowships", idx, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("fellowships", idx, url)}
                        onRemove={() => handleItemDocChange("fellowships", idx, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("fellowships", idx)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("fellowships", "Honorary Research Fellow Group")} className="flex items-center gap-1 text-[11px] text-indigo-700 font-bold pt-1 cursor-pointer"><Plus size={12} /> Add Fellowship Item</button>
                  )}
                </div>
              </div>

              {/* Memberships Row */}
              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Professional Memberships</h4>
                <div className="space-y-2.5">
                  {editState.professional_memberships.map((item: SectionItem, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 p-2 rounded-xl">
                      <input
                        disabled={!isEditMode}
                        className="bg-transparent outline-none w-full text-xs font-bold text-blue-900"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("professional_memberships", idx, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("professional_memberships", idx, url)}
                        onRemove={() => handleItemDocChange("professional_memberships", idx, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("professional_memberships", idx)} className="text-red-500 hover:bg-white rounded-md p-1 shrink-0"><Trash2 size={12} /></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("professional_memberships", "IEEE Member")} className="bg-white border border-dashed border-slate-300 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"><Plus size={12} /> Add Membership</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 3: Exchanges & Sabbaticals --- */}
        {activeTab === "exchanges" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">3. Faculty Exchange and Sabbaticals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Faculty Exchanges</h4>
                  <div className="space-y-2.5">
                    {editState.international_exchanges.map((item: SectionItem, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          disabled={!isEditMode}
                          className="w-full text-sm text-slate-600 bg-white border border-slate-200 disabled:border-transparent disabled:bg-transparent rounded-lg p-1.5 outline-none font-medium"
                          value={item.title}
                          onChange={(e) => handleItemTitleChange("international_exchanges", idx, e.target.value)}
                        />
                        <ItemDocUploader
                          docUrl={item.document_url}
                          onUpload={(url) => handleItemDocChange("international_exchanges", idx, url)}
                          onRemove={() => handleItemDocChange("international_exchanges", idx, "")}
                          isEditMode={isEditMode}
                          deptId={deptId || "general"}
                          facultyName={editState.name}
                        />
                        {isEditMode && (
                          <button onClick={() => removeArrayElement("international_exchanges", idx)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("international_exchanges", "Exchanged Faculty Delegate")} className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-4 cursor-pointer"><Plus size={12} /> Add Record</button>
                )}
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Sabbaticals (Academic Leaves)</h4>
                  <div className="space-y-2.5">
                    {editState.sabbaticals.map((item: SectionItem, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          disabled={!isEditMode}
                          className="w-full text-sm text-slate-600 bg-white border border-slate-200 disabled:border-transparent disabled:bg-transparent rounded-lg p-1.5 outline-none font-medium"
                          value={item.title}
                          onChange={(e) => handleItemTitleChange("sabbaticals", idx, e.target.value)}
                        />
                        <ItemDocUploader
                          docUrl={item.document_url}
                          onUpload={(url) => handleItemDocChange("sabbaticals", idx, url)}
                          onRemove={() => handleItemDocChange("sabbaticals", idx, "")}
                          isEditMode={isEditMode}
                          deptId={deptId || "general"}
                          facultyName={editState.name}
                        />
                        {isEditMode && (
                          <button onClick={() => removeArrayElement("sabbaticals", idx)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("sabbaticals", "Research Leave Assignment")} className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-4 cursor-pointer"><Plus size={12} /> Add Sabbatical Leave</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 4: Consultancy --- */}
        {activeTab === "consultancy" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">4. Consultancy Assignments</h3>
              {isEditMode && (
                <button onClick={addConsultancyProject} className="flex items-center gap-1 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold cursor-pointer"><Plus size={12} /> Add Row</button>
              )}
            </div>
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Organization Partner</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Document</th>
                    {isEditMode && <th className="p-4 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {editState.consultancy_projects.map((proj: ConsultancyProject, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <input
                          disabled={!isEditMode}
                          className="bg-transparent font-semibold text-slate-900 outline-none w-full border-b border-transparent focus:border-slate-200"
                          value={proj.title}
                          onChange={(e) => handleConsultancyChange(idx, "title", e.target.value)}
                        />
                      </td>
                      <td className="p-4">
                        <input
                          disabled={!isEditMode}
                          className="bg-transparent outline-none w-full border-b border-transparent focus:border-slate-200"
                          value={proj.client}
                          onChange={(e) => handleConsultancyChange(idx, "client", e.target.value)}
                        />
                      </td>
                      <td className="p-4">
                        {isEditMode ? (
                          <select
                            className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-bold outline-none"
                            value={proj.status}
                            onChange={(e) => handleConsultancyChange(idx, "status", e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${proj.status === "Completed" ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>{proj.status}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <ItemDocUploader
                          docUrl={proj.document_url}
                          onUpload={(url) => handleConsultancyChange(idx, "document_url", url)}
                          onRemove={() => handleConsultancyChange(idx, "document_url", "")}
                          isEditMode={isEditMode}
                          deptId={deptId || "general"}
                          facultyName={editState.name}
                        />
                      </td>
                      {isEditMode && (
                        <td className="p-4 text-center">
                          <button onClick={() => {
                            const updated = editState.consultancy_projects.filter((_: any, i: number) => i !== idx);
                            setEditState({ ...editState, consultancy_projects: updated });
                          }} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><Trash2 size={14} /></button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Tab 5: Professional Development --- */}
        {activeTab === "development" && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 border-b pb-2 border-slate-100">5. Professional Development</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">FDPs & Workshops Completed</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {editState.fdps_attended.map((item: SectionItem, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between gap-2">
                      <input
                        disabled={!isEditMode}
                        className="bg-transparent outline-none w-full font-semibold"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("fdps_attended", i, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("fdps_attended", i, url)}
                        onRemove={() => handleItemDocChange("fdps_attended", i, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("fdps_attended", i)} className="text-red-500 shrink-0"><Trash2 size={12} /></button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditMode && (
                  <button onClick={() => addArrayElement("fdps_attended", "Advanced Research Workshop Focus")} className="flex items-center gap-1 text-[11px] text-slate-700 font-bold mt-2 cursor-pointer"><Plus size={12} /> Add FDP/Workshop Program</button>
                )}
              </div>

              <div className="border-t pt-4 border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Conferences Attended</h4>
                <div className="space-y-2.5">
                  {editState.conferences_attended.map((item: SectionItem, i: number) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <input
                        disabled={!isEditMode}
                        className="w-full text-sm text-slate-600 bg-transparent outline-none border-b border-transparent focus:border-slate-200 py-0.5 font-medium"
                        value={item.title}
                        onChange={(e) => handleItemTitleChange("conferences_attended", i, e.target.value)}
                      />
                      <ItemDocUploader
                        docUrl={item.document_url}
                        onUpload={(url) => handleItemDocChange("conferences_attended", i, url)}
                        onRemove={() => handleItemDocChange("conferences_attended", i, "")}
                        isEditMode={isEditMode}
                        deptId={deptId || "general"}
                        facultyName={editState.name}
                      />
                      {isEditMode && (
                        <button onClick={() => removeArrayElement("conferences_attended", i)} className="text-red-500 shrink-0"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  {isEditMode && (
                    <button onClick={() => addArrayElement("conferences_attended", "IEEE Academic Track Symposium Convention")} className="flex items-center gap-1 text-[11px] text-slate-700 font-bold pt-1 cursor-pointer"><Plus size={12} /> Add Conference Entry</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 6: Documents --- */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">6. Faculty Documents & Portfolio</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Access and view official documents including Resume, CV, Degree Certificates, and Academic Records.
                </p>
              </div>
              {isEditMode && (
                <button
                  type="button"
                  onClick={addDocument}
                  className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer shrink-0"
                >
                  <Plus size={14} /> Add Document
                </button>
              )}
            </div>

            {(!editState.documents || editState.documents.length === 0) ? (
              <div className="text-center py-12 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <FileText size={22} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">No documents uploaded yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isEditMode
                    ? "Click 'Add Document' above to upload Resume, CV, Certificates, or other files."
                    : "No official public documents have been published for this profile."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editState.documents.map((doc: ProfileDocument, idx: number) => {
                  const hasDoc = Boolean(doc.document_url && doc.document_url.trim() !== "");
                  const assetUrl = hasDoc ? getAssetUrl(doc.document_url) : "";

                  // Color accents by category
                  const categoryBadgeColor =
                    doc.category === "Resume/CV" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                      doc.category === "Certificate" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        doc.category === "Publication" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          doc.category === "Experience Letter" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-slate-100 text-slate-700 border-slate-200";

                  return (
                    <div
                      key={doc.id || idx}
                      className={`p-5 rounded-2xl border transition-all ${isEditMode ? "bg-amber-500/5 border-amber-200" : "bg-slate-50/70 hover:bg-white border-slate-200 hover:shadow-md"
                        }`}
                    >
                      {isEditMode ? (
                        /* Edit mode card form */
                        <div className="space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Document #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeDocument(idx)}
                              className="text-red-500 hover:bg-red-100 p-1 rounded-lg transition"
                              title="Delete document"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Document Title</label>
                            <input
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-400"
                              value={doc.title}
                              onChange={(e) => updateDocument(idx, { title: e.target.value })}
                              placeholder="e.g. Resume / CV 2026"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                            <select
                              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs font-semibold outline-none focus:border-amber-400"
                              value={doc.category}
                              onChange={(e) => updateDocument(idx, { category: e.target.value })}
                            >
                              <option value="Resume/CV">Resume / CV</option>
                              <option value="Certificate">Certificate</option>
                              <option value="Publication">Publication</option>
                              <option value="Experience Letter">Experience Letter</option>
                              <option value="Other">Other Document</option>
                            </select>
                          </div>

                          <div className="pt-1">
                            <ItemDocUploader
                              docUrl={doc.document_url}
                              onUpload={(url) => updateDocument(idx, { document_url: url })}
                              onRemove={() => updateDocument(idx, { document_url: "" })}
                              isEditMode={true}
                              deptId={deptId || "general"}
                              facultyName={editState.name}
                            />
                          </div>
                        </div>
                      ) : (
                        /* Normal view mode card */
                        <div className="flex items-start justify-between gap-4 h-full">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                              {doc.document_url?.endsWith(".pdf") ? (
                                <FileText className="text-red-500" size={20} />
                              ) : (
                                <File className="text-blue-500" size={20} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${categoryBadgeColor}`}>
                                {doc.category || "Document"}
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                                {doc.title}
                              </h4>
                              {doc.uploaded_at && (
                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                  Updated: {doc.uploaded_at}
                                </p>
                              )}
                            </div>
                          </div>

                          {hasDoc ? (
                            <a
                              href={assetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-xs transition hover:shadow shrink-0"
                            >
                              <span>View Doc</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No file attached</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FacultyLoginPanel({
  facultyId,
  currentEmail,
}: {
  facultyId: number;
  currentEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setEmail(currentEmail);
  }, [currentEmail]);

  const mutation = useMutation({
    mutationFn: () =>
      setFacultyCredentials({
        data: { facultyId, email, newPassword: password },
      }),
    onSuccess: () => {
      toast.success("Faculty portal login updated.");
      setPassword("");
      setOpen(false);
    },
    onError: (err: any) => toast.error(err?.message || "Failed to update login."),
  });

  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <KeyRound size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-ink">Faculty portal login</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentEmail
                ? `Current login: ${currentEmail}`
                : "No portal login set yet. Create email and password so this faculty can sign in."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-bold text-teal-800 bg-white border border-teal-200 px-3 py-2 rounded-xl hover:bg-teal-50 transition-colors shrink-0"
        >
          {open ? "Close" : currentEmail ? "Reset login" : "Set login"}
        </button>
      </div>

      {open && (
        <form
          className="grid gap-3 sm:grid-cols-2 bg-white/80 border border-teal-100 rounded-xl p-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Login email</label>
            <TextInput
              accent="faculty"
              type="email"
              icon={Mail}
              value={email}
              onChange={setEmail}
              required
              placeholder="name@jntugv.edu.in"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Temporary password</label>
            <PasswordInput
              accent="faculty"
              value={password}
              onChange={setPassword}
              required
              showStrength
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={mutation.isPending || password.length < 8}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold disabled:opacity-50"
            >
              {mutation.isPending ? "Saving…" : "Save portal credentials"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
