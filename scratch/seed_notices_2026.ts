import "dotenv/config";
import postgres from "postgres";

const NOTICES = [
  {
    date: "August 12, 2026",
    tag: "Academic",
    title: "Academic Calendar for II B.Tech (2026–2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/08/ii-b-tech-academic-calendar-2026-2027.pdf",
  },
  {
    date: "August 6, 2026",
    tag: "Academic",
    title: "SCCI Semiconductor Design – Parikalpak Technical Program at JNTU-GV Vizianagaram (August 6, 2026)",
    url: "http://89.116.134.182/local-assets/uploads/2026/08/scci-semiconductor-design-parikalpak-2026.pdf",
  },
  {
    date: "August 4, 2026",
    tag: "Academic",
    title: "Academic Calendar for II M.Tech (2026–2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/08/academic-calendar-for-ii-m-tech-2026-27.pdf",
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R19) Supplementary End Examinations, July/August-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/m-tech-ii-sem-r19-supplementary-end-time-table-july-august-2026.pdf",
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R25) End Examinations, July/August-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/m-tech-ii-sem-r25-end-time-table-july-august-2026.pdf",
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Revised Timetable for M.Tech II-Semester (R25) II-Mid Examinations, July-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/revised-m-tech-ii-sem-r25-ii-mid-time-table-july-2026.pdf",
  },
  {
    date: "July 20, 2026",
    tag: "Exams",
    title: "Timetable for M.Tech II-Semester (R23) II-Mid Examinations, July-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/m-tech-ii-sem-r23-ii-mid-time-table-july-2026.pdf",
  },
  {
    date: "July 7, 2026",
    tag: "Academic",
    title: "Academic Calendar for II MCA (2026-2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/ii-mca-academic-calendar-2026-2027.pdf",
  },
  {
    date: "July 7, 2026",
    tag: "Academic",
    title: "Academic Calendar for II MBA (2026-2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/07/ii-mba-academic-calendar-2026-2027.pdf",
  },
  {
    date: "June 18, 2026",
    tag: "Academic",
    title: "Academic Calendar for II B.Tech (2026-2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/ii-b-tech-academic-calendar-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R25) End Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-mca-ii-semester-r25-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MBA II-Semester (R25) End Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-mba-ii-semester-r25-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Timetable for I-MCA II-Semester (R20) Supply End Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-mca-ii-semester-r20-supply-end-examinations-june-2026.pdf",
  },
  {
    date: "June 16, 2026",
    tag: "Exams",
    title: "Notification for M.Tech II-Semester (R25/R19) Regular/Supplementary Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/mtech-ii-sem-r25-r19-examination-notification-june-2026.pdf",
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R23 End Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-ii-r23-end-time-table-june-2026.pdf",
  },
  {
    date: "June 12, 2026",
    tag: "Exams",
    title: "Timetable for I-II R20 End Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-ii-r20-end-time-table-june-2026.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for III B.Tech (2026-2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/iii-b-tech-academic-calendar.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Academic",
    title: "Academic Calendar for IV B.Tech (2026-2027)",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/iv-b-tech-academic-calendar.pdf",
  },
  {
    date: "June 5, 2026",
    tag: "Exams",
    title: "Timetable for I-B.Tech II-Semester II-Mid Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/06/i-btech-ii-mid-time-table-june-2026.pdf",
  },
  {
    date: "May 18, 2026",
    tag: "Exams",
    title: "I-II II Mid Postponement Circular, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/05/i-ii-ii-mid-postponement-circular-june-2026.pdf",
  },
  {
    date: "May 18, 2026",
    tag: "Exams",
    title: "Notification for I-II (R23) Regular & Supplementary Examinations, June-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/05/i-ii-r23-regular-supplementary-notification-june-2026.pdf",
  },
  {
    date: "May 17, 2026",
    tag: "Exams",
    title: "Notification for MCA & MBA II-Semester Regular & Supply Examinations, May-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/05/mca-mba-ii-semester-regular-supply-notification-may-2026.pdf",
  },
  {
    date: "April 25, 2026",
    tag: "Exams",
    title: "Timetable for I-M.Tech II-Semester (R25) I-Mid Examinations, April-2026",
    url: "http://89.116.134.182/local-assets/uploads/2026/04/I-M.TECH-II-SEM-R25-I-MID-TIME-TABLE-APRIL-2026.pdf",
  },
  {
    date: "24 Apr 2026",
    tag: "Placements",
    title: "Pre-placement talks for Capgemini and Hexaware on 02 May.",
    url: null,
  },
  {
    date: "18 Apr 2026",
    tag: "Hostel",
    title: "Vacation guidelines for residents staying through summer.",
    url: null,
  },
  {
    date: "12 Apr 2026",
    tag: "R&D",
    title: "Call for proposals — UGC minor research grants 2026.",
    url: null,
  },
  {
    date: "05 Apr 2026",
    tag: "Event",
    title: "Annual cultural fest 'Spandana 2026' opens for registrations.",
    url: null,
  },
  {
    date: "28 Mar 2026",
    tag: "General",
    title: "Library timings extended during examination weeks.",
    url: null,
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL missing from .env");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL);

  try {
    console.log("🛠️ Adding url column to notices table if not exists...");
    await sql`ALTER TABLE "notices" ADD COLUMN IF NOT EXISTS "url" text;`;

    console.log("🧹 Clearing old entries from notices table...");
    await sql`DELETE FROM "notices";`;

    console.log("🌱 Inserting 2026 notices (July 2026 -> March 2026) into PostgreSQL...");
    // Insert in reverse order so newer items have higher auto-increment IDs
    const reversed = [...NOTICES].reverse();
    for (const n of reversed) {
      await sql`
        INSERT INTO "notices" ("date", "tag", "title", "url")
        VALUES (${n.date}, ${n.tag}, ${n.title}, ${n.url})
      `;
    }

    console.log("✅ Successfully seeded July 2026 notices into PostgreSQL!");
  } catch (err) {
    console.error("❌ Error seeding notices:", err);
  } finally {
    await sql.end();
  }
}

seed();
