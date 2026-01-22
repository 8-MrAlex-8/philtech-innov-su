"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sparkles } from "lucide-react";

import Link from "next/link";

const themes = [
  {
    id: 0,
    title: "Pet Care",
    description:
      "Nurture a loyal, trustworthy companion at the same time you nurture yourself.",
  },
  {
    id: 1,
    title: "Dungeon Master",
    description:
      "Complete quests, level up skills, and master your day like a true adventurer.",
  },
  {
    id: 2,
    title: "Delightful Garden",
    description:
      "Tend tasks, grow habits, and watch your life bloom beautifully.",
  },
];

export default function ThemeRoulette() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + themes.length) % themes.length);
  const next = () => setIndex((i) => (i + 1) % themes.length);

  const theme = themes[index];

  return (
    <div className="h-dvh flex items-center justify-center bg-neutral-100">
      <div className="w-[85dvw] md:w-[30dvw] p-8 rounded-2xl bg-white shadow-lg text-center">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <div className="h-8 w-8 rounded-full bg-[#84a29f] flex justify-center items-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span>Pick a theme</span>
        </div>

        {/* Image Placeholder */}
        <div className="mx-auto mb-6 h-48 w-48 rounded-xl bg-neutral-200 flex items-center justify-center">
          <span className="text-neutral-400 text-xs">Graphic Placeholder</span>
        </div>

        {/* Tagline */}
        <p className="text-sm italic text-neutral-500 mb-6">
          Embark on a path to a better you.
        </p>

        {/* Roulette */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prev}
            className="p-2 rounded-full hover:bg-neutral-100 transition hover:cursor-pointer"
          >
            <ChevronLeft />
          </button>

          <h2 className="text-lg font-semibold">{theme.title}</h2>

          <button
            onClick={next}
            className="p-2 rounded-full hover:bg-neutral-100 transition hover:cursor-pointer"
          >
            <ChevronRight />
          </button>
        </div>

        <p className="text-sm text-neutral-600 mb-8 px-4">
          {theme.description}
        </p>

        {/* CTA */}
        <Link
          href={
            theme.id === 0
              ? "/pet-care"
              : theme.id === 1
                ? "/dungeon-master"
                : "/delightful-garden"
          }
          className="block w-full rounded-full border border-neutral-800 py-3 text-sm font-semibold tracking-wide hover:bg-neutral-900 hover:text-white transition"
        >
          BEGIN JOURNEY
        </Link>
      </div>
    </div>
  );
}
