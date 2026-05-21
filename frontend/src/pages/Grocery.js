// src/pages/Grocery.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Grocery() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all active products regardless of category
        const q = query(collection(db, "products"), where("active", "==", true));
        const snapshot = await getDocs(q);

        const items = snapshot.docs.map((doc) => ({
        firestoreId: doc.id,
        ...doc.data(),
      }));

        setProducts(items);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchProducts();
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
      window.dispatchEvent(new CustomEvent("cart_updated", { detail: cart }));

      alert("Added to cart");
    } catch (err) {
      console.error("addToCart error:", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg font-medium">
            No products available at this time.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="transform transition duration-300 hover:-translate-y-3 cursor-pointer"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <ProductCard product={p} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}