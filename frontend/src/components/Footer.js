// src/components/Footer.js

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">

      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            Store 
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Discover premium fashion, groceries, and lifestyle products
            with a seamless online shopping experience.
          </p>

          <div className="flex gap-4 mt-6">

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-pink-500 transition flex items-center justify-center"
            >
              🌐
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-pink-500 transition flex items-center justify-center"
            >
              📘
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-pink-500 transition flex items-center justify-center"
            >
              📸
            </a>

          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Quick Links
          </h3>

          <ul className="mt-5 space-y-3 text-sm">

            <li>
              <Link
                to="/"
                className="hover:text-pink-400 transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/grocery"
                className="hover:text-pink-400 transition"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/cart"
                className="hover:text-pink-400 transition"
              >
                Cart
              </Link>
            </li>

            <li>
              <Link
                to="/admin"
                className="hover:text-pink-400 transition"
              >
                Admin
              </Link>
            </li>

          </ul>
        </div>

        {/* CUSTOMER */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Customer Support
          </h3>

          <ul className="mt-5 space-y-3 text-sm">

            <li className="hover:text-pink-400 transition cursor-pointer">
              Help Center
            </li>

            <li className="hover:text-pink-400 transition cursor-pointer">
              Shipping Info
            </li>

            <li className="hover:text-pink-400 transition cursor-pointer">
              Returns & Refunds
            </li>

            <li className="hover:text-pink-400 transition cursor-pointer">
              Privacy Policy
            </li>

          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-bold text-white">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-sm text-slate-400">

            <p>
              📍 Chennai, Tamil Nadu
            </p>

            <p>
              📞 +91 9025192097
            </p>

            <p>
              ✉ anismuhammad280@gmail.com
            </p>

          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">

          <p>
            © {new Date().getFullYear()} Smart Store. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <span className="hover:text-pink-400 transition cursor-pointer">
              Terms
            </span>

            <span className="hover:text-pink-400 transition cursor-pointer">
              Privacy
            </span>

            <span className="hover:text-pink-400 transition cursor-pointer">
              Cookies
            </span>

          </div>

        </div>

      </div>

    </footer>
  );
}