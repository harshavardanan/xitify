// nodes/GroupTitleNode.jsx
import { Node } from "@tiptap/core";

const GroupTitleNode = Node.create({
  name: "groupTitle",
  group: "block",
  content: "inline*",
  defining: true,
  parseHTML: () => [{ tag: "h3" }],
  renderHTML: () => ["h3", { class: "text-white font-bold text-xl tracking-tight mt-6 mb-2 border-b border-white/10 pb-1" }, 0],
});

export default GroupTitleNode;
