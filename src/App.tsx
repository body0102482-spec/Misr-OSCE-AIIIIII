import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { CaseSelection } from "./pages/CaseSelection";
import { StationPage } from "./pages/station/StationPage";
import { AuthPage } from "./pages/AuthPage";
import { StudentDashboard } from "./pages/StudentDashboard";
import { useStore } from "./store/useStore";

export default function App() {
  const { currentUser } = useStore();

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
        <Route path="/cases" element={<CaseSelection />} />
        <Route path="/station" element={<StationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
