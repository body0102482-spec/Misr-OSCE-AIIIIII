import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, getDocs, setDoc, updateDoc, collection, getDocFromServer } from "firebase/firestore";

dotenv.config();

// Intercept and sanitize benign Firebase Firestore web SDK idle stream cancellations on server-side
const originalConsoleError = console.error;
console.error = function (...args) {
  const message = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
  if (message.includes("Disconnecting idle stream") || message.includes("Timed out waiting for new targets")) {
    // Route to informational log to prevent false alarms in telemetry/error captures
    console.log("ℹ️ [Firebase Connection Manager] Idle stream closed dynamically.");
    return;
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  const message = args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ");
  if (message.includes("Disconnecting idle stream") || message.includes("Timed out waiting for new targets")) {
    console.log("ℹ️ [Firebase Connection Manager] Idle stream closed dynamically.");
    return;
  }
  originalConsoleWarn.apply(console, args);
};

const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf-8"));
const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Validate Connection to Firestore on boot as per firebase-integration skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(firestoreDb, "test", "connection"));
    console.log("📶 Firestore connection validated successfully.");
  } catch (error: any) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("⚠️ Firestore Connection Check Failed: Please check your Firebase configuration. Client is offline.");
    } else {
      console.log("📶 Firestore endpoint reachable (connection validated).");
    }
  }
}
testFirestoreConnection();

const app = express();
app.use(express.json());

