import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function AddProduct() {

  const navigate = useNavigate();

      const [product, setProduct] = useState({
      name: "",
      originalPrice: "",
      price: "",
      description: "",
      images: [],
      category: "grocery",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* INPUT CHANGE */
  const handleChange = (field) => (e) => {
    setProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  /* IMAGE UPLOAD */
   const handleImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      setLoading(true);

      const uploadedImages = [];

      for (const file of files) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // base64 string
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        uploadedImages.push(base64);
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      setLoading(false);

    } catch (err) {
      console.error(err);
      setError("Image upload failed");
      setLoading(false);
    }
  };

  /* REMOVE IMAGE */
  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* SAVE PRODUCT */
  const save = async () => {
    console.log("db value:", db);
    try {
      setError("");

            if (
        !product.name ||
        !product.price ||
        !product.description ||
        product.images.length === 0
      ) {
        setError(
          "Name, price, description and images are required."
        );
        return;
      }

      const newProduct = {
        id: `prod_${Date.now()}`,
        name: product.name.trim(),
        originalPrice: Number(product.originalPrice || 0),
        price: Number(product.price || 0),

        description: product.description.trim(),

        images: product.images,
        image: product.images[0],

        category: product.category,

        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "products"), newProduct);

      alert("🎉 Product added successfully!");
      navigate("/admin/products");

    } catch (err) {
      console.error(err);
      setError("Failed to save product");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex items-center gap-4 mb-8">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="p-2 rounded-full bg-white border border-slate-200"
        >
          ←
        </button>

        <div>

          <h1 className="text-4xl font-extrabold text-slate-800">
            Add Product ➕
          </h1>

          <p className="text-slate-500 mt-2">
            Upload product with
            multiple images
          </p>

        </div>

      </div>

      {/* CARD */}
      <div className="max-w-xl mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-8">

        {/* ERROR */}
        {error && (

          <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm">
            {error}
          </div>

        )}

        <div className="space-y-5">

          {/* NAME */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Product Name
            </label>

            <input
              value={product.name}
              onChange={handleChange(
                "name"
              )}
              placeholder="Enter product name"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
            />

          </div>

          {/* ORIGINAL PRICE */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Original Price (₹)
            </label>

            <input
              type="number"
              value={product.originalPrice}
              onChange={handleChange("originalPrice")}
              placeholder="Enter original price"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
            />

          </div>

          {/* PRICE */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Price (₹)
            </label>

            <input
              type="number"
              value={product.price}
              onChange={handleChange(
                "price"
              )}
              placeholder="Enter price"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
            />

          </div>
          {/* DESCRIPTION */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Product Description
            </label>

            <textarea
              value={product.description}
              onChange={handleChange("description")}
              placeholder="Enter product description"
              rows={5}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 resize-none"
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Upload Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleImageUpload
              }
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 bg-white"
            />

            {loading && (

              <p className="text-sm text-blue-500 mt-2">
                Uploading images...
              </p>

            )}

          </div>

          {/* IMAGE PREVIEW */}
          {product.images.length >
            0 && (

            <div className="grid grid-cols-2 gap-4">

              {product.images.map(
                (img, index) => (

                  <div
                    key={index}
                    className="relative rounded-2xl border border-slate-200 p-2 bg-white"
                  >

                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="h-32 w-full rounded-xl object-cover shadow-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs"
                    >
                      ✕
                    </button>

                  </div>

                )
              )}

            </div>

          )}

          {/* CATEGORY */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              value={product.category}
              onChange={handleChange("category")}
              placeholder="Enter category (e.g. grocery, fashion, electronics)"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
            />

          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="w-full py-3 rounded-xl border border-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold"
          >
            Save Product
          </button>

        </div>

      </div>

    </div>

  );

}