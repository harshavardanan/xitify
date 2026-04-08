import React, { useState, useEffect, useRef } from "react";
import { Editor } from "./CollabEditor";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { IconArrowLeft, IconClipboardCopy } from "@tabler/icons-react";
import { cn } from "./lib/utils";
import debounce from "lodash.debounce";
import CopyRoomKeyButton from "./CopyRoomKey";

const SocketConfig = () => {
  const { roomName, username } = useParams();
  const [socket, setSocket] = useState(null);
  const [remoteEditorJSON, setRemoteEditorJSON] = useState(null);
  const [users, setUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // {socketId: username}
  const navigate = useNavigate();
  const ENDPOINT = process.env.REACT_APP_ENDPOINT;
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const copyToClipboard = () => {
    if (roomName) {
      navigator.clipboard
        .writeText(roomName)
        .then(() => toast.success("Room key copied to clipboard."))
        .catch(() => toast.error("Failed to copy room key."));
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit("leave-room", { name: username, room: roomName });
      toast.error("You have left the room.");
      socket.disconnect();
      navigate("/collab");
    }
  };

  // Send local cursor position to server
  const sendCursorPosition = (cursor) => {
    if (socket && cursor && roomName) {
      socket.emit("cursor-position", { room: roomName, cursor });
    }
  };

  // Typing indicator emit with debounce
  const emitTyping = debounce(() => {
    if (!socket || !roomName) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { room: roomName, user: { name: username } });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stop-typing", { room: roomName, user: { name: username } });
    }, 1500);
  }, 200);

  useEffect(() => {
    if (!username || !roomName) {
      toast.error("Invalid room or user information.");
      navigate("/");
      return;
    }

    const newSocket = io(ENDPOINT, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      newSocket.emit("join-room", { name: username, room: roomName });
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      toast.error("Connection lost. Attempting to reconnect...");
    });

    newSocket.on("reconnect", () => {
      toast.success("Reconnected to server!");
      newSocket.emit("join-room", { name: username, room: roomName });
    });

    newSocket.on("user-joined", ({ user }) => {
      toast.success(`${user} has joined the room.`);
    });

    newSocket.on("user-left", ({ user }) => {
      toast.error(`${user} has left the room.`);
      // Remove remote cursor & typing for user who left
      setRemoteCursors((prev) => prev.filter((c) => c.id !== user));
      setTypingUsers((prev) => {
        const newTyping = { ...prev };
        for (const key in newTyping) {
          if (newTyping[key] === user) delete newTyping[key];
        }
        return newTyping;
      });
    });

    newSocket.on("editor-state", (json) => {
      setRemoteEditorJSON(json);
    });

    newSocket.on("editing", (json) => {
      setRemoteEditorJSON(json);
    });

    newSocket.on("room-data", ({ users }) => {
      setUsers(users);
    });

    newSocket.on("cursor-update", ({ id, cursor, name, color }) => {
      setRemoteCursors((prev) => {
        const others = prev.filter((c) => c.id !== id);
        if (
          cursor &&
          typeof cursor.anchor === "number" &&
          typeof cursor.head === "number"
        ) {
          const newCursor = {
            id,
            name,
            color,
            anchor: cursor.anchor,
            head: cursor.head,
          };
          return [...others, newCursor];
        }
        return others;
      });
    });

    newSocket.on("user-typing", ({ id, user }) => {
      setTypingUsers((prev) => ({ ...prev, [id]: user.name }));
    });

    newSocket.on("user-stop-typing", ({ id }) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Failed to connect to server");
    });

    return () => {
      if (newSocket) {
        newSocket.emit("leave-room", { name: username, room: roomName });
        newSocket.disconnect();
      }
    };
  }, [username, roomName, navigate, ENDPOINT]);

  const sendChanges = (json) => {
    if (socket && json) {
      socket.emit("editing", { room: roomName, data: json });
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full h-screen overflow-hidden bg-gray-900 text-white",
        "border border-neutral-700"
      )}
    >
      <Sidebar open={true} setOpen={() => {}}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="mt-8 flex flex-col gap-2">
              <div className="mt-8 flex flex-col gap-2 px-2">
                <CopyRoomKeyButton roomName={roomName} />

                <button
                  onClick={handleLeaveRoom}
                  className="flex items-center gap-2 px-3 py-2 text-white bg-red-700 rounded hover:bg-red-600 transition-colors mt-2"
                  type="button"
                >
                  <IconArrowLeft className="h-5 w-5" />
                  Leave Room
                </button>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Users in Room: ({users.length})
              </h3>
              <ul className="space-y-1">
                {users.map((u, i) => (
                  <li
                    key={i}
                    className="text-sm text-white bg-gray-800 rounded px-2 py-1"
                  >
                    {u.name}
                    {u.name === username && " (You)"}
                  </li>
                ))}
              </ul>
              {/* Typing users display */}
              <div className="mt-3 text-xs text-green-400">
                {Object.values(typingUsers).length === 0 ? (
                  <span className="italic text-gray-400">No one is typing</span>
                ) : (
                  Object.values(typingUsers).map((name, i) => (
                    <span key={`typing-${name}-${i}`} className="mr-2 italic">
                      {name === username
                        ? "You are typing..."
                        : `${name} is typing...`}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <div>Socket ID: {socket?.id || "Not connected"}</div>
              <div>Remote Cursors: {remoteCursors.length}</div>
              <div>
                Connection: {socket?.connected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="w-full h-full flex-1 p-2 md:p-4 overflow-none">
        <Editor
          editorData={remoteEditorJSON}
          setEditorData={sendChanges}
          username={username}
          userId={socket ? socket.id : undefined}
          remoteCursors={remoteCursors}
          typingUsers={typingUsers}
          sendCursorPosition={sendCursorPosition}
          onUserTyping={emitTyping} // Pass typing emitter to editor
        />
      </div>
    </div>
  );
};

export default SocketConfig;
