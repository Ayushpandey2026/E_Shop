
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/CartSlice";
import axios from "axios";
import API from "../api.js";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/AuthContext";
import "../style/productDetail.css";

export const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [similarProducts, setSimilarProducts] = useState([]);

  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const { loading, error } = cartState;
  const { user } = useAuth();

  // Fetch product and similar products
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        try {
          const res = await API.get(`/product/${id}`);
          const data = res.data;
          setProduct(data);

          const res2 = await API.get(
            `/product?category=${data.category}`
          );
          const data2 = res2.data;
          setSimilarProducts(data2.filter((p) => p._id !== data._id));
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      } else {
        // Product already in state, fetch similar
        API.get(`/product?category=${product.category}`)
          .then((res) => res.data)
          .then((data2) =>
            setSimilarProducts(data2.filter((p) => p._id !== product._id))
          );
      }
    };
    fetchProduct();
  }, [id, product]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login first!");
      return navigate("/login");
    }
    dispatch(addToCart({ productId: product._id, quantity: 1, token: localStorage.getItem("token") }));
  };

  const handleBuyNow = async () => {
    if (!user) {
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
                  userId: user.id,
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
            name: user.name || "", // Optional
            email: user.email || "", // Optional
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

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-details-container">
      {/* Left: Product Image */}
      <div className="product-image">
        <img src={product.image} alt={product.title} />
      </div>

      {/* Right: Product Info */}
      <div className="product-info">
        <h1>{product.title}</h1>
        <p className="price">₹ {product.price}</p>
        <p className="description">{product.description}</p>

        <div className="buttons">
          <button onClick={handleAddToCart} disabled={loading}>
            {loading ? "Adding..." : "Add to Cart"}
          </button>
          <button className="buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Reviews Section */}
      <ReviewsSection productId={product._id} />

      {/* Similar Products */}
      <div className="similar-products">
        <h2>Similar Products</h2>
        <div className="product-grid">
          {similarProducts.length > 0 ? (
            similarProducts.map((p) => (
              <div key={p._id} className="similar-product-card">
                <img src={p.image} alt={p.title} />
                <h3>{p.title}</h3>
                <p>₹ {p.price}</p>
                <a href={`/product/${p._id}`} className="view-details">
                  View Details
                </a>
              </div>
            ))
          ) : (
            <p>No similar products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
