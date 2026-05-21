import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
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
      const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
          alert("Please select at least one product to delete.");
          return;
        }

        const confirmed = window.confirm(
          `Are you sure you want to delete ${selectedProducts.length} product(s)?`
        );
        if (!confirmed) return;

        try {
          for (let docId of selectedProducts) {
            await deleteDoc(doc(db, "products", docId));
          }
          setProducts((prev) =>
            prev.filter((p) => !selectedProducts.includes(p.docId))
          );
          setSelectedProducts([]); // reset selection
        } catch (err) {
          console.error("Failed to delete products:", err);
          alert("Failed to delete products. Try again.");
        }
      };
  /* TOGGLE ACTIVE / NOT ACTIVE */
  const toggleActive = async (docId, value) => {
    try {
      await updateDoc(doc(db, "products", docId), {
        active: value,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.docId === docId ? { ...p, active: value } : p
        )
      );
    } catch (err) {
      console.error("Failed to update active status:", err);
      alert("Failed to update status. Try again.");
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
              <button
        onClick={handleBulkDelete}
        disabled={selectedProducts.length === 0}
        className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
      >
        Delete Selected ({selectedProducts.length})
      </button>
      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl overflow-hidden">

        {products.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-slate-800">
              No Products Found
            </h2>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="text-left px-6 py-4">.</th>
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.docId}
                    className="border-b hover:bg-pink-50/40"
                  >
              {/* SELECT PRODUCT */}
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(p.docId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts((prev) => [...prev, p.docId]);
                    } else {
                      setSelectedProducts((prev) => prev.filter((id) => id !== p.docId));
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
                    {/* PRODUCT */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-slate-400">ID: {p.id}</p>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      {p.category || "grocery"}
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 font-bold">
                      ₹ {Number(p.price || 0).toFixed(2)}
                    </td>

                    {/* ACTIVE / NOT ACTIVE */}
                    <td className="px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.active}
                      onChange={() => toggleActive(p.docId, !p.active)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </label>
                  </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">

                        <Link
                          to={`/admin/edit/${p.docId}`}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-xs"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(p.docId, p.name)}
                          disabled={deletingId === p.docId}
                          className="px-4 py-2 bg-red-500 text-white rounded-full text-xs"
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