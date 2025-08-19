import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { fetchProducts } from "../api/postApi";
import "../style/productDetail.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
// import axios from "axios";
import { useLocation } from "react-router-dom";

export const ProductDetails = () => {
  const dispatch =useDispatch();
 const { id } = useParams();
const location = useLocation();

const product = location.state?.product;

  
  // const [product, setProduct] = useState(null);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //     const response  = await axios.get(`http://localhost:8000/api/web/product/${id}`);
  //     const res = response.data;
  //     setProduct(res);
  //     console.log(res);
      
  //     const found = res.find((p) => String(p.id) === id);
  //     console.log(id);
      
  //     // setProduct(found);
  //     } catch (error) {
  //       console.error("Error fetching product:", error);
  //     }
  //   }
  //   fetchProduct();
  // }, [id]);

  if (!product) {
    return <h2 className="not-found">Product not found</h2>;
  }

  const { title, price, image, description, category, rating } = product;

  return (
    <div className="product-page">
      <div className="product-wrapper">
        <div className="image-section">
          <img src={image} alt={title} />
        </div>
        <div className="info-section">
          <h1 className="product-title">{title}</h1>
          <p className="product-category">{category}</p>
          <p className="product-rating">⭐ {rating.rate} ({rating.count} reviews)</p>
          <p className="product-price">₹{price}</p>
          <p className="product-description">{description}</p>
          <button className="add-btn" onClick={() => dispatch(addToCart(product))} >Add to Cart</button>
        </div>
      </div>
    </div>
  );
};
