"use client";

import { useState } from "react";
// Changed ArrowUp to Store
import { Store, MessageCircle } from "lucide-react";

export default function GameInterface() {
  const [imageUrl, setImageUrl] = useState("https://res.cloudinary.com/dvhbrcmzw/image/upload/v1769071063/Untitled_design_1_yd5hz0.png");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      {/* --- TOP HUD --- */}
      <div className="flex justify-between items-start w-full max-w-md mx-auto z-10 mb-8">
        {/* Left Widget: Level & XP */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-2 border-black bg-white rounded-md flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              1
            </div>
            <div className="flex items-center gap-1">
              <div className="w-24 h-6 border-2 border-black bg-white rounded-md overflow-hidden relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="h-full bg-black w-[40%]"></div>
              </div>
              <span className="font-bold text-sm tracking-tighter">XP</span>
            </div>
          </div>
        </div>

        {/* Right Widget: Currency */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-black bg-white rounded-md flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            C
          </div>
          <div className="w-24 h-8 border-2 border-black bg-white rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>
      </div>

      {/* --- MAIN GAME AREA --- */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto relative z-10">
        
        {/* UPDATED: Shop Icon (Top Left floating) */}
        <button className="absolute left-4 top-0 hover:-translate-y-1 transition-transform group">
            {/* Added a white background circle so the shop icon pops more */}
            <div className="bg-white p-2 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-active:translate-y-1 group-active:shadow-none transition-all">
                <Store className="w-10 h-10 stroke-[2px] text-black" />
            </div>
        </button>

        {/* Character Interaction Area */}
        <div className="relative mt-10">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="relative">
              <MessageCircle className="w-24 h-24 text-black fill-white stroke-[1.5px] rotate-[-10deg]" />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="w-64 h-48 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Game Character"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Alert Icon */}
        <button className="absolute right-0 top-1/3 hover:scale-110 transition-transform">
          <div className="w-16 h-16 rounded-full border-[3px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-bold text-5xl font-mono">!</span>
          </div>
        </button>

      </div>
    </div>
  );
}