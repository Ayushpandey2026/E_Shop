import { useEffect, useState } from "react";
import axios from "axios";
import "../adminstyle/AllOrder.css";
const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("tokrn",token);
       if (!token) {
      console.warn("No token found in localStorage");
      return;
    }
      
      const res = await axios.get("https://e-shop-backend-iqb1.onrender.com/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("data h", res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://e-shop-backend-iqb1.onrender.com/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchOrders(); // Refresh data
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>All Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((o) => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.userId?.email}</td>
              <td>{o.totalAmount} Rs</td>
              <td>{o.status}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrders;
