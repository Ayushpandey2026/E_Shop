import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


export const MyProfile = () => {
  const navigate = useNavigate();
  const { token, user: authUser } = useAuth();

  // UI state
  const [activeTab, setActiveTab] = useState("account");
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
  const [previewUrl, setPreviewUrl] = useState(null);

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1) Fetch user profile
        const res = await API.get("/auth/profile");
        setUser(res.data);
        setEditForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });

        // 2) Fetch orders
        const ordersRes = await API.get("/orders/my");
        setOrders(ordersRes.data);

        // 3) Fetch wishlist
        const wishRes = await API.get("/wishlist/my");
        setWishlist(wishRes.data || []);

        // 4) Fetch addresses
        const addrRes = await API.get("/user/addresses");
        setAddresses(addrRes.data || []);

        // 5) Fetch payment methods
        const payRes = await API.get("/user/payments").catch(() => ({ data: [] }));
        setPayments(payRes.data || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        Swal.fire('Error', 'Failed to load profile data.', 'error');
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
    if (formErrors[name]) {
      setFormErrors((s) => ({ ...s, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) errors.email = "Invalid email format";
    const phoneRegex = /^\d{10}$/;
    if (editForm.phone && !phoneRegex.test(editForm.phone)) errors.phone = "Phone must be 10 digits";
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
    setPreviewUrl(null);
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
      if (editForm.phone) formData.append("phone", editForm.phone);
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const res = await API.put("/auth/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      Swal.fire('Success!', 'Profile updated successfully!', 'success');
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      Swal.fire('Error!', err?.response?.data?.message || "Failed to update profile", 'error');
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
      Swal.fire('Error', "New password and confirm password do not match", 'error');
      return;
    }
    try {
      await API.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      Swal.fire('Success!', "Password changed successfully", 'success');
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.message || "Failed to change password", 'error');
    }
  };

  // ----------------- Logout -----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ----------------- Address CRUD -----------------
  const removeAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await API.delete(`/user/address/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      Swal.fire('Success!', "Address removed", 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', "Failed to delete address", 'error');
    }
  };

  // ----------------- Orders quick actions -----------------
  const viewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // ---------------- Wishlist quick remove ----------------
  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((w) => w._id !== productId));
      Swal.fire('Success!', "Removed from wishlist", 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', "Failed to remove from wishlist", 'error');
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
              {previewUrl ? (
                <img src={previewUrl} alt="preview" />
              ) : user?.avatar ? (
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
                <form className="form-grid" onSubmit={submitProfileUpdate}>
                  <label>
                    Name
                    <input name="name" value={editForm.name} onChange={handleEditChange} className={formErrors.name ? "error" : ""} />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </label>
                  <label>
                    Email
                    <input name="email" type="email" value={editForm.email} onChange={handleEditChange} className={formErrors.email ? "error" : ""} />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </label>
                  <label>
                    Phone
                    <input name="phone" value={editForm.phone} onChange={handleEditChange} className={formErrors.phone ? "error" : ""} />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </label>
                  <label>
                    Profile Picture
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {previewUrl && (
                      <img src={previewUrl} alt="Preview" style={{width: '80px', height: '80px', objectFit: 'cover', marginTop: '8px', borderRadius: '8px'}} />
                    )}
                  </label>
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Other tabs unchanged ... */}
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
                        <div className={`om-status ${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>{order.status}</div>
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

          {/* Simplified other tabs for brevity */}
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

          {/* Other tabs placeholder */}
          {activeTab === "addresses" && (
            <div className="card">
              <div className="section-header">
                <h2>My Addresses</h2>
                <button className="btn-primary" onClick={() => navigate("/edit-address/new")}>
                  Add New Address
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <p>No addresses saved yet.</p>
                  <button className="btn-primary" onClick={() => navigate("/edit-address/new")}>
                    Add First Address
                  </button>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="address-card">
                      <div className="address-header">
                        <h3>{addr.type}</h3>
                        {addr.isDefault && <span className="badge">Default</span>}
                      </div>
                      <p className="address-text">
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.postalCode}<br />
                        {addr.country}
                      </p>
                      {addr.phone && <p className="address-phone">{addr.phone}</p>}
                      <div className="address-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => navigate(`/edit-address/${addr._id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => removeAddress(addr._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {['payments', 'cart', 'recommendations'].includes(activeTab) && (
            <div className="card">
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p>Content for {activeTab} tab.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyProfile;

