import React from "react";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, List, Square, CheckSquare, PlayCircle, XSquare, HelpCircle } from "lucide-react";

export const TopToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mr-4 bg-bg-card border border-white/10 rounded-lg px-2 py-1 shadow-md">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-md transition-colors ${
          editor.isActive("bold") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-md transition-colors ${
          editor.isActive("italic") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded-md transition-colors ${
          editor.isActive("underline") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-md transition-colors ${
          editor.isActive("strike") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* Basic Formatting */}
      <button
        onClick={() => editor.chain().focus().insertContent([{ type: "groupTitle", content: [{ type: "text", text: "New Group" }] }, { type: "xitList", content: [{ type: "xitItem", attrs: { status: "open" }, content: [{ type: "paragraph" }] }] }]).run()}
        className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        title="Add Group"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          if (editor.isActive("xitItem")) {
            editor.chain().focus().updateAttributes("xitItem", { status: "open" }).run();
          } else {
            editor.chain().focus().insertContent({ type: "xitList", content: [{ type: "xitItem", attrs: { status: "open" }, content: [{ type: "paragraph" }] }] }).run();
          }
        }}
        className={`p-1.5 rounded-md transition-colors ${
          editor.isActive("xitItem", { status: "open" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Open Task"
      >
        <Square className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* Statuses */}
      <button
        onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "checked" }).run()}
        disabled={!editor.isActive("xitItem")}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          editor.isActive("xitItem", { status: "checked" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Mark Checked"
      >
        <CheckSquare className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "ongoing" }).run()}
        disabled={!editor.isActive("xitItem")}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          editor.isActive("xitItem", { status: "ongoing" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Mark Ongoing"
      >
        <PlayCircle className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "inQuestion" }).run()}
        disabled={!editor.isActive("xitItem")}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          editor.isActive("xitItem", { status: "inQuestion" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Mark In Question"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "obsolete" }).run()}
        disabled={!editor.isActive("xitItem")}
        className={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          editor.isActive("xitItem", { status: "obsolete" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
        }`}
        title="Mark Obsolete"
      >
        <XSquare className="w-4 h-4" />
      </button>
    </div>
  );
};
