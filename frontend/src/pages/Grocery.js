// src/pages/Grocery.js

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Grocery() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored.filter((product) => product.category === "grocery"));
  }, []);

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const normalized = {
        ...product,
        id: product.id,
        price: Number(product.price || 0),
      };

      const existing = cart.find((item) => item.id === normalized.id);

      if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
      } else {
        cart.push({ ...normalized, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      window.dispatchEvent(
        new CustomEvent("cart_updated", { detail: cart })
      );

      alert("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400 py-20 px-6 text-white shadow-2xl">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
             Smart Online Shopping 🚚
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover trending products, fashion, electronics, accessories,
  home essentials, and more — all in one place.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg border border-white/30">
            <span className="text-2xl">🛒</span>
            <span className="font-medium">
              {products.length} Products Available
            </span>
          </div>
        </div>

      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* SECTION TITLE */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">

          <div>
            <h2 className="text-4xl font-extrabold text-slate-800">
              Grocery Products
            </h2>

            <p className="mt-2 text-slate-500">
              Discover premium quality grocery items
            </p>
          </div>

          <div className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow-lg">
            {products.length} Items
          </div>

        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {products.map((p) => (
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
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-slate-100">

            <div className="text-7xl mb-6">🛍️</div>

            <h3 className="text-3xl font-bold text-slate-800">
              No Products Found
            </h3>

            <p className="mt-3 text-slate-500">
              Add grocery products from the admin panel.
            </p>

          </div>
        )}

      </section>

    </div>
  );
}
