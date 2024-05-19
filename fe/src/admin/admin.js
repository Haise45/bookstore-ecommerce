import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import AddBook from "./components/BookManage/AddBook";
import BookDetails from "./components/BookManage/BookDetails";
import EditBook from "./components/BookManage/EditBook";
import OrderDetail from "./components/OrderManage/OrderDetails";
import Book from "./pages/BookPage";
import Category from "./pages/CategoryPage";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/OrderPage";
import User from "./pages/UserPage";

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = getCookie("token");

    if (!jwtToken) {
      navigate("/");
    }
  }, []);

  // Hàm để lấy giá trị của cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Book />} />
            <Route path="/books/:_id" element={<BookDetails />} />
            <Route path="/books/:_id/edit" element={<EditBook />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/users" element={<User />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/orders/:_id" element={<OrderDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
