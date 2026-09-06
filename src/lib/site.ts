export const SITE = {
  name: "JNTU-GV CEV",
  fullName: "JNTU-GV College of Engineering Vizianagaram (A)",
  tagline: "Engineering Tomorrow, Together",
  shortDesc:
    "A constituent college of Jawaharlal Nehru Technological University Gurajada Vizianagaram — shaping engineers, scholars and changemakers since inception.",
  contact: {
    address: "Dwarapudi, Vizianagaram – 535003, Andhra Pradesh, India",
    phone: "+91 8922 244 100",
    email: "principal@jntugv.edu.in",
  },
};

export const NAV: {
  label: string;
  to?: string;
  groups?: { title: string; items: { label: string; to: string; desc?: string }[] }[];
  simpleItems?: {
    label: string;
    to: string;
    desc?: string;
    children?: { label: string; to: string }[];
  }[];
}[] = [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "About",
      groups: [
        {
          title: "Institution",
          items: [
            {
              label: "About Institution",
              to: "/about/institution",
              desc: "History & administration of JNTU-GV CEV",
            },
            {
              label: "Vision & Mission",
              to: "/about/vision-mission",
              desc: "Our purpose and guiding principles",
            },
            {
              label: "Norms & Recognition",
              to: "/about/norms",
              desc: "UGC status and establishment orders",
            },
            {
              label: "RTI Act 2005",
              to: "/rti",
              desc: "Right to Information statutory disclosures",
            },
          ],
        },
        {
          title: "Region",
          items: [
            {
              label: "Airport Connectivity",
              to: "/about/airport-connectivity",
              desc: "Near Bhogapuram Airport",
            },
            { label: "About Vizianagaram", to: "/about/vizianagaram", desc: "The city of victory" },
            { label: "How to Reach", to: "/about/how-to-reach", desc: "Directions & transport" },
          ],
        },
      ],
    },
    {
      label: "Administration",
      groups: [
        {
          title: "Leadership",
          items: [
            { label: "Principal", to: "/administration/principal", desc: "Leadership and vision" },
            {
              label: "Vice Principal",
              to: "/administration/vice-principal",
              desc: "Academic administration",
            },
            { label: "IQAC", to: "/administration/iqac", desc: "Internal Quality Assurance Cell" },
          ],
        },
      ],
    },
    {
      label: "Academics",
      groups: [
        {
          title: "Programs & Policy",
          items: [
            { label: "Overview", to: "/academics", desc: "Programs at a glance" },
            { label: "Programs Offered", to: "/academics/programs", desc: "UG, PG and Doctoral" },
            {
              label: "Academic Regulations",
              to: "/academics/regulations",
              desc: "R20, R23 frameworks",
            },
          ],
        },
        {
          title: "Student Resources",
          items: [
            { label: "Syllabus", to: "/academics/syllabus", desc: "Course-wise curriculum" },
            { label: "Scholarships", to: "/academics/scholarships", desc: "Merit & need-based" },
            { label: "CAC", to: "/academics/cac", desc: "College Academic Committee" },
            { label: "Time Tables", to: "/academics/timetables", desc: "Class schedules" },
            { label: "Downloads", to: "/academics/downloads", desc: "Forms & documents" },
          ],
        },
      ],
    },
    {
      label: "Departments",
      groups: [
        {
          title: "",
          items: [
            { label: "Computer Science Engineering", to: "/departments/cse" },
            { label: "Electronics and Communication Engineering", to: "/departments/ece" },
            { label: "Electrical and Electronics Engineering", to: "/departments/eee" },
            { label: "Mechanical Engineering", to: "/departments/mech" },
          ],
        },
        {
          title: "",
          items: [
            { label: "Metallurgical Engineering", to: "/departments/met" },
            { label: "Information Technology", to: "/departments/it" },
            { label: "Master of Business Administration (MBA)", to: "/departments/mba" },
            { label: "Basic Sciences and Humanities and Social Sciences (BS&HSS)", to: "/departments/bshss" },
          ],
        },
      ],
    },
    {
      label: "Facilities",
      groups: [
        {
          title: "Living",
          items: [
            { label: "Hostels", to: "/hostels", desc: "UG & PG residences" },
            { label: "Dispensary", to: "/dispensary", desc: "On-campus health" },
            { label: "Banking", to: "/banking", desc: "Campus banking services" },
          ],
        },
        {
          title: "Infrastructure",
          items: [
            { label: "Library", to: "/library", desc: "Knowledge commons" },
            { label: "Sports Complex", to: "/sports", desc: "Indoor & outdoor" },
            { label: "Engineering Cell", to: "/engineering-cell", desc: "Campus planning & maintenance" },
          ],
        },
        {
          title: "Campus Life",
          items: [
            { label: "Overview", to: "/campus-life", desc: "Clubs, events & culture" },
            { label: "Music Club", to: "/campus-life/music-club" },
            { label: "Activity Club", to: "/campus-life/student-activity-club" },
          ],
        },
        {
          title: "Other Amenities",
          items: [
            { label: "Overview", to: "/other-amenities", desc: "Accommodation & transport" },
            { label: "Staff Quarters", to: "/other-amenities/staff-quarters" },
            { label: "Guest House", to: "/other-amenities/guest-house" },
          ],
        },
      ],
    },
    {
      label: "Student Corner",
      groups: [
        {
          title: "Student Welfare",
          items: [
            { label: "NSS", to: "/nss", desc: "Service & community" },
            { label: "Women Empowerment Cell", to: "/women-empowerment", desc: "Safety & support for women students" },
            { label: "Anti-Ragging", to: "/anti-ragging", desc: "Statutory committee & helpline" },
          ],
        },
        {
          title: "Campus Life",
          items: [
            { label: "Gallery", to: "/gallery", desc: "Moments on campus" },
            { label: "Connect to Alumni", to: "https://alumni.jntugv.edu.in/", desc: "Networking platform for former & current students" },
          ],
        },
        {
          title: "Professional Cells",
          items: [
            { label: "EDC", to: "/edc", desc: "Entrepreneurship & startup cell" },
            { label: "Professional Bodies", to: "/professional-bodies", desc: "IEEE, ACM, CSI chapters" },
            { label: "IIPC", to: "/iipc", desc: "Industry interaction & consultancy" },
          ],
        },
      ],
    },
    {
      label: "Placements",
      groups: [
        {
          title: "Training & Placement Cell",
          items: [
            { label: "Overview", to: "/placements", desc: "Stats and highlights" },
            {
              label: "Training & Placement",
              to: "/placements/training",
              desc: "Vision, mission, TPO",
            },
            { label: "Our Recruiters", to: "/placements/recruiters", desc: "Companies that hire" },
          ],
        },
        {
          title: "Outcomes",
          items: [
            { label: "Students Placed", to: "/placements/students", desc: "Recent placement data" },
            { label: "Gallery", to: "/placements/gallery", desc: "Drives & events" },
          ],
        },
      ],
    },
    {
      label: "R&D",
      groups: [
        {
          title: "Cell",
          items: [
            { label: "Overview", to: "/rd-cell", desc: "R&D cell at a glance" },
            { label: "About Research", to: "/rd-cell/about", desc: "Message & committee" },
            { label: "Areas of Research", to: "/rd-cell/areas", desc: "Department-wise interests" },
            { label: "MOUs", to: "/rd-cell/mous", desc: "Industry collaborations" },
          ],
        },
        {
          title: "Output",
          items: [
            { label: "Research Projects", to: "/rd-cell/projects", desc: "Funded projects" },
            { label: "Publications", to: "/rd-cell/publications", desc: "Papers & patents" },
            { label: "Scholars under Supervision", to: "/rd-cell/scholars", desc: "Ph.D scholars" },
          ],
        },
      ],
    },
  ];

