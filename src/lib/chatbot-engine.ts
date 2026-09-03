/**
 * JNTU AI — Comprehensive Intelligent Answer Engine
 * ----------------------------------------------------
 * High-accuracy intent detection + BM25 & RAG vector synthesis
 * Covers all departments, faculty, leadership, regulations, fee structures,
 * hostels, library, placements, R&D, amenities, and campus activities.
 */

// ─────────────────────────────────────────────
// 1. LANGUAGE DETECTION
// ─────────────────────────────────────────────

export function detectLanguage(text: string): "telugu" | "tenglish" | "english" {
  if (/[\u0C00-\u0C7F]/.test(text)) return "telugu";

  const tenglishWords =
    /\b(ela|cheppandi|cheppu|enthi|ento|eppudu|emtho|emi|evaru|ekkada|ledu|undi|cheyandi|meeru|memu|manamu|maku|ivvandi|chudandi|teliyadu|telusa|ani|kada|kaadu|avunu|okka|vundi|unnaru|chestunnaru|cheppadu|randi|velladdam|pampinchandi)\b/i;
  if (tenglishWords.test(text)) return "tenglish";

  return "english";
}

// ─────────────────────────────────────────────
// 2. INTENT DETECTION
// ─────────────────────────────────────────────

export type Intent =
  | "greeting"
  | "farewell"
  | "thanks"
  | "leadership"
  | "principal"
  | "vice_principal"
  | "vc"
  | "hod"
  | "department"
  | "hostel"
  | "library"
  | "placement"
  | "syllabus"
  | "timetable"
  | "exam"
  | "fee"
  | "notice"
  | "nss"
  | "sports"
  | "dispensary"
  | "wec"
  | "edc"
  | "research"
  | "iqac"
  | "prof_body"
  | "club"
  | "admission"
  | "contact"
  | "location"
  | "about"
  | "faculty"
  | "lab"
  | "mou"
  | "transport"
  | "stories"
  | "projects"
  | "guesthouse"
  | "bank"
  | "canteen"
  | "certificates"
  | "timings"
  | "unknown"
  | "alumni";

const INTENT_PATTERNS: Array<{ intent: Intent; pattern: RegExp }> = [
  { intent: "greeting",      pattern: /^\s*(hi|hello|hey|namaste|namaskar|good\s*(morning|evening|afternoon)|howdy|sup|hii+|helo)\b/i },
  { intent: "farewell",      pattern: /\b(bye|goodbye|see you|take care|quit|exit|cya)\b/i },
  { intent: "thanks",        pattern: /\b(thank(s| you)|thanks\s*a\s*(lot|ton|bunch)|dhanyavaadalu|dhanyavadalu|ty\b|thx)\b/i },
  { intent: "vc",            pattern: /\b(vice.?chancellor|chancellor|vc\b|registrar|university officer|university head)\b/i },
  { intent: "principal",     pattern: /\b(principal|head of college|college head|who leads|who is in charge|college chief)\b/i },
  { intent: "vice_principal",pattern: /\b(vice.?principal|vp\b|vice principal)\b/i },
  { intent: "leadership",    pattern: /\b(leadership|management|governing body|administration|officials)\b/i },
  { intent: "hod",           pattern: /\b(hod|hods|head of department|head of the department|head of dept|heads of department|department head)\b/i },
  { intent: "department",    pattern: /\b(department|branch|program|stream|course|cse|ece|eee|mba|mechanical|metallurg|civil|it\b|information technology|sciences|humanities|bsh|s&h|what departments|which branches|how many branch)\b/i },
  { intent: "hostel",        pattern: /\b(hostel|accommodation|warden|mess|room|dormitory|boys hostel|girls hostel|residential|stay in campus)\b/i },
  { intent: "library",       pattern: /\b(library|book|journal|digital library|e-resource|librarian|reading room|nlist|ieee)\b/i },
  { intent: "placement",     pattern: /\b(placement|recruit|package|salary|tpo|campus drive|internship|job|lpa|offer|hire|placed|placement cell)\b/i },
  { intent: "syllabus",      pattern: /\b(syllabus|curriculum|r20|r23|r25|regulation|subject|course structure|study plan|scheme)\b/i },
  { intent: "timetable",     pattern: /\b(timetable|time table|schedule|class time|lecture schedule|period)\b/i },
  { intent: "exam",          pattern: /\b(exam|examination|result|revaluation|hall ticket|mid.?term|end.?sem|supply|backlog|cbcs|grade|marks|gpa|cgpa)\b/i },
  { intent: "fee",           pattern: /\b(fee|tuition|payment|scholarship|fee structure|college fees|how much cost|charges|annual fee|semester fee)\b/i },
  { intent: "notice",        pattern: /\b(notice|circular|announcement|notification|latest news|updates|bulletin)\b/i },
  { intent: "nss",           pattern: /\b(nss|national service scheme|volunteer|community service|social service)\b/i },
  { intent: "sports",        pattern: /\b(sports|gym|ground|tournament|athletics|cricket|football|basketball|indoor|outdoor|games|physical)\b/i },
  { intent: "dispensary",    pattern: /\b(dispensary|medical|doctor|nurse|ambulance|health|clinic|medicine|hospital|sick|first aid)\b/i },
  { intent: "wec",           pattern: /\b(women|wec|empowerment|harassment|anti.?ragging|grievance|gender cell|she team)\b/i },
  { intent: "edc",           pattern: /\b(edc|entrepreneur|startup|incubat|innovation|edii|msme|business)\b/i },
  { intent: "research",      pattern: /\b(research|rd\b|r&d|phd|ph\.d|scholar|publication|journal|patent|project|funding|consultancy)\b/i },
  { intent: "iqac",          pattern: /\b(iqac|naac|accreditat|aqar|quality|nba|ranking|nirf)\b/i },
  { intent: "prof_body",     pattern: /\b(ieee|iste|csi|professional body|chapter|professional society)\b/i },
  { intent: "club",          pattern: /\b(club|music|cultural|dance|drama|fest|techfest|activity|student club|technical club|coding club)\b/i },
  { intent: "admission",     pattern: /\b(admission|eamcet|rank|cutoff|seat|apply|application|eligibility|lateral entry|how to join|how to get)\b/i },
  { intent: "contact",       pattern: /\b(contact|phone|email|call|reach|number|helpline|support|enquiry|inquiry)\b/i },
  { intent: "location",      pattern: /\b(location|address|where|how to reach|directions|map|vizianagaram|dwarapudi|distance|km)\b/i },
  { intent: "about",         pattern: /\b(about|history|overview|tell me about|what is jntu|founded|established|affiliation|autonomous|constituent)\b/i },
  { intent: "faculty",       pattern: /\b(faculty|professor|lecturer|teacher|staff|assistant professor|associate professor)\b/i },
  { intent: "lab",           pattern: /\b(lab|laboratory|workshop|equipment|infrastructure|facility|computer lab|language lab)\b/i },
  { intent: "mou",           pattern: /\b(mou|memorandum|agreement|collaboration|tie.?up|partner)\b/i },
  { intent: "transport",     pattern: /\b(transport|bus|van|vehicle|commute|pick.?up|drop|route)\b/i },
  { intent: "stories",       pattern: /\b(story|stories|experience|campus life|student life|culture|life at|lifestyle|memories)\b/i },
  { intent: "projects",      pattern: /\b(project|projects|innovation|innovations|prototype|research project|student project|achievement)\b/i },
  { intent: "guesthouse",    pattern: /\b(guest.?house|staff.?quarter|visitor|stay|quarters)\b/i },
  { intent: "bank",          pattern: /\b(bank|atm|union bank|cash|money)\b/i },
  { intent: "canteen",       pattern: /\b(canteen|food|cafeteria|mess|eatery|snacks)\b/i },
  { intent: "certificates",  pattern: /\b(certificate|tc\b|transfer certificate|bonafide|conduct|marks memo|transcript)\b/i },
  { intent: "timings",       pattern: /\b(timing|timings|working hours|opening hours|college hours)\b/i },
  { intent: "alumni", pattern: /\b(alumni|alumnus|former\s*students?|passouts?|graduates?|passed outs?|networking|alumni\s*portal|alumni\s*network|alumni\s*community|old\s*students?|passed\s*out|alumni\s*association|alma\s*mater|ex-students?|ex\s*students?|[\u0C00-\u0C7F]*అలుమ్ని[\u0C00-\u0C7F]*|[\u0C00-\u0C7F]*పూర్వ\s*విద్యార్థి[\u0C00-\u0C7F]*|[\u0C00-\u0C7F]*గ్రాడ్యుయేట్[\u0C00-\u0C7F]*)\b/i }
];

