# Containerization and Deployment Guide

## Overview

This project utilizes Docker to containerize the frontend, backend, and PostgreSQL database. The `docker-compose.yml` file orchestrates the setup, allowing seamless deployment and management of the services.

## Prerequisites

Before running the containerized application, ensure you have the following installed on your system:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── src/
│   ├── package.json
│   ├── ...
├── frontend
│   ├── Dockerfile
│   ├── src/
│   ├── package.json
│   ├── ...
├── docker-compose.yml
└── README.md
```

## Docker Compose Configuration

The `docker-compose.yml` file defines three services:

- **db**: PostgreSQL database
- **backend**: Node.js backend API
- **frontend**: React frontend

### `docker-compose.yml`

```yaml
version: "3.8"
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 12345
      POSTGRES_DB: digital_marketplace
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_USER: postgres
      DB_PASSWORD: 12345
      DB_NAME: digital_marketplace
      DB_PORT: 5432
      JWT_SECRET: your_jwt_secret
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Steps to Containerize and Deploy

### 1. Build and Start Containers

Run the following command to build and start all containers:

```sh
docker-compose up --build
```

### 2. Stop Containers

To stop all running containers, use:

```sh
docker-compose down
```

### 3. Accessing Services

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Database**: Accessible at `localhost:5432`

## Scaling the Application

To scale the backend services, you can specify the number of instances to run:

```sh
docker-compose up --scale backend=3
```

This will create three instances of the backend service to handle more requests.

## Deployment Strategy

### 1. Deploying with Docker Compose (Single Server)

On a cloud VM (AWS EC2, DigitalOcean, etc.), clone the repository and run:

```sh
docker-compose up -d
```

This will start the containers in detached mode.

### 2. Deploying with Kubernetes (Advanced)

For scalability, consider deploying with Kubernetes:

- Create Kubernetes manifests for each service.
- Use a `Deployment` for backend and frontend.
- Use a `StatefulSet` for PostgreSQL.
- Configure `Ingress` for public access.

### 3. Using a Cloud Provider

You can deploy containers to services like:

- AWS ECS (Elastic Container Service)
- Google Kubernetes Engine (GKE)
- Azure Kubernetes Service (AKS)
- DigitalOcean App Platform

## Conclusion

By containerizing the application, we ensure consistency across environments, streamline deployment, and enable scalability. Future improvements can include CI/CD pipelines for automated deployment and orchestration with Kubernetes for high availability.

# Digital Marketplace Backend

This is the backend API for the **Digital Marketplace**, built using **Node.js, Express, and PostgreSQL**. It provides authentication, product management, cart functionality, orders, and user management.

## Features

- **User Authentication** (Register, Login, JWT-based authentication)
- **Product Management** (CRUD operations)
- **Cart Management** (Add, Retrieve, Delete items from the cart)
- **Order Management** (Place, View, and Manage orders)
- **User Management** (Retrieve all users, delete users)
- **Role-based Access Control** (Admin permissions for managing orders)
- **PostgreSQL Database Integration**
- **Docker Support**

---

## Tech Stack

- **Node.js** (Express.js)
- **PostgreSQL** (Database)
- **bcrypt.js** (Password Hashing)
- **jsonwebtoken** (JWT Authentication)
- **dotenv** (Environment Variables)
- **Docker** (Containerization)
- **Postman** (API Testing)

---

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Bruka25/digital-marketplace-for-artisans.git
cd backend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=12345
DB_NAME=digital_marketplace
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

### 4. Set Up Database

Make sure **PostgreSQL** is installed and running. Then, create the database:

```sh
psql -U postgres -c "CREATE DATABASE digital_marketplace;"
```

### 5. Run the Server

```sh
npm start
```

The server will start at **http://localhost:5000**.

---

## Running with Docker

### 1. Build the Docker Image

```sh
docker build -t backend .
```

### 2. Run the Container

```sh
docker run -p 5000:5000 --env-file .env backend
```

---

## Code Structure

### App.js

```jsx
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/users");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

module.exports = app;
```

## API Documentation

### 1. **Authentication Routes**

#### **Register User**

**Endpoint:** `POST /auth/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "User"
}
```

**Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "User"
}
```

#### **Login User**

**Endpoint:** `POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "your_jwt_token"
}
```

### 2. **Products Routes**

#### **Add Product (Authenticated Users Only)**

**Endpoint:** `POST /products`
**Headers:** `Authorization: Bearer <token>`

```json
{
  "name": "Handmade Necklace",
  "description": "Beautiful artisan necklace",
  "price": 50.0,
  "image": "https://example.com/image.jpg",
  "category": "Jewelry"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "Handmade Necklace",
  "price": 50.0
}
```

#### **Fetch All Products**

**Endpoint:** `GET /products`
**Response:**

```json
[
  {
    "id": 1,
    "name": "Handmade Necklace",
    "price": 50.0
  }
]
```

### 3. **Cart Routes**

#### **Add Item to Cart**

**Endpoint:** `POST /cart`
**Headers:** `Authorization: Bearer <token>`

```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:**

```json
{
  "id": 1,
  "product_id": 1,
  "quantity": 2
}
```

#### **Get Cart Items**

**Endpoint:** `GET /cart`
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
[
  {
    "id": 1,
    "product_id": 1,
    "quantity": 2,
    "name": "Handmade Necklace",
    "price": 50.0
  }
]
```

#### **Remove Item from Cart**

**Endpoint:** `DELETE /cart/:id`
**Headers:** `Authorization: Bearer <token>`

---

### 4. **Order Routes**

#### **Place an Order**

**Endpoint:** `POST /orders`
**Headers:** `Authorization: Bearer <token>`

```json
{
  "products": [{ "product_id": 1, "quantity": 2 }]
}
```

**Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "status": "Pending"
}
```

#### **Get User Orders**

**Endpoint:** `GET /orders`
**Headers:** `Authorization: Bearer <token>`

---

### 5. **User Routes**

#### **Fetch All Users (Admin Only)**

**Endpoint:** `GET /users`
**Headers:** `Authorization: Bearer <token>`

#### **Delete a User (Admin Only)**

**Endpoint:** `DELETE /users/:id`
**Headers:** `Authorization: Bearer <token>`

---

## Testing with Postman

1. **Import API Requests**

   - Open Postman and create a new collection.
   - Add requests for authentication, product, cart, and order routes.

2. **Authenticate and Get a Token**

   - First, register a user using `POST /auth/register`.
   - Then, log in using `POST /auth/login` to receive a JWT token.
   - Use this token in the `Authorization` header for protected routes.

3. **Test API Endpoints**
   - Add products, cart items, and place orders to check the functionality.
   - Ensure the correct response is returned.

---

# Frontend - Artisan Marketplace

## Overview

This is the frontend of the Artisan Marketplace, built using React. It provides a platform for users to browse and purchase handmade products, while artisans can register and sell their products.

## Features

- User authentication (login & registration)
- Browse and purchase products
- Artisan dashboard for product management
- Admin dashboard for user and product management

## Setup

### Prerequisites

- Node.js (v16 recommended)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/Bruka25/digital-marketplace-for-artisans
cd frontend

# Install dependencies
npm install
```

### Running the Application

```sh
npm start
```

This will start the development server at `http://localhost:3000/`.

## Docker Setup

To run the frontend using Docker:

```sh
docker build -t frontend .
docker run -p 3000:3000 frontend
```

## Code Structure

### App.js

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import Artisans from "./pages/Artisans";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/artisans" element={<Artisans />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

## API Integration

The frontend interacts with the backend through the following API endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /products` - Fetch available products
- `POST /products` - Artisan adds a new product
- `DELETE /products/:id` - Admin deletes a product
- `GET /users` - Admin fetches all users
- `DELETE /users/:id` - Admin deletes a user

## Testing API with Postman

Use the following sample requests to test API endpoints:

### User Registration

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Customer"
}
```

### User Login

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Add a Product (Artisan)

```json
{
  "name": "Handmade Mug",
  "description": "A beautiful ceramic mug.",
  "price": 25,
  "image": "http://example.com/mug.jpg",
  "category": "Ceramics"
}
```

## Deployment

To deploy the frontend, you can use services like Vercel, Netlify, or AWS S3.

### Deploying to Vercel

```sh
npm install -g vercel
vercel
```

### Deploying to Netlify

```sh
npm install -g netlify-cli
netlify deploy
```

---
