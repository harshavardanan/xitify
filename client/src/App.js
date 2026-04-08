import React, { useState, useEffect } from "react";
import { XitEditor } from "./components/Editor/XitEditor";
import LandingPage from "./pages/LandingPage";
import { NavBar } from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import { Editor } from "./components/Editor/Editor";
import SocketConfig from "./components/SocketConfig";
import JoinRoom from "./components/JoinRoom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

/* ── Protected route wrapper ─────────────────────── */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/signin" replace />;
};

/* ── Public-only route (redirect if signed in) ───── */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !user ? children : <Navigate to="/" replace />;
};

/* ── Full-screen loader ──────────────────────────── */
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-bg-base z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      <p className="text-neutral-400 text-sm tracking-wide">Loading…</p>
    </div>
  </div>
);

/* ── App shell ───────────────────────────────────── */
const AppShell = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>
      <div className="pt-16 h-full w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <XitEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collab"
            element={
              <ProtectedRoute>
                <JoinRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collab/:roomName/:username"
            element={
              <ProtectedRoute>
                <SocketConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#13131f",
            color: "#f1f5f9",
            border: "1px solid #1e1e2e",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.875rem",
          },
        }}
      />
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  </Router>
);

export default App;
