import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import API from "../api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../style/MyProfile.css";

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

  // Add payment method form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    type: "credit_card",
    cardHolderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
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

        // 2) Fetch orders (FIXED: /order/my instead of /orders/my)
        const ordersRes = await API.get("/order/my");
        setOrders(ordersRes.data || []);

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
        console.error("❌ Profile fetch error:", err);
        setError("Failed to load some profile data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, navigate]);

  // ==================== PROFILE EDIT ====================
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

  // ==================== PASSWORD CHANGE ====================
  const handlePasswordChange = (e) =>
    setPasswordForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submitChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire('Error', "New password and confirm password do not match", 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Swal.fire('Error', "New password must be at least 6 characters", 'error');
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

  // ==================== PAYMENT METHOD MANAGEMENT ====================
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const submitAddPayment = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!paymentForm.type || !paymentForm.cardHolderName || !paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
      Swal.fire('Error', 'Please fill in all payment fields', 'error');
      return;
    }
    
    if (paymentForm.cardNumber.replace(/\s/g, '').length < 13) {
      Swal.fire('Error', 'Invalid card number', 'error');
      return;
    }
    
    if (paymentForm.cvv.length < 3) {
      Swal.fire('Error', 'Invalid CVV', 'error');
      return;
    }
    
    try {
      const res = await API.post("/user/payment", paymentForm);
      setPayments([...payments, res.data.payment]);
      setPaymentForm({ cardHolderName: "", cardNumber: "", expiryDate: "", cvv: "", isDefault: false });
      setShowPaymentForm(false);
      Swal.fire('Success!', 'Payment method added successfully', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to add payment method', 'error');
    }
  };

  const removePayment = async (id) => {
    Swal.fire({
      title: 'Remove Payment Method?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/user/payment/${id}`);
          setPayments((prev) => prev.filter((p) => p._id !== id));
          Swal.fire('Removed!', "Payment method removed successfully", 'success');
        } catch (err) {
          console.error(err);
          Swal.fire('Error', "Failed to delete payment method", 'error');
        }
      }
    });
  };

  // ==================== ADDRESS MANAGEMENT ====================
  const removeAddress = async (id) => {
    Swal.fire({
      title: 'Remove Address?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/user/address/${id}`);
          setAddresses((prev) => prev.filter((a) => a._id !== id));
          Swal.fire('Removed!', "Address removed successfully", 'success');
        } catch (err) {
          console.error(err);
          Swal.fire('Error', "Failed to delete address", 'error');
        }
      }
    });
  };

  // ==================== WISHLIST MANAGEMENT ====================
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

  // ==================== ORDER MANAGEMENT ====================
  const viewOrder = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // ==================== LOGOUT ====================
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  if (loading && !user) {
    return <div className="profile-root"><div className="spinner">Loading your profile...</div></div>;
  }

  return (
    <div className="profile-root">
      <div className="profile-wrapper">
        {/* ==================== LEFT SIDEBAR ==================== */}
        <aside className="profile-side">
          {/* Profile Card */}
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

          {/* Navigation */}
          <nav className="profile-nav">
            <button 
              className={activeTab === "account" ? "active" : ""} 
              onClick={() => setActiveTab("account")}
            >
              👤 Account
            </button>
            <button 
              className={activeTab === "orders" ? "active" : ""} 
              onClick={() => setActiveTab("orders")}
            >
              📦 Orders ({orders.length})
            </button>
            <button 
              className={activeTab === "wishlist" ? "active" : ""} 
              onClick={() => setActiveTab("wishlist")}
            >
              ❤️ Wishlist ({wishlist.length})
            </button>
            <button 
              className={activeTab === "addresses" ? "active" : ""} 
              onClick={() => setActiveTab("addresses")}
            >
              📍 Addresses
            </button>
            <button 
              className={activeTab === "payments" ? "active" : ""} 
              onClick={() => setActiveTab("payments")}
            >
              💳 Payments
            </button>
            <button 
              className={activeTab === "security" ? "active" : ""} 
              onClick={() => setActiveTab("security")}
            >
              🔐 Security
            </button>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </nav>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <section className="profile-main">
          {error && <div className="error-banner">{error}</div>}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="card">
              <h2>My Account</h2>
              {!isEditing ? (
                <>
                  <div className="profile-view">
                    <p><strong>Name</strong>{user?.name || "-"}</p>
                    <p><strong>Email</strong>{user?.email || "-"}</p>
                    <p><strong>Phone</strong>{user?.phone || "-"}</p>
                  </div>
                  <button className="btn-primary" onClick={handleEditProfile}>✏️ Edit Profile</button>
                </>
              ) : (
                <form className="form-grid" onSubmit={submitProfileUpdate}>
                  <label>
                    Full Name
                    <input 
                      name="name" 
                      value={editForm.name} 
                      onChange={handleEditChange} 
                      className={formErrors.name ? "error" : ""} 
                      placeholder="Enter your name"
                    />
                    {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                  </label>
                  <label>
                    Email Address
                    <input 
                      name="email" 
                      type="email" 
                      value={editForm.email} 
                      onChange={handleEditChange} 
                      className={formErrors.email ? "error" : ""} 
                      placeholder="Enter your email"
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </label>
                  <label>
                    Phone Number
                    <input 
                      name="phone" 
                      value={editForm.phone} 
                      onChange={handleEditChange} 
                      className={formErrors.phone ? "error" : ""} 
                      placeholder="10-digit phone number"
                    />
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
                      {loading ? '💾 Saving...' : '💾 Save Changes'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={handleCancelEdit}>❌ Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="card">
              <h2>My Orders</h2>
              <div className="orders-preview">
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <p>📦 No orders yet. Start shopping!</p>
                    <button className="btn-primary" onClick={() => navigate("/shop")}>Continue Shopping</button>
                  </div>
                ) : (
                  <>
                    {orders.slice(0, 6).map((order) => (
                      <div className="order-mini" key={order._id}>
                        <img src={order.items?.[0]?.productId?.image || "https://via.placeholder.com/80"} alt="p" />
                        <div className="om-info">
                          <div className="om-title">{order.items?.[0]?.productId?.title || "Product"}</div>
                          <div className="om-meta">₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}</div>
                          <div className={`om-status ${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>{order.status}</div>
                        </div>
                        <div className="om-actions">
                          <button onClick={() => viewOrder(order._id)}>👁️ View</button>
                        </div>
                      </div>
                    ))}
                    {orders.length > 6 && (
                      <div className="see-all">
                        <button onClick={() => navigate("/orders")}>View All Orders →</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="card">
              <h2>My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <p>❤️ Your wishlist is empty. Add your favorite products!</p>
                  <button className="btn-primary" onClick={() => navigate("/shop")}>Browse Products</button>
                </div>
              ) : (
                <div className="grid-cards">
                  {wishlist.map((p) => (
                    <div className="card-mini" key={p._id}>
                      <img src={p.image || "https://via.placeholder.com/140"} alt={p.title} />
                      <div className="card-mini-info">
                        <div className="title">{p.title}</div>
                        <div className="price">₹{p.price}</div>
                        <div className="mini-actions">
                          <button onClick={() => navigate(`/product/${p._id}`)}>👁️ View</button>
                          <button onClick={() => removeFromWishlist(p._id)} className="danger">🗑️ Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="card">
              <div className="section-header">
                <h2>My Addresses</h2>
                <button className="btn-primary" onClick={() => navigate("/edit-address/new")}>
                  ➕ Add New Address
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <p>📍 No saved addresses yet. Add your first address!</p>
                  <button className="btn-primary" onClick={() => navigate("/edit-address/new")}>
                    ➕ Add First Address
                  </button>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="address-card">
                      <div className="address-header">
                        <h3>{addr.type}</h3>
                        {addr.isDefault && <span className="badge">✓ Default</span>}
                      </div>
                      <p className="address-text">
                        {addr.street}<br />
                        {addr.city}, {addr.state} {addr.postalCode}<br />
                        {addr.country}
                      </p>
                      {addr.phone && <p className="address-phone">📞 {addr.phone}</p>}
                      <div className="address-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => navigate(`/edit-address/${addr._id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => removeAddress(addr._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payments" && (
            <div className="card">
              <h2>Payment Methods</h2>
              {!showPaymentForm ? (
                <>
                  {payments.length === 0 ? (
                    <div className="empty-state">
                      <p>💳 No saved payment methods. Add a payment method for faster checkout!</p>
                      <button className="btn-primary" onClick={() => setShowPaymentForm(true)}>
                        ➕ Add Payment Method
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="grid-cards">
                        {payments.map((payment) => (
                          <div className="card-mini" key={payment._id}>
                            <div className="card-mini-info">
                              <div className="title">{payment.type === 'paypal' ? 'PayPal' : '💳 Card'}</div>
                              <div className="price">•••• {payment.last4}</div>
                              <p className="small">{payment.cardHolderName}</p>
                              <p className="small">Expires {payment.expiryMonth}/{payment.expiryYear?.toString().slice(-2)}</p>
                              <div className="mini-actions">
                                {payment.isDefault && <span className="badge">✓ Default</span>}
                                <button onClick={() => removePayment(payment._id)} className="danger">🗑️ Remove</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn-primary" onClick={() => setShowPaymentForm(true)} style={{marginTop: '16px'}}>
                        ➕ Add Another Payment Method
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <form className="form-grid" onSubmit={submitAddPayment}>
                  <label>
                    Payment Type
                    <select
                      name="type"
                      value={paymentForm.type}
                      onChange={handlePaymentChange}
                      required
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </label>
                  <label>
                    Cardholder Name
                    <input 
                      type="text" 
                      name="cardHolderName" 
                      value={paymentForm.cardHolderName} 
                      onChange={handlePaymentChange} 
                      placeholder="Enter cardholder name"
                      required
                    />
                  </label>
                  <label>
                    Card Number
                    <input 
                      type="text" 
                      name="cardNumber" 
                      value={paymentForm.cardNumber} 
                      onChange={handlePaymentChange} 
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </label>
                  <label>
                    Expiry Date
                    <input 
                      type="text" 
                      name="expiryDate" 
                      value={paymentForm.expiryDate} 
                      onChange={handlePaymentChange} 
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </label>
                  <label>
                    CVV
                    <input 
                      type="text" 
                      name="cvv" 
                      value={paymentForm.cvv} 
                      onChange={handlePaymentChange} 
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      name="isDefault" 
                      checked={paymentForm.isDefault} 
                      onChange={handlePaymentChange}
                    />
                    Set as default payment method
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">💾 Add Payment Method</button>
                    <button type="button" className="btn-secondary" onClick={() => setShowPaymentForm(false)}>❌ Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="card">
              <h2>Security Settings</h2>
              <form className="form-grid" onSubmit={submitChangePassword}>
                <label>
                  Current Password
                  <input 
                    type="password" 
                    name="currentPassword" 
                    value={passwordForm.currentPassword} 
                    onChange={handlePasswordChange} 
                    placeholder="Enter current password"
                  />
                </label>
                <label>
                  New Password
                  <input 
                    type="password" 
                    name="newPassword" 
                    value={passwordForm.newPassword} 
                    onChange={handlePasswordChange} 
                    placeholder="Enter new password"
                  />
                </label>
                <label>
                  Confirm Password
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    value={passwordForm.confirmPassword} 
                    onChange={handlePasswordChange} 
                    placeholder="Confirm new password"
                  />
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">🔐 Change Password</button>
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

