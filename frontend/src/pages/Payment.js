import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import QRCode from "react-qr-code";

import { createOrder } from "../utils/storeApi";

export default function Payment() {

  const navigate = useNavigate();

  const { state } = useLocation();

  const { form, cart, total } =
    state || {};

  const [method, setMethod] =
    useState("cod");

  const [loading, setLoading] =
    useState(false);

  // YOUR REAL UPI ID
  const upiId = "yourupi@oksbi";

  const upiLink =
    `upi://pay?pa=${upiId}` +
    `&pn=Department Store` +
    `&am=${total}` +
    `&cu=INR`;

  const placeOrder = async () => {

    if (!form || !cart) return;

    setLoading(true);

    try {

      await createOrder({

        id: Date.now(),

        name: form.name,

        mobile: form.mobile,

        address: form.address,

        paymentMethod: method,

        items: cart,

        total,

        completed: false,

        paymentStatus:
          method === "cod"
            ? "pending"
            : "paid",

        time: new Date().toString(),

      });

      localStorage.removeItem("cart");

      window.dispatchEvent(
        new CustomEvent(
          "cart_updated",
          { detail: [] }
        )
      );

      alert(
        "Order placed successfully 🎉"
      );

      navigate("/");

    } catch (err) {

      console.error(err);

      alert(
        "Payment failed / order not placed"
      );

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-pink-50 px-4">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Payment Method 💳
        </h1>

        {/* COD */}
        <label className="flex items-center gap-3 p-4 border rounded-xl mb-3 cursor-pointer">

          <input
            type="radio"
            value="cod"
            checked={method === "cod"}
            onChange={() =>
              setMethod("cod")
            }
          />

          <span className="font-semibold">
            Cash on Delivery
          </span>

        </label>

        {/* UPI */}
        <label className="flex items-center gap-3 p-4 border rounded-xl mb-6 cursor-pointer">

          <input
            type="radio"
            value="upi"
            checked={method === "upi"}
            onChange={() =>
              setMethod("upi")
            }
          />

          <span className="font-semibold">
            UPI (GPay / PhonePe)
          </span>

        </label>

        {/* QR CODE */}
        {method === "upi" && (

          <div className="mb-6 p-6 bg-slate-50 rounded-2xl text-center">

            <h2 className="font-bold text-lg text-slate-800 mb-4">
              Scan & Pay
            </h2>

            <div className="bg-white p-4 inline-block rounded-2xl shadow">

              <QRCode
                value={upiLink}
                size={220}
              />

            </div>

            <p className="mt-4 text-slate-600 text-sm">
              Scan using GPay,
              PhonePe, Paytm
            </p>

            <p className="mt-2 font-bold text-xl text-green-600">
              ₹{total}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              UPI ID: {upiId}
            </p>

          </div>

        )}

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold"
        >

          {loading
            ? "Processing..."
            : method === "upi"
            ? "I Have Paid"
            : "Place Order"}

        </button>

      </div>

    </div>

  );

}