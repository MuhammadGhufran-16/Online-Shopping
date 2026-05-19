import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "grocery",
  });

  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setProduct((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const save = () => {
    setError("");

    if (!product.name || !product.price || !product.image) {
      setError("Name, price and image path are required.");
      return;
    }

    const normalized = {
      id: `prod_${Date.now()}`,
      name: product.name.trim(),
      price: Number(product.price || 0),
      image: product.image.trim(),
      category: product.category || "grocery",
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(normalized);
    localStorage.setItem("products", JSON.stringify(products));

    alert("🎉 Product added successfully!");
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-3xl mx-auto flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
        >
          ←
        </button>

        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">
            Add New Product ➕
          </h1>

          <p className="text-slate-500 mt-2">
            Create and publish a new item in your store
          </p>
        </div>

      </div>

      {/* FORM CARD */}
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-8">

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
              onChange={handleChange("name")}
              placeholder="Enter product name"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
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
              onChange={handleChange("price")}
              placeholder="Enter price"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Image Path
            </label>
            <input
              value={product.image}
              onChange={handleChange("image")}
              placeholder="images/groceryImg.jpg"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
            />
            <p className="mt-2 text-xs text-slate-500">
              Example: `images/groceryImg.jpg`
            </p>
          </div>

          {product.image.trim() && (
            <div className="rounded-2xl border border-slate-200 p-3">
              <img
                src={product.image.trim().startsWith("images/") ? `/${product.image.trim()}` : product.image.trim()}
                alt="preview"
                className="h-28 w-full rounded-2xl object-cover shadow-sm"
              />
            </div>
          )}

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              value={product.category}
              onChange={handleChange("category")}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="grocery">Grocery</option>
              <option value="other">Other</option>
            </select>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-8">

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:scale-105 transition"
          >
            Save Product
          </button>

        </div>

      </div>

    </div>
  );
}
