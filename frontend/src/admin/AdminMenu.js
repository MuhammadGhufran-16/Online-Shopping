import { Link, useNavigate } from "react-router-dom";

export default function AdminMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">
            Admin Dashboard ⚙️
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your store, products & orders
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Logout
        </button>

      </div>

      {/* GRID */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* PRODUCTS */}
        <Link to="/admin/products">
          <div className="group bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

            <div className="text-4xl mb-4">📦</div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-500">
              Products
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Manage all store products
            </p>

            <span className="inline-block mt-5 text-sm font-semibold text-pink-500">
              Open →
            </span>

          </div>
        </Link>

        {/* ADD PRODUCT */}
        <Link to="/admin/add">
          <div className="group bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

            <div className="text-4xl mb-4">➕</div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-500">
              Add Product
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Create new items for store
            </p>

            <span className="inline-block mt-5 text-sm font-semibold text-green-500">
              Add →
            </span>

          </div>
        </Link>

        {/* ORDERS */}
        <Link to="/admin/orders">
          <div className="group bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300">

            <div className="text-4xl mb-4">🧾</div>

            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-500">
              Orders
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              View customer purchases
            </p>

            <span className="inline-block mt-5 text-sm font-semibold text-blue-500">
              View →
            </span>

          </div>
        </Link>

      </div>

    </div>
  );
}