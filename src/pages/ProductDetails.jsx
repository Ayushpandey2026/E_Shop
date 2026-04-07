import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/CartSlice";
import axios from "axios";
import API from "../api.js";
import Swal from "sweetalert2";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/AuthContext";
import "../style/productDetail.css";

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

