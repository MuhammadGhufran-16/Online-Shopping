// src/pages/ProductDetails.js

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { db } from "../firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function ProductDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [cartQty, setCartQty] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  /* FETCH PRODUCT */
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);

        const snapshot = await getDocs(
          collection(db, "products")
        );

        const products = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        const found = products.find(
          (item) =>
            String(item.id) === String(id)
        );

        setProduct(found || null);

        if (found?.images?.length > 0) {
          setSelectedImage(found.images[0]);
        }

      } catch (err) {

        console.error(
          "Fetch product error:",
          err
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  /* CHECK CART QTY */
  useEffect(() => {

    if (!product) return;

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existing = cart.find(
      (item) =>
        String(item.id) ===
        String(product.id)
    );

    setCartQty(
      existing ? existing.qty : 0
    );

  }, [product]);

  /* LOADING */
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-700">
        Loading...
      </div>
    );

  }

  /* PRODUCT NOT FOUND */
  if (!product) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-500">
        Product not found
      </div>
    );

  }

  /* ADD TO CART */
  const addToCart = () => {

    try {

      let cart =
        JSON.parse(
          localStorage.getItem("cart")
        ) || [];

      const existing = cart.find(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      if (existing) {

        existing.qty += 1;

      } else {

        cart.push({
          ...product,
          qty: 1,
        });

      }

      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new CustomEvent(
          "cart_updated",
          {
            detail: cart,
          }
        )
      );

      const updated = cart.find(
        (item) =>
          String(item.id) ===
          String(product.id)
      );

      setCartQty(updated.qty);

    } catch (err) {

      console.error(
        "addToCart error:",
        err
      );

    }

  };

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

      {/* MAIN CARD */}
      <div
        className="
          max-w-6xl
          mx-auto
          bg-white
          rounded-3xl
          shadow-xl
          p-8
          grid
          md:grid-cols-2
          gap-10
        "
      >

        {/* LEFT SIDE */}
        <div className="w-full">

          {/* MAIN IMAGE */}
          <div
            className="
              w-full
              rounded-2xl
              border
              bg-white
              overflow-hidden
            "
          >

            <div
              className="
                flex
                items-center
                justify-center
                bg-slate-50
              "
            >

              <img
                src={selectedImage}
                alt={product.name}
                className="
                  w-full
                  h-[300px]
                  sm:h-[400px]
                  md:h-[500px]
                  object-contain
                "
              />

            </div>

          </div>

          {/* THUMBNAILS */}
          <div
            className="
              flex
              gap-3
              mt-4
              overflow-x-auto
              pb-2
            "
          >

            {product.images?.map(
              (img, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setSelectedImage(img)
                  }
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
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </button>

              )
            )}

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div
          className="
            flex
            flex-col
            justify-center
          "
        >

          {/* NAME */}
          <h1
            className="
              text-5xl
              font-extrabold
              text-slate-800
            "
          >
            {product.name}
          </h1>

          {/* PRICE */}
          <div className="mt-6 flex items-center gap-4">

            <span
              className="
                text-4xl
                font-bold
                text-pink-600
              "
            >
              ₹ {product.price}
            </span>

          </div>

          {/* CATEGORY */}
          <div className="mt-4">

            <span
              className="
                inline-block
                px-4
                py-1
                rounded-full
                bg-pink-100
                text-pink-600
                text-sm
                font-semibold
              "
            >
              {product.category}
            </span>

          </div>

          {/* DESCRIPTION */}
          <p
            className="
              mt-6
              text-slate-600
              leading-relaxed
              text-lg
            "
          >
            {product.description}
          </p>

          {/* ADD TO CART */}
          <button
            onClick={addToCart}
            className="
              mt-10
              px-8
              py-4
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              to-orange-400
              text-white
              text-lg
              font-bold
              shadow-lg
              hover:scale-105
              transition
            "
          >

            {cartQty > 0
              ? `Added to Cart (+${cartQty})`
              : "Add To Cart 🛒"}

          </button>

        </div>

      </div>

    </div>

  );

}