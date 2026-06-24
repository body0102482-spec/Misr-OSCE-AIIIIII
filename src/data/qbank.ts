export interface QBankQuestion {
  id: string;
  discipline: "internal_medicine" | "surgery" | "pediatrics" | "ob_gyn";
  system: "gastroenterology" | "cardiology" | "chest" | "nephrology" | "endocrinology" | "general_surgery" | "neonatology" | "gynecology" | "obstetrics";
  topic: string;
  questionCode: string;
  vignette: string;
  questionText: string;
  options: {
    key: string;
    text: string;
  }[];
  correctOption: string;
  explanation: {
    correctMsg: string;
    incorrectOptions: { [key: string]: string };
    highYieldPearl: string;
  };
  difficulty: "Easy" | "Medium" | "Hard";
  source: "lange" | "bailey" | "zatona" | "ain_shams" | "kasr_el_ainy";
}

export const qbankQuestions: QBankQuestion[] = [
  // Cardiology
  {
    id: "cardio-001",
    discipline: "internal_medicine",
    system: "cardiology",
    topic: "Infective Endocarditis",
    questionCode: "MUST-CARDIO-001",
    vignette: "A 24-year-old Egyptian male, with a known history of Rheumatic Heart Disease (Severe Mitral Regurgitation), presents to Kafr El-Sheikh University Hospital with a 3-week history of fluctuating low-grade fever, general malaise, and dull left upper quadrant abdominal discomfort. On physical examination, temperature is 38.2°C, and a new high-pitched pan-systolic murmur radiating to the axilla is noted. Splenomegaly is palpable, and a painless hemorrhagic spot is observed in the palmar skin of his left hand.",
    questionText: "Which of the following Pathological signs is matching the painless spots on his palms, and what is the primary diagnostic investigation according to the modified Duke criteria?",
    options: [
      { key: "A", text: "Osler nodes (Immunological phenomenon); Transesophageal Echocardiogram (TEE)" },
      { key: "B", text: "Janeway lesions (Vascular micro-emboli); Three independent sets of Blood Cultures" },
      { key: "C", text: "Roth spots (Ocular hemorrhage); Erythrocyte Sedimentation Rate (ESR)" },
      { key: "D", text: "Splinter hemorrhages (Trauma-related); Serial Electrocardiograms (ECGs)" },
      { key: "E", text: "Janeway lesions (Immunological phenomenon); Transthoracic Echocardiogram (TTE) only" }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The painless hemorrhagic hand lesions described are Janeway lesions, which are vascular phenomena (septic micro-emboli). According to the Modified Duke Criteria, the essential first-line diagnostic pillars include Serial Blood Cultures (at least 3 independent sets from different sites spaced out) and Echocardiography.",
      incorrectOptions: {
        A: "Osler nodes are tender, painful, nodules representing immunological complexes, whereas Janeway lesions are painless and caused by septic emboli.",
        C: "Roth spots are retinal hemorrhages with pale centers, not palmar cutaneous spots.",
        D: "Splinter hemorrhages occur under nail beds, not on palmar surfaces.",
        E: "Janeway lesions are caused by micro-emboli (vascular phenomena), not immunological complexes."
      },
      highYieldPearl: "💡 خلاصة الـ MUST للامتحانات: تذكر دائمًا Janeway = painless & vascular emboli بينما Osler nodes = painful & immunological. مسموح لتشخيص الـ Endocarditis بثلاث مزارع دم مستقلة لفصل الميكروب المستمر."
    },
    difficulty: "Medium",
    source: "lange"
  },
  {
    id: "cardio-002",
    discipline: "internal_medicine",
    system: "cardiology",
    topic: "Mitral Stenosis & Atrial Fibrillation",
    questionCode: "MUST-CARDIO-002",
    vignette: "A 48-year-old Egyptian female complains of worsening exertional dyspnea (NYHA Class III) and sudden irregular palpitation of 2 days duration. She has a childhood history of recurrent sore throat treated with traditional therapies. Cardiac auscultation reveals an irregular pulse, a loud S1, an opening snap, and a low-pitched mid-diastolic rumbling murmur at the apex.",
    questionText: "What is the most common predisposing risk of her acute palpitations, and which initial therapeutic regimen should be instituted immediately to protect against thromboembolism?",
    options: [
      { key: "A", text: "Ventricular tachycardia secondary to mitral valve calcification; Amiodarone loading dose." },
      { key: "B", text: "Atrial fibrillation due to left atrial enlargement; Oral Anticoagulation (such as Warfarin) targeting an INR of 2.0–3.0." },
      { key: "C", text: "Sinus tachycardia from acute rheumatic carditis; Intravenous Penicillin-G therapy." },
      { key: "D", text: "Paroxysmal supraventricular tachycardia (PSVT); Valsalva maneuver followed by Adenosine." },
      { key: "E", text: "Atrial fibrillation; Aspirin 325 mg mono-therapy." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The mid-diastolic rumbling murmur with opening snap and loud S1 confirms Mitral Stenosis. Left atrial enlargement leads directly to atrial fibrillation, causing chaotic rhythms. Mitral valve disease with AF carries an extremely high risk of thromboembolism. Thus, systemic anticoagulation (such as Warfarin or NOACs) to target INR 2.0-3.0 (specifically Warfarin is highly indicated in mechanical or rheumatic MS) is critical.",
      incorrectOptions: {
        A: "Ventricular tachycardia is not the classic outcome of mitral stenosis remodeling, left atrial stretch is the culprit.",
        C: "Sinus tachycardia is a regular rhythm, here she has an irregular pulse indicating AF.",
        D: "PSVT is regular, whereas this patient has an irregular rhythm.",
        E: "Aspirin is completely insufficient for stroke prevention in valvular atrial fibrillation."
      },
      highYieldPearl: "💡 سر بورد MUST: أي مريض Mitral Stenosis يجيله رفرفة أذينية (Atrial Fibrillation) لازم يبدأ Anticoagulant لمنع السكتة الدماغية (Stroke). الروماتيزم في القلب يسبب تضخم الأذين الأيسر مما يغير كهربية القلب."
    },
    difficulty: "Hard",
    source: "ain_shams"
  },
  {
    id: "cardio-003",
    discipline: "internal_medicine",
    system: "cardiology",
    topic: "Acute Coronary Syndrome (STEMI)",
    questionCode: "MUST-CARDIO-003",
    vignette: "A 55-year-old heavy smoker presents to the Emergency Department at MUST Main Teaching Hospital complaining of crushing center-substernal chest pain radiating to his left shoulder and jaw for the past 95 minutes, accompanied by diaphoresis and nausea. His ECG demonstrates horizontal ST-segment elevations of 3mm in leads V1 through V4.",
    questionText: "What is the primary anatomical occlusion locus, and what is the target door-to-balloon time for primary percutaneous coronary intervention (PCI)?",
    options: [
      { key: "A", text: "Left Circumflex (LCx) artery; under 120 minutes." },
      { key: "B", text: "Right Coronary Artery (RCA); under 60 minutes." },
      { key: "C", text: "Left Anterior Descending (LAD) artery; under 90 minutes." },
      { key: "D", text: "Left Main Coronary Artery; under 30 minutes." },
      { key: "E", text: "Posterior Descending Artery (PDA); under 180 minutes." }
    ],
    correctOption: "C",
    explanation: {
      correctMsg: "Elevations in V1-V4 represent an anterior wall myocardial infarction, which is classically due to occlusion of the Left Anterior Descending (LAD) coronary artery. Guidelines state that for a hospital with primary PCI capabilities, the target door-to-balloon time should be ≤ 90 minutes.",
      incorrectOptions: {
        A: "LCx occlusion usually leads to lateral infarctions (Leads I, aVL, V5-V6).",
        B: "RCA occlusion results in inferior infarctions (Leads II, III, aVF).",
        D: "Left Main occlusion shows elevation in aVR and widespread ST depression.",
        E: "PDA is responsible for posterior wall infarction, showing ST depressions in anterior leads V1-V3."
      },
      highYieldPearl: "💡 تنبيه الـ OSCE والـ MCQ: الـ LAD يغذي جدار البطين الأمامي (Anterior wall, V1-V4). الوقت الذهبي هو 90 دقيقة لإنقاذ عضلة القلب (Door-to-Balloon in PCI ≤ 90 mins)."
    },
    difficulty: "Easy",
    source: "kasr_el_ainy"
  },

  // Gastroenterology
  {
    id: "gastro-001",
    discipline: "internal_medicine",
    system: "gastroenterology",
    topic: "Hepatic Encephalopathy",
    questionCode: "MUST-GASTRO-001",
    vignette: "A 62-year-old male with decompensated HCV-related liver cirrhosis is brought by his family to the clinic. They note that he has been increasingly disoriented, reversing his sleep wake cycle, and having sluggish reactions. On examination, a prominent coarse ‘flapping tremor’ of both hands is elicited upon wrist extension.",
    questionText: "Which of the following is the standard pharmacological combination for managing this neurological condition, and how does each drug function?",
    options: [
      { key: "A", text: "Spironolactone and Furosemide; blocking aldosterone and loops to reduce portal vein congestion." },
      { key: "B", text: "Lactulose and Rifaximin; acidifying gut lumen to convert NH3 to non-absorbable NH4+ and selectively killing ammonia-producing gut bacteria." },
      { key: "C", text: "Propranolol and Octreotide; reducing splanchnic arterial inflow and preventing acute variceal hemorrhage." },
      { key: "D", text: "Metronidazole and Cholestyramine; killing gut flora and binding systemic bile acids to relieve pruritus." },
      { key: "E", text: "Lactulose and Neomycin; flushing the colon and neutralizing systemic ammonium in the cerebral cortex." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "First-line management for Hepatic Encephalopathy is Lactulose, which degrades into organic acids in the colon, lowering pH and converting diffusible ammonia (NH3) into poorly absorbed ammonium (NH4+). Rifaximin, a non-absorbable antibiotic, is added to kill ammonia-producing anaerobic colonic bacteria, synergistic to lactulose.",
      incorrectOptions: {
        A: "Diuretics are used to manage ascites and edema, but they can aggravate encephalopathy by causing hypokalemia and dehydration.",
        C: "Propranolol and Octreotide are used for esophageal varices prophylaxis and therapy, not hepatic encephalopathy.",
        D: "Cholestyramine is for bile pruritus and doesn't affect ammonia levels.",
        E: "Neomycin is no longer preferred first-line due to nephrotoxicity and ototoxicity, and lactulose works in the colon, not the cerebral cortex."
      },
      highYieldPearl: "💡 اللمسة الذهبية لامتحانات الزمالة والماجستير: الـ Asterixis (flapping tremor) علامة مميزة جداً للـ Hepatic Encephalopathy. الـ Lactulose بيخلي الوسط حمضي فيتحول الأمونيا الطيارة NH3 إلى NH4+ الذائب وغير الممتص للاتزان."
    },
    difficulty: "Medium",
    source: "zatona"
  },
  {
    id: "gastro-002",
    discipline: "internal_medicine",
    system: "gastroenterology",
    topic: "Esophageal Varices",
    questionCode: "MUST-GASTRO-002",
    vignette: "A 50-year-old male from Fayoum with a history of Bilharzial periportal hepatic fibrosis presents with sudden onset massive, painless hematemesis. At presentation, his pulse is 122/min and blood pressure is 80/50 mmHg.",
    questionText: "What is the initial, absolute priority management step for this patient, and what is the definitive gold-standard intervention for active bleeding?",
    options: [
      { key: "A", text: "Immediate intravenous bolus of Propranolol; Transjugular Intrahepatic Portosystemic Shunt (TIPS)." },
      { key: "B", text: "Aggressive surgical portacaval shunt; Emergency balloon tamponade using Sengstaken-Blakemore tube." },
      { key: "C", text: "Hemodynamic resuscitation with blood/fluids and IV Octreotide/Terlipressin; Emergency Upper Gastrointestinal Endoscopy with endoscopic variceal band ligation (EVL)." },
      { key: "D", text: "Aqueous vasopressin infusion to constrict peripheral arteries; Barium swallow to locate the tear." },
      { key: "E", text: "Total parenteral nutrition; Prophylactic broad-spectrum oral antibiotics." }
    ],
    correctOption: "C",
    explanation: {
      correctMsg: "The patient is in hemorrhagic shock from suspected ruptured esophageal varices. Hemodynamic stability (fluid/blood resuscitation) is the absolute first-line priority. Concurrently, vasoactive drugs (Terlipressin or Octreotide) should be started to reduce splanchnic blood flow. The gold-standard diagnostic and definitive therapeutic solution is Upper GI Endoscopy for Variceal Band Ligation.",
      incorrectOptions: {
        A: "Beta-blockers like Propranolol are strictly for primary or secondary *prophylaxis*, never during an acute bleeding hypotensive episode.",
        B: "Sengstaken tube is a temporary bridge if endoscopy is unavailable or fails, not first choice.",
        D: "Barium swallow is contraindicated in acute massive hematemesis.",
        E: "Antibiotics are indeed prophylactic, but they are NOT the top acute priority over resuscitation and endoscopy."
      },
      highYieldPearl: "💡 سؤال مكرر لجامعة MUST: في أي نزيف دوالي حاد، ثبت العيان أولاً بمحاليل ودم (Hemodynamic Resuscitation) وأبدأ Octreotide بالتوازي مع تحديد موعد منظار ربط الدوالي (Band Ligation)."
    },
    difficulty: "Hard",
    source: "lange"
  },

  // Pulmonary / Chest
  {
    id: "chest-001",
    discipline: "internal_medicine",
    system: "chest",
    topic: "COPD Exacerbation",
    questionCode: "MUST-CHEST-001",
    vignette: "A 68-year-old chronic heavy smoker presents with progressive severe shortness of breath, a wet cough productive of thick green sputum, and low-grade fever for 3 days. He has a 12-year history of chronic obstructive pulmonary disease (COPD). Blood gas analysis on room air reveals: pH: 7.31, PaCO2: 56 mmHg, PaO2: 52 mmHg, HCO3-: 28 mEq/L.",
    questionText: "How should this patient's blood gas disorder be classified, and what is the optimal respiratory support method of choice?",
    options: [
      { key: "A", text: "Fully compensated Metabolic Alkalosis; 100% High-flow Venturi oxygen mask." },
      { key: "B", text: "Acute Respiratory Acidosis with hypercapnia (Type II Respiratory Failure); Non-Invasive Positive Pressure Ventilation (NIPPV/BiPAP)." },
      { key: "C", text: "Uncompensated Respiratory Alkalosis; Immediate tracheal intubation and high-frequency ventilation." },
      { key: "D", text: "Mixed metabolic metabolic acidosis; Nasal cannula supplying 6 L/min Oxygen." },
      { key: "E", text: "Type I Respiratory Failure; Simple rebreather mask at 15 L/min." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The pH (7.31) indicates acidosis, the PaCO2 (56) is elevated causing the acidosis (Respiratory Acidosis), and the oxygen (PaO2 52) indicates hypoxemia. This is Type II Respiratory Failure. BiPAP/NIPPV is the evidence-based gold standard for acute COPD respiratory failure, as it improves gas exchange, decreases work of breathing, and avoids the complications of mechanical intubation.",
      incorrectOptions: {
        A: "This is respiratory acidosis, not metabolic alkalosis.",
        C: "The pH is acidotic, not alkalotic.",
        D: "Mixed metabolic is incorrect; it is respiratory acidosis with partial renal compensation (elevated bicarbonate).",
        E: "Type I failure shows hypoxemia alone with low/normal carbon dioxide, whereas this patient has hypercapnic respiratory failure."
      },
      highYieldPearl: "💡 معلومة صدرية هامة: الـ COPD الخطر الأكبر فيه هو حبس غاز ثاني أكسيد الكربون (CO2 Retention) مما يعمل Respiratory Acidosis. جهاز الـ BiPAP/NIPPV هو السحر هنا لدفع الهواء وتقليل الحاجة لجهاز التنفس الصناعي الاختراقي."
    },
    difficulty: "Medium",
    source: "ain_shams"
  },

  // General Surgery
  {
    id: "surgery-001",
    discipline: "surgery",
    system: "general_surgery",
    topic: "Acute Appendicitis",
    questionCode: "MUST-SURG-001",
    vignette: "A 19-year-old MUST medical student presents with a 12-hour history of vague colicky periumbilical abdominal pain that has progressively migrated to his right iliac fossa (RIF). The pain is worse with movement or coughing. Physical examination reveals focal tenderness, rebound tenderness at McBurney's point, and painful internal rotation of the right hip.",
    questionText: "What is the clinical eponym for the pain elicited during right hip internal rotation, and what is the diagnostic score validated for clinical diagnosis?",
    options: [
      { key: "A", text: "Rovsing's Sign; Glasgow Coma Scale" },
      { key: "B", text: "Obturator Sign; Alvarado Score" },
      { key: "C", text: "Psoas Sign; Child-Pugh Score" },
      { key: "D", text: "Murphy's Sign; NYHA Functional Scale" },
      { key: "E", text: "Cullen's Sign; Wells Criteria" }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The Obturator sign is pain upon passive internal rotation of the flexed right hip, indicating irritation of the obturator internus muscle by a low-pelvic retrocecal appendix. The Alvarado Score (MANTRELS) is the clinical scoring system used to stratify suspected acute appendicitis risk.",
      incorrectOptions: {
        A: "Rovsing's sign is RIF pain induced by palpation of the left lower quadrant.",
        C: "Psoas sign is pain with passive extension of the right hip, indicating a retroperitoneal appendix.",
        D: "Murphy's sign is for acute cholecystitis, not appendicitis.",
        E: "Cullen's sign is bruising around the umbilicus, indicative of retroperitoneal bleeding."
      },
      highYieldPearl: "💡 الجراحة بامتياز: Obturator Sign = ألم مع دوران مفصل الفخذ للداخل نتيجة التهاب المرتكز فوق الحوض. الـ Alvarado score يعتمد على (Migration of pain, Anorexia, Nausea/vomiting, Tenderness RIF, Rebound, Elevation of temp, Leukocytosis, Shift to left)."
    },
    difficulty: "Easy",
    source: "bailey"
  },
  {
    id: "surgery-002",
    discipline: "surgery",
    system: "general_surgery",
    topic: "Intestinal Obstruction",
    questionCode: "MUST-SURG-002",
    vignette: "A 52-year-old female presents to the emergency room with severe abdominal distension, colicky abdominal pain, vomiting of bile-stained and fecaloid fluids, and absolute constipation (no feces or flatus) for 48 hours. She has a midline surgical scar from a complicated total abdominal hysterectomy performed 5 years ago. Flat plate abdominal X-ray displays multiple dilated small bowel loops displaying a 'step-ladder' air-fluid levels pattern.",
    questionText: "What is the most common etiology of this patient's acute bowel obstruction, and what is the core conservative therapy required first?",
    options: [
      { key: "A", text: "Colorectal malignancy; prompt palliative proctocolectomy." },
      { key: "B", text: "Incarcerated femoral hernia; immediate repair of the inguinal canal." },
      { key: "C", text: "Post-operative peritoneal adhesions; Nasogastric tube decompression (NPO) and intravenous fluid restoration." },
      { key: "D", text: "Intussusception; pneumatic reduction or high hydrostatic barium enema." },
      { key: "E", text: "Gallstone ileus; emergency laparoscopic enterolithotomy." }
    ],
    correctOption: "C",
    explanation: {
      correctMsg: "The patient has clinical features of mechanical small bowel obstruction (distension, vomiting, colicky pain, obstipation, step-ladder pattern on X-ray). Given her previous abdominal hysterectomy, peritoneal adhesions are the most common cause. Initial therapy is typically conservative (non-operative): making the patient nil-per-os (NPO), passing a Nasogastric (NG) tube for decompression, and aggressive IV fluid resuscitation.",
      incorrectOptions: {
        A: "Colorectal malignancy is the most common cause of *large* bowel obstruction, but the step-ladder levels point to a small bowel source.",
        B: "Hernias are common, but adhesions are the absolute most frequent cause in patients with prior major abdominal surgeries.",
        D: "Intussusception is primarily a pediatric pathology.",
        E: "Gallstone ileus is rare and presents with pneumobilia on imaging."
      },
      highYieldPearl: "💡 مراجعة سريعة للجراحة: أهم سبب لانسداد الأمعاء الدقيقة لعيان فاتح بطن قبل كده هو الالتصاقات (Adhesions). العلاج الأولي يبدأ دايماً بتركيب رايل (NG tube) مع محاليل لتعويض السوائل قبل الاستعجال في العمليات (Mrip & Drip)."
    },
    difficulty: "Medium",
    source: "bailey"
  },

  // Pediatrics
  {
    id: "peds-001",
    discipline: "pediatrics",
    system: "neonatology",
    topic: "Respiratory Distress Syndrome (RDS)",
    questionCode: "MUST-PEDS-001",
    vignette: "A preterm male infant is born at 29 weeks of gestation to a G2P1 28-year-old Egyptian lady at MUST Maternity Unit. Within 20 minutes of birth, the neonate demonstrates grunting respiration, intercostal and subcostal retractions, cyanosis, and a respiratory rate of 78/min. Chest radiograph demonstrates a diffuse bilateral 'ground-glass' reticulogranular appearance with clear air bronchograms.",
    questionText: "What is the physiological deficiency causing this syndrome, and what preventive drug should have been administered to the mother before delivery?",
    options: [
      { key: "A", text: "Deficiency of surfactant manufactured by Type I Alveolar pneumocytes; Maternal intravenous Magnesium Sulfate." },
      { key: "B", text: "Deficiency of surfactant manufactured by Type II Alveolar pneumocytes; Maternal intramuscular Betamethasone (Corticosteroids)." },
      { key: "C", text: "Congenital diaphragmatic hernia; Maternal oral Progesterone." },
      { key: "D", text: "Incomplete lung vascularization; Maternal intravenous Ampicillin prophylaxis." },
      { key: "E", text: "Persistent pulmonary hypertension; Maternal Salbutamol inhalation." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "Neonatal Respiratory Distress Syndrome (RDS) is caused by a relative lack of pulmonary surfactant. Surfactant is synthesized and secreted by Type II alveolar pneumocytes. Antenatal maternal corticosteroid therapy (e.g., intramuscular Betamethasone or Dexamethasone) before 34 weeks gestation accelerates fetal lung maturity.",
      incorrectOptions: {
        A: "Surfactant is produced by type II, not type I pneumocytes (which function in gas exchange), and Magnesium sulfate is for fetal neuroprotection.",
        C: "The chest X-ray findings (diffuse ground glass) are classic for RDS, not diaphragmatic hernia.",
        D: "Vascular growth is a factor, but lung surfactant synthesis is the core defect.",
        E: "PHTN is secondary, and Salbutamol does not stimulate surfactant production."
      },
      highYieldPearl: "💡 بورد الأطفال: غياب الـ Surfactant المصنع من خلايا Type II Pneumocytes يسبب انهيار الحويصلات الهوائية (Alveolar Collapse). إعطاء حقنة الكورتيزون (Betamethasone) للأم المعرضة للولادة المبكرة يمنع حدوث هذه المأساة."
    },
    difficulty: "Easy",
    source: "zatona"
  },
  {
    id: "peds-002",
    discipline: "pediatrics",
    system: "neonatology",
    topic: "Neonatal Jaundice (Hemolytic Disease)",
    questionCode: "MUST-PEDS-002",
    vignette: "A term newborn, born to a 30-year-old Rh-negative mother (O -ve) and an Rh-positive father, develops deep jaundice at 14 hours of life. The baby is blood group A-positive. Serum total bilirubin is 16.8 mg/dL (normal < 5 mg/dL during first 24 hours), with a highly elevated unconjugated fraction. Coombs test is positive.",
    questionText: "Which immunological mechanism explains this rapid hyperbilirubinemia, and what is the primary initial medical therapy?",
    options: [
      { key: "A", text: "Physiological jaundice of the newborn; increase breast milk feeds." },
      { key: "B", text: "ABO incompatibility leading to cell hemolysis; Phenobarbital therapy." },
      { key: "C", text: "Maternal Rh-isoimmunization causing antibody-mediated destruction of neonatal RBCs; Intensive Phototherapy and possibly IV Immunoglobulins (IVIG)." },
      { key: "D", text: "Breast milk jaundice secondary to hepatic lipase inhibitors; Stop breastfeeding for 1 week." },
      { key: "E", text: "Biliary atresia; urgent Kasai portoenterostomy." }
    ],
    correctOption: "C",
    explanation: {
      correctMsg: "Jaundice occurring within the first 24 hours of life is always *pathological*. The Rh-negative mother, who became sensitized during a previous pregnancy, produces anti-D IgG antibodies which cross the placenta and destroy the Rh-positive fetal red cells. This is positive Coombs test hemolytic disease of the newborn. First line treatment is intensive blue-green light Phototherapy, and IVIG can be given to neutralize maternal antibodies.",
      incorrectOptions: {
        A: "Physiological jaundice never presents in the first 24 hours and is never Coombs positive.",
        B: "ABO incompatibility can happen, but Rh hemolytic disease is much more aggressive, and Rh discordance is explicitly detailed.",
        D: "Breast milk jaundice presents later, usually after the first week of life.",
        E: "Biliary atresia presents with direct (conjugated) hyperbilirubinemia, clay-colored stools, and dark urine, unlike this hemolytic indirect case."
      },
      highYieldPearl: "💡 حكمة الأطفال: الصفراء في أول 24 ساعة من عمر الطفل = باثولوجية ومصيبة على طول! هنا السبب الـ Rh Incompatibility حيث تُهاجم أجسام الأم المضادة كرات دم الطفل الحمراء. العلاج الفوري هو العلاج بالضوء المكثف (Phototherapy)."
    },
    difficulty: "Medium",
    source: "kasr_el_ainy"
  },

  // OB/GYN
  {
    id: "obgyn-001",
    discipline: "ob_gyn",
    system: "obstetrics",
    topic: "Pre-eclampsia & Eclampsia",
    questionCode: "MUST-OBG-001",
    vignette: "A 28-year-old G1P0 lady at 34 weeks gestation presents to the MUST obstetric casualty room with a severe headache, blurry vision, and sudden swelling of both legs. Her blood pressure is 170/115 mmHg, and her dipstick urinalysis demonstrates 3+ protein. While being evaluated, she suddenly develops generalized tonic-clonic seizures.",
    questionText: "What is the absolute drug of choice to terminate and prevent these seizures, and what is the definitive curative treatment for her underlying disease?",
    options: [
      { key: "A", text: "Intravenous Diazepam; bed rest until full term at 39 weeks." },
      { key: "B", text: "Intravenous Magnesium Sulfate (MgSO4); Stabilization and prompt delivery of the fetus and placenta." },
      { key: "C", text: "Intravenous Phenytoin; high-dose anti-hypertensives." },
      { key: "D", text: "Oral Valproic acid; immediate Emergency Cesarean Section without stabilizing." },
      { key: "E", text: "Intravenous Hydralazine; continuous fetal monitoring until active labor." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The patient has progressed from severe pre-eclampsia to eclampsia (convulsions in a pre-eclamptic pregnant woman). The gold-standard anticonvulsant to prevent/control eclamptic seizures is Mag Sulfate (MgSO4). Because pre-eclampsia is caused by maternal endothelial dysfunction secondary to placental ischemia, the only definitive cure is delivery of the fetus and placenta.",
      incorrectOptions: {
        A: "Diazepam is less effective than MgSO4 in eclampsia and respiratory depression is high.",
        C: "Phenytoin is not the first choice medication for eclamptic seizures.",
        D: "Immediate C-section before maternal stabilization (seizure control and BP management) is contraindicated and highly dangerous.",
        E: "Hydralazine lowers blood pressure but doesn't control or prevent brain seizures directly."
      },
      highYieldPearl: "💡 خلاصة الـ OB/GYN لجامعة MUST: الدواء الأهم والـ Eponym لإنقاذ حالة طوارئ الـ Eclampsia هو الـ Magnesium Sulfate. الترياق هو Calcium Gluconate لو حصل تسمم منه. الولادة هي الحل الجذري والنهائي لتسمم الحمل."
    },
    difficulty: "Easy",
    source: "lange"
  },
  {
    id: "obgyn-002",
    discipline: "ob_gyn",
    system: "gynecology",
    topic: "Ectopic Pregnancy",
    questionCode: "MUST-OBG-002",
    vignette: "A 26-year-old married woman presents with sudden-onset severe, stabbing left-sided lower abdominal pain, followed by slight vaginal spotting. Her last menstrual period was 6 weeks ago. Her blood pressure is 90/60 mmHg and pulse is 114 bpm. Abdominal examination reveals severe tenderness and guarding in the left pelvic quadrant. Fluid is collected in the pouch of Douglas during ultrasound.",
    questionText: "What is the most likely location of this ectopic pregnancy, and what is the optimal surgical intervention given her hemodynamic status?",
    options: [
      { key: "A", text: "Ovarian; oral Methotrexate therapy." },
      { key: "B", text: "Tubal (Ampulla region); Emergency exploratory laparotomy with left salpingectomy." },
      { key: "C", text: "Cervical; cervical expansion and curettage." },
      { key: "D", text: "Tubal (Isthmus region); Laparoscopic salpingostomy." },
      { key: "E", text: "Abdominal; observation and hormonal therapy." }
    ],
    correctOption: "B",
    explanation: {
      correctMsg: "The patient presents with the classical triad of ruptured ectopic pregnancy: amenorrhea, lower abdominal pain, and vaginal bleeding. She is hemodynamically unstable (hypotension, tachycardia) hinting at active intraperitoneal hemorrhage. The Ampulla of the Fallopian tube is the most common anatomical site of ectopic pregnancies. For a ruptured ectopic causing shock, emergency exploratory laparotomy and salpingectomy (removal of the affected tube) is mandatory to save her life.",
      incorrectOptions: {
        A: "Methotrexate is highly effective, but STRICTLY for stable ectopic pregnancies with no rupture and low beta-hCG.",
        C: "Cervical ectopic is rare, and curettage would cause uncontrollable bleeding in this ruptured case.",
        D: "Salpingostomy is a tube-sparing surgery reserved for stable patients who want to conserve future fertility.",
        E: "Abdominal ectopics are extremely rare, and observation of a ruptured ectopic with shock is fatal."
      },
      highYieldPearl: "💡 دليل بورد MUST: الـ Ampulla هي أشهر مكان للـ Ectopic pregnancy. ما دام المريضة غير مستقرة وبها هبوط ضغط ونبض سريع (Hypotensive & Shock) لازم تدخل جراحي طارئ فوراً (Salpingectomy) لإنقاذ حياتها من النزيف."
    },
    difficulty: "Hard",
    source: "ain_shams"
  }
];

export interface QBankSession {
  id: string;
  discipline: string | 'all';
  systems: string[];
  totalQuestions: number;
  mode: 'study' | 'exam';
  questions: QBankQuestion[];
  currentIndex: number;
  userAnswers: Record<string, string>; // questionId -> chosenOption ('A', 'B', etc)
  isCompleted: boolean;
  score: number;
  flaggedQuestions: string[]; // list of question ids
  startTime: number;
  elapsedTime: number; // in seconds
  notes: Record<string, string>; // questionId -> personal student note
  timeLimitMinutes: number; // custom time limit in minutes
}
