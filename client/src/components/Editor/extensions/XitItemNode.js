import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { XitItemComponent } from "./XitItemComponent";

export const XitItemNode = Node.create({
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
