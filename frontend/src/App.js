import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Grocery from "./pages/Grocery";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Cart from "./components/Cart";
import CartDialog from "./components/CartDialog";
import Checkout from "./components/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

import AdminMenu from "./admin/AdminMenu";
import AdminLogin from "./admin/AdminLogin";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import OrdersList from "./admin/OrdersList";
import AdminProductsList from "./admin/AdminProductsList";


function App() {
  return (
    <BrowserRouter basename="/Online-Shopping">
      <Navbar />
      <CartDialog />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grocery" element={<Grocery />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminMenu />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute>
            <AdminProductsList />
          </ProtectedRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit/:id" element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <OrdersList />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