export const STATS = [
  { value: 1450, label: "Students" },
  { value: 109, label: "UG Boys Rooms" },
  { value: 96, label: "PG Boys Rooms" },
  { value: 113, label: "UG Girls Rooms" },
];

export const DEPARTMENTS = [
  {
    code: "CSE",
    name: "Computer Science & Engineering",
    desc: "AI, systems, software, data.",
    accent: "from-[oklch(0.45_0.20_265)] to-[oklch(0.35_0.18_285)]",
  },
  {
    code: "ECE",
    name: "Electronics & Communication",
    desc: "VLSI, signals, embedded.",
    accent: "from-[oklch(0.50_0.18_220)] to-[oklch(0.35_0.16_260)]",
  },
  {
    code: "EEE",
    name: "Electrical & Electronics",
    desc: "Power, control, energy.",
    accent: "from-[oklch(0.55_0.18_60)] to-[oklch(0.40_0.18_30)]",
  },
  {
    code: "MECH",
    name: "Mechanical Engineering",
    desc: "Design, manufacturing, thermal.",
    accent: "from-[oklch(0.45_0.10_30)] to-[oklch(0.30_0.05_250)]",
  },
  {
    code: "CIVIL",
    name: "Civil Engineering",
    desc: "Structures, geotech, transport.",
    accent: "from-[oklch(0.50_0.12_140)] to-[oklch(0.32_0.10_180)]",
  },
  {
    code: "IT",
    name: "Information Technology",
    desc: "Networks, cloud, security.",
    accent: "from-[oklch(0.50_0.18_300)] to-[oklch(0.35_0.16_270)]",
  },
  {
    code: "MBA",
    name: "Management Studies",
    desc: "Strategy, finance, marketing.",
    accent: "from-[oklch(0.55_0.15_40)] to-[oklch(0.40_0.18_15)]",
  },
];

