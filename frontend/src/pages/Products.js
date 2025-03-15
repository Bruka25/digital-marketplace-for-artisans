import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:5000/products");
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
            <img src={product.image} alt={product.name} />
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
