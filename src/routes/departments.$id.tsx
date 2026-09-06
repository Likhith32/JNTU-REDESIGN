import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { getDepartmentDetails, type DepartmentData } from "@/functions/departments";
import { SafeImage } from "@/components/SafeImage";
import { getAssetUrl, updateDepartment } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext";
import { AdminUpload } from "@/components/AdminEditPanel";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DepartmentStrictLockModal } from "@/components/DepartmentStrictLockModal";
import {
  BookOpen,
  Users,
  KeyRound,
  GraduationCap,
  FlaskConical,
  Trophy,
  Image as ImageIcon,
  ChevronRight,
  Save,
  Camera,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export const Route = createFileRoute("/departments/$id")({
  // Disable router pre-fetching so the heavy getDepartmentDetails payload
  // (faculty + gallery + courses + labs + achievements) is NOT triggered when
  // the user hovers department card links on the home page.
  preload: false,
  loader: async ({ params }) => {
    const data = await getDepartmentDetails({ data: params.id });
    if (!data) throw new Error("Department not found");
    return data;
  },
  head: ({ loaderData }) => {
    const data = loaderData as DepartmentData | undefined;
    const name = data?.name || "Department";
    const desc = data?.description || `Department details, syllabus, courses, faculty and laboratories at JNTU-GV College of Engineering Vizianagaram.`;
    return {
      meta: [
        { title: `${name} — JNTU-GV CEV` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} — JNTU-GV CEV` },
        { property: "og:description", content: desc },
      ],
      links: [
        { rel: "canonical", href: `https://jntugvcev.edu.in/departments/${data?.slug || ""}` }
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": `${name} - JNTU-GV CEV`,
            "description": desc,
            "url": `https://jntugvcev.edu.in/departments/${data?.slug || ""}`,
            "parentOrganization": {
              "@type": "EducationalOrganization",
              "name": "JNTU-GV College of Engineering Vizianagaram",
              "url": "https://jntugvcev.edu.in/"
            }
          })
        }
      ]
    };
  },
  component: DepartmentLayout,
});

import { getDepartmentNavItems, type DepartmentNavItem } from "@/funcs/department-cms.server";
import { SidebarManagerModal } from "@/components/cms/SidebarManagerModal";
import { useQuery } from "@tanstack/react-query";
import { Settings, Plus, FolderPlus, Award, FileText, Download, Sparkles } from "lucide-react";

function getNavIcon(iconName: string) {
  switch (iconName) {
    case "BookOpen":
      return <BookOpen size={18} />;
    case "Users":
      return <Users size={18} />;
    case "GraduationCap":
      return <GraduationCap size={18} />;
    case "FlaskConical":
      return <FlaskConical size={18} />;
    case "Trophy":
      return <Trophy size={18} />;
    case "ImageIcon":
      return <ImageIcon size={18} />;
    case "Award":
      return <Award size={18} />;
    case "FileText":
      return <FileText size={18} />;
    case "Download":
      return <Download size={18} />;
    case "Sparkles":
      return <Sparkles size={18} />;
    default:
      return <span className="text-base">{iconName || "🎓"}</span>;
  }
}