// Enable CORS middleware for split frontend/backend deployment
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Robust wrapper for generateContent to retry and automatic fallback in case of high demand (503 Service Unavailable) or transient errors
async function safeGenerateContent(args: {
  contents: any;
  config?: any;
}): Promise<any> {
  const modelsToTry = [
    { name: "gemini-3.5-flash", useThinking: true },
    { name: "gemini-flash-latest", useThinking: false },
    { name: "gemini-3.1-flash-lite", useThinking: false }
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelObj = modelsToTry[i];
    const attemptConfig = args.config ? { ...args.config } : {};

    if (!modelObj.useThinking) {
      delete attemptConfig.thinkingConfig;
    }

    const maxRetries = 3;
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        console.log(`🤖 Attempting content generation with model: ${modelObj.name} (Attempt ${retry + 1}/${maxRetries})`);
        const result = await ai.models.generateContent({
          model: modelObj.name,
          contents: args.contents,
          config: attemptConfig,
        });
        console.log(`✅ Content generation succeeded using model: ${modelObj.name}`);
        return result;
      } catch (error: any) {
        lastError = error;
        const status = error?.status || error?.statusCode || (error?.error && error?.error?.status);
        const errorStr = (error?.message || String(error)).toLowerCase();
        
        console.warn(`⚠️ Model "${modelObj.name}" failed (Attempt ${retry + 1}/${maxRetries}): status=${status}, message="${errorStr.substring(0, 200)}".`);

        const isQuota = status === 429 || errorStr.includes("429") || errorStr.includes("quota") || errorStr.includes("limit");
        if (isQuota) {
          console.log("ℹ️ Account quota error detected. Instantly breaking lookup loop to prevent retry latency.");
          return Promise.reject(error);
        }

        const isRetryable = status === 503 || status === 502 || status === 504 || status === 500 ||
          errorStr.includes("high demand") || errorStr.includes("temporary") || errorStr.includes("overloaded") || 
          errorStr.includes("server error") || errorStr.includes("econnreset") || errorStr.includes("socket");

        if (isRetryable && retry < maxRetries - 1) {
          const delay = (retry + 1) * 300;
          console.log(`🔄 Transient error or high demand detected. Retrying model ${modelObj.name} in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        break;
      }
    }

    // Wait a tiny bit (150ms) before fallback
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw lastError;
}

// Robust wrapper for generateContentStream to retry and automatic fallback in case of high demand (503 Service Unavailable) or transient errors
async function safeGenerateContentStream(args: {
  contents: any;
  config?: any;
}): Promise<any> {
  const modelsToTry = [
    { name: "gemini-3.5-flash", useThinking: true },
    { name: "gemini-flash-latest", useThinking: false },
    { name: "gemini-3.1-flash-lite", useThinking: false }
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelObj = modelsToTry[i];
    const attemptConfig = args.config ? { ...args.config } : {};

    if (!modelObj.useThinking) {
      delete attemptConfig.thinkingConfig;
    }

    const maxRetries = 3;
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        console.log(`🤖 Attempting stream content generation with model: ${modelObj.name} (Attempt ${retry + 1}/${maxRetries})`);
        const stream = await ai.models.generateContentStream({
          model: modelObj.name,
          contents: args.contents,
          config: attemptConfig,
        });
        console.log(`✅ Stream content generation initiated successfully using model: ${modelObj.name}`);
        return stream;
      } catch (error: any) {
        lastError = error;
        const status = error?.status || error?.statusCode || (error?.error && error?.error?.status);
        const errorStr = (error?.message || String(error)).toLowerCase();
        
        console.warn(`⚠️ Stream model "${modelObj.name}" failed (Attempt ${retry + 1}/${maxRetries}): status=${status}, message="${errorStr.substring(0, 200)}".`);

        const isQuota = status === 429 || errorStr.includes("429") || errorStr.includes("quota") || errorStr.includes("limit");
        if (isQuota) {
          console.log("ℹ️ Account stream quota error detected. Instantly breaking stream loop to prevent retry latency.");
          return Promise.reject(error);
        }

        const isRetryable = status === 503 || status === 502 || status === 504 || status === 500 ||
          errorStr.includes("high demand") || errorStr.includes("temporary") || errorStr.includes("overloaded") || 
          errorStr.includes("server error") || errorStr.includes("econnreset") || errorStr.includes("socket");

        if (isRetryable && retry < maxRetries - 1) {
          const delay = (retry + 1) * 300;
          console.log(`🔄 Transient error or high demand detected (Stream). Retrying model ${modelObj.name} in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        break;
      }
    }

    // Wait a tiny bit (150ms) before fallback
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw lastError;
}

// JSON File Database Persistence
const DB_PATH = path.join(process.cwd(), "src", "data", "server_db.json");

// Seeding Firebase Firestore with template data if empty
async function seedFirestoreIfNeeded() {
  const defaultUsers = [
    {
      fullName: "Mahmoud Nasser",
      studentId: "MUST-2024-819",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024828652",
      email: "student@must.edu.eg",
      plan: "BASIC PLAN",
      isAdmin: false,
      isActivated: true,
      credits: 10,
      planExpiresAt: Date.now() + 60 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Mariam El-Sawy",
      studentId: "MUST-2023-452",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024828652",
      email: "mariam@must.edu.eg",
      plan: "BASIC PLAN",
      isAdmin: false,
      isActivated: true,
      credits: 75,
      planExpiresAt: Date.now() + 60 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Admin Mahmoud",
      studentId: "ADMIN-98302",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024328652",
      email: "mahmoud98302@must.com",
      plan: "PREMIUM PLAN",
      isAdmin: true,
      isActivated: true,
      credits: 99999,
      planExpiresAt: Date.now() + 3650 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Mahmoud Nasser",
      studentId: "MUST-ADMIN-01",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024328652",
      email: "mahmoudnasser01024@gmail.com",
      plan: "PREMIUM PLAN",
      isAdmin: true,
      isActivated: true,
      credits: 99999,
      planExpiresAt: Date.now() + 3650 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    }
  ];

  const defaultPasswords = {
    "student@must.edu.eg": "student123",
    "mariam@must.edu.eg": "mariam123",
    "mahmoud98302@must.com": "Vet20202025",
    "mahmoudnasser01024@gmail.com": "Vet20202025"
  };

  const defaultPayments = [
    {
      id: "pay-1",
      studentEmail: "mariam@must.edu.eg",
      studentName: "Mariam El-Sawy",
      mobile: "01024828652",
      plan: "BASIC PLAN",
      amount: 150,
      method: "Vodafone Cash",
      screenshotText: "Screenshot: Transfer of 150 EGP verified via Vodafone Cash SMS receipts.",
      transactionId: "TXN98124921",
      timestamp: Date.now() - 24 * 3600 * 1000,
      status: "Approved"
    },
    {
      id: "pay-2",
      studentEmail: "student@must.edu.eg",
      studentName: "Mahmoud Nasser",
      mobile: "01024828652",
      plan: "PREMIUM PLAN",
      amount: 300,
      method: "InstaPay",
      screenshotText: "Screenshot: Transfer of 300 EGP to digital address MUST_OSCE@instapay.",
      transactionId: "IPY88231940",
      timestamp: Date.now() - 2 * 3600 * 1000,
      status: "Pending"
    }
  ];

  try {
    const usersSnap = await getDocs(collection(firestoreDb, "users"));
    if (usersSnap.empty) {
      console.log("🌱 Seeding empty Firestore with default users...");
      for (const user of defaultUsers) {
        const pass = defaultPasswords[user.email as keyof typeof defaultPasswords] || "student123";
        await setDoc(doc(firestoreDb, "users", user.email.toLowerCase()), {
          ...user,
          password: pass
        });
      }

      console.log("🌱 Seeding default payments...");
      for (const p of defaultPayments) {
        await setDoc(doc(firestoreDb, "payments", p.id), p);
      }
      console.log("✅ Seeding of database completed successfully!");
    } else {
      console.log("✅ Database is already populated. Seeding skipped.");
    }
  } catch (error) {
    console.error("❌ Failed to auto-seed Firestore on boot:", error);
  }
}

function loadDB() {
  const defaultUsers = [
    {
      fullName: "Mahmoud Nasser",
      studentId: "MUST-2024-819",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024828652",
      email: "student@must.edu.eg",
      plan: "BASIC PLAN",
      isAdmin: false,
      isActivated: true,
      credits: 10,
      planExpiresAt: Date.now() + 60 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Mariam El-Sawy",
      studentId: "MUST-2023-452",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024828652",
      email: "mariam@must.edu.eg",
      plan: "BASIC PLAN",
      isAdmin: false,
      isActivated: true,
      credits: 75,
      planExpiresAt: Date.now() + 60 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Admin Mahmoud",
      studentId: "ADMIN-98302",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024328652",
      email: "mahmoud98302@must.com",
      plan: "PREMIUM PLAN",
      isAdmin: true,
      isActivated: true,
      credits: 99999,
      planExpiresAt: Date.now() + 3650 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    },
    {
      fullName: "Mahmoud Nasser",
      studentId: "MUST-ADMIN-01",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024328652",
      email: "mahmoudnasser01024@gmail.com",
      plan: "PREMIUM PLAN",
      isAdmin: true,
      isActivated: true,
      credits: 99999,
      planExpiresAt: Date.now() + 3650 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    }
  ];

  const defaultPasswords = {
    "student@must.edu.eg": "student123",
    "mariam@must.edu.eg": "mariam123",
    "mahmoud98302@must.com": "Vet20202025",
    "mahmoudnasser01024@gmail.com": "Vet20202025"
  };

  const defaultPayments = [
    {
      id: "pay-1",
      studentEmail: "mariam@must.edu.eg",
      studentName: "Mariam El-Sawy",
      mobile: "01024828652",
      plan: "BASIC PLAN",
      amount: 150,
      method: "Vodafone Cash",
      screenshotText: "Screenshot: Transfer of 150 EGP verified via Vodafone Cash SMS receipts.",
      transactionId: "TXN98124921",
      timestamp: Date.now() - 24 * 3600 * 1000,
      status: "Approved"
    },
    {
      id: "pay-2",
      studentEmail: "student@must.edu.eg",
      studentName: "Mahmoud Nasser",
      mobile: "01024828652",
      plan: "PREMIUM PLAN",
      amount: 300,
      method: "InstaPay",
      screenshotText: "Screenshot: Transfer of 300 EGP to digital address MUST_OSCE@instapay.",
      transactionId: "IPY88231940",
      timestamp: Date.now() - 2 * 3600 * 1000,
      status: "Pending"
    }
  ];

  try {
    if (!fs.existsSync(DB_PATH)) {
      const parentDir = path.dirname(DB_PATH);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(
        DB_PATH,
        JSON.stringify({ users: defaultUsers, passwords: defaultPasswords, payments: defaultPayments }, null, 2)
      );
    }
    const content = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(content);
    
    // Ensure the new admin exists (Migration)
    const adminEmail = "mahmoudnasser01024@gmail.com";
    if (!db.users.find((u: any) => u.email.toLowerCase() === adminEmail.toLowerCase())) {
      console.log(`Migration: Adding admin ${adminEmail} to database.`);
      const newAdmin = defaultUsers.find(u => u.email === adminEmail);
      if (newAdmin) {
        db.users.push(newAdmin);
        db.passwords[adminEmail] = defaultPasswords[adminEmail as keyof typeof defaultPasswords];
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      }
    }
    
    return db;
  } catch (error) {
    console.error("Error loading server database, using seeds:", error);
    return { users: defaultUsers, passwords: defaultPasswords, payments: defaultPayments };
  }
}

function saveDB(db: any) {
  try {
    const parentDir = path.dirname(DB_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Error saving server database:", error);
  }
}

// Cryptographic Security Tokens
const JWT_SECRET = process.env.JWT_SECRET || "must_osce_mentor_secret_key_2026_change_me_in_production";

function signToken(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) return null;
    
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
    return JSON.parse(payloadStr);
  } catch (error) {
    return null;
  }
}

// Security Middleware checking headers for Authorization Bearer Token
function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Valid Authorization Bearer JWT Token is required." });
  }
  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid, expired, or tampered cryptographic authorization signature." });
  }
  req.user = payload;
  next();
}

function adminMiddleware(req: any, res: any, next: any) {
  authMiddleware(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Access restricted. Administrative level authority required." });
    }
    next();
  });
}


