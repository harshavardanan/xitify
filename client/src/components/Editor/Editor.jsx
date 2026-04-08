import React, { useEffect, useRef, useState } from "react";
import { toObject } from "xit-parse";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { XitItemNode } from "./extensions/XitItemNode";
import { XitListNode } from "./extensions/XitListNode";
import GroupTitleNode from "./extensions/GroupTitleNode";
import { CustomKeymapExtension } from "./extensions/CustomKeymap";
import SlashCommand from "./SlashCommand";
import debounce from "lodash.debounce";
import { convertTipTapToXit } from "./utils/ConvertTiptapToXit";
import { convertXitToTipTap } from "./utils/ConvertXitToTiptap";
import { Placeholder } from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import FloatingToolbar from "./ui/FloatingToolbar";
import { TopToolbar } from "./ui/TopToolbar";

const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const normalizeDate = (dateString) => {
  if (/^\d{4}-Q[1-4]$/.test(dateString)) {
    const quarter = parseInt(dateString[6]);
    return `${dateString.slice(0, 4)}-${String((quarter - 1) * 3 + 1).padStart(
      2,
      "0"
    )}-01`;
  }
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    return `${dateString}-01`;
  }
  return dateString;
};

export const Editor = ({ editorData, setEditorData }) => {
  const [fileName, setFileName] = useState("");
  const lastReceivedContent = useRef(null);
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
        placeholder: "Type '/' to show options",
      }),
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
      SlashCommand,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-full focus:outline-none text-gray-300",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (text?.match(/^\[.*\]/gm)) {
          try {
            event.preventDefault();
            const parsed = toObject(text);
            const json = convertXitToTipTap(parsed);

            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodeFromJSON(json)
              )
            );
            return true;
          } catch (e) {
            console.error("XIT Paste Error:", e);
          }
        }
        return false;
      },
    },
    onUpdate: debounce(({ editor }) => {
      if (!setEditorData) return;
      const json = editor.getJSON();
      const jsonString = JSON.stringify(json);

      if (jsonString !== lastReceivedContent.current) {
        setEditorData(jsonString);
      }
    }, 300),
  });

  useEffect(() => {
    if (!editor || !editorData) return;

    try {
      if (editorData !== lastReceivedContent.current) {
        lastReceivedContent.current = editorData;
        const parsed = JSON.parse(editorData);
        editor.commands.setContent(parsed, false);
      }
    } catch (err) {
      console.error("Failed to sync content:", err);
    }
  }, [editorData, editor]);

  const handleExport = () => {
    if (!editor) return;
    const json = editor.getJSON();
    const content = convertTipTapToXit(json);
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName ? `${fileName}.xit` : "document.xit";
    link.click();
  };

  if (!editor) return null;
  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex flex-col text-white p-4 md:p-6 font-sans">
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
      <div className="w-full h-full bg-bg-elevated border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex-1 flex justify-start">
            <TopToolbar editor={editor} />
          </div>
          <div className="flex items-center">
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="file name"
              autoComplete="off"
              className="min-h-[44px] max-w-[150px] px-4 text-white text-sm border border-white/20 rounded-l-lg bg-black/50 focus:outline-none focus:border-white/50 transition-colors placeholder-neutral-500"
            />
            <button
              onClick={handleExport}
              type="submit"
              className="min-h-[44px] px-5 py-2 border border-white rounded-r-lg bg-white text-black font-semibold text-sm cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto relative">
          <FloatingToolbar editor={editor} />
          <EditorContent editor={editor} className="p-6" />
        </div>
      </div>
    </div>
  );
};
