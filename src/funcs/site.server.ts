import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { siteContent, notices, academicRegulations, campusGallery, leadership, academicSyllabus, academicDownloads, academicTimetables, academicsExamCell, academicFeeStructure, academicCalendars } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { serverCache } from "../lib/server-cache";
import { ingestSingleChunk, deleteSingleChunk } from "../lib/ingest";
import { runChatbotEngine } from "../lib/chatbot-engine";

// ── Singleton embedder + Query Vector cache (0ms for repeated queries) ──
let _embedder: any = null;
const _queryVectorCache = new Map<string, number[]>();

async function getCachedEmbedder() {
  if (!_embedder) {
    const { pipeline } = await import("@xenova/transformers");
    _embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return _embedder;
}

async function embedQuery(text: string): Promise<number[]> {
  const cleanKey = text.trim().toLowerCase();
  if (_queryVectorCache.has(cleanKey)) {
    return _queryVectorCache.get(cleanKey)!;
  }
  const pipe = await getCachedEmbedder();
  const result = await pipe(text, { pooling: "mean", normalize: true });
  const vector = Array.from(result.data as number[]);
  if (_queryVectorCache.size > 500) _queryVectorCache.clear();
  _queryVectorCache.set(cleanKey, vector);
  return vector;
}


import { memoryCache } from "../lib/cache";

export const getPageContent = createServerFn({
  method: "GET",
})
  .validator((page: string) => page)
  .handler(async ({ data: page }) => {
    return memoryCache.getOrSet(`siteContent:${page}`, 10 * 60 * 1000, async () => {
      try {
        const records = await db
          .select()
          .from(siteContent)
          .where(eq(siteContent.page, page));
        return records;
      } catch {
        return [];
      }
    });
  });

export const updatePageSection = createServerFn({
  method: "POST",
})
  .validator(
    (d: {
      page: string;
      sectionKey: string;
      title?: string;
      content?: string;
      imageUrl?: string;
      [key: string]: any;
    }) => d
  )
  .handler(async ({ data }) => {
    try {
      const [existing] = await db
        .select()
        .from(siteContent)
        .where(
          and(
            eq(siteContent.page, data.page),
            eq(siteContent.sectionKey, data.sectionKey)
          )
        );

      let updated: any;
      let recordId: number;
      if (existing) {
        const rows = await db
          .update(siteContent)
          .set({
            title: data.title !== undefined ? data.title : existing.title,
            content: data.content !== undefined ? data.content : existing.content,
            imageUrl: data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl,
          })
          .where(eq(siteContent.id, existing.id))
          .returning();
        updated = rows[0];
        recordId = existing.id;
      } else {
        const inserted = await db
          .insert(siteContent)
          .values({
            page: data.page,
            sectionKey: data.sectionKey,
            title: data.title || "",
            content: data.content || "",
            imageUrl: data.imageUrl || "",
          })
          .returning({ id: siteContent.id });
        recordId = inserted[0].id;
      }

      memoryCache.invalidate(`siteContent:${data.page}`);

      // Auto-ingest chunk for RAG chatbot!
      const chunkSource = `sitecontent:${recordId}`;
      const chunkText = `Page: ${data.page}, Section: ${data.sectionKey}. ${data.title}. ${data.content}`;
      ingestSingleChunk(chunkText, chunkSource, "site_content", { page: data.page }).catch(
        (err) => console.error("RAG auto-ingest error:", err)
      );

      return { success: true };
    } catch (err) {
      console.error("Update page section failed:", err);
      throw new Error("Failed to update section");
    }
  });

export const getNotices = createServerFn({
  method: "GET",
}).handler(async () => {
  const cacheKey = "notices_all";
  const cached = serverCache.get<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const results = await db.select().from(notices).orderBy(desc(notices.id));
    serverCache.set(cacheKey, results, 15 * 60 * 1000); // 15 mins
    return results;
  } catch {
    return [];
  }
});