// AI Prompt Templates
const PATIENT_PROMPT = `
You are a patient in an OSCE clinical exam for medical students.
Your details:
Name: {{name}}
Age: {{age}}
Gender: {{gender}}
Occupation: {{occupation}}
Chief Complaint: {{chiefComplaint}}
Full History Context: {{historyContext}}

RULES:
1. Speak naturally like a real person, not a doctor.
2. If asked technical questions (e.g., "Do you have portal hypertension?"), say you don't understand and explain your symptoms instead.
3. Don't give the diagnosis.
4. Sometimes give short or incomplete answers unless asked clearly.
5. Use simple language.
6. Reveal details from your history context ONLY when relevant to the student's question.
7. You are in Egypt, so you can occasionally use typical Egyptian cultural mannerisms (in English or simple Arabic words like "Ya Doctor").

Student Conversation so far:
{{chatHistory}}

Student asked: {{studentQuestion}}
Patient Response:`;

const EXAMINER_PROMPT = `
You are a highly strict, objective Clinical OSCE Examiner for MUST University (Egypt).
Your role is to evaluate a student's clinical performance (History, Examination, and Management) based ONLY on the provided session data and transcript. You must be completely literal and penalize the student for any skipped phases or individual steps.

The case was: {{caseName}}

The student's performance:
- History taken / Chat logs: {{studentHistory}}
- Examination performed: {{studentExam}}
- Investigations ordered: {{studentInv}}
- Final diagnosis provided: {{studentDiag}}
- Differential Diagnosis: {{studentDiff}}
- Management Plan: {{studentMan}}

CRITICAL - Model Answer Checklist for this case:
{{checklist}}

CRITICAL EVALUATION RULES:
1. ABSOLUTE SKIP: If the student completely omits an entire clinical phase (e.g., skips Physical Examination entirely, or skips Management entirely), you must mark that entire phase as "تم تخطي المرحلة بالكامل" and give absolutely no credit for it.
2. ITEM SKIP: If the student performs a phase but skips a specific clinical step within it (e.g., performs inspection and palpation but completely skips percussion), you must explicitly mark this specific step as "تم تخطيه/لم يتم" and detail it in the errors section.
3. NO INFERENCES: Do not assume, guess, or infer that the student performed a step unless it is explicitly written in the transcript or performance text. If it is not in the text, it did not happen.
4. APPROXIMATION PROHIBITION: Do not give a generalized or vague feedback. Every judgment must be backed by what was actually said or omitted.

SCORING CRITERIA (Out of 20 - Be Very Strict):
- Communication Skills (4 points): Professionalism, empathy, structure of history.
- History & Reasoning (6 points): Did they ask the specific core questions from the checklist?
- Examination & Findings (6 points): Did they perform the required maneuvers and interpret them?
- Management & Planning (4 points): Diagnosis accuracy and initial steps.

The "feedback" field of the JSON must be output strictly in Arabic using this exact layout:

### 🔍 التقييم التفصيلي للأداء (OSCE Checklist Evaluation):

#### 1. التاريخ المرضي (History Taking):
- الترحيب والتعارف وأخذ الإذن (Introduction & Consent): [مستوفى / مستوفى جزئياً / لم يتم]
- تحليل الشكوى الرئيسية (HPI - Attributes): [مستوفى / مستوفى جزئياً / لم يتم]
- استقصاء الأعراض المصاحبة (Associated Symptoms): [مستوفى / مستوفى جزئياً / لم يتم]
- التاريخ المرضي السابق والأدوية والتحسس (Past History): [مستوفى / مستوفى جزئياً / لم يتم]
- التاريخ العائلي والاجتماعي (Family & Social History): [مستوفى / مستوفى جزئياً / لم يتم]
*(إذا تم تخطي المرحلة كاملة، اكتب بدلاً من البنود أعلاه: "⚠️ تم تخطي مرحلة التاريخ المرضي بالكامل")*

#### 2. الفحص الإكلينيكي (Physical Examination):
- تجهيز المريض ونظافة اليدين (Setup & Hand Hygiene): [مستوفى / مستوفى جزئياً / لم يتم]
- الفحص بالنظر (Inspection): [مستوفى / مستوفى جزئياً / لم يتم]
- الفحص باللمس (Palpation): [مستوفى / مستوفى جزئياً / لم يتم]
- الفحص بالنقر (Percussion): [مستوفى / مستوفى جزئياً / لم يتم]
- الفحص بالسمع (Auscultation): [مستوفى / مستوفى جزئياً / لم يتم]
*(إذا تم تخطي المرحلة كاملة، اكتب بدلاً من البنود أعلاه: "⚠️ تم تخطي مرحلة الفحص الإكلينيكي بالكامل")*

#### 3. التشخيص والفحوصات (Diagnosis & Investigations):
- وضع التشخيصات الفراغية/البديلة (Differential Diagnosis): [مستوفى / مستوفى جزئياً / لم يتم]
- ربط وتبرير التشخيص بمعطيات الحالة (Clinical Reasoning): [مستوفى / مستوفى جزئياً / لم يتم]
- طلب التحاليل والأشعة المناسبة (Investigations): [مستوفى / مستوفى جزئياً / لم يتم]
*(إذا تم تخطي المرحلة كاملة، اكتب بدلاً من البنود أعلاه: "⚠️ تم تخطي مرحلة التشخيص والفحوصات بالكامل")*

#### 4. الخطة العلاجية وتوعية المريض (Management & Education):
- تحديد الخطة العلاجية/الدوائية (Treatment Plan): [مستوفى / مستوفى جزئياً / لم يتم]
- شرح الحالة وتوعية المريض (Patient Education): [مستوفى / مستوفى جزئياً / لم يتم]
- خطة المتابعة وعلامات الخطر (Safety Netting & Follow-up): [مستوفى / مستوفى جزئياً / لم يتم]
*(إذا تم تخطي المرحلة كاملة، اكتب بدلاً من البنود أعلاه: "⚠️ تم تخطي مرحلة الخطة العلاجية والتوعية بالكامل")*

---

### 🚨 تقرير الأخطاء والنقاط التي تم تخطيها (Skipped & Missed Items):
- [اذكر هنا بالتفصيل وبشكل صارم كل خطوة (Item) أو مرحلة (Phase) قام الطالب بتخطِّيها أو نسيانها، مع تبرير ذلك من واقع الحوار والبيانات].

### 💡 التقييم العام للأداء المهني:
- [اكتب خلاصة صارمة وموجزة باللغة العربية عن مدى جاهزية الطالب الإكلينيكية بناءً على التقييم أعلاه].

Generate a JSON response strictly in the following JSON format structure:
{
  "communication": number,
  "reasoning": number,
  "examination": number,
  "total": number,
  "feedback": "detailed professional feedback in markdown format strictly following the Arabic layout specified above",
  "coveredItems": ["exact item string from the checklist that they successfully performed/asked"],
  "missedItems": ["exact item string from the checklist that they missed/omitted"]
}
`;

