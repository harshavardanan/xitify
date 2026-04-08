import React from "react";

const shortcuts = [
  {
    keys: ["⌘ / Ctrl", "↑"],
    description: "Increase Priority",
    details: "Increases the priority of the selected task (max 5).",
  },
  {
    keys: ["⌘ / Ctrl", "↓"],
    description: "Decrease Priority",
    details: "Decreases the priority of the selected task (min 0).",
  },
  {
    keys: ["⌘ / Ctrl", "Shift", "1"],
    description: "New To-Do Item",
    details: "Inserts a new single to-do item and places the cursor inside it.",
  },
  {
    keys: ["⌘ / Ctrl", "Shift", "G"],
    description: "New Group Task",
    details: "Inserts a new group task and places the cursor in the title.",
  },
  {
    keys: ["⌘ / Ctrl", "Shift", "2"],
    description: "New Nested To-Do",
    details: "Inserts a new to-do item inside the current group.",
  },
  {
    keys: ["⌘ / Ctrl", "Shift", "S"],
    description: "Export / Save",
    details: "Calls the function to save or export the current document.",
  },
];

const Kbd = ({ children }) => (
  <kbd className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono font-semibold text-neutral-300 bg-bg-base border border-bg-border shadow-sm">
    {children}
  </kbd>
);

const KeyboardShortcutsSection = () => (
  <section className="section">
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-50 mb-4">
          Command Interface
        </h2>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
          Accelerate execution via dedicated keyboard bindings optimized for rapid data entry.
        </p>
      </div>

      {/* Shortcuts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shortcuts.map((s) => (
          <div key={s.description} className="glow-card p-5 flex flex-col gap-3">
            {/* Keys */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {s.keys.map((key, i) => (
                <React.Fragment key={i}>
                  <Kbd>{key}</Kbd>
                  {i < s.keys.length - 1 && (
                    <span className="text-neutral-700 text-xs font-bold">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-100 mb-1">{s.description}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{s.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default KeyboardShortcutsSection;
