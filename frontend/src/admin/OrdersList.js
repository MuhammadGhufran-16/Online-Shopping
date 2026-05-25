import { Link } from "react-router-dom";
import { subscribeOrders } from "../utils/storeApi";
import { updateOrder, deleteOrderById } from "../utils/storeApi";
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

const filters = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "Last 7 days" },
  { id: "month", label: "This month" },
];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [productMap, setProductMap] = useState({}); // id -> product
  const [selectedDate, setSelectedDate] = useState("");

  /* FETCH ALL PRODUCTS ONCE for image lookup */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const map = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          // index by both custom id and docId
          if (data.id) map[String(data.id)] = data;
          map[String(doc.id)] = data;
        });
        setProductMap(map);
      } catch (err) {
        console.error("Failed to fetch products for image lookup:", err);
      }
    };

    fetchProducts();
  }, []);

  /* Helper: get image for a cart item */
  const getItemImage = (item) => {
    // 1. Use image already stored in the cart item
    if (item.image && item.image.startsWith("data:")) return item.image;
    if (item.image && item.image.length > 10) return item.image;

    // 2. Look up from products collection by item id
    const product = productMap[String(item.id)] || productMap[String(item.productId)];
    if (product?.image) return product.image;
    if (product?.images?.[0]) return product.images[0];

    // 3. Fallback
    return "/images/groceryImg.jpg";
  };

  useEffect(() => {
    let unsubscribe = () => {};

    const loadOrders = async () => {
      unsubscribe = await subscribeOrders(
        (firebaseOrders) => {
          const formattedOrders = firebaseOrders.map((order) => ({
            ...order,
            cart: order.items || order.cart || [],
          }));
          setOrders(formattedOrders);
        },
        (error) => {
          console.error("Failed to fetch orders:", error);
        }
      );
    };

    loadOrders();
    return () => unsubscribe();
  }, []);
        const togglePayment = async (order) => {
        try {
          await updateOrder({
            ...order,
            paymentConfirmed: !order.paymentConfirmed,
          });
        } catch (err) {
          console.error("Payment update failed:", err);
        }
      };

        const { filteredOrders, revenue, profit } = useMemo(() => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - 6);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const isInRange = (date) => {
          if (selectedDate) {
            const picked = new Date(selectedDate);

            return (
              date.getFullYear() === picked.getFullYear() &&
              date.getMonth() === picked.getMonth() &&
              date.getDate() === picked.getDate()
            );
          }

          if (activeFilter === "today") return date >= startOfToday;
          if (activeFilter === "week") return date >= startOfWeek;
          if (activeFilter === "month") return date >= startOfMonth;

          return true;
        };

        const list = orders
          .map((order) => ({ ...order, _date: new Date(order.time) }))
          .filter((order) => !isNaN(order._date))
          .filter((order) => isInRange(order._date))
          .sort((a, b) => b._date - a._date);

        const totalRevenue = list.reduce((sum, order) => {
          if (!order.paymentConfirmed) return sum;
          return sum + Number(order.total || 0);
        }, 0);
        const totalProfit = list.reduce((sum, order) => {
          if (!order.paymentConfirmed) return sum;

          const orderProfit = (order.cart || []).reduce((itemSum, item) => {
            const sellingPrice = Number(item.price || item.productPrice || 0);
            const originalPrice = Number(item.originalPrice || 0);
            const qty = Number(item.qty || 1);
            const perItemProfit = sellingPrice - originalPrice;
            return itemSum + (perItemProfit * qty);
          }, 0);

          return sum + orderProfit;
        }, 0);

        return {
        filteredOrders: list,
        revenue: totalRevenue,
        profit: totalProfit,
      };
      }, [orders, activeFilter, selectedDate]);

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.id) === String(selectedOrderId)),
    [orders, selectedOrderId]
  );

  const toggleCompleted = async (orderId) => {
    const targetOrder = orders.find((order) => String(order.id) === String(orderId));
    if (!targetOrder) return;
    await updateOrder({ ...targetOrder, completed: !targetOrder.completed });
  };

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(`Delete order #${orderId}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteOrderById(orderId);
      if (String(selectedOrderId) === String(orderId)) setSelectedOrderId(null);
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 px-4 py-10">
      <div className="max-w-6xl mx-auto mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
          >
            Back
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">Orders</h1>
            <p className="text-slate-500 mt-2">Track customer purchases and manage status</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {/* REVENUE CALENDAR */}
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      className="
        px-4
        py-2
        rounded-full
        border
        border-slate-200
        bg-white
        text-sm
        text-slate-700
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
    />

    {selectedDate && (
      <button
        onClick={() => setSelectedDate("")}
        className="
          px-4
          py-2
          rounded-full
          bg-red-100
          text-red-600
          text-sm
          font-semibold
          hover:bg-red-200
          transition
        "
      >
        Clear
      </button>
    )}
      </div>

      {/* REVENUE CARD */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/70 backdrop-blur-xl border border-slate-200 shadow-lg rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Revenue ({filters.find((f) => f.id === activeFilter)?.label})
            </p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              Rs. {revenue.toFixed(2)}
            </h2>
              <p className="text-sm text-slate-500 mt-3">
              Profit
            </p>

            <h2 className="text-3xl font-extrabold text-green-600 mt-1">
              Rs. {profit.toFixed(2)}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Orders</p>
            <p className="text-3xl font-extrabold text-slate-800">{filteredOrders.length}</p>
          </div>
        </div>
      </div>
      

      {/* ORDERS TABLE */}
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-slate-800">No Orders Yet</h2>
            <p className="text-slate-500 mt-2">Orders will appear here once customers purchase</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No orders in this time range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Mobile</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Payment</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 hover:bg-pink-50/40 transition"
                  >
                    <td className="px-6 py-4 text-slate-700">
                      {order._date.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-700">{order.name}</td>
                    <td className="px-6 py-4 text-slate-700">{order.mobile}</td>
                    <td className="px-6 py-4 text-slate-700 max-w-[220px] truncate">
                      {order.address}
                    </td>

                    {/* ITEMS PREVIEW with images */}
                    <td className="px-6 py-4 text-center">
                      <button
                            type="button"
                            onClick={() => setSelectedOrderId(order.id)}
                            className="flex items-center justify-center gap-1 mx-auto min-w-[90px]"
                      >
                        {/* Show up to 3 product images stacked */}
                        {/* <div className="flex -space-x-2">
                          {order.cart.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={getItemImage(item)}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/images/groceryImg.jpg";
                              }}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ))}
                        </div> */}
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                          {order.cart.length}
                        </span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleCompleted(order.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition min-w-[80px] ${
                          order.completed
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        }`}
                      >
                        {order.completed ? "Completed" : "Pending"}
                      </button>
                    </td>
                   <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => togglePayment(order)}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition shadow-sm
                      ${order.paymentConfirmed
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-600 border border-red-200"
                      }`}
                  >
                    {order.paymentConfirmed ? "✔ Paid" : "✖ Unpaid"}
                  </button>
                </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      Rs. {Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                          className="px-3 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteOrder(order.id)}
                          className="px-3 py-2 rounded-full bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition"
                        >
                          Delete
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

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm text-slate-500">Order #{selectedOrder.id}</p>
                <h2 className="text-2xl font-bold text-slate-800">{selectedOrder.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(selectedOrder.time).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</p>
                  <p className="mt-2 font-semibold text-slate-800">{selectedOrder.name}</p>
                  <p className="mt-1 text-slate-600">{selectedOrder.mobile}</p>
                  <p className="mt-1 text-slate-600">{selectedOrder.address}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</p>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Items</span>
                    <span>{selectedOrder.cart.length}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Status</span>
                    <span className={selectedOrder.completed ? "font-semibold text-green-700" : "font-semibold text-amber-700"}>
                      {selectedOrder.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Total</span>
                    <span className="font-bold text-slate-800">Rs. {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleCompleted(selectedOrder.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedOrder.completed
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  {selectedOrder.completed ? "Mark as Pending" : "Mark as Completed"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-semibold hover:bg-red-200 transition"
                >
                  Delete Order
                </button>
              </div>

              {/* CART ITEMS with images */}
              <div className="mt-6 space-y-4">
                {selectedOrder.cart.map((item, i) => (
                  <div
                    key={`${selectedOrder.id}-${item.id}-${i}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                  >
                    {/* <img
                      src={getItemImage(item)}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/groceryImg.jpg";
                      }}
                      className="h-20 w-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    /> */}

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.productName}</h3>
                      <p className="mt-1 text-sm text-slate-500">Qty: {item.qty}</p>
                      <p className="text-sm text-slate-500">
                        Price: Rs. {Number(item.price || item.productPrice || 0).toFixed(2)}
                      </p>
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-slate-500">Line Total</p>
                      <p className="font-bold text-slate-800">
                        Rs. {(
                          Number(item.price || item.productPrice || 0) *
                          Number(item.qty || 1)
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}