export function detectIntents(query: string): Intent[] {
  const matched: Intent[] = [];
  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(query)) matched.push(intent);
  }
  return matched.length > 0 ? matched : ["unknown"];
}

// ─────────────────────────────────────────────
// 3. BM25-STYLE TERM FREQUENCY BOOSTING
// ─────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

const STOPWORDS = new Set([
  "the","and","for","are","was","were","this","that","with","have","from",
  "they","will","been","has","but","not","what","can","all","its","any",
  "how","our","their","who","which","about","tell","give","show","please",
  "want","need","know","get","would","could","should","does","did","some",
]);

function bm25Score(queryTokens: string[], docText: string, k1 = 1.5, b = 0.75, avgDocLen = 80): number {
  const docTokens = tokenize(docText);
  const docLen = docTokens.length;
  const freq: Record<string, number> = {};
  for (const t of docTokens) freq[t] = (freq[t] || 0) + 1;

  let score = 0;
  for (const qt of queryTokens) {
    if (STOPWORDS.has(qt)) continue;
    const tf = freq[qt] || 0;
    if (tf === 0) continue;
    const idf = Math.log(1 + 1 / (0.5 + tf));
    const num = tf * (k1 + 1);
    const den = tf + k1 * (1 - b + b * (docLen / avgDocLen));
    score += idf * (num / den);
  }
  return score;
}

export interface RankedChunk {
  content: string;
  source_type: string;
  metadata: any;
  similarity: number;
  bm25: number;
  hybridScore: number;
}

const SOURCE_BOOST_MAP: Partial<Record<Intent, string[]>> = {
  principal:     ["leadership"],
  vice_principal:["leadership"],
  vc:            ["leadership"],
  leadership:    ["leadership"],
  hod:           ["hod", "department", "faculty"],
  department:    ["department", "course", "hod"],
  hostel:        ["hostel"],
  library:       ["library"],
  placement:     ["placement", "recruiter", "placement_staff"],
  syllabus:      ["syllabus", "regulation", "academic_download"],
  timetable:     ["timetable"],
  exam:          ["exam_cell", "notice"],
  fee:           ["fee"],
  nss:           ["nss"],
  sports:        ["sports"],
  dispensary:    ["dispensary"],
  wec:           ["wec"],
  edc:           ["edc"],
  research:      ["rd_project", "rd_publication", "rd_scholar"],
  iqac:          ["iqac"],
  prof_body:     ["prof_body"],
  club:          ["student_club"],
  notice:        ["notice", "notification"],
  faculty:       ["faculty", "hod", "leadership"],
  lab:           ["laboratory"],
  mou:           ["mou", "iqac"],
  about:         ["site_content"],
  contact:       ["site_content", "leadership"],
  alumni: ["alumni", "student_corner", "stories_and_experiences"],
};

