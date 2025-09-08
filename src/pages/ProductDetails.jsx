import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice"; 
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

  // Fetch product only if not coming from state
  useEffect(() => {
    const fetchProduct = async () => {
      if (!product) {
        try {
          const res = await fetch(`http://localhost:8000/api/products/${id}`);
          const data = await res.json();
          setProduct(data);

          // Fetch similar products
          const res2 = await fetch(
            `http://localhost:8000/api/products?category=${data.category}`
          );
          const data2 = await res2.json();
          setSimilarProducts(data2.filter((p) => p._id !== data._id));
        } catch (err) {
          console.error("Error fetching product:", err);
        }
      } else {
        // If product already in state, still fetch similar products
        fetch(`http://localhost:8000/api/products?category=${product.category}`)
          .then((res) => res.json())
          .then((data2) =>
            setSimilarProducts(data2.filter((p) => p._id !== product._id))
          );
      }
    };
    fetchProduct();
  }, [id, product]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return navigate("/login");
    }
    dispatch(addToCart({ productId: product._id, quantity: 1, token }));
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy: ${product.title}`);
    // navigate("/checkout", { state: { product } });
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
