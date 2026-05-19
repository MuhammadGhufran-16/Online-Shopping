import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeProducts } from "../utils/productData";
import { createOrder } from "../utils/storeApi";

export default function Checkout() {
  const navigate = useNavigate();

  const cart = normalizeProducts(
    JSON.parse(localStorage.getItem("cart")) || []
  ).map((item) => ({
    ...item,
    qty: Number(item.qty || 1),
    price: Number(item.price || 0),
  }));

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [error, setError] = useState("");

  const placeOrder = async () => {
    setError("");

    if (!form.name || !form.mobile || !form.address) {
      setError("Please fill in all delivery details.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      await createOrder({
        id: Date.now(),
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        items: cart.map((item) => ({
          productName: item.name,
          productPrice: Number(item.price || 0),
          qty: Number(item.qty || 1),
        })),
        total,
        completed: false,
        time: new Date().toString(),
      });
    } catch (err) {
      console.error("create order error:", err);
      setError("Failed to place order in Firebase.");
      return;
    }
    localStorage.removeItem("cart");

    alert("🎉 Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
          Checkout 🧾
        </h1>
        <p className="text-slate-500 mt-2">
          Complete your order and get it delivered fast
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[2fr,1fr]">

        {/* FORM */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Delivery Details 🚚
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">

            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="Mobile Number"
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />

            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none min-h-[120px]"
              placeholder="Full Address (House no, Street, City, Pincode)"
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={placeOrder}
            className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition"
          >
            Place Order • ₹{total.toFixed(2)}
          </button>

        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-6 h-fit">

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Order Summary 🛍️
          </h2>

          {cart.length === 0 ? (
            <p className="text-slate-500 text-sm">
              Your cart is empty
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-[300px] overflow-auto pr-2">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-700">
                      {item.name} × {item.qty}
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}

              </div>

              <hr className="my-4 border-slate-200" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-pink-600">
                  ₹{total.toFixed(2)}
                </span>
              </div>

            </>
          )}

        </div>

      </div>
    </div>
  );
}
