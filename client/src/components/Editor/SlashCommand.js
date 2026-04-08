import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

import { Heading2, ListTodo, TextIcon, Bold, Italic, Underline, Strikethrough } from "lucide-react";

import { ReactRenderer } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { Suggestion } from "@tiptap/suggestion";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const SlashCommandList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [todoInputVisible, setTodoInputVisible] = useState(false);
  const [todoInput, setTodoInput] = useState("");

  const selectItem = (index) => {
    const item = props.items[index];
    if (item?.title === "To-Do Item") {
      setTodoInputVisible(true);
    } else {
      item.command(props);
    }
  };

  const submitTodo = () => {
    const item = props.items.find((i) => i.title === "To-Do Item");
    if (item) {
      item.command(props, todoInput);
      setTodoInputVisible(false);
      setTodoInput("");
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex(
          (selectedIndex + props.items.length - 1) % props.items.length
        );
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = props.items[selectedIndex];
        if (item.title === "To-Do Item" && !todoInputVisible) {
          setTodoInputVisible(true);
          return true;
        }
        if (item.title === "To-Do Item" && todoInputVisible) {
          submitTodo();
          return true;
        }
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="z-50 w-64 rounded-xl border border-white/10 bg-black p-1 shadow-2xl">
      {props.items.length ? (
        props.items.map((item, index) => (
          <div key={item.title}>
            <button
              className={`flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-left text-sm text-neutral-300 transition-colors ${
                index === selectedIndex ? "bg-white/10 text-white" : "hover:bg-white/5"
              }`}
              onClick={() => selectItem(index)}
            >
              <div className="rounded-md border border-white/10 bg-black/50 p-1.5 text-white">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.description}</p>
              </div>
            </button>
            {item.title === "To-Do Item" &&
              index === selectedIndex &&
              todoInputVisible && (
                <div className="px-2 pb-2">
                  <input
                    className="w-full px-2 py-1 mt-1 text-sm bg-black/50 text-white border border-white/20 rounded-md focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="Type your to-do here..."
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") {
                        e.preventDefault();
                        submitTodo();
                      }
                    }}
                    autoFocus
                  />
                </div>
              )}
          </div>
        ))
      ) : (
        <div className="p-3 text-sm text-neutral-500 text-center font-medium">No results</div>
      )}
    </div>
  );
});

const getSlashCommandItems = () => {
  return [
    {
      title: "To-Do Item",
      description: "Insert a single task item.",
      icon: ListTodo,
      command: ({ editor, range }, todoText) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "xitList",
            content: [
              {
                type: "xitItem",
                attrs: {
                  status: "open",
                  dueDate: new Date().toISOString().split("T")[0],
                },
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: todoText || "" }],
                  },
                ],
              },
            ],
          })
          .run();
      },
    },
    {
      title: "Group Task",
      description: "Insert an empty parent task group.",
      icon: Heading2,
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent([
            {
              type: "groupTitle",
              content: [{ type: "text", text: "New Group" }]
            },
            {
              type: "xitList",
              content: [
                {
                  type: "xitItem",
                  attrs: { status: "open" },
                  content: [{ type: "paragraph" }]
                }
              ]
            }
          ])
          .run();
      },
    },
    ,
    {
      title: "Text",
      description: "Start writing plain text.",
      icon: TextIcon,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
    {
      title: "Bold",
      description: "Toggle bold text.",
      icon: Bold,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBold().run();
      },
    },
    {
      title: "Italic",
      description: "Toggle italic text.",
      icon: Italic,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleItalic().run();
      },
    },
    {
      title: "Underline",
      description: "Toggle underlined text.",
      icon: Underline,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleUnderline().run();
      },
    },
    {
      title: "Strikethrough",
      description: "Toggle strike text.",
      icon: Strikethrough,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleStrike().run();
      },
    },
  ];
};

const SlashCommand = Extension.create({
  name: "slash-command",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range }, props.text);
        },
        items: ({ query }) => {
          return getSlashCommandItems().filter((item) =>
            item.title.toLowerCase().startsWith(query.toLowerCase())
          );
        },
        render: () => {
          let component;
          let popup;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props) {
              component.updateProps(props);
              if (!props.clientRect) return;
              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }
              return component.ref?.onKeyDown(props);
            },
            onExit() {
              if (popup?.[0]) popup[0].destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});

export default SlashCommand;
