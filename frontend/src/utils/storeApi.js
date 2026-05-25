import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../admin/firebase";
import {
  normalizeProduct,
  normalizeProducts,
  seededProducts,
} from "./productData";
import { addDoc } from "firebase/firestore";
const productsCollection = collection(db, "products");
const ordersCollection = collection(db, "orders");

  const normalizeOrderItems = (order = {}) => {
    const sourceItems = Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.cart)
      ? order.cart
      : [];

    return sourceItems
  .filter(Boolean)
  .map((item) => ({
    id: item.id || item.productId || "",

    productName: String(
      item.productName || item.name || "Product"
    ),

    productPrice: Number(
      item.productPrice ?? item.price ?? 0
    ),

    price: Number(
      item.productPrice ?? item.price ?? 0
    ),

    originalPrice: Number(
      item.originalPrice ?? 0
    ),

    qty: Number(item.qty ?? 1),
  }));
};

const normalizeOrder = (order = {}, index = 0) => ({
  id: order.id || "",
  name: String(order.name || "").trim(),
  mobile: String(order.mobile || "").trim(),
  address: String(order.address || "").trim(),
  total: Number(order.total || 0),
  completed: Boolean(order.completed),
  paymentConfirmed: Boolean(order.paymentConfirmed),
  time: order.time || new Date().toString(),
  items: normalizeOrderItems(order),
  cart: normalizeOrderItems(order),
});

const normalizeOrders = (orders = []) => {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders.map((order, index) => normalizeOrder(order, index));
};

const writeProducts = async (products = []) => {
  const batch = writeBatch(db);

  products.forEach((product, index) => {
    const normalized = normalizeProduct(product, index);
    batch.set(doc(productsCollection, String(normalized.id)), normalized);
  });

  await batch.commit();
};

const writeOrders = async (orders = []) => {
  const batch = writeBatch(db);

  orders.forEach((order, index) => {
    const normalized = normalizeOrder(order, index);
    batch.set(doc(ordersCollection, String(normalized.id)), normalized);
  });

  await batch.commit();
};

export const ensureProductsInFirestore = async () => {
  const snapshot = await getDocs(productsCollection);

  if (!snapshot.empty) {
    return;
  }

  const legacyProducts = normalizeProducts(
    JSON.parse(localStorage.getItem("products")) || []
  );

  const initialProducts =
    legacyProducts.length > 0 ? legacyProducts : seededProducts;

  await writeProducts(initialProducts);
  localStorage.setItem("products", JSON.stringify(initialProducts));
};

export const migrateOrdersToFirestore = async () => {
  const snapshot = await getDocs(ordersCollection);

  if (!snapshot.empty) {
    return;
  }

  const legacyOrders = normalizeOrders(
    JSON.parse(localStorage.getItem("orders")) || []
  );

  if (legacyOrders.length === 0) {
    return;
  }

  await writeOrders(legacyOrders);
};

export const subscribeProducts = async (onData, onError) => {
  await ensureProductsInFirestore();

  const productQuery = query(productsCollection, orderBy("name"));

  return onSnapshot(
    productQuery,
    (snapshot) => {
      const products = snapshot.docs.map((item, index) =>
        normalizeProduct({ ...item.data(), id: item.id }, index)
      );

      localStorage.setItem("products", JSON.stringify(products));
      onData(products);
    },
    onError
  );
};

export const subscribeOrders = async (onData, onError) => {
  await migrateOrdersToFirestore();

  const orderQuery = query(ordersCollection, orderBy("time", "desc"));

  return onSnapshot(
    orderQuery,
    (snapshot) => {
      const orders = snapshot.docs.map((item, index) =>
        normalizeOrder({ ...item.data(), id: item.id }, index)
      );

      onData(orders);
    },
    onError
  );
};

export const createProduct = async (product) => {
  const normalized = normalizeProduct(product);
  await setDoc(doc(productsCollection, String(normalized.id)), normalized);
  return normalized;
};

export const updateProduct = async (product) => {
  const normalized = normalizeProduct(product);
  await setDoc(doc(productsCollection, String(normalized.id)), normalized);
  return normalized;
};

export const getProductById = async (id) => {
  await ensureProductsInFirestore();

  const snapshot = await getDoc(doc(productsCollection, String(id)));

  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProduct({ ...snapshot.data(), id: snapshot.id });
};



export const createOrder = async (order) => {

  const orderWithOriginalPrices = {
    ...order,

    items: (order.items || order.cart || []).map((item) => ({
      ...item,

      productName:
        item.productName || item.name || "Product",

      productPrice:
        Number(item.productPrice ?? item.price ?? 0),

      originalPrice:
        Number(item.originalPrice ?? 0),

      qty:
        Number(item.qty ?? 1),
    })),
  };

  const normalized = normalizeOrder(orderWithOriginalPrices);

  const docRef = await addDoc(ordersCollection, normalized);

  return {
    ...normalized,
    id: docRef.id,
  };
};

export const updateOrder = async (order) => {
  const normalized = normalizeOrder(order);
  await setDoc(doc(ordersCollection, String(normalized.id)), normalized);
  return normalized;
};

export const toOrderViewModel = (order = {}) => {
  const normalized = normalizeOrder(order);

  return {
    ...normalized,
    cart: normalized.items.map((item, index) => ({
    id: `${normalized.id}_${index}`,
    name: item.productName,
    price: Number(item.productPrice || 0),
    originalPrice: Number(item.originalPrice || 0),
    qty: Number(item.qty || 1),
  })),
  };
};

export const deleteOrderById = async (orderId) => {
  await deleteDoc(doc(ordersCollection, String(orderId)));
};
