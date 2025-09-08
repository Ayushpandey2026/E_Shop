import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/MyProfile.css";

export const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // UI state
  const [activeTab, setActiveTab] = useState("account"); // account, orders, wishlist, addresses, payments, security
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data state
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Edit profile form
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllProfileData();
    // eslint-disable-next-line
  }, []);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchAllProfileData = async () => {
    setLoading(true);
    try {
      // 1) fetch user profile
      const userRes = await axios.get(
        "http://localhost:8000/api/web/auth/me",
        authHeaders()
      ); // adjust endpoint as per backend
      setUser(userRes.data);
      setEditForm({
        name: userRes.data.name || "",
        email: userRes.data.email || "",
        phone: userRes.data.phone || "",
      });

      // 2) fetch user orders
      const ordersRes = await axios.get(
        "http://localhost:8000/api/web/order/my",
        authHeaders()
      );
      setOrders(ordersRes.data || []);

      // 3) fetch wishlist
      const wishRes = await axios.get(
        "http://localhost:8000/api/web/wishlist/my",
        authHeaders()
      );
      setWishlist(wishRes.data || []);

      // 4) fetch addresses
      const addrRes = await axios.get(
        "http://localhost:8000/api/web/user/addresses",
        authHeaders()
      );
      setAddresses(addrRes.data || []);

      // 5) fetch payment methods (if any)
      const payRes = await axios.get(
        "http://localhost:8000/api/web/user/payments",
        authHeaders()
      ).catch(()=>({ data: [] }));
      setPayments(payRes.data || []);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Profile update -----------------
  const handleEditChange = (e) =>
    setEditForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(
        "http://localhost:8000/api/web/auth/update",
        editForm,
        authHeaders()
      );
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Change password -----------------
  const handlePasswordChange = (e) =>
    setPasswordForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submitChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/web/auth/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        authHeaders()
      );
      alert("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to change password");
    }
  };

  // ----------------- Logout -----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    // optionally clear other storage
    navigate("/login");
  };

  // ----------------- Address CRUD (example: delete) -----------------
  const removeAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/web/user/address/${id}`, authHeaders());
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  // ----------------- Orders quick actions -----------------
  const viewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // ----------------- Wishlist quick remove -----------------
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/web/wishlist/${productId}`, authHeaders());
      setWishlist((prev) => prev.filter((w) => w._id !== productId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove from wishlist");
    }
  };

  if (loading && !user) {
    return <div className="profile-root"><div className="spinner">Loading...</div></div>;
  }

  return (
    <div className="profile-root">
      <div className="profile-wrapper">
        {/* Left Nav */}
        <aside className="profile-side">
          <div className="profile-card">
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <div className="avatar-fallback">{(user?.name || "U").charAt(0)}</div>
              )}
            </div>
            <div className="profile-info">
              <h3>{user?.name || "User"}</h3>
              <p className="small">{user?.email}</p>
            </div>
          </div>

          <nav className="profile-nav">
            <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>Account</button>
            <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</button>
            <button className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>Wishlist</button>
            <button className={activeTab === "addresses" ? "active" : ""} onClick={() => setActiveTab("addresses")}>Addresses</button>
            <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>Payments</button>
            <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>Security</button>
            <hr/>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        </aside>

        {/* Right Content */}
        <section className="profile-main">
          {error && <div className="error-banner">{error}</div>}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="card">
              <h2>My Account</h2>
              <form className="form-grid" onSubmit={submitProfileUpdate}>
                <label>
                  Name
                  <input name="name" value={editForm.name} onChange={handleEditChange} />
                </label>
                <label>
                  Email
                  <input name="email" value={editForm.email} onChange={handleEditChange} />
                </label>
                <label>
                  Phone
                  <input name="phone" value={editForm.phone} onChange={handleEditChange} />
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="card">
              <h2>My Orders</h2>
              <div className="orders-preview">
                {orders.length === 0 ? (
                  <p>No orders yet.</p>
                ) : (
                  orders.slice(0, 6).map((order) => (
                    <div className="order-mini" key={order._id}>
                      <img src={order.items?.[0]?.productId?.image || "https://via.placeholder.com/80"} alt="p" />
                      <div className="om-info">
                        <div className="om-title">{order.items?.[0]?.productId?.title || "Product"}</div>
                        <div className="om-meta">₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className={`om-status ${order.status?.toLowerCase()}`}>{order.status}</div>
                      </div>
                      <div className="om-actions">
                        <button onClick={() => viewOrder(order._id)}>View</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="see-all">
                <button onClick={() => navigate("/orders")}>See all orders</button>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="card">
              <h2>Wishlist</h2>
              {wishlist.length === 0 ? <p>No items in wishlist.</p> : (
                <div className="grid-cards">
                  {wishlist.map((p) => (
                    <div className="card-mini" key={p._id}>
                      <img src={p.image || "https://via.placeholder.com/140"} alt={p.title} />
                      <div className="card-mini-info">
                        <div className="title">{p.title}</div>
                        <div className="price">₹{p.price}</div>
                        <div className="mini-actions">
                          <button onClick={() => navigate(`/product/${p._id}`)}>View</button>
                          <button onClick={() => removeFromWishlist(p._id)} className="danger">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="card">
              <h2>Saved Addresses</h2>
              {addresses.length === 0 ? <p>No saved addresses.</p> : (
                <div className="addresses-list">
                  {addresses.map((a) => (
                    <div className="address-card" key={a._id}>
                      <div>
                        <div className="addr-name">{a.name || user?.name}</div>
                        <div className="addr-text">{a.street}, {a.city}, {a.state} - {a.postalCode}</div>
                        <div className="addr-meta">{a.phone}</div>
                      </div>
                      <div className="addr-actions">
                        <button onClick={() => navigate(`/edit-address/${a._id}`)}>Edit</button>
                        <button className="danger" onClick={() => removeAddress(a._id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate("/add-address")} className="btn-primary">Add New Address</button>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="card">
              <h2>Payment Methods</h2>
              {payments.length === 0 ? <p>No payment methods saved.</p> : (
                <div className="grid-cards">
                  {payments.map((p) => (
                    <div className="card-mini" key={p._id}>
                      <div className="card-mini-info">
                        <div className="title">{p.type} • ****{p.last4}</div>
                        <div className="mini-actions">
                          <button>Use</button>
                          <button className="danger">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="card">
              <h2>Security</h2>
              <form className="form-grid" onSubmit={submitChangePassword}>
                <label>
                  Current Password
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                </label>
                <label>
                  New Password
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                </label>
                <label>
                  Confirm New
                  <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Change Password</button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyProfile;
