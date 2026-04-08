import React from "react";
import { Link } from "react-router-dom";

/* ── Animated grid background ─────────────────────── */
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 dot-bg opacity-60" />
    {/* Top glow — white */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-10"
      style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.9), transparent)",
        filter: "blur(2px)",
      }}
    />
    {/* Subtle white orb */}
    <div
      className="absolute animate-orb-drift"
      style={{
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
        top: "-20%", left: "-10%",
        filter: "blur(40px)",
      }}
    />
  </div>
);

/* ── Floating editor mockup ───────────────────────── */
const EditorMockup = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-16 animate-fade-up-delay-3">
    {/* Subtle glow behind */}
    <div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.06), transparent 70%)",
        filter: "blur(30px)",
        transform: "scale(1.1)",
      }}
    />
    {/* Window */}
    <div className="relative glass-card shadow-2xl shadow-black/80 overflow-hidden animate-float border border-white/[0.06]">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <div className="flex-1 text-center">
          <div className="inline-block px-3 py-1 rounded-md bg-white/5 text-white/30 text-xs font-mono">
            project-tasks.xit
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-sm space-y-2.5">
        <div className="text-white/25 text-xs mb-3">## Q4 Marketing Plan</div>
        <div className="flex items-center gap-3">
          <span className="text-white/30">[x]</span>
          <span className="text-white/35 line-through">Finalize budget allocation</span>
          <span className="ml-auto text-xs text-white/20">done</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/70">[@]</span>
          <span className="text-white/90">Develop social media campaign</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="w-0.5 h-5 rounded-sm bg-white/80 animate-cursor-blink" />
            <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded font-sans font-semibold -mt-4">
              Jane
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30">[ ]</span>
          <span className="text-white/50">Draft blog post announcement</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/50">[?]</span>
          <span className="text-white/50">Confirm influencer partnerships</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/20">[~]</span>
          <span className="text-white/25 line-through">Old campaign strategy</span>
        </div>
      </div>
      {/* Status bar */}
      <div className="px-5 py-2 border-t border-white/[0.04] bg-white/[0.015] flex items-center gap-4 text-xs text-white/25">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
          2 collaborators
        </span>
        <span>5 tasks</span>
        <span className="ml-auto">Autosaved just now</span>
      </div>
    </div>
  </div>
);

const Hero = () => (
  <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 md:py-16 overflow-hidden bg-black">
    <GridBackground />

    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 opacity-0 animate-fade-up"
        style={{ animationFillMode: "forwards" }}
      >
        <span className="gradient-text">Your Ideas,</span>
        <br />
        <span className="text-white">In Sync.</span>
      </h1>

      <p
        className="max-w-3xl text-lg sm:text-xl text-white/50 leading-relaxed mb-10 opacity-0 animate-fade-up-delay-1"
        style={{ animationFillMode: "forwards" }}
      >
        <span className="text-white/80 font-bold">[x]it!</span> is a plain-text file format for todos and check lists. 
        (Pronounced like the English word "exit"). Xitify provides a high-performance sync environment for your <code className="text-white/80 font-mono text-base bg-white/10 px-1.5 py-0.5 rounded">.xit</code> checklists.
      </p>

      <div
        className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up-delay-2"
        style={{ animationFillMode: "forwards" }}
      >
        <Link to="/signin" className="btn-primary text-base px-7 py-3.5">
          Get Started
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link to="/editor" className="btn-secondary text-base px-7 py-3.5">
          Try the Editor
        </Link>
      </div>

      <EditorMockup />
    </div>

    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
  </section>
);

export default Hero;