export const RECRUITERS = [
  "TCS",
  "Wipro",
  "SoCtronics",
  "L&T",
  "Hyundai",
  "Apps Associates",
  "Medha",
  "Cyient",
  "Nalsoft",
  "Efftronics",
  "Miracle Software",
  "Grey Campus",
  "Cerium",
  "Zebi",
  "Sail Software Solutions",
  "Infosys",
  "Cognizant",
  "Accenture",
  "Capgemini",
  "Tech Mahindra",
  "HCL",
  "Hexaware",
  "Mindtree",
  "Mphasis",
  "Deloitte",
  "Amazon",
  "Zoho",
];

// Flat search index for the Dynamic Island quick-search
export const SEARCH_INDEX: { label: string; to: string; group: string; keywords?: string }[] = [
  { label: "Home", to: "/", group: "Pages" },
  {
    label: "About Institution",
    to: "/about/institution",
    group: "About",
    keywords: "college campus history",
  },
  {
    label: "Airport Connectivity",
    to: "/about/airport-connectivity",
    group: "About",
    keywords: "airport bhogapuram connectivity alluri sitarama raju flight international",
  },
  {
    label: "About Vizianagaram",
    to: "/about/vizianagaram",
    group: "About",
    keywords: "city heritage culture",
  },
  {
    label: "How to Reach",
    to: "/about/how-to-reach",
    group: "About",
    keywords: "directions transport bus train",
  },
  {
    label: "Vision & Mission",
    to: "/about/vision-mission",
    group: "About",
    keywords: "ugc recognition 2f 12b",
  },

  {
    label: "Principal",
    to: "/administration/principal",
    group: "Administration",
    keywords: "leadership head rajeswara rao",
  },
  {
    label: "Vice Principal",
    to: "/administration/vice-principal",
    group: "Administration",
    keywords: "jaya suma academic",
  },
  {
    label: "IQAC",
    to: "/administration/iqac",
    group: "Administration",
    keywords: "quality assurance cell",
  },
  { label: "IQAC Composition", to: "/administration/iqac/composition", group: "Administration" },
  { label: "IQAC Meetings", to: "/administration/iqac/meetings", group: "Administration" },
  { label: "AQAR Reports", to: "/administration/iqac/aqar", group: "Administration" },
  { label: "IQAC MOUs", to: "/administration/iqac/mous", group: "Administration" },

  {
    label: "Academics",
    to: "/academics",
    group: "Pages",
    keywords: "programs curriculum ug pg phd",
  },
  { label: "Departments", to: "/departments", group: "Pages" },
  { label: "Contact", to: "/contact", group: "Pages" },
  { label: "Notices", to: "/notices", group: "Pages", keywords: "announcements circulars" },
  { label: "Gallery", to: "/gallery", group: "Pages" },
  { label: "Placements", to: "/placements", group: "Pages", keywords: "jobs recruiters offers" },
  {
    label: "Training & Placement Cell",
    to: "/placements/training",
    group: "Placements",
    keywords: "tpo vakula vision mission",
  },
  { label: "Our Recruiters", to: "/placements/recruiters", group: "Placements" },
  { label: "Students Placed", to: "/placements/students", group: "Placements" },
  { label: "Placements Gallery", to: "/placements/gallery", group: "Placements" },

  { label: "R&D Cell", to: "/rd-cell", group: "Pages", keywords: "research development funding" },
  {
    label: "About Research",
    to: "/rd-cell/about",
    group: "R&D",
    keywords: "naga raju coordinator",
  },
  { label: "Areas of Research", to: "/rd-cell/areas", group: "R&D" },
  { label: "Research Projects", to: "/rd-cell/projects", group: "R&D" },
  { label: "Research Publications", to: "/rd-cell/publications", group: "R&D" },
  { label: "Scholars under Supervision", to: "/rd-cell/scholars", group: "R&D" },
  { label: "MOUs", to: "/rd-cell/mous", group: "R&D", keywords: "supraja blackbuck sarda" },

  { label: "Programs Offered", to: "/academics/programs", group: "Academics" },
  { label: "Academic Regulations", to: "/academics/regulations", group: "Academics" },
  { label: "Syllabus", to: "/academics/syllabus", group: "Academics" },
  { label: "Scholarships", to: "/academics/scholarships", group: "Academics" },
  {
    label: "CAC",
    to: "/academics/cac",
    group: "Academics",
    keywords: "college academic committee",
  },
  { label: "Time Tables", to: "/academics/timetables", group: "Academics" },
  { label: "Downloads", to: "/academics/downloads", group: "Academics" },

  {
    label: "Computer Science (CSE)",
    to: "/departments/cse",
    group: "Departments",
    keywords: "cse software ai",
  },
  {
    label: "Electronics (ECE)",
    to: "/departments/ece",
    group: "Departments",
    keywords: "vlsi signals",
  },
  { label: "Electrical (EEE)", to: "/departments/eee", group: "Departments", keywords: "power energy" },
  { label: "Mechanical", to: "/departments/mech", group: "Departments", keywords: "design thermal" },
  { label: "Civil", to: "/departments/civil", group: "Departments", keywords: "structures geotech" },
  {
    label: "Information Technology",
    to: "/departments/it",
    group: "Departments",
    keywords: "it networks cloud",
  },
  { label: "MBA", to: "/departments/mba", group: "Departments", keywords: "management business" },

  { label: "Hostels", to: "/hostels", group: "Facilities", keywords: "rooms accommodation" },
  { label: "Library", to: "/library", group: "Facilities", keywords: "books reading" },
  { label: "Sports Complex", to: "/sports", group: "Facilities", keywords: "cricket gym fitness" },
  {
    label: "Dispensary",
    to: "/dispensary",
    group: "Facilities",
    keywords: "health medical clinic",
  },
  { label: "Campus Life", to: "/campus-life", group: "Facilities", keywords: "clubs events" },
  { label: "Music Club", to: "/campus-life/music-club", group: "Facilities", keywords: "music band performance" },
  {
    label: "Student Activity Club",
    to: "/campus-life/student-activity-club",
    group: "Facilities",
    keywords: "clubs events leadership",
  },
  {
    label: "Other Amenities",
    to: "/other-amenities",
    group: "Facilities",
    keywords: "guest house staff quarters hospitality",
  },
  {
    label: "Staff Quarters",
    to: "/other-amenities/staff-quarters",
    group: "Facilities",
    keywords: "staff housing accommodation",
  },
  {
    label: "Guest House",
    to: "/other-amenities/guest-house",
    group: "Facilities",
    keywords: "visitor lodging hospitality",
  },

  { label: "NSS", to: "/nss", group: "Student Corner", keywords: "service community" },
  { label: "Women Empowerment Cell", to: "/women-empowerment", group: "Student Corner", keywords: "women safety gender cell" },
  { label: "Anti-Ragging Committee", to: "/anti-ragging", group: "Student Corner", keywords: "anti ragging arc aicte ugc act 26 penalties toll free 1800-180-5522 affidavit helpline squad" },
  { label: "Right to Information (RTI)", to: "/rti", group: "Statutory", keywords: "rti act 2005 public information officer pio apio appellate authority transparency jntu act goms 14" },
  {
    label: "Alumni Portal",
    group: "Student Corner",
    keywords: "alumni portal former students passouts networking graduates register",
    to: "https://alumni.jntugv.edu.in",
  },
  {
    label: "EDC",
    to: "/edc",
    group: "Student Corner",
    keywords: "entrepreneurship startup business incubation",
  },
  {
    label: "Professional Bodies",
    to: "/professional-bodies",
    group: "Student Corner",
    keywords: "ieee acm csi chapters technical societies",
  },
  {
    label: "IIPC",
    to: "/iipc",
    group: "Student Corner",
    keywords: "industry interaction consultancy internships",
  },
];

