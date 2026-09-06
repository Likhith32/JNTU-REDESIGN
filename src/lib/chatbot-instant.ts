/**
 * JNTU AI — Client-Side Instant Response Engine
 * ──────────────────────────────────────────────
 * Intercepts common conversational queries BEFORE they hit the server.
 * Returns instant responses for greetings, identity, thanks, jokes,
 * and off-topic questions. Campus-specific queries pass through to
 * the full RAG pipeline on the server.
 *
 * Architecture:
 *   User message
 *     → normalize(text)
 *     → tryExactPatternMatch()
 *     → tryFuzzyMatch()
 *     → isIrrelevantQuestion()
 *     → null (pass to server)
 */

// ─────────────────────────────────────────────
// 1. TEXT NORMALIZATION
// ─────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // strip punctuation
    .replace(/\s+/g, " ")    // collapse whitespace
    // Common internet shorthand → full words
    .replace(/\bu\b/g, "you")
    .replace(/\br\b/g, "are")
    .replace(/\bhw\b/g, "how")
    .replace(/\bur\b/g, "your")
    .replace(/\bpls\b/g, "please")
    .replace(/\bplz\b/g, "please")
    .replace(/\bthx\b/g, "thanks")
    .replace(/\bthnx\b/g, "thanks")
    .replace(/\bthnks\b/g, "thanks")
    .replace(/\bty\b/g, "thank you")
    .replace(/\bwht\b/g, "what")
    .replace(/\bwhr\b/g, "where")
    .replace(/\bwhn\b/g, "when")
    .replace(/\bbt\b/g, "but")
    .replace(/\bhi+\b/g, "hi")
    .replace(/\bhelo+\b/g, "hello")
    .replace(/\bhllo\b/g, "hello")
    .replace(/\bgm\b/g, "good morning")
    .replace(/\bge\b/g, "good evening")
    .replace(/\bgn\b/g, "good night")
    .replace(/\bk\b/g, "ok")
    .replace(/\bok+\b/g, "ok")
    .trim();
}

// ─────────────────────────────────────────────
// 2. FUZZY MATCHING (Levenshtein Distance)
// ─────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

// ─────────────────────────────────────────────
// 3. COMMON CONVERSATION PATTERNS
// ─────────────────────────────────────────────

interface ConversationEntry {
  patterns: string[];
  responses: string[]; // Multiple variants for natural feel
}

