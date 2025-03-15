import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/login"); // Redirect to the Login Page
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Artisan Market</h1>
        <p>Discover unique, handmade products crafted with love and passion.</p>
        <button onClick={handleShopNow} className="cta-button">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Home;