export const ACADEMICS_SUBNAV = [
  { label: "Overview", to: "/academics" },
  { label: "Programs Offered", to: "/academics/programs" },
  { label: "Admissions", to: "/academics/admissions" },
  { label: "Regulations", to: "/academics/regulations" },
  { label: "Syllabus", to: "/academics/syllabus" },
  { label: "Calendar", to: "/academics/academic-calendar" },
  { label: "Examinations", to: "/academics/examination" },
  { label: "Faculty Directory", to: "/academics/faculty" },
  { label: "Scholarships", to: "/academics/scholarships" },
  { label: "Time Tables", to: "/academics/timetables" },
  { label: "CAC", to: "/academics/cac" },
  { label: "Downloads", to: "/academics/downloads" },
];

export const PLACEMENTS_SUBNAV = [
  { label: "Overview", to: "/placements" },
  { label: "Training & Placement", to: "/placements/training" },
  { label: "Our Recruiters", to: "/placements/recruiters" },
  { label: "Students Placed", to: "/placements/students" },
  { label: "Gallery", to: "/placements/gallery" },
];

export const CAMPUS_LIFE_SUBNAV = [
  { label: "Overview", to: "/campus-life" },
  { label: "Music Club", to: "/campus-life/music-club" },
  { label: "Student Activity Club", to: "/campus-life/student-activity-club" },
  { label: "Sports", to: "/sports" },
];

