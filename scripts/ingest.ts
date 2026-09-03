import "dotenv/config";
import { db } from "../src/db";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import {
  notices, leadership, leadershipStaff, siteContent,
  academicRegulations, academicSyllabus, academicTimetables,
  academicCalendars, academicDownloads, academicFeeStructure,
  academicCoursesOffered, academicFaculty, departments,
  faculty, laboratories, achievements, hostelContent,
  hostelPeople, hostelStructure, libraryContent, libraryStats,
  libraryTeam, placementHighlights, placementYears,
  placementStaff, majorRecruiters, recruiters,
  rdProjects, rdPublications, rdScholars, rdMous,
  iqacComposition, iqacEvents, iqacReports, iqacMous,
  nssProfile, nssActivities, nssSpecialCamp,
  edcProfile, edcActivities, edcCommittee,
  profChapters,
  studentClubs, studentClubContent,
  sportsContent, sportsAchievements, sportsInfra,
  dispensaryContent, dispensaryPeople,
  weActivities, weCommittee, weProfile,
  tickerNotifications, tpo, courses,
  academicsExamCell, academicsCac
} from "../src/db/schema";

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

async function embed(text: string): Promise<number[]> {
  const pipe = await getEmbedder();
  const result = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(result.data);
}

async function upsertChunk(content: string, source: string, sourceType: string, metadata: object = {}) {
  if (!content?.trim() || content.trim().length < 10) return;
  const hash = createHash("md5").update(content).digest("hex");
  const existing = await db.execute(
    sql`SELECT content_hash FROM rag_chunks WHERE source = ${source} LIMIT 1`
  );
  if ((existing as any[]).length > 0 && (existing as any[])[0].content_hash === hash) return;
  const vector = await embed(content);
  const vectorStr = `[${vector.join(",")}]`;
  await db.execute(sql`
    INSERT INTO rag_chunks (content, embedding, source, source_type, metadata, content_hash)
    VALUES (${content}, ${vectorStr}::vector, ${source}, ${sourceType}, ${JSON.stringify(metadata)}, ${hash})
    ON CONFLICT (source) DO UPDATE SET
      content = EXCLUDED.content,
      embedding = EXCLUDED.embedding,
      metadata = EXCLUDED.metadata,
      content_hash = EXCLUDED.content_hash,
      updated_at = now()
  `);
  console.log(`✓ ${source}`);
}

