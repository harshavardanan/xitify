import { Extension } from "@tiptap/core";
import { keymap } from "prosemirror-keymap";

export const CustomKeymapExtension = Extension.create({
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

        "Mod-ArrowDown": (state, dispatch) => {
          const { from, to } = state.selection;
          let tr = state.tr;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === "xitItem") {
              const currentPriority = node.attrs.priority || 0;
              const newPriority = Math.max(currentPriority - 1, 0);
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
        "Mod-Shift-G": (state, dispatch) => {
          const { schema, tr, selection } = state;
          const paragraph = schema.nodes.paragraph.create(
            null,
            schema.text("Group Task")
          );
          const innerList = schema.nodes.xitList.create();
          const groupItem = schema.nodes.xitItem.create(
            { status: "open", isGroup: true },
            [paragraph, innerList]
          );
          const groupList = schema.nodes.xitList.create(null, [groupItem]);

          if (dispatch) {
            const insertPos = selection.$from.before(selection.$from.depth);
            dispatch(tr.insert(insertPos, groupList));
            return true;
          }
          return false;
        },
        "Mod-Shift-1": (state, dispatch) => {
          const { schema, tr, selection } = state;
          const paragraph = schema.nodes.paragraph.create();
          const todoItem = schema.nodes.xitItem.create({ status: "open" }, [
            paragraph,
          ]);
          const todoList = schema.nodes.xitList.create(null, [todoItem]);

          if (dispatch) {
            const insertPos = selection.$from.before(selection.$from.depth);
            dispatch(tr.insert(insertPos, todoList));
            return true;
          }
          return false;
        },
        "Mod-Shift-2": (state, dispatch) => {
          const { schema, tr, selection } = state;
          let groupPos = null;

          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.type.name === "xitItem" && node.attrs.isGroup) {
              groupPos = pos;
              return false;
            }
          });

          if (groupPos === null) return false;

          const groupNode = state.doc.nodeAt(groupPos);
          if (!groupNode) return false;

          const nestedList = groupNode.lastChild;
          if (!nestedList || nestedList.type.name !== "xitList") return false;

          const paragraph = schema.nodes.paragraph.create();
          const newItemNode = schema.nodes.xitItem.create({ status: "open" }, [
            paragraph,
          ]);
          const insertPos = groupPos + 1 + groupNode.content.size - 1;

          if (dispatch) {
            dispatch(tr.insert(insertPos, newItemNode));
            return true;
          }
          return false;
        },
      }),
    ];
  },
});
