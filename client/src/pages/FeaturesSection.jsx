import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    label: "Platform Architecture",
    title: "Real-Time Collaboration",
    description:
      "Observe your team's modifications instantaneously. All keystrokes are synchronized with sub-100ms latency via Socket.IO, minimizing conflict resolution.",
    span: "md:col-span-2",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "File Format",
    title: "Native .xit Support",
    description:
      "Direct integration with the plain-text .xit task format, preserving data structures for statuses, priorities, and associated metadata.",
    span: "md:col-span-1",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    label: "Data Management",
    title: "Streamlined Import & Export",
    description:
      "Seamlessly upload standard .xit files into the workspace, collaborate, and export the standardized output.",
    span: "md:col-span-1",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "System Performance",
    title: "Optimized Throughput",
    description:
      "Leveraging TipTap architecture alongside persistent WebSocket connections to ensure robust state synchronization for all active clients.",
    span: "md:col-span-2",
  },
];

const FeatureCard = ({ feature }) => (
  <div
    className={`glow-card relative overflow-hidden p-6 flex flex-col gap-4 ${feature.span}`}
  >
    {/* Icon */}
    <div
      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-lg flex-shrink-0"
    >
      {feature.icon}
    </div>

    {/* Content */}
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-1">
        {feature.label}
      </div>
      <h3 className="text-lg font-bold text-neutral-100 mb-2">{feature.title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
    </div>
  </div>
);

const FeaturesSection = () => (
  <section className="section">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-50 mb-4">
          Core Capabilities
        </h2>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
          An essential toolkit for structured text management, designed to scale with your teams operations.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <FeatureCard key={f.label} feature={f} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link to="/editor" className="btn-primary text-sm px-6 py-3">
          Launch Workspace
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