export function rerankChunks(chunks: any[], query: string, intents: Intent[]): RankedChunk[] {
  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));

  const boostedTypes = new Set<string>();
  for (const intent of intents) {
    for (const t of SOURCE_BOOST_MAP[intent] ?? []) boostedTypes.add(t);
  }

  return chunks
    .map((chunk) => {
      const sim = parseFloat(chunk.similarity ?? "0") || 0;
      const bm25 = bm25Score(queryTokens, chunk.content);
      const typeBoost = boostedTypes.has(chunk.source_type) ? 0.30 : 0;
      const hybridScore = sim * 0.50 + (bm25 / 10) * 0.40 + typeBoost;
      return { ...chunk, bm25, hybridScore } as RankedChunk;
    })
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, 12);
}

// ─────────────────────────────────────────────
// 4. METADATA / LINK EXTRACTION HELPERS
// ─────────────────────────────────────────────

function extractLinks(chunks: RankedChunk[]): Array<{ title: string; url: string }> {
  const links: Array<{ title: string; url: string }> = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = mdLinkRe.exec(chunk.content)) !== null) {
      if (!seen.has(m[2])) { links.push({ title: m[1], url: m[2] }); seen.add(m[2]); }
    }
    const rawUrlRe = /https?:\/\/[^\s)>"]+/g;
    while ((m = rawUrlRe.exec(chunk.content)) !== null) {
      if (!seen.has(m[0])) { links.push({ title: "Download", url: m[0] }); seen.add(m[0]); }
    }
  }
  return links;
}

function extractText(chunks: RankedChunk[], maxChars = 2000): string {
  return chunks.map((c) => c.content.trim()).join("\n\n").slice(0, maxChars);
}

function relevantSentences(chunks: RankedChunk[], keywords: string[], limit = 6): string {
  const kws = keywords.map((k) => k.toLowerCase());
  const sentences: string[] = [];
  for (const chunk of chunks) {
    const sents = chunk.content.split(/(?<=[.!?])\s+/);
    for (const s of sents) {
      const sl = s.toLowerCase();
      if (kws.some((k) => sl.includes(k)) && s.trim().length > 15) {
        if (!sentences.includes(s.trim())) {
          sentences.push(s.trim());
          if (sentences.length >= limit) return sentences.join(" ");
        }
      }
    }
  }
  return sentences.join(" ").trim();
}

function linkify(links: Array<{ title: string; url: string }>): string {
  return links.map((l) => `• [${l.title}](${l.url})`).join("\n");
}

// ─────────────────────────────────────────────
// 5. STATIC KNOWLEDGE BASE (Instant Answers)
// ─────────────────────────────────────────────

const KB = {
  college: {
    name: "JNTU-GV College of Engineering Vizianagaram (JNTU-GV CEV)",
    affiliation: "Constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram",
    address: "Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India",
    phone: "+91 8922 244 100",
    email: "principal@jntugvcev.edu.in",
    website: "",
  },
  university: {
    name: "Jawaharlal Nehru Technological University Gurajada Vizianagaram (JNTU-GV)",
    vc: "Prof. K. Venkata Subbaiah (Hon'ble Vice Chancellor)",
    registrar: "Prof. G. Jaya Suma (Registrar)",
    email: "registrar@jntugv.edu.in",
  },
  principal: {
    name: "Dr. V. S. Vakula",
    designation: "Principal",
    email: "principal@jntugvcev.edu.in",
  },
  vicePrincipal: {
    name: "Prof. G. J. Naga Raju",
    designation: "Vice Principal",
    email: "viceprincipal@jntugvcev.edu.in",
  },
  departments: [
    "Computer Science & Engineering (CSE)",
    "Information Technology (IT)",
    "Electronics & Communication Engineering (ECE)",
    "Electrical & Electronics Engineering (EEE)",
    "Mechanical Engineering (MECH)",
    "Metallurgical Engineering (MET)",
    "Basic Sciences & Humanities (BSH / S&H)",
    "Master of Business Administration (MBA)",
  ],
  hods: [
    { code: "CSE", name: "Dr. R. Rajeswara Rao", dept: "Computer Science & Engineering", designation: "Professor & HOD", email: "hod.cse@jntugvcev.edu.in" },
    { code: "ECE", name: "Dr. K. Babulu", dept: "Electronics & Communication Engineering", designation: "Professor & HOD", email: "hod.ece@jntugvcev.edu.in" },
    { code: "EEE", name: "Dr. K. Sri Kumar", dept: "Electrical & Electronics Engineering", designation: "Professor & HOD", email: "hod.eee@jntugvcev.edu.in" },
    { code: "MECH", name: "Dr. R. Umamaheswara Rao", dept: "Mechanical Engineering", designation: "Professor & HOD", email: "hod.me@jntugvcev.edu.in" },
    { code: "MET", name: "Dr. G. Swami Naidu", dept: "Metallurgical Engineering", designation: "Professor & HOD", email: "hod.met@jntugvcev.edu.in" },
    { code: "IT", name: "Dr. P. Aruna Kumari", dept: "Information Technology", designation: "Professor & HOD", email: "hod.it@jntugvcev.edu.in" },
    { code: "BSH", name: "Dr. G. J. Naga Raju", dept: "Basic Sciences & Humanities (S&H)", designation: "Professor & HOD", email: "hod.bs@jntugvcev.edu.in" },
    { code: "MBA", name: "Dr. K. V. S. M. Ramanesh", dept: "Master of Business Administration", designation: "Professor & HOD", email: "hod.mba@jntugvcev.edu.in" },
  ],
  faculty: [
    { name: "Prof. G. Jaya Suma", designation: "Professor of CSE & Registrar JNTU-GV", department: "Computer Science & Engineering", email: "registrar@jntugv.edu.in" },
    { name: "Dr. P. Ramakrishna", designation: "Professor of CSE", department: "Computer Science & Engineering", email: "ramakrishna.cse@jntugvcev.edu.in" },
    { name: "Dr. S. V. Narayana", designation: "Associate Professor of ECE", department: "Electronics & Communication Engineering", email: "svnarayana.ece@jntugvcev.edu.in" },
    { name: "Dr. K. Srinivasa Rao", designation: "Professor of Mechanical Engineering", department: "Mechanical Engineering", email: "srinivasarao.me@jntugvcev.edu.in" },
  ],
  regulations: ["R20", "R23", "R25"],
};

