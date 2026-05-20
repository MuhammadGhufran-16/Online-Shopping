import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditProduct() {
  const { id } = useParams(); // this is the Firestore docId
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* FETCH FROM FIRESTORE */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError("Product not found.");
          return;
        }

        const data = docSnap.data();
        setProduct({
        name: data.name || "",
        price: data.price || "",

        description: data.description || "",

        images: Array.isArray(data.images)
          ? data.images
          : data.image
          ? [data.image]
          : [],

        category: data.category || "grocery",
      });
      } catch (err) {
        console.error(err);
        setError("Failed to load product.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (field) => (e) => {
    setProduct((prev) => ({ ...prev, [field]: e.target.value }));
  };

  /* ADD MORE IMAGES */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setLoading(true);
    try {
      const newImages = [];
      for (const file of files) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    } catch (err) {
      console.error(err);
      setError("Image upload failed.");
    } finally {
      setLoading(false);
      // Reset input so same file can be re-uploaded
      e.target.value = "";
    }
  };

  /* REMOVE IMAGE */
  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* SAVE TO FIRESTORE */
  const save = async () => {
    if (!product) return;
    setError("");

        if (
        !product.name ||
        !product.price ||
        !product.description ||
        product.images.length === 0
      ) {
        setError(
          "Name, price, description and at least one image are required."
        );
        return;
      }

    try {
      setLoading(true);
      const docRef = doc(db, "products", id);
              await updateDoc(docRef, {
          name: product.name.trim(),

          price: Number(product.price || 0),

          description: product.description.trim(),

          images: product.images,

          image: product.images[0],

          category: product.category || "grocery",
        });

      alert("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (!product && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl">{error}</div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-extrabold text-slate-800">Edit Product ✏️</h1>
          <p className="text-slate-500 mt-2">Update product details and save changes</p>
        </div>
      </div>

      {/* CARD */}
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
            <label className="text-sm font-medium text-slate-700">Product Name</label>
            <input
              value={product.name}
              onChange={handleChange("name")}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="Enter product name"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-sm font-medium text-slate-700">Price (₹)</label>
            <input
              type="number"
              value={product.price}
              onChange={handleChange("price")}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pink-400 outline-none"
              placeholder="Enter price"
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
              rows={5}
              placeholder="Enter product description"
              className="
                w-full
                mt-1
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                focus:ring-2
                focus:ring-pink-400
                outline-none
                resize-none
              "
            />

          </div>

          {/* IMAGES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">
                Images ({product.images.length})
              </label>

              {/* ADD MORE IMAGES BUTTON */}
              <label className="cursor-pointer px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-xs font-semibold shadow hover:scale-105 transition">
                + Add Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {loading && (
              <p className="text-sm text-blue-500 mb-2">Uploading images...</p>
            )}

            {/* IMAGE PREVIEWS */}
            {product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl border border-slate-200 p-2 bg-white"
                  >
                    {/* FIRST IMAGE BADGE */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full z-10">
                        Main
                      </span>
                    )}

                    <img
                      src={img}
                      alt={`preview-${index}`}
                      className="h-32 w-full rounded-xl object-cover shadow-sm"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">
                No images yet. Click "+ Add Images" to upload.
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              value={product.category}
              onChange={handleChange("category")}
              placeholder="Enter category (e.g. grocery, electronics)"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200"
            />
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
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>

    </div>
  );
}