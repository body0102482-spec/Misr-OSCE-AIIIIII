import { create } from "zustand";
import { Case, Message, User, PaymentSubmission } from "../types";

interface OSCEState {
  currentCase: Case | null;
  messages: Message[];
  examinerMessages: Message[];
  timer: number;
  isTimerRunning: boolean;
  activeTab: "history" | "examination" | "investigations" | "diagnosis" | "feedback";
  studentNotes: {
    history: string;
    examination: string;
    investigations: string[];
    diagnosis: string;
    differential: string;
    management: string;
  };
  score: {
    communication: number;
    examination: number;
    reasoning: number;
    total: number;
    feedback: string;
    coveredItems?: string[];
    missedItems?: string[];
  } | null;
  isExaminerMode: boolean;
  chatTarget: "patient" | "examiner";
  currentQuestionId: string | null;
  askedQuestionIds: string[];
  vivaAttempts: {
    questionId: string;
    question: string;
    studentAnswer: string;
    isCorrect: boolean;
    sampleAnswer: string;
  }[];
  quotaExceeded: boolean;

  // Authenticaton & Database Extensions
  currentUser: User | null;
  usersList: User[];
  paymentsList: PaymentSubmission[];
  allCases: Case[];

  // Actions
  setCurrentCase: (c: Case) => void;
  addMessage: (m: Message) => void;
  addExaminerMessage: (m: Message) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setActiveTab: (tab: OSCEState["activeTab"]) => void;
  setChatTarget: (target: OSCEState["chatTarget"]) => void;
  updateNotes: (key: keyof OSCEState["studentNotes"], value: any) => void;
  setScore: (score: OSCEState["score"]) => void;
  toggleExaminerMode: () => void;
  setCurrentQuestionId: (id: string | null) => void;
  addAskedQuestionId: (id: string) => void;
  addVivaAttempt: (attempt: OSCEState["vivaAttempts"][0]) => void;
  setQuotaExceeded: (q: boolean) => void;
  resetSession: () => void;

  // New Auth & Admin Actions
  setCurrentUser: (u: User | null) => void;
  loginUser: (email: string, pass: string, remember: boolean) => { success: boolean; error?: string };
  registerUser: (user: User, pass: string) => { success: boolean; error?: string };
  logoutUser: () => void;
  submitPayment: (p: Omit<PaymentSubmission, "id" | "timestamp" | "status">) => void;
  verifyPayment: (id: string, status: "Approved" | "Declined") => void;
  addCase: (c: Case) => void;
  editCase: (c: Case) => void;
}

