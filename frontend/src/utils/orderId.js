export const generateOrderId = () => {
  const last = localStorage.getItem("last_order_number") || "2000";

  const next = Number(last) + 1;

  localStorage.setItem("last_order_number", next);

  return `ORD${next}`;
};