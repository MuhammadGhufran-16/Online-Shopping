import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingCart() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const updateCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalQty = cart.reduce(
      (sum, item) => sum + Number(item.qty || 1),
      0
    );

    setCartCount(totalQty);
  };

  useEffect(() => {
    updateCart();

    window.addEventListener("cart_updated", updateCart);

    return () => {
      window.removeEventListener("cart_updated", updateCart);
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/cart")}
      className="
        fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
        bg-gradient-to-r from-pink-500 to-orange-400
        text-white shadow-2xl flex items-center justify-center
        hover:scale-110 transition
      "
    >
      🛒

      {cartCount > 0 && (
        <span className="
          absolute -top-1 -right-1
          bg-red-500 text-white text-xs
          w-5 h-5 flex items-center justify-center
          rounded-full font-bold
        ">
          {cartCount}
        </span>
      )}
    </button>
  );
}