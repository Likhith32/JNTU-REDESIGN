import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { departments, faculty, achievements, courses, laboratories, departmentGallery } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { ingestSingleChunk } from "./ingest";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getAssetUrl } from "./assets";
import { serverCache } from "./server-cache";
export { getAssetUrl };

const invalidateDeptCache = () => {
  serverCache.invalidate("dept_details_", true);
  serverCache.invalidate("dept_all");
  serverCache.invalidate("departments_list");
};

export type StaticDepartment = {
  id: string;
  slug: string;
  name: string;
  hod: string;
  description: string;
  image: string;
};

export const STATIC_DEPARTMENTS: StaticDepartment[] = [
  {
    id: "cse",
    slug: "cse",
    name: "Computer Science & Engineering",
    hod: "Dr. R. Rajeswara Rao",
    description: "Pioneering research and education in artificial intelligence, software engineering, cloud computing, and data systems.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/cse-banner.jpg",
  },
  {
    id: "ece",
    slug: "ece",
    name: "Electronics & Communication Engineering",
    hod: "Dr. K. Babulu",
    description: "Advancing frontier innovation in VLSI design, signal processing, embedded systems, and wireless communications.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/ece-banner.jpg",
  },
  {
    id: "eee",
    slug: "eee",
    name: "Electrical & Electronics Engineering",
    hod: "Dr. K. Sri Kumar",
    description: "Empowering future technologies in smart power grids, renewable energy, control systems, and electric automation.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/eee-banner.jpg",
  },
  {
    id: "mech",
    slug: "mech",
    name: "Mechanical Engineering",
    hod: "Dr. R. Umamaheswara Rao",
    description: "Fostering excellence in CAD/CAM design, thermal engineering, robotics, and advanced manufacturing systems.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/mech-banner.jpg",
  },
  {
    id: "met",
    slug: "met",
    name: "Metallurgical Engineering",
    hod: "Dr. G. Swami Naidu",
    description: "Leading research in materials science, alloy design, industrial metallurgy, and advanced materials engineering.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/met-banner.jpg",
  },
  {
    id: "it",
    slug: "it",
    name: "Information Technology",
    hod: "Dr. P. Aruna Kumari",
    description: "Architecting enterprise IT systems, cybersecurity frameworks, web platforms, and mobile software applications.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/it-banner.jpg",
  },
  {
    id: "mba",
    slug: "mba",
    name: "Management Studies (MBA)",
    hod: "Dr. K. V. S. M. Ramanesh",
    description: "Nurturing executive leadership, strategic management, corporate finance, marketing, and technology entrepreneurship.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/mba-banner.jpg",
  },
  {
    id: "bshss",
    slug: "bshss",
    name: "Basic Sciences & Humanities",
    hod: "Dr. G. J. Naga Raju",
    description: "Building strong foundational knowledge in Mathematics, Physics, Chemistry, and Professional Communication skills.",
    image: "http://89.116.134.182/local-assets/uploads/departments/banners/sh-banner.jpg",
  },
];

// --- Department Core ---
export const getDepartments = createServerFn({ method: "GET" }).handler(async () => {
  const cached = serverCache.get<any[]>("departments_list");
  if (cached) return cached;
  const records = await db.select().from(departments);
  serverCache.set("departments_list", records);
  return records;
});

export const updateDepartment = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { id, faculty: facultyData, ...updateData } = data;

    // Update core department details
    await db
      .update(departments)
      .set(updateData)
      .where(eq(departments.id, id));

    invalidateDeptCache();

    // Fetch updated department details for RAG ingestion trigger
    const [updatedDept] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, id))
      .limit(1);

    if (updatedDept) {
      const HOD_MAP: Record<string, string> = {
        cse: "Dr. R. Rajeswara Rao",
        ece: "Dr. K. Babulu",
        eee: "Dr. K. Sri Kumar",
        mech: "Dr. R. Umamaheswara Rao",
        met: "Dr. G. Swami Naidu",
        it: "Dr. P. Aruna Kumari",
        bsh: "Dr. G. J. Naga Raju",
        bshss: "Dr. G. J. Naga Raju",
        sh: "Dr. G. J. Naga Raju",
        mba: "Dr. K. V. S. M. Ramanesh",
      };
      const rawHod = (updatedDept.hod || "").trim();
      const hodName = rawHod.length > 5 ? rawHod : (HOD_MAP[updatedDept.slug?.toLowerCase() || ""] || rawHod);

      if (hodName) {
        await ingestSingleChunk(
          `Head of Department (HOD) of ${updatedDept.name}: ${hodName}. Department: ${updatedDept.name}.`,
          `dept_hod:${updatedDept.id}`,
          "hod",
          { department: updatedDept.name }
        );
      }
    }
    return { success: true };
  });

