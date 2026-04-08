import React, { useState } from "react";
import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import { Node, mergeAttributes, Extension } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Calendar, Tags } from "lucide-react";
import { keymap } from "prosemirror-keymap";
import { toObject } from "xit-parse";
import StarterKit from "@tiptap/starter-kit";
//import SlashCommand from "@tiptap/extension-slash-command";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const convertXitToTipTap = (xitObj) => {
  const content = [];
  Object.values(xitObj.groups).forEach((group) => {
    let stack = [content];
    group.forEach((entry) => {
      if (entry.type === "title") {
        content.push({
          type: "groupTitle",
          content: [{ type: "text", text: entry.content }],
        });
        stack = [content];
      } else if (entry.type === "item") {
        const indent = entry.modifiers?.priorityPadding || 0;
        const itemNode = {
          type: "xitItem",
          attrs: {
            status: entry.status || "open",
            priority: entry.modifiers?.priorityLevel || 0,
            dueDate: entry.modifiers?.due || null,
            tags: entry.modifiers?.tags?.map((t) => t.replace(/^#/, "")) || [],
          },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: entry.content }],
            },
          ],
        };

        while (stack.length <= indent) {
          const last = stack[stack.length - 1];
          const list = { type: "xitList", content: [] };
          last.push(list);
          stack.push(list.content);
        }

        if (!stack[indent + 1]) {
          const list = { type: "xitList", content: [] };
          stack[indent].push(list);
          stack[indent + 1] = list.content;
        }

        stack[indent + 1].push(itemNode);
        stack.length = indent + 2;
      }
    });
  });
  return { type: "doc", content };
};

const convertTipTapToXit = (docJSON) => {
  const lines = [];
  const statusMap = {
    open: "[ ]",
    checked: "[x]",
    ongoing: "[@]",
    obsolete: "[~]",
    inQuestion: "[?]",
  };

  const serializeNode = (node, indent = 0) => {
    if (node.type === "groupTitle") {
      lines.push("## " + (node.content?.[0]?.text || ""));
    } else if (node.type === "xitItem") {
      const status = statusMap[node.attrs.status] || "[ ]";
      const priority = "!".repeat(node.attrs.priority || 0);
      const paragraph = node.content?.find((c) => c.type === "paragraph");
      const text = paragraph?.content?.[0]?.text || "";
      const due = node.attrs.dueDate ? ` -> ${node.attrs.dueDate}` : "";
      const tags =
        node.attrs.tags?.length > 0 ? ` #${node.attrs.tags.join(" #")}` : "";
      lines.push(
        `${"  ".repeat(
          indent
        )}${status} ${priority} ${text}${due}${tags}`.trim()
      );
    } else if (node.type === "xitList") {
      node.content.forEach((child) => serializeNode(child, indent + 1));
    }
  };

  docJSON.content.forEach((node) => serializeNode(node, 0));
  return lines.join("\n");
};

const XitListNode = Node.create({
  name: "xitList",
  group: "block",
  content: "xitItem+",
  parseHTML: () => [{ tag: "ul" }],
  renderHTML: () => ["ul", { class: "ml-4 list-none" }, 0],
});

