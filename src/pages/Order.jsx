import axios from "axios";
import React, { useEffect, useState } from "react";
import API from "../api.js";
import "../style/Order.css";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ✅ Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await API.get("/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // ✅ scroll top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    let matchesTime = true;
    const orderYear = new Date(order.createdAt).getFullYear();
    if (timeFilter !== "All") {
      if (timeFilter === "Last 30 days") {
        const diff =
          (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24);
        matchesTime = diff <= 30;
      } else if (timeFilter === "Older") {
        matchesTime = orderYear < 2021;
      } else {
        matchesTime = orderYear === parseInt(timeFilter);
      }
    }

    // ✅ search among product names
    const matchesSearch = order.items.some((item) =>
      item.productId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesSearch && matchesStatus && matchesTime;
  });

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {/* Search + Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search your orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>On the way</option>
          <option>Delivered</option>
          <option>Cancelled</option>
          <option>Returned</option>
        </select>

        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option>All</option>
          <option>Last 30 days</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
          <option>2021</option>
          <option>Older</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img
                    src={item.productId?.image || "https://via.placeholder.com/120"}
                    alt={item.productId?.title}
                  />
                  <div className="order-info">
                    <h3>{item.productId?.title}</h3>
                    <p>₹{item.productId?.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>
                      Ordered on:{" "}
                      <span className="delivery-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p className={`status ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆ Top
        </button>
      )}
    </div>
  );
};
