import { createFileRoute, useLoaderData, Link, useParams, useRouter } from "@tanstack/react-router";
import { type DepartmentData } from "@/functions/departments";
import { updateDepartment, syncFaculty } from "@/lib/departments";
import { useAdmin } from "@/context/AdminContext"; 
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, UserPlus, Trash2, Save, ImageIcon, Briefcase, Eye, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { getAssetUrl } from "@/lib/assets";
import { SafeImage } from "@/components/SafeImage";
import { PersonAvatarUpload } from "@/components/AdminEditPanel";

export const Route = createFileRoute("/departments/$id/faculty/")({
  component: FacultyPage,
});

// Define an interface for the component props
interface FacultyCardProps {
  f: {
    id: string;
    name: string;
    designation: string;
    photo_url?: string | null;
  };
  isEditMode: boolean;
  deptId: string;
  handleUpdate: (id: string, field: string, value: string) => void;
  removeFaculty: (id: string) => void;
}

// Apply the interface to the component props
function FacultyCard({ f, isEditMode, deptId, handleUpdate, removeFaculty }: FacultyCardProps) {
  return (
    <div className={`p-6 border rounded-3xl bg-white flex gap-6 items-center relative transition-all h-full ${isEditMode ? 'border-amber-200 ring-2 ring-amber-50' : 'border-slate-100 shadow-sm'}`}>
      {isEditMode && (
        <button onClick={() => removeFaculty(f.id)} className="absolute top-3 right-3 p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <Trash2 size={16} />
        </button>
      )}

      {isEditMode ? (
        <div className="flex-shrink-0">
          <PersonAvatarUpload
            value={f.photo_url || ""}
            onChange={(newUrl) => handleUpdate(f.id, "photo_url", newUrl)}
            module="departments"
            category="faculty"
            size={88}
            fallbackName={f.name}
          />
        </div>
      ) : (
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-50 bg-slate-100">
          <SafeImage 
            src={f.photo_url} 
            alt={f.name}
            decoding="async"
            loading="lazy"
            fallbackName={f.name}
            className="h-full w-full object-cover" 
          />
        </div>
      )}

      <div className="flex-grow space-y-2">
        {isEditMode ? (
          <div className="space-y-2 pr-4">
            <input 
              className="w-full font-bold text-blue-900 border-b border-amber-100 focus:border-amber-500 outline-none text-base" 
              value={f.name} 
              placeholder="Faculty Name"
              onChange={(e) => handleUpdate(f.id, "name", e.target.value)} 
            />
            <input 
              className="w-full text-sm text-slate-600 border-b border-amber-100 focus:border-amber-500 outline-none" 
              value={f.designation} 
              placeholder="Designation (e.g. Assistant Professor)"
              onChange={(e) => handleUpdate(f.id, "designation", e.target.value)} 
            />
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium pt-0.5">
              <ImageIcon size={12} className="text-amber-500" />
              <span>Click or drop on avatar to change photo</span>
            </div>
            
            {/* Admin Direct Deep Link Edit Button */}
            <div className="pt-1">
              <Link
                to="/departments/$id/faculty/$facultyId"
                params={{ id: deptId, facultyId: String(f.id) }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors border border-amber-200/40"
              >
                <UserCheck size={14} /> Edit Profile Details
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 leading-snug">{f.name}</h3>
              <p className="text-slate-600 font-medium text-sm">{f.designation}</p>
            </div>
            
            {/* Public View Profile Button */}
            <div className="pt-2">
              <Link
                to="/departments/$id/faculty/$facultyId"
                params={{ id: deptId, facultyId: String(f.id) }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
              >
                <Eye size={14} /> View Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FacultyPage() {
  const data = useLoaderData({ from: "/departments/$id" }) as unknown as DepartmentData;
  const router = useRouter();
  const queryClient = useQueryClient();

  // Extract the parent route parameter ($id) cleanly
  const { id: deptId } = useParams({ from: "/departments/$id/faculty/" });

  // Evaluate edit permissions using the active branch slug (e.g., "cse", "it")
  const { isDeptEditing } = useAdmin();
  const isEditMode = isDeptEditing(deptId || "");

  const [facultyList, setFacultyList] = useState(data?.faculty || []);

  useEffect(() => {
    if (data?.faculty) setFacultyList(data.faculty);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newList: any[]) => 
      syncFaculty({ data: { deptId: data.id, facultyList: newList } }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      await router.invalidate();
      toast.success("Faculty roster saved successfully!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save changes.")
  });

  const handleUpdate = (id: string, field: string, value: string) => {
    setFacultyList(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const addFaculty = () => {
    const newMember = { id: Math.random().toString(), name: "New Member", designation: "Assistant Professor", photo_url: "" };
    setFacultyList([...facultyList, newMember]);
  };

  const removeFaculty = (id: string) => {
    setFacultyList(facultyList.filter(f => f.id !== id));
  };

  // UI Segmentation Logic: Isolate HOD from remaining profiles
  const hodMember = facultyList.find(f => /hod|head of (the )?department/i.test(f.designation || ""));
  const otherFaculty = facultyList.filter(f => !/hod|head of (the )?department/i.test(f.designation || ""));

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Faculty Members</h2>
        {isEditMode && (
          <div className="flex gap-2">
            <button onClick={addFaculty} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
              <UserPlus size={18} /> Add
            </button>
            <button 
              onClick={() => mutation.mutate(facultyList)} 
              disabled={mutation.isPending}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Roster</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Isolated Centered Row for HOD */}
        {hodMember && (
          <div className="flex justify-center w-full mb-2">
            <div className="w-full md:w-1/2">
              <FacultyCard 
                f={hodMember}
                isEditMode={isEditMode}
                deptId={deptId}
                handleUpdate={handleUpdate}
                removeFaculty={removeFaculty}
              />
            </div>
          </div>
        )}

        {/* Regular 2-Column Grid Layout for Remaining Staff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherFaculty.map((f) => (
            <FacultyCard 
              key={f.id}
              f={f}
              isEditMode={isEditMode}
              deptId={deptId}
              handleUpdate={handleUpdate}
              removeFaculty={removeFaculty}
            />
          ))}
        </div>
      </div>
    </div>
  );
}