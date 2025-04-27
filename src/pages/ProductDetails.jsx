import { useParams } from "react-router-dom";
import productData from "../data/shop.json";

export const ProductDetails= () => {
  const { id } = useParams();
  const product = productData.find((p) => p.id === (id));

  if (!product) {
    console.warn("Product not found for ID:", id);
    return <h2>Product not found</h2>;
  }


  const { name, price, image,description } = product;

  return (
    <div className="product-container page">
      <h1 className="heading">Product Details</h1>
      <div className="product-card" style={{ maxWidth: "400px", margin: "auto" }}>
        <img src={image} alt={name} className="product-image" />
        <div className="product-info">
          <h2 className="product-name">{name}</h2>
          <p className="product-price">₹{price}</p>
          <p className="product-description">{description}</p>
        </div>
      </div>
    </div>
  );
};