const COMMON_CONVERSATIONS: Record<string, ConversationEntry> = {
  greeting: {
    patterns: [
      "hi", "hello", "hey", "good morning", "good evening", "good afternoon",
      "good night", "namaste", "namaskar", "howdy", "sup", "yo", "whats up",
      "wassup", "hii", "hiii",
    ],
    responses: [
      "Hello! 👋 I'm **JNTU AI**, your Smart Campus Companion. How can I help you with JNTU-GV today?",
      "Hey there! 👋 I'm **JNTU AI**. Ask me about exams, syllabus, departments, hostel, placements, or anything JNTU-GV related!",
      "Hi! 😊 Welcome to **JNTU AI**. I can help you with notifications, academics, campus info, and more. What do you need?",
    ],
  },

  who_are_you: {
    patterns: [
      "who are you", "what are you", "tell me about yourself",
      "introduce yourself", "who is this", "what is your name",
      "who made you", "what can you do", "whats your name",
      "what are you doing", "who built you", "who created you",
      "your name", "are you a bot", "are you ai", "are you human",
      "who is jntu ai",
    ],
    responses: [
      "I'm **JNTU AI** 🤖, your Smart Campus Companion for **JNTU-GV College of Engineering Vizianagaram**!\n\nI can help you with:\n• 📄 Syllabus & Regulations (R23, R20, R25)\n• 📝 Exam timetables & results\n• 🏠 Hostel & fee information\n• 👨‍🏫 Faculty & HOD details\n• 🏢 Placements & campus life\n• 📢 Latest notifications\n\nJust ask me anything about JNTU-GV! 😊",
    ],
  },

  how_are_you: {
    patterns: [
      "how are you", "how are you doing", "how is it going",
      "how do you do", "hows everything", "how you doing",
      "are you ok", "are you fine", "you good", "you okay",
    ],
    responses: [
      "I'm doing great, thank you! 😊 I'm here 24/7 to help you with JNTU-GV information. What would you like to know?",
      "I'm always ready to help! 💪 Ask me anything about exams, syllabus, departments, hostel, or campus life at JNTU-GV!",
    ],
  },

  thanks: {
    patterns: [
      "thanks", "thank you", "thank you so much", "thanks a lot",
      "thanks a ton", "thanks a bunch", "much appreciated",
      "appreciate it", "great help", "very helpful",
      "dhanyavaadalu", "dhanyavadalu",
    ],
    responses: [
      "You're welcome! 😊 Feel free to ask if you need anything else about JNTU-GV!",
      "Happy to help! 😊 Don't hesitate to reach out again anytime!",
      "Glad I could help! 🎓 I'm here whenever you need JNTU-GV information!",
    ],
  },

  farewell: {
    patterns: [
      "bye", "goodbye", "see you", "take care", "quit", "exit",
      "see you later", "gotta go", "later", "peace", "cya",
    ],
    responses: [
      "Goodbye! 😊 Feel free to come back whenever you need help. All the best with your studies! 🎓",
      "See you later! 👋 I'm always here if you need any JNTU-GV information. Take care!",
    ],
  },

  joke: {
    patterns: [
      "tell me a joke", "joke", "make me laugh", "say something funny",
      "funny", "humor", "comedy",
    ],
    responses: [
      "😄 Why did the engineering student bring a ladder to class?\n\nBecause the professor said the course material was on a *higher level*! 📚\n\nBut seriously, I'm mainly here for JNTU-GV campus help — exams, syllabus, departments, and more! 🎓",
      "😂 What's an engineer's favorite season?\n\n*Semester break!* 🏖️\n\nI'm best at helping with JNTU-GV info though — try asking about exams, notifications, or departments! 📋",
    ],
  },

  ok_acknowledged: {
    patterns: [
      "ok", "okay", "alright", "got it", "understood", "fine",
      "cool", "nice", "great", "awesome", "perfect", "good",
    ],
    responses: [
      "👍 Is there anything else you'd like to know about JNTU-GV?",
      "Great! 😊 Let me know if you have more questions about campus, academics, or any JNTU-GV services!",
    ],
  },

  help: {
    patterns: [
      "help", "help me", "i need help", "can you help",
      "assist me", "what can i ask", "what do you know",
      "what topics", "menu", "options",
    ],
    responses: [
      "Sure! Here's what I can help you with at **JNTU-GV CEV** 🎓:\n\n📄 **Academics**: Syllabus (R23/R20/R25), regulations, timetables\n📝 **Exams**: Timetables, results, hall tickets, revaluation\n🏠 **Campus Life**: Hostel, library, sports, dispensary, canteen\n💰 **Fees**: Fee structure, scholarships, payments\n👨‍🏫 **People**: Principal, Vice Principal, HODs, faculty\n🏢 **Placements**: Companies, packages, TPO info\n📢 **Notices**: Latest notifications & circulars\n📍 **General**: Location, contact, timings, about\n\nJust type your question naturally! 😊",
    ],
  },
};

// ─────────────────────────────────────────────
// 4. CAMPUS KEYWORD DETECTION
// ─────────────────────────────────────────────

const CAMPUS_KEYWORDS = new Set([
  // Academics
  "exam", "examination", "syllabus", "curriculum", "timetable", "schedule",
  "result", "marks", "grade", "gpa", "cgpa", "regulation", "r20", "r23", "r25",
  "r19", "r16", "semester", "subject", "course", "revaluation", "hall ticket",
  "supply", "backlog", "mid", "end sem",
  // Departments
  "department", "branch", "cse", "ece", "eee", "mech", "mechanical", "met",
  "metallurg", "it", "civil", "mba", "mca", "bsh", "bshss",
  // People
  "principal", "vice principal", "hod", "faculty", "professor", "teacher",
  "staff", "lecturer", "registrar", "chancellor", "vice chancellor",
  // Campus
  "hostel", "library", "placement", "fee", "tuition", "scholarship",
  "admission", "eamcet", "cutoff", "seat", "rank",
  "nss", "sports", "dispensary", "medical", "canteen", "mess",
  "transport", "bus", "lab", "laboratory", "workshop",
  "club", "fest", "cultural", "edc", "wec", "iqac", "naac", "nba",
  "research", "phd", "patent", "mou", "project",
  // General campus
  "notice", "notification", "circular", "announcement",
  "contact", "phone", "email", "location", "address", "vizianagaram",
  "college", "university", "jntu", "jntugv", "cev", "campus",
  "alumni", "certificate", "tc", "bonafide", "transfer",
  "guesthouse", "bank", "atm", "timing", "hours",
  // Telugu keywords
  "hostel", "exam", "fee", "syllabus",
]);

function containsCampusKeyword(text: string): boolean {
  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
  return words.some((w) => CAMPUS_KEYWORDS.has(w));
}