function DepartmentLayout() {
  const loaderData = Route.useLoaderData() as unknown as DepartmentData;
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, role, hodDeptId, hasEditPermission, isDeptEditing, setDeptEditing, logout } = useAdmin();
  const queryClient = useQueryClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarManagerOpen, setIsSidebarManagerOpen] = useState(false);

  // Redirect guard for HOD sessions trying to roam to other departments
  useEffect(() => {
    if (hodDeptId && loaderData?.slug && hodDeptId !== loaderData.slug && role !== "super_admin") {
      navigate({ to: "/" });
    }
  }, [hodDeptId, loaderData?.slug, role, navigate]);

  const isUnlocked = hasEditPermission(loaderData?.slug || "");
  const isEditMode = isDeptEditing(loaderData?.slug || "");

  // Query dynamic database-driven sidebar nav items
  const { data: dynamicNavItems = [] } = useQuery({
    queryKey: ["deptNav", loaderData?.slug, isEditMode],
    queryFn: () => getDepartmentNavItems({ data: { deptSlug: loaderData.slug, isEditMode } }),
    enabled: Boolean(loaderData?.slug),
  });

  const [headerEdit, setHeaderEdit] = useState({
    name: loaderData?.name || "",
    image: loaderData?.image || "",
  });

  useEffect(() => {
    if (loaderData?.slug && hasEditPermission(loaderData.slug)) {
      if (isDeptEditing(loaderData.slug) === undefined) {
        setDeptEditing(loaderData.slug, true);
      }
    }
  }, [loaderData?.slug, hasEditPermission, isDeptEditing, setDeptEditing]);

  useEffect(() => {
    if (loaderData) {
      setHeaderEdit({ name: loaderData.name, image: loaderData.image });
    }
  }, [loaderData]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile department menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const mutation = useMutation({
    mutationFn: (updatedFields: any) =>
      updateDepartment({ data: { id: loaderData.id, ...updatedFields } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["department", loaderData.slug] });
      toast.success("Header updated successfully!");
    },
  });

  if (!loaderData || !loaderData.slug) return null;

  // Update lock-screen condition so it only applies to the legacy super-admin-without-authorizedDepts case
  const needsLockScreen = isAdmin && role !== "super_admin" && !isUnlocked;

  if (needsLockScreen) {
    return (
      <DepartmentStrictLockModal
        deptId={loaderData.id}
        deptSlug={loaderData.slug}
        isOpen={true}
        onSuccess={() => {
          setDeptEditing(loaderData.slug, true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className={`relative h-[350px] w-full overflow-hidden transition-all ${isEditMode ? "ring-4 ring-inset ring-amber-400" : "bg-slate-900"}`}>
        <SafeImage 
          src={headerEdit.image} 
          className="h-full w-full object-cover opacity-40" 
          alt={headerEdit.name} 
          loading="lazy"
          decoding="async"
          fallbackSrc="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1500&q=80"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center w-full max-w-4xl px-4">
            {isEditMode ? (
              <div className="space-y-4 bg-black/20 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto">
                   <label className="text-amber-400 text-xs font-bold uppercase flex items-center gap-2">
                    <Camera size={14} /> Background Image
                  </label>
                  <AdminUpload
                    value={headerEdit.image}
                    onChange={(newUrl) => setHeaderEdit({...headerEdit, image: newUrl})}
                    module="departments"
                    category="banners"
                    placeholder="Upload banner image"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    className="text-2xl md:text-4xl font-bold text-white tracking-tight uppercase bg-transparent border-b-2 border-amber-400/30 focus:border-amber-400 text-center outline-none w-full"
                    value={headerEdit.name}
                    onChange={(e) => setHeaderEdit({ ...headerEdit, name: e.target.value })}
                  />
                </div>
                <button onClick={() => mutation.mutate(headerEdit)} className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider mx-auto shadow-lg">
                  <Save size={14} /> Save Header
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Department of {loaderData.name}</h1>
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-300 font-medium text-sm">
                  <Link to="/" className="hover:text-white">Home</Link>
                  <ChevronRight size={14} />
                  <Link to="/departments" className="hover:text-white">Departments</Link>
                  <ChevronRight size={14} />
                  <span className="text-white font-semibold">{loaderData.slug.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row gap-12 relative">
        
        {/* Floating Toggle Button for Mobile Screen with Safe Area Offset */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
          className="lg:hidden fixed left-5 sm:left-6 z-[65] flex items-center gap-2.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-4 py-3 sm:px-4.5 sm:py-3.5 rounded-full shadow-[0_12px_28px_-6px_rgba(29,78,216,0.45),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-white/30 backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Toggle Department Menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="animate-in spin-in-90 duration-150" />
          ) : (
            <Menu size={20} />
          )}
          <span className="text-xs font-extrabold tracking-wider uppercase pr-0.5">
            {isMobileMenuOpen ? "Close" : "Dept Menu"}
          </span>
        </button>

        {/* Mobile Backdrop Overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] transition-opacity duration-300 animate-[fade-in_0.2s_ease-out] pointer-events-auto"
            aria-hidden="true"
          />
        )}

        {/* Sidebar Navigation Drawer with Fixed Top-0, 100dvh & Dynamic Scrolling */}
        <aside className={`
          fixed top-0 left-0 h-screen h-[100dvh] w-80 max-w-[85vw] z-[60] bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          lg:static lg:h-auto lg:w-64 lg:max-w-none lg:z-0 lg:bg-transparent lg:border-none lg:shadow-none lg:transform-none lg:sticky lg:top-28 lg:self-start lg:flex-shrink-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          {/* Header Title Inside Mobile Menu */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50 lg:hidden shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {loaderData.slug.substring(0, 3).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-blue-700">Department Menu</div>
                <div className="text-sm font-extrabold text-slate-900 truncate">{loaderData.name}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Close Menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Container with Dynamic Viewport Height & Safe Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 lg:p-0 space-y-4 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
            <div className="bg-card rounded-2xl lg:rounded-3xl p-4 lg:p-5 lg:border border-border/80 h-fit space-y-4 shadow-sm">
              
              {/* HOD Admin Control Bar in Sidebar */}
              {isEditMode && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 mb-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span>HOD CMS Controls</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <button
                    onClick={() => setIsSidebarManagerOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <Settings size={14} /> Manage Nav & Reorder
                  </button>
                </div>
              )}

              <nav className="space-y-1.5">
                {dynamicNavItems.map((item) => {
                  const subPath = item.slug ? `/${item.slug}` : "";
                  const fullPath = `/departments/${loaderData.slug}${subPath}`;
                  const isActive = subPath === ""
                    ? location.pathname === fullPath
                    : location.pathname.startsWith(fullPath);

                  return (
                    <div key={item.id} className="space-y-1">
                      <Link
                        to={fullPath}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/25"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        {getNavIcon(item.icon)} <span>{item.title}</span>
                      </Link>

                      {/* Render Nested Children Navigation if present */}
                      {item.children && item.children.length > 0 && (
                        <div className="pl-5 space-y-1 pt-1 border-l-2 border-border ml-4">
                          {item.children.map((child) => {
                            const childPath = `/departments/${loaderData.slug}/${child.slug}`;
                            const isChildActive = location.pathname.startsWith(childPath);
                            return (
                              <Link
                                key={child.id}
                                to={childPath}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                  isChildActive
                                    ? "bg-primary/15 text-primary font-bold"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                }`}
                              >
                                {getNavIcon(child.icon)} <span>{child.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {hodDeptId && (
                <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
                  <Link
                    to="/hod-account-settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 lg:hover:bg-white transition-all"
                  >
                    <KeyRound size={18} /> Account Settings
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate({ to: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all mt-4 border-t border-slate-200 pt-4 cursor-pointer"
                  >
                    <LogOut size={18} /> Logout (HOD)
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Manager Modal */}
        {isSidebarManagerOpen && (
          <SidebarManagerModal
            deptSlug={loaderData.slug}
            items={dynamicNavItems}
            isOpen={isSidebarManagerOpen}
            onClose={() => setIsSidebarManagerOpen(false)}
            onRefresh={() => {
              queryClient.invalidateQueries({ queryKey: ["deptNav", loaderData.slug] });
            }}
          />
        )}

        {/* Main Workspace Content Stream Component wrapper */}
        <main className="flex-grow min-w-0 space-y-6">
          <div className="mt-2">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}