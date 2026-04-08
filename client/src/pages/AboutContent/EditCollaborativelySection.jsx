import React from "react";
import { Link } from "react-router-dom";
import { Users, Network, Clock, ShieldCheck, Zap } from "lucide-react";
import { MiniDemoEditor } from "../../components/Editor/MiniDemoEditor";

const concepts = [
  {
    icon: <Users className="w-5 h-5" />,
    color: "text-neutral-300",
    bg: "bg-white/5",
    title: "Real-Time Editing",
    description: "Collaborate with others in the same document instantly.",
    example: "User A edits → User B sees changes live.",
  },
  {
    icon: <Network className="w-5 h-5" />,
    color: "text-neutral-300",
    bg: "bg-white/5",
    title: "Socket.IO Integration",
    description: "WebSocket connections broadcast updates to all participants.",
    example: 'socket.emit("editing", { room, data });',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    color: "text-neutral-300",
    bg: "bg-white/5",
    title: "Live Persistence",
    description: "Editor content is automatically saved to MongoDB on change.",
    example: "Document.findOneAndUpdate({ docId }, { content });",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "text-neutral-300",
    bg: "bg-white/5",
    title: "Secure Access",
    description: "Users sign in with Google via Firebase Auth — no passwords.",
    example: "signInWithPopup(auth, googleProvider)",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    color: "text-neutral-300",
    bg: "bg-white/5",
    title: "Minimal Delay",
    description: "TipTap provides a highly responsive editing experience.",
    example: "<EditorContent editor={editor} />",
  },
];

/* ── Live collab mockup ───────────────────────────── */
const CollabMockup = () => (
  <div className="relative glass-card border border-white/8 overflow-hidden shadow-2xl shadow-black/40">
    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-white/20" />
        <div className="w-3 h-3 rounded-full bg-white/20" />
        <div className="w-3 h-3 rounded-full bg-white/20" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="px-3 py-0.5 rounded-md bg-white/5 text-neutral-500 text-xs font-mono flex items-center gap-2 transition-colors hover:text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Interactive Demo
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
        <div className="flex -space-x-1.5">
          {["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)"].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-bg-card" style={{ background: c }} />
          ))}
        </div>
        <span>3 online</span>
      </div>
    </div>

    {/* Content */}
    <MiniDemoEditor />
  </div>
);

const EditCollaborativelySection = () => (
  <>
    {/* How it works */}
    <section className="section">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-50 mb-4">
            Architecture
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Engineered for reliability. Secure, horizontally scalable real-time synchronization infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((c) => (
            <div key={c.title} className="glow-card p-6 flex flex-col gap-4">
              <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.color} flex items-center justify-center flex-shrink-0`}>
                {c.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 mb-1.5">{c.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-3">{c.description}</p>
                <code className="block px-3 py-2 rounded-lg bg-bg-base border border-bg-border text-neutral-400 text-xs font-mono whitespace-pre-wrap break-all">
                  {c.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA section */}
    <section className="section-sm">
      <div className="max-w-4xl mx-auto">
        {/* Big headline */}
        <div className="text-center mb-14">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6">
            <span className="gradient-text">Consistent States,</span>
            <br />
            <span className="text-neutral-200">Across All Clients.</span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto mb-8">
            Deploy a robust text management interface built for distributed teams. Maintain complete visibility over concurrent modifications and project statuses.
          </p>
          <Link to="/collab" className="btn-primary text-base px-8 py-4">
            Initialize Session
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Collab mockup */}
        <CollabMockup />
      </div>
    </section>
  </>
);

export default EditCollaborativelySection;
