import React from "react";
import { BubbleMenu } from "@tiptap/react";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Square, CheckSquare, PlayCircle, XSquare, HelpCircle } from "lucide-react";

const FloatingToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="flex items-center gap-1 bg-bg-card border border-white/10 rounded-lg shadow-xl shadow-black p-1 backdrop-blur-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("bold") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("italic") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("underline") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md transition-colors ${
            editor.isActive("strike") ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
          }`}
          title="Strikethrough (Cmd+Shift+X)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {editor.isActive("xitItem") && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" />
            
            <button
              onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "open" }).run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive("xitItem", { status: "open" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="Open"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "checked" }).run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive("xitItem", { status: "checked" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="Checked"
            >
              <CheckSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "ongoing" }).run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive("xitItem", { status: "ongoing" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="Ongoing"
            >
              <PlayCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "inQuestion" }).run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive("xitItem", { status: "inQuestion" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="In Question"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().updateAttributes("xitItem", { status: "obsolete" }).run()}
              className={`p-1.5 rounded-md transition-colors ${
                editor.isActive("xitItem", { status: "obsolete" }) ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
              title="Obsolete"
            >
              <XSquare className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </BubbleMenu>
  );
};

export default FloatingToolbar;
