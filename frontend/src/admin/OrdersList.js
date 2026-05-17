import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const filters = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 days" },
  { id: "month", label: "This month" },
];

export default function OrdersList() {
  const stored = JSON.parse(localStorage.getItem("orders")) || [];
  const [activeFilter, setActiveFilter] = useState("today");

  const { filteredOrders, revenue } = useMemo(() => {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const isInRange = (date) => {
      if (activeFilter === "today") return date >= startOfToday;
      if (activeFilter === "week") return date >= startOfWeek;
      if (activeFilter === "month") return date >= startOfMonth;
      return true;
    };

    const list = stored
      .map((o) => ({ ...o, _date: new Date(o.time) }))
      .filter((o) => !isNaN(o._date))
      .filter((o) => isInRange(o._date))
      .sort((a, b) => b._date - a._date);

    const rev = list.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    return { filteredOrders: list, revenue: rev };
  }, [stored, activeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
          >
            ←
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">
              Orders 🧾
            </h1>
            <p className="text-slate-500 mt-2">
              Track customer purchases & revenue
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition ${
                activeFilter === f.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* REVENUE CARD */}
      <div className="max-w-6xl mx-auto mb-6">

        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl p-5 flex items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Revenue ({filters.find((f) => f.id === activeFilter)?.label})
            </p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              ₹ {revenue.toFixed(2)}
            </h2>
          </div>

          <div className="text-5xl">💰</div>

        </div>

      </div>

      {/* TABLE */}
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl overflow-hidden">

        {stored.length === 0 ? (
          <div className="p-10 text-center">

            <div className="text-6xl mb-3">🧾</div>
            <h2 className="text-xl font-bold text-slate-800">
              No Orders Yet
            </h2>
            <p className="text-slate-500 mt-2">
              Orders will appear here once customers purchase
            </p>

          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No orders in this time range.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Mobile</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>

                {filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-slate-100 hover:bg-pink-50/40 transition"
                  >

                    <td className="px-6 py-4 text-slate-700">
                      {o._date.toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      #{o.id}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {o.name}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {o.mobile}
                    </td>

                    <td className="px-6 py-4 text-slate-700 max-w-[200px] truncate">
                      {o.address}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                        {o.cart?.length || 0}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      ₹ {Number(o.total || 0).toFixed(2)}
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