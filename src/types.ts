export interface Case {
  id: string;
  name: string;
  specialty: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  category?: string;
  subcategory?: string;
  planRequired?: string;
  image?: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    occupation: string;
    chiefComplaint: string;
    vitals: {
      bp: string;
      hr: string;
      rr: string;
      temp: string;
      oxygen: string;
    };
  };
  history: {
    presentIllness: string;
    pastHistory: string;
    drugHistory: string;
    familyHistory: string;
    socialHistory: string;
  };
  examination: {
    inspection: string;
    palpation: string;
    percussion: string;
    auscultation: string;
    specialTests?: { name: string; finding: string; image?: string; audio?: string; video?: string }[];
    inspectionImage?: string;
    palpationImage?: string;
    percussionImage?: string;
    auscultationImage?: string;
    inspectionAudio?: string;
    palpationAudio?: string;
    percussionAudio?: string;
    auscultationAudio?: string;
    inspectionVideo?: string;
    palpationVideo?: string;
    percussionVideo?: string;
    auscultationVideo?: string;
  };
  investigations: {
    name: string;
    result: string;
    unit?: string;
    normalRange?: string;
    image?: string;
  }[];
  diagnosis: {
    provisional: string;
    differentials: string[];
    management: string;
  };
  checklist: {
    item: string;
    category: "History" | "Examination" | "Communication" | "Reasoning";
  }[];
  examinerQuestions?: {
    id: string;
    question: string;
    sampleAnswer: string;
  }[];
  description?: string;
}

export interface Message {
  role: "patient" | "student" | "examiner";
  content: string;
  timestamp: number;
}

export interface User {
  fullName: string;
  studentId: string;
  university: string;
  mobile: string;
  email: string;
  plan: "FREE PLAN" | "BASIC PLAN" | "PREMIUM PLAN" | "PRO PLAN";
  isAdmin?: boolean;
  isActivated?: boolean;
  credits?: number;
  planExpiresAt?: number;
  planActivatedAt?: number;
  startedCases?: string[];
  completedStations?: string[];
  token?: string;
}

export interface PaymentSubmission {
  id: string;
  studentEmail: string;
  studentName: string;
  mobile: string;
  plan: "BASIC PLAN" | "PREMIUM PLAN" | "PRO PLAN";
  amount: number;
  method: "Vodafone Cash" | "InstaPay";
  screenshotText?: string; // simulation of screenshot upload
  transactionId: string;
  timestamp: number;
  status: "Pending" | "Approved" | "Declined";
}
