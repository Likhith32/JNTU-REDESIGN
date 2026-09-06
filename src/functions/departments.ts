import { createServerFn } from "@tanstack/react-start";
import { serverCache } from "../lib/server-cache";

export type DepartmentData = {
  id: string;
  name: string;
  hod: string;
  description: string;
  image: string;
  slug: string;
  vision?: string;
  mission?: string;
  about_details?: string;
  hod_photo?: string;
  hod_message?: string;
  hod_contact?: string;
  faculty: any[];
  gallery: any[];
  courses: any[];
  laboratories: any[];
  achievements: any[];
};

export const getDepartmentDetails = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const cacheKey = `dept_details_${slug}`;
      const cached = serverCache.get<any>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      // 1. Fetch the main department row (with fallback for legacy aliases)
      let result = await sql`SELECT * FROM departments WHERE slug = ${slug} LIMIT 1`;
      if ((!result || result.length === 0) && (slug === "sh" || slug === "bsh")) {
        result = await sql`SELECT * FROM departments WHERE slug = 'bshss' LIMIT 1`;
      }

      // 2. CHECK: If no row is returned, the array length is 0
      if (!result || result.length === 0) {
        return null;
      }

      // 3. Explicitly grab the first row object
      const dept = result[0];

      // 4. Fetch all other lists IN PARALLEL to eliminate sequential network latency
      const [faculty, gallery, courses, laboratories, achievements] = await Promise.all([
        sql`SELECT * FROM faculty WHERE dept_id = ${dept.id} ORDER BY ID ASC`,
        sql`SELECT * FROM department_gallery WHERE dept_id = ${dept.id} ORDER BY created_at DESC`,
        sql`SELECT * FROM courses WHERE dept_id = ${dept.id}`,
        sql`SELECT * FROM laboratories WHERE dept_id = ${dept.id}`,
        sql`SELECT * FROM achievements WHERE dept_id = ${dept.id} ORDER BY year DESC`,
      ]);

      // 5. MERGE: Create a new object containing EVERYTHING
      const completeData = {
        id: dept.id,
        name: dept.name,
        hod: dept.hod,
        description: dept.description,
        image: dept.image,
        slug: dept.slug,
        vision: dept.vision,
        mission: dept.mission,
        about_details: dept.about_details,
        hod_photo: dept.hod_photo,
        hod_message: dept.hod_message,
        hod_contact: dept.hod_contact,
        faculty: (faculty || []).map((row) => ({ ...row })),
        gallery: (gallery || []).map((row) => ({ ...row })),
        laboratories: (laboratories || []).map((row) => ({ ...row })),
        achievements: (achievements || []).map((row) => ({ ...row })),
        courses: (courses || []).map((row) => ({ ...row })),
      };

      serverCache.set(cacheKey, completeData, 1000 * 60 * 30); // 30 mins cache
      return completeData;
    } catch (err) {
      console.error(`Error fetching department details for ${slug}:`, err);
      return null;
    }
  });

export const getAllDepartments = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const cacheKey = "dept_all";
      const cached = serverCache.get<any[]>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      // Fetch all records sorted alphabetically by name
      const result = await sql`
      SELECT id, name, slug, description, image, hod 
      FROM departments 
      ORDER BY name ASC
    `;

      const data = result || [];
      serverCache.set(cacheKey, data);
      return data;
    } catch (err) {
      console.error("Error fetching all departments:", err);
      return [];
    }
  });

export const getAllFacultyList = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const cacheKey = "faculty_all";
      const cached = serverCache.get<any[]>(cacheKey);
      if (cached) return cached;

      const { sql } = await import("@/lib/db");

      const result = await sql`
        SELECT f.*, d.name as department_name, d.slug as department_slug
        FROM faculty f
        LEFT JOIN departments d ON f.dept_id = d.id
        ORDER BY f.name ASC
      `;

      const data = result || [];
      serverCache.set(cacheKey, data);
      return data;
    } catch (err) {
      console.error("Error fetching all faculty:", err);
      return [];
    }
  });