async function main() {
  console.log("🚀 Starting full ingestion...");

  // NOTICES
  for (const n of await db.select().from(notices))
    await upsertChunk(`Notice: ${n.title}. Category: ${n.tag}. Date: ${n.date}`, `notice:${n.id}`, "notice", { date: n.date, tag: n.tag });

  // LEADERSHIP
  for (const l of await db.select().from(leadership))
    await upsertChunk(`${l.designation}: ${l.name}. Email: ${l.email}. Profile: ${l.profile}. Message: ${l.message}`, `leadership:${l.id}`, "leadership", { slug: (l as any).slug });

  // LEADERSHIP STAFF (principal's office staff)
  for (const s of await db.select().from(leadershipStaff))
    await upsertChunk(`Principal Office Staff: ${(s as any).name}. Role: ${(s as any).designation ?? ""}. Phone: ${(s as any).phone ?? ""}`, `leadership_staff:${(s as any).id}`, "leadership_staff", {});

  // FACULTY
  for (const f of await db.select().from(faculty))
    await upsertChunk(`Faculty: ${f.name}, ${f.designation}, Department: ${f.department}. Email: ${f.email}`, `faculty:${f.id}`, "faculty", { department: f.department });

  // ACADEMIC FACULTY (HODs) - fix column name
  for (const f of await db.select().from(academicFaculty))
    await upsertChunk(
      `HOD of ${(f as any).department ?? ""}: ${(f as any).faculty_name ?? ""}. Designation: ${(f as any).designation ?? ""}. Email: ${(f as any).email ?? ""}. Qualification: ${(f as any).qualification ?? ""}. Experience: ${(f as any).experience ?? ""}.`,
      `academic_faculty:${(f as any).id}`,
      "hod",
      { department: (f as any).department }
    );

  // HODs from departments table — single source of truth
  for (const d of await db.select().from(departments)) {
    if ((d as any).hod) {
      await upsertChunk(
        `Head of Department (HOD) of ${(d as any).name}: ${(d as any).hod}. Department: ${(d as any).name}.`,
        `dept_hod:${(d as any).id}`,
        "hod",
        { department: (d as any).name }
      );
    }
  }

  // DEPARTMENTS
  for (const d of await db.select().from(departments))
    await upsertChunk(`Department: ${d.name}. ${d.description ?? ""}`, `department:${d.id}`, "department", {});

  // COURSES OFFERED
  for (const c of await db.select().from(academicCoursesOffered))
    await upsertChunk(`Course Offered: ${(c as any).name ?? ""}. Branch: ${(c as any).branch ?? ""}. Duration: ${(c as any).duration ?? ""}. Intake: ${(c as any).intake ?? ""}`, `course_offered:${(c as any).id}`, "course", {});

  // COURSES
  for (const c of await db.select().from(courses))
    await upsertChunk(`Course: ${(c as any).name ?? ""} ${(c as any).description ?? ""}`, `course:${(c as any).id}`, "course", {});

  // REGULATIONS
  for (const r of await db.select().from(academicRegulations))
    await upsertChunk(`Academic Regulation: ${r.title}. Category: ${r.category}. Download: ${r.link}`, `regulation:${r.id}`, "regulation", { link: r.link, category: r.category });

  // SYLLABUS
  for (const s of await db.select().from(academicSyllabus))
    await upsertChunk(`Syllabus: ${s.subject_name}. Regulation: ${s.regulation}. Branch: ${s.branch}. Semester: ${s.semester}. Program: ${s.program_name}. PDF: ${s.pdf_url}`, `syllabus:${s.id}`, "syllabus", { regulation: s.regulation, branch: s.branch, pdf_url: s.pdf_url });

  // TIMETABLES
  for (const t of await db.select().from(academicTimetables))
    await upsertChunk(`Timetable: ${t.subject_name}. Branch: ${t.branch}. Semester: ${t.semester}. Regulation: ${t.regulation}. PDF: ${t.pdf_url}`, `timetable:${t.id}`, "timetable", { pdf_url: t.pdf_url });

  // ACADEMIC CALENDARS
  for (const c of await db.select().from(academicCalendars))
    await upsertChunk(`Academic Calendar: ${(c as any).calendar_type ?? ""}. Regulation: ${(c as any).regulation ?? ""}. Year: ${(c as any).academic_year ?? ""}. PDF: ${(c as any).pdf_url ?? ""}`, `calendar:${(c as any).id}`, "calendar", { pdf_url: (c as any).pdf_url });

  // DOWNLOADS
  for (const d of await db.select().from(academicDownloads))
    await upsertChunk(`Download: ${(d as any).document_name ?? ""}. Category: ${(d as any).category ?? ""}. PDF: ${(d as any).pdf_url ?? ""}`, `download:${(d as any).id}`, "download", { pdf_url: (d as any).pdf_url });

  // EXAM CELL
  for (const e of await db.select().from(academicsExamCell))
    await upsertChunk(`Exam Cell: ${(e as any).type ?? ""} - ${(e as any).title ?? ""}. Date: ${(e as any).date ?? ""}. File: ${(e as any).file_url ?? ""}`, `examcell:${(e as any).id}`, "exam_cell", { file_url: (e as any).file_url });

  // FEE STRUCTURE
  for (const f of await db.select().from(academicFeeStructure))
    await upsertChunk(`Fee Structure: ${(f as any).category ?? ""} ${(f as any).amount ?? ""} ${(f as any).description ?? ""}`, `fee:${(f as any).id}`, "fee", {});

  // LABORATORIES
  for (const l of await db.select().from(laboratories))
    await upsertChunk(`Laboratory: ${(l as any).name ?? ""}. Department: ${(l as any).department ?? ""}. Description: ${(l as any).description ?? ""}`, `lab:${(l as any).id}`, "laboratory", { department: (l as any).department });

  // HOSTEL
  for (const h of await db.select().from(hostelContent))
    await upsertChunk(`Hostel: ${(h as any).title ?? ""} ${(h as any).content ?? ""}`, `hostel:${(h as any).id}`, "hostel", {});
  for (const h of await db.select().from(hostelPeople))
    await upsertChunk(`Hostel Staff: ${(h as any).name ?? ""}. Role: ${(h as any).role ?? ""}. Phone: ${(h as any).phone ?? ""}`, `hostel_person:${(h as any).id}`, "hostel_staff", {});
  for (const h of await db.select().from(hostelStructure))
    await upsertChunk(`Hostel Structure: ${(h as any).title ?? ""} ${(h as any).description ?? ""}`, `hostel_struct:${(h as any).id}`, "hostel", {});

  // LIBRARY
  for (const l of await db.select().from(libraryContent))
    await upsertChunk(`Library: ${(l as any).title ?? ""} ${(l as any).content ?? ""}`, `library:${(l as any).id}`, "library", {});
  for (const l of await db.select().from(libraryStats))
    await upsertChunk(`Library Stats: ${(l as any).label ?? ""}: ${(l as any).value ?? ""}`, `library_stat:${(l as any).id}`, "library", {});
  for (const l of await db.select().from(libraryTeam))
    await upsertChunk(`Library Staff: ${(l as any).name ?? ""}. Role: ${(l as any).role ?? ""}`, `library_team:${(l as any).id}`, "library_staff", {});

  // PLACEMENTS
  for (const p of await db.select().from(placementHighlights))
    await upsertChunk(`Placement Highlight: ${(p as any).title ?? ""} ${(p as any).value ?? ""}`, `placement:${(p as any).id}`, "placement", {});
  for (const p of await db.select().from(placementYears))
    await upsertChunk(`Placement Year: ${(p as any).year ?? ""}. Students Placed: ${(p as any).placed ?? ""}. Highest Package: ${(p as any).highest ?? ""}. Average Package: ${(p as any).average ?? ""}`, `placement_year:${(p as any).id}`, "placement", {});
  for (const p of await db.select().from(placementStaff))
    await upsertChunk(`Placement Staff: ${(p as any).name ?? ""}. Role: ${(p as any).role ?? ""}. Email: ${(p as any).email ?? ""}`, `placement_staff:${(p as any).id}`, "placement_staff", {});
  for (const r of await db.select().from(majorRecruiters))
    await upsertChunk(`Major Recruiter: ${(r as any).name ?? ""}`, `recruiter:${(r as any).id}`, "recruiter", {});
  for (const r of await db.select().from(recruiters))
    await upsertChunk(`Recruiter: ${(r as any).name ?? ""}`, `all_recruiter:${(r as any).id}`, "recruiter", {});
  for (const t of await db.select().from(tpo))
    await upsertChunk(`Training & Placement Officer: ${(t as any).name ?? ""}. Email: ${(t as any).email ?? ""}. Phone: ${(t as any).phone ?? ""}`, `tpo:${(t as any).id}`, "placement_staff", {});

  // R&D
  for (const r of await db.select().from(rdProjects))
    await upsertChunk(`R&D Project: ${(r as any).title ?? ""}. ${(r as any).description ?? ""}. PI: ${(r as any).pi_name ?? ""}. Funding: ${(r as any).funding_agency ?? ""}`, `rdproject:${(r as any).id}`, "rd_project", {});
  for (const r of await db.select().from(rdPublications))
    await upsertChunk(`Research Publication: ${(r as any).title ?? ""}. Authors: ${(r as any).authors ?? ""}. Journal: ${(r as any).journal ?? ""}. Year: ${(r as any).year ?? ""}`, `rdpub:${(r as any).id}`, "rd_publication", {});
  for (const r of await db.select().from(rdScholars))
    await upsertChunk(`PhD Scholar: ${(r as any).name ?? ""}. Supervisor: ${(r as any).supervisor ?? ""}. Topic: ${(r as any).topic ?? ""}. Status: ${(r as any).status ?? ""}`, `rdscholar:${(r as any).id}`, "rd_scholar", {});
  for (const r of await db.select().from(rdMous))
    await upsertChunk(`R&D MOU: ${(r as any).organization ?? ""}. Purpose: ${(r as any).purpose ?? ""}. Year: ${(r as any).year ?? ""}`, `rdmou:${(r as any).id}`, "rd_mou", {});

  // IQAC
  for (const i of await db.select().from(iqacComposition))
    await upsertChunk(`IQAC Member: ${(i as any).name ?? ""}. Role: ${(i as any).role ?? ""}. Category: ${(i as any).category ?? ""}`, `iqac_member:${(i as any).id}`, "iqac", {});
  for (const i of await db.select().from(iqacEvents))
    await upsertChunk(`IQAC Event: ${(i as any).title ?? ""}. Date: ${(i as any).date ?? ""}. Description: ${(i as any).description ?? ""}`, `iqac_event:${(i as any).id}`, "iqac", {});
  for (const i of await db.select().from(iqacReports))
    await upsertChunk(`IQAC Report (AQAR): Year ${(i as any).year ?? ""}. PDF: ${(i as any).pdf_url ?? ""}`, `iqac_report:${(i as any).id}`, "iqac", { pdf_url: (i as any).pdf_url });
  for (const i of await db.select().from(iqacMous))
    await upsertChunk(`IQAC MOU: ${(i as any).organization ?? ""}. Year: ${(i as any).year ?? ""}`, `iqac_mou:${(i as any).id}`, "iqac", {});

  // NSS
  for (const n of await db.select().from(nssProfile))
    await upsertChunk(`NSS Unit: ${(n as any).title ?? ""} ${(n as any).content ?? ""}`, `nss_profile:${(n as any).id}`, "nss", {});
  for (const n of await db.select().from(nssActivities))
    await upsertChunk(`NSS Activity: ${(n as any).title ?? ""}. Date: ${(n as any).date ?? ""}. Description: ${(n as any).description ?? ""}`, `nss_activity:${(n as any).id}`, "nss", {});
  for (const n of await db.select().from(nssSpecialCamp))
    await upsertChunk(`NSS Special Camp: ${(n as any).title ?? ""}. Location: ${(n as any).location ?? ""}. Year: ${(n as any).year ?? ""}`, `nss_camp:${(n as any).id}`, "nss", {});

  // EDC
  for (const e of await db.select().from(edcProfile))
    await upsertChunk(`EDC Cell: ${(e as any).title ?? ""} ${(e as any).content ?? ""}`, `edc:${(e as any).id}`, "edc", {});
  for (const e of await db.select().from(edcActivities))
    await upsertChunk(`EDC Activity: ${(e as any).title ?? ""}. Date: ${(e as any).date ?? ""}. ${(e as any).description ?? ""}`, `edc_activity:${(e as any).id}`, "edc", {});

  // PROFESSIONAL BODIES
  for (const p of await db.select().from(profChapters))
    await upsertChunk(`Professional Chapter: ${(p as any).name ?? ""}. Body: ${(p as any).body ?? ""}. Department: ${(p as any).department ?? ""}`, `prof_chapter:${(p as any).id}`, "prof_body", {});

  // STUDENT CLUBS
  for (const c of await db.select().from(studentClubs))
    await upsertChunk(`Student Club: ${(c as any).name ?? ""} ${(c as any).description ?? ""}`, `club:${(c as any).id}`, "student_club", {});
  for (const c of await db.select().from(studentClubContent))
    await upsertChunk(`Student Club Content: ${(c as any).title ?? ""} ${(c as any).content ?? ""}`, `club_content:${(c as any).id}`, "student_club", {});

  // SPORTS
  for (const s of await db.select().from(sportsContent))
    await upsertChunk(`Sports: ${(s as any).title ?? ""} ${(s as any).content ?? ""}`, `sports:${(s as any).id}`, "sports", {});
  for (const s of await db.select().from(sportsAchievements))
    await upsertChunk(`Sports Achievement: ${(s as any).title ?? ""}. ${(s as any).description ?? ""}`, `sports_ach:${(s as any).id}`, "sports", {});
  for (const s of await db.select().from(sportsInfra))
    await upsertChunk(`Sports Infrastructure: ${(s as any).name ?? ""}. ${(s as any).description ?? ""}`, `sports_infra:${(s as any).id}`, "sports", {});

  // DISPENSARY
  for (const d of await db.select().from(dispensaryContent))
    await upsertChunk(`Dispensary / Medical: ${(d as any).title ?? ""} ${(d as any).content ?? ""}`, `dispensary:${(d as any).id}`, "dispensary", {});
  for (const d of await db.select().from(dispensaryPeople))
    await upsertChunk(`Medical Staff: ${(d as any).name ?? ""}. Role: ${(d as any).role ?? ""}. Phone: ${(d as any).phone ?? ""}`, `dispensary_person:${(d as any).id}`, "dispensary", {});

  // WOMEN EMPOWERMENT
  for (const w of await db.select().from(weProfile))
    await upsertChunk(`Women Empowerment Cell: ${(w as any).title ?? ""} ${(w as any).content ?? ""}`, `we_profile:${(w as any).id}`, "wec", {});
  for (const w of await db.select().from(weActivities))
    await upsertChunk(`WEC Activity: ${(w as any).title ?? ""}. Date: ${(w as any).date ?? ""}. ${(w as any).description ?? ""}`, `we_activity:${(w as any).id}`, "wec", {});
  for (const w of await db.select().from(weCommittee))
    await upsertChunk(`WEC Committee Member: ${(w as any).name ?? ""}. Role: ${(w as any).role ?? ""}`, `we_committee:${(w as any).id}`, "wec", {});

  // ACHIEVEMENTS
  for (const a of await db.select().from(achievements))
    await upsertChunk(`Achievement: ${(a as any).title ?? ""} ${(a as any).description ?? ""}`, `achievement:${(a as any).id}`, "achievement", {});

  // SITE CONTENT
  for (const c of await db.select().from(siteContent))
    await upsertChunk(`Page: ${c.page}, Section: ${c.sectionKey}. ${c.title}. ${c.content}`, `sitecontent:${c.id}`, "site_content", { page: c.page });

  // TICKER
  for (const t of await db.select().from(tickerNotifications))
    await upsertChunk(`Notification: ${(t as any).text ?? ""} Link: ${(t as any).link ?? ""}`, `ticker:${(t as any).id}`, "notification", {});

  // STATIC JSON KNOWLEDGE BASE (Stories, Projects, Experience, FAQs, Facilities)
  try {
    const kbPath = path.resolve(process.cwd(), "src/data/college_kb.json");
    const kbData = JSON.parse(fs.readFileSync(kbPath, "utf8"));
    if (kbData.stories_and_experiences) {
      for (const s of kbData.stories_and_experiences) {
        await upsertChunk(`Story / Experience (${s.category}): ${s.title}. ${s.content}`, `kb_story:${s.id}`, "kb_story", { title: s.title, category: s.category });
      }
    }
    if (kbData.departments_detailed) {
      for (const d of kbData.departments_detailed) {
        await upsertChunk(`Department Detail: ${d.name} (${d.code}). HOD: ${d.hod}. Intake: ${d.intake || "N/A"}. Highlights: ${d.highlights}`, `kb_dept:${d.code}`, "department", { code: d.code });
      }
    }
    if (kbData.faqs) {
      for (let i = 0; i < kbData.faqs.length; i++) {
        const faq = kbData.faqs[i];
        await upsertChunk(`FAQ Question: ${faq.question} Answer: ${faq.answer}`, `kb_faq:${i}`, "kb_faq", {});
      }
    }
    if (kbData.facilities) {
      for (const [key, val] of Object.entries(kbData.facilities)) {
        await upsertChunk(`Campus Facility (${key}): ${val}`, `kb_facility:${key}`, "kb_facility", {});
      }
    }
  } catch (err) {
    console.warn("Notice: Could not load college_kb.json for ingestion:", err);
  }

  console.log("✅ Full ingestion complete.");
}

main().catch(console.error);

