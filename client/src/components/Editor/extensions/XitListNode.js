import { Node } from "@tiptap/core";

export const XitListNode = Node.create({
  name: "xitList",
  group: "block",
  content: "xitItem*",
  parseHTML: () => [{ tag: "ul" }],
  renderHTML: () => ["ul", { class: "ml-4 list-none" }, 0],
});
