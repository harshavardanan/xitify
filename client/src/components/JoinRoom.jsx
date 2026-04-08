import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AnimatedSvg from "./ui/animated-collab-svg";

const JoinRoom = () => {
  const { user } = useAuth();
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  // Derive username from Firebase user
  const username =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "user";

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/collab/${newRoomId}/${username}`);
  };

  const handleJoinRoom = () => {
    if (!room.trim()) {
      toast.error("Please enter a Room ID");
      return;
    }
    navigate(`/collab/${room.trim()}/${username}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Ambient minimal glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-5"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)",
          filter: "blur(80px)",
        }}
      />
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />

      <div className="relative glass-card p-8 shadow-2xl w-full max-w-md text-white space-y-6 animate-fade-up">
        {/* Using the original AnimatedSvg as requested */}
        <AnimatedSvg />
        
        <div className="text-center mb-2">
          <p className="text-xs text-neutral-500">
            Editing as <span className="text-white font-medium">{username}</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="w-full bg-white hover:bg-neutral-200 text-black transition px-4 py-3 rounded-lg text-sm font-semibold"
          >
            Create a New Room
          </button>

          <div className="border-t border-white/10 pt-5">
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Room ID
            </label>
            <input
              type="text"
              placeholder="Enter Room ID"
              className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all font-mono text-sm"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
            />

            <button
              onClick={handleJoinRoom}
              className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white transition mt-4 px-4 py-3 rounded-lg text-sm font-semibold"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