export const RD_SUBNAV = [
  { label: "Overview", to: "/rd-cell" },
  { label: "About Research", to: "/rd-cell/about" },
  { label: "Areas of Research", to: "/rd-cell/areas" },
  { label: "Research Projects", to: "/rd-cell/projects" },
  { label: "Publications", to: "/rd-cell/publications" },
  { label: "Scholars", to: "/rd-cell/scholars" },
  { label: "MOUs", to: "/rd-cell/mous" },
];

export const ADMINISTRATION_SUBNAV = [
  { label: "Principal", to: "/administration/principal" },
  { label: "Vice Principal", to: "/administration/vice-principal" },
  { label: "IQAC", to: "/administration/iqac" },
];

export const OTHER_AMENITIES_SUBNAV = [
  { label: "Overview", to: "/other-amenities" },
  { label: "Staff Quarters", to: "/other-amenities/staff-quarters" },
  { label: "Guest House", to: "/other-amenities/guest-house" },
];

export const IQAC_SUBNAV = [
  { label: "About IQAC", to: "/administration/iqac" },
  { label: "Composition", to: "/administration/iqac/composition" },
  { label: "Meetings & Events", to: "/administration/iqac/meetings" },
  { label: "AQAR", to: "/administration/iqac/aqar" },
  { label: "MOUs", to: "/administration/iqac/mous" },
];

export const STUDENT_SUBNAV = [
  { label: "NSS", to: "/nss" },
  { label: "Women Empowerment", to: "/women-empowerment" },
  { label: "Anti-Ragging", to: "/anti-ragging" },
  { label: "Connect to Alumni", to: "https://alumni.jntugv.edu.in/" },
  { label: "RTI Act", to: "/rti" },
  { label: "EDC", to: "/edc" },
  { label: "Professional Bodies", to: "/professional-bodies" },
  { label: "IIPC", to: "/iipc" },
  { label: "Gallery", to: "/gallery" },
  { label: "Notices", to: "/notices" },
  { label: "Contact Us", to: "/contact" },
];

export const NSS_SUBNAV = [
  { label: "About NSS", to: "/nss" },
  { label: "NSS Activities", to: "/nss/activities" },
  { label: "NSS Special Camp Activities", to: "/nss/special-camp" },
];

export const WE_SUBNAV = [
  { label: "About WE&GC", to: "/women-empowerment" },
  { label: "Activities & Events", to: "/women-empowerment/activities" },
  { label: "Recreation Club", to: "/women-empowerment/recreation" },
  { label: "Magazine", to: "/women-empowerment/magazine" },
];

export const RECRUITERS_2017_18 = [
  "TCS — Tata Consultancy Service",
  "Wipro",
  "SoCtronics",
  "L&T — Larsen & Toubro",
  "Hyundai",
  "Apps Associates",
  "Medha",
  "Cyient",
  "Nalsoft",
  "Efftronics",
  "Miracle Software Systems",
  "Grey Campus",
  "Cerium",
  "Zebi",
  "Sail Software Solutions",
];

