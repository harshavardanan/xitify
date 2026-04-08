import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { Placeholder } from "@tiptap/extension-placeholder";

const getRandomColor = () => {
  const colors = [
    "#f43f5e",
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const Editor = ({
  editorData,
  setEditorData,
  username = "Guest",
  userId,
  remoteCursors = [],
  typingUsers = {},
  sendCursorPosition,
  onUserTyping,
}) => {
  const [fileName, setFileName] = useState("");
  const lastReceivedContent = useRef(null);
  const userColor = useRef(getRandomColor()).current;
  const cursorUpdateTimeout = useRef(null);
  const editorContainerRef = useRef(null);
  const [cursorPositions, setCursorPositions] = useState([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Placeholder.configure({
        placeholder: "Type '/' to show options, or start typing your notes...",
      }),
      XitItemNode,
      XitListNode,
      GroupTitleNode,
      CustomKeymapExtension,
      SlashCommand,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-full focus:outline-none text-gray-300 relative",
      },
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain");
        if (text?.match(/^\[.*\]/gm)) {
          try {
            event.preventDefault();
            const parsed = toObject(text);
            const json = convertXitToTipTap(parsed);
            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodeFromJSON(json)
              )
            );
            return true;
          } catch (e) {
            console.error("XIT Paste Error:", e);
          }
        }
        return false;
      },
    },
    onUpdate: debounce(({ editor }) => {
      if (onUserTyping) {
        onUserTyping();
      }

      if (!setEditorData) return;
      const json = editor.getJSON();
      const jsonString = JSON.stringify(json);

      if (jsonString !== lastReceivedContent.current) {
        setEditorData(jsonString);
      }
    }, 300),

    onSelectionUpdate: ({ editor }) => {
      if (cursorUpdateTimeout.current) {
        clearTimeout(cursorUpdateTimeout.current);
      }

      cursorUpdateTimeout.current = setTimeout(() => {
        if (sendCursorPosition && userId) {
          const { anchor, head } = editor.state.selection;
          sendCursorPosition({
            id: userId,
            name: username,
            color: userColor,
            anchor,
            head,
          });
        }
      }, 150);
    },
  });

  const calculateCursorPositions = useCallback(() => {
    if (!editor || !remoteCursors.length || !editorContainerRef.current) {
      setCursorPositions([]);
      return;
    }

    try {
      const editorView = editor.view;
      const containerRect = editorContainerRef.current.getBoundingClientRect();

      const positions = remoteCursors
        .map((cursor) => {
          try {
            // Don't render a cursor for the current user
            if (cursor.id === userId || typeof cursor.anchor !== "number") {
              return null;
            }

            const docSize = editorView.state.doc.content.size;
            const validAnchor = Math.max(0, Math.min(cursor.anchor, docSize));
            const coords = editorView.coordsAtPos(validAnchor);

            if (!coords) return null;

            return {
              id: cursor.id,
              name: cursor.name || "User",
              color: cursor.color || "#f43f5e",
              x: coords.left - containerRect.left,
              y: coords.top - containerRect.top,
              height: Math.max(coords.bottom - coords.top, 18),
            };
          } catch {
            return null; 
          }
        })
        .filter(Boolean); 

      setCursorPositions(positions);
    } catch {
      // If the whole calculation fails, clear positions
      setCursorPositions([]);
    }
  }, [editor, remoteCursors, userId]);

  // Recalculate cursors when remote cursors change or the editor content changes
  useEffect(() => {
    if (!editor) return;

    const recalculate = () => {
      setTimeout(() => calculateCursorPositions(), 50);
    };

    editor.on("transaction", recalculate);
    recalculate();

    return () => {
      editor.off("transaction", recalculate);
    };
  }, [editor, remoteCursors, calculateCursorPositions]);

  useEffect(() => {
    if (!editor || !editorData) return;

    try {
      if (editorData !== lastReceivedContent.current) {
        lastReceivedContent.current = editorData;
        const parsed = JSON.parse(editorData);
        editor.commands.setContent(parsed, false);
      }
    } catch (err) {
      console.error("Failed to sync content:", err);
    }
  }, [editorData, editor]);

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

  useEffect(() => {
    return () => {
      if (cursorUpdateTimeout.current) {
        clearTimeout(cursorUpdateTimeout.current);
      }
    };
  }, []);

  if (!editor) return null;

  return (
    <div className="h-screen bg-[#0b0c17] flex flex-col text-white p-6 font-sans">
      <style>
        {`
          .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #6B7280;
            pointer-events: none;
            height: 0;
          }
        `}
      </style>
      <div className="w-full h-full bg-[#11121A] border border-[#272832] rounded-lg overflow-hidden flex flex-col shadow-lg">
        <div className="p-4 border-b border-[#272832] flex justify-end">
          <div className="flex items-center">
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="file name"
              autoComplete="off"
              className="min-h-[50px] max-w-[150px] px-4 text-white text-sm border border-[#5e4dcd] rounded-l-md bg-transparent focus:outline-none focus:border-[#3898EC]"
            />
            <button
              onClick={handleExport}
              type="submit"
              className="min-h-[50px] px-4 py-2 border-none rounded-r-md bg-[#5e4dcd] text-white text-sm cursor-pointer hover:bg-[#5e5dcd] transition-colors duration-300 ease-in-out"
            >
              Download
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative" ref={editorContainerRef}>
          <EditorContent editor={editor} className="p-6 relative" />
          <div className="absolute inset-0 pointer-events-none z-10">
            {cursorPositions.map((cursor) => {
              const isTypingRemote = typingUsers[cursor.id] !== undefined;

              return (
                <div
                  key={cursor.id}
                  className="absolute transition-all duration-100 ease-linear"
                  style={{
                    left: `${cursor.x}px`,
                    top: `${cursor.y}px`,
                  }}
                >
                  <div
                    className="collab-cursor"
                    style={{
                      width: "2px",
                      height: `${cursor.height}px`,
                      backgroundColor: cursor.color,
                    }}
                  />
                  <div
                    className="absolute -top-6 whitespace-nowrap rounded px-2 py-1 text-xs font-semibold text-white"
                    style={{
                      left: "0px",
                      backgroundColor: cursor.color,
                    }}
                  >
                    {cursor.name}
                    {isTypingRemote && (
                      <span className="italic"> is typing...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
