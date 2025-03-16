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
