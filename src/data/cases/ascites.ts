import { Case } from "../../types";

export const ascitesCase: Case = {
  id: "ascites-001",
  name: "Ascites",
  specialty: "Gastroenterology",
  difficulty: "Medium",
  time: "10 mins",
  patient: {
    name: "Ahmed Moussa",
    age: 58,
    gender: "Male",
    occupation: "Retired Farmer",
    chiefComplaint: "Abdominal swelling for 2 months",
    vitals: {
      bp: "110/70 mmHg",
      hr: "85 bpm",
      rr: "18 bpm",
      temp: "37.1 °C",
      oxygen: "96%",
    },
  },
  history: {
    presentIllness: "Gradual abdominal distension over 2 months. Associated with ankle swelling. there is yellowish discoloration jaundice. Decreased appetite and weight loss. Has history of hematemesis 1 year ago.",
    pastHistory: "Known patient of Chronic Hepatitis C (HCV) diagnosed 10 years ago. No diabetes or hypertension.",
    drugHistory: "Takes diuretics occasionally, and some local painkillers for knee pain.",
    familyHistory: "No similar condition in family.",
    socialHistory: "Retired, formerly worked in farming (Bilharziasis exposure as a child). Nonsmoker.",
  },
  examination: {
    inspection: "Abdomen: Symetrically distended abdomen with full flanks and an everted umbilicus. Extremities: Bilateral pitting lower limb edema. Hands: Palmar erythema and leukonychia are visible. Eyes: Mild scleral icterus (jaundice).",
    inspectionImage: "/ascites_distended_abdomen.everted_umbilicus.jpg, /bilateral_pitting_edema_leg.jpg, /Jaundice_.jpg, /leukonychia_hand.jpg, /palmar_erythema_hand.jpg",
    palpation: "Soft, no tenderness. Liver is shrunken (hard to palpate). Spleen is palpable 3 cm below costal margin (splenomegaly).",
    palpationVideo: "/liver palpation.mp4, /spleen palpation.mp4",
    percussion: "Dullness over flanks. Shifting dullness is positive.",
    percussionVideo: "/shiftting dullness.mp4",
    auscultation: "Normal bowel sounds.",
    specialTests: [
      { name: "Fluid Thrill", finding: "Positive (indicating massive ascites)", video: "/fluid thrill.mp4" },
      { name: "Renal Examination", finding: "No palpable renal enlargement. Both kidneys are non-palpable and non-ballotable.", video: "/bimanual kidney palpation.mp4" }
    ],
  },
  investigations: [
    { name: "CBC", result: "Hb: 10.5 g/dL (Low), WBC: 4.2, Platelets: 95,000 (Low - suggestive of hypersplenism)" },
    { name: "ALT/AST", result: "ALT: 55 U/L, AST: 62 U/L (Mildly elevated)" },
    { name: "Albumin", result: "2.4 g/dL (Low - Hypoalbuminemia)" },
    { name: "PT/INR", result: "INR: 1.5 (Prolonged)" },
    { name: "Abdominal US", result: "Liver: Shrunken with irregular borders (Cirrhotic). Spleen: Congestive splenomegaly. Abdomen: Massive free fluid (Ascites). Portal vein diameter: 14mm (Dilated)." },
  ],
  diagnosis: {
    provisional: "Decompensated Liver Cirrhosis with Ascites",
    differentials: ["Malignancy-related ascites", "Congestive Heart Failure", "Nephrotic Syndrome", "Tuberculous Peritonitis"],
    management: "Bed rest, salt restriction (2g/day), Diuretics (Spironolactone + Furosemide), Therapeutic paracentesis if needed, Screen for HCC (AFP + US), Manage underlying cause (HCV therapy if stable).",
  },
  checklist: [
    { item: "Asked about duration of swelling", category: "History" },
    { item: "Asked about history of jaundice", category: "History" },
    { item: "Asked about history of hematemesis/melena", category: "History" },
    { item: "Asked about Schistosomiasis/Bilharziasis history", category: "History" },
    { item: "Performed Shifting Dullness correctly", category: "Examination" },
    { item: "Checked for fluid thrill", category: "Examination" },
    { item: "Commented on umbilicus position", category: "Examination" },
    { item: "Ordered LFT and Ultrasound", category: "Reasoning" },
    { item: "Gave correct provisional diagnosis", category: "Reasoning" },
    { item: "Maintained professional empathy", category: "Communication" },
  ],
  examinerQuestions: [
    {
      id: "viva-1",
      question: "What is the value of pulse examination in an abdominal case?",
      sampleAnswer: "To detect tachycardia & hyperdynamic circulation (which occur in liver cell failure due to vasodilators) or bradycardia (which occurs characteristically in obstructive jaundice)."
    },
    {
      id: "viva-2",
      question: "What are the causes of congested neck veins in an abdominal case?",
      sampleAnswer: "Tense ascites, pleural effusion, or pericardial effusion."
    },
    {
      id: "viva-3",
      question: "What are the causes of clubbing in an abdominal case?",
      sampleAnswer: "Crohn's disease, Bilharzial polyposis, Ulcerative colitis, Intestinal steatorrhea, and Biliary cirrhosis."
    },
    {
      id: "viva-4",
      question: "What are the signs of vascular decompensation (portal hypertension)?",
      sampleAnswer: "1. Splenomegaly, 2. Ascites, 3. Portosystemic anastomosis such as gastroesophageal varices."
    },
    {
      id: "viva-5",
      question: "What are the manifestations of Liver Cell Failure (LCF) / parenchymatous decompensation?",
      sampleAnswer: "Low-grade fever, fetor hepaticus, flapping tremors, fatigue, jaundice, encephalopathy, ascites, skin changes, white nails (due to hypoproteinemia), endocrinal changes (gynecomastia, testicular atrophy, feminine pubic hair distribution), blood changes (anemia, bleeding tendency), CVS changes (hyperdynamic circulation), and kidney failure (hepatorenal failure)."
    },
    {
      id: "viva-6",
      question: "What are the clinical signs of ascites on examination?",
      sampleAnswer: "Inspection: Generalized abdominal distension with fullness in flanks, and an umbilicus that is bulged and shifted downward. Palpation: Transmitted thrill. Percussion: Shifting dullness. Auscultation: Puddle sign. Sonar: If clinically not evident. Can also find fullness in Douglas pouch on PV exam."
    },
    {
      id: "viva-7",
      question: "What is the definition, mechanism, distribution, and DD of spider naevi?",
      sampleAnswer: "Definition: A central dilated arteriole with radiating capillaries that fades on pressure and refills from the center when released. Mechanism: Due to increased vasodilators like Nitric Oxide (NO) or hyperestrogenism. Distribution: Upper half of the body (course of SVC). DD: Insect bites (raised, itchy, no fading, on exposed areas) and Purpura (not raised, not itchy, no fading, common in lower limbs)."
    },
    {
      id: "viva-8",
      question: "What are the causes and description of palmar erythema?",
      sampleAnswer: "It is redness of the thenar, hypothenar, distal ends of metacarpal bones, and pulp of fingers with central pallor. Causes: Pregnancy, Thyrotoxicosis, LCF, and estrogen-containing contraceptive pills."
    },
    {
      id: "viva-9",
      question: "What are the causes of an obtuse subcostal angle?",
      sampleAnswer: "Normal angle is acute to right (70-90°). It becomes obtuse due to long-standing upper abdominal swelling (Hepatosplenomegaly), Ascites, or a barrel-shaped chest."
    },
    {
      id: "viva-10",
      question: "What cause divarication of recti?",
      sampleAnswer: "Chronic increase of the intra-abdominal pressure (due to hepatosplenomegaly or ascites) combined with hypoproteinemia."
    },
    {
      id: "viva-11",
      question: "What are the causes of visible peristalsis?",
      sampleAnswer: "Pyloric obstruction, intestinal obstruction, or it can be normal in a very thin person."
    },
    {
      id: "viva-12",
      question: "What are the causes of abnormal distribution of suprapubic hair?",
      sampleAnswer: "Normal is triangular in males (apex upward) and horizontal in females. Abnormalities include LCF (feminine distribution in males) and hypogonadism (loss of hair)."
    },
    {
      id: "viva-13",
      question: "What abnormalities can be found during external genitalia examination in abdominal cases?",
      sampleAnswer: "Testicular atrophy (due to liver cirrhosis), scrotal edema (liver failure or nephrotic syndrome), hydrocele (due to ascites), varicocele (due to intra-abdominal tumor), and a beaded spermatic cord."
    },
    {
      id: "viva-14",
      question: "What is gynecomastia, how is it confirmed, and what causes it in liver cases?",
      sampleAnswer: "It is hyperplasia of the glandular component of the male breast, confirmed by the pinching test as a button-like disc. It presents as a sign of LCF or is caused by Spironolactone usage."
    },
    {
      id: "viva-15",
      question: "Differentiate between the causes of symmetrical and asymmetrical abdominal bulging.",
      sampleAnswer: "Symmetrical (6Fs): Fat/obesity (sunken umbilicus), Flatus/gases, Fetus, Fluid/Ascites, Full urinary bladder, and Fibroid tumor. Asymmetrical: Organ swelling (Hepatosplenomegaly) or ovarian/uterine tumor."
    },
    {
      id: "viva-16",
      question: "What is the difference between a visible vein and a dilated vein?",
      sampleAnswer: "Visible: Straight, narrow, and not raised. Dilated: Tortuous, wide, and raised above the level of the skin."
    },
    {
      id: "viva-17",
      question: "Differentiate between portal and systemic dilated veins below the umbilicus using the milking test.",
      sampleAnswer: "Portal (Caput medusae): Central site, and milking test shows filling away from the umbilicus. Systemic (IVC obstruction): Peripheral site, and milking test shows filling from down to up."
    },
    {
      id: "viva-18",
      question: "What do scratch marks indicate and what is their description?",
      sampleAnswer: "They denote pruritus, usually associated with obstructive jaundice. They are multiple, parallel, and superficial in accessible areas."
    },
    {
      id: "viva-19",
      question: "What are the aims of superficial palpation?",
      sampleAnswer: "To gain patient confidence, check for tenderness or rigidity, assess skin temperature, and detect superficial masses."
    },
    {
      id: "viva-20",
      question: "Define Guarding, Rigidity, and Rebound tenderness in abdominal examination.",
      sampleAnswer: "Guarding: Muscles contract as pressure is applied. Rigidity: Rigid abdominal wall indicating peritoneal inflammation. Rebound: Release of pressure causes sudden sharp pain."
    },
    {
      id: "viva-21",
      question: "What normal structures can be palpated in a healthy abdomen?",
      sampleAnswer: "Sigmoid colon in the LLQ (firm, narrow tube), Cecum and ascending colon in the RLQ (softer, wider tube), and pulsations of the abdominal aorta in the midline upper abdomen."
    },
    {
      id: "viva-22",
      question: "What is the surface anatomy of the liver (Upper and Lower borders)?",
      sampleAnswer: "Upper border: Left mid-clavicular line (MCL) 5th intercostal space, Right MCL 5th rib, Right mid-axillary line (MAL) 7th rib, Right scapular line 9th rib. Lower border: Left MCL 5th intercostal space, Left 8th costal cartilage midway between xiphisternum & umbilicus, Right 9th costal cartilage, and Right MCL 1 inch below the costal margin."
    },
    {
      id: "viva-23",
      question: "What are the causes of a tender liver?",
      sampleAnswer: "Congested liver (right-sided heart failure), inflamed liver (acute hepatitis), abscess, or malignancy infiltrating the capsule."
    },
    {
      id: "viva-24",
      question: "What is the liver span and its normal values?",
      sampleAnswer: "It is the vertical distance in cm in the mid-clavicular line between the upper and lower borders of the liver. Normally it is 8-12 cm."
    },
    {
      id: "viva-25",
      question: "What is the surface anatomy of the spleen?",
      sampleAnswer: "Located in the left hypochondrium, resting under the 9th, 10th, and 11th ribs, with its long axis lying on the 10th rib. Medially bounded by the scapular line and laterally by the mid-axillary line (MAL)."
    },
    {
      id: "viva-26",
      question: "What are the causes of hepatomegaly?",
      sampleAnswer: "Infective (viral like hepatitis/CMV, bacterial like abscess/typhoid, parasite like malaria/bilharziasis), Malignant (primary HCC or secondary metastasis), Hematological (leukemia, lymphomas, thalassemia), Metabolic (amyloidosis, fatty liver, hemochromatosis), Immunological (SLE, RA), and Congestive (right-sided HF, veno-occlusive disease, TR/TS)."
    },
    {
      id: "viva-27",
      question: "What are the causes of splenomegaly?",
      sampleAnswer: "Infective (viral hepatitis/IMN, bacterial endocarditis/septicemia/typhoid, parasite malaria/schistosomiasis), Malignant (lymphomas, splenic sarcoma), Hematological (leukemias, polycythemia vera), Metabolic (amyloidosis), Immunological (SLE, RA), and Portal Hypertension."
    },
    {
      id: "viva-28",
      question: "What are the causes of huge splenomegaly (crossing the midline)?",
      sampleAnswer: "Beta-thalassemia major, Chronic Malaria, Chronic Myeloid Leukemia (CML), Kala-azar, Polycythemia vera, Splenic sarcoma, and myeloproliferative disorders (myelosclerosis), as well as congestive splenomegaly from portal hypertension caused by periportal bilharzial fibrosis."
    },
    {
      id: "viva-29",
      question: "What are the causes of multiple splenic notches?",
      sampleAnswer: "Multiple splenic infarctions or congenital variation."
    },
    {
      id: "viva-30",
      question: "What are the causes of an absent splenic notch?",
      sampleAnswer: "Congenital variation, malignancy, adhesions, or tumors."
    },
    {
      id: "viva-31",
      question: "Differentiate completely between a splenic swelling and a left renal swelling.",
      sampleAnswer: "Splenic swelling: Cannot insinuate fingers between costal margin and swelling, has a pathognomonic notch, the renal angle is empty, negative posterior ballotment, smooth surface, sharp edge, and is completely dull to percussion. Left renal swelling: Can insinuate fingers, has no notch, full renal angle, positive posterior ballotment, bossy surface, rounded edge, and shows a resonant band of colonic gas over it."
    },
    {
      id: "viva-32",
      question: "Differentiate between Transudative and Exudative causes of ascites.",
      sampleAnswer: "Transudate: Right-sided heart failure, Nephritic syndrome, Myxedema, and LCF. Exudate: Pancreatitis, TB peritonitis, Malignancy, and Budd-Chiari syndrome."
    },
    {
      id: "viva-33",
      question: "What is the value of auscultation in an abdominal examination?",
      sampleAnswer: "To assess intestinal sounds (bowel sounds), vascular sounds (venous hum, arterial bruits like a renal bruit), scratch test for liver size, succession splash, puddle sign for minimal ascites, and friction rubs."
    },
    {
      id: "viva-34",
      question: "What is the value of a digital rectal examination (PR) in an abdominal case?",
      sampleAnswer: "Sphincter tone evaluation (lost in Cauda equina), checking contents (hard impacted stools, foreign bodies), rectal wall evaluation (pelvic masses in women like ovary/uterus, irregular cancer mass or complicated piles), prostate evaluation (BPH is smooth/large/firm/non-tender, Cancer is hard/irregular, Acute prostatitis is large/boggy/tender), and stool inspection (bloody in hemorrhoids/rectal lesions, black/melena in upper GI bleeding)."
    },
    {
      id: "viva-35",
      question: "What investigations should be ordered for a liver case?",
      sampleAnswer: "Liver enzymes (ALT, AST, ALP), Bilirubin (total, direct, indirect), Plasma proteins (albumin, globulin, A/G ratio), Hepatitis markers, Abdominal sonar, Liver biopsy, and Endoscopy (upper GIT for varices, lower GIT for piles and bilharzial polyps)."
    },
    {
      id: "viva-36",
      question: "Define Liver Cirrhosis and state its types/causes.",
      sampleAnswer: "Definition: Chronic liver disease characterized by diffuse degeneration followed by nodular regeneration and fibrosis, leading to irreversible loss of normal architecture. Types/Causes: Post-hepatitis (B & C), Hemochromatosis, Alcoholic, Cardiac cirrhosis (right-sided HF), Biliary cirrhosis, Bilharziasis, Wilson's disease, and drugs like Methotrexate, Amiodarone, or INH."
    },
    {
      id: "viva-37",
      question: "What are the causes of portal hypertension classified anatomically?",
      sampleAnswer: "Pre-sinusoidal: Portal vein stenosis, portal vein thrombosis, or periportal fibrosis (bilharziasis). Sinusoidal: Liver cirrhosis and acute hepatitis. Post-sinusoidal: Veno-occlusive disease, Budd-Chiari syndrome, IVC obstruction, and constrictive pericarditis."
    },
    {
      id: "viva-38",
      question: "Define hypersplenism.",
      sampleAnswer: "An exaggeration of the pooling and phagocytic activity of the spleen leading to pancytopenia or reduction of peripheral blood lines in the presence of a hyperplastic bone marrow."
    },
    {
      id: "viva-39",
      question: "What is the medical management regimen for ascites?",
      sampleAnswer: "Bed rest, dietary salt restriction, high protein/low salt diet, salt-free albumin infusion combined with diuretics (Spironolactone and Furosemide in a 100:40 ratio), and therapeutic abdominal tapping (paracentesis)."
    },
    {
      id: "viva-40",
      question: "Describe the staging of hepato-splenomegaly in a bilharzial or mixed case.",
      sampleAnswer: "Grade 1: Hepatomegaly only. Grade 2: Hepatosplenomegaly. Grade 3: Splenomegaly with a shrunken liver. Grade 4: Splenomegaly + shrunken liver + ascites."
    },
    {
      id: "viva-41",
      question: "What is the difference in causes between stria alba and stria rubra?",
      sampleAnswer: "Stria alba: Tense ascites, marked obesity, or repeated pregnancy. Stria rubra: Increased cortisone levels (Cushing's syndrome)."
    },
    {
      id: "viva-42",
      question: "Why does the spleen enlarge characteristically toward the right iliac fossa (RIF)?",
      sampleAnswer: "Because its downward expansion is physically obstructed by the presence of the phrenico-colic ligament."
    },
    {
      id: "viva-43",
      question: "What causes vertical enlargement of the spleen?",
      sampleAnswer: "Congenitally absent ligament, surgically removed ligament, huge splenomegaly, or direct infiltration of the ligament."
    },
    {
      id: "viva-44",
      question: "What are the common causes of hematemesis in Egypt?",
      sampleAnswer: "Rupture of esophageal varices and peptic ulcers are the two most common causes. Other causes include gastric carcinoma, bleeding tendencies, Mallory-Weiss syndrome/tears, and gastritis."
    },
    {
      id: "viva-45",
      question: "How do we clinically detect different amounts of ascites?",
      sampleAnswer: "Minimal (<500ml): Detected by Ultrasound. Mild (500-1500ml): Detected by knee-elbow position. Moderate (1500-3000ml): Detected by shifting dullness. Tense (>3000ml): Detected by transmitted thrill."
    },
    {
      id: "viva-46",
      question: "What are the causes of an everted umbilicus?",
      sampleAnswer: "Ascites and severe organomegaly."
    },
    {
      id: "viva-47",
      question: "What are the causes of ascites precox?",
      sampleAnswer: "Pericardial effusion, constrictive pericarditis, tricuspid regurgitation (T.R.), and tricuspid stenosis (T.S.)."
    },
    {
      id: "viva-48",
      question: "How do you diagnose a shrunken spleen manually?",
      sampleAnswer: "Using the Hooking method, where the doctor stands specifically on the left side of the patient."
    },
    {
      id: "viva-49",
      question: "What causes enlargement of the scalene and pre-auricular lymph nodes?",
      sampleAnswer: "Scalene node: Lung cancer. Pre-auricular node: Generalized lymphadenopathy, metastasis, parotitis, or parotid malignancy."
    },
    {
      id: "viva-50",
      question: "What causes tender lymph nodes versus generalized lymphadenopathy?",
      sampleAnswer: "Tender L.Ns: Infection, allergy, or autoimmune flare. Generalized Lymphadenopathy: Infections (viral, bacterial, TB, Toxoplasma), Malignancy (CLL, lymphoma, metastasis), Autoimmune (SLE), or drugs like Phenytoin."
    },
    {
      id: "viva-51",
      question: "What is Virchow's node and when does it enlarge?",
      sampleAnswer: "It is an enlarged Left Supraclavicular lymph node, which indicates metastasis from a gastrointestinal (GIT) malignancy."
    },
    {
      id: "viva-52",
      question: "Define dysphagia and odynophagia.",
      sampleAnswer: "Dysphagia: Difficulty with swallowing. Odynophagia: Pain with swallowing, commonly associated with conditions like AIDS."
    },
    {
      id: "viva-53",
      question: "Where should you look to clinically examine for jaundice?",
      sampleAnswer: "In the skin, sclera, and mucous membranes."
    },
    {
      id: "viva-54",
      question: "Differentiate between Hemolytic, Hepatocellular, and Obstructive jaundice regarding urine, stool, color, and pruritus.",
      sampleAnswer: "Hemolytic: Lemon yellow skin, normal urine, dark stool, no pruritus. Hepatocellular: Orange-yellow skin, dark urine, pale stool, mild/variable pruritus. Obstructive: Greenish-olive skin, dark urine, completely pale/clay-colored stool, severe pruritus with prominent scratch marks."
    }
  ]
};
