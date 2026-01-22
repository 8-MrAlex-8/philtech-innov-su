"use client";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import petdata from "../../data/petdata.json";

const PetCarePage = () => {
  return (
    <div className="h-dvh flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-[90dvw] md:w-[40dvw] max-w-lg p-8 md:p-10 rounded-3xl bg-white/80 backdrop-blur-lg shadow-2xl text-center border border-white/50 animate-fade-in relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex justify-center items-center shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Pet Care
          </h1>
        </div>

        <p className="text-base text-neutral-600 mb-10 font-medium">Choose your companion:</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center flex-wrap">
          {petdata.pets
            .filter((pet) => pet.category === "pet-care")
            .map((pet) => (
              <Link
                key={pet.id}
                href={`/pet?petId=${pet.id}`}
                className="group px-8 py-4 rounded-xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 font-semibold text-pink-700 hover:from-pink-100 hover:to-purple-100 hover:border-pink-400 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <img src={pet.image} alt={pet.name} className="w-8 h-8 rounded-full object-cover" />
                <span>{pet.name}</span>
              </Link>
            ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Roulette
        </Link>
      </div>
    </div>
  );
};

export default PetCarePage;
