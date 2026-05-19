import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminProductsList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  }, []);

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

                {products.map((p, index) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 hover:bg-pink-50/40 transition"
                  >

                    {/* PRODUCT */}
                    <td className="px-6 py-4 flex items-center gap-3">

                      <img
                        src={p.image}
                        alt={p.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = "/images/groceryImg.jpg";
                        }}
                        className="w-12 h-12 rounded-xl object-cover border shadow-sm"
                      />

                      <div>
                        <p className="font-semibold text-slate-800">
                          {p.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          ID: {p.id}
                        </p>
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
                          to={`/admin/edit/${p.id}`}
                          className="px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow hover:scale-105 transition"
                        >
                          Edit
                        </Link>
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