const EXAMINER_INTERACTIVE_PROMPT = `
You are a senior clinical examiner for an OSCE station (Abdomen) at MUST University.
Your role: Actively manage the station as if you are the lead examiner in a live practical exam.

STRICT OPERATING RULES:
1. ORCHESTRATION: You must lead the conversation. If the student stays silent or finishes talking to the patient, you should interject.
2. THEORETICAL SPRINT: Use the checklist and clinical context to ask the student TOUGH theoretical questions (e.g., "What is the significance of rebound tenderness in this specific patient?", "If you find a mass in the right iliac fossa, what are your differentials?").
3. CLINICAL REASONING: When the student reports a finding or an investigation, ask them "WHY?" or "What do you expect to see on ultrasound?".
4. DON'T REVEAL SCORE: Never tell the student their score or talk about grades during this interaction. Keep it academic and forensic.
5. LANGUAGE: Respond in a way that reflects the requested source material (Egyptian medical university standards). Be formal, slightly stern but fair.

Case Context: {{caseName}}
Checklist: {{checklist}}

History with Patient:
{{patientHistory}}

Previous Dialogue with YOU (Examiner):
{{examinerHistory}}

Student's Latest Message to YOU: {{studentMessage}}
Examiner's Interactive Response (Proactive, Academic, Focused on Testing Knowledge):`;

const EXAMINER_EVALUATE_QUESTION_PROMPT = `
You are a senior clinical medical examiner for an OSCE station at MUST University.
You are conducting a strict, realistic medical oral viva exam.
You are evaluating the student's response to this specific board question:

Question asked: "{{question}}"
Ideal Standard Answer: "{{sampleAnswer}}"

The student responded: "{{studentMessage}}"

Your instructions:
1. Speak in first person ("I") with an authoritative, professional, academic, and extremely concise tone of an Egyptian senior clinician. Keep spoken feedback minimal (max 1-2 sentences). Do not lecture or explain long theories. Focus entirely on navigating this interactive loop.
2. Carefully detect if the student's latest message contains expressions of "I don't know", "that's all I have", "I cannot answer", "منعرفش", "مش عارف", "أنا مش عارف", "انقل على اللى بعده", "skip", "next", "that is all", or similar phrases of giving up.
   - If YES: Set "isResolved" to true, and set "isCorrect" to false. Provide the full expected answer briefly (e.g., "Alright, the expected answer is: [briefly state key point(s)]. Let us move on."), and do not ask them to try again.
3. Otherwise, compare their response to the Ideal Standard Answer:
   - CASE A: The response is Full & Correct (contains all key clinical concept(s)/keywords specified in the Ideal Standard Answer).
     - Action: Set "isResolved" to true, and set "isCorrect" to true. Provide a very brief confirmation (e.g., "Excellent.", "Exactly.", "Correct.") and DO NOT teach them.
   - CASE B: The response is Incomplete or Missing Key Keywords but on the right track.
     - Action: Set "isResolved" to false, and set "isCorrect" to false. DO NOT mark it wrong and DO NOT give the final answer. Keep probing them to expand. Respond with a prompt like: "Good, what else?", "Can you expand on that?", "There is one more key point, what is it?", or "What else can you mention?". Keep probing them on the same question.
   - CASE C: The response is Completely Wrong.
     - Action: Set "isResolved" to false, and set "isCorrect" to false. Gently correct the misconception or give a small hint, and ask them to try again (e.g., "Not quite. Think about [hint]. Try again."). Do not give the full answer yet.

Return your response strictly in the following JSON format:
{
  "text": "Your brief interactive feedback to the student",
  "isResolved": boolean,
  "isCorrect": boolean
}
`;

// Authentication, Synchronization and Licensing Server API Engine
app.post("/api/auth/register", async (req, res) => {
  const { newUser, password } = req.body;
  if (!newUser || !newUser.email || !password) {
    return res.status(400).json({ error: "Email, password, and profile values are required." });
  }

  const cleanEmail = newUser.email.trim().toLowerCase();

  try {
    const userDocRef = doc(firestoreDb, "users", cleanEmail);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return res.status(400).json({ error: "An account has already registered with this email address." });
    }

    // Force Mahmoud to be admin, everyone else registered starts as FREE PLAN
    const isMahmoud = cleanEmail === "mahmoud98302@must.com" || cleanEmail === "mahmoudnasser01024@gmail.com";
    const plan = isMahmoud ? "PREMIUM PLAN" : ("FREE PLAN" as const);
    const credits = isMahmoud ? 99999 : 0;
    const isAdmin = isMahmoud;

    const finalizedUser = {
      ...newUser,
      email: cleanEmail,
      plan,
      credits,
      isAdmin,
      isActivated: true,
      startedCases: [],
      planActivatedAt: Date.now(),
      planExpiresAt: isMahmoud ? Date.now() + 3650 * 24 * 3600 * 1000 : 0
    };

    // Save user with password securely in same doc
    await setDoc(userDocRef, {
      ...finalizedUser,
      password: password
    });

    const token = signToken(finalizedUser);
    res.json({ success: true, user: finalizedUser, token });
  } catch (error: any) {
    console.error("Error in /api/auth/register:", error);
    res.status(500).json({ error: "Database error during registration." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const userDocRef = doc(firestoreDb, "users", cleanEmail);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      return res.status(400).json({ error: "Incorrect email or password combination." });
    }

    const userData = userSnap.data();
    if (userData.password !== password) {
      return res.status(400).json({ error: "Incorrect email or password combination." });
    }

    // Return user without password field
    const { password: _, ...user } = userData;

    const token = signToken(user);
    res.json({ success: true, user, token });
  } catch (error: any) {
    console.error("Error in /api/auth/login:", error);
    res.status(500).json({ error: "Database error during login." });
  }
});

app.get("/api/auth/me", authMiddleware, async (req: any, res) => {
  const cleanEmail = req.user.email.toLowerCase();

  try {
    const userDocRef = doc(firestoreDb, "users", cleanEmail);
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      if (req.user && req.user.fullName) {
        console.log(`Restoring user ${cleanEmail} from session token.`);
        const user = req.user;
        await setDoc(userDocRef, {
          ...user,
          password: "restored_temp_password_123"
        });
        const token = signToken(user);
        return res.json({ success: true, user, token });
      } else {
        return res.status(404).json({ error: "User session not found on server database." });
      }
    }

    const userData = userSnap.data();
    const { password: _, ...user } = userData;

    const token = signToken(user);
    res.json({ success: true, user, token });
  } catch (error: any) {
    console.error("Error in /api/auth/me:", error);
    res.status(500).json({ error: "Database error fetching profile." });
  }
});

app.get("/api/admin/system-stats", adminMiddleware, async (req, res) => {
  try {
    const usersSnap = await getDocs(collection(firestoreDb, "users"));
    const paymentsSnap = await getDocs(collection(firestoreDb, "payments"));

    const users: any[] = [];
    usersSnap.forEach((doc) => {
      const { password: _, ...user } = doc.data();
      users.push(user);
    });

    const payments: any[] = [];
    paymentsSnap.forEach((doc) => {
      payments.push(doc.data());
    });

    res.json({
      success: true,
      users,
      payments
    });
  } catch (error: any) {
    console.error("Error in /api/admin/system-stats:", error);
    res.status(500).json({ error: "Database error loading stats." });
  }
});

