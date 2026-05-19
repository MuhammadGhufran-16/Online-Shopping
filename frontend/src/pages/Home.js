// src/pages/Home.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { subscribeProducts } from "../utils/storeApi";

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let unsubscribe = () => {};

    subscribeProducts(
      (products) => {
        setAllProducts(products.slice(0, 12));
      },
      (error) => {
        console.error("products subscription error:", error);
      }
    ).then((cleanup) => {
      unsubscribe = cleanup;
    }).catch((error) => {
      console.error("products load error:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {

      const updateCartCount = () => {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!Array.isArray(cart)) cart = [];

        const totalQty = cart.reduce(
          (sum, item) => sum + Number(item.qty || 1),
          0
        );

        setCartCount(totalQty);
      };

      updateCartCount();

      window.addEventListener(
        "cart_updated",
        updateCartCount
      );

      return () => {
        window.removeEventListener(
          "cart_updated",
          updateCartCount
        );
      };

    }, []);

  const addToCart = (product) => {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const normalized = {
        ...product,
        id: product.id,
        price: Number(product.price || 0),
      };

      const existingItem = cart.find((item) => item.id === normalized.id);

      if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 0) + 1;
      } else {
        cart.push({ ...normalized, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent("cart_updated", { detail: cart }));
      alert("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white">
    {/* FLOATING CART BUTTON */}
      <button
        onClick={() => navigate("/cart")}
        className="
          fixed top-[25.35rem] right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-orange-400
          text-white shadow-2xl flex items-center justify-center hover:scale-110 transition
        "
      >

        <span className="text-2xl">
          🛒
        </span>

        {/* BADGE */}
        {cartCount > 0 && (

          <span
            className="
              absolute
              -top-1
              -right-1
              min-w-[24px]
              h-6
              px-1
              rounded-full
              bg-red-500
              text-white
              text-xs
              font-bold
              flex
              items-center
              justify-center
              border-2
              border-white
            "
          >
            {cartCount}
          </span>

        )}

      </button>
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HERO SECTION */}

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-5 py-10 md:p-16 text-white shadow-2xl">

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-2xl">

          <span className="bg-white/20 text-xs px-4 py-1 rounded-full font-medium">
            Smart Online Store
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            Style Everyday Elegance
            <span className="block text-cyan-200">
              With a Premium Fashion Experience
            </span>
          </h1>

          <p className="mt-5 text-indigo-100 text-lg leading-relaxed">
            Discover trendy sarees, ethnic wear, and stylish clothing collections at affordable prices with seamless and secure shopping..
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

           <div className="mt-10 flex flex-wrap gap-6">

            <Link
              to="/grocery"
              className="hero-btn-primary"
            >
              <span>Shop Now</span>
              <span className="arrow">→</span>
            </Link>

            <Link
              to="/cart"
              className="hero-btn-secondary"
            >
              🛒 View Cart
            </Link>

            <Link
              to="/admin"
              className="hero-btn-dark"
            >
              ⚙ Admin Panel
            </Link>

          </div>

          </div>
        </div>
      </section>

      {/* FEATURE BOXES */}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg">🚚 Fast Delivery</h3>
          <p className="text-slate-500 mt-2 text-sm">
            Quick and reliable delivery to your doorstep.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg">💳 Secure Payments</h3>
          <p className="text-slate-500 mt-2 text-sm">
            100% safe and encrypted payment methods.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg">⭐ Premium Quality</h3>
          <p className="text-slate-500 mt-2 text-sm">
            High-quality products from trusted brands.
          </p>
        </div>

      </section>

      {/* PRODUCTS */}

      <section className="mt-14">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Trending Products
            </h2>

            <p className="text-slate-500 mt-1">
              Best-selling products this week
            </p>
          </div>

          <Link
            to="/grocery"
            className="text-indigo-600 font-semibold hover:underline"
          >
            View all →
          </Link>

        </div>

        {allProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <p className="text-slate-500">
              No products found.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {allProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}

      </section>

    </div>
  </div>
);
}