export const addNotice = createServerFn({
  method: "POST",
})
  .validator(
    (data: { title: string; date: string; tag: string; link?: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const inserted = await db
        .insert(notices)
        .values({
          title: data.title,
          date: data.date,
          tag: data.tag,
          url: data.link || null,
        })
        .returning({ id: notices.id });

      const noticeId = inserted[0].id;
      serverCache.invalidate("notices_all");

      const chunkSource = `notice:${noticeId}`;
      const chunkText = `Notice: ${data.title}. Category: ${data.tag}. Date: ${data.date}`;
      ingestSingleChunk(chunkText, chunkSource, "notice", { date: data.date, tag: data.tag }).catch(
        (err) => console.error("RAG auto-ingest notice error:", err)
      );

      // Web Push Notification broadcast for newly published notice
      import("./push.server").then(({ sendPushToAllSubscribers }) => {
        sendPushToAllSubscribers({
          title: `📢 New Notice: ${data.title}`,
          body: `Category: ${data.tag} • ${data.date}`,
          url: data.link || "/notices",
          tag: `notice-${noticeId}`,
        }).catch((err) => console.error("Push notification broadcast error on addNotice:", err));
      }).catch(() => {});

      return { success: true, id: noticeId };
    } catch (err) {
      console.error("Add notice failed:", err);
      throw new Error("Failed to add notice");
    }
  });

export const updateNotice = createServerFn({
  method: "POST",
})
  .validator(
    (data: { id: number; title: string; date: string; tag: string; link?: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      await db
        .update(notices)
        .set({
          title: data.title,
          date: data.date,
          tag: data.tag,
          url: data.link || null,
        })
        .where(eq(notices.id, data.id));

      serverCache.invalidate("notices_all");

      const chunkSource = `notice:${data.id}`;
      const chunkText = `Notice: ${data.title}. Category: ${data.tag}. Date: ${data.date}`;
      ingestSingleChunk(chunkText, chunkSource, "notice", { date: data.date, tag: data.tag }).catch(
        (err) => console.error("RAG auto-ingest notice error on update:", err)
      );

      // Web Push Notification broadcast for updated notice
      import("./push.server").then(({ sendPushToAllSubscribers }) => {
        sendPushToAllSubscribers({
          title: `🔔 Notice Updated: ${data.title}`,
          body: `Category: ${data.tag} • Updated: ${data.date}`,
          url: data.link || "/notices",
          tag: `notice-${data.id}`,
        }).catch((err) => console.error("Push notification broadcast error on updateNotice:", err));
      }).catch(() => {});

      return { success: true };
    } catch (err) {
      console.error("Update notice failed:", err);
      throw new Error("Failed to update notice");
    }
  });

