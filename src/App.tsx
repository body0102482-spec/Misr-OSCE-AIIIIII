import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CaseSelection } from "./pages/CaseSelection";
import { StationPage } from "./pages/station/StationPage";
import { AuthPage } from "./pages/AuthPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { useStore } from "./store/useStore";

export default function App() {
  const { currentUser, syncUser, theme } = useStore();

  React.useEffect(() => {
    const initApp = async () => {
      if (currentUser) {
        await syncUser();
      }
    };
    initApp();
  }, []);

  React.useEffect(() => {
    const applyTheme = (currentTheme: typeof theme) => {
      const root = document.documentElement;
      let activeTheme = currentTheme;
      if (currentTheme === "system") {
        activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      if (activeTheme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <StudentDashboard /> : <LandingPage />} 
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={currentUser ? <StudentDashboard /> : <Navigate to="/auth" />} 
        />
        <Route path="/cases" element={<Navigate to="/" replace />} />
        <Route path="/station" element={<StationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
