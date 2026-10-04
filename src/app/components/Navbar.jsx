"use client";

import Link from "next/link";
import Image from "next/image";
import { montserrat } from "../fonts";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full">
      {/* Navbar glass */}
      <div className="border-b border-white/[0.06] bg-[#0D0D0D]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* BRAND */}
          <Link
            href="/"
            className="group flex items-center gap-3 select-none"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-white/[0.04] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

              <Image
                src="/lucrum.png"
                alt="Lucratus"
                width={34}
                height={34}
                priority
                className="relative rounded-full"
              />
            </div>

            <span
              className={`${montserrat.className} text-xl font-bold tracking-[-0.03em] text-white md:text-2xl`}
            >
              Lucratus
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#how-we-work"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              How We Work
            </Link>

            <Link
              href="#results"
              className="text-sm text-gray-500 transition-colors hover:text-white"
            >
              Results
            </Link>

            <Link
              href="/growth-audit"
              className="rounded-full border border-white/[0.08] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/[0.18] hover:bg-white hover:text-black"
            >
              Free Growth Audit
            </Link>
          </div>

          {/* MOBILE */}
          <button
            type="button"
            className="rounded-full border border-white/[0.08] bg-white/[0.04] p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/[0.08] md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden border-b border-white/[0.06] bg-[#0D0D0D]/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-5">
          <Link
            href="#how-we-work"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            How We Work
          </Link>

          <Link
            href="#results"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            Results
          </Link>

          <Link
            href="/growth-audit"
            onClick={() => setMenuOpen(false)}
            className="mt-3 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-gray-200"
          >
            Get Your Free Growth Audit
          </Link>
        </div>
      </div>
    </nav>
  );
}