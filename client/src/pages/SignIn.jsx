import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ── Google SVG icon ─────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <path
      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z"
      fill="#FFC107"
    />
    <path
      d="M6.3 14.7l7 5.1C15.1 16 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.3-17.7 11.7z"
      fill="#FF3D00"
    />
    <path
      d="M24 45c5.5 0 10.5-1.8 14.4-5l-6.7-5.5C29.5 36.1 26.9 37 24 37c-6 0-11.1-4-12.9-9.5l-7 5.4C7.7 40.8 15.3 45 24 45z"
      fill="#4CAF50"
    />
    <path
      d="M44.5 20H24v8.5h11.8c-.9 2.7-2.6 5-5 6.5l6.7 5.5C41.8 37.1 45 31 45 24c0-1.3-.2-2.7-.5-4z"
      fill="#1976D2"
    />
  </svg>
);

const SignIn = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      const msg =
        err.code === "auth/popup-closed-by-user"
          ? "Sign-in cancelled."
          : err.code === "auth/network-request-failed"
          ? "Network error. Check your connection."
          : "Sign-in failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-base overflow-hidden">
      {/* Ambient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 animate-orb-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 animate-orb-drift"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
          bottom: "10%",
          right: "15%",
          filter: "blur(80px)",
          animationDelay: "-6s",
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-bg opacity-40 pointer-events-none" />

      {/* Sign-in card */}
      <div className="relative glass-card w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-6 shadow-2xl animate-fade-up">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-violet flex items-center justify-center shadow-lg shadow-accent/30">
            <span className="text-white font-black text-xl tracking-tight">X</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-50 tracking-tight">
              Welcome to Xitify
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Sign in to start writing and collaborating
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-bg-border" />

        {/* Google sign-in button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl
            bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
            text-neutral-100 font-medium text-sm tracking-wide
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="text-xs text-neutral-600 text-center leading-relaxed">
          By signing in, you agree to our{" "}
          <span className="text-neutral-400 hover:text-accent cursor-pointer transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-neutral-400 hover:text-accent cursor-pointer transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default SignIn;
