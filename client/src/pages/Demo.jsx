import React, { useEffect, useRef } from "react";
import { toObject } from "xit-parse";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { XitItemNode } from "../components/Editor/extensions/XitItemNode";
import { XitListNode } from "../components/Editor/extensions/XitListNode";
import GroupTitleNode from "../components/Editor/extensions/GroupTitleNode";
import { CustomKeymapExtension } from "../components/Editor/extensions/CustomKeymap";
import SlashCommand from "../components/Editor/SlashCommand";
import debounce from "lodash.debounce";
import { convertTipTapToXit } from "../components/Editor/utils/ConvertTiptapToXit";
import { convertXitToTipTap } from "../components/Editor/utils/ConvertXitToTiptap";

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

const Demo = () => {
  const xitRaw = `
## Try Interacting:

[ ] Review this status guide
[@] Try clicking me to cycle through statuses
[x] Understand how each one works
[?] Ask questions if you're unsure
[~] You can ignore this one it's outdated!`;

  const xitObject = toObject(xitRaw);

  const editor = useEditor({
    editable: true,
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
      SlashCommand,
    ],
    content: convertXitToTipTap(xitObject),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-full min-h-[300px] p-6 bg-[#11121A] border border-[#272832] rounded-lg text-gray-300",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (!text?.match(/^\[.*\]/gm)) return false;

        try {
          event.preventDefault();
          const parsed = toObject(text);

          Object.values(parsed.groups).forEach((group) => {
            group.forEach((entry) => {
              const due = entry.modifiers?.due;
              if (due && !isValidDate(due)) {
                const normalized = normalizeDate(due);
                if (isValidDate(normalized)) {
                  entry.modifiers.due = normalized;
                }
              }
            });
          });

          const json = convertXitToTipTap(parsed);

          view.dispatch(
            view.state.tr.replaceSelectionWith(
              view.state.schema.nodeFromJSON(json)
            )
          );

          return true;
        } catch (e) {
          console.error("XIT Paste Error:", e);
          return false;
        }
      },
    },
  });

  return (
    <div className="w-full h-full overflow-auto bg-[#0b0c17] text-white px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">Try a Demo</h1>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Demo;
