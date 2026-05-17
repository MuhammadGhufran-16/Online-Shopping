import { Link } from "react-router-dom";
import logo from "../images/Am Logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
          />

          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 bg-clip-text text-transparent">
              AM Shopping
            </h1>

            {/* <p className="text-xs text-slate-500 tracking-wide">
              Smart Grocery Store
            </p> */}
          </div>
        </Link>

        {/* MENU */}
        <ul className="flex items-center gap-6 font-medium text-slate-700">

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

      </nav>
    </header>
  );
}