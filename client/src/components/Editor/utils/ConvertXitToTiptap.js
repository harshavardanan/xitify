export const convertXitToTipTap = (xitObj) => {
  const content = [];

  const normalizeStatus = (status) =>
    status === "in-question" ? "inQuestion" : status;

  Object.values(xitObj.groups).forEach((group) => {
    let currentList = [];
    content.push({ type: "xitList", content: currentList });

    group.forEach((entry) => {
      if (entry.type === "title") {
        content.push({
          type: "groupTitle",
          content: [{ type: "text", text: entry.content }],
        });
        currentList = [];
        content.push({ type: "xitList", content: currentList });
      } else if (entry.type === "item") {
        currentList.push({
          type: "xitItem",
          attrs: {
            status: normalizeStatus(entry.status || "open"),
            priority: entry.modifiers?.priorityLevel || 0,
            dueDate: entry.modifiers?.due || null,
            tags: entry.modifiers?.tags?.map((tag) => tag.replace(/^#/, "")) || [],
          },
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: entry.content }],
            },
          ],
        });
      }
    });

    if (currentList.length === 0) {
      const last = content[content.length - 1];
      if (last && last.type === "xitList" && last.content === currentList) {
        content.pop();
      }
    }
  });

  return { type: "doc", content };
};
