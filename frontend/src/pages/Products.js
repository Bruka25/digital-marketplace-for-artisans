import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:5000/products");
      console.log(response.data);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              // onError={(e) => {
              // e.target.onerror = null;
              // /  e.target.src = "default-image-url";
              // }} // Handle image load error
            />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
