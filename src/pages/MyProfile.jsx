import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/MyProfile.css";

export const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // UI state
  const [activeTab, setActiveTab] = useState("account"); // account, orders, wishlist, addresses, payments, security
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
  // useEffect(() => {
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   fetchAllProfileData();
  //   // eslint-disable-next-line
  // }, []);

  // const authHeaders = () => ({
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  // const fetchAllProfileData = async () => {
  //   setLoading(true);
  //   try {
  //     // 1) fetch user profile
  //     const userRes = await axios.get(
  //       "http://localhost:8000/api/web/auth/profile",
  //       authHeaders()
  //     ); // adjust endpoint as per backend
  //     setUser(userRes.data);
  //     setEditForm({
  //       name: userRes.data.name || "",
  //       email: userRes.data.email || "",
  //       phone: userRes.data.phone || "",
  //     });
  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1) Fetch user profile
      const res = await axios.get("https://e-shop-backend-iqb1.onrender.com/api/web/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // optional depending on backend auth config
      });
      setUser(res.data);
      setEditForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });

      // 2) Fetch orders
      const ordersRes = await axios.get("https://e-shop-backend-iqb1.onrender.com/api/web/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setOrders(ordersRes.data);

      // 3) Fetch wishlist
      const wishRes = await axios.get(
        "https://e-shop-backend-iqb1.onrender.com/api/web/wishlist/my",
        authHeaders()
      );
      setWishlist(wishRes.data || []);

      // 4) Fetch addresses
      const addrRes = await axios.get(
        "https://e-shop-backend-iqb1.onrender.com/api/web/user/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAddresses(addrRes.data || []);

      // 5) Fetch payment methods
      const payRes = await axios
        .get("https://e-shop-backend-iqb1.onrender.com/api/web/user/payments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .catch(() => ({ data: [] }));
      setPayments(payRes.data || []);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  fetchProfileData();
}, [token, navigate]);


  // ----------------- Profile update -----------------
  const handleEditChange = (e) =>
    setEditForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(
        "https://e-shop-backend-iqb1.onrender.com/api/web/auth/update",
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
        "https://e-shop-backend-iqb1.onrender.com/api/web/auth/change-password",
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
      await axios.delete(`https://e-shop-backend-iqb1.onrender.com/api/web/user/address/${id}`, authHeaders());
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

  // ---------------- Wishlist quick remove ----------------
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`https://e-shop-backend-iqb1.onrender.com/api/web/wishlist/${productId}`, authHeaders());
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
              {!isEditing ? (
                <div className="profile-view">
                  <p><strong>Name:</strong> {user?.name || "-"}</p>
                  <p><strong>Email:</strong> {user?.email || "-"}</p>
                  <p><strong>Phone:</strong> {user?.phone || "-"}</p>
                  <button className="btn-primary" onClick={handleEditProfile}>Edit Profile</button>
                </div>
              ) : (
                <form className="form-grid" onSubmit={(e) => { submitProfileUpdate(e); setIsEditing(false); }}>
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
                    <button type="button" className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              )}
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
