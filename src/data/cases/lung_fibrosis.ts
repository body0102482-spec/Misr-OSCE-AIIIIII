import { Case } from "../../types";

export const lungFibrosisCase: Case = {
  id: "fibrosis-001",
  name: "Lung Fibrosis & Volume Loss (Post-TB/Lobectomy)",
  specialty: "Respiratory",
  difficulty: "Hard",
  time: "15 mins",
  patient: {
    name: "Sameh Refaat Al-Tawil",
    age: 45,
    gender: "Male",
    occupation: "Former Car Mechanic",
    chiefComplaint: "Shortness of breath on mild exertion of 3 weeks duration.",
    vitals: {
      bp: "125/80 mmHg",
      hr: "88 bpm (Regular)",
      rr: "22 bpm (Tachypneic at rest)",
      temp: "36.8 °C",
      oxygen: "94% (On room air)",
    },
  },
  history: {
    presentIllness: "The patient has a 10-year history of dry cough and mild baseline shortness of breath following major chest surgery. Over the last 3 weeks, he reports a gradual onset and progressive course of worsening dyspnea, which increases significantly with minor physical exertion and is relieved with rest. This is accompanied by an occasional dry cough. Positive symptoms: Reports chronic, non-progressive exercise limitation. Negative symptoms: No active fever, no night sweats, no recent anorexia or weight loss (ruling out active TB relapse). No chest pain, no hemoptysis, and no history of recurrent sputum purulence since his surgery. No systemic congestion (no lower limb edema, no right hypochondrial pain, no jaundice) and no orthopnea or paroxysmal nocturnal dyspnea (PND). No low cardiac output symptoms (no syncope, no headache, no dizziness, or cold extremities) and no cyanosis.",
    pastHistory: "Had severe cavitary Pulmonary Tuberculosis (TB) 10 years ago in his left lung, which was complicated by localized lung abscess and chronic empyema. This required a left-sided lateral thoracotomy, lobectomy, and extensive pleural decortication. His surgical wound got infected post-operatively and was left open to heal by secondary intention, requiring multiple chest tube insertions and prolonged drainage. No past history of diabetes mellitus, arterial hypertension, bronchial asthma, or rheumatic carditis.",
    drugHistory: "Takes no daily chronic medications. Uses inhaled Ventolin (salbutamol) as needed during bouts of breathlessness, which provides minimal symptomatic relief.",
    familyHistory: "Negative consanguinity. No siblings or maternal/paternal relatives suffer from chronic lung disease or early-onset genetic/cardiac conditions.",
    socialHistory: "Married with 2 children. Formerly worked as a car mechanic in Helwan, Cairo, but had to stop heavy physical labor due to chronic breathlessness. He is a former heavy cigarette smoker (smoked 20 cigarettes a day for 20 years, but permanently quit 10 years ago when diagnosed with tuberculosis).",
  },
  examination: {
    inspection: "Chest Inspection shows: Symmetrical thoracic movement, but asymmetrical chest wall shape with a distinct unilateral left-sided retraction (volume loss of the left hemithorax). A major 12 cm long left lateral thoracotomy scar is clearly visible in the left subaxillary region, presenting as thick, irregular tissue consistent with healing by secondary intention, with multiple small adjacent scars from prior chest tube drain placement. Respiration style is abdominothoracic (normal for adult males). Positive Trail's Sign is visible (marked prominence of the sternal head of the left sternocleidomastoid muscle due to tracheal deviation to the left). Pulsations: Clear, visible apical and epigastric pulsations are detected. There are absolutely no dilated veins, collateral superficial chest vessels, or skin pigmentations.",
    inspectionImage: "/left lateral thoracotomy scar.webp, /trachea shift ( trill's sign ).jpg, /Chest tube scar.jpg",
    palpation: "Tracheal Palpation: Confirming that the trachea is significantly pulled (deviated) to the left side (ipsilateral traction indicating left-sided volume loss). Tactile Vocal Fremitus (TVF): Distinctly increased TVF over the left supramammary area (typical of lung consolidation/fibrosis under a patent bronchus), but severely diminished TVF over the left mammary and inframammary areas (due to left lower lobectomy and thickened pleural fibrothorax). Limited, restricted chest wall expansion is palpable on the left side during deep inspiration. No bony, muscular, or scar line tenderness, and no palpable rhonchi or wheezes are present.",
    palpationVideo: "/chest palpation.mp4",
    percussion: "Chest Percussion: Heterogeneous left-sided dullness is elicited over the left mammary and inframammary regions (indicative of left lung fibrosis and volume loss). Dullness is also elicited over the left Kronig's isthmus (apical area of the left shoulder, indicating left upper lobe apical pleural thickening or fibrosis), whereas the right Kronig's isthmus is completely resonant. Right-sided hyperinflation (compensatory emphysema) is present, as evidenced by resonant chest notes. The bare area of cardiac dullness is dull. Traub's (Traube's) space percussion shows completely normal tympanic resonance.",
    percussionVideo: "/chest percussion.mp4",
    auscultation: "Auscultation of the lungs reveals: Symmetrically diminished air entry over the left lung, especially over the left inframammary region (corresponding to the lobectomy and thickened pleura). Harsh bronchial breath sounds are heard over the left supramammary area (classic for left upper lobe fibrosis with patent airways). Left-side additional sounds: Early inspiratory fine crepitations and expiratory wheezes (consonating crepitations/crackles) are audible over the left supramammary region. Right lung fields show harsh vesicular breathing associated with a prolonged expiratory phase, consistent with compensatory hyperinflation (emphysema), without any additional chest sounds.",
    auscultationAudio: "/Fine Crackles Lung Sounds - EMTprep.com(MP3_160K)(2) - Copy.mp3",
    specialTests: [
      { name: "Trail's Sign Demonstration", finding: "Positive. The left sternal head of the sternocleidomastoid muscle is visually prominent because the trachea is deviated towards the left side.", video: "/treacheal examination.mp4" },
      { name: "Kronig's Isthmus Percussion", finding: "Dullness over the left Kronig's isthmus (normally resonant shoulder strap band, 4-6 cm wide) and resonance over the right, indicating unilateral left apical fibrosis or retraction." },
      { name: "Traube's Space Percussion", finding: "Normal tympanic resonance is elicited in Traube's space, ruling out splenomegaly or active massive left pleural effusion." }
    ],
  },
  investigations: [
    { name: "Spirometry", result: "FEV1/FVC: 0.86 (Normal ratio, ruling out obstructive pathology). FVC: 46% of predicted value (Severe restrictive lung defect). Total Lung Capacity (TLC): 50% indicating severe parenchymal and chest wall restriction." },
    { name: "Chest X-Ray", result: "Marked deviation of the trachea, mediastinum, and cardiac silhouette to the left side. Significant elevation of the left hemidiaphragm with narrowing of the left intercostal spaces (volume loss). Dense, coarse fibrotic bands with pleural thickening are visible in the left apex and upper lobe, with absence of normal lung expansion in the middle/lower zones (post-surgical left lobectomy state). Right lung field appears hyperinflated with increased radiolucency but clear bronchoalveolar markings." },
    { name: "AFB Sputum Smear & PCR", result: "Three consecutive morning sputum smears are fully Negative for Acid-Fast Bacilli (AFB). GeneXpert MTB/RIF PCR: Negative for Mycobacterium tuberculosis DNA (indicating inactive, cured post-tuberculosis pulmonary sequelae)." },
    { name: "Echocardiography", result: "Cardiac silhouette displaced to the left. Normal left ventricular dimensions and excellent contractility (LVEF: 65%). Normal right atrial and ventricular dimensions with an estimated systolic pulmonary artery pressure (SPAP) of 28 mmHg." }
  ],
  diagnosis: {
    provisional: "Unilateral Left Lung Fibrosis and Volume Loss secondary to cured Pulmonary Tuberculosis, post-Left Lobectomy and Pleural Decortication",
    differentials: ["Active Recurrent Pulmonary Tuberculosis", "Chronic Left-sided Fibrothorax / Empyema", "Unilateral Left Bronchiectasis", "Lung Cancer with secondary collapse"],
    management: "No active anti-tuberculosis therapy is indicated (cured). Refer to comprehensive pulmonary rehabilitation to improve the efficiency of the remaining right lung and left upper lobe. Strictly optimize airway clearance and breathing techniques. Counsel the patient on annual pneumococcal and seasonal influenza vaccinations to protect remaining lung capacity from infections. Regular monitoring of spirometry and clinical oxygen saturation. Strictly maintain smoking cessation.",
  },
  checklist: [
    { item: "Elicited details of previous pulmonary tuberculosis (10 years ago), left-sided thoracotomy, lobectomy, and wound infection", category: "History" },
    { item: "Asked about current gradual onset, progressive exertional shortness of breath, and dry cough", category: "History" },
    { item: "Inquired about systemic and constitutional symptoms, ruling out active TB relapse (no fever, sweat, or weight loss)", category: "History" },
    { item: "Inspected the chest carefully, documenting unilateral left-sided retraction and the 12 cm irregular scar from secondary intention healing", category: "Examination" },
    { item: "Identified a positive Trail's sign and palpated tracheal deviation to the left side", category: "Examination" },
    { item: "Palpated chest expansion and noted increased TVF in the left supramammary but decreased in the inframammary region", category: "Examination" },
    { item: "Elicited dullness on percussion over the left chest, including the left Kronig's isthmus while noting resonance on the right", category: "Examination" },
    { item: "Detected cardiac dullness shifting (bare area dull) and resonant Traube's area", category: "Examination" },
    { item: "Auscultated bronchial breath sounds with early inspiratory fine crepitations and expiratory wheezes in the left supramammary region", category: "Examination" },
    { item: "Noted diminished air entry in the left inframammary and harsh vesicular breathing with prolonged expiration on the right", category: "Examination" },
    { item: "Interpreted investigations including restrictive spirometry (FVC 46%) and Chest X-Ray showing left volume loss and leftward mediastinal shift", category: "Reasoning" },
    { item: "Formulated diagnosis linking previous left lobectomy and infection to unilateral left lung fibrosis and chronic restrictive defect", category: "Reasoning" },
    { item: "Explained the benign nature of cured TB sequelae while advising on protective lung habits with empathy", category: "Communication" }
  ],
  examinerQuestions: [
    // === SECTION 1: LUNG SURFACES, ANATOMY & FISSURES ===
    {
      id: "fibrosis-viva-1",
      question: "What is the surface anatomy of the right lung?",
      sampleAnswer: "Apex: 3cm above medial 1/3 of clavicle. Anterior border: runs from apex through sternoclavicular junction, down vertically to the 6th costal cartilage. Inferior border: 6th rib in MCL, 8th rib in MAL, and 10th rib close to the vertebral column posteriorly. Posterior border: vertical line along the side of the vertebral column from the 10th rib up to the apex."
    },
    {
      id: "fibrosis-viva-2",
      question: "What is the surface anatomy of the left lung?",
      sampleAnswer: "Similar to the right lung, but the anterior border descends vertically only to the 4th costal cartilage, where it deviates laterally to the left forming the cardiac notch, before continuing down to the 6th costal cartilage."
    },
    {
      id: "fibrosis-viva-3",
      question: "What is the surface anatomy of the trachea?",
      sampleAnswer: "It extends from the 6th cervical vertebra (C6) down to the 4th thoracic vertebra (T4) at the Angle of Louis. Its total length is 10 cm, with the upper 5 cm in the neck and the lower 5 cm inside the chest cavity."
    },
    {
      id: "fibrosis-viva-4",
      question: "What is the surface anatomy of the lung fissures?",
      sampleAnswer: "Oblique fissure (both lungs): Starts posteriorly at T3, crosses the MAL at the 5th rib, and ends anteriorly at the 6th costochondral junction in the MCL. Transverse fissure (right lung only): Starts from the 6th rib at the MAL and extends horizontally forward to the sternal end at the 4th costochondral junction."
    },
    {
      id: "fibrosis-viva-5",
      question: "What does the clinical instruction 'examine the lower lobes' practically mean?",
      sampleAnswer: "It strictly means to 'examine the back of the chest'."
    },

    // === SECTION 2: INSPECTION & CHEST WALL SHAPES ===
    {
      id: "fibrosis-viva-6",
      question: "What is the surface anatomy of Kronig's isthmus?",
      sampleAnswer: "It is a band of resonance over the lung apex bounded by 4 landmarks: Anteriorly by the medial 2/3 of the clavicle, posteriorly by the medial 1/3 of the scapular spine, laterally by a line connecting the junction of the medial 2/3 and lateral 1/3 of the clavicle to the junction of the medial 1/3 and lateral 2/3 of the scapular spine, and medially by a line connecting the sternoclavicular joint to the C7 spine."
    },
    {
      id: "fibrosis-viva-7",
      question: "What are the causes of dullness over Kronig's isthmus?",
      sampleAnswer: "Apical lung lesions such as Pancoast tumor, Pulmonary Tuberculosis (apical lung fibrosis), or Friedlander's pneumonia."
    },
    {
      id: "fibrosis-viva-8",
      question: "Describe the clinical signs and features of a Barrel Chest.",
      sampleAnswer: "It is a symmetrical chest deformity characterized by an increased Anteroposterior diameter that is equal to or greater than the transverse diameter. Features include a wide subcostal angle, horizontal ribs with widened intercostal spaces, thick shoulders, protrusion of the sternum, and a chest that moves up and down as a single unit due to overaction of accessory muscles of inspiration."
    },
    {
      id: "fibrosis-viva-9",
      question: "What is the underlying cause of a Barrel Chest?",
      sampleAnswer: "Chronic lung hyperinflation, characteristically seen in Emphysema and COPD."
    },
    {
      id: "fibrosis-viva-10",
      question: "What are the other abnormal chest shapes you can observe and their causes?",
      sampleAnswer: "1. Elliptical chest (normal shape). 2. Pigeon chest (Pectus carinatum): caused by Rickets or severe childhood respiratory distress like bronchial asthma. 3. Funnel chest (Pectus excavatum): a congenital or occupational deformity (e.g., Shoemaker's chest). 4. Alar/Flat chest (normal variant). 5. Kyphosis (spinal curvature change)."
    },
    {
      id: "fibrosis-viva-11",
      question: "How do you clinically differentiate a normal hemithorax from an abnormal one showing bulge or retraction?",
      sampleAnswer: "By assessing chest expansion. The side showing restricted or limited chest expansion is always the abnormal hemithorax, whether it is bulging or retracted."
    },
    {
      id: "fibrosis-viva-12",
      question: "What are the specific causes of unilateral chest bulge versus unilateral chest retraction?",
      sampleAnswer: "Unilateral Bulge: Pleural effusion, pneumothorax, chest wall tumors, or chest wall emphysema. Unilateral Retraction: Lung fibrosis, lung collapse, or a past pneumonectomy."
    },
    {
      id: "fibrosis-viva-13",
      question: "What conditions cause abdominal respiratory movement versus thoracic respiratory movement?",
      sampleAnswer: "Abdominal movement (seen when chest movement is restricted): Pleurisy, pleural effusion, intercostal muscle paralysis, or severe emphysema. Thoracic movement (seen when abdominal movement is restricted): Tense ascites, peritonitis, or massive abdominal tumors."
    },
    {
      id: "fibrosis-viva-14",
      question: "What is the normal respiratory rate, and what defines tachypnea?",
      sampleAnswer: "The normal respiratory rate is 14 to 20 breaths per minute. A rate of 21 breaths per minute or more defines tachypnea."
    },
    {
      id: "fibrosis-viva-15",
      question: "What are the primary accessory muscles of inspiration and expiration?",
      sampleAnswer: "Accessory muscles of inspiration: Sternomastoids, Scalini, and Trapezii. Accessory muscles of expiration: Abdominal muscles, Latissimus dorsalis, and pursed lips."
    },
    {
      id: "fibrosis-viva-16",
      question: "What is Litten's sign, how is it produced, and what does its absence mean?",
      sampleAnswer: "It is a normal rippling shadow seen moving down the lower intercostal spaces during deep inspiration in thin individuals, caused by diaphragmatic descent. Its unilateral absence indicates pathological conditions such as diaphragmatic paralysis or pleural effusion."
    },

    // === SECTION 3: PALPATION, TRACHEA, & TVF ===
    {
      id: "fibrosis-viva-17",
      question: "What are the mechanical causes of tracheal displacement/shift?",
      sampleAnswer: "Shifted to the same side: due to pulling forces from lung fibrosis, lung collapse, or pneumonectomy. Shifted to the opposite/other side: due to pushing forces from massive pleural effusion, pneumothorax, hydropneumothorax, or unilateral emphysema."
    },
    {
      id: "fibrosis-viva-18",
      question: "What is Trail's sign and its clinical significance?",
      sampleAnswer: "It is the abnormal, unilateral prominence or bulge of the sternomastoid tendon on the side toward which the trachea has significantly shifted."
    },
    {
      id: "fibrosis-viva-19",
      question: "What are the main causes of a tender chest wall classified by anatomical structure?",
      sampleAnswer: "From outside inward: Skin/Nerves (Herpes Zoster: unilateral, dermatomal), Muscles (Myositis), Vessels (Thrombophlebitis), Bones (Osteomyelitis, fracture rib, or tender sternum in Leukemia), Cartilage (Costochondritis/Tietze syndrome), Pleura (Pleurisy felt in lower axillary areas or beneath breasts), and Liver (Right-sided Amebic liver abscess)."
    },
    {
      id: "fibrosis-viva-20",
      question: "Define Tactile Vocal Fremitus (TVF) and list the three classic conditions that increase it.",
      sampleAnswer: "TVF represents the vibrations of the vocal cords transmitted through the airways and palpated on the chest wall. It is characteristically increased by the '3Cs': 1. Consolidation, 2. Cavitation (if superficial and surrounded by consolidation), 3. Collapse with a patent main bronchus."
    },
    {
      id: "fibrosis-viva-21",
      question: "What conditions cause a decrease or reduction in Tactile Vocal Fremitus (TVF)?",
      sampleAnswer: "Any other respiratory or pleural disease outside of the 3Cs, such as pleural effusion, pneumothorax, emphysema, or thickened pleura."
    },
    {
      id: "fibrosis-viva-22",
      question: "What are the causes of limited chest expansion classified as bilateral versus unilateral?",
      sampleAnswer: "Bilateral limitation: COPD, emphysema, lung fibrosis, or bilateral basal bronchiectasis. Unilateral limitation: Pleural effusion, pneumothorax, unilateral lung fibrosis, lung collapse, or severe lobar pneumonia."
    },
    {
      id: "fibrosis-viva-23",
      question: "What is the clinical significance of feeling palpable rhonchi during chest palpation?",
      sampleAnswer: "It indicates severe airway narrowing due to bronchospasm or thick secretions, characteristically found in COPD and Bronchial Asthma."
    },

    // === SECTION 4: PERCUSSION & TRAUBE'S AREA ===
    {
      id: "fibrosis-viva-24",
      question: "What are the six main types of chest percussion notes and their classic clinical examples?",
      sampleAnswer: "1. Resonance: Normal healthy lung. 2. Hyperresonance: Emphysema and pneumothorax. 3. Tympanitic: Over a hollow viscus containing air, like a normal Traube's area. 4. Impaired note: Early pulmonary consolidation or lung fibrosis. 5. Dullness: Pulmonary consolidation, lung collapse, or deep fibrosis. 6. Stony dullness: Pathognomonic for a massive pleural effusion."
    },
    {
      id: "fibrosis-viva-25",
      question: "What is the anatomical surface anatomy of Traube's area?",
      sampleAnswer: "It is bounded by four points: Superiorly by the 6th rib in the Left MCL, Inferiorly by the Left costal margin in the MAL, Right/Medially by the 8th costochondral junction (left parasternal line), and Left/Laterally by the 9th rib in the Left MAL."
    },
    {
      id: "fibrosis-viva-26",
      question: "What are the normal contents of Traube's area, and what note does it normally yield?",
      sampleAnswer: "It overlies the fundus of the stomach containing an air bubble, which normally yields a tympanitic resonant percussion note."
    },
    {
      id: "fibrosis-viva-27",
      question: "Detail the pathological and physiological causes of dullness over Traube's area based on anatomical direction.",
      sampleAnswer: "Pathological: From above (Pleural effusion, pericardial effusion), From below (Ascites, colon cancer, gastric tumors), From the right (Left-lobe hepatomegaly), From the left (Splenomegaly, even less than 3 times normal size). Physiological: A full stomach or advanced pregnancy."
    },
    {
      id: "fibrosis-viva-28",
      question: "What clinical conditions cause Traube's area to abnormally increase or widen in size?",
      sampleAnswer: "Left lung lobectomy, splenectomy, a severely shrunken liver, or acute gastric dilatation."
    },
    {
      id: "fibrosis-viva-29",
      question: "What is the surface anatomy of the Cardiac Bare Area, its normal percussion note, and when does it change?",
      sampleAnswer: "Anatomy: Located at the left 4th and 5th intercostal spaces from the left sternal border to the left parasternal line. Note: Normally dull due to the underlying heart blood. Pathological Resonance: Occurs in Emphysema (the surest clinical sign) and pneumothorax. Increased Dullness: Occurs in lung collapse, right ventricular hypertrophy ($RV++$), or pericardial effusion."
    },
    {
      id: "fibrosis-viva-30",
      question: "What is Tidal Percussion, what are its diagnostic values, and what is reversed tidal percussion?",
      sampleAnswer: "Tidal percussion is used to measure diaphragmatic mobility by percussing the lower lung border at the back between full inspiration and forced expiration. Normally, dullness at T10 changes to resonance during deep inspiration. If dullness persists and fails to change, it indicates a supra-diaphragmatic lesion (like pleural effusion). Reversed tidal percussion occurs when a resonant note becomes dull during inspiration, which is diagnostic of diaphragmatic paralysis."
    },

    // === SECTION 5: AUSCULTATION & BREATH SOUNDS ===
    {
      id: "fibrosis-viva-31",
      question: "Describe the characteristics of normal vesicular breathing.",
      sampleAnswer: "It is a soft, rustling sound (resembling rustling leaves). The inspiratory phase is much longer than the expiratory phase (expiration is roughly 1/3 of inspiration), and there is absolutely no gap or pause between inspiration and expiration."
    },
    {
      id: "fibrosis-viva-32",
      question: "Describe bronchial breathing and state its three main pathological causes.",
      sampleAnswer: "It is a loud, harsh, hollow breath sound where the expiratory phase equals the inspiratory phase, and there is a distinct, clear gap/pause between inspiration and expiration. It is abnormally heard over the lung fields in the '3Cs': Consolidation, Cavitation, and Collapse with a patent bronchus."
    },
    {
      id: "fibrosis-viva-33",
      question: "Where is bronchial breathing considered a completely normal physiological finding?",
      sampleAnswer: "When auscultated directly over the trachea."
    },
    {
      id: "fibrosis-viva-34",
      question: "What are the types of crepitations (crackles) and their specific underlying causes?",
      sampleAnswer: "Fine crepitations: indicates interstitial lung disease, early pneumonia, or left-sided heart failure. Coarse crepitations: indicates retained secretions in large airways, such as in a lung abscess or bronchiectasis."
    },
    {
      id: "fibrosis-viva-35",
      question: "What is D'espine's sign, how is it elicited, and what is its clinical significance?",
      sampleAnswer: "Normally, auscultation below the T4 vertebra (tip of T2 spine) yields normal vesicular breathing. D'espine's sign is present when abnormal bronchial breathing and increased vocal resonance are heard below this level. Significance: It indicates pathologically enlarged mediastinal or interbronchial lymph nodes, commonly caused by Tuberculosis or bronchogenic carcinoma."
    },
    {
      id: "fibrosis-viva-36",
      question: "What are the classic characteristics of rhonchi (wheezes) in a stable COPD case?",
      sampleAnswer: "They are generalized (bilateral), polyphonic (multiple pitches), heard during both inspiration and expiration (but predominantly expiratory), and they characteristically alter, shift, or clear after a cough."
    },
    {
      id: "fibrosis-viva-37",
      question: "How do rhonchi caused by a lung tumor differ from those caused by COPD?",
      sampleAnswer: "Rhonchi caused by a lung tumor are strictly localized to the affected area, monophonic (single pitch), and completely fixed (do not change or clear with coughing)."
    },
    {
      id: "fibrosis-viva-38",
      question: "What is an opening snap of the chest?",
      sampleAnswer: "It refers to early inspiratory crepitations that can characteristically occur in patients with COPD."
    },
    {
      id: "fibrosis-viva-39",
      question: "Define a pleural rub, list its causes, and differentiate it from its clinical mimics.",
      sampleAnswer: "It is a superficial, dry, scratching, or gritty friction sound caused by acute pleurisy (dry or with early effusion). It characteristically disappears completely when the patient holds their breath. Mimics: Pericardial rub (continues synchronously with heartbeats regardless of breath-holding) and Stethoscope friction (disappears by applying firm, steady pressure on the chest piece)."
    },
    {
      id: "fibrosis-viva-40",
      question: "Define Vocal Resonance, its abnormal variations, and its main clinical methods.",
      sampleAnswer: "Vocal resonance represents the auscultated vibrations of the vocal cords transmitted through the lungs. It is significantly diminished in all chest diseases except the '3Cs' (Consolidation, Cavitation, Collapse with a patent bronchus), where it increases. Methods: Asking the patient to repeat '44' or '99' in a loud voice (Bronchophony) or whispering (Whispering Pectoriloquy). Aegophony is a nasal, high-pitched variant heard at the upper border of a pleural effusion."
    },

    // === SECTION 6: SUPPURATIVE LUNG SYN DRONE (SLS) & COUGH ===
    {
      id: "fibrosis-viva-41",
      question: "What is Suppurative Lung Syndrome (SLS), its definition, and its four classic diseases?",
      sampleAnswer: "Definition: A group of chronic bronchopulmonary inflammatory diseases characterized by a chronic cough productive of a profuse, purulent, postural, and sometimes fetid sputum. The four diseases are: 1. Lung abscess, 2. Bronchiectasis, 3. Infected lung cyst, 4. Empyema with a bronchopleural fistula."
    },
    {
      id: "fibrosis-viva-42",
      question: "Differentiate completely between classic Bronchiectasis and Bronchiectasis Sicca.",
      sampleAnswer: "Classic Bronchiectasis: Located basally, secondary to pyogenic infections, presenting with excessive purulent sputum and occasional blood-tinged expectoration. Bronchiectasis Sicca Hemorrhagica: Located apically, secondary to Tuberculosis, characterized by excellent postural drainage resulting in a dry cough (no sputum = sicca) accompanied by recurrent frank hemoptysis."
    },
    {
      id: "fibrosis-viva-43",
      question: "Classify the clinical characteristics of cough and their specific diagnostic values.",
      sampleAnswer: "1. Brassy cough: Metallic sound indicating tracheal compression or Mediastinal Syndrome. 2. Bovine cough: Hollow sound without an explosive start, indicating left recurrent laryngeal nerve paralysis. 3. Barking cough: Hysterical or psychogenic in origin. 4. Paroxysmal cough: Whooping cough, Cavity Syndrome, or Bronchial Asthma associated with pharyngeal/laryngeal irritation."
    },
    {
      id: "fibrosis-viva-44",
      question: "What are the common causes of chronic cough?",
      sampleAnswer: "Chronic bronchitis, Suppurative Lung Syndrome (SLS), bronchogenic carcinoma, pulmonary Tuberculosis, pneumoconiosis, sarcoidosis, and post-nasal discharge secondary to chronic sinusitis."
    },
    {
      id: "fibrosis-viva-45",
      question: "What are the thoracic and extra-thoracic complications of severe chronic coughing?",
      sampleAnswer: "Thoracic: Musculoskeletal chest pain, stress fracture of the ribs, pneumothorax, emphysema, and hemoptysis. Extra-thoracic: Facial/eye puffiness, subconjunctival hemorrhage, inguinal or abdominal hernia, and rectal or uterine prolapse."
    },

    // === SECTION 7: EXPECTORATION & HEMOPTYSIS ===
    {
      id: "fibrosis-viva-46",
      question: "List the eight types of expectoration (sputum) and their corresponding diagnostic conditions.",
      sampleAnswer: "1. Pink frothy: Acute Pulmonary Edema (APO) or pulmonary venous congestion. 2. Clear frothy: Bronchoalveolar carcinoma. 3. Mucoid: Chronic bronchitis or bronchial asthma. 4. Purulent/Mucopurulent: Lung abscess, bronchiectasis, or active bronchopulmonary infection. 5. Rusty/Golden brown: Lobar pneumonia (due to altered blood pigment). 6. Chocolate/Anchovy sauce: Amebic lung abscess. 7. Red-current jelly: Bronchogenic carcinoma. 8. Caseous/Nummular (coin-like): Pulmonary Tuberculosis. 9. Black: Carbon inhalation (coal miner's lung)."
    },
    {
      id: "fibrosis-viva-47",
      question: "Differentiate between True and False Hemoptysis.",
      sampleAnswer: "True Hemoptysis: Bleeding arising from structures strictly below the vocal cords. False Hemoptysis: Bleeding originating from structures above the vocal cords (nasopharynx, oral cavity, or larynx). Differentiated clinically via a formal laryngoscopy."
    },
    {
      id: "fibrosis-viva-48",
      question: "List the clinical types of true hemoptysis and their matching causes.",
      sampleAnswer: "1. Frothy blood-tinged: Acute Pulmonary Edema (APO). 2. Blood-stained: Bronchogenic carcinoma or acute severe infections. 3. Blood-streaked: Chronic bronchitis, Tuberculosis, or bronchogenic carcinoma. 4. Red-current jelly: Classic bronchogenic carcinoma. 5. Rusty/Golden brown: Lobar pneumonia. 6. Frank hemoptysis: Cavitary Tuberculosis, pulmonary embolism with infarction, or bronchiectasis sicca hemorrhagica."
    },
    {
      id: "fibrosis-viva-49",
      question: "Differentiate completely between Hemoptysis and Hematemesis.",
      sampleAnswer: "Hemoptysis: Preceded by coughing; the blood is frothy, bright red, and has an alkaline pH; it is clinically followed by blood-tinged sputum for days. Hematemesis: Preceded by nausea and vomiting; the blood contains food particles, is dark brown (coffee-ground color), and has an acidic pH; it is clinically followed by dark tarry stools (melena)."
    },
    {
      id: "fibrosis-viva-50",
      question: "What are the six main medical causes of significant hemoptysis?",
      sampleAnswer: "Mitral stenosis with Left Ventricular Failure (LVF), pulmonary Tuberculosis, acute severe bronchitis, bronchiectasis, bronchial adenoma/carcinoma, and pulmonary embolism with lung infarction."
    },

    // === SECTION 8: DYSPNEA VARIANTS & ASTHMA ===
    {
      id: "fibrosis-viva-51",
      question: "What are the common medical causes of paroxysmal dyspnea?",
      sampleAnswer: "The 'HALAM' mnemonic: Hysterical dyspnea, Asthma (bronchial, cardiac, or uremic), Laryngismus stridulus, Allergic alveolitis, and Myasthenia gravis or Mediastinal Syndrome."
    },
    {
      id: "fibrosis-viva-52",
      question: "What are the pathophysiological causes of acute dyspnea?",
      sampleAnswer: "1. Acute Hypoventilation: airway obstruction (acute bronchial asthma attack or foreign body) or restriction (acute pneumothorax). 2. Impairment of Gas Diffusion: acute pulmonary edema (cardiac asthma). 3. Acute Hypoperfusion: acute massive pulmonary embolism."
    },
    {
      id: "fibrosis-viva-53",
      question: "What are the clinical variants of dyspnea based on position?",
      sampleAnswer: "1. Orthopnea: Shortness of breath while lying flat, relieved immediately by sitting up, typical of congestive Heart Failure. 2. Platypnea: Shortness of breath experienced when sitting up or standing, completely relieved by lying flat, highly specific for Hepatopulmonary Syndrome. 3. Trepopnea: Shortness of breath when lying on one specific lateral side but not the other, typical of a unilateral lung abscess, unilateral pleural effusion, or acute unilateral pleurisy (the patient characteristically prefers to sleep on the diseased/affected side to optimize ventilation in the healthy lung)."
    },
    {
      id: "fibrosis-viva-54",
      question: "What is Kussmaul breathing, and what does it indicate?",
      sampleAnswer: "It is a deep, rapid, sighing respiratory pattern that occurs in cases of severe metabolic acidosis, characteristically seen in Diabetic Ketoacidosis (DKA)."
    },
    {
      id: "fibrosis-viva-55",
      question: "Differentiate completely between Cardiac Asthma and Bronchial Asthma.",
      sampleAnswer: "Cardiac Asthma: Occurs at any age, associated with prominent cardiac history/symptoms, typically has a short chronic duration, attacks manifest 1-2 hours after falling asleep, relieved spontaneously or with diuretics, involves mainly inspiratory dyspnea, and produces a pink frothy sputum. Bronchial Asthma: Occurs primarily at a younger age, associated with respiratory allergy/chest symptoms, has a long duration of recurrent years, attacks manifest early in the morning, relieved by bronchodilators, involves expiratory dyspnea with wheezing, and produces thick mucoid sputum."
    },
    {
      id: "fibrosis-viva-56",
      question: "What is the medical management regimen for a patient with Bronchial Asthma?",
      sampleAnswer: "Between attacks (Maintenance): Antigen avoidance, oral or inhaled corticosteroids, and mast cell stabilizers (e.g., Ketotifen). During an acute attack: Oxygen ($O_2$) therapy, short-acting inhaled bronchodilators (Salbutamol inhaler or intravenous Aminophylline), inhaled corticosteroids, mucolytics, and broad-spectrum antibiotics if an infection triggered the attack."
    },

    // === SECTION 9: COR PULMONALE & LUNG SYNDROME EXTRA-MANIFESTATIONS ===
    {
      id: "fibrosis-viva-57",
      question: "Define Cor Pulmonale and classify its causes based on onset.",
      sampleAnswer: "Definition: Right Ventricular Hypertrophy (RVH) and/or Right Ventricular Failure (RVF) directly caused by a primary respiratory or chest disease, on top of a healthy left side of the heart. Acute causes: Tension pneumothorax or massive pulmonary embolism. Subacute causes: Multiple recurrent showers of small pulmonary emboli. Chronic causes: Hypoxic (COPD), Obliterative (lung fibrosis or Bilharzial cor pulmonale), and Restrictive (severe thoracic skeletal deformities)."
    },
    {
      id: "fibrosis-viva-58",
      question: "What are the clinical systemic manifestations of Cor Pulmonale?",
      sampleAnswer: "Congested neck veins, a congested tender and pulsating liver, clinical jaundice, bilateral pitting lower limb edema, and ascites."
    },
    {
      id: "fibrosis-viva-59",
      question: "What are the four primary chest-related causes of jaundice?",
      sampleAnswer: "1. Cor pulmonale (causing systemic liver congestion). 2. Pulmonary infarction (causing a hemolytic load). 3. Bronchogenic carcinoma with direct liver metastasis (causing obstructive jaundice). 4. Hepatotoxic anti-Tuberculosis drug therapy."
    },
    {
      id: "fibrosis-viva-60",
      question: "What are the chest-related causes of lower limb edema?",
      sampleAnswer: "1. Right ventricular failure secondary to Cor Pulmonale. 2. Hypoalbuminemia caused by chronic excessive expectoration or frequent aspiration of a large empyema. 3. Nephrotic syndrome secondary to renal amyloidosis from chronic Suppurative Lung Syndrome. 4. Acute acid-base disturbances in severe COPD, where chronic hypercapnia causes marked renal salt and fluid retention."
    },
    {
      id: "fibrosis-viva-61",
      question: "What causes a significantly loud or accentuated second heart sound over the pulmonary area?",
      sampleAnswer: "It indicates severe Pulmonary Hypertension."
    },
    {
      id: "fibrosis-viva-62",
      question: "What are the specific causes of hepatomegaly and splenomegaly in a chest patient?",
      sampleAnswer: "Hepatomegaly: Cor pulmonale, hypoxic congestion, ptosed liver (pushed down by emphysema), amebic liver abscess, secondary bronchogenic carcinoma metastasis, or fatty liver changes from chronic toxemia. Splenomegaly: Congestive cor pulmonale, hypoxic portal congestion, miliary Tuberculosis, active sarcoidosis, or secondary amyloidosis."
    },

    // === SECTION 10: COPD IN-DEPTH & SYSTEMIC FEATURES ===
    {
      id: "fibrosis-viva-63",
      question: "List the common local and systemic complications of Chronic Obstructive Pulmonary Disease (COPD).",
      sampleAnswer: "Local: Acute respiratory failure, recurrent pulmonary infections, chronic persistent cough complications, bronchial obstruction, and spontaneous pneumothorax. Systemic: Cor pulmonale, right-sided or left-sided heart failure, systemic thromboembolism, erythrocytosis, renal salt and fluid retention, proteinuria, and chronic peptic ulceration."
    },
    {
      id: "fibrosis-viva-64",
      question: "Classify the two main clinical types of COPD.",
      sampleAnswer: "Type A (Pink Puffer): Characterized by a diffusion defect due to reduced alveolar surface area (Emphysema). Shows an increased ventilation/perfusion ($V/Q$) ratio, hypoxemia with normal or low $CO_2$, normal respiratory center sensitivity, and severe dyspnea. Type B (Blue Bloater): Characterized by obstructive hypoventilation and $V/Q$ imbalance. Shows severe hypoxemia with chronic hypercapnia, which decreases respiratory center sensitivity, resulting in chronic cyanosis, early pulmonary hypertension, cor pulmonale, and minimal active dyspnea."
    },
    {
      id: "fibrosis-viva-65",
      question: "What are the primary diagnostic investigations for a patient with suspected COPD?",
      sampleAnswer: "1. Spirometry (Pulmonary Function Test): confirms an obstructive pattern. 2. Sputum analysis: rules out secondary infections. 3. Arterial Blood Gases (ABG): evaluates oxygenation and hypercapnia. 4. Chest X-Ray: demonstrates lung hyperinflation (flattened diaphragms, widened intercostal spaces, increased radiolucency)."
    },
    {
      id: "fibrosis-viva-66",
      question: "How do you diagnose and confirm a fixed airway obstruction in COPD using standard Spirometry values?",
      sampleAnswer: "By measuring the Tiffeneau index ($FEV_1/FVC$). A post-bronchodilator ratio below 70-75% ($FEV_1/FVC < 0.75$) confirms a fixed airway obstruction. Normal baseline reference values are roughly 5 liters for Forced Vital Capacity (FVC) and 4 liters for Forced Expiratory Volume in 1 second ($FEV_1$)."
    },
    {
      id: "fibrosis-viva-67",
      question: "What is the clinical value of pulse examination in a severe COPD patient?",
      sampleAnswer: "A rapid, bounding, large volume pulse indicates tachycardia and a hyperdynamic circulation secondary to hypercapnia and severe hypoxemia. Conversely, a small volume pulse indicates advanced pulmonary hypertension progressing to right heart failure. Pulsus paradoxus can also be detected in severe acute exacerbations."
    },
    {
      id: "fibrosis-viva-68",
      question: "List the choice diagnostic investigations for COPD, Lung Fibrosis, Bronchiectasis, Cavitary Lesions, and Pleural Effusion.",
      sampleAnswer: "COPD: Pulmonary Function Test demonstrating an obstructive defect. Lung Fibrosis: Pulmonary Function Test demonstrating a restrictive defect. Bronchiectasis: High-Resolution Computed Tomography (HRCT) is the gold standard (historically bronchography). Lung Cavity/Abscess: Standard CT scan (historically conventional tomography). Pleural Effusion: Plain Chest X-Ray for basic detection, Ultrasound ($U/S$) for encysted fluid, and a pleural biopsy if Tuberculosis is suspected."
    }
  ]
};
