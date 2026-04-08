import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Calendar, Tags } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const statusMap = {
  open:       <span className="text-neutral-400">[&nbsp;]</span>,
  checked:    <span className="text-emerald-500">[x]</span>,
  ongoing:    <span className="text-amber-400 font-bold">[@]</span>,
  obsolete:   <span className="text-neutral-500 line-through">[~]</span>,
  inQuestion: <span className="text-sky-400">[?]</span>,
};

const normalizeDate = (dateString) => {
  if (!dateString) return null;
  if (/^\d{4}-Q[1-4]$/.test(dateString)) {
    const quarter = parseInt(dateString[6], 10);
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

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const XitItemComponent = ({ node, updateAttributes }) => {
  const { status, priority, dueDate, tags } = node.attrs;
  const statusCycle = ["open", "ongoing", "checked", "inQuestion", "obsolete"];

  const onStatusChange = () => {
    const next =
      statusCycle[(statusCycle.indexOf(status) + 1) % statusCycle.length];
    updateAttributes({ status: next });
  };

  const handleTagsChange = (e) =>
    updateAttributes({ tags: e.target.value.split(",").map((t) => t.trim()) });
  const safeDateString =
    normalizeDate(dueDate) || new Date().toISOString().split("T")[0];
  const displayDate = isValidDate(safeDateString)
    ? new Date(safeDateString)
    : null;
  const tagsArray = Array.isArray(tags) ? tags : [];

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
            className="font-mono text-white font-black select-none pt-0.5"
            contentEditable={false}
          >
            {"!".repeat(priority)}
          </div>
        )}
        <NodeViewContent
          className={`w-full outline-none bg-transparent transition-colors ${
            status === "open" ? "text-neutral-100" :
            status === "checked" ? "text-emerald-500/70 line-through" :
            status === "ongoing" ? "text-amber-100" :
            status === "obsolete" ? "text-neutral-600 line-through" :
            status === "inQuestion" ? "text-sky-100" :
            "text-white"
          }`}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 text-xs text-neutral-500 pl-6">
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <Calendar size={12} />
          <DatePicker
            className="bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-white focus:outline-none text-neutral-300 placeholder-neutral-600 w-[120px] transition-colors"
            selected={displayDate}
            onChange={(date) =>
              updateAttributes({
                dueDate: date.toISOString().split("T")[0],
              })
            }
            placeholderText="YYYY-MM-DD"
            minDate={new Date()}
          />
        </div>
        <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <Tags size={12} />
          <input
            className="bg-transparent border-b border-transparent hover:border-neutral-700 focus:border-white focus:outline-none text-neutral-300 placeholder-neutral-600 w-[160px] transition-colors"
            value={tagsArray.join(", ")}
            onChange={handleTagsChange}
            placeholder="comma,separated,tags"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};
