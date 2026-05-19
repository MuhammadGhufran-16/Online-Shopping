import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../images/Am Logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-10 sm:w-16 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 bg-clip-text text-transparent">
                AM Shopping
              </h1>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-6 font-medium text-slate-700">

            <li>
              <Link
                to="/"
                className="hover:text-pink-500 transition duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/grocery"
                className="hover:text-pink-500 transition duration-300"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/search"
                className="hover:text-pink-500 transition duration-300"
              >
                Search
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="hover:text-pink-500 transition duration-300"
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                to="/admin"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md hover:scale-105 transition duration-300"
              >
                Admin
              </Link>
            </li>

          </ul>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden mt-4 border-t border-slate-200 pt-4">

            <ul className="flex flex-col gap-3 font-medium text-slate-700">

              <li>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/grocery"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/search"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition"
                >
                  Search
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-500 transition"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md"
                >
                  Admin Panel
                </Link>
              </li>

            </ul>

          </div>
        )}

      </nav>
    </header>
  );
}