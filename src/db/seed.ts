import { db } from "./index";
import {
  students,
  placementYears,
  placementHighlights,
  placementGallery,
  rdDepartments,
  rdResearchAreas,
  rdFocusAreas,
  rdFunders,
  rdConsultancy,
  rdCommittee,
  rdProjects,
  rdScholars,
  rdCoordinatorMessage,
  rdMotto,
  rdPublications,
  rdPublicationStats,
  rdMous,
} from "./schema";

async function seed() {
  console.log("🌱 Clearing old data...");
  await db.delete(rdCoordinatorMessage);
  await db.delete(rdMotto);
  await db.delete(rdPublications);
  await db.delete(rdPublicationStats);
  await db.delete(rdMous);
  await db.delete(placementGallery);
  await db.delete(rdScholars);
  await db.delete(rdProjects);
  await db.delete(rdCommittee);
  await db.delete(rdConsultancy);
  await db.delete(rdFunders);
  await db.delete(rdFocusAreas);
  await db.delete(rdResearchAreas);
  await db.delete(rdDepartments);
  await db.delete(students);
  await db.delete(placementHighlights);
  await db.delete(placementYears);

  console.log("🌱 Seeding placement years...");
  await db.insert(placementYears).values([
    { year: "2023-24", offers: 450, top: "₹ 12.5 L", recruiters: 45 },
    { year: "2022-23", offers: 582, top: "₹ 11.0 L", recruiters: 52 },
    { year: "2021-22", offers: 645, top: "₹ 9.5 L", recruiters: 58 },
  ]);

  console.log("🌱 Seeding placement highlights...");
  await db.insert(placementHighlights).values([
    { name: "S. Rahul", branch: "CSE", company: "Amazon", package: "₹ 12.5 L" },
    { name: "K. Priya", branch: "ECE", company: "TCS Ninja", package: "₹ 7.0 L" },
    { name: "M. Arjun", branch: "MECH", company: "L&T", package: "₹ 6.5 L" },
  ]);

  console.log("🌱 Seeding students...");
  await db.insert(students).values([
    // Add student data here if needed
  ]);

  console.log("🌱 Seeding placement gallery...");
  await db.insert(placementGallery).values([
    { src: "/assets/campus-life.jpg", caption: "Pre-placement talk — Tier 1 IT" },
    { src: "/assets/library-interior.jpg", caption: "Aptitude bootcamp" },
    { src: "/assets/lab.jpg", caption: "Technical interview drive" },
    { src: "/assets/sports.jpg", caption: "Group discussion round" },
    { src: "/assets/culture.jpeg", caption: "Offer day celebrations" },
    { src: "/assets/hero-campus.jpg", caption: "Recruiter campus tour" },
  ]);

  console.log("🌱 Seeding R&D Departments...");
  const depts = await db
    .insert(rdDepartments)
    .values([
      { name: "Department of Computer Science Engineering" },
      { name: "Department of Electronics & Communication Engineering" },
      { name: "Department of Electrical & Electronics Engineering" },
      { name: "Department of Mechanical Engineering" },
      { name: "Department of Civil Engineering" },
      { name: "Department of Information Technology" },
      { name: "Department of BS & HSS" },
    ])
    .returning();

  const cseId = depts[0].id;
  const eceId = depts[1].id;
  const eeeId = depts[2].id;
  const mechId = depts[3].id;
  const civilId = depts[4].id;
  const itId = depts[5].id;
  const bshssId = depts[6].id;

  console.log("🌱 Seeding R&D coordinator message & motto...");
  await db.insert(rdCoordinatorMessage).values({
    name: "Dr. G. Naga Raju",
    role: "Research Coordinator",
    quote:
      "Research is to see what everybody else has seen, and to think what nobody else has thought.",
    message:
      "JNTUK-UCEV strives towards inculcating research culture among its students and faculty by encouraging multi-disciplinary research activities in pace with global standards...",
    image: "https://jntugvcev.edu.in/local-assets/uploads/images/administration/Dr-G-J-NAGA-RAJU-latest.jpg",
  });

  await db.insert(rdMotto).values([
    {
      text: "Encourage multidisciplinary collaborative research among faculty and with research institutes across the globe.",
      order: 1,
    },
    {
      text: "Facilitate cutting-edge research in thrust areas identified by the departments.",
      order: 2,
    },
    {
      text: "Organise scientific outreach programmes periodically to address research gaps through knowledge management.",
      order: 3,
    },
    {
      text: "Promote industry-oriented research in diverse fields, integrating outcomes with real-world applications.",
      order: 4,
    },
  ]);

  console.log("🌱 Seeding R&D Publications...");
  await db.insert(rdPublicationStats).values([
    { label: "Journal papers", value: 420, suffix: "+" },
    { label: "Conference papers", value: 180, suffix: "+" },
    { label: "Patents filed", value: 28, suffix: "" },
    { label: "Books / chapters", value: 12, suffix: "" },
  ]);

  await db.insert(rdPublications).values([
    {
      dept: "ECE",
      title: "A robust DCT-based digital image forgery detection scheme using deep features",
      venue: "Multimedia Tools and Applications, 2023",
      authors: "Ch. Srinivasa Rao et al.",
    },
    {
      dept: "CSE",
      title: "Hybrid CNN-LSTM model for real-time intrusion detection in IoT networks",
      venue: "IEEE IoT Journal, 2023",
      authors: "A. S. N. Chakravarthy et al.",
    },
    {
      dept: "EEE",
      title: "Order reduction of large-scale interval systems using moment matching",
      venue: "Springer LNEE, 2022",
      authors: "A. Padmaja et al.",
    },
    {
      dept: "MECH",
      title: "Mechanical and microstructural characterization of nano red mud Al-MMC",
      venue: "Materials Today: Proceedings, 2022",
      authors: "G. Swami Naidu, C. Neelima Devi",
    },
    {
      dept: "IT",
      title: "Evolutionary computation for software cost estimation: a survey",
      venue: "ACM Computing Surveys, 2022",
      authors: "G. Jaya Suma et al.",
    },
    {
      dept: "BS & HSS",
      title:
        "Trace elemental analysis of ovarian tissue using PIXE and decision-tree classification",
      venue: "Nuclear Instruments and Methods B, 2021",
      authors: "G. J. Naga Raju et al.",
    },
  ]);

  console.log("🌱 Seeding R&D MOUs...");
  await db.insert(rdMous).values([
    {
      title: "Department of Electrical & Electronics Engineering",
      body: "A Memorandum of Understanding (MOU) has been signed with M/s Sarda Metals & Alloys Ltd., Visakhapatnam to exchange expertise for mutual benefit and growth — in the areas of Industrial Visits, In-plant Training, Internships, Projects, Research & Development, Placements and Establishing Advanced Labs.",
      type: "department",
    },
    {
      title: "Department of Mechanical Engineering",
      body: "A tie-up has been made and MOUs signed with industries like Tata Consultancy Services Limited. The MOU with TCS on Tata Affirmative Action Program (TAAP) aims to improve the employability of students. A second MOU with M/s Sarda Metals & Alloys Ltd., Visakhapatnam covers Industrial Visits, In-plant Training, Internships, Projects, R&D, Placements and Establishing Advanced Labs.",
      type: "department",
    },
    {
      title: "MOU with Supraja Technologies",
      body: "ISO 9001:2015 Certified Company. Supports establishment and running of the B.Tech program in CSE: Internships / project work, industry orientation / practical training, expert lectures, joint R&D and consultancy, identification of development projects, and student visits to Supraja Technologies premises.",
      img: "/assets/mou-supraja.png",
      badge: "Centre of Excellence",
      type: "certificate",
    },
    {
      title: "MOU with Blackbuck Technologies",
      body: "Action plan for establishing a Centre of Excellence for Emerging Technologies. Covers (i) Job skills, (ii) Innovation ecosystem through courses & initiatives, (iii) Industry interaction. Programs include Connected FDPs, Connected Workshops, Incubation Centre & Innovation Lab, Career Guidance & Industry Mentorship, Entrepreneurship Support, Webinars, Guest Lectures and Hackathons / Ideathons.",
      img: "/assets/mou-blackbuck.png",
      badge: "Innovation Partner",
      type: "certificate",
    },
  ]);

  console.log("🌱 Seeding Research Areas...");
  await db.insert(rdResearchAreas).values([
    // EEE
    { deptId: eeeId, area: "Large Scale Uncertain Systems" },
    { deptId: eeeId, area: "Order reduction of Large Scale Systems" },
    { deptId: eeeId, area: "Uncertain Systems, Soft Computing Techniques" },
    { deptId: eeeId, area: "Interval Systems" },
    { deptId: eeeId, area: "Robust Controllers" },
    { deptId: eeeId, area: "Control Application of Power Systems" },
    { deptId: eeeId, area: "Adaptive Power System Stabilizers" },
    { deptId: eeeId, area: "Power Quality" },
    { deptId: eeeId, area: "Distributed Generation" },
    { deptId: eeeId, area: "Smart Grids and Micro Grids" },
    { deptId: eeeId, area: "Automatic Generation Control" },
    { deptId: eeeId, area: "Hybrid Power Systems" },
    { deptId: eeeId, area: "Soft Computing Methods — Adaptive controllers" },

    // MECH
    { deptId: mechId, area: "Mechanical Vibrations" },
    { deptId: mechId, area: "Robot Kinematics" },
    { deptId: mechId, area: "Nano Composites & Materials" },
    { deptId: mechId, area: "Material Technology, Metals and Alloys" },
    { deptId: mechId, area: "Deformation behaviour" },
    { deptId: mechId, area: "Severe Plastic Deformation" },
    { deptId: mechId, area: "Metal forming" },
    { deptId: mechId, area: "Composite Materials" },
    { deptId: mechId, area: "Nano materials & characterization" },
    { deptId: mechId, area: "Nano Technology" },
    { deptId: mechId, area: "CAD/CAM" },
    { deptId: mechId, area: "Machine Design" },
    { deptId: mechId, area: "Advanced Manufacturing Techniques" },
    { deptId: mechId, area: "Thermal Engineering" },
    { deptId: mechId, area: "Fluid Mechanics" },
    { deptId: mechId, area: "Heat Transfer" },
    { deptId: mechId, area: "Computational Fluid Dynamics" },
    { deptId: mechId, area: "Computer Integrated Manufacturing" },
    { deptId: mechId, area: "3D Printing" },
    { deptId: mechId, area: "High Speed Machining" },
    { deptId: mechId, area: "Production Technology" },
    { deptId: mechId, area: "Metrology" },
    { deptId: mechId, area: "Soft Computing Techniques" },

    // ECE
    { deptId: eceId, area: "Microwave and Radar Communications" },
    { deptId: eceId, area: "Image Processing" },
    { deptId: eceId, area: "VLSI & Signal Processing" },
    { deptId: eceId, area: "Communications and Signal Processing" },
    { deptId: eceId, area: "VLSI and Embedded Systems" },
    { deptId: eceId, area: "Embedded Systems & VLSI Signal Processing" },
    { deptId: eceId, area: "VLSI System Design" },
    { deptId: eceId, area: "Signal Processing & Embedded Systems" },

    // CSE
    { deptId: cseId, area: "Computer Networks" },
    { deptId: cseId, area: "Data Security" },
    { deptId: cseId, area: "Cyber Security" },
    { deptId: cseId, area: "Cloud Privacy" },
    { deptId: cseId, area: "Digital Forensics & Biometrics" },
    { deptId: cseId, area: "Image Processing & Soft Computing" },
    { deptId: cseId, area: "Speech Processing" },
    { deptId: cseId, area: "Pattern Recognition" },
    { deptId: cseId, area: "Cloud Computing" },
    { deptId: cseId, area: "Compilers & Parallel Computing" },
    { deptId: cseId, area: "Cyber Crimes" },
    { deptId: cseId, area: "Data Mining" },
    { deptId: cseId, area: "Machine Learning" },
    { deptId: cseId, area: "Wireless Sensor Networks" },
    { deptId: cseId, area: "Internet of Things" },

    // IT
    { deptId: itId, area: "Data Mining" },
    { deptId: itId, area: "Soft Computing" },
    { deptId: itId, area: "Machine Learning" },
    { deptId: itId, area: "Mobile Computing" },
    { deptId: itId, area: "Internet of Things" },
    { deptId: itId, area: "Deep Learning" },
    { deptId: itId, area: "Computational Intelligence" },
    { deptId: itId, area: "Software Cost Estimation" },
    { deptId: itId, area: "Search-based Software Engineering" },
    { deptId: itId, area: "Swarm Intelligence" },
    { deptId: itId, area: "Web & Data Mining" },
    { deptId: itId, area: "Neural Networks" },

    // BS & HSS
    { deptId: bshssId, area: "Algebra & Lattice Theory" },
    { deptId: bshssId, area: "Mathematical Modeling" },
    { deptId: bshssId, area: "Operations Research" },
    { deptId: bshssId, area: "English Language Teaching" },
    { deptId: bshssId, area: "Statistical Analysis" },
    { deptId: bshssId, area: "Applied Physics" },
    { deptId: bshssId, area: "Finance & HR Management" },
    { deptId: bshssId, area: "Organic Synthesis" },
    { deptId: bshssId, area: "Analytical Chemistry" },
  ]);

  console.log("🌱 Seeding Focus Areas...");
  await db.insert(rdFocusAreas).values([
    {
      title: "AI & Embedded Systems",
      description: "Edge intelligence, IoT, signal processing.",
      icon: "Cpu",
    },
    {
      title: "Materials & Energy",
      description: "Renewable energy, advanced materials, thermal systems.",
      icon: "Atom",
    },
    {
      title: "Sustainable Infrastructure",
      description: "Smart construction, geotech, water systems.",
      icon: "Building2",
    },
    {
      title: "Applied Sciences",
      description: "Computational chemistry, applied math, physics.",
      icon: "FlaskConical",
    },
  ]);

  console.log("🌱 Seeding Funders...");
  await db
    .insert(rdFunders)
    .values([
      { name: "UGC" },
      { name: "DST" },
      { name: "DAE" },
      { name: "NRB" },
      { name: "EXAWIZARDS" },
      { name: "RUSA" },
    ]);

  console.log("🌱 Seeding Consultancy...");
  await db.insert(rdConsultancy).values([
    {
      name: "Supraja Technologies",
      description: "Joint product engineering and embedded systems work.",
    },
    {
      name: "Sarda Metals & Alloys Ltd.",
      description: "Materials testing and process consultancy.",
    },
  ]);

  console.log("🌱 Seeding Committee...");
  await db.insert(rdCommittee).values([
    { name: "Dr. Swami Naidu", role: "Principal", detail: "Chairman" },
    { name: "Dr. G. J. Naga Raju", role: "R&D Cell, Coordinator", detail: "Convener" },
    { name: "Dr. R. Rajeswara Rao", role: "Vice Principal", detail: "Member" },
    { name: "Mrs. A. Padmaja", role: "Head, EEE", detail: "Member" },
    { name: "Dr. C. Neelima Devi", role: "Head, Mechanical", detail: "Member" },
    { name: "Dr. K. C. B. Rao", role: "Head, ECE", detail: "Member" },
    { name: "Dr. A. S. N. Chakravarthy", role: "Head, CSE", detail: "Member" },
    { name: "Dr. G. Jaya Suma", role: "Head, IT", detail: "Member" },
    { name: "Dr. Ch. Srinivasa Rao", role: "Head, Civil", detail: "Member" },
    { name: "Dr. S. Kalesha Vali", role: "Head, BS & HSS", detail: "Member" },
  ]);

  console.log("🌱 Seeding Projects...");
  await db.insert(rdProjects).values([
    // Mechanical
    {
      deptId: mechId,
      title: "Synthesis and Characterization of nano red mud reinforced aluminium composites",
      pi: "Prof. G. Swami Naidu",
      agency: "UGC",
      amount: "Rs 13.902 L",
      period: "2013-2016",
      status: "Completed",
    },
    {
      deptId: mechId,
      title:
        "A novel ECAR technique to produce AA5083 aluminum alloy with high deformation homogeneity and improved mechanical properties for naval applications",
      pi: "Prof. G. Swami Naidu",
      agency: "NRB",
      amount: "Rs 33.628 L",
      period: "2019-2021",
      status: "On going",
    },
    {
      deptId: mechId,
      title:
        "Development and mechanical characterization of Aluminium Silicon carbide metal matrix composite with soft computing tools",
      pi: "Dr. C. Neelima Devi",
      agency: "DST",
      amount: "Rs. 24.05 L",
      period: "2012-2015",
      status: "Completed",
    },
    {
      deptId: mechId,
      title:
        "A novel ECAR technique to produce AA5083 aluminum alloy with high deformation homogeneity and improved mechanical properties for naval applications",
      pi: "Mr. K.Srinivasa Prasad (Co-PI)",
      agency: "NRB",
      amount: "Rs 33.628 L",
      period: "2019-2021",
      status: "On going",
    },

    // ECE
    {
      deptId: eceId,
      title: "Development of Digital Image and Video Forgery Detection System",
      pi: "Dr. Ch. Srinivasa Rao",
      agency: "RUSA",
      amount: "Rs. 7.85 L",
      period: "—",
      status: "On going",
    },

    // CSE
    {
      deptId: cseId,
      title: "MRI Coronary Artery Detection Applying Deep Learning techniques",
      pi: "Mr. D.D.V. Sivaram Rolangi",
      agency: "EXAWIZARDS",
      amount: "Rs. 5.00 L",
      period: "3 Months",
      status: "Completed",
    },
    {
      deptId: cseId,
      title: "Improving Semantic Segmentation Model Accuracy using MSCOCO and PascalVOC Datasets",
      pi: "Mr. D.D.V. Sivaram Rolangi",
      agency: "EXAWIZARDS",
      amount: "Rs. 2.50 L",
      period: "10 Months",
      status: "Completed",
    },

    // BS & HSS
    {
      deptId: bshssId,
      title:
        "Diagnosis of ovarian cancer using decision tree classification of trace elemental data obtained by applying ion beam analysis",
      pi: "Dr. G. J. Naga Raju",
      agency:
        "Department of Science and Technology (DST), New Delhi, Govt. of India (DST SR/FTP/PS-139/2011)",
      amount: "Rs. 21.84 L",
      period: "11-12-2013 to 11-12-2016",
      status: "Completed",
    },
  ]);

  console.log("🌱 Seeding Scholars...");

  // CSE Scholars
  await db.insert(rdScholars).values([
    {
      deptId: cseId,
      scholarName: "Mr. B. Vijay Kumar",
      rollNo: "",
      researchTitle:
        "Improvement of Digital Water Marketing Techniques Using Region and Statistical Approaches",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2013",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Syed Raziuddin",
      rollNo: "",
      researchTitle:
        "Improved and Robust Artificial Bee Colony Algorithms and its Applications towards Optimal Sensor Placement",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2013",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Gondi Lakshmeeswari",
      rollNo: "",
      researchTitle:
        "An Encoding Mechanism for Telugu Text and its secured Transmission using visual Cryptography",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2013",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. R. Venkata Ramana Chary",
      rollNo: "",
      researchTitle: "Images Retrieval Based on Image Features and Similarity Measurements",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2014",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. K. Nageswarara Rao",
      rollNo: "",
      researchTitle:
        "Improvement of Class Imbalance Learning Techniques using Unsupervised Learning and Subset Filtering Approaches",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2014",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "M.K. Nikitha",
      rollNo: "",
      researchTitle: "Effective Connectivity and Coverage Issues in Wireless Sensor Networks",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2015",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Shameem Akther",
      rollNo: "",
      researchTitle:
        "Novel Techniques for Segmentation using Modified Algorithms for Detection of Edge & Region",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2016",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. P.R. Viswanath",
      rollNo: "",
      researchTitle:
        "A Novel Conceptual Approach for Materialized View Selection and Maintenance of Dataware House Systems Using Association Rule Mining",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2016",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Mohammad Sirajuddin",
      rollNo: "",
      researchTitle: "Performance Enhancement of 802.11n (WLANs) for Voice Transmission",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2017",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Ch. Sureshbabu",
      rollNo: "12022P0513",
      researchTitle:
        "Water Quality Prediction of Aqua Ponds using Functional Tangent and Distributed Functional Tangent Decision Tree",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2018",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. K. Kishore Raju",
      rollNo: "",
      researchTitle: "Data Mining",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. D. Bhanu Mahesh",
      rollNo: "15022P0567",
      researchTitle: "Data Mining & Machine Learning",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mrs. Singaraju Suguna Mallika",
      rollNo: "15022P0531",
      researchTitle: "Software Engineering (Mutation Testing and its Analysis on Web Applications)",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2022",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Nayani Sateesh",
      rollNo: "15022P0519",
      researchTitle: "Data Mining",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Kishan Chand Kopila",
      rollNo: "18022P0518",
      researchTitle: "Wireless Sensor Network",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Eluri Ramesh",
      rollNo: "18022P0503",
      researchTitle: "Identifying and analyzing the influence of weather in Smart Cities using IoT",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Shaik Salma Begum",
      rollNo: "13022PO540",
      researchTitle: "Image Processing",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mrs. P. Naga Jyothi",
      rollNo: "13303023",
      researchTitle:
        "Investigating and Identifying Fraudulent Behaviors from Multiple Sources of Medical Claims Data",
      supervisor: "Prof. D. Rajya Lakshmi",
      status: "Awarded 2022",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. B. Venkataseshu Kumari",
      rollNo: "",
      researchTitle:
        "Statistical Telugu Dependency Parsing Using Linguistic and Combinatory Categorial Grammar (CCG) Supertag Features",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2015 (JNTU-H)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. V. Subbaramaiah",
      rollNo: "",
      researchTitle:
        "Enhanced Methods for Speaker Diarization using Spectral and Clustering Concepts",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2019 (JNTU-H)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Nagapadmaja Jagini",
      rollNo: "",
      researchTitle:
        "A Framework for automatic text-Independent emotion recognition system for Telugu language",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2020 (JNTU-H)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Sridevi Mothukuri",
      rollNo: "",
      researchTitle:
        "Collaborative Filtering Recommender System by Exploiting Expertise and Demographic of Users",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2020 (JNTU-H)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Goda Srinivasa Rao",
      rollNo: "",
      researchTitle: "A Framework for handwritten character recognition for Telugu script",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2020 (JNTU-A)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. S. Radha Krishna",
      rollNo: "",
      researchTitle:
        "Exploring Robust Emotion Specific Feature for Automatic Text-Independent Emotion Recognition for Telugu Language",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2021 (JNTU-K)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Ashlin Deepa R N",
      rollNo: "1103PH0621",
      researchTitle:
        "An Enhanced Offline Handwritten Character Recognition Using Variable Length Feature for Tamil Language",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "Awarded 2021 (JNTU-H)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. B. Madhavi Devi",
      rollNo: "13022P0601",
      researchTitle: "Cloud Computing",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "In Progress (JNTU-K)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Inuganti Srilakshmi",
      rollNo: "",
      researchTitle: "Pattern Recognition",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "In Progress (JNTU-K)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. Mantri Gayatri",
      rollNo: "",
      researchTitle: "Web Mining",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "In Progress (JNTU-K)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. G. Stalin Babu",
      rollNo: "15022P0512",
      researchTitle: "Image Processing",
      supervisor: "Prof. R. Rajeswara Rao",
      status: "In Progress (JNTU-K)",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Nekkanti Venkata Rao",
      rollNo: "",
      researchTitle:
        "Qualitative and Quantitative Parametric Substantiation for Recognition of Text in Ancient Documents",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "Awarded 2018",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Akella Ramakrishna",
      rollNo: "",
      researchTitle: "Hybrid Directional Channel Models for Secured Device to Device Communication",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "Awarded 2018",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Kameswara Rao Buragapu",
      rollNo: "",
      researchTitle: "An Optimized Routing Technique for Cluster based Pollution Control Manet",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "Awarded 2019",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mrs. R. Sailaja",
      rollNo: "",
      researchTitle: "Network Security & Forensics",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "Awarded 2020",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. T. Siva Rama Krishna",
      rollNo: "",
      researchTitle: "Network Security & Cryptography",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. V. Venkateswara Rao",
      rollNo: "",
      researchTitle: "Network Security & Cryptography",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. M.M. Naresh Babu",
      rollNo: "",
      researchTitle: "Network Security & Cryptography",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Katari Praveen Kumar",
      rollNo: "",
      researchTitle: "Network Security & Cryptography",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. T. Anji Kumar",
      rollNo: "",
      researchTitle: "Network Security",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. A. Chandra",
      rollNo: "",
      researchTitle: "Adhoc Networks & Security",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Ms. K. Pratyusha",
      rollNo: "",
      researchTitle: "Network Security & Forensics",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. S. Suresh Babu",
      rollNo: "",
      researchTitle: "Image Processing",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Immadi Murali Krishna",
      rollNo: "",
      researchTitle: "Image Processing",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: cseId,
      scholarName: "Mr. Anil Kumar",
      rollNo: "",
      researchTitle: "Image Processing",
      supervisor: "Dr. A.S.N. Chakravarthy",
      status: "In Process",
      regYear: "",
    },
  ]);

  // ECE Scholars
  await db.insert(rdScholars).values([
    {
      deptId: eceId,
      scholarName: "Mrs. M. Madhavi",
      rollNo: "",
      researchTitle: "Investigations on ICG using Novel Adaptive Signal Processing Techniques",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "Awarded",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. M. Ravikishore",
      rollNo: "",
      researchTitle:
        "Design and implementation of Microstrip antennas for RF and Microwave communications",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. B. N. Srinivasa Rao",
      rollNo: "",
      researchTitle: "Low power and speed performance issues of CMOS digital circuits",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. P.V. Krishna Chaitanya",
      rollNo: "",
      researchTitle:
        "Passive tracking of multiple maneuvering targets using adaptive signal processing techniques",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. R. Sunil Kumar",
      rollNo: "",
      researchTitle: "Optimization of spectrum sensing in cognitive radio",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. D. Ravi Nayak",
      rollNo: "",
      researchTitle: "Design and implementation of compact wideband Fractal Antennas",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eceId,
      scholarName: "Mr. Ch. Srinivas",
      rollNo: "",
      researchTitle:
        "Detection of Human behavior by analyzing EEG signals obtained for various salient features of images",
      supervisor: "Dr. K. Chandra Bhushana Rao",
      status: "In Process",
      regYear: "",
    },
  ]);

  // EEE Scholars
  await db.insert(rdScholars).values([
    {
      deptId: eeeId,
      scholarName: "Mr. M. Ravindra Babu",
      rollNo: "12022P0202",
      researchTitle:
        "Design and Analysis of Firefly based Power System Stabilizer based on Pseudo Spectrum Analysis",
      supervisor: "Prof. G. Saraswathi",
      status: "Awarded 2019",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Mr. N. V. A. Ravikumar",
      rollNo: "13022P0221",
      researchTitle: "Some Aspects on Large Scale Robust Controllers",
      supervisor: "Prof. G. Saraswathi",
      status: "Awarded 2021",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "P.A. Mohanarao",
      rollNo: "13022P0211",
      researchTitle: "Power Quality Issues in a Stand-Alone Micro-grid based on Renewable Energy",
      supervisor: "Prof. G. Saraswathi (Co-Supervisor)",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "K. Lavanya",
      rollNo: "15022P0230",
      researchTitle:
        "Design and Implementation of a Suitable Controller for Multilevel Inverter Fed PMSM Drive",
      supervisor: "Prof. G. Saraswathi (Co-Supervisor)",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "V. Rangavalli",
      rollNo: "15022P0226",
      researchTitle:
        "Performance Evaluation of Distribution System Planning to Improve the Efficiency of Micro-grid",
      supervisor: "Prof. G. Saraswathi (Co-Supervisor)",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "K. Koteswara Rao",
      rollNo: "15022P0237",
      researchTitle:
        "Enhancement of Power System Stability in Renewable Sources of Power Generation Fed to a SG based Power System through a LCC-HVDC Link",
      supervisor: "Prof. G. Saraswathi (Co-Supervisor)",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Ravi Teja S",
      rollNo: "18022P0203",
      researchTitle:
        "Development of Low Cost-High Efficiency Multilevel Converter Topologies for High Power Applications",
      supervisor: "Dr. Y. S. Kishore Babu",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "P. Veera Nagaraju",
      rollNo: "18022P0205",
      researchTitle: "Study of Renewable Energy Integration to Grid - Challenges & Solutions",
      supervisor: "Dr. Y. S. Kishore Babu",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Sri. T. M. Mohan",
      rollNo: "12022P0232",
      researchTitle:
        "Fuzzy Logic MPPT for Grid Integrated Photovoltaic Systems through H-Bridge Inverter Under Partial Shading Conditions",
      supervisor: "Dr. V. S. Vakula",
      status: "Awarded",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Sri. G. Sandeep",
      rollNo: "14022P0216",
      researchTitle: "Power Systems",
      supervisor: "Dr. V. S. Vakula",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Sri. Rajendra T",
      rollNo: "15022P0220",
      researchTitle: "Power Systems",
      supervisor: "Dr. V. S. Vakula",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Smt. V. V. Vijetha Inti",
      rollNo: "15022P0225",
      researchTitle: "Power Electronic Applications to Power Systems",
      supervisor: "Dr. V. S. Vakula",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Smt. T. Naga Durga",
      rollNo: "15022P0204",
      researchTitle: "Power Quality Improvement",
      supervisor: "Dr. V. S. Vakula",
      status: "In Progress",
      regYear: "",
    },
    {
      deptId: eeeId,
      scholarName: "Smt. K. Swetha",
      rollNo: "15022P0216",
      researchTitle: "Control Applications to Power Systems",
      supervisor: "Dr. V. S. Vakula",
      status: "In Progress",
      regYear: "",
    },
  ]);

  // MECH Scholars
  await db.insert(rdScholars).values([
    {
      deptId: mechId,
      scholarName: "P. Srinivasa Rao",
      rollNo: "12022P0328",
      researchTitle: "",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Brahmananda Reddy Sathi",
      rollNo: "12022P0329",
      researchTitle: "",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. Tutaram Tejesh",
      rollNo: "14022P0309",
      researchTitle: "",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. V. Ananda Babu",
      rollNo: "15022P0301",
      researchTitle: "Severe plastic deformation",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. Ramakrishna",
      rollNo: "15022P0320",
      researchTitle: "Friction stir welding",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Ms. M. Anitha Santhoshi",
      rollNo: "15022P0336",
      researchTitle: "Metal matrix composites",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. Syam Babu Nutalapati",
      rollNo: "15022P0348",
      researchTitle: "FRPs",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. B. Krishna Murthy",
      rollNo: "15022P0352",
      researchTitle: "Composite materials",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. M. Suryanarayana Murthy",
      rollNo: "15022PMET01",
      researchTitle: "Composite materials",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Mr. Arnuri Srinivasulu",
      rollNo: "15022PMET02",
      researchTitle: "Severe plastic deformation",
      supervisor: "Dr. G. Swami Naidu",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: mechId,
      scholarName: "Velamala Appala Raju",
      rollNo: "",
      researchTitle: "Additive Manufacturing",
      supervisor: "Dr. C. Neelima Devi",
      status: "In Process",
      regYear: "",
    },
  ]);

  // IT Scholars
  await db.insert(rdScholars).values([
    {
      deptId: itId,
      scholarName: "R V S Lalitha",
      rollNo: "",
      researchTitle: "Vehicular Ad hoc Networks: Pile ups in Data Dissemination",
      supervisor: "",
      status: "Awarded",
      regYear: "2009",
    },
    {
      deptId: itId,
      scholarName: "P. Aruna Kumari",
      rollNo: "",
      researchTitle:
        "Design and Development of Efficient Feature Selection Mechanisms at Feature Level Fusion in Multimodal Biometric Systems for Person Identification",
      supervisor: "",
      status: "Awarded",
      regYear: "2013",
    },
    {
      deptId: itId,
      scholarName: "S. Surekha",
      rollNo: "",
      researchTitle:
        "A Machine Learning Framework for Early Risk Prediction of Diabetes Comorbidity in Thyroid Patients",
      supervisor: "",
      status: "Awarded",
      regYear: "2013",
    },
    {
      deptId: itId,
      scholarName: "G. Jaya Lakshmi",
      rollNo: "",
      researchTitle:
        "An Interesting Subgraph Mining approach to design a web page recommendation system using web log data",
      supervisor: "",
      status: "Awarded",
      regYear: "2013",
    },
    {
      deptId: itId,
      scholarName: "G. L. Aruna Kumari",
      rollNo: "",
      researchTitle: "ENN-Ensemble based Neural Network method for Diabetes",
      supervisor: "",
      status: "In Progress",
      regYear: "2013",
    },
    {
      deptId: itId,
      scholarName: "K. Naga Bhargavi",
      rollNo: "",
      researchTitle:
        "Geographic Information System (GIS) Based Data Mining Model For Information Retrieval in Disaster Management Situations",
      supervisor: "",
      status: "In Progress",
      regYear: "2015",
    },
    {
      deptId: itId,
      scholarName: "D. Madhu Babu",
      rollNo: "",
      researchTitle:
        "Clustering High-Dimensional Data using Improved Artificial Bee Colony (ABC) Algorithm",
      supervisor: "",
      status: "In Progress",
      regYear: "2015",
    },
    {
      deptId: itId,
      scholarName: "Kalla Kiran",
      rollNo: "",
      researchTitle: "Identification Of Lethal Weapons Of Object Detection Using Deep Learning",
      supervisor: "",
      status: "In Progress",
      regYear: "2019",
    },
    {
      deptId: itId,
      scholarName: "Garapati Subbalakshmi",
      rollNo: "",
      researchTitle: "Learning Analytics using Machine Learning Techniques and Deep Learning",
      supervisor: "",
      status: "In Progress",
      regYear: "2019",
    },
    {
      deptId: itId,
      scholarName: "Chaitanya Kumar Tati",
      rollNo: "",
      researchTitle: "",
      supervisor: "",
      status: "In Progress",
      regYear: "2019",
    },
  ]);

  // BS & HSS Scholars
  await db.insert(rdScholars).values([
    {
      deptId: bshssId,
      scholarName: "Narsipuram Kishore Kumar",
      rollNo: "",
      researchTitle: "Algebra",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "U. Sarat",
      rollNo: "",
      researchTitle: "Algebra",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. D. Appa Rao",
      rollNo: "",
      researchTitle: "Mathematical Modeling",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Ravi Shankar Battina",
      rollNo: "",
      researchTitle: "Algebra",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Uma Shankar",
      rollNo: "",
      researchTitle: "Operations Research",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. G. Kiran Kumar",
      rollNo: "",
      researchTitle: "Mathematical Modeling",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Koti Babu Kornu",
      rollNo: "",
      researchTitle: "Fluid Dynamics",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Satish Kumar Ravupalli",
      rollNo: "",
      researchTitle: "Fluid Dynamics",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "M. Bala Prabhakar",
      rollNo: "",
      researchTitle: "Algebra",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "V. Venkata Kumar",
      rollNo: "",
      researchTitle: "Algebra",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "M.V. Rama Krishna",
      rollNo: "",
      researchTitle: "Mathematical Modeling",
      supervisor: "Dr. S. Kalesha Vali",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Ms. P. Devi",
      rollNo: "15022PMG07",
      researchTitle: "HRD Practices in Corporate Hospitals in selected districts",
      supervisor: "Dr. P. Sreedevi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Pavan Kumar",
      rollNo: "",
      researchTitle: "A study on Management Education and Engineering Education in selected areas",
      supervisor: "Dr. P. Sreedevi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Y. Venkateswara Rao",
      rollNo: "",
      researchTitle: "Corporate Social Responsibility with special reference to TATA Trusts",
      supervisor: "Dr. P. Sreedevi",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Murthy Gamani",
      rollNo: "",
      researchTitle: "Stability analysis of ecological models with time delay",
      supervisor: "Dr. A.V. Papa Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mrs. G A Laxmi",
      rollNo: "",
      researchTitle: "Stability analysis of some ecological models",
      supervisor: "Dr. A.V. Papa Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. D. Apparao (co-supervisor)",
      rollNo: "",
      researchTitle: "Dynamics of epidemic models with delay",
      supervisor: "Dr. A.V. Papa Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. K. Kranthi Kumar",
      rollNo: "",
      researchTitle: "MHD models in fluid dynamics",
      supervisor: "Dr. A.V. Papa Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mrs. G. Laxmi",
      rollNo: "",
      researchTitle: "Fuzzy Algebra",
      supervisor: "Dr. A.V. Papa Rao",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. N. V. Venugopal",
      rollNo: "",
      researchTitle: "Nuclear Analytical techniques",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. Ch. Venkata Rao Chowdary",
      rollNo: "15022PP/Y09",
      researchTitle: "Nano Materials",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. B. Srinivasa Rao",
      rollNo: "15022PP/Y07",
      researchTitle: "Characterization of Ferrites",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. P. Sateesh",
      rollNo: "15022PP/Y03",
      researchTitle: "Material Science",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. G. Durga Babu",
      rollNo: "15022PP/Y02",
      researchTitle: "Crystal growth and structures",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
    {
      deptId: bshssId,
      scholarName: "Mr. S. Srikanth",
      rollNo: "13022PPY04",
      researchTitle: "Accelerator based x-ray emission techniques",
      supervisor: "Dr. G.J. Naga Raju",
      status: "In Process",
      regYear: "",
    },
  ]);

  console.log("✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