const R = "http://89.116.134.182/local-assets/wp-content/gallery/our-recruiters";
export const RECRUITER_LOGOS: { name: string; url: string }[] = [
  { name: "Agilitx", url: `${R}/Agilitx.png` },
  { name: "Airtel", url: `${R}/airtel.png` },
  { name: "Amazon", url: `${R}/amazon.png` },
  { name: "Anjaney Alloyes Pvt Ltd", url: `${R}/Anjaney-Alloyes-PVt-Ltd.jpg` },
  { name: "AppsAssociates", url: `${R}/AppsAssociates.png` },
  { name: "Bhanu Special Costing", url: `${R}/bhanu-special-costing-PVT.LTD_.jpg` },
  { name: "BMM Ispat Limited", url: `${R}/bmm-ispat-limited.jpg` },
  { name: "Broadcom", url: `${R}/Broadcom.png` },
  { name: "Capgemini", url: `${R}/cap-gemini.png` },
  { name: "Cerium Systems", url: `${R}/Cerium-systems.png` },
  { name: "Chegg India", url: `${R}/Cheggindia-Pvt.Ltd_.png` },
  { name: "CMC", url: `${R}/CMC.jpg` },
  { name: "Cognizant", url: `${R}/Cognizant.jpg` },
  { name: "Computer Science Corporation", url: `${R}/Computer-Science-Corporation.png` },
  { name: "Ctrls", url: `${R}/Ctrls.png` },
  { name: "Cyient", url: `${R}/cyient.png` },
  { name: "Dankuni Steels", url: `${R}/Dankuni-Steels.png` },
  { name: "Data India", url: `${R}/data-india-PVT.LTD_.png` },
  { name: "DST Worldwide Technologies", url: `${R}/DST-Worldwide-Technologies.jpg` },
  { name: "Effetronics", url: `${R}/Effetronics.png` },
  { name: "Everglades Technologies", url: `${R}/Everglades-Technologies.png` },
  { name: "Genpact", url: `${R}/genpact.png` },
  { name: "Glenwood", url: `${R}/Glenwood.jpg` },
  { name: "GlobalLogic", url: `${R}/Global-Logic.png` },
  { name: "GreyCampus", url: `${R}/GreyCampus.jpg` },
  { name: "Honeywell Technology", url: `${R}/Honeywell-Technology.png` },
  { name: "Hyundai", url: `${R}/hyundai.png` },
  { name: "IBM", url: `${R}/IBM.png` },
  { name: "Infosys", url: `${R}/Infosys.png` },
  { name: "Infotech", url: `${R}/Infotech.png` },
  { name: "Inspectorate Griffith India", url: `${R}/Inspectorate-Griffith-India-PVT.LTD_.jpg` },
  { name: "J.K. Papers", url: `${R}/J.K.Papers.jpg` },
  { name: "L&T InfoTech", url: `${R}/LT-InfoTech.png` },
  { name: "Medha Servo", url: `${R}/Medha-Servo.jpg` },
  { name: "Mindtree", url: `${R}/Mindtree.png` },
  { name: "Miracle Software Systems", url: `${R}/Miracle-Soft-ware-Systems.png` },
  { name: "MPHASIS", url: `${R}/MPHAS.png` },
  { name: "NCR", url: `${R}/NCR.jpg` },
  { name: "NeeLsys", url: `${R}/NeeLsys.jpg` },
  { name: "Pratian Technologies", url: `${R}/Pratian-Technologies.png` },
  { name: "Sails Software Solutions", url: `${R}/Sails-software-solutions.png` },
  { name: "SoCtronics", url: `${R}/SoCtronics.png` },
  { name: "Suneratech", url: `${R}/suneratech.png` },
  { name: "Syntel", url: `${R}/Syntel.png` },
  { name: "Tavisca", url: `${R}/Tavisca.jpg` },
  { name: "TCS", url: `${R}/TCS.jpg` },
  { name: "Tech Mahindra", url: `${R}/Tech-mahindra.jpg` },
  { name: "Teradata", url: `${R}/teradata.png` },
  { name: "Transcend Solutions", url: `${R}/transcend-solutions.png` },
  { name: "Uurmi", url: `${R}/uurmi.png` },
  { name: "Virtusa", url: `${R}/Virtusa.png` },
  { name: "Wipro", url: `${R}/wipro.jpg` },
  { name: "Zebi", url: `${R}/Zebi.png` },
];
