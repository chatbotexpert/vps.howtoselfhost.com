'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Terminal, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: '/', label: 'VPS' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/support', label: 'Support' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-divider bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <span className="font-mono text-base font-bold text-foreground">
              howtoselfhost<span className="text-accent">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-1 py-1 mx-3 text-sm font-semibold transition-colors duration-200 group',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground'
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute left-0 -bottom-[3px] h-[2px] rounded-full transition-all duration-300",
                  pathname === link.href ? "w-full bg-accent" : "w-0 bg-accent/50 group-hover:w-full"
                )} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                href="/pricing"
                className="bg-accent hover:opacity-90 text-white dark:text-background text-xs font-mono font-bold uppercase px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-accent/20"
              >
                Sign Up
              </Link>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-divider bg-background">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium transition-all duration-200 border-l-2',
                  pathname === link.href
                    ? 'border-accent text-foreground bg-accent/5'
                    : 'border-transparent text-muted hover:text-foreground hover:bg-surface'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <span className="text-divider select-none">|</span>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-accent hover:opacity-80 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
