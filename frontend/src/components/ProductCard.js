import { useState } from "react";
import {
  fallbackProductImage,
  getProductImage,
} from "../utils/productData";

export default function ProductCard({ product, addToCart }) {
  const safeProduct = {
    ...product,
    price: Number(product?.price || 0),
    id: product?.id,
  };

  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  const getImageSrc = () => {
    if (imgError) {
      return fallbackProductImage;
    }

    return getProductImage(safeProduct);
  };

  return (
    <div className="group bg-white/70 backdrop-blur-xl border border-slate-100 shadow-md rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300 flex flex-col">

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        <img
          src={getImageSrc()}
          alt={safeProduct.name || ""}
          className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
          onError={handleImageError}
        />

        {/* overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">

        <h4 className="text-sm font-bold text-slate-800 line-clamp-2">
          {safeProduct.name}
        </h4>

        {/* <p className="text-sm text-slate-500 mt-1">
          Fresh & Quality Product
        </p> */}

        {/* PRICE */}
        <div className="mt-3 flex items-center justify-between">

          <p className="text-lg font-extrabold text-slate-900">
            ₹ {safeProduct.price.toFixed(2)}
          </p>

          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 font-semibold">
            In Stock
          </span>

        </div>

        {/* BUTTON */}
        <button
          onClick={() => addToCart(safeProduct)}
          className="mt-4 w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition"
        >
          Add to Cart 🛒
        </button>

      </div>
    </div>
  );
}
