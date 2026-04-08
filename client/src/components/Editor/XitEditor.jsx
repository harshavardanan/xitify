import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toObject } from "xit-parse";
import { XitItemNode } from "./extensions/XitItemNode";
import { XitListNode } from "./extensions/XitListNode";
import GroupTitleNode from "./extensions/GroupTitleNode";
import { CustomKeymapExtension } from "./extensions/CustomKeymap";
import SlashCommand from "./SlashCommand";
import { convertTipTapToXit } from "./utils/ConvertTiptapToXit";
import { convertXitToTipTap } from "./utils/ConvertXitToTiptap";
import Upload from "../Upload";
import Underline from "@tiptap/extension-underline";
import FloatingToolbar from "./ui/FloatingToolbar";
import { TopToolbar } from "./ui/TopToolbar";

export const XitEditor = () => {
  const [hasContent, setHasContent] = useState(false);
  const [fileName, setFileName] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
      SlashCommand,
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-full min-h-[300px] p-6 bg-bg-elevated border border-white/10 rounded-xl text-neutral-300 focus:outline-none",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (text && text.match(/^\[.*\]/gm)) {
          try {
            const parsed = toObject(text);
            const doc = convertXitToTipTap(parsed);
            const node = view.state.schema.nodeFromJSON(doc);
            const endPos = view.state.doc.content.size;
            const tr = view.state.tr.insert(endPos, node.content);
            view.dispatch(tr);
            return true;
          } catch (e) {
            console.error("XIT Paste Error:", e);
            return false;
          }
        }
        return false;
      },
    },
  });

  const handleFileSelect = async (file) => {
    if (!editor) return;
    try {
      const text = await file.text();
      const parsed = toObject(text);
      const doc = convertXitToTipTap(parsed);
      editor.commands.setContent(doc);
      setHasContent(true);
    } catch (err) {
      console.error("Invalid XIT file:", err);
    }
  };

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

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-black text-white overflow-hidden">
      {!hasContent && (
        <div className="w-full h-full flex items-center justify-center">
          <Upload onFileSelect={handleFileSelect} />
        </div>
      )}

      {hasContent && (
        <div className="w-full h-full flex flex-col items-center bg-black text-white overflow-hidden">
          <div className="w-full h-full py-4 md:py-10 overflow-auto flex flex-col items-center">
            <div className="w-full max-w-4xl sticky top-0 z-30 bg-black/80 backdrop-blur-md p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-white/10">
              <div className="flex-1 flex justify-start">
                <TopToolbar editor={editor} />
              </div>
              <div className="flex items-center shadow-md">
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
            <div className="w-full max-w-4xl px-4 py-6 relative">
              <FloatingToolbar editor={editor} />
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
