import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch users and products
  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await axios.get("http://localhost:5000/users");
      const productsResponse = await axios.get(
        "http://localhost:5000/products"
      );
      setUsers(usersResponse.data);
      setProducts(productsResponse.data);
    };
    fetchData();
  }, []);

  // Delete a user
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  };

  // Delete a product
  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <div className="section">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Products Section */}
      <div className="section">
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Artisan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.artisan_id}</td>
                <td>
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
