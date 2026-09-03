import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard } from "@/components/academics/ui/GlassCard";
import {
  Users2, Mail, Phone, BookOpen, Star, Sparkles, Plus, Trash2,
  Edit2, Save, X, Search, Briefcase, Award, Quote, UserCheck, Shield, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";
import {
  getAcademicsVcProfiles,
  upsertAcademicsVcProfile,
  deleteAcademicsVcProfile,
  getAcademicsHodDesk,
  upsertAcademicsHodDesk,
  deleteAcademicsHodDesk,
  getAcademicsPrincipals,
  upsertAcademicsPrincipal,
  deleteAcademicsPrincipal
} from "@/lib/academics";
import { getDepartments } from "@/lib/departments";
import { getAllFacultyList } from "@/functions/departments";
import { getAssetUrl, imageUrl } from "@/lib/assets";
import { SafeImage } from "@/components/SafeImage";
import { PageHero } from "@/components/PageHero";
import { VerticalSubNav } from "@/components/VerticalSubNav";
import { ACADEMICS_SUBNAV } from "@/lib/site";

const campusImg = imageUrl("hero-carousal/hero-campus.jpg");

export const Route = createFileRoute("/academics/faculty")({
  component: FacultyPage,
});

interface FacultyCardProps {
  f: {
    id: string | number;
    name: string;
    designation: string;
    photo_url?: string | null;
    department_name?: string;
    department_slug?: string;
  };
}

function FacultyCard({ f }: FacultyCardProps) {
  return (
    <div className="p-6 border rounded-3xl bg-white flex gap-6 items-center relative transition-all h-full border-slate-100 shadow-sm hover:border-blue-500/30">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100">
        <SafeImage 
          src={f.photo_url || ""} 
          alt={f.name}
          decoding="async"
          loading="lazy"
          fallbackName={f.name}
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="flex-grow space-y-2">
        <div className="flex flex-col h-full justify-between">
          <div>
            {f.department_name && (
              <span className="text-[9px] font-extrabold uppercase tracking-widest bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded mb-2 inline-block">
                {f.department_name.replace("Engineering", "Engg")}
              </span>
            )}
            <h3 className="text-xl font-bold text-blue-900 leading-snug">{f.name}</h3>
            <p className="text-slate-600 font-medium text-sm">{f.designation}</p>
          </div>
          
          <div className="pt-2">
            {f.department_slug ? (
              <Link
                to="/departments/$id/faculty/$facultyId"
                params={{ id: f.department_slug, facultyId: String(f.id) }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
              >
                <Eye size={14} /> View Profile
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const FALLBACK_VCS = [
  {
    id: 1,
    name: " Prof. V.V. Subba Rao",
    designation: "Vice Chancellor, JNTU-GV",
    message: "Committed to fostering academic brilliance, cutting-edge research, and holistic student development. Our mission is to nurture not just engineers, but responsible leaders who will shape the future of our nation.",
    image_url: "/assets/vc.png",
  },
];

const FALLBACK_PRINCIPALS = [
  {
    id: 1,
    name: "Dr. V. S. Vakula",
    designation: "Principal, College of Engineering",
    message: "Our focus is to provide high-quality technical education, promote research activities, and ensure our graduates are equipped with values and competencies for global success.",
    image_url: "http://89.116.134.182/local-assets/uploads/images/administration/principal-1788413473-42996f.jpg",
  },
];

const FALLBACK_HODS = [
  {
    id: 1,
    department: "Computer Science & Engineering",
    name: "Dr. P. Aruna Kumari",
    designation: "Head of Department, CSE",
    message: "The Department of CSE is committed to producing technically competent graduates with strong ethical values and research acumen, ready to take on global challenges.",
    image_url: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/cse-hod.jpg",
    achievements: "State-of-the-art labs, NPTEL certified faculty, 100% placement.",
  },
  {
    id: 2,
    department: "Electronics & Communication Engineering",
    name: "Dr. T. S. N. Murthy",
    designation: "Head of Department, ECE",
    message: "ECE at JNTU-GV focuses on innovation in embedded systems, communication technologies, and VLSI design, bridging academia and industry.",
    image_url: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/ece-hod.jpeg",
    achievements: "Research grants from DST, ISRO collaborative projects.",
  },
];

const FALLBACK_FACULTY = [
  {
    id: 1,
    faculty_name: "Dr. P. Aruna Kumari",
    designation: "Professor & HOD, CSE",
    department: "Computer Science & Engineering",
    qualification: "Ph.D. in Computer Science",
    experience: "22 Years",
    email: "hod.cse@jntugvcev.edu.in",
    photo_url: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/cse-hod.jpg",
  },
  {
    id: 2,
    faculty_name: "Prof. G. Jaya Suma",
    designation: "Professor of CSE & Registrar JNTU-GV",
    department: "Computer Science & Engineering",
    qualification: "Ph.D. in Information Technology",
    experience: "25 Years",
    email: "registrar@jntugv.edu.in",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    faculty_name: "Dr. S. V. Narayana",
    designation: "Associate Professor & HOD, ECE",
    department: "Electronics & Communication Engineering",
    qualification: "Ph.D. in VLSI & Communications",
    experience: "18 Years",
    email: "hod.ece@jntugvcev.edu.in",
    photo_url: "http://89.116.134.182/local-assets/uploads/departments/hod_photos/ece-hod.jpeg",
  }
];

function FacultyPage() {
  const { isEditMode } = useAdmin();
  const queryClient = useQueryClient();

  // Active Tab: 'leadership' | 'hods' | 'faculty'
  const [activeTab, setActiveTab] = useState<"leadership" | "hods" | "faculty">(() => {
    if (typeof window !== "undefined") {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "hods" || tab === "faculty" || tab === "leadership") {
        return tab;
      }
    }
    return "leadership";
  });

  // State for Searching and Filtering Faculty Directory
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDept, setActiveDept] = useState<string>("All");

  // State for Editing VC
  const [editVcId, setEditVcId] = useState<number | null>(null);
  const [vcName, setVcName] = useState("");
  const [vcDesignation, setVcDesignation] = useState("");
  const [vcMessage, setVcMessage] = useState("");
  const [vcImageUrl, setVcImageUrl] = useState("");

  // State for Editing Principal
  const [editPrincipalId, setEditPrincipalId] = useState<number | null>(null);
  const [principalName, setPrincipalName] = useState("");
  const [principalDesignation, setPrincipalDesignation] = useState("");
  const [principalMessage, setPrincipalMessage] = useState("");
  const [principalImageUrl, setPrincipalImageUrl] = useState("");

  // State for Editing HOD Messages
  const [editHodId, setEditHodId] = useState<number | null>(null);
  const [hodName, setHodName] = useState("");
  const [hodDesignation, setHodDesignation] = useState("");
  const [hodDepartment, setHodDepartment] = useState("");
  const [hodMessage, setHodMessage] = useState("");
  const [hodImageUrl, setHodImageUrl] = useState("");
  const [hodAchievements, setHodAchievements] = useState("");


  // Queries
  const { data: faculty = [] } = useQuery({
    queryKey: ["academics-faculty"],
    queryFn: getAllFacultyList,
  });

  const { data: vcList = [] } = useQuery({
    queryKey: ["academics-vcprofiles"],
    queryFn: getAcademicsVcProfiles,
  });

  const { data: principalList = [] } = useQuery({
    queryKey: ["academics-principals"],
    queryFn: getAcademicsPrincipals,
  });

  const { data: hodData = [] } = useQuery({
    queryKey: ["academics-hod"],
    queryFn: getAcademicsHodDesk,
  });

  const { data: departmentsData = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  // Compiled lists with database records or fallbacks
  const vcs = vcList.length > 0 ? vcList : FALLBACK_VCS;
  const principals = principalList.length > 0 ? principalList : FALLBACK_PRINCIPALS;
  
  const deptHods = departmentsData.map((dept: any, idx: number) => ({
    id: dept.id || idx + 1000,
    department: dept.name,
    name: dept.hod || `Head of Department`,
    designation: `Head of Department, ${dept.slug ? dept.slug.toUpperCase() : ""}`,
    message: dept.hod_message || `The Department of ${dept.name} is committed to excellence in academics and research.`,
    image_url: dept.hod_photo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    achievements: "",
  }));

  const hods = deptHods.length > 0 ? deptHods : (hodData.length > 0 ? hodData : FALLBACK_HODS);
  const directoryList = faculty;

  // Faculty Directory Departments List
  const departmentsList = useMemo(() => {
    const depts = new Set(directoryList.map((f: any) => f.department_name || "Unknown"));
    return ["All", ...Array.from(depts)];
  }, [directoryList]);

  // Mutations - VC
  const saveVcMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsVcProfile({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-vcprofiles"] });
      setEditVcId(null);
      toast.success("Vice Chancellor Profile details saved successfully!");
    }
  });

  const deleteVcMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsVcProfile({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-vcprofiles"] });
      toast.success("VC Profile deleted!");
    }
  });

  // Mutations - Principal
  const savePrincipalMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsPrincipal({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-principals"] });
      setEditPrincipalId(null);
      toast.success("Principal Profile details saved successfully!");
    }
  });

  const deletePrincipalMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsPrincipal({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-principals"] });
      toast.success("Principal Profile deleted!");
    }
  });

  // Mutations - HOD Message
  const saveHodMutation = useMutation({
    mutationFn: (data: any) => upsertAcademicsHodDesk({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-hod"] });
      setEditHodId(null);
      toast.success("HOD Desk message saved successfully!");
    }
  });

  const deleteHodMutation = useMutation({
    mutationFn: (id: number) => deleteAcademicsHodDesk({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics-hod"] });
      toast.success("HOD Desk message deleted!");
    }
  });



  // Edit triggers
  const startEditVc = (item: any) => {
    setEditVcId(item.id);
    setVcName(item.name);
    setVcDesignation(item.designation || "");
    setVcMessage(item.message || "");
    setVcImageUrl(item.image_url || "");
  };

  const startAddVc = () => {
    setEditVcId(-1);
    setVcName("");
    setVcDesignation("Vice Chancellor, JNTU-GV");
    setVcMessage("");
    setVcImageUrl("");
  };

  const startEditPrincipal = (item: any) => {
    setEditPrincipalId(item.id);
    setPrincipalName(item.name);
    setPrincipalDesignation(item.designation || "");
    setPrincipalMessage(item.message || "");
    setPrincipalImageUrl(item.image_url || "");
  };

  const startAddPrincipal = () => {
    setEditPrincipalId(-1);
    setPrincipalName("");
    setPrincipalDesignation("Principal, College of Engineering");
    setPrincipalMessage("");
    setPrincipalImageUrl("");
  };

  const startEditHod = (item: any) => {
    setEditHodId(item.id);
    setHodName(item.name);
    setHodDesignation(item.designation || "");
    setHodDepartment(item.department || "");
    setHodMessage(item.message || "");
    setHodImageUrl(item.image_url || "");
    setHodAchievements(item.achievements || "");
  };

  const startAddHod = () => {
    setEditHodId(-1);
    setHodName("");
    setHodDesignation("Head of Department");
    setHodDepartment("");
    setHodMessage("");
    setHodImageUrl("");
    setHodAchievements("");
  };


  // Directory filter logic
  const filteredFaculty = directoryList.filter((item: any) => {
    const nameStr = item.name || item.faculty_name || "";
    const matchesSearch =
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.designation || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.qualification || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.department_name || item.department || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = activeDept === "All" || (item.department_name || item.department) === activeDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-12 pb-24">
      <PageHero
        eyebrow="Academics"
        title="Faculty & Leadership Directory"
        subtitle="Contact the key administrative officers, deans, heads of departments, and academic directors of JNTU-GV."
        image={campusImg}
      />

      <div className="container-narrow py-12 flex flex-col md:flex-row gap-8 items-start">
        <VerticalSubNav items={ACADEMICS_SUBNAV} />
        <div className="flex-1 min-w-0 space-y-6">

          {/* Tabs Switcher */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto hide-scrollbar z-25 relative">
            <button
              onClick={() => setActiveTab("leadership")}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-all shrink-0 ${activeTab === "leadership"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <UserCheck size={16} /> University Leadership
            </button>
            <button
              onClick={() => setActiveTab("hods")}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-all shrink-0 ${activeTab === "hods"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Quote size={16} /> HOD Message Desk
            </button>
            <button
              onClick={() => setActiveTab("faculty")}
              className={`flex items-center gap-2 py-3 px-6 text-sm font-bold border-b-2 transition-all shrink-0 ${activeTab === "faculty"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Users2 size={16} /> Faculty Directory
            </button>
          </div>

          {/* Admin Mode Banner */}
          {isEditMode && (
            <GlassCard className="p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-slate-900">
              <p className="text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                <Shield size={14} className="text-amber-700 animate-pulse" />
                <strong>Admin Mode Active:</strong> Manage official profiles, upload faculty credentials, and adjust department HOD messages dynamically.
              </p>
              <div className="flex gap-2">
                {activeTab === "leadership" && (
                  <>
                    <button
                      onClick={startAddVc}
                      className="bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
                    >
                      + Add VC Profile
                    </button>
                    <button
                      onClick={startAddPrincipal}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
                    >
                      + Add Principal
                    </button>
                  </>
                )}
                {activeTab === "hods" && (
                  <button
                    onClick={startAddHod}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow"
                  >
                    + Add HOD
                  </button>
                )}

              </div>
            </GlassCard>
          )}



          {/* Tab Contents */}
          <div className="space-y-10">

            {/* ── TAB 1: LEADERSHIP DESK ────────────────────────────────────────── */}
            {activeTab === "leadership" && (
              <div className="space-y-12">

                {/* VC Edit Form */}
                {isEditMode && editVcId !== null && (
                  <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Edit2 size={14} /> {editVcId === -1 ? "Add VC Profile" : "Edit VC Profile"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={vcName}
                          onChange={(e) => setVcName(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Designation</label>
                        <input
                          type="text"
                          value={vcDesignation}
                          onChange={(e) => setVcDesignation(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Photo Image URL</label>
                        <input
                          type="text"
                          value={vcImageUrl}
                          onChange={(e) => setVcImageUrl(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-xs font-bold text-slate-550 block mb-1">Greeting Address Message</label>
                        <textarea
                          rows={4}
                          value={vcMessage}
                          onChange={(e) => setVcMessage(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 font-sans">
                      <button
                        onClick={() => setEditVcId(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveVcMutation.mutate({
                          id: editVcId === -1 ? undefined : editVcId,
                          name: vcName,
                          designation: vcDesignation,
                          message: vcMessage,
                          image_url: vcImageUrl
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
                      >
                        <Save size={14} /> Save VC Profile
                      </button>
                    </div>
                  </GlassCard>
                )}

                {/* Principal Edit Form */}
                {isEditMode && editPrincipalId !== null && (
                  <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Edit2 size={14} /> {editPrincipalId === -1 ? "Add Principal Profile" : "Edit Principal Profile"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={principalName}
                          onChange={(e) => setPrincipalName(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Designation</label>
                        <input
                          type="text"
                          value={principalDesignation}
                          onChange={(e) => setPrincipalDesignation(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Photo Image URL</label>
                        <input
                          type="text"
                          value={principalImageUrl}
                          onChange={(e) => setPrincipalImageUrl(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-xs font-bold text-slate-550 block mb-1">Address Message</label>
                        <textarea
                          rows={4}
                          value={principalMessage}
                          onChange={(e) => setPrincipalMessage(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 font-sans">
                      <button
                        onClick={() => setEditPrincipalId(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => savePrincipalMutation.mutate({
                          id: editPrincipalId === -1 ? undefined : editPrincipalId,
                          name: principalName,
                          designation: principalDesignation,
                          message: principalMessage,
                          image_url: principalImageUrl
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
                      >
                        <Save size={14} /> Save Principal Profile
                      </button>
                    </div>
                  </GlassCard>
                )}

                {/* University Vice Chancellor Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-blue-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                      Office of the Vice Chancellor
                    </h2>
                  </div>
                  <div className="grid gap-8">
                    {vcs.map((vc: any, idx: number) => (
                      <motion.div
                        key={vc.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <GlassCard className="p-0 overflow-hidden relative group">

                          {/* Admin Quick Buttons on VC Card */}
                          {isEditMode && (
                            <div className="absolute right-4 top-4 z-20 flex gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg border border-amber-250 shadow-sm">
                              <button
                                onClick={() => startEditVc(vc)}
                                className="p-1 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-600 rounded flex items-center gap-1 text-[9px] font-bold"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                              <button
                                onClick={() => { if (confirm("Delete Vice Chancellor profile?")) deleteVcMutation.mutate(vc.id); }}
                                className="p-1 hover:bg-red-105 dark:hover:bg-slate-700 text-red-650 rounded ml-1"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}

                          <div className="grid md:grid-cols-3">
                            <div className="relative md:col-span-1 min-h-[300px] overflow-hidden">
                              <SafeImage
                                src={vc.image_url}
                                alt={vc.name}
                                fallbackSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-xl font-extrabold leading-tight">{vc.name}</h3>
                                <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-1">
                                  {vc.designation}
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/10">
                              <Quote className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-4" />
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm italic font-serif">
                                "{vc.message}"
                              </p>
                              <div className="mt-6 flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                  VC Desk message
                                </span>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* University Principal Board Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-0.5 bg-blue-600" />
                    <h2 className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                      College Administration & Principals
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {principals.map((pr: any, idx: number) => (
                      <motion.div
                        key={pr.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                      >
                        <GlassCard className="p-0 overflow-hidden relative group">

                          {/* Admin Quick Buttons on Principal Card */}
                          {isEditMode && (
                            <div className="absolute right-4 top-4 z-20 flex gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-lg border border-amber-250 shadow-sm">
                              <button
                                onClick={() => startEditPrincipal(pr)}
                                className="p-1 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-600 rounded flex items-center gap-1 text-[9px] font-bold"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                              <button
                                onClick={() => { if (confirm("Delete Principal profile?")) deletePrincipalMutation.mutate(pr.id); }}
                                className="p-1 hover:bg-red-105 dark:hover:bg-slate-700 text-red-650 rounded ml-1"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          )}

                          <div className="grid md:grid-cols-3">
                            <div className="relative md:col-span-1 min-h-[250px] overflow-hidden">
                              <SafeImage
                                src={pr.image_url}
                                alt={pr.name}
                                fallbackSrc="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-lg font-extrabold leading-tight">{pr.name}</h3>
                                <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-1">
                                  {pr.designation}
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/10">
                              <Quote className="w-8 h-8 text-slate-200 dark:text-slate-800 mb-3" />
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm italic font-serif">
                                "{pr.message}"
                              </p>
                              <div className="mt-4 flex items-center gap-3">
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                  Administration Board
                                </span>
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ── TAB 2: HOD MESSAGES ───────────────────────────────────────────── */}
            {activeTab === "hods" && (
              <div className="space-y-8">

                {/* HOD Edit Form */}
                {isEditMode && editHodId !== null && (
                  <GlassCard className="p-6 border-2 border-amber-350 space-y-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <Edit2 size={14} /> {editHodId === -1 ? "Add HOD Desk" : "Edit HOD Desk"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={hodName}
                          onChange={(e) => setHodName(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Designation</label>
                        <input
                          type="text"
                          value={hodDesignation}
                          onChange={(e) => setHodDesignation(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Department</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science & Engineering"
                          value={hodDepartment}
                          onChange={(e) => setHodDepartment(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-550 block mb-1">Photo Image URL</label>
                        <input
                          type="text"
                          value={hodImageUrl}
                          onChange={(e) => setHodImageUrl(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-550 block mb-1">Key Department Achievements</label>
                        <input
                          type="text"
                          placeholder="State-of-the-art labs, high placement ratios"
                          value={hodAchievements}
                          onChange={(e) => setHodAchievements(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-xs font-bold text-slate-550 block mb-1">Address message</label>
                        <textarea
                          rows={4}
                          value={hodMessage}
                          onChange={(e) => setHodMessage(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 font-sans">
                      <button
                        onClick={() => setEditHodId(null)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveHodMutation.mutate({
                          id: editHodId === -1 ? undefined : editHodId,
                          name: hodName,
                          designation: hodDesignation,
                          department: hodDepartment,
                          message: hodMessage,
                          image_url: hodImageUrl,
                          achievements: hodAchievements
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow"
                      >
                        <Save size={14} /> Save HOD Desk message
                      </button>
                    </div>
                  </GlassCard>
                )}

                {/* HOD Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {hods.map((hod: any, idx: number) => (
                      <motion.div
                        key={hod.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                      >
                        <GlassCard className="p-6 h-full flex flex-col justify-between relative group hover:border-blue-500/30 transition-all duration-300">
                          <div>

                            {/* HOD Action controls */}
                            {isEditMode && (
                              <div className="absolute right-4 top-4 z-20 flex gap-1 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg border border-amber-200 shadow-sm">
                                <button
                                  onClick={() => startEditHod(hod)}
                                  className="p-1 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-600 rounded flex items-center gap-0.5 text-[9px] font-bold"
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => { if (confirm("Delete this HOD greeting?")) deleteHodMutation.mutate(hod.id); }}
                                  className="p-1 hover:bg-red-105 dark:hover:bg-slate-700 text-red-650 rounded ml-1"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            )}

                            <div className="flex items-start gap-4 mb-5">
                              <SafeImage
                                src={hod.image_url}
                                alt={hod.name}
                                fallbackSrc="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80"
                                className="w-16 h-16 rounded-2xl object-cover shadow-md shrink-0 border border-slate-200/50 dark:border-slate-800"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-extrabold text-slate-900 dark:text-white leading-tight text-base">
                                  {hod.name}
                                </h3>
                                <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                  {hod.designation}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                                  <Briefcase className="w-3 h-3" /> {hod.department}
                                </span>
                              </div>
                            </div>

                            <blockquote className="border-l-2 border-blue-500/30 pl-4 mb-5">
                              <p className="text-xs text-slate-650 dark:text-slate-405 italic leading-relaxed font-serif">
                                "{hod.message}"
                              </p>
                            </blockquote>
                          </div>

                          <div className="space-y-4 mt-auto">
                            {hod.achievements && (
                              <div className="pt-3 border-t border-slate-105 dark:border-slate-800">
                                <div className="flex items-start gap-2">
                                  <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                    <strong>Department Highlights:</strong> {hod.achievements}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-4 text-[10px] font-bold text-slate-400">
                              <a
                                href="mailto:hod@jntugv.edu.in"
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5 text-blue-500" /> HOD Email
                              </a>
                              <a
                                href="tel:+918922277388"
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 89222 77388
                              </a>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

              </div>
            )}

            {/* ── TAB 3: FACULTY DIRECTORY ──────────────────────────────────────── */}
            {activeTab === "faculty" && (
              <div className="space-y-8">

                {/* Filter Toolbar */}
                <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between overflow-visible z-20">
                  <div className="relative w-full md:w-80 font-sans">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, designation, specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-550/50 outline-none placeholder:text-slate-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {departmentsList.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setActiveDept(dept)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeDept === dept
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                      >
                        {dept === "All" ? "All Faculty" : dept.replace("Engineering", "Engg")} ({
                          dept === "All" ? directoryList.length : directoryList.filter((f: any) => f.department === dept).length
                        })
                      </button>
                    ))}
                  </div>
                </GlassCard>

                {/* Directory Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredFaculty.map((member: any, idx: number) => (
                      <motion.div
                        key={member.id || idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className="h-full flex"
                      >
                        <FacultyCard f={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