export const deleteNotice = createServerFn({
  method: "POST",
})
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(notices).where(eq(notices.id, data.id));
      serverCache.invalidate("notices_all");
      await deleteSingleChunk(`notice:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete notice failed:", err);
      throw new Error("Failed to delete notice");
    }
  });

export const getAcademicRegulations = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return await db.select().from(academicRegulations).orderBy(desc(academicRegulations.id));
  } catch {
    return [];
  }
});

export const addAcademicRegulation = createServerFn({
  method: "POST",
})
  .validator(
    (data: { title: string; category: string; link: string }) => data
  )
  .handler(async ({ data }) => {
    try {
      const inserted = await db
        .insert(academicRegulations)
        .values({
          title: data.title,
          category: data.category,
          size: "PDF",
          date: new Date().toLocaleDateString(),
          link: data.link,
        })
        .returning({ id: academicRegulations.id });

      const regId = inserted[0].id;
      const chunkSource = `regulation:${regId}`;
      const chunkText = `Academic Regulation: ${data.title}. Category: ${data.category}. Download: ${data.link}`;
      ingestSingleChunk(chunkText, chunkSource, "regulation", { link: data.link, category: data.category }).catch(
        (err) => console.error("RAG auto-ingest regulation error:", err)
      );

      return { success: true };
    } catch (err) {
      console.error("Add regulation failed:", err);
      throw new Error("Failed to add regulation");
    }
  });

export const deleteAcademicRegulation = createServerFn({
  method: "POST",
})
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(academicRegulations).where(eq(academicRegulations.id, data.id));
      await deleteSingleChunk(`regulation:${data.id}`);
      return { success: true };
    } catch (err) {
      console.error("Delete regulation failed:", err);
      throw new Error("Failed to delete regulation");
    }
  });

export const getCampusGallery = createServerFn({
  method: "GET",
}).handler(async () => {
  const cached = serverCache.get<any[]>("campus_gallery_db");
  if (cached) return cached;
  try {
    const res = await db.select().from(campusGallery).orderBy(desc(campusGallery.id));
    serverCache.set("campus_gallery_db", res, 15 * 60 * 1000);
    return res;
  } catch {
    return [];
  }
});

export const addCampusGalleryItem = createServerFn({
  method: "POST",
})
  .validator((data: { src: string; caption?: string }) => data)
  .handler(async ({ data }) => {
    try {
      const inserted = await db.insert(campusGallery).values({
        src: data.src,
        caption: data.caption || "",
      }).returning({ id: campusGallery.id });
      serverCache.invalidate("campus_gallery_db");
      return { success: true, id: inserted[0].id };
    } catch (err) {
      console.error("Add campus gallery item failed:", err);
      throw new Error("Failed to add campus gallery item");
    }
  });

export const deleteCampusGalleryItem = createServerFn({
  method: "POST",
})
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    try {
      await db.delete(campusGallery).where(eq(campusGallery.id, data.id));
      serverCache.invalidate("campus_gallery_db");
      return { success: true };
    } catch (err) {
      console.error("Delete campus gallery item failed:", err);
      throw new Error("Failed to delete campus gallery item");
    }
  });

export const queryChatbot = createServerFn({ method: "POST" })
  .validator((data: {
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  }) => data)
  .handler(async ({ data }) => {
    const query = data.messages[data.messages.length - 1]?.content?.trim() || "";
    if (!query) return { reply: "Please ask me something! 😊" };

    // 1. Embed query using cached singleton embedder + query vector cache (0ms for repeat queries)
    const vector = await embedQuery(query);
    const vectorStr = `[${vector.join(",")}]`;

    // 2. Elastic Hybrid Search: Postgres Vector Cosine Distance + Fulltext OR Terms Search
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    const words = cleanQuery.split(/\s+/).filter((w) => w.length > 2);
    const orQueryStr = words.length > 0 ? words.join(" | ") : cleanQuery;

    let chunks: any[] = [];
    try {
      const queryResult = await db.execute(sql`
        SELECT content, source_type, metadata,
               (1 - (embedding <=> ${vectorStr}::vector)) AS similarity,
               ts_rank_cd(to_tsvector('english', content), to_tsquery('english', ${orQueryStr})) AS text_rank,
               (0.50 * (1 - (embedding <=> ${vectorStr}::vector)) +
                0.50 * COALESCE(ts_rank_cd(to_tsvector('english', content), to_tsquery('english', ${orQueryStr})), 0)) AS combined_score
        FROM rag_chunks
        WHERE (1 - (embedding <=> ${vectorStr}::vector)) > 0.01
           OR (to_tsvector('english', content) @@ to_tsquery('english', ${orQueryStr}))
        ORDER BY combined_score DESC, similarity DESC
        LIMIT 30
      `);
      chunks = Array.from(queryResult);
    } catch {
      // Fallback to pure vector search if fulltext query syntax fails
      try {
        const fallbackResult = await db.execute(sql`
          SELECT content, source_type, metadata,
                 1 - (embedding <=> ${vectorStr}::vector) AS similarity
          FROM rag_chunks
          WHERE 1 - (embedding <=> ${vectorStr}::vector) > 0.01
          ORDER BY embedding <=> ${vectorStr}::vector
          LIMIT 30
        `);
        chunks = Array.from(fallbackResult);
      } catch {
        chunks = [];
      }
    }

    // 3. If query mentions syllabus, pull live syllabus entries directly from DB
    if (/syllabus|curriculum|r23|r20|r25/i.test(query)) {
      try {
        const sylRows = await db.select().from(academicSyllabus);
        for (const s of sylRows) {
          chunks.push({
            content: `Syllabus: ${s.subject_name}. Regulation: ${s.regulation}. Branch: ${s.branch}. Semester: ${s.semester}. Program: ${s.program_name}. PDF: ${s.pdf_url}`,
            source_type: "syllabus",
            metadata: {
              regulation: s.regulation,
              branch: s.branch,
              pdf_url: s.pdf_url,
              academic_year: s.academic_year,
            },
            similarity: 1.0,
          });
        }
      } catch (err) {
        console.error("Error pulling live syllabus records:", err);
      }
    }

    // 4. Local Intelligent Engine: Intent detection + BM25 Rerank + Multi-chunk synthesis
    const reply = runChatbotEngine({ query, chunks });
    return { reply };
  });

// ── JNTU-GV External Gallery API & Local Dataset ──
import jntugvGalleryData from "../data/jntugv-gallery.json";

export interface JntugvGalleryItem {
  id: number;
  date: string;
  title: string;
  file_path: string;
  description: string;
  submitted: string;
  admin_approval: string;
  carousel_scrolling: string;
  gallery_scrolling: string;
  imglink: string;
}

// Helper to format and correct gallery event titles and descriptions
function formatGalleryTitle(title: string): string {
  const trimmed = (title || "").trim();
  if (/^THE FIRST CONVOCATION/i.test(trimmed)) return "1st Convocation of JNTU-GV";
  if (/^Online Services for Certificates/i.test(trimmed)) return "Online Services for Certificates Launched by Hon'ble Vice-Chancellor";
  if (/^Closing ceremony of International YogaDay/i.test(trimmed)) return "Closing Ceremony of International Yoga Day Celebrations";
  if (/^Swarna Andhra.*Clean Sweep/i.test(trimmed)) return "Swarna Andhra - Swachha Andhra (SASA) Clean Sweep Program";
  if (/^Admissions Open.*IIBMP/i.test(trimmed)) return "Admissions Open 2026 for IIBMP International Programmes";
  if (/^Celebrating World Environment Day/i.test(trimmed)) return "Celebrating World Environment Day at JNTU-GV";
  if (/^Free German Language Training/i.test(trimmed)) return "Free German Language Training Program for ITI Candidates";
  if (/^JNTU-GV signed an MoU with The Reutlingen/i.test(trimmed)) return "MoU with Reutlingen University Knowledge Foundation (KFRU), Germany";
  if (/^Association of Indian universities/i.test(trimmed)) return "AIU South Zone Vice Chancellors Meet 2025 - 2026";
  if (/^JNTU-GV Faclitating/i.test(trimmed)) return "JNTU-GV Facilitating E-Bikes for Campus Security";
  if (/^JNTUGV- celebrated and hounoured/i.test(trimmed)) return "Sri Vasireddy Venkatadri Naidu Jayanthi Celebrations";
  if (/^JNTUGV celebrated the occasion.*Ambedkar/i.test(trimmed)) return "Dr. B.R. Ambedkar Jayanthi Celebrations at JNTU-GV";
  if (/^The inauguration of the Water Conservation/i.test(trimmed)) return "Inauguration of Water Conservation Scheme at Campus";
  if (/^Dr\. Babu Jagjivan Ram’s birthday/i.test(trimmed)) return "Dr. Babu Jagjivan Ram Jayanthi Celebrations";
  if (/^Prof\. D\. Rajya Lakshmi Assuming/i.test(trimmed)) return "Prof. D. Rajya Lakshmi Assuming Charge as Registrar In-Charge";
  if (/^JNTU-GV Annual Day/i.test(trimmed)) return "JNTU-GV Annual Day & Sports Celebrations 2026";
  if (/^JNTU-GV has entered into a strategic/i.test(trimmed)) return "Strategic MoU with ExcelR for Student Skill Development";
  if (/^SMART HOSTEL MANAGEMENT SYSTEM/i.test(trimmed)) return "Smart Hostel Management System Inauguration";
  if (/^Inaguration of Bus Donated by SBI/i.test(trimmed)) return "Inauguration of College Bus Donated by State Bank of India";
  return trimmed;
}

export const getJntugvGalleryImages = createServerFn({
  method: "GET",
}).handler(async (): Promise<JntugvGalleryItem[]> => {
  const cached = serverCache.get<JntugvGalleryItem[]>("jntugv_gallery_external");
  if (cached) return cached;

  const featuredItems: JntugvGalleryItem[] = [
    {
      id: 166,
      date: "2026-08-15",
      title: "80th Independence Day Celebrations at JNTU-GV",
      file_path: "uploads/photo-gallery/independence_day.jpeg",
      description:
        "JNTU-GV celebrated the 80th Independence Day grandly on the campus in the presence of the Honorable Vice-Chancellor, Registrar, Principal, faculty and students.",
      submitted: "University Admin",
      admin_approval: "accepted",
      carousel_scrolling: "yes",
      gallery_scrolling: "yes",
      imglink: "uploads/photo-gallery/independence_day.jpeg",
    },
  ];

  let rawPool: JntugvGalleryItem[] = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800); // 800ms fast timeout
    const res = await fetch(
      "https://api.jntugv.edu.in/api/webadmin/dmc/getgallery",
      { signal: controller.signal } as any,
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const filtered = data.filter(
          (img: JntugvGalleryItem) =>
            img.admin_approval === "accepted" &&
            (img.carousel_scrolling === "yes" || img.gallery_scrolling === "yes"),
        );
        rawPool = [...featuredItems, ...filtered];
      }
    }
  } catch {
    // Graceful fallback to bundled high-speed gallery dataset
  }

  if (rawPool.length === 0) {
    const fallback = jntugvGalleryData as JntugvGalleryItem[];
    const filtered = fallback.filter(
      (img) =>
        img.id !== 166 && // Prevent duplicate of featured item 166
        img.admin_approval === "accepted" &&
        (img.carousel_scrolling === "yes" || img.gallery_scrolling === "yes"),
    );
    rawPool = [...featuredItems, ...filtered];
  }

  // Sort rawPool strictly by date descending (latest first)
  rawPool.sort((a, b) => {
    const timeA = new Date(a.date || 0).getTime();
    const timeB = new Date(b.date || 0).getTime();
    return timeB - timeA;
  });

  // Strictly deduplicate by ID and cleaned Title
  const seenIds = new Set<number>();
  const seenTitles = new Set<string>();
  const combined: JntugvGalleryItem[] = [];

  for (const item of rawPool) {
    const formattedTitle = formatGalleryTitle(item.title);
    const cleanKey = formattedTitle.toLowerCase();
    if (!seenIds.has(item.id) && !seenTitles.has(cleanKey)) {
      seenIds.add(item.id);
      if (cleanKey) seenTitles.add(cleanKey);

      const cleanImglink = item.imglink?.startsWith("http")
        ? encodeURI(item.imglink)
        : item.imglink;

      combined.push({
        ...item,
        title: formattedTitle,
        description: item.description && item.description.trim() && item.description !== item.title
          ? item.description.trim()
          : formattedTitle,
        imglink: cleanImglink,
      });
    }
  }

  // Final sort to strictly guarantee chronological descending order
  combined.sort((a, b) => {
    const timeA = new Date(a.date || 0).getTime();
    const timeB = new Date(b.date || 0).getTime();
    return timeB - timeA;
  });

  serverCache.set("jntugv_gallery_external", combined, 60 * 60 * 1000);
  return combined;
});
