import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { XitItemNode } from "./extensions/XitItemNode";
import { XitListNode } from "./extensions/XitListNode";
import GroupTitleNode from "./extensions/GroupTitleNode";
import { CustomKeymapExtension } from "./extensions/CustomKeymap";
import SlashCommand from "./SlashCommand";
import { toObject } from "xit-parse";
import { convertXitToTipTap } from "./utils/ConvertXitToTiptap";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

const initialText = `Welcome to the interactive Xitify tour!
[ ] Status: Try clicking this space or typing 'x' to mark it done
[ ] Priority: Click here and press Cmd/Ctrl + ↑ to increase priority
[ ] Tasks: Press Cmd/Ctrl + Shift + 1 to insert a new item below
[?] Groups: Press Cmd/Ctrl + Shift + G to insert a new Group Task

(Type "/" anywhere on a blank line to see the command menu!)`;

export const MiniDemoEditor = () => {
  const [step, setStep] = useState(1);
  const json = convertXitToTipTap(toObject(initialText));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Type '/' to explore formatting tools...",
      }),
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
      SlashCommand,
    ],
    content: json,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-full focus:outline-none text-gray-300 min-h-[160px]",
      },
    },
    onUpdate: ({ editor }) => {
      const state = JSON.stringify(editor.getJSON());
      const itemCount = state.split('"type":"xitItem"').length - 1;

      if (step === 1 && (state.includes('"status":"checked"') || state.includes('"status":"ongoing"'))) {
        setStep(2);
      } else if (step === 2 && (state.includes('"priority":1') || state.includes('"priority":2'))) {
        setStep(3);
      } else if (step === 3 && itemCount > 4) {
        // Initial has 4 items. If it > 4, they created one.
        setStep(4);
      } else if (step === 4 && state.includes('"type":"groupTitle"')) {
        setStep(5);
      }
    },
  });

  if (!editor) return null;

  return (
    <div className="relative w-full h-full bg-black/20 pb-16">
      <style>
        {`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #6B7280;
            pointer-events: none;
            height: 0;
          }
        `}
      </style>
      
      <div className="flex-1 overflow-auto px-5 py-3">
        <EditorContent editor={editor} />
      </div>

      {/* Interactive Tour Overlay */}
      <div className="absolute bottom-4 right-4 max-w-[300px] bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl flex items-start gap-3 transition-all animate-fade-up z-50">
        {step === 5 ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        ) : (
          <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0 animate-pulse" />
        )}
        <div>
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
            {step === 5 ? "Tour Complete!" : `Step ${step} of 4`}
          </div>
          <p className="text-xs text-neutral-200 leading-relaxed font-sans">
            {step === 1 && "Start by changing a task status. Select the first empty brackets [ ] and type 'x' or '@'."}
            {step === 2 && "Awesome. Now place your cursor on a task and press Cmd/Ctrl + \u2191 to increase its Priority."}
            {step === 3 && "Great! Let's make a new To-Do item rapidly. Press Cmd/Ctrl + Shift + 1."}
            {step === 4 && "Perfection. Now group your tasks by inserting a Group Title: press Cmd/Ctrl + Shift + G."}
            {step === 5 && "You're a pro! You now know all the rapid-entry shortcuts. Explore using '/' or hop into a real room!"}
          </p>
        </div>
      </div>
    </div>
  );
};
