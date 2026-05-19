import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => ({
        ...doc.data(),
        docId: doc.id,
      }));
      setProducts(items);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  /* DELETE PRODUCT */
  const handleDelete = async (docId, productName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(docId);
      await deleteDoc(doc(db, "products", docId));
      // Remove from local state instantly (no need to refetch)
      setProducts((prev) => prev.filter((p) => p.docId !== docId));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
          >
            ←
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">
              Products 📦
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your store inventory
            </p>
          </div>
        </div>

        <Link
          to="/admin/add"
          className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          + Add Product
        </Link>

      </div>

      {/* TABLE CARD */}
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl overflow-hidden">

        {products.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-slate-800">
              No Products Found
            </h2>
            <p className="text-slate-500 mt-2">
              Start by adding your first product
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.docId}
                    className="border-b border-slate-100 hover:bg-pink-50/40 transition"
                  >

                    {/* PRODUCT */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/groceryImg.jpg";
                        }}
                        className="w-12 h-12 rounded-xl object-cover border shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">ID: {p.id}</p>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        {p.category || "grocery"}
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ₹ {Number(p.price || 0).toFixed(2)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">

                        <Link
                          to={`/admin/edit/${p.docId}`}
                          className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow hover:scale-105 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(p.docId, p.name)}
                          disabled={deletingId === p.docId}
                          className="px-4 py-2 rounded-full bg-red-500 text-white text-xs font-semibold shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === p.docId ? "Deleting..." : "Delete"}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}