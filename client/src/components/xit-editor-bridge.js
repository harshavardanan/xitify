import { toObject } from "./Editor/utils/xit-parse";

export function xitToTipTapDoc(xitRaw) {
  const xitObj = toObject(xitRaw);
  const doc = {
    type: "doc",
    content: [],
  };

  Object.values(xitObj.groups).forEach((group) => {
    group.forEach((entry) => {
      if (entry.type === "title") {
        doc.content.push({
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: entry.content }],
        });
      } else if (entry.type === "item") {
        const text = `[${entry.status?.[0] || " "}] ${entry.content}`;
        doc.content.push({
          type: "paragraph",
          content: [{ type: "text", text }],
        });
      } else if (entry.type === "details") {
        doc.content.push({
          type: "paragraph",
          content: [{ type: "text", text: `    ${entry.content}` }],
        });
      }
    });
    doc.content.push({ type: "paragraph" }); // spacing
  });

  return doc;
}

export function tipTapDocToXit(doc) {
  const raw = doc.content
    .map((node) => node?.content?.[0]?.text || "")
    .join("\n");
  return toObject(raw);
