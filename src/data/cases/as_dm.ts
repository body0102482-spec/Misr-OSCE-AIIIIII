import { Case } from "../../types";

export const asdmCase: Case = {
  id: "asdm-001",
  name: "AS + MR (Aortic Stenosis &  MitralMitral Regurgitation )",
  specialty: "Cardiology",
  difficulty: "Hard",
  time: "12 mins",
  patient: {
    name: "Tarek Moustafa El-Haddad",
    age: 17,
    gender: "Male",
    occupation: "House Painter",
    chiefComplaint: "Shortness of breath of 2-week duration.",
    vitals: {
      bp: "105/80 mmHg (Narrow pulse pressure)",
      hr: "90 bpm (Regular, small volume/pulsus parvus)",
      rr: "22 bpm (Tachypneic)",
      temp: "37.2 °C",
      oxygen: "95% (Room air)",
    },
  },
  history: {
    presentIllness: "Onset of progressive dyspnea (shortness of breath) started 5 years ago with a gradual onset and progressive course. It increases significantly with physical exertion and decreases with rest, showing no active association. Positive history of Paroxysmal Nocturnal Dyspnea (PND) as the patient wakes up gasping after 2 hours of sleep, requiring him to sleep on 2 pillows. Also complains of frequent episodes of lightheadedness/dizziness and blurred vision during physical exertion. Reports an active cough with expectoration (dark yellow sputum, volume about 1/4 cup, non-offensive, unrelated to any specific position). Developed a high-grade fever 2 weeks ago associated with painful tonsillitis. Crucially, denies hemoptysis or active weight loss. Denies all systemic congestion symptoms (no lower limb edema, no ascites, no right hypochondrial/hepatic congestion pain, no jaundice, or dyspepsia). Denies all other low cardiac output symptoms other than exertional dizziness and blurred vision (specifically no syncope, headache, oliguria, cold extremities, or pallor). No active chest pain, cyanosis, thromboembolic events, or pressure manifestations (no brassy cough, hoarseness, dysphagia, or facial edema).",
    pastHistory: "Patient had child-onset bronchial asthma and suffers from repeated painful tonsillitis (4-5 times per year). Diagnosed 5 years ago with Rheumatic Fever based on modified Jones criteria (treated with corticosteroids and aspirin with temporary improvement). He denies any past history of surgical operations or blood transfusions.",
    drugHistory: "Regularly prescribed intramuscular Depot Penicillin injections every 15 days. Currently taking inhaled Ventolin (salbutamol) and receives occasional home oxygen therapy for his bronchial asthma attacks.",
    familyHistory: "Negative consanguinity. No siblings or first-degree relatives suffer from similar congenital or valvular heart diseases. No family history of chronic genetic or metabolic morbidity.",
    socialHistory: "Single, 17-year-old male who lives with his parents in Shobra Al-Kheima, Cairo. Works physically as an apprentice house painter (exposure to chemical fumes). Non-smoker and has no medical or lifestyle habits of significance.",
  },
  examination: {
    inspection: "General Inspection: Mildly tachypneic, cooperative adolescent male sitting upright. Chest Inspection: Evident linear hyperpigmented scar from a previous chest tube insertion (for past Pleural Effusion) in the left mid-axillary line (NOTE: This is a critical diagnostic discrepancy, as the patient denied surgical history). There is absolutely no precordial bulge (no bulging of the sternum or ribs). No dilated collateral superficial veins, no general chest skin pigmentations, and no active skin lesions.",
    inspectionImage: "/CARDIAC INSPECTION.jpg, /Chest tube scar.jpg.jpg",
    palpation: "Apex: Localized in the Left 5th intercostal space, shifted outwards (displaced laterally) from the midclavicular line. On palpation, characters show a distinctly sustained apex (active lifting heave against the finger throughout systole, indicating left ventricular concentric hypertrophy due to severe pressure overload) with absolute absence of systemic or diastolic thrill. Pulsations: No abnormal epigastric, suprasternal, left parasternal, or pulmonary pulsations are detected. Thrills: A distinct, rough systolic thrill is palpable over the 1st Aortic area (right 2nd intercostal space), radiating towards the carotid arteries. No thrills are felt over the pulmonary, parasternal, or apical areas.",
    palpationVideo: "/Cardiac palpation.mp4",
    percussion: "Normal cardiac dullness limits. Lungs show resonant percussion bilaterally, except for possible mild dullness/reduced air entry at the left lung base near his old chest tube scar.",
    auscultation: "Aortic Area Murmur (Aortic Stenosis - AS): The second heart sound (S2) is muffled/soft at the 1st aortic area. A loud, ejection systolic murmur  is heard loudest at the 1st aortic area, propagating/radiating upwards into the carotid neck arteries and downwards to the apex. This murmur increases in intensity when the patient sits up, leans forward, and holds his breath in full expiration.Mitral Area Findings (Mitral Regurgitation - MR): At the cardiac apex, the first heart sound (S1) is soft and muffled due to incomplete closure of the mitral valve leaflets. A loud, blowing pansystolic murmur  is heard loudest at the apex and radiates directly into the left axilla. The murmur becomes more prominent in the left lateral position and after mild physical exertion. . Lungs: Mild expiratory wheezing bilaterally, consistent with his history of bronchial asthma.",
    auscultationAudio: "/AS + PULMONARY STENOSIS.mp3, /MR+TR+VSD.mp3",
    specialTests: [
      { name: "Leaning Forward Test", finding: "Ejection systolic murmur at the 1st aortic area increases dramatically when leaning forward in expiration." },
      { name: "Carotid Radiation", finding: "Systolic murmur in the 1st Aortic area is clearly auscultated radiating to both carotid arteries." },
      { name: "Pulsus Parvus et Tardus", finding: "Radial pulse is small in volume with a slow, delayed rise, typical of severe aortic stenosis." }
    ],
    
  },
  investigations: [
    { name: "CBC / Inflammatory markers", result: "Hb: 12.8 g/dL, WBC: 9.6 x10^9/L (Mildly elevated, likely due to recent tonsillitis), Platelets: 280,000, ESR: 45 mm/hr (Elevated, indicating recent rheumatic/inflammatory activity), CRP: Positive." },
    { name: "ECG", result: "Sinus rhythm at 90 bpm. Left Ventricular Hypertrophy (LVH) with strain pattern (deep S waves in V1-V2, tall R waves in V5-V6 with ST depression and T-wave inversion in lateral leads). Left Atrial Enlargement represented by a broad, notched P-mitrale in lead II." },
    { name: "Echocardiography", result: "Severe Aortic Stenosis: Calcified/thickened rheumatic aortic valve, peak gradient (PG) of 64 mmHg, aortic valve area (AVA) of 0.8 cm². Concomitant Double Mitral (DM) Valve Disease: Moderate Mitral Regurgitation with moderate Mitral Stenosis (Mitral valve area: 1.6 cm²). Concentric Left Ventricular Hypertrophy with preserved global systolic function (LVEF: 60%). No pleural effusion is currently present." },
    { name: "Chest X-Ray", result: "Boot-shaped heart with an enlarged left ventricular contour and prominent left atrial appendage. Mild lung hyperinflation consistent with bronchial asthma. A dense line of pleural thickening is visible at the right mid-axillary margin corresponding to the prior chest tube site." }
  ],
  diagnosis: {
    provisional: "Rheumatic Combined Valvular Heart Disease (Severe Aortic Stenosis and Mitral Regurgitation - MR ) complicated by Bronchial Asthma",
    differentials: ["Isolated Aortic Stenosis with functional Mitral Regurgitation", "Double Mitral with secondary aortic dilation", "Dilated Cardiomyopathy", "Infective Endocarditis on underlying rheumatic lesion"],
    management: "Refer for urgent cardiothoracic surgical consultation for double valve replacement (Aortic Valve and Mitral Valve replacement/repair). Strict long-term adherence to prophylactic intramuscular Depot Penicillin every 15 days to prevent further rheumatic carditis flares. Treat the current asthmatic exacerbation with inhaled Ventolin (salbutamol) and inhaled corticosteroids. Manage his expectorating cough with mucolytics and direct chest physiotherapy. Strictly avoid aggressive vasodilation (such as high-dose ACE inhibitors) which could cause circulatory collapse in the presence of severe fixed Aortic Stenosis.",
  },
  checklist: [
    { item: "Elicited student/painter occupation and residence in Shobra Al-Kheima", category: "History" },
    { item: "Explored exertional dyspnea, paroxysmal nocturnal dyspnea, and low cardiac output symptoms (dizziness/blurred vision)", category: "History" },
    { item: "Asked about bronchial asthma, salbutamol inhaler use, and rheumatic fever child history", category: "History" },
    { item: "Identified the diagnostic discrepancy of the chest tube scar (for pleural effusion) denied in the past history", category: "Examination" },
    { item: "Palpated the sustained hyperdynamic displaced apex in the 6th Left ICS", category: "Examination" },
    { item: "Noted the presence of a tactile systolic thrill over the 1st Aortic area and absence of other thrills", category: "Examination" },
    { item: "Auscultated a muffled/soft S2 and high-intensity ejection systolic murmur radiating to carotids in the 1st Aortic area", category: "Examination" },
    { item: "Auscultated an accentuated S1 (for Mitral Stenosis) and pansystolic apical murmur radiating to the axilla (for Mitral Regurgitation)", category: "Examination" },
    { item: "Interpreted ECG and Echocardiography outlining severe AS (gradient 64 mmHg, AVA 0.8 cm²) and Double Mitral disease", category: "Reasoning" },
    { item: "Outlined surgical intervention as the primary treatment and cautioned against high-dose aggressive systemic vasodilators due to severe fixed AS", category: "Reasoning" },
    { item: "Maintained professional, empathetic counseling for an adolescent facing major open-heart valve surgery", category: "Communication" }
  ],
  examinerQuestions: [
    {
      id: "asdm-viva-1",
      question: "What is the definition and normal anatomical site of the heart apex?",
      sampleAnswer: "It is the lowest and outermost visible and palpable pulsation of the heart, normally located in the left 5th intercostal space, 3.5 inches (9 cm) from the midsternal line, inside the midclavicular line (MCL). [cite: 5, 6]"
    },
    {
      id: "asdm-viva-2",
      question: "What are the primary causes of an absent heart apex?",
      sampleAnswer: "Mnemonic 'OPEERA': Obesity, Pericardial effusion, Emphysema, Edema of the chest wall, Right-sided pleural effusion, and Anomalies like Dextrocardia. It can also be absent if it is tucked 'under a rib'. [cite: 6]"
    },
    {
      id: "asdm-viva-3",
      question: "What causes a diffuse heart apex?",
      sampleAnswer: "It occurs when the apical pulsation occupies more than one intercostal space, characteristically caused by Left Ventricular Hypertrophy ($LVH$) or dilatation. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-4",
      question: "How do you clinically differentiate between a localized and a diffuse apical impulse?",
      sampleAnswer: "A localized apex is well-defined and caused by left ventricular hypertrophy ($LVH$). A diffuse apex is ill-defined, occupies more than one intercostal space, and is caused by left ventricular dilatation. [cite: 5]"
    },
    {
      id: "asdm-viva-5",
      question: "What are the mechanical causes of a shifted heart apex?",
      sampleAnswer: "Shifted straight down: Visceroptosis or a thin asthenic person. Shifted down and out: Left Ventricular Hypertrophy ($LVH$) or dilatation. Shifted out only: Right Ventricular Hypertrophy ($RVH$). [cite: 6]"
    },
    {
      id: "asdm-viva-6",
      question: "What does the clinical rule 'what shifts the apex shifts the heart' mean, and what is the exception?",
      sampleAnswer: "It means the apex shifts with cardiac displacement, except in Left Ventricular Enlargement where the apex shifts down and out, and Right Ventricular Enlargement where the apex shifts out only. [cite: 5]"
    },
    {
      id: "asdm-viva-7",
      question: "What are the four main pathological characters of the cardiac apex and their matching diseases?",
      sampleAnswer: "1. Normal: Gentle brief impulse. 2. Hyperdynamic: Forcible, brief, non-sustained impulse indicating volume overload on the Left Ventricle (e.g., Mitral Regurgitation or Aortic Regurgitation). 3. Heaving: Forcible, sustained, lifting impulse indicating pressure overload on the Left Ventricle (e.g., Aortic Stenosis or Hypertension). 4. Slapping: Sharp, brief, palpable first heart sound ($S_1$) diagnostic of Mitral Stenosis. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-8",
      question: "What is the clinical definition and significance of a 'parasternal bulge'?",
      sampleAnswer: "It is a precordial protrusion that dates back to childhood, indicating a congenital or rheumatic heart disease that caused severe cardiac enlargement before the chest wall bones completely ossified. [cite: 5]"
    },
    {
      id: "asdm-viva-9",
      question: "What are the common causes of epigastric pulsations?",
      sampleAnswer: "1. From the pulse of the abdominal aorta. 2. From the right ventricle ($RV++$). 3. From liver pulsations (e.g., severe Tricuspid Regurgitation). [cite: 5, 6]"
    },
    {
      id: "asdm-viva-10",
      question: "How do you clinically identify the source of epigastric pulsations during palpation?",
      sampleAnswer: "By using the fingertips: if felt from the tips of the fingers descending from above, it is Right Ventricular ($RV$) enlargement. If felt from the pulp/surface of the fingers from below, it is hepatic or aortic in origin. [cite: 6]"
    },
    {
      id: "asdm-viva-11",
      question: "List the anatomical locations of palpable thrills in a cardiac patient.",
      sampleAnswer: "Apical thrill: Diastolic thrill in Mitral Stenosis, or Systolic thrill in Mitral Regurgitation. Left parasternal thrill: Systolic thrill in Ventricular Septal Defect (VSD). Basal thrill: Systolic thrill in Aortic Stenosis. [cite: 6]"
    },
    {
      id: "asdm-viva-12",
      question: "What are the signs of Right Ventricular (RV) enlargement on physical examination?",
      sampleAnswer: "A diffuse systolic retraction over the apex, a shifted apex outward only, a positive subxiphoid/epigastric pulsation felt from the finger tips, a positive left parasternal heave, and a large area of dullness at the lower sternal border. [cite: 6]"
    },
    {
      id: "asdm-viva-13",
      question: "What are the signs of Left Ventricular (LV) enlargement on physical examination?",
      sampleAnswer: "An apex that is shifted down and out, and is heaving or hyperdynamic in character. [cite: 6]"
    },
    {
      id: "asdm-viva-14",
      question: "What are the causes of volume overload on the Left Ventricle (LV)?",
      sampleAnswer: "Aortic Regurgitation (AR), Mitral Regurgitation (MR), and Patent Ductus Alternosus (PDA). [cite: 6]"
    },
    {
      id: "asdm-viva-15",
      question: "What are the causes of pressure overload on the Left Ventricle (LV)?",
      sampleAnswer: "Aortic Stenosis (AS) and systemic Coarctation of the aorta or severe Hypertension. [cite: 6]"
    },
    {
      id: "asdm-viva-16",
      question: "What are the causes of volume overload on the Right Ventricle (RV)?",
      sampleAnswer: "Tricuspid Regurgitation (TR), Pulmonary Regurgitation (PR), and Atrial Septal Defect (ASD). [cite: 6]"
    },
    {
      id: "asdm-viva-17",
      question: "What are the causes of pressure overload on the Right Ventricle (RV)?",
      sampleAnswer: "Pulmonary Stenosis (PS) and Pulmonary Hypertension (PH). [cite: 6]"
    },
    {
      id: "asdm-viva-18",
      question: "What is the clinical definition and causes of 'pulmonary pulsation'?",
      sampleAnswer: "It is a pathological pulsation felt or seen over the pulmonary area (left 2nd intercostal space), indicating severe Pulmonary Hypertension ($PH++$). [cite: 5]"
    },
    {
      id: "asdm-viva-19",
      question: "What are the primary causes of chronic Pulmonary Hypertension?",
      sampleAnswer: "1. Left-sided heart failure. 2. Chronic lung diseases (Cor pulmonale). 3. Left-to-right shunts due to long-standing lung plethora leading to reversal of the shunt (Eisenmenger syndrome). [cite: 6]"
    },
    {
      id: "asdm-viva-20",
      question: "What are the clinical signs of severe Pulmonary Hypertension on examination?",
      sampleAnswer: "Neck veins showing a giant 'a' wave, visible and palpable pulmonary pulsations with a diastolic shock in the pulmonary area, an accentuated pulmonary component of the second heart sound (loud $S_2$), a close splitting of $S_2$, a Graham Steell murmur, or a functional tricuspid regurgitation murmur. [cite: 6]"
    },
    {
      id: "asdm-viva-21",
      question: "What are the causes of a generalized pulsating liver?",
      sampleAnswer: "It is caused by severe systemic venous congestion, most characteristically due to Tricuspid Regurgitation (TR), Tricuspid Stenosis (TS), or Constrictive Pericarditis. [cite: 6]"
    },
    {
      id: "asdm-viva-22",
      question: "What are the clinical causes of a dynamic, pulsating chest wall?",
      sampleAnswer: "Severe Tricuspid Regurgitation ($TR$), a highly vascular chest wall tumor, or a large eroding aortic aneurysm. [cite: 6]"
    },
    {
      id: "asdm-viva-23",
      question: "Classify dyspnea using the NYHA functional classification system.",
      sampleAnswer: "Class I: Dyspnea on more than ordinary effort. Class II: Dyspnea on ordinary effort. Class III: Dyspnea on sub-ordinary effort. Class IV: Dyspnea at complete rest. [cite: 6]"
    },
    {
      id: "asdm-viva-24",
      question: "Define Paroxysmal Nocturnal Dyspnea (PND) and state its underlying mechanisms.",
      sampleAnswer: "It is a sudden attack of severe shortness of breath that awakes the patient from sleep 1-2 hours after falling asleep, representing early Cardiac Asthma. Mechanisms: 1. Increased venous return during sleep leading to acute pulmonary congestion. 2. Absorption of dependent edema fluid into the circulation. 3. Diminished sympathetic activity during sleep reducing cardiac contractility. 4. Slipping down from pillows, causing abdominal contents to press against the diaphragm. [cite: 6]"
    },
    {
      id: "asdm-viva-25",
      question: "What are the causes of cardiac syncope classified by exertion?",
      sampleAnswer: "Exertional syncope: Obstructive outflow tract lesions like Aortic Stenosis (AS) or Hypertrophic Obstructive Cardiomyopathy (HOCM). Non-exertional syncope: Arrhythmias (Stokes-Adams attacks from complete heart block, severe bradycardia, or Ventricular Fibrillation). Positional syncope: Ball and valve thrombus or a Left Atrial Myxoma. [cite: 6]"
    },
    {
      id: "asdm-viva-26",
      question: "What is Orthostatic Hypotension, its diagnostic criteria, and its main causes?",
      sampleAnswer: "It is a loss of the normal reflex vasoconstriction of lower limb blood vessels upon standing up, leading to a sudden drop in blood pressure. Causes: Autonomic neuropathy (diabetic or uremic), severe varicose veins, hypovolemia (hemorrhage/dehydration), or weakness of lower limb muscles. [cite: 6]"
    },
    {
      id: "asdm-viva-27",
      question: "What is Ortner's syndrome, and what causes it?",
      sampleAnswer: "It is a hoarseness of voice (vocal cord paralysis) caused by mechanical compression of the Left Recurrent Laryngeal Nerve by an enormously enlarged Left Atrium, typical in severe Mitral Stenosis. [cite: 6]"
    },
    {
      id: "asdm-viva-28",
      question: "List the signs of Aortic Regurgitation (AR) that can be observed in the Head and Neck.",
      sampleAnswer: "1. Corrigan's sign: Marked, rapid, expansile carotid pulsations. 2. De Musset's sign: Rhythmic nodding of the head synchronous with the heartbeat. 3. Visible systolic thrill over the carotid artery. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-29",
      question: "List the classic Upper Extremity (Arms/Hands) peripheral signs of Aortic Regurgitation.",
      sampleAnswer: "1. Water-hammer pulse (Corrigan's pulse): A bounding pulse with rapid upstroke and immediate collapse. 2. Wide Pulse Pressure: A large gap between systolic and diastolic blood pressure. 3. Quincke's sign: Visible capillary pulsations in the nail beds. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-30",
      question: "List the Lower Extremity (Legs) peripheral signs of Aortic Regurgitation.",
      sampleAnswer: "1. Hill's sign: Popliteal systolic blood pressure exceeds brachial systolic blood pressure by >20 mmHg. 2. Pistol-shot sound: A sharp, loud sound heard over the femoral artery. 3. Duroziez's sign: A double murmur heard over the femoral artery when compressed by a stethoscope. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-31",
      question: "What is the grading system for Hill's sign in Aortic Regurgitation?",
      sampleAnswer: "Mild AR: Popliteal-brachial systolic difference of 20 mmHg. Moderate AR: Difference of 40 mmHg. Severe AR: Difference of 60 mmHg or more. [cite: 5]"
    },
    {
      id: "asdm-viva-32",
      question: "Describe the typical auscultatory findings in Aortic Stenosis (AS).",
      sampleAnswer: "An Ejection Systolic Murmur ($ESM$) that is harsh, heard best over the aortic area, radiates directly to the carotids, and is accompanied by a soft or absent second heart sound ($S_2$). [cite: 6]"
    },
    {
      id: "asdm-viva-33",
      question: "Describe the typical auscultatory findings in Aortic Regurgitation (AR).",
      sampleAnswer: "An Early Diastolic Murmur ($EDM$) that is soft, blowing, heard best over the aortic or neoaortic (Erb's) area, and increases during full expiration with the patient leaning forward. [cite: 6]"
    },
    {
      id: "asdm-viva-34",
      question: "Describe the typical auscultatory findings in Mitral Regurgitation (MR).",
      sampleAnswer: "A Pan-systolic (holosystolic) murmur that is blowing, heard best over the apex, radiates directly to the left axilla, and is accompanied by a soft or muffled first heart sound ($S_1$). [cite: 6]"
    },
    {
      id: "asdm-viva-35",
      question: "Describe the typical auscultatory findings in Tricuspid Regurgitation (TR).",
      sampleAnswer: "A Pan-systolic murmur heard best over the lower sternal border, which characteristically increases in intensity during full inspiration (Carvallo's sign). [cite: 6]"
    },
    {
      id: "asdm-viva-36",
      question: "Describe the typical auscultatory findings in Mitral Stenosis (MS).",
      sampleAnswer: "A loud, slapping first heart sound ($S_1$), an Opening Snap ($OS$) shortly after $S_2$, and a Mid-Diastolic Rumbling Murmur ($MDRM$) localized to the apex with presystolic accentuation. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-37",
      question: "What is an Ejection Click, and where is it best heard?",
      sampleAnswer: "It is a sharp, high-pitched, early systolic sound caused by the sudden opening of a stenosed aortic or pulmonary valve. The aortic click is heard at the apex/aortic area; the pulmonary click is heard at the pulmonary area and decreases during inspiration. [cite: 6]"
    },
    {
      id: "asdm-viva-38",
      question: "What is an Opening Snap (OS), its significance, and what indicates a severe lesion?",
      sampleAnswer: "It is a sharp, high-pitched diastolic sound heard shortly after $S_2$, indicating a mobile, pliable stenosed mitral valve. A very short interval between the second heart sound and the opening snap ($A_2-OS$ interval) indicates severe Mitral Stenosis. [cite: 6]"
    },
    {
      id: "asdm-viva-39",
      question: "What is the primary investigation of choice for cardiac valve diseases, and what does it assess?",
      sampleAnswer: "Echocardiography. Two-dimensional ($2D$) Echo assesses anatomy, etiology, severity, complications, and ejection fraction ($EF$). Doppler Echo assesses blood flow direction, regurgitation, and pressure gradients. [cite: 6]"
    },
    {
      id: "asdm-viva-40",
      question: "What are the normal measurements of a healthy mitral valve area, and what defines tight Mitral Stenosis?",
      sampleAnswer: "The normal mitral valve orifice area is 4 to 6 $cm^2$. A valve area of less than 1 $cm^2$ defines tight/severe Mitral Stenosis. [cite: 6]"
    },
    {
      id: "asdm-viva-41",
      question: "Differentiate between Tissue and Metallic prosthetic heart valves based on heart sounds.",
      sampleAnswer: "Tissue (Bioprosthetic) valves yield normal, soft heart sounds. Metallic (Mechanical) valves yield very loud, distinct, metallic clicking sounds ($S_1$ or $S_2$ depending on the site). [cite: 6]"
    },
    {
      id: "asdm-viva-42",
      question: "What are the common medical complications associated with artificial prosthetic heart valves?",
      sampleAnswer: "Valve dysfunction/failure, systemic thromboembolism, hemolytic anemia, infective endocarditis, or bleeding risks secondary to mandatory anticoagulant therapy. [cite: 6]"
    },
    {
      id: "asdm-viva-43",
      question: "What are the common causes of generalized pulsating neck veins?",
      sampleAnswer: "Right Ventricular Failure ($RVF$), Tricuspid Regurgitation ($TR$), Tricuspid Stenosis ($TS$), and Constrictive Pericarditis. [cite: 6]"
    },
    {
      id: "asdm-viva-44",
      question: "What are the non-cardiac, non-vascular causes of jaundice in a cardiac patient?",
      sampleAnswer: "Cardiac cirrhosis (secondary to long-standing chronic right heart failure), pulmonary infarction producing a hemolytic load, or hepatotoxic side effects from certain cardiac medications. [cite: 6]"
    },
    {
      id: "asdm-viva-45",
      question: "What is Vasovagal Syncope, and how does its mechanism differ from neurocardiogenic syncope?",
      sampleAnswer: "Vasovagal syncope is a form of neurocardiogenic syncope triggered by emotional stress, prolonged standing, or pain. The mechanism involves sudden, severe reflex parasympathetic overactivity causing profound bradycardia (vasodepressor effect) and widespread venodilation, leading to acute cerebral hypoperfusion. [cite: 6]"
    },
    {
      id: "asdm-viva-46",
      question: "What is Carotid Sinus Syndrome, and what triggers an attack?",
      sampleAnswer: "It is an exaggerated, hypersensitive reflex response of the carotid sinus baroreceptors. Attacks of syncope are triggered by mechanical pressure or stimulation over the neck, such as turning the head sharply, shaving, or wearing a tight collar. [cite: 6]"
    },
    {
      id: "asdm-viva-47",
      question: "What is the precise anatomical boundaries of the Area of Absolute Cardiac Dullness (Cardiac Bare Area)?",
      sampleAnswer: "It is located behind the left 4th and 5th intercostal spaces, bounded medially by the left sternal border and laterally by the left pornastonal line. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-48",
      question: "What causes the physiological note of the Cardiac Bare Area to turn from dull to resonant?",
      sampleAnswer: "Lung hyperinflation conditions that physically interpose resonant lung tissue over the heart, most pathognomonically seen in Emphysema, COPD, and left-sided Pneumothorax. [cite: 5, 6]"
    },
    {
      id: "asdm-viva-49",
      question: "What clinical conditions cause an abnormal increase or widening of the Absolute Cardiac Dullness area?",
      sampleAnswer: "Left lung collapse, significant Right Ventricular Hypertrophy ($RVH$), or a large Pericardial Effusion. [cite: 6]"
    },
    {
      id: "asdm-viva-50",
      question: "What does a palpable pulsation felt specifically over the suprasternal notch indicate?",
      sampleAnswer: "It clinically indicates an Aneurysm of the Aortic Arch or a highly hyperdynamic circulation. [cite: 6]"
    },
    {
      id: "asdm-viva-51",
      question: "What does a palpable pulsation felt over the left parasternal border indicate?",
      sampleAnswer: "It indicates Right Ventricular Hypertrophy ($RVH$) or significant Left Atrial enlargement pushing the right ventricle forward. [cite: 6]"
    },
    {
      id: "asdm-viva-52",
      question: "How does a normal liver palpatory finding differ from a 'cardiac liver' on abdominal palpation?",
      sampleAnswer: "A normal liver is non-tender and non-pulsating. A 'cardiac liver' (secondary to right heart failure or tricuspid disease) is characteristically enlarged, smooth, tender due to rapid stretching of Glisson's capsule, and exhibits true expansile pulsations. [cite: 6]"
    },
    {
      id: "asdm-viva-53",
      question: "What are the causes of ascites occurring *before* lower limb edema in a cardiac patient?",
      sampleAnswer: "This unique clinical sequence occurs characteristically in Constrictive Pericarditis or severe Tricuspid Stenosis, where high systemic venous pressure selectively affects the hepatic and portal circulation early on. [cite: 6]"
    },
    {
      id: "asdm-viva-54",
      question: "Describe the typical auscultatory findings in Tricuspid Stenosis (TS).",
      sampleAnswer: "A mid-diastolic rumbling murmur heard best over the lower left sternal border (tricuspid area) that characteristically increases in intensity during full inspiration (Carvallo's sign). [cite: 6]"
    },
    {
      id: "asdm-viva-55",
      question: "What is a Graham Steell murmur, and what does it signify?",
      sampleAnswer: "It is a high-pitched, blowing early diastolic murmur heard best over the pulmonary area, caused by functional pulmonary regurgitation secondary to severe Pulmonary Hypertension ($PH++$). [cite: 6]"
    },
    {
      id: "asdm-viva-56",
      question: "What is the clinical value of checking for radiation of a systolic murmur to the neck/carotids?",
      sampleAnswer: "Radiation of a harsh systolic murmur from the base of the heart directly into the carotid arteries is highly specific and diagnostic for valvar Aortic Stenosis (AS). [cite: 6]"
    },
    {
      id: "asdm-viva-57",
      question: "How do you clinically differentiate a pulmonary ejection click from an aortic ejection click?",
      sampleAnswer: "A pulmonary ejection click is heard loudest over the pulmonary area and characteristically decreases or disappears during full inspiration. An aortic ejection click is heard well at both the apex and aortic area, and does not vary with respiration. [cite: 6]"
    },
    {
      id: "asdm-viva-58",
      question: "What is the Third Heart Sound ($S_3$), and what does it clinically signify?",
      sampleAnswer: "It is a low-pitched, early diastolic sound produced during the rapid filling phase of the ventricles. Physiologically normal in children and pregnant women, but pathologically it indicates severe ventricular volume overload or Left Ventricular Failure ($LVF$) (Ventricular Gallop). [cite: 6]"
    },
    {
      id: "asdm-viva-59",
      question: "What is the Fourth Heart Sound ($S_4$), and what does it clinically signify?",
      sampleAnswer: "It is a low-pitched, late diastolic (presystolic) sound produced during forced atrial contraction into a stiff, non-compliant ventricle. It signifies pressure overload states like systemic Hypertension, Aortic Stenosis, or Ischemic Heart Disease (Atrial Gallop). It is completely absent in Atrial Fibrillation ($AF$). [cite: 6]"
    },
    {
      id: "asdm-viva-60",
      question: "Define 'Ejection Fraction' ($EF$) and state its normal clinical values.",
      sampleAnswer: "It is the percentage of blood pumped out of the left ventricle with each contraction (Stroke Volume divided by End-Diastolic Volume). Normal values range between 55% and 70%. Values below 50% indicate systolic ventricular dysfunction. [cite: 6]"
    },
    {
      id: "asdm-viva-61",
      question: "What is the 'Tiffeneau index' equivalent value measured in cardiac echo for valvular gradient?",
      sampleAnswer: "It is the trans-valvular pressure gradient measured via Doppler echocardiography, using the Bernoulli equation ($\\Delta P = 4v^2$, where $v$ is velocity), to classify the severity of stenotic valves (AS or MS). [cite: 6]"
    },
    {
      id: "asdm-viva-62",
      question: "What is the choice management for a patient presenting with tight Mitral Stenosis and a non-pliable valve?",
      sampleAnswer: "Surgical Mitral Valve Replacement ($MVR$) with an artificial mechanical or bioprosthetic valve, as the valve is non-pliable/calcified and not suitable for balloon valvuloplasty. [cite: 6]"
    }
  ]
};
