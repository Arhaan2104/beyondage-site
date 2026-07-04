/**
 * The Bench — individual specialist profiles.
 *
 * Every field is sourced from the physician's own profile page on
 * beyondage.health/our-team. Credentials, roles, education and awards are
 * verbatim facts; the "About" prose condenses the source bio to its factual
 * substance without adding claims. No invented content. Dr Vritti Loomba has
 * no profile page on the live site and is intentionally not included here.
 */

export type TeamMember = {
  slug: string; // matches the live-site slug and our internal /our-team route
  img: string; // /assets/team/{img}.png
  name: string;
  category: string; // specialty area (the bench label)
  role: string; // title / position
  founder?: boolean;
  credentials: string[]; // degrees & qualifications
  bio: string[]; // factual "About" paragraphs
  focus?: string[]; // areas of interest / specialty interests
  awards?: string[]; // awards & achievements
};

const MEMBERS: TeamMember[] = [
  {
    slug: "dr-arvind-soin",
    img: "founder-soin",
    name: "Dr Arvinder Soin",
    category: "Liver & Metabolic Health",
    role: "Founder & Chairman",
    founder: true,
    credentials: [
      "MBBS — AIIMS, New Delhi, 1985",
      "FRCS (General Surgery) — Royal College of Physicians and Surgeons, Glasgow, 1993",
      "Intercollegiate FRCS (Transplant Surgery), 1997",
    ],
    bio: [
      "Dr Arvinder Soin, a Padma Shri awardee and world-renowned liver-transplant surgeon, has spent over three decades transforming liver care in India and beyond. A pioneer in the field, he performed India’s first successful liver transplant in 1998, and has since performed India’s highest number — nearly 5,000 liver transplants.",
      "He has launched liver-transplant programmes at 23 centres, authored over 270 research publications, delivered more than 1,400 invited lectures worldwide, and received numerous national and international honours — all a testament to his clinical leadership and contributions to transplant science.",
      "Having treated critically ill patients throughout his career, Dr Soin now works at the other end of the spectrum: to prevent people from ever reaching that stage. Longevity medicine and healthspan optimisation is his new focus, and he applies the same rigour and precision that defined his transplant work — convinced that the future of medicine lies in early prediction and detection, prevention, and personalised care.",
    ],
    awards: ["Padma Shri"],
  },
  {
    slug: "dr-vinayak-agarwal",
    img: "vinayak",
    name: "Dr Vinayak Agrawal",
    category: "Preventive Cardiology",
    role: "Medical Director & Director, Preventive Cardiology",
    credentials: ["MBBS", "MD — Medicine", "DNB — Cardiology"],
    bio: [
      "Dr Vinayak Agrawal brings more than 24 years of experience across non-invasive, clinical and interventional cardiology. After his initial internal-medicine training, he also spent nearly a year and a half in neurology following his MD in Medicine.",
      "An alumnus of Maulana Azad Medical College and University College of Medical Sciences, New Delhi, he began as a consultant cardiologist at Escorts Heart Institute and Research Centre. As part of the core inception group, he then joined Medanta, The Medicity for ten years — his last role there being Associate Director, Cardiology — before moving to Pushpawati Singhania Research Institute (PSRI), Saket, as Director & Head of Clinical Cardiology and Cardiac Imaging in 2019.",
    ],
    focus: [
      "Early heart-disease detection",
      "Integrated Community Cardiology Clinic",
      "Sports Cardiology Clinic",
      "Cardio-oncology",
      "Transplant Cardiology",
    ],
    awards: [
      "Fellow of the American Society of Echocardiography (FASE)",
      "Fellow of the American Heart Failure Association (FAHA)",
      "Fellowship of the American College of Cardiology (FACC)",
    ],
  },
  {
    slug: "dr-ambrish-mithal",
    img: "mithal",
    name: "Dr Ambrish Mithal",
    category: "Metabolic Health",
    role: "Senior Advisor — Metabolic, Hormone & Longevity Medicine",
    credentials: [
      "MBBS — Kanpur University, 1980",
      "MD — Kanpur University, 1984",
      "DM (Endocrinology) — AIIMS, New Delhi, 1987 (the first DM in Endocrinology from AIIMS)",
    ],
    bio: [
      "Dr Ambrish Mithal is one of the most renowned names in endocrinology and a widely respected thought leader in the medical community. He is Chairman and Head of Endocrinology and Diabetes at Max Healthcare, a role he has held since December 2019. Earlier, he was Chairman of the Division of Endocrinology and Diabetes at Medanta — The Medicity (2009–2019), where he led and significantly expanded the department; his earlier associations include Apollo Hospital, New Delhi, and the Sanjay Gandhi Postgraduate Institute of Medical Sciences, Lucknow.",
      "He completed his MBBS (1980) and MD (1984) at Kanpur University, followed by a DM in Endocrinology (1987) at AIIMS, New Delhi, and was a Fogarty Fellow at Harvard Medical School (1993–94). He has been nominated to the Governing Council of the National Health Authority and serves as Honorary President of AIIMS, Gorakhpur.",
    ],
    awards: [
      "Padma Bhushan, 2015 — India’s third-highest civilian honour",
      "Endocrine Society (USA) International Excellence in Endocrinology Award, 2020",
      "Endocrine Society Laureate Award, 2021",
      "International Osteoporosis Foundation President’s Award, 2016",
      "Dr B.C. Roy Award, 2017",
    ],
  },
  {
    slug: "dr-manvir-bhatia",
    img: "bhatia",
    name: "Dr Manvir Bhatia",
    category: "Sleep Medicine, Brain Health & Preventive Neurology",
    role: "Senior Advisor & Chief Consultant",
    credentials: [
      "MBBS — Christian Medical College & Hospital, Ludhiana",
      "DM (Neurology) — AIIMS, New Delhi",
    ],
    bio: [
      "Dr Manvir Bhatia is a well-known neurologist and sleep specialist associated with the Neurology and Sleep Centre, Hauz Khas, with 46 years of experience in neurology. She has contributed to numerous complex cases across several hospitals and is known for her precise diagnoses and empathetic care.",
      "She completed her MBBS at Christian Medical College and Hospital, Ludhiana, and her DM in Neurology at AIIMS, New Delhi.",
    ],
    focus: [
      "Sleep Medicine",
      "Sleep Disorders",
      "Electromyography (EMG)",
      "Brainstem Evoked Potentials (BAER)",
      "Somatosensory Evoked Potentials (SSEP)",
      "Repetitive Nerve Stimulation",
      "Neuromuscular Disorders",
    ],
    awards: [
      "Indira Gandhi Mahila Ratan Award",
      "Best prize, ‘10,000 Women’ Entrepreneur Certificate Programme, ISB Hyderabad",
      "AAPIOS (American Association of Physicians of Indian Origin, Boston) — ‘Extraordinary Contribution in Sleep Medicine’, 2017",
    ],
  },
  {
    slug: "dr-navin-dang",
    img: "navin",
    name: "Dr Navin Dang",
    category: "Laboratory Medicine, Diagnostic Strategy & Longevity Biomarkers",
    role: "Senior Advisor",
    credentials: [
      "MBBS — University College of Medical Sciences, Delhi",
      "MD (Medical Microbiology) — PGIMER, Chandigarh",
    ],
    bio: [
      "Dr Navin Dang is the Founder and Director of Dr Dangs Lab LLP, a pioneering diagnostic centre known for its excellence in patient care and laboratory medicine. Since establishing the lab in 1988, he has been instrumental in advancing diagnostic services in India.",
      "He has served on key medical councils and expert committees formed by the Government of India and the Delhi Government. Under his leadership, Dr Dangs Lab was among the first ICMR-approved COVID-19 testing labs and the central laboratory for clinical trials of COVID-19 vaccines.",
    ],
    awards: [
      "Dr B.C. Roy National Award",
      "GAPIO (Global Association of Physicians of Indian Origin) Award",
    ],
  },
  {
    slug: "dr-nitesh-rohtagi",
    img: "rohtagi",
    name: "Dr Nitesh Rohtagi",
    category: "Cancer Prevention, Precision Oncology & Longevity",
    role: "Senior Advisor",
    credentials: [
      "MBBS — University of Delhi, 1998",
      "DNB (Medical Oncology) — University of Delhi, 2000",
    ],
    bio: [
      "Dr Nitesh Rohatgi is Senior Director, Medical Oncology at Fortis Memorial Research Institute, Gurugram. He previously worked at the London Oncology Clinic (Leaders in Oncology Care), Harley Street, London, and is a Fellow of the Royal College of Physicians (Edinburgh, UK) and the Royal Society of Medicine.",
      "A key opinion leader in oncology in India, he has been a Principal Investigator on clinical trials (presently for BIRAC-Oncology), with many publications to his name. He trained in medical oncology, palliative medicine and teenage-and-young-adult cancers in the United Kingdom, completing his CCT in 2009.",
    ],
    focus: [
      "Breast Cancer",
      "Lung Cancer",
      "Gynaecological Cancer",
      "Gastrointestinal & Hepatobiliary Cancers",
      "Brain Tumours",
      "Head & Neck Cancers",
      "Kidney, Bladder & Prostate Cancers",
    ],
  },
  {
    slug: "dr-simal-soin",
    img: "simal",
    name: "Dr Simal Soin",
    category: "Aesthetic Medicine & Anti-Aging",
    role: "Senior Advisor",
    credentials: [
      "MBBS — Government Medical College, Patiala",
      "MPhil — University of Cambridge",
      "Training — St John’s Institute of Dermatology, London",
    ],
    bio: [
      "Dr Simal Soin is a renowned Indian cosmetic dermatologist and founder of the AAYNA Clinic, known for her expertise in anti-aging, lasers and skin health, with over 20 years of experience. She trained at St John’s Institute of Dermatology, London, and the University of Cambridge, and is a prominent Key Opinion Leader in aesthetic medicine in India — combining medical dermatology with cosmetic enhancement.",
    ],
  },
  {
    slug: "dr-anita-somalanka",
    img: "anita",
    name: "Dr Anita Somalanka",
    category: "Longevity & Lifestyle Medicine",
    role: "Chief Longevity Medicine Physician",
    credentials: [
      "MBBS",
      "MD (Social & Preventive Medicine)",
      "DRCOG (UK)",
      "MRCGP",
      "CCT (UK)",
      "Fellowship in Diabetes Mellitus",
      "Lifestyle Medicine (UK)",
      "Applying Functional Medicine in Clinical Practice (USA)",
    ],
    bio: [
      "“As a Longevity & Lifestyle Medicine physician, I empower BeyondAge clients to look and feel their best at every stage of life. Through highly personalised, evidence-based care, I identify and understand unique risks early and offer effective strategies for long-term health. My commitment is to help my clients realise their full potential and lead long, healthy lives.”",
    ],
  },
  {
    slug: "dr-arjun-dang",
    img: "arjun",
    name: "Dr Arjun Dang",
    category: "Healthspan & Functional Lab Diagnostics",
    role: "Chief Consultant",
    credentials: [
      "MBBS — Sri Ramachandra Medical College, Chennai",
      "MD (Pathology) — Sri Ramachandra Medical College, Chennai",
      "Fellowship in Liver Pathology — King’s College Hospital, London",
      "Certification in Allergy & Immunology — EAACI",
    ],
    bio: [
      "Dr Arjun Dang is CEO & Partner of Dr Dangs Lab, New Delhi — one of India’s most reputed standalone diagnostic centres. His experience includes serving as a Senior Resident in specialised haematology at Lady Hardinge Medical College and as a Research Fellow in histopathology at Indraprastha Apollo Hospital, New Delhi.",
      "Certified in Allergy and Immunology by the EAACI, he is recognised for his expertise in gastrointestinal disorders, allergy diagnostics and personalised testing panels. He is a national thought leader in specialised diagnostics — including component-resolved diagnostics (CRD) for allergies under the AllergyniusDx brand, and Dendrite Dx, an advanced Alzheimer’s and cognitive-health initiative — and an active researcher across laboratory diagnostics, oncopathology, allergy testing and precision medicine.",
    ],
    focus: [
      "Gastrointestinal Disorders",
      "Allergy Diagnostics",
      "Component-Resolved Diagnostics",
      "Functional & Esoteric Testing",
    ],
  },
  {
    slug: "dr-anshika-gupta",
    img: "anshika",
    name: "Dr Anshika Gupta",
    category: "Longevity & Functional Medicine",
    role: "Longevity Medicine Consultant",
    credentials: ["MBBS — Kasturba Medical College, Manipal", "MRCP (UK)", "Functional Medicine — IFM"],
    bio: [
      "Dr Anshika Gupta is an MBBS graduate of Kasturba Medical College, Manipal, and holds the MRCP (UK) qualification. With three years of clinical experience in the NHS, she has managed a diverse range of cases — especially those involving metabolic disorders, autoimmune conditions and complex gut-health issues.",
      "Certified in Functional Medicine by the Institute for Functional Medicine (IFM), she integrates root-cause, patient-centric care into her practice.",
    ],
  },
  {
    slug: "ms-monique-jhigon",
    img: "monique",
    name: "Monique Jhingon",
    category: "Gut & Microbiome Optimization",
    role: "Director of Functional Nutrition & Micro-biomics",
    credentials: ["MSc, Personalised Nutrition — Middlesex University"],
    bio: [
      "Monique Jhingon is a Functional Nutrition & Lifestyle Consultant with over 12 years of experience and a master’s degree in Personalised Nutrition. She holds certifications in Functional Nutrition & Lifestyle Counselling, Functional Root-Cause Diagnostic Testing, Nutrigenetics, Gut & Microbiome Restoration, Yoga and more.",
    ],
  },
  {
    slug: "dr-nidhi-arora",
    img: "nidhi",
    name: "Dr Nidhi Arora",
    category: "Musculoskeletal Rehabilitation",
    role: "Head — MSK Optimisation",
    credentials: [
      "Bachelor of Physical Therapy (CMT)",
      "Manual Therapist",
      "Pregnancy Fitness Educator (CAPPA)",
      "Red Mat Pilates Instructor",
      "GEL Instructor",
      "Strength & Conditioning Coach",
    ],
    bio: [
      "Dr Nidhi Arora is an accomplished physical therapist with over 18 years of clinical experience across medical training therapy and rehabilitation, clinical operations and team leadership. With a strong focus on musculoskeletal health, injury and fall prevention and functional fitness, her integrative approach blends manual therapy, functional movement, strength training and bone-and-muscle health into personalised, evidence-based care.",
      "She has led advanced rehabilitation at Serensa Health as Business Unit Head, served as project lead at Medanta Hospital for PMR-led protocols, driven sport-science centres for Abhinav Bindra Targeting Performance, and been a lead team member at the German sports-medicine centre AktivHealth.",
    ],
  },
];

export const TEAM: Record<string, TeamMember> = Object.fromEntries(
  MEMBERS.map((m) => [m.slug, m])
);

export const TEAM_ORDER: string[] = MEMBERS.map((m) => m.slug);

export function teamNeighbours(slug: string, count = 3): TeamMember[] {
  const i = TEAM_ORDER.indexOf(slug);
  const out: TeamMember[] = [];
  for (let k = 1; out.length < count && k < TEAM_ORDER.length; k++) {
    const m = MEMBERS[(i + k) % MEMBERS.length];
    if (m.slug !== slug) out.push(m);
  }
  return out;
}