// ─────────────────────────────────────────────
// 5. IRRELEVANT QUESTION DETECTION
// ─────────────────────────────────────────────

const IRRELEVANT_PATTERNS = [
  // World knowledge / trivia
  /\b(president|prime minister|king|queen|minister|politician)\b/i,
  /\b(weather|temperature|climate|forecast)\b/i,
  /\b(movie|film|song|music|singer|actor|actress|celebrity|bollywood|hollywood)\b/i,
  /\b(cricket|football|ipl|world cup|fifa|nba)\b/i,
  /\b(recipe|cook|food item|dish|restaurant)\b/i,
  /\b(capital of|population of|currency of|flag of)\b/i,
  /\b(stock|share|market|bitcoin|crypto|trading)\b/i,
  /\b(game|gaming|play store|app store|download game)\b/i,
  /\b(girlfriend|boyfriend|love|dating|relationship)\b/i,
  /\b(god|religion|prayer|astrology|horoscope)\b/i,
  /\b(hack|cheat|illegal|drug)\b/i,
  // Generic AI chatbot requests
  /\b(write me a|compose|generate|create a story|write a poem|code for me)\b/i,
  /\b(translate to|convert to|calculate)\b/i,
];

function isIrrelevantQuestion(text: string): boolean {
  // Don't flag if it contains campus keywords
  if (containsCampusKeyword(text)) return false;
  return IRRELEVANT_PATTERNS.some((pat) => pat.test(text));
}

const SMART_FALLBACK_RESPONSES = [
  "I'm **JNTU AI**, your Smart Campus Companion 🎓\n\nI'm designed specifically to help with **JNTU-GV College of Engineering Vizianagaram** information.\n\nHere's what I can assist with:\n• 📄 Syllabus & Regulations\n• 📝 Exams & Results\n• 🏠 Hostel & Fees\n• 👨‍🏫 Faculty & Departments\n• 🏢 Placements\n• 📢 Notifications\n\nTry asking something campus-related! 😊",
  "That's outside my expertise! 😅 I'm **JNTU AI**, specialized in helping with **JNTU-GV** campus information.\n\nI can help with exams, syllabus, departments, hostel, fees, placements, and more. What would you like to know about JNTU-GV? 🎓",
];

// ─────────────────────────────────────────────
// 6. MAIN ENTRY POINT
// ─────────────────────────────────────────────

/**
 * Try to resolve a user message with an instant client-side response.
 * Returns `null` if the query should be forwarded to the server.
 */
export function tryInstantResponse(rawText: string): string | null {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  const normalized = normalize(trimmed);

  // Skip very short empty normalization
  if (!normalized) return null;

  // ── Step 1: If the query clearly contains campus keywords, let the server handle it ──
  if (containsCampusKeyword(normalized) || containsCampusKeyword(trimmed)) {
    return null;
  }

  // ── Step 2: Try exact pattern matching against common conversations ──
  for (const [, entry] of Object.entries(COMMON_CONVERSATIONS)) {
    for (const pattern of entry.patterns) {
      // Exact match
      if (normalized === pattern || trimmed.toLowerCase().replace(/[^\w\s]/g, "").trim() === pattern) {
        return pickRandom(entry.responses);
      }

      // "starts with" match for short patterns (e.g., "hi how are you" starts with "hi")
      if (pattern.length <= 5 && normalized.split(" ")[0] === pattern && normalized.split(" ").length <= 3) {
        return pickRandom(entry.responses);
      }
    }
  }

  // ── Step 3: Fuzzy matching for typo tolerance ──
  for (const [, entry] of Object.entries(COMMON_CONVERSATIONS)) {
    for (const pattern of entry.patterns) {
      if (pattern.length >= 4 && similarity(normalized, pattern) >= 0.80) {
        return pickRandom(entry.responses);
      }
    }
  }

  // ── Step 4: Check for "contains" matches on multi-word patterns ──
  for (const [, entry] of Object.entries(COMMON_CONVERSATIONS)) {
    for (const pattern of entry.patterns) {
      if (pattern.split(" ").length >= 2 && normalized.includes(pattern)) {
        return pickRandom(entry.responses);
      }
    }
  }

  // ── Step 5: Irrelevant / off-topic question detection ──
  if (isIrrelevantQuestion(trimmed) || isIrrelevantQuestion(normalized)) {
    return pickRandom(SMART_FALLBACK_RESPONSES);
  }

  // ── Step 6: If the message is very short and contains no campus keywords, it's likely
  //    conversational — but we're not confident enough. Let the server handle it. ──
  return null;
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