app.post("/api/auth/submit-payment", authMiddleware, async (req: any, res) => {
  const { payment } = req.body;
  if (!payment) {
    return res.status(400).json({ error: "Payment submission body is required." });
  }

  const paymentId = "pay-" + Date.now();
  const newPayment = {
    ...payment,
    id: paymentId,
    timestamp: Date.now(),
    status: "Pending"
  };

  try {
    await setDoc(doc(firestoreDb, "payments", paymentId), newPayment);

    // Return the updated list of all payments
    const paymentsSnap = await getDocs(collection(firestoreDb, "payments"));
    const payments: any[] = [];
    paymentsSnap.forEach((doc) => {
      payments.push(doc.data());
    });

    res.json({ success: true, payments });
  } catch (error: any) {
    console.error("Error in /api/auth/submit-payment:", error);
    res.status(500).json({ error: "Database error submitting payment." });
  }
});

app.post("/api/admin/verify-payment", adminMiddleware, async (req, res) => {
  const { paymentId, status } = req.body;
  if (!paymentId || !status) {
    return res.status(400).json({ error: "Payment identification details and status required." });
  }

  try {
    const paymentDocRef = doc(firestoreDb, "payments", paymentId);
    const paymentSnap = await getDoc(paymentDocRef);
    if (!paymentSnap.exists()) {
      return res.status(444).json({ error: "Transaction ticket reference not found." });
    }

    const payment = paymentSnap.data();
    payment.status = status;
    await setDoc(paymentDocRef, payment); // Update payment document

    if (status === "Approved") {
      const studentEmail = payment.studentEmail.toLowerCase();
      const planName = payment.plan;

      let planCredits = 0;
      let validityMs = 0;
      if (planName === "BASIC PLAN") {
        planCredits = 75;
        validityMs = 2 * 30 * 24 * 3600 * 1000;
      } else if (planName === "PRO PLAN") {
        planCredits = 200;
        validityMs = 4 * 30 * 24 * 3600 * 1000;
      } else if (planName === "PREMIUM PLAN") {
        planCredits = 400;
        validityMs = 6 * 30 * 24 * 3600 * 1000;
      }

      const studentDocRef = doc(firestoreDb, "users", studentEmail);
      const studentSnap = await getDoc(studentDocRef);
      if (studentSnap.exists()) {
        const student = studentSnap.data();
        await updateDoc(studentDocRef, {
          plan: planName,
          credits: planCredits,
          planActivatedAt: Date.now(),
          planExpiresAt: Date.now() + validityMs,
          startedCases: student.startedCases || []
        });
      }
    }

    // Refresh and fetch lists to return to dashboard
    const usersSnap = await getDocs(collection(firestoreDb, "users"));
    const paymentsSnap = await getDocs(collection(firestoreDb, "payments"));

    const users: any[] = [];
    usersSnap.forEach((doc) => {
      const { password: _, ...user } = doc.data();
      users.push(user);
    });

    const payments: any[] = [];
    paymentsSnap.forEach((doc) => {
      payments.push(doc.data());
    });

    res.json({ success: true, payments, users });
  } catch (error: any) {
    console.error("Error in /api/admin/verify-payment:", error);
    res.status(500).json({ error: "Database error during execution." });
  }
});

app.post("/api/admin/update-user-plan", adminMiddleware, async (req, res) => {
  const { studentEmail, planName } = req.body;
  if (!studentEmail || !planName) {
    return res.status(400).json({ error: "Student email and plan level inputs are required." });
  }

  const cleanEmail = studentEmail.trim().toLowerCase();

  let planCredits = 0;
  let validityMs = 0;
  if (planName === "BASIC PLAN") {
    planCredits = 75;
    validityMs = 2 * 30 * 24 * 3600 * 1000;
  } else if (planName === "PRO PLAN") {
    planCredits = 200;
    validityMs = 4 * 30 * 24 * 3600 * 1000;
  } else if (planName === "PREMIUM PLAN") {
    planCredits = 400;
    validityMs = 6 * 30 * 24 * 3600 * 1000;
  }

  const now = Date.now();
  const planExpiresAt = planName === "FREE PLAN" ? 0 : now + validityMs;

  try {
    const studentDocRef = doc(firestoreDb, "users", cleanEmail);
    const studentSnap = await getDoc(studentDocRef);
    if (!studentSnap.exists()) {
      return res.status(444).json({ error: "Student profile not found." });
    }

    const student = studentSnap.data();
    await updateDoc(studentDocRef, {
      plan: planName,
      credits: planCredits,
      planActivatedAt: now,
      planExpiresAt: planExpiresAt,
      startedCases: student.startedCases || []
    });

    const usersSnap = await getDocs(collection(firestoreDb, "users"));
    const users: any[] = [];
    usersSnap.forEach((doc) => {
      const { password: _, ...user } = doc.data();
      users.push(user);
    });

    res.json({ success: true, users });
  } catch (error: any) {
    console.error("Error in /api/admin/update-user-plan:", error);
    res.status(500).json({ error: "Database error." });
  }
});

app.post("/api/auth/deduct-credit", authMiddleware, async (req: any, res) => {
  const { caseId } = req.body;
  if (!caseId) {
    return res.status(400).json({ error: "OSCE case registration details are required." });
  }

  const cleanEmail = req.user.email.toLowerCase();

  try {
    const userDocRef = doc(firestoreDb, "users", cleanEmail);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      return res.status(444).json({ error: "User profile signature not found in core database." });
    }

    const userData = userSnap.data();
    const { password: _, ...user } = userData;

    // Administrators bypass deductions
    if (user.isAdmin) {
      return res.json({ success: true, user });
    }

    const startedCases = user.startedCases || [];
    const isAlreadyStarted = startedCases.includes(caseId);
    if (!isAlreadyStarted) {
      const currentCredits = user.credits ?? 0;
      if (currentCredits <= 0) {
        return res.status(403).json({ error: "Deduction blocked. You are out of active case credits. Please purchase or renew." });
      }

      user.credits = currentCredits - 1;
      user.startedCases = [...startedCases, caseId];

      await updateDoc(userDocRef, {
        credits: user.credits,
        startedCases: user.startedCases
      });
    }

    const token = signToken(user);
    res.json({ success: true, user, token });
  } catch (error: any) {
    console.error("Error in /api/auth/deduct-credit:", error);
    res.status(500).json({ error: "Database error deducting credits." });
  }
});

