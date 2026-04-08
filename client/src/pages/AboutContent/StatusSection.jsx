import React from "react";
import { Square, CheckCircle, Clock3, HelpCircle, XCircle } from "lucide-react";

const statuses = [
  {
    icon: <Square className="w-5 h-5" />,
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
    title: "Open",
    description: "The default state for any new task.",
    example: "[ ] Plan the team meeting",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Checked",
    description: "For tasks that have been completed.",
    example: "[x] Finish the project report",
  },
  {
    icon: <Clock3 className="w-5 h-5" />,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Ongoing",
    description: "For tasks you are currently working on.",
    example: "[@] Develop the new feature",
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    title: "In Question",
    description: "Use when a task is unclear or needs discussion.",
    example: "[?] Confirm budget for Q4",
  },
  {
    icon: <XCircle className="w-5 h-5" />,
    color: "text-neutral-400",
    bg: "bg-neutral-400/10",
    title: "Obsolete",
    description: "Designates items that are no longer relevant or required.",
    example: "[~] Migrate legacy server infrastructure",
  },
];

const StatusSection = () => (
  <section className="section">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-50 mb-4">
          Task States
        </h2>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
          Manage operations systematically. Every status designation carries a specific visual indicator for immediate comprehension.
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statuses.map((s) => (
          <div key={s.title} className="glow-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
                {s.icon}
              </div>
              <h3 className="text-base font-semibold text-neutral-100">{s.title}</h3>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">{s.description}</p>
            <div className="mt-auto">
              <code className="block w-full px-3 py-2.5 rounded-lg bg-bg-base text-neutral-300 text-xs font-mono border border-bg-border">
                {s.example}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatusSection;