// Initial seed helper
const getInitialState = () => {
  // 1. Initial Users
  const localUsers = localStorage.getItem("osce-users");
  let users: User[] = [];
  if (localUsers) {
    users = JSON.parse(localUsers);
  } else {
    users = [
      {
        fullName: "Dr. Sherif Abdelbary",
        studentId: "ADMIN-01",
        university: "Misr University for Science and Technology (MUST)",
        mobile: "01024828652",
        email: "admin@must.edu.eg",
        plan: "PREMIUM PLAN",
        isAdmin: true,
        isActivated: true,
        credits: 9999,
        planExpiresAt: Date.now() + 365 * 24 * 3600 * 1000,
        planActivatedAt: Date.now(),
        startedCases: []
      },
      {
        fullName: "Mahmoud Nasser",
        studentId: "MUST-2024-819",
        university: "Misr University for Science and Technology (MUST)",
        mobile: "01024828652",
        email: "student@must.edu.eg",
        plan: "FREE PLAN",
        isAdmin: false,
        isActivated: true,
        credits: 0,
        planExpiresAt: 0,
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
      }
    ];
    localStorage.setItem("osce-users", JSON.stringify(users));
  }

  // 2. Initial Passwords cache
  if (!localStorage.getItem("osce-passwords")) {
    const passwords = {
      "admin@must.edu.eg": "admin123",
      "student@must.edu.eg": "student123",
      "mariam@must.edu.eg": "mariam123"
    };
    localStorage.setItem("osce-passwords", JSON.stringify(passwords));
  }

  // 3. Initial Payments
  const localPayments = localStorage.getItem("osce-payments");
  let payments: PaymentSubmission[] = [];
  if (localPayments) {
    payments = JSON.parse(localPayments);
  } else {
    payments = [
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
    localStorage.setItem("osce-payments", JSON.stringify(payments));
  }

  // 4. Initial User
  let curUser: User | null = null;
  const logged = localStorage.getItem("osce-logged-user");
  if (logged) {
    curUser = JSON.parse(logged);
  }

  return { users, payments, curUser };
};

const initialData = getInitialState();

export const useStore = create<OSCEState>((set, get) => ({
  currentCase: null,
  messages: [],
  examinerMessages: [],
  timer: 0,
  isTimerRunning: false,
  activeTab: "history",
  chatTarget: "patient",
  studentNotes: {
    history: "",
    examination: "",
    investigations: [],
    diagnosis: "",
    differential: "",
    management: "",
  },
  score: null,
  isExaminerMode: false,
  currentQuestionId: null,
  askedQuestionIds: [],
  vivaAttempts: [],
  quotaExceeded: false,

  // Lists
  currentUser: initialData.curUser,
  usersList: initialData.users,
  paymentsList: initialData.payments,
  allCases: [], // Lazily filled in CaseSelection or Components

  setCurrentCase: (c) => set({ currentCase: c }),
  addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
  addExaminerMessage: (m) => set((state) => ({ examinerMessages: [...state.examinerMessages, m] })),
  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  resetTimer: () => set({ timer: 0 }),
  tickTimer: () => set((state) => ({ timer: state.timer + 1 })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setChatTarget: (chatTarget) => set({ chatTarget }),
  updateNotes: (key, value) =>
    set((state) => ({
      studentNotes: { ...state.studentNotes, [key]: value },
    })),
  setScore: (score) => set({ score }),
  toggleExaminerMode: () => set((state) => ({ isExaminerMode: !state.isExaminerMode })),
  setCurrentQuestionId: (currentQuestionId) => set({ currentQuestionId }),
  addAskedQuestionId: (id) => set((state) => ({ askedQuestionIds: [...state.askedQuestionIds, id] })),
  addVivaAttempt: (attempt) => set((state) => {
    const filtered = state.vivaAttempts.filter(a => a.questionId !== attempt.questionId);
    return { vivaAttempts: [...filtered, attempt] };
  }),
  setQuotaExceeded: (quotaExceeded) => set({ quotaExceeded }),
  resetSession: () =>
    set((state) => {
      if (state.currentCase) {
        localStorage.removeItem(`osce-exam-chats-${state.currentCase.id}`);
        localStorage.removeItem(`osce-exam-resolved-${state.currentCase.id}`);
      }
      return {
        messages: [],
        examinerMessages: [],
        timer: 0,
        isTimerRunning: false,
        activeTab: "history",
        chatTarget: "patient",
        studentNotes: {
          history: "",
          examination: "",
          investigations: [],
          diagnosis: "",
          differential: "",
          management: "",
        },
        score: null,
        isExaminerMode: false,
        currentQuestionId: null,
        askedQuestionIds: [],
        vivaAttempts: [],
        quotaExceeded: false,
        currentCase: null,
      };
    }),

  // Login, Register, Pay & Auth Actions
  setCurrentUser: (u) => {
    set({ currentUser: u });
    if (u) {
      localStorage.setItem("osce-logged-user", JSON.stringify(u));
    } else {
      localStorage.removeItem("osce-logged-user");
    }
  },

  loginUser: (email, password, remember) => {
    const cleanEmail = email.trim().toLowerCase();
    const passwordsStr = localStorage.getItem("osce-passwords") || "{}";
    const passwords = JSON.parse(passwordsStr);

    if (!passwords[cleanEmail] || passwords[cleanEmail] !== password) {
      return { success: false, error: "Incorrect email or password combination." };
    }

    const matchedUser = get().usersList.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return { success: false, error: "User account could not be resolved." };
    }

    get().setCurrentUser(matchedUser);
    return { success: true };
  },

  registerUser: (newUser, password) => {
    const cleanEmail = newUser.email.trim().toLowerCase();
    const users = get().usersList;

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: "An account has already registered with this email address." };
    }

    const updatedUsers = [...users, { ...newUser, email: cleanEmail }];
    set({ usersList: updatedUsers });
    localStorage.setItem("osce-users", JSON.stringify(updatedUsers));

    const passwordsStr = localStorage.getItem("osce-passwords") || "{}";
    const passwords = JSON.parse(passwordsStr);
    passwords[cleanEmail] = password;
    localStorage.setItem("osce-passwords", JSON.stringify(passwords));

    get().setCurrentUser(newUser);
    return { success: true };
  },

  logoutUser: () => {
    get().setCurrentUser(null);
  },

  submitPayment: (p) => {
    const payments = get().paymentsList;
    const newPay: PaymentSubmission = {
      ...p,
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      status: "Pending"
    };

    const updatedPayments = [newPay, ...payments];
    set({ paymentsList: updatedPayments });
    localStorage.setItem("osce-payments", JSON.stringify(updatedPayments));
  },

  verifyPayment: (id, status) => {
    const payments = get().paymentsList.map((p) => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });

    set({ paymentsList: payments });
    localStorage.setItem("osce-payments", JSON.stringify(payments));

    // If approved, update user subscription plan with credits and expiry dates
    if (status === "Approved") {
      const matchPay = payments.find((p) => p.id === id);
      if (matchPay) {
        // Calculate credits and expiry duration
        let planCredits = 0;
        let validityMs = 0;
        if (matchPay.plan === "BASIC PLAN") {
          planCredits = 75;
          validityMs = 2 * 30 * 24 * 3600 * 1000;
        } else if (matchPay.plan === "PRO PLAN") {
          planCredits = 200;
          validityMs = 4 * 30 * 24 * 3600 * 1000;
        } else if (matchPay.plan === "PREMIUM PLAN") {
          planCredits = 400;
          validityMs = 6 * 30 * 24 * 3600 * 1000;
        }

        const now = Date.now();
        const planExpiresAt = now + validityMs;

        const users = get().usersList.map((u) => {
          if (u.email.toLowerCase() === matchPay.studentEmail.toLowerCase()) {
            return { 
              ...u, 
              plan: matchPay.plan,
              credits: planCredits,
              planActivatedAt: now,
              planExpiresAt: planExpiresAt,
              startedCases: u.startedCases || []
            };
          }
          return u;
        });

        set({ usersList: users });
        localStorage.setItem("osce-users", JSON.stringify(users));

        // If active user is the one getting approved, sync their session plan
        const active = get().currentUser;
        if (active && active.email.toLowerCase() === matchPay.studentEmail.toLowerCase()) {
          const updatedActive = { 
            ...active, 
            plan: matchPay.plan,
            credits: planCredits,
            planActivatedAt: now,
            planExpiresAt: planExpiresAt,
            startedCases: active.startedCases || []
          };
          get().setCurrentUser(updatedActive);
        }
      }
    }
  },

  addCase: (newCase) => {
    // Add dynamically
    const casesOverrideStr = localStorage.getItem("osce-custom-cases") || "[]";
    const casesOverride = JSON.parse(casesOverrideStr);
    const updated = [...casesOverride, newCase];
    localStorage.setItem("osce-custom-cases", JSON.stringify(updated));
    // Trigger list update if necessary
  },

  editCase: (updatedCase) => {
    const casesOverrideStr = localStorage.getItem("osce-custom-cases") || "[]";
    const casesOverride = JSON.parse(casesOverrideStr);
    const filtered = casesOverride.filter((c: Case) => c.id !== updatedCase.id);
    const updated = [...filtered, updatedCase];
    localStorage.setItem("osce-custom-cases", JSON.stringify(updated));
  }
}));
