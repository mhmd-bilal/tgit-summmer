"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Bell, Settings } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/scoreboard', label: 'Scoreboard' },
    { href: '/games', label: 'Games' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/teams', label: 'Teams' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-marker text-deep-purple tracking-tight">
              TGIT Summer 26'
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-semibold font-inter transition-colors ${isActive
                    ? 'text-deep-purple'
                    : 'text-ink-light hover:text-ink'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-deep-purple rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-ink-light hover:text-ink" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-ink-light hover:text-ink" aria-label="Settings">
              <Settings size={18} />
            </button>
            <div className="avatar-circle avatar-circle-sm ml-1 cursor-pointer hover-pop">
              <span>U</span>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white/95 backdrop-blur-md border-b border-border px-4 pb-4"
        >
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold font-inter transition-all ${isActive
                  ? 'bg-lavender-light text-deep-purple'
                  : 'text-ink-light hover:bg-muted hover:text-ink'
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-3 px-4 pt-3 border-t border-border mt-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-ink-light" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-ink-light" aria-label="Settings">
              <Settings size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
