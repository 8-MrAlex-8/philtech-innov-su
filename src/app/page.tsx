"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Heart, Sword, Flower2 } from "lucide-react";
import Link from "next/link";

const themes = [
  {
    id: 0,
    title: "Pet Care",
    description:
      "Nurture a loyal, trustworthy companion at the same time you nurture yourself.",
    icon: Heart,
    gradient: "from-pink-100 via-purple-100 to-blue-100",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    id: 1,
    title: "Dungeon Master",
    description:
      "Complete quests, level up skills, and master your day like a true adventurer.",
    icon: Sword,
    gradient: "from-amber-100 via-orange-100 to-red-100",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: 2,
    title: "Delightful Garden",
    description:
      "Tend tasks, grow habits, and watch your life bloom beautifully.",
    icon: Flower2,
    gradient: "from-green-100 via-emerald-100 to-teal-100",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export default function ThemeRoulette() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const prev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex((i) => (i - 1 + themes.length) % themes.length);
      setIsTransitioning(false);
    }, 150);
  };

  const next = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % themes.length);
      setIsTransitioning(false);
    }, 150);
  };

  const theme = themes[index];
  const Icon = theme.icon;

  return (
    <div className="h-dvh flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-[90dvw] md:w-[35dvw] max-w-md p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl text-center border border-white/50 animate-fade-in relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-8">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#84a29f] to-[#6b8a87] flex justify-center items-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-medium">Pick a theme</span>
        </div>

        {/* Icon Display */}
        <div className={`mx-auto mb-8 h-32 w-32 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg transition-all duration-300 ${isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          <Icon className={`h-16 w-16 ${theme.color} transition-all duration-300`} />
        </div>

        {/* Tagline */}
        <p className="text-sm italic text-neutral-500 mb-8 font-medium">
          Embark on a path to a better you.
        </p>

        {/* Roulette */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prev}
            className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md group"
            aria-label="Previous theme"
          >
            <ChevronLeft className="h-5 w-5 text-neutral-600 group-hover:text-neutral-900" />
          </button>

          <h2 className={`text-2xl font-bold ${theme.color} transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            {theme.title}
          </h2>

          <button
            onClick={next}
            className="p-3 rounded-full hover:bg-neutral-100 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md group"
            aria-label="Next theme"
          >
            <ChevronRight className="h-5 w-5 text-neutral-600 group-hover:text-neutral-900" />
          </button>
        </div>

        <p className={`text-sm text-neutral-600 mb-10 px-4 leading-relaxed transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          {theme.description}
        </p>

        {/* Theme indicators */}
        <div className="flex gap-2 justify-center mb-8">
          {themes.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-[#84a29f]' : 'w-2 bg-neutral-300'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <Link
          href={
            theme.id === 0
              ? "/pet-care"
              : theme.id === 1
                ? "/dungeon-master"
                : "/delightful-garden"
          }
          className={`block w-full rounded-full bg-gradient-to-r from-[#84a29f] to-[#6b8a87] py-4 text-sm font-semibold tracking-wide text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${theme.bgColor}`}
        >
          BEGIN JOURNEY
        </Link>
      </div>
    </div>
  );
}