// --- Faculty Specific (Required for the Admin Page) ---
export const syncFaculty = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; facultyList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, facultyList } = data;

    // Get current faculty ids for this dept
    const existing = await db
      .select({ id: faculty.id })
      .from(faculty)
      .where(eq(faculty.dept_id, deptId));
    const existingIds = new Set(existing.map(f => f.id));

    const incomingIds = new Set(
      facultyList
        .filter(f => typeof f.id === "number" || (typeof f.id === "string" && /^\d+$/.test(f.id)))
        .map(f => Number(f.id))
    );

    // Only delete rows that were explicitly removed from the list
    const removedIds = [...existingIds].filter(id => !incomingIds.has(id));
    if (removedIds.length > 0) {
      await db.delete(faculty).where(inArray(faculty.id, removedIds));
    }

    // Update existing rows, insert only genuinely new ones
    for (const f of facultyList) {
      const numericId = typeof f.id === "number" ? f.id : (typeof f.id === "string" && /^\d+$/.test(f.id) ? Number(f.id) : null);

      if (numericId !== null && existingIds.has(numericId)) {
        await db
          .update(faculty)
          .set({
            name: f.name,
            designation: f.designation,
            photo_url: f.photo_url,
          })
          .where(eq(faculty.id, numericId));
      } else {
        await db.insert(faculty).values({
          name: f.name,
          designation: f.designation,
          photo_url: f.photo_url,
          dept_id: deptId,
        });
      }
    }

    invalidateDeptCache();
    serverCache.invalidate("faculty_all");
    return { success: true };
  });

export const syncAchievements = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; achievementList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, achievementList } = data;

    // Wipe and replace strategy for the specific department
    await db.delete(achievements).where(eq(achievements.dept_id, deptId));

    if (achievementList.length > 0) {
      await db.insert(achievements).values(
        achievementList.map(a => ({
          dept_id: deptId,
          category: a.category || "General",
          subcategory: a.subcategory || "General Achievements",
          title: a.title,
          description: a.description,
          year: a.year,
          course: a.course
        }))
      );
    }
    invalidateDeptCache();
    return { success: true };
  });

export const syncCourses = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; courseList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, courseList } = data;

    // Remove existing courses for this department
    await db.delete(courses).where(eq(courses.dept_id, deptId));

    if (courseList.length > 0) {
      await db.insert(courses).values(
        courseList.map(c => ({
          dept_id: deptId,
          level: c.level || "UG",
          name: c.name,
          syllabus_url: c.syllabus_url,
          regulation: c.regulation,
        }))
      );
    }
    invalidateDeptCache();
    return { success: true };
  });

export const syncLaboratories = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; labList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, labList } = data;

    // Delete existing labs for this department
    await db.delete(laboratories).where(eq(laboratories.dept_id, deptId));

    if (labList.length > 0) {
      await db.insert(laboratories).values(
        labList.map(lab => ({
          dept_id: deptId,
          name: lab.name,
          description: lab.description,
          location: lab.location,
          photo_url: lab.photo_url,
          specs: lab.specs || [], // This is the JSONB field
        }))
      );
    }
    invalidateDeptCache();
    return { success: true };
  });

export const syncGallery = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; galleryList: any[] }) => d)
  .handler(async ({ data }) => {
    const { deptId, galleryList } = data;

    // Wipe and replace strategy for the specific department gallery
    await db.delete(departmentGallery).where(eq(departmentGallery.dept_id, deptId));

    if (galleryList.length > 0) {
      await db.insert(departmentGallery).values(
        galleryList.map(img => ({
          dept_id: deptId,
          title: img.title || "Untitled",
          image_url: img.image_url,
          category: img.category || "General",
          description: img.description || "",
        }))
      );
    }
    invalidateDeptCache();
    return { success: true };
  });

// --- NEW CRUD FUNCTIONS REQUIRED BY admin.departments.tsx ---

export const getFacultyByDept = createServerFn({ method: "POST" })
  .validator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    const rows = await db.select().from(faculty).where(eq(faculty.dept_id, id));
    return rows as any[];
  });

export const addFaculty = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(faculty).values(data);
    invalidateDeptCache();
    serverCache.invalidate("faculty_all");
    return { success: true };
  });

