// src/pages/ProductDetails.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("products")) || [];

    const found = stored.find((item) => item.id.toString() === id);

    setProduct(found);

    if (found?.images?.length > 0) {
      setSelectedImage(found.images[0]);
    }

  }, [id]);

  if (!product) {
    return (
      <div className="p-10 text-center text-2xl">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
                    {/* BACK BUTTON */}
            <div className="max-w-6xl mx-auto mb-5">

            <button
                onClick={() => navigate(-1)}
                className="
                flex
                items-center
                gap-2
                px-5
                py-3
                rounded-full
                bg-white
                border
                border-slate-200
                shadow-sm
                hover:shadow-md
                hover:scale-105
                transition
                text-slate-700
                font-medium
                "
            >

                <span className="text-xl">
                ←
                </span>

                <span>
                Back
                </span>

            </button>

            </div>

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
            <div className="w-full">

            {/* MAIN IMAGE */}
            <div className="w-full rounded-2xl border bg-white overflow-hidden">

                <div className="flex items-center justify-center bg-slate-50">

                <img
                    src={selectedImage}
                    alt={product.name}
                    className="
                    w-full
                    h-[300px]
                    sm:h-[400px]
                    md:h-[500px]
                    object-contain
                    transition-all
                    duration-300
                    "
                />

                </div>

            </div>

            {/* MULTIPLE IMAGES */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {product.images?.map((img, index) => (

                <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`
                    min-w-[80px]
                    w-20
                    h-20
                    rounded-xl
                    overflow-hidden
                    border-2
                    bg-white
                    flex-shrink-0
                    transition
                    ${
                        selectedImage === img
                        ? "border-pink-500"
                        : "border-slate-200"
                    }
                    `}
                >

                    <img
                    src={img}
                    alt={`thumb-${index}`}
                    className="w-full h-full object-cover"
                    />

                </button>

                ))}

            </div>

            </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center">

          <h1 className="text-5xl font-extrabold text-slate-800">
            {product.name}
          </h1>

          <p className="mt-6 text-3xl font-bold text-pink-600">
            ₹ {product.price}
          </p>

          <p className="mt-6 text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <button
            className="mt-10 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 text-white text-lg font-bold shadow-lg hover:scale-105 transition"
          >
            Add To Cart
          </button>

        </div>

      </div>

    </div>
  );
}