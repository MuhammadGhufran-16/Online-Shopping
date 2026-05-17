// src/pages/Search.js

import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [touched, setTouched] = useState(false);

  const searchNow = () => {
    setTouched(true);

    let data = JSON.parse(localStorage.getItem("products")) || [];

    data = data.map((p, index) => ({
      ...p,
      id: p.id || `prod_${index}`,
      price: Number(p.price || 0),
    }));

    const term = keyword.trim().toLowerCase();

    const match = term
      ? data.filter((p) =>
          p.name.toLowerCase().includes(term)
        )
      : [];

    setResults(match);
  };

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const normalized = {
        ...product,
        id: product.id,
        price: Number(product.price || 0),
      };

      const existing = cart.find(
        (item) => item.id === normalized.id
      );

      if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
      } else {
        cart.push({ ...normalized, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      window.dispatchEvent(
        new CustomEvent("cart_updated", {
          detail: cart,
        })
      );

      alert("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 py-20 px-6 text-white shadow-2xl">

        {/* Blur circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Search Products 🔍
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Find your favorite grocery products instantly with smart search.
          </p>

          {/* SEARCH BOX */}
          <div className="mt-10 max-w-3xl mx-auto">

            <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl">

              <input
                className="flex-1 rounded-2xl px-5 py-4 bg-white text-slate-800 text-lg outline-none border-2 border-transparent focus:border-pink-400"
                placeholder="Search grocery items..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchNow();
                }}
              />

              <button
                onClick={searchNow}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:scale-105 transition duration-300"
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* RESULTS */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* RESULTS HEADER */}
        {results.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4 mb-10">

            <div>
              <h2 className="text-4xl font-extrabold text-slate-800">
                Search Results
              </h2>

              <p className="mt-2 text-slate-500">
                Showing products matching "{keyword}"
              </p>
            </div>

            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold shadow-lg">
              {results.length} Products Found
            </div>

          </div>
        )}

        {/* NO RESULTS */}
        {touched &&
          results.length === 0 &&
          keyword.trim() !== "" && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 py-20 text-center">

              <div className="text-7xl mb-6">
                😔
              </div>

              <h3 className="text-3xl font-bold text-slate-800">
                No Products Found
              </h3>

              <p className="mt-3 text-slate-500">
                Try searching with another keyword.
              </p>

            </div>
          )}

        {/* PRODUCTS GRID */}
        {results.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {results.map((p) => (
              <div
                key={p.id}
                className="transform transition duration-300 hover:-translate-y-3"
              >
                <ProductCard
                  product={p}
                  addToCart={addToCart}
                />
              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}