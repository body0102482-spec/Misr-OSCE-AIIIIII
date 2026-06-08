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
  loginUser: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  registerUser: (user: User, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  submitPayment: (p: Omit<PaymentSubmission, "id" | "timestamp" | "status">) => Promise<{ success: boolean; error?: string }>;
  verifyPayment: (id: string, status: "Approved" | "Declined") => Promise<{ success: boolean; error?: string }>;
  addCase: (c: Case) => void;
  editCase: (c: Case) => void;
  syncUser: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
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
      }
    ];
  }

  // FORCE Mahmoud98302 (case-insensitive) to be the ONLY admin, and downgrade other admins
  users = users.map((u) => {
    const isMahmoudAdmin = u.email.trim().toLowerCase() === "mahmoud98302";
    return {
      ...u,
      isAdmin: isMahmoudAdmin
    };
  });

  // Ensure Mahmoud98302 is in the list
  if (!users.some((u) => u.email.trim().toLowerCase() === "mahmoud98302")) {
    users.push({
      fullName: "Admin Mahmoud",
      studentId: "ADMIN-98302",
      university: "Misr University for Science and Technology (MUST)",
      mobile: "01024828652",
      email: "mahmoud98302",
      plan: "PREMIUM PLAN",
      isAdmin: true,
      isActivated: true,
      credits: 99999,
      planExpiresAt: Date.now() + 3650 * 24 * 3600 * 1000,
      planActivatedAt: Date.now(),
      startedCases: []
    });
  }

  localStorage.setItem("osce-users", JSON.stringify(users));

  // 2. Initial Passwords cache
  let passwords: Record<string, string> = {
    "student@must.edu.eg": "student123",
    "mariam@must.edu.eg": "mariam123"
  };
  const localPasswords = localStorage.getItem("osce-passwords");
  if (localPasswords) {
    try {
      passwords = { ...passwords, ...JSON.parse(localPasswords) };
    } catch (e) {}
  }
  passwords["mahmoud98302"] = "Vet20202025";
  localStorage.setItem("osce-passwords", JSON.stringify(passwords));

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

  loginUser: async (email, password, remember) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Incorrect email or password combination." };
      }

      const data = await res.json();
      if (data.success && data.user) {
        const loggedUser = { ...data.user, token: data.token };
        get().setCurrentUser(loggedUser);
        
        // Save in temporary login passwords cache (for compatibility/remember settings)
        const passwordsStr = localStorage.getItem("osce-passwords") || "{}";
        const passwords = JSON.parse(passwordsStr);
        passwords[email.trim().toLowerCase()] = password;
        localStorage.setItem("osce-passwords", JSON.stringify(passwords));

        // Sync fresh server stats if user is admin
        if (loggedUser.isAdmin) {
          await get().fetchAdminStats();
        }

        return { success: true };
      }
      return { success: false, error: "Communication protocol validation error." };
    } catch (e: any) {
      return { success: false, error: "Network connection is down. Cannot authenticate." };
    }
  },

  registerUser: async (newUser, password) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUser, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Registration failed on server." };
      }

      const data = await res.json();
      if (data.success && data.user) {
        // Automatically save to local password caches
        const passwordsStr = localStorage.getItem("osce-passwords") || "{}";
        const passwords = JSON.parse(passwordsStr);
        passwords[newUser.email.trim().toLowerCase()] = password;
        localStorage.setItem("osce-passwords", JSON.stringify(passwords));

        get().setCurrentUser({ ...data.user, token: data.token });
        return { success: true };
      }
      return { success: false, error: "Communication protocol registration error." };
    } catch (e: any) {
      return { success: false, error: "Network error. Failed to reach server during registration." };
    }
  },

  logoutUser: () => {
    get().setCurrentUser(null);
  },

  submitPayment: async (p) => {
    const user = get().currentUser;
    if (!user || !user.token) {
      return { success: false, error: "Session authentication required to submit payments." };
    }

    try {
      const res = await fetch("/api/auth/submit-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ payment: p })
      });

      if (!res.ok) {
        const errData = await res.json();
        return { success: false, error: errData.error || "Payment record creation failed on server." };
      }

      const data = await res.json();
      if (data.success) {
        set({ paymentsList: data.payments });
        localStorage.setItem("osce-payments", JSON.stringify(data.payments));
        return { success: true };
      }
      return { success: false, error: "Unexpected database feedback code." };
    } catch (err: any) {
      return { success: false, error: "Offline. Failed to send transaction ticket to the server." };
    }
  },

  verifyPayment: async (id, status) => {
    const user = get().currentUser;
    if (!user || !user.token) {
      return { success: false, error: "Admin login session is required." };
    }

    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ paymentId: id, status })
      });

      if (!res.ok) {
        const errData = await res.json();
        return { success: false, error: errData.error || "Payment approval failed on server." };
      }

      const data = await res.json();
      if (data.success) {
        set({ paymentsList: data.payments, usersList: data.users });
        localStorage.setItem("osce-payments", JSON.stringify(data.payments));
        localStorage.setItem("osce-users", JSON.stringify(data.users));

        // If the current student is the verified user, sync plan on screen immediately
        const matchPay = data.payments.find((p: any) => p.id === id);
        if (matchPay && user.email.toLowerCase() === matchPay.studentEmail.toLowerCase()) {
          const freshUserObj = data.users.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
          if (freshUserObj) {
            get().setCurrentUser({ ...freshUserObj, token: user.token });
          }
        }
        return { success: true };
      }
      return { success: false, error: "Unexpected verification payload." };
    } catch (err: any) {
      return { success: false, error: "Offline. Failed to contact verification API." };
    }
  },

  addCase: (newCase) => {
    const casesOverrideStr = localStorage.getItem("osce-custom-cases") || "[]";
    const casesOverride = JSON.parse(casesOverrideStr);
    const updated = [...casesOverride, newCase];
    localStorage.setItem("osce-custom-cases", JSON.stringify(updated));
  },

  editCase: (updatedCase) => {
    const casesOverrideStr = localStorage.getItem("osce-custom-cases") || "[]";
    const casesOverride = JSON.parse(casesOverrideStr);
    const filtered = casesOverride.filter((c: Case) => c.id !== updatedCase.id);
    const updated = [...filtered, updatedCase];
    localStorage.setItem("osce-custom-cases", JSON.stringify(updated));
  },

  syncUser: async () => {
    const user = get().currentUser;
    if (user && user.token) {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            get().setCurrentUser({ ...data.user, token: data.token });
          }
        } else if (res.status === 401) {
          // Token is dead or tampered, clear session
          get().logoutUser();
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      }
    }
  },

  fetchAdminStats: async () => {
    const user = get().currentUser;
    if (user && user.isAdmin && user.token) {
      try {
        const res = await fetch("/api/admin/system-stats", {
          headers: { "Authorization": `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            set({ usersList: data.users, paymentsList: data.payments });
            localStorage.setItem("osce-users", JSON.stringify(data.users));
            localStorage.setItem("osce-payments", JSON.stringify(data.payments));
          }
        }
      } catch (err) {
        console.error("Admin stats fetch failed:", err);
      }
    }
  }
}));
