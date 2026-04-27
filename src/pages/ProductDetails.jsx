import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/CartSlice";
import axios from "axios";
import API from "../api.js";
import Swal from "sweetalert2";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/AuthContext";
import { FaHeart } from "react-icons/fa";
import { Heart, Star, ShoppingCart, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const { loading, error } = cartState;
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(location.state?.product || null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product and similar products
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        try {
          // Fetch from FakeStoreAPI
          const res = await axios.get(`https://fakestoreapi.com/products/${id}`);
          const data = {
            _id: res.data.id.toString(),
            title: res.data.title,
            price: res.data.price,
            description: res.data.description,
            image: res.data.image,
            category: res.data.category,
            rating: res.data.rating
          };
          setProduct(data);

          // Fetch similar products by category
          const res2 = await axios.get(
            `https://fakestoreapi.com/products/category/${data.category}`
          );
          const data2 = res2.data.map((p) => ({
            _id: p.id.toString(),
            title: p.title,
            price: p.price,
            description: p.description,
            image: p.image,
            category: p.category,
            rating: p.rating
          }));
          setSimilarProducts(data2.filter((p) => p._id !== data._id));
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      } else {
        // Product already in state, fetch similar
        axios.get(`https://fakestoreapi.com/products/category/${product.category}`)
          .then((res) => {
            const data2 = res.data.map((p) => ({
              _id: p.id.toString(),
              title: p.title,
              price: p.price,
              description: p.description,
              image: p.image,
              category: p.category,
              rating: p.rating
            }));
            return data2;
          })
          .then((data2) =>
            setSimilarProducts(data2.filter((p) => p._id !== product._id))
          );
      }
    };
    fetchProduct();
  }, [id, product]);

  // Fetch wishlist status
  useEffect(() => {
    if (isLoggedIn && product) {
      checkWishlistStatus();
    }
  }, [isLoggedIn, product]);

  const checkWishlistStatus = async () => {
    try {
      const response = await API.get("/wishlist/my");
      const wishlist = response.data || [];
      setIsInWishlist(wishlist.some(w => w._id === product._id));
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to use wishlist",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await API.delete(`/wishlist/${product._id}`);
        setIsInWishlist(false);
        Swal.fire({
          icon: "success",
          title: "Removed",
          text: "Product removed from wishlist",
          timer: 1200,
          showConfirmButton: false
        });
      } else {
        // Add to wishlist
        await API.post(`/wishlist/add`, { productId: product._id });
        setIsInWishlist(true);
        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Product added to wishlist",
          timer: 1200,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update wishlist",
        timer: 1500
      });
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 }));
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${product.title} has been added to your cart`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || 'Failed to add to cart',
      });
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      alert("Please login first!");
      return navigate("/login");
    }

    const token = localStorage.getItem("token");
    const amount = product.price * 100; // Razorpay uses paise

    try {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        const { data: order } = await axios.post(
          "/payment/order",
          { amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: "rzp_test_xxxxxxxx", // TODO: Replace with your Razorpay test/live key
          amount: order.amount,
          currency: order.currency,
          name: "MyShop",
          description: `Purchase: ${product.title}`,
          order_id: order.id,
          handler: async function (response) {
            try {
              await axios.post(
                "/payment/verify",
                {
                  ...response,
                  cart: [{ productId: product._id, qty: 1 }],
                  userId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              navigate("/order-success");
            } catch (err) {
              console.error("Payment verification failed:", err);
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name || "" : "",
            email: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).email || "" : "",
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed.");
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Product Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16"
        >
          {/* Product Image */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              <img
                src={product.image}
                alt={product.title}
                className="max-w-sm max-h-96 object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            {/* Category Tag */}
            <div className="inline-block w-fit mb-4">
              <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating.rate) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                    />
                  ))}
                </div>
                <span className="text-slate-600 font-semibold">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-8 pb-8 border-b-2 border-slate-200">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-slate-500 line-through text-xl">
                  ₹{(product.price * 1.3).toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-black text-sm">
                  23% OFF
                </span>
              </div>
              <p className="text-slate-600 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-slate-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
              >
                <ShoppingCart size={24} />
                {loading ? "Adding..." : "Add to Cart"}
              </motion.button>

              {/* Buy Now Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-lg"
              >
                <Zap size={24} />
                Buy Now
              </motion.button>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWishlistToggle}
                className={`w-full py-4 px-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border-2 ${
                  isInWishlist
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              >
                <Heart
                  size={24}
                  className={isInWishlist ? "fill-current" : ""}
                />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t-2 border-slate-200">
              <div className="flex flex-col items-center gap-2 text-center">
                <TrendingUp size={24} className="text-indigo-600" />
                <p className="text-xs font-bold text-slate-900">Best Seller</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="text-2xl">🚚</div>
                <p className="text-xs font-bold text-slate-900">Free Delivery</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="text-2xl">🔒</div>
                <p className="text-xs font-bold text-slate-900">Secure Buy</p>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-semibold">
                {error}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <ReviewsSection productId={product._id} />
        </motion.div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-10 text-gradient">
              Similar Products You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 hover:border-indigo-300 transition-all overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`, { state: { product: p } })}
                >
                  <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 p-4"
                    />
                    <span className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Similar
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">
                      {p.category}
                    </p>
                    <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {p.title}
                    </h3>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black text-indigo-600">
                        ₹{p.price.toFixed(2)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

