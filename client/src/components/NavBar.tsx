import { Link } from "wouter";
import { useState } from "react";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b relative">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-bold text-primary cursor-pointer">
            Stance
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                href="/clubs"
                className="text-sm font-medium hover:text-primary"
              >
                Clubs
              </Link>
            </li>
            <li>
              <Link
                href="/openmats"
                className="text-sm font-medium hover:text-primary"
              >
                Open Mats
              </Link>
            </li>
            <li>
              <Link
                href="/Auth"
                className="text-sm font-medium hover:text-primary"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg`}
        >
          <ul className="flex flex-col py-4">
            <li>
              <Link
                href="/clubs"
                className="block px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                All Clubs
              </Link>
            </li>
            <li>
              <Link
                href="/schedule"
                className="block px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