// ─────────────────────────────────────────────
// 6. ANSWER BUILDER
// ─────────────────────────────────────────────

function buildAnswer(
  intents: Intent[],
  query: string,
  chunks: RankedChunk[],
  lang: "telugu" | "tenglish" | "english"
): string {
  const links = extractLinks(chunks);
  const ctxText = extractText(chunks);
  const hasCtx = ctxText.trim().length > 20;
  const isTe = lang === "telugu";
  const isTenglish = lang === "tenglish";
  const primary = intents[0];

  const rel = (kws: string[], n = 6) => relevantSentences(chunks, kws, n);
  const linksFor = (...terms: string[]) =>
    links.filter((l) => terms.some((t) => l.url.toLowerCase().includes(t)));

  // ── GREETING ──
  if (primary === "greeting") {
    if (isTe)  return "నమస్కారం! 🙏 నేను JNTU AI — మీ స్మార్ట్ కాంపస్ సహాయకుడు. విభాగాలు, హాస్టల్, ఫీజులు, పరీక్షలు — అన్నింటి గురించి అడగండి! 😊";
    if (isTenglish) return "Hello! 👋 Nenu JNTU AI — mee campus guide. Departments, hostel, fees, exams gurinchi adugandi! 😊";
    return "Hi! 👋 I'm **JNTU AI**, your smart campus companion. Ask me about departments, admissions, hostel, fees, exams, placements and more! 😊";
  }

  // ── FAREWELL ──
  if (primary === "farewell") {
    if (isTe) return "వెళ్ళి రండి! 😊 ఏదైనా అడగాలంటే, నేను ఇక్కడ ఉన్నాను!";
    return "Goodbye! 😊 Feel free to come back whenever you need help. All the best!";
  }

  // ── THANKS ──
  if (primary === "thanks") {
    if (isTe) return "మీకు ఉపయోగపడినందుకు సంతోషంగా ఉంది! 😊 ఇంకా ఏదైనా అడగండి!";
    return "You're most welcome! 😊 Happy to help anytime!";
  }

  // ── VC & REGISTRAR ──
  if (intents.includes("vc")) {
    return `**University Leadership (JNTU-GV)** 🏛️\n\n• **Vice Chancellor**: ${KB.university.vc}\n• **Registrar**: ${KB.university.registrar} — [${KB.university.email}](mailto:${KB.university.email})\n\n📍 JNTU-GV Campus, Vizianagaram`;
  }

  // ── PRINCIPAL ──
  if (intents.includes("principal") && !intents.includes("vice_principal")) {
    const extra = rel(["principal", "dr", "vakula"]);
    if (isTe) return `మా కళాశాల ప్రిన్సిపల్ **${KB.principal.name}** గారు (${KB.principal.designation}).\n📧 ${KB.principal.email}${extra ? `\n\n${extra}` : ""}`;
    return `The Principal of JNTU-GV CEV is **${KB.principal.name}** (${KB.principal.designation}).\n📧 Email: [${KB.principal.email}](mailto:${KB.principal.email})${extra ? `\n\n${extra}` : ""}`;
  }

  // ── VICE PRINCIPAL ──
  if (intents.includes("vice_principal")) {
    if (isTe) return `మా వైస్ ప్రిన్సిపల్ **${KB.vicePrincipal.name}** గారు (${KB.vicePrincipal.designation}).\n📧 ${KB.vicePrincipal.email}`;
    return `The Vice Principal is **${KB.vicePrincipal.name}** (${KB.vicePrincipal.designation}).\n📧 [${KB.vicePrincipal.email}](mailto:${KB.vicePrincipal.email})`;
  }

  // ── LEADERSHIP ──
  if (intents.includes("leadership")) {
    const extra = rel(["principal", "vice", "governing", "administration"]);
    return `**JNTU-GV CEV Leadership** 🏛️\n\n• **Principal**: ${KB.principal.name} — [${KB.principal.email}](mailto:${KB.principal.email})\n• **Vice Principal**: ${KB.vicePrincipal.name} — [${KB.vicePrincipal.email}](mailto:${KB.vicePrincipal.email})\n• **Registrar**: ${KB.university.registrar}${extra ? `\n\n${extra}` : ""}`;
  }

  // ── HOD ──
  if (intents.includes("hod")) {
    const qLower = query.toLowerCase();

    const deptMatch =
      /(\bit\b|information technology)/i.test(qLower) ? KB.hods.find(h => h.code === "IT") :
      /(\bcse\b|computer science)/i.test(qLower) ? KB.hods.find(h => h.code === "CSE") :
      /(\bece\b|electronics)/i.test(qLower) ? KB.hods.find(h => h.code === "ECE") :
      /(\beee\b|electrical)/i.test(qLower) ? KB.hods.find(h => h.code === "EEE") :
      /(\bmech\b|mechanical)/i.test(qLower) ? KB.hods.find(h => h.code === "MECH") :
      /(\bmet\b|metallurg)/i.test(qLower) ? KB.hods.find(h => h.code === "MET") :
      /(\bbsh\b|s&h|sciences|humanities)/i.test(qLower) ? KB.hods.find(h => h.code === "BSH") :
      /(\bmba\b|business)/i.test(qLower) ? KB.hods.find(h => h.code === "MBA") :
      null;

    if (deptMatch) {
      if (isTe) {
        return `**${deptMatch.dept} (${deptMatch.code})** విభాగాధిపతి (HOD):\n\n👨‍🏫 **${deptMatch.name}** (${deptMatch.designation})\n📧 Email: ${deptMatch.email}\n📍 Department of ${deptMatch.dept}, JNTU-GV CEV`;
      }
      return `Head of Department (HOD) of **${deptMatch.dept} (${deptMatch.code})**:\n\n👨‍🏫 **${deptMatch.name}** (${deptMatch.designation})\n📧 Email: [${deptMatch.email}](mailto:${deptMatch.email})\n📍 Department of ${deptMatch.dept}, JNTU-GV CEV`;
    }

    const hodList = KB.hods.map((h) => `• **${h.code}** (${h.dept}): **${h.name}** — [${h.email}](mailto:${h.email})`).join("\n");
    if (isTe) return `**JNTU-GV CEV విభాగాధిపతులు (HODs)** 👨‍🏫\n\n${hodList}`;
    return `**JNTU-GV CEV Heads of Department (HODs)** 👨‍🏫\n\n${hodList}\n\n🌐 For details, visit [Academics → Faculty](${KB.college.website}/academics/faculty)`;
  }

  // ── ALUMNI ──
if (intents.includes("alumni")) {
  const isTe = lang === "telugu";
  const isTenglish = lang === "tenglish";
  
  // Get alumni info from KB
  const alumniPortal = "https://alumni.jntugv.edu.in";
  
  // Check if query asks for "how to connect" or "register"
  const qLower = query.toLowerCase();
  const wantsHowTo = /how|connect|register|join|access|way|process/i.test(qLower);
  
  let response = "";
  
  if (isTe) {
    response = `**అలుమ్ని పోర్టల్** 🎓\n\nJNTU-GV విశ్వవిద్యాలయం యొక్క అధికారిక అలుమ్ని పోర్టల్:\n\n🔗 **${alumniPortal}**\n\nఇక్కడ మీరు:\n• రిజిస్టర్ చేసుకోవచ్చు\n• ప్రొఫైల్ అప్డేట్ చేసుకోవచ్చు\n• సహ విద్యార్థులతో కనెక్ట్ అవ్వవచ్చు\n• మెంటర్షిప్ అవకాశాలు పొందవచ్చు\n• క్యాంపస్ ఈవెంట్లలో పాల్గొనవచ్చు\n\n🌐 [Visit Alumni Portal](${alumniPortal})`;
    if (wantsHowTo) {
      response += `\n\n**ఎలా రిజిస్టర్ చేసుకోవాలి?**\n1. పోర్టల్ లింక్ క్లిక్ చేయండి\n2. 'Register' బటన్ క్లిక్ చేయండి\n3. మీ విద్యార్థి వివరాలు నింపండి\n4. ఓటీపీ ద్వారా వెరిఫై చేయండి\n5. ప్రొఫైల్ పూర్తి చేయండి`;
    }
  } else if (isTenglish) {
    response = `**Alumni Portal** 🎓\n\nOfficial JNTU-GV Alumni Portal:\n\n🔗 **${alumniPortal}**\n\nikkada meeru:\n• Register chesukovachu\n• Profile update cheyochu\n• Fellow alumni tho connect avvachu\n• Mentorship opportunities ponda vachu\n• Campus events lo participate cheyochu\n\n🌐 [Visit Alumni Portal](${alumniPortal})`;
    if (wantsHowTo) {
      response += `\n\n**Elanti register chesukovali?**\n1. Portal link click cheyyandi\n2. 'Register' button click cheyyandi\n3. Student details fill cheyyandi\n4. OTP dwara verify cheyyandi\n5. Profile complete cheyyandi`;
    }
  } else {
    response = `**JNTU-GV Alumni Portal** 🎓\n\nThe official alumni platform for JNTU-GV College of Engineering Vizianagaram:\n\n🔗 **${alumniPortal}**\n\n**What you can do on the alumni portal:**\n• **Register & Update Profile**: Stay connected with your alma mater\n• **Networking**: Connect with fellow graduates and seniors\n• **Mentorship**: Guide current students and seek career advice\n• **Events**: Participate in campus events and alumni meets\n• **Career Support**: Access job opportunities and industry connections\n\n**How to get started:**\n1. Visit [${alumniPortal}](${alumniPortal})\n2. Click on 'Register' / 'Sign Up'\n3. Fill in your student details\n4. Verify via OTP\n5. Complete your profile and start connecting!`;
    
    if (wantsHowTo) {
      response += `\n\n**Quick Registration Steps:**\n✅ Step 1: Go to ${alumniPortal}\n✅ Step 2: Click Register\n✅ Step 3: Enter your roll number and email\n✅ Step 4: OTP verification\n✅ Step 5: Create your profile`;
    }
  }
  
  return response;
}
  // ── DEPARTMENTS ──
  if (intents.includes("department")) {
    const extra = rel(["seats", "intake", "department", "branch", "offered"]);
    const list = KB.departments.map((d, i) => `${i + 1}. ${d}`).join("\n");
    if (isTe) return `JNTU-GV CEV లో **${KB.departments.length} విభాగాలు** ఉన్నాయి 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    if (isTenglish) return `JNTU-GV CEV lo **${KB.departments.length} departments** unnaayi 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
    return `JNTU-GV CEV offers **${KB.departments.length} departments** 🎓\n\n${list}${extra ? `\n\n${extra}` : ""}`;
  }

  // ── SYLLABUS ──
  if (intents.includes("syllabus")) {
    const qLower = query.toLowerCase();

    // Extract regulation
    const regMatch = qLower.match(/r(25|23|20|19|16|13)/i);
    const reg = regMatch ? regMatch[0].toUpperCase() : null;

    // Extract department
    const deptMatch =
      /\b(cse|computer science)\b/i.test(qLower) ? "CSE" :
      /\b(ece|electronics)\b/i.test(qLower) ? "ECE" :
      /\b(eee|electrical)\b/i.test(qLower) ? "EEE" :
      /\b(mech|mechanical)\b/i.test(qLower) ? "MECH" :
      /\b(met|metallurg|metallurgical)\b/i.test(qLower) ? "MET" :
      /\b(it|information technology)\b/i.test(qLower) ? "IT" :
      /\b(civil)\b/i.test(qLower) ? "CIVIL" :
      /\b(mba|business)\b/i.test(qLower) ? "MBA" :
      /\b(mca|computer applications)\b/i.test(qLower) ? "MCA" :
      null;

    // Master list of syllabus records
    const syllabusItems: Array<{ subject: string; reg: string; branch: string; year: string; pdf: string }> = [
      { subject: "CSE R23 B.Tech Syllabus", reg: "R23", branch: "CSE", year: "1st to 4th Year", pdf: "/uploads/2023/10/CSE-finalR23.pdf" },
      { subject: "ECE R23 1st Year Syllabus", reg: "R23", branch: "ECE", year: "1st Year", pdf: "/uploads/2023/10/ECE-finalR23.pdf" },
      { subject: "ECE R23 2nd Year Syllabus", reg: "R23", branch: "ECE", year: "2nd Year", pdf: "/uploads/2024/07/Approved-R23-JNTUGV-CEV-ECE-Course-Structure-total-Second-Year-Syllabus.-.pdf" },
      { subject: "ECE R23 3rd & 4th Year Syllabus", reg: "R23", branch: "ECE", year: "3rd & 4th Year", pdf: "/uploads/2025/07/R23-III-IV-Course-structure-and-syllabus-with-honors-and-Minors.pdf" },
      { subject: "EEE R23 Syllabus", reg: "R23", branch: "EEE", year: "1st to 4th Year", pdf: "/uploads/2025/08/JNTUGV-CEV-A-R23-EEE-IV-Years-SYLLABUS-combined-1.pdf" },
      { subject: "IT R23 Course Structure & Syllabus", reg: "R23", branch: "IT", year: "1st to 4th Year", pdf: "/uploads/2025/09/R23DepartmentofITCourseStructureandSyllabus1stYearto4thYear-compressed-1.pdf" },
      { subject: "Civil Engineering R23 Syllabus", reg: "R23", branch: "CIVIL", year: "1st to 4th Year", pdf: "/uploads/2023/10/civilfinalR23-1.pdf" },
      { subject: "Metallurgy R23 Syllabus", reg: "R23", branch: "MET", year: "1st to 4th Year", pdf: "/uploads/2025/08/R23-ME-B.Tech-4-years-CS-SYLLABUS-1.pdf" },
      { subject: "Mechanical Engineering R23 Syllabus", reg: "R23", branch: "MECH", year: "1st to 4th Year", pdf: "/uploads/2023/10/ME-finalR23.pdf" },
      
      { subject: "CSE R20 B.Tech Syllabus", reg: "R20", branch: "CSE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-CSE-SYLLABUS.pdf" },
      { subject: "ECE R20 B.Tech Syllabus", reg: "R20", branch: "ECE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-ECE-SYLLABUS.pdf" },
      { subject: "EEE R20 B.Tech Syllabus", reg: "R20", branch: "EEE", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-EEE-SYLLABUS.pdf" },
      { subject: "MECH R20 B.Tech Syllabus", reg: "R20", branch: "MECH", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-ME-SYLLABUS.pdf" },
      { subject: "MET R20 B.Tech Syllabus", reg: "R20", branch: "MET", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-MET-SYLLABUS.pdf" },
      { subject: "IT R20 B.Tech Syllabus", reg: "R20", branch: "IT", year: "1st to 4th Year", pdf: "/uploads/2021/04/R20-B.TECH-IT-SYLLABUS.pdf" },

      { subject: "M.Tech IT R25 Syllabus", reg: "R25", branch: "IT", year: "1st & 2nd Year", pdf: "/uploads/2025/12/R25_M.Tech_ITDS.pdf" },
      { subject: "MCA R25 Syllabus", reg: "R25", branch: "MCA", year: "1st & 2nd Year", pdf: "/uploads/2025/11/JNTUGV_R25_MCA_Syllabus-Course-structure.pdf" },
      { subject: "MBA R25 Syllabus", reg: "R25", branch: "MBA", year: "1st & 2nd Year", pdf: "/uploads/2025/12/MBA-R25-Syllabus.pdf" },
    ];

    // Supplement items from incoming RAG chunks if available
    for (const chunk of chunks) {
      if (chunk.source_type === "syllabus" && chunk.metadata?.pdf_url) {
        const p = chunk.metadata.pdf_url;
        if (!syllabusItems.some(i => i.pdf === p)) {
          syllabusItems.push({
            subject: chunk.content.split(".")[0].replace(/^Syllabus:\s*/i, ""),
            reg: chunk.metadata.regulation || "R23",
            branch: (chunk.metadata.branch || "CSE").toUpperCase(),
            year: chunk.metadata.academic_year || "All Years",
            pdf: p
          });
        }
      }
    }

    // SCENARIO 1: Neither Regulation NOR Department specified
    if (!reg && !deptMatch) {
      return `**Course Syllabus Assistant** 📄\n\nWhich regulation and department syllabus would you like to view?\n\n• **Regulations**: R23, R20, R19, R16, R25 (PG)\n• **Departments**: CSE, ECE, EEE, MECH, MET, IT, Civil, MBA, MCA\n\nClick one of the suggestion chips below, or filter online at [Academics → Syllabus](/academics/syllabus).`;
    }

    // SCENARIO 2: Regulation specified, but NO Department specified
    if (reg && !deptMatch) {
      const regItems = syllabusItems.filter(item => item.reg.toUpperCase() === reg);
      let resp = `**${reg} Academic Syllabus** 📄\n\nHere are the available syllabus courses for **${reg} Regulation**:\n\n`;
      if (regItems.length > 0) {
        resp += regItems.map(item => `• **${item.branch}** (${item.year}): [Download PDF](${item.pdf})`).join("\n");
      } else {
        resp += `No specific ${reg} syllabus files are currently uploaded. You can view all regulations on [Academics → Regulations](/academics/regulations).`;
      }
      resp += `\n\nWhich department do you need? Select a department chip below or view all at [Academics → Syllabus](/academics/syllabus).`;
      return resp;
    }

    // SCENARIO 3: Department specified, but NO Regulation specified
    if (!reg && deptMatch) {
      const deptItems = syllabusItems.filter(item => item.branch.toUpperCase() === deptMatch);
      let resp = `**${deptMatch} Department Syllabus** 📄\n\nHere are the available syllabus records for **${deptMatch}** department:\n\n`;
      if (deptItems.length > 0) {
        resp += deptItems.map(item => `• **${item.reg} Regulation** (${item.year}): [Download PDF](${item.pdf})`).join("\n");
      } else {
        resp += `Visit the main [Academics → Syllabus](/academics/syllabus) page to view all available syllabus documents for ${deptMatch}.`;
      }
      resp += `\n\nWhich regulation do you need? Select a regulation chip below.`;
      return resp;
    }

    // SCENARIO 4: BOTH Regulation AND Department specified
    if (reg && deptMatch) {
      const exactMatches = syllabusItems.filter(item => item.reg.toUpperCase() === reg && item.branch.toUpperCase() === deptMatch);
      if (exactMatches.length > 0) {
        let resp = `**${deptMatch} ${reg} Syllabus Information** 📄\n\n`;
        resp += exactMatches.map(item => `• **${item.subject}** (${item.year}):\n  👉 [Download PDF](${item.pdf})`).join("\n\n");
        resp += `\n\n🌐 View full interactive syllabus list: [Academics → Syllabus](/academics/syllabus)`;
        return resp;
      }
      return `**${deptMatch} ${reg} Syllabus** 📄\n\nWe don't have a specific PDF uploaded for ${deptMatch} under ${reg} regulation yet.\n\n🌐 Check all available syllabus documents on [Academics → Syllabus](/academics/syllabus) or regulations on [Academics → Regulations](/academics/regulations).`;
    }
  }

  // ── TIMETABLE ──
  if (intents.includes("timetable")) {
    const relInfo = rel(["timetable", "schedule", "time", "class", "lecture"], 6);
    const ttLinks = linksFor("timetable", "schedule");
    let resp = `**Class Timetables** 🕒\n\n${relInfo || "Class and exam timetables are published prior to each semester."}`;
    resp += ttLinks.length > 0 ? `\n\n**Downloads:**\n${linkify(ttLinks)}` : `\n\n📂 [Timetables Page](${KB.college.website}/academics/timetables)`;
    return resp;
  }

  // ── EXAM / RESULTS ──
  if (intents.includes("exam")) {
    const relInfo = rel(["exam", "result", "date", "schedule", "revaluation", "hall ticket"], 6);
    const examLinks = linksFor("exam", "result", "hall", "notification");
    let resp = `**Examination & Results** 📝\n\n${relInfo || "Internal mid-term exams and end-semester university examinations are conducted as per academic calendar."}`;
    resp += examLinks.length > 0 ? `\n\n**Links:**\n${linkify(examLinks)}` : `\n\n📂 [Examination Cell](${KB.college.website}/academics/examination)`;
    return resp;
  }

  // ── HOSTEL ──
  if (intents.includes("hostel")) {
    const relInfo = rel(["hostel", "warden", "mess", "room", "fee", "accommodation", "boys", "girls"], 7);
    return `**Hostel Information** 🏠\n\n${relInfo || "JNTU-GV CEV has separate on-campus hostels for boys and girls with 24/7 security, Wi-Fi, and dining mess."}\n\n📞 Contact: ${KB.college.phone}`;
  }

  // ── PLACEMENT ──
  if (intents.includes("placement")) {
    const relInfo = rel(["placement", "package", "lpa", "company", "recruit", "offer", "tpo", "campus"], 8);
    const pLinks = linksFor("placement", "recruit");
    return `**Placements at JNTU-GV CEV** 🏢\n\n${relInfo || "Top recruiters include TCS, Infosys, Wipro, Accenture, Cognizant, and core engineering companies."}\n\n${pLinks.length > 0 ? linkify(pLinks.slice(0, 3)) : `🌐 [Training & Placements](${KB.college.website}/placements/students)`}`;
  }

  // ── FEE ──
  if (intents.includes("fee")) {
    const relInfo = rel(["fee", "tuition", "semester", "annual", "scholarship", "payment", "amount"], 7);
    const fLinks = linksFor("fee", "scholarship");
    return `**Fee Structure & Scholarships** 💰\n\n${relInfo || `Government fee reimbursement (Jagananna Vidya Deevena) is applicable for eligible students.\n\n📞 Office Helpline: ${KB.college.phone}`}${fLinks.length > 0 ? `\n\n${linkify(fLinks.slice(0, 3))}` : ""}`;
  }

  // ── GUESTHOUSE & AMENITIES ──
  if (intents.includes("guesthouse")) {
    const relInfo = rel(["guest", "house", "quarter", "stay", "visitor", "accommodation"], 6);
    return `**Guest House & Staff Quarters** 🏨\n\n${relInfo || "JNTU-GV CEV provides guest house accommodation for visiting dignitaries and comfortable staff quarters on campus."}\n\n🌐 [Facilities → Guest House](${KB.college.website}/other-amenities/guest-house)`;
  }

  // ── BANK & ATM ──
  if (intents.includes("bank")) {
    return `**Bank & ATM Facilities** 🏦\n\nUnion Bank of India (formerly Andhra Bank) operates an on-campus branch and 24/7 ATM facility inside JNTU-GV CEV campus for students and staff.`;
  }

  // ── CANTEEN ──
  if (intents.includes("canteen")) {
    return `**Campus Canteen & Cafeteria** 🍽️\n\nA spacious hygiene-certified campus canteen provides fresh breakfast, meals, snacks, and beverages at affordable prices throughout the day.`;
  }

  // ── CERTIFICATES & TC ──
  if (intents.includes("certificates")) {
    return `**Certificates & Student Documents** 📜\n\nFor Transfer Certificate (TC), Bonafide Certificate, Conduct Certificate, or Grade Memos, submit an application to the Academic Section / Principal's Office.\n\n📞 Office Phone: ${KB.college.phone}`;
  }

  // ── TIMINGS ──
  if (intents.includes("timings")) {
    return `**College & Office Timings** ⏰\n\n• **Class Timings**: 9:30 AM – 4:30 PM (Mon – Sat)\n• **Administrative Office**: 10:00 AM – 5:00 PM\n• **Library**: 8:00 AM – 8:00 PM`;
  }

  // ── FACULTY ──
  if (intents.includes("faculty")) {
    const qLower = query.toLowerCase();
    const allPeople = [
      { name: "Dr. V. S. Vakula", designation: "Principal", department: "Principal Office", email: "principal@jntugvcev.edu.in" },
      { name: "Prof. G. J. Naga Raju", designation: "Vice Principal & HOD of S&H", department: "Basic Sciences & Humanities", email: "viceprincipal@jntugvcev.edu.in" },
      ...KB.hods.map(h => ({ name: h.name, designation: h.designation, department: h.dept, email: h.email })),
      ...KB.faculty,
    ];

    const matchedPerson = allPeople.find(p => {
      const parts = p.name.toLowerCase().replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.)\s*/, "").split(/\s+/);
      return parts.some(part => part.length > 3 && qLower.includes(part));
    });

    if (matchedPerson) {
      return `👨‍🏫 **Faculty Profile**: **${matchedPerson.name}**\n\n• **Designation**: ${matchedPerson.designation}\n• **Department**: ${matchedPerson.department}\n• **Email**: [${matchedPerson.email}](mailto:${matchedPerson.email})\n\n🌐 View directory: [Academics → Faculty](${KB.college.website}/academics/faculty)`;
    }

    const relInfo = rel(["faculty", "professor", "hod", "staff", "lecturer", "assistant", "associate"], 7);
    return `**Faculty Directory & Information** 👨‍🏫\n\n${relInfo || "Experienced faculty members with Ph.D. degrees and industrial exposure across all engineering branches."}\n\n🌐 [Academics → Faculty Directory](${KB.college.website}/academics/faculty)`;
  }

  // ── LOCATION ──
  if (intents.includes("location")) {
    const extra = rel(["dwarapudi", "vizianagaram", "km", "bus", "train", "route"]);
    return `**How to Reach JNTU-GV CEV** 📍\n\n📍 ${KB.college.address}\n• **From Vizianagaram Railway Station**: ~7 km\n• **From RTC Bus Stand**: ~6 km${extra ? `\n\n${extra}` : ""}\n\n🗺️ [View on Google Maps](https://maps.google.com/?q=JNTU+GV+College+of+Engineering+Vizianagaram)`;
  }

  // ── CONTACT ──
  if (intents.includes("contact")) {
    return `**Contact JNTU-GV CEV** 📞\n\n📍 ${KB.college.address}\n📞 Phone: ${KB.college.phone}\n📧 Email: [${KB.college.email}](mailto:${KB.college.email})\n🌐 Website: [jntugvcev.edu.in](${KB.college.website})`;
  }

  // ── ABOUT ──
  if (intents.includes("about")) {
    const extra = rel(["established", "founded", "history", "vision", "mission", "constituent", "autonomous"]);
    return `**About ${KB.college.name}** 🏛️\n\nA ${KB.college.affiliation}. Campus spans over 100 acres in Dwarapudi, Vizianagaram.\n${extra ? `\n${extra}` : ""}\n\n🌐 [About Institution](${KB.college.website}/about/institution)`;
  }

  // ── COMPREHENSIVE RAG EXTRACTION FOR ANY OTHER QUESTION ──
  if (hasCtx) {
    const qTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
    const extracted = rel(qTokens, 8);
    let resp = extracted || ctxText.slice(0, 900);
    if (links.length > 0) {
      resp += `\n\n**Relevant Links & Resources:**\n${linkify(links.slice(0, 4))}`;
    }
    return resp;
  }

  // ── GENERAL COLLEGE INFORMATION FALLBACK ──
  return `**JNTU-GV College of Engineering Vizianagaram** 🏛️\n\nI am here to assist with any information about JNTU-GV CEV departments, faculty, admissions, hostels, fee structures, examinations, and placements.\n\n📞 Phone: ${KB.college.phone}\n📧 Email: [${KB.college.email}](mailto:${KB.college.email})\n🌐 Website: [jntugvcev.edu.in](${KB.college.website})`;
}

// ─────────────────────────────────────────────
// 7. MAIN ENTRY POINT
// ─────────────────────────────────────────────

export interface ChatbotEngineInput {
  query: string;
  chunks: any[];
}

export function runChatbotEngine({ query, chunks }: ChatbotEngineInput): string {
  const lang = detectLanguage(query);
  const intents = detectIntents(query);
  const ranked = rerankChunks(chunks, query, intents);
  return buildAnswer(intents, query, ranked, lang);
}