export const deleteFaculty = createServerFn({ method: "POST" })
  .validator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(faculty).where(eq(faculty.id, id));
    invalidateDeptCache();
    serverCache.invalidate("faculty_all");
    return { success: true };
  });

export const getLabsByDept = createServerFn({ method: "POST" })
  .validator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    const rows = await db.select().from(laboratories).where(eq(laboratories.dept_id, id));
    return rows as any[];
  });

export const addLaboratory = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(laboratories).values(data);
    invalidateDeptCache();
    return { success: true };
  });

export const deleteLaboratory = createServerFn({ method: "POST" })
  .validator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(laboratories).where(eq(laboratories.id, id));
    invalidateDeptCache();
    return { success: true };
  });

export const getAchievementsByDept = createServerFn({ method: "POST" })
  .validator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(achievements).where(eq(achievements.dept_id, id));
  });

export const addAchievement = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await db.insert(achievements).values(data);
    invalidateDeptCache();
    return { success: true };
  });

export const getCoursesByDept = createServerFn({ method: "POST" })
  .validator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(courses).where(eq(courses.dept_id, id));
  });

export const addCourse = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { name, level, regulation, syllabus_url, dept_id } = data;
    await db.insert(courses).values({
      dept_id,
      name,
      level: level || "UG",
      regulation,
      syllabus_url
    });
    invalidateDeptCache();
    return { success: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .validator((d: { id: number } | number) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "number" ? data : (data as any)?.id;
    await db.delete(courses).where(eq(courses.id, id));
    invalidateDeptCache();
    return { success: true };
  });

export const getGalleryByDept = createServerFn({ method: "POST" })
  .validator((deptId: string | { data?: string }) => deptId)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.data || "";
    if (!id) return [];
    return await db.select().from(departmentGallery).where(eq(departmentGallery.dept_id, id));
  });

export const addToGallery = createServerFn({ method: "POST" })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const { title, image_url, category, description, dept_id } = data;
    await db.insert(departmentGallery).values({
      dept_id,
      title,
      image_url,
      category: category || "General",
      description
    });
    invalidateDeptCache();
    return { success: true };
  });

export const deleteFromGallery = createServerFn({ method: "POST" })
  .validator((d: { id: string } | string) => d)
  .handler(async ({ data }) => {
    const id = typeof data === "string" ? data : (data as any)?.id;
    await db.delete(departmentGallery).where(eq(departmentGallery.id, id));
    invalidateDeptCache();
    return { success: true };
  });

export const updateFacultyProfile = createServerFn({ method: "POST" })
  .validator((d: { facultyId: string | number; profileData: any }) => d)
  .handler(async ({ data }) => {
    const { facultyId, profileData } = data;

    await db
      .update(faculty)
      .set({
        name: profileData.name,
        designation: profileData.designation,
        photo_url: profileData.photo_url,
        specialization: profileData.specialization,
        experience_years: parseInt(profileData.experience_years) || 0,
        qualifications: profileData.qualifications,
        awards: profileData.awards,
        fellowships: profileData.fellowships,
        professional_memberships: profileData.professional_memberships,
        international_exchanges: profileData.international_exchanges,
        sabbaticals: profileData.sabbaticals,
        consultancy_projects: profileData.consultancy_projects,
        fdps_attended: profileData.fdps_attended,
        conferences_attended: profileData.conferences_attended,
        documents: profileData.documents || [],
      })
      .where(eq(faculty.id, Number(facultyId)));

    invalidateDeptCache();
    serverCache.invalidate("faculty_all");

    return { success: true };
  });

export const verifyDepartmentAccess = createServerFn({ method: "POST" })
  .validator((d: { deptId: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { deptId, password } = data;

    // 1. Guard Rule: Explicitly reject the admin password here
    if (password === "jntu@2026") {
      return { valid: false, role: null };
    }

    // 2. Fetch the department record string directly by its UUID
    const [dept] = await db
      .select({ hod_password: departments.hod_password })
      .from(departments)
      .where(eq(departments.id, deptId))
      .limit(1);

    // If the department doesn't exist or doesn't have a password set, reject access
    if (!dept || !dept.hod_password) {
      return { valid: false, role: null };
    }

    // 3. CRYPTOGRAPHIC MATCH VALIDATION
    const isPasswordMatch = await bcrypt.compare(password, dept.hod_password);

    if (isPasswordMatch) {
      return { valid: true, role: "hod" };
    }

    // Fallback: Access Denied
    return { valid: false, role: null };
  });