const XitItemComponent = ({ node, updateAttributes }) => {
  const { status, priority, dueDate, tags } = node.attrs;
  const statusCycle = ["open", "ongoing", "checked", "inQuestion", "obsolete"];

  const onStatusChange = () => {
    const next =
      statusCycle[(statusCycle.indexOf(status) + 1) % statusCycle.length];
    updateAttributes({ status: next });
  };

  const handleTagsChange = (e) =>
    updateAttributes({ tags: e.target.value.split(",").map((t) => t.trim()) });

  const statusMap = {
    open: <span className="text-blue-400">[ ]</span>,
    checked: <span className="text-green-400">[x]</span>,
    ongoing: <span className="text-pink-400">[@]</span>,
    obsolete: <span className="text-zinc-500">[~]</span>,
    inQuestion: <span className="text-yellow-400">[?]</span>,
  };

  return (
    <NodeViewWrapper className="flex flex-col gap-1 my-1.5 text-white">
      <div className="flex items-start gap-2">
        <div
          className="cursor-pointer font-mono select-none pt-0.5"
          onClick={onStatusChange}
          contentEditable={false}
        >
          {statusMap[status]}
        </div>
        {priority > 0 && (
          <div
            className="font-mono text-red-400 select-none pt-0.5"
            contentEditable={false}
          >
            {"!".repeat(priority)}
          </div>
        )}
        <NodeViewContent
          className={`w-full outline-none bg-transparent ${
            status === "checked" ? "text-zinc-500 line-through" : "text-white"
          }`}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-400 pl-6">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <DatePicker
            className="bg-transparent border-b border-gray-600 focus:outline-none text-white w-[120px]"
            selected={dueDate ? new Date(dueDate) : null}
            onChange={(date) =>
              updateAttributes({ dueDate: date.toISOString().split("T")[0] })
            }
            placeholderText="YYYY-MM-DD"
          />
        </div>
        <div className="flex items-center gap-1">
          <Tags size={12} />
          <input
            className="bg-transparent border-b border-gray-600 focus:outline-none text-white w-[160px]"
            value={tags?.join(", ") || ""}
            onChange={handleTagsChange}
            placeholder="comma,separated,tags"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

const XitItemNode = Node.create({
  name: "xitItem",
  group: "block",
  content: "(paragraph | xitList)*",
  addAttributes() {
    return {
      status: { default: "open" },
      priority: { default: 0 },
      dueDate: { default: null },
      tags: { default: [] },
    };
  },
  parseHTML() {
    return [{ tag: `div[data-type="xitItem"]` }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "xitItem" }),
      0,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(XitItemComponent);
  },
});

const GroupTitleNode = Node.create({
  name: "groupTitle",
  group: "block",
  content: "inline*",
  parseHTML: () => [{ tag: "h3" }],
  renderHTML: () => ["h3", { class: "text-blue-400 font-bold mt-4" }, 0],
});

const CustomKeymapExtension = Extension.create({
  name: "customKeymap",
  addProseMirrorPlugins() {
    return [
      keymap({
        "Mod-ArrowUp": (state, dispatch) => {
          const { from, to } = state.selection;
          let tr = state.tr;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === "xitItem") {
              const newPriority = Math.min((node.attrs.priority || 0) + 1, 5);
              tr = tr.setNodeMarkup(pos, null, {
                ...node.attrs,
                priority: newPriority,
              });
            }
          });
          if (tr.docChanged && dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        },
      }),
    ];
  },
});

// Main Editor Component
export const XitEditor = () => {
  const [fileInput, setFileInput] = useState(null);
  const xitObject = toObject(initialContentXit);
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
    ],
    content: convertXitToTipTap(xitObject),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-full min-h-[300px] p-6 bg-[#11121A] border border-[#272832] rounded-lg text-gray-300",
      },
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const obj = toObject(text);
    editor.commands.setContent(convertXitToTipTap(obj));
  };

  const handleExport = () => {
    const json = editor.getJSON();
    const content = convertTipTapToXit(json);
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.xit";
    link.click();
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0c17] p-4 text-white">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <input
            type="file"
            accept=".xit"
            onChange={handleFileChange}
            className="bg-gray-900 px-3 py-2 rounded"
          />
          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Export .xit
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const initialContentXit = `# Project Phoenix - Q3 Goals

## Phase 1: Research & Development

[x] Finalize initial project proposal -> 2025-07-15 #planning #milestone
[@] Develop proof of concept #coding #urgent
[?] Investigate performance bottlenecks #investigation
[ ] !! Prepare presentation for stakeholders -> 2025-08-01 #presentation
[ ] Order new team t-shirts #team #fun
[ ] Plan team outing for the end of the quarter #team`;
