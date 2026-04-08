export const convertTipTapToXit = (docJSON) => {
  const lines = [];

  const statusMap = {
    open: "[ ]",
    checked: "[x]",
    ongoing: "[@]",
    obsolete: "[~]",
    inQuestion: "[?]",
  };

  const serializeNode = (node) => {
    if (!node) return;

    switch (node.type) {
      case "groupTitle": {
        const textContent =
          node.content
            ?.filter((c) => c.type === "text" && c.text)
            .map((c) => c.text)
            .join("") || "";
        if (lines.length > 0) lines.push("");

        lines.push(textContent);
        break;
      }

      case "xitItem": {
        const normalizedStatus =
          node.attrs?.status === "inQuestion"
            ? "inQuestion"
            : node.attrs?.status || "open";

        const status = statusMap[normalizedStatus] || "[ ]";
        const priorityLevel = node.attrs?.priority || 0;
        const priority = priorityLevel > 0 ? "!".repeat(priorityLevel) + " " : "";
        const due = node.attrs?.dueDate ? ` -> ${node.attrs.dueDate}` : "";

        const tagsArray =
          Array.isArray(node.attrs?.tags) && node.attrs.tags.length > 0
            ? node.attrs.tags
            : [];
        const tags = tagsArray.length > 0 ? ` #${tagsArray.join(" #")}` : "";

        const paragraph = node.content?.find((c) => c.type === "paragraph");
        const text =
          paragraph?.content
            ?.filter((c) => c.type === "text" && typeof c.text === "string")
            .map((c) => c.text)
            .join("") || "";

        lines.push(`${status} ${priority}${text}${due}${tags}`);
        break;
      }

      case "xitList": {
        node.content?.forEach((child) => serializeNode(child));
        break;
      }

      case "paragraph": {
        const text =
          node.content
            ?.filter((c) => c.type === "text" && typeof c.text === "string")
            .map((c) => c.text)
            .join("") || "";

        if (text.trim()) {
          lines.push(text);
        }
        break;
      }

      default:
        break;
    }
  };
  docJSON?.content?.forEach((node) => serializeNode(node));

  return lines.join("\n").trim();
};
