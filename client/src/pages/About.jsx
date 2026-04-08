import React from "react";
import StatusSection from "./AboutContent/StatusSection";
import KeyboardShortcutsSection from "./AboutContent/KeyboardShortcutSection";
import EditCollaborativelySection from "./AboutContent/EditCollaborativelySection";

const About = () => (
  <div className="text-white overflow-x-hidden">
    <StatusSection />
    <KeyboardShortcutsSection />
    <EditCollaborativelySection />
  </div>
);

export default About;
