import React, { useState } from "react";
import { IconClipboardCopy, IconCheck } from "@tabler/icons-react";

const CopyRoomKeyButton = ({ roomName }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (roomName) {
      navigator.clipboard
        .writeText(roomName)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(() => {
          // You can handle error here if needed
          setCopied(false);
        });
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="flex items-center justify-between px-3 py-2 text-white bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      type="button"
    >
      <span className="truncate max-w-xs">
        {copied ? "Room key copied!" : roomName}
      </span>
      {copied ? (
        <IconCheck className="h-5 w-5 ml-2 flex-shrink-0 text-green-400" />
      ) : (
        <IconClipboardCopy className="h-5 w-5 ml-2 flex-shrink-0" />
      )}
    </button>
  );
};

export default CopyRoomKeyButton;
