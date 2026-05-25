import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fallbackProductImage,
  normalizeProducts,
} from "../utils/productData";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let saved = JSON.parse(localStorage.getItem("cart")) || [];
    if (!Array.isArray(saved)) saved = [];

    saved = normalizeProducts(saved).map((item) => ({
      ...item,
      qty: Number(item?.qty || 1),
      price: Number(item?.price || 0),
      originalPrice: Number(item?.originalPrice || 0),
    }));

    setCart(saved);
    localStorage.setItem("cart", JSON.stringify(saved));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || [];
      const normalised = normalizeProducts(detail).map((item) => ({
        ...item,
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
        originalPrice: Number(item.originalPrice || 0),
      }));
      setCart(normalised);
    };

    window.addEventListener("cart_updated", handler);
    return () => window.removeEventListener("cart_updated", handler);
  }, []);

        const increaseQty = (id) => {

        const updated = cart.map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + 1 }
            : item
        );

        setCart(updated);

        localStorage.setItem(
          "cart",
          JSON.stringify(updated)
        );

        window.dispatchEvent(
          new CustomEvent("cart_updated", {
            detail: updated,
          })
        );
      };

  const decreaseQty = (id) => {

      const updated = cart
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0);

      setCart(updated);

      localStorage.setItem(
        "cart",
        JSON.stringify(updated)
      );

      window.dispatchEvent(
        new CustomEvent("cart_updated", {
          detail: updated,
        })
      );
    };

    

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4">

        <div className="text-center bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-10 max-w-md">

          <div className="text-6xl mb-4">🛒</div>

          <h2 className="text-2xl font-bold text-slate-800">
            Your cart is empty
          </h2>

          <p className="text-slate-500 mt-2">
            Add something tasty from grocery section
          </p>

          <Link
            to="/grocery"
            className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Start Shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <h2 className="text-4xl font-extrabold text-slate-800">
          Your Cart
        </h2>
        <p className="text-slate-500 mt-2">
          Review your selected items before checkout
        </p>
      </div>

      {/* CART LIST */}
      <div className="max-w-5xl mx-auto space-y-4">

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-md rounded-2xl p-4 hover:shadow-xl transition"
          >

            <img
              src={item.image}
              alt={item.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackProductImage;
              }}
              className="w-full sm:w-20 h-52 sm:h-20 object-cover rounded-xl border"
            />

            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-semibold text-slate-800">
                {item.name}
              </h4>
              <p className="text-sm text-slate-500">
                ₹ {item.price.toFixed(2)}
              </p>
            </div>

            {/* QTY */}
            <div className="flex items-center justify-center gap-2">

              <button
                onClick={() => decreaseQty(item.id)}
                className="w-9 h-9 rounded-full border text-lg hover:bg-slate-100"
              >
                −
              </button>

              <span className="w-8 text-center font-semibold">
                {item.qty}
              </span>

              <button
                onClick={() => increaseQty(item.id)}
                className="w-9 h-9 rounded-full bg-pink-500 text-white hover:scale-110 transition"
              >
                +
              </button>

            </div>

            {/* PRICE */}
            <div className="text-center sm:text-right min-w-[80px] w-full sm:w-auto">
              <p className="font-bold text-slate-800">
                ₹ {(item.price * item.qty).toFixed(2)}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* TOTAL SECTION */}
      <div className="max-w-5xl mx-auto mt-10">

        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">

          <div>
            <p className="text-white/80">Total Amount</p>
            <h3 className="text-3xl font-extrabold">
              ₹ {total.toFixed(2)}
            </h3>
          </div>

          <div className="flex gap-3">

            <Link
              to="/grocery"
              className="px-5 py-3 rounded-full bg-white/20 backdrop-blur border border-white/30 hover:scale-105 transition"
            >
              Continue Shopping
            </Link>

              <Link
          to="/checkout"
          className="
            px-6 py-3 rounded-full bg-white text-slate-900 font-bold hover:scale-105 transition"
        >
          Checkout
        </Link>

          </div>

        </div>

      </div>

       
    </div>
  );
}
