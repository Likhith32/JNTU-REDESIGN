import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import {
  notices, leadership, siteContent, academicRegulations,
  academicSyllabus, academicTimetables, academicCalendars,
  academicDownloads, academicFeeStructure, academicFaculty,
  faculty, departments, tickerNotifications, hostelContent,
  libraryContent, studentClubs, tpo, placementHighlights,
  placementGoals, majorRecruiters, recruiters, rdProjects,
  rdScholars, rdPublications, rdFocusAreas, rdConsultancy,
  rdCommittee
} from "../db/schema";
import { ingestSingleChunk } from "../lib/ingest";

export const triggerDatabaseIngest = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      let count = 0;

      // 1. Notices & Announcements
      const allNotices = await db.select().from(notices);
      for (const n of allNotices) {
        await ingestSingleChunk(`Notice: ${n.title}. Category: ${n.tag}. Date: ${n.date}`, `notice:${n.id}`, "notice", { tag: n.tag, date: n.date });
        count++;
      }

      // 2. Leadership
      const allLeaders = await db.select().from(leadership);
      for (const l of allLeaders) {
        await ingestSingleChunk(`${l.designation}: ${l.name}. Email: ${l.email}. Message: ${l.message}`, `leadership:${l.id}`, "leadership", { designation: l.designation });
        count++;
      }

      // 3. Faculty & Academic Faculty
      const allFaculty = await db.select().from(faculty);
      for (const f of allFaculty) {
        await ingestSingleChunk(`Faculty Member: ${f.name}, Designation: ${f.designation}, Department: ${(f as any).department || ""}`, `faculty:${f.id}`, "faculty", { department: (f as any).department });
        count++;
      }
      try {
        const allAcadFaculty = await db.select().from(academicFaculty);
        for (const af of allAcadFaculty) {
          const afObj = af as any;
          await ingestSingleChunk(`Academic Faculty Member: ${afObj.faculty_name || afObj.name}, Designation: ${afObj.designation}, Department: ${afObj.department || ""}, Qualification: ${afObj.qualification || ""}`, `acad_faculty:${afObj.id}`, "faculty", { department: afObj.department });
          count++;
        }
      } catch {
        // Table optional fallback
      }

      // 4. Departments & HODs
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

      const allDepts = await db.select().from(departments);
      for (const d of allDepts) {
        const dObj = d as any;
        const rawHod = (dObj.hod || "").trim();
        const hodName = rawHod.length > 5 ? rawHod : (HOD_MAP[dObj.slug?.toLowerCase() || ""] || rawHod);
        if (hodName) {
          await ingestSingleChunk(
            `Head of Department (HOD) of ${dObj.name}: ${hodName}. Department: ${dObj.name}. Code: ${dObj.slug}.`,
            `dept_hod:${dObj.id}`,
            "hod",
            { department: dObj.name }
          );
          count++;
        }
        await ingestSingleChunk(
          `Department of ${dObj.name} (${dObj.slug}). Overview: ${dObj.description || dObj.name}. HOD: ${hodName}`,
          `dept:${dObj.id}`,
          "department",
          { department: dObj.name }
        );
        count++;
      }

      // 5. Academic Regulations, Syllabus, Timetables, Fee Structure, Calendars, Downloads
      const allRegs = await db.select().from(academicRegulations);
      for (const r of allRegs) {
        await ingestSingleChunk(`Academic Regulation: ${r.title}. Category: ${r.category}. Link: ${r.link}`, `regulation:${r.id}`, "regulation", { link: r.link });
        count++;
      }

      const allSyllabus = await db.select().from(academicSyllabus);
      for (const s of allSyllabus) {
        await ingestSingleChunk(`Syllabus Course: ${s.subject_name}. Regulation: ${s.regulation}. Branch: ${s.branch}. Semester: ${s.semester}. Download PDF: ${s.pdf_url}`, `syllabus:${s.id}`, "syllabus", { pdf_url: s.pdf_url });
        count++;
      }

      try {
        const allTimetables = await db.select().from(academicTimetables);
        for (const tt of allTimetables) {
          const ttObj = tt as any;
          await ingestSingleChunk(`Class Timetable: ${ttObj.subject_name || ttObj.program_name}. Branch: ${ttObj.branch}. Semester: ${ttObj.semester}. Download: ${ttObj.pdf_url}`, `timetable:${ttObj.id}`, "timetable", { pdf_url: ttObj.pdf_url });
          count++;
        }
      } catch {}

      try {
        const allCalendars = await db.select().from(academicCalendars);
        for (const cal of allCalendars) {
          const calObj = cal as any;
          await ingestSingleChunk(`Academic Calendar: ${calObj.calendar_type || calObj.program_name}. Year: ${calObj.academic_year}. PDF: ${calObj.pdf_url}`, `calendar:${calObj.id}`, "calendar", { pdf_url: calObj.pdf_url });
          count++;
        }
      } catch {}

      try {
        const allDownloads = await db.select().from(academicDownloads);
        for (const dl of allDownloads) {
          const dlObj = dl as any;
          await ingestSingleChunk(`Academic Download Form: ${dlObj.document_name || dlObj.category}. PDF: ${dlObj.pdf_url}`, `download:${dlObj.id}`, "academic_download", { pdf_url: dlObj.pdf_url });
          count++;
        }
      } catch {}

      try {
        const allFee = await db.select().from(academicFeeStructure);
        for (const fee of allFee) {
          const feeObj = fee as any;
          await ingestSingleChunk(`Fee Structure: ${feeObj.course_name || feeObj.level}. Amount: ${feeObj.amount || ""}`, `fee:${feeObj.id}`, "fee", {});
          count++;
        }
      } catch {}

      // 6. Placements & TPO
      try {
        const tpoData = await db.select().from(tpo);
        for (const t of tpoData) {
          await ingestSingleChunk(`Training & Placement Officer (TPO): ${t.name}, ${t.designation}. Email: ${t.email}. Message: ${t.message}`, `tpo:${t.id}`, "placement_staff", { email: t.email });
          count++;
        }
      } catch {}

      try {
        const pHighlights = await db.select().from(placementHighlights);
        for (const ph of pHighlights) {
          await ingestSingleChunk(`Placement Highlight: Student ${ph.name} from branch ${ph.branch} placed at ${ph.company} with salary package ${ph.package}`, `ph:${ph.id}`, "placement", {});
          count++;
        }
      } catch {}

      try {
        const pGoals = await db.select().from(placementGoals);
        for (const pg of pGoals) {
          await ingestSingleChunk(`Placement Goal: ${pg.text}`, `pg:${pg.id}`, "placement", {});
          count++;
        }
      } catch {}

      try {
        const mRecruiters = await db.select().from(majorRecruiters);
        for (const mr of mRecruiters) {
          await ingestSingleChunk(`Top Campus Recruiter Company: ${mr.name}`, `mr:${mr.id}`, "recruiter", {});
          count++;
        }
      } catch {}

      try {
        const allRecruiters = await db.select().from(recruiters);
        for (const r of allRecruiters) {
          await ingestSingleChunk(`Recruiting Partner: ${r.name}. Website: ${r.url}`, `recruiter:${r.id}`, "recruiter", {});
          count++;
        }
      } catch {}

      // 7. Research & Development (R&D)
      try {
        const projects = await db.select().from(rdProjects);
        for (const p of projects) {
          await ingestSingleChunk(`R&D Funded Project: ${p.title}. Principal Investigator (PI): ${p.pi}. Funding Agency: ${p.agency}. Amount: ${p.amount}. Period: ${p.period}. Status: ${p.status}`, `rd_project:${p.id}`, "rd_project", {});
          count++;
        }
      } catch {}

      try {
        const scholars = await db.select().from(rdScholars);
        for (const sc of scholars) {
          await ingestSingleChunk(`Ph.D. Research Scholar: ${sc.scholarName} (Roll No: ${sc.rollNo}). Supervisor: ${sc.supervisor}. Topic: ${sc.researchTitle}. Registration Year: ${sc.regYear}. Status: ${sc.status}`, `rd_scholar:${sc.id}`, "rd_scholar", {});
          count++;
        }
      } catch {}

      try {
        const pubs = await db.select().from(rdPublications);
        for (const pb of pubs) {
          await ingestSingleChunk(`Research Publication: ${pb.title}. Authors: ${pb.authors}. Journal/Venue: ${pb.venue}. Department: ${pb.dept}`, `rd_pub:${pb.id}`, "rd_publication", {});
          count++;
        }
      } catch {}

      try {
        const focus = await db.select().from(rdFocusAreas);
        for (const fa of focus) {
          await ingestSingleChunk(`Research Focus Area: ${fa.title}. Description: ${fa.description}`, `rd_focus:${fa.id}`, "rd_project", {});
          count++;
        }
      } catch {}

      try {
        const consult = await db.select().from(rdConsultancy);
        for (const cs of consult) {
          await ingestSingleChunk(`Research Consultancy & Testing: ${cs.name}. Description: ${cs.description}`, `rd_consult:${cs.id}`, "rd_project", {});
          count++;
        }
      } catch {}

      try {
        const committee = await db.select().from(rdCommittee);
        for (const cm of committee) {
          await ingestSingleChunk(`R&D Committee Member: ${cm.name}. Role: ${cm.role}. Details: ${cm.detail}`, `rd_committee:${cm.id}`, "rd_project", {});
          count++;
        }
      } catch {}

      // 8. Site Content Pages
      const allContent = await db.select().from(siteContent);
      for (const c of allContent) {
        await ingestSingleChunk(`Page: ${c.page}, Section: ${c.sectionKey}. Title: ${c.title}. Content: ${c.content}`, `sitecontent:${c.id}`, "site_content", { page: c.page });
        count++;
      }

      // 9. Hostels, Library & Clubs
      try {
        const hostels = await db.select().from(hostelContent);
        for (const h of hostels) {
          const hObj = h as any;
          await ingestSingleChunk(`Hostel Facility: ${hObj.healthName || hObj.description || ""}. Description: ${hObj.description || ""}`, `hostel:${hObj.id}`, "hostel", {});
          count++;
        }
      } catch {}

      try {
        const libs = await db.select().from(libraryContent);
        for (const lb of libs) {
          const lbObj = lb as any;
          await ingestSingleChunk(`Library Facility & E-Resource: ${lbObj.officerName || lbObj.designation || "Library"}. Description: ${lbObj.about || lbObj.digitalDescription || ""}`, `library:${lbObj.id}`, "library", {});
          count++;
        }
      } catch {}

      try {
        const clubs = await db.select().from(studentClubs);
        for (const cl of clubs) {
          await ingestSingleChunk(`Student Activity Club: ${cl.name}. Description: ${(cl as any).description ?? (cl as any).title ?? ""}`, `club:${cl.id}`, "student_club", {});
          count++;
        }
      } catch {}

      // 10. Tickers & Notifications
      const allTickers = await db.select().from(tickerNotifications);
      for (const t of allTickers) {
        await ingestSingleChunk(`Notification Update: ${(t as any).text ?? ""} Link: ${(t as any).link ?? ""}`, `ticker:${(t as any).id}`, "notification", {});
        count++;
      }

      return { success: true, processed: count };
    } catch (err) {
      console.error("Ingest failed:", err);
      return { success: false, error: String(err) };
    }
  });
