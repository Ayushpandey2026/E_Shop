import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api.js";
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

  // Profile picture upload
  const [selectedFile, setSelectedFile] = useState(null);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
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
      const res = await API.get("/auth/profile", {
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
      const ordersRes = await API.get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setOrders(ordersRes.data);

      // 3) Fetch wishlist
      const wishRes = await API.get(
        "/wishlist/my",
        authHeaders()
      );
      setWishlist(wishRes.data || []);

      // 4) Fetch addresses
      const addrRes = await API.get(
        "/user/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setAddresses(addrRes.data || []);

      // 5) Fetch payment methods
      const payRes = await API
        .get("/user/payments", {
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
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((s) => ({ ...s, [name]: value }));
    // Clear error on change
    if (formErrors[name]) {
      setFormErrors((s) => ({ ...s, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) errors.email = "Invalid email format";
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(editForm.phone)) errors.phone = "Phone must be 10 digits";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setSelectedFile(null);
    setFormErrors({ name: "", email: "", phone: "" });
    setIsEditing(false);
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("email", editForm.email);
      formData.append("phone", editForm.phone);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const res = await API.put("/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(res.data);
      setSelectedFile(null);
      alert("Profile updated successfully");
      setIsEditing(false);
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
      await API.post(
        "/auth/change-password",
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
      await API.delete(`/user/address/${id}`, authHeaders());
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
      await API.delete(`/wishlist/${productId}`, authHeaders());
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Name
                    <input name="name" value={editForm.name} onChange={handleEditChange} className={formErrors.name ? "error" : ""} />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </label>
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 4.26C11.2187 4.10222 11.5817 4.10222 11.91 4.26L19.8 8M21 8V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V8M21 8L19.8 8M3 8L4.2 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Email
                    <input name="email" value={editForm.email} onChange={handleEditChange} className={formErrors.email ? "error" : ""} />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </label>
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 9H21M9 3V21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Phone
                    <input name="phone" value={editForm.phone} onChange={handleEditChange} className={formErrors.phone ? "error" : ""} />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </label>
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 16L8.586 11.414C9.36768 10.6323 10.6323 10.6323 11.414 11.414L16 16M14 14L15.586 12.414C16.3677 11.6323 17.6323 11.6323 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Profile Picture
                    <input type="file" accept="image/*" onChange={handleFileChange} />
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
