// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
// import productData from "../data/shop.json";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { fetchProducts } from "../api/postApi";
import axios from "axios";
export const Home = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState([]);

  useEffect(()=>{
        axios.get("http://localhost:8000/api/web/product")
      .then((response) => {
        setProductData(response.data);
      }
      )
      .catch((error) => {
        console.error("Error fetching products:", error);
      });    
  },[]);


  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="home">
      {/* Banner */}
      <div className="banner">
        <div className="banner-overlay">
          <h1>Welcome to Our Shop!</h1>
          <p>Find the best products for you, hand-picked for your style.</p>
          <button
            onClick={() => (window.location.href = "/product")}
            className="shop-button"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Products Carousel */}
      <section className="featured-section">
        <h2>✨ Featured Products</h2>
        <Slider {...settings}>
          {productData.slice(0, 8).map((item) => (
            <div className="featured-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.title}</h3>
              <p>₹{item.price}</p>
              <button
                className="btn"
                onClick={() => dispatch(addToCart(item))}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
};
