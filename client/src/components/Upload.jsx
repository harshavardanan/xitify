import React, { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import { AnimatePresence, motion } from "motion/react";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";

const Upload = ({ onFileSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-screen w-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      <FileUpload
        onChange={(files) => {
          if (files?.[0]) {
            onFileSelect(files[0]);
          }
        }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full h-full"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={[
                [59, 130, 246],
                [139, 92, 246],
              ]}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/90 pointer-events-none" />
    </div>
  );
};

export default Upload;
