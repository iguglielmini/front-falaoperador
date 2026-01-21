"use client";
import React from "react";

export function SaibaMaisButton() {
  return (
    <button
      onClick={() => {
        const section = document.getElementById("sobre-nos");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className="mx-auto flex items-center gap-2 px-6 py-3 bg-tactical-green text-navy-dark font-orbitron font-bold rounded-full shadow-lg hover:scale-105 hover:bg-tactical-green/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand/60 animate-bounce"
      style={{ animationDelay: "0.6s" }}
      aria-label="Deslizar para Sobre Nós"
    >
      <span>Saiba mais</span>
      <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}