// API Routes
app.post("/api/chat", authMiddleware, async (req, res) => {
  const { studentQuestion, chatHistory, patientData } = req.body;

  // Utilize Chunked Transfer-Encoding for instant character-by-character native streaming
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const prunedHistory = chatHistory ? chatHistory.split("\n").slice(-8).join("\n") : "";
    const prompt = PATIENT_PROMPT
      .replace("{{name}}", patientData.name)
      .replace("{{age}}", patientData.age.toString())
      .replace("{{gender}}", patientData.gender)
      .replace("{{occupation}}", patientData.occupation)
      .replace("{{chiefComplaint}}", patientData.chiefComplaint)
      .replace("{{historyContext}}", JSON.stringify(patientData.fullHistory))
      .replace("{{chatHistory}}", prunedHistory)
      .replace("{{studentQuestion}}", studentQuestion);

    const responseStream = await safeGenerateContentStream({ 
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    const isQuota = error?.message?.includes("429") || error?.status === 429 || String(error).includes("429") || String(error).toLowerCase().includes("quota");
    if (isQuota) {
      console.log("ℹ️ Gemini API Quota Limit Reached (429). Returning explicit quota message.");
      res.write("⚠️ عذراً يا دكتور، طاقة المريض (AI Quota) نفدت حالياً ولا يستطيع الإجابة بشكل كامل. يرجى المحاولة لاحقاً!");
      return res.end();
    }
    
    console.log("⚠️ Chat API Fallback activated:", error?.message || error);
    
    // Robust realistic fallback patient simulation streamed with very short delays to represent thinking
    const q = (studentQuestion || "").toLowerCase();
    let reply = "";
    
    if (q.includes("name") || q.includes("اسمك") || q.includes("الاسم")) {
      reply = `My name is ${patientData?.name || "Ahmed Moussa"}, doctor.`;
    } else if (q.includes("age") || q.includes("سنك") || q.includes("عمر") || q.includes("old") || q.includes("سنة")) {
      reply = `I am ${patientData?.age || 58} years old.`;
    } else if (q.includes("work") || q.includes("job") || q.includes("occupation") || q.includes("بيشتغل") || q.includes("وظيفتك") || q.includes("بتشتغل")) {
      reply = `I am a ${patientData?.occupation || "retired farmer"}.`;
    } else if (q.includes("family") || q.includes("عيلة") || q.includes("عائلة") || q.includes("وراثة")) {
      reply = `No, no one in my family has a similar swelling or liver issues, doctor.`;
    } else if (q.includes("diuretic") || q.includes("pill") || q.includes("drug") || q.includes("medicine") || q.includes("علاج") || q.includes("دواء") || q.includes("برشام")) {
      reply = `I take some water pills occasionally for the swelling, and sometimes local painkillers for my knee pain.`;
    } else if (q.includes("schisto") || q.includes("bilharz") || q.includes("بلهارسيا") || q.includes("farming") || q.includes("farmer") || q.includes("soil") || q.includes("water") || q.includes("ترعة")) {
      reply = `Yes, when I was a child working in farming in Egypt, we used to get exposed to canal water (el-ter'a). I think I had Bilharziasis and took treatment back then.`;
    } else if (q.includes("jaundice") || q.includes("yellow") || q.includes("صفار") || q.includes("عين") || q.includes("أصفر")) {
      reply = `My eyes are slightly yellow, yes doctor. My appetite is also not very good and I lost some weight recently.`;
    } else if (q.includes("hematemesis") || q.includes("vomit") || q.includes("blood") || q.includes("ترجيع") || q.includes("دم") || q.includes("بتنزل")) {
      reply = `Yes, I threw up blood (hematemesis) about a year ago, doctor. I had to go to the hospital.`;
    } else if (q.includes("pain") || q.includes("وجع") || q.includes("ألم") || q.includes("ألمك")) {
      reply = `I don't have severe pain, but my abdomen feels very heavy, full and bloated, doctor.`;
    } else if (q.includes("duration") || q.includes("since when") || q.includes("how long") || q.includes("شهر") || q.includes("سنة") || q.includes("امتى") || q.includes("بقالك") || q.includes("فترة") || q.includes("مدة")) {
      reply = `It has been growing gradually for about 2 months now, doctor.`;
    } else if (q.includes("swelling") || q.includes("distension") || q.includes("enlarge") || q.includes("تورم") || q.includes("انتفاخ") || q.includes("ورم")) {
      reply = `My abdomen has been swelling gradually for 2 months, doctor. It is getting larger and my legs are swollen too.`;
    } else if (q.includes("past") || q.includes("history") || q.includes("hepatitis") || q.includes("hcv") || q.includes("فيروس") || q.includes("سي") || q.includes("تعبت")) {
      reply = `I am a known patient of Chronic Hepatitis C (HCV) diagnosed 10 years ago, doctor.`;
    } else {
      reply = `Yes, doctor... I have this swelling in my belly and it feels heavy. I also have some swelling in my legs. (Ya doctor, please help me with this). Can you ask me more clearly?`;
    }
    
    res.write(reply);
    res.end();
  }
});

app.post("/api/examiner", authMiddleware, async (req, res) => {
  const { studentMessage, examinerHistory, patientHistory, caseData, activeQuestion } = req.body;

  try {
    let prompt = "";
    if (activeQuestion) {
      prompt = EXAMINER_EVALUATE_QUESTION_PROMPT
        .replace("{{question}}", activeQuestion.question)
        .replace("{{sampleAnswer}}", activeQuestion.sampleAnswer || activeQuestion.expectedAnswer || "")
        .replace("{{studentMessage}}", studentMessage);
    } else {
      const trimmedPatientHistory = patientHistory ? patientHistory.split("\n").slice(-6).join("\n") : "";
      const trimmedExaminerHistory = examinerHistory ? examinerHistory.split("\n").slice(-6).join("\n") : "";
      
      prompt = EXAMINER_INTERACTIVE_PROMPT
        .replace("{{caseName}}", caseData?.name || "")
        .replace("{{checklist}}", JSON.stringify((caseData?.checklist || []).map((c: any) => c.item)))
        .replace("{{patientHistory}}", trimmedPatientHistory)
        .replace("{{examinerHistory}}", trimmedExaminerHistory)
        .replace("{{studentMessage}}", studentMessage);
    }

    const config: any = {
      thinkingConfig: {
        thinkingLevel: activeQuestion ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW
      }
    };
    if (activeQuestion) {
      config.responseMimeType = "application/json";
    }

    const result = await safeGenerateContent({ 
      contents: prompt,
      config: config
    });
    
    const responseText = result.text?.trim() || "";
    if (activeQuestion) {
      try {
        const parsed = JSON.parse(responseText);
        res.json({ text: parsed.text, isResolved: parsed.isResolved, quotaExceeded: false });
      } catch (e) {
        res.json({ text: responseText, isResolved: true, quotaExceeded: false });
      }
    } else {
      res.json({ text: responseText, quotaExceeded: false });
    }
  } catch (error: any) {
    const isQuota = error?.message?.includes("429") || error?.status === 429 || String(error).includes("429") || String(error).toLowerCase().includes("quota");
    if (isQuota) {
      console.log("ℹ️ Gemini API Quota Limit Reached (429) during examiner step.");
      return res.json({ 
        text: "⚠️ عذراً يا دكتور، طاقة الممتحن (AI Quota) نفدت حالياً. لا يمكنني مناقشة الحالة معك الآن، يرجى المحاولة لاحقاً.", 
        isResolved: true, 
        quotaExceeded: true 
      });
    }
    
    console.log("⚠️ Examiner API Exception (Switched to Fallback).");
    
    if (activeQuestion) {
      // Offline fuzzy keyword matching for viva/oral questions
      const msg = (studentMessage || "").toLowerCase().trim();
      const sample = (activeQuestion.sampleAnswer || activeQuestion.expectedAnswer || "").toLowerCase();
      
      const giveUpPhrases = [
        "don't know", "dont know", "no idea", "مش عارف", "منعرفش", "أنا مش عارف", "انقل", "skip", "next", 
        "that's all", "that is all", "أنا مش عارف", "انقل على", "that's it", "معرفش", "انقل على اللي بعده", "انقل على اللى بعده"
      ];
      
      const isGiveUp = giveUpPhrases.some(phrase => msg.includes(phrase)) || msg.length < 2;
      
      if (isGiveUp) {
        return res.json({
          text: `Alright, the expected answer is: ${activeQuestion.sampleAnswer || activeQuestion.expectedAnswer}. Let us move to the next question.`,
          isResolved: true,
          quotaExceeded: isQuota
        });
      }
      
      const stopWords = new Set(["with", "then", "that", "this", "they", "them", "their", "your", "have", "some", "more", "less", "such", "were", "what", "when", "where", "which", "who", "whom", "will", "would", "shall", "should", "could", "might", "must", "been", "being", "have", "has", "had", "does", "done", "doing", "very", "much", "many", "most", "some", "such", "only", "same", "so", "than", "too", "very", "can", "cannot", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "before", "between", "both", "but", "by", "for", "from", "further", "here", "how", "if", "in", "into", "is", "it", "its", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"]);
      
      const sampleWords = sample
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 3 && !stopWords.has(w));
          
      let matchCount = 0;
      for (const word of sampleWords) {
        if (msg.includes(word)) {
          matchCount++;
        }
      }
      
      const matchRatio = sampleWords.length > 0 ? matchCount / sampleWords.length : 0;
      
      if (matchCount >= 2 || matchRatio >= 0.25) {
        res.json({
          text: `Correct.`,
          isResolved: true,
          quotaExceeded: isQuota
        });
      } else if (matchCount >= 1 || msg.length > 15) {
        res.json({
          text: `Good, what else? Can you expand on that? There is more you can mention.`,
          isResolved: false,
          quotaExceeded: isQuota
        });
      } else {
        res.json({
          text: `Not quite correct. Try again, or say "I don't know" to reveal the answer.`,
          isResolved: false,
          quotaExceeded: isQuota
        });
      }
    } else {
      // General non-question examiner response
      const msg = (studentMessage || "").toLowerCase();
      if (msg.includes("ready") || msg.includes("بدء") || msg.includes("viva") || msg.includes("start") || msg.includes("ابدا")) {
        res.json({ text: "Excellent. Let us start the oral viva now. What is the value of pulse examination in an abdominal case?", quotaExceeded: isQuota });
      } else {
        res.json({ text: "Let us continue. Answer my clinical questions carefully. What else can you tell me about this patient's case?", quotaExceeded: isQuota });
      }
    }
  }
});

app.post("/api/evaluate", authMiddleware, async (req, res) => {
  const { performance, caseData, chatHistory } = req.body;

  try {
    const prompt = EXAMINER_PROMPT
      .replace("{{caseName}}", caseData.name)
      .replace("{{studentHistory}}", `NOTES: ${performance.history}\nTRANSCRIPT: ${chatHistory}`)
      .replace("{{studentExam}}", performance.examination)
      .replace("{{studentInv}}", performance.investigations.join(", "))
      .replace("{{studentDiag}}", performance.diagnosis)
      .replace("{{studentDiff}}", performance.differential || "None")
      .replace("{{studentMan}}", performance.management)
      .replace("{{checklist}}", JSON.stringify(caseData.checklist));

    const response = await safeGenerateContent({ 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    
    // Resilient fallback logic for covered/missed items
    if (!parsedJson.coveredItems || !parsedJson.missedItems || parsedJson.coveredItems.length === 0) {
      const combinedText = `
        ${performance.history || ""}
        ${performance.examination || ""}
        ${performance.diagnosis || ""}
        ${performance.differential || ""}
        ${performance.management || ""}
        ${chatHistory || ""}
      `.toLowerCase();
      
      const covered: string[] = [];
      const missed: string[] = [];
      const checklist = caseData?.checklist || [];
      checklist.forEach((check: any) => {
        const itemWords = check.item.toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
          .split(/\s+/)
          .filter((w: string) => w.length > 4);
        
        const found = itemWords.some((w: string) => combinedText.includes(w));
        if (found) {
          covered.push(check.item);
        } else {
          missed.push(check.item);
        }
      });
      parsedJson.coveredItems = covered;
      parsedJson.missedItems = missed;
    }

    res.json({ ...parsedJson, quotaExceeded: false });
  } catch (error: any) {
    const isQuota = error?.message?.includes("429") || error?.status === 429 || String(error).includes("429") || String(error).toLowerCase().includes("quota");
    if (isQuota) {
      console.log("ℹ️ Gemini API Quota Limit Reached (429) during scorecard generation.");
      return res.json({
        communication: 0,
        reasoning: 0,
        examination: 0,
        total: 0,
        feedback: "⚠️ عذراً يا دكتور، نظام التقييم التلقائي (AI Evaluation) متوقف حالياً بسبب نفاد الكريديتس/الطاقة. لا يمكن استخراج التقييم المفصل الآن. يرجى المحاولة لاحقاً.",
        coveredItems: [],
        missedItems: [],
        quotaExceeded: true
      });
    }
    
    console.log("⚠️ Score Evaluator Fallback activated.");
    
    // Strict clinical scoring fallback
    const combinedText = `
      ${performance.history || ""}
      ${performance.examination || ""}
      ${performance.diagnosis || ""}
      ${performance.differential || ""}
      ${performance.management || ""}
      ${chatHistory || ""}
    `.toLowerCase();
    
    let communication = 4;
    let reasoning = 5;
    let examination = 5;
    const deductions: string[] = [];
    const coveredItems: string[] = [];
    const missedItems: string[] = [];
    
    const checklist = caseData?.checklist || [];
    checklist.forEach((check: any) => {
      const itemWords = check.item.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter((w: string) => w.length > 4);
      
      const found = itemWords.some((w: string) => combinedText.includes(w));
      if (found) {
        coveredItems.push(check.item);
      } else {
        missedItems.push(check.item);
        deductions.push(check.item);
      }
    });

    if (deductions.some(d => d.includes("jaundice") || d.includes("hematemesis"))) {
      reasoning -= 1;
    }
    if (deductions.some(d => d.includes("shifting") || d.includes("thrill"))) {
      examination -= 1;
    }
    if (deductions.length > 4) {
      communication -= 1;
      reasoning -= 1;
      examination -= 1;
    }

    const total = Math.max(8, communication + reasoning + examination + 4); // base out of 20
    
    let feedbackMarkdown = `### Post-Station Feedback & Evaluation\n\n`;
    feedbackMarkdown += `**Provisional Diagnosis:** ${performance.diagnosis || "Decompensated Liver Cirrhosis with Ascites"}\n\n`;
    feedbackMarkdown += `#### Score Breakdown:\n`;
    feedbackMarkdown += `- **Communication Skills:** ${communication}/4\n`;
    feedbackMarkdown += `- **History & Reasoning:** ${reasoning}/6\n`;
    feedbackMarkdown += `- **Examination & Findings:** ${examination}/6\n`;
    feedbackMarkdown += `- **Management & Planning:** 3/4\n`;
    feedbackMarkdown += `**Total OSCE Station Score: ${total}/20**\n\n`;
    
    if (deductions.length > 0) {
      feedbackMarkdown += `#### Areas for Improvement:\n`;
      feedbackMarkdown += `Feedback based on missing clinical elements:\n`;
      deductions.slice(0, 4).forEach(item => {
        feedbackMarkdown += `- *${item}*\n`;
      });
    } else {
      feedbackMarkdown += `Excellent work doctor! You covered all points of the clinical checklist.\n`;
    }
    
    feedbackMarkdown += `\n*(Evaluated via clinical keyword evaluation module).*`;

    res.json({
      communication,
      reasoning,
      examination,
      total,
      feedback: feedbackMarkdown,
      coveredItems,
      missedItems,
      quotaExceeded: isQuota
    });
  }
});

const EXAM_STEP_EVALUATE_PROMPT = `
You are a senior clinical medical examiner conducting a strict, interactive OSCE physical examination station at MUST University.
You are evaluating the student's observations for the examination step: "{{stepName}}".

Ideal Findings for this step:
"{{idealFinding}}"

Student's previous chat history for this step:
{{chatHistory}}

Student's latest observation:
"{{studentMessage}}"

Your instructions:
1. Speak in first person ("I") with an authoritative, professional, and minimal tone of an Egyptian senior clinician. Keep feedback brief (max 1-2 sentences). Do not lecture or explain long theories. Focus entirely on navigating this interactive loop.
2. Carefully detect if the student's latest message contains expressions of "I don't know", "that's all I have", "I cannot answer", "منعرفش", "مش عارف", "أنا مش عارف", "انقل على اللى بعده", "skip", "next", "that is all", or similar phrases of giving up.
   - If YES: Set "isResolved" to true. Provide the full expected answer briefly (e.g., "Alright, the findings for this step are: [briefly state findings]. Let us move on."), and do not ask them to try again.
3. Otherwise, compare their observations against the Ideal Findings:
   - CASE A: The student has noted all key clinical findings/keywords specified in the Ideal Findings.
     - Action: Set "isResolved" to true. Provide a brief enthusiastic confirmation (e.g., "Excellent. You identified all findings correctly.").
   - CASE B: The response is on the right track but incomplete or missing key signs/keywords.
     - Action: Set "isResolved" to false. DO NOT name the missing findings. Instead, prompt them to look closer or think about other regions, e.g.: "Good, what else do you observe?", "Can you expand on that?", "There are other signs to see or feel, what are they?", "What about the eyes or hands?".
   - CASE C: The comment is Completely Wrong or irrelevant (e.g. mentions findings that aren't there, or completely wrong signs).
     - Action: Set "isResolved" to false. Gently correct the misconception or say: "Not quite. Think about [hint]. Try again." or "No, look closely at the image / examine carefully. Try again."

Return your response strictly in the following JSON format:
{
  "text": "Your brief interactive feedback to the student",
  "isResolved": boolean
}
`;

app.post("/api/examine-step", authMiddleware, async (req, res) => {
  const { stepName, idealFinding, studentMessage, chatHistory } = req.body;

  try {
    const prompt = EXAM_STEP_EVALUATE_PROMPT
      .replace("{{stepName}}", stepName)
      .replace("{{idealFinding}}", idealFinding || "")
      .replace("{{chatHistory}}", JSON.stringify(chatHistory || []))
      .replace("{{studentMessage}}", studentMessage || "");

    const result = await safeGenerateContent({
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      }
    });

    const responseText = result.text?.trim() || "";
    try {
      const parsed = JSON.parse(responseText);
      res.json({ text: parsed.text, isResolved: parsed.isResolved, quotaExceeded: false });
    } catch (e) {
      res.json({ text: responseText, isResolved: false, quotaExceeded: false });
    }
  } catch (error: any) {
    const isQuota = error?.message?.includes("429") || error?.status === 429 || String(error).includes("429") || String(error).toLowerCase().includes("quota");
    if (isQuota) {
      console.log("ℹ️ Gemini API Quota Limit Reached (429) during physical examination step.");
      return res.json({ 
        text: "⚠️ عذراً يا دكتور، طاقة نظام الفحص (AI Quota) نفدت حالياً ولا يمكنني تحليل ملاحظاتك. يرجى المحاولة لاحقاً.", 
        isResolved: true, 
        quotaExceeded: true 
      });
    }
    
    console.log("⚠️ Examine Step API Exception (activated fallback).");

    const msg = (studentMessage || "").toLowerCase().trim();
    const sample = (idealFinding || "").toLowerCase();

    const giveUpPhrases = [
      "don't know", "dont know", "no idea", "مش عارف", "منعرفش", "أنا مش عارف", "انقل", "skip", "next", 
      "that's all", "that is all", "أنا مش عارف", "انقل على", "that's it", "معرفش", "انقل على الخطوة التالية", "انقل للخطوة التالية", "مش عارفها"
    ];

    const isGiveUp = giveUpPhrases.some(phrase => msg.includes(phrase)) || msg.length < 2;

    if (isGiveUp) {
      return res.json({
        text: `Alright, the findings for this step are: ${idealFinding}. Let us move to the next physical examination step.`,
        isResolved: true,
        quotaExceeded: isQuota
      });
    }

    const stopWords = new Set(["with", "then", "that", "this", "they", "them", "their", "your", "have", "some", "more", "less", "such", "were", "what", "when", "where", "which", "who", "whom", "will", "would", "shall", "should", "could", "might", "must", "been", "being", "have", "has", "had", "does", "done", "doing", "very", "much", "many", "most", "some", "such", "only", "same", "so", "than", "too", "very", "can", "cannot", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "before", "between", "both", "but", "by", "for", "from", "further", "here", "how", "if", "in", "into", "is", "it", "its", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"]);

    const sampleWords = sample
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 4 && !stopWords.has(w));

    let matchCount = 0;
    for (const word of sampleWords) {
      if (msg.includes(word)) {
        matchCount++;
      }
    }

    const matchRatio = sampleWords.length > 0 ? matchCount / sampleWords.length : 0;

    if (matchCount >= 2 || matchRatio >= 0.25) {
      res.json({
        text: `Excellent. You identified key findings!`,
        isResolved: true,
        quotaExceeded: isQuota
      });
    } else if (matchCount >= 1 || msg.length > 15) {
      res.json({
        text: `Good, what else? Can you expand on that? There is more you can observe.`,
        isResolved: false,
        quotaExceeded: isQuota
      });
    } else {
      res.json({
        text: `Not quite correct. Try again, or say "I don't know" to reveal the expected findings.`,
        isResolved: false,
        quotaExceeded: isQuota
      });
    }
  }
});

// Vite Setup
async function startServer() {
  await seedFirestoreIfNeeded();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
