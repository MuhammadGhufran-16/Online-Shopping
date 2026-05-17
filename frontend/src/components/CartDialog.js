import { useState, useEffect } from "react";

export default function CartDialog() {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
      setIsOpen(true);
      
      // Auto-close after 10 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 10000);
    };

    window.addEventListener("cart_updated", handler);
    return () => window.removeEventListener("cart_updated", handler);
  }, []);

  if (!isOpen || cart.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-900">Added to Cart</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 text-lg"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        {cart.slice(-3).reverse().map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{item.name}</p>
              <p className="text-xs text-slate-500">Qty: {item.qty}</p>
            </div>
            <p className="text-xs font-semibold text-slate-900">
              ₹{Number(item.price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          {cart.length} item{cart.length !== 1 ? 's' : ''} in cart
        </p>
      </div>
    </div>
  );
}
