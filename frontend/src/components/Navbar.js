import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ cart = [] }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const navigate = useNavigate();
  // Calculate total items in the cart
  const totalItems = cart.length;

  // Calculate total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0
  );

  // const handleLogout = () => {
  //  localStorage.removeItem("token");
  //  navigate("/login");
  // };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Artisan Market
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/products" className="nav-links">
              Products
            </Link>
          </li>
        </ul>
        <div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>
          <FaShoppingCart />
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </div>
      </div>

      {/* Cart Dropdown */}
      {isCartOpen && (
        <div className="cart-dropdown">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {cart.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price}
                  </li>
                ))}
              </ul>
              <p>Total: ${Number(totalAmount).toFixed(2)}</p>
              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
