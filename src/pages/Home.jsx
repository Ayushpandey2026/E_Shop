import React from "react";

export const Home = () => {
  return (
    
    <div className="home">
      <div className="banner">
        <div className="banner-overlay">

          <h1>Welcome to Our Shop!</h1>
          <p>Find the best products for you, hand-picked for your style.</p>
          <button onClick={() => window.location.href = '/product'} className="shop-button">
            Shop Now
          </button>
        </div>
      </div>

      {/* Other sections like featured products */}
      <div className="other-sections">
        {/* Display featured products, etc. */}
      </div>
    </div>
  );
};
