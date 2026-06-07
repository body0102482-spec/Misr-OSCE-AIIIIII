import { Case } from "../../types";

export const copdCase: Case = {
  id: "copd-001",
  name: "Chronic Obstructive Pulmonary Disease (COPD)",
  specialty: "Respiratory",
  difficulty: "Medium",
  time: "12 mins",
  patient: {
    name: "Maged Mohamed Al-Khouly",
    age: 66,
    gender: "Male",
    occupation: "Metal Welder",
    chiefComplaint: "Shortness of breath of 1-week duration.",
    vitals: {
      bp: "120/80 mmHg",
      hr: "96 bpm",
      rr: "24 bpm (Tachypneic)",
      temp: "36.8 °C",
      oxygen: "93% (On room air)",
    },
  },
  history: {
    presentIllness: "The onset of dyspnea dates back to when the patient was 20 years old. It started with a gradual onset and has run a slowly progressive course over decades. It increases with physical exertion and on cutting off his inhaler medications, and is relieved by rest and compliant therapy. The shortness of breath is clinically associated with tachypnea and audibly noticeable wheezing. Positive symptoms: Productive cough since age 20, characteristically producing about half a cup of thick white, odorless sputum in the morning. Negative symptoms: No hemoptysis. No constitutional manifestations (no anorexia, no chronic weight loss, no active fever, or night sweats). No active central or peripheral cyanosis. No systemic congestion symptoms (no lower limb edema, no right hypochondrial pain, no jaundice). No chest pain, pressure manifestations (no brassy cough, dysphagia, hoarseness, face edema or face cyanosis). No other systems manifestations are reported.",
    pastHistory: "Patient is neither hypertensive nor diabetic. He has no past history of viral hepatitis, rheumatic fever, or childhood asthma. He had absolutely no past surgical operations or blood transfusions.",
    drugHistory: "Currently on Ventolin (salbutamol) inhaler 2 times a day, which results in noticeable fine tremors of his bilateral hands. No other chronic medications.",
    familyHistory: "Negative consanguinity. No family history of arterial hypertension, diabetes mellitus, or any hereditary pulmonary/liver diseases (such as Alpha-1 Antitrypsin deficiency). No family members suffer from a similar respiratory condition.",
    socialHistory: "Married with 4 offsprings, the youngest of whom is an active 17-year-old high school student. Born and lives in the industrial zone of Shobra Al-Kheima, Cairo. Worked for over 40 years as a high-exposure metal welder. He used to smoke 10 cigarettes a day for 40 years, but he permanently quit smoking 2 years ago.",
  },
  examination: {
    inspection: "General Inspection: Cooperative 66-year-old male sitting comfortably, showing no active signs of distress or cyanosis. Fine, rapid postural tremors are noted in both hands (associated with salbutamol usage). Local Chest Inspection: Symmetrical chest wall configuration with absolutely no surgical scars, no skin pigmentations, and no skeletal deformities (normal AP chest diameter, no barrel chest deformity).",
    inspectionImage: "/Chest inspection.jpg, /fine tremors test.jpg",
    palpation: "Palpation of the chest wall shows: No focal or diffuse bony or muscular tenderness. Tactile Vocal Fremitus (TVF) is equal on both sides bilaterally. Widespread palpable rhonchi/wheezes are felt bilaterally over both lung fields. Bilateral, symmetrical limitation of chest wall expansion during deep breathing maneuvers.",
    palpationVideo: "/chest palpation.mp4, /treacheal examination.mp4",
    percussion: "Percussion shows a hyper-resonant percussion note over all bilateral anterior, lateral, and posterior lung fields.",
    percussionVideo: "/chest percussion.mp4",
    auscultation: "Auscultation of the lungs reveals: Equal, symmetrical air entry of normal intensity on both lungs. Harsh vesicular breathing associated with a prolonged expiratory phase. Generalized wheezes are heard bilaterally, which are predominantly expiratory polyphonic wheezes.",
    auscultationAudio: "/expiratory polyphonic wheeze (1) - Copy.mp3",
    specialTests: [],
  },
  investigations: [
    { name: "Spirometry", result: "Post-bronchodilator FEV1/FVC: 0.62 (indicating fixed airway obstruction). FEV1: 58% predicted (moderate airflow limitation, GOLD 2 grade)." },
    { name: "Echocardiography", result: "Normal cardiac chambers. Completely normal Left Ventricle dimensions with preserved systolic function (LVEF: 64%). Mild Right Ventricular hypertrophy with normal estimated systolic pulmonary artery pressure (SPAP: 25 mmHg). No valvular disease." },
    { name: "CBC", result: "Hb: 14.5 g/dL (No polycythemia), WBC: 6.8 x10^9/L, Platelets: 220,000 (normal inflammatory cell counts)." },
    { name: "Chest X-Ray", result: "Bilateral lung hyperinflation represented by flattened hemidiaphragms, widened intercostal spaces, and increased radiolucency. Normal skeletal chest wall frame without deformities." }
  ],
  diagnosis: {
    provisional: "Chronic Obstructive Pulmonary Disease (COPD) stable state with Salbutamol-induced fine hand tremors",
    differentials: ["Late-onset Bronchial Asthma", "Industrial Occupational Pneumoconiosis (Welder's Lung)", "Congestive Heart Failure", "Bronchiectasis"],
    management: "Continue optimization of inhaled bronchodilators, considering adding a long-acting muscarinic antagonist (LAMA) or long-acting beta-2 agonist (LABA). Since Salbutamol 2 times a day causes fine hand tremors, counsel the patient on correct inhaler technique with a spacer, or evaluate lowering the SABA frequency and relying on long-acting controllers. Encourage maintaining smoking cessation. Regular seasonal influenza and pneumococcal vaccinations. Monitor lung function annually with spirometry.",
  },
  checklist: [
    { item: "Elicited detailed smoking history (10 cigarettes/day for 40 years, quit 2 years ago)", category: "History" },
    { item: "Explored long-term onset of dyspnea starting at age 20 with a gradual, progressive course", category: "History" },
    { item: "Documented the morning productive cough of half a cup of white, odorless sputum since age 20", category: "History" },
    { item: "Inquired about Salbutamol inhaler side effects (fine hand tremors) and detailed occupational exposure (metal welder)", category: "History" },
    { item: "Systematically ruled out constitutional, coronary, cardiac systemic, and pressure symptoms on review of systems", category: "History" },
    { item: "Inspected the chest wall, confirming absence of surgical scars, pigmentations, or chest deformities", category: "Examination" },
    { item: "Palpated the chest, noting absence of tenderness, equal bilateral TVF, palpable wheezes, and restricted chest expansion", category: "Examination" },
    { item: "Confirmed hyper-resonant chest percussion notes bilaterally", category: "Examination" },
    { item: "Auscultated harsh vesicular breathing, prolonged expiration, equal air entry, and generalized expiratory wheezes", category: "Examination" },
    { item: "Interpreted investigations including Spirometry/Echo, and linked metal welding to occupational lung risk", category: "Reasoning" },
    { item: "Reassured the elderly painter with clinical empathy while addressing hand tremors and inhaler optimization", category: "Communication" }
  ],
  examinerQuestions: [
    // === SECTION 1: LUNG SURFACES, ANATOMY & FISSURES ===
    {
      id: "copd-viva-1",
      question: "What is the surface anatomy of the right lung?",
      sampleAnswer: "Apex: 3cm above medial 1/3 of clavicle. Anterior border: runs from apex through sternoclavicular junction, down vertically to the 6th costal cartilage. Inferior border: 6th rib in MCL, 8th rib in MAL, and 10th rib close to the vertebral column posteriorly. Posterior border: vertical line along the side of the vertebral column from the 10th rib up to the apex."
    },
    {
      id: "copd-viva-2",
      question: "What is the surface anatomy of the left lung?",
      sampleAnswer: "Similar to the right lung, but the anterior border descends vertically only to the 4th costal cartilage, where it deviates laterally to the left forming the cardiac notch, before continuing down to the 6th costal cartilage."
    },
    {
      id: "copd-viva-3",
      question: "What is the surface anatomy of the trachea?",
      sampleAnswer: "It extends from the 6th cervical vertebra (C6) down to the 4th thoracic vertebra (T4) at the Angle of Louis. Its total length is 10 cm, with the upper 5 cm in the neck and the lower 5 cm inside the chest cavity."
    },
    {
      id: "copd-viva-4",
      question: "What is the surface anatomy of the lung fissures?",
      sampleAnswer: "Oblique fissure (both lungs): Starts posteriorly at T3, crosses the MAL at the 5th rib, and ends anteriorly at the 6th costochondral junction in the MCL. Transverse fissure (right lung only): Starts from the 6th rib at the MAL and extends horizontally forward to the sternal end at the 4th costochondral junction."
    },
    {
      id: "copd-viva-5",
      question: "What does the clinical instruction 'examine the lower lobes' practically mean?",
      sampleAnswer: "It strictly means to 'examine the back of the chest'."
    },

    // === SECTION 2: INSPECTION & CHEST WALL SHAPES ===
    {
      id: "copd-viva-6",
      question: "What is the surface anatomy of Kronig's isthmus?",
      sampleAnswer: "It is a band of resonance over the lung apex bounded by 4 landmarks: Anteriorly by the medial 2/3 of the clavicle, posteriorly by the medial 1/3 of the scapular spine, laterally by a line connecting the junction of the medial 2/3 and lateral 1/3 of the clavicle to the junction of the medial 1/3 and lateral 2/3 of the scapular spine, and medially by a line connecting the sternoclavicular joint to the C7 spine."
    },
    {
      id: "copd-viva-7",
      question: "What are the causes of dullness over Kronig's isthmus?",
      sampleAnswer: "Apical lung lesions such as Pancoast tumor, Pulmonary Tuberculosis (apical lung fibrosis), or Friedlander's pneumonia."
    },
    {
      id: "copd-viva-8",
      question: "Describe the clinical signs and features of a Barrel Chest.",
      sampleAnswer: "It is a symmetrical chest deformity characterized by an increased Anteroposterior diameter that is equal to or greater than the transverse diameter. Features include a wide subcostal angle, horizontal ribs with widened intercostal spaces, thick shoulders, protrusion of the sternum, and a chest that moves up and down as a single unit due to overaction of accessory muscles of inspiration."
    },
    {
      id: "copd-viva-9",
      question: "What is the underlying cause of a Barrel Chest?",
      sampleAnswer: "Chronic lung hyperinflation, characteristically seen in Emphysema and COPD."
    },
    {
      id: "copd-viva-10",
      question: "What are the other abnormal chest shapes you can observe and their causes?",
      sampleAnswer: "1. Elliptical chest (normal shape). 2. Pigeon chest (Pectus carinatum): caused by Rickets or severe childhood respiratory distress like bronchial asthma. 3. Funnel chest (Pectus excavatum): a congenital or occupational deformity (e.g., Shoemaker's chest). 4. Alar/Flat chest (normal variant). 5. Kyphosis (spinal curvature change)."
    },
    {
      id: "copd-viva-11",
      question: "How do you clinically differentiate a normal hemithorax from an abnormal one showing bulge or retraction?",
      sampleAnswer: "By assessing chest expansion. The side showing restricted or limited chest expansion is always the abnormal hemithorax, whether it is bulging or retracted."
    },
    {
      id: "copd-viva-12",
      question: "What are the specific causes of unilateral chest bulge versus unilateral chest retraction?",
      sampleAnswer: "Unilateral Bulge: Pleural effusion, pneumothorax, chest wall tumors, or chest wall emphysema. Unilateral Retraction: Lung fibrosis, lung collapse, or a past pneumonectomy."
    },
    {
      id: "copd-viva-13",
      question: "What conditions cause abdominal respiratory movement versus thoracic respiratory movement?",
      sampleAnswer: "Abdominal movement (seen when chest movement is restricted): Pleurisy, pleural effusion, intercostal muscle paralysis, or severe emphysema. Thoracic movement (seen when abdominal movement is restricted): Tense ascites, peritonitis, or massive abdominal tumors."
    },
    {
      id: "copd-viva-14",
      question: "What is the normal respiratory rate, and what defines tachypnea?",
      sampleAnswer: "The normal respiratory rate is 14 to 20 breaths per minute. A rate of 21 breaths per minute or more defines tachypnea."
    },
    {
      id: "copd-viva-15",
      question: "What are the primary accessory muscles of inspiration and expiration?",
      sampleAnswer: "Accessory muscles of inspiration: Sternomastoids, Scalini, and Trapezii. Accessory muscles of expiration: Abdominal muscles, Latissimus dorsalis, and pursed lips."
    },
    {
      id: "copd-viva-16",
      question: "What is Litten's sign, how is it produced, and what does its absence mean?",
      sampleAnswer: "It is a normal rippling shadow seen moving down the lower intercostal spaces during deep inspiration in thin individuals, caused by diaphragmatic descent. Its unilateral absence indicates pathological conditions such as diaphragmatic paralysis or pleural effusion."
    },

    // === SECTION 3: PALPATION, TRACHEA, & TVF ===
    {
      id: "copd-viva-17",
      question: "What are the mechanical causes of tracheal displacement/shift?",
      sampleAnswer: "Shifted to the same side: due to pulling forces from lung fibrosis, lung collapse, or pneumonectomy. Shifted to the opposite/other side: due to pushing forces from massive pleural effusion, pneumothorax, hydropneumothorax, or unilateral emphysema."
    },
    {
      id: "copd-viva-18",
      question: "What is Trail's sign and its clinical significance?",
      sampleAnswer: "It is the abnormal, unilateral prominence or bulge of the sternomastoid tendon on the side toward which the trachea has significantly shifted."
    },
    {
      id: "copd-viva-19",
      question: "What are the main causes of a tender chest wall classified by anatomical structure?",
      sampleAnswer: "From outside inward: Skin/Nerves (Herpes Zoster: unilateral, dermatomal), Muscles (Myositis), Vessels (Thrombophlebitis), Bones (Osteomyelitis, fracture rib, or tender sternum in Leukemia), Cartilage (Costochondritis/Tietze syndrome), Pleura (Pleurisy felt in lower axillary areas or beneath breasts), and Liver (Right-sided Amebic liver abscess)."
    },
    {
      id: "copd-viva-20",
      question: "Define Tactile Vocal Fremitus (TVF) and list the three classic conditions that increase it.",
      sampleAnswer: "TVF represents the vibrations of the vocal cords transmitted through the airways and palpated on the chest wall. It is characteristically increased by the '3Cs': 1. Consolidation, 2. Cavitation (if superficial and surrounded by consolidation), 3. Collapse with a patent main bronchus."
    },
    {
      id: "copd-viva-21",
      question: "What conditions cause a decrease or reduction in Tactile Vocal Fremitus (TVF)?",
      sampleAnswer: "Any other respiratory or pleural disease outside of the 3Cs, such as pleural effusion, pneumothorax, emphysema, or thickened pleura."
    },
    {
      id: "copd-viva-22",
      question: "What are the causes of limited chest expansion classified as bilateral versus unilateral?",
      sampleAnswer: "Bilateral limitation: COPD, emphysema, lung fibrosis, or bilateral basal bronchiectasis. Unilateral limitation: Pleural effusion, pneumothorax, unilateral lung fibrosis, lung collapse, or severe lobar pneumonia."
    },
    {
      id: "copd-viva-23",
      question: "What is the clinical significance of feeling palpable rhonchi during chest palpation?",
      sampleAnswer: "It indicates severe airway narrowing due to bronchospasm or thick secretions, characteristically found in COPD and Bronchial Asthma."
    },

    // === SECTION 4: PERCUSSION & TRAUBE'S AREA ===
    {
      id: "copd-viva-24",
      question: "What are the six main types of chest percussion notes and their classic clinical examples?",
      sampleAnswer: "1. Resonance: Normal healthy lung. 2. Hyperresonance: Emphysema and pneumothorax. 3. Tympanitic: Over a hollow viscus containing air, like a normal Traube's area. 4. Impaired note: Early pulmonary consolidation or lung fibrosis. 5. Dullness: Pulmonary consolidation, lung collapse, or deep fibrosis. 6. Stony dullness: Pathognomonic for a massive pleural effusion."
    },
    {
      id: "copd-viva-25",
      question: "What is the anatomical surface anatomy of Traube's area?",
      sampleAnswer: "It is bounded by four points: Superiorly by the 6th rib in the Left MCL, Inferiorly by the Left costal margin in the MAL, Right/Medially by the 8th costochondral junction (left parasternal line), and Left/Laterally by the 9th rib in the Left MAL."
    },
    {
      id: "copd-viva-26",
      question: "What are the normal contents of Traube's area, and what note does it normally yield?",
      sampleAnswer: "It overlies the fundus of the stomach containing an air bubble, which normally yields a tympanitic resonant percussion note."
    },
    {
      id: "copd-viva-27",
      question: "Detail the pathological and physiological causes of dullness over Traube's area based on anatomical direction.",
      sampleAnswer: "Pathological: From above (Pleural effusion, pericardial effusion), From below (Ascites, colon cancer, gastric tumors), From the right (Left-lobe hepatomegaly), From the left (Splenomegaly, even less than 3 times normal size). Physiological: A full stomach or advanced pregnancy."
    },
    {
      id: "copd-viva-28",
      question: "What clinical conditions cause Traube's area to abnormally increase or widen in size?",
      sampleAnswer: "Left lung lobectomy, splenectomy, a severely shrunken liver, or acute gastric dilatation."
    },
    {
      id: "copd-viva-29",
      question: "What is the surface anatomy of the Cardiac Bare Area, its normal percussion note, and when does it change?",
      sampleAnswer: "Anatomy: Located at the left 4th and 5th intercostal spaces from the left sternal border to the left parasternal line. Note: Normally dull due to the underlying heart blood. Pathological Resonance: Occurs in Emphysema (the surest clinical sign) and pneumothorax. Increased Dullness: Occurs in lung collapse, right ventricular hypertrophy ($RV++$), or pericardial effusion."
    },
    {
      id: "copd-viva-30",
      question: "What is Tidal Percussion, what are its diagnostic values, and what is reversed tidal percussion?",
      sampleAnswer: "Tidal percussion is used to measure diaphragmatic mobility by percussing the lower lung border at the back between full inspiration and forced expiration. Normally, dullness at T10 changes to resonance during deep inspiration. If dullness persists and fails to change, it indicates a supra-diaphragmatic lesion (like pleural effusion). Reversed tidal percussion occurs when a resonant note becomes dull during inspiration, which is diagnostic of diaphragmatic paralysis."
    },

    // === SECTION 5: AUSCULTATION & BREATH SOUNDS ===
    {
      id: "copd-viva-31",
      question: "Describe the characteristics of normal vesicular breathing.",
      sampleAnswer: "It is a soft, rustling sound (resembling rustling leaves). The inspiratory phase is much longer than the expiratory phase (expiration is roughly 1/3 of inspiration), and there is absolutely no gap or pause between inspiration and expiration."
    },
    {
      id: "copd-viva-32",
      question: "Describe bronchial breathing and state its three main pathological causes.",
      sampleAnswer: "It is a loud, harsh, hollow breath sound where the expiratory phase equals the inspiratory phase, and there is a distinct, clear gap/pause between inspiration and expiration. It is abnormally heard over the lung fields in the '3Cs': Consolidation, Cavitation, and Collapse with a patent bronchus."
    },
    {
      id: "copd-viva-33",
      question: "Where is bronchial breathing considered a completely normal physiological finding?",
      sampleAnswer: "When auscultated directly over the trachea."
    },
    {
      id: "copd-viva-34",
      question: "What are the types of crepitations (crackles) and their specific underlying causes?",
      sampleAnswer: "Fine crepitations: indicates interstitial lung disease, early pneumonia, or left-sided heart failure. Coarse crepitations: indicates retained secretions in large airways, such as in a lung abscess or bronchiectasis."
    },
    {
      id: "copd-viva-35",
      question: "What is D'espine's sign, how is it elicited, and what is its clinical significance?",
      sampleAnswer: "Normally, auscultation below the T4 vertebra (tip of T2 spine) yields normal vesicular breathing. D'espine's sign is present when abnormal bronchial breathing and increased vocal resonance are heard below this level. Significance: It indicates pathologically enlarged mediastinal or interbronchial lymph nodes, commonly caused by Tuberculosis or bronchogenic carcinoma."
    },
    {
      id: "copd-viva-36",
      question: "What are the classic characteristics of rhonchi (wheezes) in a stable COPD case?",
      sampleAnswer: "They are generalized (bilateral), polyphonic (multiple pitches), heard during both inspiration and expiration (but predominantly expiratory), and they characteristically alter, shift, or clear after a cough."
    },
    {
      id: "copd-viva-37",
      question: "How do rhonchi caused by a lung tumor differ from those caused by COPD?",
      sampleAnswer: "Rhonchi caused by a lung tumor are strictly localized to the affected area, monophonic (single pitch), and completely fixed (do not change or clear with coughing)."
    },
    {
      id: "copd-viva-38",
      question: "What is an opening snap of the chest?",
      sampleAnswer: "It refers to early inspiratory crepitations that can characteristically occur in patients with COPD."
    },
    {
      id: "copd-viva-39",
      question: "Define a pleural rub, list its causes, and differentiate it from its clinical mimics.",
      sampleAnswer: "It is a superficial, dry, scratching, or gritty friction sound caused by acute pleurisy (dry or with early effusion). It characteristically disappears completely when the patient holds their breath. Mimics: Pericardial rub (continues synchronously with heartbeats regardless of breath-holding) and Stethoscope friction (disappears by applying firm, steady pressure on the chest piece)."
    },
    {
      id: "copd-viva-40",
      question: "Define Vocal Resonance, its abnormal variations, and its main clinical methods.",
      sampleAnswer: "Vocal resonance represents the auscultated vibrations of the vocal cords transmitted through the lungs. It is significantly diminished in all chest diseases except the '3Cs' (Consolidation, Cavitation, Collapse with a patent bronchus), where it increases. Methods: Asking the patient to repeat '44' or '99' in a loud voice (Bronchophony) or whispering (Whispering Pectoriloquy). Aegophony is a nasal, high-pitched variant heard at the upper border of a pleural effusion."
    },

    // === SECTION 6: SUPPURATIVE LUNG SYN DROME (SLS) & COUGH ===
    {
      id: "copd-viva-41",
      question: "What is Suppurative Lung Syndrome (SLS), its definition, and its four classic diseases?",
      sampleAnswer: "Definition: A group of chronic bronchopulmonary inflammatory diseases characterized by a chronic cough productive of a profuse, purulent, postural, and sometimes fetid sputum. The four diseases are: 1. Lung abscess, 2. Bronchiectasis, 3. Infected lung cyst, 4. Empyema with a bronchopleural fistula."
    },
    {
      id: "copd-viva-42",
      question: "Differentiate completely between classic Bronchiectasis and Bronchiectasis Sicca.",
      sampleAnswer: "Classic Bronchiectasis: Located basally, secondary to pyogenic infections, presenting with excessive purulent sputum and occasional blood-tinged expectoration. Bronchiectasis Sicca Hemorrhagica: Located apically, secondary to Tuberculosis, characterized by excellent postural drainage resulting in a dry cough (no sputum = sicca) accompanied by recurrent frank hemoptysis."
    },
    {
      id: "copd-viva-43",
      question: "Classify the clinical characteristics of cough and their specific diagnostic values.",
      sampleAnswer: "1. Brassy cough: Metallic sound indicating tracheal compression or Mediastinal Syndrome. 2. Bovine cough: Hollow sound without an explosive start, indicating left recurrent laryngeal nerve paralysis. 3. Barking cough: Hysterical or psychogenic in origin. 4. Paroxysmal cough: Whooping cough, Cavity Syndrome, or Bronchial Asthma associated with pharyngeal/laryngeal irritation."
    },
    {
      id: "copd-viva-44",
      question: "What are the common causes of chronic cough?",
      sampleAnswer: "Chronic bronchitis, Suppurative Lung Syndrome (SLS), bronchogenic carcinoma, pulmonary Tuberculosis, pneumoconiosis, sarcoidosis, and post-nasal discharge secondary to chronic sinusitis."
    },
    {
      id: "copd-viva-45",
      question: "What are the thoracic and extra-thoracic complications of severe chronic coughing?",
      sampleAnswer: "Thoracic: Musculoskeletal chest pain, stress fracture of the ribs, pneumothorax, emphysema, and hemoptysis. Extra-thoracic: Facial/eye puffiness, subconjunctival hemorrhage, inguinal or abdominal hernia, and rectal or uterine prolapse."
    },

    // === SECTION 7: EXPECTORATION & HEMOPTYSIS ===
    {
      id: "copd-viva-46",
      question: "List the eight types of expectoration (sputum) and their corresponding diagnostic conditions.",
      sampleAnswer: "1. Pink frothy: Acute Pulmonary Edema (APO) or pulmonary venous congestion. 2. Clear frothy: Bronchoalveolar carcinoma. 3. Mucoid: Chronic bronchitis or bronchial asthma. 4. Purulent/Mucopurulent: Lung abscess, bronchiectasis, or active bronchopulmonary infection. 5. Rusty/Golden brown: Lobar pneumonia (due to altered blood pigment). 6. Chocolate/Anchovy sauce: Amebic lung abscess. 7. Red-current jelly: Bronchogenic carcinoma. 8. Caseous/Nummular (coin-like): Pulmonary Tuberculosis. 9. Black: Carbon inhalation (coal miner's lung)."
    },
    {
      id: "copd-viva-47",
      question: "Differentiate between True and False Hemoptysis.",
      sampleAnswer: "True Hemoptysis: Bleeding arising from structures strictly below the vocal cords. False Hemoptysis: Bleeding originating from structures above the vocal cords (nasopharynx, oral cavity, or larynx). Differentiated clinically via a formal laryngoscopy."
    },
    {
      id: "copd-viva-48",
      question: "List the clinical types of true hemoptysis and their matching causes.",
      sampleAnswer: "1. Frothy blood-tinged: Acute Pulmonary Edema (APO). 2. Blood-stained: Bronchogenic carcinoma or acute severe infections. 3. Blood-streaked: Chronic bronchitis, Tuberculosis, or bronchogenic carcinoma. 4. Red-current jelly: Classic bronchogenic carcinoma. 5. Rusty/Golden brown: Lobar pneumonia. 6. Frank hemoptysis: Cavitary Tuberculosis, pulmonary embolism with infarction, or bronchiectasis sicca hemorrhagica."
    },
    {
      id: "copd-viva-49",
      question: "Differentiate completely between Hemoptysis and Hematemesis.",
      sampleAnswer: "Hemoptysis: Preceded by coughing; the blood is frothy, bright red, and has an alkaline pH; it is clinically followed by blood-tinged sputum for days. Hematemesis: Preceded by nausea and vomiting; the blood contains food particles, is dark brown (coffee-ground color), and has an acidic pH; it is clinically followed by dark tarry stools (melena)."
    },
    {
      id: "copd-viva-50",
      question: "What are the six main medical causes of significant hemoptysis?",
      sampleAnswer: "Mitral stenosis with Left Ventricular Failure (LVF), pulmonary Tuberculosis, acute severe bronchitis, bronchiectasis, bronchial adenoma/carcinoma, and pulmonary embolism with lung infarction."
    },

    // === SECTION 8: DYSPNEA VARIANTS & ASTHMA ===
    {
      id: "copd-viva-51",
      question: "What are the common medical causes of paroxysgal dyspnea?",
      sampleAnswer: "The 'HALAM' mnemonic: Hysterical dyspnea, Asthma (bronchial, cardiac, or uremic), Laryngismus stridulus, Allergic alveolitis, and Myasthenia gravis or Mediastinal Syndrome."
    },
    {
      id: "copd-viva-52",
      question: "What are the pathophysiological causes of acute dyspnea?",
      sampleAnswer: "1. Acute Hypoventilation: airway obstruction (acute bronchial asthma attack or foreign body) or restriction (acute pneumothorax). 2. Impairment of Gas Diffusion: acute pulmonary edema (cardiac asthma). 3. Acute Hypoperfusion: acute massive pulmonary embolism."
    },
    {
      id: "copd-viva-53",
      question: "What are the clinical variants of dyspnea based on position?",
      sampleAnswer: "1. Orthopnea: Shortness of breath while lying flat, relieved immediately by sitting up, typical of congestive Heart Failure. 2. Platypnea: Shortness of breath experienced when sitting up or standing, completely relieved by lying flat, highly specific for Hepatopulmonary Syndrome. 3. Trepopnea: Shortness of breath when lying on one specific lateral side but not the other, typical of a unilateral lung abscess, unilateral pleural effusion, or acute unilateral pleurisy (the patient characteristically prefers to sleep on the diseased/affected side to optimize ventilation in the healthy lung)."
    },
    {
      id: "copd-viva-54",
      question: "What is Kussmaul breathing, and what does it indicate?",
      sampleAnswer: "It is a deep, rapid, sighing respiratory pattern that occurs in cases of severe metabolic acidosis, characteristically seen in Diabetic Ketoacidosis (DKA)."
    },
    {
      id: "copd-viva-55",
      question: "Differentiate completely between Cardiac Asthma and Bronchial Asthma.",
      sampleAnswer: "Cardiac Asthma: Occurs at any age, associated with prominent cardiac history/symptoms, typically has a short chronic duration, attacks manifest 1-2 hours after falling asleep, relieved spontaneously or with diuretics, involves mainly inspiratory dyspnea, and produces a pink frothy sputum. Bronchial Asthma: Occurs primarily at a younger age, associated with respiratory allergy/chest symptoms, has a long duration of recurrent years, attacks manifest early in the morning, relieved by bronchodilators, involves expiratory dyspnea with wheezing, and produces thick mucoid sputum."
    },
    {
      id: "copd-viva-56",
      question: "What is the medical management regimen for a patient with Bronchial Asthma?",
      sampleAnswer: "Between attacks (Maintenance): Antigen avoidance, oral or inhaled corticosteroids, and mast cell stabilizers (e.g., Ketotifen). During an acute attack: Oxygen ($O_2$) therapy, short-acting inhaled bronchodilators (Salbutamol inhaler or intravenous Aminophylline), inhaled corticosteroids, mucolytics, and broad-spectrum antibiotics if an infection triggered the attack."
    },

    // === SECTION 9: COR PULMONALE & LUNG SYNDROME EXTRA-MANIFESTATIONS ===
    {
      id: "copd-viva-57",
      question: "Define Cor Pulmonale and classify its causes based on onset.",
      sampleAnswer: "Definition: Right Ventricular Hypertrophy (RVH) and/or Right Ventricular Failure (RVF) directly caused by a primary respiratory or chest disease, on top of a healthy left side of the heart. Acute causes: Tension pneumothorax or massive pulmonary embolism. Subacute causes: Multiple recurrent showers of small pulmonary emboli. Chronic causes: Hypoxic (COPD), Obliterative (lung fibrosis or Bilharzial cor pulmonale), and Restrictive (severe thoracic skeletal deformities)."
    },
    {
      id: "copd-viva-58",
      question: "What are the clinical systemic manifestations of Cor Pulmonale?",
      sampleAnswer: "Congested neck veins, a congested tender and pulsating liver, clinical jaundice, bilateral pitting lower limb edema, and ascites."
    },
    {
      id: "copd-viva-59",
      question: "What are the four primary chest-related causes of jaundice?",
      sampleAnswer: "1. Cor pulmonale (causing systemic liver congestion). 2. Pulmonary infarction (causing a hemolytic load). 3. Bronchogenic carcinoma with direct liver metastasis (causing obstructive jaundice). 4. Hepatotoxic anti-Tuberculosis drug therapy."
    },
    {
      id: "copd-viva-60",
      question: "What are the chest-related causes of lower limb edema?",
      sampleAnswer: "1. Right ventricular failure secondary to Cor Pulmonale. 2. Hypoalbuminemia caused by chronic excessive expectoration or frequent aspiration of a large empyema. 3. Nephrotic syndrome secondary to renal amyloidosis from chronic Suppurative Lung Syndrome. 4. Acute acid-base disturbances in severe COPD, where chronic hypercapnia causes marked renal salt and fluid retention."
    },
    {
      id: "copd-viva-61",
      question: "What causes a significantly loud or accentuated second heart sound over the pulmonary area?",
      sampleAnswer: "It indicates severe Pulmonary Hypertension."
    },
    {
      id: "copd-viva-62",
      question: "What are the specific causes of hepatomegaly and splenomegaly in a chest patient?",
      sampleAnswer: "Hepatomegaly: Cor pulmonale, hypoxic congestion, ptosed liver (pushed down by emphysema), amebic liver abscess, secondary bronchogenic carcinoma metastasis, or fatty liver changes from chronic toxemia. Splenomegaly: Congestive cor pulmonale, hypoxic portal congestion, miliary Tuberculosis, active sarcoidosis, or secondary amyloidosis."
    },

    // === SECTION 10: COPD IN-DEPTH & SYSTEMIC FEATURES ===
    {
      id: "copd-viva-63",
      question: "List the common local and systemic complications of Chronic Obstructive Pulmonary Disease (COPD).",
      sampleAnswer: "Local: Acute respiratory failure, recurrent pulmonary infections, chronic persistent cough complications, bronchial obstruction, and spontaneous pneumothorax. Systemic: Cor pulmonale, right-sided or left-sided heart failure, systemic thromboembolism, erythrocytosis, renal salt and fluid retention, proteinuria, and chronic peptic ulceration."
    },
    {
      id: "copd-viva-64",
      question: "Classify the two main clinical types of COPD.",
      sampleAnswer: "Type A (Pink Puffer): Characterized by a diffusion defect due to reduced alveolar surface area (Emphysema). Shows an increased ventilation/perfusion ($V/Q$) ratio, hypoxemia with normal or low $CO_2$, normal respiratory center sensitivity, and severe dyspnea. Type B (Blue Bloater): Characterized by obstructive hypoventilation and $V/Q$ imbalance. Shows severe hypoxemia with chronic hypercapnia, which decreases respiratory center sensitivity, resulting in chronic cyanosis, early pulmonary hypertension, cor pulmonale, and minimal active dyspnea."
    },
    {
      id: "copd-viva-65",
      question: "What are the primary diagnostic investigations for a patient with suspected COPD?",
      sampleAnswer: "1. Spirometry (Pulmonary Function Test): confirms an obstructive pattern. 2. Sputum analysis: rules out secondary infections. 3. Arterial Blood Gases (ABG): evaluates oxygenation and hypercapnia. 4. Chest X-Ray: demonstrates lung hyperinflation (flattened diaphragms, widened intercostal spaces, increased radiolucency)."
    },
    {
      id: "copd-viva-66",
      question: "How do you diagnose and confirm a fixed airway obstruction in COPD using standard Spirometry values?",
      sampleAnswer: "By measuring the Tiffeneau index ($FEV_1/FVC$). A post-bronchodilator ratio below 70-75% ($FEV_1/FVC < 0.75$) confirms a fixed airway obstruction. Normal baseline reference values are roughly 5 liters for Forced Vital Capacity (FVC) and 4 liters for Forced Expiratory Volume in 1 second ($FEV_1$)."
    },
    {
      id: "copd-viva-67",
      question: "What is the clinical value of pulse examination in a severe COPD patient?",
      sampleAnswer: "A rapid, bounding, large volume pulse indicates tachycardia and a hyperdynamic circulation secondary to hypercapnia and severe hypoxemia. Conversely, a small volume pulse indicates advanced pulmonary hypertension progressing to right heart failure. Pulsus paradoxus can also be detected in severe acute exacerbations."
    },
    {
      id: "copd-viva-68",
      question: "List the choice diagnostic investigations for COPD, Lung Fibrosis, Bronchiectasis, Cavitary Lesions, and Pleural Effusion.",
      sampleAnswer: "COPD: Pulmonary Function Test demonstrating an obstructive defect. Lung Fibrosis: Pulmonary Function Test demonstrating a restrictive defect. Bronchiectasis: High-Resolution Computed Tomography (HRCT) is the gold standard (historically bronchography). Lung Cavity/Abscess: Standard CT scan (historically conventional tomography). Pleural Effusion: Plain Chest X-Ray for basic detection, Ultrasound ($U/S$) for encysted fluid, and a pleural biopsy if Tuberculosis is suspected."
    }
  ],
};
