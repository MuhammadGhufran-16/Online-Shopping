import attaImg from "../images/attaImg.jpg";
import sugarImg from "../images/sugarImg.jpg";
import oilImg from "../images/oilImg.jpg";
import defaultGrocery from "../images/groceryImg.jpg";

export const seededProducts = [
  {
    id: "p1",
    name: "Aashirvaad Atta 5kg",
    price: 420,
    image: attaImg,
    images: [attaImg],
    category: "grocery",
  },
  {
    id: "p2",
    name: "Organic Sugar 1kg",
    price: 65,
    image: sugarImg,
    images: [sugarImg],
    category: "grocery",
  },
  {
    id: "p3",
    name: "Sunflower Oil 1L",
    price: 210,
    image: oilImg,
    images: [oilImg],
    category: "grocery",
  },
];

const findSeedProduct = (product = {}) => {
  const productId = String(product.id || "").trim().toLowerCase();
  const productName = String(product.name || "").trim().toLowerCase();

  return seededProducts.find((seed) => {
    return (
      seed.id.toLowerCase() === productId ||
      seed.name.trim().toLowerCase() === productName
    );
  });
};

const normalizeImagePath = (imagePath = "") => {
  const value = String(imagePath || "").trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("images/")) {
    return `/${value}`;
  }

  return value;
};

export const getProductImage = (product = {}) => {
  const images = Array.isArray(product.images)
    ? product.images.map(normalizeImagePath).filter(Boolean)
    : [];

  return (
    images[0] ||
    normalizeImagePath(product.image) ||
    findSeedProduct(product)?.image ||
    defaultGrocery
  );
};

export const normalizeProduct = (product = {}, index = 0) => {
  const seed = findSeedProduct(product);
  const incomingImages = Array.isArray(product.images)
    ? product.images
    : [product.image];
  const images = incomingImages.map(normalizeImagePath).filter(Boolean);
  const primaryImage =
    images[0] || findSeedProduct(product)?.image || defaultGrocery;

  return {
    ...product,
    id: product.id || seed?.id || `prod_${index}`,
    name: product.name || seed?.name || "Product",
    price: Number(product.price ?? seed?.price ?? 0),
    category: product.category || seed?.category || "grocery",
    image: primaryImage,
    images: images.length > 0 ? images : [primaryImage],
  };
};

export const normalizeProducts = (products = []) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.map((product, index) => normalizeProduct(product, index));
};

export const fallbackProductImage = defaultGrocery;
