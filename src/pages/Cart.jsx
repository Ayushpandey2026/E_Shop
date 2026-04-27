import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api.js";
import Swal from "sweetalert2";
import { Trash2, Plus, Minus, MapPin, ShoppingBag, ChevronRight, Truck, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderPlacing, setOrderPlacing] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const fetchData = async () => {
      try {
        const [cartRes, addrRes] = await Promise.all([API.get("/cart"), API.get("/user/addresses")]);
        setCartItems(cartRes.data.cart?.items || []);
        setAddresses(addrRes.data || []);
        const defaultAddr = addrRes.data?.find(addr => addr.isDefault) || addrRes.data?.[0];
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
      } catch (error) {
        setCartItems([]);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [token, navigate]);

  // Total Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.productId?.price || 0) * (item.quantity || 1)), 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;
  const selectedAddr = addresses.find(addr => addr._id === selectedAddress);

  const handleRemove = async (productId) => {
    try {
      await API.delete("/cart/remove", { data: { productId } });
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
      Swal.fire({
        icon: "success",
        title: "Removed",
        text: "Item removed from cart",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Error", "Failed to remove item", "error");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(productId);
      return;
    }
    try {
      await API.post("/cart/update", { productId, quantity: newQuantity });
      setCartItems(cartItems.map(item =>
        item.productId._id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      Swal.fire("Error", "Failed to update quantity", "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Swal.fire("Error", "Please select a shipping address", "error");
      return;
    }
    setOrderPlacing(true);
    try {
      const res = await API.post("/order/create", { addressId: selectedAddress });
      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been confirmed",
        timer: 2000,
      }).then(() => navigate("/orders"));
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to place order", "error");
    } finally {
      setOrderPlacing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
      />
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Shopping Cart
              </h1>
              <p className="text-slate-500 text-lg">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} ready for checkout</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShoppingBag size={48} className="text-indigo-600" />
            </motion.div>
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-24"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
                <ShoppingBag size={48} className="text-indigo-600" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
              Time to fill it up! Explore our amazing collection of products and find something you love.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-indigo-300 transition-all inline-flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        ) : (
          /* Cart Content */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Items and Address */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Address Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 hover:border-indigo-300 transition-all">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full">
                      <MapPin size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Delivery Address</h3>
                      <p className="text-sm text-slate-500">Where should we send your order?</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  >
                    Edit
                  </motion.button>
                </div>
                {selectedAddr ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gradient-to-br from-slate-50 to-indigo-50 p-5 rounded-2xl border border-indigo-100"
                  >
                    <div className="inline-block px-3 py-1 bg-white border border-indigo-200 rounded-full text-xs font-bold uppercase text-indigo-600 mb-3">
                      {selectedAddr.type}
                    </div>
                    <p className="font-bold text-slate-900 text-lg">{selectedAddr.street}</p>
                    <p className="text-slate-600 mt-2">{selectedAddr.city}, {selectedAddr.state} - {selectedAddr.postalCode}</p>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate("/profile")}
                    className="w-full py-6 border-2 border-dashed border-indigo-300 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all font-bold text-lg flex items-center justify-center gap-2"
                  >
                    + Add Delivery Address
                  </motion.button>
                )}
              </motion.div>

              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item.productId._id}
                    variants={itemVariants}
                    className="group bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 flex items-center justify-center border-2 border-slate-100 group-hover:border-indigo-200 transition-all"
                      >
                        <img
                          src={item.productId.image}
                          alt={item.productId.title}
                          className="w-full h-full object-contain mix-blend-multiply p-3"
                        />
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-black text-slate-900 text-lg line-clamp-2">{item.productId.title}</h3>
                              <p className="text-sm text-slate-400 mt-2 uppercase tracking-widest font-semibold">
                                {item.productId.category}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemove(item.productId._id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                              <Trash2 size={20} />
                            </motion.button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                          {/* Quantity Control */}
                          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-full p-2 border border-slate-200">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                              className="p-2 hover:bg-white rounded-full transition-all text-slate-600"
                            >
                              <Minus size={18} />
                            </motion.button>
                            <span className="px-5 font-black text-slate-900 text-lg min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                              className="p-2 hover:bg-white rounded-full transition-all text-slate-600"
                            >
                              <Plus size={18} />
                            </motion.button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-sm text-slate-500 mb-1">Total</p>
                            <p className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              ₹{(item.productId.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Checkout Sidebar */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
                {/* Order Summary Header */}
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                  Order Summary
                  <span className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full">
                    {cartItems.length}
                  </span>
                </h3>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold">Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200"
                  >
                    <span className="text-emerald-700 font-semibold">Discount (10%)</span>
                    <span className="font-black text-emerald-600 text-lg">-₹{discount.toFixed(2)}</span>
                  </motion.div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-semibold flex items-center gap-2">
                      <Truck size={18} className="text-indigo-600" />
                      Shipping
                    </span>
                    <span className="font-black text-emerald-600">FREE</span>
                  </div>
                </div>

                {/* Total */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200 mb-8"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900">Total Amount</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </motion.div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder}
                  disabled={orderPlacing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {orderPlacing ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      ⏳
                    </motion.span>
                  ) : (
                    <>
                      Proceed to Checkout
                      <motion.div
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <ChevronRight size={20} />
                      </motion.div>
                    </>
                  )}
                </motion.button>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <Lock size={16} className="text-green-600" />
                  <span className="font-semibold">100% Secure Payment</span>
                </motion.div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500">✓</span> Free returns
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500">✓</span> Fast delivery
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500">✓</span> Seller guarantee
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;