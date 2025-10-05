// Home.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import API from "../api.js";
import "../style/Home.css"; 

export const Home = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);

 useEffect(() => {
  API
    .get("/product")
    .then((response) => {
      console.log("API Response:", response.data); // 🔍
      setProductData(response.data);
    })
    .catch((error) => console.error("Error fetching products:", error));
}, []);


  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="banner">
        <div className="banner-overlay">
          <h1>Welcome to MiniShop</h1>
          <p>Best deals on top categories – curated just for you.</p>
          <button
            onClick={() => (window.location.href = "/product")}
            className="shop-button"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <section className="featured-section">
        <h2 className="section-title">✨ Featured Products</h2>
        <Slider {...settings}>
          {productData.slice(0, 10).map((item) => (
            <div className="featured-card" key={item._id}>
              <div className="card-content">
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <button
                  className="btn add-cart"
                  onClick={() => dispatch(addToCart(item))}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
};


